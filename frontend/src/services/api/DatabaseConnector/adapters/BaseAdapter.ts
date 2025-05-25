/**
 * Base Adapter
 *
 * Base class for all storage adapters.
 *
 * @version 1.0.0
 */

class BaseAdapter {
  /**
   * Create a new BaseAdapter instance
   * @param {Object} options - Adapter options
   */
  constructor(options = {}) {
    // Adapter name
    this.name = 'base';

    // Options
    this.options = {
      // Debug mode
      debugMode: false,

      // Merge with provided options
      ...options,
    };
  }

  /**
   * Load data from storage
   * @param {string} collection - Collection name
   * @returns {Promise<Array|Object>} Loaded data
   */
  async load(collection) {
    throw new Error('Method not implemented: load');
  }

  /**
   * Save data to storage
   * @param {string} collection - Collection name
   * @param {Array|Object} data - Data to save
   * @returns {Promise<boolean>} Success
   */
  async save(collection, data) {
    throw new Error('Method not implemented: save');
  }

  /**
   * Remove data from storage
   * @param {string} collection - Collection name
   * @returns {Promise<boolean>} Success
   */
  async remove(collection) {
    throw new Error('Method not implemented: remove');
  }

  /**
   * Clear all data from storage
   * @returns {Promise<boolean>} Success
   */
  async clear() {
    throw new Error('Method not implemented: clear');
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.options.debugMode) {
      console.log(`[${this.name}Adapter] ${message}`);
    }
  }
}

module.exports = { BaseAdapter };
