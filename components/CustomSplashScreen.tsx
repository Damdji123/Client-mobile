import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, Animated, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

interface CustomSplashScreenProps {
  onAnimationFinish: () => void;
}

export default function CustomSplashScreen({ onAnimationFinish }: CustomSplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Hide the native splash screen as soon as our custom one is ready
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        // Ignore errors
      }
    };
    hideNativeSplash();

    // Start entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();

    // Set a timeout to finish the splash
    const timer = setTimeout(() => {
      onAnimationFinish();
    }, 4000); // 4 seconds total to let them enjoy the animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Welcome Text */}
        <Text style={styles.welcomeText}>WELCOME TO</Text>
        
        {/* Rounded Logo Container */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>Loutfi Pharmacy</Text>
        <Text style={styles.subtitle}>Your Health, Our Priority</Text>

        <View style={styles.footer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Initializing Pharmacy Services...</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  welcomeText: {
    fontSize: 16,
    color: '#033487', // Match the title blue for better visibility
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#f0fdf4',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#033487',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
    marginBottom: 60,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  }
});
