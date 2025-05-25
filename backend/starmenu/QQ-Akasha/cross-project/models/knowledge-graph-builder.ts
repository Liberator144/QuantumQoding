/**
 * Knowledge Graph Builder for Cross-Project Knowledge Transfer
 * Builds knowledge graphs from knowledge entities
 */

import { v4 as uuidv4 } from 'uuid';
import { Knowledge, KnowledgeQuery, KnowledgeType } from '../types';
import { KnowledgeStorage } from '../knowledge-storage';
import { ProjectContextManager } from '../project-context';
import {
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelationship,
  KnowledgeRelationshipType,
} from './knowledge-graph';

/**
 * Options for building a knowledge graph
 */
export interface GraphBuildOptions {
  /** Name for the graph */
  name: string;

  /** Description for the graph */
  description?: string;

  /** Project IDs to include */
  projectIds?: string[];

  /** Knowledge types to include */
  knowledgeTypes?: KnowledgeType[];

  /** Whether to include relationships */
  includeRelationships: boolean;

  /** Minimum relationship strength to include (0-1) */
  minRelationshipStrength: number;

  /** Whether to detect implicit relationships */
  detectImplicitRelationships: boolean;

  /** Minimum similarity score for implicit relationships (0-1) */
  minImplicitSimilarity: number;

  /** Maximum number of implicit relationships to create */
  maxImplicitRelationships: number;
}

/**
 * Default graph build options
 */
export const DEFAULT_GRAPH_BUILD_OPTIONS: GraphBuildOptions = {
  name: 'Knowledge Graph',
  includeRelationships: true,
  minRelationshipStrength: 0.3,
  detectImplicitRelationships: true,
  minImplicitSimilarity: 0.7,
  maxImplicitRelationships: 100,
};

/**
 * Builds knowledge graphs from knowledge entities
 */
export class KnowledgeGraphBuilder {
  private storage: KnowledgeStorage;
  private projectManager: ProjectContextManager;

  constructor(storage: KnowledgeStorage, projectManager: ProjectContextManager) {
    this.storage = storage;
    this.projectManager = projectManager;
  }

  /**
   * Build a knowledge graph from a query
   */
  async buildGraph(
    query: KnowledgeQuery = {},
    options: Partial<GraphBuildOptions> = {}
  ): Promise<KnowledgeGraph> {
    // Merge options with defaults
    const mergedOptions: GraphBuildOptions = {
      ...DEFAULT_GRAPH_BUILD_OPTIONS,
      ...options,
    };

    // Apply project and knowledge type filters if specified
    if (mergedOptions.projectIds && mergedOptions.projectIds.length > 0) {
      query.sourceProject = mergedOptions.projectIds[0]; // Simple implementation for now
    }

    if (mergedOptions.knowledgeTypes && mergedOptions.knowledgeTypes.length > 0) {
      query.type = mergedOptions.knowledgeTypes[0]; // Simple implementation for now
    }

    // Query knowledge entities
    const result = await this.storage.queryKnowledge(query);

    // Create graph
    const graph: KnowledgeGraph = {
      id: uuidv4(),
      name: mergedOptions.name,
      description: mergedOptions.description,
      nodes: new Map(),
      relationships: new Map(),
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        projects: mergedOptions.projectIds || [],
        knowledgeTypes: mergedOptions.knowledgeTypes || [],
        query: JSON.stringify(query),
      },
    };

    // Add nodes for each knowledge entity
    for (const knowledge of result.knowledge) {
      const node = this.createNode(knowledge);
      graph.nodes.set(node.id, node);
    }

    // Add relationships if requested
    if (mergedOptions.includeRelationships) {
      await this.addRelationships(graph, mergedOptions.minRelationshipStrength);

      // Detect implicit relationships if requested
      if (mergedOptions.detectImplicitRelationships) {
        await this.detectImplicitRelationships(
          graph,
          mergedOptions.minImplicitSimilarity,
          mergedOptions.maxImplicitRelationships
        );
      }
    }

