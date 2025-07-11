import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, Smartphone, Loader2 } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  };
  authToken?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

const PaymentForm: React.FC<CheckoutFormProps> = ({ 
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
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState<string>('');
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentMethodAvailable, setPaymentMethodAvailable] = useState<'card' | 'paymentRequest'>('card');
  
  // Track if payment intent has been created
  const paymentIntentCreated = useRef(false);
  
  // Track if payment request is being processed
  const isProcessingPaymentRequest = useRef(false);

  // Initialize Payment Request (for Google Pay / Apple Pay)
  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'IT',
      currency: 'eur',
      total: {
        label: productName,
        amount: Math.round(amount * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr);
        setCanMakePayment(true);
        setPaymentMethodAvailable('paymentRequest');
      }
    });

    pr.on('paymentmethod', async (ev) => {
      try {
        setIsLoading(true);
        setPaymentStatus('processing');
        setErrorMessage('');
        isProcessingPaymentRequest.current = true;

        // Create payment intent if not already created
        let secret = clientSecret;
        if (!secret) {
          const response = await createPaymentIntent();
          secret = response.clientSecret;
          setClientSecret(secret);
        }

        // Validate client secret format
        if (!secret || !secret.includes('_secret_')) {
          throw new Error('Invalid client secret format');
        }

        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          secret,
          {
            payment_method: ev.paymentMethod.id,
            receipt_email: ev.payerEmail || customerInfo.email,
            shipping: customerInfo.address ? {
              name: customerInfo.name,
              address: {
                line1: customerInfo.address,
                city: customerInfo.city,
                postal_code: customerInfo.postalCode,
                country: 'IT',
              },
              phone: customerInfo.phone,
            } : undefined,
          },
          { handleActions: false }
        );

        if (confirmError) {
          ev.complete('fail');
          throw new Error(confirmError.message || 'Payment failed');
        }

        if (paymentIntent?.status === 'succeeded') {
          ev.complete('success');
          handlePaymentSuccess(paymentIntent.id);
        } else {
          ev.complete('fail');
          throw new Error('Payment not completed');
        }
      } catch (error) {
        ev.complete('fail');
        handlePaymentError(error);
      } finally {
        setIsLoading(false);
        isProcessingPaymentRequest.current = false;
      }
    });
  }, [stripe, amount, productName]);

  const createPaymentIntent = async () => {
    validateCustomerInfo();

    setIsCreatingIntent(true);
    try {
      const requestData = {
        amount: Math.round(amount * 100),
        currency: 'eur',
        productName,
        productId,
        selectedColor,
        selectedSize,
        sizeDimensions,
        customerNote,
        quantity,
        deliveryMethod,
        deliveryFee,
        cartItems,
        customerInfo,
      };

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(parseErrorResponse(errorText));
      }

      const result = await response.json();
      setClientSecret(result.clientSecret);
      paymentIntentCreated.current = true;
      return result;
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const validateCustomerInfo = () => {
    if (!customerInfo.name || !customerInfo.email) {
      throw new Error('Name and email are required');
    }

    if (!authToken) {
      throw new Error('Authentication token missing. Please login to proceed.');
    }

    if (!import.meta.env.VITE_SUPABASE_URL) {
      throw new Error('Missing Supabase configuration. Please check your environment variables.');
    }
  };

  const parseErrorResponse = (errorText: string) => {
    try {
      const errorData = JSON.parse(errorText);
      return errorData.error || 'Error creating payment';
    } catch {
      return 'Error creating payment';
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentStatus('success');
    setOrderId(paymentId);
    onSuccess?.(paymentId);
  };

  const handlePaymentError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Payment failed';
    setErrorMessage(message);
    setPaymentStatus('error');
    onError?.(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || isLoading || isCreatingIntent) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Card element not found');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Create payment intent if not already created
      let secret = clientSecret;
      if (!secret && !paymentIntentCreated.current) {
        const response = await createPaymentIntent();
        secret = response.clientSecret;
        setClientSecret(secret);
      }

      // Validate client secret format
      if (!secret || !secret.includes('_secret_')) {
        throw new Error('Invalid client secret format');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address && customerInfo.city && customerInfo.postalCode ? {
              line1: customerInfo.address,
              city: customerInfo.city,
              postal_code: customerInfo.postalCode,
              country: 'IT',
            } : undefined,
          },
        },
        receipt_email: customerInfo.email,
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment error');
      }

      if (paymentIntent?.status === 'succeeded') {
        handlePaymentSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (error) {
      handlePaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Payment Completed!
        </h3>
        <p className="text-green-700 mb-4">
          Your order "{productName}" has been processed successfully.
        </p>
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-1">Order Number:</p>
          <p className="font-mono text-lg font-semibold text-gray-900">#{orderId.slice(0, 8)}</p>
        </div>
        <p className="text-sm text-green-600">
          You'll receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Lock className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">Secure Payment</span>
        </div>
        <p className="text-sm text-blue-700">
          Your data is protected with 256-bit SSL encryption
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Payment Method</h3>
        
        {canMakePayment && paymentRequest && paymentMethodAvailable === 'paymentRequest' && (
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Quick Payment</span>
            </div>
            <PaymentRequestButtonElement 
              options={{ 
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    type: 'buy',
                    theme: 'dark',
                    height: '48px',
                  },
                },
              }} 
            />
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <button
                type="button"
                onClick={() => setPaymentMethodAvailable('card')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Use credit/debit card instead
              </button>
            </div>
          </div>
        )}

        {(paymentMethodAvailable === 'card' || !canMakePayment) && (
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Credit/Debit Card</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1f2937',
                      backgroundColor: '#ffffff',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      '::placeholder': {
                        color: '#9ca3af',
                      },
                    },
                    invalid: {
                      color: '#ef4444',
                      iconColor: '#ef4444',
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
            {canMakePayment && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <button
                  type="button"
                  onClick={() => setPaymentMethodAvailable('paymentRequest')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Use Apple Pay/Google Pay instead
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Payment Error</h4>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading || isCreatingIntent || paymentStatus === 'processing'}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {(isLoading || isCreatingIntent) ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Lock className="h-5 w-5" />
            <span>Pay €{amount.toFixed(2)}</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By clicking "Pay" you agree to our terms of service and privacy policy
      </p>
    </form>
  );
};

const CheckoutForm: React.FC<CheckoutFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default CheckoutForm;