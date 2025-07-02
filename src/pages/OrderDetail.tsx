import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Package, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

interface OrderDetail {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  total_amount: number;
  currency: string;
  payment_status: string;
  order_status: string;
  payment_intent_id: string;
  created_at: string;
  updated_at: string;
  order_items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    selected_color?: string;
    selected_size?: string;
    size_dimensions?: string;
    customer_note?: string;
  }>;
}

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { supabase } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
          *,
          order_items (
            product_name,
            quantity,
            unit_price,
            selected_color,
            selected_size,
            size_dimensions,
            customer_note
          )
        `)
          .eq('id', orderId)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          setError('Ordine non trovato');
          return;
        }
        
        setOrder(data);
      } catch (err) {
        console.error('Error loading order:', err);
        setError('Errore nel caricamento dell\'ordine');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, supabase]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'processing':
      case 'printing':
      case 'confirmed':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-purple-500" />;
      case 'canceled':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
      case 'printing':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'In Elaborazione';
      case 'confirmed':
        return 'Confermato';
      case 'printing':
        return 'In Stampa';
      case 'completed':
        return 'Completato';
      case 'shipped':
        return 'Spedito';
      case 'delivered':
        return 'Consegnato';
      case 'canceled':
        return 'Annullato';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento ordine...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Ordine non trovato</h1>
          <p className="text-gray-600 mb-4">{error || 'L\'ordine richiesto non esiste'}</p>
          <Link
            to="/ordini"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Torna agli Ordini
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/ordini"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Torna agli ordini</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ordine #{order.id.slice(0, 8)}</h1>
              <p className="text-gray-600 mt-1">Creato il {formatDate(order.created_at)}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(order.order_status)}`}>
                {getStatusIcon(order.order_status)}
                <span className="font-medium">{getStatusText(order.order_status)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Prodotti Ordinati
              </h2>
              <div className="space-y-4">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Quantità: {item.quantity}</span>
                        {item.selected_color && <span>Colore: {item.selected_color}</span>}
                        {item.selected_size && <span>Dimensione: {item.selected_size}</span>}
                        {item.customer_note && (
                          <div className="flex items-center text-blue-600">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{item.customer_note}</span>
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
              
              <div className="border-t border-gray-200 mt-6 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Totale Ordine:</span>
                  <span className="text-blue-600">€{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stato dell'Ordine</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Ordine Ricevuto</p>
                    <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                
                {order.order_status !== 'processing' && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">Pagamento Confermato</p>
                      <p className="text-sm text-gray-600">Pagamento elaborato con successo</p>
                    </div>
                  </div>
                )}
                
                {['printing', 'completed', 'shipped', 'delivered'].includes(order.order_status) && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">In Produzione</p>
                      <p className="text-sm text-gray-600">Il tuo prodotto è in stampa</p>
                    </div>
                  </div>
                )}
                
                {['completed', 'shipped', 'delivered'].includes(order.order_status) && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">Produzione Completata</p>
                      <p className="text-sm text-gray-600">Il tuo prodotto è pronto</p>
                    </div>
                  </div>
                )}
                
                {order.order_status === 'printing' && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">In Stampa</p>
                      <p className="text-sm text-gray-600">Il tuo prodotto è attualmente in stampa</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Cliente</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.customer_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Indirizzo di Spedizione</h3>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div className="text-sm text-gray-600">
                    <p>{order.customer_name}</p>
                    <p>{order.shipping_address.address}</p>
                    <p>{order.shipping_address.postalCode} {order.shipping_address.city}</p>
                    <p>Italia</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Pagamento</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Metodo:</span>
                  <span className="text-sm font-medium text-gray-900">Carta di Credito</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stato:</span>
                  <span className="text-sm font-medium text-green-600">Pagato</span>
                </div>
                {order.payment_intent_id && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ID Transazione:</span>
                    <span className="text-sm font-mono text-gray-900">{order.payment_intent_id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Hai bisogno di aiuto?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Contattaci per qualsiasi domanda sul tuo ordine
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:info@3dsumisura.it"
                  className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  info@3dsumisura.it
                </a>
                <a
                  href="tel:+391234567890"
                  className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  +39 123 456 7890
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;