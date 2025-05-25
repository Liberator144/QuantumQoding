/**
 * Issue Schema
 * 
 * Defines the schema for issues in the unified data model.
 * 
 * @version 1.0.0
 */

import { Entity, EntityType, EntityState } from './EntitySchema';

/**
 * Issue state
 */
export enum IssueState {
  OPEN = 'open',
  CLOSED = 'closed'
}

/**
 * Issue schema
 */
export interface Issue extends Entity {
  /** Entity type (always issue) */
  type: EntityType.ISSUE;
  
  /** Issue number */
  number: number;
  
  /** Issue title */
  title: string;
  
  /** Issue body */
  body?: string;
  
  /** Issue state */
  state: IssueState;
  
  /** Issue repository ID */
  repositoryId: string;
  
  /** Issue repository full name */
  repositoryFullName: string;
  
  /** Issue author ID */
  authorId: string;
  
  /** Issue author login */
  authorLogin: string;
  
  /** Issue assignees */
  assignees?: string[];
  
  /** Issue labels */
  labels?: string[];
  
  /** Issue milestone */
  milestone?: string;
  
  /** Issue is locked */
  isLocked: boolean;
  
  /** Issue lock reason */
  lockReason?: string;
  
  /** Issue comments count */
  commentsCount: number;
  
  /** Issue created at */
  createdAt: Date;
  
  /** Issue updated at */
  updatedAt: Date;
  
  /** Issue closed at */
  closedAt?: Date;
  
  /** Issue closed by */
  closedBy?: string;
  
  /** Issue URL */
  url: string;
  
  /** Issue is pull request */
  isPullRequest: boolean;
  
  /** Issue linked pull request ID */
  linkedPullRequestId?: string;
  
  /** Issue reactions */
  reactions?: Record<string, number>;
}