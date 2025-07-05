import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import CheckoutForm from '../components/CheckoutForm';
import { Truck, Clock } from 'lucide-react';

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  
  // Get auth context with session information
  const { 
    user, 
    session, 
    loading: authLoading 
  } = useAuth();
  
  // Get cart context
  const { 
    items: cartItems, 
    clearCart, 
    loading: isCartLoading 
  } = useCart();
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: user?.email || session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  const deliveryFees = {
    standard: 5.00,
    express: 12.00
  };

  // Show spinner while auth, cart, or session is loading
  if (authLoading || isCartLoading) {
    return <Spinner />;
  }

  // Redirect to login if user is not authenticated
  if (!user && !session) {
    navigate('/login');
    return null;
  }

  // Redirect if cart is empty
  if (!cartItems || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  // Calculate prices safely
  const subtotal = cartItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const deliveryFee = deliveryFees[deliveryMethod];
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleSuccess = (orderId: string) => {
    clearCart();
    navigate(`/orders`);
  };

  const handleError = (error: string) => {
    console.error('Checkout error:', error);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = customerInfo.name && 
                     customerInfo.email && 
                     customerInfo.address && 
                     customerInfo.city && 
                     customerInfo.postalCode;

  // Get access token from session
  const authToken = session?.access_token;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Riepilogo Ordine</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product_name}</h3>
                    {item.selected_color && (
                      <p className="text-sm text-gray-600">Colore: {item.selected_color}</p>
                    )}
                    {item.selected_size && (
                      <p className="text-sm text-gray-600">Dimensione: {item.selected_size}</p>
                    )}
                    <p className="text-sm text-gray-600">Quantità: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{(item.unit_price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Method Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Metodo di Consegna</h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={deliveryMethod === 'standard'}
                    onChange={(e) => setDeliveryMethod(e.target.value as 'standard')}
                    className="mr-3"
                  />
                  <Truck className="h-5 w-5 mr-2 text-gray-600" />
                  <div className="flex-1">
                    <div className="font-medium">Consegna Standard</div>
                    <div className="text-sm text-gray-600">5-7 giorni lavorativi</div>
                  </div>
                  <div className="font-medium">€{deliveryFees.standard.toFixed(2)}</div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={deliveryMethod === 'express'}
                    onChange={(e) => setDeliveryMethod(e.target.value as 'express')}
                    className="mr-3"
                  />
                  <Clock className="h-5 w-5 mr-2 text-gray-600" />
                  <div className="flex-1">
                    <div className="font-medium">Consegna Express</div>
                    <div className="text-sm text-gray-600">2-3 giorni lavorativi</div>
                  </div>
                  <div className="font-medium">€{deliveryFees.express.toFixed(2)}</div>
                </label>
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotale:</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Spedizione:</span>
                <span>€{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Totale:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information & Payment */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Informazioni di Consegna</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indirizzo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Città *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CAP *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Pagamento</h2>
              
              {isFormValid ? (
                authToken ? (
                  <CheckoutForm
                    amount={total}
                    productName={cartItems.map(item => item.product_name).join(', ')}
                    productId={cartItems[0]?.product_id || ''}
                    cartItems={cartItems}
                    customerInfo={customerInfo}
                    deliveryMethod={deliveryMethod}
                    deliveryFee={deliveryFee}
                    authToken={authToken}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                ) : (
                  <div className="text-center py-8 text-red-500">
                    <p>Token di autenticazione mancante. Effettua il login per procedere.</p>
                    <button 
                      onClick={() => navigate('/login')}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Accedi
                    </button>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Completa le informazioni di consegna per procedere con il pagamento</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;