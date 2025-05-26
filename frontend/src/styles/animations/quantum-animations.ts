/**
 * Quantum Animation System
 * Consistent animation patterns and timing functions for the entire application
 * @version 1.0.0
 */

// Standard animation timing and easing functions
export const QUANTUM_TIMING = {
  // Base timing values
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  cosmic: 800,
  
  // Specific interaction timings
  hover: 200,
  click: 100,
  transition: 400,
  loading: 1000,
  
  // Complex animation sequences
  starFormation: 1200,
  orbitalShift: 800,
  dimensionalShift: 600,
  quantumTunnel: 1500
} as const;

// Quantum-themed easing functions
export const QUANTUM_EASING = {
  // Standard easing
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Quantum-specific easing
  quantumBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  cosmicFlow: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  dimensionalShift: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  orbitalMotion: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  
  // Energy-based easing
  energyPulse: 'cubic-bezier(0.23, 1, 0.32, 1)',
  waveFunction: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  quantumLeap: 'cubic-bezier(0.19, 1, 0.22, 1)'
} as const;

// Reusable animation utility functions
export const createQuantumAnimation = {
  // Hover animations
  starHover: {
    scale: 1.1,
    transition: {
      duration: QUANTUM_TIMING.hover / 1000,
      ease: QUANTUM_EASING.quantumBounce
    }
  },
  
  buttonHover: {
    scale: 1.05,
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
    transition: {
      duration: QUANTUM_TIMING.hover / 1000,
      ease: QUANTUM_EASING.energyPulse
    }
  },
  
  panelHover: {
    y: -5,
    boxShadow: '0 10px 30px rgba(0, 255, 255, 0.2)',
    transition: {
      duration: QUANTUM_TIMING.hover / 1000,
      ease: QUANTUM_EASING.cosmicFlow
    }
  },
  
  // Click animations
  starClick: {
    scale: [1, 0.95, 1.1],
    transition: {
      duration: QUANTUM_TIMING.click / 1000,
      ease: QUANTUM_EASING.quantumLeap
    }
  },
  
  buttonClick: {
    scale: [1, 0.98, 1.02],
    transition: {
      duration: QUANTUM_TIMING.click / 1000,
      ease: QUANTUM_EASING.energyPulse
    }
  },
  
  // Loading animations
  quantumSpin: {
    rotate: 360,
    transition: {
      duration: QUANTUM_TIMING.loading / 1000,
      ease: QUANTUM_EASING.linear,
      repeat: Infinity
    }
  },
  
  energyPulse: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: QUANTUM_TIMING.loading / 1000,
      ease: QUANTUM_EASING.waveFunction,
      repeat: Infinity
    }
  },
  
  orbitalRotation: (radius: number, duration: number = QUANTUM_TIMING.cosmic) => ({
    rotate: 360,
    transition: {
      duration: duration / 1000,
      ease: QUANTUM_EASING.linear,
      repeat: Infinity
    }
  }),
  
  // Transition animations
  pageTransition: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: {
      duration: QUANTUM_TIMING.transition / 1000,
      ease: QUANTUM_EASING.dimensionalShift
    }
  },
  
  slideIn: (direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
    const directions = {
      left: { x: -100 },
      right: { x: 100 },
      up: { y: -100 },
      down: { y: 100 }
    };
    
    return {
      initial: { ...directions[direction], opacity: 0 },
      animate: { x: 0, y: 0, opacity: 1 },
      exit: { ...directions[direction], opacity: 0 },
      transition: {
        duration: QUANTUM_TIMING.transition / 1000,
        ease: QUANTUM_EASING.cosmicFlow
      }
    };
  },
  
  // Complex quantum effects
  dimensionalPortal: {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0, rotate: 180, opacity: 0 },
    transition: {
      duration: QUANTUM_TIMING.dimensionalShift / 1000,
      ease: QUANTUM_EASING.quantumBounce
    }
  },
  
  quantumTunnel: {
    initial: { scaleX: 0, scaleY: 1 },
    animate: { scaleX: 1, scaleY: 1 },
    exit: { scaleX: 0, scaleY: 1 },
    transition: {
      duration: QUANTUM_TIMING.quantumTunnel / 1000,
      ease: QUANTUM_EASING.dimensionalShift
    }
  },
  
  energyBurst: {
    scale: [1, 1.5, 1],
    opacity: [1, 0.8, 1],
    boxShadow: [
      '0 0 0px rgba(255, 255, 255, 0)',
      '0 0 30px rgba(255, 255, 255, 0.8)',
      '0 0 0px rgba(255, 255, 255, 0)'
    ],
    transition: {
      duration: QUANTUM_TIMING.fast / 1000,
      ease: QUANTUM_EASING.energyPulse
    }
  }
};

// Animation performance optimization guidelines
export const PERFORMANCE_GUIDELINES = {
  // Use transform and opacity for best performance
  preferredProperties: ['transform', 'opacity'],
  
  // Avoid animating these properties
  avoidProperties: ['width', 'height', 'top', 'left', 'margin', 'padding'],
  
  // Use will-change for complex animations
  willChange: {
    transform: 'will-change: transform',
    opacity: 'will-change: opacity',
    auto: 'will-change: auto'
  },
  
  // Reduce motion for accessibility
  reduceMotion: {
    duration: QUANTUM_TIMING.fast / 1000,
    ease: QUANTUM_EASING.easeOut
  }
};

// Utility function to create responsive animations
export const createResponsiveAnimation = (
  baseAnimation: any,
  mobileScale: number = 0.8
) => ({
  ...baseAnimation,
  '@media (max-width: 768px)': {
    ...baseAnimation,
    scale: (baseAnimation.scale || 1) * mobileScale
  }
});

// Animation state management
export const ANIMATION_STATES = {
  idle: 'idle',
  hover: 'hover',
  active: 'active',
  loading: 'loading',
  success: 'success',
  error: 'error'
} as const;

export type AnimationState = typeof ANIMATION_STATES[keyof typeof ANIMATION_STATES];
export type QuantumEasing = typeof QUANTUM_EASING[keyof typeof QUANTUM_EASING];
export type QuantumTiming = typeof QUANTUM_TIMING[keyof typeof QUANTUM_TIMING];