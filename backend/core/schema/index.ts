/**
 * Schema Module
 *
 * Provides schema evolution capabilities for the Unified Quantum Database.
 *
 * @version 1.0.0
 */

// Core
const { SchemaEngine } = require('./SchemaEngine');

// Versioning
const { SchemaRegistry } = require('./versioning/SchemaRegistry');

// Migration
const { MigrationManager } = require('./migration/MigrationManager');

// Validation
const { SchemaValidator } = require('./validation/SchemaValidator');

// Export all components
module.exports = {
  // Core
  SchemaEngine,

  // Versioning
  SchemaRegistry,

  // Migration
  MigrationManager,

  // Validation
  SchemaValidator,
};
