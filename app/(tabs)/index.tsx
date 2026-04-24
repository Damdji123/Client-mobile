import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { LogOut, LayoutDashboard, Pill, ShoppingCart, User, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Footer from '../../components/Footer';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.userName}>{user?.first_name || 'Customer'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
            <User size={24} color="#033487" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(tabs)/cart')}>
            <Text style={styles.statValue}>{cartCount}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
            <View style={styles.statIconContainer}>
              <ShoppingCart size={20} color="rgba(255,255,255,0.6)" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#10B981' }]}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Active Orders</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/catalog')}>
            <View style={[styles.menuIcon, { backgroundColor: '#eff6ff' }]}>
              <Pill size={28} color="#2563eb" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuText}>Browse Catalog</Text>
              <Text style={styles.menuSubtext}>Find your medications</Text>
            </View>
            <ArrowRight size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/cart')}>
            <View style={[styles.menuIcon, { backgroundColor: '#f0fdf4' }]}>
              <ShoppingCart size={28} color="#16a34a" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuText}>My Shopping Cart</Text>
              <Text style={styles.menuSubtext}>View selected items</Text>
            </View>
            <ArrowRight size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/orders')}>
            <View style={[styles.menuIcon, { backgroundColor: '#fdf2f8' }]}>
              <LayoutDashboard size={28} color="#db2777" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuText}>Order History</Text>
              <Text style={styles.menuSubtext}>Track your deliveries</Text>
            </View>
            <ArrowRight size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <Footer />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 0,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#033487',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#033487',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  statIconContainer: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    opacity: 0.5,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  menuGrid: {
    paddingHorizontal: 24,
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  menuSubtext: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fffafb',
    borderRadius: 16,
    gap: 10,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
