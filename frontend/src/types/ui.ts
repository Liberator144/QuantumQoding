/**
 * UI Types
 *
 * This module provides type definitions for UI components.
 *
 * @version 1.0.0
 */

import type { ReactNode, CSSProperties } from 'react';

// Base UI Component Types
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  testId?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Layout Types
export interface LayoutProps extends BaseComponentProps {
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: number | string;
  padding?: number | string;
  margin?: number | string;
}

export interface GridProps extends BaseComponentProps {
  columns?: number | string;
  rows?: number | string;
  gap?: number | string;
  autoFlow?: 'row' | 'column' | 'dense';
}

// Theme Types
export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  breakpoints: Breakpoints;
  shadows: Shadows;
  animations: Animations;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  semantic: SemanticColors;
  quantum: QuantumColors;
}

export interface ColorScale {
  50: string;
  500: string;
  900: string;
}

export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface QuantumColors {
  coherence: string;
  entanglement: string;
  superposition: string;
  dimensional: string;
}

// Component State Types
export interface ComponentState {
  isVisible: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Event Types
export interface UIEvent {
  type: UIEventType;
  target: string;
  timestamp: Date;
  data?: unknown;
}

export enum UIEventType {
  CLICK = 'click',
  HOVER = 'hover',
  FOCUS = 'focus',
  BLUR = 'blur',
  SCROLL = 'scroll',
  RESIZE = 'resize',
  QUANTUM_INTERACTION = 'quantum_interaction'
}

// Quantum UI Types
export interface QuantumComponentProps extends BaseComponentProps {
  coherenceLevel?: number;
  dimensionalState?: 'stable' | 'transitioning' | 'superposition';
  quantumEntangled?: boolean;
  onQuantumStateChange?: (state: QuantumUIState) => void;
}

export interface QuantumUIState {
  coherence: number;
  entanglement: boolean;
  superposition: boolean;
  dimensionalPhase: number;
}

// Utility Types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'accent' | 'quantum';

// Type Guards
export const isValidSize = (size: string): size is Size => {
  return ['xs', 'sm', 'md', 'lg', 'xl'].includes(size);
};

export const isValidVariant = (variant: string): variant is Variant => {
  return ['primary', 'secondary', 'accent', 'quantum'].includes(variant);
};