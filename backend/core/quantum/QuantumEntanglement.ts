/**
 * QuantumEntanglement
 *
 * The QuantumEntanglement class provides a way to create and manage quantum
 * entanglements between objects.
 *
 * @version 1.0.0
 */

const { EventEmitter } = require('events');

/**
 * QuantumEntanglement class
 *
 * Provides a way to create and manage quantum entanglements between objects.
 */
class QuantumEntanglement extends EventEmitter {
  /**
   * Create a new QuantumEntanglement instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: options.debugMode || false,

      // Entanglement strength
      defaultStrength: options.defaultStrength || 1.0,

      // Entanglement decay rate
      decayRate: options.decayRate || 0.0,

      // Whether to automatically propagate changes
      autoPropagation: options.autoPropagation !== undefined ? options.autoPropagation : true,

      // Maximum propagation depth
      maxPropagationDepth: options.maxPropagationDepth || 10,
    };

    // State
    this.state = {
      // Entangled objects
      entanglements: new Map(),

      // Entanglement strengths
      strengths: new Map(),

      // Entanglement timestamps
      timestamps: new Map(),

      // Propagation lock to prevent infinite loops
      propagationLock: new Set(),

      // Statistics
      stats: {
        // Total entanglements created
        entanglementsCreated: 0,

        // Total entanglements broken
        entanglementsBroken: 0,

        // Total propagations
        propagations: 0,

        // Total propagation errors
        propagationErrors: 0,
      },
    };

    // Initialize
    this._initialize();
  }

  /**
   * Initialize the quantum entanglement
   * @private
   */
  _initialize() {
    // Log initialization
    this.log('Quantum entanglement initialized');

    // Emit initialized event
    this.emit('initialized');
  }

  /**
   * Entangle two objects
   * @param {string} sourceId - Source object ID
   * @param {string} targetId - Target object ID
   * @param {number} strength - Entanglement strength (0-1)
   * @param {boolean} bidirectional - Whether the entanglement is bidirectional
   * @returns {boolean} Whether the entanglement was created
   */
  entangle(sourceId, targetId, strength = this.config.defaultStrength, bidirectional = true) {
    // Validate IDs
    if (!sourceId || !targetId) {
      this.log('Invalid source or target ID');
      return false;
    }

    // Validate strength
    if (strength < 0 || strength > 1) {
      this.log(`Invalid strength: ${strength}`);
      return false;
    }

    // Check if already entangled
    if (this._isEntangled(sourceId, targetId)) {
      this.log(`Objects already entangled: ${sourceId} and ${targetId}`);

      // Update strength
      this._setEntanglementStrength(sourceId, targetId, strength);

      return true;
    }

    // Create entanglement
    if (!this.state.entanglements.has(sourceId)) {
      this.state.entanglements.set(sourceId, new Set());
    }

    this.state.entanglements.get(sourceId).add(targetId);

    // Set entanglement strength
    this._setEntanglementStrength(sourceId, targetId, strength);

    // Set entanglement timestamp
    this._setEntanglementTimestamp(sourceId, targetId);

    // Create bidirectional entanglement if requested
    if (bidirectional) {
      if (!this.state.entanglements.has(targetId)) {
        this.state.entanglements.set(targetId, new Set());
      }

      this.state.entanglements.get(targetId).add(sourceId);

      // Set entanglement strength
      this._setEntanglementStrength(targetId, sourceId, strength);

      // Set entanglement timestamp
      this._setEntanglementTimestamp(targetId, sourceId);
    }

    // Update statistics
    this.state.stats.entanglementsCreated++;

    // Log entanglement
    this.log(`Entangled ${sourceId} and ${targetId} with strength ${strength}`);

    // Emit entangled event
    this.emit('entangled', {
      sourceId,
      targetId,
      strength,
      bidirectional,
    });

    return true;
  }

