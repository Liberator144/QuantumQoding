/**
 * Document Schema
 *
 * Defines the schema for MongoDB documents in the unified data model.
 *
 * @version 1.0.0
 */

import { Entity, EntityType, EntityState } from './EntitySchema';


/**
 * Document interface with extended metadata
 */
export interface Document<TData = Record<string, unknown>> extends Entity {
  /** Entity type (always document) */
  type: EntityType.DOCUMENT;

  /** Document collection */
  collection: string;

  /** Document database */
  database?: string;

  /** Document data */
  data: TData;

  /** Document created at */
  createdAt: Date;

  /** Document updated at */
  updatedAt: Date;

  /** Document created by */
  createdBy?: string;

  /** Document updated by */
  updatedBy?: string;

  /** Document version */
  version?: number;

  /** Document is deleted */
  isDeleted?: boolean;

  /** Document deleted at */
  deletedAt?: Date;

  /** Document deleted by */
  deletedBy?: string;

  /** Document schema version */
  schemaVersion?: string;

  /** Document indexes */
  indexes?: string[];

  /** Document references */
  references?: DocumentReference[];

  /** Document revision history */
  revisionHistory?: DocumentRevision[];
}

/**
 * Document reference
 */
export interface DocumentReference {
  /** Reference field */
  field: string;

  /** Reference collection */
  collection: string;

  /** Reference document ID */
  documentId: string;

  /** Reference type */
  type: 'one' | 'many';
}

/**
 * Document revision
 */
export interface DocumentRevision<TData = Record<string, unknown>> {
   /** Revision ID */
   id: string;
   
   /** Revision timestamp */
   timestamp: Date;
   
   /** Revision user */
   user?: string;
   
   /** Revision data */
  data: TData;
   
   /** Revision comment */
   comment?: string;
}