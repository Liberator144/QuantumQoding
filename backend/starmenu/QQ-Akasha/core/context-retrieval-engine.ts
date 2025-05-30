/**
 * Context-based Retrieval Engine for QQ-Akasha
 * Implements advanced semantic search and context-aware memory retrieval
 */

import { Memory, MemoryQuery, MemoryResult, MemoryStorage } from './types';

/**
 * Context factors for relevance scoring
 */
export interface ContextFactors {
  /** Semantic similarity weight */
  semanticWeight: number;
  
  /** Recency weight */
  recencyWeight: number;
  
  /** Frequency weight */
  frequencyWeight: number;
  
  /** Tag similarity weight */
  tagWeight: number;
  
  /** Project context weight */
  projectWeight: number;
  
  /** File path similarity weight */
  filePathWeight: number;
}

/**
 * Default context factors
 */
export const DEFAULT_CONTEXT_FACTORS: ContextFactors = {
  semanticWeight: 0.4,
  recencyWeight: 0.2,
  frequencyWeight: 0.15,
  tagWeight: 0.15,
  projectWeight: 0.05,
  filePathWeight: 0.05,
};

/**
 * Context-based Retrieval Engine
 */
export class ContextRetrievalEngine {
  private storage: MemoryStorage;
  private contextFactors: ContextFactors;

  constructor(storage: MemoryStorage, contextFactors: ContextFactors = DEFAULT_CONTEXT_FACTORS) {
    this.storage = storage;
    this.contextFactors = contextFactors;
  }

  /**
   * Perform context-aware memory retrieval
   */
  async retrieveMemories(query: MemoryQuery): Promise<MemoryResult[]> {
    const startTime = Date.now();
    
    // Get base results from storage (disable contextual search to avoid recursion)
    const baseResults = await this.storage.queryMemories({
      ...query,
      useContextualSearch: false, // Prevent recursion
      sortBy: undefined, // We'll handle sorting ourselves
      limit: undefined, // We'll handle limiting after scoring
    });

    // If not using contextual search, return basic results
    if (!query.useContextualSearch) {
      return baseResults.memories.map(memory => ({ ...memory }));
    }

    // Calculate relevance scores for each memory
    const scoredResults = await Promise.all(
      baseResults.memories.map(memory => this.calculateRelevanceScore(memory, query))
    );

    // Sort by relevance score
    scoredResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    // Filter by similarity threshold if specified
    let filteredResults = scoredResults;
    if (query.similarityThreshold !== undefined) {
      filteredResults = scoredResults.filter(
        result => (result.relevanceScore || 0) >= query.similarityThreshold!
      );
    }

    // Include related memories if requested
    if (query.includeRelated) {
      filteredResults = await this.includeRelatedMemories(
        filteredResults,
        query.maxRelatedDepth || 2
      );
    }

    // Apply pagination
    if (query.offset !== undefined) {
      filteredResults = filteredResults.slice(query.offset);
    }
    if (query.limit !== undefined) {
      filteredResults = filteredResults.slice(0, query.limit);
    }

    return filteredResults;
  }

  /**
   * Calculate relevance score for a memory based on context
   */
  private async calculateRelevanceScore(memory: Memory, query: MemoryQuery): Promise<MemoryResult> {
    let totalScore = 0;
    const reasons: string[] = [];

    // Semantic similarity score
    if (query.searchTerm) {
      const semanticScore = this.calculateSemanticSimilarity(memory.content, query.searchTerm);
      totalScore += semanticScore * this.contextFactors.semanticWeight;
      if (semanticScore > 0.3) {
        reasons.push(`Content similarity: ${(semanticScore * 100).toFixed(1)}%`);
      }
    }

    // Recency score
    const recencyScore = this.calculateRecencyScore(memory.lastAccessedAt);
    totalScore += recencyScore * this.contextFactors.recencyWeight;
    if (recencyScore > 0.5) {
      reasons.push('Recently accessed');
    }

    // Frequency score
    const frequencyScore = this.calculateFrequencyScore(memory.accessCount);
    totalScore += frequencyScore * this.contextFactors.frequencyWeight;
    if (frequencyScore > 0.5) {
      reasons.push('Frequently accessed');
    }

    // Tag similarity score
    if (query.tags && query.tags.length > 0) {
      const tagScore = this.calculateTagSimilarity(memory.tags, query.tags);
      totalScore += tagScore * this.contextFactors.tagWeight;
      if (tagScore > 0.5) {
        reasons.push('Tag match');
      }
    }

    // Project context score
    if (query.context?.currentProject && memory.projectContext) {
      const projectScore = memory.projectContext === query.context.currentProject ? 1 : 0;
      totalScore += projectScore * this.contextFactors.projectWeight;
      if (projectScore > 0) {
        reasons.push('Same project');
      }
    }

    // File path similarity score
    if (query.context?.currentFile && memory.filePath) {
      const filePathScore = this.calculateFilePathSimilarity(
        memory.filePath,
        query.context.currentFile
      );
      totalScore += filePathScore * this.contextFactors.filePathWeight;
      if (filePathScore > 0.5) {
        reasons.push('Similar file path');
      }
    }

    return {
      ...memory,
      relevanceScore: Math.min(totalScore, 1), // Cap at 1.0
      relevanceReason: reasons.join(', ') || 'Basic match',
    };
  }

