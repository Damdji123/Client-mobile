import React, { useState, useCallback } from 'react';
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
import { Bell, ShoppingBag, Info, ChevronRight, Clock, CheckCheck, Trash2 } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Footer from '../../components/Footer';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('notifications/');
      setNotifications(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    try {
      await api.post('notifications/mark_as_read/');
      fetchNotifications();
    } catch (err) {
      Alert.alert("Error", "Failed to mark notifications as read.");
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`notifications/${id}/`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      Alert.alert("Error", "Failed to delete notification.");
    }
  };

  const clearAllNotifications = async () => {
    Alert.alert(
      "Clear All",
      "Are you sure you want to delete all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete('notifications/clear_all/');
              setNotifications([]);
            } catch (err) {
              Alert.alert("Error", "Failed to clear notifications.");
            }
          }
        }
      ]
    );
  };

  const handleNotificationPress = async (item: any) => {
    try {
      await api.post('notifications/mark_as_read/', { type: item.notification_type });
      
      // Navigate to orders if it's an order notification
      if (item.notification_type === 'ORDER' || item.notification_type === 'OTHER') {
        router.push({ pathname: '/(tabs)/orders', params: { id: item.related_id } } as any);
      }
    } catch (err) {
      console.error("Error handling notification", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <ShoppingBag size={22} color="#033487" />;
      default: return <Info size={22} color="#9333ea" />;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.is_read && styles.unreadCard]} 
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: item.is_read ? '#f8fafc' : '#f0f9ff' }]}>
        {getIcon(item.notification_type)}
        {!item.is_read && <View style={styles.unreadDot} />}
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.typeText}>{item.notification_type === 'OTHER' ? 'Order Update' : item.notification_type}</Text>
          <View style={styles.timeBox}>
             <Clock size={12} color="#94a3b8" />
             <Text style={styles.timeText}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>
        <Text style={[styles.message, !item.is_read && styles.unreadMessage]}>{item.message}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => deleteNotification(item.id)} style={styles.deleteBtn}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
        <ChevronRight size={18} color="#cbd5e1" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>Updates on your medical orders</Text>
          </View>
          <View style={styles.headerActions}>
            {notifications.some(n => !n.is_read) && (
              <TouchableOpacity style={styles.markBtn} onPress={markAllAsRead}>
                <CheckCheck size={20} color="#033487" />
              </TouchableOpacity>
            )}
            {notifications.length > 0 && (
              <TouchableOpacity style={[styles.markBtn, { marginLeft: 10, backgroundColor: '#fef2f2' }]} onPress={clearAllNotifications}>
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#033487" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#033487']} />
          }
          ListFooterComponent={<Footer />}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Bell size={48} color="#cbd5e1" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptySubtitle}>You have no new notifications at the moment.</Text>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  markBtn: {
    padding: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  unreadCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#03348720',
    borderLeftWidth: 4,
    borderLeftColor: '#033487',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cardBody: {
    flex: 1,
    marginRight: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#033487',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  unreadMessage: {
    color: '#1e293b',
    fontWeight: '600',
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
