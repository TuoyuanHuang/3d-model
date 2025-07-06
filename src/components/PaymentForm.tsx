import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  paymentIntentId: string;
  orderId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  paymentIntentId, 
  orderId,
  onSuccess, 
  onError 
}) => {
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
          setMessage(error.message || "Si è verificato un errore durante il pagamento");
        } else {
          setMessage("Errore imprevisto durante il pagamento");
        }
        onError(error.message || "Payment failed");
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      setMessage("Errore durante l'elaborazione del pagamento");
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />
      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit"
        className="mt-6 w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isProcessing ? "Elaborazione..." : "Paga ora"}
      </button>
      {message && (
        <div className="mt-4 text-red-500 text-center">{message}</div>
      )}
    </form>
  );
};

export default PaymentForm;