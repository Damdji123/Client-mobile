import React, { useState, useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from "../components/CustomSplashScreen";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const [customSplashFinished, setCustomSplashFinished] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !customSplashFinished) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isPublicFeedback = segments[0] === 'public_feedback';

    if (!isAuthenticated && !inAuthGroup && !isPublicFeedback) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home (tabs) if authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, customSplashFinished, segments]);

  if (!customSplashFinished) {
    return (
      <CustomSplashScreen 
        onAnimationFinish={() => setCustomSplashFinished(true)} 
      />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CartProvider>
          <RootLayoutNav />
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
