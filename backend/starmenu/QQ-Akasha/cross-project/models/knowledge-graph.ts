/**
 * Knowledge Graph Model for Cross-Project Knowledge Transfer
 * Represents knowledge as a connected graph for advanced operations
 */

import { Knowledge, KnowledgeType } from '../types';

/**
 * Types of relationships between knowledge nodes
 */
export enum KnowledgeRelationshipType {
  RELATED = 'related',
  DEPENDS_ON = 'depends_on',
  EXTENDS = 'extends',
  IMPLEMENTS = 'implements',
  SIMILAR_TO = 'similar_to',
  CONTRADICTS = 'contradicts',
  REPLACES = 'replaces',
  CUSTOM = 'custom',
}

/**
 * Represents a node in the knowledge graph
 */
export interface KnowledgeNode {
  /** Unique identifier for the node */
  id: string;

  /** Knowledge entity this node represents */
  knowledge: Knowledge;

  /** Node metadata */
  metadata: {
    /** Importance score (0-1) */
    importance: number;

    /** Centrality in the graph (0-1) */
    centrality?: number;

    /** Community/cluster this node belongs to */
    community?: string;

    /** Additional metadata */
    [key: string]: any;
  };
}

/**
 * Represents a relationship between knowledge nodes
 */
export interface KnowledgeRelationship {
  /** Unique identifier for the relationship */
  id: string;

  /** Source node ID */
  sourceId: string;

  /** Target node ID */
  targetId: string;

  /** Type of relationship */
  type: KnowledgeRelationshipType;

  /** Strength of relationship (0-1) */
  strength: number;

  /** Direction of relationship */
  direction: 'uni' | 'bi';

  /** Relationship metadata */
  metadata: {
    /** When the relationship was created */
    createdAt: Date;

    /** User who created the relationship */
    createdBy: string;

    /** Confidence in the relationship (0-1) */
    confidence: number;

    /** Additional metadata */
    [key: string]: any;
  };
}

/**
 * Complete knowledge graph
 */
export interface KnowledgeGraph {
  /** Unique identifier for the graph */
  id: string;

  /** Graph name */
  name: string;

  /** Graph description */
  description?: string;

  /** Nodes in the graph */
  nodes: Map<string, KnowledgeNode>;

  /** Relationships in the graph */
  relationships: Map<string, KnowledgeRelationship>;

  /** Graph metadata */
  metadata: {
    /** When the graph was created */
    createdAt: Date;

    /** When the graph was last updated */
    updatedAt: Date;

    /** Projects included in this graph */
    projects: string[];

    /** Knowledge types included in this graph */
    knowledgeTypes: KnowledgeType[];

    /** Additional metadata */
    [key: string]: any;
  };
}

/**
 * Graph merge strategy
 */
export enum GraphMergeStrategy {
  /** Keep all nodes and relationships from both graphs */
  UNION = 'union',

  /** Keep only nodes and relationships that exist in both graphs */
  INTERSECTION = 'intersection',

  /** Keep nodes and relationships from the first graph, add from second if not conflicting */
  FIRST_PRIORITY = 'first_priority',

  /** Keep nodes and relationships from the second graph, add from first if not conflicting */
  SECOND_PRIORITY = 'second_priority',

  /** Custom merge strategy */
  CUSTOM = 'custom',
}

/**
 * Graph merge options
 */
export interface GraphMergeOptions {
  /** Merge strategy to use */
  strategy: GraphMergeStrategy;

  /** Custom merge function (if strategy is CUSTOM) */
  customMergeFunction?: (graph1: KnowledgeGraph, graph2: KnowledgeGraph) => Promise<KnowledgeGraph>;

  /** Whether to merge node metadata */
  mergeNodeMetadata: boolean;

  /** Whether to merge relationship metadata */
  mergeRelationshipMetadata: boolean;

  /** Minimum relationship strength to include (0-1) */
  minRelationshipStrength: number;

  /** Whether to create new relationships between nodes from different graphs */
  createCrossGraphRelationships: boolean;

  /** Minimum similarity score for creating cross-graph relationships (0-1) */
  minCrossGraphSimilarity: number;

  /** Maximum number of cross-graph relationships to create */
  maxCrossGraphRelationships: number;
}

/**
 * Default graph merge options
 */
export const DEFAULT_GRAPH_MERGE_OPTIONS: GraphMergeOptions = {
  strategy: GraphMergeStrategy.UNION,
  mergeNodeMetadata: true,
  mergeRelationshipMetadata: true,
  minRelationshipStrength: 0.3,
  createCrossGraphRelationships: true,
  minCrossGraphSimilarity: 0.7,
  maxCrossGraphRelationships: 100,
};

/**
 * Graph merge result
 */
export interface GraphMergeResult {
  /** Merged graph */
  graph: KnowledgeGraph;

  /** Statistics about the merge */
  stats: {
    /** Number of nodes from first graph */
    nodesFromGraph1: number;

    /** Number of nodes from second graph */
    nodesFromGraph2: number;

    /** Number of nodes in merged graph */
    totalNodes: number;

    /** Number of relationships from first graph */
    relationshipsFromGraph1: number;

    /** Number of relationships from second graph */
    relationshipsFromGraph2: number;

    /** Number of new cross-graph relationships created */
    newCrossGraphRelationships: number;

    /** Number of relationships in merged graph */
    totalRelationships: number;

    /** Number of conflicts encountered */
    conflicts: number;

    /** How conflicts were resolved */
    conflictResolution: string;
  };

  /** Merge notes */
  notes: string[];
}
