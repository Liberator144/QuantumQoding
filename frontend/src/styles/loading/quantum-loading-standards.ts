/**
 * Quantum Loading and Transition State Unification System
 * Standardized loading components, page transitions, and state management
 * @version 1.0.0
 */

import { QUANTUM_COLORS, TEXT_STYLES } from '../theme/quantum-theme';
import { QUANTUM_TIMING, QUANTUM_EASING, createQuantumAnimation } from '../animations/quantum-animations';
import { QUANTUM_BREAKPOINTS } from '../responsive/quantum-responsive';

// Loading component types
export type LoadingType = 'spinner' | 'skeleton' | 'progress' | 'pulse' | 'quantum' | 'orbital';
export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TransitionType = 'fade' | 'slide' | 'scale' | 'quantum' | 'dimensional';

// Standard loading component configurations
export const LOADING_STANDARDS = {
  // Spinner configurations
  spinner: {
    sizes: {
      xs: '16px',
      sm: '20px',
      md: '24px',
      lg: '32px',
      xl: '48px'
    },
    colors: {
      primary: QUANTUM_COLORS.primary.quantum,
      secondary: QUANTUM_COLORS.secondary.aurora,
      neutral: QUANTUM_COLORS.grayscale.gray400
    },
    animation: {
      duration: QUANTUM_TIMING.loading,
      easing: QUANTUM_EASING.linear,
      infinite: true
    }
  },

  // Skeleton loading configurations
  skeleton: {
    baseColor: QUANTUM_COLORS.grayscale.gray800,
    highlightColor: QUANTUM_COLORS.grayscale.gray700,
    borderRadius: '4px',
    animation: {
      duration: 1500,
      easing: QUANTUM_EASING.waveFunction,
      infinite: true
    },
    variants: {
      text: { height: '1em', width: '100%' },
      title: { height: '1.5em', width: '60%' },
      avatar: { width: '40px', height: '40px', borderRadius: '50%' },
      button: { height: '40px', width: '120px', borderRadius: '6px' },
      card: { height: '200px', width: '100%', borderRadius: '8px' }
    }
  },

  // Progress bar configurations
  progress: {
    height: {
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px'
    },
    background: QUANTUM_COLORS.grayscale.gray800,
    fillColor: QUANTUM_COLORS.primary.quantum,
    borderRadius: '999px',
    animation: {
      duration: QUANTUM_TIMING.transition,
      easing: QUANTUM_EASING.cosmicFlow
    }
  },

  // Quantum-specific loading patterns
  quantum: {
    orbitalRadius: {
      xs: '20px',
      sm: '30px',
      md: '40px',
      lg: '60px',
      xl: '80px'
    },
    particleCount: {
      xs: 3,
      sm: 5,
      md: 8,
      lg: 12,
      xl: 16
    },
    colors: [
      QUANTUM_COLORS.primary.quantum,
      QUANTUM_COLORS.secondary.aurora,
      QUANTUM_COLORS.primary.stellar,
      QUANTUM_COLORS.secondary.plasma
    ],
    animation: {
      orbital: QUANTUM_TIMING.cosmic,
      pulse: QUANTUM_TIMING.loading,
      glow: QUANTUM_TIMING.slow
    }
  }
} as const;

// Page transition configurations
export const TRANSITION_STANDARDS = {
  // Fade transitions
  fade: {
    duration: QUANTUM_TIMING.transition,
    easing: QUANTUM_EASING.easeInOut,
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },

  // Slide transitions
  slide: {
    duration: QUANTUM_TIMING.transition,
    easing: QUANTUM_EASING.cosmicFlow,
    variants: {
      left: {
        initial: { x: '-100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0 }
      },
      right: {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 }
      },
      up: {
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '-100%', opacity: 0 }
      },
      down: {
        initial: { y: '-100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '100%', opacity: 0 }
      }
    }
  },

  // Scale transitions
  scale: {
    duration: QUANTUM_TIMING.transition,
    easing: QUANTUM_EASING.quantumBounce,
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 }
  },

  // Quantum-themed transitions
  quantum: {
    duration: QUANTUM_TIMING.dimensionalShift,
    easing: QUANTUM_EASING.dimensionalShift,
    initial: {
      scale: 0,
      rotate: -180,
      opacity: 0,
      filter: 'blur(10px)'
    },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      filter: 'blur(0px)'
    },
    exit: {
      scale: 0,
      rotate: 180,
      opacity: 0,
      filter: 'blur(10px)'
    }
  },

  // Dimensional portal transition
  dimensional: {
    duration: QUANTUM_TIMING.quantumTunnel,
    easing: QUANTUM_EASING.quantumLeap,
    initial: {
      scaleX: 0,
      scaleY: 1,
      opacity: 0,
      rotateY: 90
    },
    animate: {
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      rotateY: 0
    },
    exit: {
      scaleX: 0,
      scaleY: 1,
      opacity: 0,
      rotateY: -90
    }
  }
} as const;

