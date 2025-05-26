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
/**
 * Auth store
 */
export const useAuthStore = create()(persist((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    /**
     * Login action
     */
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Mock response
            const user = {
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
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            });
        }
    },
    /**
     * Register action
     */
    register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Mock response
            const user = {
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
        }
        catch (error) {
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
    updateProfile: async (data) => {
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
        }
        catch (error) {
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
}), {
    name: 'qq-verse-auth',
}));
