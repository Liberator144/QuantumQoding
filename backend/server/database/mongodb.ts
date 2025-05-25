/**
 * MongoDB Connection
 * 
 * This module handles MongoDB connection for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * MongoDB connection instance
 */
let connection: mongoose.Connection | null = null;

/**
 * Connect to MongoDB
 */
export const connectMongoDB = async (): Promise<mongoose.Connection> => {
  try {
    if (connection) {
      logger.info('Using existing MongoDB connection');
      return connection;
    }
    
    logger.info('Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(config.database.mongodb.uri, config.database.mongodb.options);
    
    connection = mongoose.connection;
    
    // Handle connection events
    connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });
    
    connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      connection = null;
    });
    
    logger.info('MongoDB connection established');
    
    return connection;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectMongoDB = async (): Promise<void> => {
  try {
    if (!connection) {
      logger.info('No MongoDB connection to close');
      return;
    }
    
    logger.info('Disconnecting from MongoDB...');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    
    connection = null;
    
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Failed to disconnect from MongoDB:', error);
    throw error;
  }
};

export default {
  connectMongoDB,
  disconnectMongoDB,
};