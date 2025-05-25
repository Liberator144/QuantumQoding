/**
 * Pushdown Strategy
 *
 * Optimizes projections by pushing them down to the data source.
 *
 * @version 1.0.0
 */

const { createProjectionDescriptor, transformProjection } = require('../ProjectionModel');
const { analyzeProjection } = require('../ProjectionAnalysis');

/**
 * Pushdown Strategy
 */
class PushdownStrategy {
  /**
   * Create a new PushdownStrategy instance
   * @param {Object} options - Strategy options
   */
  constructor(options = {}) {
    this.options = {
      // Whether to verify pushdown capability
      verifyCapability: true,

      // Whether to create a pushdown plan
      createPlan: true,

      // Whether to optimize the pushdown plan
      optimizePlan: true,

      // Merge with provided options
      ...options,
    };
  }

  /**
   * Apply the strategy to a projection
   * @param {Object} projection - Projection to optimize
   * @param {Object} context - Optimization context
   * @returns {Object} Optimized projection
   */
  apply(projection, context = {}) {
    // Create projection descriptor
    const descriptor = createProjectionDescriptor(projection);

    // Analyze projection
    const analysis = analyzeProjection(descriptor, context);

    // Check if pushdown is supported
    if (!this._isPushdownSupported(analysis, context)) {
      return descriptor;
    }

    // Create pushdown plan
    const plan = this._createPushdownPlan(descriptor, analysis, context);

    // If no plan could be created, return the original projection
    if (!plan.success) {
      return descriptor;
    }

    // Execute the pushdown plan
    const result = this._executePushdownPlan(plan, context);

    // If execution failed, return the original projection
    if (!result.success) {
      return descriptor;
    }

    return result.projection;
  }

  /**
   * Check if pushdown is supported
   * @param {Object} analysis - Projection analysis
   * @param {Object} context - Optimization context
   * @returns {boolean} Whether pushdown is supported
   * @private
   */
  _isPushdownSupported(analysis, context) {
    // Check if context indicates pushdown support
    if (!context.supportsProjectionPushdown) {
      return false;
    }

    // Check if data source is available
    if (!context.dataSource) {
      return false;
    }

    // Check if projection is complex enough to benefit from pushdown
    if (analysis.complexity.complexityScore < 5) {
      return false;
    }

    return true;
  }

  /**
   * Create a pushdown plan
   * @param {Object} projection - Projection to optimize
   * @param {Object} analysis - Projection analysis
   * @param {Object} context - Optimization context
   * @returns {Object} Pushdown plan
   * @private
   */
  _createPushdownPlan(projection, analysis, context) {
    // Get data source capabilities
    const capabilities = this._getDataSourceCapabilities(context);

    // If data source doesn't support projection, return failure
    if (!capabilities.supportsProjection) {
      return {
        success: false,
        message: 'Data source does not support projection',
      };
    }

    // Create pushdown plan
    const plan = {
      success: true,
      projection,
      analysis,
      dataSource: context.dataSource,
      capabilities,
      steps: [],
    };

    // Add steps to the plan

    // Step 1: Prepare projection for pushdown
    plan.steps.push({
      type: 'prepare',
      description: 'Prepare projection for pushdown',
      action: proj => this._prepareProjection(proj, capabilities),
    });

    // Step 2: Convert projection to data source format
    plan.steps.push({
      type: 'convert',
      description: 'Convert projection to data source format',
      action: proj => this._convertProjection(proj, capabilities),
    });

    // Step 3: Apply data source specific optimizations
    plan.steps.push({
      type: 'optimize',
      description: 'Apply data source specific optimizations',
      action: proj => this._optimizeForDataSource(proj, capabilities),
    });

    return plan;
  }

