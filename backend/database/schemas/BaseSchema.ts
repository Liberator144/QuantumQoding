/**
 * Base Schema Interface
 * 
 * Defines the common properties that all entities in the unified data model must have.
 * This ensures consistency across different data sources and enables seamless integration.
 * 
 * @version 1.0.0
 */

/**
 * Entity source information
 */
export interface EntitySource {
  /** Source type (e.g., 'github', 'supabase', 'mongodb') */
  type: string;
  
  /** Source identifier (e.g., repository name, database name) */
  identifier: string;
  
  /** Original ID in the source system */
  originalId: string;
  
  /** Last synchronized timestamp */
  lastSynced: Date;
  
  /** Source-specific metadata */
  metadata?: Record<string, any>;
}

/**
 * Base entity interface that all schema entities must implement
 */
export interface BaseEntity {
  /** Unique identifier across all data sources */
  id: string;
  
  /** Entity type (e.g., 'issue', 'user', 'repository') */
  type: string;
  
  /** Entity name or title */
  name: string;
  
  /** Entity description */
  description?: string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
  
  /** Source information */
  source: EntitySource;
  
  /** Entity-specific attributes */
  attributes?: Record<string, any>;
  
  /** Relationships to other entities */
  relationships?: EntityRelationship[];
  
  /** Entity state */
  state?: string;
  
  /** Entity tags */
  tags?: string[];
  
  /** Quantum state information */
  quantumState?: QuantumState;
}

/**
 * Entity relationship
 */
export interface EntityRelationship {
  /** Relationship type (e.g., 'parent', 'child', 'related') */
  type: string;
  
  /** Target entity ID */
  targetId: string;
  
  /** Target entity type */
  targetType: string;
  
  /** Relationship strength (0-1) */
  strength?: number;
  
  /** Relationship direction ('inbound', 'outbound', 'bidirectional') */
  direction: 'inbound' | 'outbound' | 'bidirectional';
  
  /** Relationship metadata */
  metadata?: Record<string, any>;
}

/**
 * Quantum state information
 */
export interface QuantumState {
  /** Coherence level (0-1) */
  coherenceLevel: number;
  
  /** Entanglement IDs (entities this entity is entangled with) */
  entanglementIds?: string[];
  
  /** Superposition states */
  superpositionStates?: Record<string, any>[];
  
  /** Quantum signature (for verification) */
  signature?: string;
  
  /** Last quantum state update timestamp */
  lastUpdated: Date;
}

/**
 * Schema validation result
 */
export interface SchemaValidationResult {
  /** Is valid */
  isValid: boolean;
  
  /** Validation errors */
  errors?: string[];
  
  /** Validation warnings */
  warnings?: string[];
}

/**
 * Schema transformation options
 */
export interface SchemaTransformOptions {
  /** Include relationships */
  includeRelationships?: boolean;
  
  /** Include quantum state */
  includeQuantumState?: boolean;
  
  /** Include source metadata */
  includeSourceMetadata?: boolean;
  
  /** Custom transformation function */
  transform?: (entity: BaseEntity) => any;
}