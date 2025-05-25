/**
 * Projection Analysis
 *
 * Provides utilities for analyzing projections to understand their structure,
 * complexity, and optimization opportunities.
 *
 * @version 1.0.0
 */

const { createProjectionDescriptor } = require('./ProjectionModel');

/**
 * Analyze a projection
 * @param {Object} projection - Projection to analyze
 * @param {Object} context - Analysis context
 * @returns {Object} Analysis results
 */
function analyzeProjection(projection, context = {}) {
  const descriptor = createProjectionDescriptor(projection);

  // Initialize analysis result
  const analysis = {
    type: descriptor.metadata.type,
    fields: analyzeFields(descriptor),
    complexity: analyzeComplexity(descriptor),
    optimizationOpportunities: [],
    metadata: {
      analyzedAt: Date.now(),
      context: { ...context },
    },
  };

  // Identify optimization opportunities
  analysis.optimizationOpportunities = identifyOptimizationOpportunities(
    descriptor,
    analysis,
    context
  );

  return analysis;
}

/**
 * Analyze fields in a projection
 * @param {Object} descriptor - Projection descriptor
 * @returns {Object} Field analysis
 * @private
 */
function analyzeFields(descriptor) {
  const allFields = [];
  const includedFields = [];
  const excludedFields = [];
  const nestedFields = [];

  // Process fields
  for (const [field, spec] of Object.entries(descriptor.fields)) {
    allFields.push(field);

    if (spec.include) {
      includedFields.push(field);
    } else {
      excludedFields.push(field);
    }

    if (spec.nested) {
      nestedFields.push(field);
    }
  }

  return {
    allFields,
    includedFields,
    excludedFields,
    nestedFields,
    count: allFields.length,
    includedCount: includedFields.length,
    excludedCount: excludedFields.length,
    nestedCount: nestedFields.length,
  };
}

/**
 * Analyze complexity of a projection
 * @param {Object} descriptor - Projection descriptor
 * @returns {Object} Complexity analysis
 * @private
 */
function analyzeComplexity(descriptor) {
  // Calculate basic complexity metrics
  const fieldCount = Object.keys(descriptor.fields).length;
  let nestedDepth = 0;
  let nestedFieldCount = 0;
  let totalFieldCount = fieldCount;

  // Process nested fields
  for (const [field, spec] of Object.entries(descriptor.fields)) {
    if (spec.nested) {
      const nestedComplexity = analyzeComplexity(spec.nested);
      nestedDepth = Math.max(nestedDepth, 1 + nestedComplexity.nestedDepth);
      nestedFieldCount += 1;
      totalFieldCount += nestedComplexity.totalFieldCount;
    }
  }

  // Calculate complexity score
  // This is a simple heuristic that considers field count and nesting depth
  const complexityScore = totalFieldCount * (1 + nestedDepth * 0.5);

  return {
    fieldCount,
    nestedFieldCount,
    nestedDepth,
    totalFieldCount,
    complexityScore,
    complexityLevel: getComplexityLevel(complexityScore),
  };
}

/**
 * Get complexity level based on score
 * @param {number} score - Complexity score
 * @returns {string} Complexity level
 * @private
 */
function getComplexityLevel(score) {
  if (score < 5) {
    return 'simple';
  } else if (score < 20) {
    return 'moderate';
  } else if (score < 50) {
    return 'complex';
  } else {
    return 'very_complex';
  }
}

/**
 * Identify optimization opportunities
 * @param {Object} descriptor - Projection descriptor
 * @param {Object} analysis - Projection analysis
 * @param {Object} context - Analysis context
 * @returns {Array} Optimization opportunities
 * @private
 */
