import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { authService } from '../services/auth.service';
import { secureStorage } from '../utils/secureStorage';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthContextType,
  LoginPhoneCredentials,
} from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Check if tokens exist
      const accessToken = await secureStorage.getAccessToken();

      if (!accessToken) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Verify token and get user data
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear invalid tokens
      await secureStorage.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(credentials);
      console.log("Registration successful:", response);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const requestOtp = async (credentials: LoginPhoneCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.requestOTP(credentials);
      console.log("OTP request successful:", response);
    } catch (error) {
      console.error('Request OTP error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const verifyOtp = async (phone: string, code: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.verifyOtp(phone, code);
      console.log("OTP verification successful:", response);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.signInWithGoogle();
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // const signInWithApple = async (): Promise<void> => { 
  //   try {
  //     setIsLoading(true);
  //     const response = await authService.signInWithApple();
  //     setUser(response.user);
  //     setIsAuthenticated(true);
  //   } catch (error) {
  //     setIsAuthenticated(false);
  //     setUser(null);
  //     throw error;
  //   }finally {
  //     setIsLoading(false);
  //   } 
  // };

  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    requestOtp,
    verifyOtp,
    signInWithGoogle,
    // signInWithApple,
    updateUser,

  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};