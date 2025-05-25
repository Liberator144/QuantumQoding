/**
 * Pull Request Schema
 * 
 * Defines the schema for pull requests in the unified data model.
 * 
 * @version 1.0.0
 */

import { Entity, EntityType, EntityState } from './EntitySchema';
import { IssueState } from './IssueSchema';

/**
 * Pull request merge status
 */
export enum PullRequestMergeStatus {
  MERGEABLE = 'mergeable',
  CONFLICTING = 'conflicting',
  UNKNOWN = 'unknown'
}

/**
 * Pull request schema
 */
export interface PullRequest extends Entity {
  /** Entity type (always pull_request) */
  type: EntityType.PULL_REQUEST;
  
  /** Pull request number */
  number: number;
  
  /** Pull request title */
  title: string;
  
  /** Pull request body */
  body?: string;
  
  /** Pull request state */
  state: IssueState;
  
  /** Pull request repository ID */
  repositoryId: string;
  
  /** Pull request repository full name */
  repositoryFullName: string;
  
  /** Pull request author ID */
  authorId: string;
  
  /** Pull request author login */
  authorLogin: string;
  
  /** Pull request assignees */
  assignees?: string[];
  
  /** Pull request reviewers */
  reviewers?: string[];
  
  /** Pull request labels */
  labels?: string[];
  
  /** Pull request milestone */
  milestone?: string;
  
  /** Pull request is draft */
  isDraft: boolean;
  
  /** Pull request is locked */
  isLocked: boolean;
  
  /** Pull request lock reason */
  lockReason?: string;
  
  /** Pull request comments count */
  commentsCount: number;
  
  /** Pull request review comments count */
  reviewCommentsCount: number;
  
  /** Pull request commits count */
  commitsCount: number;
  
  /** Pull request files count */
  filesCount: number;
  
  /** Pull request additions count */
  additionsCount: number;
  
  /** Pull request deletions count */
  deletionsCount: number;  
  /** Pull request created at */
  createdAt: Date;
  
  /** Pull request updated at */
  updatedAt: Date;
  
  /** Pull request closed at */
  closedAt?: Date;
  
  /** Pull request merged at */
  mergedAt?: Date;
  
  /** Pull request merged by */
  mergedBy?: string;
  
  /** Pull request merge commit SHA */
  mergeCommitSha?: string;
  
  /** Pull request is merged */
  isMerged: boolean;
  
  /** Pull request is mergeable */
  mergeable?: PullRequestMergeStatus;
  
  /** Pull request is rebaseable */
  rebaseable?: boolean;
  
  /** Pull request base branch */
  baseBranch: string;
  
  /** Pull request head branch */
  headBranch: string;
  
  /** Pull request head repository ID */
  headRepositoryId?: string;
  
  /** Pull request head repository full name */
  headRepositoryFullName?: string;
  
  /** Pull request URL */
  url: string;
  
  /** Pull request linked issue ID */
  linkedIssueId?: string;
  
  /** Pull request reactions */
  reactions?: Record<string, number>;
  
  /** Pull request review decision */
  reviewDecision?: 'approved' | 'changes_requested' | 'review_required';
  
  /** Pull request auto-merge enabled */
  autoMergeEnabled?: boolean;
}