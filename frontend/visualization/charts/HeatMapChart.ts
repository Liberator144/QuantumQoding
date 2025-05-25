/**
 * Heat Map Chart
 *
 * Visualizes data as a heat map with customizable colors and interactions.
 *
 * @version 1.0.0
 */

import { EventEmitter } from 'events';

/**
 * Heat Map Data Point
 */
interface IHeatMapDataPoint {
  x: string | number;
  y: string | number;
  value: number;
}

/**
 * Heat Map Chart Configuration
 */
interface IHeatMapChartConfig {
  /** Debug mode */
  debugMode?: boolean;
  
  /** Container element or selector */
  container?: HTMLElement | string | null;
  
  /** Chart width */
  width?: number;
  
  /** Chart height */
  height?: number;
  
  /** Chart margins */
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  /** Color scale */
  colors?: string[];
  
  /** Chart title */
  title?: string;
  
  /** X-axis label */
  xAxisLabel?: string;
  
  /** Y-axis label */
  yAxisLabel?: string;
  
  /** Transition duration in ms */
  transitionDuration?: number;
  
  /** Enable tooltip */
  tooltipEnabled?: boolean;
  
  /** Tooltip format function */
  tooltipFormat?: (d: IHeatMapDataPoint) => string;
  
  /** Enable legend */
  legendEnabled?: boolean;
  
  /** Legend title */
  legendTitle?: string;
  
  /** Enable interactivity */
  interactive?: boolean;
}

/**
 * Heat Map Chart State
 */
interface IHeatMapChartState {
  /** Chart data */
  data: IHeatMapDataPoint[];
  
  /** SVG element */
  svg: any;
  
  /** Chart group */
  chart?: any;
  
  /** Chart width (excluding margins) */
  width?: number;
  
  /** Chart height (excluding margins) */
  height?: number;
  
  /** X-axis scale */
  xScale?: any;
  
  /** Y-axis scale */
  yScale?: any;
  
  /** Color scale */
  colorScale?: any;
  
  /** Tooltip element */
  tooltip?: any;
  
  /** Whether the chart has been initialized */
  initialized: boolean;
}

/**
 * Heat Map Chart Event Data
 */
interface IHeatMapChartEventData {
  event: any;
  data: IHeatMapDataPoint;
}

/**
 * Heat Map Chart
 *
 * Visualizes data as a heat map with customizable colors and interactions.
 */
class HeatMapChart extends EventEmitter {
  /** Chart configuration */
  private config: IHeatMapChartConfig;
  
  /** Chart state */
  private state: IHeatMapChartState;
  
  /**
   * Create a new HeatMapChart instance
   * @param options - Configuration options
   */
  constructor(options: IHeatMapChartConfig = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Container element or selector
      container: null,

      // Chart dimensions
      width: 800,
      height: 500,

      // Margins
      margin: {
        top: 50,
        right: 50,
        bottom: 70,
        left: 70,
      },

      // Colors
      colors: [
        '#f7fbff',
        '#deebf7',
        '#c6dbef',
        '#9ecae1',
        '#6baed6',
        '#4292c6',
        '#2171b5',
        '#08519c',
        '#08306b',
      ],

      // Labels
      title: 'Heat Map Chart',
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis',

      // Transitions
      transitionDuration: 500,

      // Tooltip
      tooltipEnabled: true,
      tooltipFormat: (d: IHeatMapDataPoint) => `${d.x}, ${d.y}: ${d.value}`,

      // Legend
      legendEnabled: true,
      legendTitle: 'Value',

      // Interaction
      interactive: true,

      // Merge with provided options
      ...options,
    };

    // State
    this.state = {
      data: [],
      svg: null,
      initialized: false,
    };

