/**
 * Schema Registry
 *
 * Manages schema versioning and storage.
 *
 * @version 1.0.0
 */

/**
 * Schema Registry
 *
 * Manages schema versioning and storage.
 */
class SchemaRegistry {
  /**
   * Create a new SchemaRegistry instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Database instance
      database: null,

      // Schema collection name
      schemaCollection: '_schemas',

      // Merge with provided options
      ...options,
    };

    // State
    this.schemaCache = new Map();

    // Initialize
    this._init();
  }

  /**
   * Initialize the registry
   * @private
   */
  _init() {
    this.log('Initializing Schema Registry');

    // Set up schema collection if database is provided
    if (this.config.database) {
      this._setupSchemaCollection();
    }

    this.log('Schema Registry initialized');
  }

  /**
   * Set up schema collection
   * @private
   */
  _setupSchemaCollection() {
    if (!this.config.database) {
      return;
    }

    // Get or create schema collection
    const schemaCollection =
      this.config.database.getCollection(this.config.schemaCollection) ||
      this.config.database.createCollection(this.config.schemaCollection);

    this.log(`Schema collection set up: ${this.config.schemaCollection}`);
  }

  /**
   * Set database reference
   * @param {UnifiedQuantumDatabase} database - Database instance
   * @returns {SchemaRegistry} This instance for chaining
   */
  setDatabase(database) {
    this.config.database = database;
    this._setupSchemaCollection();
    this.log('Database reference set');
    return this;
  }

