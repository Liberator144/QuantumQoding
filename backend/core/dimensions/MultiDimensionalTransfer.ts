/**
 * MultiDimensionalTransfer
 *
 * A class for transferring data across multiple dimensions simultaneously.
 *
 * @module core/dimensions
 * @requires core/dimensions/DimensionalBridge
 * @requires core/dimensions/AdvancedDimensionalCommunicator
 */

const { DimensionalBridge } = require('./DimensionalBridge');
const { AdvancedDimensionalCommunicator } = require('./AdvancedDimensionalCommunicator');

/**
 * @typedef {Object} TransferOptions
 * @property {string} [mode='parallel'] - Transfer mode ('parallel', 'sequential', 'quantum')
 * @property {number} [timeout=10000] - Transfer timeout in milliseconds
 * @property {number} [retries=3] - Number of retries
 * @property {boolean} [validateData=true] - Whether to validate data
 * @property {Object} [metadata] - Transfer metadata
 */

/**
 * @typedef {Object} TransferResult
 * @property {boolean} success - Whether the transfer was successful
 * @property {Array<Object>} results - Results for each dimension
 * @property {Object} metadata - Transfer metadata
 */

/**
 * Class for multi-dimensional data transfer
 */
class MultiDimensionalTransfer {
  /**
   * Create a new MultiDimensionalTransfer
   *
   * @param {Object} config - Configuration options
   * @param {boolean} [config.debugMode=false] - Enable debug mode
   * @param {DimensionalBridge} [config.bridge] - DimensionalBridge instance
   * @param {AdvancedDimensionalCommunicator} [config.communicator] - AdvancedDimensionalCommunicator instance
   */
  constructor(config = {}) {
    this.config = {
      debugMode: false,
      bridge: null,
      communicator: null,
      ...config,
    };

    // Create bridge if not provided
    if (!this.config.bridge) {
      this.config.bridge = new DimensionalBridge({
        debugMode: this.config.debugMode,
      });
    }

    // Create communicator if not provided
    if (!this.config.communicator) {
      this.config.communicator = new AdvancedDimensionalCommunicator({
        debugMode: this.config.debugMode,
        bridge: this.config.bridge,
        advancedOptions: {
          useMultiDimensionalTransfer: true,
        },
      });
    }

    // Store references
    this.bridge = this.config.bridge;
    this.communicator = this.config.communicator;

    // Initialize transfer modes
    this.transferModes = {
      parallel: this._transferParallel.bind(this),
      sequential: this._transferSequential.bind(this),
      quantum: this._transferQuantum.bind(this),
    };

    // Initialize active transfers
    this.activeTransfers = new Map();

    this.log('MultiDimensionalTransfer initialized');
  }

  /**
   * Transfer data to multiple dimensions
   *
   * @param {string} sourceDimension - Source dimension
   * @param {Array<string>} targetDimensions - Target dimensions
   * @param {*} data - Data to transfer
   * @param {TransferOptions} [options] - Transfer options
   * @returns {Promise<TransferResult>} Transfer result
   */
  async transfer(sourceDimension, targetDimensions, data, options = {}) {
    // Validate dimensions
    if (!this.bridge.dimensionExists(sourceDimension)) {
      throw new Error(`Source dimension does not exist: ${sourceDimension}`);
    }

    for (const dimension of targetDimensions) {
      if (!this.bridge.dimensionExists(dimension)) {
        throw new Error(`Target dimension does not exist: ${dimension}`);
      }
    }

    // Prepare options
    const transferOptions = {
      mode: 'parallel',
      timeout: 10000,
      retries: 3,
      validateData: true,
      metadata: {},
      ...options,
    };

    // Generate transfer ID
    const transferId = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare transfer
    const transfer = {
      id: transferId,
      sourceDimension,
      targetDimensions,
      data,
      options: transferOptions,
      status: 'pending',
      startTime: Date.now(),
      endTime: null,
      results: [],
    };

    // Store transfer
    this.activeTransfers.set(transferId, transfer);

    try {
      // Execute transfer based on mode
      if (!this.transferModes[transferOptions.mode]) {
        throw new Error(`Unknown transfer mode: ${transferOptions.mode}`);
      }

      transfer.status = 'running';
      this.log(`Starting transfer ${transferId} in ${transferOptions.mode} mode`);

      const results = await this.transferModes[transferOptions.mode](transfer);

      // Update transfer
      transfer.status = 'completed';
      transfer.endTime = Date.now();
      transfer.results = results;

      this.log(`Completed transfer ${transferId}`);

      return {
        success: true,
        results,
        metadata: {
          transferId,
          duration: transfer.endTime - transfer.startTime,
          mode: transferOptions.mode,
          ...transferOptions.metadata,
        },
      };
    } catch (error) {
      // Update transfer
      transfer.status = 'failed';
      transfer.endTime = Date.now();
      transfer.error = error.message;

      this.log(`Failed transfer ${transferId}: ${error.message}`);

      return {
        success: false,
        error: error.message,
        metadata: {
          transferId,
          duration: transfer.endTime - transfer.startTime,
          mode: transferOptions.mode,
          ...transferOptions.metadata,
        },
      };
    }
  }

  /**
   * Get all active transfers
   *
   * @returns {Array<Object>} Active transfers
   */
  getActiveTransfers() {
    return Array.from(this.activeTransfers.values()).filter(
      transfer => transfer.status === 'pending' || transfer.status === 'running'
    );
  }

