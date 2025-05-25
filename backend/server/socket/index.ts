/**
 * Socket Handlers
 * 
 * This module sets up the Socket.IO handlers for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { verifyToken } from './middleware';
import { setupQuantumHandlers } from './quantum.handlers';
import { setupConsciousnessHandlers } from './consciousness.handlers';
import { setupNeuralFabricHandlers } from './neuralFabric.handlers';
import { setupDimensionalHandlers } from './dimensional.handlers';

/**
 * Setup Socket.IO handlers
 */
export const setupSocketHandlers = (io: Server) => {
  // Apply middleware
  io.use(verifyToken);
  
  // Handle connection
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user?.id;
    
    logger.info(`User connected: ${userId}`, {
      socketId: socket.id,
      userId,
    });
    
    // Setup handlers
    setupQuantumHandlers(io, socket);
    setupConsciousnessHandlers(io, socket);
    setupNeuralFabricHandlers(io, socket);
    setupDimensionalHandlers(io, socket);
    
    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId}`, {
        socketId: socket.id,
        userId,
      });
    });
  });
};

export default setupSocketHandlers;