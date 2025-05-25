/**
 * Visualization Manager for Knowledge Graph Visualization
 * Coordinates the visualization process
 */

import { EventEmitter } from 'events';
import { KnowledgeGraph, KnowledgeNode, KnowledgeRelationship } from '../models/knowledge-graph';
import { KnowledgeGraphBuilder } from '../models/knowledge-graph-builder';
import { KnowledgeGraphAnalyzer } from '../models/knowledge-graph-analyzer';
import {
  VisGraph,
  VisNode,
  VisEdge,
  VisFilter,
  VisOptions,
  VisEvent,
  DEFAULT_VIS_OPTIONS,
} from './types';
import { GraphConverter } from './graph-converter';

/**
 * Events emitted by the visualization manager
 */
export enum VisualizationEvent {
  GRAPH_LOADED = 'graph-loaded',
  GRAPH_FILTERED = 'graph-filtered',
  GRAPH_LAYOUT_CHANGED = 'graph-layout-changed',
  NODE_SELECTED = 'node-selected',
  EDGE_SELECTED = 'edge-selected',
  SELECTION_CHANGED = 'selection-changed',
  HOVER_CHANGED = 'hover-changed',
  EXPORT_COMPLETED = 'export-completed',
}

/**
 * Export format
 */
export enum ExportFormat {
  JSON = 'json',
  PNG = 'png',
  SVG = 'svg',
  DOT = 'dot',
}

/**
 * Layout algorithm
 */
export enum LayoutAlgorithm {
  FORCE_DIRECTED = 'force-directed',
  HIERARCHICAL = 'hierarchical',
  CIRCULAR = 'circular',
  GRID = 'grid',
  RADIAL = 'radial',
}

/**
 * Manages the visualization process
 */
export class VisualizationManager {
  private graphBuilder: KnowledgeGraphBuilder;
  private graphAnalyzer: KnowledgeGraphAnalyzer;
  private graphConverter: GraphConverter;
  private currentGraph: KnowledgeGraph | null = null;
  private currentVisGraph: VisGraph | null = null;
  private currentFilter: VisFilter | null = null;
  private currentOptions: VisOptions;
  private selectedNodeIds: Set<string> = new Set();
  private selectedEdgeIds: Set<string> = new Set();
  private hoveredNodeId: string | null = null;
  private hoveredEdgeId: string | null = null;
  private eventEmitter: EventEmitter;

