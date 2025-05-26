/**
 * Quantum Responsive Design System
 * Comprehensive breakpoints, spacing, and responsive guidelines
 * @version 1.0.0
 */

// Breakpoint system for all screen sizes
export const QUANTUM_BREAKPOINTS = {
  // Mobile-first approach
  xs: '320px',    // Small mobile
  sm: '640px',    // Large mobile
  md: '768px',    // Tablet
  lg: '1024px',   // Small desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large desktop
  
  // Quantum-specific breakpoints
  quantum: '1920px', // Quantum display
  cosmic: '2560px'   // Ultra-wide cosmic display
} as const;

// Responsive spacing and layout guidelines
export const QUANTUM_SPACING = {
  // Base spacing scale (rem units)
  scale: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem'       // 384px
  },
  
  // Responsive spacing patterns
  responsive: {
    // Container padding
    containerPadding: {
      xs: '1rem',   // 16px
      sm: '1.5rem',   // 24px
      md: '2rem',   // 32px
      lg: '3rem',  // 48px
      xl: '4rem'   // 64px
    },
    
    // Section spacing
    sectionSpacing: {
      xs: '3rem',  // 48px
      sm: '4rem',  // 64px
      md: '5rem',  // 80px
      lg: '6rem',  // 96px
      xl: '8rem'   // 128px
    },
    
    // Component spacing
    componentSpacing: {
      xs: '0.5rem',   // 8px
      sm: '0.75rem',   // 12px
      md: '1rem',   // 16px
      lg: '1.5rem',   // 24px
      xl: '2rem'    // 32px
    }
  }
} as const;// Consistent mobile interaction patterns
export const MOBILE_INTERACTIONS = {
  // Touch target sizes (minimum 44px for accessibility)
  touchTargets: {
    minimum: '44px',
    comfortable: '48px',
    large: '56px'
  },
  
  // Gesture zones
  gestureZones: {
    swipeThreshold: '50px',
    tapRadius: '20px',
    longPressDelay: '500ms'
  },
  
  // Mobile-specific animations
  animations: {
    swipeTransition: '300ms ease-out',
    tapFeedback: '150ms ease-in-out',
    scrollSnap: '400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
} as const;

// Device type optimization
export const DEVICE_OPTIMIZATION = {
  // Performance tiers
  performance: {
    low: {
      maxAnimations: 3,
      reducedEffects: true,
      simplifiedTransitions: true
    },
    medium: {
      maxAnimations: 8,
      reducedEffects: false,
      simplifiedTransitions: false
    },
    high: {
      maxAnimations: Infinity,
      reducedEffects: false,
      simplifiedTransitions: false
    }
  },
  
  // Device-specific adaptations
  adaptations: {
    mobile: {
      fontSize: '16px', // Prevent zoom on iOS
      lineHeight: 1.4,
      touchAction: 'manipulation'
    },
    tablet: {
      fontSize: '16px',
      lineHeight: 1.5,
      touchAction: 'manipulation'
    },
    desktop: {
      fontSize: '16px',
      lineHeight: 1.6,
      touchAction: 'auto'
    }
  }
} as const;

// Responsive animation and effect guidelines
export const RESPONSIVE_EFFECTS = {
  // Animation scaling by device
  animationScale: {
    mobile: 0.8,    // Reduced animations on mobile
    tablet: 0.9,    // Slightly reduced on tablet
    desktop: 1.0    // Full animations on desktop
  },
  
  // Effect complexity by device
  effectComplexity: {
    mobile: {
      particles: 50,
      shadows: 'simple',
      gradients: 'linear'
    },
    tablet: {
      particles: 100,
      shadows: 'medium',
      gradients: 'radial'
    },
    desktop: {
      particles: 200,
      shadows: 'complex',
      gradients: 'conic'
    }
  },
  
  // Performance-based effect toggles
  performanceToggles: {
    lowEnd: {
      disableParticles: true,
      disableBlur: true,
      disableGradients: false,
      disableAnimations: false
    },
    midRange: {
      disableParticles: false,
      disableBlur: false,
      disableGradients: false,
      disableAnimations: false
    },
    highEnd: {
      disableParticles: false,
      disableBlur: false,
      disableGradients: false,
      disableAnimations: false
    }
  }
} as const;// Media query helpers
export const mediaQueries = {
  xs: `@media (min-width: ${QUANTUM_BREAKPOINTS.xs})`,
  sm: `@media (min-width: ${QUANTUM_BREAKPOINTS.sm})`,
  md: `@media (min-width: ${QUANTUM_BREAKPOINTS.md})`,
  lg: `@media (min-width: ${QUANTUM_BREAKPOINTS.lg})`,
  xl: `@media (min-width: ${QUANTUM_BREAKPOINTS.xl})`,
  '2xl': `@media (min-width: ${QUANTUM_BREAKPOINTS['2xl']})`,
  quantum: `@media (min-width: ${QUANTUM_BREAKPOINTS.quantum})`,
  cosmic: `@media (min-width: ${QUANTUM_BREAKPOINTS.cosmic})`,
  
  // Max-width queries
  maxXs: `@media (max-width: ${QUANTUM_BREAKPOINTS.xs})`,
  maxSm: `@media (max-width: ${QUANTUM_BREAKPOINTS.sm})`,
  maxMd: `@media (max-width: ${QUANTUM_BREAKPOINTS.md})`,
  maxLg: `@media (max-width: ${QUANTUM_BREAKPOINTS.lg})`,
  maxXl: `@media (max-width: ${QUANTUM_BREAKPOINTS.xl})`,
  
  // Range queries
  smToMd: `@media (min-width: ${QUANTUM_BREAKPOINTS.sm}) and (max-width: ${QUANTUM_BREAKPOINTS.md})`,
  mdToLg: `@media (min-width: ${QUANTUM_BREAKPOINTS.md}) and (max-width: ${QUANTUM_BREAKPOINTS.lg})`,
  lgToXl: `@media (min-width: ${QUANTUM_BREAKPOINTS.lg}) and (max-width: ${QUANTUM_BREAKPOINTS.xl})`,
  
  // Special queries
  mobile: `@media (max-width: ${QUANTUM_BREAKPOINTS.md})`,
  tablet: `@media (min-width: ${QUANTUM_BREAKPOINTS.md}) and (max-width: ${QUANTUM_BREAKPOINTS.lg})`,
  desktop: `@media (min-width: ${QUANTUM_BREAKPOINTS.lg})`,
  
  // Accessibility queries
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  highContrast: '@media (prefers-contrast: high)',
  darkMode: '@media (prefers-color-scheme: dark)',
  lightMode: '@media (prefers-color-scheme: light)'
} as const;

// Utility functions for responsive design
export const createResponsiveValue = <T>(values: Partial<Record<keyof typeof QUANTUM_BREAKPOINTS, T>>) => {
  return Object.entries(values).map(([breakpoint, value]) => ({
    [`@media (min-width: ${QUANTUM_BREAKPOINTS[breakpoint as keyof typeof QUANTUM_BREAKPOINTS]})`]: value
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {});
};

export const getSpacingForBreakpoint = (breakpoint: keyof typeof QUANTUM_BREAKPOINTS, type: 'container' | 'section' | 'component') => {
  const spacingMap = {
    container: QUANTUM_SPACING.responsive.containerPadding,
    section: QUANTUM_SPACING.responsive.sectionSpacing,
    component: QUANTUM_SPACING.responsive.componentSpacing
  };
  
  return spacingMap[type][breakpoint] || spacingMap[type].md;
};

export const getAnimationScaleForDevice = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  return RESPONSIVE_EFFECTS.animationScale[deviceType];
};

export const getEffectComplexityForDevice = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  return RESPONSIVE_EFFECTS.effectComplexity[deviceType];
};

// Export types
export type QuantumBreakpoint = keyof typeof QUANTUM_BREAKPOINTS;
export type QuantumSpacing = typeof QUANTUM_SPACING;
export type MobileInteraction = typeof MOBILE_INTERACTIONS;
export type DeviceOptimization = typeof DEVICE_OPTIMIZATION;
export type ResponsiveEffect = typeof RESPONSIVE_EFFECTS;