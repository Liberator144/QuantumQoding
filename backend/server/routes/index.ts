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
  
  // Root route
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to QQ-Verse Backend API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        apiHealth: '/api/health',
        documentation: '/api-docs',
        quantum: '/api/v1/quantum',
        dimensional: '/api/v1/dimensional',
        neuralFabric: '/api/v1/neural-fabric',
        consciousness: '/api/v1/consciousness',
        auth: '/api/v1/auth'
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Health check routes
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
    });
  });
};

export default setupRoutes;