/**
 * UI Types
 * 
 * This module provides type definitions for UI components.
 * 
 * @version 1.0.0
 */

/**
 * Star system interface
 */
export interface StarSystem {
  name: string;
  path: string;
  color: string;
  orbit: 'inner' | 'middle' | 'outer';
  description: string;
  features: StarSystemFeature[];
}

/**
 * Star system feature interface
 */
export interface StarSystemFeature {
  name: string;
  path: string;
  description: string;
}

/**
 * Route interface
 */
export interface Route {
  path: string;
  element: React.ReactNode;
  children?: Route[];
  meta?: {
    requiresAuth?: boolean;
    title?: string;
    description?: string;
    starSystem?: string;
    feature?: string;
    orbit?: 'inner' | 'middle' | 'outer';
  };
}

/**
 * Navigation options interface
 */
export interface NavigateOptions {
  replace?: boolean;
  state?: any;
  transitionType?: 'fade' | 'slide' | 'scale' | 'wormhole';
}

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  createdAt: number;
}

/**
 * Modal interface
 */
export interface Modal {
  id: string;
  title: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
}

/**
 * Theme interface
 */
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  fonts: {
    body: string;
    heading: string;
    monospace: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  space: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

/**
 * Animation interface
 */
export interface Animation {
  name: string;
  duration: number;
  easing: string;
  delay?: number;
  repeat?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

/**
 * Audio options interface
 */
export interface AudioOptions {
  volume?: number;
  rate?: number;
  detune?: number;
  loop?: boolean;
}