/**
 * GitHub Adapter
 * 
 * Adapter for GitHub API integration.
 * Implements the DatabaseAdapter interface for GitHub repositories.
 * 
 * @version 1.0.0
 */

import { Octokit } from '@octokit/rest';
import { BaseAdapter } from './BaseAdapter';
import { DatabaseAdapterOptions, QueryOptions, UpdateOptions } from '../interfaces/DatabaseAdapter';
import { BaseEntity } from '../schemas/BaseSchema';

/**
 * GitHub adapter options
 */
export interface GitHubAdapterOptions extends DatabaseAdapterOptions {
  /** GitHub API token */
  token: string;
  
  /** GitHub API URL (for GitHub Enterprise) */
  apiUrl?: string;
  
  /** Default owner (username or organization) */
  defaultOwner?: string;
  
  /** Default repository */
  defaultRepo?: string;
  
  /** Use issues for storage */
  useIssues?: boolean;
  
  /** Use pull requests for storage */
  usePullRequests?: boolean;
  
  /** Use repository contents for storage */
  useContents?: boolean;
  
  /** Content path prefix */
  contentPathPrefix?: string;
  
  /** Content file extension */
  contentFileExtension?: string;
  
  /** Issue label prefix */
  issueLabelPrefix?: string;
  
  /** Pull request label prefix */
  pullRequestLabelPrefix?: string;
}

/**
 * Default GitHub adapter options
 */
const DEFAULT_OPTIONS: Partial<GitHubAdapterOptions> = {
  useIssues: true,
  usePullRequests: false,
  useContents: true,
  contentPathPrefix: 'data',
  contentFileExtension: '.json',
  issueLabelPrefix: 'data:',
  pullRequestLabelPrefix: 'data:'
};

/**
 * GitHub adapter implementation
 */
export class GitHubAdapter extends BaseAdapter {
  /** Octokit instance */
  private octokit: Octokit | null = null;
  
  /** Collection to content path mapping */
  private collectionPaths: Map<string, string> = new Map();
  
  /** Collection to issue label mapping */
  private collectionLabels: Map<string, string> = new Map();  
  /**
   * Constructor
   * @param options - GitHub adapter options
   */
  constructor(options: GitHubAdapterOptions) {
    super('GitHub', 'github', { ...DEFAULT_OPTIONS, ...options });
    
    if (!this.options.token) {
      throw new Error('GitHub token is required');
    }
  }
  
  /**
   * Connect to GitHub API
   * @returns Promise resolving to connection success
   */
  async connect(): Promise<boolean> {
    try {
      // Create Octokit instance
      this.octokit = new Octokit({
        auth: this.options.token,
        baseUrl: this.options.apiUrl,
        request: {
          timeout: this.options.connectionTimeout
        }
      });
      
      // Test connection
      const { data } = await this.octokit.users.getAuthenticated();
      
      this._isConnected = true;
      this.log(`Connected to GitHub API as ${data.login}`);
      this.emit('connected');
      
      return true;
    } catch (error) {
      this._isConnected = false;
      this.logError('Failed to connect to GitHub API', error);
      this.emit('connection-failed', error);
      
      return false;
    }
  }
  
  /**
   * Disconnect from GitHub API
   * @returns Promise resolving to disconnection success
   */
  async disconnect(): Promise<boolean> {
    this.octokit = null;
    this._isConnected = false;
    
    this.log('Disconnected from GitHub API');
    this.emit('disconnected');
    
    return true;
  }
  
  /**
   * Ensure connected
   * @throws Error if not connected
   */
  private ensureConnected(): void {
    if (!this._isConnected || !this.octokit) {
      throw new Error('Not connected to GitHub API');
    }
  }
  
