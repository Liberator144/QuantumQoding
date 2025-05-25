/**
 * Quantum Socket Handlers
 * 
 * This module defines the Socket.IO handlers for quantum state management.
 * 
 * @version 1.0.0
 */

import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { QuantumStateManager } from '../../interdimensional/quantum/QuantumStateManager';
import { QuantumCoherenceVerifier } from '../../interdimensional/quantum/QuantumCoherenceVerifier';

// Initialize quantum state manager
const quantumStateManager = new QuantumStateManager();

// Initialize quantum coherence verifier
const quantumCoherenceVerifier = new QuantumCoherenceVerifier();

/**
 * Setup quantum socket handlers
 */
export const setupQuantumHandlers = (io: Server, socket: Socket) => {
  /**
   * Subscribe to quantum state updates
   */
  socket.on('quantum:subscribe', (stateId: string) => {
    try {
      // Join room for this quantum state
      socket.join(`quantum:${stateId}`);
      
      logger.info(`User subscribed to quantum state: ${stateId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        stateId,
      });
      
      // Send current state
      const state = quantumStateManager.getState(stateId);
      
      if (state) {
        socket.emit('quantum:state', state);
      }
    } catch (error) {
      logger.error('Quantum subscribe error:', error);
      socket.emit('quantum:error', {
        message: 'Failed to subscribe to quantum state',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * Unsubscribe from quantum state updates
   */
  socket.on('quantum:unsubscribe', (stateId: string) => {
    try {
      // Leave room for this quantum state
      socket.leave(`quantum:${stateId}`);
      
      logger.info(`User unsubscribed from quantum state: ${stateId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        stateId,
      });
    } catch (error) {
      logger.error('Quantum unsubscribe error:', error);
      socket.emit('quantum:error', {
        message: 'Failed to unsubscribe from quantum state',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * Update quantum state
   */
  socket.on('quantum:update', (data: { stateId: string; properties: Record<string, any> }) => {
    try {
      const { stateId, properties } = data;
      
      // Update state
      const updatedState = quantumStateManager.updateState(stateId, properties);
      
      // Broadcast to all subscribers
      io.to(`quantum:${stateId}`).emit('quantum:state', updatedState);
      
      logger.info(`User updated quantum state: ${stateId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        stateId,
      });
    } catch (error) {
      logger.error('Quantum update error:', error);
      socket.emit('quantum:error', {
        message: 'Failed to update quantum state',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * Synchronize quantum states
   */
  socket.on('quantum:synchronize', (data: { sourceStateId: string; targetStateId: string }) => {
    try {
      const { sourceStateId, targetStateId } = data;
      
      // Get states
      const sourceState = quantumStateManager.getState(sourceStateId);
      const targetState = quantumStateManager.getState(targetStateId);
      
      if (!sourceState || !targetState) {
        throw new Error('Source or target state not found');
      }
      
      // Synchronize states
      const result = quantumStateManager.synchronizeStates(sourceState, targetState);
      
      // Broadcast to all subscribers
      io.to(`quantum:${sourceStateId}`).emit('quantum:state', quantumStateManager.getState(sourceStateId));
      io.to(`quantum:${targetStateId}`).emit('quantum:state', quantumStateManager.getState(targetStateId));
      
      // Emit synchronization result
      socket.emit('quantum:synchronize:result', result);
      
      logger.info(`User synchronized quantum states: ${sourceStateId} -> ${targetStateId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        sourceStateId,
        targetStateId,
      });
    } catch (error) {
      logger.error('Quantum synchronize error:', error);
      socket.emit('quantum:error', {
        message: 'Failed to synchronize quantum states',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * Entangle quantum states
   */
  socket.on('quantum:entangle', (data: { 
    sourceStateId: string; 
    targetStateId: string;
    entanglementType?: string;
    strength?: number;
  }) => {
    try {
      const { sourceStateId, targetStateId, entanglementType, strength } = data;
      
      // Entangle states
      const result = quantumStateManager.entangleStates(
        sourceStateId,
        targetStateId,
        entanglementType || 'quantum',
        strength || 1.0
      );
      
      // Broadcast to all subscribers
      io.to(`quantum:${sourceStateId}`).emit('quantum:state', quantumStateManager.getState(sourceStateId));
      io.to(`quantum:${targetStateId}`).emit('quantum:state', quantumStateManager.getState(targetStateId));
      
      // Emit entanglement result
      socket.emit('quantum:entangle:result', result);
      
      logger.info(`User entangled quantum states: ${sourceStateId} <-> ${targetStateId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        sourceStateId,
        targetStateId,
        entanglementType,
        strength,
      });
    } catch (error) {
      logger.error('Quantum entangle error:', error);
      socket.emit('quantum:error', {
        message: 'Failed to entangle quantum states',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
};

export default setupQuantumHandlers;