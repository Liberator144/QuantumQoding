/**
 * API Routes
 * 
 * This module sets up the API routes for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import { Express } from 'express';
import { requestLogger } from '../utils/logger';
import authRoutes from './auth.routes';
import quantumRoutes from './quantum.routes';
import dimensionalRoutes from './dimensional.routes';
import neuralFabricRoutes from './neuralFabric.routes';
import consciousnessRoutes from './consciousness.routes';

/**
 * Setup API routes
 */
export const setupRoutes = (app: Express) => {
  // Apply request logger middleware
  app.use(requestLogger);
  
  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/quantum', quantumRoutes);
  app.use('/api/v1/dimensional', dimensionalRoutes);
  app.use('/api/v1/neural-fabric', neuralFabricRoutes);
  app.use('/api/v1/consciousness', consciousnessRoutes);
  
  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });
  
  // 404 route
  app.all('*', (req, res) => {
    res.status(404).json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`,
    });
  });
};

export default setupRoutes;