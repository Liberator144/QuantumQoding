/**
 * Schema Merge
 *
 * Handles merging schema branches.
 *
 * @version 1.0.0
 */

/**
 * Schema Merge
 *
 * Handles merging schema branches.
 */
class SchemaMerge {
  /**
   * Create a new SchemaMerge instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Database instance
      database: null,

      // Schema registry
      schemaRegistry: null,

      // Branch manager
      branchManager: null,

      // Merge collection name
      mergeCollection: '_schema_merges',

      // Merge with provided options
      ...options,
    };

    // State
    this.merges = new Map();

    // Initialize
    this._init();
  }

  /**
   * Initialize the merge manager
   * @private
   */
  _init() {
    this.log('Initializing Schema Merge');

    // Set up merge collection if database is provided
    if (this.config.database) {
      this._setupMergeCollection();
    }

    this.log('Schema Merge initialized');
  }

  /**
   * Set up merge collection
   * @private
   */
  _setupMergeCollection() {
    if (!this.config.database) {
      return;
    }

    // Get or create merge collection
    this.config.database.getCollection(this.config.mergeCollection) ||
      this.config.database.createCollection(this.config.mergeCollection);

    this.log(`Merge collection set up: ${this.config.mergeCollection}`);
  }

  /**
   * Set database reference
   * @param {UnifiedQuantumDatabase} database - Database instance
   * @returns {SchemaMerge} This instance for chaining
   */
  setDatabase(database) {
    this.config.database = database;
    this._setupMergeCollection();
    this.log('Database reference set');
    return this;
  }

  /**
   * Set schema registry reference
   * @param {SchemaRegistry} schemaRegistry - Schema registry instance
   * @returns {SchemaMerge} This instance for chaining
   */
  setSchemaRegistry(schemaRegistry) {
    this.config.schemaRegistry = schemaRegistry;
    this.log('Schema registry reference set');
    return this;
  }

  /**
   * Set branch manager reference
   * @param {SchemaBranch} branchManager - Branch manager instance
   * @returns {SchemaMerge} This instance for chaining
   */
  setBranchManager(branchManager) {
    this.config.branchManager = branchManager;
    this.log('Branch manager reference set');
    return this;
  }

  /**
   * Merge a branch into another branch
   * @param {string} sourceBranch - Source branch name
   * @param {string} targetBranch - Target branch name
   * @param {Object} options - Merge options
   * @param {string} options.strategy - Merge strategy ('auto', 'manual', 'theirs', 'ours')
   * @param {Object} options.resolutions - Manual conflict resolutions
   * @returns {Promise<Object>} Merge result
   */
  async mergeBranch(sourceBranch, targetBranch, options = {}) {
    if (!this.config.database) {
      throw new Error('Database not set');
    }

    if (!this.config.schemaRegistry) {
      throw new Error('Schema registry not set');
    }

    if (!this.config.branchManager) {
      throw new Error('Branch manager not set');
    }

    // Validate parameters
    if (!sourceBranch) {
      throw new Error('Source branch is required');
    }

    if (!targetBranch) {
      throw new Error('Target branch is required');
    }

    // Get branches
    const source = await this.config.branchManager.getBranch(sourceBranch);
    const target = await this.config.branchManager.getBranch(targetBranch);

    if (!source) {
      throw new Error(`Source branch not found: ${sourceBranch}`);
    }

    if (!target) {
      throw new Error(`Target branch not found: ${targetBranch}`);
    }

    // Get schemas for both branches
    const sourceSchemas = await this.config.schemaRegistry.getSchemasByBranch(sourceBranch);
    const targetSchemas = await this.config.schemaRegistry.getSchemasByBranch(targetBranch);

    // Find conflicts
    const conflicts = this._findConflicts(sourceSchemas, targetSchemas);

    // Resolve conflicts
    const strategy = options.strategy || 'auto';
    const resolutions = await this._resolveConflicts(conflicts, strategy, options.resolutions);

    // Apply resolutions
    const mergeResult = await this._applyResolutions(resolutions, targetBranch, sourceBranch);

    // Record merge
    const merge = await this._recordMerge(
      sourceBranch,
      targetBranch,
      conflicts,
      resolutions,
      mergeResult
    );

    this.log(`Merged branch ${sourceBranch} into ${targetBranch}`);

    return {
      merge,
      conflicts,
      resolutions,
      result: mergeResult,
    };
  }

