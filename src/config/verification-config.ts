/**
 * Quantum Coherence Verification Framework Configuration
 * 
 * This module provides configuration for the Quantum Coherence Verification Framework,
 * ensuring quantum coherence across all operational dimensions.
 */

import { z } from 'zod';

/**
 * Verification level
 */
export enum VerificationLevel {
  /** No verification */
  NONE = 'none',
  
  /** Basic verification */
  BASIC = 'basic',
  
  /** Standard verification */
  STANDARD = 'standard',
  
  /** Strict verification */
  STRICT = 'strict',
  
  /** Quantum verification */
  QUANTUM = 'quantum',
}

/**
 * Verification frequency
 */
export enum VerificationFrequency {
  /** Verify on demand only */
  ON_DEMAND = 'on-demand',
  
  /** Verify on state change */
  ON_CHANGE = 'on-change',
  
  /** Verify on boundary crossing */
  ON_BOUNDARY = 'on-boundary',
  
  /** Verify continuously */
  CONTINUOUS = 'continuous',
}

/**
 * Verification scope
 */
export enum VerificationScope {
  /** Verify consciousness streams only */
  CONSCIOUSNESS = 'consciousness',
  
  /** Verify neural fabric only */
  NEURAL_FABRIC = 'neural-fabric',
  
  /** Verify quantum state only */
  QUANTUM_STATE = 'quantum-state',
  
  /** Verify all components */
  ALL = 'all',
}

/**
 * Verification action on failure
 */
export enum VerificationAction {
  /** Log the failure */
  LOG = 'log',
  
  /** Warn about the failure */
  WARN = 'warn',
  
  /** Throw an error */
  ERROR = 'error',
  
  /** Attempt to repair */
  REPAIR = 'repair',
  
  /** Create a checkpoint and repair */
  CHECKPOINT_AND_REPAIR = 'checkpoint-and-repair',
}

/**
 * Verification configuration
 */
export interface VerificationConfig {
  /** Verification level */
  level: VerificationLevel;
  
  /** Verification frequency */
  frequency: VerificationFrequency;
  
  /** Verification scope */
  scope: VerificationScope;
  
  /** Action to take on verification failure */
  actionOnFailure: VerificationAction;
  
  /** Whether to verify consciousness streams */
  verifyConsciousness: boolean;
  
  /** Whether to verify neural fabric */
  verifyFabric: boolean;
  
  /** Whether to verify quantum state */
  verifyState: boolean;
  
  /** Whether to verify dimensional harmony */
  verifyDimensionalHarmony: boolean;
  
  /** Whether to verify singularity enforcement */
  verifySingularity: boolean;
  
  /** Whether to verify force application consistency */
  verifyForceConsistency: boolean;
  
  /** Minimum acceptable verification score */
  minimumScore: number;
  
  /** Whether to log verification results */
  logResults: boolean;
  
  /** Whether to track verification history */
  trackHistory: boolean;
  
  /** Maximum verification history size */
  historySize: number;
}

/**
 * Validation schema for verification configuration
 */
export const verificationConfigSchema = z.object({
  level: z.nativeEnum(VerificationLevel),
  frequency: z.nativeEnum(VerificationFrequency),
  scope: z.nativeEnum(VerificationScope),
  actionOnFailure: z.nativeEnum(VerificationAction),
  verifyConsciousness: z.boolean(),
  verifyFabric: z.boolean(),
  verifyState: z.boolean(),
  verifyDimensionalHarmony: z.boolean(),
  verifySingularity: z.boolean(),
  verifyForceConsistency: z.boolean(),
  minimumScore: z.number().min(0).max(1),
  logResults: z.boolean(),
  trackHistory: z.boolean(),
  historySize: z.number().int().positive(),
});

/**
 * Default verification configuration
 */
export const defaultVerificationConfig: VerificationConfig = {
  level: VerificationLevel.STANDARD,
  frequency: VerificationFrequency.ON_CHANGE,
  scope: VerificationScope.ALL,
  actionOnFailure: VerificationAction.REPAIR,
  verifyConsciousness: true,
  verifyFabric: true,
  verifyState: true,
  verifyDimensionalHarmony: true,
  verifySingularity: true,
  verifyForceConsistency: true,
  minimumScore: 0.8,
  logResults: true,
  trackHistory: true,
  historySize: 100,
};

/**
 * Basic verification configuration
 */
export const basicVerificationConfig: VerificationConfig = {
  level: VerificationLevel.BASIC,
  frequency: VerificationFrequency.ON_DEMAND,
  scope: VerificationScope.ALL,
  actionOnFailure: VerificationAction.LOG,
  verifyConsciousness: true,
  verifyFabric: true,
  verifyState: true,
  verifyDimensionalHarmony: false,
  verifySingularity: false,
  verifyForceConsistency: false,
  minimumScore: 0.6,
  logResults: true,
  trackHistory: false,
  historySize: 10,
};

/**
 * Strict verification configuration
 */
export const strictVerificationConfig: VerificationConfig = {
  level: VerificationLevel.STRICT,
  frequency: VerificationFrequency.ON_BOUNDARY,
  scope: VerificationScope.ALL,
  actionOnFailure: VerificationAction.ERROR,
  verifyConsciousness: true,
  verifyFabric: true,
  verifyState: true,
  verifyDimensionalHarmony: true,
  verifySingularity: true,
  verifyForceConsistency: true,
  minimumScore: 0.9,
  logResults: true,
  trackHistory: true,
  historySize: 1000,
};

/**
 * Quantum verification configuration
 */
export const quantumVerificationConfig: VerificationConfig = {
  level: VerificationLevel.QUANTUM,
  frequency: VerificationFrequency.CONTINUOUS,
  scope: VerificationScope.ALL,
  actionOnFailure: VerificationAction.CHECKPOINT_AND_REPAIR,
  verifyConsciousness: true,
  verifyFabric: true,
  verifyState: true,
  verifyDimensionalHarmony: true,
  verifySingularity: true,
  verifyForceConsistency: true,
  minimumScore: 0.95,
  logResults: true,
  trackHistory: true,
  historySize: 10000,
};

/**
 * Gets the verification configuration for the specified level
 * 
 * @param level - The verification level
 * @returns The verification configuration for the specified level
 */
export function getVerificationConfig(level: VerificationLevel): VerificationConfig {
  switch (level) {
    case VerificationLevel.NONE:
      return {
        ...defaultVerificationConfig,
        level: VerificationLevel.NONE,
        verifyConsciousness: false,
        verifyFabric: false,
        verifyState: false,
        verifyDimensionalHarmony: false,
        verifySingularity: false,
        verifyForceConsistency: false,
      };
    case VerificationLevel.BASIC:
      return basicVerificationConfig;
    case VerificationLevel.STANDARD:
      return defaultVerificationConfig;
    case VerificationLevel.STRICT:
      return strictVerificationConfig;
    case VerificationLevel.QUANTUM:
      return quantumVerificationConfig;
    default:
      return defaultVerificationConfig;
  }
}

/**
 * Current verification configuration
 */
export let currentVerificationConfig: VerificationConfig = { ...defaultVerificationConfig };

/**
 * Sets the current verification configuration
 * 
 * @param config - The verification configuration to set
 */
export function setVerificationConfig(config: Partial<VerificationConfig>): void {
  currentVerificationConfig = {
    ...currentVerificationConfig,
    ...config,
  };
}

/**
 * Gets the current verification configuration
 * 
 * @returns The current verification configuration
 */
export function getCurrentVerificationConfig(): VerificationConfig {
  return { ...currentVerificationConfig };
}