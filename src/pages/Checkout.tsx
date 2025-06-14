import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CreditCard, Lock, Package, User, MapPin, CheckCircle } from 'lucide-react';
import CheckoutForm from '../components/CheckoutForm';

const Checkout: React.FC = () => {
  const { user, session } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [formValid, setFormValid] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrello');
    }
  }, [items, navigate]);

  // Validate form
  useEffect(() => {
    const isValid = customerInfo.name.trim() !== '' && customerInfo.email.trim() !== '';
    setFormValid(isValid);
  }, [customerInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentSuccess = async (orderId: string) => {
    try {
      // Clear cart after successful payment
      await clearCart();
      // Navigate to order detail page
      navigate(`/ordini/${orderId}`);
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Still navigate to order page even if cart clear fails
      navigate(`/ordini/${orderId}`);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrello Vuoto</h1>
          <p className="text-gray-600 mb-4">Aggiungi prodotti al carrello per procedere al checkout</p>
          <button
            onClick={() => navigate('/catalogo')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Vai al Catalogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Completa il tuo ordine con pagamento sicuro</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Riepilogo Ordine
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                    <div className="text-sm text-gray-600">
                      <span>Quantità: {item.quantity}</span>
                      {item.selected_color && (
                        <span className="ml-4">Colore: {item.selected_color}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">€{item.unit_price.toFixed(2)}</p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-gray-600">€{(item.unit_price * item.quantity).toFixed(2)} totale</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Totale:</span>
                <span className="text-blue-600">€{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Pagamento Sicuro</span>
              </div>
              <p className="text-sm text-green-700">
                I tuoi dati sono protetti con crittografia SSL a 256 bit
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Pagamento
            </h2>

            {/* Customer Info Form */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informazioni Cliente
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mario Rossi"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="mario@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+39 123 456 7890"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Indirizzo
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Via Roma 123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Città
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Milano"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    CAP
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={customerInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="20121"
                  />
                </div>
              </div>
            </div>

            {/* Payment Form */}
            {formValid ? (
              <CheckoutForm
                amount={totalAmount}
                productName={`Ordine carrello (${items.length} ${items.length === 1 ? 'prodotto' : 'prodotti'})`}
                productId="cart-order"
                cartItems={items}
                customerInfo={customerInfo}
                authToken={session?.access_token}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">
                  Completa le informazioni obbligatorie per procedere al pagamento
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  I campi Nome e Email sono obbligatori
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;