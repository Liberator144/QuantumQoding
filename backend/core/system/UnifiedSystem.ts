/**
 * Unified System
 *
 * Provides a unified system for the Quantum-Unified Database.
 *
 * @version 1.0.0
 */

const { UnifiedQuantumDatabase } = require('../core/UnifiedQuantumDatabase');
const { FlowSystem } = require('../flow/FlowSystem');
const { VerificationSystem } = require('./VerificationSystem');
const { MobileOptimizationSystem } = require('../mobile');

/**
 * Unified System
 */
class UnifiedSystem {
  /**
   * Create a new UnifiedSystem instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Database options
      database: {
        adapter: 'memory',
        debugMode: false,
      },

      // Flow options
      flow: {
        debugMode: false,
      },

      // Verification options
      verification: {
        debugMode: false,
      },

      // Mobile options
      mobile: {
        debugMode: false,
      },

      // Merge with provided options
      ...options,
    };

    // State
    this.initialized = false;

    // Create components
    this._createComponents();

    this.log('Unified System created');
  }

  /**
   * Create system components
   * @private
   */
  _createComponents() {
    // Create database
    this.database = new UnifiedQuantumDatabase({
      ...this.config.database,
      defaultAdapter: this.config.database.adapter || 'memory',
      debugMode: this.config.debugMode,
    });

    // Create flow system
    this.flow = new FlowSystem({
      ...this.config.flow,
      debugMode: this.config.debugMode,
    });

    // Create verification system
    this.verification = new VerificationSystem({
      ...this.config.verification,
      debugMode: this.config.debugMode,
    });

    // Create mobile optimization system
    this.mobile = new MobileOptimizationSystem({
      ...this.config.mobile,
      debugMode: this.config.debugMode,
    });
  }

  /**
   * Initialize the system
   * @returns {Promise<boolean>} Success
   */
  async initialize() {
    try {
      this.log('Initializing Unified System');

      // Initialize database
      await this.database.initialize();

      // Initialize flow system
      await this.flow.initialize();

      // Initialize verification system
      await this.verification.initialize();

      // Initialize mobile optimization system
      await this.mobile.initialize();

      this.initialized = true;

      this.log('Unified System initialized');

      return true;
    } catch (error) {
      this.log(`Error initializing Unified System: ${error.message}`);
      return false;
    }
  }

  /**
   * Close the system
   * @returns {Promise<boolean>} Success
   */
  async close() {
    try {
      this.log('Closing Unified System');

      // Close database
      await this.database.close();

      // Close flow system
      await this.flow.close();

      // Close verification system
      await this.verification.close();

      // Close mobile optimization system
      await this.mobile.close();

      this.initialized = false;

      this.log('Unified System closed');

      return true;
    } catch (error) {
      this.log(`Error closing Unified System: ${error.message}`);
      return false;
    }
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[UnifiedSystem] ${message}`);
    }
  }
}

module.exports = { UnifiedSystem };
