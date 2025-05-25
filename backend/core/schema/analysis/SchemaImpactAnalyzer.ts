/**
 * Schema Impact Analyzer
 *
 * Analyzes the impact of schema changes on existing data.
 *
 * @version 1.0.0
 */

/**
 * Schema Impact Analyzer
 *
 * Analyzes the impact of schema changes on existing data.
 */
class SchemaImpactAnalyzer {
  /**
   * Create a new SchemaImpactAnalyzer instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Schema registry
      schemaRegistry: null,

      // Database instance
      database: null,

      // Batch size for analysis
      batchSize: 100,

      // Maximum documents to analyze
      maxDocuments: 1000,

      // Sampling rate (0-1)
      samplingRate: 1,

      // Merge with provided options
      ...options,
    };

    // Initialize
    this._init();
  }

  /**
   * Initialize the analyzer
   * @private
   */
  _init() {
    this.log('Initializing Schema Impact Analyzer');
    this.log('Schema Impact Analyzer initialized');
  }

  /**
   * Set schema registry reference
   * @param {SchemaRegistry} schemaRegistry - Schema registry instance
   * @returns {SchemaImpactAnalyzer} This instance for chaining
   */
  setSchemaRegistry(schemaRegistry) {
    this.config.schemaRegistry = schemaRegistry;
    this.log('Schema registry reference set');
    return this;
  }

