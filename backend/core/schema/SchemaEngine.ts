/**
 * Schema Engine
 *
 * A comprehensive engine for managing database schemas and their evolution.
 *
 * @version 1.0.0
 */

const { EventEmitter } = require('events');
const { SchemaRegistry } = require('./versioning/SchemaRegistry');
const { MigrationManager } = require('./migration/MigrationManager');
const { MigrationRollback } = require('./migration/MigrationRollback');
const { SchemaBranch } = require('./branching/SchemaBranch');
const { SchemaMerge } = require('./branching/SchemaMerge');
const { SchemaVisualizer } = require('./visualization/SchemaVisualizer');
const { SchemaImpactAnalyzer } = require('./analysis/SchemaImpactAnalyzer');
const { SchemaValidator } = require('./validation/SchemaValidator');

/**
 * Schema Engine
 *
 * Manages database schemas and their evolution.
 */
class SchemaEngine extends EventEmitter {
  /**
   * Create a new SchemaEngine instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Database instance
      database: null,

      // Auto-validation enabled
      autoValidation: true,

      // Auto-migration enabled
      autoMigration: false,

      // Strict mode (reject invalid documents)
      strictMode: false,

      // Default schema version
      defaultVersion: '1.0.0',

      // Schema storage collection
      schemaCollection: '_schemas',

      // Migration storage collection
      migrationCollection: '_migrations',

      // Merge with provided options
      ...options,
    };

    // State
    this.schemas = new Map();
    this.migrations = new Map();

    // Components
    this.schemaRegistry = null;
    this.migrationManager = null;
    this.migrationRollback = null;
    this.branchManager = null;
    this.mergeManager = null;
    this.visualizer = null;
    this.impactAnalyzer = null;
    this.schemaValidator = null;

    // Active branch
    this.activeBranch = 'main';

    // Initialize
    this._init();
  }

  /**
   * Initialize the engine
   * @private
   */
  _init() {
    this.log('Initializing Schema Engine');

    // Create components
    this.schemaRegistry = new SchemaRegistry({
      debugMode: this.config.debugMode,
      database: this.config.database,
      schemaCollection: this.config.schemaCollection,
    });

    this.migrationManager = new MigrationManager({
      debugMode: this.config.debugMode,
      database: this.config.database,
      migrationCollection: this.config.migrationCollection,
    });

    this.migrationRollback = new MigrationRollback({
      debugMode: this.config.debugMode,
      database: this.config.database,
      migrationManager: this.migrationManager,
    });

    this.branchManager = new SchemaBranch({
      debugMode: this.config.debugMode,
      database: this.config.database,
      defaultBranch: 'main',
    });

    this.mergeManager = new SchemaMerge({
      debugMode: this.config.debugMode,
      database: this.config.database,
      schemaRegistry: this.schemaRegistry,
      branchManager: this.branchManager,
    });

    this.visualizer = new SchemaVisualizer({
      debugMode: this.config.debugMode,
      schemaRegistry: this.schemaRegistry,
      branchManager: this.branchManager,
    });

    this.impactAnalyzer = new SchemaImpactAnalyzer({
      debugMode: this.config.debugMode,
      schemaRegistry: this.schemaRegistry,
      database: this.config.database,
    });

    this.schemaValidator = new SchemaValidator({
      debugMode: this.config.debugMode,
      strictMode: this.config.strictMode,
    });

    // Set up database listeners if database is provided
    if (this.config.database) {
      this._setupDatabaseListeners();
    }

    this.log('Schema Engine initialized');
  }

  /**
   * Set up database listeners
   * @private
   */
  _setupDatabaseListeners() {
    if (!this.config.database) {
      return;
    }

    // Listen for document insertion
    this.config.database.on('beforeInsert', event => {
      if (this.config.autoValidation) {
        this._validateDocument(event);
      }
    });

    // Listen for document update
    this.config.database.on('beforeUpdate', event => {
      if (this.config.autoValidation) {
        this._validateDocument(event);
      }
    });

    // Listen for collection creation
    this.config.database.on('collection-created', collection => {
      this._handleCollectionCreated(collection);
    });

    // Set up schemas for existing collections
    const collections = this.config.database.getCollections();

    for (const collection of collections) {
      this._loadCollectionSchema(collection.name);
    }

    this.log(`Set up listeners for ${collections.length} collections`);
  }

