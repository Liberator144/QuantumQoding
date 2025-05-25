/**
 * Consciousness Stream API
 * 
 * This module defines the consciousness stream management API endpoints.
 * 
 * @version 1.0.0
 */

import { Express } from 'express';
import { protect } from '../middleware/auth';
import * as consciousnessController from '../controllers/consciousness.controller';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Setup consciousness stream API endpoints
 */
export const setupConsciousnessAPI = (app: Express) => {
  const basePath = '/api/v1/consciousness';
  
  logger.info(`Setting up consciousness stream API endpoints at ${basePath}`);
  
  // Get all consciousness streams
  app.get(`${basePath}/streams`, protect, consciousnessController.getAllStreams);
  
  // Get consciousness stream by ID
  app.get(`${basePath}/streams/:id`, protect, consciousnessController.getStreamById);
  
  // Create a new consciousness stream
  app.post(`${basePath}/streams`, protect, consciousnessController.createStream);
  
  // Update consciousness stream
  app.put(`${basePath}/streams/:id`, protect, consciousnessController.updateStream);
  
  // Delete consciousness stream
  app.delete(`${basePath}/streams/:id`, protect, consciousnessController.deleteStream);
  
  // Get all packets in a consciousness stream
  app.get(`${basePath}/streams/:id/packets`, protect, consciousnessController.getStreamPackets);
  
  // Get consciousness stream packet by ID
  app.get(`${basePath}/packets/:id`, protect, consciousnessController.getPacketById);
  
  // Create a new consciousness stream packet
  app.post(`${basePath}/streams/:id/packets`, protect, consciousnessController.createPacket);
  
  // Update consciousness stream packet
  app.put(`${basePath}/packets/:id`, protect, consciousnessController.updatePacket);
  
  // Delete consciousness stream packet
  app.delete(`${basePath}/packets/:id`, protect, consciousnessController.deletePacket);
  
  // Send data through consciousness stream
  app.post(`${basePath}/streams/:id/send`, protect, consciousnessController.sendThroughStream);
  
  // Receive data from consciousness stream
  app.post(`${basePath}/streams/:id/receive`, protect, consciousnessController.receiveFromStream);
  
  // Verify consciousness stream integrity
  app.post(`${basePath}/streams/:id/verify`, protect, consciousnessController.verifyStreamIntegrity);
  
  // Create consciousness stream checkpoint
  app.post(`${basePath}/streams/:id/checkpoint`, protect, consciousnessController.createStreamCheckpoint);
  
  // Restore consciousness stream from checkpoint
  app.post(
    `${basePath}/streams/:id/restore`,
    protect,
    consciousnessController.restoreStreamFromCheckpoint
  );
  
  // Get consciousness stream checkpoints
  app.get(
    `${basePath}/streams/:id/checkpoints`,
    protect,
    consciousnessController.getStreamCheckpoints
  );
  
  logger.info(`Consciousness stream API endpoints setup complete`);
};

export default setupConsciousnessAPI;