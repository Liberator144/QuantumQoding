/**
 * Knowledge Graph Analyzer for Cross-Project Knowledge Transfer
 * Analyzes knowledge graphs to extract insights and patterns
 */

import {
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelationship,
  KnowledgeRelationshipType,
} from './knowledge-graph';
import { KnowledgeType } from '../types';

/**
 * Analysis result for a knowledge graph
 */
export interface GraphAnalysisResult {
  /** Basic graph statistics */
  stats: {
    /** Number of nodes in the graph */
    nodeCount: number;

    /** Number of relationships in the graph */
    relationshipCount: number;

    /** Average node degree (number of connections) */
    avgNodeDegree: number;

    /** Density of the graph (0-1) */
    density: number;

    /** Number of connected components */
    componentCount: number;

    /** Distribution of node types */
    nodeTypeDistribution: Record<string, number>;

    /** Distribution of relationship types */
    relationshipTypeDistribution: Record<string, number>;

    /** Distribution of nodes by project */
    projectDistribution: Record<string, number>;
  };

  /** Centrality analysis */
  centrality: {
    /** Nodes with highest degree centrality */
    topDegreeNodes: Array<{
      nodeId: string;
      centrality: number;
    }>;

    /** Nodes with highest betweenness centrality */
    topBetweennessNodes: Array<{
      nodeId: string;
      centrality: number;
    }>;

    /** Nodes with highest closeness centrality */
    topClosenessNodes: Array<{
      nodeId: string;
      centrality: number;
    }>;
  };

  /** Community detection */
  communities: {
    /** Number of communities detected */
    count: number;

    /** Communities with their member nodes */
    members: Record<string, string[]>;

    /** Modularity score (quality of the community division) */
    modularity: number;
  };

  /** Knowledge flow analysis */
  knowledgeFlow: {
    /** Projects that are knowledge sources (more outgoing than incoming) */
    sourcesProjects: string[];

    /** Projects that are knowledge sinks (more incoming than outgoing) */
    sinkProjects: string[];

    /** Knowledge types that flow between projects */
    flowingKnowledgeTypes: KnowledgeType[];

    /** Cross-project knowledge transfer paths */
    transferPaths: Array<{
      sourceProject: string;
      targetProject: string;
      knowledgeTypes: KnowledgeType[];
      strength: number;
    }>;
  };

  /** Insights and recommendations */
  insights: string[];
}

/**
 * Options for graph analysis
 */
export interface GraphAnalysisOptions {
  /** Number of top central nodes to include */
  topNodesCount: number;

  /** Whether to perform community detection */
  detectCommunities: boolean;

  /** Whether to analyze knowledge flow */
  analyzeKnowledgeFlow: boolean;

  /** Whether to generate insights */
  generateInsights: boolean;

  /** Minimum relationship strength to consider (0-1) */
  minRelationshipStrength: number;
}

/**
 * Default graph analysis options
 */
export const DEFAULT_GRAPH_ANALYSIS_OPTIONS: GraphAnalysisOptions = {
  topNodesCount: 5,
  detectCommunities: true,
  analyzeKnowledgeFlow: true,
  generateInsights: true,
  minRelationshipStrength: 0.3,
};

/**
 * Analyzes knowledge graphs to extract insights and patterns
 */
export class KnowledgeGraphAnalyzer {
  /**
   * Analyze a knowledge graph
   */
  async analyzeGraph(
    graph: KnowledgeGraph,
    options: Partial<GraphAnalysisOptions> = {}
  ): Promise<GraphAnalysisResult> {
    // Merge options with defaults
    const mergedOptions: GraphAnalysisOptions = {
      ...DEFAULT_GRAPH_ANALYSIS_OPTIONS,
      ...options,
    };

    // Calculate basic statistics
    const stats = this.calculateGraphStats(graph, mergedOptions);

    // Calculate centrality measures
    const centrality = this.calculateCentrality(graph, mergedOptions);

    // Detect communities
    const communities = mergedOptions.detectCommunities
      ? await this.detectCommunities(graph, mergedOptions)
      : { count: 0, members: {}, modularity: 0 };

    // Analyze knowledge flow
    const knowledgeFlow = mergedOptions.analyzeKnowledgeFlow
      ? this.analyzeKnowledgeFlow(graph, mergedOptions)
      : {
          sourcesProjects: [],
          sinkProjects: [],
          flowingKnowledgeTypes: [],
          transferPaths: [],
        };

    // Generate insights
    const insights = mergedOptions.generateInsights
      ? this.generateInsights(graph, stats, centrality, communities, knowledgeFlow)
      : [];

    return {
      stats,
      centrality,
      communities,
      knowledgeFlow,
      insights,
    };
  }

