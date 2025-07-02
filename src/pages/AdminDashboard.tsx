import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  Users, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  LogOut,
  RefreshCw,
  Edit,
  Save,
  X,
  Home,
  ChevronDown,
  ChevronUp,
  MapPin,
  Truck,
  MessageSquare
} from 'lucide-react';

interface Order {
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

const AdminDashboard: React.FC = () => {
  const { signOut, user, supabase } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [error, setError] = useState('');
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const orderStatuses = [
    { value: 'processing', label: 'In Elaborazione', color: 'bg-blue-100 text-blue-800' },
    { value: 'confirmed', label: 'Confermato', color: 'bg-blue-100 text-blue-800' },
    { value: 'printing', label: 'In Stampa', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completato', color: 'bg-green-100 text-green-800' },
    { value: 'shipped', label: 'Spedito', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Consegnato', color: 'bg-green-100 text-green-800' },
    { value: 'canceled', label: 'Annullato', color: 'bg-red-100 text-red-800' }
  ];

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_name,
            quantity,
            unit_price,
            selected_color
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError('Errore nel caricamento degli ordini');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('orders')
        .update({ 
          order_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, order_status: status, updated_at: new Date().toISOString() }
          : order
      ));

      setEditingOrder(null);
      setNewStatus('');
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Errore nell\'aggiornamento dello stato dell\'ordine');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig?.label || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => ['processing', 'printing'].includes(order.order_status)).length;
  const completedOrders = orders.filter(order => order.order_status === 'completed').length;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const startEditing = (orderId: string, currentStatus: string) => {
    setEditingOrder(orderId);
    setNewStatus(currentStatus);
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setNewStatus('');
  };

  const saveStatus = (orderId: string) => {
    if (newStatus && newStatus !== orders.find(o => o.id === orderId)?.order_status) {
      updateOrderStatus(orderId, newStatus);
    } else {
      cancelEditing();
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
              <span className="text-sm text-gray-600">
                Benvenuto, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Esci</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ordini Totali</p>
                <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ricavi Totali</p>
                <p className="text-3xl font-bold text-gray-900">€{totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Lavorazione</p>
                <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completati</p>
                <p className="text-3xl font-bold text-gray-900">{completedOrders}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">Gestione Ordini</h2>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cerca ordini..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tutti gli stati</option>
                  {orderStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                {/* Refresh Button */}
                <button
                  onClick={loadOrders}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Aggiorna</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Caricamento ordini...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Ordine #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        €{order.total_amount.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Status */}
                      {editingOrder === order.id ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={updating}
                          >
                            {orderStatuses.map(status => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => saveStatus(order.id)}
                            disabled={updating}
                            className="text-green-600 hover:text-green-700 disabled:text-green-400"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={updating}
                            className="text-gray-600 hover:text-gray-700 disabled:text-gray-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                            {getStatusText(order.order_status)}
                          </span>
                          <button
                            onClick={() => startEditing(order.id, order.order_status)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Toggle Details */}
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.customer_email}</p>
                      {order.customer_phone && (
                        <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Indirizzo di Spedizione
                      </h4>
                      {order.shipping_address ? (
                        <div className="text-sm text-gray-600">
                          <p>{order.customer_name}</p>
                          <p>{order.shipping_address.address}</p>
                          <p>{order.shipping_address.postalCode} {order.shipping_address.city}</p>
                          <p>{order.shipping_address.country}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Nessun indirizzo fornito</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Prodotti</h4>
                      <div className="text-sm text-gray-600">
                        {order.order_items.slice(0, 2).map((item, index) => (
                          <div key={index}>
                            <div className="flex items-center">
                              <span>{item.quantity}x {item.product_name}</span>
                              {item.selected_color && <span className="ml-1">({item.selected_color})</span>}
                              <button 
  onClick={(e) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    if (item.customer_note) {
      alert(`Nota cliente:\n\n${item.customer_note}`);
    } else {
      alert("Nessuna nota cliente per questo prodotto");
    }
  }}
  className={`p-1 rounded hover:bg-gray-100 ${
    item.customer_note ? "text-blue-600" : "text-gray-400"
  }`}
  title={item.customer_note ? "Nota cliente" : "Nessuna nota cliente"}
>
  <MessageSquare className="h-4 w-4" />
</button>

                            </div>
                          </div>
                        ))}
                        {order.order_items.length > 2 && (
                          <div className="text-gray-500">
                            +{order.order_items.length - 2} altri prodotti
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Dettagli Completi</h4>
                      
                      {/* All Order Items */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Tutti i Prodotti</h5>
                        <div className="space-y-2">
                          {order.order_items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{item.product_name}</span>
                                {item.selected_color && (
                                  <span className="text-gray-600 ml-2">({item.selected_color})</span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  {item.quantity} x €{item.unit_price.toFixed(2)}
                                </div>
                                <div className="font-medium">
                                  <div className="flex items-center">
                                    {item.selected_color && (
                                      <span className="text-gray-600 mr-2">({item.selected_color})</span>
                                    )}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert(item.customer_note ? `Nota cliente: ${item.customer_note}` : "Nessuna nota cliente per questo prodotto");
                                      }}
                                      className={`${item.customer_note ? "text-blue-600" : "text-gray-400"} hover:text-blue-800`}
                                      title={item.customer_note ? "Nota cliente" : "Nessuna nota cliente"}
                                    >
                                      <button 
  onClick={(e) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    if (item.customer_note) {
      alert(`Nota cliente:\n\n${item.customer_note}`);
    } else {
      alert("Nessuna nota cliente per questo prodotto");
    }
  }}
  className={`p-1 rounded hover:bg-gray-100 ${
    item.customer_note ? "text-blue-600" : "text-gray-400"
  }`}
  title={item.customer_note ? "Nota cliente" : "Nessuna nota cliente"}
>
  <MessageSquare className="h-4 w-4" />
</button>


                                      
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center font-semibold">
                          <span>Totale Ordine:</span>
                          <span>€{order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Order Timeline */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Informazioni Ordine</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">ID Ordine:</span>
                            <span className="ml-2 font-mono">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Stato Pagamento:</span>
                            <span className="ml-2 capitalize">{order.payment_status}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Creato:</span>
                            <span className="ml-2">{formatDate(order.created_at)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Aggiornato:</span>
                            <span className="ml-2">{formatDate(order.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nessun ordine trovato
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Prova a modificare i filtri di ricerca'
                      : 'Non ci sono ordini da visualizzare'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;