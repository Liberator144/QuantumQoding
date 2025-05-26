/**
 * QuantumQoding Design System - Phase 7 Implementation
 * 
 * Complete design system export for consistent UI/UX across the application.
 * Provides theme, utilities, components, and accessibility features.
 * 
 * @version 1.0.0
 */

// Theme Exports
export { quantumTheme, quantumColors, quantumTypography, quantumSpacing, quantumBreakpoints, quantumAnimations, quantumZIndex, quantumShadows, quantumBorderRadius } from './theme/quantumTheme';
export { QuantumThemeProvider, useQuantumTheme, useQuantumColors, useQuantumBreakpoints, useQuantumAnimations, getQuantumColor, getQuantumSpacing, getQuantumShadow, createMediaQuery as createThemeMediaQuery, createQuantumAnimation } from './theme/QuantumThemeProvider';
export type { QuantumTheme, QuantumThemeContextType } from './theme/QuantumThemeProvider';

// Responsive Utilities
export { useBreakpoint, createMediaQuery, useResponsiveValue, useResponsiveGrid, useResponsiveTypography, useResponsiveSpacing, useOrientation, useTouchDevice, useContainerQuery, useResponsiveImage } from './utils/responsive';
export type { BreakpointKey, BreakpointValue, DeviceType, GridProps } from './utils/responsive';

// Accessibility Utilities
export { createAriaProps, useFocusManagement, useFocusTrap, useKeyboardNavigation, useScreenReader, useReducedMotion, useHighContrast, createSkipLinkProps, createAccessibleButtonProps, createAccessibleFieldProps, getContrastRatio, meetsWCAGContrast, useLiveRegion } from './utils/accessibility.tsx';

// Performance Utilities
export { createLazyComponent, useIntersectionObserver, LazyImage, useDebounce, useThrottle, useAnimationFrame, useIdleCallback, useMemoryMonitor, usePerformanceObserver, preloadResource, analyzeBundleSize, useCriticalResourceLoader, useVirtualScrolling, createAsyncComponent } from './utils/performance.tsx';

// Design System Configuration
export const designSystemConfig = {
  name: 'QuantumQoding Design System',
  version: '1.0.0',
  description: 'Comprehensive design system for quantum-coherent user interfaces',
  features: [
    'Quantum Theme System',
    'Responsive Design Utilities',
    'Accessibility Features',
    'Performance Optimization',
    'TypeScript Support',
    'CSS Variables Integration'
  ]
};

// Quick Setup Function
export const setupQuantumDesignSystem = () => {
  console.log(`🌌 ${designSystemConfig.name} v${designSystemConfig.version} initialized`);
  console.log('Features:', designSystemConfig.features.join(', '));
  
  // Add global CSS classes for accessibility
  const style = document.createElement('style');
  style.innerHTML = `
    /* Screen Reader Only */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    
    .sr-only.focus:focus,
    .sr-only:focus {
      position: static;
      width: auto;
      height: auto;
      padding: inherit;
      margin: inherit;
      overflow: visible;
      clip: auto;
      white-space: normal;
    }
    
    /* Focus Visible */
    .focus-visible:focus {
      outline: 2px solid var(--quantum-primary-500, #0ea5e9);
      outline-offset: 2px;
    }
    
    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
    
    /* High Contrast */
    @media (prefers-contrast: high) {
      .quantum-component {
        border: 1px solid;
      }
    }
  `;
  
  document.head.appendChild(style);
};

// Default Export
export default {
  theme: quantumTheme,
  config: designSystemConfig,
  setup: setupQuantumDesignSystem
};