/**
 * Types for Knowledge Graph Visualization
 * Enables visual exploration of knowledge graphs
 */

import { KnowledgeGraph, KnowledgeNode, KnowledgeRelationship } from '../models/knowledge-graph';
import { KnowledgeType } from '../types';

/**
 * Visualization node
 */
export interface VisNode {
  /** Node ID */
  id: string;

  /** Node label */
  label: string;

  /** Node title (for tooltips) */
  title?: string;

  /** Node group (for coloring) */
  group?: string;

  /** Node size */
  size?: number;

  /** Node color */
  color?: string;

  /** Node shape */
  shape?: 'circle' | 'box' | 'diamond' | 'triangle' | 'star' | 'hexagon';

  /** Node font */
  font?: {
    /** Font size */
    size?: number;

    /** Font color */
    color?: string;

    /** Font face */
    face?: string;

    /** Whether to show the label */
    multi?: boolean | string;
  };

  /** Whether the node is fixed */
  fixed?: boolean;

  /** Node position */
  x?: number;
  y?: number;

  /** Original knowledge node */
  originalNode?: KnowledgeNode;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Visualization edge
 */
export interface VisEdge {
  /** Edge ID */
  id: string;

  /** Source node ID */
  from: string;

  /** Target node ID */
  to: string;

  /** Edge label */
  label?: string;

  /** Edge title (for tooltips) */
  title?: string;

  /** Edge width */
  width?: number;

  /** Edge length */
  length?: number;

  /** Edge color */
  color?:
    | string
    | {
        color?: string;
        highlight?: string;
        hover?: string;
        opacity?: number;
      };

  /** Whether the edge is dashed */
  dashed?: boolean;

  /** Edge arrow properties */
  arrows?: {
    to?:
      | boolean
      | {
          enabled?: boolean;
          type?: string;
        };
    from?:
      | boolean
      | {
          enabled?: boolean;
          type?: string;
        };
  };

  /** Original knowledge relationship */
  originalRelationship?: KnowledgeRelationship;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Visualization graph
 */
export interface VisGraph {
  /** Graph nodes */
  nodes: VisNode[];

  /** Graph edges */
  edges: VisEdge[];

  /** Original knowledge graph */
  originalGraph?: KnowledgeGraph;
}

/**
 * Visualization options
 */
export interface VisOptions {
  /** Node styling options */
  nodes?: {
    /** Default shape */
    shape?: string;

    /** Default size */
    size?: number;

    /** Default font */
    font?: {
      size?: number;
      color?: string;
    };

    /** Scaling options */
    scaling?: {
      min?: number;
      max?: number;
      label?: {
        enabled?: boolean;
        min?: number;
        max?: number;
      };
    };

    /** Shadow options */
    shadow?: boolean;

    /** Border width */
    borderWidth?: number;

    /** Border color */
    borderColor?: string;

    /** Hover behavior */
    hover?: {
      size?: number;
    };
  };

  /** Edge styling options */
  edges?: {
    /** Default width */
    width?: number;

    /** Default color */
    color?: string;

    /** Smooth curves */
    smooth?:
      | boolean
      | {
          type?: string;
          roundness?: number;
        };

    /** Arrow options */
    arrows?: {
      to?: boolean;
      from?: boolean;
    };

    /** Shadow options */
    shadow?: boolean;

    /** Font options */
    font?: {
      size?: number;
      color?: string;
      align?: string;
    };
  };

  /** Layout options */
  layout?: {
    /** Hierarchical layout */
    hierarchical?:
      | boolean
      | {
          direction?: 'UD' | 'DU' | 'LR' | 'RL';
          sortMethod?: 'hubsize' | 'directed';
          levelSeparation?: number;
          nodeSpacing?: number;
        };

    /** Randomized layout */
    randomSeed?: number;

    /** Improves the layout for larger networks */
    improvedLayout?: boolean;
  };

