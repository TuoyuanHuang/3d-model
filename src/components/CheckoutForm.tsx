import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';

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
  quantity?: number;
  deliveryMethod?: 'standard' | 'express';
  deliveryFee?: number;
  termsAccepted?: boolean;
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
  quantity = 1,
  deliveryMethod = 'standard',
  deliveryFee = 0,
  termsAccepted = false,
  customerInfo,
  authToken,
  onSuccess, 
  onError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState<string>('');
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  // Initialize Payment Request (for Google Pay / Apple Pay)
  React.useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'IT',
        currency: 'eur',
        total: {
          label: productName,
          amount: Math.round(amount * 100), // Convert to cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
      });

      // Check if Payment Request is available
      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
          setCanMakePayment(true);
        }
      });

      // Handle Payment Request events
      pr.on('paymentmethod', async (ev) => {
        try {
          setIsLoading(true);
          setPaymentStatus('processing');
          setErrorMessage('');

          // Create payment intent
          const response = await createPaymentIntent();
          if (!response.clientSecret) {
            throw new Error('Failed to create payment intent');
          }

          // Confirm payment with Payment Request
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
            response.clientSecret,
            {
              payment_method: ev.paymentMethod.id
            },
            { handleActions: false }
          );

          if (confirmError) {
            ev.complete('fail');
            throw new Error(confirmError.message || 'Payment failed');
          }

          if (paymentIntent?.status === 'succeeded') {
            ev.complete('success');
            setPaymentStatus('success');
            setOrderId(response.orderId);
            onSuccess?.(response.orderId);
          } else {
            ev.complete('fail');
            throw new Error('Payment not completed');
          }
        } catch (error) {
          ev.complete('fail');
          const message = error instanceof Error ? error.message : 'Payment failed';
          setErrorMessage(message);
          setPaymentStatus('error');
          onError?.(message);
        } finally {
          setIsLoading(false);
        }
      });
    }
  }, [stripe, amount, productName]);

  const createPaymentIntent = async () => {
    // Validate required customer info
    if (!customerInfo.name || !customerInfo.email) {
      throw new Error('Nome e email sono obbligatori');
    }

    if (!authToken) {
      throw new Error('Token di autenticazione mancante. Effettua il login per continuare.');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    if (!supabaseUrl) {
      throw new Error('Configurazione Supabase mancante. Assicurati di aver configurato le variabili d\'ambiente.');
    }

    // Prepare request data
    const requestData = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'eur',
      productName,
      productId,
      selectedColor,
      selectedSize,
      sizeDimensions,
      quantity,
      deliveryMethod,
      deliveryFee,
      cartItems,
      customerInfo,
    };

    console.log('Creating payment intent with data:', requestData);

    // Create payment intent
    const response = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Payment intent creation failed:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Errore nella creazione del pagamento' };
      }
      throw new Error(errorData.error || 'Errore nella creazione del pagamento');
    }

    const result = await response.json();
    console.log('Payment intent created successfully:', result);
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setErrorMessage('Devi accettare i termini e le condizioni per procedere');
      return;
    }
    
    if (!stripe || !elements) {
      setErrorMessage('Stripe non è ancora caricato. Riprova tra qualche secondo.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Elemento carta non trovato');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const response = await createPaymentIntent();
      setOrderId(response.orderId);

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(response.clientSecret, {
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
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Errore durante il pagamento');
      }

      if (paymentIntent?.status === 'succeeded') {
        setPaymentStatus('success');
        onSuccess?.(response.orderId);
      } else {
        throw new Error('Pagamento non completato');
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore durante il pagamento';
      console.error('Payment error:', error);
      setErrorMessage(message);
      setPaymentStatus('error');
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Pagamento Completato!
        </h3>
        <p className="text-green-700 mb-4">
          Il tuo ordine "{productName}" è stato processato con successo.
        </p>
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-1">Numero Ordine:</p>
          <p className="font-mono text-lg font-semibold text-gray-900">#{orderId.slice(0, 8)}</p>
        </div>
        <p className="text-sm text-green-600">
          Riceverai una conferma via email a breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Lock className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">Pagamento Sicuro</span>
        </div>
        <p className="text-sm text-blue-700">
          I tuoi dati sono protetti con crittografia SSL a 256 bit
        </p>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Metodo di Pagamento</h3>
        
        {/* Google Pay / Apple Pay */}
        {canMakePayment && paymentRequest && (
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Pagamento Rapido</span>
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
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">oppure</span>
            </div>
          </div>
        )}

        {/* Traditional Card Payment */}
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Carta di Credito/Debito</span>
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
                    fontSmoothing: 'antialiased',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                    ':-webkit-autofill': {
                      color: '#1f2937',
                    },
                  },
                  invalid: {
                    color: '#ef4444',
                    iconColor: '#ef4444',
                  },
                  complete: {
                    color: '#059669',
                    iconColor: '#059669',
                  },
                },
                hidePostalCode: true,
                iconStyle: 'solid',
              }}
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Errore nel Pagamento</h4>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading || paymentStatus === 'processing'}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Elaborazione...</span>
          </>
        ) : (
          <>
            <Lock className="h-5 w-5" />
            <span>Paga €{amount.toFixed(2)}</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Cliccando "Paga" accetti i nostri termini di servizio e la privacy policy
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