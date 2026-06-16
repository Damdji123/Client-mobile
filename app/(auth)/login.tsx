import React, { useState, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, promptGoogleLogin, googleLoading } = useAuth();
  const router = useRouter();

  // Shake animation for the form on error
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const clearAndShowError = (msg: string) => {
    setEmail('');
    setPassword('');
    setErrorMsg(msg);
    shake();
  };

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('Veuillez remplir à la fois l\'e-mail et le mot de passe.');
      shake();
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.replace('/');
    } catch (err: any) {
      const httpStatus = err?.response?.status;
      if (!err?.response) {
        // Pure network error — don't clear credentials since it's not their fault
        setErrorMsg('Impossible de se connecter au serveur. Assurez-vous d\'être sur le même réseau Wi-Fi que le serveur et que le backend est en cours d\'exécution.');
        shake();
      } else if (httpStatus === 403) {
        clearAndShowError(err.response?.data?.error || 'Votre compte a été bloqué. Veuillez contacter le support.');
      } else {
        const serverMsg =
          err.response?.data?.error ||
          err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.detail;
        clearAndShowError(serverMsg || 'Adresse e-mail ou mot de passe invalide. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Bon retour</Text>
          <Text style={styles.subtitle}>Connectez-vous pour accéder aux services de la pharmacie</Text>
        </View>

        <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>

          {/* Inline error banner */}
          {errorMsg !== '' && (
            <View style={styles.errorBanner}>
              <AlertCircle size={18} color="#b91c1c" />
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              style={[styles.input, errorMsg !== '' && styles.inputError]}
              placeholder="john@example.com"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrorMsg(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94a3b8"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { paddingRight: 50 }, errorMsg !== '' && styles.inputError]}
                placeholder="••••••••"
                value={password}
                onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
                secureTextEntry={!showPassword}
                placeholderTextColor="#94a3b8"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} color="#64748b" /> : <Eye size={22} color="#64748b" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/(auth)/forgot_password')}
          >
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, (isLoading || googleLoading) && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading || googleLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, googleLoading && styles.disabledButton]}
            onPress={() => { setErrorMsg(''); promptGoogleLogin(); }}
            disabled={isLoading || googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#ea4335" />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://w7.pngwing.com/pngs/326/85/png-transparent-google-logo-google-text-trademark-logo-thumbnail.png' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continuer avec Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.registerLink}>
            <Text style={styles.registerText}>Vous n'avez pas de compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLinkText}>S'inscrire ici</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/public_feedback' as any)}
            style={{ marginTop: 20, alignItems: 'center' }}
          >
            <Text style={{ color: '#64748b', fontSize: 14, textDecorationLine: 'underline' }}>
              Une question ? Envoyez-nous vos commentaires
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  form: {
    width: '100%',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  errorBannerText: {
    flex: 1,
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
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
  inputError: {
    borderColor: '#fca5a5',
    backgroundColor: '#fff5f5',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#033487',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#033487',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#033487',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ea4335',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerText: {
    color: '#64748b',
    fontSize: 14,
  },
  registerLinkText: {
    color: '#033487',
    fontWeight: '700',
    fontSize: 14,
  },
});