  /**
   * Find conflicts between schemas
   * @param {Array} sourceSchemas - Source schemas
   * @param {Array} targetSchemas - Target schemas
   * @returns {Array} Conflicts
   * @private
   */
  _findConflicts(sourceSchemas, targetSchemas) {
    const conflicts = [];

    // Group schemas by collection name
    const sourceByCollection = this._groupByCollection(sourceSchemas);
    const targetByCollection = this._groupByCollection(targetSchemas);

    // Check all collections in source
    for (const [collectionName, sourceVersions] of Object.entries(sourceByCollection)) {
      const targetVersions = targetByCollection[collectionName] || {};

      // Find latest version for each collection
      const latestSource = this._getLatestVersion(sourceVersions);
      const latestTarget = this._getLatestVersion(targetVersions);

      // If target doesn't have this collection, no conflict
      if (!latestTarget) {
        continue;
      }

      // If versions are the same, no conflict
      if (latestSource.version === latestTarget.version) {
        continue;
      }

      // Check for conflicts in properties
      const propertyConflicts = this._findPropertyConflicts(
        latestSource.schema,
        latestTarget.schema
      );

      if (propertyConflicts.length > 0) {
        conflicts.push({
          collectionName,
          sourceVersion: latestSource.version,
          targetVersion: latestTarget.version,
          propertyConflicts,
        });
      }
    }

    return conflicts;
  }

  /**
   * Group schemas by collection name
   * @param {Array} schemas - Schemas
   * @returns {Object} Grouped schemas
   * @private
   */
  _groupByCollection(schemas) {
    const grouped = {};

    for (const schema of schemas) {
      if (!grouped[schema.collectionName]) {
        grouped[schema.collectionName] = {};
      }

      grouped[schema.collectionName][schema.version] = schema;
    }

    return grouped;
  }

  /**
   * Get latest version from a collection's schemas
   * @param {Object} versions - Collection versions
   * @returns {Object} Latest version
   * @private
   */
  _getLatestVersion(versions) {
    let latest = null;
    let latestVersion = '0.0.0';

    for (const [version, schema] of Object.entries(versions)) {
      if (this._compareVersions(version, latestVersion) > 0) {
        latest = schema;
        latestVersion = version;
      }
    }

    return latest;
  }

