/**
 * UI Store
 *
 * This module provides quantum-coherent state management for UI state,
 * maintaining consciousness continuity during UI changes.
 *
 * @version 1.0.0
 */
import { create } from 'zustand';
/**
 * UI store
 */
export const useUIStore = create()((set, get) => ({
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
    setActiveStarSystem: (starSystem) => {
        set({ activeStarSystem: starSystem });
    },
    /**
     * Set active feature action
     */
    setActiveFeature: (feature) => {
        set({ activeFeature: feature });
    },
    /**
     * Set loading action
     */
    setLoading: (isLoading, message = '') => {
        set({ isLoading, loadingMessage: message });
    },
    /**
     * Add notification action
     */
    addNotification: (notification) => {
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
    removeNotification: (id) => {
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
