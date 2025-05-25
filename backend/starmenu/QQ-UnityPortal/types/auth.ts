export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: string;
  lastLogin: string;
}

export type UserRole = 'user' | 'admin' | 'guest';

export interface UserPreferences {
  theme: 'default' | 'dark' | 'light' | 'quantum';
  animationLevel: 'high' | 'medium' | 'low' | 'minimal';
  notifications: boolean;
  dataVisibility: boolean;
  uiDensity: 'compact' | 'comfortable' | 'spacious';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Timestamp in milliseconds
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
}
