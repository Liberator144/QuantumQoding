/**
 * System Module
 *
 * Provides a unified system for the Quantum-Unified Database.
 *
 * @version 1.0.0
 */

const { UnifiedSystem } = require('./UnifiedSystem');
const { VerificationSystem } = require('./VerificationSystem');

/**
 * Create a new unified system
 * @param {Object} options - Configuration options
 * @returns {UnifiedSystem} The created unified system
 */
function createUnifiedSystem(options = {}) {
  return new UnifiedSystem(options);
}

/**
 * Create a new verification system
 * @param {Object} options - Configuration options
 * @returns {VerificationSystem} The created verification system
 */
function createVerificationSystem(options = {}) {
  return new VerificationSystem(options);
}

// Export all components
module.exports = {
  // Factory functions
  createUnifiedSystem,
  createVerificationSystem,

  // Classes
  UnifiedSystem,
  VerificationSystem,
};
