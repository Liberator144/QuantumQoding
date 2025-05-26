/**
 * Memory Adapter
 *
 * In-memory storage (non-persistent).
 *
 * @version 1.0.0
 */
import { BaseAdapter } from './BaseAdapter';
class MemoryAdapter extends BaseAdapter {
    /**
     * Create a new MemoryAdapter instance
     * @param {Object} options - Adapter options
     */
    constructor(options = {}) {
        super(options);
        // Set adapter name
        this.name = 'memory';
        // Storage
        this.storage = new Map();
    }
    /**
     * Load data from memory
     * @param {string} collection - Collection name
     * @returns {Promise<Array|Object>} Loaded data
     */
    async load(collection) {
        try {
            // Get data from storage
            const data = this.storage.get(collection);
            // Clone data to prevent reference issues
            const clonedData = data ? JSON.parse(JSON.stringify(data)) : [];
            this.log(`Loaded data for collection ${collection}`);
            return clonedData;
        }
        catch (error) {
            this.log(`Error loading data for collection ${collection}: ${error.message}`);
            return [];
        }
    }
}
export { MemoryAdapter };