  /** Physics simulation options */
  physics?:
    | boolean
    | {
        /** Solver type */
        solver?: 'barnesHut' | 'forceAtlas2Based' | 'repulsion' | 'hierarchicalRepulsion';

        /** Stabilization options */
        stabilization?:
          | boolean
          | {
              iterations?: number;
              fit?: boolean;
            };

        /** Barnes Hut options */
        barnesHut?: {
          gravitationalConstant?: number;
          centralGravity?: number;
          springLength?: number;
          springConstant?: number;
          damping?: number;
        };
      };

  /** Interaction options */
  interaction?: {
    /** Whether to allow dragging nodes */
    dragNodes?: boolean;

    /** Whether to allow selecting nodes */
    selectable?: boolean;

    /** Whether to allow zooming */
    zoomView?: boolean;

    /** Whether to allow dragging the view */
    dragView?: boolean;

    /** Whether to allow hovering */
    hover?: boolean;

    /** Whether to highlight connected nodes on hover */
    hoverConnectedEdges?: boolean;

    /** Whether to allow multi-selection */
    multiselect?: boolean;
  };

  /** Groups configuration */
  groups?: Record<
    string,
    {
      color?: string;
      shape?: string;
      borderWidth?: number;
      borderColor?: string;
      size?: number;
    }
  >;
}

/**
 * Default visualization options
 */
export const DEFAULT_VIS_OPTIONS: VisOptions = {
  nodes: {
    shape: 'circle',
    size: 25,
    font: {
      size: 14,
      color: '#333333',
    },
    scaling: {
      min: 15,
      max: 40,
    },
    shadow: true,
    borderWidth: 2,
  },
  edges: {
    width: 2,
    color: '#848484',
    smooth: {
      type: 'continuous',
      roundness: 0.5,
    },
    arrows: {
      to: true,
    },
  },
  layout: {
    improvedLayout: true,
  },
  physics: {
    solver: 'forceAtlas2Based',
    stabilization: {
      iterations: 100,
      fit: true,
    },
  },
  interaction: {
    dragNodes: true,
    selectable: true,
    zoomView: true,
    dragView: true,
    hover: true,
    hoverConnectedEdges: true,
    multiselect: true,
  },
  groups: {
    code_pattern: {
      color: '#97C2FC',
      shape: 'circle',
    },
    architecture: {
      color: '#FB7E81',
      shape: 'diamond',
    },
    best_practice: {
      color: '#7BE141',
      shape: 'box',
    },
    solution: {
      color: '#FFA807',
      shape: 'triangle',
    },
    algorithm: {
      color: '#6E6EFD',
      shape: 'hexagon',
    },
  },
};

/**
 * Visualization filter
 */
export interface VisFilter {
  /** Filter by knowledge type */
  knowledgeTypes?: KnowledgeType[];

  /** Filter by project */
  projects?: string[];

  /** Filter by tag */
  tags?: string[];

  /** Filter by relationship type */
  relationshipTypes?: string[];

  /** Minimum relationship strength */
  minRelationshipStrength?: number;

  /** Maximum number of nodes */
  maxNodes?: number;

  /** Search term */
  searchTerm?: string;

  /** Whether to include isolated nodes */
  includeIsolatedNodes?: boolean;
}

/**
 * Visualization event
 */
export interface VisEvent {
  /** Event type */
  type: 'nodeClick' | 'edgeClick' | 'nodeHover' | 'edgeHover' | 'nodeSelect' | 'edgeSelect';

  /** Node ID (for node events) */
  nodeId?: string;

  /** Edge ID (for edge events) */
  edgeId?: string;

  /** Selected node IDs */
  selectedNodeIds?: string[];

  /** Selected edge IDs */
  selectedEdgeIds?: string[];

  /** Event coordinates */
  pointer?: {
    x: number;
    y: number;
  };

  /** DOM event */
  domEvent?: any;
}
