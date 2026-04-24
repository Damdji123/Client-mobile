import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { Package, Calendar, DollarSign, ChevronRight, Clock } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import Footer from '../../components/Footer';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get('orders/');
      // Handle array or paginated results
      setOrders(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'SHIPPED': return '#3b82f6';
      case 'DECLINED': return '#ef4444';
      default: return '#64748b';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status || 'PENDING'}
          </Text>
        </View>
        <Text style={styles.orderDate}>#{item.id}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.itemRow}>
          <Package size={20} color="#033487" />
          <Text style={styles.itemName}>{item.medicine_name || 'Medical Supplies'}</Text>
          <Text style={styles.itemQty}>x{item.quantity}</Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#94a3b8" />
            <Text style={styles.detailText}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <DollarSign size={14} color="#94a3b8" />
            <Text style={styles.detailText}>Total: ${parseFloat(item.total_price || 0).toFixed(2)}</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.viewDetailBtn}
        onPress={() => Alert.alert(
          `Order #${item.id} Details`,
          `Medicine: ${item.medicine_name || 'N/A'}\nQuantity: ${item.quantity}\nTotal: $${parseFloat(item.total_price || 0).toFixed(2)}\nStatus: ${item.status || 'PENDING'}\nOrdered on: ${new Date(item.created_at).toLocaleString()}`
        )}
      >
        <Text style={styles.viewDetailText}>View Details</Text>
        <ChevronRight size={16} color="#033487" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>Track your medication deliveries</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#033487" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#033487']} />
          }
          ListFooterComponent={<Footer />}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Clock size={48} color="#cbd5e1" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
              <Text style={styles.emptySubtitle}>Your medical order history will appear here.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 20,
    backgroundColor: '#ffffff',
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
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  orderDate: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  itemName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  itemQty: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 4,
  },
  viewDetailText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#033487',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 240,
  }
});
