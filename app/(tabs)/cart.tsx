import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchCartCount } = useCart();
  const router = useRouter();

  // Refresh cart whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const fetchCart = async () => {
    try {
      const res = await api.get(`orders/cart/?t=${new Date().getTime()}`);
      setCartItems(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    try {
      await api.patch(`orders/cart/${id}/`, { quantity: newQty });
      await fetchCart();
      await fetchCartCount();
    } catch (error) {
       console.error("Update qty error", error);
    }
  };

  const removeItem = async (id: number) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`orders/cart/${id}/`);
              await fetchCart();
              await fetchCartCount();
            } catch (error) {
              console.error("Delete item error", error);
            }
          }
        }
      ]
    );
  };

  const subtotal = cartItems.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.medicine_detail?.price || 0) * item.quantity);
  }, 0);
  
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.medicine_detail?.name || 'Unknown Item'}</Text>
        <Text style={styles.itemPrice}>UGX {parseFloat(item.medicine_detail?.price || 0).toLocaleString()} / unit</Text>
      </View>
      
      <View style={styles.controls}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => updateQuantity(item.id, item.quantity, -1)}
          >
            <Minus size={16} color="#033487" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => updateQuantity(item.id, item.quantity, 1)}
          >
            <Plus size={16} color="#033487" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.deleteBtn} onPress={() => removeItem(item.id)}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#033487" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.subtitle}>{cartItems.length} items in your basket</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <ShoppingBag size={64} color="#cbd5e1" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Looks like you haven't added anything yet.</Text>
          <TouchableOpacity 
            style={styles.browseBtn}
            onPress={() => router.push('/(tabs)/catalog')}
          >
            <Text style={styles.browseBtnText}>Browse Catalog</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item: any) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>UGX {subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>UGX {deliveryFee.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>UGX {total.toLocaleString()}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/(tabs)/checkout')}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <ArrowRight size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#033487',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  cartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    paddingHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#033487',
  },
  checkoutBtn: {
    backgroundColor: '#033487',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#033487',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
  },
  browseBtn: {
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  browseBtnText: {
    color: '#033487',
    fontWeight: '700',
    fontSize: 16,
  }
});
