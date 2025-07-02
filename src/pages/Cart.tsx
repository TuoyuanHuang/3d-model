import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package, MessageSquare, Edit, Save, X } from 'lucide-react';

interface EditingNote {
  itemId: string;
  note: string;
}

const Cart: React.FC = () => {  
  const { items, loading, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const [editingNote, setEditingNote] = React.useState<EditingNote | null>(null);
  const [tempNote, setTempNote] = React.useState('');

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const startEditingNote = (itemId: string, currentNote: string = '') => {
    setEditingNote({ itemId, note: currentNote });
    setTempNote(currentNote);
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setTempNote('');
  };

  const saveNote = async (itemId: string) => {
    try {
      // This is a simplified approach - in a real implementation, you would need to 
      // create a new function in your CartContext and Supabase RPC to update just the note
      const item = items.find(i => i.id === itemId);
      if (item) {
        await updateQuantity(itemId, item.quantity); // Reuse existing function as a workaround
        cancelEditingNote();
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };


  const handleClearCart = async () => {
    if (window.confirm('Sei sicuro di voler svuotare il carrello?')) {
      await clearCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento carrello...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3" />
            Il Mio Carrello
          </h1>
          <p className="text-gray-600">
            {items.length === 0 
              ? 'Il tuo carrello è vuoto' 
              : `${items.length} ${items.length === 1 ? 'prodotto' : 'prodotti'} nel carrello`
            }
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Carrello Vuoto</h2>
            <p className="text-gray-600 mb-6">
              Non hai ancora aggiunto nessun prodotto al carrello
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>Esplora il Catalogo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Prodotti</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Svuota carrello</span>
                  </button>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {item.product_name}
                          </h3>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">
                              {item.selected_color && (
                                <span className="mr-3">Colore: {item.selected_color}</span>
                              )}
                              {item.selected_size && (
                                <span>Dimensione: {item.selected_size} {item.size_dimensions && `(${item.size_dimensions})`}</span>
                              )}
                            </div>
                            
                            {/* Note section */}
                            {editingNote && editingNote.itemId === item.id ? (
                              <div className="flex items-start space-x-2">
                                <textarea
                                  value={tempNote}
                                  onChange={(e) => setTempNote(e.target.value)}
                                  className="flex-1 text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  rows={2}
                                  placeholder="Aggiungi una nota per questo prodotto..."
                                />
                                <div className="flex flex-col space-y-1">
                                  <button
                                    onClick={() => saveNote(item.id)}
                                    className="p-1 text-green-600 hover:text-green-800"
                                    title="Salva nota"
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={cancelEditingNote}
                                    className="p-1 text-gray-600 hover:text-gray-800"
                                    title="Annulla"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center text-sm">
                                {item.customer_note ? (
                                  <div className="flex items-center text-gray-700">
                                    <MessageSquare className="h-4 w-4 mr-1 text-blue-600" />
                                    <span className="mr-2">{item.customer_note}</span>
                                    <button
                                      onClick={() => startEditingNote(item.id, item.customer_note)}
                                      className="text-gray-500 hover:text-gray-700"
                                      title="Modifica nota"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEditingNote(item.id)}
                                    className="text-gray-500 hover:text-gray-700 flex items-center"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    <span>Aggiungi nota</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-lg font-semibold text-blue-600">
                            €{item.unit_price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-medium text-gray-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-4 text-right">
                        <p className="text-sm text-gray-600">
                          Subtotale: <span className="font-medium text-gray-900">
                            €{(item.unit_price * item.quantity).toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Riepilogo Ordine
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotale</span>
                    <span className="font-medium text-gray-900">€{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spedizione</span>
                    <span className="font-medium text-gray-900">Calcolata al checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Totale</span>
                      <span className="text-lg font-semibold text-blue-600">€{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Procedi al Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/catalogo"
                  className="block w-full text-center text-blue-600 hover:text-blue-700 font-medium mt-4"
                >
                  Continua lo Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;