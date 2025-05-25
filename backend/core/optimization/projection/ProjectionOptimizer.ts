/**
 * Projection Optimizer
 *
 * Optimizes projections to minimize data retrieval and improve performance.
 *
 * @version 1.0.0
 */

const { createProjectionDescriptor } = require('./ProjectionModel');
const { analyzeProjection } = require('./ProjectionAnalysis');
const {
  OptimizationHistory,
  RollbackMechanism,
  createVerificationFunction,
  verifySemanticEquivalence,
  verifyPerformanceImprovement,
} = require('./ProjectionVerification');

// Import strategies
const { FieldSelectionStrategy } = require('./strategies/FieldSelectionStrategy');
const { PushdownStrategy } = require('./strategies/PushdownStrategy');
const { LazyLoadingStrategy } = require('./strategies/LazyLoadingStrategy');

/**
 * Projection Optimizer
 */
class ProjectionOptimizer {
  /**
   * Create a new ProjectionOptimizer instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Enable field selection optimization
      enableFieldSelection: true,

      // Enable pushdown optimization
      enablePushdown: true,

      // Enable lazy loading optimization
      enableLazyLoading: true,

      // Verify optimizations
      verifyOptimizations: true,

      // Performance improvement threshold (%)
      performanceThreshold: 5,

      // Rollback failed optimizations
      rollbackFailedOptimizations: true,

      // Merge with provided options
      ...options,
    };

    // Strategies
    this.strategies = new Map();

    // History
    this.history = new OptimizationHistory();

    // Rollback mechanism
    this.rollback = new RollbackMechanism();

    // Initialize
    this._init();
  }

  /**
   * Initialize the optimizer
   * @private
   */
  _init() {
    // Register strategies
    this._registerStrategies();

    // Create verification function
    this.verifyFn = createVerificationFunction({
      performanceThreshold: this.config.performanceThreshold,
    });
  }

  /**
   * Register optimization strategies
   * @private
   */
  _registerStrategies() {
    // Register field selection strategy
    if (this.config.enableFieldSelection) {
      this.strategies.set('fieldSelection', new FieldSelectionStrategy());
    }

    // Register pushdown strategy
    if (this.config.enablePushdown) {
      this.strategies.set('pushdown', new PushdownStrategy());
    }

    // Register lazy loading strategy
    if (this.config.enableLazyLoading) {
      this.strategies.set('lazyLoading', new LazyLoadingStrategy());
    }
  }

  /**
   * Optimize a projection
   * @param {Object} projection - Projection to optimize
   * @param {Object} context - Optimization context
   * @returns {Object} Optimized projection
   */
  optimize(projection, context = {}) {
    // Create projection descriptor
    const descriptor = createProjectionDescriptor(projection);

    // Analyze projection
    const analysis = analyzeProjection(descriptor, context);

    // Start optimization
    const optimizationId = this.rollback.startOptimization();

    // Apply strategies
    let optimized = descriptor;
    let sequence = 0;

    for (const [name, strategy] of this.strategies.entries()) {
      try {
        // Apply strategy
        const transformed = strategy.apply(optimized, context);

        // Track step
        const stepId = this.rollback.trackStep(
          optimizationId,
          optimized,
          transformed,
          name,
          context,
          sequence++
        );

        // Verify optimization
        if (this.config.verifyOptimizations) {
          const verificationResult = this.rollback.verifyAndRollback(stepId, this.verifyFn);

          if (!verificationResult.success) {
            this.log(`Optimization ${name} failed verification: ${verificationResult.message}`);
            continue;
          }
        }

        // Update optimized projection
        optimized = transformed;

        this.log(`Applied ${name} optimization`);
      } catch (error) {
        this.log(`Error applying ${name} optimization: ${error.message}`);
      }
    }

    // End optimization
    this.rollback.endOptimization(optimizationId);

    // Add to history
    this.history.add({
      original: descriptor,
      optimized,
      analysis,
      context,
      optimizationId,
    });

    return optimized;
  }

  /**
   * Get optimization history
   * @returns {Array} Optimization history
   */
  getHistory() {
    return this.history.getAll();
  }

  /**
   * Clear optimization history
   */
  clearHistory() {
    this.history.clear();
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[ProjectionOptimizer] ${message}`);
    }
  }
}

module.exports = { ProjectionOptimizer };
