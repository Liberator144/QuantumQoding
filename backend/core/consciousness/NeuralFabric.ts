/**
 * NeuralFabric
 *
 * The NeuralFabric provides a quantum-aware network for connecting components
 * and enabling consciousness-aware operations.
 *
 * @version 1.0.0
 */

const { EventEmitter } = require('events');

/**
 * NeuralFabric class
 *
 * Provides a quantum-aware network for connecting components.
 */
class NeuralFabric extends EventEmitter {
  // Explicit TypeScript property declarations for quantum coherence
  public config: any;
  public state: any;

  /**
   * Create a new NeuralFabric instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Maximum number of connections per node
      maxConnections: 100,

      // Whether to automatically prune unused connections
      autoPrune: true,

      // Interval for auto-pruning in milliseconds
      pruneInterval: 3600000, // 1 hour

      // Merge with provided options
      ...options,
    };

    // State
    this.state = {
      // Nodes in the neural fabric
      nodes: new Map(),

      // Connections between nodes
      connections: new Map(),

      // Connection strengths
      strengths: new Map(),

      // Last activity timestamps
      lastActivity: new Map(),

      // Pruning timer
      pruneTimer: null,
    };

    // Initialize
    this._initialize();
  }

  /**
   * Initialize the neural fabric
   * @private
   */
  _initialize() {
    // Start auto-pruning if enabled
    if (this.config.autoPrune) {
      this.state.pruneTimer = setInterval(() => {
        this._pruneConnections();
      }, this.config.pruneInterval);
    }

    // Log initialization
    this.log('Neural fabric initialized');
  }

  /**
   * Register a node in the neural fabric
   * @param {string} nodeId - Node ID
   * @param {Object} metadata - Node metadata
   * @returns {NeuralFabric} This instance for chaining
   */
  registerNode(nodeId, metadata = {}) {
    // Check if node already exists
    if (this.state.nodes.has(nodeId)) {
      this.log(`Node ${nodeId} already registered, updating metadata`);

      // Update metadata
      const existingMetadata = this.state.nodes.get(nodeId);
      this.state.nodes.set(nodeId, { ...existingMetadata, ...metadata });

      // Emit update event
      this.emit('node:updated', { nodeId, metadata: this.state.nodes.get(nodeId) });

      return this;
    }

    // Register node
    this.state.nodes.set(nodeId, { ...metadata, registeredAt: Date.now() });

    // Initialize connections
    this.state.connections.set(nodeId, new Set());

    // Initialize last activity
    this.state.lastActivity.set(nodeId, Date.now());

    // Log registration
    this.log(`Node ${nodeId} registered`);

    // Emit register event
    this.emit('node:registered', { nodeId, metadata: this.state.nodes.get(nodeId) });

    return this;
  }

  /**
   * Unregister a node from the neural fabric
   * @param {string} nodeId - Node ID
   * @returns {boolean} Whether the node was unregistered
   */
  unregisterNode(nodeId) {
    // Check if node exists
    if (!this.state.nodes.has(nodeId)) {
      this.log(`Node ${nodeId} not registered`);
      return false;
    }

    // Get node connections
    const connections = this.state.connections.get(nodeId);

    // Remove connections to other nodes
    for (const targetId of connections) {
      // Remove connection from target node
      const targetConnections = this.state.connections.get(targetId);

      if (targetConnections) {
        targetConnections.delete(nodeId);
      }

      // Remove connection strength
      this.state.strengths.delete(`${nodeId}:${targetId}`);
      this.state.strengths.delete(`${targetId}:${nodeId}`);
    }

    // Remove node
    this.state.nodes.delete(nodeId);
    this.state.connections.delete(nodeId);
    this.state.lastActivity.delete(nodeId);

    // Log unregistration
    this.log(`Node ${nodeId} unregistered`);

    // Emit unregister event
    this.emit('node:unregistered', { nodeId });

    return true;
  }

  /**
   * Connect two nodes in the neural fabric
   * @param {string} sourceId - Source node ID
   * @param {string} targetId - Target node ID
   * @param {number} strength - Connection strength (0-1)
   * @param {boolean} bidirectional - Whether the connection is bidirectional
   * @returns {boolean} Whether the connection was established
   */
  connect(sourceId, targetId, strength = 0.5, bidirectional = true) {
    // Check if nodes exist
    if (!this.state.nodes.has(sourceId)) {
      this.log(`Source node ${sourceId} not registered`);
      return false;
    }

    if (!this.state.nodes.has(targetId)) {
      this.log(`Target node ${targetId} not registered`);
      return false;
    }

    // Check if source node has reached maximum connections
    const sourceConnections = this.state.connections.get(sourceId);

    if (sourceConnections.size >= this.config.maxConnections) {
      this.log(`Source node ${sourceId} has reached maximum connections`);
      return false;
    }

    // Check if target node has reached maximum connections
    const targetConnections = this.state.connections.get(targetId);

    if (targetConnections.size >= this.config.maxConnections) {
      this.log(`Target node ${targetId} has reached maximum connections`);
      return false;
    }

    // Add connection
    sourceConnections.add(targetId);

    // Set connection strength
    this.state.strengths.set(`${sourceId}:${targetId}`, strength);

    // Update last activity
    this.state.lastActivity.set(sourceId, Date.now());
    this.state.lastActivity.set(targetId, Date.now());

    // Add bidirectional connection if requested
    if (bidirectional) {
      targetConnections.add(sourceId);
      this.state.strengths.set(`${targetId}:${sourceId}`, strength);
    }

    // Log connection
    this.log(`Connected ${sourceId} to ${targetId} with strength ${strength}`);

    // Emit connect event
    this.emit('connection:created', {
      sourceId,
      targetId,
      strength,
      bidirectional,
    });

    return true;
  }

