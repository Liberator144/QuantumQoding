/**
 * Responsive Module
 *
 * This module exports all responsive design and touch interaction components.
 *
 * @version 1.0.0
 */

const { ResponsiveDesignSystem } = require('./ResponsiveDesignSystem');
const { TouchInteractionSystem, GestureRecognizer } = require('./TouchInteractionSystem');
const { TouchOptimizer } = require('./TouchOptimizer');
const { ContentAdapter } = require('./ContentAdapter');
const { MediaQueryManager } = require('./MediaQueryManager');
const { FeedbackProvider } = require('./FeedbackProvider');

module.exports = {
  // Main components
  ResponsiveDesignSystem,
  TouchInteractionSystem,

  // Sub-components
  GestureRecognizer,
  TouchOptimizer,
  ContentAdapter,
  MediaQueryManager,
  FeedbackProvider,

  /**
   * Create a new ResponsiveDesignSystem instance
   * @param {Object} options - Configuration options
   * @returns {ResponsiveDesignSystem} New ResponsiveDesignSystem instance
   */
  createResponsiveDesignSystem: (options = {}) => new ResponsiveDesignSystem(options),

  /**
   * Create a new TouchInteractionSystem instance
   * @param {Object} options - Configuration options
   * @returns {TouchInteractionSystem} New TouchInteractionSystem instance
   */
  createTouchInteractionSystem: (options = {}) => new TouchInteractionSystem(options),
};
