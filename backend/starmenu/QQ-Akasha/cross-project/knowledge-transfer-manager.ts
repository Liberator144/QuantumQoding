/**
 * Knowledge Transfer Manager
 * Central manager for cross-project knowledge transfer
 */

import { EventEmitter } from 'events';
import {
  DEFAULT_KNOWLEDGE_TRANSFER_CONFIG,
  Knowledge,
  KnowledgeApplication,
  KnowledgeQuery,
  KnowledgeTransferConfig,
  KnowledgeType,
} from './types';
import { InMemoryKnowledgeStorage, KnowledgeStorage } from './knowledge-storage';
import { ProjectContextManager, ProjectInfo } from './project-context';
import { CrossProjectSearch, SearchResult } from './cross-project-search';
import { KnowledgeExtractor } from './extractors/knowledge-extractor';
import { CodePatternExtractor } from './extractors/code-pattern-extractor';

/**
 * Events emitted by the knowledge transfer manager
 */
export enum KnowledgeTransferEvent {
  KNOWLEDGE_CREATED = 'knowledge-created',
  KNOWLEDGE_UPDATED = 'knowledge-updated',
  KNOWLEDGE_DELETED = 'knowledge-deleted',
  KNOWLEDGE_ACCESSED = 'knowledge-accessed',
  KNOWLEDGE_APPLIED = 'knowledge-applied',
  KNOWLEDGE_EXTRACTED = 'knowledge-extracted',
  KNOWLEDGE_SUGGESTED = 'knowledge-suggested',
}

/**
 * Knowledge suggestion
 */
export interface KnowledgeSuggestion {
  /** Knowledge entity */
  knowledge: Knowledge;

  /** Relevance score (0-1) */
  relevance: number;

  /** Context that triggered the suggestion */
  context: {
    /** Project context */
    projectContext: string;

    /** File path */
    filePath?: string;

    /** Content that triggered the suggestion */
    content?: string;

    /** Additional context */
    additionalContext?: Record<string, any>;
  };

  /** Suggestion message */
  message: string;

  /** When the suggestion was created */
  createdAt: Date;
}

/**
 * Central manager for cross-project knowledge transfer
 */
export class KnowledgeTransferManager {
  private storage: KnowledgeStorage;
  private projectManager: ProjectContextManager;
  private search: CrossProjectSearch;
  private extractors: Map<string, KnowledgeExtractor>;
  private config: KnowledgeTransferConfig;
  private eventEmitter: EventEmitter;

  constructor(
    storage?: KnowledgeStorage,
    projectManager?: ProjectContextManager,
    config: Partial<KnowledgeTransferConfig> = {}
  ) {
    this.storage = storage || new InMemoryKnowledgeStorage();
    this.projectManager = projectManager || new ProjectContextManager();
    this.config = {
      ...DEFAULT_KNOWLEDGE_TRANSFER_CONFIG,
      ...config,
    };

    this.search = new CrossProjectSearch(this.storage, this.projectManager);
    this.extractors = new Map();
    this.eventEmitter = new EventEmitter();

    // Register default extractors
    this.registerExtractor(new CodePatternExtractor());
  }

  /**
   * Register a knowledge extractor
   */
  registerExtractor(extractor: KnowledgeExtractor): void {
    this.extractors.set(extractor.id, extractor);
  }

  /**
   * Unregister a knowledge extractor
   */
  unregisterExtractor(extractorId: string): boolean {
    return this.extractors.delete(extractorId);
  }

  /**
   * Get a knowledge extractor
   */
  getExtractor(extractorId: string): KnowledgeExtractor | undefined {
    return this.extractors.get(extractorId);
  }

  /**
   * Get all knowledge extractors
   */
  getAllExtractors(): KnowledgeExtractor[] {
    return Array.from(this.extractors.values());
  }

  /**
   * Create a new knowledge entity
   */
  async createKnowledge(
    type: KnowledgeType,
    title: string,
    description: string,
    content: string,
    sourceProject: string,
    tags: string[] = [],
    options: {
      sourceFilePath?: string;
      language?: string;
      createdBy?: string;
      compatibility?: {
        languages?: string[];
        frameworks?: string[];
        environments?: string[];
        notes?: string;
      };
      metadata?: Record<string, any>;
    } = {}
  ): Promise<Knowledge> {
    const knowledge = await this.storage.storeKnowledge({
      type,
      title,
      description,
      content,
      sourceProject,
      sourceFilePath: options.sourceFilePath,
      language: options.language,
      tags,
      createdBy: options.createdBy || 'user',
      compatibility: options.compatibility,
      metadata: options.metadata || {},
    });

    // Emit event
    this.eventEmitter.emit(KnowledgeTransferEvent.KNOWLEDGE_CREATED, knowledge);

    return knowledge;
  }

