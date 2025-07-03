import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createClient } from '@supabase/supabase-js';

const CheckoutForm = ({
  amount,
  cartItems,
  customerInfo,
  deliveryMethod,
  deliveryFee,
  authToken,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentCreated, setPaymentIntentCreated] = useState(false);

  const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
  );

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100),
            currency: 'eur',
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setPaymentIntentCreated(true);
      } catch (err) {
        setPaymentError('Failed to initialize payment gateway');
        onError('Failed to initialize payment gateway');
      }
    };

    if (!paymentIntentCreated) {
      createPaymentIntent();
    }
  }, [amount, authToken, onError, paymentIntentCreated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    setPaymentError('');

    if (!stripe || !elements) {
      setPaymentProcessing(false);
      return;
    }

    // Confirm the payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            line1: customerInfo.address,
            city: customerInfo.city,
            postal_code: customerInfo.postalCode,
            country: 'IT',
          },
        },
      },
    });

    if (result.error) {
      // Handle payment failure
      setPaymentError(result.error.message || 'Payment failed');
      onError(result.error.message || 'Payment failed');
      setPaymentProcessing(false);
    } else {
      // Payment succeeded
      if (result.paymentIntent.status === 'succeeded') {
        // Create order in database
        const orderData = {
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          shipping_address: {
            address: customerInfo.address,
            city: customerInfo.city,
            postalCode: customerInfo.postalCode,
            country: 'Italy',
          },
          total_amount: amount,
          currency: 'EUR',
          payment_status: 'paid',
          order_status: 'processing',
          payment_method: 'card',
          delivery_method: deliveryMethod,
          delivery_fee: deliveryFee,
          order_items: cartItems.map(item => ({
            product_id: item.id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            selected_color: item.selected_color,
            selected_size: item.selected_size,
            customer_note: item.customer_note,
          })),
        };

        try {
          const { data, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select();

          if (error) throw error;

          onSuccess(data[0].id);
        } catch (err) {
          console.error('Order creation failed:', err);
          onError('Order creation failed after successful payment');
        }
      }
      setPaymentProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-3">
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

      {paymentError && (
        <div className="text-red-600 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {paymentError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !paymentIntentCreated || paymentProcessing}
        className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
          (!stripe || !paymentIntentCreated || paymentProcessing) && 'opacity-50 cursor-not-allowed'
        }`}
      >
        {paymentProcessing
          ? 'Processing...'
          : `Paga €${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;