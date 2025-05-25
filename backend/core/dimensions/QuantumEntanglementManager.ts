/**
 * QuantumEntanglementManager
 *
 * A class for managing quantum entanglement between dimensions.
 *
 * @module core/dimensions
 * @requires core/dimensions/DimensionalBridge
 */

const { DimensionalBridge } = require('./DimensionalBridge');

/**
 * @typedef {Object} EntanglementOptions
 * @property {number} [level=1] - Entanglement level (1-5)
 * @property {number} [duration=0] - Entanglement duration in milliseconds (0 = permanent)
 * @property {boolean} [bidirectional=true] - Whether the entanglement is bidirectional
 * @property {number} [coherenceThreshold=0.8] - Minimum coherence threshold
 * @property {Object} [metadata] - Entanglement metadata
 */

/**
 * @typedef {Object} EntanglementPair
 * @property {string} id - Entanglement ID
 * @property {string} dimension1 - First dimension
 * @property {string} dimension2 - Second dimension
 * @property {number} level - Entanglement level
 * @property {number} coherence - Entanglement coherence
 * @property {boolean} bidirectional - Whether the entanglement is bidirectional
 * @property {number} createdAt - Creation timestamp
 * @property {number} expiresAt - Expiration timestamp (0 = never)
 * @property {string} status - Entanglement status
 * @property {Object} metadata - Entanglement metadata
 */

/**
 * Class for managing quantum entanglement
 */
class QuantumEntanglementManager {
  /**
   * Create a new QuantumEntanglementManager
   *
   * @param {Object} config - Configuration options
   * @param {boolean} [config.debugMode=false] - Enable debug mode
   * @param {DimensionalBridge} [config.bridge] - DimensionalBridge instance
   */
  constructor(config = {}) {
    this.config = {
      debugMode: false,
      bridge: null,
      ...config,
    };

    // Create bridge if not provided
    if (!this.config.bridge) {
      this.config.bridge = new DimensionalBridge({
        debugMode: this.config.debugMode,
      });
    }

    // Store reference
    this.bridge = this.config.bridge;

    // Initialize entanglement pairs
    this.entanglements = new Map();

    // Initialize entanglement levels
    this.entanglementLevels = {
      1: { name: 'Basic', coherenceRange: [0.6, 0.8], dataCapacity: 1 },
      2: { name: 'Enhanced', coherenceRange: [0.7, 0.85], dataCapacity: 2 },
      3: { name: 'Advanced', coherenceRange: [0.8, 0.9], dataCapacity: 4 },
      4: { name: 'Superior', coherenceRange: [0.85, 0.95], dataCapacity: 8 },
      5: { name: 'Quantum', coherenceRange: [0.9, 1.0], dataCapacity: 16 },
    };

    // Start entanglement maintenance
    this._startEntanglementMaintenance();

    this.log('QuantumEntanglementManager initialized');
  }