  /**
   * Calculate semantic similarity between two text strings
   */
  private calculateSemanticSimilarity(content: string, searchTerm: string): number {
    // Simple implementation using word overlap and TF-IDF-like scoring
    const contentWords = this.extractWords(content.toLowerCase());
    const searchWords = this.extractWords(searchTerm.toLowerCase());

    if (searchWords.length === 0) return 0;

    // Calculate word overlap
    const commonWords = searchWords.filter(word => contentWords.includes(word));
    const overlapScore = commonWords.length / searchWords.length;

    // Boost score for exact phrase matches
    const phraseBoost = content.toLowerCase().includes(searchTerm.toLowerCase()) ? 0.3 : 0;

    return Math.min(overlapScore + phraseBoost, 1);
  }

  /**
   * Calculate recency score based on last access time
   */
  private calculateRecencyScore(lastAccessedAt: Date): number {
    const now = new Date();
    const daysSinceAccess = (now.getTime() - lastAccessedAt.getTime()) / (1000 * 60 * 60 * 24);

    // Score decreases exponentially with time
    return Math.exp(-daysSinceAccess / 30); // Half-life of 30 days
  }

  /**
   * Calculate frequency score based on access count
   */
  private calculateFrequencyScore(accessCount: number): number {
    // Logarithmic scaling to prevent very high access counts from dominating
    return Math.min(Math.log(accessCount + 1) / Math.log(100), 1);
  }

  /**
   * Calculate tag similarity score
   */
  private calculateTagSimilarity(memoryTags: string[], queryTags: string[]): number {
    if (queryTags.length === 0) return 0;

    const commonTags = queryTags.filter(tag => 
      memoryTags.some(memTag => memTag.toLowerCase().includes(tag.toLowerCase()))
    );

    return commonTags.length / queryTags.length;
  }

  /**
   * Calculate file path similarity score
   */
  private calculateFilePathSimilarity(memoryPath: string, currentPath: string): number {
    const memoryParts = memoryPath.split('/');
    const currentParts = currentPath.split('/');

    // Score based on common path segments
    let commonSegments = 0;
    const minLength = Math.min(memoryParts.length, currentParts.length);

    for (let i = 0; i < minLength; i++) {
      if (memoryParts[i] === currentParts[i]) {
        commonSegments++;
      } else {
        break;
      }
    }

    return commonSegments / Math.max(memoryParts.length, currentParts.length);
  }

  /**
   * Extract words from text for similarity calculation
   */
  private extractWords(text: string): string[] {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word));
  }

  /**
   * Check if a word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);
    return stopWords.has(word.toLowerCase());
  }

  /**
   * Include related memories in results
   */
  private async includeRelatedMemories(
    results: MemoryResult[],
    maxDepth: number
  ): Promise<MemoryResult[]> {
    const enhancedResults: MemoryResult[] = [];

    for (const result of results) {
      const relatedMemories = await this.findRelatedMemories(result, maxDepth);
      enhancedResults.push({
        ...result,
        relatedResults: relatedMemories,
      });
    }

    return enhancedResults;
  }

  /**
   * Find related memories for a given memory
   */
  private async findRelatedMemories(
    memory: MemoryResult,
    maxDepth: number,
    visited: Set<string> = new Set()
  ): Promise<MemoryResult[]> {
    if (maxDepth <= 0 || visited.has(memory.id)) {
      return [];
    }

    visited.add(memory.id);
    const related: MemoryResult[] = [];

    // Find memories with explicit relationships
    if (memory.relatedMemories) {
      for (const relatedId of memory.relatedMemories) {
        const relatedMemory = await this.storage.getMemory(relatedId);
        if (relatedMemory && !visited.has(relatedMemory.id)) {
          const relatedResult: MemoryResult = {
            ...relatedMemory,
            relevanceScore: 0.8, // High score for explicit relationships
            relevanceReason: 'Explicitly related',
          };

          // Recursively find related memories
          const deeperRelated = await this.findRelatedMemories(
            relatedResult,
            maxDepth - 1,
            visited
          );
          relatedResult.relatedResults = deeperRelated;

          related.push(relatedResult);
        }
      }
    }

    // Find memories with similar tags
    const tagQuery: MemoryQuery = {
      tags: memory.tags,
      limit: 5,
      useContextualSearch: false, // Prevent recursion
    };

    const tagResults = await this.storage.queryMemories(tagQuery);
    for (const tagMemory of tagResults.memories) {
      if (!visited.has(tagMemory.id) && tagMemory.id !== memory.id) {
        related.push({
          ...tagMemory,
          relevanceScore: 0.6,
          relevanceReason: 'Similar tags',
        });
      }
    }

    return related.slice(0, 3); // Limit to top 3 related memories
  }
}
