/**
 * Entity Schema
 * 
 * Defines the schema for entities in the unified data model.
 * 
 * @version 1.0.0
 */

import { BaseEntity, EntitySource, EntityRelationship, QuantumState } from './BaseSchema';

/**
 * Entity types
 */
export enum EntityType {
  REPOSITORY = 'repository',
  ISSUE = 'issue',
  PULL_REQUEST = 'pull_request',
  USER = 'user',
  ORGANIZATION = 'organization',
  COMMIT = 'commit',
  FILE = 'file',
  COMMENT = 'comment',
  PROJECT = 'project',
  TASK = 'task',
  DOCUMENT = 'document',
  COLLECTION = 'collection',
  RECORD = 'record',
  CUSTOM = 'custom'
}

/**
 * Entity states
 */
export enum EntityState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

/**
 * Entity schema
 */
export interface Entity extends BaseEntity {
  /** Entity type */
  type: EntityType | string;
  
  /** Entity state */
  state: EntityState | string;
  
  /** Entity owner */
  owner?: string;
  
  /** Entity parent ID */
  parentId?: string;
  
  /** Entity children IDs */
  childrenIds?: string[];
  
  /** Entity metadata */
  metadata?: Record<string, any>;
  
  /** Entity permissions */
  permissions?: EntityPermissions;
  
  /** Entity history */
  history?: EntityHistoryEntry[];
  
  /** Entity statistics */
  statistics?: EntityStatistics;
}

/**
 * Entity permissions
 */
export interface EntityPermissions {
  /** Read permission */
  read: string[];
  
  /** Write permission */
  write: string[];
  
  /** Delete permission */
  delete: string[];
  
  /** Admin permission */
  admin: string[];
  
  /** Is public */
  isPublic: boolean;
}

/**
 * Entity history entry
 */
export interface EntityHistoryEntry {
  /** Action */
  action: string;
  
  /** Timestamp */
  timestamp: Date;
  
  /** User */
  user: string;
  
  /** Changes */
  changes?: Record<string, { previous: any; current: any }>;
  
  /** Comment */
  comment?: string;
}

/**
 * Entity statistics
 */
export interface EntityStatistics {
  /** Created at */
  createdAt: Date;
  
  /** Updated at */
  updatedAt: Date;
  
  /** Accessed at */
  accessedAt?: Date;
  
  /** View count */
  viewCount?: number;
  
  /** Edit count */
  editCount?: number;
  
  /** Comment count */
  commentCount?: number;
  
  /** Custom statistics */
  [key: string]: any;
}