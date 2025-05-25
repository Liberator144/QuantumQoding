/**
 * Swagger Middleware
 * 
 * This middleware serves the Swagger UI for API documentation.
 * 
 * @version 1.0.0
 */

import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Setup Swagger middleware
 */
export const setupSwagger = (app: Express) => {
  try {
    logger.info('Setting up Swagger UI...');
    
    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    // Serve Swagger JSON
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerDocument);
    });
    
    logger.info('Swagger UI setup complete');
  } catch (error) {
    logger.error('Swagger setup error:', error);
    throw error;
  }
};

export default setupSwagger;