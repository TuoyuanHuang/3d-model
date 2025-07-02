import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CreditCard, Lock, Package, User, MapPin, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import CheckoutForm from '../components/CheckoutForm';

// Constants
const DELIVERY_OPTIONS = {
  standard: {
    name: 'Standard Delivery',
    description: '5-7 business days',
    price: 4.90
  },
  express: {
    name: 'Express Delivery',
    description: '3-5 business days',
    price: 9.90,
    freeThreshold: 100
  }
};

const Checkout: React.FC = () => {
  const { user, session } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Calculate delivery fee
  const calculateDeliveryFee = () => {
    if (deliveryMethod === 'express' && totalAmount >= DELIVERY_OPTIONS.express.freeThreshold!) {
      return 0;
    }
    return DELIVERY_OPTIONS[deliveryMethod].price;
  };

  const deliveryFee = calculateDeliveryFee();
  const finalTotal = totalAmount + deliveryFee;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Validate form
  useEffect(() => {
    const isValid = Object.entries(customerInfo).every(
      ([key, value]) => (key === 'name' || key === 'email') ? value.trim() !== '' : true
    );
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
      await clearCart();
      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error('Error clearing cart:', error);
      navigate(`/orders/${orderId}`);
    }
  };

  const renderEmptyCart = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-4">Add products to your cart to proceed to checkout</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Browse Products
        </button>
      </div>
    </div>
  );

  const renderOrderSummaryItem = (item: typeof items[0]) => (
    <div key={item.id} className="flex justify-between items-center py-2">
      <div>
        <h3 className="font-medium text-gray-900">{item.product_name}</h3>
        <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
          <span>Qty: {item.quantity}</span>
          {item.selected_color && (
            <span className="ml-3">Color: {item.selected_color}</span>
          )}
          {item.customer_note && (
            <button 
              onClick={() => alert(`Note: ${item.customer_note}`)}
              className="ml-3 text-blue-600 hover:underline"
            >
              View Note
            </button>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">${item.unit_price.toFixed(2)}</p>
        {item.quantity > 1 && (
          <p className="text-xs text-gray-600">${(item.unit_price * item.quantity).toFixed(2)} total</p>
        )}
      </div>
    </div>
  );

  const renderDeliveryOption = (method: 'standard' | 'express') => {
    const option = DELIVERY_OPTIONS[method];
    const isFree = method === 'express' && totalAmount >= option.freeThreshold!;
    
    return (
      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-2 last:mb-0">
        <input
          type="radio"
          name="deliveryMethod"
          value={method}
          checked={deliveryMethod === method}
          onChange={() => setDeliveryMethod(method)}
          className="h-4 w-4 text-blue-600"
        />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{option.name}</p>
          <p className="text-xs text-gray-500">
            {option.description}
            {isFree ? ' • Free' : ` • $${option.price.toFixed(2)}`}
          </p>
          {method === 'express' && totalAmount < option.freeThreshold! && (
            <p className="text-xs text-gray-400 mt-1">
              Free for orders over ${option.freeThreshold}
            </p>
          )}
        </div>
      </label>
    );
  };

  const renderCustomerInfoField = (
    id: string,
    label: string,
    type: string = 'text',
    required: boolean = false,
    placeholder: string = ''
  ) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        value={customerInfo[id as keyof typeof customerInfo]}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  );

  const renderPaymentSection = () => {
    if (!formValid) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">
            Please complete all required fields to proceed with payment
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            Name and Email fields are required
          </p>
        </div>
      );
    }

    if (!termsAccepted) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Please accept the terms and conditions to proceed with payment
          </p>
        </div>
      );
    }

    return (
      <CheckoutForm
        amount={finalTotal}
        productName={`Cart Order (${items.length} ${items.length === 1 ? 'item' : 'items'})`}
        productId="cart-order"
        cartItems={items}
        customerInfo={customerInfo}
        deliveryMethod={deliveryMethod}
        deliveryFee={deliveryFee}
        authToken={session?.access_token}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    );
  };

  if (items.length === 0) {
    return renderEmptyCart();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Summary
            </h2>

            <div className="space-y-2 mb-6">
              {items.map(renderOrderSummaryItem)}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${totalAmount.toFixed(2)}</span>
              </div>

              {/* Delivery Options */}
              <div className="pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Shipping Method
                </h4>
                {renderDeliveryOption('standard')}
                {renderDeliveryOption('express')}
              </div>

              <div className="flex justify-between text-sm pt-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">
                  {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-blue-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Details
            </h2>

            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCustomerInfoField('name', 'Full Name', 'text', true, 'John Smith')}
                {renderCustomerInfoField('email', 'Email', 'email', true, 'john@example.com')}
                {renderCustomerInfoField('phone', 'Phone', 'tel', false, '+1 123 456 7890')}
                {renderCustomerInfoField('address', 'Address', 'text', false, '123 Main St')}
                {renderCustomerInfoField('city', 'City', 'text', false, 'New York')}
                {renderCustomerInfoField('postalCode', 'Postal Code', 'text', false, '10001')}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  required
                />
                <label htmlFor="terms" className="ml-3 text-sm">
                  <p className="font-medium text-gray-700">
                    I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link>
                  </p>
                </label>
              </div>
              {!termsAccepted && formValid && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  You must accept the terms and conditions to proceed
                </p>
              )}
            </div>

            {/* Payment Section */}
            {renderPaymentSection()}
            
            {/* Security Notice */}
            <div className="mt-6 flex items-center text-sm text-gray-500">
              <Lock className="h-4 w-4 mr-2 text-gray-400" />
              <p>Your payment information is processed securely</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
