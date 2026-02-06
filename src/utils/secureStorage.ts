import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';
export const secureStorage = {
  // Save access token
  async saveAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
      console.log("Access token saved successfully");
    } catch (error) {
      console.error('Error saving access token:', error);
      throw error;
    }
  },

  // Get access token
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  // Save refresh token
  async saveRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw error;
    }
  },

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  // Save both tokens
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
        console.log("Saving tokens:", { accessToken, refreshToken });
      await Promise.all([
        this.saveAccessToken(accessToken),
        this.saveRefreshToken(refreshToken),
      ]);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  },

  // Clear all tokens
  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },
  // Save user data (AsyncStorage - user object can be large)
  saveUser: async (user: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  // Get user data (AsyncStorage)
  getUser: async (): Promise<any | null> => {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Save all auth data (tokens + user)
  saveAuthData: async (
    accessToken: string,
    refreshToken: string,
    user: any
  ): Promise<boolean> => {
    try {
      console.log('Saving auth data:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken,
        user: user 
      });

      // Save tokens to SecureStore and user to AsyncStorage in parallel
      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
      ]);

      console.log('All auth data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving auth data:', error);
      return false;
    }
  },

  // Clear all auth data (tokens + user)
  clearAuthData: async (): Promise<boolean> => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      console.log('All auth data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  // Get all auth data (for debugging or checks)
  getAllAuthData: async (): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
    user: any | null;
  }> => {
    try {
      const [accessToken, refreshToken, userJson] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      return {
        accessToken,
        refreshToken,
        user: userJson ? JSON.parse(userJson) : null,
      };
    } catch (error) {
      console.error('Error getting all auth data:', error);
      return {
        accessToken: null,
        refreshToken: null,
        user: null,
      };
    }
  },
};