  /**
   * Break an entanglement between two objects
   * @param {string} sourceId - Source object ID
   * @param {string} targetId - Target object ID
   * @param {boolean} bidirectional - Whether to break bidirectionally
   * @returns {boolean} Whether the entanglement was broken
   */
  disentangle(sourceId, targetId, bidirectional = true) {
    // Validate IDs
    if (!sourceId || !targetId) {
      this.log('Invalid source or target ID');
      return false;
    }

    // Check if entangled
    if (!this._isEntangled(sourceId, targetId)) {
      this.log(`Objects not entangled: ${sourceId} and ${targetId}`);
      return false;
    }

    // Break entanglement
    let broken = false;

    if (this.state.entanglements.has(sourceId)) {
      broken = this.state.entanglements.get(sourceId).delete(targetId);

      // Remove entanglement strength
      this._removeEntanglementStrength(sourceId, targetId);

      // Remove entanglement timestamp
      this._removeEntanglementTimestamp(sourceId, targetId);
    }

    // Break bidirectional entanglement if requested
    if (bidirectional && this.state.entanglements.has(targetId)) {
      const targetBroken = this.state.entanglements.get(targetId).delete(sourceId);
      broken = broken || targetBroken;

      // Remove entanglement strength
      this._removeEntanglementStrength(targetId, sourceId);

      // Remove entanglement timestamp
      this._removeEntanglementTimestamp(targetId, sourceId);
    }

    if (broken) {
      // Update statistics
      this.state.stats.entanglementsBroken++;

      // Log disentanglement
      this.log(`Disentangled ${sourceId} and ${targetId}`);

      // Emit disentangled event
      this.emit('disentangled', {
        sourceId,
        targetId,
        bidirectional,
      });
    }

    return broken;
  }

  /**
   * Propagate a change through entangled objects
   * @param {string} sourceId - Source object ID
   * @param {any} data - Data to propagate
   * @param {Function} transformer - Function to transform data for each target
   * @param {number} depth - Current propagation depth
   * @returns {number} Number of objects the change was propagated to
   */
  propagate(sourceId, data, transformer = null, depth = 0) {
    // Validate ID
    if (!sourceId) {
      this.log('Invalid source ID');
      return 0;
    }

    // Check propagation depth
    if (depth >= this.config.maxPropagationDepth) {
      this.log(`Maximum propagation depth reached: ${depth}`);
      return 0;
    }

    // Check propagation lock
    if (this.state.propagationLock.has(sourceId)) {
      this.log(`Propagation locked for ${sourceId}`);
      return 0;
    }

    // Add to propagation lock
    this.state.propagationLock.add(sourceId);

    try {
      // Get entangled objects
      const entangled = this._getEntangledObjects(sourceId);

      if (entangled.length === 0) {
        return 0;
      }

      // Propagate to entangled objects
      let propagatedCount = 0;

      for (const target of entangled) {
        // Get entanglement strength
        const strength = this._getEntanglementStrength(sourceId, target.id);

        // Apply decay
        const decayedStrength = this._applyDecay(strength, target.timestamp);

        // Skip if strength is too low
        if (decayedStrength <= 0) {
          continue;
        }

        try {
          // Transform data if transformer is provided
          const transformedData = transformer
            ? transformer(data, target.id, decayedStrength)
            : data;

          // Emit propagated event
          this.emit('propagated', {
            sourceId,
            targetId: target.id,
            data: transformedData,
            strength: decayedStrength,
          });

          // Recursively propagate if auto-propagation is enabled
          if (this.config.autoPropagation) {
            this.propagate(target.id, transformedData, transformer, depth + 1);
          }

          propagatedCount++;
        } catch (error) {
          // Update statistics
          this.state.stats.propagationErrors++;

          // Log error
          this.log(`Propagation error: ${error.message}`);

          // Emit error event
          this.emit('propagation:error', {
            sourceId,
            targetId: target.id,
            error,
          });
        }
      }

      // Update statistics
      this.state.stats.propagations++;

      // Return propagated count
      return propagatedCount;
    } finally {
      // Remove from propagation lock
      this.state.propagationLock.delete(sourceId);
    }
  }