  /**
   * Set database reference
   * @param {UnifiedQuantumDatabase} database - Database instance
   * @returns {SchemaEngine} This instance for chaining
   */
  setDatabase(database) {
    this.config.database = database;

    // Update components
    this.schemaRegistry.setDatabase(database);
    this.migrationManager.setDatabase(database);
    this.migrationRollback.setDatabase(database);
    this.branchManager.setDatabase(database);
    this.mergeManager.setDatabase(database);
    this.impactAnalyzer.setDatabase(database);

    // Update visualizer references
    this.visualizer.setSchemaRegistry(this.schemaRegistry);
    this.visualizer.setBranchManager(this.branchManager);

    // Update impact analyzer references
    this.impactAnalyzer.setSchemaRegistry(this.schemaRegistry);

    // Set up database listeners
    this._setupDatabaseListeners();

    this.log('Database reference set');
    return this;
  }

  /**
   * Handle collection created event
   * @param {Object} collection - Collection
   * @private
   */
  _handleCollectionCreated(collection) {
    // Load collection schema
    this._loadCollectionSchema(collection.name);
  }

  /**
   * Load collection schema
   * @param {string} collectionName - Collection name
   * @private
   */
  async _loadCollectionSchema(collectionName) {
    try {
      // Skip internal collections
      if (collectionName.startsWith('_')) {
        return;
      }

      // Load schema from registry
      const schema = await this.schemaRegistry.getSchema(collectionName);

      if (schema) {
        // Add to schemas
        this.schemas.set(collectionName, schema);

        this.log(`Loaded schema for collection: ${collectionName} (version ${schema.version})`);
      } else {
        this.log(`No schema found for collection: ${collectionName}`);
      }
    } catch (error) {
      this.log(`Error loading schema for collection ${collectionName}: ${error.message}`);
      this.emit('error', error);
    }
  }

  /**
   * Validate document
   * @param {Object} event - Event
   * @private
   */
  _validateDocument(event) {
    // Get collection name
    const collectionName = event.collection;

    // Skip internal collections
    if (collectionName.startsWith('_')) {
      return;
    }

    // Get schema
    const schema = this.schemas.get(collectionName);

    if (!schema) {
      return;
    }

    // Get document
    const document = event.document;

    if (!document) {
      return;
    }

    try {
      // Validate document
      const result = this.schemaValidator.validate(document, schema);

      if (!result.valid) {
        // Handle validation error
        if (this.config.strictMode) {
          // Reject document
          event.cancel = true;
          event.error = new Error(`Validation failed: ${result.errors.join(', ')}`);
        }

        // Emit event
        this.emit('validation-failed', {
          collectionName,
          document,
          errors: result.errors,
        });
      }
    } catch (error) {
      this.log(`Error validating document: ${error.message}`);
      this.emit('error', error);
    }
  }

