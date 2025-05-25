/**
 * Database Connection
 * 
 * This module handles database connections for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import { logger } from '../utils/logger';
import { config } from '../config';
import { connectMongoDB } from './mongodb';
import { connectSupabase } from './supabase';
import { connectGitHub } from './github';

/**
 * Connect to all databases
 */
export const connectDatabases = async () => {
  try {
    logger.info('Connecting to databases...');
    
    // Connect to MongoDB
    await connectMongoDB();
    
    // Connect to Supabase
    await connectSupabase();
    
    // Connect to GitHub
    await connectGitHub();
    
    logger.info('All database connections established');
    
    return true;
  } catch (error) {
    logger.error('Failed to connect to databases:', error);
    throw error;
  }
};

export default {
  connectDatabases,
};