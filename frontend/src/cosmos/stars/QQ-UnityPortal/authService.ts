import { AuthTokens, LoginCredentials, RegisterData, User } from './types/auth';

// Storage keys
const ACCESS_TOKEN_KEY = 'qq_verse_access_token';
const REFRESH_TOKEN_KEY = 'qq_verse_refresh_token';
const EXPIRES_AT_KEY = 'qq_verse_expires_at';
const USER_KEY = 'qq_verse_user';

// For demo purposes - remove in production and use actual API
const MOCK_DELAY = 800;
const MOCK_USERS = [
  {
    id: 'u1',
    username: 'quantumuser',
    email: 'quantum@example.com',
    role: 'user' as const,
    preferences: {
      theme: 'quantum',
      animationLevel: 'high',
      notifications: true,
      dataVisibility: true,
      uiDensity: 'comfortable'
    },
    createdAt: '2025-01-15T10:30:00Z',
    lastLogin: '2025-05-19T08:45:00Z'
  },
  {
    id: 'u2',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin' as const,
    preferences: {
      theme: 'dark',
      animationLevel: 'medium',
      notifications: true,
      dataVisibility: true,
      uiDensity: 'compact'
    },
    createdAt: '2024-11-05T14:20:00Z',
    lastLogin: '2025-05-18T16:30:00Z'
  }
];

/**
 * Authentication service for handling JWT tokens and user authentication
 */
export const authService = {
  /**
   * Store authentication tokens in localStorage
   */
  saveTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(EXPIRES_AT_KEY, tokens.expiresAt.toString());
  },

  /**
   * Remove authentication tokens from localStorage
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  },

  /**
   * Get stored tokens from localStorage
   */
  getTokens(): AuthTokens | null {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const expiresAtStr = localStorage.getItem(EXPIRES_AT_KEY);

    if (!accessToken || !refreshToken || !expiresAtStr) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAtStr, 10)
    };
  },

  /**
   * Check if access token is expired
   */
  isTokenExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return true;
    
    // Add 10-second buffer to account for network latency
    return Date.now() >= tokens.expiresAt - 10000;
  },  /**
   * Save user data in localStorage
   */
  saveUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get user data from localStorage
   */
  getUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error('Failed to parse user data from localStorage', e);
      return null;
    }
  },

  /**
   * Clear user data from localStorage
   */
  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Login user with credentials
   * @returns User and token information
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // For demo purposes - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

      // Find user with matching credentials
      const mockUser = MOCK_USERS.find(u => 
        u.username === credentials.username && 
        // In a real app, we would never compare passwords directly
        // This is only for demonstration
        credentials.password === 'password'
      );
      
      if (!mockUser) {
        throw new Error('Invalid username or password');
      }

      // Update lastLogin field
      const user = {
        ...mockUser,
        lastLogin: new Date().toISOString()
      } as User;

      // Create mock tokens
      const tokens: AuthTokens = {
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
        expiresAt: Date.now() + 3600000 // 1 hour from now
      };

      // Save to localStorage
      this.saveTokens(tokens);
      this.saveUser(user);

      return { user, tokens };
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // For demo purposes - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

      // Check if username already exists
      if (MOCK_USERS.some(u => u.username === data.username)) {
        throw new Error('Username already exists');
      }

      // Create new user
      const newUser: User = {
        id: `u${MOCK_USERS.length + 1}`,
        username: data.username,
        email: data.email,
        role: 'user' as const,
        preferences: {
          theme: 'quantum',
          animationLevel: 'high',
          notifications: true,
          dataVisibility: true,
          uiDensity: 'comfortable'
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Create mock tokens
      const tokens: AuthTokens = {
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
        expiresAt: Date.now() + 3600000 // 1 hour from now
      };

      // Save to localStorage
      this.saveTokens(tokens);
      this.saveUser(newUser);

      return { user: newUser, tokens };
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  },  /**
   * Logout user - clear all stored data
   */
  logout(): void {
    this.clearTokens();
    this.clearUser();
  },

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(): Promise<AuthTokens> {
    try {
      const currentTokens = this.getTokens();
      if (!currentTokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      // For demo purposes - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      
      // Create new mock tokens
      const tokens: AuthTokens = {
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: currentTokens.refreshToken,
        expiresAt: Date.now() + 3600000 // 1 hour from now
      };

      // Save new tokens
      this.saveTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Token refresh failed', error);
      this.clearTokens(); // Clear tokens on refresh failure
      throw error;
    }
  },

  /**
   * Update user information
   */
  async updateUser(userData: Partial<User>): Promise<User> {
    try {
      const currentUser = this.getUser();
      if (!currentUser) {
        throw new Error('No user found');
      }

      // For demo purposes - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

      // Update user
      const updatedUser = {
        ...currentUser,
        ...userData,
      };

      // Save updated user
      this.saveUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('User update failed', error);
      throw error;
    }
  },

  /**
   * Initialize authentication from localStorage
   */
  initialize(): { user: User | null; tokens: AuthTokens | null } {
    const tokens = this.getTokens();
    const user = this.getUser();
    
    // If tokens exist but are expired, try to refresh them
    if (tokens && this.isTokenExpired()) {
      this.refreshTokens().catch(() => {
        // If refresh fails, clear everything
        this.clearTokens();
        this.clearUser();
      });
    }
    
    return { user, tokens };
  }
};
