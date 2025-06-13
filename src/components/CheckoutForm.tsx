import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  selected_color?: string;
}

interface CheckoutFormProps {
  amount: number;
  productName: string;
  productId: string;
  cartItems?: CartItem[];
  selectedColor?: string;
  quantity?: number;
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

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  amount, 
  productName, 
  productId,
  cartItems,
  selectedColor,
  quantity = 1,
  customerInfo,
  authToken,
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
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
        quantity,
        cartItems,
        customerInfo,
      };

      const response = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Errore nella creazione del pagamento');
      }

      const { clientSecret, orderId: newOrderId } = await response.json();
      setOrderId(newOrderId);

      // For demo purposes, we'll simulate a successful payment
      // In a real implementation, you would use Stripe Elements for card input
      setTimeout(() => {
        setPaymentStatus('success');
        onSuccess?.(newOrderId);
      }, 2000);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore durante il pagamento';
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
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Carta di Credito/Debito</span>
          </div>
          <p className="text-sm text-gray-600">
            Accettiamo Visa, Mastercard, American Express
          </p>
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Questo è un pagamento simulato per scopi dimostrativi
            </p>
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
        disabled={isLoading || paymentStatus === 'processing'}
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

export default CheckoutForm;