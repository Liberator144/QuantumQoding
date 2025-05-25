/**
 * Consciousness Stream Socket Handlers
 * 
 * This module defines the Socket.IO handlers for consciousness stream management.
 * 
 * @version 1.0.0
 */

import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { ConsciousnessStreamManager, ConsciousnessStreamPacket } from '../../interdimensional/consciousness/ConsciousnessStreamProtocol';

// Initialize consciousness stream manager
const consciousnessStreamManager = new ConsciousnessStreamManager();

/**
 * Setup consciousness stream socket handlers
 */
export const setupConsciousnessHandlers = (io: Server, socket: Socket) => {
  /**
   * Subscribe to consciousness stream
   */
  socket.on('consciousness:subscribe', (streamId: string) => {
    try {
      // Join room for this consciousness stream
      socket.join(`consciousness:${streamId}`);
      
      logger.info(`User subscribed to consciousness stream: ${streamId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        streamId,
      });
      
      // Send current stream state
      const stream = consciousnessStreamManager.getStream(streamId);
      
      if (stream) {
        socket.emit('consciousness:stream', stream);
      }
    } catch (error) {
      logger.error('Consciousness subscribe error:', error);
      socket.emit('consciousness:error', {
        message: 'Failed to subscribe to consciousness stream',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * Unsubscribe from consciousness stream
   */
  socket.on('consciousness:unsubscribe', (streamId: string) => {
    try {
      // Leave room for this consciousness stream
      socket.leave(`consciousness:${streamId}`);
      
      logger.info(`User unsubscribed from consciousness stream: ${streamId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        streamId,
      });
    } catch (error) {
      logger.error('Consciousness unsubscribe error:', error);
      socket.emit('consciousness:error', {
        message: 'Failed to unsubscribe from consciousness stream',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * Send packet through consciousness stream
   */
  socket.on('consciousness:send', (data: { 
    streamId: string; 
    packet: Partial<ConsciousnessStreamPacket<any>>;
  }) => {
    try {
      const { streamId, packet } = data;
      
      // Send packet through stream
      const sentPacket = consciousnessStreamManager.sendPacket(streamId, packet);
      
      // Broadcast to all subscribers
      io.to(`consciousness:${streamId}`).emit('consciousness:packet', sentPacket);
      
      logger.info(`User sent packet through consciousness stream: ${streamId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        streamId,
        packetId: sentPacket.header.packetId,
      });
    } catch (error) {
      logger.error('Consciousness send error:', error);
      socket.emit('consciousness:error', {
        message: 'Failed to send packet through consciousness stream',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * Create consciousness stream checkpoint
   */
  socket.on('consciousness:checkpoint', (streamId: string) => {
    try {
      // Create checkpoint
      const checkpoint = consciousnessStreamManager.createCheckpoint(streamId);
      
      // Emit checkpoint
      socket.emit('consciousness:checkpoint:created', checkpoint);
      
      logger.info(`User created consciousness stream checkpoint: ${streamId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        streamId,
        checkpointId: checkpoint.id,
      });
    } catch (error) {
      logger.error('Consciousness checkpoint error:', error);
      socket.emit('consciousness:error', {
        message: 'Failed to create consciousness stream checkpoint',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  /**
   * Restore consciousness stream from checkpoint
   */
  socket.on('consciousness:restore', (data: { streamId: string; checkpointId: string }) => {
    try {
      const { streamId, checkpointId } = data;
      
      // Restore from checkpoint
      const restoredStream = consciousnessStreamManager.restoreFromCheckpoint(streamId, checkpointId);
      
      // Broadcast to all subscribers
      io.to(`consciousness:${streamId}`).emit('consciousness:stream', restoredStream);
      
      logger.info(`User restored consciousness stream from checkpoint: ${streamId}`, {
        socketId: socket.id,
        userId: socket.data.user?.id,
        streamId,
        checkpointId,
      });
    } catch (error) {
      logger.error('Consciousness restore error:', error);
      socket.emit('consciousness:error', {
        message: 'Failed to restore consciousness stream from checkpoint',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
};

export default setupConsciousnessHandlers;