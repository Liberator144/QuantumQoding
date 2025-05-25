/**
 * DatabaseIntegration
 *
 * The DatabaseIntegration provides integration between the verification system and the database.
 *
 * @version 1.0.0
 */

const { EventEmitter } = require('events');

/**
 * DatabaseIntegration class
 *
 * Provides integration between the verification system and the database.
 */
class DatabaseIntegration extends EventEmitter {
  /**
   * Create a new DatabaseIntegration instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: options.debugMode || false,

      // Database reference
      database: options.database || null,

      // Verification system reference
      verificationSystem: options.verificationSystem || null,

      // Collection name for verification results
      verificationCollection: options.verificationCollection || 'verification_results',

      // Whether to store verification results
      storeResults: options.storeResults !== undefined ? options.storeResults : true,

      // Maximum results to store
      maxStoredResults: options.maxStoredResults || 100,
    };

    // State
    this.state = {
      // Initialization status
      initialized: false,

      // Integration status
      status: 'initializing', // 'initializing', 'active', 'degraded', 'offline'

      // Database collection
      collection: null,
    };

    // Initialize
    this._initialize();
  }

  /**
   * Initialize the database integration
   * @private
   */
  _initialize() {
    // Check if database is provided
    if (!this.config.database) {
      this.log('No database provided, integration will be inactive');
      this.state.status = 'degraded';
      return;
    }

    // Check if verification system is provided
    if (!this.config.verificationSystem) {
      this.log('No verification system provided, integration will be inactive');
      this.state.status = 'degraded';
      return;
    }

    // Set up collection
    this._setupCollection();

    // Set up event listeners
    this._setupEventListeners();

    // Set status to active
    this.state.status = 'active';
    this.state.initialized = true;

    // Log initialization
    this.log('Database integration initialized');

    // Emit initialized event
    this.emit('initialized');
  }

  /**
   * Set up collection
   * @private
   */
  _setupCollection() {
    // Get or create collection
    this.state.collection =
      this.config.database.getCollection(this.config.verificationCollection) ||
      this.config.database.createCollection(this.config.verificationCollection);

    // Log collection setup
    this.log(`Collection set up: ${this.config.verificationCollection}`);
  }

  /**
   * Set up event listeners
   * @private
   */
  _setupEventListeners() {
    // Listen for verification complete event
    this.config.verificationSystem.on('verification:complete', data => {
      this._handleVerificationComplete(data);
    });

    // Listen for coherence complete event
    this.config.verificationSystem.on('coherence:complete', data => {
      this._handleCoherenceComplete(data);
    });

    // Listen for duplicates complete event
    this.config.verificationSystem.on('duplicates:complete', data => {
      this._handleDuplicatesComplete(data);
    });

    // Listen for performance complete event
    this.config.verificationSystem.on('performance:complete', data => {
      this._handlePerformanceComplete(data);
    });

    // Log event listeners setup
    this.log('Event listeners set up');
  }

  /**
   * Handle verification complete event
   * @param {Object} data - Event data
   * @private
   */
  _handleVerificationComplete(data) {
    // Store verification result if enabled
    if (this.config.storeResults && this.state.collection) {
      // Create result document
      const resultDocument = {
        id: `verification-${Date.now()}`,
        type: 'verification',
        timestamp: Date.now(),
        result: data.result,
        verificationTime: data.verificationTime,
      };

      // Insert result document
      this.state.collection.insert(resultDocument);

      // Log result storage
      this.log(`Verification result stored: ${resultDocument.id}`);

      // Trim stored results if needed
      this._trimStoredResults();
    }
  }

  /**
   * Handle coherence complete event
   * @param {Object} data - Event data
   * @private
   */
  _handleCoherenceComplete(data) {
    // Store coherence result if enabled
    if (this.config.storeResults && this.state.collection) {
      // Create result document
      const resultDocument = {
        id: `coherence-${Date.now()}`,
        type: 'coherence',
        timestamp: Date.now(),
        result: data.result,
        verificationTime: data.verificationTime,
      };

      // Insert result document
      this.state.collection.insert(resultDocument);

      // Log result storage
      this.log(`Coherence result stored: ${resultDocument.id}`);

      // Trim stored results if needed
      this._trimStoredResults();
    }
  }

  /**
   * Handle duplicates complete event
   * @param {Object} data - Event data
   * @private
   */
  _handleDuplicatesComplete(data) {
    // Store duplicates result if enabled
    if (this.config.storeResults && this.state.collection) {
      // Create result document
      const resultDocument = {
        id: `duplicates-${Date.now()}`,
        type: 'duplicates',
        timestamp: Date.now(),
        result: data.result,
        detectionTime: data.detectionTime,
      };

      // Insert result document
      this.state.collection.insert(resultDocument);

      // Log result storage
      this.log(`Duplicates result stored: ${resultDocument.id}`);

      // Trim stored results if needed
      this._trimStoredResults();
    }
  }

  /**
   * Handle performance complete event
   * @param {Object} data - Event data
   * @private
   */
  _handlePerformanceComplete(data) {
    // Store performance result if enabled
    if (this.config.storeResults && this.state.collection) {
      // Create result document
      const resultDocument = {
        id: `performance-${Date.now()}`,
        type: 'performance',
        timestamp: Date.now(),
        result: data.result,
        analysisTime: data.analysisTime,
      };

      // Insert result document
      this.state.collection.insert(resultDocument);

      // Log result storage
      this.log(`Performance result stored: ${resultDocument.id}`);

      // Trim stored results if needed
      this._trimStoredResults();
    }
  }

  /**
   * Trim stored results if needed
   * @private
   */
  _trimStoredResults() {
    // Check if collection exists
    if (!this.state.collection) {
      return;
    }

    // Get all results
    const results = this.state.collection.find();

    // Check if trimming is needed
    if (results.length > this.config.maxStoredResults) {
      // Sort results by timestamp (ascending)
      results.sort((a, b) => a.timestamp - b.timestamp);

      // Calculate number of results to remove
      const removeCount = results.length - this.config.maxStoredResults;

      // Remove oldest results
      for (let i = 0; i < removeCount; i++) {
        this.state.collection.remove(results[i].id);
      }

      // Log trimming
      this.log(`Trimmed ${removeCount} old verification results`);
    }
  }

  /**
   * Get verification results
   * @param {Object} options - Query options
   * @returns {Array} Verification results
   */
  getResults(options = {}) {
    // Check if collection exists
    if (!this.state.collection) {
      return [];
    }

    // Build query
    const query = {};

    // Add type filter if provided
    if (options.type) {
      query.type = options.type;
    }

    // Add timestamp filter if provided
    if (options.startTime || options.endTime) {
      query.timestamp = {};

      if (options.startTime) {
        query.timestamp.$gte = options.startTime;
      }

      if (options.endTime) {
        query.timestamp.$lte = options.endTime;
      }
    }

    // Find results
    const results = this.state.collection.find(query);

    // Sort results if needed
    if (options.sort) {
      const sortField = options.sort.field || 'timestamp';
      const sortDirection = options.sort.direction === 'asc' ? 1 : -1;

      results.sort((a, b) => {
        if (a[sortField] < b[sortField]) {
          return -1 * sortDirection;
        }
        if (a[sortField] > b[sortField]) {
          return 1 * sortDirection;
        }
        return 0;
      });
    }

    // Limit results if needed
    if (options.limit) {
      return results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[DatabaseIntegration] ${message}`);
    }
  }
}

module.exports = { DatabaseIntegration };
