/**
 * Dimensional Socket Handlers
 * 
 * Handles real-time dimensional communication and interdimensional data transfer.
 * 
 * @version 1.0.0
 */

import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

/**
 * Setup Dimensional handlers
 */
export const setupDimensionalHandlers = (io: Server, socket: Socket) => {
  const userId = socket.data.user?.id;
  
  // Dimensional portal connection
  socket.on('dimensional:connect', (data) => {
    logger.info(`Dimensional portal connection request from user: ${userId}`, { data });
    
    const dimension = data.dimension || 'primary';
    const roomName = `dimension-${dimension}`;
    
    // Join dimensional room
    socket.join(roomName);
    
    // Emit connection confirmation
    socket.emit('dimensional:connected', {
      status: 'connected',
      dimension,
      portalId: `portal-${userId}-${dimension}`,
      stability: 0.92,
      timestamp: new Date().toISOString()
    });
    
    // Broadcast to other dimensional participants
    socket.to(roomName).emit('dimensional:traveler-arrived', {
      userId,
      dimension,
      portalId: `portal-${userId}-${dimension}`,
      timestamp: new Date().toISOString()
    });
  });
  
  // Dimensional data transfer
  socket.on('dimensional:transfer', (data) => {
    logger.info(`Dimensional data transfer from user: ${userId}`, { 
      targetDimension: data.targetDimension,
      dataSize: JSON.stringify(data.payload).length 
    });
    
    const targetRoom = `dimension-${data.targetDimension}`;
    
    // Transfer data to target dimension
    socket.to(targetRoom).emit('dimensional:data-received', {
      from: userId,
      sourceDimension: data.sourceDimension || 'primary',
      payload: data.payload,
      timestamp: new Date().toISOString(),
      integrity: 0.98
    });
    
    // Confirm transfer
    socket.emit('dimensional:transfer-confirmed', {
      status: 'transferred',
      targetDimension: data.targetDimension,
      recipients: socket.adapter.rooms.get(targetRoom)?.size || 0,
      timestamp: new Date().toISOString()
    });
  });
  
  // Dimensional portal status
  socket.on('dimensional:status', (dimension) => {
    logger.info(`Dimensional status request from user: ${userId}`, { dimension });
    
    const roomName = `dimension-${dimension}`;
    const participants = socket.adapter.rooms.get(roomName)?.size || 0;
    
    const status = {
      dimension,
      participants,
      stability: 0.92,
      energy: '847.3 THz',
      resonance: 'harmonic',
      portals: participants,
      timestamp: new Date().toISOString()
    };
    
    socket.emit('dimensional:status-response', status);
  });
  
  // Dimensional bridge creation
  socket.on('dimensional:create-bridge', (bridgeData) => {
    logger.info(`Dimensional bridge creation request from user: ${userId}`, { 
      from: bridgeData.from,
      to: bridgeData.to 
    });
    
    const bridgeId = `bridge-${Date.now()}-${userId}`;
    const fromRoom = `dimension-${bridgeData.from}`;
    const toRoom = `dimension-${bridgeData.to}`;
    
    // Notify both dimensions about bridge creation
    socket.to(fromRoom).emit('dimensional:bridge-created', {
      bridgeId,
      from: bridgeData.from,
      to: bridgeData.to,
      creator: userId,
      timestamp: new Date().toISOString()
    });
    
    socket.to(toRoom).emit('dimensional:bridge-created', {
      bridgeId,
      from: bridgeData.from,
      to: bridgeData.to,
      creator: userId,
      timestamp: new Date().toISOString()
    });
    
    socket.emit('dimensional:bridge-established', {
      bridgeId,
      status: 'established',
      stability: 0.89,
      timestamp: new Date().toISOString()
    });
  });
  
  // Dimensional travel
  socket.on('dimensional:travel', (travelData) => {
    logger.info(`Dimensional travel request from user: ${userId}`, { 
      from: travelData.from,
      to: travelData.to 
    });
    
    const fromRoom = `dimension-${travelData.from}`;
    const toRoom = `dimension-${travelData.to}`;
    
    // Leave current dimension
    socket.leave(fromRoom);
    socket.to(fromRoom).emit('dimensional:traveler-departed', {
      userId,
      destination: travelData.to,
      timestamp: new Date().toISOString()
    });
    
    // Enter new dimension
    socket.join(toRoom);
    socket.to(toRoom).emit('dimensional:traveler-arrived', {
      userId,
      origin: travelData.from,
      timestamp: new Date().toISOString()
    });
    
    socket.emit('dimensional:travel-completed', {
      status: 'arrived',
      dimension: travelData.to,
      coordinates: travelData.coordinates || { x: 0, y: 0, z: 0 },
      timestamp: new Date().toISOString()
    });
  });
  
  // Dimensional disconnection
  socket.on('dimensional:disconnect', (dimension) => {
    logger.info(`Dimensional disconnection from user: ${userId}`, { dimension });
    
    const roomName = `dimension-${dimension}`;
    
    // Leave dimensional room
    socket.leave(roomName);
    
    // Broadcast disconnection
    socket.to(roomName).emit('dimensional:traveler-departed', {
      userId,
      reason: 'manual-disconnect',
      timestamp: new Date().toISOString()
    });
    
    socket.emit('dimensional:disconnected', {
      status: 'disconnected',
      dimension,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle socket disconnection
  socket.on('disconnect', () => {
    // Auto-leave all dimensional rooms on disconnect
    const rooms = Array.from(socket.rooms);
    rooms.forEach(room => {
      if (room.startsWith('dimension-')) {
        socket.to(room).emit('dimensional:traveler-departed', {
          userId,
          reason: 'connection-lost',
          timestamp: new Date().toISOString()
        });
      }
    });
  });
};

export default setupDimensionalHandlers;