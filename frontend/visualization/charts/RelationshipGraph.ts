/**
 * Relationship Graph
 *
 * Visualizes relationships between entities as an interactive force-directed graph.
 *
 * @version 1.0.0
 */

import { EventEmitter } from 'events';

/**
 * Graph node interface
 */
interface IRelationshipGraphNode {
  /** Node ID */
  id: string;
  
  /** Node label */
  label?: string;
  
  /** Node type */
  type?: string;
  
  /** Node color */
  color?: string;
  
  /** Node radius */
  radius?: number;
  
  /** X position */
  x?: number;
  
  /** Y position */
  y?: number;
  
  /** Fixed X position */
  fx?: number | null;
  
  /** Fixed Y position */
  fy?: number | null;
  
  /** Additional properties */
  [key: string]: any;
}

/**
 * Graph link interface
 */
interface IRelationshipGraphLink {
  /** Source node ID or node object */
  source: string | IRelationshipGraphNode;
  
  /** Target node ID or node object */
  target: string | IRelationshipGraphNode;
  
  /** Link value/weight */
  value?: number;
  
  /** Additional properties */
  [key: string]: any;
}

/**
 * Relationship graph data
 */
interface IRelationshipGraphData {
  /** Graph nodes */
  nodes: IRelationshipGraphNode[];
  
  /** Graph links */
  links: IRelationshipGraphLink[];
}

/**
 * Relationship graph configuration
 */
interface IRelationshipGraphConfig {
  /** Debug mode */
  debugMode?: boolean;
  
  /** Container element or selector */
  container?: HTMLElement | string | null;
  
  /** Graph width */
  width?: number;
  
  /** Graph height */
  height?: number;
  
  /** Node radius */
  nodeRadius?: number;
  
  /** Node colors by state */
  nodeColors?: {
    default: string;
    highlighted: string;
    selected: string;
  };
  
  /** Link width */
  linkWidth?: number;
  
  /** Link color */
  linkColor?: string;
  
  /** Link opacity */
  linkOpacity?: number;
  
  /** Graph title */
  title?: string;
  
  /** Show node labels */
  showLabels?: boolean;
  
  /** Label font size */
  labelSize?: number;
  
  /** Force strength */
  forceStrength?: number;
  
  /** Force link distance */
  forceLinkDistance?: number;
  
  /** Force collide radius */
  forceCollide?: number;
  
  /** Enable interactivity */
  interactive?: boolean;
  
  /** Enable zoom */
  zoomEnabled?: boolean;
  
  /** Enable drag */
  dragEnabled?: boolean;
  
  /** Enable tooltip */
  tooltipEnabled?: boolean;
  
  /** Tooltip format function */
  tooltipFormat?: (d: IRelationshipGraphNode) => string;
  
  /** Enable legend */
  legendEnabled?: boolean;
}

/**
 * Relationship graph state
 */
interface IRelationshipGraphState {
  /** Graph data */
  data: IRelationshipGraphData;
  
  /** SVG element */
  svg: any;
  
  /** Graph group */
  graphGroup?: any;
  
  /** Force simulation */
  simulation?: any;
  
  /** Zoom behavior */
  zoom?: any;
  
  /** Tooltip element */
  tooltip?: any;
  
  /** Selected node */
  selectedNode?: IRelationshipGraphNode | null;
  
  /** Whether graph is initialized */
  initialized: boolean;
}

/**
 * Graph event data
 */
interface IRelationshipGraphEventData {
  /** Event object */
  event: any;
  
  /** Node data */
  data: IRelationshipGraphNode;
  
  /** Whether node is selected (for click events) */
  selected?: boolean;
}

/**
 * Relationship Graph
 *
 * Visualizes relationships between entities as an interactive force-directed graph.
 */
class RelationshipGraph extends EventEmitter {
  /** Graph configuration */
  private config: IRelationshipGraphConfig;
  
  /** Graph state */
  private state: IRelationshipGraphState;
  
