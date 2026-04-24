import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

interface CartContextType {
  cartCount: number;
  fetchCartCount: () => Promise<void>;
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
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const token = await SecureStore.getItemAsync('client_access');
      if (!token) {
        setCartCount(0);
        return;
      }
      
      const res = await api.get('orders/cart/');
      // Handle different response formats
      const data = res.data;
      const items = Array.isArray(data) ? data : (data.results || []);
      
      const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    } catch (error: any) {
      // Don't show network error alerts for polling, just log quietly
      console.log("Cart fetch skip/error:", error.message);
      if (error.response?.status === 401) {
        setCartCount(0);
      }
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