  /**
   * Compare two semantic versions
   * @param {string} v1 - Version 1
   * @param {string} v2 - Version 2
   * @returns {number} Comparison result (-1, 0, 1)
   * @private
   */
  _compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (parts1[i] > parts2[i]) return 1;
      if (parts1[i] < parts2[i]) return -1;
    }

    return 0;
  }

  /**
   * Find property conflicts between two schemas
   * @param {Object} sourceSchema - Source schema
   * @param {Object} targetSchema - Target schema
   * @returns {Array} Property conflicts
   * @private
   */
  _findPropertyConflicts(sourceSchema, targetSchema) {
    const conflicts = [];

    // Check required properties
    const sourceRequired = new Set(sourceSchema.required || []);
    const targetRequired = new Set(targetSchema.required || []);

    // Check properties
    const sourceProps = sourceSchema.properties || {};
    const targetProps = targetSchema.properties || {};

    // Check all properties in source
    for (const [propName, sourceProp] of Object.entries(sourceProps)) {
      const targetProp = targetProps[propName];

      // If target doesn't have this property, no conflict
      if (!targetProp) {
        continue;
      }

      // Check for type conflicts
      if (sourceProp.type !== targetProp.type) {
        conflicts.push({
          property: propName,
          sourceType: sourceProp.type,
          targetType: targetProp.type,
          conflictType: 'type',
        });
      }

      // Check for required conflicts
      const sourceIsRequired = sourceRequired.has(propName);
      const targetIsRequired = targetRequired.has(propName);

      if (sourceIsRequired !== targetIsRequired) {
        conflicts.push({
          property: propName,
          sourceRequired: sourceIsRequired,
          targetRequired: targetIsRequired,
          conflictType: 'required',
        });
      }
    }

    return conflicts;
  }

  /**
   * Resolve conflicts
   * @param {Array} conflicts - Conflicts
   * @param {string} strategy - Merge strategy
   * @param {Object} manualResolutions - Manual resolutions
   * @returns {Promise<Array>} Resolutions
   * @private
   */
  async _resolveConflicts(conflicts, strategy, manualResolutions = {}) {
    const resolutions = [];

    for (const conflict of conflicts) {
      const collectionResolutions = [];

      for (const propConflict of conflict.propertyConflicts) {
        let resolution;

        // Check for manual resolution
        const manualResolution =
          manualResolutions[`${conflict.collectionName}.${propConflict.property}`];

        if (manualResolution) {
          resolution = manualResolution;
        } else {
          // Apply strategy
          switch (strategy) {
            case 'theirs':
              resolution = {
                property: propConflict.property,
                resolution: 'source',
                conflictType: propConflict.conflictType,
              };
              break;
            case 'ours':
              resolution = {
                property: propConflict.property,
                resolution: 'target',
                conflictType: propConflict.conflictType,
              };
              break;
            case 'auto':
              // For auto, we use some heuristics
              if (propConflict.conflictType === 'required') {
                // For required conflicts, prefer more strict (required)
                resolution = {
                  property: propConflict.property,
                  resolution: propConflict.sourceRequired ? 'source' : 'target',
                  conflictType: propConflict.conflictType,
                };
              } else if (propConflict.conflictType === 'type') {
                // For type conflicts, prefer more specific type
                const sourceSpecificity = this._getTypeSpecificity(propConflict.sourceType);
                const targetSpecificity = this._getTypeSpecificity(propConflict.targetType);

                resolution = {
                  property: propConflict.property,
                  resolution: sourceSpecificity >= targetSpecificity ? 'source' : 'target',
                  conflictType: propConflict.conflictType,
                };
              } else {
                // Default to target
                resolution = {
                  property: propConflict.property,
                  resolution: 'target',
                  conflictType: propConflict.conflictType,
                };
              }
              break;
            case 'manual':
              // For manual, we need explicit resolutions
              throw new Error(
                `Manual resolution required for ${conflict.collectionName}.${propConflict.property}`
              );
            default:
              throw new Error(`Unknown merge strategy: ${strategy}`);
          }
        }

        collectionResolutions.push(resolution);
      }

      resolutions.push({
        collectionName: conflict.collectionName,
        sourceVersion: conflict.sourceVersion,
        targetVersion: conflict.targetVersion,
        resolutions: collectionResolutions,
      });
    }

    return resolutions;
  }

  /**
   * Get type specificity
   * @param {string} type - Type
   * @returns {number} Specificity
   * @private
   */
  _getTypeSpecificity(type) {
    const specificityMap = {
      string: 1,
      number: 1,
      integer: 2,
      boolean: 1,
      array: 1,
      object: 1,
      null: 0,
    };

    return specificityMap[type] || 0;
  }

  /**
   * Apply resolutions
   * @param {Array} resolutions - Resolutions
   * @param {string} targetBranch - Target branch
   * @param {string} sourceBranch - Source branch
   * @returns {Promise<Array>} Applied schemas
   * @private
   */
  async _applyResolutions(resolutions, targetBranch, sourceBranch) {
    const appliedSchemas = [];

    for (const collectionResolution of resolutions) {
      // Get latest schemas
      const sourceSchema = await this.config.schemaRegistry.getSchema(
        collectionResolution.collectionName,
        collectionResolution.sourceVersion,
        sourceBranch
      );

      const targetSchema = await this.config.schemaRegistry.getSchema(
        collectionResolution.collectionName,
        collectionResolution.targetVersion,
        targetBranch
      );

      if (!sourceSchema || !targetSchema) {
        throw new Error(
          `Schema not found for ${collectionResolution.collectionName} (source: ${sourceBranch}/${collectionResolution.sourceVersion}, target: ${targetBranch}/${collectionResolution.targetVersion})`
        );
      }

      // Create merged schema
      const mergedSchema = this._createMergedSchema(
        sourceSchema.schema,
        targetSchema.schema,
        collectionResolution.resolutions
      );

      // Create new version
      const newVersion = this._incrementVersion(collectionResolution.targetVersion);

      // Register new schema
      const newSchema = await this.config.schemaRegistry.registerSchema(
        collectionResolution.collectionName,
        mergedSchema,
        newVersion,
        targetBranch
      );

      appliedSchemas.push(newSchema);
    }

    return appliedSchemas;
  }

  /**
   * Create merged schema
   * @param {Object} sourceSchema - Source schema
   * @param {Object} targetSchema - Target schema
   * @param {Array} resolutions - Resolutions
   * @returns {Object} Merged schema
   * @private
   */
  _createMergedSchema(sourceSchema, targetSchema, resolutions) {
    // Start with target schema
    const mergedSchema = JSON.parse(JSON.stringify(targetSchema));

    // Merge all properties from source schema that don't exist in target
    if (sourceSchema.properties) {
      mergedSchema.properties = mergedSchema.properties || {};

      for (const [propName, propDef] of Object.entries(sourceSchema.properties)) {
        if (!mergedSchema.properties[propName]) {
          mergedSchema.properties[propName] = JSON.parse(JSON.stringify(propDef));
        }
      }
    }

    // Apply resolutions
    for (const resolution of resolutions) {
      const propName = resolution.property;

      if (resolution.resolution === 'source') {
        // Use source property
        if (resolution.conflictType === 'type') {
          mergedSchema.properties[propName].type = sourceSchema.properties[propName].type;
        } else if (resolution.conflictType === 'required') {
          // Update required array
          const required = new Set(mergedSchema.required || []);

          if (sourceSchema.required && sourceSchema.required.includes(propName)) {
            required.add(propName);
          } else {
            required.delete(propName);
          }

          mergedSchema.required = Array.from(required);
        }
      }
    }

    return mergedSchema;
  }

  /**
   * Increment version
   * @param {string} version - Version
   * @returns {string} Incremented version
   * @private
   */
  _incrementVersion(version) {
    const parts = version.split('.').map(Number);
    parts[2] += 1;
    return parts.join('.');
  }

  /**
   * Record merge
   * @param {string} sourceBranch - Source branch
   * @param {string} targetBranch - Target branch
   * @param {Array} conflicts - Conflicts
   * @param {Array} resolutions - Resolutions
   * @param {Array} result - Merge result
   * @returns {Promise<Object>} Recorded merge
   * @private
   */
  async _recordMerge(sourceBranch, targetBranch, conflicts, resolutions, result) {
    if (!this.config.database) {
      return null;
    }

    // Get merge collection
    const mergeCollection = this.config.database.getCollection(this.config.mergeCollection);

    if (!mergeCollection) {
      return null;
    }

    // Create merge record
    const merge = {
      id: `merge-${Date.now()}`,
      sourceBranch,
      targetBranch,
      conflicts,
      resolutions,
      result: result.map(schema => ({
        collectionName: schema.collectionName,
        version: schema.version,
      })),
      createdAt: Date.now(),
    };

    mergeCollection.insert(merge);

    // Update cache
    this._updateMergeCache(merge);

    return merge;
  }

  /**
   * Update merge cache
   * @param {Object} merge - Merge
   * @private
   */
  _updateMergeCache(merge) {
    this.merges.set(merge.id, merge);
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[SchemaMerge] ${message}`);
    }
  }
}

module.exports = { SchemaMerge };
