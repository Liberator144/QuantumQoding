/**
 * Dimensional Types
 *
 * This module provides type definitions for dimensional management.
 *
 * @version 1.0.0
 */

// Dimensional Core Types
export interface Dimension {
  readonly id: string;
  name: string;
  coordinates: DimensionalCoordinates;
  stability: number;
  harmonics: DimensionalHarmonic[];
  entanglements: DimensionalEntanglement[];
  isActive: boolean;
  metadata: DimensionalMetadata;
}

export interface DimensionalCoordinates {
  x: number;
  y: number;
  z: number;
  w?: number; // Fourth dimension
  temporal?: number; // Time dimension
  quantum?: number; // Quantum dimension
}

export interface DimensionalHarmonic {
  readonly id: string;
  frequency: number;
  amplitude: number;
  phase: number;
  resonance: number;
  isStable: boolean;
}

export interface DimensionalEntanglement {
  readonly id: string;
  sourceDimension: string;
  targetDimension: string;
  strength: number;
  coherence: number;
  isActive: boolean;
  createdAt: Date;
}

export interface DimensionalMetadata {
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
  stability: number;
  quantumSignature: string;
}

// Dimensional Transition Types
export interface DimensionalTransition {
  readonly id: string;
  fromDimension: Dimension;
  toDimension: Dimension;
  transitionType: TransitionType;
  duration: number;
  energy: number;
  success: boolean;
  timestamp: Date;
}

export enum TransitionType {
  SMOOTH = 'smooth',
  QUANTUM_LEAP = 'quantum_leap',
  PHASE_SHIFT = 'phase_shift',
  HARMONIC_RESONANCE = 'harmonic_resonance',
  ENTANGLEMENT_BRIDGE = 'entanglement_bridge'
}

export interface TransitionConfig {
  targetDimension: string;
  transitionType: TransitionType;
  energyThreshold: number;
  stabilityRequired: number;
  allowQuantumEffects: boolean;
}

// Dimensional Space Types
export interface DimensionalSpace {
  readonly id: string;
  name: string;
  dimensions: Dimension[];
  boundaries: SpaceBoundary[];
  laws: PhysicsLaw[];
  isStable: boolean;
  coherenceLevel: number;
}

export interface SpaceBoundary {
  readonly id: string;
  type: BoundaryType;
  coordinates: DimensionalCoordinates[];
  permeability: number;
  isActive: boolean;
}

export enum BoundaryType {
  HARD = 'hard',
  SOFT = 'soft',
  PERMEABLE = 'permeable',
  QUANTUM_BARRIER = 'quantum_barrier',
  TEMPORAL_WALL = 'temporal_wall'
}

// Dimensional Navigation Types
export interface DimensionalNavigator {
  readonly id: string;
  currentDimension: string;
  availableDimensions: string[];
  navigationHistory: NavigationEntry[];
}

export interface NavigationEntry {
  dimension: string;
  timestamp: Date;
  coordinates: DimensionalCoordinates;
  duration: number;
  method: string;
}

// Type Guards
export const isDimension = (obj: unknown): obj is Dimension => {
  return typeof obj === 'object' && obj !== null && 
         'id' in obj && 'coordinates' in obj && 'stability' in obj;
};

export const isValidTransitionType = (type: string): type is TransitionType => {
  return Object.values(TransitionType).includes(type as TransitionType);
};

export const isDimensionalCoordinates = (obj: unknown): obj is DimensionalCoordinates => {
  return typeof obj === 'object' && obj !== null &&
         'x' in obj && 'y' in obj && 'z' in obj;
};