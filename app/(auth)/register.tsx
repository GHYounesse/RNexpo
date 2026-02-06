import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';

import { AppButton } from '@/src/components/ui/AppButton';
import { AppInput } from '@/src/components/ui/AppInput';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContextX';
import { CustomButton } from '@/src/components/ui/CustomButton';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View,Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function Register() {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name,setName]=useState('');
    const { register} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string;email?: string; password?: string }>(
      {}
    );
    const validateForm = (): boolean => {
      const newErrors: { name?: string; email?: string; password?: string } = {};
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email';
      }

      // Name validation
      if (!name) {
        newErrors.name = 'Name is required';
      }

      // Password validation
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    console.log("Form is valid");

    try {
      setIsLoading(true);
      await register({ email: email.toLowerCase().trim(), password,name });
      
      // Navigation will be handled automatically by the auth state
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Failed to register. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // const handleForgotPassword = () => {
  //   router.push('/(tabs)/home'); // Replace with actual forgot password screen
  // };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };
  
    
  return (
    <Screen scrollable>
      <View style={ {alignItems: 'center', marginBottom: 32} }>
      <Text style={[styles.title]}>Register Screen</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Enter your name"
          value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
          autoCapitalize="words"
          editable={!isLoading}
        />
        {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Enter your email"
          value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          editable={!isLoading}
        />
        {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
      </View>

      {/* <AppInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        error={error.includes('Password') ? error : undefined}
      /> */}
      <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!isLoading}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>
          {/* Forgot Password */}
          {/* <TouchableOpacity
            onPress={handleForgotPassword}
            disabled={isLoading}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity> */}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>You have an account? </Text>
            <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
              <Text style={styles.signUpLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
      
      
        
      

      {/* <AppButton variant="secondary" onPress={() => router.push('/(auth)/register')}>
        Go to Register
      </AppButton> */}
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#99c9ff',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
