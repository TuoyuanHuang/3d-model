import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  selected_color?: string;
  selected_size?: string;
  size_dimensions?: string;
  customer_note?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface CheckoutFormProps {
  amount: number;
  productName: string;
  productId: string;
  cartItems: CartItem[];
  customerInfo: CustomerInfo;
  deliveryMethod: 'standard' | 'express';
  deliveryFee: number;
  authToken: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  productName,
  productId,
  cartItems,
  customerInfo,
  deliveryMethod,
  deliveryFee,
  authToken,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      // Validate amount is integer
      if (!Number.isInteger(amount)) {
        onError('Formato importo non valido');
        return;
      }

      // Additional validation for minimum amount
      if (amount < 50) { // 50 cents = €0.50
        onError('L\'importo minimo per un pagamento è €0.50');
        return;
      }

      setIsLoading(true);
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          amount,
          currency: 'eur',
          productName,
          productId,
          cartItems,
          customerInfo,
          deliveryMethod,
          deliveryFee
        })
      });

      // Handle HTTP errors
      if (!response.ok) {
        let errorMessage = 'Errore nel server';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || 'Impossibile creare il pagamento';
        } catch (e) {
          errorMessage = `Errore ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const { clientSecret, paymentIntentId, orderId } = await response.json();
      
      // Validate response data
      if (!clientSecret || !paymentIntentId || !orderId) {
        throw new Error('Dati di risposta incompleti dal server');
      }

      setClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId);
      setOrderId(orderId);
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      onError(error.message || 'Impossibile inizializzare il pagamento');
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (orderId) {
      onSuccess(orderId);
    } else {
      onError('ID ordine mancante dopo il pagamento');
    }
  };

  return (
    <div className="payment-container">
      {!clientSecret ? (
        <div className="text-center">
          {isLoading ? (
            <div className="py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Inizializzazione del pagamento...</p>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
            >
              Procedi al Pagamento - €{(amount / 100).toFixed(2)}
            </button>
          )}
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ 
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#2563eb',
              colorBackground: '#f9fafb',
              colorText: '#374151',
              fontFamily: 'Inter, system-ui, sans-serif'
            }
          } 
        }}>
          <PaymentForm 
            paymentIntentId={paymentIntentId!}
            orderId={orderId!}
            onSuccess={handlePaymentSuccess}
            onError={onError}
          />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutForm;