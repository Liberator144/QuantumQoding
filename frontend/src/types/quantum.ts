/**
 * Quantum Types
 * 
 * This module provides type definitions for quantum state management.
 * 
 * @version 1.0.0
 */

/**
 * Quantum state interface
 */
export interface QuantumState {
  id: string;
  type: string;
  coherenceLevel: number;
  entangledStates: string[];
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Quantum state transformation interface
 */
export interface QuantumTransformation {
  type: 'enhance' | 'degrade' | 'stabilize' | 'destabilize' | 'custom';
  factor?: number;
  properties?: Record<string, any>;
}

/**
 * Quantum state synchronization interface
 */
export interface QuantumSynchronization {
  sourceStateId: string;
  targetStateId: string;
  properties: string[];
  bidirectional: boolean;
  preserveCoherence: boolean;
}

/**
 * Quantum entanglement interface
 */
export interface QuantumEntanglement {
  sourceStateId: string;
  targetStateId: string;
  strength: number;
  type: 'strong' | 'weak' | 'temporal' | 'spatial';
}

/**
 * Quantum coherence verification result interface
 */
export interface CoherenceVerificationResult {
  isCoherent: boolean;
  coherenceScore: number;
  dimensionalStability: number;
  issues?: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: string;
  }[];
  recommendations?: {
    type: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    action: string;
  }[];
}

/**
 * Quantum vector interface
 */
export interface QuantumVector {
  dimensions: number;
  values: number[];
  basis: string;
}

/**
 * Quantum operation interface
 */
export interface QuantumOperation {
  type: 'create' | 'update' | 'delete' | 'synchronize' | 'entangle' | 'disentangle' | 'transform';
  stateId: string;
  data?: any;
  targetStateId?: string;
}

/**
 * Quantum transaction interface
 */
export interface QuantumTransaction {
  id: string;
  operations: QuantumOperation[];
  status: 'pending' | 'committed' | 'rolled_back' | 'failed';
  timestamp: number;
  completedTimestamp?: number;
  coherenceScore?: number;
}

/**
 * Quantum transaction result interface
 */
export interface QuantumTransactionResult {
  transaction: QuantumTransaction;
  success: boolean;
  states: QuantumState[];
  error?: string;
}