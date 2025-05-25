/**
 * Animations
 * 
 * This module defines the animation system for the QQ-Verse project.
 * 
 * @version 1.0.0
 */

/**
 * Animation durations
 */
export const duration = {
  /** Extra fast animation duration */
  xfast: '100ms',
  
  /** Fast animation duration */
  fast: '200ms',
  
  /** Normal animation duration */
  normal: '300ms',
  
  /** Slow animation duration */
  slow: '500ms',
  
  /** Extra slow animation duration */
  xslow: '800ms',
};

/**
 * Animation easings
 */
export const easing = {
  /** Linear easing */
  linear: 'linear',
  
  /** Ease in easing */
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  
  /** Ease out easing */
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  
  /** Ease in-out easing */
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  /** Quantum easing - special easing for quantum effects */
  quantum: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  
  /** Cosmic easing - special easing for cosmic effects */
  cosmic: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
};

/**
 * Animation keyframes
 */
export const keyframes = {
  /** Fade in animation */
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  
  /** Fade out animation */
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  
  /** Scale in animation */
  scaleIn: {
    from: { transform: 'scale(0.9)' },
    to: { transform: 'scale(1)' },
  },
  
  /** Scale out animation */
  scaleOut: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(0.9)' },
  },
  
  /** Slide in from top animation */
  slideInTop: {
    from: { transform: 'translateY(-20px)' },
    to: { transform: 'translateY(0)' },
  },
  
  /** Slide out to top animation */
  slideOutTop: {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(-20px)' },
  },
  
  /** Slide in from bottom animation */
  slideInBottom: {
    from: { transform: 'translateY(20px)' },
    to: { transform: 'translateY(0)' },
  },
  
  /** Slide out to bottom animation */
  slideOutBottom: {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(20px)' },
  },
  
  /** Pulse animation */
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
  
  /** Spin animation */
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  
  /** Quantum fluctuation animation */
  quantumFluctuation: {
    '0%': { transform: 'scale(1) rotate(0deg)' },
    '25%': { transform: 'scale(1.02) rotate(1deg)' },
    '50%': { transform: 'scale(0.98) rotate(-1deg)' },
    '75%': { transform: 'scale(1.02) rotate(0deg)' },
    '100%': { transform: 'scale(1) rotate(0deg)' },
  },
  
  /** Cosmic pulsation animation */
  cosmicPulsation: {
    '0%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.4)' },
    '70%': { boxShadow: '0 0 0 10px rgba(255, 215, 0, 0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0)' },
  },
};

/**
 * Animation presets
 */
export const preset = {
  /** Fade in animation preset */
  fadeIn: {
    animation: `${keyframes.fadeIn} ${duration.normal} ${easing.easeOut} forwards`,
  },
  
  /** Fade out animation preset */
  fadeOut: {
    animation: `${keyframes.fadeOut} ${duration.normal} ${easing.easeIn} forwards`,
  },
  
  /** Scale in animation preset */
  scaleIn: {
    animation: `${keyframes.scaleIn} ${duration.normal} ${easing.easeOut} forwards`,
  },
  
  /** Scale out animation preset */
  scaleOut: {
    animation: `${keyframes.scaleOut} ${duration.normal} ${easing.easeIn} forwards`,
  },
  
  /** Slide in from top animation preset */
  slideInTop: {
    animation: `${keyframes.slideInTop} ${duration.normal} ${easing.easeOut} forwards`,
  },
  
  /** Slide out to top animation preset */
  slideOutTop: {
    animation: `${keyframes.slideOutTop} ${duration.normal} ${easing.easeIn} forwards`,
  },
  
  /** Slide in from bottom animation preset */
  slideInBottom: {
    animation: `${keyframes.slideInBottom} ${duration.normal} ${easing.easeOut} forwards`,
  },
  
  /** Slide out to bottom animation preset */
  slideOutBottom: {
    animation: `${keyframes.slideOutBottom} ${duration.normal} ${easing.easeIn} forwards`,
  },
  
  /** Pulse animation preset */
  pulse: {
    animation: `${keyframes.pulse} ${duration.slow} ${easing.easeInOut} infinite`,
  },
  
  /** Spin animation preset */
  spin: {
    animation: `${keyframes.spin} ${duration.slow} ${easing.linear} infinite`,
  },
  
  /** Quantum fluctuation animation preset */
  quantumFluctuation: {
    animation: `${keyframes.quantumFluctuation} ${duration.xslow} ${easing.quantum} infinite`,
  },
  
  /** Cosmic pulsation animation preset */
  cosmicPulsation: {
    animation: `${keyframes.cosmicPulsation} ${duration.xslow} ${easing.cosmic} infinite`,
  },
};

/**
 * All animations
 */
export const animations = {
  duration,
  easing,
  keyframes,
  preset,
};