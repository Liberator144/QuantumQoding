/**
 * Graph Builder for Memory Visualization
 * Builds memory graphs for visualization
 */

import { v4 as uuidv4 } from 'uuid';
import { Memory, MemoryBank, MemoryQuery } from '../core';
import { MemoryEdge, MemoryGraph, MemoryNode, MemoryRelationshipType } from './types';

export class GraphBuilder {
  private memoryBank: MemoryBank;

  constructor(memoryBank: MemoryBank) {
    this.memoryBank = memoryBank;
  }

  /**
   * Build a memory graph from a query
   */
  async buildGraph(
    query: MemoryQuery = {},
    options: {
      includeRelated?: boolean;
      maxRelatedDepth?: number;
      title?: string;
      description?: string;
    } = {}
  ): Promise<MemoryGraph> {
    const {
      includeRelated = true,
      maxRelatedDepth = 1,
      title = 'Memory Graph',
      description = 'Generated memory visualization',
    } = options;

    // Get initial memories from query
    const result = await this.memoryBank.queryMemories(query);
    const memories = result.memories;

    // Create nodes for each memory
    const nodes: MemoryNode[] = memories.map(memory => this.createNodeFromMemory(memory));
    const nodeMap = new Map<string, MemoryNode>();
    nodes.forEach(node => nodeMap.set(node.id, node));

    // Create edges between related memories
    const edges: MemoryEdge[] = [];
    const processedRelationships = new Set<string>();

    // Process initial memories
    for (const memory of memories) {
      if (includeRelated && memory.relatedMemories && memory.relatedMemories.length > 0) {
        await this.addRelatedMemories(
          memory,
          nodeMap,
          edges,
          processedRelationships,
          maxRelatedDepth,
          0
        );
      }
    }

    // Create edges between memories in the same result set
    this.createEdgesBetweenNodes(Array.from(nodeMap.values()), edges, processedRelationships);

    // Build and return the graph
    return {
      nodes: Array.from(nodeMap.values()),
      edges,
      metadata: {
        title,
        description,
        createdAt: new Date(),
        query: JSON.stringify(query),
      },
    };
  }

  /**
   * Create a node from a memory
   */
  private createNodeFromMemory(memory: Memory): MemoryNode {
    return {
      id: memory.id,
      label: this.generateLabel(memory),
      type: memory.type,
      priority: memory.priorityScore || 0,
      tags: memory.tags,
      createdAt: memory.createdAt,
      lastAccessedAt: memory.lastAccessedAt,
      accessCount: memory.accessCount,
      size: this.calculateNodeSize(memory),
      color: this.calculateNodeColor(memory),
    };
  }

  /**
   * Generate a label for a memory node
   */
  private generateLabel(memory: Memory): string {
    // For code memories, use file path if available
    if (memory.type === 'code' && memory.filePath) {
      const fileName = memory.filePath.split('/').pop() || '';
      return fileName;
    }

    // For other types, use first line or truncated content
    const firstLine = memory.content.split('\n')[0];
    if (firstLine.length <= 30) {
      return firstLine;
    }

    return firstLine.substring(0, 27) + '...';
  }

  /**
   * Calculate node size based on priority and access count
   */
  private calculateNodeSize(memory: Memory): number {
    const priorityFactor = memory.priorityScore || 0;
    const accessFactor = Math.min(1, memory.accessCount / 20);

    // Base size + factors
    return 5 + priorityFactor * 10 + accessFactor * 5;
  }

  /**
   * Calculate node color based on memory type
   */
  private calculateNodeColor(memory: Memory): string {
    // Simple color mapping by type
    switch (memory.type) {
      case 'code':
        return '#4285F4'; // Blue
      case 'documentation':
        return '#34A853'; // Green
      case 'conversation':
        return '#FBBC05'; // Yellow
      case 'decision':
        return '#EA4335'; // Red
      case 'pattern':
        return '#8F44AD'; // Purple
      case 'preference':
        return '#F39C12'; // Orange
      default:
        return '#9E9E9E'; // Gray
    }
  }

