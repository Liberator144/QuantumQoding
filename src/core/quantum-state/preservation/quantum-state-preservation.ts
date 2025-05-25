// src/core/quantum-state/preservation/quantum-state-preservation.ts
/**
 * Quantum State Preservation Implementation
 * 
 * This module implements the quantum state preservation functionality for the QQ-Verse project,
 * ensuring state preservation across dimensional boundaries.
 */

import { v4 as uuidv4 } from 'uuid';
import { produce } from 'immer';

// Import types from the types directory
import type {
  QuantumState,
  QuantumStateCheckpoint,
  VerificationResult,
  VerificationError,
} from '../../../../types';

// Import functions from other modules
import {
  createState,
  createCheckpoint,
  restoreFromCheckpoint,
  verifyStateCoherence,
  repairStateCoherence,
} from '../quantum-state';

/**
 * Quantum state preservation options
 */
export interface QuantumStatePreservationOptions {
  /** Whether to create checkpoints automatically */
  autoCheckpoint: boolean;
  
  /** Checkpoint frequency (in operations) */
  checkpointFrequency: number;
  
  /** Maximum number of checkpoints to keep */
  maxCheckpoints: number;
  
  /** Whether to verify state coherence before preservation */
  verifyBeforePreservation: boolean;
  
  /** Whether to verify state coherence after restoration */
  verifyAfterRestoration: boolean;
  
  /** Whether to repair state coherence if verification fails */
  repairIfVerificationFails: boolean;
}

/**
 * Default quantum state preservation options
 */
export const defaultQuantumStatePreservationOptions: QuantumStatePreservationOptions = {
  autoCheckpoint: true,
  checkpointFrequency: 10,
  maxCheckpoints: 100,
  verifyBeforePreservation: true,
  verifyAfterRestoration: true,
  repairIfVerificationFails: true,
};

/**
 * Quantum state preservation context
 */
export interface QuantumStatePreservationContext {
  /** Quantum state being preserved */
  state: QuantumState;
  
  /** Checkpoints for the quantum state */
  checkpoints: QuantumStateCheckpoint[];
  
  /** Current checkpoint index */
  currentCheckpointIndex: number;
  
  /** Operation count since last checkpoint */
  operationCount: number;
  
  /** Preservation options */
  options: QuantumStatePreservationOptions;
}

/**
 * Creates a new quantum state preservation context
 * 
 * @param state - The quantum state to preserve
 * @param options - Preservation options
 * @returns A new quantum state preservation context
 */
export function createPreservationContext(
  state: QuantumState,
  options: Partial<QuantumStatePreservationOptions> = {}
): QuantumStatePreservationContext {
  // Merge options with defaults
  const mergedOptions: QuantumStatePreservationOptions = {
    ...defaultQuantumStatePreservationOptions,
    ...options,
  };
  
  // Create initial checkpoint
  const initialCheckpoint = createCheckpoint(state);
  
  // Create the preservation context
  const context: QuantumStatePreservationContext = {
    state,
    checkpoints: [initialCheckpoint],
    currentCheckpointIndex: 0,
    operationCount: 0,
    options: mergedOptions,
  };
  
  return context;
}

/**
 * Preserves a quantum state
 * 
 * @param context - The preservation context
 * @param state - The quantum state to preserve
 * @param force - Whether to force preservation regardless of operation count
 * @returns The updated preservation context
 */
export function preserveState(
  context: QuantumStatePreservationContext,
  state: QuantumState,
  force: boolean = false
): QuantumStatePreservationContext {
  return produce(context, (draft) => {
    // Update the state
    draft.state = state;
    
    // Increment operation count
    draft.operationCount += 1;
    
    // Check if we should create a checkpoint
    const shouldCheckpoint = force || 
      (draft.options.autoCheckpoint && 
       draft.operationCount >= draft.options.checkpointFrequency);
    
    if (shouldCheckpoint) {
      // Verify state coherence if needed
      if (draft.options.verifyBeforePreservation) {
        const verificationResult = verifyStateCoherence(state);
        
        // Repair if verification fails and repair is enabled
        if (!verificationResult.success && draft.options.repairIfVerificationFails) {
          if (verificationResult.errors) {
            draft.state = repairStateCoherence(state, verificationResult.errors);
          }
        }
      }
      
      // Create a checkpoint
      const checkpoint = createCheckpoint(draft.state);
      
      // Remove checkpoints after the current index
      draft.checkpoints = draft.checkpoints.slice(0, draft.currentCheckpointIndex + 1);
      
      // Add the new checkpoint
      draft.checkpoints.push(checkpoint);
      
      // Update current checkpoint index
      draft.currentCheckpointIndex = draft.checkpoints.length - 1;
      
      // Limit the number of checkpoints
      if (draft.checkpoints.length > draft.options.maxCheckpoints) {
        draft.checkpoints = draft.checkpoints.slice(-draft.options.maxCheckpoints);
        draft.currentCheckpointIndex = draft.checkpoints.length - 1;
      }
      
      // Reset operation count
      draft.operationCount = 0;
    }
  });
}

