/**
 * Settings Store
 *
 * This module provides quantum-coherent state management for user settings,
 * maintaining consciousness continuity during settings changes.
 *
 * @version 1.0.0
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Default settings
const defaultSettings = {
    theme: 'dark',
    animations: true,
    sounds: true,
    notifications: true,
    dimensionalEffects: true,
    dataSync: true,
    autoSave: true,
    developerMode: false,
};
/**
 * Settings store
 */
export const useSettingsStore = create()(persist((set) => ({
    ...defaultSettings,
    /**
     * Update settings action
     */
    updateSettings: (settings) => {
        set(settings);
    },
    /**
     * Reset settings action
     */
    resetSettings: () => {
        set(defaultSettings);
    },
}), {
    name: 'qq-verse-settings',
}));