  /**
   * Set database reference
   * @param {UnifiedQuantumDatabase} database - Database instance
   * @returns {SchemaImpactAnalyzer} This instance for chaining
   */
  setDatabase(database) {
    this.config.database = database;
    this.log('Database reference set');
    return this;
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
  async analyzeImpact(collectionName, fromVersion, toVersion, branch = 'main', options = {}) {
    if (!this.config.schemaRegistry) {
      throw new Error('Schema registry not set');
    }

    if (!this.config.database) {
      throw new Error('Database not set');
    }

    // Get schemas
    const fromSchema = await this.config.schemaRegistry.getSchema(
      collectionName,
      fromVersion,
      branch
    );
    const toSchema = await this.config.schemaRegistry.getSchema(collectionName, toVersion, branch);

    if (!fromSchema) {
      throw new Error(`Schema not found: ${collectionName} (${fromVersion})`);
    }

    if (!toSchema) {
      throw new Error(`Schema not found: ${collectionName} (${toVersion})`);
    }

    // Get collection
    const collection = this.config.database.getCollection(collectionName);

    if (!collection) {
      throw new Error(`Collection not found: ${collectionName}`);
    }

    // Find schema differences
    const schemaDiff = this._findSchemaDifferences(fromSchema.schema, toSchema.schema);

    // Analyze impact
    const impactAnalysis = await this._analyzeCollectionImpact(collection, schemaDiff, options);

    return {
      collectionName,
      fromVersion,
      toVersion,
      schemaDiff,
      impactAnalysis,
    };
  }

  /**
   * Find schema differences
   * @param {Object} fromSchema - From schema
   * @param {Object} toSchema - To schema
   * @returns {Object} Schema differences
   * @private
   */
  _findSchemaDifferences(fromSchema, toSchema) {
    const differences = {
      addedFields: [],
      removedFields: [],
      typeChanges: [],
      requiredChanges: {
        added: [],
        removed: [],
      },
    };

    // Compare required fields
    const fromRequired = new Set(fromSchema.required || []);
    const toRequired = new Set(toSchema.required || []);

    // Find added required fields
    for (const field of toRequired) {
      if (!fromRequired.has(field)) {
        differences.requiredChanges.added.push(field);
      }
    }

    // Find removed required fields
    for (const field of fromRequired) {
      if (!toRequired.has(field)) {
        differences.requiredChanges.removed.push(field);
      }
    }

    // Compare properties
    const fromProps = fromSchema.properties || {};
    const toProps = toSchema.properties || {};

    // Find added fields
    for (const field in toProps) {
      if (!fromProps[field]) {
        differences.addedFields.push({
          field,
          type: toProps[field].type,
          required: toRequired.has(field),
        });
      }
    }

    // Find removed fields
    for (const field in fromProps) {
      if (!toProps[field]) {
        differences.removedFields.push({
          field,
          type: fromProps[field].type,
          required: fromRequired.has(field),
        });
      }
    }

    // Find type changes
    for (const field in fromProps) {
      if (toProps[field] && fromProps[field].type !== toProps[field].type) {
        differences.typeChanges.push({
          field,
          fromType: fromProps[field].type,
          toType: toProps[field].type,
          required: toRequired.has(field),
        });
      }
    }

    return differences;
  }

  /**
   * Analyze collection impact
   * @param {Object} collection - Collection
   * @param {Object} schemaDiff - Schema differences
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Impact analysis
   * @private
   */
  async _analyzeCollectionImpact(collection, schemaDiff, options = {}) {
    // Get documents
    const documents = collection.find({});

    // Apply sampling if needed
    let samplesToAnalyze = documents;
    const samplingRate = options.samplingRate || this.config.samplingRate;

    if (samplingRate < 1) {
      samplesToAnalyze = this._sampleDocuments(documents, samplingRate);
    }

    // Limit number of documents to analyze
    const maxDocuments = options.maxDocuments || this.config.maxDocuments;

    if (samplesToAnalyze.length > maxDocuments) {
      samplesToAnalyze = samplesToAnalyze.slice(0, maxDocuments);
    }

    // Initialize impact analysis
    const impactAnalysis = {
      totalDocuments: documents.length,
      analyzedDocuments: samplesToAnalyze.length,
      samplingRate: samplingRate,
      affectedDocuments: 0,
      affectedPercentage: 0,
      fieldImpact: {
        addedFields: {},
        removedFields: {},
        typeChanges: {},
        requiredChanges: {},
      },
      transformations: [],
    };

    // Analyze documents
    for (const document of samplesToAnalyze) {
      const documentImpact = this._analyzeDocumentImpact(document, schemaDiff);

      if (documentImpact.affected) {
        impactAnalysis.affectedDocuments++;

        // Update field impact
        this._updateFieldImpact(impactAnalysis.fieldImpact, documentImpact);

        // Add transformations
        if (documentImpact.transformations.length > 0) {
          impactAnalysis.transformations.push({
            documentId: document.id,
            transformations: documentImpact.transformations,
          });
        }
      }
    }

    // Calculate affected percentage
    if (impactAnalysis.analyzedDocuments > 0) {
      impactAnalysis.affectedPercentage =
        (impactAnalysis.affectedDocuments / impactAnalysis.analyzedDocuments) * 100;
    }

    return impactAnalysis;
  }

  /**
   * Sample documents
   * @param {Array} documents - Documents
   * @param {number} samplingRate - Sampling rate
   * @returns {Array} Sampled documents
   * @private
   */
  _sampleDocuments(documents, samplingRate) {
    if (samplingRate >= 1) {
      return documents;
    }

    const sampleSize = Math.max(1, Math.floor(documents.length * samplingRate));
    const sampled = [];

    // Simple random sampling
    const indices = new Set();

    while (indices.size < sampleSize && indices.size < documents.length) {
      const index = Math.floor(Math.random() * documents.length);
      indices.add(index);
    }

    // Get sampled documents
    for (const index of indices) {
      sampled.push(documents[index]);
    }

    return sampled;
  }

  /**
   * Analyze document impact
   * @param {Object} document - Document
   * @param {Object} schemaDiff - Schema differences
   * @returns {Object} Document impact
   * @private
   */
  _analyzeDocumentImpact(document, schemaDiff) {
    const impact = {
      affected: false,
      addedFields: [],
      removedFields: [],
      typeChanges: [],
      requiredChanges: [],
      transformations: [],
    };

    // Check added fields
    for (const field of schemaDiff.addedFields) {
      if (field.required && !document[field.field]) {
        impact.affected = true;
        impact.addedFields.push(field.field);

        // Add transformation
        impact.transformations.push({
          type: 'add',
          field: field.field,
          reason: 'Required field added',
        });
      }
    }

    // Check removed fields
    for (const field of schemaDiff.removedFields) {
      if (document[field.field] !== undefined) {
        impact.affected = true;
        impact.removedFields.push(field.field);

        // Add transformation
        impact.transformations.push({
          type: 'remove',
          field: field.field,
          reason: 'Field removed from schema',
        });
      }
    }

    // Check type changes
    for (const change of schemaDiff.typeChanges) {
      if (document[change.field] !== undefined) {
        const currentType = this._getValueType(document[change.field]);

        if (currentType !== change.toType) {
          impact.affected = true;
          impact.typeChanges.push(change.field);

          // Add transformation
          impact.transformations.push({
            type: 'transform',
            field: change.field,
            fromType: currentType,
            toType: change.toType,
            reason: 'Field type changed',
          });
        }
      }
    }

    // Check required changes
    for (const field of schemaDiff.requiredChanges.added) {
      if (document[field] === undefined) {
        impact.affected = true;
        impact.requiredChanges.push(field);

        // Add transformation
        impact.transformations.push({
          type: 'add',
          field: field,
          reason: 'Field is now required',
        });
      }
    }

    return impact;
  }

  /**
   * Update field impact
   * @param {Object} fieldImpact - Field impact
   * @param {Object} documentImpact - Document impact
   * @private
   */
  _updateFieldImpact(fieldImpact, documentImpact) {
    // Update added fields
    for (const field of documentImpact.addedFields) {
      fieldImpact.addedFields[field] = (fieldImpact.addedFields[field] || 0) + 1;
    }

    // Update removed fields
    for (const field of documentImpact.removedFields) {
      fieldImpact.removedFields[field] = (fieldImpact.removedFields[field] || 0) + 1;
    }

    // Update type changes
    for (const field of documentImpact.typeChanges) {
      fieldImpact.typeChanges[field] = (fieldImpact.typeChanges[field] || 0) + 1;
    }

    // Update required changes
    for (const field of documentImpact.requiredChanges) {
      fieldImpact.requiredChanges[field] = (fieldImpact.requiredChanges[field] || 0) + 1;
    }
  }

  /**
   * Get value type
   * @param {*} value - Value
   * @returns {string} Type
   * @private
   */
  _getValueType(value) {
    if (value === null) {
      return 'null';
    }

    if (Array.isArray(value)) {
      return 'array';
    }

    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'number';
    }

    return typeof value;
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[SchemaImpactAnalyzer] ${message}`);
    }
  }
}

module.exports = { SchemaImpactAnalyzer };
