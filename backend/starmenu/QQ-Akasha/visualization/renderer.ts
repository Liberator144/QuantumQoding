/**
 * Renderer for Memory Visualization
 * Renders memory graphs to various formats
 */

import { DEFAULT_VISUALIZATION_CONFIG, MemoryGraph, VisualizationConfig } from './types';

/**
 * Base renderer class for memory visualization
 */
export abstract class MemoryRenderer {
  protected config: VisualizationConfig;

  constructor(config: Partial<VisualizationConfig> = {}) {
    this.config = {
      ...DEFAULT_VISUALIZATION_CONFIG,
      ...config,
    };
  }

  /**
   * Render a memory graph
   */
  abstract render(graph: MemoryGraph): Promise<any>;
}

/**
 * Renders memory graph to JSON format
 */
export class JSONRenderer extends MemoryRenderer {
  async render(graph: MemoryGraph): Promise<string> {
    // Apply node size and color functions if provided
    if (this.config.nodeSizeFunction) {
      graph.nodes.forEach(node => {
        node.size = this.config.nodeSizeFunction!(node);
      });
    }

    if (this.config.nodeColorFunction) {
      graph.nodes.forEach(node => {
        node.color = this.config.nodeColorFunction!(node);
      });
    }

    // Apply edge width and color functions if provided
    if (this.config.edgeWidthFunction) {
      graph.edges.forEach(edge => {
        edge.width = this.config.edgeWidthFunction!(edge);
      });
    }

    if (this.config.edgeColorFunction) {
      graph.edges.forEach(edge => {
        edge.color = this.config.edgeColorFunction!(edge);
      });
    }

    // Filter edges by strength
    graph.edges = graph.edges.filter(edge => edge.strength >= this.config.minEdgeStrength);

    // Limit number of nodes if needed
    if (graph.nodes.length > this.config.maxNodes) {
      // Sort by priority and take top N
      graph.nodes.sort((a, b) => b.priority - a.priority);
      graph.nodes = graph.nodes.slice(0, this.config.maxNodes);

      // Keep only edges that connect to remaining nodes
      const nodeIds = new Set(graph.nodes.map(node => node.id));
      graph.edges = graph.edges.filter(
        edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)
      );
    }

    // Add visualization config to metadata
    graph.metadata.visualizationConfig = this.config;

    return JSON.stringify(graph, null, 2);
  }
}

/**
 * Renders memory graph to D3.js compatible format
 */
export class D3Renderer extends MemoryRenderer {
  async render(graph: MemoryGraph): Promise<any> {
    // First use JSON renderer to apply common transformations
    const jsonRenderer = new JSONRenderer(this.config);
    const jsonString = await jsonRenderer.render(graph);
    const processedGraph = JSON.parse(jsonString);

    // Transform to D3.js format
    return {
      nodes: processedGraph.nodes.map((node: any) => ({
        id: node.id,
        label: node.label,
        group: node.type,
        value: node.size || 5,
        title: `${node.label} (${node.type})`,
        color: node.color,
        createdAt: node.createdAt,
        lastAccessedAt: node.lastAccessedAt,
        accessCount: node.accessCount,
        tags: node.tags,
      })),
      links: processedGraph.edges.map((edge: any) => ({
        source: edge.source,
        target: edge.target,
        value: edge.width || 1,
        color: edge.color,
        type: edge.type,
        strength: edge.strength,
      })),
      metadata: processedGraph.metadata,
    };
  }
}

/**
 * Renders memory graph to DOT format for Graphviz
 */
export class DOTRenderer extends MemoryRenderer {
  async render(graph: MemoryGraph): Promise<string> {
    // First use JSON renderer to apply common transformations
    const jsonRenderer = new JSONRenderer(this.config);
    const jsonString = await jsonRenderer.render(graph);
    const processedGraph = JSON.parse(jsonString);

    // Generate DOT format
    let dot = `digraph MemoryGraph {\n`;
    dot += `  graph [label="${processedGraph.metadata.title}", labelloc=t, fontsize=20];\n`;
    dot += `  node [style=filled];\n`;

    // Add nodes
    for (const node of processedGraph.nodes) {
      const color = node.color?.replace('#', '') || '9E9E9E';
      const size = node.size || 1;
      const fontSize = 10 + size / 10;

      dot += `  "${node.id}" [label="${node.label}", `;
      dot += `fillcolor="#${color}", `;
      dot += `width=${size / 10}, height=${size / 10}, `;
      dot += `fontsize=${fontSize}];\n`;
    }

    // Add edges
    for (const edge of processedGraph.edges) {
      const color = edge.color?.replace('#', '') || '9E9E9E';
      const width = edge.width || 1;

      dot += `  "${edge.source}" -> "${edge.target}" [`;
      dot += `color="#${color}", `;
      dot += `penwidth=${width}`;

      if (edge.direction === 'bi') {
        dot += `, dir=both`;
      }

      dot += `];\n`;
    }

    dot += `}\n`;
    return dot;
  }
}

/**
 * Factory for creating renderers
 */
export class RendererFactory {
  static createRenderer(
    format: 'json' | 'd3' | 'dot',
    config: Partial<VisualizationConfig> = {}
  ): MemoryRenderer {
    switch (format) {
      case 'json':
        return new JSONRenderer(config);
      case 'd3':
        return new D3Renderer(config);
      case 'dot':
        return new DOTRenderer(config);
      default:
        return new JSONRenderer(config);
    }
  }
}
