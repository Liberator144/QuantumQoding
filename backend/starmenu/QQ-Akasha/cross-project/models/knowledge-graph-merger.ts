/**
 * Knowledge Graph Merger for Cross-Project Knowledge Transfer
 * Merges multiple knowledge graphs into a unified graph
 */

import { v4 as uuidv4 } from 'uuid';
import {
  DEFAULT_GRAPH_MERGE_OPTIONS,
  GraphMergeOptions,
  GraphMergeResult,
  GraphMergeStrategy,
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelationship,
  KnowledgeRelationshipType,
} from './knowledge-graph';
import { KnowledgeGraphBuilder } from './knowledge-graph-builder';

/**
 * Merges multiple knowledge graphs into a unified graph
 */
export class KnowledgeGraphMerger {
  private graphBuilder: KnowledgeGraphBuilder;

  constructor(graphBuilder: KnowledgeGraphBuilder) {
    this.graphBuilder = graphBuilder;
  }

  /**
   * Merge two knowledge graphs
   */
  async mergeGraphs(
    graph1: KnowledgeGraph,
    graph2: KnowledgeGraph,
    options: Partial<GraphMergeOptions> = {}
  ): Promise<GraphMergeResult> {
    // Merge options with defaults
    const mergedOptions: GraphMergeOptions = {
      ...DEFAULT_GRAPH_MERGE_OPTIONS,
      ...options,
    };

    // Use custom merge function if provided
    if (mergedOptions.strategy === GraphMergeStrategy.CUSTOM && mergedOptions.customMergeFunction) {
      const mergedGraph = await mergedOptions.customMergeFunction(graph1, graph2);

      return {
        graph: mergedGraph,
        stats: this.calculateMergeStats(graph1, graph2, mergedGraph),
        notes: ['Used custom merge function'],
      };
    }

    // Create a new graph for the result
    const mergedGraph: KnowledgeGraph = {
      id: uuidv4(),
      name: `Merged: ${graph1.name} + ${graph2.name}`,
      description: `Merged graph from ${graph1.name} and ${graph2.name}`,
      nodes: new Map(),
      relationships: new Map(),
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        projects: [...new Set([...graph1.metadata.projects, ...graph2.metadata.projects])],
        knowledgeTypes: [
          ...new Set([...graph1.metadata.knowledgeTypes, ...graph2.metadata.knowledgeTypes]),
        ],
        parentGraphs: [graph1.id, graph2.id],
        mergeStrategy: mergedOptions.strategy,
      },
    };

    const notes: string[] = [];
    let conflicts = 0;
    let conflictResolution = '';

    // Apply merge strategy
    switch (mergedOptions.strategy) {
      case GraphMergeStrategy.UNION:
        await this.applyUnionStrategy(graph1, graph2, mergedGraph, mergedOptions, notes);
        conflictResolution = 'Kept all nodes and relationships';
        break;

      case GraphMergeStrategy.INTERSECTION:
        await this.applyIntersectionStrategy(graph1, graph2, mergedGraph, mergedOptions, notes);
        conflictResolution = 'Kept only nodes and relationships present in both graphs';
        break;

      case GraphMergeStrategy.FIRST_PRIORITY:
        conflicts = await this.applyPriorityStrategy(
          graph1,
          graph2,
          mergedGraph,
          mergedOptions,
          true,
          notes
        );
        conflictResolution = 'Prioritized first graph in conflicts';
        break;

      case GraphMergeStrategy.SECOND_PRIORITY:
        conflicts = await this.applyPriorityStrategy(
          graph1,
          graph2,
          mergedGraph,
          mergedOptions,
          false,
          notes
        );
        conflictResolution = 'Prioritized second graph in conflicts';
        break;

      default:
        throw new Error(`Unsupported merge strategy: ${mergedOptions.strategy}`);
    }

    // Create cross-graph relationships if requested
    let newCrossGraphRelationships = 0;

    if (mergedOptions.createCrossGraphRelationships) {
      newCrossGraphRelationships = await this.createCrossGraphRelationships(
        mergedGraph,
        mergedOptions.minCrossGraphSimilarity,
        mergedOptions.maxCrossGraphRelationships,
        notes
      );
    }

