/**
 * Data-to-Cosmos Mapping System Types
 * 
 * This module defines the types and interfaces for the Data-to-Cosmos Mapping System,
 * which maps database entities to cosmic objects in the visualization.
 * 
 * @version 1.0.0
 */

/**
 * Entity type
 */
export enum EntityType {
  /** Repository entity */
  REPOSITORY = 'repository',
  
  /** Issue entity */
  ISSUE = 'issue',
  
  /** Pull request entity */
  PULL_REQUEST = 'pull_request',
  
  /** User entity */
  USER = 'user',
  
  /** Organization entity */
  ORGANIZATION = 'organization',
  
  /** Project entity */
  PROJECT = 'project',
  
  /** Milestone entity */
  MILESTONE = 'milestone',
  
  /** Label entity */
  LABEL = 'label',
  
  /** Comment entity */
  COMMENT = 'comment',
  
  /** Commit entity */
  COMMIT = 'commit',
  
  /** Branch entity */
  BRANCH = 'branch',
  
  /** Tag entity */
  TAG = 'tag',
  
  /** Workflow entity */
  WORKFLOW = 'workflow',
  
  /** Action entity */
  ACTION = 'action',
  
  /** Database entity */
  DATABASE = 'database',
  
  /** Table entity */
  TABLE = 'table',
  
  /** Record entity */
  RECORD = 'record',
  
  /** Collection entity */
  COLLECTION = 'collection',
  
  /** Document entity */
  DOCUMENT = 'document',
  
  /** Field entity */
  FIELD = 'field',
  
  /** Custom entity */
  CUSTOM = 'custom',
}