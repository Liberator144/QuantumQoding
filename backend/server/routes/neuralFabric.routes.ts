/**
 * Neural Fabric Routes
 * 
 * This module defines the neural fabric management routes for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import express from 'express';
import { protect } from '../middleware/auth';
import * as neuralFabricController from '../controllers/neuralFabric.controller';

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);

/**
 * @route   GET /api/v1/neural-fabric
 * @desc    Get neural fabric
 * @access  Private
 */
router.get('/', neuralFabricController.getFabric);

/**
 * @route   POST /api/v1/neural-fabric
 * @desc    Create a new neural fabric
 * @access  Private
 */
router.post('/', neuralFabricController.createFabric);

/**
 * @route   GET /api/v1/neural-fabric/nodes
 * @desc    Get all nodes
 * @access  Private
 */
router.get('/nodes', neuralFabricController.getAllNodes);

/**
 * @route   GET /api/v1/neural-fabric/nodes/:id
 * @desc    Get node by ID
 * @access  Private
 */
router.get('/nodes/:id', neuralFabricController.getNodeById);

/**
 * @route   POST /api/v1/neural-fabric/nodes
 * @desc    Create a new node
 * @access  Private
 */
router.post('/nodes', neuralFabricController.createNode);

/**
 * @route   PUT /api/v1/neural-fabric/nodes/:id
 * @desc    Update node
 * @access  Private
 */
router.put('/nodes/:id', neuralFabricController.updateNode);

/**
 * @route   DELETE /api/v1/neural-fabric/nodes/:id
 * @desc    Delete node
 * @access  Private
 */
router.delete('/nodes/:id', neuralFabricController.deleteNode);

/**
 * @route   GET /api/v1/neural-fabric/connections
 * @desc    Get all connections
 * @access  Private
 */
router.get('/connections', neuralFabricController.getAllConnections);

/**
 * @route   GET /api/v1/neural-fabric/connections/:id
 * @desc    Get connection by ID
 * @access  Private
 */
router.get('/connections/:id', neuralFabricController.getConnectionById);

/**
 * @route   POST /api/v1/neural-fabric/connections
 * @desc    Create a new connection
 * @access  Private
 */
router.post('/connections', neuralFabricController.createConnection);

/**
 * @route   PUT /api/v1/neural-fabric/connections/:id
 * @desc    Update connection
 * @access  Private
 */
router.put('/connections/:id', neuralFabricController.updateConnection);

/**
 * @route   DELETE /api/v1/neural-fabric/connections/:id
 * @desc    Delete connection
 * @access  Private
 */
router.delete('/connections/:id', neuralFabricController.deleteConnection);

/**
 * @route   GET /api/v1/neural-fabric/pathways
 * @desc    Get all pathways
 * @access  Private
 */
router.get('/pathways', neuralFabricController.getAllPathways);

/**
 * @route   GET /api/v1/neural-fabric/pathways/:id
 * @desc    Get pathway by ID
 * @access  Private
 */
router.get('/pathways/:id', neuralFabricController.getPathwayById);

/**
 * @route   POST /api/v1/neural-fabric/pathways
 * @desc    Create a new pathway
 * @access  Private
 */
router.post('/pathways', neuralFabricController.createPathway);

/**
 * @route   PUT /api/v1/neural-fabric/pathways/:id
 * @desc    Update pathway
 * @access  Private
 */
router.put('/pathways/:id', neuralFabricController.updatePathway);

/**
 * @route   DELETE /api/v1/neural-fabric/pathways/:id
 * @desc    Delete pathway
 * @access  Private
 */
router.delete('/pathways/:id', neuralFabricController.deletePathway);

/**
 * @route   POST /api/v1/neural-fabric/verify
 * @desc    Verify neural fabric
 * @access  Private
 */
router.post('/verify', neuralFabricController.verifyFabric);

/**
 * @route   POST /api/v1/neural-fabric/synchronize-quantum-states
 * @desc    Synchronize quantum states through neural fabric
 * @access  Private
 */
router.post('/synchronize-quantum-states', neuralFabricController.synchronizeQuantumStates);

/**
 * @route   POST /api/v1/neural-fabric/propagate-consciousness
 * @desc    Propagate consciousness through neural fabric
 * @access  Private
 */
router.post('/propagate-consciousness', neuralFabricController.propagateConsciousness);

export default router;