    // Calculate merge statistics
    const stats = this.calculateMergeStats(graph1, graph2, mergedGraph);
    stats.conflicts = conflicts;
    stats.conflictResolution = conflictResolution;
    stats.newCrossGraphRelationships = newCrossGraphRelationships;

    return {
      graph: mergedGraph,
      stats,
      notes,
    };
  }

  /**
   * Apply union merge strategy
   * Keeps all nodes and relationships from both graphs
   */
  private async applyUnionStrategy(
    graph1: KnowledgeGraph,
    graph2: KnowledgeGraph,
    mergedGraph: KnowledgeGraph,
    options: GraphMergeOptions,
    notes: string[]
  ): Promise<void> {
    // Add all nodes from both graphs
    for (const [nodeId, node] of graph1.nodes.entries()) {
      mergedGraph.nodes.set(nodeId, this.cloneNode(node));
    }

    for (const [nodeId, node] of graph2.nodes.entries()) {
      if (mergedGraph.nodes.has(nodeId)) {
        // Node exists in both graphs, merge metadata if requested
        if (options.mergeNodeMetadata) {
          const existingNode = mergedGraph.nodes.get(nodeId)!;
          const mergedNode = this.mergeNodeMetadata(existingNode, node);
          mergedGraph.nodes.set(nodeId, mergedNode);
          notes.push(`Merged metadata for node ${nodeId}`);
        }
      } else {
        // Node only exists in second graph, add it
        mergedGraph.nodes.set(nodeId, this.cloneNode(node));
      }
    }

    // Add all relationships from both graphs that meet the strength threshold
    for (const [relationshipId, relationship] of graph1.relationships.entries()) {
      if (
        relationship.strength >= options.minRelationshipStrength &&
        mergedGraph.nodes.has(relationship.sourceId) &&
        mergedGraph.nodes.has(relationship.targetId)
      ) {
        mergedGraph.relationships.set(relationshipId, this.cloneRelationship(relationship));
      }
    }

    for (const [relationshipId, relationship] of graph2.relationships.entries()) {
      if (
        relationship.strength >= options.minRelationshipStrength &&
        mergedGraph.nodes.has(relationship.sourceId) &&
        mergedGraph.nodes.has(relationship.targetId)
      ) {
        if (mergedGraph.relationships.has(relationshipId)) {
          // Relationship exists in both graphs, merge metadata if requested
          if (options.mergeRelationshipMetadata) {
            const existingRelationship = mergedGraph.relationships.get(relationshipId)!;
            const mergedRelationship = this.mergeRelationshipMetadata(
              existingRelationship,
              relationship
            );
            mergedGraph.relationships.set(relationshipId, mergedRelationship);
            notes.push(`Merged metadata for relationship ${relationshipId}`);
          }
        } else {
          // Relationship only exists in second graph, add it
          mergedGraph.relationships.set(relationshipId, this.cloneRelationship(relationship));
        }
      }
    }

    notes.push(`Applied union strategy: kept all nodes and relationships from both graphs`);
  }

  /**
   * Apply intersection merge strategy
   * Keeps only nodes and relationships that exist in both graphs
   */
  private async applyIntersectionStrategy(
    graph1: KnowledgeGraph,
    graph2: KnowledgeGraph,
    mergedGraph: KnowledgeGraph,
    options: GraphMergeOptions,
    notes: string[]
  ): Promise<void> {
    // Add only nodes that exist in both graphs
    for (const [nodeId, node] of graph1.nodes.entries()) {
      if (graph2.nodes.has(nodeId)) {
        const node2 = graph2.nodes.get(nodeId)!;

        // Merge node metadata if requested
        if (options.mergeNodeMetadata) {
          const mergedNode = this.mergeNodeMetadata(node, node2);
          mergedGraph.nodes.set(nodeId, mergedNode);
        } else {
          // Otherwise use node from first graph
          mergedGraph.nodes.set(nodeId, this.cloneNode(node));
        }
      }
    }

    // Add only relationships that exist in both graphs
    for (const [relationshipId, relationship] of graph1.relationships.entries()) {
      if (
        graph2.relationships.has(relationshipId) &&
        relationship.strength >= options.minRelationshipStrength &&
        mergedGraph.nodes.has(relationship.sourceId) &&
        mergedGraph.nodes.has(relationship.targetId)
      ) {
        const relationship2 = graph2.relationships.get(relationshipId)!;

        // Merge relationship metadata if requested
        if (options.mergeRelationshipMetadata) {
          const mergedRelationship = this.mergeRelationshipMetadata(relationship, relationship2);
          mergedGraph.relationships.set(relationshipId, mergedRelationship);
        } else {
          // Otherwise use relationship from first graph
          mergedGraph.relationships.set(relationshipId, this.cloneRelationship(relationship));
        }
      }
    }

    notes.push(
      `Applied intersection strategy: kept only nodes and relationships present in both graphs`
    );
  }

  /**
   * Apply priority merge strategy
   * Keeps nodes and relationships from the priority graph, adds from the other if not conflicting
   */
  private async applyPriorityStrategy(
    graph1: KnowledgeGraph,
    graph2: KnowledgeGraph,
    mergedGraph: KnowledgeGraph,
    options: GraphMergeOptions,
    firstPriority: boolean,
    notes: string[]
  ): Promise<number> {
    // Determine priority and secondary graphs
    const priorityGraph = firstPriority ? graph1 : graph2;
    const secondaryGraph = firstPriority ? graph2 : graph1;

    let conflicts = 0;

    // Add all nodes from priority graph
    for (const [nodeId, node] of priorityGraph.nodes.entries()) {
      mergedGraph.nodes.set(nodeId, this.cloneNode(node));
    }

    // Add nodes from secondary graph that don't conflict
    for (const [nodeId, node] of secondaryGraph.nodes.entries()) {
      if (mergedGraph.nodes.has(nodeId)) {
        // Node exists in both graphs, this is a conflict
        conflicts++;

        // Merge metadata if requested
        if (options.mergeNodeMetadata) {
          const existingNode = mergedGraph.nodes.get(nodeId)!;
          const mergedNode = this.mergeNodeMetadata(existingNode, node);
          mergedGraph.nodes.set(nodeId, mergedNode);
          notes.push(`Merged metadata for conflicting node ${nodeId}`);
        }
      } else {
        // Node only exists in secondary graph, add it
        mergedGraph.nodes.set(nodeId, this.cloneNode(node));
      }
    }

    // Add all relationships from priority graph that meet the strength threshold
    for (const [relationshipId, relationship] of priorityGraph.relationships.entries()) {
      if (
        relationship.strength >= options.minRelationshipStrength &&
        mergedGraph.nodes.has(relationship.sourceId) &&
        mergedGraph.nodes.has(relationship.targetId)
      ) {
        mergedGraph.relationships.set(relationshipId, this.cloneRelationship(relationship));
      }
    }

    // Add relationships from secondary graph that don't conflict
    for (const [relationshipId, relationship] of secondaryGraph.relationships.entries()) {
      if (
        relationship.strength >= options.minRelationshipStrength &&
        mergedGraph.nodes.has(relationship.sourceId) &&
        mergedGraph.nodes.has(relationship.targetId)
      ) {
        if (mergedGraph.relationships.has(relationshipId)) {
          // Relationship exists in both graphs, this is a conflict
          conflicts++;

          // Merge metadata if requested
          if (options.mergeRelationshipMetadata) {
            const existingRelationship = mergedGraph.relationships.get(relationshipId)!;
            const mergedRelationship = this.mergeRelationshipMetadata(
              existingRelationship,
              relationship
            );
            mergedGraph.relationships.set(relationshipId, mergedRelationship);
            notes.push(`Merged metadata for conflicting relationship ${relationshipId}`);
          }
        } else {
          // Relationship only exists in secondary graph, add it
          mergedGraph.relationships.set(relationshipId, this.cloneRelationship(relationship));
        }
      }
    }

    notes.push(
      `Applied ${firstPriority ? 'first' : 'second'} priority strategy: prioritized ${firstPriority ? 'first' : 'second'} graph in conflicts`
    );
    return conflicts;
  }

  /**
   * Create relationships between nodes from different graphs
   */
  private async createCrossGraphRelationships(
    graph: KnowledgeGraph,
    minSimilarity: number,
    maxRelationships: number,
    notes: string[]
  ): Promise<number> {
    // This is a simplified implementation
    // A real implementation would use more sophisticated similarity metrics

    // Get all nodes
    const nodes = Array.from(graph.nodes.values());

    // Track created relationships
    let createdCount = 0;

    // Compare each pair of nodes
    for (let i = 0; i < nodes.length && createdCount < maxRelationships; i++) {
      for (let j = i + 1; j < nodes.length && createdCount < maxRelationships; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        // Skip if there's already a relationship between these nodes
        const existingRelationship = this.findRelationship(graph, node1.id, node2.id);
        if (existingRelationship) {
          continue;
        }

        // Skip if nodes are from the same project
        if (node1.knowledge.sourceProject === node2.knowledge.sourceProject) {
          continue;
        }

        // Calculate similarity
        const similarity = this.calculateNodeSimilarity(node1, node2);

        // Create relationship if similarity is high enough
        if (similarity >= minSimilarity) {
          const relationship: KnowledgeRelationship = {
            id: uuidv4(),
            sourceId: node1.id,
            targetId: node2.id,
            type: KnowledgeRelationshipType.SIMILAR_TO,
            strength: similarity,
            direction: 'bi',
            metadata: {
              createdAt: new Date(),
              createdBy: 'graph-merger',
              confidence: similarity,
              isCrossProject: true,
            },
          };

          graph.relationships.set(relationship.id, relationship);
          createdCount++;
        }
      }
    }

    if (createdCount > 0) {
      notes.push(`Created ${createdCount} cross-project relationships`);
    }

    return createdCount;
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
   * Calculate similarity between two nodes
   */
  private calculateNodeSimilarity(node1: KnowledgeNode, node2: KnowledgeNode): number {
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

  /**
   * Clone a node
   */
  private cloneNode(node: KnowledgeNode): KnowledgeNode {
    return {
      id: node.id,
      knowledge: node.knowledge,
      metadata: { ...node.metadata },
    };
  }

  /**
   * Clone a relationship
   */
  private cloneRelationship(relationship: KnowledgeRelationship): KnowledgeRelationship {
    return {
      id: relationship.id,
      sourceId: relationship.sourceId,
      targetId: relationship.targetId,
      type: relationship.type,
      strength: relationship.strength,
      direction: relationship.direction,
      metadata: { ...relationship.metadata },
    };
  }

  /**
   * Merge metadata from two nodes
   */
  private mergeNodeMetadata(node1: KnowledgeNode, node2: KnowledgeNode): KnowledgeNode {
    // Create a new node with merged metadata
    const mergedNode: KnowledgeNode = {
      id: node1.id,
      knowledge: node1.knowledge, // Keep knowledge from first node
      metadata: { ...node1.metadata }, // Start with metadata from first node
    };

    // Merge importance (take the higher value)
    if (node2.metadata.importance > node1.metadata.importance) {
      mergedNode.metadata.importance = node2.metadata.importance;
    }

    // Merge centrality if present (take the higher value)
    if (
      node2.metadata.centrality !== undefined &&
      (node1.metadata.centrality === undefined ||
        node2.metadata.centrality > node1.metadata.centrality)
    ) {
      mergedNode.metadata.centrality = node2.metadata.centrality;
    }

    // Merge community if present
    if (node2.metadata.community !== undefined) {
      if (node1.metadata.community !== undefined) {
        // Both nodes have community, create a combined one
        mergedNode.metadata.community = `${node1.metadata.community}+${node2.metadata.community}`;
      } else {
        // Only second node has community, use it
        mergedNode.metadata.community = node2.metadata.community;
      }
    }

    // Merge other metadata properties
    for (const [key, value] of Object.entries(node2.metadata)) {
      if (key !== 'importance' && key !== 'centrality' && key !== 'community') {
        // If property doesn't exist in first node, add it
        if (mergedNode.metadata[key] === undefined) {
          mergedNode.metadata[key] = value;
        }
        // If property exists in both and is an array, concatenate
        else if (Array.isArray(mergedNode.metadata[key]) && Array.isArray(value)) {
          mergedNode.metadata[key] = [...mergedNode.metadata[key], ...value];
        }
        // If property exists in both and is an object, merge
        else if (
          typeof mergedNode.metadata[key] === 'object' &&
          typeof value === 'object' &&
          mergedNode.metadata[key] !== null &&
          value !== null
        ) {
          mergedNode.metadata[key] = {
            ...mergedNode.metadata[key],
            ...value,
          };
        }
        // Otherwise keep the value from the first node
      }
    }

    return mergedNode;
  }

  /**
   * Merge metadata from two relationships
   */
  private mergeRelationshipMetadata(
    relationship1: KnowledgeRelationship,
    relationship2: KnowledgeRelationship
  ): KnowledgeRelationship {
    // Create a new relationship with merged metadata
    const mergedRelationship: KnowledgeRelationship = {
      id: relationship1.id,
      sourceId: relationship1.sourceId,
      targetId: relationship1.targetId,
      type: relationship1.type,
      strength: Math.max(relationship1.strength, relationship2.strength),
      direction: relationship1.direction,
      metadata: { ...relationship1.metadata }, // Start with metadata from first relationship
    };

    // Merge confidence (take the higher value)
    if (relationship2.metadata.confidence > relationship1.metadata.confidence) {
      mergedRelationship.metadata.confidence = relationship2.metadata.confidence;
    }

    // Merge other metadata properties
    for (const [key, value] of Object.entries(relationship2.metadata)) {
      if (key !== 'confidence') {
        // If property doesn't exist in first relationship, add it
        if (mergedRelationship.metadata[key] === undefined) {
          mergedRelationship.metadata[key] = value;
        }
        // If property exists in both and is an array, concatenate
        else if (Array.isArray(mergedRelationship.metadata[key]) && Array.isArray(value)) {
          mergedRelationship.metadata[key] = [...mergedRelationship.metadata[key], ...value];
        }
        // If property exists in both and is an object, merge
        else if (
          typeof mergedRelationship.metadata[key] === 'object' &&
          typeof value === 'object' &&
          mergedRelationship.metadata[key] !== null &&
          value !== null
        ) {
          mergedRelationship.metadata[key] = {
            ...mergedRelationship.metadata[key],
            ...value,
          };
        }
        // Otherwise keep the value from the first relationship
      }
    }

    return mergedRelationship;
  }

  /**
   * Calculate statistics about a merge operation
   */
  private calculateMergeStats(
    graph1: KnowledgeGraph,
    graph2: KnowledgeGraph,
    mergedGraph: KnowledgeGraph
  ): any {
    // Count nodes from each graph
    const nodeIds1 = new Set(graph1.nodes.keys());
    const nodeIds2 = new Set(graph2.nodes.keys());
    const mergedNodeIds = new Set(mergedGraph.nodes.keys());

    // Count relationships from each graph
    const relationshipIds1 = new Set(graph1.relationships.keys());
    const relationshipIds2 = new Set(graph2.relationships.keys());
    const mergedRelationshipIds = new Set(mergedGraph.relationships.keys());

    // Count nodes from each graph in the merged graph
    let nodesFromGraph1 = 0;
    let nodesFromGraph2 = 0;

    for (const nodeId of mergedNodeIds) {
      if (nodeIds1.has(nodeId)) {
        nodesFromGraph1++;
      }
      if (nodeIds2.has(nodeId)) {
        nodesFromGraph2++;
      }
    }

    // Count relationships from each graph in the merged graph
    let relationshipsFromGraph1 = 0;
    let relationshipsFromGraph2 = 0;

    for (const relationshipId of mergedRelationshipIds) {
      if (relationshipIds1.has(relationshipId)) {
        relationshipsFromGraph1++;
      }
      if (relationshipIds2.has(relationshipId)) {
        relationshipsFromGraph2++;
      }
    }

    return {
      nodesFromGraph1,
      nodesFromGraph2,
      totalNodes: mergedNodeIds.size,
      relationshipsFromGraph1,
      relationshipsFromGraph2,
      totalRelationships: mergedRelationshipIds.size,
      conflicts: 0, // Will be updated by the calling method
      conflictResolution: '', // Will be updated by the calling method
      newCrossGraphRelationships: 0, // Will be updated by the calling method
    };
  }
}
