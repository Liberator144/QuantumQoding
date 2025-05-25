/**
 * Optimization Module
 *
 * Provides optimization utilities for the Unified Quantum Database.
 *
 * @version 1.0.0
 */

// Projection optimization
const { ProjectionOptimizer } = require('./projection/ProjectionOptimizer');
const {
  createProjectionDescriptor,
  normalizeProjection,
  transformProjection,
  toMongoProjection,
} = require('./projection/ProjectionModel');
const { analyzeProjection, estimateProjectionCost } = require('./projection/ProjectionAnalysis');
const {
  OptimizationHistory,
  RollbackMechanism,
  createVerificationFunction,
  verifySemanticEquivalence,
  verifyPerformanceImprovement,
} = require('./projection/ProjectionVerification');

// Strategies
const { FieldSelectionStrategy } = require('./projection/strategies/FieldSelectionStrategy');
const { PushdownStrategy } = require('./projection/strategies/PushdownStrategy');
const { LazyLoadingStrategy } = require('./projection/strategies/LazyLoadingStrategy');

// Query optimization
const { QueryOptimizer } = require('./query/QueryOptimizer');
const { PlanOptimizer } = require('./query/PlanOptimizer');

// Cost models
const cost = require('./cost');

/**
 * Optimize a query
 * @param {Object} query - Query to optimize
 * @param {Object} options - Optimization options
 * @returns {Promise<Object>} Optimized query
 */
async function optimizeQuery(query, options = {}) {
  const queryOptimizer = new QueryOptimizer(options);
  return queryOptimizer.optimizeQuery(query, options);
}

/**
 * Optimize an execution plan
 * @param {Object} plan - Execution plan to optimize
 * @param {Object} options - Optimization options
 * @returns {Promise<Object>} Optimized plan
 */
async function optimizePlan(plan, options = {}) {
  const planOptimizer = new PlanOptimizer(options);
  return planOptimizer.optimizePlan(plan, options);
}

// Export all components
module.exports = {
  // Query optimization
  optimizeQuery,
  optimizePlan,
  QueryOptimizer,
  PlanOptimizer,

  // Projection optimization
  ProjectionOptimizer,

  // Projection model
  createProjectionDescriptor,
  normalizeProjection,
  transformProjection,
  toMongoProjection,

  // Projection analysis
  analyzeProjection,
  estimateProjectionCost,

  // Projection verification
  OptimizationHistory,
  RollbackMechanism,
  createVerificationFunction,
  verifySemanticEquivalence,
  verifyPerformanceImprovement,

  // Strategies
  FieldSelectionStrategy,
  PushdownStrategy,
  LazyLoadingStrategy,

  // Cost models
  cost,
};
