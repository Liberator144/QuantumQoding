/**
 * Database Schemas
 * 
 * This module exports database schemas for the QQ-Verse project.
 * 
 * @version 1.0.0
 */

// Base schema
export { 
  BaseEntity, 
  EntitySource, 
  EntityRelationship, 
  QuantumState, 
  SchemaValidationResult, 
  SchemaTransformOptions 
} from './BaseSchema';

// Entity schema
export { 
  Entity, 
  EntityType, 
  EntityState, 
  EntityPermissions, 
  EntityHistoryEntry, 
  EntityStatistics 
} from './EntitySchema';

// Repository schema
export { 
  Repository, 
  RepositoryVisibility 
} from './RepositorySchema';

// Issue schema
export { 
  Issue, 
  IssueState 
} from './IssueSchema';

// Pull request schema
export { 
  PullRequest, 
  PullRequestMergeStatus 
} from './PullRequestSchema';

// User schema
export { 
  User, 
  UserType 
} from './UserSchema';

// Record schema
export { 
  Record, 
  RecordRevision 
} from './RecordSchema';

// Document schema
export { 
  Document, 
  DocumentReference, 
  DocumentRevision 
} from './DocumentSchema';