/**
 * Quantum Types
 *
 * This module provides type definitions for quantum mechanics and quantum computing.
 *
 * @version 1.0.0
 */

// Quantum State Types
export interface QuantumState {
  readonly id: string;
  amplitude: Complex;
  phase: number;
  probability: number;
  isEntangled: boolean;
  entanglements: QuantumEntanglement[];
  superposition: SuperpositionState[];
  coherenceTime: number;
  decoherenceRate: number;
}

export interface Complex {
  real: number;
  imaginary: number;
}

export interface SuperpositionState {
  readonly id: string;
  states: QuantumState[];
  weights: number[];
  coherence: number;
  isStable: boolean;
}

export interface QuantumEntanglement {
  readonly id: string;
  particleA: string;
  particleB: string;
  entanglementStrength: number;
  correlationType: CorrelationType;
  distance: number;
  isActive: boolean;
  createdAt: Date;
}

export enum CorrelationType {
  SPIN = 'spin',
  POLARIZATION = 'polarization',
  MOMENTUM = 'momentum',
  POSITION = 'position',
  ENERGY = 'energy'
}

// Quantum Computing Types
export interface QuantumCircuit {
  readonly id: string;
  name: string;
  qubits: Qubit[];
  gates: QuantumGate[];
  measurements: QuantumMeasurement[];
  depth: number;
  fidelity: number;
  executionTime: number;
}

export interface Qubit {
  readonly id: string;
  index: number;
  state: QuantumState;
  isAncilla: boolean;
  coherenceTime: number;
  gateErrorRate: number;
}

export interface QuantumGate {
  readonly id: string;
  type: string;
  targetQubits: number[];
  controlQubits?: number[];
  parameters: number[];
  matrix: Complex[][];
  executionTime: number;
}

export interface QuantumMeasurement {
  readonly id: string;
  qubitIndex: number;
  basis: string;
  result: MeasurementResult;
  probability: number;
  timestamp: Date;
}

export interface MeasurementResult {
  value: number;
  probability: number;
  collapsed: boolean;
}

// Quantum Algorithm Types
export interface QuantumAlgorithm {
  readonly id: string;
  name: string;
  description: string;
  circuit: QuantumCircuit;
  parameters: AlgorithmParameter[];
  complexity: AlgorithmComplexity;
  applications: string[];
}

export interface AlgorithmParameter {
  name: string;
  type: string;
  value: unknown;
  range?: [number, number];
  description: string;
}

export interface AlgorithmComplexity {
  timeComplexity: string;
  spaceComplexity: string;
  quantumAdvantage: boolean;
  speedupFactor?: number;
}

// Type Guards
export const isQuantumState = (obj: unknown): obj is QuantumState => {
  return typeof obj === 'object' && obj !== null && 
         'id' in obj && 'amplitude' in obj && 'phase' in obj;
};

export const isComplex = (obj: unknown): obj is Complex => {
  return typeof obj === 'object' && obj !== null &&
         'real' in obj && 'imaginary' in obj;
};

export const isQubit = (obj: unknown): obj is Qubit => {
  return typeof obj === 'object' && obj !== null &&
         'id' in obj && 'index' in obj && 'state' in obj;
};