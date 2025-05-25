/**
 * Dimensional Types
 * 
 * This module provides type definitions for dimensional boundary management.
 * 
 * @version 1.0.0
 */

/**
 * Dimension interface
 */
export interface Dimension {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'tertiary' | 'quantum';
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Boundary state enum
 */
export enum BoundaryState {
  OPEN = 'open',
  PARTIALLY_OPEN = 'partially_open',
  QUANTUM_ENTANGLED = 'quantum_entangled',
  CLOSED = 'closed',
}

/**
 * Boundary interface
 */
export interface Boundary {
  id: string;
  name: string;
  sourceDimensionId: string;
  targetDimensionId: string;
  type: 'permeable' | 'semi-permeable' | 'impermeable' | 'quantum';
  state: BoundaryState;
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Boundary crossing interface
 */
export interface BoundaryCrossing {
  id: string;
  boundaryId: string;
  sourceId: string;
  timestamp: number;
  direction: 'source-to-target' | 'target-to-source';
  quantumStateId?: string;
  harmonyScore: number;
  properties: Record<string, any>;
}

/**
 * Dimensional harmony verification result interface
 */
export interface HarmonyVerificationResult {
  isHarmonious: boolean;
  harmonyScore: number;
  dimensionalStabilityScore: number;
  boundaryIntegrityScore: number;
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
 * Harmonization strategy enum
 */
export enum HarmonizationStrategy {
  FULL = 'full',
  PARTIAL = 'partial',
  ADAPTIVE = 'adaptive',
}

/**
 * Harmonization options interface
 */
export interface HarmonizationOptions {
  strategy: HarmonizationStrategy;
  preserveQuantumState: boolean;
  preserveContext: boolean;
  harmonizationThreshold: number;
  maxIterations: number;
}

/**
 * Harmonization result interface
 */
export interface HarmonizationResult {
  id: string;
  dimensionIds: string[];
  boundaryIds: string[];
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  completedTimestamp?: number;
  iterations: number;
  harmonyScore: number;
  error?: string;
}

/**
 * Dimensional mapping interface
 */
export interface DimensionalMapping {
  id: string;
  sourceDimensionId: string;
  targetDimensionId: string;
  mappingFunction: string;
  inverseFunction?: string;
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Dimensional translation result interface
 */
export interface TranslationResult {
  success: boolean;
  sourceId: string;
  targetId: string;
  sourceValue: any;
  targetValue: any;
  coherenceScore: number;
  error?: string;
}