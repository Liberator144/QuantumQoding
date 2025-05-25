/**
 * GitHub Adapter for Data-to-Cosmos Mapping System
 * 
 * This module implements a GitHub adapter for the Data-to-Cosmos Mapping System,
 * which maps GitHub entities to cosmic objects in the visualization.
 * 
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import {
  Entity,
  EntityType,
  Relationship,
  RelationshipType,
  DataSourceType,
  EntityQuery,
  RelationshipQuery,
  DataAdapter,
} from '../types';

/**
 * GitHub API configuration
 */
export interface GitHubConfig {
  /** GitHub API token */
  token?: string;
  
  /** GitHub API base URL */
  baseUrl?: string;
  
  /** GitHub API version */
  apiVersion?: string;
  
  /** GitHub organization */
  organization?: string;
  
  /** GitHub repository */
  repository?: string;
  
  /** Cache timeout in milliseconds */
  cacheTimeout?: number;
}

/**
 * Default GitHub API configuration
 */
const defaultGitHubConfig: GitHubConfig = {
  baseUrl: 'https://api.github.com',
  apiVersion: '2022-11-28',
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
};

/**
 * GitHub adapter for Data-to-Cosmos Mapping System
 */
export class GitHubAdapter implements DataAdapter {
  /** Adapter name */
  name = 'GitHubAdapter';
  
  /** Adapter data source type */
  dataSourceType = DataSourceType.GITHUB;
  
  /** GitHub API configuration */
  private config: GitHubConfig;
  
  /** Entity cache */
  private entityCache = new Map<string, Entity>();
  
  /** Relationship cache */
  private relationshipCache = new Map<string, Relationship>();
  
  /** Last cache update timestamp */
  private lastCacheUpdate = 0;
  
  /**
   * Constructor
   * @param config - GitHub API configuration
   */
  constructor(config: GitHubConfig = {}) {
    this.config = {
      ...defaultGitHubConfig,
      ...config,
    };
  }
  
  /**
   * Initialize the adapter
   * @param options - Initialization options
   */
  async initialize(options?: Record<string, any>): Promise<void> {
    // Update configuration if provided
    if (options) {
      this.config = {
        ...this.config,
        ...options,
      };
    }
    
    // Clear caches
    this.entityCache.clear();
    this.relationshipCache.clear();
    this.lastCacheUpdate = 0;
  }
  
