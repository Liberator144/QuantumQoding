/**
 * Record Schema
 * 
 * Defines the schema for database records in the unified data model.
 * 
 * @version 1.0.0
 */

import { Entity, EntityType, EntityState } from './EntitySchema';

/**
 * Record schema
 */
export interface Record extends Entity {
  /** Entity type (always record) */
  type: EntityType.RECORD;
  
  /** Record table */
  table: string;
  
  /** Record schema */
  schema?: string;
  
  /** Record database */
  database?: string;
  
  /** Record primary key */
  primaryKey: string;
  
  /** Record data */
  data: any;
  
  /** Record created at */
  createdAt: Date;
  
  /** Record updated at */
  updatedAt: Date;
  
  /** Record created by */
  createdBy?: string;
  
  /** Record updated by */
  updatedBy?: string;
  
  /** Record version */
  version?: number;
  
  /** Record is deleted */
  isDeleted?: boolean;
  
  /** Record deleted at */
  deletedAt?: Date;
  
  /** Record deleted by */
  deletedBy?: string;
  
  /** Record is published */
  isPublished?: boolean;
  
  /** Record published at */
  publishedAt?: Date;
  
  /** Record published by */
  publishedBy?: string;
  
  /** Record is archived */
  isArchived?: boolean;
  
  /** Record archived at */
  archivedAt?: Date;
  
  /** Record archived by */
  archivedBy?: string;
  
  /** Record status */
  status?: string;
  
  /** Record revision history */
  revisionHistory?: RecordRevision[];
}

/**
 * Record revision
 */
export interface RecordRevision {
  /** Revision ID */
  id: string;
  
  /** Revision timestamp */
  timestamp: Date;
  
  /** Revision user */
  user?: string;
  
  /** Revision data */
  data: any;
  
  /** Revision comment */
  comment?: string;
}