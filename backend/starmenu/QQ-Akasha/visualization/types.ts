/**
 * Types for the Memory Visualization Framework
 */

import { Memory, MemoryType } from '../core';

/**
 * Represents a node in the memory visualization graph
 */
export interface MemoryNode {
  /** Unique identifier for the node */
  id: string;

  /** Label to display for the node */
  label: string;

  /** Type of memory this node represents */
  type: MemoryType;

  /** Priority score for sizing/coloring */
  priority: number;

  /** Tags associated with this node */
  tags: string[];

  /** When the memory was created */
  createdAt: Date;

  /** When the memory was last accessed */
  lastAccessedAt: Date;

  /** How many times this memory has been accessed */
  accessCount: number;

  /** X position in the visualization */
  x?: number;

  /** Y position in the visualization */
  y?: number;

  /** Z position in the visualization (for 3D) */
  z?: number;

  /** Size of the node (derived from priority or other factors) */
  size?: number;

  /** Color of the node (derived from type or other factors) */
  color?: string;

  /** Additional metadata for rendering */
  renderMetadata?: Record<string, any>;
}

/**
 * Represents an edge between memory nodes
 */
export interface MemoryEdge {
  /** Unique identifier for the edge */
  id: string;

  /** Source node ID */
  source: string;

  /** Target node ID */
  target: string;

  /** Type of relationship */
  type: MemoryRelationshipType;

  /** Strength of relationship (0-1) */
  strength: number;

  /** Direction of relationship */
  direction: 'uni' | 'bi';

  /** Label to display for the edge */
  label?: string;

  /** Width of the edge (derived from strength) */
  width?: number;

  /** Color of the edge (derived from type) */
  color?: string;

  /** Additional metadata for rendering */
  renderMetadata?: Record<string, any>;
}

/**
 * Types of relationships between memories
 */
export enum MemoryRelationshipType {
  RELATED = 'related',
  REFERENCES = 'references',
  DEPENDS_ON = 'depends_on',
  SIMILAR_TO = 'similar_to',
  DERIVED_FROM = 'derived_from',
  CUSTOM = 'custom',
}

/**
 * Complete memory graph for visualization
 */
export interface MemoryGraph {
  /** Nodes in the graph */
  nodes: MemoryNode[];

  /** Edges in the graph */
  edges: MemoryEdge[];

  /** Metadata about the graph */
  metadata: {
    /** Title of the graph */
    title: string;

    /** Description of the graph */
    description?: string;

    /** When the graph was created */
    createdAt: Date;

    /** Query or filter used to generate this graph */
    query?: string;

    /** Additional metadata */
    [key: string]: any;
  };
}

/**
 * Configuration for the visualization
 */
export interface VisualizationConfig {
  /** Layout algorithm to use */
  layout: 'force' | 'radial' | 'hierarchical' | 'timeline' | 'cluster';

  /** Color scheme to use */
  colorScheme: string;

  /** Whether to use 3D visualization */
  use3D: boolean;

  /** Whether to show labels */
  showLabels: boolean;

  /** Whether to show timestamps */
  showTimestamps: boolean;

  /** Whether to animate transitions */
  animate: boolean;

  /** Maximum number of nodes to display */
  maxNodes: number;

  /** Minimum strength for edges to display */
  minEdgeStrength: number;

  /** Custom node size calculation function */
  nodeSizeFunction?: (node: MemoryNode) => number;

  /** Custom node color calculation function */
  nodeColorFunction?: (node: MemoryNode) => string;

  /** Custom edge width calculation function */
  edgeWidthFunction?: (edge: MemoryEdge) => number;

  /** Custom edge color calculation function */
  edgeColorFunction?: (edge: MemoryEdge) => string;
}

/**
 * Default visualization configuration
 */
export const DEFAULT_VISUALIZATION_CONFIG: VisualizationConfig = {
  layout: 'force',
  colorScheme: 'category10',
  use3D: false,
  showLabels: true,
  showTimestamps: false,
  animate: true,
  maxNodes: 100,
  minEdgeStrength: 0.1,
};
