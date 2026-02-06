import { Screen } from '@/src/components/layout/Screen';
import PhoneInput from "react-native-phone-number-input";
import { useRef, useState } from "react";
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContextX';
import { CustomButton } from '@/src/components/ui/CustomButton';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View,Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function LoginPhone() {

    const router = useRouter();
    
    const phoneInputRef = useRef<PhoneInput>(null);
    const [phone, setPhone] = useState("");
    const [formattedPhone, setFormattedPhone] = useState("");
    const { requestOtp} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string }>(
      {}
    );
    const validateForm = (): boolean => {
      const newErrors: { phone?: string } = {};

      // Phone validation
      // const phoneRegex = /^\+?\d{9,15}$/;
      // if (!phone) {
      //   newErrors.phone = 'Phone number is required';
      // } else if (!phoneRegex.test(phone)) {
      //   newErrors.phone = 'Please enter a valid 10-digit phone number';
      // }

      setErrors(newErrors);
      const isValid = phoneInputRef.current?.isValidNumber(phone);
      if (!isValid) {
        Alert.alert('Error', 'Please enter a valid phone number.');
        newErrors.phone = 'Please enter a valid phone number';
      }
      return Object.keys(newErrors).length === 0;
    };
    
  
  const handlePhoneLogin = async () => {
  if (isLoading) return;
    if (!validateForm()) {
      return;
    }
  

  try {
    setIsLoading(true);
    await requestOtp({ phone: formattedPhone });
    router.replace({
      pathname: "/(auth)/verify-otp",
      params: { phone: formattedPhone },
    });
  } catch (error: any) {
    Alert.alert("Login Failed", error.message);
  } finally {
    setIsLoading(false);
  }
};

  
    
  return (
    <Screen scrollable>
      <View style={ {alignItems: 'center', marginBottom: 32} }>
      <Text style={[styles.title]}>Login with Phone</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone</Text>
        {/* <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Enter your phone number"
          value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) {
                    setErrors({ ...errors, phone: undefined });
                  }
                }}
          autoCapitalize="none"
          keyboardType="phone-pad"
          autoComplete="tel"
          editable={!isLoading}
        /> */}
        <PhoneInput
        ref={phoneInputRef}
        defaultCode="MA" // Morocco
        layout="second"
        value={phone}
        onChangeText={setPhone}
        onChangeFormattedText={setFormattedPhone}
        withDarkTheme={false}
        withShadow
        autoFocus={false}
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.phoneTextContainer}
      />
        {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
      </View>



          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handlePhoneLogin}
            disabled={isLoading || phone.length < 9}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Submit</Text>
            )}
          </TouchableOpacity>

         
    </Screen>
  );
}
const styles = StyleSheet.create({
  phoneContainer: {
  width: "100%",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#ccc",
  },
  phoneTextContainer: {
    borderRadius: 8,
  },
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