  /**
   * Get owner and repo from collection
   * @param collection - Collection name
   * @returns Owner and repo
   */
  private getOwnerAndRepo(collection: string): { owner: string; repo: string } {
    // Check if collection contains owner/repo format
    const parts = collection.split('/');
    
    if (parts.length >= 2) {
      return {
        owner: parts[0],
        repo: parts[1]
      };
    }
    
    // Use default owner and repo
    return {
      owner: this.options.defaultOwner || '',
      repo: this.options.defaultRepo || collection
    };
  }  
  /**
   * Get content path for collection
   * @param collection - Collection name
   * @returns Content path
   */
  private getContentPath(collection: string): string {
    // Check if path is already mapped
    if (this.collectionPaths.has(collection)) {
      return this.collectionPaths.get(collection)!;
    }
    
    // Create path
    const { owner, repo } = this.getOwnerAndRepo(collection);
    const collectionName = collection.split('/').pop() || collection;
    const path = `${this.options.contentPathPrefix}/${collectionName}`;
    
    // Store path
    this.collectionPaths.set(collection, path);
    
    return path;
  }
  
  /**
   * Get issue label for collection
   * @param collection - Collection name
   * @returns Issue label
   */
  private getIssueLabel(collection: string): string {
    // Check if label is already mapped
    if (this.collectionLabels.has(collection)) {
      return this.collectionLabels.get(collection)!;
    }
    
    // Create label
    const collectionName = collection.split('/').pop() || collection;
    const label = `${this.options.issueLabelPrefix}${collectionName}`;
    
    // Store label
    this.collectionLabels.set(collection, label);
    
    return label;
  }
  
