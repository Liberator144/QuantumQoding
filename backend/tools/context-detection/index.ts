/**
 * Context Detection Module
 *
 * Provides tools for detecting the context of code files and directories.
 *
 * @version 1.0.0
 */

// ML-based context detection
const { MLContextDetector } = require('./ml/MLContextDetector');
const { MLModelTrainer } = require('./ml/MLModelTrainer');

// Export all components
module.exports = {
  MLContextDetector,
  MLModelTrainer,
};