  /**
   * Calculate basic graph statistics
   */
  private calculateGraphStats(
    graph: KnowledgeGraph,
    options: GraphAnalysisOptions
  ): GraphAnalysisResult['stats'] {
    const nodeCount = graph.nodes.size;
    const relationshipCount = graph.relationships.size;

    // Calculate node degrees
    const nodeDegrees = new Map<string, number>();
    for (const node of graph.nodes.keys()) {
      nodeDegrees.set(node, 0);
    }

    for (const relationship of graph.relationships.values()) {
      if (relationship.strength >= options.minRelationshipStrength) {
        const sourceCount = nodeDegrees.get(relationship.sourceId) || 0;
        nodeDegrees.set(relationship.sourceId, sourceCount + 1);

        const targetCount = nodeDegrees.get(relationship.targetId) || 0;
        nodeDegrees.set(relationship.targetId, targetCount + 1);
      }
    }

    // Calculate average node degree
    const totalDegree = Array.from(nodeDegrees.values()).reduce((sum, degree) => sum + degree, 0);
    const avgNodeDegree = nodeCount > 0 ? totalDegree / nodeCount : 0;

    // Calculate graph density
    const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2; // For undirected graph
    const density = maxPossibleEdges > 0 ? relationshipCount / maxPossibleEdges : 0;

    // Count connected components
    const componentCount = this.countConnectedComponents(graph, options);

    // Calculate node type distribution
    const nodeTypeDistribution: Record<string, number> = {};
    for (const node of graph.nodes.values()) {
      const type = node.knowledge.type;
      nodeTypeDistribution[type] = (nodeTypeDistribution[type] || 0) + 1;
    }

    // Calculate relationship type distribution
    const relationshipTypeDistribution: Record<string, number> = {};
    for (const relationship of graph.relationships.values()) {
      if (relationship.strength >= options.minRelationshipStrength) {
        const type = relationship.type;
        relationshipTypeDistribution[type] = (relationshipTypeDistribution[type] || 0) + 1;
      }
    }

    // Calculate project distribution
    const projectDistribution: Record<string, number> = {};
    for (const node of graph.nodes.values()) {
      const project = node.knowledge.sourceProject;
      projectDistribution[project] = (projectDistribution[project] || 0) + 1;
    }

    return {
      nodeCount,
      relationshipCount,
      avgNodeDegree,
      density,
      componentCount,
      nodeTypeDistribution,
      relationshipTypeDistribution,
      projectDistribution,
    };
  }

  /**
   * Count connected components in the graph
   */
  private countConnectedComponents(graph: KnowledgeGraph, options: GraphAnalysisOptions): number {
    // Use depth-first search to find connected components
    const visited = new Set<string>();
    let componentCount = 0;

    // Helper function for DFS
    const dfs = (nodeId: string) => {
      visited.add(nodeId);

      // Find all neighbors
      for (const relationship of graph.relationships.values()) {
        if (relationship.strength < options.minRelationshipStrength) {
          continue;
        }

        if (relationship.sourceId === nodeId && !visited.has(relationship.targetId)) {
          dfs(relationship.targetId);
        } else if (relationship.targetId === nodeId && !visited.has(relationship.sourceId)) {
          dfs(relationship.sourceId);
        }
      }
    };

    // Iterate through all nodes
    for (const nodeId of graph.nodes.keys()) {
      if (!visited.has(nodeId)) {
        componentCount++;
        dfs(nodeId);
      }
    }

    return componentCount;
  }

