import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import api from '../../services/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Success
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  const handleRequestOTP = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez saisir votre adresse e-mail enregistrée.');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post('users/password-reset/', { email });
      setStep(2);
      Alert.alert('Succès', 'Un code de vérification a été envoyé à votre adresse e-mail.');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Échec de l\'envoi du code. Veuillez réessayer.';
      Alert.alert('Erreur', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('users/password-reset/confirm/', { 
        email, 
        otp, 
        new_password: newPassword 
      });
      setStep(3);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Code invalide ou échec de la requête.';
      Alert.alert('Erreur', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {step < 3 && (
            <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(1)} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Retour</Text>
            </TouchableOpacity>
          )}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>
            {step === 1 ? 'Mot de passe oublié ?' : step === 2 ? 'Vérifier l\'identité' : 'Succès !'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1 ? "Pas de soucis, nous vous enverrons des instructions de récupération." : 
             step === 2 ? `Entrez le code à 6 chiffres envoyé à ${email}` : 
             "Votre mot de passe a été mis à jour avec succès."}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 1 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Adresse e-mail enregistrée</Text>
                <TextInput
                  style={styles.input}
                  placeholder="john@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <TouchableOpacity
                style={[styles.actionButton, isLoading && styles.disabledButton]}
                onPress={handleRequestOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.actionButtonText}>Envoyer le code de vérification</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginLink}>
                <Text style={styles.loginText}>Vous vous souvenez de votre mot de passe ? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.loginLinkText}>Se connecter ici</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Code à 6 chiffres</Text>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  placeholder="123456"
                  value={otp}
                  onChangeText={(val) => setOtp(val.replace(/\D/g, ''))}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nouveau mot de passe</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, { paddingRight: 50 }]}
                    placeholder="••••••••"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#94a3b8"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={22} color="#64748b" /> : <Eye size={22} color="#64748b" />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <TouchableOpacity
                style={[styles.actionButton, isLoading && styles.disabledButton]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.actionButtonText}>Réinitialiser le mot de passe</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.replace('/(auth)/login')}
              >
                <Text style={styles.actionButtonText}>Se connecter avec le nouveau mot de passe</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  backButtonText: {
    color: '#033487',
    fontSize: 16,
    fontWeight: '600',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#033487',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
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
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0f172a',
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 24,
    fontWeight: '700',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  actionButton: {
    backgroundColor: '#033487',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#033487',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    color: '#64748b',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#033487',
    fontWeight: '700',
    fontSize: 14,
  },
});