  /**
   * Add related memories to the graph recursively
   */
  private async addRelatedMemories(
    memory: Memory,
    nodeMap: Map<string, MemoryNode>,
    edges: MemoryEdge[],
    processedRelationships: Set<string>,
    maxDepth: number,
    currentDepth: number
  ): Promise<void> {
    if (!memory.relatedMemories || currentDepth >= maxDepth) {
      return;
    }

    for (const relatedId of memory.relatedMemories) {
      // Skip if we've already processed this relationship
      const relationshipKey = `${memory.id}-${relatedId}`;
      const reverseKey = `${relatedId}-${memory.id}`;

      if (processedRelationships.has(relationshipKey) || processedRelationships.has(reverseKey)) {
        continue;
      }

      // Mark as processed
      processedRelationships.add(relationshipKey);

      // Get the related memory
      const relatedMemory = await this.memoryBank.getMemory(relatedId);
      if (!relatedMemory) {
        continue;
      }

      // Add node if not already in the graph
      if (!nodeMap.has(relatedId)) {
        const node = this.createNodeFromMemory(relatedMemory);
        nodeMap.set(relatedId, node);

        // Recursively add related memories
        if (currentDepth + 1 < maxDepth) {
          await this.addRelatedMemories(
            relatedMemory,
            nodeMap,
            edges,
            processedRelationships,
            maxDepth,
            currentDepth + 1
          );
        }
      }

      // Add edge
      const edge = this.createEdge(memory.id, relatedId, MemoryRelationshipType.RELATED);
      edges.push(edge);
    }
  }

  /**
   * Create edges between nodes based on similarity
   */
  private createEdgesBetweenNodes(
    nodes: MemoryNode[],
    edges: MemoryEdge[],
    processedRelationships: Set<string>
  ): void {
    // Create a map of tags to nodes for quick lookup
    const tagMap = new Map<string, MemoryNode[]>();

    for (const node of nodes) {
      for (const tag of node.tags) {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(node);
      }
    }

    // Connect nodes that share tags
    for (const [tag, tagNodes] of tagMap.entries()) {
      if (tagNodes.length < 2) {
        continue;
      }

      // Connect nodes that share this tag
      for (let i = 0; i < tagNodes.length; i++) {
        for (let j = i + 1; j < tagNodes.length; j++) {
          const sourceId = tagNodes[i].id;
          const targetId = tagNodes[j].id;

          // Skip if we've already processed this relationship
          const relationshipKey = `${sourceId}-${targetId}`;
          const reverseKey = `${targetId}-${sourceId}`;

          if (
            processedRelationships.has(relationshipKey) ||
            processedRelationships.has(reverseKey)
          ) {
            continue;
          }

          // Mark as processed
          processedRelationships.add(relationshipKey);

          // Calculate strength based on number of shared tags
          const sourceTags = new Set(tagNodes[i].tags);
          const targetTags = new Set(tagNodes[j].tags);
          const sharedTags = [...sourceTags].filter(t => targetTags.has(t));

          const strength = Math.min(1, sharedTags.length / 5);

          // Only create edge if strength is significant
          if (strength >= 0.2) {
            const edge = this.createEdge(
              sourceId,
              targetId,
              MemoryRelationshipType.SIMILAR_TO,
              strength
            );
            edges.push(edge);
          }
        }
      }
    }
  }

  /**
   * Create an edge between two nodes
   */
  private createEdge(
    sourceId: string,
    targetId: string,
    type: MemoryRelationshipType,
    strength: number = 0.5,
    direction: 'uni' | 'bi' = 'bi'
  ): MemoryEdge {
    return {
      id: uuidv4(),
      source: sourceId,
      target: targetId,
      type,
      strength,
      direction,
      width: 1 + strength * 4,
      color: this.calculateEdgeColor(type),
    };
  }

  /**
   * Calculate edge color based on relationship type
   */
  private calculateEdgeColor(type: MemoryRelationshipType): string {
    switch (type) {
      case MemoryRelationshipType.RELATED:
        return '#9E9E9E'; // Gray
      case MemoryRelationshipType.REFERENCES:
        return '#2196F3'; // Blue
      case MemoryRelationshipType.DEPENDS_ON:
        return '#F44336'; // Red
      case MemoryRelationshipType.SIMILAR_TO:
        return '#4CAF50'; // Green
      case MemoryRelationshipType.DERIVED_FROM:
        return '#FF9800'; // Orange
      default:
        return '#9E9E9E'; // Gray
    }
  }
}