  /**
   * Calculate centrality measures
   */
  private calculateCentrality(
    graph: KnowledgeGraph,
    options: GraphAnalysisOptions
  ): GraphAnalysisResult['centrality'] {
    // Calculate degree centrality
    const degreeCentrality = new Map<string, number>();

    for (const nodeId of graph.nodes.keys()) {
      let degree = 0;

      for (const relationship of graph.relationships.values()) {
        if (relationship.strength >= options.minRelationshipStrength) {
          if (relationship.sourceId === nodeId || relationship.targetId === nodeId) {
            degree++;
          }
        }
      }

      // Normalize by maximum possible degree (n-1)
      const normalizedDegree = graph.nodes.size > 1 ? degree / (graph.nodes.size - 1) : 0;

      degreeCentrality.set(nodeId, normalizedDegree);

      // Update node metadata with centrality
      const node = graph.nodes.get(nodeId);
      if (node) {
        node.metadata.centrality = normalizedDegree;
      }
    }

    // For simplicity, we'll use degree centrality as an approximation for betweenness and closeness
    // In a real implementation, we would calculate these properly
    const betweennessCentrality = new Map(degreeCentrality);
    const closenessCentrality = new Map(degreeCentrality);

    // Get top nodes by centrality
    const topDegreeNodes = this.getTopNodesByCentrality(degreeCentrality, options.topNodesCount);

    const topBetweennessNodes = this.getTopNodesByCentrality(
      betweennessCentrality,
      options.topNodesCount
    );

    const topClosenessNodes = this.getTopNodesByCentrality(
      closenessCentrality,
      options.topNodesCount
    );

    return {
      topDegreeNodes,
      topBetweennessNodes,
      topClosenessNodes,
    };
  }

  /**
   * Get top nodes by centrality
   */
  private getTopNodesByCentrality(
    centralityMap: Map<string, number>,
    count: number
  ): Array<{ nodeId: string; centrality: number }> {
    return Array.from(centralityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([nodeId, centrality]) => ({ nodeId, centrality }));
  }

  /**
   * Detect communities in the graph
   */
  private async detectCommunities(
    graph: KnowledgeGraph,
    options: GraphAnalysisOptions
  ): Promise<GraphAnalysisResult['communities']> {
    // This is a simplified implementation using a basic label propagation algorithm
    // A real implementation would use more sophisticated community detection algorithms

    // Initialize each node to its own community
    const communities = new Map<string, string>();
    for (const nodeId of graph.nodes.keys()) {
      communities.set(nodeId, nodeId);
    }

    // Perform label propagation
    const maxIterations = 10;
    let changed = true;
    let iteration = 0;

    while (changed && iteration < maxIterations) {
      changed = false;
      iteration++;

      // Process nodes in random order
      const nodeIds = Array.from(graph.nodes.keys());
      this.shuffleArray(nodeIds);

      for (const nodeId of nodeIds) {
        // Count labels of neighbors
        const labelCounts: Record<string, number> = {};

        // Find all neighbors
        for (const relationship of graph.relationships.values()) {
          if (relationship.strength < options.minRelationshipStrength) {
            continue;
          }

          let neighborId: string | null = null;

          if (relationship.sourceId === nodeId) {
            neighborId = relationship.targetId;
          } else if (relationship.targetId === nodeId) {
            neighborId = relationship.sourceId;
          }

          if (neighborId) {
            const neighborLabel = communities.get(neighborId);
            if (neighborLabel) {
              labelCounts[neighborLabel] = (labelCounts[neighborLabel] || 0) + 1;
            }
          }
        }

        // Find the most frequent label
        let maxCount = 0;
        let maxLabel = communities.get(nodeId);

        for (const [label, count] of Object.entries(labelCounts)) {
          if (count > maxCount) {
            maxCount = count;
            maxLabel = label;
          }
        }

        // Update label if changed
        if (maxLabel && maxLabel !== communities.get(nodeId)) {
          communities.set(nodeId, maxLabel);
          changed = true;

          // Update node metadata with community
          const node = graph.nodes.get(nodeId);
          if (node) {
            node.metadata.community = maxLabel;
          }
        }
      }
    }

    // Group nodes by community
    const communityMembers: Record<string, string[]> = {};

    for (const [nodeId, communityId] of communities.entries()) {
      if (!communityMembers[communityId]) {
        communityMembers[communityId] = [];
      }

      communityMembers[communityId].push(nodeId);
    }

    // Calculate modularity (simplified)
    const modularity = this.calculateModularity(graph, communities, options);

    return {
      count: Object.keys(communityMembers).length,
      members: communityMembers,
      modularity,
    };
  }