  /**
   * Find entities by query
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entities
   */
  async find<T extends BaseEntity>(
    collection: string, 
    query: Record<string, any> = {}, 
    options: QueryOptions = {}
  ): Promise<T[]> {
    this.ensureConnected();
    
    // Check cache
    const cacheKey = this.getCacheKey(collection, query, options);
    const cached = this.getFromCache<T[]>(cacheKey);
    
    if (cached && options.useCache !== false) {
      return cached;
    }
    
    try {
      let entities: T[] = [];
      
      // Get owner and repo
      const { owner, repo } = this.getOwnerAndRepo(collection);
      
      if (!owner || !repo) {
        throw new Error('Owner and repo are required');
      }      
      // Determine storage method
      if (this.options.useContents) {
        // Use repository contents
        entities = await this.findInContents<T>(owner, repo, collection, query, options);
      } else if (this.options.useIssues) {
        // Use issues
        entities = await this.findInIssues<T>(owner, repo, collection, query, options);
      } else {
        throw new Error('No storage method enabled');
      }
      
      // Apply query filtering
      const filteredEntities = this.filterEntitiesByQuery(entities, query);
      
      // Apply options
      const processedEntities = this.applyQueryOptions(filteredEntities, options);
      
      // Cache results
      this.setInCache(cacheKey, processedEntities);
      
      return processedEntities;
    } catch (error) {
      this.logError(`Failed to find entities in collection ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Find entities in repository contents
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entities
   */
  private async findInContents<T extends BaseEntity>(
    owner: string,
    repo: string,
    collection: string,
    query: Record<string, any>,
    options: QueryOptions
  ): Promise<T[]> {
    try {
      // Get content path
      const path = this.getContentPath(collection);
      
      // Get directory contents
      const { data } = await this.octokit!.repos.getContent({
        owner,
        repo,
        path
      });
      
      // Process contents
      const entities: T[] = [];
      
      if (Array.isArray(data)) {
        // Directory listing
        for (const item of data) {
          if (item.type === 'file' && item.name.endsWith(this.options.contentFileExtension!)) {
            try {
              // Get file content
              const fileResponse = await this.octokit!.repos.getContent({
                owner,
                repo,
                path: item.path
              });              
              // Parse content
              if ('content' in fileResponse.data) {
                const content = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');
                const entity = JSON.parse(content) as T;
                
                // Add to entities
                entities.push(entity);
              }
            } catch (error) {
              this.log(`Failed to get content for file ${item.path}: ${error}`);
            }
          }
        }
      }
      
      return entities;
    } catch (error) {
      if (error.status === 404) {
        // Directory doesn't exist, return empty array
        return [];
      }
      
      throw error;
    }
  }
  
  /**
   * Find entities in issues
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entities
   */
  private async findInIssues<T extends BaseEntity>(
    owner: string,
    repo: string,
    collection: string,
    query: Record<string, any>,
    options: QueryOptions
  ): Promise<T[]> {
    try {
      // Get issue label
      const label = this.getIssueLabel(collection);
      
      // Get issues
      const { data } = await this.octokit!.issues.listForRepo({
        owner,
        repo,
        labels: label,
        state: 'all',
        per_page: 100
      });
      
      // Process issues
      const entities: T[] = [];
      
      for (const issue of data) {
        try {
          // Extract entity from issue body
          const match = issue.body?.match(/```json\n([\s\S]*?)\n```/);
          
          if (match && match[1]) {
            const entity = JSON.parse(match[1]) as T;
            
            // Add to entities
            entities.push(entity);
          }
        } catch (error) {
          this.log(`Failed to parse entity from issue #${issue.number}: ${error}`);
        }
      }      
      return entities;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Filter entities by query
   * @param entities - Entities to filter
   * @param query - Query object
   * @returns Filtered entities
   */
  private filterEntitiesByQuery<T extends BaseEntity>(entities: T[], query: Record<string, any>): T[] {
    // Empty query returns all entities
    if (Object.keys(query).length === 0) {
      return entities;
    }
    
    // Filter entities
    return entities.filter(entity => {
      // Check each query field
      for (const [field, value] of Object.entries(query)) {
        // Handle nested fields
        const fieldParts = field.split('.');
        let fieldValue: any = entity;
        
        for (const part of fieldParts) {
          if (fieldValue === undefined || fieldValue === null) {
            return false;
          }
          
          fieldValue = fieldValue[part];
        }
        
        // Check value
        if (fieldValue !== value) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  /**
   * Apply query options
   * @param entities - Entities to process
   * @param options - Query options
   * @returns Processed entities
   */
  private applyQueryOptions<T extends BaseEntity>(entities: T[], options: QueryOptions): T[] {
    let result = [...entities];
    
    // Apply sort
    if (options.sort) {
      result.sort((a, b) => {
        for (const [field, order] of Object.entries(options.sort!)) {
          // Handle nested fields
          const fieldParts = field.split('.');
          let aValue: any = a;
          let bValue: any = b;
          
          for (const part of fieldParts) {
            aValue = aValue?.[part];
            bValue = bValue?.[part];
          }
          
          if (aValue < bValue) {
            return order === 1 ? -1 : 1;
          }
          
          if (aValue > bValue) {
            return order === 1 ? 1 : -1;
          }
        }        
        return 0;
      });
    }
    
    // Apply skip
    if (options.skip) {
      result = result.slice(options.skip);
    }
    
    // Apply limit
    if (options.limit) {
      result = result.slice(0, options.limit);
    }
    
    return result;
  }
  
  /**
   * Find one entity by query
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entity or null
   */
  async findOne<T extends BaseEntity>(
    collection: string, 
    query: Record<string, any> = {}, 
    options: QueryOptions = {}
  ): Promise<T | null> {
    // Find entities with limit 1
    const entities = await this.find<T>(collection, query, { ...options, limit: 1 });
    
    // Return first entity or null
    return entities.length > 0 ? entities[0] : null;
  }
  
  /**
   * Insert entity
   * @param collection - Collection name
   * @param entity - Entity to insert
   * @returns Promise resolving to inserted entity
   */
  async insert<T extends BaseEntity>(collection: string, entity: T): Promise<T> {
    this.ensureConnected();
    
    try {
      // Generate ID if not provided
      if (!entity.id) {
        entity = { ...entity, id: this.generateId() };
      }
      
      // Set creation and update timestamps
      const now = new Date();
      
      if (!entity.createdAt) {
        entity = { ...entity, createdAt: now };
      }
      
      if (!entity.updatedAt) {
        entity = { ...entity, updatedAt: now };
      }
      
      // Get owner and repo
      const { owner, repo } = this.getOwnerAndRepo(collection);
      
      if (!owner || !repo) {
        throw new Error('Owner and repo are required');
      }      
      // Determine storage method
      if (this.options.useContents) {
        // Use repository contents
        await this.insertInContents(owner, repo, collection, entity);
      } else if (this.options.useIssues) {
        // Use issues
        await this.insertInIssues(owner, repo, collection, entity);
      } else {
        throw new Error('No storage method enabled');
      }
      
      // Clear cache for collection
      this.clearCache(collection);
      
      // Emit event
      this.emit('entity-inserted', { collection, entity });
      
      return entity;
    } catch (error) {
      this.logError(`Failed to insert entity in collection ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Insert entity in repository contents
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param collection - Collection name
   * @param entity - Entity to insert
   */
  private async insertInContents<T extends BaseEntity>(
    owner: string,
    repo: string,
    collection: string,
    entity: T
  ): Promise<void> {
    try {
      // Get content path
      const path = this.getContentPath(collection);
      
      // Create directory if it doesn't exist
      try {
        await this.octokit!.repos.getContent({
          owner,
          repo,
          path
        });
      } catch (error) {
        if (error.status === 404) {
          // Create directory
          await this.octokit!.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: `${path}/.gitkeep`,
            message: `Create ${collection} collection directory`,
            content: Buffer.from('').toString('base64')
          });
        } else {
          throw error;
        }
      }
      
      // Create file
      const filePath = `${path}/${entity.id}${this.options.contentFileExtension}`;
      const content = JSON.stringify(entity, null, 2);      
      await this.octokit!.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: `Create entity ${entity.id} in ${collection} collection`,
        content: Buffer.from(content).toString('base64')
      });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Insert entity in issues
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param collection - Collection name
   * @param entity - Entity to insert
   */
  private async insertInIssues<T extends BaseEntity>(
    owner: string,
    repo: string,
    collection: string,
    entity: T
  ): Promise<void> {
    try {
      // Get issue label
      const label = this.getIssueLabel(collection);
      
      // Create issue
      const title = `[${collection}] ${entity.id}`;
      const body = `Entity: ${entity.id}\n\n\`\`\`json\n${JSON.stringify(entity, null, 2)}\n\`\`\``;
      
      await this.octokit!.issues.create({
        owner,
        repo,
        title,
        body,
        labels: [label]
      });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Insert multiple entities
   * @param collection - Collection name
   * @param entities - Entities to insert
   * @returns Promise resolving to inserted entities
   */
  async insertMany<T extends BaseEntity>(collection: string, entities: T[]): Promise<T[]> {
    this.ensureConnected();
    
    try {
      // Insert entities one by one
      const insertedEntities: T[] = [];
      
      for (const entity of entities) {
        const insertedEntity = await this.insert(collection, entity);
        insertedEntities.push(insertedEntity);
      }
      
      return insertedEntities;
    } catch (error) {
      this.logError(`Failed to insert entities in collection ${collection}`, error);
      throw error;
    }
  }  
  /**
   * Update entity
   * @param collection - Collection name
   * @param query - Query object
   * @param update - Update object
   * @param options - Update options
   * @returns Promise resolving to update result
   */
  async update<T extends BaseEntity>(
    collection: string, 
    query: Record<string, any>, 
    update: Partial<T>, 
    options: UpdateOptions = {}
  ): Promise<{ matched: number; modified: number; upserted?: T }> {
    this.ensureConnected();
    
    try {
      // Find entities to update
      const entities = await this.find<T>(collection, query);
      
      if (entities.length === 0) {
        // No entities found
        if (options.upsert) {
          // Create new entity
          const newEntity = {
            ...query,
            ...update,
            id: query.id || this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
          } as T;
          
          const insertedEntity = await this.insert(collection, newEntity);
          
          return {
            matched: 0,
            modified: 1,
            upserted: insertedEntity
          };
        }
        
        return {
          matched: 0,
          modified: 0
        };
      }
      
      // Update entities
      let modified = 0;
      
      for (const entity of entities) {
        // Skip if multi is false and we already updated one entity
        if (!options.multi && modified > 0) {
          break;
        }
        
        // Update entity
        const updatedEntity = {
          ...entity,
          ...update,
          updatedAt: new Date()
        } as T;
        
        // Get owner and repo
        const { owner, repo } = this.getOwnerAndRepo(collection);
        
        if (!owner || !repo) {
          throw new Error('Owner and repo are required');
        }        
        // Determine storage method
        if (this.options.useContents) {
          // Use repository contents
          await this.updateInContents(owner, repo, collection, entity, updatedEntity);
        } else if (this.options.useIssues) {
          // Use issues
          await this.updateInIssues(owner, repo, collection, entity, updatedEntity);
        } else {
          throw new Error('No storage method enabled');
        }
        
        modified++;
      }
      
      // Clear cache for collection
      this.clearCache(collection);
      
      // Emit event
      this.emit('entities-updated', { collection, count: modified });
      
      return {
        matched: entities.length,
        modified
      };
    } catch (error) {
      this.logError(`Failed to update entities in collection ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Update entity in repository contents
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param collection - Collection name
   * @param entity - Original entity
   * @param updatedEntity - Updated entity
   */
  private async updateInContents<T extends BaseEntity>(
    owner: string,
    repo: string,
    collection: string,
    entity: T,
    updatedEntity: T
  ): Promise<void> {
    try {
      // Get content path
      const path = this.getContentPath(collection);
      
      // Get file
      const filePath = `${path}/${entity.id}${this.options.contentFileExtension}`;
      
      try {
        const { data } = await this.octokit!.repos.getContent({
          owner,
          repo,
          path: filePath
        });
        
        if ('sha' in data) {
          // Update file
          const content = JSON.stringify(updatedEntity, null, 2);
          
          await this.octokit!.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Update entity ${entity.id} in ${collection} collection`,
            content: Buffer.from(content).toString('base64'),
            sha: data.sha
          });
        }      } catch (error) {
        if (error.status === 404) {
          // File doesn't exist, create it
          const content = JSON.stringify(updatedEntity, null, 2);
          
          await this.octokit!.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Create entity ${entity.id} in ${collection} collection`,
            content: Buffer.from(content).toString('base64')
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update entity in issues
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param collection - Collection name
   * @param entity - Original entity
   * @param updatedEntity - Updated entity
   */
  private async updateInIssues<T extends BaseEntity>(
    owner: string,
    repo: string,
    collection: string,
    entity: T,
    updatedEntity: T
  ): Promise<void> {
    try {
      // Get issue label
      const label = this.getIssueLabel(collection);
      
      // Find issue
      const { data: issues } = await this.octokit!.issues.listForRepo({
        owner,
        repo,
        labels: label,
        state: 'all'
      });
      
      const issue = issues.find(issue => {
        const title = `[${collection}] ${entity.id}`;
        return issue.title === title;
      });
      
      if (issue) {
        // Update issue
        const body = `Entity: ${updatedEntity.id}\n\n\`\`\`json\n${JSON.stringify(updatedEntity, null, 2)}\n\`\`\``;
        
        await this.octokit!.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          body
        });
      } else {
        // Create issue
        const title = `[${collection}] ${updatedEntity.id}`;
        const body = `Entity: ${updatedEntity.id}\n\n\`\`\`json\n${JSON.stringify(updatedEntity, null, 2)}\n\`\`\``;
        
        await this.octokit!.issues.create({
          owner,
          repo,
          title,
          body,
          labels: [label]
        });
      }    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Delete entity
   * @param collection - Collection name
   * @param query - Query object
   * @returns Promise resolving to number of deleted entities
   */
  async delete(collection: string, query: Record<string, any>): Promise<number> {
    this.ensureConnected();
    
    try {
      // Find entities to delete
      const entities = await this.find(collection, query);
      
      if (entities.length === 0) {
        return 0;
      }
      
      // Delete entities
      let deleted = 0;
      
      for (const entity of entities) {
        // Get owner and repo
        const { owner, repo } = this.getOwnerAndRepo(collection);
        
        if (!owner || !repo) {
          throw new Error('Owner and repo are required');
        }
        
        // Determine storage method
        if (this.options.useContents) {
          // Use repository contents
          await this.deleteInContents(owner, repo, collection, entity);
        } else if (this.options.useIssues) {
          // Use issues
          await this.deleteInIssues(owner, repo, collection, entity);
        } else {
          throw new Error('No storage method enabled');
        }
        
        deleted++;
      }
      
      // Clear cache for collection
      this.clearCache(collection);
      
      // Emit event
      this.emit('entities-deleted', { collection, count: deleted });
      
      return deleted;
    } catch (error) {
      this.logError(`Failed to delete entities in collection ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Delete entity in repository contents
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param collection - Collection name
   * @param entity - Entity to delete
   */
  private async deleteInContents(
    owner: string,
    repo: string,
    collection: string,
    entity: any
  ): Promise<void> {    try {
      // Get content path
      const path = this.getContentPath(collection);
      
      // Get file
      const filePath = `${path}/${entity.id}${this.options.contentFileExtension}`;
      
      try {
        const { data } = await this.octokit!.repos.getContent({
          owner,
          repo,
          path: filePath
        });
        
        if ('sha' in data) {
          // Delete file
          await this.octokit!.repos.deleteFile({
            owner,
            repo,
            path: filePath,
            message: `Delete entity ${entity.id} from ${collection} collection`,
            sha: data.sha
          });
        }
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Delete entity in issues
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param collection - Collection name
   * @param entity - Entity to delete
   */
  private async deleteInIssues(
    owner: string,
    repo: string,
    collection: string,
    entity: any
  ): Promise<void> {
    try {
      // Get issue label
      const label = this.getIssueLabel(collection);
      
      // Find issue
      const { data: issues } = await this.octokit!.issues.listForRepo({
        owner,
        repo,
        labels: label,
        state: 'all'
      });
      
      const issue = issues.find(issue => {
        const title = `[${collection}] ${entity.id}`;
        return issue.title === title;
      });
      
      if (issue) {
        // Close issue
        await this.octokit!.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          state: 'closed'
        });
      }
    } catch (error) {
      throw error;
    }
  }  
  /**
   * Count entities
   * @param collection - Collection name
   * @param query - Query object
   * @returns Promise resolving to entity count
   */
  async count(collection: string, query: Record<string, any>): Promise<number> {
    // Find entities and return count
    const entities = await this.find(collection, query);
    return entities.length;
  }
  
  /**
   * Check if collection exists
   * @param collection - Collection name
   * @returns Promise resolving to existence check result
   */
  async collectionExists(collection: string): Promise<boolean> {
    this.ensureConnected();
    
    try {
      // Get owner and repo
      const { owner, repo } = this.getOwnerAndRepo(collection);
      
      if (!owner || !repo) {
        throw new Error('Owner and repo are required');
      }
      
      // Determine storage method
      if (this.options.useContents) {
        // Use repository contents
        const path = this.getContentPath(collection);
        
        try {
          await this.octokit!.repos.getContent({
            owner,
            repo,
            path
          });
          
          return true;
        } catch (error) {
          if (error.status === 404) {
            return false;
          }
          
          throw error;
        }
      } else if (this.options.useIssues) {
        // Use issues
        const label = this.getIssueLabel(collection);
        
        try {
          const { data } = await this.octokit!.issues.listForRepo({
            owner,
            repo,
            labels: label,
            per_page: 1
          });
          
          return data.length > 0;
        } catch (error) {
          if (error.status === 404) {
            return false;
          }
          
          throw error;
        }
      } else {
        throw new Error('No storage method enabled');
      }
    } catch (error) {
      this.logError(`Failed to check if collection ${collection} exists`, error);
      throw error;
    }
  }  
  /**
   * Create collection
   * @param collection - Collection name
   * @returns Promise resolving to creation success
   */
  async createCollection(collection: string): Promise<boolean> {
    this.ensureConnected();
    
    try {
      // Check if collection already exists
      const exists = await this.collectionExists(collection);
      
      if (exists) {
        return true;
      }
      
      // Get owner and repo
      const { owner, repo } = this.getOwnerAndRepo(collection);
      
      if (!owner || !repo) {
        throw new Error('Owner and repo are required');
      }
      
      // Determine storage method
      if (this.options.useContents) {
        // Use repository contents
        const path = this.getContentPath(collection);
        
        // Create directory
        await this.octokit!.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: `${path}/.gitkeep`,
          message: `Create ${collection} collection directory`,
          content: Buffer.from('').toString('base64')
        });
        
        return true;
      } else if (this.options.useIssues) {
        // Use issues
        // Nothing to do, collection will be created when first entity is inserted
        return true;
      } else {
        throw new Error('No storage method enabled');
      }
    } catch (error) {
      this.logError(`Failed to create collection ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Drop collection
   * @param collection - Collection name
   * @returns Promise resolving to drop success
   */
  async dropCollection(collection: string): Promise<boolean> {
    this.ensureConnected();
    
    try {
      // Check if collection exists
      const exists = await this.collectionExists(collection);
      
      if (!exists) {
        return true;
      }
      
      // Get owner and repo
      const { owner, repo } = this.getOwnerAndRepo(collection);
      
      if (!owner || !repo) {
        throw new Error('Owner and repo are required');
      }      
      // Determine storage method
      if (this.options.useContents) {
        // Use repository contents
        const path = this.getContentPath(collection);
        
        // Get directory contents
        const { data } = await this.octokit!.repos.getContent({
          owner,
          repo,
          path
        });
        
        if (Array.isArray(data)) {
          // Delete each file
          for (const item of data) {
            if (item.type === 'file') {
              await this.octokit!.repos.deleteFile({
                owner,
                repo,
                path: item.path,
                message: `Delete ${item.name} from ${collection} collection`,
                sha: item.sha
              });
            }
          }
        }
        
        return true;
      } else if (this.options.useIssues) {
        // Use issues
        const label = this.getIssueLabel(collection);
        
        // Get issues
        const { data } = await this.octokit!.issues.listForRepo({
          owner,
          repo,
          labels: label,
          state: 'all',
          per_page: 100
        });
        
        // Close each issue
        for (const issue of data) {
          await this.octokit!.issues.update({
            owner,
            repo,
            issue_number: issue.number,
            state: 'closed'
          });
        }
        
        return true;
      } else {
        throw new Error('No storage method enabled');
      }
    } catch (error) {
      this.logError(`Failed to drop collection ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Get collection names
   * @returns Promise resolving to collection names
   */
  async getCollectionNames(): Promise<string[]> {
    this.ensureConnected();
    
    try {
      // Get owner and repo
      const { owner, repo } = this.getOwnerAndRepo('');
      
      if (!owner || !repo) {
        throw new Error('Owner and repo are required');
      }      
      const collections: string[] = [];
      
      // Determine storage method
      if (this.options.useContents) {
        // Use repository contents
        const path = this.options.contentPathPrefix || '';
        
        try {
          const { data } = await this.octokit!.repos.getContent({
            owner,
            repo,
            path
          });
          
          if (Array.isArray(data)) {
            // Get directories
            for (const item of data) {
              if (item.type === 'dir') {
                collections.push(item.name);
              }
            }
          }
        } catch (error) {
          if (error.status !== 404) {
            throw error;
          }
        }
      } else if (this.options.useIssues) {
        // Use issues
        const { data } = await this.octokit!.issues.listLabelsForRepo({
          owner,
          repo,
          per_page: 100
        });
        
        // Get labels with prefix
        const prefix = this.options.issueLabelPrefix || '';
        
        for (const label of data) {
          if (label.name.startsWith(prefix)) {
            const collection = label.name.substring(prefix.length);
            collections.push(collection);
          }
        }
      }
      
      return collections;
    } catch (error) {
      this.logError('Failed to get collection names', error);
      throw error;
    }
  }
  
  /**
   * Execute raw query
   * @param query - Raw query
   * @returns Promise resolving to query result
   */
  async executeRawQuery<T>(query: any): Promise<T> {
    this.ensureConnected();
    
    try {
      // Execute raw query using Octokit
      if (!query.method || !query.endpoint) {
        throw new Error('Raw query must include method and endpoint');
      }
      
      const result = await this.octokit!.request(query.method, query.endpoint, query.params || {});
      
      return result.data as T;
    } catch (error) {
      this.logError('Failed to execute raw query', error);
      throw error;
    }
  }  
  /**
   * Watch collection for changes
   * @param collection - Collection name
   * @param callback - Change callback
   * @returns Promise resolving to watch ID
   */
  async watch(collection: string, callback: (change: any) => void): Promise<string> {
    this.ensureConnected();
    
    try {
      // Generate watch ID
      const watchId = this.generateId();
      
      // Store callback
      this.watches.set(watchId, {
        collection,
        callback,
        interval: null
      });
      
      // Set up polling interval
      const interval = setInterval(async () => {
        try {
          // Get entities
          const entities = await this.find(collection, {});
          
          // Get cached entities
          const cacheKey = this.getCacheKey(collection, {});
          const cachedEntities = this.getFromCache<any[]>(cacheKey) || [];
          
          // Compare entities
          const changes = this.detectChanges(cachedEntities, entities);
          
          // Call callback for each change
          for (const change of changes) {
            callback(change);
          }
          
          // Update cache
          this.setInCache(cacheKey, entities);
        } catch (error) {
          this.log(`Error in watch interval for collection ${collection}: ${error}`);
        }
      }, 30000); // Poll every 30 seconds
      
      // Store interval
      this.watches.get(watchId)!.interval = interval;
      
      return watchId;
    } catch (error) {
      this.logError(`Failed to watch collection ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Detect changes between two entity arrays
   * @param oldEntities - Old entities
   * @param newEntities - New entities
   * @returns Changes
   */
  private detectChanges(oldEntities: any[], newEntities: any[]): any[] {
    const changes: any[] = [];
    
    // Create maps for faster lookup
    const oldMap = new Map(oldEntities.map(entity => [entity.id, entity]));
    const newMap = new Map(newEntities.map(entity => [entity.id, entity]));
    
    // Find deleted entities
    for (const [id, entity] of oldMap.entries()) {
      if (!newMap.has(id)) {
        changes.push({
          type: 'deleted',
          entity
        });
      }
    }    
    // Find inserted entities
    for (const [id, entity] of newMap.entries()) {
      if (!oldMap.has(id)) {
        changes.push({
          type: 'inserted',
          entity
        });
      }
    }
    
    // Find updated entities
    for (const [id, newEntity] of newMap.entries()) {
      if (oldMap.has(id)) {
        const oldEntity = oldMap.get(id)!;
        
        // Compare entities
        if (JSON.stringify(oldEntity) !== JSON.stringify(newEntity)) {
          changes.push({
            type: 'updated',
            oldEntity,
            newEntity
          });
        }
      }
    }
    
    return changes;
  }
  
  /**
   * Stop watching collection
   * @param watchId - Watch ID
   * @returns Promise resolving to stop success
   */
  async stopWatch(watchId: string): Promise<boolean> {
    try {
      // Get watch
      const watch = this.watches.get(watchId);
      
      if (!watch) {
        return false;
      }
      
      // Clear interval
      if (watch.interval) {
        clearInterval(watch.interval);
      }
      
      // Remove watch
      this.watches.delete(watchId);
      
      return true;
    } catch (error) {
      this.logError(`Failed to stop watch ${watchId}`, error);
      throw error;
    }
  }
}

// Export adapter
export default GitHubAdapter;