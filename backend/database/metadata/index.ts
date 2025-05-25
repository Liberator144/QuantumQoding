/**
 * Database Metadata
 * 
 * This module exports database metadata managers for the QQ-Verse project.
 * 
 * @version 1.0.0
 */

// Metadata manager
export { 
  MetadataManager, 
  MetadataType, 
  MetadataEntry, 
  MetadataManagerOptions 
} from './MetadataManager';
export { default as MetadataManagerInstance } from './MetadataManager';

// Relationship manager
export { 
  RelationshipManager, 
  RelationshipType, 
  RelationshipDirection, 
  RelationshipDefinition, 
  RelationshipQuery, 
  RelationshipManagerOptions 
} from './RelationshipManager';
export { default as RelationshipManagerInstance } from './RelationshipManager';