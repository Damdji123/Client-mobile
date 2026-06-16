import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquare, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import Footer from '../components/Footer';

export default function PublicFeedbackScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (Nom, E-mail, Message).');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('feedback/', { 
        name, 
        email, 
        phone: phone || 'N/A', 
        message 
      });
      Alert.alert('Succès', 'Merci pour vos commentaires !', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error: any) {
      console.error('Feedback error:', error);
      Alert.alert('Erreur', 'Échec de l\'envoi des commentaires. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Commentaires</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MessageSquare size={32} color="#10b981" />
            </View>
            <Text style={styles.title}>Votre avis nous intéresse</Text>
            <Text style={styles.subtitle}>Toute personne peut envoyer un message directement à notre équipe de pharmacie. Aucun compte requis.</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom complet *</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre nom"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adresse e-mail *</Text>
              <TextInput
                style={styles.input}
                placeholder="vous@domaine.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Téléphone (Optionnel)</Text>
              <TextInput
                style={styles.input}
                placeholder="Numéro de téléphone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Votre message *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Comment s'est passée votre expérience avec la Pharmacie Loutfi ?"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.disabledButton]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>Envoyer les commentaires</Text>
              )}
            </TouchableOpacity>
          </View>

          <Footer />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    padding: 8,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 20,
    backgroundColor: '#f8fafc',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
