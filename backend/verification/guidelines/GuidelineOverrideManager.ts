/**
 * GuidelineOverrideManager
 *
 * Manages justified exceptions to the guidelines.
 *
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');
const { v4: uuidv4 } = require('uuid');

/**
 * GuidelineOverrideManager
 *
 * Manages justified exceptions to the guidelines.
 */
class GuidelineOverrideManager extends EventEmitter {
  /**
   * Create a new GuidelineOverrideManager instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Base directory
      baseDir: process.cwd(),

      // Override file
      overrideFile: '.guideline-overrides.json',

      // Whether overrides require approval
      requireApproval: true,

      // Merge with provided options
      ...options,
    };

    // Initialize
    this._init();
  }

  /**
   * Initialize the override manager
   * @private
   */
  _init() {
    this.log('Initializing GuidelineOverrideManager');

    try {
      // Load overrides
      this.overrides = this._loadOverrides();

      this.log('GuidelineOverrideManager initialized');
    } catch (error) {
      this.log(`Initialization error: ${error.message}`);
      this.emit('error', error);
    }
  }

  /**
   * Create a new override
   * @param {string} guideline - Guideline to override
   * @param {string} path - Path to file or directory
   * @param {string} justification - Justification for override
   * @param {string} alternativeApproach - Alternative approach
   * @param {string} impactAssessment - Impact assessment
   * @param {string} approver - Name of approver
   * @returns {Object} Creation result
   */
  createOverride(
    guideline,
    path,
    justification,
    alternativeApproach,
    impactAssessment,
    approver = null
  ) {
    try {
      this.log(`Creating override for guideline: ${guideline}`);

      // Create override object
      const override = {
        id: uuidv4(),
        guideline,
        path,
        justification,
        alternativeApproach,
        impactAssessment,
        createdAt: new Date().toISOString(),
        approved: !this.config.requireApproval || !!approver,
        approver,
        approvedAt: approver ? new Date().toISOString() : null,
      };

      // Validate override
      const validationResult = this._validateOverride(override);

      if (!validationResult.valid) {
        throw new Error(`Invalid override: ${validationResult.error}`);
      }

      // Add override
      this.overrides.overrides.push(override);

      this.log(`Override created: ${override.id}`);
      this.emit('override-created', override);

      return {
        success: true,
        override,
      };
    } catch (error) {
      this.log(`Create override error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Approve an override
   * @param {string} overrideId - Override ID
   * @param {string} approver - Name of approver
   * @returns {Object} Approval result
   */
  approveOverride(overrideId, approver) {
    try {
      this.log(`Approving override: ${overrideId}`);

      // Find override
      const override = this.overrides.overrides.find(o => o.id === overrideId);

      if (!override) {
        throw new Error(`Override not found: ${overrideId}`);
      }

      // Check if already approved
      if (override.approved) {
        return {
          success: true,
          override,
          message: 'Override already approved',
        };
      }

      // Update override
      override.approved = true;
      override.approver = approver;
      override.approvedAt = new Date().toISOString();

      // Save overrides
      this._saveOverrides();

      this.log(`Override approved: ${overrideId}`);
      this.emit('override-approved', override);

      return {
        success: true,
        override,
      };
    } catch (error) {
      this.log(`Approve override error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * List overrides
   * @param {Object} filter - Filter options
   * @returns {Object} List result
   */
  listOverrides(filter = {}) {
    try {
      this.log('Listing overrides');

      // Apply filters
      let filteredOverrides = this.overrides.overrides;

      if (filter.guideline) {
        filteredOverrides = filteredOverrides.filter(o => o.guideline === filter.guideline);
      }

      if (filter.path) {
        filteredOverrides = filteredOverrides.filter(o => o.path === filter.path);
      }

      if (filter.approved !== undefined) {
        filteredOverrides = filteredOverrides.filter(o => o.approved === filter.approved);
      }

      if (filter.approver) {
        filteredOverrides = filteredOverrides.filter(o => o.approver === filter.approver);
      }

      return {
        success: true,
        overrides: filteredOverrides,
      };
    } catch (error) {
      this.log(`List overrides error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate overrides
   * @returns {Object} Validation result
   */
  validateOverrides() {
    try {
      this.log('Validating overrides');

      const invalidOverrides = [];

      // Validate each override
      for (const override of this.overrides.overrides) {
        const validationResult = this._validateOverride(override);

        if (!validationResult.valid) {
          invalidOverrides.push({
            override,
            error: validationResult.error,
          });
        }
      }

      return {
        success: true,
        valid: invalidOverrides.length === 0,
        invalidOverrides,
      };
    } catch (error) {
      this.log(`Validate overrides error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Load overrides from file
   * @returns {Object} Loaded overrides
   * @private
   */
  _loadOverrides() {
    // For simplicity, return empty overrides
    // In a real implementation, this would load from file
    return { overrides: [] };
  }

  /**
   * Save overrides to file
   * @private
   */
  _saveOverrides() {
    // For simplicity, do nothing
    // In a real implementation, this would save to file
    return;
  }

  /**
   * Validate override
   * @param {Object} override - Override to validate
   * @returns {Object} Validation result
   * @private
   */
  _validateOverride(override) {
    try {
      // Check required fields
      if (!override.id) {
        return { valid: false, error: 'Override ID is required' };
      }

      if (!override.guideline) {
        return { valid: false, error: 'Guideline is required' };
      }

      if (!override.path) {
        return { valid: false, error: 'Path is required' };
      }

      if (!override.justification) {
        return { valid: false, error: 'Justification is required' };
      }

      if (!override.alternativeApproach) {
        return { valid: false, error: 'Alternative approach is required' };
      }

      if (!override.impactAssessment) {
        return { valid: false, error: 'Impact assessment is required' };
      }

      // Check justification length
      if (override.justification.length < 50) {
        return { valid: false, error: 'Justification must be at least 50 characters long' };
      }

      // Check if approved but no approver
      if (override.approved && !override.approver) {
        return { valid: false, error: 'Approved override must have an approver' };
      }

      return { valid: true };
    } catch (error) {
      this.log(`Validate override error: ${error.message}`);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[GuidelineOverrideManager] ${message}`);
    }
  }
}

module.exports = GuidelineOverrideManager;