  /**
   * Create a quantum entanglement between two dimensions
   *
   * @param {string} dimension1 - First dimension
   * @param {string} dimension2 - Second dimension
   * @param {EntanglementOptions} [options] - Entanglement options
   * @returns {EntanglementPair} The created entanglement pair
   */
  createEntanglement(dimension1, dimension2, options = {}) {
    // Validate dimensions
    if (!this.bridge.dimensionExists(dimension1)) {
      throw new Error(`Dimension does not exist: ${dimension1}`);
    }

    if (!this.bridge.dimensionExists(dimension2)) {
      throw new Error(`Dimension does not exist: ${dimension2}`);
    }

    // Check if dimensions are already entangled
    const existingEntanglement = this._findEntanglement(dimension1, dimension2);
    if (existingEntanglement) {
      throw new Error(`Dimensions are already entangled: ${dimension1} and ${dimension2}`);
    }

    // Prepare options
    const entanglementOptions = {
      level: 1,
      duration: 0, // 0 = permanent
      bidirectional: true,
      coherenceThreshold: 0.8,
      metadata: {},
      ...options,
    };

    // Validate level
    if (entanglementOptions.level < 1 || entanglementOptions.level > 5) {
      throw new Error(`Invalid entanglement level: ${entanglementOptions.level}`);
    }

    // Generate entanglement ID
    const entanglementId = `entanglement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate coherence based on level
    const levelInfo = this.entanglementLevels[entanglementOptions.level];
    const [minCoherence, maxCoherence] = levelInfo.coherenceRange;
    const coherence = minCoherence + Math.random() * (maxCoherence - minCoherence);

    // Calculate expiration
    const createdAt = Date.now();
    const expiresAt =
      entanglementOptions.duration > 0 ? createdAt + entanglementOptions.duration : 0;

    // Create entanglement pair
    const entanglement = {
      id: entanglementId,
      dimension1,
      dimension2,
      level: entanglementOptions.level,
      coherence,
      bidirectional: entanglementOptions.bidirectional,
      createdAt,
      expiresAt,
      status: 'active',
      metadata: entanglementOptions.metadata,
    };

    // Store entanglement
    this.entanglements.set(entanglementId, entanglement);

    this.log(`Created entanglement ${entanglementId} between ${dimension1} and ${dimension2}`);

    return entanglement;
  }

  /**
   * Break a quantum entanglement
   *
   * @param {string} entanglementId - Entanglement ID
   * @returns {boolean} Whether the entanglement was broken successfully
   */
  breakEntanglement(entanglementId) {
    const entanglement = this.entanglements.get(entanglementId);
    if (!entanglement) {
      throw new Error(`Entanglement not found: ${entanglementId}`);
    }

    if (entanglement.status !== 'active') {
      this.log(`Entanglement ${entanglementId} is already ${entanglement.status}`);
      return false;
    }

    // Update entanglement
    entanglement.status = 'broken';

    this.log(`Broke entanglement ${entanglementId}`);

    return true;
  }

  /**
   * Get all entanglements
   *
   * @param {Object} [filters] - Filters to apply
   * @param {string} [filters.status] - Filter by status
   * @param {string} [filters.dimension] - Filter by dimension
   * @param {number} [filters.level] - Filter by level
   * @returns {Array<EntanglementPair>} Matching entanglements
   */
  getEntanglements(filters = {}) {
    let entanglements = Array.from(this.entanglements.values());

    // Apply filters
    if (filters.status) {
      entanglements = entanglements.filter(e => e.status === filters.status);
    }

    if (filters.dimension) {
      entanglements = entanglements.filter(
        e => e.dimension1 === filters.dimension || e.dimension2 === filters.dimension
      );
    }

    if (filters.level) {
      entanglements = entanglements.filter(e => e.level === filters.level);
    }

    return entanglements;
  }

  /**
   * Get an entanglement by ID
   *
   * @param {string} entanglementId - Entanglement ID
   * @returns {EntanglementPair|null} The entanglement or null if not found
   */
  getEntanglement(entanglementId) {
    return this.entanglements.get(entanglementId) || null;
  }

  /**
   * Check if two dimensions are entangled
   *
   * @param {string} dimension1 - First dimension
   * @param {string} dimension2 - Second dimension
   * @returns {boolean} Whether the dimensions are entangled
   */
  areEntangled(dimension1, dimension2) {
    return this._findEntanglement(dimension1, dimension2) !== null;
  }

  /**
   * Get entanglement between two dimensions
   *
   * @param {string} dimension1 - First dimension
   * @param {string} dimension2 - Second dimension
   * @returns {EntanglementPair|null} The entanglement or null if not found
   */
  getEntanglementBetween(dimension1, dimension2) {
    return this._findEntanglement(dimension1, dimension2);
  }

  /**
   * Transfer data through entanglement
   *
   * @param {string} sourceDimension - Source dimension
   * @param {string} targetDimension - Target dimension
   * @param {*} data - Data to transfer
   * @param {Object} [options] - Transfer options
   * @returns {Promise<Object>} Transfer result
   */
  async transferThroughEntanglement(sourceDimension, targetDimension, data, options = {}) {
    try {
      // Find entanglement
      const entanglement = this._findEntanglement(sourceDimension, targetDimension);
      if (!entanglement) {
        throw new Error(`No entanglement found between ${sourceDimension} and ${targetDimension}`);
      }

      if (entanglement.status !== 'active') {
        throw new Error(`Entanglement is not active: ${entanglement.id}`);
      }

      // Check direction
      if (!entanglement.bidirectional && entanglement.dimension1 !== sourceDimension) {
        throw new Error(
          `Entanglement is unidirectional from ${entanglement.dimension1} to ${entanglement.dimension2}`
        );
      }

      // Check data capacity
      const dataSize = this._calculateDataSize(data);
      const maxCapacity = this.entanglementLevels[entanglement.level].dataCapacity;
      if (dataSize > maxCapacity) {
        throw new Error(`Data size exceeds entanglement capacity: ${dataSize} > ${maxCapacity}`);
      }

      // Prepare transfer
      const transferId = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate quantum transfer
      const transferSuccess = Math.random() < entanglement.coherence;

      if (!transferSuccess) {
        // Instead of throwing an error, return a failure result
        return {
          success: false,
          transferId,
          entanglementId: entanglement.id,
          sourceDimension,
          targetDimension,
          coherence: entanglement.coherence,
          error: 'Quantum transfer failed due to decoherence',
          metadata: {
            timestamp: Date.now(),
            ...options.metadata,
          },
        };
      }

      // Update entanglement coherence (slight degradation)
      entanglement.coherence = Math.max(
        entanglement.coherence - 0.01,
        this.entanglementLevels[entanglement.level].coherenceRange[0]
      );

      this.log(`Transferred data through entanglement ${entanglement.id}`);

      return {
        success: true,
        transferId,
        entanglementId: entanglement.id,
        sourceDimension,
        targetDimension,
        coherence: entanglement.coherence,
        data,
        metadata: {
          timestamp: Date.now(),
          ...options.metadata,
        },
      };
    } catch (error) {
      // Log the error
      this.log(`Error in transferThroughEntanglement: ${error.message}`);

      // Re-throw the error to maintain the expected behavior
      throw error;
    }
  }

  /**
   * Strengthen an entanglement
   *
   * @param {string} entanglementId - Entanglement ID
   * @param {number} [amount=0.1] - Amount to strengthen (0.0-1.0)
   * @returns {boolean} Whether the entanglement was strengthened successfully
   */
  strengthenEntanglement(entanglementId, amount = 0.1) {
    const entanglement = this.entanglements.get(entanglementId);
    if (!entanglement) {
      throw new Error(`Entanglement not found: ${entanglementId}`);
    }

    if (entanglement.status !== 'active') {
      throw new Error(`Entanglement is not active: ${entanglementId}`);
    }

    // Validate amount
    if (amount < 0 || amount > 1) {
      throw new Error(`Invalid strengthening amount: ${amount}`);
    }

    // Calculate new coherence
    const [minCoherence, maxCoherence] = this.entanglementLevels[entanglement.level].coherenceRange;
    const newCoherence = Math.min(entanglement.coherence + amount, maxCoherence);

    // Update entanglement
    entanglement.coherence = newCoherence;

    this.log(`Strengthened entanglement ${entanglementId} to coherence ${newCoherence.toFixed(2)}`);

    return true;
  }

  /**
   * Upgrade an entanglement to a higher level
   *
   * @param {string} entanglementId - Entanglement ID
   * @returns {boolean} Whether the entanglement was upgraded successfully
   */
  upgradeEntanglement(entanglementId) {
    const entanglement = this.entanglements.get(entanglementId);
    if (!entanglement) {
      throw new Error(`Entanglement not found: ${entanglementId}`);
    }

    if (entanglement.status !== 'active') {
      throw new Error(`Entanglement is not active: ${entanglementId}`);
    }

    if (entanglement.level >= 5) {
      this.log(`Entanglement ${entanglementId} is already at maximum level`);
      return false;
    }

    // Upgrade level
    const newLevel = entanglement.level + 1;
    const [minCoherence, maxCoherence] = this.entanglementLevels[newLevel].coherenceRange;

    // Update entanglement
    entanglement.level = newLevel;
    entanglement.coherence = minCoherence + Math.random() * (maxCoherence - minCoherence);

    this.log(`Upgraded entanglement ${entanglementId} to level ${newLevel}`);

    return true;
  }

  /**
   * Find entanglement between two dimensions
   *
   * @private
   * @param {string} dimension1 - First dimension
   * @param {string} dimension2 - Second dimension
   * @returns {EntanglementPair|null} The entanglement or null if not found
   */
  _findEntanglement(dimension1, dimension2) {
    for (const entanglement of this.entanglements.values()) {
      if (entanglement.status === 'active') {
        if (
          (entanglement.dimension1 === dimension1 && entanglement.dimension2 === dimension2) ||
          (entanglement.bidirectional &&
            entanglement.dimension1 === dimension2 &&
            entanglement.dimension2 === dimension1)
        ) {
          return entanglement;
        }
      }
    }

    return null;
  }

  /**
   * Calculate data size
   *
   * @private
   * @param {*} data - Data to calculate size for
   * @returns {number} Data size
   */
  _calculateDataSize(data) {
    // Simple implementation - in a real system this would be more sophisticated
    const json = JSON.stringify(data);
    return Math.ceil(json.length / 1024); // Size in KB
  }

  /**
   * Start entanglement maintenance
   *
   * @private
   */
  _startEntanglementMaintenance() {
    // Check entanglements every minute
    this.maintenanceInterval = setInterval(() => {
      this._maintainEntanglements();
    }, 60000);
  }

  /**
   * Maintain entanglements
   *
   * @private
   */
  _maintainEntanglements() {
    const now = Date.now();

    for (const [id, entanglement] of this.entanglements.entries()) {
      // Skip non-active entanglements
      if (entanglement.status !== 'active') {
        continue;
      }

      // Check expiration
      if (entanglement.expiresAt > 0 && now >= entanglement.expiresAt) {
        entanglement.status = 'expired';
        this.log(`Entanglement ${id} expired`);
        continue;
      }

      // Check coherence
      if (entanglement.coherence < this.config.coherenceThreshold) {
        entanglement.status = 'decohered';
        this.log(`Entanglement ${id} decohered`);
        continue;
      }

      // Slight natural decoherence over time
      const decoherence = 0.001; // 0.1% per minute
      entanglement.coherence = Math.max(
        entanglement.coherence - decoherence,
        this.entanglementLevels[entanglement.level].coherenceRange[0]
      );
    }
  }

  /**
   * Log a message if debug mode is enabled
   *
   * @private
   * @param {string} message - Message to log
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[QuantumEntanglementManager] ${message}`);
    }
  }
}

module.exports = { QuantumEntanglementManager };