// Loading state management
export const LOADING_STATE_MANAGEMENT = {
  // Global loading states
  globalStates: {
    app: 'app-loading',
    page: 'page-loading',
    component: 'component-loading',
    data: 'data-loading',
    action: 'action-loading'
  },

  // Loading priorities
  priorities: {
    critical: 1,    // App initialization
    high: 2,        // Page navigation
    medium: 3,      // Component loading
    low: 4,         // Background data
    background: 5   // Non-blocking operations
  },

  // Timeout configurations
  timeouts: {
    critical: 10000,   // 10 seconds
    high: 8000,        // 8 seconds
    medium: 5000,      // 5 seconds
    low: 3000,         // 3 seconds
    background: 1000   // 1 second
  },

  // Error handling
  errorHandling: {
    retryAttempts: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
    fallbackContent: true
  }
} as const;

// Skeleton loading patterns
export const SKELETON_PATTERNS = {
  // Common page layouts
  pageLayouts: {
    dashboard: [
      { type: 'title', width: '40%' },
      { type: 'text', width: '60%' },
      { type: 'card', count: 3 },
      { type: 'text', width: '80%' },
      { type: 'text', width: '90%' }
    ],

    profile: [
      { type: 'avatar', size: 'lg' },
      { type: 'title', width: '30%' },
      { type: 'text', width: '50%' },
      { type: 'button', count: 2 },
      { type: 'text', width: '100%', lines: 3 }
    ],

    list: [
      { type: 'text', width: '25%' },
      { type: 'card', count: 5, height: '60px' }
    ],

    article: [
      { type: 'title', width: '70%' },
      { type: 'text', width: '40%' },
      { type: 'card', height: '200px' },
      { type: 'text', width: '100%', lines: 8 }
    ]
  },

  // Component-specific patterns
  componentPatterns: {
    navigation: [
      { type: 'text', width: '20%', count: 5 }
    ],

    sidebar: [
      { type: 'title', width: '60%' },
      { type: 'text', width: '80%', count: 8 }
    ],

    table: [
      { type: 'text', width: '100%', height: '40px', count: 6 }
    ],

    form: [
      { type: 'text', width: '30%' },
      { type: 'button', width: '100%', height: '40px' },
      { type: 'text', width: '25%' },
      { type: 'button', width: '100%', height: '40px' },
      { type: 'button', width: '120px' }
    ]
  }
} as const;

// Progress indication systems
export const PROGRESS_SYSTEMS = {
  // Step-based progress
  steps: {
    showNumbers: true,
    showLabels: true,
    showProgress: true,
    completedColor: QUANTUM_COLORS.semantic.success,
    activeColor: QUANTUM_COLORS.primary.quantum,
    inactiveColor: QUANTUM_COLORS.grayscale.gray600
  },

  // Percentage-based progress
  percentage: {
    showPercentage: true,
    showLabel: true,
    animateChanges: true,
    smoothTransition: true,
    updateThreshold: 1 // Update every 1%
  },

  // Time-based progress
  time: {
    showTimeRemaining: true,
    showElapsedTime: false,
    estimateCompletion: true,
    updateInterval: 1000 // 1 second
  },

  // Indeterminate progress
  indeterminate: {
    showPulse: true,
    showSpinner: true,
    showMessage: true,
    rotateMessages: true,
    messageInterval: 3000 // 3 seconds
  }
} as const;