    return graph;
  }

  /**
   * Create a node from a knowledge entity
   */
  private createNode(knowledge: Knowledge): KnowledgeNode {
    return {
      id: knowledge.id,
      knowledge,
      metadata: {
        importance: this.calculateImportance(knowledge),
        createdAt: knowledge.createdAt,
      },
    };
  }

  /**
   * Calculate importance score for a knowledge entity
   */
  private calculateImportance(knowledge: Knowledge): number {
    // This is a simplified implementation
    // A real implementation would use more sophisticated metrics

    let importance = 0.5; // Base importance

    // Adjust based on access count
    if (knowledge.accessCount > 0) {
      importance += Math.min(0.3, knowledge.accessCount / 20);
    }

    // Adjust based on application count
    if (knowledge.applicationCount > 0) {
      importance += Math.min(0.3, knowledge.applicationCount / 10);
    }

    // Adjust based on applied projects count
    if (knowledge.appliedProjects.length > 0) {
      importance += Math.min(0.2, knowledge.appliedProjects.length / 5);
    }

    // Cap at 1.0
    return Math.min(1.0, importance);
  }

  /**
   * Add relationships to the graph
   */
  private async addRelationships(graph: KnowledgeGraph, minStrength: number): Promise<void> {
    // Get all node IDs
    const nodeIds = Array.from(graph.nodes.keys());

    // Check each node for explicit relationships
    for (const nodeId of nodeIds) {
      const node = graph.nodes.get(nodeId);

      if (!node) {
        continue;
      }

      const knowledge = node.knowledge;

      // Check for related memories in metadata
      if (knowledge.metadata.relatedMemories) {
        for (const relatedId of knowledge.metadata.relatedMemories) {
          // Only add if the related node is in the graph
          if (graph.nodes.has(relatedId)) {
            const relationship = this.createRelationship(
              nodeId,
              relatedId,
              KnowledgeRelationshipType.RELATED,
              0.8, // High strength for explicit relationships
              'bi'
            );

            graph.relationships.set(relationship.id, relationship);
          }
        }
      }

      // Check for dependencies in metadata
      if (knowledge.metadata.dependencies) {
        for (const dependencyId of knowledge.metadata.dependencies) {
          // Only add if the dependency node is in the graph
          if (graph.nodes.has(dependencyId)) {
            const relationship = this.createRelationship(
              nodeId,
              dependencyId,
              KnowledgeRelationshipType.DEPENDS_ON,
              0.9, // Very high strength for dependencies
              'uni'
            );

            graph.relationships.set(relationship.id, relationship);
          }
        }
      }
    }
  }

  /**
   * Detect implicit relationships between nodes
   */
  private async detectImplicitRelationships(
    graph: KnowledgeGraph,
    minSimilarity: number,
    maxRelationships: number
  ): Promise<void> {
    // Get all nodes
    const nodes = Array.from(graph.nodes.values());

    // Track detected relationships to limit the total
    let detectedCount = 0;

    // Compare each pair of nodes
    for (let i = 0; i < nodes.length && detectedCount < maxRelationships; i++) {
      for (let j = i + 1; j < nodes.length && detectedCount < maxRelationships; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        // Skip if there's already a relationship between these nodes
        const existingRelationship = this.findRelationship(graph, node1.id, node2.id);
        if (existingRelationship) {
          continue;
        }

        // Calculate similarity
        const similarity = await this.calculateSimilarity(node1, node2);

        // Create relationship if similarity is high enough
        if (similarity >= minSimilarity) {
          const relationship = this.createRelationship(
            node1.id,
            node2.id,
            KnowledgeRelationshipType.SIMILAR_TO,
            similarity,
            'bi'
          );

          graph.relationships.set(relationship.id, relationship);
          detectedCount++;
        }
      }
    }
  }

  /**
   * Find an existing relationship between two nodes
   */
  private findRelationship(
    graph: KnowledgeGraph,
    nodeId1: string,
    nodeId2: string
  ): KnowledgeRelationship | undefined {
    for (const relationship of graph.relationships.values()) {
      if (
        (relationship.sourceId === nodeId1 && relationship.targetId === nodeId2) ||
        (relationship.sourceId === nodeId2 && relationship.targetId === nodeId1)
      ) {
        return relationship;
      }
    }

    return undefined;
  }

  /**
   * Create a relationship between two nodes
   */
  private createRelationship(
    sourceId: string,
    targetId: string,
    type: KnowledgeRelationshipType,
    strength: number,
    direction: 'uni' | 'bi'
  ): KnowledgeRelationship {
    return {
      id: uuidv4(),
      sourceId,
      targetId,
      type,
      strength,
      direction,
      metadata: {
        createdAt: new Date(),
        createdBy: 'system',
        confidence: strength,
      },
    };
  }

  /**
   * Calculate similarity between two nodes
   */
  private async calculateSimilarity(node1: KnowledgeNode, node2: KnowledgeNode): Promise<number> {
    // This is a simplified implementation
    // A real implementation would use more sophisticated similarity metrics

    const knowledge1 = node1.knowledge;
    const knowledge2 = node2.knowledge;

    let similarityScore = 0;
    let factorsConsidered = 0;

    // Compare knowledge types
    factorsConsidered++;
    if (knowledge1.type === knowledge2.type) {
      similarityScore += 1.0;
    } else {
      similarityScore += 0.2; // Small similarity for different types
    }

    // Compare tags
    if (knowledge1.tags.length > 0 && knowledge2.tags.length > 0) {
      factorsConsidered++;

      const commonTags = knowledge1.tags.filter(tag => knowledge2.tags.includes(tag));

      const tagSimilarity =
        commonTags.length / Math.max(knowledge1.tags.length, knowledge2.tags.length);

      similarityScore += tagSimilarity;
    }

    // Compare content (simple text similarity)
    factorsConsidered++;
    const contentSimilarity = this.calculateTextSimilarity(knowledge1.content, knowledge2.content);

    similarityScore += contentSimilarity;

    // Compare projects
    factorsConsidered++;
    if (knowledge1.sourceProject === knowledge2.sourceProject) {
      similarityScore += 0.8;
    } else {
      // Check if projects are similar
      const project1 = this.projectManager.getProject(knowledge1.sourceProject);
      const project2 = this.projectManager.getProject(knowledge2.sourceProject);

      if (project1 && project2) {
        // Check for common languages
        const commonLanguages = project1.languages.filter(lang =>
          project2.languages.includes(lang)
        );

        if (commonLanguages.length > 0) {
          similarityScore += 0.4;
        }
      } else {
        similarityScore += 0.1; // Small similarity for different projects
      }
    }

    // Calculate final similarity score
    return factorsConsidered > 0 ? similarityScore / factorsConsidered : 0;
  }

  /**
   * Calculate text similarity between two strings
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    // This is a simplified implementation using Jaccard similarity
    // A real implementation would use more sophisticated NLP techniques

    // Tokenize texts
    const tokens1 = new Set(
      text1
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 3)
    );

    const tokens2 = new Set(
      text2
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 3)
    );

    // Calculate Jaccard similarity
    const intersection = new Set([...tokens1].filter(token => tokens2.has(token)));

    const union = new Set([...tokens1, ...tokens2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }
}
