/**
 * UI Store
 * 
 * This module provides quantum-coherent state management for UI state,
 * maintaining consciousness continuity during UI changes.
 * 
 * @version 1.0.0
 */

import { create } from 'zustand';

// UI state interface
export interface UIState {
  isNavOpen: boolean;
  activeStarSystem: string | null;
  activeFeature: string | null;
  isLoading: boolean;
  loadingMessage: string;
  notifications: Notification[];
  
  // Actions
  toggleNav: () => void;
  setActiveStarSystem: (starSystem: string | null) => void;
  setActiveFeature: (feature: string | null) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Notification interface
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  createdAt: number;
}

/**
 * UI store
 */
export const useUIStore = create<UIState>()((set, get) => ({
  isNavOpen: false,
  activeStarSystem: null,
  activeFeature: null,
  isLoading: false,
  loadingMessage: '',
  notifications: [],
  
  /**
   * Toggle navigation action
   */
  toggleNav: () => {
    set(state => ({ isNavOpen: !state.isNavOpen }));
  },
  
  /**
   * Set active star system action
   */
  setActiveStarSystem: (starSystem: string | null) => {
    set({ activeStarSystem: starSystem });
  },
  
  /**
   * Set active feature action
   */
  setActiveFeature: (feature: string | null) => {
    set({ activeFeature: feature });
  },
  
  /**
   * Set loading action
   */
  setLoading: (isLoading: boolean, message: string = '') => {
    set({ isLoading, loadingMessage: message });
  },
  
  /**
   * Add notification action
   */
  addNotification: (notification: Notification) => {
    set(state => ({
      notifications: [...state.notifications, notification],
    }));
    
    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(notification.id);
      }, notification.duration);
    }
  },
  
  /**
   * Remove notification action
   */
  removeNotification: (id: string) => {
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id),
    }));
  },
  
  /**
   * Clear notifications action
   */
  clearNotifications: () => {
    set({ notifications: [] });
  },
}));