  /**
   * Get a knowledge entity
   */
  async getKnowledge(id: string): Promise<Knowledge | null> {
    const knowledge = await this.storage.getKnowledge(id);

    if (knowledge) {
      // Record access
      await this.storage.recordAccess(id);

      // Emit event
      this.eventEmitter.emit(KnowledgeTransferEvent.KNOWLEDGE_ACCESSED, knowledge);
    }

    return knowledge;
  }

  /**
   * Update a knowledge entity
   */
  async updateKnowledge(id: string, updates: Partial<Knowledge>): Promise<Knowledge> {
    const knowledge = await this.storage.updateKnowledge(id, updates);

    // Emit event
    this.eventEmitter.emit(KnowledgeTransferEvent.KNOWLEDGE_UPDATED, knowledge);

    return knowledge;
  }

  /**
   * Delete a knowledge entity
   */
  async deleteKnowledge(id: string): Promise<boolean> {
    const knowledge = await this.storage.getKnowledge(id);

    if (!knowledge) {
      return false;
    }

    const success = await this.storage.deleteKnowledge(id);

    if (success) {
      // Emit event
      this.eventEmitter.emit(KnowledgeTransferEvent.KNOWLEDGE_DELETED, knowledge);
    }

    return success;
  }

  /**
   * Search for knowledge
   */
  async searchKnowledge(
    query: string | KnowledgeQuery,
    options: {
      targetProjectId?: string;
      includeTargetProject?: boolean;
      minRelevance?: number;
      minCompatibility?: number;
      limit?: number;
    } = {}
  ): Promise<SearchResult[]> {
    return this.search.search(query, options);
  }

