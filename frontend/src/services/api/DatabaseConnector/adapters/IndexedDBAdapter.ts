/**
 * IndexedDB Adapter
 *
 * Uses browser's IndexedDB for storage.
 *
 * @version 1.0.0
 */
import { BaseAdapter } from './BaseAdapter';
class IndexedDBAdapter extends BaseAdapter {
    /**
     * Create a new IndexedDBAdapter instance
     * @param {Object} options - Adapter options
     */
    constructor(options = {}) {
        super({
            // Database name
            dbName: 'quantum-db',
            // Database version
            version: 1,
            // Merge with provided options
            ...options,
        });
        // Set adapter name
        this.name = 'indexedDB';
        // Database
        this.db = null;
        // Initialization promise
        this.initPromise = null;
    }
    /**
     * Initialize the database
     * @returns {Promise<IDBDatabase>} Database instance
     * @private
     */
    async _initDB() {
        // Return existing database if already initialized
        if (this.db) {
            return this.db;
        }
        // Return existing initialization promise if already initializing
        if (this.initPromise) {
            return this.initPromise;
        }
        this.log(`Initializing IndexedDB: ${this.options.dbName} (v${this.options.version})`);
        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.options.dbName, this.options.version);
            request.onerror = event => {
                this.log(`Error opening IndexedDB: ${event.target.error.message}`);
                reject(event.target.error);
            };
            request.onsuccess = event => {
                this.db = event.target.result;
                this.log('IndexedDB initialized successfully');
                resolve(this.db);
            };
            request.onupgradeneeded = event => {
                const db = event.target.result;
                // Create object store for collections
                if (!db.objectStoreNames.contains('collections')) {
                    db.createObjectStore('collections', { keyPath: 'id' });
                }
            };
        });
        return this.initPromise;
    }
    /**
     * Load data from IndexedDB
     * @param {string} collection - Collection name
     * @returns {Promise<Array|Object>} Loaded data
     */
    async load(collection) {
        try {
            const db = await this._initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['collections'], 'readonly');
                const store = transaction.objectStore('collections');
                const request = store.get(collection);
                request.onerror = event => {
                    this.log(`Error loading data from IndexedDB for collection ${collection}: ${event.target.error.message}`);
                    reject(event.target.error);
                };
                request.onsuccess = event => {
                    const result = event.target.result;
                    if (result) {
                        this.log(`Loaded data for collection ${collection}`);
                        resolve(result.data);
                    }
                    else {
                        this.log(`No data found for collection ${collection}`);
                        resolve([]);
                    }
                };
            });
        }
        catch (error) {
            this.log(`Error loading data for collection ${collection}: ${error.message}`);
            return [];
        }
    }
    /**
     * Save data to IndexedDB
     * @param {string} collection - Collection name
     * @param {Array|Object} data - Data to save
     * @returns {Promise<boolean>} Success
     */
    async save(collection, data) {
        try {
            const db = await this._initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['collections'], 'readwrite');
                const store = transaction.objectStore('collections');
                const request = store.put({
                    id: collection,
                    data,
                    updatedAt: Date.now(),
                });
                request.onerror = event => {
                    this.log(`Error saving data to IndexedDB for collection ${collection}: ${event.target.error.message}`);
                    reject(event.target.error);
                };
                request.onsuccess = () => {
                    this.log(`Saved data for collection ${collection}`);
                    resolve(true);
                };
            });
        }
        catch (error) {
            this.log(`Error saving data for collection ${collection}: ${error.message}`);
            return false;
        }
    }
    /**
     * Remove data from IndexedDB
     * @param {string} collection - Collection name
     * @returns {Promise<boolean>} Success
     */
    async remove(collection) {
        try {
            const db = await this._initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['collections'], 'readwrite');
                const store = transaction.objectStore('collections');
                const request = store.delete(collection);
                request.onerror = event => {
                    this.log(`Error removing data from IndexedDB for collection ${collection}: ${event.target.error.message}`);
                    reject(event.target.error);
                };
                request.onsuccess = () => {
                    this.log(`Removed data for collection ${collection}`);
                    resolve(true);
                };
            });
        }
        catch (error) {
            this.log(`Error removing data for collection ${collection}: ${error.message}`);
            return false;
        }
    }
    /**
     * Clear all data from IndexedDB
     * @returns {Promise<boolean>} Success
     */
    async clear() {
        try {
            const db = await this._initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['collections'], 'readwrite');
                const store = transaction.objectStore('collections');
                const request = store.clear();
                request.onerror = event => {
                    this.log(`Error clearing data from IndexedDB: ${event.target.error.message}`);
                    reject(event.target.error);
                };
                request.onsuccess = () => {
                    this.log('Cleared all data');
                    resolve(true);
                };
            });
        }
        catch (error) {
            this.log(`Error clearing data: ${error.message}`);
            return false;
        }
    }
}
module.exports = { IndexedDBAdapter };
