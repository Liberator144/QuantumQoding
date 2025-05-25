/**
 * Knowledge Storage for Cross-Project Knowledge Transfer System
 */

import { v4 as uuidv4 } from 'uuid';
import { Knowledge, KnowledgeApplication, KnowledgeQuery, KnowledgeQueryResult } from './types';

/**
 * Interface for knowledge storage providers
 */
export interface KnowledgeStorage {
  /** Store a new knowledge entity */
  storeKnowledge(
    knowledge: Omit<
      Knowledge,
      'id' | 'createdAt' | 'updatedAt' | 'accessCount' | 'applicationCount' | 'appliedProjects'
    >
  ): Promise<Knowledge>;

  /** Retrieve a knowledge entity by ID */
  getKnowledge(id: string): Promise<Knowledge | null>;

  /** Update an existing knowledge entity */
  updateKnowledge(id: string, updates: Partial<Knowledge>): Promise<Knowledge>;

  /** Delete a knowledge entity */
  deleteKnowledge(id: string): Promise<boolean>;

  /** Query knowledge entities */
  queryKnowledge(query: KnowledgeQuery): Promise<KnowledgeQueryResult>;

  /** Record an access to a knowledge entity */
  recordAccess(id: string): Promise<void>;

  /** Record an application of a knowledge entity */
  recordApplication(application: Omit<KnowledgeApplication, 'id'>): Promise<KnowledgeApplication>;

  /** Get applications of a knowledge entity */
  getApplications(knowledgeId: string): Promise<KnowledgeApplication[]>;

  /** Get applications in a project */
  getProjectApplications(projectContext: string): Promise<KnowledgeApplication[]>;
}

/**
 * In-memory implementation of knowledge storage
 */
export class InMemoryKnowledgeStorage implements KnowledgeStorage {
  private knowledge: Map<string, Knowledge> = new Map();
  private applications: Map<string, KnowledgeApplication[]> = new Map();
  private projectApplications: Map<string, KnowledgeApplication[]> = new Map();

  /**
   * Store a new knowledge entity
   */
  async storeKnowledge(
    knowledge: Omit<
      Knowledge,
      'id' | 'createdAt' | 'updatedAt' | 'accessCount' | 'applicationCount' | 'appliedProjects'
    >
  ): Promise<Knowledge> {
    const id = uuidv4();
    const now = new Date();

    const newKnowledge: Knowledge = {
      ...knowledge,
      id,
      createdAt: now,
      updatedAt: now,
      accessCount: 0,
      applicationCount: 0,
      appliedProjects: [],
      metadata: knowledge.metadata || {},
    };

    this.knowledge.set(id, newKnowledge);
    this.applications.set(id, []);

    return newKnowledge;
  }

  /**
   * Retrieve a knowledge entity by ID
   */
  async getKnowledge(id: string): Promise<Knowledge | null> {
    return this.knowledge.get(id) || null;
  }

  /**
   * Update an existing knowledge entity
   */
  async updateKnowledge(id: string, updates: Partial<Knowledge>): Promise<Knowledge> {
    const knowledge = this.knowledge.get(id);

    if (!knowledge) {
      throw new Error(`Knowledge with ID ${id} not found`);
    }

    const updatedKnowledge: Knowledge = {
      ...knowledge,
      ...updates,
      id, // Ensure ID doesn't change
      createdAt: knowledge.createdAt, // Ensure creation date doesn't change
      updatedAt: new Date(), // Update the updated timestamp
    };

    this.knowledge.set(id, updatedKnowledge);
    return updatedKnowledge;
  }

  /**
   * Delete a knowledge entity
   */
  async deleteKnowledge(id: string): Promise<boolean> {
    const deleted = this.knowledge.delete(id);
    this.applications.delete(id);

    // Remove applications from project applications
    for (const [project, apps] of this.projectApplications.entries()) {
      const filteredApps = apps.filter(app => app.knowledgeId !== id);
      this.projectApplications.set(project, filteredApps);
    }

    return deleted;
  }

  /**
   * Record an access to a knowledge entity
   */
  async recordAccess(id: string): Promise<void> {
    const knowledge = this.knowledge.get(id);

    if (knowledge) {
      knowledge.accessCount += 1;
      knowledge.updatedAt = new Date();
      this.knowledge.set(id, knowledge);
    }
  }

