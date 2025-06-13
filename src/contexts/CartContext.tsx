import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  selected_color?: string;
  created_at: string;
  updated_at: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  totalItems: number;
  totalAmount: number;
  addToCart: (productId: string, productName: string, unitPrice: number, quantity?: number, selectedColor?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, supabase } = useAuth();

  const refreshCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    productId: string,
    productName: string,
    unitPrice: number,
    quantity: number = 1,
    selectedColor?: string
  ) => {
    if (!user) {
      throw new Error('User must be logged in to add items to cart');
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('add_to_cart', {
        p_product_id: productId,
        p_product_name: productName,
        p_unit_price: unitPrice,
        p_quantity: quantity,
        p_selected_color: selectedColor
      });

      if (error) throw error;
      await refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('update_cart_item_quantity', {
        p_cart_item_id: itemId,
        p_quantity: quantity
      });

      if (error) throw error;
      await refreshCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    await updateQuantity(itemId, 0);
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc('clear_user_cart');
      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load cart when user changes
  useEffect(() => {
    refreshCart();
  }, [user]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

  const value = {
    items,
    loading,
    totalItems,
    totalAmount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};