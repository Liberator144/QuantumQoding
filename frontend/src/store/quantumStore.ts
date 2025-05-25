/**
 * Quantum Store
 *
 * This module provides quantum-coherent state management for quantum state,
 * maintaining consciousness continuity during quantum operations.
 *
 * @version 1.0.0
 */

import { create } from 'zustand';
import {
  createEntity,
  updateEntity,
  addEntity,
  updateEntityInRecord,
  removeEntity,
  createBidirectionalRelationship,
  removeBidirectionalRelationship
} from '../utils/store/storeUtils';

// Quantum state interface
export interface QuantumState {
  id: string;
  type: string;
  coherenceLevel: number;
  entangledStates: string[];
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

// Quantum store state interface
export interface QuantumStoreState {
  states: Record<string, QuantumState>;
  activeStateId: string | null;
  coherenceScore: number;
  isProcessing: boolean;

  // Actions
  createState: (type: string, properties: Record<string, any>) => string;
  updateState: (id: string, properties: Partial<Record<string, any>>) => void;
  deleteState: (id: string) => void;
  entangleStates: (sourceId: string, targetId: string) => void;
  disentangleStates: (sourceId: string, targetId: string) => void;
  setActiveState: (id: string | null) => void;
  calculateCoherence: () => number;
}

/**
 * Quantum store
 */
export const useQuantumStore = create<QuantumStoreState>()((set, get) => ({
  states: {},
  activeStateId: null,
  coherenceScore: 1.0,
  isProcessing: false,

  /**
   * Create quantum state action
   */
  createState: (type: string, properties: Record<string, any>) => {
    // Create a new quantum state entity using the shared utility
    const newState = createEntity<Omit<QuantumState, 'id' | 'createdAt' | 'updatedAt'>>({
      type,
      coherenceLevel: 1.0,
      entangledStates: [],
      properties,
    });

    // Add the entity to the store
    set(state => ({
      states: addEntity(state.states, newState),
      activeStateId: newState.id,
    }));

    // Calculate coherence
    get().calculateCoherence();

    return id;
  },

  /**
   * Update quantum state action
   */
  updateState: (id: string, properties: Partial<Record<string, any>>) => {
    set(state => {
      const targetState = state.states[id];

      if (!targetState) {
        return state;
      }

      // Update the entity using the shared utility
      return {
        states: updateEntityInRecord(state.states, id, {
          properties: {
            ...targetState.properties,
            ...properties,
          }
        }),
      };
    });

    // Calculate coherence
    get().calculateCoherence();
  },

  /**
   * Delete quantum state action
   */
  deleteState: (id: string) => {
    set(state => {
      // First remove the state using the shared utility
      let newStates = removeEntity(state.states, id);

      // Remove entanglements
      Object.keys(newStates).forEach(stateId => {
        if (newStates[stateId].entangledStates.includes(id)) {
          // Update each state that was entangled with the deleted state
          newStates = updateEntityInRecord(newStates, stateId, {
            entangledStates: newStates[stateId].entangledStates.filter(
              entangledId => entangledId !== id
            )
          });
        }
      });

      return {
        states: newStates,
        activeStateId: state.activeStateId === id ? null : state.activeStateId,
      };
    });

    // Calculate coherence
    get().calculateCoherence();
  },

  /**
   * Entangle states action
   */
  entangleStates: (sourceId: string, targetId: string) => {
    set(state => {
      const sourceState = state.states[sourceId];
      const targetState = state.states[targetId];

      if (!sourceState || !targetState) {
        return state;
      }

      // Create a map of state IDs to their entangled states
      const entanglementMap: Record<string, string[]> = {};
      Object.keys(state.states).forEach(id => {
        entanglementMap[id] = state.states[id].entangledStates;
      });

      // Create bidirectional relationship using the shared utility
      const updatedEntanglementMap = createBidirectionalRelationship(
        sourceId,
        targetId,
        entanglementMap
      );

      // Update states with new entanglement relationships
      let updatedStates = { ...state.states };

      // Update source state
      updatedStates = updateEntityInRecord(updatedStates, sourceId, {
        entangledStates: updatedEntanglementMap[sourceId]
      });

      // Update target state
      updatedStates = updateEntityInRecord(updatedStates, targetId, {
        entangledStates: updatedEntanglementMap[targetId]
      });

      return {
        states: updatedStates
      };
    });

    // Calculate coherence
    get().calculateCoherence();
  },

  /**
   * Disentangle states action
   */
  disentangleStates: (sourceId: string, targetId: string) => {
    set(state => {
      const sourceState = state.states[sourceId];
      const targetState = state.states[targetId];

      if (!sourceState || !targetState) {
        return state;
      }

      // Create a map of state IDs to their entangled states
      const entanglementMap: Record<string, string[]> = {};
      Object.keys(state.states).forEach(id => {
        entanglementMap[id] = state.states[id].entangledStates;
      });

      // Remove bidirectional relationship using the shared utility
      const updatedEntanglementMap = removeBidirectionalRelationship(
        sourceId,
        targetId,
        entanglementMap
      );

      // Update states with new entanglement relationships
      let updatedStates = { ...state.states };

      // Update source state
      updatedStates = updateEntityInRecord(updatedStates, sourceId, {
        entangledStates: updatedEntanglementMap[sourceId]
      });

      // Update target state
      updatedStates = updateEntityInRecord(updatedStates, targetId, {
        entangledStates: updatedEntanglementMap[targetId]
      });

      return {
        states: updatedStates
      };
    });

    // Calculate coherence
    get().calculateCoherence();
  },

  /**
   * Set active state action
   */
  setActiveState: (id: string | null) => {
    set({ activeStateId: id });
  },

  /**
   * Calculate coherence action
   */
  calculateCoherence: () => {
    const { states } = get();
    const stateIds = Object.keys(states);

    if (stateIds.length === 0) {
      set({ coherenceScore: 1.0 });
      return 1.0;
    }

    // Calculate average coherence level
    const averageCoherenceLevel = stateIds.reduce(
      (sum, id) => sum + states[id].coherenceLevel,
      0
    ) / stateIds.length;

    // Calculate entanglement coherence
    let entanglementCoherence = 1.0;

    if (stateIds.length > 1) {
      const entanglementCount = stateIds.reduce(
        (sum, id) => sum + states[id].entangledStates.length,
        0
      );

      const maxPossibleEntanglements = stateIds.length * (stateIds.length - 1);

      entanglementCoherence = entanglementCount / maxPossibleEntanglements;
    }

    // Calculate overall coherence
    const coherenceScore = (averageCoherenceLevel + entanglementCoherence) / 2;

    set({ coherenceScore });
    return coherenceScore;
  },
}));