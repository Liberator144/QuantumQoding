/**
 * API Module
 * 
 * This module exports the API endpoints for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import { Express } from 'express';
import { logger } from '../utils/logger';
import { setupQuantumAPI } from './quantum.api';
import { setupDimensionalAPI } from './dimensional.api';
import { setupNeuralFabricAPI } from './neuralFabric.api';
import { setupConsciousnessAPI } from './consciousness.api';
import { setupUserAPI } from './user.api';
import { setupAuthAPI } from './auth.api';

/**
 * Setup API endpoints
 */
export const setupAPI = (app: Express) => {
  logger.info('Setting up API endpoints...');
  
  // Setup API endpoints
  setupQuantumAPI(app);
  setupDimensionalAPI(app);
  setupNeuralFabricAPI(app);
  setupConsciousnessAPI(app);
  setupUserAPI(app);
  setupAuthAPI(app);
  
  logger.info('API endpoints setup complete');
};

export default setupAPI;