/**
 * Quantum Routes
 * 
 * This module defines the quantum state management routes for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import express from 'express';
import { protect } from '../middleware/auth';
import * as quantumController from '../controllers/quantum.controller';

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);

/**
 * @route   GET /api/v1/quantum/states
 * @desc    Get all quantum states
 * @access  Private
 */
router.get('/states', quantumController.getAllStates);

/**
 * @route   GET /api/v1/quantum/states/:id
 * @desc    Get quantum state by ID
 * @access  Private
 */
router.get('/states/:id', quantumController.getStateById);

/**
 * @route   POST /api/v1/quantum/states
 * @desc    Create a new quantum state
 * @access  Private
 */
router.post('/states', quantumController.createState);

/**
 * @route   PUT /api/v1/quantum/states/:id
 * @desc    Update quantum state
 * @access  Private
 */
router.put('/states/:id', quantumController.updateState);

/**
 * @route   DELETE /api/v1/quantum/states/:id
 * @desc    Delete quantum state
 * @access  Private
 */
router.delete('/states/:id', quantumController.deleteState);

/**
 * @route   POST /api/v1/quantum/states/:id/synchronize
 * @desc    Synchronize quantum state with another state
 * @access  Private
 */
router.post('/states/:id/synchronize', quantumController.synchronizeStates);

/**
 * @route   GET /api/v1/quantum/states/:id/vector
 * @desc    Get quantum state vector
 * @access  Private
 */
router.get('/states/:id/vector', quantumController.getStateVector);

/**
 * @route   PUT /api/v1/quantum/states/:id/vector
 * @desc    Update quantum state vector
 * @access  Private
 */
router.put('/states/:id/vector', quantumController.updateStateVector);

/**
 * @route   POST /api/v1/quantum/states/:id/transform
 * @desc    Transform quantum state
 * @access  Private
 */
router.post('/states/:id/transform', quantumController.transformState);

/**
 * @route   POST /api/v1/quantum/states/:id/verify-coherence
 * @desc    Verify quantum state coherence
 * @access  Private
 */
router.post('/states/:id/verify-coherence', quantumController.verifyCoherence);

/**
 * @route   GET /api/v1/quantum/states/:id/history
 * @desc    Get quantum state history
 * @access  Private
 */
router.get('/states/:id/history', quantumController.getStateHistory);

/**
 * @route   POST /api/v1/quantum/states/:id/entangle
 * @desc    Entangle quantum state with another state
 * @access  Private
 */
router.post('/states/:id/entangle', quantumController.entangleStates);

/**
 * @route   POST /api/v1/quantum/states/:id/disentangle
 * @desc    Disentangle quantum state
 * @access  Private
 */
router.post('/states/:id/disentangle', quantumController.disentangleState);

export default router;