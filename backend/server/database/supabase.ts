/**
 * Supabase Connection
 * 
 * This module handles Supabase connection for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Supabase client instance
 */
let client: SupabaseClient | null = null;

/**
 * Connect to Supabase
 */
export const connectSupabase = async (): Promise<SupabaseClient> => {
  try {
    if (client) {
      logger.info('Using existing Supabase connection');
      return client;
    }
    
    logger.info('Connecting to Supabase...');
    
    // Check if Supabase URL and key are provided
    if (!config.database.supabase.url || !config.database.supabase.key) {
      throw new Error('Supabase URL or key not provided');
    }
    
    // Create Supabase client
    client = createClient(
      config.database.supabase.url,
      config.database.supabase.key
    );
    
    // Test connection
    const { data, error } = await client.from('health_check').select('*').limit(1);
    
    if (error) {
      throw error;
    }
    
    logger.info('Supabase connection established');
    
    return client;
  } catch (error) {
    // If Supabase is not configured, log a warning instead of an error
    if (
      !config.database.supabase.url ||
      !config.database.supabase.key ||
      error instanceof Error && error.message === 'Supabase URL or key not provided'
    ) {
      logger.warn('Supabase not configured, skipping connection');
      return null as any;
    }
    
    logger.error('Failed to connect to Supabase:', error);
    throw error;
  }
};

/**
 * Get Supabase client
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!client) {
    throw new Error('Supabase client not initialized');
  }
  
  return client;
};

export default {
  connectSupabase,
  getSupabaseClient,
};