  /**
   * Get entities
   * @param query - Entity query
   * @returns Entities
   */
  async getEntities(query?: EntityQuery): Promise<Entity[]> {
    // Check if cache is valid
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
    
    // Filter entities based on query
    let entities = Array.from(this.entityCache.values());
    
    if (query) {
      if (query.type) {
        entities = entities.filter(entity => entity.type === query.type);
      }
      
      if (query.name) {
        const nameLower = query.name.toLowerCase();
        entities = entities.filter(entity => 
          entity.name.toLowerCase().includes(nameLower)
        );
      }
      
      if (query.owner) {
        const ownerLower = query.owner.toLowerCase();
        entities = entities.filter(entity => 
          entity.owner?.toLowerCase().includes(ownerLower)
        );
      }
      
      if (query.parentId) {
        entities = entities.filter(entity => 
          entity.parentId === query.parentId
        );
      }
      
      if (query.properties) {
        entities = entities.filter(entity => {
          for (const [key, value] of Object.entries(query.properties!)) {
            if (entity.properties?.[key] !== value) {
              return false;
            }
          }
          return true;
        });
      }
      
      // Apply sorting
      if (query.sort) {
        entities.sort((a, b) => {
          const aValue = this.getPropertyValue(a, query.sort!.field);
          const bValue = this.getPropertyValue(b, query.sort!.field);
          
          if (aValue < bValue) {
            return query.sort!.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return query.sort!.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      // Apply pagination
      if (query.offset !== undefined || query.limit !== undefined) {
        const offset = query.offset || 0;
        const limit = query.limit || entities.length;
        entities = entities.slice(offset, offset + limit);
      }
    }
    
    return entities;
  }
  
  /**
   * Get entity by ID
   * @param id - Entity ID
   * @returns Entity
   */
  async getEntityById(id: string): Promise<Entity | null> {
    // Check if cache is valid
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
    
    return this.entityCache.get(id) || null;
  }
  
  /**
   * Get relationships
   * @param query - Relationship query
   * @returns Relationships
   */
  async getRelationships(query?: RelationshipQuery): Promise<Relationship[]> {
    // Check if cache is valid
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
    
    // Filter relationships based on query
    let relationships = Array.from(this.relationshipCache.values());
    
    if (query) {
      if (query.type) {
        relationships = relationships.filter(relationship => 
          relationship.type === query.type
        );
      }
      
      if (query.sourceId) {
        relationships = relationships.filter(relationship => 
          relationship.sourceId === query.sourceId
        );
      }
      
      if (query.targetId) {
        relationships = relationships.filter(relationship => 
          relationship.targetId === query.targetId
        );
      }
      
      // Apply pagination
      if (query.offset !== undefined || query.limit !== undefined) {
        const offset = query.offset || 0;
        const limit = query.limit || relationships.length;
        relationships = relationships.slice(offset, offset + limit);
      }
    }
    
    return relationships;
  }
  
  /**
   * Get relationship by ID
   * @param id - Relationship ID
   * @returns Relationship
   */
  async getRelationshipById(id: string): Promise<Relationship | null> {
    // Check if cache is valid
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
    
    return this.relationshipCache.get(id) || null;
  }  /**
   * Check if cache should be refreshed
   * @returns Whether cache should be refreshed
   */
  private shouldRefreshCache(): boolean {
    const now = Date.now();
    return (
      this.lastCacheUpdate === 0 ||
      now - this.lastCacheUpdate > (this.config.cacheTimeout || 0)
    );
  }
  
  /**
   * Refresh cache
   */
  private async refreshCache(): Promise<void> {
    try {
      // Clear existing caches
      this.entityCache.clear();
      this.relationshipCache.clear();
      
      // Fetch repository data
      if (this.config.organization && this.config.repository) {
        await this.fetchRepositoryData(this.config.organization, this.config.repository);
      } else if (this.config.organization) {
        await this.fetchOrganizationData(this.config.organization);
      }
      
      // Update cache timestamp
      this.lastCacheUpdate = Date.now();
    } catch (error) {
      console.error('Error refreshing GitHub cache:', error);
      throw error;
    }
  }
  
  /**
   * Fetch organization data
   * @param organization - Organization name
   */
  private async fetchOrganizationData(organization: string): Promise<void> {
    // Fetch organization
    const orgData = await this.fetchFromGitHub(`/orgs/${organization}`);
    const orgEntity = this.createOrganizationEntity(orgData);
    this.entityCache.set(orgEntity.id, orgEntity);
    
    // Fetch repositories
    const reposData = await this.fetchFromGitHub(`/orgs/${organization}/repos`);
    for (const repoData of reposData) {
      const repoEntity = this.createRepositoryEntity(repoData);
      this.entityCache.set(repoEntity.id, repoEntity);
      
      // Create relationship between organization and repository
      const relationship = this.createRelationship(
        RelationshipType.OWNERSHIP,
        orgEntity.id,
        repoEntity.id,
        'owns',
        'Organization owns repository'
      );
      this.relationshipCache.set(relationship.id, relationship);
    }
    
    // Fetch members
    const membersData = await this.fetchFromGitHub(`/orgs/${organization}/members`);
    for (const memberData of membersData) {
      const memberEntity = this.createUserEntity(memberData);
      this.entityCache.set(memberEntity.id, memberEntity);
      
      // Create relationship between organization and member
      const relationship = this.createRelationship(
        RelationshipType.MEMBERSHIP,
        orgEntity.id,
        memberEntity.id,
        'has member',
        'Organization has member'
      );
      this.relationshipCache.set(relationship.id, relationship);
    }
  }
  
  /**
   * Fetch repository data
   * @param owner - Repository owner
   * @param repo - Repository name
   */
  private async fetchRepositoryData(owner: string, repo: string): Promise<void> {
    // Fetch repository
    const repoData = await this.fetchFromGitHub(`/repos/${owner}/${repo}`);
    const repoEntity = this.createRepositoryEntity(repoData);
    this.entityCache.set(repoEntity.id, repoEntity);
    
    // Fetch issues
    const issuesData = await this.fetchFromGitHub(`/repos/${owner}/${repo}/issues`);
    for (const issueData of issuesData) {
      // Skip pull requests (they're also returned by the issues endpoint)
      if (issueData.pull_request) {
        continue;
      }
      
      const issueEntity = this.createIssueEntity(issueData);
      this.entityCache.set(issueEntity.id, issueEntity);
      
      // Create relationship between repository and issue
      const repoIssueRelationship = this.createRelationship(
        RelationshipType.PARENT_CHILD,
        repoEntity.id,
        issueEntity.id,
        'has issue',
        'Repository has issue'
      );
      this.relationshipCache.set(repoIssueRelationship.id, repoIssueRelationship);
      
      // Create relationship between issue creator and issue
      if (issueData.user) {
        const userEntity = this.createUserEntity(issueData.user);
        this.entityCache.set(userEntity.id, userEntity);
        
        const userIssueRelationship = this.createRelationship(
          RelationshipType.CREATION,
          userEntity.id,
          issueEntity.id,
          'created',
          'User created issue'
        );
        this.relationshipCache.set(userIssueRelationship.id, userIssueRelationship);
      }
      
      // Create relationship between issue assignee and issue
      if (issueData.assignee) {
        const assigneeEntity = this.createUserEntity(issueData.assignee);
        this.entityCache.set(assigneeEntity.id, assigneeEntity);
        
        const assigneeIssueRelationship = this.createRelationship(
          RelationshipType.ASSIGNMENT,
          assigneeEntity.id,
          issueEntity.id,
          'assigned to',
          'Issue assigned to user'
        );
        this.relationshipCache.set(assigneeIssueRelationship.id, assigneeIssueRelationship);
      }
    }
    
    // Fetch pull requests
    const prsData = await this.fetchFromGitHub(`/repos/${owner}/${repo}/pulls`);
    for (const prData of prsData) {
      const prEntity = this.createPullRequestEntity(prData);
      this.entityCache.set(prEntity.id, prEntity);
      
      // Create relationship between repository and pull request
      const repoPrRelationship = this.createRelationship(
        RelationshipType.PARENT_CHILD,
        repoEntity.id,
        prEntity.id,
        'has pull request',
        'Repository has pull request'
      );
      this.relationshipCache.set(repoPrRelationship.id, repoPrRelationship);
      
      // Create relationship between pull request creator and pull request
      if (prData.user) {
        const userEntity = this.createUserEntity(prData.user);
        this.entityCache.set(userEntity.id, userEntity);
        
        const userPrRelationship = this.createRelationship(
          RelationshipType.CREATION,
          userEntity.id,
          prEntity.id,
          'created',
          'User created pull request'
        );
        this.relationshipCache.set(userPrRelationship.id, userPrRelationship);
      }
    }    
    // Fetch branches
    const branchesData = await this.fetchFromGitHub(`/repos/${owner}/${repo}/branches`);
    for (const branchData of branchesData) {
      const branchEntity = this.createBranchEntity(branchData, repoEntity.id);
      this.entityCache.set(branchEntity.id, branchEntity);
      
      // Create relationship between repository and branch
      const repoBranchRelationship = this.createRelationship(
        RelationshipType.PARENT_CHILD,
        repoEntity.id,
        branchEntity.id,
        'has branch',
        'Repository has branch'
      );
      this.relationshipCache.set(repoBranchRelationship.id, repoBranchRelationship);
    }
    
    // Fetch contributors
    const contributorsData = await this.fetchFromGitHub(`/repos/${owner}/${repo}/contributors`);
    for (const contributorData of contributorsData) {
      const contributorEntity = this.createUserEntity(contributorData);
      this.entityCache.set(contributorEntity.id, contributorEntity);
      
      // Create relationship between repository and contributor
      const repoContributorRelationship = this.createRelationship(
        RelationshipType.ASSOCIATION,
        repoEntity.id,
        contributorEntity.id,
        'has contributor',
        'Repository has contributor'
      );
      this.relationshipCache.set(repoContributorRelationship.id, repoContributorRelationship);
    }
  }
  
  /**
   * Fetch data from GitHub API
   * @param endpoint - API endpoint
   * @returns API response data
   */
  private async fetchFromGitHub(endpoint: string): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': this.config.apiVersion || '2022-11-28',
    };
    
    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }
    
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error(`Error fetching from GitHub API (${endpoint}):`, error);
      throw error;
    }
  }
  