  /**
   * Extract knowledge from content
   */
  async extractKnowledge(
    content: string,
    filePath: string,
    projectId: string,
    options: {
      extractorIds?: string[];
      minConfidence?: number;
      maxResults?: number;
    } = {}
  ): Promise<Knowledge[]> {
    const { extractorIds, minConfidence = 0.7, maxResults = 5 } = options;

    // Get project
    const project = this.projectManager.getProject(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    // Get applicable extractors
    let applicableExtractors: KnowledgeExtractor[];

    if (extractorIds && extractorIds.length > 0) {
      // Use specified extractors
      applicableExtractors = extractorIds
        .map(id => this.extractors.get(id))
        .filter(Boolean) as KnowledgeExtractor[];
    } else {
      // Use all extractors that can handle this file
      applicableExtractors = Array.from(this.extractors.values()).filter(extractor =>
        extractor.canHandle(filePath, content)
      );
    }

    if (applicableExtractors.length === 0) {
      return [];
    }

    // Extract knowledge using all applicable extractors
    const extractionPromises = applicableExtractors.map(extractor =>
      extractor.extractKnowledge(content, filePath, project, {
        minConfidence,
      })
    );

    const extractionResults = await Promise.all(extractionPromises);

    // Flatten and sort by confidence
    const allKnowledge = extractionResults
      .flat()
      .sort((a, b) => (b.metadata.confidence || 0) - (a.metadata.confidence || 0));

    // Limit results
    const limitedKnowledge = allKnowledge.slice(0, maxResults);

    // Store extracted knowledge
    const storedKnowledge: Knowledge[] = [];

    for (const knowledge of limitedKnowledge) {
      const stored = await this.storage.storeKnowledge({
        type: knowledge.type,
        title: knowledge.title,
        description: knowledge.description,
        content: knowledge.content,
        sourceProject: knowledge.sourceProject,
        sourceFilePath: knowledge.sourceFilePath,
        language: knowledge.language,
        tags: knowledge.tags,
        createdBy: 'system',
        compatibility: knowledge.compatibility,
        metadata: {
          ...knowledge.metadata,
          extractedBy: knowledge.metadata.extractorId || 'unknown',
        },
      });

      storedKnowledge.push(stored);

      // Emit event
      this.eventEmitter.emit(KnowledgeTransferEvent.KNOWLEDGE_EXTRACTED, stored);
    }

    return storedKnowledge;
  }

  /**
   * Apply knowledge to a target project
   */
  async applyKnowledge(
    knowledgeId: string,
    targetProjectId: string,
    options: {
      filePath?: string;
      appliedBy?: string;
      modifications?: string;
      notes?: string;
    } = {}
  ): Promise<KnowledgeApplication> {
    // Get knowledge
    const knowledge = await this.storage.getKnowledge(knowledgeId);
    if (!knowledge) {
      throw new Error(`Knowledge with ID ${knowledgeId} not found`);
    }

    // Get target project
    const targetProject = this.projectManager.getProject(targetProjectId);
    if (!targetProject) {
      throw new Error(`Project with ID ${targetProjectId} not found`);
    }

    // Record application
    const application = await this.storage.recordApplication({
      knowledgeId,
      projectContext: targetProjectId,
      filePath: options.filePath,
      appliedAt: new Date(),
      appliedBy: options.appliedBy || 'user',
      successful: true,
      modifications: options.modifications,
      notes: options.notes,
    });

    // Emit event
    this.eventEmitter.emit(KnowledgeTransferEvent.KNOWLEDGE_APPLIED, {
      knowledge,
      application,
      targetProject,
    });

    return application;
  }

  /**
   * Get applications of a knowledge entity
   */
  async getKnowledgeApplications(knowledgeId: string): Promise<KnowledgeApplication[]> {
    return this.storage.getApplications(knowledgeId);
  }

  /**
   * Get applications in a project
   */
  async getProjectApplications(projectId: string): Promise<KnowledgeApplication[]> {
    return this.storage.getProjectApplications(projectId);
  }

  /**
   * Suggest knowledge for a context
   */
  async suggestKnowledge(
    projectId: string,
    context: {
      filePath?: string;
      content?: string;
      additionalContext?: Record<string, any>;
    } = {}
  ): Promise<KnowledgeSuggestion[]> {
    // Get project
    const project = this.projectManager.getProject(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    // Build search query
    const query: KnowledgeQuery = {};

    if (context.content) {
      // Extract key terms from content
      const keyTerms = this.extractKeyTerms(context.content);
      query.searchTerm = keyTerms.join(' ');
    }

    if (context.filePath) {
      // Determine language from file extension
      const extension = context.filePath.split('.').pop()?.toLowerCase();
      if (extension) {
        const languageMap: Record<string, string> = {
          js: 'javascript',
          ts: 'typescript',
          py: 'python',
          java: 'java',
          cs: 'csharp',
          go: 'go',
          rb: 'ruby',
        };

        if (languageMap[extension]) {
          query.language = languageMap[extension];
        }
      }
    }

    // Search for relevant knowledge
    const searchResults = await this.search.search(query, {
      targetProjectId: projectId,
      minRelevance: this.config.minSimilarityScore,
      limit: this.config.maxSuggestions,
    });

    // Convert search results to suggestions
    const suggestions: KnowledgeSuggestion[] = searchResults.map(result => {
      const suggestion: KnowledgeSuggestion = {
        knowledge: result.knowledge,
        relevance: result.relevance,
        context: {
          projectContext: projectId,
          filePath: context.filePath,
          content: context.content,
          additionalContext: context.additionalContext,
        },
        message: this.generateSuggestionMessage(result, project),
        createdAt: new Date(),
      };

      // Emit event for each suggestion
      this.eventEmitter.emit(KnowledgeTransferEvent.KNOWLEDGE_SUGGESTED, suggestion);

      return suggestion;
    });

    return suggestions;
  }

  /**
   * Subscribe to knowledge transfer events
   */
  on(event: KnowledgeTransferEvent, listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from knowledge transfer events
   */
  off(event: KnowledgeTransferEvent, listener: (data: any) => void): void {
    this.eventEmitter.off(event, listener);
  }

  /**
   * Extract key terms from content
   */
  private extractKeyTerms(content: string): string[] {
    // This is a simplified implementation
    // A real implementation would use NLP techniques

    // Remove common symbols and split into words
    const words = content
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .map(word => word.toLowerCase());

    // Count word frequencies
    const wordCounts: Record<string, number> = {};
    for (const word of words) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }

    // Sort by frequency
    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);

    // Return top words
    return sortedWords.slice(0, 10);
  }

  /**
   * Generate a suggestion message
   */
  private generateSuggestionMessage(result: SearchResult, targetProject: ProjectInfo): string {
    const { knowledge, relevance, compatibilityScore, compatibilityNotes } = result;

    let message = `Found relevant knowledge "${knowledge.title}" from project "${knowledge.sourceProject}"`;

    // Add relevance information
    if (relevance > 0.9) {
      message += ' that is highly relevant to your current context';
    } else if (relevance > 0.7) {
      message += ' that is relevant to your current context';
    } else {
      message += ' that might be relevant to your current context';
    }

    // Add compatibility information
    if (compatibilityScore > 0.9) {
      message += ' and is fully compatible with your project.';
    } else if (compatibilityScore > 0.7) {
      message += ' and is mostly compatible with your project.';
    } else if (compatibilityScore > 0.5) {
      message += ' but may need some adaptation for your project.';
    } else {
      message += ' but will require significant adaptation for your project.';
    }

    // Add compatibility notes if available
    if (compatibilityNotes.length > 0) {
      message += ` Note: ${compatibilityNotes.join(' ')}`;
    }

    return message;
  }
}