  /**
   * Check if two objects are entangled
   * @param {string} sourceId - Source object ID
   * @param {string} targetId - Target object ID
   * @returns {boolean} Whether the objects are entangled
   * @private
   */
  _isEntangled(sourceId, targetId) {
    return (
      this.state.entanglements.has(sourceId) && this.state.entanglements.get(sourceId).has(targetId)
    );
  }

  /**
   * Get all objects entangled with an object
   * @param {string} objectId - Object ID
   * @returns {Array} Array of entangled objects
   * @private
   */
  _getEntangledObjects(objectId) {
    if (!this.state.entanglements.has(objectId)) {
      return [];
    }

    return Array.from(this.state.entanglements.get(objectId)).map(id => ({
      id,
      strength: this._getEntanglementStrength(objectId, id),
      timestamp: this._getEntanglementTimestamp(objectId, id),
    }));
  }

  /**
   * Set the entanglement strength between two objects
   * @param {string} sourceId - Source object ID
   * @param {string} targetId - Target object ID
   * @param {number} strength - Entanglement strength (0-1)
   * @private
   */
  _setEntanglementStrength(sourceId, targetId, strength) {
    this.state.strengths.set(`${sourceId}:${targetId}`, strength);
  }

  /**
   * Get the entanglement strength between two objects
   * @param {string} sourceId - Source object ID
   * @param {string} targetId - Target object ID
   * @returns {number} Entanglement strength (0-1)
   * @private
   */
  _getEntanglementStrength(sourceId, targetId) {
    return this.state.strengths.get(`${sourceId}:${targetId}`) || 0;
  }

  /**
   * Remove the entanglement strength between two objects
   * @param {string} sourceId - Source object ID
   * @param {string} targetId - Target object ID
   * @private
   */
  _removeEntanglementStrength(sourceId, targetId) {
    this.state.strengths.delete(`${sourceId}:${targetId}`);
  }

  /**
   * Set the entanglement timestamp between two objects
   * @param {string} sourceId - Source object ID
   * @param {string} targetId - Target object ID
   * @private
   */
  _setEntanglementTimestamp(sourceId, targetId) {
    this.state.timestamps.set(`${sourceId}:${targetId}`, Date.now());
  }

  /**
   * Get the entanglement timestamp between two objects
   * @param {string} sourceId - Source object ID
   * @param {string} targetId - Target object ID
   * @returns {number} Entanglement timestamp
   * @private
   */
  _getEntanglementTimestamp(sourceId, targetId) {
    return this.state.timestamps.get(`${sourceId}:${targetId}`) || 0;
  }

  /**
   * Remove the entanglement timestamp between two objects
   * @param {string} sourceId - Source object ID
   * @param {string} targetId - Target object ID
   * @private
   */
  _removeEntanglementTimestamp(sourceId, targetId) {
    this.state.timestamps.delete(`${sourceId}:${targetId}`);
  }

  /**
   * Apply decay to entanglement strength
   * @param {number} strength - Entanglement strength
   * @param {number} timestamp - Entanglement timestamp
   * @returns {number} Decayed strength
   * @private
   */
  _applyDecay(strength, timestamp) {
    if (this.config.decayRate <= 0) {
      return strength;
    }

    const age = (Date.now() - timestamp) / 1000; // Age in seconds
    const decay = age * this.config.decayRate;

    return Math.max(0, strength - decay);
  }

  /**
   * Get all entanglements
   * @returns {Object[]} Array of entanglement data
   */
  getEntanglements() {
    const entanglements = [];

    for (const [sourceId, targets] of this.state.entanglements.entries()) {
      for (const targetId of targets) {
        entanglements.push({
          sourceId,
          targetId,
          strength: this._getEntanglementStrength(sourceId, targetId),
          timestamp: this._getEntanglementTimestamp(sourceId, targetId),
        });
      }
    }

    return entanglements;
  }

  /**
   * Get the entanglement state
   * @returns {Object} Entanglement state
   */
  getState() {
    return {
      entanglementCount: this.getEntanglements().length,
      objectCount: this.state.entanglements.size,
      stats: { ...this.state.stats },
    };
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[QuantumEntanglement] ${message}`);
    }
  }
}

module.exports = { QuantumEntanglement };
