/**
 * Authentication Routes
 * 
 * This module defines the authentication routes for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import express from 'express';
import { protect } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, authController.logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, authController.getMe);

/**
 * @route   PUT /api/v1/auth/update-password
 * @desc    Update password
 * @access  Private
 */
router.put('/update-password', protect, authController.updatePassword);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Forgot password
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   PUT /api/v1/auth/reset-password/:token
 * @desc    Reset password
 * @access  Public
 */
router.put('/reset-password/:token', authController.resetPassword);

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verify email
 * @access  Public
 */
router.get('/verify-email/:token', authController.verifyEmail);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend verification email
 * @access  Private
 */
router.post('/resend-verification', protect, authController.resendVerification);

/**
 * @route   POST /api/v1/auth/quantum-auth
 * @desc    Authenticate using quantum state
 * @access  Public
 */
router.post('/quantum-auth', authController.quantumAuth);

/**
 * @route   POST /api/v1/auth/consciousness-auth
 * @desc    Authenticate using consciousness stream
 * @access  Public
 */
router.post('/consciousness-auth', authController.consciousnessAuth);

export default router;