  /**
   * Create a new RelationshipGraph instance
   * @param options - Configuration options
   */
  constructor(options: IRelationshipGraphConfig = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Container element or selector
      container: null,

      // Graph dimensions
      width: 800,
      height: 600,

      // Node configuration
      nodeRadius: 10,
      nodeColors: {
        default: '#6baed6',
        highlighted: '#fd8d3c',
        selected: '#e6550d',
      },

      // Link configuration
      linkWidth: 1.5,
      linkColor: '#999',
      linkOpacity: 0.6,

      // Labels
      title: 'Relationship Graph',
      showLabels: true,
      labelSize: 12,

      // Force simulation
      forceStrength: -300,
      forceLinkDistance: 100,
      forceCollide: 20,

      // Interactions
      interactive: true,
      zoomEnabled: true,
      dragEnabled: true,

      // Tooltip
      tooltipEnabled: true,
      tooltipFormat: (d: IRelationshipGraphNode) => `${d.id}: ${d.label || ''}`,

      // Legend
      legendEnabled: true,

      // Merge with provided options
      ...options,
    };

    // State
    this.state = {
      data: {
        nodes: [],
        links: [],
      },
      svg: null,
      initialized: false,
    };

    // Initialize if container is provided
    if (this.config.container) {
      this._init();
    }
  }

  /**
   * Initialize the graph
   * @private
   */
  private _init(): void {
    this.log('Initializing Relationship Graph');

    // Get container
    const container = typeof this.config.container === 'string'
      ? document.querySelector(this.config.container)
      : this.config.container;

    if (!container) {
      this.log('Container not found');
      return;
    }

    // Check if d3 is available
    if (typeof d3 === 'undefined') {
      this.log('D3 is required for Relationship Graph');

      // Add d3 script if not available
      if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://d3js.org/d3.v7.min.js';
        script.onload = () => this._initGraph(container as HTMLElement);
        document.head.appendChild(script);
      }

      return;
    }

    // Initialize graph
    this._initGraph(container as HTMLElement);
  }

  /**
   * Initialize graph with D3
   * @param container - Container element
   * @private
   */
  private _initGraph(container: HTMLElement): void {
    // Create SVG
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.config.width)
      .attr('height', this.config.height)
      .attr('class', 'relationship-graph');

    // Create zoom behavior if enabled
    let zoom;
    if (this.config.zoomEnabled) {
      zoom = d3
        .zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', (event: any) => {
          graphGroup.attr('transform', event.transform);
          this.emit('zoom', { event, transform: event.transform });
        });

      svg.call(zoom);
      this.state.zoom = zoom;
    }

    // Create graph group
    const graphGroup = svg.append('g').attr('class', 'graph-group');

    // Create title
    const title = svg
      .append('text')
      .attr('class', 'graph-title')
      .attr('x', (this.config.width as number) / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(this.config.title);

    // Create tooltip if enabled
    let tooltip = null;

    if (this.config.tooltipEnabled && typeof document !== 'undefined') {
      tooltip = d3
        .select(container)
        .append('div')
        .attr('class', 'relationship-graph-tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'rgba(0, 0, 0, 0.7)')
        .style('color', 'white')
        .style('padding', '5px')
        .style('border-radius', '3px')
        .style('pointer-events', 'none');
    }

    // Create legend if enabled
    if (this.config.legendEnabled) {
      const legend = svg.append('g').attr('class', 'legend').attr('transform', `translate(20, 50)`);

      legend
        .append('text')
        .attr('class', 'legend-title')
        .attr('x', 0)
        .attr('y', -10)
        .style('font-size', '12px')
        .style('text-anchor', 'start')
        .text('Node Types');
    }

    // Create force simulation
    const simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3
          .forceLink()
          .id((d: any) => d.id)
          .distance(this.config.forceLinkDistance)
      )
      .force('charge', d3.forceManyBody().strength(this.config.forceStrength))
      .force('center', d3.forceCenter((this.config.width as number) / 2, (this.config.height as number) / 2))
      .force('collide', d3.forceCollide(this.config.forceCollide));

    // Store state
    this.state.svg = svg;
    this.state.graphGroup = graphGroup;
    this.state.simulation = simulation;
    this.state.tooltip = tooltip;
    this.state.initialized = true;

    this.log('Relationship Graph initialized');
    this.emit('initialized');
  }

  /**
   * Set data for the graph
   * @param data - Data object with nodes and links
   * @returns This instance for chaining
   */
  setData(data: IRelationshipGraphData): RelationshipGraph {
    this.state.data = data;

    if (this.state.initialized) {
      this._updateGraph();
    }

    return this;
  }

  /**
   * Update the graph with current data
   * @private
   */
  private _updateGraph(): void {
    if (!this.state.initialized || !this.state.data) {
      return;
    }

    const { graphGroup, simulation, tooltip } = this.state;
    const { nodes, links } = this.state.data;

    if (!nodes || !links) {
      this.log('Invalid data format');
      return;
    }

    // Create links
    const link = graphGroup.selectAll('.link').data(links, (d: IRelationshipGraphLink) => 
      `${typeof d.source === 'string' ? d.source : d.source.id}-${typeof d.target === 'string' ? d.target : d.target.id}`
    );

    // Remove old links
    link.exit().remove();

    // Add new links
    const newLink = link
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', this.config.linkColor)
      .style('stroke-width', this.config.linkWidth)
      .style('stroke-opacity', this.config.linkOpacity);

    // Create nodes
    const node = graphGroup.selectAll('.node').data(nodes, (d: IRelationshipGraphNode) => d.id);

    // Remove old nodes
    node.exit().remove();

    // Add new nodes
    const newNode = node.enter().append('g').attr('class', 'node');

    // Add node circles
    newNode
      .append('circle')
      .attr('r', (d: IRelationshipGraphNode) => d.radius || (this.config.nodeRadius as number))
      .style('fill', (d: IRelationshipGraphNode) => d.color || (this.config.nodeColors as any).default)
      .style('stroke', '#fff')
      .style('stroke-width', 1.5);

    // Add node labels if enabled
    if (this.config.showLabels) {
      newNode
        .append('text')
        .attr('dy', '.35em')
        .attr('x', (d: IRelationshipGraphNode) => (d.radius || (this.config.nodeRadius as number)) + 5)
        .style('font-size', `${this.config.labelSize}px`)
        .style('fill', '#333')
        .text((d: IRelationshipGraphNode) => d.label || d.id);
    }

    // Add interactions if enabled
    if (this.config.interactive) {
      newNode
        .on('mouseover', (event: any, d: IRelationshipGraphNode) => {
          // Highlight node
          d3.select(event.currentTarget)
            .select('circle')
            .style('fill', (this.config.nodeColors as any).highlighted);

          // Show tooltip
          if (tooltip) {
            tooltip.style('visibility', 'visible').html((this.config.tooltipFormat as Function)(d));
          }

          // Emit event
          this.emit('node-hover', { event, data: d });
        })
        .on('mousemove', (event: any) => {
          // Move tooltip
          if (tooltip) {
            tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
          }
        })
        .on('mouseout', (event: any, d: IRelationshipGraphNode) => {
          // Remove highlight if not selected
          if (this.state.selectedNode !== d) {
            d3.select(event.currentTarget)
              .select('circle')
              .style('fill', d.color || (this.config.nodeColors as any).default);
          }

          // Hide tooltip
          if (tooltip) {
            tooltip.style('visibility', 'hidden');
          }

          // Emit event
          this.emit('node-leave', { event, data: d });
        })
        .on('click', (event: any, d: IRelationshipGraphNode) => {
          // Select/deselect node
          if (this.state.selectedNode === d) {
            // Deselect
            this.state.selectedNode = null;
            d3.select(event.currentTarget)
              .select('circle')
              .style('fill', d.color || (this.config.nodeColors as any).default);
          } else {
            // Deselect previous
            if (this.state.selectedNode) {
              graphGroup
                .selectAll('.node')
                .filter((n: IRelationshipGraphNode) => n === this.state.selectedNode)
                .select('circle')
                .style('fill', (n: IRelationshipGraphNode) => n.color || (this.config.nodeColors as any).default);
            }

            // Select new
            this.state.selectedNode = d;
            d3.select(event.currentTarget)
              .select('circle')
              .style('fill', (this.config.nodeColors as any).selected);
          }

          // Emit event
          this.emit('node-click', { 
            event, 
            data: d, 
            selected: this.state.selectedNode === d 
          });
        });

      // Add drag behavior if enabled
      if (this.config.dragEnabled) {
        newNode.call(
          d3
            .drag()
            .on('start', (event: any, d: IRelationshipGraphNode) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
              this.emit('drag-start', { event, data: d });
            })
            .on('drag', (event: any, d: IRelationshipGraphNode) => {
              d.fx = event.x;
              d.fy = event.y;
              this.emit('drag', { event, data: d });
            })
            .on('end', (event: any, d: IRelationshipGraphNode) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
              this.emit('drag-end', { event, data: d });
            })
        );
      }
    }

    // Update simulation
    simulation.nodes(nodes).on('tick', () => {
      // Update link positions
      graphGroup
        .selectAll('.link')
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      // Update node positions
      graphGroup.selectAll('.node').attr('transform', (d: IRelationshipGraphNode) => `translate(${d.x}, ${d.y})`);
    });

    simulation.force('link').links(links);

    // Restart simulation
    simulation.alpha(1).restart();

    // Update legend if enabled
    if (this.config.legendEnabled) {
      const legend = this.state.svg.select('.legend');

      // Get unique node types
      const nodeTypes = [...new Set(nodes.map(d => d.type))].filter(Boolean);

      // Create legend items
      const legendItems = legend.selectAll('.legend-item').data(nodeTypes);

      // Remove old items
      legendItems.exit().remove();

      // Add new items
      const newLegendItems = legendItems
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d: string, i: number) => `translate(0, ${i * 20})`);

      // Add legend circles
      newLegendItems
        .append('circle')
        .attr('r', 6)
        .style('fill', (d: string) => {
          // Find a node with this type
          const node = nodes.find(n => n.type === d);
          return node && node.color ? node.color : (this.config.nodeColors as any).default;
        });

      // Add legend text
      newLegendItems
        .append('text')
        .attr('x', 15)
        .attr('y', 4)
        .style('font-size', '12px')
        .text((d: string) => d);
    }

    this.log('Relationship Graph updated');
    this.emit('updated');
  }

  /**
   * Resize the graph
   * @param width - New width
   * @param height - New height
   * @returns This instance for chaining
   */
  resize(width: number, height: number): RelationshipGraph {
    if (!this.state.initialized) {
      return this;
    }

    // Update config
    this.config.width = width;
    this.config.height = height;

    // Update SVG
    this.state.svg.attr('width', width).attr('height', height);

    // Update simulation
    this.state.simulation.force('center', d3.forceCenter(width / 2, height / 2));

    // Restart simulation
    this.state.simulation.alpha(1).restart();

    return this;
  }

  /**
   * Focus on a specific node
   * @param nodeId - Node ID
   * @returns This instance for chaining
   */
  focusNode(nodeId: string): RelationshipGraph {
    if (!this.state.initialized) {
      return this;
    }

    // Find node
    const node = this.state.data.nodes.find(d => d.id === nodeId);

    if (!node) {
      this.log(`Node not found: ${nodeId}`);
      return this;
    }

    // Select node
    this.state.selectedNode = node;

    // Update node appearance
    this.state.graphGroup
      .selectAll('.node')
      .filter((d: IRelationshipGraphNode) => d === node)
      .select('circle')
      .style('fill', (this.config.nodeColors as any).selected);

    // Center on node if zoom is enabled
    if (this.config.zoomEnabled && this.state.zoom && node.x !== undefined && node.y !== undefined) {
      const transform = d3.zoomIdentity
        .translate((this.config.width as number) / 2, (this.config.height as number) / 2)
        .scale(1.5)
        .translate(-node.x, -node.y);

      this.state.svg.transition().duration(750).call(this.state.zoom.transform, transform);
    }

    this.emit('node-focus', { nodeId, node });

    return this;
  }

  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   * @private
   */
  private log(message: string): void {
    if (this.config.debugMode) {
      console.log(`[RelationshipGraph] ${message}`);
    }
  }
}

export { 
  RelationshipGraph, 
  IRelationshipGraphData, 
  IRelationshipGraphNode, 
  IRelationshipGraphLink,
  IRelationshipGraphConfig
};
