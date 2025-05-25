/**
 * Quantum Controller
 * 
 * This module defines the quantum state management controllers for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { QuantumStateManager } from '../../interdimensional/quantum/QuantumStateManager';
import { QuantumCoherenceVerifier } from '../../interdimensional/quantum/QuantumCoherenceVerifier';

// Initialize quantum state manager
const quantumStateManager = new QuantumStateManager();

// Initialize quantum coherence verifier
const quantumCoherenceVerifier = new QuantumCoherenceVerifier();

/**
 * Get all quantum states
 * @route   GET /api/v1/quantum/states
 * @access  Private
 */
export const getAllStates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get all states from quantum state manager
    const states = quantumStateManager.getAllStates();
    
    res.status(200).json({
      status: 'success',
      results: states.length,
      data: {
        states,
      },
    });
  } catch (error) {
    logger.error('Get all quantum states error:', error);
    next(error);
  }
};

/**
 * Get quantum state by ID
 * @route   GET /api/v1/quantum/states/:id
 * @access  Private
 */
export const getStateById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get state from quantum state manager
    const state = quantumStateManager.getState(id);
    
    if (!state) {
      return next(new AppError(`Quantum state with ID ${id} not found`, 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        state,
      },
    });
  } catch (error) {
    logger.error('Get quantum state by ID error:', error);
    next(error);
  }
};

/**
 * Create a new quantum state
 * @route   POST /api/v1/quantum/states
 * @access  Private
 */
export const createState = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { properties } = req.body;
    
    // Create state in quantum state manager
    const state = quantumStateManager.createState(properties);
    
    res.status(201).json({
      status: 'success',
      data: {
        state,
      },
    });
  } catch (error) {
    logger.error('Create quantum state error:', error);
    next(error);
  }
};

/**
 * Update quantum state
 * @route   PUT /api/v1/quantum/states/:id
 * @access  Private
 */
export const updateState = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { properties } = req.body;
    
    // Get state from quantum state manager
    const state = quantumStateManager.getState(id);
    
    if (!state) {
      return next(new AppError(`Quantum state with ID ${id} not found`, 404));
    }
    
    // Update state in quantum state manager
    const updatedState = quantumStateManager.updateState(id, properties);
    
    res.status(200).json({
      status: 'success',
      data: {
        state: updatedState,
      },
    });
  } catch (error) {
    logger.error('Update quantum state error:', error);
    next(error);
  }
};

/**
 * Delete quantum state
 * @route   DELETE /api/v1/quantum/states/:id
 * @access  Private
 */
export const deleteState = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get state from quantum state manager
    const state = quantumStateManager.getState(id);
    
    if (!state) {
      return next(new AppError(`Quantum state with ID ${id} not found`, 404));
    }
    
    // Delete state in quantum state manager
    quantumStateManager.deleteState(id);
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    logger.error('Delete quantum state error:', error);
    next(error);
  }
};/**
 * Synchronize quantum states
 * @route   POST /api/v1/quantum/states/:id/synchronize
 * @access  Private
 */
export const synchronizeStates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { targetStateId } = req.body;
    
    // Validate input
    if (!targetStateId) {
      return next(new AppError('Please provide target state ID', 400));
    }
    
    // Get source state from quantum state manager
    const sourceState = quantumStateManager.getState(id);
    
    if (!sourceState) {
      return next(new AppError(`Source quantum state with ID ${id} not found`, 404));
    }
    
    // Get target state from quantum state manager
    const targetState = quantumStateManager.getState(targetStateId);
    
    if (!targetState) {
      return next(new AppError(`Target quantum state with ID ${targetStateId} not found`, 404));
    }
    
    // Synchronize states in quantum state manager
    const result = quantumStateManager.synchronizeStates(sourceState, targetState);
    
    res.status(200).json({
      status: 'success',
      data: {
        result,
      },
    });
  } catch (error) {
    logger.error('Synchronize quantum states error:', error);
    next(error);
  }
};

/**
 * Get quantum state vector
 * @route   GET /api/v1/quantum/states/:id/vector
 * @access  Private
 */
export const getStateVector = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get state vector from quantum state manager
    const stateVector = quantumStateManager.getStateVector(id);
    
    if (!stateVector) {
      return next(new AppError(`Quantum state vector with ID ${id} not found`, 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        stateVector,
      },
    });
  } catch (error) {
    logger.error('Get quantum state vector error:', error);
    next(error);
  }
};

/**
 * Update quantum state vector
 * @route   PUT /api/v1/quantum/states/:id/vector
 * @access  Private
 */
