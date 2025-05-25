/**
 * Design System Provider
 * 
 * This component provides the design system context for the QQ-Verse project,
 * ensuring consistent styling and theming across the application.
 * 
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Theme } from '../../types/ui';
import { darkTheme, lightTheme, systemTheme } from '../themes';

// Design system context interface
interface DesignSystemContextType {
  theme: Theme;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  isDarkMode: boolean;
}

// Create context
const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

// Props interface
interface DesignSystemProviderProps {
  children: React.ReactNode;
}

/**
 * Design system provider component
 */
export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({ children }) => {
  // Get settings from store
  const { theme: themePreference } = useSettingsStore();
  
  // State for theme
  const [theme, setThemeState] = useState<Theme>(getThemeFromPreference(themePreference));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(themePreference !== 'light');
  
  // Effect to update theme when system preference changes
  useEffect(() => {
    if (themePreference !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? darkTheme : lightTheme);
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themePreference]);
  
  // Effect to update theme when preference changes
  useEffect(() => {
    setThemeState(getThemeFromPreference(themePreference));
    setIsDarkMode(
      themePreference === 'dark' || 
      (themePreference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }, [themePreference]);
  
  // Set theme function
  const setTheme = (newTheme: 'dark' | 'light' | 'system') => {
    useSettingsStore.getState().updateSettings({ theme: newTheme });
  };
  
  // Context value
  const contextValue: DesignSystemContextType = {
    theme,
    setTheme,
    isDarkMode,
  };
  
  return (
    <DesignSystemContext.Provider value={contextValue}>
      <div className={`qq-theme ${isDarkMode ? 'dark' : 'light'}`}>
        {children}
      </div>
    </DesignSystemContext.Provider>
  );
};

/**
 * Hook to use design system context
 */
export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  
  return context;
};

/**
 * Get theme from preference
 */
function getThemeFromPreference(preference: 'dark' | 'light' | 'system'): Theme {
  switch (preference) {
    case 'dark':
      return darkTheme;
    case 'light':
      return lightTheme;
    case 'system':
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? darkTheme
        : lightTheme;
    default:
      return darkTheme;
  }
}