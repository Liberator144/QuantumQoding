// src/core/quantum-state/entanglement/entanglement-synchronization.ts
/**
 * Entanglement Synchronization Implementation
 * 
 * This module implements the entanglement synchronization functionality for the QQ-Verse project,
 * ensuring synchronized state changes across entangled quantum states.
 */

import { v4 as uuidv4 } from 'uuid';
import { produce } from 'immer';

// Import types from the types directory
import type {
  QuantumState,
  EntanglementInfo,
  QuantumTransformation,
  VerificationResult,
  VerificationError,
} from '../../../../types';

// Import functions from other modules
import {
  transformState,
  entangleStates,
  verifyStateCoherence,
  repairStateCoherence,
} from '../quantum-state';

/**
 * Entanglement synchronization options
 */
export interface EntanglementSynchronizationOptions {
  /** Whether to propagate transformations to entangled states */
  propagateTransformations: boolean;
  
  /** Whether to verify state coherence before synchronization */
  verifyBeforeSynchronization: boolean;
  
  /** Whether to verify state coherence after synchronization */
  verifyAfterSynchronization: boolean;
  
  /** Whether to repair state coherence if verification fails */
  repairIfVerificationFails: boolean;
  
  /** Entanglement strength threshold for propagation */
  propagationThreshold: number;
  
  /** Transformation strength decay factor for propagation */
  transformationDecayFactor: number;
}

/**
 * Default entanglement synchronization options
 */
export const defaultEntanglementSynchronizationOptions: EntanglementSynchronizationOptions = {
  propagateTransformations: true,
  verifyBeforeSynchronization: true,
  verifyAfterSynchronization: true,
  repairIfVerificationFails: true,
  propagationThreshold: 0.1,
  transformationDecayFactor: 0.8,
};

/**
 * Entanglement registry entry
 */
export interface EntanglementRegistryEntry {
  /** Source state ID */
  sourceId: string;
  
  /** Target state ID */
  targetId: string;
  
  /** Entanglement type */
  type: EntanglementInfo['type'];
  
  /** Entanglement strength */
  strength: number;
  
  /** Entanglement coherence */
  coherence: number;
  
  /** Timestamp when the entanglement was created */
  timestamp: string;
}

/**
 * Entanglement registry
 */
export interface EntanglementRegistry {
  /** Entanglement entries */
  entries: EntanglementRegistryEntry[];
  
  /** Synchronization options */
  options: EntanglementSynchronizationOptions;
}

/**
 * Creates a new entanglement registry
 * 
 * @param options - Synchronization options
 * @returns A new entanglement registry
 */
export function createEntanglementRegistry(
  options: Partial<EntanglementSynchronizationOptions> = {}
): EntanglementRegistry {
  // Merge options with defaults
  const mergedOptions: EntanglementSynchronizationOptions = {
    ...defaultEntanglementSynchronizationOptions,
    ...options,
  };
  
  // Create the registry
  const registry: EntanglementRegistry = {
    entries: [],
    options: mergedOptions,
  };
  
  return registry;
}

/**
 * Registers an entanglement between two quantum states
 * 
 * @param registry - The entanglement registry
 * @param sourceState - The source quantum state
 * @param targetState - The target quantum state
 * @param type - The entanglement type
 * @param strength - The entanglement strength
 * @param coherence - The entanglement coherence
 * @returns The updated entanglement registry
 */
