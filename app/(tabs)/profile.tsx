import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, ChevronRight, Bell, Shield, HelpCircle, Edit2, Camera, X, Check } from 'lucide-react-native';
import api, { getImageUrl } from '../../services/api';
import Footer from '../../components/Footer';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { user, fetchProfile, isLoading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState(user?.first_name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const menuItems = [
    { icon: Bell, label: 'Notifications', color: '#3b82f6' },
    { icon: Shield, label: 'Security & Privacy', color: '#10b981' },
    { icon: HelpCircle, label: 'Help & Support', color: '#f59e0b' },
  ];

  const toggleEdit = () => {
    if (!isEditing) {
      setEditFirstName(user?.first_name || '');
      setEditPhone(user?.phone || '');
      setImageUri(null);
    }
    setIsEditing(!isEditing);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'You need to grant permission to access your photos.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('first_name', editFirstName);
      formData.append('phone', editPhone);

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        
        // standard React Native format for file uploads
        formData.append('profile_picture', {
          uri: imageUri,
          name: filename,
          type
        } as any);
      }

      await api.patch('users/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchProfile(); // refresh the auth context
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Save profile error", error);
      Alert.alert("Error", "Could not save profile updates.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentAvatarUri = imageUri || getImageUrl(user?.profile_picture);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          {!isEditing ? (
            <TouchableOpacity style={styles.editToggleBtn} onPress={toggleEdit}>
              <Edit2 size={18} color="#033487" />
              <Text style={styles.editToggleText}>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity 
            style={styles.avatar} 
            onPress={isEditing ? pickImage : undefined}
            activeOpacity={isEditing ? 0.7 : 1}
          >
            {currentAvatarUri ? (
              <Image 
                source={{ uri: currentAvatarUri }} 
                style={styles.avatarImage} 
              />
            ) : (
              <Text style={styles.avatarText}>
                {(editFirstName || user?.first_name || 'U').charAt(0)}
              </Text>
            )}
            
            {isEditing && (
              <View style={styles.cameraOverlay}>
                <Camera size={20} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>

          {isEditing ? (
            <TextInput 
              style={styles.nameInput}
              value={editFirstName}
              onChangeText={setEditFirstName}
              placeholder="First Name"
              placeholderTextColor="#94a3b8"
            />
          ) : (
            <Text style={styles.userName}>{user?.first_name || 'Customer'}</Text>
          )}
          <Text style={styles.userRole}>Premium Client</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Mail size={20} color="#64748b" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email Address (Read Only)</Text>
              <Text style={styles.infoValue}>{user?.email || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Phone size={20} color="#64748b" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              {isEditing ? (
                 <TextInput 
                   style={styles.phoneInput}
                   value={editPhone}
                   onChangeText={setEditPhone}
                   placeholder="Enter phone number"
                   keyboardType="phone-pad"
                 />
              ) : (
                 <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
              )}
            </View>
          </View>
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={toggleEdit} disabled={isSaving}>
              <X size={20} color="#64748b" />
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Check size={20} color="#ffffff" />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>

        <Footer />
        <View style={{ height: 40 }} />
      </ScrollView>

      {isLoading && !isSaving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#033487" />
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#033487',
  },
  editToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  editToggleText: {
    color: '#033487',
    fontWeight: '700',
    fontSize: 14,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#033487',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#033487',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 200,
    textAlign: 'center',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoSection: {
    paddingHorizontal: 24,
    marginTop: 10,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 20,
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '700',
  },
  phoneInput: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '700',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  menuSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