  /**
   * Create organization entity
   * @param data - Organization data
   * @returns Organization entity
   */
  private createOrganizationEntity(data: any): Entity {
    return {
      id: `github-org-${data.id}`,
      type: EntityType.ORGANIZATION,
      name: data.name || data.login,
      description: data.description,
      url: data.html_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      properties: {
        login: data.login,
        avatarUrl: data.avatar_url,
        publicRepos: data.public_repos,
        publicGists: data.public_gists,
        followers: data.followers,
        following: data.following,
        location: data.location,
        blog: data.blog,
        email: data.email,
        bio: data.bio,
        twitterUsername: data.twitter_username,
      },
      dataSource: DataSourceType.GITHUB,
      dataSourceId: data.id.toString(),
      rawData: data,
    };
  }
  
  /**
   * Create repository entity
   * @param data - Repository data
   * @returns Repository entity
   */
  private createRepositoryEntity(data: any): Entity {
    return {
      id: `github-repo-${data.id}`,
      type: EntityType.REPOSITORY,
      name: data.name,
      description: data.description,
      url: data.html_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      owner: data.owner?.login,
      properties: {
        fullName: data.full_name,
        private: data.private,
        fork: data.fork,
        language: data.language,
        forksCount: data.forks_count,
        stargazersCount: data.stargazers_count,
        watchersCount: data.watchers_count,
        openIssuesCount: data.open_issues_count,
        defaultBranch: data.default_branch,
        license: data.license?.name,
        topics: data.topics,
      },
      dataSource: DataSourceType.GITHUB,
      dataSourceId: data.id.toString(),
      rawData: data,
    };
  }  
  /**
   * Create user entity
   * @param data - User data
   * @returns User entity
   */
  private createUserEntity(data: any): Entity {
    return {
      id: `github-user-${data.id}`,
      type: EntityType.USER,
      name: data.name || data.login,
      url: data.html_url,
      properties: {
        login: data.login,
        avatarUrl: data.avatar_url,
        type: data.type,
        siteAdmin: data.site_admin,
        contributions: data.contributions,
      },
      dataSource: DataSourceType.GITHUB,
      dataSourceId: data.id.toString(),
      rawData: data,
    };
  }
  