export function registerEntanglement(
  registry: EntanglementRegistry,
  sourceState: QuantumState,
  targetState: QuantumState,
  type: EntanglementInfo['type'] = 'direct',
  strength: number = 1.0,
  coherence: number = 1.0
): EntanglementRegistry {
  return produce(registry, (draft) => {
    // Check if the entanglement already exists
    const existingEntryIndex = draft.entries.findIndex(
      entry => (
        (entry.sourceId === sourceState.id && entry.targetId === targetState.id) ||
        (entry.sourceId === targetState.id && entry.targetId === sourceState.id)
      )
    );
    
    if (existingEntryIndex >= 0) {
      // Update the existing entry
      draft.entries[existingEntryIndex] = {
        sourceId: sourceState.id,
        targetId: targetState.id,
        type,
        strength,
        coherence,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Add a new entry
      draft.entries.push({
        sourceId: sourceState.id,
        targetId: targetState.id,
        type,
        strength,
        coherence,
        timestamp: new Date().toISOString(),
      });
    }
  });
}

/**
 * Unregisters an entanglement between two quantum states
 * 
 * @param registry - The entanglement registry
 * @param sourceState - The source quantum state
 * @param targetState - The target quantum state
 * @returns The updated entanglement registry
 */
export function unregisterEntanglement(
  registry: EntanglementRegistry,
  sourceState: QuantumState,
  targetState: QuantumState
): EntanglementRegistry {
  return produce(registry, (draft) => {
    // Remove the entanglement entry
    draft.entries = draft.entries.filter(
      entry => !(
        (entry.sourceId === sourceState.id && entry.targetId === targetState.id) ||
        (entry.sourceId === targetState.id && entry.targetId === sourceState.id)
      )
    );
  });
}

/**
 * Gets all entangled states for a quantum state
 * 
 * @param registry - The entanglement registry
 * @param state - The quantum state
 * @returns The entangled state IDs
 */
export function getEntangledStateIds(
  registry: EntanglementRegistry,
  state: QuantumState
): string[] {
  // Find all entries involving the state
  const entries = registry.entries.filter(
    entry => entry.sourceId === state.id || entry.targetId === state.id
  );
  
  // Extract the entangled state IDs
  const entangledStateIds = entries.map(
    entry => entry.sourceId === state.id ? entry.targetId : entry.sourceId
  );
  
  return entangledStateIds;
}

/**
 * Gets the entanglement information between two quantum states
 * 
 * @param registry - The entanglement registry
 * @param sourceState - The source quantum state
 * @param targetState - The target quantum state
 * @returns The entanglement information or undefined if not entangled
 */
export function getEntanglementInfo(
  registry: EntanglementRegistry,
  sourceState: QuantumState,
  targetState: QuantumState
): EntanglementRegistryEntry | undefined {
  // Find the entanglement entry
  const entry = registry.entries.find(
    entry => (
      (entry.sourceId === sourceState.id && entry.targetId === targetState.id) ||
      (entry.sourceId === targetState.id && entry.targetId === sourceState.id)
    )
  );
  
  return entry;
}

/**
 * Synchronizes a transformation across entangled quantum states
 * 
 * @param registry - The entanglement registry
 * @param state - The quantum state being transformed
 * @param transformation - The transformation to apply
 * @param states - Map of state IDs to quantum states
 * @returns Map of state IDs to transformed quantum states
 */
export function synchronizeTransformation(
  registry: EntanglementRegistry,
  state: QuantumState,
  transformation: QuantumTransformation,
  states: Map<string, QuantumState>
): Map<string, QuantumState> {
  // Create a new map for the transformed states
  const transformedStates = new Map<string, QuantumState>(states);
  
  // Apply the transformation to the source state
  const transformedState = transformState(state, transformation);
  transformedStates.set(state.id, transformedState);
  
  // Check if we should propagate transformations
  if (!registry.options.propagateTransformations) {
    return transformedStates;
  }
  
  // Get all entangled state IDs
  const entangledStateIds = getEntangledStateIds(registry, state);
  
  // Process each entangled state
  for (const entangledStateId of entangledStateIds) {
    // Get the entangled state
    const entangledState = states.get(entangledStateId);
    
    if (!entangledState) {
      continue;
    }
    
    // Get the entanglement information
    const entanglementInfo = getEntanglementInfo(registry, state, entangledState);
    
    if (!entanglementInfo) {
      continue;
    }
    
    // Check if the entanglement strength is above the threshold
    if (entanglementInfo.strength < registry.options.propagationThreshold) {
      continue;
    }
    
    // Verify state coherence if needed
    if (registry.options.verifyBeforeSynchronization) {
      const verificationResult = verifyStateCoherence(entangledState);
      
      // Skip if verification fails and repair is not enabled
      if (!verificationResult.success && !registry.options.repairIfVerificationFails) {
        continue;
      }
      
      // Repair if verification fails and repair is enabled
      if (!verificationResult.success && registry.options.repairIfVerificationFails) {
        if (verificationResult.errors) {
          const repairedState = repairStateCoherence(entangledState, verificationResult.errors);
          transformedStates.set(entangledStateId, repairedState);
          continue;
        }
      }
    }
    
    // Create a decayed transformation
    const decayedTransformation: QuantumTransformation = {
      ...transformation,
      coherence: transformation.coherence * entanglementInfo.strength * registry.options.transformationDecayFactor,
    };
    
    // Apply the decayed transformation to the entangled state
    const transformedEntangledState = transformState(entangledState, decayedTransformation);
    
    // Verify state coherence if needed
    if (registry.options.verifyAfterSynchronization) {
      const verificationResult = verifyStateCoherence(transformedEntangledState);
      
      // Skip if verification fails and repair is not enabled
      if (!verificationResult.success && !registry.options.repairIfVerificationFails) {
        continue;
      }
      
      // Repair if verification fails and repair is enabled
      if (!verificationResult.success && registry.options.repairIfVerificationFails) {
        if (verificationResult.errors) {
          const repairedState = repairStateCoherence(transformedEntangledState, verificationResult.errors);
          transformedStates.set(entangledStateId, repairedState);
          continue;
        }
      }
    }
    
    // Update the transformed states map
    transformedStates.set(entangledStateId, transformedEntangledState);
  }
  
  return transformedStates;
}

/**
 * Updates entanglement synchronization options
 * 
 * @param registry - The entanglement registry
 * @param options - The new options
 * @returns The updated entanglement registry
 */
export function updateSynchronizationOptions(
  registry: EntanglementRegistry,
  options: Partial<EntanglementSynchronizationOptions>
): EntanglementRegistry {
  return produce(registry, (draft) => {
    // Update options
    draft.options = {
      ...draft.options,
      ...options,
    };
  });
}