    // Initialize if container is provided
    if (this.config.container) {
      this._init();
    }
  }

  /**
   * Initialize the chart
   * @private
   */
  private _init(): void {
    this.log('Initializing Heat Map Chart');

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
      this.log('D3 is required for Heat Map Chart');

      // Add d3 script if not available
      if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://d3js.org/d3.v7.min.js';
        script.onload = () => this._initChart(container as HTMLElement);
        document.head.appendChild(script);
      }

      return;
    }

    // Initialize chart
    this._initChart(container as HTMLElement);
  }

  /**
   * Initialize chart with D3
   * @param container - Container element
   * @private
   */
  private _initChart(container: HTMLElement): void {
    // Create SVG
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.config.width)
      .attr('height', this.config.height)
      .attr('class', 'heat-map-chart');

    // Create chart group
    const chart = svg
      .append('g')
      .attr('transform', `translate(${this.config.margin!.left}, ${this.config.margin!.top})`);

    // Calculate dimensions
    const width = (this.config.width as number) - this.config.margin!.left - this.config.margin!.right;
    const height = (this.config.height as number) - this.config.margin!.top - this.config.margin!.bottom;

    // Create scales
    const xScale = d3.scaleBand().range([0, width]).padding(0.05);

    const yScale = d3.scaleBand().range([height, 0]).padding(0.05);

    const colorScale = d3.scaleQuantile().range(this.config.colors as string[]);

    // Create axes
    const xAxis = chart
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`);

    const yAxis = chart.append('g').attr('class', 'y-axis');

    // Create title
    const title = svg
      .append('text')
      .attr('class', 'chart-title')
      .attr('x', (this.config.width as number) / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(this.config.title);

    // Create axis labels
    const xAxisLabel = svg
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', (this.config.width as number) / 2)
      .attr('y', (this.config.height as number) - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(this.config.xAxisLabel);

    const yAxisLabel = svg
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -((this.config.height as number) / 2))
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(this.config.yAxisLabel);

    // Create tooltip if enabled
    let tooltip = null;

    if (this.config.tooltipEnabled && typeof document !== 'undefined') {
      tooltip = d3
        .select(container)
        .append('div')
        .attr('class', 'heat-map-tooltip')
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
      const legendWidth = 20;
      const legendHeight = height / 2;

      const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${(this.config.width as number) - 50}, ${this.config.margin!.top})`);

      legend
        .append('text')
        .attr('class', 'legend-title')
        .attr('x', 0)
        .attr('y', -10)
        .style('font-size', '12px')
        .style('text-anchor', 'start')
        .text(this.config.legendTitle);
    }

    // Store state
    this.state.svg = svg;
    this.state.chart = chart;
    this.state.width = width;
    this.state.height = height;
    this.state.xScale = xScale;
    this.state.yScale = yScale;
    this.state.colorScale = colorScale;
    this.state.tooltip = tooltip;
    this.state.initialized = true;

    this.log('Heat Map Chart initialized');
    this.emit('initialized');
  }

  /**
   * Set data for the chart
   * @param data - Data array
   * @returns This instance for chaining
   */
  setData(data: IHeatMapDataPoint[]): HeatMapChart {
    this.state.data = data;

    if (this.state.initialized) {
      this._updateChart();
    }

    return this;
  }

  /**
   * Update the chart with current data
   * @private
   */
  private _updateChart(): void {
    if (!this.state.initialized || !this.state.data || this.state.data.length === 0) {
      return;
    }

    const { chart, xScale, yScale, colorScale, width, height, tooltip } = this.state;
    const data = this.state.data;

    // Get unique x and y values
    const xValues = [...new Set(data.map(d => d.x))];
    const yValues = [...new Set(data.map(d => d.y))];

    // Update scales
    xScale.domain(xValues);
    yScale.domain(yValues);
    colorScale.domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]);

    // Update axes
    chart
      .select('.x-axis')
      .transition()
      .duration(this.config.transitionDuration)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    chart
      .select('.y-axis')
      .transition()
      .duration(this.config.transitionDuration)
      .call(d3.axisLeft(yScale));

    // Update cells
    const cells = chart.selectAll('.cell').data(data, (d: IHeatMapDataPoint) => `${d.x}-${d.y}`);

    // Remove old cells
    cells.exit().transition().duration(this.config.transitionDuration).style('opacity', 0).remove();

    // Add new cells
    const newCells = cells
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d: IHeatMapDataPoint) => xScale(d.x))
      .attr('y', (d: IHeatMapDataPoint) => yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .style('fill', 'white')
      .style('opacity', 0);

    // Update all cells
    newCells
      .merge(cells)
      .transition()
      .duration(this.config.transitionDuration)
      .attr('x', (d: IHeatMapDataPoint) => xScale(d.x))
      .attr('y', (d: IHeatMapDataPoint) => yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .style('fill', (d: IHeatMapDataPoint) => colorScale(d.value))
      .style('opacity', 1);

    // Add interactions if enabled
    if (this.config.interactive) {
      newCells
        .on('mouseover', (event: MouseEvent, d: IHeatMapDataPoint) => {
          // Highlight cell
          d3.select(event.target as Element).style('stroke', 'black').style('stroke-width', 2);

          // Show tooltip
          if (tooltip) {
            tooltip.style('visibility', 'visible').html((this.config.tooltipFormat as Function)(d));
          }

          // Emit event
          this.emit('cell-hover', { event, data: d });
        })
        .on('mousemove', (event: MouseEvent) => {
          // Move tooltip
          if (tooltip) {
            tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
          }
        })
        .on('mouseout', (event: MouseEvent, d: IHeatMapDataPoint) => {
          // Remove highlight
          d3.select(event.target as Element).style('stroke', 'none');

          // Hide tooltip
          if (tooltip) {
            tooltip.style('visibility', 'hidden');
          }

          // Emit event
          this.emit('cell-leave', { event, data: d });
        })
        .on('click', (event: MouseEvent, d: IHeatMapDataPoint) => {
          // Emit event
          this.emit('cell-click', { event, data: d });
        });
    }

    // Update legend if enabled
    if (this.config.legendEnabled) {
      const legend = this.state.svg.select('.legend');
      const legendWidth = 20;
      const legendHeight = height / 2;

      // Create gradient
      const defs = this.state.svg.append('defs');

      const gradient = defs
        .append('linearGradient')
        .attr('id', 'heat-map-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      // Add gradient stops
      const colorDomain = colorScale.domain();
      const colorRange = colorScale.range();

      colorRange.forEach((color: string, i: number) => {
        const offset = i / (colorRange.length - 1);

        gradient
          .append('stop')
          .attr('offset', `${offset * 100}%`)
          .attr('stop-color', color);
      });

      // Add legend rectangle
      legend.selectAll('.legend-rect').remove();

      legend
        .append('rect')
        .attr('class', 'legend-rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#heat-map-gradient)');

      // Add legend scale
      const legendScale = d3
        .scaleLinear()
        .domain([d3.min(data, (d: IHeatMapDataPoint) => d.value), d3.max(data, (d: IHeatMapDataPoint) => d.value)])
        .range([legendHeight, 0]);

      const legendAxis = d3.axisRight(legendScale).ticks(5);

      legend.selectAll('.legend-axis').remove();

      legend
        .append('g')
        .attr('class', 'legend-axis')
        .attr('transform', `translate(${legendWidth}, 0)`)
        .call(legendAxis);
    }

    this.log('Heat Map Chart updated');
    this.emit('updated');
  }

  /**
   * Resize the chart
   * @param width - New width
   * @param height - New height
   * @returns This instance for chaining
   */
  resize(width: number, height: number): HeatMapChart {
    if (!this.state.initialized) {
      return this;
    }

    // Update config
    this.config.width = width;
    this.config.height = height;

    // Update SVG
    this.state.svg.attr('width', width).attr('height', height);

    // Update dimensions
    this.state.width = width - this.config.margin!.left - this.config.margin!.right;
    this.state.height = height - this.config.margin!.top - this.config.margin!.bottom;

    // Update scales
    this.state.xScale.range([0, this.state.width]);
    this.state.yScale.range([this.state.height, 0]);

    // Update chart
    this._updateChart();

    return this;
  }

  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   * @private
   */
  private log(message: string): void {
    if (this.config.debugMode) {
      console.log(`[HeatMapChart] ${message}`);
    }
  }
}

export { HeatMapChart, IHeatMapDataPoint, IHeatMapChartConfig };
