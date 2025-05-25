/**
 * Neural Fabric API
 * 
 * This module defines the neural fabric management API endpoints.
 * 
 * @version 1.0.0
 */

import { Express } from 'express';
import { protect } from '../middleware/auth';
import * as neuralFabricController from '../controllers/neuralFabric.controller';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Setup neural fabric API endpoints
 */
export const setupNeuralFabricAPI = (app: Express) => {
  const basePath = '/api/v1/neural-fabric';
  
  logger.info(`Setting up neural fabric API endpoints at ${basePath}`);
  
  // Get neural fabric
  app.get(`${basePath}`, protect, neuralFabricController.getFabric);
  
  // Create a new neural fabric
  app.post(`${basePath}`, protect, neuralFabricController.createFabric);
  
  // Get all nodes
  app.get(`${basePath}/nodes`, protect, neuralFabricController.getAllNodes);
  
  // Get node by ID
  app.get(`${basePath}/nodes/:id`, protect, neuralFabricController.getNodeById);
  
  // Create a new node
  app.post(`${basePath}/nodes`, protect, neuralFabricController.createNode);
  
  // Update node
  app.put(`${basePath}/nodes/:id`, protect, neuralFabricController.updateNode);
  
  // Delete node
  app.delete(`${basePath}/nodes/:id`, protect, neuralFabricController.deleteNode);
  
  // Get all connections
  app.get(`${basePath}/connections`, protect, neuralFabricController.getAllConnections);
  
  // Get connection by ID
  app.get(`${basePath}/connections/:id`, protect, neuralFabricController.getConnectionById);
  
  // Create a new connection
  app.post(`${basePath}/connections`, protect, neuralFabricController.createConnection);
  
  // Update connection
  app.put(`${basePath}/connections/:id`, protect, neuralFabricController.updateConnection);
  
  // Delete connection
  app.delete(`${basePath}/connections/:id`, protect, neuralFabricController.deleteConnection);
  
  // Get all pathways
  app.get(`${basePath}/pathways`, protect, neuralFabricController.getAllPathways);
  
  // Get pathway by ID
  app.get(`${basePath}/pathways/:id`, protect, neuralFabricController.getPathwayById);
  
  // Create a new pathway
  app.post(`${basePath}/pathways`, protect, neuralFabricController.createPathway);
  
  // Update pathway
  app.put(`${basePath}/pathways/:id`, protect, neuralFabricController.updatePathway);
  
  // Delete pathway
  app.delete(`${basePath}/pathways/:id`, protect, neuralFabricController.deletePathway);
  
  // Verify neural fabric
  app.post(`${basePath}/verify`, protect, neuralFabricController.verifyFabric);
  
  // Synchronize quantum states through neural fabric
  app.post(
    `${basePath}/synchronize-quantum-states`,
    protect,
    neuralFabricController.synchronizeQuantumStates
  );
  
  // Propagate consciousness through neural fabric
  app.post(
    `${basePath}/propagate-consciousness`,
    protect,
    neuralFabricController.propagateConsciousness
  );
  
  logger.info(`Neural fabric API endpoints setup complete`);
};

export default setupNeuralFabricAPI;