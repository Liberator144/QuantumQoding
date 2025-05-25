/**
 * User Schema
 * 
 * Defines the schema for users in the unified data model.
 * 
 * @version 1.0.0
 */

import { Entity, EntityType, EntityState } from './EntitySchema';

/**
 * User type
 */
export enum UserType {
  USER = 'user',
  ORGANIZATION = 'organization',
  BOT = 'bot',
  SYSTEM = 'system'
}

/**
 * User schema
 */
export interface User extends Entity {
  /** Entity type (always user) */
  type: EntityType.USER;
  
  /** User login */
  login: string;
  
  /** User name */
  name?: string;
  
  /** User email */
  email?: string;
  
  /** User avatar URL */
  avatarUrl?: string;
  
  /** User URL */
  url: string;
  
  /** User type */
  userType: UserType;
  
  /** User bio */
  bio?: string;
  
  /** User company */
  company?: string;
  
  /** User location */
  location?: string;
  
  /** User blog */
  blog?: string;
  
  /** User Twitter username */
  twitterUsername?: string;
  
  /** User is site admin */
  isSiteAdmin?: boolean;
  
  /** User is hireable */
  isHireable?: boolean;
  
  /** User followers count */
  followersCount?: number;
  
  /** User following count */
  followingCount?: number;
  
  /** User public repositories count */
  publicReposCount?: number;
  
  /** User public gists count */
  publicGistsCount?: number;
  
  /** User created at */
  createdAt: Date;
  
  /** User updated at */
  updatedAt: Date;
  
  /** User last active at */
  lastActiveAt?: Date;
  
  /** User organizations */
  organizations?: string[];
  
  /** User teams */
  teams?: string[];
  
  /** User roles */
  roles?: string[];
  
  /** User permissions */
  permissions?: Record<string, string[]>;
}