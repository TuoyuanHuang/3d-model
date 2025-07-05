import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  selected_color?: string;
  selected_size?: string;
  size_dimensions?: string;
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
  cartItems?: CartItem[];
  selectedColor?: string;
  selectedSize?: string;
  sizeDimensions?: string;
  customerNote?: string;
  quantity?: number;
  deliveryMethod?: 'standard' | 'express';
  deliveryFee?: number;
  customerInfo: CustomerInfo;
  authToken?: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  amount, 
  productName, 
  productId,
  cartItems,
  selectedColor,
  selectedSize,
  sizeDimensions,
  customerNote,
  quantity = 1,
  deliveryMethod = 'standard',
  deliveryFee = 0,
  customerInfo,
  authToken,
  onSuccess, 
  onError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Create a payment intent by calling our edge function
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'eur',
          productName,
          productId,
          cartItems,
          customerInfo,
          deliveryMethod,
          deliveryFee,
          customerNote
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId, orderId } = await response.json();

      // 2. Validate client secret format
      if (!clientSecret || !clientSecret.includes('_secret_')) {
        throw new Error('Invalid client secret format');
      }

      // 3. Confirm the payment with Stripe
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setIsSuccess(true);
        setOrderId(orderId);
        onSuccess(orderId);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred during payment');
      onError(error.message || 'An error occurred during payment');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">Pagamento Riuscito!</h3>
        <p className="text-green-700">
          Il tuo ordine è stato confermato. Riceverai una email di conferma a breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-4">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
          !stripe || isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Elaborazione pagamento...
          </div>
        ) : (
          `Paga €${amount.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;