  /**
   * Disconnect two nodes in the neural fabric
   * @param {string} sourceId - Source node ID
   * @param {string} targetId - Target node ID
   * @param {boolean} bidirectional - Whether to disconnect bidirectionally
   * @returns {boolean} Whether the disconnection was successful
   */
  disconnect(sourceId, targetId, bidirectional = true) {
    // Check if nodes exist
    if (!this.state.nodes.has(sourceId)) {
      this.log(`Source node ${sourceId} not registered`);
      return false;
    }

    if (!this.state.nodes.has(targetId)) {
      this.log(`Target node ${targetId} not registered`);
      return false;
    }

    // Get connections
    const sourceConnections = this.state.connections.get(sourceId);
    const targetConnections = this.state.connections.get(targetId);

    // Remove connection
    const sourceRemoved = sourceConnections.delete(targetId);

    // Remove connection strength
    this.state.strengths.delete(`${sourceId}:${targetId}`);

    // Update last activity
    this.state.lastActivity.set(sourceId, Date.now());
    this.state.lastActivity.set(targetId, Date.now());

    // Remove bidirectional connection if requested
    let targetRemoved = false;

    if (bidirectional) {
      targetRemoved = targetConnections.delete(sourceId);
      this.state.strengths.delete(`${targetId}:${sourceId}`);
    }

    // Log disconnection
    if (sourceRemoved || targetRemoved) {
      this.log(`Disconnected ${sourceId} from ${targetId}`);

      // Emit disconnect event
      this.emit('connection:removed', {
        sourceId,
        targetId,
        bidirectional,
      });

      return true;
    }

    return false;
  }

  /**
   * Get all connections for a node
   * @param {string} nodeId - Node ID
   * @returns {string[]} Array of connected node IDs
   */
  getConnections(nodeId) {
    // Check if node exists
    if (!this.state.nodes.has(nodeId)) {
      this.log(`Node ${nodeId} not registered`);
      return [];
    }

    // Get connections
    const connections = this.state.connections.get(nodeId);

    // Update last activity
    this.state.lastActivity.set(nodeId, Date.now());

    // Return connections as array
    return Array.from(connections);
  }

  /**
   * Get the connection strength between two nodes
   * @param {string} sourceId - Source node ID
   * @param {string} targetId - Target node ID
   * @returns {number} Connection strength (0-1) or 0 if not connected
   */
  getConnectionStrength(sourceId, targetId) {
    // Check if nodes exist
    if (!this.state.nodes.has(sourceId) || !this.state.nodes.has(targetId)) {
      return 0;
    }

    // Get connection strength
    const strength = this.state.strengths.get(`${sourceId}:${targetId}`);

    // Update last activity
    this.state.lastActivity.set(sourceId, Date.now());
    this.state.lastActivity.set(targetId, Date.now());

    // Return strength or 0 if not connected
    return strength !== undefined ? strength : 0;
  }

  /**
   * Set the connection strength between two nodes
   * @param {string} sourceId - Source node ID
   * @param {string} targetId - Target node ID
   * @param {number} strength - Connection strength (0-1)
   * @returns {boolean} Whether the strength was set
   */
  setConnectionStrength(sourceId, targetId, strength) {
    // Check if nodes exist
    if (!this.state.nodes.has(sourceId) || !this.state.nodes.has(targetId)) {
      return false;
    }

    // Check if connection exists
    const sourceConnections = this.state.connections.get(sourceId);

    if (!sourceConnections.has(targetId)) {
      return false;
    }

    // Set connection strength
    this.state.strengths.set(`${sourceId}:${targetId}`, strength);

    // Update last activity
    this.state.lastActivity.set(sourceId, Date.now());
    this.state.lastActivity.set(targetId, Date.now());

    // Log strength update
    this.log(`Updated connection strength between ${sourceId} and ${targetId} to ${strength}`);

    // Emit strength update event
    this.emit('connection:strengthUpdated', {
      sourceId,
      targetId,
      strength,
    });

    return true;
  }

  /**
   * Prune unused connections
   * @param {number} threshold - Time threshold in milliseconds
   * @returns {number} Number of pruned connections
   * @private
   */
  _pruneConnections(threshold = 86400000) {
    // Default: 24 hours
    const now = Date.now();
    let prunedCount = 0;

    // Iterate over all nodes
    for (const [nodeId, lastActivity] of this.state.lastActivity.entries()) {
      // Skip recently active nodes
      if (now - lastActivity < threshold) {
        continue;
      }

      // Get node connections
      const connections = this.state.connections.get(nodeId);

      if (!connections) {
        continue;
      }

      // Prune connections
      for (const targetId of connections) {
        // Skip recently active connections
        const targetLastActivity = this.state.lastActivity.get(targetId);

        if (targetLastActivity && now - targetLastActivity < threshold) {
          continue;
        }

        // Disconnect nodes
        this.disconnect(nodeId, targetId, true);
        prunedCount++;
      }
    }

    // Log pruning
    if (prunedCount > 0) {
      this.log(`Pruned ${prunedCount} unused connections`);
    }

    return prunedCount;
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[NeuralFabric] ${message}`);
    }
  }

  /**
   * Get the neural fabric state
   * @returns {Object} Neural fabric state
   */
  getState() {
    return {
      nodeCount: this.state.nodes.size,
      connectionCount: Array.from(this.state.connections.values()).reduce(
        (count, connections) => count + connections.size,
        0
      ),
      nodes: Array.from(this.state.nodes.entries()).map(([id, metadata]) => ({ id, metadata })),
      connections: Array.from(this.state.connections.entries()).map(([id, connections]) => ({
        id,
        connections: Array.from(connections),
      })),
    };
  }
}

module.exports = { NeuralFabric };
