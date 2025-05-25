/**
 * Socket Middleware
 * 
 * This module defines the Socket.IO middleware for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Verify JWT token middleware
 */
export const verifyToken = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Attach user to socket
    socket.data.user = decoded;
    
    next();
  } catch (error) {
    logger.error('Socket authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error('Authentication error: Invalid token'));
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error('Authentication error: Token expired'));
    }
    
    return next(new Error('Authentication error'));
  }
};

export default {
  verifyToken,
};