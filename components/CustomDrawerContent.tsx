import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { LogOut, Info, PhoneCall } from 'lucide-react-native';
import { getImageUrl } from '../services/api';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: logout }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
        {/* Drawer Header with User Info */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            {user?.profile_picture ? (
              <Image 
                source={{ uri: getImageUrl(user.profile_picture) }} 
                style={styles.avatarImage} 
              />
            ) : (
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0) || 'U'}
              </Text>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.first_name || 'Customer'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Guest'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Default Screens (Home, Catalog, Cart, Profile) */}
        <DrawerItemList {...props} />

        <View style={styles.divider} />

        {/* Additional Links */}
        <View style={styles.additionalItems}>
          <Text style={styles.sectionTitle}>Information</Text>
          
          <TouchableOpacity 
            style={styles.extraItem}
            onPress={() => props.navigation.navigate('about')}
          >
            <Info size={20} color="#64748b" />
            <Text style={styles.extraLabel}>About Us</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.extraItem}
            onPress={() => props.navigation.navigate('contact')}
          >
            <PhoneCall size={20} color="#64748b" />
            <Text style={styles.extraLabel}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Sign Out Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Loutfi Pharmacy v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    paddingTop: 0,
  },
  header: {
    padding: 20,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#033487',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  additionalItems: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    marginLeft: 5,
  },
  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 15,
  },
  extraLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: 30,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff1f2',
    gap: 10,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    color: '#cbd5e1',
    fontSize: 10,
    marginTop: 15,
  },
});
