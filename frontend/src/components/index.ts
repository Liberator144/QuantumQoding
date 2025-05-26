/**
 * Quantum Component Library - Master Index
 * Centralized exports for all quantum components and systems
 * @version 1.0.0
 */

// Core quantum components only - remove problematic imports
export * from './quantum/SparklesCore';
export * from './quantum/StardustCursor';

// Re-export commonly used types
export type {
  QuantumColor,
  QuantumTypography,
  TextStyle,
  ResponsiveText,
  QuantumBreakpoint,
  QuantumSpacing,
  MobileInteraction,
  DeviceOptimization,
  ResponsiveEffect,
  AnimationState,
  QuantumEasing,
  QuantumTiming
} from '../styles/theme/quantum-theme';

// Component prop types for external use
export interface QuantumComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
}

// Animation configuration
export const QUANTUM_CONFIG = {
  // Performance settings
  performance: {
    enableComplexAnimations: true,
    maxParticleCount: 200,
    enableBlur: true,
    enableShadows: true
  },

  // Accessibility settings
  accessibility: {
    respectReducedMotion: true,
    enableHighContrast: false,
    enableKeyboardNavigation: true,
    enableScreenReader: true
  },

  // Theme settings
  theme: {
    primaryColor: '#00ffff',
    secondaryColor: '#ffd700',
    darkMode: true,
    customColors: {}
  }
} as const;

// Utility functions
export const quantumUtils = {
  // Color utilities
  hexToRgba: (hex: string, alpha: number = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  // Spacing utilities
  getSpacing: (scale: keyof typeof import('../styles/responsive/quantum-responsive').QUANTUM_SPACING.scale) => {
    return import('../styles/responsive/quantum-responsive').then(module =>
      module.QUANTUM_SPACING.scale[scale]
    );
  },

  // Animation utilities
  createCustomAnimation: (config: any) => ({
    initial: config.initial || { opacity: 0 },
    animate: config.animate || { opacity: 1 },
    exit: config.exit || { opacity: 0 },
    transition: config.transition || { duration: 0.3 }
  }),

  // Responsive utilities
  createBreakpointStyles: (styles: Record<string, any>) => {
    return Object.entries(styles).reduce((acc, [breakpoint, style]) => {
      const query = `@media (min-width: ${breakpoint})`;
      return { ...acc, [query]: style };
    }, {});
  }
};

// Version information
export const QUANTUM_VERSION = '1.0.0';
export const QUANTUM_BUILD_DATE = new Date().toISOString();

// Component registry for dynamic loading
export const QUANTUM_COMPONENTS = {
  // Navigation
  QuantumNavigation: () => import('./navigation/QuantumNavigation'),

  // Loading
  QuantumLoading: () => import('./loading/QuantumLoading'),
  QuantumPageTransition: () => import('./loading/QuantumLoading'),

  // Feedback
  QuantumFeedback: () => import('./feedback/QuantumFeedback'),

  // Forms
  QuantumInput: () => import('./forms/QuantumForm'),

  // UI
  QuantumButton: () => import('./ui/QuantumButton'),

  // Layout
  QuantumContainer: () => import('./layout/QuantumLayout'),
  QuantumGrid: () => import('./layout/QuantumLayout'),
  QuantumFlex: () => import('./layout/QuantumLayout'),
  QuantumSection: () => import('./layout/QuantumLayout'),
  QuantumCard: () => import('./layout/QuantumLayout')
} as const;

// Development utilities
export const quantumDev = {
  // Debug mode
  enableDebug: () => {
    (window as any).__QUANTUM_DEBUG__ = true;
    console.log('🌌 Quantum Debug Mode Enabled');
  },

  // Performance monitoring
  startPerformanceMonitoring: () => {
    if (typeof window !== 'undefined') {
      (window as any).__QUANTUM_PERF__ = {
        renderTimes: [],
        interactionTimes: [],
        memoryUsage: []
      };
    }
  },

  // Component inspector
  inspectComponent: (componentName: string) => {
    console.log(`🔍 Inspecting ${componentName}:`, QUANTUM_COMPONENTS[componentName as keyof typeof QUANTUM_COMPONENTS]);
  }
};

// Export default configuration
export default {
  version: QUANTUM_VERSION,
  config: QUANTUM_CONFIG,
  utils: quantumUtils,
  components: QUANTUM_COMPONENTS,
  dev: quantumDev
};