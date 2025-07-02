import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CreditCard, Lock, Package, User, MapPin, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import CheckoutForm from '../components/CheckoutForm';

// Delivery options constants
const EXPRESS_DELIVERY_FREE_THRESHOLD = 100;
const EXPRESS_DELIVERY_COST = 9.90;
const STANDARD_DELIVERY_COST = 4.90;

const Checkout: React.FC = () => {
  const { user, session } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  // Delivery method state
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  
  // Terms acceptance state
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [formValid, setFormValid] = useState(false);

  // Calculate delivery fee based on method and cart total
  const deliveryFee = 
    deliveryMethod === 'express' 
      ? (totalAmount >= EXPRESS_DELIVERY_FREE_THRESHOLD ? 0 : EXPRESS_DELIVERY_COST)
      : STANDARD_DELIVERY_COST;

  // Calculate final total including delivery
  const finalTotal = totalAmount + deliveryFee;

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
                    <div className="flex flex-wrap items-center">
                      <span>Quantità: {item.quantity}</span>
                      {item.selected_color && (
                        <span className="ml-4">Colore: {item.selected_color}</span>
                      )}
                      {item.customer_note && (
                        <div className="ml-4 flex items-center text-blue-600">
                          <span className="cursor-pointer hover:underline" onClick={() => alert(`Nota: ${item.customer_note}`)}>
                            Nota cliente
                          </span>
                        </div>
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
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotale</span>
                  <span className="font-medium text-gray-900">€{totalAmount.toFixed(2)}</span>
                </div>
                
                {/* Delivery Method Selection */}
                <div className="border-t border-gray-200 pt-3 pb-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Metodo di Spedizione
                  </h4>
                  
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="standard"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => setDeliveryMethod('standard')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">Spedizione Standard (5-7 giorni lavorativi)</p>
                        <p className="text-xs text-gray-500">€{STANDARD_DELIVERY_COST.toFixed(2)}</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="express"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">Spedizione Express (3-5 giorni)</p>
                        <p className="text-xs text-gray-500">
                          {totalAmount >= EXPRESS_DELIVERY_FREE_THRESHOLD 
                            ? 'Gratuita' 
                            : `€${EXPRESS_DELIVERY_COST.toFixed(2)}`}
                          {totalAmount < EXPRESS_DELIVERY_FREE_THRESHOLD && 
                            ` (gratuita per ordini sopra €${EXPRESS_DELIVERY_FREE_THRESHOLD})`}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {deliveryMethod === 'express' ? 'Express Delivery (3-5 giorni)' : 'Standard Delivery (5-7 giorni)'}
                  </span>
                  <span className="font-medium text-gray-900">
                    {deliveryFee === 0 
                      ? 'Gratuita' 
                      : `€${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Totale</span>
                    <span className="text-lg font-semibold text-blue-600">€{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
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

            {/* Terms and Conditions Checkbox */}
            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    Ho letto e accetto i <Link to="/terms-and-conditions" className="text-blue-600 hover:text-blue-800 underline" target="_blank">Termini e Condizioni</Link> e la <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline" target="_blank">Privacy Policy</Link>
                  </label>
                </div>
              </div>
              {!termsAccepted && formValid && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  È necessario accettare i termini e condizioni per procedere
                </p>
              )}
            </div>

            {/* Payment Form */}
            {formValid ? (
              <>
                {termsAccepted ? (
                  <CheckoutForm
                    amount={finalTotal}
                    productName={`Ordine carrello (${items.length} ${items.length === 1 ? 'prodotto' : 'prodotti'})`}
                    productId="cart-order"
                    cartItems={items}
                    customerInfo={customerInfo}
                    deliveryMethod={deliveryMethod}
                    deliveryFee={deliveryFee}
                    authToken={session?.access_token}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-medium flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Accetta i termini e condizioni per procedere al pagamento
                    </p>
                  </div>
                )}
              </>
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
            
            {/* Security Notice */}
            <div className="mt-6 flex items-center text-sm text-gray-500">
              <Lock className="h-4 w-4 mr-2 text-gray-400" />
              <p>I tuoi dati di pagamento sono protetti e crittografati</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