  constructor(
    graphBuilder: KnowledgeGraphBuilder,
    graphAnalyzer: KnowledgeGraphAnalyzer,
    options: Partial<VisOptions> = {}
  ) {
    this.graphBuilder = graphBuilder;
    this.graphAnalyzer = graphAnalyzer;
    this.graphConverter = new GraphConverter();
    this.currentOptions = {
      ...DEFAULT_VIS_OPTIONS,
      ...options,
    };
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Load a knowledge graph
   */
  async loadGraph(graph: KnowledgeGraph, filter?: VisFilter): Promise<VisGraph> {
    this.currentGraph = graph;
    this.currentFilter = filter || null;

    // Convert graph to visualization format
    this.currentVisGraph = this.graphConverter.convertToVisGraph(
      graph,
      filter,
      this.currentOptions
    );

    // Emit event
    this.eventEmitter.emit(VisualizationEvent.GRAPH_LOADED, {
      graph: this.currentVisGraph,
      originalGraph: graph,
      filter,
    });

    return this.currentVisGraph;
  }

  /**
   * Apply filter to the current graph
   */
  applyFilter(filter: VisFilter): VisGraph | null {
    if (!this.currentGraph) {
      throw new Error('No graph loaded');
    }

    this.currentFilter = filter;

    // Convert graph to visualization format with new filter
    this.currentVisGraph = this.graphConverter.convertToVisGraph(
      this.currentGraph,
      filter,
      this.currentOptions
    );

    // Clear selections
    this.selectedNodeIds.clear();
    this.selectedEdgeIds.clear();
    this.hoveredNodeId = null;
    this.hoveredEdgeId = null;

    // Emit event
    this.eventEmitter.emit(VisualizationEvent.GRAPH_FILTERED, {
      graph: this.currentVisGraph,
      filter,
    });

    return this.currentVisGraph;
  }

  /**
   * Update visualization options
   */
  updateOptions(options: Partial<VisOptions>): VisGraph | null {
    this.currentOptions = {
      ...this.currentOptions,
      ...options,
    };

    if (!this.currentGraph) {
      return null;
    }

    // Convert graph to visualization format with new options
    this.currentVisGraph = this.graphConverter.convertToVisGraph(
      this.currentGraph,
      this.currentFilter || undefined,
      this.currentOptions
    );

    // Emit event
    this.eventEmitter.emit(VisualizationEvent.GRAPH_LAYOUT_CHANGED, {
      graph: this.currentVisGraph,
      options: this.currentOptions,
    });

    return this.currentVisGraph;
  }

  /**
   * Change layout algorithm
   */
  changeLayout(algorithm: LayoutAlgorithm): VisGraph | null {
    // Update options based on algorithm
    switch (algorithm) {
      case LayoutAlgorithm.FORCE_DIRECTED:
        this.updateOptions({
          layout: {
            hierarchical: false,
            improvedLayout: true,
          },
          physics: {
            solver: 'forceAtlas2Based',
            stabilization: {
              iterations: 100,
            },
          },
        });
        break;

      case LayoutAlgorithm.HIERARCHICAL:
        this.updateOptions({
          layout: {
            hierarchical: {
              direction: 'UD',
              sortMethod: 'directed',
              levelSeparation: 150,
              nodeSpacing: 100,
            },
          },
          physics: {
            solver: 'hierarchicalRepulsion',
          },
        });
        break;

      case LayoutAlgorithm.CIRCULAR:
        this.updateOptions({
          layout: {
            improvedLayout: true,
          },
          physics: {
            solver: 'forceAtlas2Based',
            stabilization: {
              iterations: 100,
            },
          },
        });
        break;

      case LayoutAlgorithm.GRID:
        this.updateOptions({
          layout: {
            improvedLayout: true,
          },
          physics: false,
        });
        break;

      case LayoutAlgorithm.RADIAL:
        this.updateOptions({
          layout: {
            improvedLayout: true,
          },
          physics: {
            solver: 'repulsion',
          },
        });
        break;
    }

    return this.currentVisGraph;
  }

  /**
   * Handle visualization events
   */
  handleEvent(event: VisEvent): void {
    switch (event.type) {
      case 'nodeClick':
        if (event.nodeId) {
          this.handleNodeClick(event.nodeId);
        }
        break;

      case 'edgeClick':
        if (event.edgeId) {
          this.handleEdgeClick(event.edgeId);
        }
        break;

      case 'nodeHover':
        this.handleNodeHover(event.nodeId || null);
        break;

      case 'edgeHover':
        this.handleEdgeHover(event.edgeId || null);
        break;

      case 'nodeSelect':
        this.handleSelectionChange(event.selectedNodeIds || [], event.selectedEdgeIds || []);
        break;

      case 'edgeSelect':
        this.handleSelectionChange(event.selectedNodeIds || [], event.selectedEdgeIds || []);
        break;
    }
  }

  /**
   * Handle node click
   */
  private handleNodeClick(nodeId: string): void {
    // Toggle selection
    if (this.selectedNodeIds.has(nodeId)) {
      this.selectedNodeIds.delete(nodeId);
    } else {
      this.selectedNodeIds.add(nodeId);
    }

    // Emit event
    this.eventEmitter.emit(VisualizationEvent.NODE_SELECTED, {
      nodeId,
      selected: this.selectedNodeIds.has(nodeId),
      node: this.getVisNode(nodeId),
    });
  }

  /**
   * Handle edge click
   */
  private handleEdgeClick(edgeId: string): void {
    // Toggle selection
    if (this.selectedEdgeIds.has(edgeId)) {
      this.selectedEdgeIds.delete(edgeId);
    } else {
      this.selectedEdgeIds.add(edgeId);
    }

    // Emit event
    this.eventEmitter.emit(VisualizationEvent.EDGE_SELECTED, {
      edgeId,
      selected: this.selectedEdgeIds.has(edgeId),
      edge: this.getVisEdge(edgeId),
    });
  }

  /**
   * Handle node hover
   */
  private handleNodeHover(nodeId: string | null): void {
    this.hoveredNodeId = nodeId;

    // Emit event
    this.eventEmitter.emit(VisualizationEvent.HOVER_CHANGED, {
      hoveredNodeId: nodeId,
      hoveredEdgeId: this.hoveredEdgeId,
      hoveredNode: nodeId ? this.getVisNode(nodeId) : null,
      hoveredEdge: this.hoveredEdgeId ? this.getVisEdge(this.hoveredEdgeId) : null,
    });
  }

  /**
   * Handle edge hover
   */
  private handleEdgeHover(edgeId: string | null): void {
    this.hoveredEdgeId = edgeId;

    // Emit event
    this.eventEmitter.emit(VisualizationEvent.HOVER_CHANGED, {
      hoveredNodeId: this.hoveredNodeId,
      hoveredEdgeId: edgeId,
      hoveredNode: this.hoveredNodeId ? this.getVisNode(this.hoveredNodeId) : null,
      hoveredEdge: edgeId ? this.getVisEdge(edgeId) : null,
    });
  }

  /**
   * Handle selection change
   */
  private handleSelectionChange(selectedNodeIds: string[], selectedEdgeIds: string[]): void {
    this.selectedNodeIds = new Set(selectedNodeIds);
    this.selectedEdgeIds = new Set(selectedEdgeIds);

    // Emit event
    this.eventEmitter.emit(VisualizationEvent.SELECTION_CHANGED, {
      selectedNodeIds: Array.from(this.selectedNodeIds),
      selectedEdgeIds: Array.from(this.selectedEdgeIds),
      selectedNodes: Array.from(this.selectedNodeIds)
        .map(id => this.getVisNode(id))
        .filter(Boolean),
      selectedEdges: Array.from(this.selectedEdgeIds)
        .map(id => this.getVisEdge(id))
        .filter(Boolean),
    });
  }

  /**
   * Get visualization node by ID
   */
  private getVisNode(nodeId: string): VisNode | null {
    if (!this.currentVisGraph) {
      return null;
    }

    return this.currentVisGraph.nodes.find(node => node.id === nodeId) || null;
  }

  /**
   * Get visualization edge by ID
   */
  private getVisEdge(edgeId: string): VisEdge | null {
    if (!this.currentVisGraph) {
      return null;
    }

    return this.currentVisGraph.edges.find(edge => edge.id === edgeId) || null;
  }

  /**
   * Export visualization
   */
  async exportVisualization(format: ExportFormat, options?: any): Promise<any> {
    if (!this.currentVisGraph) {
      throw new Error('No graph loaded');
    }

    let result: any;

    switch (format) {
      case ExportFormat.JSON:
        result = JSON.stringify(this.currentVisGraph, null, 2);
        break;

      case ExportFormat.PNG:
      case ExportFormat.SVG:
      case ExportFormat.DOT:
        // These formats would require integration with a rendering engine
        throw new Error(`Export to ${format} not implemented`);

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    // Emit event
    this.eventEmitter.emit(VisualizationEvent.EXPORT_COMPLETED, {
      format,
      result,
    });

    return result;
  }

  /**
   * Subscribe to visualization events
   */
  on(event: VisualizationEvent, listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from visualization events
   */
  off(event: VisualizationEvent, listener: (data: any) => void): void {
    this.eventEmitter.off(event, listener);
  }
}
