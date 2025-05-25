/**
 * Cross-Project Search for Knowledge Transfer
 */

import { Knowledge, KnowledgeQuery, KnowledgeQueryResult } from './types';
import { KnowledgeStorage } from './knowledge-storage';
import { ProjectContextManager, ProjectInfo } from './project-context';

/**
 * Search result with relevance information
 */
export interface SearchResult {
  /** Knowledge entity */
  knowledge: Knowledge;

  /** Relevance score (0-1) */
  relevance: number;

  /** Source project information */
  sourceProject: ProjectInfo | null;

  /** Compatibility score with target project (0-1) */
  compatibilityScore: number;

  /** Compatibility notes */
  compatibilityNotes: string[];
}

/**
 * Cross-project search options
 */
export interface CrossProjectSearchOptions {
  /** Target project ID (if not specified, uses active project) */
  targetProjectId?: string;

  /** Whether to include knowledge from the target project */
  includeTargetProject?: boolean;

  /** Minimum relevance score (0-1) */
  minRelevance?: number;

  /** Minimum compatibility score (0-1) */
  minCompatibility?: number;

  /** Maximum number of results */
  limit?: number;
}

/**
 * Default search options
 */
const DEFAULT_SEARCH_OPTIONS: CrossProjectSearchOptions = {
  includeTargetProject: false,
  minRelevance: 0.5,
  minCompatibility: 0.7,
  limit: 10,
};

/**
 * Provides cross-project search functionality
 */
export class CrossProjectSearch {
  private storage: KnowledgeStorage;
  private projectManager: ProjectContextManager;

  constructor(storage: KnowledgeStorage, projectManager: ProjectContextManager) {
    this.storage = storage;
    this.projectManager = projectManager;
  }

  /**
   * Search for knowledge across projects
   */
  async search(
    query: string | KnowledgeQuery,
    options: CrossProjectSearchOptions = {}
  ): Promise<SearchResult[]> {
    // Merge options with defaults
    const mergedOptions: CrossProjectSearchOptions = {
      ...DEFAULT_SEARCH_OPTIONS,
      ...options,
    };

    // Get target project
    const targetProjectId =
      mergedOptions.targetProjectId || this.projectManager.getActiveProjectId();
    if (!targetProjectId) {
      throw new Error('No target project specified or active');
    }

    const targetProject = this.projectManager.getProject(targetProjectId);
    if (!targetProject) {
      throw new Error(`Target project with ID ${targetProjectId} not found`);
    }

    // Convert string query to KnowledgeQuery if needed
    const knowledgeQuery: KnowledgeQuery =
      typeof query === 'string' ? { searchTerm: query } : query;

    // Execute the query
    const result = await this.storage.queryKnowledge({
      ...knowledgeQuery,
      // Don't apply limit yet, as we'll filter and sort by relevance first
      limit: undefined,
    });

    // Filter out knowledge from the target project if not included
    let filteredKnowledge = result.knowledge;
    if (!mergedOptions.includeTargetProject) {
      filteredKnowledge = filteredKnowledge.filter(k => k.sourceProject !== targetProjectId);
    }

    // Calculate relevance and compatibility for each knowledge entity
    const searchResults: SearchResult[] = [];

    for (const knowledge of filteredKnowledge) {
      // Calculate relevance score
      const relevance = this.calculateRelevance(knowledge, knowledgeQuery, targetProject);

      // Skip if below minimum relevance
      if (relevance < (mergedOptions.minRelevance || 0)) {
        continue;
      }

      // Get source project
      const sourceProject = this.projectManager.getProject(knowledge.sourceProject);

      // Calculate compatibility score
      const compatibility = this.calculateCompatibility(knowledge, targetProject);

      // Skip if below minimum compatibility
      if (compatibility.score < (mergedOptions.minCompatibility || 0)) {
        continue;
      }

      // Add to results
      searchResults.push({
        knowledge,
        relevance,
        sourceProject,
        compatibilityScore: compatibility.score,
        compatibilityNotes: compatibility.notes,
      });
    }

    // Sort by relevance (highest first)
    searchResults.sort((a, b) => b.relevance - a.relevance);

    // Apply limit
    if (mergedOptions.limit !== undefined) {
      return searchResults.slice(0, mergedOptions.limit);
    }

    return searchResults;
  }