export const updateStateVector = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { vector } = req.body;
    
    // Validate input
    if (!vector) {
      return next(new AppError('Please provide state vector', 400));
    }
    
    // Get state from quantum state manager
    const state = quantumStateManager.getState(id);
    
    if (!state) {
      return next(new AppError(`Quantum state with ID ${id} not found`, 404));
    }
    
    // Update state vector in quantum state manager
    const updatedVector = quantumStateManager.updateStateVector(id, vector);
    
    res.status(200).json({
      status: 'success',
      data: {
        stateVector: updatedVector,
      },
    });
  } catch (error) {
    logger.error('Update quantum state vector error:', error);
    next(error);
  }
};/**
 * Transform quantum state
 * @route   POST /api/v1/quantum/states/:id/transform
 * @access  Private
 */
export const transformState = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { transformation } = req.body;
    
    // Validate input
    if (!transformation) {
      return next(new AppError('Please provide transformation', 400));
    }
    
    // Get state from quantum state manager
    const state = quantumStateManager.getState(id);
    
    if (!state) {
      return next(new AppError(`Quantum state with ID ${id} not found`, 404));
    }
    
    // Transform state in quantum state manager
    const transformedState = quantumStateManager.transformState(id, transformation);
    
    res.status(200).json({
      status: 'success',
      data: {
        state: transformedState,
      },
    });
  } catch (error) {
    logger.error('Transform quantum state error:', error);
    next(error);
  }
};

/**
 * Verify quantum state coherence
 * @route   POST /api/v1/quantum/states/:id/verify-coherence
 * @access  Private
 */
export const verifyCoherence = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { referenceStateId, options } = req.body;
    
    // Validate input
    if (!referenceStateId) {
      return next(new AppError('Please provide reference state ID', 400));
    }
    
    // Get source state from quantum state manager
    const sourceState = quantumStateManager.getState(id);
    
    if (!sourceState) {
      return next(new AppError(`Source quantum state with ID ${id} not found`, 404));
    }
    
    // Get reference state from quantum state manager
    const referenceState = quantumStateManager.getState(referenceStateId);
    
    if (!referenceState) {
      return next(new AppError(`Reference quantum state with ID ${referenceStateId} not found`, 404));
    }
    
    // Verify coherence using quantum coherence verifier
    const result = quantumCoherenceVerifier.verifyCoherence(sourceState, referenceState, options);
    
    res.status(200).json({
      status: 'success',
      data: {
        result,
      },
    });
  } catch (error) {
    logger.error('Verify quantum state coherence error:', error);
    next(error);
  }
};

/**
 * Get quantum state history
 * @route   GET /api/v1/quantum/states/:id/history
 * @access  Private
 */
export const getStateHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get state from quantum state manager
    const state = quantumStateManager.getState(id);
    
    if (!state) {
      return next(new AppError(`Quantum state with ID ${id} not found`, 404));
    }
    
    // Get state history from quantum state manager
    const history = quantumStateManager.getStateHistory(id);
    
    res.status(200).json({
      status: 'success',
      results: history.length,
      data: {
        history,
      },
    });
  } catch (error) {
    logger.error('Get quantum state history error:', error);
    next(error);
  }
};/**
 * Entangle quantum states
 * @route   POST /api/v1/quantum/states/:id/entangle
 * @access  Private
 */
export const entangleStates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { targetStateId, entanglementType, strength } = req.body;
    
    // Validate input
    if (!targetStateId) {
      return next(new AppError('Please provide target state ID', 400));
    }
    
    // Get source state from quantum state manager
    const sourceState = quantumStateManager.getState(id);
    
    if (!sourceState) {
      return next(new AppError(`Source quantum state with ID ${id} not found`, 404));
    }
    
    // Get target state from quantum state manager
    const targetState = quantumStateManager.getState(targetStateId);
    
    if (!targetState) {
      return next(new AppError(`Target quantum state with ID ${targetStateId} not found`, 404));
    }
    
    // Entangle states in quantum state manager
    const result = quantumStateManager.entangleStates(
      id,
      targetStateId,
      entanglementType || 'quantum',
      strength || 1.0
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        result,
      },
    });
  } catch (error) {
    logger.error('Entangle quantum states error:', error);
    next(error);
  }
};

/**
 * Disentangle quantum state
 * @route   POST /api/v1/quantum/states/:id/disentangle
 * @access  Private
 */
export const disentangleState = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { targetStateId } = req.body;
    
    // Get source state from quantum state manager
    const sourceState = quantumStateManager.getState(id);
    
    if (!sourceState) {
      return next(new AppError(`Source quantum state with ID ${id} not found`, 404));
    }
    
    // Disentangle state in quantum state manager
    const result = targetStateId
      ? quantumStateManager.disentangleStates(id, targetStateId)
      : quantumStateManager.disentangleAllStates(id);
    
    res.status(200).json({
      status: 'success',
      data: {
        result,
      },
    });
  } catch (error) {
    logger.error('Disentangle quantum state error:', error);
    next(error);
  }
};