import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import api from '../services/api';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth Discovery Endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  promptGoogleLogin: () => void;
  googleLoading: boolean;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Generic Auth Request to bypass platform-specific ID requirements
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '558823491292-kdg6t4tdgup6nkigmngb6f8bftnmtuh4.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Token,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'loutfi-pharmacy',
      }),
    },
    discovery
  );

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { params } = response;
      // Note: Generic AuthSession returns a code by default, but we can configure for implicit or exchange code
      // For simplicity in this shell, we handle the authentication params
      handleGoogleLogin(params.access_token);
    }
  }, [response]);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('client_access');
      if (token) {
        setIsAuthenticated(true);
        await fetchProfile();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Failed to check login status:', e);
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('users/profile/');
      setUser(res.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // If profile fetch fails but we had a token, it might be expired
      if (isAuthenticated) {
         // Optionally handle re-auth or logout here
      }
    }
  };

  const handleGoogleLogin = async (googleAccessToken: string | undefined) => {
    if (!googleAccessToken) return;
    setGoogleLoading(true);
    try {
      const res = await api.post('users/google-login/', {
        access_token: googleAccessToken,
      });

      await saveTokens(res.data.access, res.data.refresh);
      setIsAuthenticated(true);
      // Small delay to ensure SecureStore is flushed
      await new Promise(resolve => setTimeout(resolve, 100));
      await fetchProfile();
    } catch (error) {
      console.error('Google Login Error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      const res = await api.post('users/login/', {
        username: credentials.email,
        password: credentials.password,
      });

      if (res.data.role !== 'CLIENT') {
        throw new Error('Access denied: You are not authorized.');
      }

      await saveTokens(res.data.access, res.data.refresh);
      setIsAuthenticated(true);
      // Small delay to ensure SecureStore is flushed
      await new Promise(resolve => setTimeout(resolve, 100));
      await fetchProfile();
    } catch (error) {
      throw error;
    }
  };

  const saveTokens = async (access: string, refresh: string) => {
    await SecureStore.setItemAsync('client_access', access);
    await SecureStore.setItemAsync('client_refresh', refresh);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('client_access');
    await SecureStore.deleteItemAsync('client_refresh');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      promptGoogleLogin: () => promptAsync(),
      googleLoading,
      fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
