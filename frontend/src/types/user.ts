/**
 * User Types
 *
 * This module provides type definitions for user management.
 *
 * @version 1.0.0
 */

// User Core Types
export interface User {
  readonly id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  preferences: UserPreferences;
  metadata: UserMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMetadata {
  lastLogin?: Date;
  loginCount: number;
  ipAddress?: string;
  userAgent?: string;
  location?: UserLocation;
  quantumCoherence?: number;
}

export interface UserLocation {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'quantum';
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  quantumAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'quantum';
  dataSharing: boolean;
  analytics: boolean;
  dimensionalTracking: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  quantumEnhancement: boolean;
}

// User Role and Status
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest',
  QUANTUM_ARCHITECT = 'quantum_architect'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  QUANTUM_ENTANGLED = 'quantum_entangled'
}

// Authentication Types
export interface AuthUser {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}

// User Management Types
export interface UserUpdate {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserQuery {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  limit?: number;
  offset?: number;
  sortBy?: 'username' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}

// Type Guards
export const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const isValidUserStatus = (status: string): status is UserStatus => {
  return Object.values(UserStatus).includes(status as UserStatus);
};

export const isUser = (obj: unknown): obj is User => {
  return typeof obj === 'object' && obj !== null && 
         'id' in obj && 'username' in obj && 'email' in obj;
};