  /**
   * Query knowledge entities
   */
  async queryKnowledge(query: KnowledgeQuery): Promise<KnowledgeQueryResult> {
    let knowledge = Array.from(this.knowledge.values());

    // Apply filters
    if (query.searchTerm) {
      const searchTermLower = query.searchTerm.toLowerCase();
      knowledge = knowledge.filter(
        k =>
          k.title.toLowerCase().includes(searchTermLower) ||
          k.description.toLowerCase().includes(searchTermLower) ||
          k.content.toLowerCase().includes(searchTermLower) ||
          k.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    if (query.type) {
      knowledge = knowledge.filter(k => k.type === query.type);
    }

    if (query.tags && query.tags.length > 0) {
      knowledge = knowledge.filter(k => query.tags!.every(tag => k.tags.includes(tag)));
    }

    if (query.sourceProject) {
      knowledge = knowledge.filter(k => k.sourceProject === query.sourceProject);
    }

    if (query.appliedProject) {
      knowledge = knowledge.filter(k => k.appliedProjects.includes(query.appliedProject!));
    }

    if (query.language) {
      knowledge = knowledge.filter(k => k.language === query.language);
    }

    if (query.createdBetween) {
      knowledge = knowledge.filter(
        k => k.createdAt >= query.createdBetween!.start && k.createdAt <= query.createdBetween!.end
      );
    }

    // Sort results
    if (query.sortBy) {
      knowledge.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        switch (query.sortBy) {
          case 'createdAt':
            valueA = a.createdAt;
            valueB = b.createdAt;
            break;
          case 'updatedAt':
            valueA = a.updatedAt;
            valueB = b.updatedAt;
            break;
          case 'accessCount':
            valueA = a.accessCount;
            valueB = b.accessCount;
            break;
          case 'applicationCount':
            valueA = a.applicationCount;
            valueB = b.applicationCount;
            break;
          default:
            return 0;
        }

        const direction = query.sortDirection === 'desc' ? -1 : 1;

        if (valueA < valueB) return -1 * direction;
        if (valueA > valueB) return 1 * direction;
        return 0;
      });
    }

    // Apply pagination
    const totalCount = knowledge.length;

    if (query.offset !== undefined) {
      knowledge = knowledge.slice(query.offset);
    }

    if (query.limit !== undefined) {
      knowledge = knowledge.slice(0, query.limit);
    }

    return {
      knowledge,
      totalCount,
    };
  }

  /**
   * Record an application of a knowledge entity
   */
  async recordApplication(
    application: Omit<KnowledgeApplication, 'id'>
  ): Promise<KnowledgeApplication> {
    const id = uuidv4();

    const newApplication: KnowledgeApplication = {
      ...application,
      id,
    };

    // Update knowledge entity
    const knowledge = this.knowledge.get(application.knowledgeId);
    if (knowledge) {
      knowledge.applicationCount += 1;

      // Add project to applied projects if not already there
      if (!knowledge.appliedProjects.includes(application.projectContext)) {
        knowledge.appliedProjects.push(application.projectContext);
      }

      knowledge.updatedAt = new Date();
      this.knowledge.set(application.knowledgeId, knowledge);
    }

    // Add to applications by knowledge
    if (!this.applications.has(application.knowledgeId)) {
      this.applications.set(application.knowledgeId, []);
    }
    this.applications.get(application.knowledgeId)!.push(newApplication);

    // Add to applications by project
    if (!this.projectApplications.has(application.projectContext)) {
      this.projectApplications.set(application.projectContext, []);
    }
    this.projectApplications.get(application.projectContext)!.push(newApplication);

    return newApplication;
  }

  /**
   * Get applications of a knowledge entity
   */
  async getApplications(knowledgeId: string): Promise<KnowledgeApplication[]> {
    return this.applications.get(knowledgeId) || [];
  }

  /**
   * Get applications in a project
   */
  async getProjectApplications(projectContext: string): Promise<KnowledgeApplication[]> {
    return this.projectApplications.get(projectContext) || [];
  }
}