  /**
   * Register a schema
   * @param {string} collectionName - Collection name
   * @param {Object} schema - Schema definition
   * @param {string} version - Schema version
   * @param {string} branch - Branch name (optional)
   * @returns {Promise<Object>} Registered schema
   */
  async registerSchema(collectionName, schema, version, branch = 'main') {
    if (!this.config.database) {
      throw new Error('Database not set');
    }

    // Validate parameters
    if (!collectionName) {
      throw new Error('Collection name is required');
    }

    if (!schema) {
      throw new Error('Schema is required');
    }

    if (!version) {
      throw new Error('Version is required');
    }

    // Get schema collection
    const schemaCollection = this.config.database.getCollection(this.config.schemaCollection);

    if (!schemaCollection) {
      throw new Error(`Schema collection not found: ${this.config.schemaCollection}`);
    }

    // Check if schema already exists in this branch
    const existingSchema = await this.getSchema(collectionName, version, branch);

    if (existingSchema) {
      // Update existing schema
      const updatedSchema = {
        ...existingSchema,
        schema,
        updatedAt: Date.now(),
      };

      schemaCollection.update(existingSchema.id, updatedSchema);

      // Update cache
      this._updateSchemaCache(updatedSchema);

      this.log(`Updated schema: ${collectionName} (version ${version}) in branch ${branch}`);

      return updatedSchema;
    } else {
      // Create new schema
      const newSchema = {
        id: `schema-${collectionName}-${version}-${branch}`,
        collectionName,
        version,
        branch,
        schema,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      schemaCollection.insert(newSchema);

      // Update cache
      this._updateSchemaCache(newSchema);

      this.log(`Registered schema: ${collectionName} (version ${version}) in branch ${branch}`);

      return newSchema;
    }
  }

  /**
   * Register a schema object
   * @param {Object} schema - Schema object
   * @param {string} branch - Branch name (optional)
   * @returns {Promise<Object>} Registered schema
   */
  async registerSchemaObject(schema, branch = 'main') {
    if (!schema.collectionName) {
      throw new Error('Schema must have a collection name');
    }

    if (!schema.schema) {
      throw new Error('Schema must have a schema definition');
    }

    if (!schema.version) {
      throw new Error('Schema must have a version');
    }

    return this.registerSchema(schema.collectionName, schema.schema, schema.version, branch);
  }

  /**
   * Get a schema
   * @param {string} collectionName - Collection name
   * @param {string} version - Schema version (optional)
   * @param {string} branch - Branch name (optional)
   * @returns {Promise<Object>} Schema
   */
  async getSchema(collectionName, version, branch = 'main') {
    // Check cache first
    const cacheKey = version
      ? `${collectionName}-${version}-${branch}`
      : `${collectionName}-${branch}`;

    if (this.schemaCache.has(cacheKey)) {
      return this.schemaCache.get(cacheKey);
    }

    if (!this.config.database) {
      return null;
    }

    // Get schema collection
    const schemaCollection = this.config.database.getCollection(this.config.schemaCollection);

    if (!schemaCollection) {
      return null;
    }

    // Find schema
    let schema;

    if (version) {
      // Find specific version in specific branch
      schema = schemaCollection.findOne({
        collectionName,
        version,
        branch,
      });
    } else {
      // Find latest version in specific branch
      const schemas = schemaCollection.find(
        { collectionName, branch },
        { sort: { version: -1 }, limit: 1 }
      );

      schema = schemas.length > 0 ? schemas[0] : null;
    }

    if (schema) {
      // Update cache
      this._updateSchemaCache(schema);
    }

    return schema;
  }

  /**
   * Get all schemas for a collection
   * @param {string} collectionName - Collection name
   * @param {string} branch - Branch name (optional)
   * @returns {Promise<Array>} Schemas
   */
  async getSchemas(collectionName, branch = 'main') {
    if (!this.config.database) {
      return [];
    }

    // Get schema collection
    const schemaCollection = this.config.database.getCollection(this.config.schemaCollection);

    if (!schemaCollection) {
      return [];
    }

    // Find schemas
    const schemas = schemaCollection.find({ collectionName, branch }, { sort: { version: -1 } });

    // Update cache
    for (const schema of schemas) {
      this._updateSchemaCache(schema);
    }

    return schemas;
  }

  /**
   * Get all schemas for a branch
   * @param {string} branch - Branch name
   * @returns {Promise<Array>} Schemas
   */
  async getSchemasByBranch(branch = 'main') {
    if (!this.config.database) {
      return [];
    }

    // Get schema collection
    const schemaCollection = this.config.database.getCollection(this.config.schemaCollection);

    if (!schemaCollection) {
      return [];
    }

    // Find schemas
    const schemas = schemaCollection.find({ branch }, { sort: { collectionName: 1, version: -1 } });

    // Update cache
    for (const schema of schemas) {
      this._updateSchemaCache(schema);
    }

    return schemas;
  }

  /**
   * Delete a schema
   * @param {string} collectionName - Collection name
   * @param {string} version - Schema version
   * @param {string} branch - Branch name (optional)
   * @returns {Promise<boolean>} Success
   */
  async deleteSchema(collectionName, version, branch = 'main') {
    if (!this.config.database) {
      return false;
    }

    // Get schema collection
    const schemaCollection = this.config.database.getCollection(this.config.schemaCollection);

    if (!schemaCollection) {
      return false;
    }

    // Find schema
    const schema = await this.getSchema(collectionName, version, branch);

    if (!schema) {
      return false;
    }

    // Delete schema
    schemaCollection.remove(schema.id);

    // Remove from cache
    this._removeSchemaFromCache(collectionName, version, branch);

    this.log(`Deleted schema: ${collectionName} (version ${version}) from branch ${branch}`);

    return true;
  }

  /**
   * Update schema cache
   * @param {Object} schema - Schema
   * @private
   */
  _updateSchemaCache(schema) {
    const branch = schema.branch || 'main';

    // Cache by collection, version and branch
    this.schemaCache.set(`${schema.collectionName}-${schema.version}-${branch}`, schema);

    // Cache latest version by collection and branch
    const branchKey = `${schema.collectionName}-${branch}`;
    const latestSchema = this.schemaCache.get(branchKey);

    if (!latestSchema || this._compareVersions(schema.version, latestSchema.version) > 0) {
      this.schemaCache.set(branchKey, schema);
    }
  }

  /**
   * Remove schema from cache
   * @param {string} collectionName - Collection name
   * @param {string} version - Schema version
   * @param {string} branch - Branch name (optional)
   * @private
   */
  _removeSchemaFromCache(collectionName, version, branch = 'main') {
    // Remove by collection, version and branch
    this.schemaCache.delete(`${collectionName}-${version}-${branch}`);

    // Check if it was the latest version for this branch
    const branchKey = `${collectionName}-${branch}`;
    const latestSchema = this.schemaCache.get(branchKey);

    if (latestSchema && latestSchema.version === version) {
      // Find new latest version
      this.getSchema(collectionName, null, branch).catch(() => {
        // If error, remove from cache
        this.schemaCache.delete(branchKey);
      });
    }
  }

  /**
   * Compare versions
   * @param {string} version1 - Version 1
   * @param {string} version2 - Version 2
   * @returns {number} Comparison result (-1, 0, 1)
   * @private
   */
  _compareVersions(version1, version2) {
    const parts1 = version1.split('.').map(Number);
    const parts2 = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = i < parts1.length ? parts1[i] : 0;
      const part2 = i < parts2.length ? parts2[i] : 0;

      if (part1 < part2) {
        return -1;
      }

      if (part1 > part2) {
        return 1;
      }
    }

    return 0;
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[SchemaRegistry] ${message}`);
    }
  }
}

module.exports = { SchemaRegistry };
