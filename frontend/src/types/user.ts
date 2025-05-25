/**
 * User Types
 * 
 * This module provides type definitions for user management.
 * 
 * @version 1.0.0
 */

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin';
  coherenceLevel: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication credentials interface
 */
export interface AuthCredentials {
  username: string;
  password: string;
}

/**
 * Registration data interface
 */
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * User profile update interface
 */
export interface ProfileUpdate {
  name?: string;
  bio?: string;
  avatar?: string;
}

/**
 * Authentication result interface
 */
export interface AuthResult {
  user: User;
  token: string;
}

/**
 * User settings interface
 */
export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  animations: boolean;
  sounds: boolean;
  notifications: boolean;
  dimensionalEffects: boolean;
  dataSync: boolean;
  autoSave: boolean;
  developerMode: boolean;
}

/**
 * User notification interface
 */
export interface UserNotification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/**
 * User activity interface
 */
export interface UserActivity {
  id: string;
  userId: string;
  type: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  defaultStarSystem?: string;
  favoriteStarSystems: string[];
  recentStarSystems: string[];
  dashboardLayout: Record<string, any>;
  customColors: Record<string, string>;
}