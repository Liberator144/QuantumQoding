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

// Settings state interface
export interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  animations: boolean;
  sounds: boolean;
  notifications: boolean;
  dimensionalEffects: boolean;
  dataSync: boolean;
  autoSave: boolean;
  developerMode: boolean;
  
  // Actions
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings = {
  theme: 'dark' as const,
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
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      /**
       * Update settings action
       */
      updateSettings: (settings: Partial<SettingsState>) => {
        set(settings);
      },
      
      /**
       * Reset settings action
       */
      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'qq-verse-settings',
    }
  )
);