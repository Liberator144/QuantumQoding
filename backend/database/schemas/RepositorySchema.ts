/**
 * Repository Schema
 * 
 * Defines the schema for repositories in the unified data model.
 * 
 * @version 1.0.0
 */

import { Entity, EntityType, EntityState } from './EntitySchema';

/**
 * Repository visibility
 */
export enum RepositoryVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INTERNAL = 'internal'
}

/**
 * Repository schema
 */
export interface Repository extends Entity {
  /** Entity type (always repository) */
  type: EntityType.REPOSITORY;
  
  /** Repository owner (username or organization) */
  owner: string;
  
  /** Repository name */
  name: string;
  
  /** Repository full name (owner/name) */
  fullName: string;
  
  /** Repository description */
  description?: string;
  
  /** Repository URL */
  url: string;
  
  /** Repository homepage */
  homepage?: string;
  
  /** Repository language */
  language?: string;
  
  /** Repository languages */
  languages?: Record<string, number>;
  
  /** Repository default branch */
  defaultBranch: string;
  
  /** Repository visibility */
  visibility: RepositoryVisibility;
  
  /** Repository is fork */
  isFork: boolean;
  
  /** Repository fork count */
  forkCount: number;
  
  /** Repository star count */
  starCount: number;
  
  /** Repository watch count */
  watchCount: number;
  
  /** Repository open issues count */
  openIssuesCount: number;
  
  /** Repository topics */
  topics?: string[];
  
  /** Repository license */
  license?: string;
  
  /** Repository is archived */
  isArchived: boolean;
  
  /** Repository is disabled */
  isDisabled: boolean;
  
  /** Repository is template */
  isTemplate: boolean;
  
  /** Repository created at */
  createdAt: Date;
  
  /** Repository updated at */
  updatedAt: Date;
  
  /** Repository pushed at */
  pushedAt?: Date;
  
  /** Repository clone URL */
  cloneUrl?: string;
  
  /** Repository SSH URL */
  sshUrl?: string;
  
  /** Repository size (KB) */
  size?: number;
}