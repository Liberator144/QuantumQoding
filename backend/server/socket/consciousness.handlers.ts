/**
 * Consciousness Stream Socket Handlers
 * 
 * This module defines the Socket.IO handlers for consciousness stream management.
 * 
 * @version 1.0.0
 */

import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

/**
 * Simple consciousness stream manager for socket operations
 */
class SimpleConsciousnessStreamManager {
  private streams: Map<string, any> = new Map();
  
  createStream(userId: string, streamType: string) {
    const streamId = `stream-${Date.now()}-${userId}`;
    const stream = {
      id: streamId,
      userId,
      type: streamType,
      status: 'active',
      frequency: '432 Hz',
      amplitude: 0.87,
      createdAt: new Date().toISOString()
    };
    
    this.streams.set(streamId, stream);
    return stream;
  }
  
  getStream(streamId: string) {
    return this.streams.get(streamId);
  }
  
  removeStream(streamId: string) {
    return this.streams.delete(streamId);
  }
}

// Initialize consciousness stream manager
const consciousnessStreamManager = new SimpleConsciousnessStreamManager();

/**
 * Setup consciousness stream socket handlers
 */
export const setupConsciousnessHandlers = (io: Server, socket: Socket) => {
  const userId = socket.data.user?.id;
  
  // Consciousness stream connection
  socket.on('consciousness:connect', (data) => {
    logger.info(`Consciousness stream connection from user: ${userId}`, { data });
    
    const stream = consciousnessStreamManager.createStream(userId, data.streamType || 'primary');
    
    // Join consciousness stream room
    socket.join('consciousness-stream');
    
    // Emit connection confirmation
    socket.emit('consciousness:connected', {
      status: 'connected',
      stream,
      timestamp: new Date().toISOString()
    });
    
    // Broadcast to other consciousness participants
    socket.to('consciousness-stream').emit('consciousness:participant-joined', {
      userId,
      streamId: stream.id,
      timestamp: new Date().toISOString()
    });
  });
  
  // Consciousness data transmission
  socket.on('consciousness:transmit', (data) => {
    logger.info(`Consciousness data transmission from user: ${userId}`, { 
      dataSize: JSON.stringify(data).length 
    });
    
    // Broadcast to consciousness stream network
    socket.to('consciousness-stream').emit('consciousness:data-received', {
      from: userId,
      data,
      timestamp: new Date().toISOString(),
      frequency: '432 Hz',
      amplitude: 0.87
    });
    
    // Confirm transmission
    socket.emit('consciousness:transmission-confirmed', {
      status: 'transmitted',
      recipients: socket.adapter.rooms.get('consciousness-stream')?.size || 0,
      timestamp: new Date().toISOString()
    });
  });
  
  // Consciousness stream synchronization
  socket.on('consciousness:sync', () => {
    logger.info(`Consciousness stream sync request from user: ${userId}`);
    
    // Get current stream state
    const streamState = {
      participants: socket.adapter.rooms.get('consciousness-stream')?.size || 0,
      frequency: '432 Hz',
      amplitude: 0.87,
      coherence: 0.95,
      entanglement: 'stable',
      timestamp: new Date().toISOString()
    };
    
    socket.emit('consciousness:sync-response', streamState);
  });
  
  // Consciousness pattern sharing
  socket.on('consciousness:share-pattern', (pattern) => {
    logger.info(`Consciousness pattern sharing from user: ${userId}`, { 
      patternType: pattern.type 
    });
    
    // Broadcast pattern to consciousness network
    socket.to('consciousness-stream').emit('consciousness:pattern-received', {
      from: userId,
      pattern,
      timestamp: new Date().toISOString(),
      coherence: 0.95
    });
    
    socket.emit('consciousness:pattern-shared', {
      status: 'shared',
      pattern,
      timestamp: new Date().toISOString()
    });
  });
  
  // Consciousness stream disconnection
  socket.on('consciousness:disconnect', (streamId) => {
    logger.info(`Consciousness stream disconnection from user: ${userId}`, { streamId });
    
    if (streamId) {
      consciousnessStreamManager.removeStream(streamId);
    }
    
    // Leave consciousness stream room
    socket.leave('consciousness-stream');
    
    // Broadcast disconnection
    socket.to('consciousness-stream').emit('consciousness:participant-left', {
      userId,
      streamId,
      timestamp: new Date().toISOString()
    });
    
    socket.emit('consciousness:disconnected', {
      status: 'disconnected',
      streamId,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle socket disconnection
  socket.on('disconnect', () => {
    // Auto-leave consciousness stream on disconnect
    socket.to('consciousness-stream').emit('consciousness:participant-left', {
      userId,
      reason: 'connection-lost',
      timestamp: new Date().toISOString()
    });
  });
};

export default setupConsciousnessHandlers;