  /**
   * Create issue entity
   * @param data - Issue data
   * @returns Issue entity
   */
  private createIssueEntity(data: any): Entity {
    return {
      id: `github-issue-${data.id}`,
      type: EntityType.ISSUE,
      name: data.title,
      description: data.body,
      url: data.html_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      owner: data.user?.login,
      properties: {
        number: data.number,
        state: data.state,
        locked: data.locked,
        comments: data.comments,
        labels: data.labels?.map((label: any) => label.name),
        milestone: data.milestone?.title,
        assignees: data.assignees?.map((assignee: any) => assignee.login),
      },
      dataSource: DataSourceType.GITHUB,
      dataSourceId: data.id.toString(),
      rawData: data,
    };
  }
  
  /**
   * Create pull request entity
   * @param data - Pull request data
   * @returns Pull request entity
   */
  private createPullRequestEntity(data: any): Entity {
    return {
      id: `github-pr-${data.id}`,
      type: EntityType.PULL_REQUEST,
      name: data.title,
      description: data.body,
      url: data.html_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      owner: data.user?.login,
      properties: {
        number: data.number,
        state: data.state,
        locked: data.locked,
        draft: data.draft,
        merged: data.merged,
        mergeable: data.mergeable,
        rebaseable: data.rebaseable,
        mergeableState: data.mergeable_state,
        comments: data.comments,
        reviewComments: data.review_comments,
        commits: data.commits,
        additions: data.additions,
        deletions: data.deletions,
        changedFiles: data.changed_files,
        labels: data.labels?.map((label: any) => label.name),
        milestone: data.milestone?.title,
        assignees: data.assignees?.map((assignee: any) => assignee.login),
      },
      dataSource: DataSourceType.GITHUB,
      dataSourceId: data.id.toString(),
      rawData: data,
    };
  }
  
  /**
   * Create branch entity
   * @param data - Branch data
   * @param repoId - Repository ID
   * @returns Branch entity
   */
  private createBranchEntity(data: any, repoId: string): Entity {
    return {
      id: `github-branch-${repoId}-${data.name}`,
      type: EntityType.BRANCH,
      name: data.name,
      parentId: repoId,
      properties: {
        protected: data.protected,
        commit: data.commit?.sha,
      },
      dataSource: DataSourceType.GITHUB,
      dataSourceId: `${repoId}-${data.name}`,
      rawData: data,
    };
  }
  
  /**
   * Create relationship
   * @param type - Relationship type
   * @param sourceId - Source entity ID
   * @param targetId - Target entity ID
   * @param name - Relationship name
   * @param description - Relationship description
   * @returns Relationship
   */
  private createRelationship(
    type: RelationshipType,
    sourceId: string,
    targetId: string,
    name: string,
    description: string
  ): Relationship {
    return {
      id: uuidv4(),
      type,
      sourceId,
      targetId,
      name,
      description,
      strength: 1.0,
      direction: 'source_to_target',
      dataSource: DataSourceType.GITHUB,
      dataSourceId: `${sourceId}-${targetId}`,
    };
  }
  
  /**
   * Get property value from entity
   * @param entity - Entity
   * @param field - Field name
   * @returns Property value
   */
  private getPropertyValue(entity: Entity, field: string): any {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'properties' && entity.properties) {
        return entity.properties[child];
      }
    }
    
    return (entity as any)[field];
  }
}