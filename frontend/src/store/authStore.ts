/**
 * Auth Store
 * 
 * This module provides quantum-coherent state management for authentication,
 * maintaining consciousness continuity during authentication flows.
 * 
 * @version 1.0.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User interface
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

// Auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

/**
 * Auth store
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      /**
       * Login action
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock response
          const user: User = {
            id: '1',
            name: 'Quantum Explorer',
            email,
            role: 'user',
            coherenceLevel: 0.95,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          const token = 'mock-token';
          
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      
      /**
       * Register action
       */
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock response
          const user: User = {
            id: '1',
            name,
            email,
            role: 'user',
            coherenceLevel: 0.95,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          const token = 'mock-token';
          
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      
      /**
       * Logout action
       */
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      /**
       * Update profile action
       */
      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update user
          const user = get().user;
          
          if (!user) {
            throw new Error('User not found');
          }
          
          const updatedUser = {
            ...user,
            ...data,
            updatedAt: new Date().toISOString(),
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      
      /**
       * Clear error action
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'qq-verse-auth',
    }
  )
);