  /**
   * Calculate relevance score for a knowledge entity
   */
  private calculateRelevance(
    knowledge: Knowledge,
    query: KnowledgeQuery,
    targetProject: ProjectInfo
  ): number {
    let relevanceScore = 0;
    let factorsConsidered = 0;

    // Relevance based on search term
    if (query.searchTerm) {
      factorsConsidered++;
      const searchTermLower = query.searchTerm.toLowerCase();

      // Check title match
      if (knowledge.title.toLowerCase().includes(searchTermLower)) {
        relevanceScore += 1.0;
      }
      // Check description match
      else if (knowledge.description.toLowerCase().includes(searchTermLower)) {
        relevanceScore += 0.8;
      }
      // Check content match
      else if (knowledge.content.toLowerCase().includes(searchTermLower)) {
        relevanceScore += 0.6;
      }
      // Check tag match
      else if (knowledge.tags.some(tag => tag.toLowerCase().includes(searchTermLower))) {
        relevanceScore += 0.4;
      } else {
        relevanceScore += 0.1; // Small base score
      }
    }

    // Relevance based on knowledge type
    if (query.type) {
      factorsConsidered++;
      relevanceScore += knowledge.type === query.type ? 1.0 : 0.0;
    }

    // Relevance based on tags
    if (query.tags && query.tags.length > 0) {
      factorsConsidered++;
      const matchingTags = query.tags.filter(tag => knowledge.tags.includes(tag));
      relevanceScore += matchingTags.length / query.tags.length;
    }

    // Relevance based on language
    if (query.language || targetProject.primaryLanguage) {
      factorsConsidered++;
      const queryLanguage = query.language || targetProject.primaryLanguage;
      relevanceScore += knowledge.language === queryLanguage ? 1.0 : 0.0;
    }

    // Calculate final relevance score
    return factorsConsidered > 0 ? relevanceScore / factorsConsidered : 0.5;
  }

  /**
   * Calculate compatibility score for a knowledge entity with a target project
   */
  private calculateCompatibility(
    knowledge: Knowledge,
    targetProject: ProjectInfo
  ): { score: number; notes: string[] } {
    let compatibilityScore = 0;
    let factorsConsidered = 0;
    const notes: string[] = [];

    // Language compatibility
    if (knowledge.language) {
      factorsConsidered++;

      if (targetProject.languages.includes(knowledge.language)) {
        compatibilityScore += 1.0;
      } else {
        compatibilityScore += 0.0;
        notes.push(`Language mismatch: ${knowledge.language} not used in target project`);
      }
    }

    // Framework compatibility
    if (knowledge.compatibility?.frameworks && knowledge.compatibility.frameworks.length > 0) {
      factorsConsidered++;

      const matchingFrameworks = knowledge.compatibility.frameworks.filter(framework =>
        targetProject.frameworks.includes(framework)
      );

      const frameworkScore = matchingFrameworks.length / knowledge.compatibility.frameworks.length;
      compatibilityScore += frameworkScore;

      if (frameworkScore < 1.0) {
        notes.push(
          `Framework compatibility: ${matchingFrameworks.length}/${knowledge.compatibility.frameworks.length} frameworks match`
        );
      }
    }

    // Environment compatibility
    if (knowledge.compatibility?.environments && knowledge.compatibility.environments.length > 0) {
      factorsConsidered++;

      // This is a simplified check - in a real implementation, we would need
      // more information about the target project's environments
      const environmentScore = 0.8; // Assume reasonable compatibility
      compatibilityScore += environmentScore;

      notes.push(
        `Environment compatibility: assumed ${(environmentScore * 100).toFixed(0)}% compatible`
      );
    }

    // Dependency compatibility
    if (knowledge.metadata.dependencies) {
      factorsConsidered++;

      const knowledgeDeps = Object.keys(knowledge.metadata.dependencies || {});
      const targetDeps = Object.keys(targetProject.dependencies);

      const matchingDeps = knowledgeDeps.filter(dep => targetDeps.includes(dep));
      const depScore = knowledgeDeps.length > 0 ? matchingDeps.length / knowledgeDeps.length : 1.0;

      compatibilityScore += depScore;

      if (depScore < 1.0 && knowledgeDeps.length > 0) {
        notes.push(
          `Dependency compatibility: ${matchingDeps.length}/${knowledgeDeps.length} dependencies match`
        );
      }
    }

    // Add any explicit compatibility notes
    if (knowledge.compatibility?.notes) {
      notes.push(knowledge.compatibility.notes);
    }

    // Calculate final compatibility score
    const finalScore = factorsConsidered > 0 ? compatibilityScore / factorsConsidered : 0.5;

    return {
      score: finalScore,
      notes,
    };
  }
}
