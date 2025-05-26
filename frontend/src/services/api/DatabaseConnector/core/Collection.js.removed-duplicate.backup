/**
 * Collection class for the Unified Quantum Database
 *
 * Represents a collection of documents with schema validation and CRUD operations.
 *
 * @version 1.0.0
 */
class Collection {
    /**
     * Create a new Collection instance
     * @param {string} name - Collection name
     * @param {UnifiedQuantumDatabase} db - Database instance
     * @param {Object} options - Collection options
     */
    constructor(name, db, options = {}) {
        // Collection name
        this.name = name;
        // Database reference
        this.db = db;
        // Configuration
        this.config = {
            // Adapter name
            adapter: 'localStorage',
            // Schema name
            schema: null,
            // Validate schema
            validateSchema: true,
            // Merge with provided options
            ...options,
        };
        // Data
        this.data = [];
        // Schema
        this.schema = null;
        // Adapter
        this.adapter = null;
        // Initialize
        this._init();
    }
    /**
     * Initialize the collection
     * @private
     */
    _init() {
        // Get adapter
        if (this.config.adapter) {
            const adapter = this.db.adapters.get(this.config.adapter);
            if (!adapter) {
                throw new Error(`Adapter not found: ${this.config.adapter}`);
            }
            this.adapter = adapter;
        }
        // Get schema
        if (this.config.schema) {
            const schema = this.db.schemas.get(this.config.schema);
            if (!schema) {
                this.db.log(`Schema not found: ${this.config.schema}`);
            }
            else {
                this.schema = schema;
            }
        }
        // Load data
        this._loadData();
    }
    /**
     * Load data from adapter
     * @private
     */
    async _loadData() {
        try {
            // Load data from adapter
            const data = await this.adapter.load(this.name);
            // Set data
            this.data = Array.isArray(data) ? data : [];
            this.db.log(`Loaded ${this.data.length} documents from collection: ${this.name}`);
        }
        catch (error) {
            this.db.log(`Error loading data for collection ${this.name}: ${error.message}`);
            this.data = [];
        }
    }
    /**
     * Save data to adapter
     * @returns {Promise<Object>} Save result
     * @private
     */
    async _saveData() {
        try {
            // Save data to adapter
            await this.adapter.save(this.name, this.data);
            this.db.log(`Saved ${this.data.length} documents to collection: ${this.name}`);
            return {
                success: true,
                count: this.data.length,
            };
        }
        catch (error) {
            this.db.log(`Error saving data for collection ${this.name}: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    /**
     * Validate document against schema
     * @param {Object} doc - Document to validate
     * @returns {Object} Validation result
     * @private
     */
    _validateDocument(doc) {
        // Skip validation if disabled or no schema
        if (!this.config.validateSchema || !this.schema) {
            return { valid: true };
        }
        const errors = [];
        // Helper: check required fields
        const checkRequired = (doc, schema) => {
            for (const [field, fieldSchema] of Object.entries(schema)) {
                if (fieldSchema.required && (doc[field] === undefined || doc[field] === null)) {
                    errors.push(`Missing required field: ${field}`);
                }
            }
        };
        // Helper: check field types and constraints
        const checkTypesAndEnums = (doc, schema) => {
            for (const [field, value] of Object.entries(doc)) {
                const fieldSchema = schema[field];
                if (!fieldSchema)
                    continue;
                // Type
                if (fieldSchema.type) {
                    const actualType = Array.isArray(value) ? 'array' : typeof value;
                    if (actualType !== fieldSchema.type) {
                        errors.push(`Invalid type for field ${field}: expected ${fieldSchema.type}, got ${actualType}`);
                    }
                }
                // Enum
                if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
                    errors.push(`Invalid value for field ${field}: must be one of [${fieldSchema.enum.join(', ')}]`);
                }
            }
        };
        checkRequired(doc, this.schema);
        checkTypesAndEnums(doc, this.schema);
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    /**
     * Apply default values to document
     * @param {Object} doc - Document to apply defaults to
     * @returns {Object} Document with defaults applied
     * @private
     */
    _applyDefaults(doc) {
        // Skip if no schema
        if (!this.schema) {
            return doc;
        }
        const result = { ...doc };
        // Apply defaults
        for (const [field, schema] of Object.entries(this.schema)) {
            if (schema.default !== undefined && result[field] === undefined) {
                // Clone default value to avoid reference issues
                if (Array.isArray(schema.default)) {
                    result[field] = [...schema.default];
                }
                else if (typeof schema.default === 'object' && schema.default !== null) {
                    result[field] = { ...schema.default };
                }
                else {
                    result[field] = schema.default;
                }
            }
        }
        return result;
    }
    /**
     * Generate ID
     * @returns {string} Generated ID
     * @private
     */
    _generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    /**
     * Match document against query
     * @param {Object} doc - Document to match
     * @param {Object} query - Query object
     * @returns {boolean} Whether document matches query
     * @private
     */
    _matchQuery(doc, query) {
        // Empty query matches all documents
        if (Object.keys(query).length === 0) {
            return true;
        }
        // Check each query field
        for (const [field, value] of Object.entries(query)) {
            // Handle special operators
            if (field.startsWith('$')) {
                // Not implemented yet
                continue;
            }
            // Simple equality check
            if (doc[field] !== value) {
                return false;
            }
        }
        return true;
    }
    /**
     * Apply query options
     * @param {Array} results - Query results
     * @param {Object} options - Query options
     * @returns {Array} Processed results
     * @private
     */
    _applyQueryOptions(results, options) {
        let processedResults = [...results];
        // Apply sort
        if (options.sort) {
            processedResults.sort((a, b) => {
                for (const [field, order] of Object.entries(options.sort)) {
                    if (a[field] < b[field])
                        return order === 1 ? -1 : 1;
                    if (a[field] > b[field])
                        return order === 1 ? 1 : -1;
                }
                return 0;
            });
        }
        // Apply skip
        if (options.skip) {
            processedResults = processedResults.slice(options.skip);
        }
        // Apply limit
        if (options.limit) {
            processedResults = processedResults.slice(0, options.limit);
        }
        return processedResults;
    }
    /**
     * Record query analytics
     * @param {string} operation - Query operation
     * @param {Object} query - Query object
     * @param {number} duration - Query duration in ms
     * @param {number} resultCount - Number of results
     * @private
     */
    _recordQueryAnalytics(operation, query, duration, resultCount) {
        // Skip if no database
        if (!this.db) {
            return;
        }
        try {
            // Try to get analytics collection
            let analyticsCollection;
            try {
                analyticsCollection = this.db.getCollection('query_analytics');
            }
            catch (error) {
                // Collection doesn't exist, create it
                analyticsCollection = this.db.createCollection('query_analytics', {
                    adapter: 'memory', // Use memory adapter for analytics
                });
            }
            if (!analyticsCollection) {
                return;
            }
            // Record analytics
            analyticsCollection.insert({
                collection: this.name,
                operation,
                query: JSON.stringify(query),
                duration,
                resultCount,
                timestamp: Date.now(),
            });
        }
        catch (error) {
            // Silently fail for analytics
            this.db.log(`Error recording query analytics: ${error.message}`);
        }
    }
    /**
     * Find documents
     * @param {Object} query - Query object
     * @param {Object} options - Query options
     * @returns {Array} Matching documents
     */
    find(query = {}, options = {}) {
        // Start performance measurement
        const startTime = Date.now();
        // Filter documents
        const results = this.data.filter(doc => this._matchQuery(doc, query));
        // Apply options
        const processedResults = this._applyQueryOptions(results, options);
        // End performance measurement
        const endTime = Date.now();
        const duration = endTime - startTime;
        // Record query analytics
        this._recordQueryAnalytics('find', query, duration, processedResults.length);
        return processedResults;
    }
    /**
     * Find one document
     * @param {Object} query - Query object
     * @param {Object} options - Query options
     * @returns {Object|null} Matching document or null
     */
    findOne(query = {}, options = {}) {
        // Start performance measurement
        const startTime = Date.now();
        // Find first matching document
        const result = this.data.find(doc => this._matchQuery(doc, query)) || null;
        // End performance measurement
        const endTime = Date.now();
        const duration = endTime - startTime;
        // Record query analytics
        this._recordQueryAnalytics('findOne', query, duration, result ? 1 : 0);
        return result;
    }
    /**
     * Find document by ID
     * @param {string} id - Document ID
     * @returns {Object|null} Matching document or null
     */
    findById(id) {
        // Start performance measurement
        const startTime = Date.now();
        // Find document by ID
        const result = this.data.find(doc => doc.id === id) || null;
        // End performance measurement
        const endTime = Date.now();
        const duration = endTime - startTime;
        // Record query analytics
        this._recordQueryAnalytics('findById', { id }, duration, result ? 1 : 0);
        return result;
    }
    /**
     * Insert document
     * @param {Object} doc - Document to insert
     * @returns {Object} Inserted document
     */
    insert(doc) {
        // Ensure document is an object
        if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
            throw new Error('Document must be an object');
        }
        // Clone document
        const newDoc = { ...doc };
        // Generate ID if not provided
        if (!newDoc.id) {
            newDoc.id = this._generateId();
        }
        // Apply defaults
        const docWithDefaults = this._applyDefaults(newDoc);
        // Validate document
        const validation = this._validateDocument(docWithDefaults);
        if (!validation.valid) {
            throw new Error(`Invalid document: ${validation.errors?.join(', ')}`);
        }
        // Add document
        this.data.push(docWithDefaults);
        // Save data
        this._saveData();
        // Emit event
        this.db._emit('insert', {
            collection: this.name,
            document: docWithDefaults,
        });
        return docWithDefaults;
    }
    /**
     * Update document
     * @param {string} id - Document ID
     * @param {Object} update - Update object
     * @returns {Object|null} Updated document or null
     */
    update(id, update) {
        // Find document
        const index = this.data.findIndex(doc => doc.id === id);
        if (index === -1) {
            return null;
        }
        // Clone document
        const oldDoc = this.data[index];
        const newDoc = { ...oldDoc, ...update, id };
        // Validate document
        const validation = this._validateDocument(newDoc);
        if (!validation.valid) {
            throw new Error(`Invalid document: ${validation.errors?.join(', ')}`);
        }
        // Update document
        this.data[index] = newDoc;
        // Save data
        this._saveData();
        // Emit event
        this.db._emit('update', {
            collection: this.name,
            document: newDoc,
            oldDocument: oldDoc,
        });
        return newDoc;
    }
    /**
     * Remove document
     * @param {string} id - Document ID
     * @returns {boolean} Success
     */
    remove(id) {
        // Find document
        const index = this.data.findIndex(doc => doc.id === id);
        if (index === -1) {
            return false;
        }
        // Get document
        const doc = this.data[index];
        // Remove document
        this.data.splice(index, 1);
        // Save data
        this._saveData();
        // Emit event
        this.db._emit('remove', {
            collection: this.name,
            document: doc,
        });
        return true;
    }
    /**
     * Count documents
     * @param {Object} query - Query object
     * @returns {number} Document count
     */
    count(query = {}) {
        // Filter documents
        const results = this.data.filter(doc => this._matchQuery(doc, query));
        return results.length;
    }
    /**
     * Synchronize collection
     * @returns {Promise<Object>} Sync result
     */
    async sync() {
        try {
            // Load data from adapter
            const data = await this.adapter.load(this.name);
            // Merge data
            this.data = Array.isArray(data) ? data : [];
            // Save data
            const saveResult = await this._saveData();
            return {
                success: true,
                synced: this.data.length,
                ...saveResult,
            };
        }
        catch (error) {
            this.db.log(`Sync error: ${error.message}`);
            return {
                success: false,
                synced: 0,
                error: error.message,
            };
        }
    }
}
export { Collection };