function identifyOptimizationOpportunities(descriptor, analysis, context) {
  const opportunities = [];

  // Check for field selection optimization
  if (analysis.fields.includedCount > 10) {
    opportunities.push({
      type: 'field_selection',
      description: 'Projection includes many fields, consider optimizing field selection',
      impact: 'medium',
      fields: analysis.fields.includedFields,
    });
  }

  // Check for nested field optimization
  if (analysis.fields.nestedCount > 0) {
    opportunities.push({
      type: 'nested_fields',
      description: 'Projection includes nested fields, consider flattening or optimizing',
      impact: 'medium',
      fields: analysis.fields.nestedFields,
    });
  }

  // Check for pushdown optimization
  if (context.supportsProjectionPushdown && analysis.complexity.complexityScore > 10) {
    opportunities.push({
      type: 'pushdown',
      description: 'Projection is complex, consider pushing down to data source',
      impact: 'high',
      complexity: analysis.complexity,
    });
  }

  // Check for lazy loading optimization
  if (context.supportsLazyLoading && analysis.fields.includedCount > 5) {
    opportunities.push({
      type: 'lazy_loading',
      description: 'Projection includes many fields, consider lazy loading',
      impact: 'medium',
      fields: analysis.fields.includedFields,
    });
  }

  return opportunities;
}

/**
 * Estimate projection cost
 * @param {Object} projection - Projection to analyze
 * @param {Object} context - Analysis context
 * @returns {Object} Cost estimate
 */
function estimateProjectionCost(projection, context = {}) {
  const descriptor = createProjectionDescriptor(projection);
  const analysis = analyzeProjection(descriptor, context);

  // Initialize cost components
  const costs = {
    retrievalCost: 0,
    processingCost: 0,
    memoryCost: 0,
  };

  // Calculate retrieval cost
  costs.retrievalCost = calculateRetrievalCost(analysis, context);

  // Calculate processing cost
  costs.processingCost = calculateProcessingCost(analysis, context);

  // Calculate memory cost
  costs.memoryCost = calculateMemoryCost(analysis, context);

  // Calculate total cost
  costs.totalCost = costs.retrievalCost + costs.processingCost + costs.memoryCost;

  return {
    ...costs,
    analysis,
  };
}

/**
 * Calculate retrieval cost
 * @param {Object} analysis - Projection analysis
 * @param {Object} context - Analysis context
 * @returns {number} Retrieval cost
 * @private
 */
function calculateRetrievalCost(analysis, context) {
  // Base cost per field
  const baseFieldCost = context.baseFieldCost || 1;

  // Calculate cost based on included fields
  let cost = analysis.fields.includedCount * baseFieldCost;

  // Adjust for nested fields (more expensive to retrieve)
  cost += analysis.fields.nestedCount * baseFieldCost * 1.5;

  // Adjust for data source characteristics if available
  if (context.dataSourceCostFactor) {
    cost *= context.dataSourceCostFactor;
  }

  return cost;
}

/**
 * Calculate processing cost
 * @param {Object} analysis - Projection analysis
 * @param {Object} context - Analysis context
 * @returns {number} Processing cost
 * @private
 */
function calculateProcessingCost(analysis, context) {
  // Base processing cost
  const baseProcessingCost = context.baseProcessingCost || 0.5;

  // Calculate cost based on complexity
  let cost = analysis.complexity.complexityScore * baseProcessingCost;

  // Adjust for nested fields (more expensive to process)
  cost += analysis.complexity.nestedDepth * baseProcessingCost * 2;

  return cost;
}

/**
 * Calculate memory cost
 * @param {Object} analysis - Projection analysis
 * @param {Object} context - Analysis context
 * @returns {number} Memory cost
 * @private
 */
function calculateMemoryCost(analysis, context) {
  // Base memory cost per field
  const baseMemoryCost = context.baseMemoryCost || 0.2;

  // Calculate cost based on total fields
  let cost = analysis.complexity.totalFieldCount * baseMemoryCost;

  // Adjust for nested fields (more memory overhead)
  cost += analysis.complexity.nestedDepth * baseMemoryCost * 1.5;

  return cost;
}

module.exports = {
  analyzeProjection,
  estimateProjectionCost,
};