  /**
   * Get a transfer by ID
   *
   * @param {string} transferId - Transfer ID
   * @returns {Object|null} The transfer or null if not found
   */
  getTransfer(transferId) {
    return this.activeTransfers.get(transferId) || null;
  }

  /**
   * Cancel a transfer
   *
   * @param {string} transferId - Transfer ID
   * @returns {boolean} Whether the transfer was cancelled successfully
   */
  cancelTransfer(transferId) {
    const transfer = this.activeTransfers.get(transferId);
    if (!transfer) {
      return false;
    }

    if (transfer.status !== 'pending' && transfer.status !== 'running') {
      return false;
    }

    transfer.status = 'cancelled';
    transfer.endTime = Date.now();

    this.log(`Cancelled transfer ${transferId}`);

    return true;
  }

  /**
   * Transfer data in parallel mode
   *
   * @private
   * @param {Object} transfer - Transfer object
   * @returns {Promise<Array<Object>>} Transfer results
   */
  async _transferParallel(transfer) {
    // Create channels for all target dimensions
    const channels = await Promise.all(
      transfer.targetDimensions.map(dimension =>
        this._createAndOpenChannel(transfer.sourceDimension, dimension)
      )
    );

    // Send data to all channels in parallel
    const results = await Promise.all(
      channels.map(async (channel, index) => {
        try {
          const result = await this.communicator.sendData(channel.id, transfer.data, {
            timeout: transfer.options.timeout,
            retries: transfer.options.retries,
            metadata: {
              transferId: transfer.id,
              targetIndex: index,
            },
          });

          // Close channel
          this.communicator.closeChannel(channel.id);

          return {
            success: true,
            dimension: transfer.targetDimensions[index],
            result,
          };
        } catch (error) {
          // Close channel
          this.communicator.closeChannel(channel.id);

          return {
            success: false,
            dimension: transfer.targetDimensions[index],
            error: error.message,
          };
        }
      })
    );

    return results;
  }

  /**
   * Transfer data in sequential mode
   *
   * @private
   * @param {Object} transfer - Transfer object
   * @returns {Promise<Array<Object>>} Transfer results
   */
  async _transferSequential(transfer) {
    const results = [];

    // Process each target dimension sequentially
    for (let i = 0; i < transfer.targetDimensions.length; i++) {
      const targetDimension = transfer.targetDimensions[i];

      try {
        // Create and open channel
        const channel = await this._createAndOpenChannel(transfer.sourceDimension, targetDimension);

        // Send data
        const result = await this.communicator.sendData(channel.id, transfer.data, {
          timeout: transfer.options.timeout,
          retries: transfer.options.retries,
          metadata: {
            transferId: transfer.id,
            targetIndex: i,
          },
        });

        // Close channel
        this.communicator.closeChannel(channel.id);

        results.push({
          success: true,
          dimension: targetDimension,
          result,
        });
      } catch (error) {
        results.push({
          success: false,
          dimension: targetDimension,
          error: error.message,
        });

        // Continue with next dimension even if this one failed
      }
    }

    return results;
  }

  /**
   * Transfer data in quantum mode
   *
   * @private
   * @param {Object} transfer - Transfer object
   * @returns {Promise<Array<Object>>} Transfer results
   */
  async _transferQuantum(transfer) {
    // Check if quantum entanglement is enabled
    if (!this.communicator.advancedOptions.useQuantumEntanglement) {
      throw new Error('Quantum entanglement is not enabled');
    }

    // Create channels for all target dimensions with quantum protocol
    const channels = await Promise.all(
      transfer.targetDimensions.map(dimension =>
        this._createAndOpenChannel(transfer.sourceDimension, dimension, {
          protocolType: 'quantum',
        })
      )
    );

    // Send data to all channels in parallel using quantum protocol
    const results = await Promise.all(
      channels.map(async (channel, index) => {
        try {
          const result = await this.communicator.sendData(channel.id, transfer.data, {
            timeout: transfer.options.timeout,
            retries: transfer.options.retries,
            metadata: {
              transferId: transfer.id,
              targetIndex: index,
              quantumEntangled: true,
            },
          });

          // Close channel
          this.communicator.closeChannel(channel.id);

          return {
            success: true,
            dimension: transfer.targetDimensions[index],
            result,
            quantumCoherence: result.metadata?.coherence || 1.0,
          };
        } catch (error) {
          // Close channel
          this.communicator.closeChannel(channel.id);

          return {
            success: false,
            dimension: transfer.targetDimensions[index],
            error: error.message,
          };
        }
      })
    );

    return results;
  }

  /**
   * Create and open a channel
   *
   * @private
   * @param {string} sourceDimension - Source dimension
   * @param {string} targetDimension - Target dimension
   * @param {Object} [options] - Channel options
   * @returns {Promise<Object>} The created channel
   */
  async _createAndOpenChannel(sourceDimension, targetDimension, options = {}) {
    // Create channel
    const channel = this.communicator.createChannel(sourceDimension, targetDimension, options);

    // Open channel
    const opened = this.communicator.openChannel(channel.id);
    if (!opened) {
      throw new Error(`Failed to open channel to dimension ${targetDimension}`);
    }

    return channel;
  }

  /**
   * Log a message if debug mode is enabled
   *
   * @private
   * @param {string} message - Message to log
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[MultiDimensionalTransfer] ${message}`);
    }
  }
}

module.exports = { MultiDimensionalTransfer };