  /**
   * Execute a pushdown plan
   * @param {Object} plan - Pushdown plan
   * @param {Object} context - Optimization context
   * @returns {Object} Execution result
   * @private
   */
  _executePushdownPlan(plan, context) {
    try {
      // Execute each step in the plan
      let currentProjection = plan.projection;

      for (const step of plan.steps) {
        currentProjection = step.action(currentProjection);
      }

      // Create result
      return {
        success: true,
        projection: currentProjection,
        plan,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error executing pushdown plan: ${error.message}`,
        error,
        plan,
      };
    }
  }

  /**
   * Get data source capabilities
   * @param {Object} context - Optimization context
   * @returns {Object} Data source capabilities
   * @private
   */
  _getDataSourceCapabilities(context) {
    // If context provides capabilities, use them
    if (context.dataSourceCapabilities) {
      return context.dataSourceCapabilities;
    }

    // If data source provides capabilities, use them
    if (context.dataSource && context.dataSource.getCapabilities) {
      return context.dataSource.getCapabilities();
    }

    // Default capabilities
    return {
      supportsProjection: true,
      supportsInclusion: true,
      supportsExclusion: true,
      supportsNested: false,
      maxProjectionDepth: 1,
      maxProjectionFields: 100,
    };
  }

  /**
   * Prepare projection for pushdown
   * @param {Object} projection - Projection to prepare
   * @param {Object} capabilities - Data source capabilities
   * @returns {Object} Prepared projection
   * @private
   */
  _prepareProjection(projection, capabilities) {
    // Transform projection to match data source capabilities
    return transformProjection(projection, (field, spec) => {
      // Handle nested projections
      if (spec.nested) {
        if (!capabilities.supportsNested) {
          // If nested projections are not supported, flatten
          return {
            include: spec.include,
          };
        } else if (capabilities.maxProjectionDepth === 1) {
          // If only one level of nesting is supported, include the field
          return {
            include: spec.include,
          };
        }
      }

      return spec;
    });
  }

  /**
   * Convert projection to data source format
   * @param {Object} projection - Projection to convert
   * @param {Object} capabilities - Data source capabilities
   * @returns {Object} Converted projection
   * @private
   */
  _convertProjection(projection, capabilities) {
    // Create a new projection with data source format
    const converted = {
      _type: 'ProjectionDescriptor',
      _version: '1.0.0',
      fields: {},
      metadata: {
        ...projection.metadata,
        converted: true,
        convertedAt: Date.now(),
        dataSourceFormat: true,
      },
    };

    // Convert fields based on data source capabilities
    for (const [field, spec] of Object.entries(projection.fields)) {
      if (spec.include) {
        // Include field
        if (capabilities.supportsInclusion) {
          converted.fields[field] = { include: true };
        }
      } else {
        // Exclude field
        if (capabilities.supportsExclusion) {
          converted.fields[field] = { include: false };
        }
      }

      // Handle nested projections
      if (spec.nested && capabilities.supportsNested) {
        converted.fields[field].nested = this._convertProjection(spec.nested, capabilities);
      }
    }

    return converted;
  }

  /**
   * Optimize projection for data source
   * @param {Object} projection - Projection to optimize
   * @param {Object} capabilities - Data source capabilities
   * @returns {Object} Optimized projection
   * @private
   */
  _optimizeForDataSource(projection, capabilities) {
    // Apply data source specific optimizations

    // Limit number of fields if necessary
    if (capabilities.maxProjectionFields) {
      const fieldCount = Object.keys(projection.fields).length;

      if (fieldCount > capabilities.maxProjectionFields) {
        // Too many fields, limit to max
        const optimized = {
          _type: 'ProjectionDescriptor',
          _version: '1.0.0',
          fields: {},
          metadata: {
            ...projection.metadata,
            optimized: true,
            optimizedAt: Date.now(),
            limitedFields: true,
          },
        };

        // Get field priorities
        const priorities = this._getFieldPriorities(projection);

        // Sort fields by priority
        const sortedFields = [...Object.keys(projection.fields)].sort((a, b) => {
          return priorities.get(b) - priorities.get(a);
        });

        // Add fields up to the limit
        for (let i = 0; i < capabilities.maxProjectionFields; i++) {
          const field = sortedFields[i];
          optimized.fields[field] = projection.fields[field];
        }

        return optimized;
      }
    }

    return projection;
  }

  /**
   * Get field priorities
   * @param {Object} projection - Projection
   * @returns {Map} Field priorities
   * @private
   */
  _getFieldPriorities(projection) {
    const priorities = new Map();

    // Set priorities based on field type
    for (const field of Object.keys(projection.fields)) {
      // Start with base priority
      let priority = 0;

      // ID fields have highest priority
      if (field === 'id' || field === '_id' || field.endsWith('Id') || field.endsWith('_id')) {
        priority += 1000;
      }

      // Name fields have high priority
      if (field.includes('name') || field.includes('title')) {
        priority += 800;
      }

      // Status and type fields have high priority
      if (field.includes('status') || field.includes('type')) {
        priority += 700;
      }

      // Date and time fields have high priority
      if (field.includes('date') || field.includes('time')) {
        priority += 600;
      }

      // Count and total fields have medium-high priority
      if (field.includes('count') || field.includes('total')) {
        priority += 500;
      }

      // Description and content fields have medium priority
      if (field.includes('description') || field.includes('content')) {
        priority += 300;
      }

      // Image and file fields have lower priority
      if (field.includes('image') || field.includes('file')) {
        priority += 100;
      }

      // Set priority
      priorities.set(field, priority);
    }

    return priorities;
  }
}

module.exports = { PushdownStrategy };