// Loading utility functions
export const loadingUtils = {
  // Create loading component styles
  createLoadingStyles(type: LoadingType, size: LoadingSize = 'md') {
    const standards = LOADING_STANDARDS[type];

    if (type === 'spinner') {
      return {
        width: standards.sizes[size],
        height: standards.sizes[size],
        border: `2px solid ${standards.colors.neutral}`,
        borderTop: `2px solid ${standards.colors.primary}`,
        borderRadius: '50%',
        animation: `spin ${standards.animation.duration}ms ${standards.animation.easing} infinite`
      };
    }

    if (type === 'skeleton') {
      return {
        backgroundColor: standards.baseColor,
        borderRadius: standards.borderRadius,
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: `linear-gradient(90deg, transparent, ${standards.highlightColor}, transparent)`,
          animation: `shimmer ${standards.animation.duration}ms ${standards.animation.easing} infinite`
        }
      };
    }

    return {};
  },

  // Create transition styles
  createTransitionStyles(type: TransitionType, direction?: string) {
    const transition = TRANSITION_STANDARDS[type];

    if (type === 'slide' && direction) {
      return transition.variants[direction as keyof typeof transition.variants];
    }

    return {
      initial: transition.initial,
      animate: transition.animate,
      exit: transition.exit,
      transition: {
        duration: transition.duration / 1000,
        ease: transition.easing
      }
    };
  },

  // Generate skeleton pattern
  generateSkeletonPattern(patternName: string) {
    const patterns = SKELETON_PATTERNS.pageLayouts[patternName as keyof typeof SKELETON_PATTERNS.pageLayouts] ||
                    SKELETON_PATTERNS.componentPatterns[patternName as keyof typeof SKELETON_PATTERNS.componentPatterns];

    if (!patterns) return [];

    return patterns.map((item, index) => ({
      id: `skeleton-${index}`,
      type: item.type,
      width: item.width || '100%',
      height: item.height || LOADING_STANDARDS.skeleton.variants[item.type as keyof typeof LOADING_STANDARDS.skeleton.variants]?.height || '1em',
      count: item.count || 1,
      lines: item.lines || 1
    }));
  },

  // Manage loading states
  createLoadingManager() {
    const loadingStates = new Map<string, boolean>();
    const priorities = new Map<string, number>();

    return {
      // Set loading state
      setLoading(key: string, loading: boolean, priority: number = 3) {
        loadingStates.set(key, loading);
        priorities.set(key, priority);

        // Emit loading state change event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('loadingStateChange', {
            detail: { key, loading, priority }
          }));
        }
      },

      // Get loading state
      isLoading(key?: string) {
        if (key) {
          return loadingStates.get(key) || false;
        }

        // Return true if any high-priority loading is active
        for (const [loadingKey, isLoading] of loadingStates) {
          const priority = priorities.get(loadingKey) || 3;
          if (isLoading && priority <= 2) {
            return true;
          }
        }

        return false;
      },

      // Get all loading states
      getAllLoadingStates() {
        return Array.from(loadingStates.entries()).map(([key, loading]) => ({
          key,
          loading,
          priority: priorities.get(key) || 3
        }));
      },

      // Clear all loading states
      clearAll() {
        loadingStates.clear();
        priorities.clear();
      }
    };
  }
};

// Loading component factory
export const createLoadingComponent = (type: LoadingType, options: any = {}) => {
  const standards = LOADING_STANDARDS[type];

  return {
    type,
    standards,
    options,

    // Get component styles
    getStyles(size: LoadingSize = 'md') {
      return loadingUtils.createLoadingStyles(type, size);
    },

    // Get animation keyframes
    getKeyframes() {
      if (type === 'spinner') {
        return {
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        };
      }

      if (type === 'skeleton') {
        return {
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' }
          }
        };
      }

      return {};
    },

    // Create quantum orbital loading
    createQuantumOrbital(size: LoadingSize = 'md') {
      const config = standards.quantum || LOADING_STANDARDS.quantum;
      const radius = config.orbitalRadius[size];
      const particleCount = config.particleCount[size];

      return {
        container: {
          width: `calc(${radius} * 2)`,
          height: `calc(${radius} * 2)`,
          position: 'relative',
          margin: 'auto'
        },
        particles: Array.from({ length: particleCount }, (_, i) => ({
          id: i,
          angle: (360 / particleCount) * i,
          color: config.colors[i % config.colors.length],
          delay: (config.animation.orbital / particleCount) * i
        }))
      };
    }
  };
};

// Export types
export type LoadingStandards = typeof LOADING_STANDARDS;
export type TransitionStandards = typeof TRANSITION_STANDARDS;
export type SkeletonPatterns = typeof SKELETON_PATTERNS;