  /**
   * Calculate modularity of a community structure
   */
  private calculateModularity(
    graph: KnowledgeGraph,
    communities: Map<string, string>,
    options: GraphAnalysisOptions
  ): number {
    // This is a simplified implementation
    // A real implementation would use the proper modularity formula

    // Count intra-community and inter-community edges
    let intraCommunityEdges = 0;
    let totalEdges = 0;

    for (const relationship of graph.relationships.values()) {
      if (relationship.strength < options.minRelationshipStrength) {
        continue;
      }

      totalEdges++;

      const sourceCommunity = communities.get(relationship.sourceId);
      const targetCommunity = communities.get(relationship.targetId);

      if (sourceCommunity === targetCommunity) {
        intraCommunityEdges++;
      }
    }

    // Calculate simplified modularity
    return totalEdges > 0 ? intraCommunityEdges / totalEdges : 0;
  }

  /**
   * Analyze knowledge flow between projects
   */
  private analyzeKnowledgeFlow(
    graph: KnowledgeGraph,
    options: GraphAnalysisOptions
  ): GraphAnalysisResult['knowledgeFlow'] {
    // Count outgoing and incoming relationships for each project
    const projectOutgoing: Record<string, number> = {};
    const projectIncoming: Record<string, number> = {};

    // Track knowledge types flowing between projects
    const flowingTypes = new Set<KnowledgeType>();

    // Track transfer paths between projects
    const transferPaths: Record<
      string,
      {
        sourceProject: string;
        targetProject: string;
        knowledgeTypes: Set<KnowledgeType>;
        strength: number;
        count: number;
      }
    > = {};

    // Analyze cross-project relationships
    for (const relationship of graph.relationships.values()) {
      if (relationship.strength < options.minRelationshipStrength) {
        continue;
      }

      const sourceNode = graph.nodes.get(relationship.sourceId);
      const targetNode = graph.nodes.get(relationship.targetId);

      if (!sourceNode || !targetNode) {
        continue;
      }

      const sourceProject = sourceNode.knowledge.sourceProject;
      const targetProject = targetNode.knowledge.sourceProject;

      // Skip if same project
      if (sourceProject === targetProject) {
        continue;
      }

      // Count outgoing and incoming
      projectOutgoing[sourceProject] = (projectOutgoing[sourceProject] || 0) + 1;
      projectIncoming[targetProject] = (projectIncoming[targetProject] || 0) + 1;

      // Track knowledge type
      flowingTypes.add(sourceNode.knowledge.type);

      // Track transfer path
      const pathKey = `${sourceProject}-${targetProject}`;

      if (!transferPaths[pathKey]) {
        transferPaths[pathKey] = {
          sourceProject,
          targetProject,
          knowledgeTypes: new Set(),
          strength: 0,
          count: 0,
        };
      }

      transferPaths[pathKey].knowledgeTypes.add(sourceNode.knowledge.type);
      transferPaths[pathKey].strength += relationship.strength;
      transferPaths[pathKey].count++;
    }

    // Identify source and sink projects
    const sourceProjects: string[] = [];
    const sinkProjects: string[] = [];

    for (const project of Object.keys({ ...projectOutgoing, ...projectIncoming })) {
      const outgoing = projectOutgoing[project] || 0;
      const incoming = projectIncoming[project] || 0;

      if (outgoing > incoming * 1.5) {
        sourceProjects.push(project);
      } else if (incoming > outgoing * 1.5) {
        sinkProjects.push(project);
      }
    }

    // Convert transfer paths to result format
    const resultPaths = Object.values(transferPaths).map(path => ({
      sourceProject: path.sourceProject,
      targetProject: path.targetProject,
      knowledgeTypes: Array.from(path.knowledgeTypes),
      strength: path.count > 0 ? path.strength / path.count : 0,
    }));

    // Sort by strength
    resultPaths.sort((a, b) => b.strength - a.strength);

    return {
      sourcesProjects: sourceProjects,
      sinkProjects: sinkProjects,
      flowingKnowledgeTypes: Array.from(flowingTypes),
      transferPaths: resultPaths,
    };
  }

