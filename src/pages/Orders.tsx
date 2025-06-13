import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  currency: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  order_items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    selected_color?: string;
  }>;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Simulate loading orders - in a real app, this would fetch from Supabase
    const loadOrders = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock orders data
        const mockOrders: Order[] = [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            customer_name: 'Mario Rossi',
            customer_email: 'mario@email.com',
            total_amount: 15.99,
            currency: 'eur',
            payment_status: 'succeeded',
            order_status: 'completed',
            created_at: '2024-01-15T10:30:00Z',
            order_items: [
              {
                product_name: 'Drago Fantasy Dettagliato',
                quantity: 1,
                unit_price: 15.99,
                selected_color: 'Grigio'
              }
            ]
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            customer_name: 'Mario Rossi',
            customer_email: 'mario@email.com',
            total_amount: 8.50,
            currency: 'eur',
            payment_status: 'succeeded',
            order_status: 'printing',
            created_at: '2024-01-20T14:15:00Z',
            order_items: [
              {
                product_name: 'Supporto Smartphone Regolabile',
                quantity: 1,
                unit_price: 8.50,
                selected_color: 'Nero'
              }
            ]
          }
        ];
        
        setOrders(mockOrders);
      } catch (err) {
        setError('Errore nel caricamento degli ordini');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
      case 'printing':
      case 'confirmed':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'canceled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'printing':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <p className="text-gray-600">Caricamento ordini...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Errore</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Riprova
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">I Miei Ordini</h1>
          <p className="text-gray-600">Visualizza lo stato dei tuoi ordini e la cronologia degli acquisti</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nessun ordine trovato</h2>
            <p className="text-gray-600 mb-6">Non hai ancora effettuato nessun ordine</p>
            <Link
              to="/catalogo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Esplora il Catalogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Ordine #{order.id.slice(0, 8)}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="h-4 w-4" />
                          <span>€{order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                        {getStatusIcon(order.order_status)}
                        <span>{getStatusText(order.order_status)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Prodotti</h4>
                    <div className="space-y-3">
                      {order.order_items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{item.product_name}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Quantità: {item.quantity}</span>
                              {item.selected_color && (
                                <span>Colore: {item.selected_color}</span>
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
                  </div>

                  {/* Order Actions */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                      <div className="text-sm text-gray-600">
                        {order.order_status === 'processing' && 'Il tuo ordine è in elaborazione'}
                        {order.order_status === 'printing' && 'Il tuo ordine è in stampa'}
                        {order.order_status === 'completed' && 'Il tuo ordine è stato completato'}
                        {order.order_status === 'shipped' && 'Il tuo ordine è stato spedito'}
                        {order.order_status === 'delivered' && 'Il tuo ordine è stato consegnato'}
                      </div>
                      <div className="flex space-x-3">
                        <Link
                          to={`/ordini/${order.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Visualizza Dettagli
                        </Link>
                        {order.order_status === 'completed' && (
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Riordina
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;