import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { ShoppingCart, Pill, LayoutDashboard, User, ShoppingBag, Info, PhoneCall, MessageSquare, Bell } from 'lucide-react-native';
import api from '../../services/api';
import { usePathname } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CustomDrawerContent from '../../components/CustomDrawerContent';

export default function DrawerLayout() {
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth(); // Import useAuth
  const [unreadCount, setUnreadCount] = React.useState(0);
  const pathname = usePathname();

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('notifications/unread_counts/');
      setUnreadCount(res.data.TOTAL);
    } catch (err) {}
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [pathname, isAuthenticated]);

  React.useEffect(() => {
    let interval: any;
    if (isAuthenticated) {
      fetchUnreadCount();
      interval = setInterval(fetchUnreadCount, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated]);

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
          height: 100,
        },
        headerTitleStyle: {
          fontWeight: '800',
          color: '#033487',
          fontSize: 20,
        },
        headerTintColor: '#033487',
        drawerActiveTintColor: '#033487',
        drawerInactiveTintColor: '#64748b',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -10,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Loutfi Pharmacy',
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          drawerLabel: 'Medicines',
          drawerIcon: ({ color, size }) => <Pill size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="cart"
        options={{
          drawerItemStyle: { display: isAuthenticated ? 'flex' : 'none' },
          title: 'Shopping Cart',
          drawerLabel: 'My Cart',
          drawerIcon: ({ color, size }) => (
            <View style={{ width: size, height: size }}>
              <ShoppingCart size={size} color={color} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerItemStyle: { display: isAuthenticated ? 'flex' : 'none' },
          title: 'My Profile',
          drawerLabel: 'Profile Settings',
          drawerIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="orders"
        options={{
          drawerItemStyle: { display: isAuthenticated ? 'flex' : 'none' },
          title: 'Order History',
          drawerLabel: 'My Orders',
          drawerIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: 'About Us',
          drawerLabel: 'About Us',
          drawerIcon: ({ color, size }) => <Info size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="contact"
        options={{
          title: 'Contact Support',
          drawerLabel: 'Contact Support',
          drawerIcon: ({ color, size }) => <PhoneCall size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="checkout"
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Secure Checkout'
        }}
      />
      <Drawer.Screen
        name="feedback"
        options={{
          title: 'Feedback',
          drawerLabel: 'Feedback',
          drawerIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          drawerItemStyle: { display: isAuthenticated ? 'flex' : 'none' },
          title: 'My Notifications',
          drawerLabel: 'Notifications',
          drawerIcon: ({ color, size }) => (
            <View style={{ width: size, height: size }}>
              <Bell size={size} color={color} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: '#ef4444',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
