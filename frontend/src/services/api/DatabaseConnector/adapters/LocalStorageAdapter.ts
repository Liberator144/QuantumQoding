/**
 * LocalStorage Adapter
 *
 * Uses browser's localStorage for storage.
 *
 * @version 1.0.0
 */
import { BaseAdapter } from './BaseAdapter';
class LocalStorageAdapter extends BaseAdapter {
    /**
     * Create a new LocalStorageAdapter instance
     * @param {Object} options - Adapter options
     */
    constructor(options = {}) {
        super({
            // Storage prefix
            prefix: 'quantum-db-',
            // Merge with provided options
            ...options,
        });
        // Set adapter name
        this.name = 'localStorage';
    }
    /**
     * Get storage key for collection
     * @param {string} collection - Collection name
     * @returns {string} Storage key
     * @private
     */
    _getKey(collection) {
        return `${this.options.prefix}${collection}`;
    }
    /**
     * Load data from localStorage
     * @param {string} collection - Collection name
     * @returns {Promise<Array|Object>} Loaded data
     */
    async load(collection) {
        try {
            // Get key
            const key = this._getKey(collection);
            // Get data from localStorage
            const data = localStorage.getItem(key);
            // Parse data
            const parsedData = data ? JSON.parse(data) : [];
            this.log(`Loaded data for collection ${collection}`);
            return parsedData;
        }
        catch (error) {
            this.log(`Error loading data for collection ${collection}: ${error.message}`);
            return [];
        }
    }
    /**
     * Save data to localStorage
     * @param {string} collection - Collection name
     * @param {Array|Object} data - Data to save
     * @returns {Promise<boolean>} Success
     */
    async save(collection, data) {
        try {
            // Get key
            const key = this._getKey(collection);
            // Stringify data
            const stringifiedData = JSON.stringify(data);
            // Save data to localStorage
            localStorage.setItem(key, stringifiedData);
            this.log(`Saved data for collection ${collection}`);
            return true;
        }
        catch (error) {
            this.log(`Error saving data for collection ${collection}: ${error.message}`);
            return false;
        }
    }
    /**
     * Remove data from localStorage
     * @param {string} collection - Collection name
     * @returns {Promise<boolean>} Success
     */
    async remove(collection) {
        try {
            // Get key
            const key = this._getKey(collection);
            // Remove data from localStorage
            localStorage.removeItem(key);
            this.log(`Removed data for collection ${collection}`);
            return true;
        }
        catch (error) {
            this.log(`Error removing data for collection ${collection}: ${error.message}`);
            return false;
        }
    }
    /**
     * Clear all data from localStorage
     * @returns {Promise<boolean>} Success
     */
    async clear() {
        try {
            // Get all keys
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.options.prefix)) {
                    keys.push(key);
                }
            }
            // Remove all keys
            for (const key of keys) {
                localStorage.removeItem(key);
            }
            this.log(`Cleared all data (${keys.length} collections)`);
            return true;
        }
        catch (error) {
            this.log(`Error clearing data: ${error.message}`);
            return false;
        }
    }
}
module.exports = { LocalStorageAdapter };
