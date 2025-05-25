/**
 * Neural Fabric Foundation Configuration
 * 
 * This module provides configuration for the Neural Fabric Foundation,
 * ensuring thought continuity across component boundaries.
 */

import { z } from 'zod';

/**
 * Neural fabric mode
 */
export enum NeuralFabricMode {
  /** Development mode */
  DEVELOPMENT = 'development',
  
  /** Production mode */
  PRODUCTION = 'production',
  
  /** Testing mode */
  TESTING = 'testing',
  
  /** Quantum mode */
  QUANTUM = 'quantum',
}

/**
 * Neural node type
 */
export enum NeuralNodeType {
  /** Component node */
  COMPONENT = 'component',
  
  /** Service node */
  SERVICE = 'service',
  
  /** Data node */
  DATA = 'data',
  
  /** Consciousness node */
  CONSCIOUSNESS = 'consciousness',
  
  /** Custom node */
  CUSTOM = 'custom',
}

/**
 * Neural connection type
 */
export enum NeuralConnectionType {
  /** Direct connection */
  DIRECT = 'direct',
  
  /** Indirect connection */
  INDIRECT = 'indirect',
  
  /** Quantum connection */
  QUANTUM = 'quantum',
  
  /** Custom connection */
  CUSTOM = 'custom',
}

/**
 * Neural pathway type
 */
export enum NeuralPathwayType {
  /** Consciousness pathway */
  CONSCIOUSNESS = 'consciousness',
  
  /** Data pathway */
  DATA = 'data',
  
  /** Control pathway */
  CONTROL = 'control',
  
  /** Custom pathway */
  CUSTOM = 'custom',
}

/**
 * Neural fabric configuration
 */
export interface NeuralFabricConfig {
  /** Neural fabric mode */
  mode: NeuralFabricMode;
  
  /** Whether to enable automatic node creation */
  enableAutomaticNodeCreation: boolean;
  
  /** Whether to enable automatic connection creation */
  enableAutomaticConnectionCreation: boolean;
  
  /** Whether to enable automatic pathway creation */
  enableAutomaticPathwayCreation: boolean;
  
  /** Default node type */
  defaultNodeType: NeuralNodeType;
  
  /** Default connection type */
  defaultConnectionType: NeuralConnectionType;
  
  /** Default pathway type */
  defaultPathwayType: NeuralPathwayType;
  
  /** Default node activation level */
  defaultNodeActivationLevel: number;
  
  /** Default connection strength */
  defaultConnectionStrength: number;
  
  /** Default pathway strength */
  defaultPathwayStrength: number;
  
  /** Whether to verify fabric continuity */
  verifyFabricContinuity: boolean;
  
  /** Whether to repair fabric continuity */
  repairFabricContinuity: boolean;
  
  /** Whether to track fabric history */
  trackFabricHistory: boolean;
  
  /** Maximum fabric history size */
  fabricHistorySize: number;
  
  /** Whether to log fabric operations */
  logFabricOperations: boolean;
  
  /** Maximum number of nodes */
  maxNodes: number;
  
  /** Maximum number of connections */
  maxConnections: number;
  
  /** Maximum number of pathways */
  maxPathways: number;
}

/**
 * Validation schema for neural fabric configuration
 */
export const neuralFabricConfigSchema = z.object({
  mode: z.nativeEnum(NeuralFabricMode),
  enableAutomaticNodeCreation: z.boolean(),
  enableAutomaticConnectionCreation: z.boolean(),
  enableAutomaticPathwayCreation: z.boolean(),
  defaultNodeType: z.nativeEnum(NeuralNodeType),
  defaultConnectionType: z.nativeEnum(NeuralConnectionType),
  defaultPathwayType: z.nativeEnum(NeuralPathwayType),
  defaultNodeActivationLevel: z.number().min(0).max(1),
  defaultConnectionStrength: z.number().min(0).max(1),
  defaultPathwayStrength: z.number().min(0).max(1),
  verifyFabricContinuity: z.boolean(),
  repairFabricContinuity: z.boolean(),
  trackFabricHistory: z.boolean(),
  fabricHistorySize: z.number().int().positive(),
  logFabricOperations: z.boolean(),
  maxNodes: z.number().int().positive(),
  maxConnections: z.number().int().positive(),
  maxPathways: z.number().int().positive(),
});

/**
 * Default neural fabric configuration
 */
