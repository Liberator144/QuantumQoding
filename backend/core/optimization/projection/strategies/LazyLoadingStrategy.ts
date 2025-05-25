/**
 * Lazy Loading Strategy
 *
 * Optimizes projections by implementing lazy loading for fields.
 *
 * @version 1.0.0
 */

const { createProjectionDescriptor, transformProjection } = require('../ProjectionModel');
const { analyzeProjection } = require('../ProjectionAnalysis');

/**
 * Lazy Loading Strategy
 */
class LazyLoadingStrategy {
  /**
   * Create a new LazyLoadingStrategy instance
   * @param {Object} options - Strategy options
   */
  constructor(options = {}) {
    this.options = {
      // Maximum number of fields to load eagerly
      eagerLoadLimit: 10,

      // Whether to use field statistics for prioritization
      useFieldStatistics: true,

      // Whether to prioritize ID fields
      prioritizeIdFields: true,

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
    // Check if lazy loading is supported
    if (!this._isLazyLoadingSupported(context)) {
      return projection;
    }

    // Create projection descriptor
    const descriptor = createProjectionDescriptor(projection);

    // Analyze projection
    const analysis = analyzeProjection(descriptor, context);

    // Check if lazy loading is beneficial
    if (!this._isLazyLoadingBeneficial(analysis, context)) {
      return descriptor;
    }

    // Get fields sorted by priority
    const fieldsByPriority = this._getFieldsByPriority(analysis, context);

    // Create eager and lazy field sets
    const eagerFields = new Set(fieldsByPriority.slice(0, this.options.eagerLoadLimit));
    const lazyFields = new Set(fieldsByPriority.slice(this.options.eagerLoadLimit));

    // Create a new projection with lazy loading
    const lazyProjection = transformProjection(descriptor, (field, spec) => {
      if (lazyFields.has(field)) {
        return {
          field,
          value: {
            include: spec.include,
            lazy: true,
            original: spec,
          },
        };
      }

      return spec;
    });

    // Add lazy loading metadata
    lazyProjection.metadata.lazyLoading = {
      enabled: true,
      eagerFields: [...eagerFields],
      lazyFields: [...lazyFields],
      eagerLoadLimit: this.options.eagerLoadLimit,
    };

    return lazyProjection;
  }

  /**
   * Check if lazy loading is supported
   * @param {Object} context - Optimization context
   * @returns {boolean} Whether lazy loading is supported
   * @private
   */
  _isLazyLoadingSupported(context) {
    return context.supportsLazyLoading === true;
  }

  /**
   * Check if lazy loading is beneficial
   * @param {Object} analysis - Projection analysis
   * @param {Object} context - Optimization context
   * @returns {boolean} Whether lazy loading is beneficial
   * @private
   */
  _isLazyLoadingBeneficial(analysis, context) {
    // If there are few fields, lazy loading is not beneficial
    if (analysis.fields.includedCount <= this.options.eagerLoadLimit) {
      return false;
    }

    // If there are many fields, lazy loading is beneficial
    if (analysis.fields.includedCount > this.options.eagerLoadLimit * 2) {
      return true;
    }

    // If field sizes are available, check if lazy loading would save significant data
    if (context.fieldSizes) {
      let totalSize = 0;
      let eagerSize = 0;

      // Calculate total size and eager size
      const fieldsByPriority = this._getFieldsByPriority(analysis, context);
      const eagerFields = fieldsByPriority.slice(0, this.options.eagerLoadLimit);

      for (const field of analysis.fields.includedFields) {
        const fieldSize = context.fieldSizes[field] || 1;
        totalSize += fieldSize;

        if (eagerFields.includes(field)) {
          eagerSize += fieldSize;
        }
      }

      // If eager size is less than 50% of total size, lazy loading is beneficial
      if (eagerSize < totalSize * 0.5) {
        return true;
      }
    }

    // Default to true if there are more fields than the eager load limit
    return analysis.fields.includedCount > this.options.eagerLoadLimit;
  }

  /**
   * Get fields sorted by priority
   * @param {Object} analysis - Projection analysis
   * @param {Object} context - Optimization context
   * @returns {Array} Fields sorted by priority
   * @private
   */
  _getFieldsByPriority(analysis, context) {
    // Get fields
    const fields = analysis.fields.includedFields;

    // Create field priorities
    const priorities = new Map();

    for (const field of fields) {
      // Start with base priority
      let priority = 0;

      // Adjust priority based on field statistics
      if (this.options.useFieldStatistics && context.fieldStatistics) {
        const stats = context.fieldStatistics[field] || {};

        // Higher priority for frequently accessed fields
        if (stats.accessFrequency) {
          priority += stats.accessFrequency * 10;
        }

        // Higher priority for smaller fields
        if (stats.averageSize) {
          priority += 1000 / Math.max(1, stats.averageSize);
        }

        // Higher priority for indexed fields
        if (stats.indexed) {
          priority += 500;
        }
      }

      // Adjust priority based on field name patterns
      if (this.options.prioritizeIdFields) {
        if (field === 'id' || field === '_id' || field.endsWith('Id') || field.endsWith('_id')) {
          priority += 1000; // Very high priority for IDs
        }
      }

      if (field.includes('name') || field.includes('title')) {
        priority += 800; // High priority for names and titles
      }

      if (field.includes('status') || field.includes('type')) {
        priority += 700; // High priority for status and type fields
      }

      if (field.includes('date') || field.includes('time')) {
        priority += 600; // High priority for date and time fields
      }

      if (field.includes('count') || field.includes('total')) {
        priority += 500; // Medium-high priority for count and total fields
      }

      if (field.includes('description') || field.includes('content')) {
        priority += 300; // Medium priority for description and content fields
      }

      if (field.includes('image') || field.includes('file')) {
        priority += 100; // Lower priority for image and file fields
      }

      priorities.set(field, priority);
    }

    // Sort fields by priority (higher priority first)
    return fields.sort((a, b) => priorities.get(b) - priorities.get(a));
  }
}

module.exports = { LazyLoadingStrategy };
