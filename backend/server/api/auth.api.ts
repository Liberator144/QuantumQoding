/**
 * Authentication API
 * 
 * This module defines the authentication API endpoints.
 * 
 * @version 1.0.0
 */

import { Express } from 'express';
import { protect } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Setup authentication API endpoints
 */
export const setupAuthAPI = (app: Express) => {
  const basePath = '/api/v1/auth';
  
  logger.info(`Setting up authentication API endpoints at ${basePath}`);
  
  // Register a new user
  app.post(`${basePath}/register`, authController.register);
  
  // Login user
  app.post(`${basePath}/login`, authController.login);
  
  // Logout user
  app.post(`${basePath}/logout`, protect, authController.logout);
  
  // Get current user
  app.get(`${basePath}/me`, protect, authController.getMe);
  
  // Update password
  app.put(`${basePath}/update-password`, protect, authController.updatePassword);
  
  // Forgot password
  app.post(`${basePath}/forgot-password`, authController.forgotPassword);
  
  // Reset password
  app.put(`${basePath}/reset-password/:token`, authController.resetPassword);
  
  // Verify email
  app.get(`${basePath}/verify-email/:token`, authController.verifyEmail);
  
  // Resend verification email
  app.post(`${basePath}/resend-verification`, protect, authController.resendVerification);
  
  // Authenticate using quantum state
  app.post(`${basePath}/quantum-auth`, authController.quantumAuth);
  
  // Authenticate using consciousness stream
  app.post(`${basePath}/consciousness-auth`, authController.consciousnessAuth);
  
  logger.info(`Authentication API endpoints setup complete`);
};

export default setupAuthAPI;