import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';

import { authService } from '@/src/services/auth.service';
import { useRouter } from 'expo-router';
// import { useAuth } from '@/src/contexts/AuthContext';
const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const { signInWithGoogle } = useAuth();
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await authService.signInWithGoogle();

      if (result.success) {
        // Navigate based on user status
        if (result.isNewUser) {
          router.replace('/(tabs)/home');
        } else if (result.requiresProfileSetup) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(tabs)/home');
        }
      } else if (!result.cancelled) {
        Alert.alert('Error', result.error || 'Failed to sign in with Google');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // const handleAppleSignIn = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await authService.signInWithApple();

  //     if (result.success) {
  //       // Navigate based on user status
  //       if (result.isNewUser) {
  //         router.replace('/(tabs)/home');
  //       } else if (result.requiresProfileSetup) {
  //         router.replace('/(tabs)/home');
  //       } else {
  //         router.replace('/(tabs)/home');
  //       }
  //     } else if (!result.cancelled) {
  //       Alert.alert('Error', result.error || 'Failed to sign in with Apple');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'An unexpected error occurred');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePhoneSignIn = () => {
    router.push('/(auth)/phone-login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* OAuth Buttons */}
        <View style={styles.buttonContainer}>
          {/* Google Sign-In 
          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                {/* <Icon name="google" size={24} color="#fff" /> 
                <Text style={styles.buttonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Apple Sign-In (iOS only) 
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.button, styles.appleButton]}
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  {/* <Icon name="apple" size={24} color="#fff" /> 
                  <Text style={styles.buttonText}>Continue with Apple</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Phone Sign-In */}
          <TouchableOpacity
            style={[styles.button, styles.phoneButton]}
            onPress={handlePhoneSignIn}
            disabled={loading}
          >
            {/* <Icon name="phone" size={24} color="#007AFF" /> */}
            <Text style={[styles.buttonText, styles.phoneButtonText]}>
              Continue with Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  phoneButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  phoneButtonText: {
    color: '#007AFF',
  },
  termsText: {
    marginTop: 32,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;