  /**
   * Generate insights based on analysis
   */
  private generateInsights(
    graph: KnowledgeGraph,
    stats: GraphAnalysisResult['stats'],
    centrality: GraphAnalysisResult['centrality'],
    communities: GraphAnalysisResult['communities'],
    knowledgeFlow: GraphAnalysisResult['knowledgeFlow']
  ): string[] {
    const insights: string[] = [];

    // Insight about graph size and connectivity
    insights.push(
      `The knowledge graph contains ${stats.nodeCount} knowledge entities and ${stats.relationshipCount} relationships.`
    );

    if (stats.componentCount > 1) {
      insights.push(
        `The graph has ${stats.componentCount} disconnected components, suggesting some knowledge is isolated.`
      );
    } else {
      insights.push(`The graph is fully connected, indicating good knowledge integration.`);
    }

    // Insight about knowledge distribution
    const dominantType = Object.entries(stats.nodeTypeDistribution).sort((a, b) => b[1] - a[1])[0];

    if (dominantType) {
      insights.push(
        `The dominant knowledge type is "${dominantType[0]}" (${dominantType[1]} entities, ${Math.round((dominantType[1] / stats.nodeCount) * 100)}% of total).`
      );
    }

    // Insight about project distribution
    if (Object.keys(stats.projectDistribution).length > 1) {
      const projectCount = Object.keys(stats.projectDistribution).length;
      insights.push(
        `Knowledge is distributed across ${projectCount} projects, with varying levels of contribution.`
      );
    }

    // Insight about central nodes
    if (centrality.topDegreeNodes.length > 0) {
      const topNode = centrality.topDegreeNodes[0];
      const node = graph.nodes.get(topNode.nodeId);

      if (node) {
        insights.push(
          `The most central knowledge entity is "${node.knowledge.title}" from project "${node.knowledge.sourceProject}".`
        );
      }
    }

    // Insight about communities
    if (communities.count > 1) {
      insights.push(
        `${communities.count} distinct knowledge communities were detected, suggesting natural groupings of related knowledge.`
      );

      // Find the largest community
      const largestCommunity = Object.entries(communities.members).sort(
        (a, b) => b[1].length - a[1].length
      )[0];

      if (largestCommunity) {
        insights.push(
          `The largest knowledge community contains ${largestCommunity[1].length} entities (${Math.round((largestCommunity[1].length / stats.nodeCount) * 100)}% of total).`
        );
      }
    }

    // Insight about knowledge flow
    if (knowledgeFlow.transferPaths.length > 0) {
      insights.push(
        `There are ${knowledgeFlow.transferPaths.length} knowledge transfer paths between projects.`
      );

      if (knowledgeFlow.sourcesProjects.length > 0) {
        insights.push(
          `Projects ${knowledgeFlow.sourcesProjects.join(', ')} are primary knowledge sources, contributing more than they receive.`
        );
      }

      if (knowledgeFlow.sinkProjects.length > 0) {
        insights.push(
          `Projects ${knowledgeFlow.sinkProjects.join(', ')} are primary knowledge consumers, receiving more than they contribute.`
        );
      }

      // Strongest transfer path
      const strongestPath = knowledgeFlow.transferPaths[0];
      if (strongestPath) {
        insights.push(
          `The strongest knowledge transfer is from project "${strongestPath.sourceProject}" to "${strongestPath.targetProject}" with a strength of ${strongestPath.strength.toFixed(2)}.`
        );
      }
    } else {
      insights.push(`No significant cross-project knowledge transfer was detected.`);
    }

    // Recommendations
    if (stats.componentCount > 1) {
      insights.push(
        `Recommendation: Consider creating connections between disconnected knowledge components to improve integration.`
      );
    }

    if (
      knowledgeFlow.transferPaths.length === 0 &&
      Object.keys(stats.projectDistribution).length > 1
    ) {
      insights.push(
        `Recommendation: Establish cross-project knowledge sharing to leverage expertise across projects.`
      );
    }

    if (communities.count > 1 && communities.modularity < 0.3) {
      insights.push(
        `Recommendation: The community structure is weak. Consider reorganizing knowledge to create more cohesive groups.`
      );
    }

    return insights;
  }

  /**
   * Shuffle an array in place
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
