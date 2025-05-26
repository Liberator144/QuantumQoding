/**
 * File Adapter
 *
 * Uses the file system for storage (Node.js only).
 *
 * @version 1.0.0
 */
import { BaseAdapter } from './BaseAdapter';
import fs from 'fs';
import path from 'path';
class FileAdapter extends BaseAdapter {
    /**
     * Create a new FileAdapter instance
     * @param {Object} options - Adapter options
     */
    constructor(options = {}) {
        super({
            // Storage directory
            directory: './data',
            // File extension
            extension: '.json',
            // Merge with provided options
            ...options,
        });
        // Set adapter name
        this.name = 'file';
        // Ensure directory exists
        this._ensureDirectoryExists();
    }
    /**
     * Ensure directory exists
     * @private
     */
    _ensureDirectoryExists() {
        try {
            if (!fs.existsSync(this.options.directory)) {
                fs.mkdirSync(this.options.directory, { recursive: true });
                this.log(`Created directory: ${this.options.directory}`);
            }
        }
        catch (error) {
            this.log(`Error creating directory: ${error.message}`);
        }
    }
    /**
     * Get file path for collection
     * @param {string} collection - Collection name
     * @returns {string} File path
     * @private
     */
    _getFilePath(collection) {
        return path.join(this.options.directory, `${collection}${this.options.extension}`);
    }
    /**
     * Load data from file
     * @param {string} collection - Collection name
     * @returns {Promise<Array|Object>} Loaded data
     */
    async load(collection) {
        try {
            // Get file path
            const filePath = this._getFilePath(collection);
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                this.log(`File not found for collection ${collection}`);
                return [];
            }
            // Read file
            const data = fs.readFileSync(filePath, 'utf8');
            // Parse data
            const parsedData = JSON.parse(data);
            this.log(`Loaded data for collection ${collection}`);
            return parsedData;
        }
        catch (error) {
            this.log(`Error loading data for collection ${collection}: ${error.message}`);
            return [];
        }
    }
    /**
     * Save data to file
     * @param {string} collection - Collection name
     * @param {Array|Object} data - Data to save
     * @returns {Promise<boolean>} Success
     */
    async save(collection, data) {
        try {
            // Get file path
            const filePath = this._getFilePath(collection);
            // Stringify data
            const stringifiedData = JSON.stringify(data, null, 2);
            // Write file
            fs.writeFileSync(filePath, stringifiedData, 'utf8');
            this.log(`Saved data for collection ${collection}`);
            return true;
        }
        catch (error) {
            this.log(`Error saving data for collection ${collection}: ${error.message}`);
            return false;
        }
    }
    /**
     * Remove data from file
     * @param {string} collection - Collection name
     * @returns {Promise<boolean>} Success
     */
    async remove(collection) {
        try {
            // Get file path
            const filePath = this._getFilePath(collection);
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                this.log(`File not found for collection ${collection}`);
                return true;
            }
            // Remove file
            fs.unlinkSync(filePath);
            this.log(`Removed data for collection ${collection}`);
            return true;
        }
        catch (error) {
            this.log(`Error removing data for collection ${collection}: ${error.message}`);
            return false;
        }
    }
    /**
     * Clear all data from files
     * @returns {Promise<boolean>} Success
     */
    async clear() {
        try {
            // Get all files
            const files = fs.readdirSync(this.options.directory);
            // Filter JSON files
            const jsonFiles = files.filter(file => file.endsWith(this.options.extension));
            // Remove all files
            for (const file of jsonFiles) {
                fs.unlinkSync(path.join(this.options.directory, file));
            }
            this.log(`Cleared all data (${jsonFiles.length} collections)`);
            return true;
        }
        catch (error) {
            this.log(`Error clearing data: ${error.message}`);
            return false;
        }
    }
}
module.exports = { FileAdapter };
