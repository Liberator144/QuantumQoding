/**
 * Quantum API
 * 
 * This module defines the quantum state management API endpoints.
 * 
 * @version 1.0.0
 */

import { Express } from 'express';
import { protect } from '../middleware/auth';
import * as quantumController from '../controllers/quantum.controller';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Setup quantum API endpoints
 */
export const setupQuantumAPI = (app: Express) => {
  const basePath = '/api/v1/quantum';
  
  logger.info(`Setting up quantum API endpoints at ${basePath}`);
  
  // Get all quantum states
  app.get(`${basePath}/states`, protect, quantumController.getAllStates);
  
  // Get quantum state by ID
  app.get(`${basePath}/states/:id`, protect, quantumController.getStateById);
  
  // Create a new quantum state
  app.post(`${basePath}/states`, protect, quantumController.createState);
  
  // Update quantum state
  app.put(`${basePath}/states/:id`, protect, quantumController.updateState);
  
  // Delete quantum state
  app.delete(`${basePath}/states/:id`, protect, quantumController.deleteState);
  
  // Synchronize quantum states
  app.post(`${basePath}/states/:id/synchronize`, protect, quantumController.synchronizeStates);
  
  // Get quantum state vector
  app.get(`${basePath}/states/:id/vector`, protect, quantumController.getStateVector);
  
  // Update quantum state vector
  app.put(`${basePath}/states/:id/vector`, protect, quantumController.updateStateVector);
  
  // Transform quantum state
  app.post(`${basePath}/states/:id/transform`, protect, quantumController.transformState);
  
  // Verify quantum state coherence
  app.post(`${basePath}/states/:id/verify-coherence`, protect, quantumController.verifyCoherence);
  
  // Get quantum state history
  app.get(`${basePath}/states/:id/history`, protect, quantumController.getStateHistory);
  
  // Entangle quantum states
  app.post(`${basePath}/states/:id/entangle`, protect, quantumController.entangleStates);
  
  // Disentangle quantum state
  app.post(`${basePath}/states/:id/disentangle`, protect, quantumController.disentangleState);
  
  logger.info(`Quantum API endpoints setup complete`);
};

export default setupQuantumAPI;