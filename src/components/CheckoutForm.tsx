import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

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

const EmbeddedPaymentForm: React.FC<{
  paymentIntentId: string;
  orderId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}> = ({ paymentIntentId, orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${orderId}`,
        },
        redirect: 'if_required'
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "An error occurred during payment");
        } else {
          setMessage("Unexpected error during payment");
        }
        onError(error.message || "Payment failed");
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      setMessage("Error processing payment");
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement options={{
        layout: {
          type: 'accordion',
          defaultCollapsed: false,
        }
      }} />
      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit"
        className="mt-6 w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </button>
      {message && (
        <div className="mt-4 text-red-500 text-center">{message}</div>
      )}
    </form>
  );
};

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
      if (!Number.isInteger(amount)) {
        onError('Invalid amount format');
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId, orderId } = await response.json();
      setClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId);
      setOrderId(orderId);
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      onError(error.message || 'Failed to initialize payment');
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (orderId) {
      onSuccess(orderId);
    } else {
      onError('Order ID missing after payment success');
    }
  };

  return (
    <div className="payment-container">
      {!clientSecret ? (
        <div className="text-center">
          {isLoading ? (
            <div className="py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Initializing payment...</p>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedPaymentForm 
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
