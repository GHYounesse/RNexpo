import apiClient from '../api/apiClient';
import { secureStorage } from '../utils/secureStorage';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  LoginPhoneCredentials,
  User,
} from '../types/auth.types';
import { Platform } from 'react-native';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

// GoogleSignin.configure({
//   webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, // from Google Cloud
//   offlineAccess: true, // if you want a refresh token
// });
import * as Google from 'expo-auth-session/providers/google';

const [request, response, promptAsync] =
  Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });
export const authService = {
  
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
        console.log("Attempting to login with credentials:", credentials);
      const response = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials
      );

      const { accessToken, refreshToken, user } = response.data;

      // Save tokens securely
      await secureStorage.saveTokens(accessToken, refreshToken);

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  },

  // Register
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/register',
        credentials
      );
      console.log("Registration response data:", response.data);
      const { accessToken, refreshToken, user } = response.data;

      // Save tokens securely
      await secureStorage.saveTokens(accessToken, refreshToken);
      console.log("Registration response data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      // Optional: Call backend to invalidate refresh token
      const refreshToken = await secureStorage.getRefreshToken();
      
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear tokens from secure storage
      await secureStorage.clearTokens();
    }
  },

  async requestOTP(credentials: LoginPhoneCredentials): Promise<string> {
    try {
        console.log("Attempting to login with phone:", credentials);
      const response = await apiClient.post<{message: string}>(
        '/auth/request-otp',
        credentials
      );

      const  {message}  = response.data;

      // Save tokens securely
      // await secureStorage.saveTokens(accessToken, refreshToken);

      return message;
    } catch (error: any) {
      console.error('Request OTP error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to request OTP. Please try again.'
      );
    }
  },
  async verifyOtp(phone: string, code: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/verify-otp',
        { phone, code }
      );
      const { accessToken, refreshToken, user } = response.data;

      // Save tokens securely
      await secureStorage.saveTokens(accessToken, refreshToken);
      return response.data;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to verify OTP. Please try again.'
      );
    }
  },
  // // Google Sign-In
  // signInWithGoogle: async (): Promise<any> => {
  //   try {
  //     // Check for Play Services (Android)
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     // Get user info and ID token
  //     const tokens = await GoogleSignin.getTokens(); // ✅ Use this to get idToken
  //     const idToken = tokens.idToken;

  //     if (!idToken) {
  //       throw new Error('No ID token received from Google');
  //     }

  //     // Verify with backend
  //     const response = await fetch(`${API_URL}/auth/google/verify`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         idToken,
  //         provider: 'google',
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Authentication failed');
  //     }

  //     // Save tokens and user data
  //     await secureStorage.saveAuthData(
  //       data.accessToken,
  //       data.refreshToken,
  //       data.user
  //     );

  //     return {
  //       success: true,
  //       user: data.user,
  //       isNewUser: data.isNewUser,
  //       requiresProfileSetup: data.requiresProfileSetup,
  //     };
  //   } catch (error:any) {
  //     console.error('Google Sign-In Error:', error);
      
  //     // Handle specific error codes
  //     if (error.code === 'SIGN_IN_CANCELLED') {
  //       return { success: false, cancelled: true };
  //     } else if (error.code === 'IN_PROGRESS') {
  //       return { success: false, error: 'Sign-in already in progress' };
  //     } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
  //       return { success: false, error: 'Google Play Services not available' };
  //     }
      
  //     return { success: false, error: error.message || 'Failed to sign in with Google' };
  //   }
  // },
  signInWithGoogle: async (): Promise<any> => {
    try {
      const result = await promptAsync();

      if (result.type === 'dismiss' || result.type === 'cancel') {
        return { success: false, cancelled: true };
      }

      if (result.type !== 'success') {
        throw new Error('Google authentication failed');
      }

      const idToken = result.params.id_token;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // ✅ Same backend call (unchanged)
      const response = await fetch(`${API_URL}/auth/google/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          provider: 'google',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // ✅ Same secure storage
      await secureStorage.saveAuthData(
        data.accessToken,
        data.refreshToken,
        data.user
      );

      return {
        success: true,
        user: data.user,
        isNewUser: data.isNewUser,
        requiresProfileSetup: data.requiresProfileSetup,
      };

    } catch (error: any) {
      console.error('Google OAuth Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to sign in with Google',
      };
    }
  },
  // // Apple Sign-In (iOS only)
  // signInWithApple: async () => {
  //   if (Platform.OS !== 'ios') {
  //     return { success: false, error: 'Apple Sign-In is only available on iOS' };
  //   }

  //   try {
  //     // Start Apple Sign-In request
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.LOGIN,
  //       requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //     });

  //     // Get credential state
  //     const credentialState = await appleAuth.getCredentialStateForUser(
  //       appleAuthRequestResponse.user
  //     );

  //     if (credentialState !== appleAuth.State.AUTHORIZED) {
  //       throw new Error('Apple Sign-In not authorized');
  //     }

  //     const { identityToken, email, fullName } = appleAuthRequestResponse;

  //     if (!identityToken) {
  //       throw new Error('No identity token received from Apple');
  //     }

  //     // Verify with backend
  //     const response = await fetch(`${API_URL}/auth/apple/verify`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         idToken: identityToken,
  //         email,
  //         name: fullName?.givenName 
  //           ? `${fullName.givenName} ${fullName.familyName || ''}`.trim() 
  //           : null,
  //         provider: 'apple',
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Authentication failed');
  //     }

  //     // Save tokens and user data
  //     await secureStorage.saveAuthData(
  //       data.accessToken,
  //       data.refreshToken,
  //       data.user
  //     );

  //     return {
  //       success: true,
  //       user: data.user,
  //       isNewUser: data.isNewUser,
  //       requiresProfileSetup: data.requiresProfileSetup,
  //     };
  //   } catch (error:any) {
  //     console.error('Apple Sign-In Error:', error);
      
  //     if (error.code === appleAuth.Error.CANCELED) {
  //       return { success: false, cancelled: true };
  //     }
      
  //     return { success: false, error: error.message || 'Failed to sign in with Apple' };
  //   }
  // },


  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch user data.'
      );
    }
  },

  // Verify token validity
  async verifyToken(): Promise<boolean> {
    try {
      const accessToken = await secureStorage.getAccessToken();
      
      if (!accessToken) {
        return false;
      }

      // Optional: Call backend to verify token
      await apiClient.get('/auth/verify');
      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.patch<User>('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to update profile.'
      );
    }
  },

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to change password.'
      );
    }
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error: any) {
      console.error('Password reset request error:', error);
      throw new Error(
        error.response?.data?.message ||
          'Failed to send password reset email.'
      );
    }
  },

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to reset password.'
      );
    }
  },
};