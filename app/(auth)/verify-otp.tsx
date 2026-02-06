import { Screen } from '@/src/components/layout/Screen';
import OTPTextInput from 'react-native-otp-textinput';


import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContextX';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View,Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { OTPInput } from '@/src/components/ui/OTPInput';

export default function VerifyOTP() {
  //Retrieves the phone number passed from the previous screen
  //Used when verifying and resending OT
    const router = useRouter();
    const phone= useLocalSearchParams().phone as string;

    //otp[] → split 6-box OTP input (better UX)
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // Controls resend cooldown
  // Prevents OTP spam
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
  
  // verifyOtp(phone, code) → verifies OTP with backend
  // requestOtp({ phone }) → resend OTP
    const { verifyOtp, requestOtp } = useAuth();
  
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ otpCode?: string}>(
      {}
    );

    useEffect(() => {
      // Starts a 60-second countdown
      // Enables resend when timer reaches 0
      // Cleans interval on unmount
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);


    
    const validateForm = (): boolean => {
      const newErrors: { otpCode?: string } = {};

      // Code validation
      const otpCode = otp.join("");
        if (otpCode.length !== 6|| !/^\d+$/.test(otpCode)) {
            Alert.alert("Error", "Please enter a valid 6-digit OTP.");
            newErrors.otpCode = "Please enter a valid 6-digit OTP";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

      
    
  const handleVerifyOTP = async () => {
    // Validate input
    // Call backend
    // Navigate on success
    // Show error on failure
    // Reset loading state
    if (!validateForm()) {
      return;
    }
    console.log("Form is valid");

    try {
      const code = otp.join("");
      setIsLoading(true);
      await verifyOtp(phone, code);

      //await verifyOtp(phone, otp.join(""));
      
      // Navigation will be handled automatically by the auth state
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        error.message || 'Invalid OTP. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };



  const handleResendOTP = async () => {
    // Blocks resend if cooldown active
    // Requests new OTP
    // Resets timer & inputs
    if (!canResend) return;
    try{
      setIsLoading(true);
      await requestOtp({ phone: phone.trim() });
    } catch (error: any) {
      Alert.alert(
        'Resend OTP Failed',
        error.message || 'Failed to resend OTP.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };
  
    
  return (
    <Screen scrollable>
      <View style={ {alignItems: 'center', marginBottom: 32} }>
      <Text style={[styles.title]}>Verify OTP</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>OTP Code</Text>
        {/* <TextInput
          style={[styles.input, errors.code && styles.inputError]}
          placeholder="Enter your OTP code"
          value={code}
                onChangeText={(text) => {
                  setCode(text);
                  if (errors.code) {
                    setErrors({ ...errors, code: undefined });
                  }
                }}
          autoCapitalize="none"
          keyboardType="numeric"
          autoComplete="off"
          editable={!isLoading}
        />
        {errors.code && (
              <Text style={styles.errorText}>{errors.code}</Text>
            )} */}
      </View>
      <View style={styles.otpContainer}>
                {/* {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(value) => handleOTPChange(value, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={(ref) => {
                      inputs.current[index] = ref;
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace" && !digit && index > 0) {
                        inputs.current[index - 1]?.focus();
                      }
                    }}
                    autoFocus={index === 0}
                  />
                ))} */}

                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading}
                />
                {errors.otpCode && (
              <Text style={styles.errorText}>{errors.otpCode}</Text>
            )}
              </View>
      
      {/* <AppInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        error={error.includes('Password') ? error : undefined}
      /> */}
      
          {/* Resend OTP */}
      
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  {canResend
                    ? "Didn't receive the code? "
                    : `Resend code in ${resendTimer}s `}
                </Text>
                <TouchableOpacity onPress={handleResendOTP} disabled={!canResend}>
                  <Text
                    style={[styles.resendLink, canResend && styles.resendLinkActive, !canResend && styles.resendLinkDisabled]}
                  >
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleVerifyOTP}
            disabled={isLoading}
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
  otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    otpInput: {
      backgroundColor: "#f5f5f5",
      borderRadius: 10,
      width: 50,
      height: 50,
      textAlign: "center",
      fontSize: 20,
      color: "#1a1a1a",
    },
    resendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    resendText: {
      fontSize: 14,
      color: "#666",
    },
    resendLink: {
      fontSize: 14,
      color: "#007AFF",
      marginLeft: 5,
      fontWeight: "600",
    },
    resendLinkActive: {
      color: "#007AFF",
    },
    resendLinkDisabled: {
      color: "#99c9ff",
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
});