/**
 * Quantum Animation Hooks
 * Custom hooks for consistent animation usage across components
 * @version 1.0.0
 */

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { 
  createQuantumAnimation, 
  QUANTUM_TIMING, 
  QUANTUM_EASING,
  PERFORMANCE_GUIDELINES,
  AnimationState 
} from '../styles/animations/quantum-animations';

// Hook for standard hover animations
export const useQuantumHover = (type: 'star' | 'button' | 'panel' = 'button') => {
  const shouldReduceMotion = useReducedMotion();
  
  const animations = {
    star: createQuantumAnimation.starHover,
    button: createQuantumAnimation.buttonHover,
    panel: createQuantumAnimation.panelHover
  };
  
  return shouldReduceMotion 
    ? { scale: 1.02, transition: PERFORMANCE_GUIDELINES.reduceMotion }
    : animations[type];
};

// Hook for click animations
export const useQuantumClick = (type: 'star' | 'button' = 'button') => {
  const shouldReduceMotion = useReducedMotion();
  
  const animations = {
    star: createQuantumAnimation.starClick,
    button: createQuantumAnimation.buttonClick
  };
  
  return shouldReduceMotion 
    ? { scale: 1.01, transition: PERFORMANCE_GUIDELINES.reduceMotion }
    : animations[type];
};

// Hook for loading animations
export const useQuantumLoading = (type: 'spin' | 'pulse' | 'orbital' = 'pulse') => {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return { opacity: [0.5, 1, 0.5], transition: { duration: 1, repeat: Infinity } };
  }
  
  const animations = {
    spin: createQuantumAnimation.quantumSpin,
    pulse: createQuantumAnimation.energyPulse,
    orbital: createQuantumAnimation.orbitalRotation(100)
  };
  
  return animations[type];
};

// Hook for page transitions
export const useQuantumTransition = (direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
  const shouldReduceMotion = useReducedMotion();
  
  return shouldReduceMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : createQuantumAnimation.slideIn(direction);
};

// Hook for complex quantum effects
export const useQuantumEffect = (effect: 'portal' | 'tunnel' | 'burst' = 'portal') => {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  }
  
  const effects = {
    portal: createQuantumAnimation.dimensionalPortal,
    tunnel: createQuantumAnimation.quantumTunnel,
    burst: createQuantumAnimation.energyBurst
  };
  
  return effects[effect];
};

// Hook for animation state management
export const useAnimationState = (initialState: AnimationState = 'idle') => {
  const [state, setState] = useState<AnimationState>(initialState);
  
  const setAnimationState = (newState: AnimationState) => {
    setState(newState);
  };
  
  const getAnimationForState = (animationType: 'hover' | 'click' | 'loading') => {
    switch (state) {
      case 'hover':
        return useQuantumHover();
      case 'active':
        return useQuantumClick();
      case 'loading':
        return useQuantumLoading();
      default:
        return {};
    }
  };
  
  return { state, setAnimationState, getAnimationForState };
};

// Hook for performance-optimized animations
export const useOptimizedAnimation = (animation: any) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Apply performance optimizations
  const optimizedAnimation = {
    ...animation,
    style: {
      ...PERFORMANCE_GUIDELINES.willChange.transform,
      ...animation.style
    }
  };
  
  return shouldReduceMotion 
    ? PERFORMANCE_GUIDELINES.reduceMotion 
    : optimizedAnimation;
};