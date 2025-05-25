/**
 * Consciousness Stream Routes
 * 
 * This module defines the consciousness stream management routes for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import express from 'express';
import { protect } from '../middleware/auth';
import * as consciousnessController from '../controllers/consciousness.controller';

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);

/**
 * @route   GET /api/v1/consciousness/streams
 * @desc    Get all consciousness streams
 * @access  Private
 */
router.get('/streams', consciousnessController.getAllStreams);

/**
 * @route   GET /api/v1/consciousness/streams/:id
 * @desc    Get consciousness stream by ID
 * @access  Private
 */
router.get('/streams/:id', consciousnessController.getStreamById);

/**
 * @route   POST /api/v1/consciousness/streams
 * @desc    Create a new consciousness stream
 * @access  Private
 */
router.post('/streams', consciousnessController.createStream);

/**
 * @route   PUT /api/v1/consciousness/streams/:id
 * @desc    Update consciousness stream
 * @access  Private
 */
router.put('/streams/:id', consciousnessController.updateStream);

/**
 * @route   DELETE /api/v1/consciousness/streams/:id
 * @desc    Delete consciousness stream
 * @access  Private
 */
router.delete('/streams/:id', consciousnessController.deleteStream);

/**
 * @route   GET /api/v1/consciousness/streams/:id/packets
 * @desc    Get all packets in a consciousness stream
 * @access  Private
 */
router.get('/streams/:id/packets', consciousnessController.getStreamPackets);

/**
 * @route   GET /api/v1/consciousness/packets/:id
 * @desc    Get consciousness stream packet by ID
 * @access  Private
 */
router.get('/packets/:id', consciousnessController.getPacketById);

/**
 * @route   POST /api/v1/consciousness/streams/:id/packets
 * @desc    Create a new consciousness stream packet
 * @access  Private
 */
router.post('/streams/:id/packets', consciousnessController.createPacket);

/**
 * @route   PUT /api/v1/consciousness/packets/:id
 * @desc    Update consciousness stream packet
 * @access  Private
 */
router.put('/packets/:id', consciousnessController.updatePacket);

/**
 * @route   DELETE /api/v1/consciousness/packets/:id
 * @desc    Delete consciousness stream packet
 * @access  Private
 */
router.delete('/packets/:id', consciousnessController.deletePacket);

/**
 * @route   POST /api/v1/consciousness/streams/:id/send
 * @desc    Send data through consciousness stream
 * @access  Private
 */
router.post('/streams/:id/send', consciousnessController.sendThroughStream);

/**
 * @route   POST /api/v1/consciousness/streams/:id/receive
 * @desc    Receive data from consciousness stream
 * @access  Private
 */
router.post('/streams/:id/receive', consciousnessController.receiveFromStream);

/**
 * @route   POST /api/v1/consciousness/streams/:id/verify
 * @desc    Verify consciousness stream integrity
 * @access  Private
 */
router.post('/streams/:id/verify', consciousnessController.verifyStreamIntegrity);

/**
 * @route   POST /api/v1/consciousness/streams/:id/checkpoint
 * @desc    Create consciousness stream checkpoint
 * @access  Private
 */
router.post('/streams/:id/checkpoint', consciousnessController.createStreamCheckpoint);

/**
 * @route   POST /api/v1/consciousness/streams/:id/restore
 * @desc    Restore consciousness stream from checkpoint
 * @access  Private
 */
router.post('/streams/:id/restore', consciousnessController.restoreStreamFromCheckpoint);

/**
 * @route   GET /api/v1/consciousness/streams/:id/checkpoints
 * @desc    Get consciousness stream checkpoints
 * @access  Private
 */
router.get('/streams/:id/checkpoints', consciousnessController.getStreamCheckpoints);

export default router;