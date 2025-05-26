/**
 * Quantum Theme Provider - Phase 7 Implementation
 * 
 * React Context provider for distributing quantum theme across the application.
 * Ensures consistent design language and provides theme utilities.
 * 
 * @version 1.0.0
 */
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { quantumTheme } from './quantumTheme';

// Theme Types
export type QuantumTheme = typeof quantumTheme;

export interface QuantumThemeContextType {
  theme: QuantumTheme;
  colors: QuantumTheme['colors'];
  typography: QuantumTheme['typography'];
  spacing: QuantumTheme['spacing'];
  breakpoints: QuantumTheme['breakpoints'];
  animations: QuantumTheme['animations'];
  zIndex: QuantumTheme['zIndex'];
  shadows: QuantumTheme['shadows'];
  borderRadius: QuantumTheme['borderRadius'];
}

// Create Theme Context
const QuantumThemeContext = createContext<QuantumThemeContextType | undefined>(undefined);

// Theme Provider Props
interface QuantumThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<QuantumTheme>;
}

// Custom hook to use quantum theme
export const useQuantumTheme = (): QuantumThemeContextType => {
  const context = useContext(QuantumThemeContext);
  if (context === undefined) {
    throw new Error('useQuantumTheme must be used within a QuantumThemeProvider');
  }
  return context;
};

// Utility hook for colors
export const useQuantumColors = () => {
  const { colors } = useQuantumTheme();
  return colors;
};

// Utility hook for responsive breakpoints
export const useQuantumBreakpoints = () => {
  const { breakpoints } = useQuantumTheme();
  return breakpoints;
};

// Utility hook for animations
export const useQuantumAnimations = () => {
  const { animations } = useQuantumTheme();
  return animations;
};

// CSS Variables Generator
const generateCSSVariables = (theme: QuantumTheme): string => {
  const cssVars: string[] = [];
  
  // Generate color variables
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    cssVars.push(`--quantum-primary-${key}: ${value};`);
  });
  
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    cssVars.push(`--quantum-secondary-${key}: ${value};`);
  });
  
  Object.entries(theme.colors.energy).forEach(([key, value]) => {
    cssVars.push(`--quantum-energy-${key}: ${value};`);
  });
  
  Object.entries(theme.colors.stars).forEach(([key, value]) => {
    cssVars.push(`--quantum-star-${key}: ${value};`);
  });
  
  Object.entries(theme.colors.background).forEach(([key, value]) => {
    cssVars.push(`--quantum-bg-${key}: ${value};`);
  });
  
  // Generate spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars.push(`--quantum-space-${key}: ${value};`);
  });
  
  // Generate typography variables
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    cssVars.push(`--quantum-text-${key}: ${value};`);
  });
  
  // Generate shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    cssVars.push(`--quantum-shadow-${key}: ${value};`);
  });
  
  // Generate border radius variables
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    cssVars.push(`--quantum-radius-${key}: ${value};`);
  });
  
  return cssVars.join('\n  ');
};

// Quantum Theme Provider Component
export const QuantumThemeProvider: React.FC<QuantumThemeProviderProps> = ({
  children,
  customTheme = {}
}) => {
  // Merge custom theme with default theme
  const mergedTheme: QuantumTheme = {
    ...quantumTheme,
    ...customTheme,
    colors: {
      ...quantumTheme.colors,
      ...customTheme.colors
    },
    typography: {
      ...quantumTheme.typography,
      ...customTheme.typography
    },
    spacing: {
      ...quantumTheme.spacing,
      ...customTheme.spacing
    },
    breakpoints: {
      ...quantumTheme.breakpoints,
      ...customTheme.breakpoints
    },
    animations: {
      ...quantumTheme.animations,
      ...customTheme.animations
    },
    zIndex: {
      ...quantumTheme.zIndex,
      ...customTheme.zIndex
    },
    shadows: {
      ...quantumTheme.shadows,
      ...customTheme.shadows
    },
    borderRadius: {
      ...quantumTheme.borderRadius,
      ...customTheme.borderRadius
    }
  };

  // Context value
  const contextValue: QuantumThemeContextType = {
    theme: mergedTheme,
    colors: mergedTheme.colors,
    typography: mergedTheme.typography,
    spacing: mergedTheme.spacing,
    breakpoints: mergedTheme.breakpoints,
    animations: mergedTheme.animations,
    zIndex: mergedTheme.zIndex,
    shadows: mergedTheme.shadows,
    borderRadius: mergedTheme.borderRadius
  };

  // Inject CSS variables into document
  useEffect(() => {
    const cssVariables = generateCSSVariables(mergedTheme);
    const styleElement = document.createElement('style');
    styleElement.id = 'quantum-theme-variables';
    styleElement.innerHTML = `
      :root {
        ${cssVariables}
      }
    `;
    
    // Remove existing style element if it exists
    const existingStyle = document.getElementById('quantum-theme-variables');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Add new style element
    document.head.appendChild(styleElement);
    
    // Cleanup on unmount
    return () => {
      const styleToRemove = document.getElementById('quantum-theme-variables');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mergedTheme]);

  return (
    <QuantumThemeContext.Provider value={contextValue}>
      {children}
    </QuantumThemeContext.Provider>
  );
};

// Theme utilities for styled components or CSS-in-JS
export const getQuantumColor = (path: string, theme: QuantumTheme): string => {
  const keys = path.split('.');
  let value: any = theme.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value || '#000000';
};

export const getQuantumSpacing = (key: keyof QuantumTheme['spacing'], theme: QuantumTheme): string => {
  return theme.spacing[key] || '0px';
};

export const getQuantumShadow = (key: keyof QuantumTheme['shadows'], theme: QuantumTheme): string => {
  return theme.shadows[key] || 'none';
};

// Responsive utilities
export const createMediaQuery = (breakpoint: keyof QuantumTheme['breakpoints'], theme: QuantumTheme): string => {
  return `@media (min-width: ${theme.breakpoints[breakpoint]})`;
};

// Animation utilities
export const createQuantumAnimation = (
  name: string,
  duration: keyof QuantumTheme['animations']['duration'],
  easing: keyof QuantumTheme['animations']['easing'],
  theme: QuantumTheme
): string => {
  return `${name} ${theme.animations.duration[duration]} ${theme.animations.easing[easing]}`;
};

export default QuantumThemeProvider;