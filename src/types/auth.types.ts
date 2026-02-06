export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface LoginPhoneCredentials {
  phone: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  requestOtp: (credentials: LoginPhoneCredentials) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  // signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}