/**
 * Restores a quantum state from a checkpoint
 * 
 * @param context - The preservation context
 * @param checkpointIndex - The index of the checkpoint to restore from
 * @returns The updated preservation context
 */
export function restoreState(
  context: QuantumStatePreservationContext,
  checkpointIndex: number
): QuantumStatePreservationContext {
  return produce(context, (draft) => {
    // Check if the checkpoint index is valid
    if (checkpointIndex < 0 || checkpointIndex >= draft.checkpoints.length) {
      throw new Error(`Invalid checkpoint index: ${checkpointIndex}`);
    }
    
    // Restore the state from the checkpoint
    draft.state = restoreFromCheckpoint(draft.checkpoints[checkpointIndex]);
    
    // Update current checkpoint index
    draft.currentCheckpointIndex = checkpointIndex;
    
    // Reset operation count
    draft.operationCount = 0;
    
    // Verify state coherence if needed
    if (draft.options.verifyAfterRestoration) {
      const verificationResult = verifyStateCoherence(draft.state);
      
      // Repair if verification fails and repair is enabled
      if (!verificationResult.success && draft.options.repairIfVerificationFails) {
        if (verificationResult.errors) {
          draft.state = repairStateCoherence(draft.state, verificationResult.errors);
        }
      }
    }
  });
}

/**
 * Undoes the last operation
 * 
 * @param context - The preservation context
 * @returns The updated preservation context
 */
export function undoOperation(
  context: QuantumStatePreservationContext
): QuantumStatePreservationContext {
  return produce(context, (draft) => {
    // Check if we can undo
    if (draft.currentCheckpointIndex <= 0) {
      throw new Error('Cannot undo: no previous checkpoint');
    }
    
    // Restore the state from the previous checkpoint
    draft.state = restoreFromCheckpoint(draft.checkpoints[draft.currentCheckpointIndex - 1]);
    
    // Update current checkpoint index
    draft.currentCheckpointIndex -= 1;
    
    // Reset operation count
    draft.operationCount = 0;
  });
}

/**
 * Redoes the last undone operation
 * 
 * @param context - The preservation context
 * @returns The updated preservation context
 */
export function redoOperation(
  context: QuantumStatePreservationContext
): QuantumStatePreservationContext {
  return produce(context, (draft) => {
    // Check if we can redo
    if (draft.currentCheckpointIndex >= draft.checkpoints.length - 1) {
      throw new Error('Cannot redo: no next checkpoint');
    }
    
    // Restore the state from the next checkpoint
    draft.state = restoreFromCheckpoint(draft.checkpoints[draft.currentCheckpointIndex + 1]);
    
    // Update current checkpoint index
    draft.currentCheckpointIndex += 1;
    
    // Reset operation count
    draft.operationCount = 0;
  });
}

/**
 * Gets the current quantum state
 * 
 * @param context - The preservation context
 * @returns The current quantum state
 */
export function getCurrentState(
  context: QuantumStatePreservationContext
): QuantumState {
  return context.state;
}

/**
 * Gets all checkpoints
 * 
 * @param context - The preservation context
 * @returns All checkpoints
 */
export function getAllCheckpoints(
  context: QuantumStatePreservationContext
): QuantumStateCheckpoint[] {
  return [...context.checkpoints];
}

/**
 * Gets the current checkpoint
 * 
 * @param context - The preservation context
 * @returns The current checkpoint
 */
export function getCurrentCheckpoint(
  context: QuantumStatePreservationContext
): QuantumStateCheckpoint {
  return context.checkpoints[context.currentCheckpointIndex];
}

/**
 * Clears all checkpoints except the current one
 * 
 * @param context - The preservation context
 * @returns The updated preservation context
 */
export function clearCheckpoints(
  context: QuantumStatePreservationContext
): QuantumStatePreservationContext {
  return produce(context, (draft) => {
    // Keep only the current checkpoint
    const currentCheckpoint = draft.checkpoints[draft.currentCheckpointIndex];
    draft.checkpoints = [currentCheckpoint];
    draft.currentCheckpointIndex = 0;
  });
}

/**
 * Updates preservation options
 * 
 * @param context - The preservation context
 * @param options - The new options
 * @returns The updated preservation context
 */
export function updatePreservationOptions(
  context: QuantumStatePreservationContext,
  options: Partial<QuantumStatePreservationOptions>
): QuantumStatePreservationContext {
  return produce(context, (draft) => {
    // Update options
    draft.options = {
      ...draft.options,
      ...options,
    };
  });
}