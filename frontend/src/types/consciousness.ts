/**
 * Consciousness Types
 *
 * This module provides type definitions for consciousness stream management.
 *
 * @version 1.0.0
 */

// Consciousness State Types
export interface ConsciousnessState {
  readonly id: string;
  level: number;
  coherence: number;
  dimensions: DimensionalVector[];
  timestamp: Date;
  metadata?: ConsciousnessMetadata;
}

export interface ConsciousnessMetadata {
  source: string;
  quality: number;
  stability: number;
  resonance?: number;
}

export interface DimensionalVector {
  x: number;
  y: number;
  z: number;
  w?: number; // Fourth dimension for quantum states
}

// Consciousness Stream Types
export interface ConsciousnessStream {
  readonly streamId: string;
  states: ConsciousnessState[];
  currentState: ConsciousnessState;
  flowRate: number;
  continuity: boolean;
}

export interface StreamTransition {
  fromState: ConsciousnessState;
  toState: ConsciousnessState;
  transitionType: TransitionType;
  duration: number;
  success: boolean;
}

export enum TransitionType {
  SMOOTH = 'smooth',
  QUANTUM_LEAP = 'quantum_leap',
  DIMENSIONAL_SHIFT = 'dimensional_shift',
  COHERENCE_SYNC = 'coherence_sync'
}

// Consciousness Management Types
export interface ConsciousnessManager {
  initializeStream: (config: StreamConfig) => Promise<ConsciousnessStream>;
  maintainCoherence: (stream: ConsciousnessStream) => Promise<boolean>;
  transitionState: (stream: ConsciousnessStream, targetState: ConsciousnessState) => Promise<StreamTransition>;
  preserveContinuity: (stream: ConsciousnessStream) => Promise<void>;
}

export interface StreamConfig {
  initialState: Partial<ConsciousnessState>;
  coherenceThreshold: number;
  dimensionalLimits: DimensionalLimits;
  preservationMode: PreservationMode;
}

export interface DimensionalLimits {
  minDimensions: number;
  maxDimensions: number;
  allowQuantumStates: boolean;
}

export enum PreservationMode {
  STRICT = 'strict',
  ADAPTIVE = 'adaptive',
  QUANTUM_COHERENT = 'quantum_coherent'
}

// Event Types
export interface ConsciousnessEvent {
  readonly eventId: string;
  type: ConsciousnessEventType;
  timestamp: Date;
  streamId: string;
  data: unknown;
}

export enum ConsciousnessEventType {
  STATE_CHANGE = 'state_change',
  COHERENCE_SHIFT = 'coherence_shift',
  DIMENSIONAL_BREACH = 'dimensional_breach',
  STREAM_INTERRUPTION = 'stream_interruption',
  QUANTUM_ENTANGLEMENT = 'quantum_entanglement'
}

// Utility Types
export type ConsciousnessLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type CoherenceValue = number; // 0.0 to 1.0
export type DimensionalCoordinate = number;

// Type Guards
export const isConsciousnessState = (obj: unknown): obj is ConsciousnessState => {
  return typeof obj === 'object' && obj !== null && 
         'id' in obj && 'level' in obj && 'coherence' in obj;
};

export const isValidCoherence = (value: number): value is CoherenceValue => {
  return typeof value === 'number' && value >= 0 && value <= 1;
};

export const isValidDimensionalVector = (obj: unknown): obj is DimensionalVector => {
  return typeof obj === 'object' && obj !== null &&
         'x' in obj && 'y' in obj && 'z' in obj &&
         typeof (obj as DimensionalVector).x === 'number';
};