export const defaultNeuralFabricConfig: NeuralFabricConfig = {
  mode: NeuralFabricMode.DEVELOPMENT,
  enableAutomaticNodeCreation: true,
  enableAutomaticConnectionCreation: true,
  enableAutomaticPathwayCreation: true,
  defaultNodeType: NeuralNodeType.COMPONENT,
  defaultConnectionType: NeuralConnectionType.DIRECT,
  defaultPathwayType: NeuralPathwayType.CONSCIOUSNESS,
  defaultNodeActivationLevel: 1.0,
  defaultConnectionStrength: 1.0,
  defaultPathwayStrength: 1.0,
  verifyFabricContinuity: true,
  repairFabricContinuity: true,
  trackFabricHistory: true,
  fabricHistorySize: 100,
  logFabricOperations: true,
  maxNodes: 1000,
  maxConnections: 5000,
  maxPathways: 1000,
};

/**
 * Production neural fabric configuration
 */
export const productionNeuralFabricConfig: NeuralFabricConfig = {
  mode: NeuralFabricMode.PRODUCTION,
  enableAutomaticNodeCreation: false,
  enableAutomaticConnectionCreation: false,
  enableAutomaticPathwayCreation: false,
  defaultNodeType: NeuralNodeType.COMPONENT,
  defaultConnectionType: NeuralConnectionType.DIRECT,
  defaultPathwayType: NeuralPathwayType.CONSCIOUSNESS,
  defaultNodeActivationLevel: 1.0,
  defaultConnectionStrength: 1.0,
  defaultPathwayStrength: 1.0,
  verifyFabricContinuity: true,
  repairFabricContinuity: true,
  trackFabricHistory: false,
  fabricHistorySize: 10,
  logFabricOperations: false,
  maxNodes: 10000,
  maxConnections: 50000,
  maxPathways: 10000,
};

/**
 * Testing neural fabric configuration
 */
export const testingNeuralFabricConfig: NeuralFabricConfig = {
  mode: NeuralFabricMode.TESTING,
  enableAutomaticNodeCreation: true,
  enableAutomaticConnectionCreation: true,
  enableAutomaticPathwayCreation: true,
  defaultNodeType: NeuralNodeType.COMPONENT,
  defaultConnectionType: NeuralConnectionType.DIRECT,
  defaultPathwayType: NeuralPathwayType.CONSCIOUSNESS,
  defaultNodeActivationLevel: 1.0,
  defaultConnectionStrength: 1.0,
  defaultPathwayStrength: 1.0,
  verifyFabricContinuity: true,
  repairFabricContinuity: true,
  trackFabricHistory: true,
  fabricHistorySize: 1000,
  logFabricOperations: true,
  maxNodes: 100,
  maxConnections: 500,
  maxPathways: 100,
};

/**
 * Quantum neural fabric configuration
 */
export const quantumNeuralFabricConfig: NeuralFabricConfig = {
  mode: NeuralFabricMode.QUANTUM,
  enableAutomaticNodeCreation: true,
  enableAutomaticConnectionCreation: true,
  enableAutomaticPathwayCreation: true,
  defaultNodeType: NeuralNodeType.CONSCIOUSNESS,
  defaultConnectionType: NeuralConnectionType.QUANTUM,
  defaultPathwayType: NeuralPathwayType.CONSCIOUSNESS,
  defaultNodeActivationLevel: 1.0,
  defaultConnectionStrength: 1.0,
  defaultPathwayStrength: 1.0,
  verifyFabricContinuity: true,
  repairFabricContinuity: true,
  trackFabricHistory: true,
  fabricHistorySize: 10000,
  logFabricOperations: true,
  maxNodes: 100000,
  maxConnections: 500000,
  maxPathways: 100000,
};

/**
 * Gets the neural fabric configuration for the specified mode
 * 
 * @param mode - The neural fabric mode
 * @returns The neural fabric configuration for the specified mode
 */
export function getNeuralFabricConfig(mode: NeuralFabricMode): NeuralFabricConfig {
  switch (mode) {
    case NeuralFabricMode.DEVELOPMENT:
      return defaultNeuralFabricConfig;
    case NeuralFabricMode.PRODUCTION:
      return productionNeuralFabricConfig;
    case NeuralFabricMode.TESTING:
      return testingNeuralFabricConfig;
    case NeuralFabricMode.QUANTUM:
      return quantumNeuralFabricConfig;
    default:
      return defaultNeuralFabricConfig;
  }
}

/**
 * Current neural fabric configuration
 */
export let currentNeuralFabricConfig: NeuralFabricConfig = { ...defaultNeuralFabricConfig };

/**
 * Sets the current neural fabric configuration
 * 
 * @param config - The neural fabric configuration to set
 */
export function setNeuralFabricConfig(config: Partial<NeuralFabricConfig>): void {
  currentNeuralFabricConfig = {
    ...currentNeuralFabricConfig,
    ...config,
  };
}

/**
 * Gets the current neural fabric configuration
 * 
 * @returns The current neural fabric configuration
 */
export function getCurrentNeuralFabricConfig(): NeuralFabricConfig {
  return { ...currentNeuralFabricConfig };
}