  /**
   * Define a schema
   * @param {string} collectionName - Collection name
   * @param {Object} schema - Schema definition
   * @param {string} version - Schema version
   * @param {string} branch - Branch name (optional)
   * @returns {Promise<Object>} Schema
   */
  async defineSchema(collectionName, schema, version, branch = this.activeBranch) {
    // Use default version if not specified
    version = version || this.config.defaultVersion;
    try {
      // Register schema
      const registeredSchema = await this.schemaRegistry.registerSchema(
        collectionName,
        schema,
        version,
        branch
      );

      // Add to schemas
      const cacheKey = `${collectionName}-${branch}`;
      this.schemas.set(cacheKey, registeredSchema.schema);

      this.log(
        `Defined schema for collection: ${collectionName} (version ${version}) in branch ${branch}`
      );
      this.emit('schema-defined', { collectionName, version, branch });

      return registeredSchema;
    } catch (error) {
      this.log(`Error defining schema: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get a schema
   * @param {string} collectionName - Collection name
   * @param {string} version - Schema version
   * @param {string} branch - Branch name (optional)
   * @returns {Promise<Object>} Schema
   */
  async getSchema(collectionName, version, branch = this.activeBranch) {
    try {
      // Get from registry
      const schema = await this.schemaRegistry.getSchema(collectionName, version, branch);

      if (!schema) {
        return null;
      }

      // Update cache
      const cacheKey = `${collectionName}-${branch}`;
      this.schemas.set(cacheKey, schema);

      return schema;
    } catch (error) {
      this.log(`Error getting schema: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Define a migration
   * @param {string} collectionName - Collection name
   * @param {string} fromVersion - From version
   * @param {string} toVersion - To version
   * @param {Function} migrationFn - Migration function
   * @returns {Promise<Object>} Migration
   */
  async defineMigration(collectionName, fromVersion, toVersion, migrationFn) {
    try {
      // Create migration
      const migration = {
        collectionName,
        fromVersion,
        toVersion,
        createdAt: Date.now(),
      };

      // Register migration
      await this.migrationManager.registerMigration(
        collectionName,
        fromVersion,
        toVersion,
        migrationFn
      );

      // Add to migrations
      if (!this.migrations.has(collectionName)) {
        this.migrations.set(collectionName, new Map());
      }

      const collectionMigrations = this.migrations.get(collectionName);
      collectionMigrations.set(`${fromVersion}-${toVersion}`, migration);

      this.log(
        `Defined migration for collection: ${collectionName} (${fromVersion} -> ${toVersion})`
      );
      this.emit('migration-defined', { collectionName, fromVersion, toVersion });

      return migration;
    } catch (error) {
      this.log(`Error defining migration: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Define a rollback function for a migration
   * @param {string} collectionName - Collection name
   * @param {string} fromVersion - From version
   * @param {string} toVersion - To version
   * @param {Function} rollbackFn - Rollback function
   * @returns {Promise<Object>} Rollback
   */
  async defineRollback(collectionName, fromVersion, toVersion, rollbackFn) {
    try {
      // Register rollback
      const rollback = await this.migrationRollback.registerRollback(
        collectionName,
        fromVersion,
        toVersion,
        rollbackFn
      );

      this.log(
        `Defined rollback for collection: ${collectionName} (${fromVersion} -> ${toVersion})`
      );
      this.emit('rollback-defined', { collectionName, fromVersion, toVersion });

      return rollback;
    } catch (error) {
      this.log(`Error defining rollback: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Migrate a collection
   * @param {string} collectionName - Collection name
   * @param {string} toVersion - Target version
   * @param {Object} options - Migration options
   * @returns {Promise<Object>} Migration result
   */
  async migrateCollection(collectionName, toVersion, options = {}) {
    try {
      // Get collection
      const collection = this.config.database.getCollection(collectionName);

      if (!collection) {
        throw new Error(`Collection not found: ${collectionName}`);
      }

      // Get current schema
      const currentSchema = this.schemas.get(collectionName);
      const fromVersion = currentSchema ? currentSchema.version : '0.0.0';

      // Skip if already at target version
      if (fromVersion === toVersion) {
        return {
          success: true,
          collectionName,
          fromVersion,
          toVersion,
          documentsProcessed: 0,
          documentsUpdated: 0,
          message: 'Already at target version',
        };
      }

      // Migrate
      const result = await this.migrationManager.migrateCollection(
        collection,
        fromVersion,
        toVersion,
        options
      );

      // Update schema
      if (result.success) {
        // Get new schema
        const newSchema = await this.getSchema(collectionName, toVersion);

        if (newSchema) {
          // Update cache
          this.schemas.set(collectionName, newSchema);
        }
      }

      this.log(`Migrated collection: ${collectionName} (${fromVersion} -> ${toVersion})`);
      this.emit('collection-migrated', result);

      return result;
    } catch (error) {
      this.log(`Error migrating collection: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Rollback a migration
   * @param {string} collectionName - Collection name
   * @param {string} fromVersion - From version
   * @param {string} toVersion - To version
   * @param {Object} options - Rollback options
   * @returns {Promise<Object>} Rollback result
   */
  async rollbackMigration(collectionName, fromVersion, toVersion, options = {}) {
    try {
      // Get collection
      const collection = this.config.database.getCollection(collectionName);

      if (!collection) {
        throw new Error(`Collection not found: ${collectionName}`);
      }

      // Rollback migration
      const result = await this.migrationRollback.rollbackMigration(
        collection,
        fromVersion,
        toVersion,
        options
      );

      // Update schema
      if (result.success) {
        // Get old schema
        const oldSchema = await this.getSchema(collectionName, fromVersion);

        if (oldSchema) {
          // Update cache
          this.schemas.set(collectionName, oldSchema);
        }
      }

      this.log(`Rolled back migration: ${collectionName} (${toVersion} -> ${fromVersion})`);
      this.emit('migration-rolled-back', result);

      return result;
    } catch (error) {
      this.log(`Error rolling back migration: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Create a new branch
   * @param {string} name - Branch name
   * @param {Object} options - Branch options
   * @returns {Promise<Object>} Created branch
   */
  async createBranch(name, options = {}) {
    try {
      const branch = await this.branchManager.createBranch(name, options);

      this.log(`Created branch: ${name}`);
      this.emit('branch-created', { name, options });

      return branch;
    } catch (error) {
      this.log(`Error creating branch: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get a branch
   * @param {string} name - Branch name
   * @returns {Promise<Object>} Branch
   */
  async getBranch(name) {
    try {
      return await this.branchManager.getBranch(name);
    } catch (error) {
      this.log(`Error getting branch: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get all branches
   * @returns {Promise<Array>} Branches
   */
  async getBranches() {
    try {
      return await this.branchManager.getBranches();
    } catch (error) {
      this.log(`Error getting branches: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Set active branch
   * @param {string} name - Branch name
   * @returns {Promise<Object>} Active branch
   */
  async setActiveBranch(name) {
    try {
      const branch = await this.branchManager.setActiveBranch(name);
      this.activeBranch = name;

      this.log(`Set active branch: ${name}`);
      this.emit('branch-activated', { name });

      return branch;
    } catch (error) {
      this.log(`Error setting active branch: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get active branch
   * @returns {Promise<Object>} Active branch
   */
  async getActiveBranch() {
    try {
      return await this.branchManager.getActiveBranch();
    } catch (error) {
      this.log(`Error getting active branch: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Merge a branch into another branch
   * @param {string} sourceBranch - Source branch name
   * @param {string} targetBranch - Target branch name
   * @param {Object} options - Merge options
   * @returns {Promise<Object>} Merge result
   */
  async mergeBranch(sourceBranch, targetBranch, options = {}) {
    try {
      const result = await this.mergeManager.mergeBranch(sourceBranch, targetBranch, options);

      this.log(`Merged branch ${sourceBranch} into ${targetBranch}`);
      this.emit('branch-merged', { sourceBranch, targetBranch, options });

      return result;
    } catch (error) {
      this.log(`Error merging branch: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Validate a document
   * @param {string} collectionName - Collection name
   * @param {Object} document - Document to validate
   * @param {string} branch - Branch name (optional)
   * @returns {Object} Validation result
   */
  validateDocument(collectionName, document, branch = this.activeBranch) {
    // Get schema
    const cacheKey = `${collectionName}-${branch}`;
    const schema = this.schemas.get(cacheKey);

    if (!schema) {
      return {
        valid: true,
        errors: [],
      };
    }

    // Validate document
    return this.schemaValidator.validate(document, schema);
  }

  /**
   * Visualize a schema
   * @param {string} collectionName - Collection name
   * @param {string} version - Schema version (optional)
   * @param {string} branch - Branch name (optional)
   * @returns {Promise<string>} Schema visualization
   */
  async visualizeSchema(collectionName, version, branch = this.activeBranch) {
    try {
      // Get schema
      const schema = await this.getSchema(collectionName, version, branch);

      if (!schema) {
        const versionText = version ? ` (${version})` : '';
        throw new Error(`Schema not found: ${collectionName}${versionText}`);
      }

      // Visualize schema
      const visualization = this.visualizer.visualizeSchemaAsText(schema);

      const versionText = version ? ` (${version})` : '';
      this.log(`Visualized schema: ${collectionName}${versionText}`);

      return visualization;
    } catch (error) {
      this.log(`Error visualizing schema: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Visualize schema differences
   * @param {string} collectionName - Collection name
   * @param {string} fromVersion - From version
   * @param {string} toVersion - To version
   * @param {string} branch - Branch name (optional)
   * @returns {Promise<string>} Schema differences visualization
   */
  async visualizeSchemaDiff(collectionName, fromVersion, toVersion, branch = this.activeBranch) {
    try {
      // Visualize schema differences
      const visualization = await this.visualizer.visualizeSchemaDiff(
        collectionName,
        fromVersion,
        toVersion,
        branch
      );

      this.log(`Visualized schema diff: ${collectionName} (${fromVersion} -> ${toVersion})`);

      return visualization;
    } catch (error) {
      this.log(`Error visualizing schema diff: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Visualize branch relationships
   * @returns {Promise<string>} Branch relationships visualization
   */
  async visualizeBranches() {
    try {
      // Visualize branch relationships
      const visualization = await this.visualizer.visualizeBranches();

      this.log('Visualized branch relationships');

      return visualization;
    } catch (error) {
      this.log(`Error visualizing branches: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Analyze impact of schema changes
   * @param {string} collectionName - Collection name
   * @param {string} fromVersion - From version
   * @param {string} toVersion - To version
   * @param {string} branch - Branch name (optional)
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Impact analysis
   */
  async analyzeSchemaImpact(
    collectionName,
    fromVersion,
    toVersion,
    branch = this.activeBranch,
    options = {}
  ) {
    try {
      // Analyze impact
      const analysis = await this.impactAnalyzer.analyzeImpact(
        collectionName,
        fromVersion,
        toVersion,
        branch,
        options
      );

      this.log(`Analyzed schema impact: ${collectionName} (${fromVersion} -> ${toVersion})`);
      this.emit('schema-impact-analyzed', { collectionName, fromVersion, toVersion, branch });

      return analysis;
    } catch (error) {
      this.log(`Error analyzing schema impact: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Generate migration plan based on impact analysis
   * @param {Object} impactAnalysis - Impact analysis
   * @returns {Object} Migration plan
   */
  generateMigrationPlan(impactAnalysis) {
    try {
      const plan = {
        collectionName: impactAnalysis.collectionName,
        fromVersion: impactAnalysis.fromVersion,
        toVersion: impactAnalysis.toVersion,
        totalDocuments: impactAnalysis.impactAnalysis.totalDocuments,
        affectedDocuments: impactAnalysis.impactAnalysis.affectedDocuments,
        affectedPercentage: impactAnalysis.impactAnalysis.affectedPercentage,
        steps: [],
      };

      // Generate steps for added fields
      const addedFields = impactAnalysis.schemaDiff.addedFields.filter(field => field.required);

      if (addedFields.length > 0) {
        plan.steps.push({
          type: 'add_required_fields',
          fields: addedFields.map(field => field.field),
          affectedDocuments: this._countAffectedDocuments(
            impactAnalysis.impactAnalysis.fieldImpact.addedFields
          ),
          description: `Add required fields: ${addedFields.map(field => field.field).join(', ')}`,
        });
      }

      // Generate steps for type changes
      const typeChanges = impactAnalysis.schemaDiff.typeChanges;

      if (typeChanges.length > 0) {
        plan.steps.push({
          type: 'transform_field_types',
          fields: typeChanges.map(change => ({
            field: change.field,
            fromType: change.fromType,
            toType: change.toType,
          })),
          affectedDocuments: this._countAffectedDocuments(
            impactAnalysis.impactAnalysis.fieldImpact.typeChanges
          ),
          description: `Transform field types: ${typeChanges.map(change => `${change.field} (${change.fromType} -> ${change.toType})`).join(', ')}`,
        });
      }

      // Generate steps for removed fields
      const removedFields = impactAnalysis.schemaDiff.removedFields;

      if (removedFields.length > 0) {
        plan.steps.push({
          type: 'remove_fields',
          fields: removedFields.map(field => field.field),
          affectedDocuments: this._countAffectedDocuments(
            impactAnalysis.impactAnalysis.fieldImpact.removedFields
          ),
          description: `Remove fields: ${removedFields.map(field => field.field).join(', ')}`,
        });
      }

      this.log(
        `Generated migration plan: ${impactAnalysis.collectionName} (${impactAnalysis.fromVersion} -> ${impactAnalysis.toVersion})`
      );

      return plan;
    } catch (error) {
      this.log(`Error generating migration plan: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Count affected documents
   * @param {Object} fieldImpact - Field impact
   * @returns {number} Affected documents
   * @private
   */
  _countAffectedDocuments(fieldImpact) {
    let count = 0;

    for (const field in fieldImpact) {
      count += fieldImpact[field];
    }

    return count;
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[SchemaEngine] ${message}`);
    }
  }

  /**
   * Evolves data from an old schema version to a new one by applying migration functions.
   * @param {Object} data - The data to evolve.
   * @param {Object} oldSchema - The schema the data currently conforms to.
   * @param {Object} newSchema - The target schema version.
   * @returns {Object} The evolved data.
   */
  async evolve(data, oldSchema, newSchema) {
    let evolvedData = { ...data };

    if (!oldSchema || !newSchema || !oldSchema.version || !newSchema.version) {
      console.warn('Invalid schemas provided for evolution. Returning original data.');
      return evolvedData; // Return original data if schemas are invalid
    }

    // Get the migration path from the old version to the new version
    const migrationPath = await this.schemaRegistry.getMigrationPath(
      oldSchema.collectionName,
      oldSchema.version,
      newSchema.version
    );

    if (!migrationPath || migrationPath.length === 0) {
      console.warn(
        `No migration path found from ${oldSchema.version} to ${newSchema.version}. Returning original data.`
      );
      return evolvedData; // Return original data if no migration path is found
    }

    // Apply migration functions sequentially
    for (const migration of migrationPath) {
      if (migration.transform) {
        try {
          // Apply the transform function to the data
          evolvedData = await migration.transform(evolvedData);
        } catch (error) {
          console.error(
            `Error applying migration from ${migration.fromVersion} to ${migration.toVersion}: ${error.message}`
          );
          throw new Error(`Migration failed: ${error.message}`);
        }
      }
    }

    // After applying migrations, ensure the data conforms to the new schema structure
    // (This part can leverage the basic field addition/removal logic if needed,
    // but the primary transformation is done by the migration functions)

    // Add new fields with defaults that might not have been handled by migration functions
    for (const key in newSchema.properties) {
      const newProperty = newSchema.properties[key];
      if (evolvedData[key] === undefined && newProperty.hasOwnProperty('default')) {
        evolvedData[key] = newProperty.default;
      }
    }

    // Remove fields not in new schema (after potential renames by migration functions)
    const newSchemaKeys = Object.keys(newSchema.properties);
    for (const key in evolvedData) {
      // Check if the key exists in the new schema properties
      if (!newSchemaKeys.includes(key)) {
        delete evolvedData[key];
      }
    }

    return evolvedData;
  }
}

module.exports = { SchemaEngine };
