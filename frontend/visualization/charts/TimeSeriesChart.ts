/**
 * Time Series Chart
 *
 * Visualizes time series data with customizable options and interactions.
 *
 * @version 1.0.0
 */

import { EventEmitter } from 'events';

/**
 * Time series data point interface
 */
interface ITimeSeriesDataPoint {
  /** Data point date */
  date: Date | string;
  
  /** Data point value */
  value: number;
}

/**
 * Time series data series interface
 */
interface ITimeSeriesDataSeries {
  /** Series ID */
  id: string;
  
  /** Series name */
  name: string;
  
  /** Series color */
  color?: string;
  
  /** Series visibility */
  visible?: boolean;
  
  /** Series data points */
  values: ITimeSeriesDataPoint[];
}

/**
 * Processed time series data point
 */
interface IProcessedTimeSeriesDataPoint {
  /** Data point date */
  date: Date;
  
  /** Data point value */
  value: number;
}

/**
 * Processed time series data series
 */
interface IProcessedTimeSeriesDataSeries extends Omit<ITimeSeriesDataSeries, 'values'> {
  /** Series data points */
  values: IProcessedTimeSeriesDataPoint[];
}

/**
 * Time series chart configuration
 */
interface ITimeSeriesChartConfig {
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
  
  /** Series colors */
  colors?: string[];
  
  /** Chart title */
  title?: string;
  
  /** X-axis label */
  xAxisLabel?: string;
  
  /** Y-axis label */
  yAxisLabel?: string;
  
  /** Time format */
  timeFormat?: string;
  
  /** Line width */
  lineWidth?: number;
  
  /** Line curve type */
  lineCurve?: 'linear' | 'step' | 'cardinal' | 'monotone';
  
  /** Enable area fill */
  areaEnabled?: boolean;
  
  /** Area opacity */
  areaOpacity?: number;
  
  /** Enable data points */
  pointsEnabled?: boolean;
  
  /** Point radius */
  pointRadius?: number;
  
  /** Enable grid lines */
  gridEnabled?: boolean;
  
  /** Transition duration in milliseconds */
  transitionDuration?: number;
  
  /** Enable tooltip */
  tooltipEnabled?: boolean;
  
  /** Tooltip format function */
  tooltipFormat?: (d: IProcessedTimeSeriesDataPoint) => string;
  
  /** Enable legend */
  legendEnabled?: boolean;
  
  /** Enable zoom */
  zoomEnabled?: boolean;
  
  /** Enable interactivity */
  interactive?: boolean;
}

/**
 * Time series chart state
 */
interface ITimeSeriesChartState {
  /** Chart data */
  data: ITimeSeriesDataSeries[];
  
  /** SVG element */
  svg?: any;
  
  /** Chart group */
  chart?: any;
  
  /** Content group */
  contentGroup?: any;
  
  /** Chart width (excluding margins) */
  width?: number;
  
  /** Chart height (excluding margins) */
  height?: number;
  
  /** X-axis scale */
  xScale?: any;
  
  /** Y-axis scale */
  yScale?: any;
  
  /** X-axis */
  xAxis?: any;
  
  /** Y-axis */
  yAxis?: any;
  
  /** X-axis group */
  xAxisGroup?: any;
  
  /** Y-axis group */
  yAxisGroup?: any;
  
  /** Tooltip element */
  tooltip?: any;
  
  /** Legend element */
  legend?: any;
  
  /** Zoom behavior */
  zoom?: any;
  
  /** Whether chart is initialized */
  initialized: boolean;
}

/**
 * Chart event data
 */
interface ITimeSeriesChartEventData {
  /** Event object */
  event: any;
  
  /** Data point */
  data: IProcessedTimeSeriesDataPoint;
  
  /** Whether series is visible (for series-toggle events) */
  visible?: boolean;
  
  /** Transform object (for zoom events) */
  transform?: any;
}

/**
 * Time Series Chart
 *
 * Visualizes time series data with customizable options and interactions.
 */
class TimeSeriesChart extends EventEmitter {
  /** Chart configuration */
  private config: ITimeSeriesChartConfig;
  
  /** Chart state */
  private state: ITimeSeriesChartState;
  
  /**
   * Create a new TimeSeriesChart instance
   * @param options - Configuration options
   */
  constructor(options: ITimeSeriesChartConfig = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Container element or selector
      container: null,

      // Chart dimensions
      width: 800,
      height: 400,

      // Margins
      margin: {
        top: 50,
        right: 50,
        bottom: 70,
        left: 70,
      },

      // Colors
      colors: [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf',
      ],

      // Labels
      title: 'Time Series Chart',
      xAxisLabel: 'Time',
      yAxisLabel: 'Value',

      // Time format
      timeFormat: '%Y-%m-%d',

      // Line options
      lineWidth: 2,
      lineCurve: 'linear', // 'linear', 'step', 'cardinal', 'monotone'

      // Area options
      areaEnabled: false,
      areaOpacity: 0.1,

      // Point options
      pointsEnabled: true,
      pointRadius: 3,

      // Grid options
      gridEnabled: true,

      // Transitions
      transitionDuration: 500,

      // Tooltip
      tooltipEnabled: true,
      tooltipFormat: (d: IProcessedTimeSeriesDataPoint) => `${d.date.toLocaleDateString()}: ${d.value}`,

      // Legend
      legendEnabled: true,

      // Zoom
      zoomEnabled: true,

      // Interaction
      interactive: true,

      // Merge with provided options
      ...options,
    };

    // State
    this.state = {
      data: [],
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
    this.log('Initializing Time Series Chart');

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
      this.log('D3 is required for Time Series Chart');

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
      .attr('class', 'time-series-chart');

    // Create chart group
    const chart = svg
      .append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${this.config.margin!.left}, ${this.config.margin!.top})`);

    // Calculate dimensions
    const width = (this.config.width as number) - this.config.margin!.left - this.config.margin!.right;
    const height = (this.config.height as number) - this.config.margin!.top - this.config.margin!.bottom;

    // Create clip path
    chart
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    // Create scales
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat(this.config.timeFormat));
    const yAxis = d3.axisLeft(yScale);

    // Create grid if enabled
    if (this.config.gridEnabled) {
      // X grid
      chart
        .append('g')
        .attr('class', 'grid x-grid')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''));

      // Y grid
      chart
        .append('g')
        .attr('class', 'grid y-grid')
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

      // Style grid
      chart
        .selectAll('.grid line')
        .style('stroke', '#e0e0e0')
        .style('stroke-opacity', 0.7)
        .style('shape-rendering', 'crispEdges');

      chart.selectAll('.grid path').style('stroke-width', 0);
    }

    // Create axes groups
    const xAxisGroup = chart
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`);

    const yAxisGroup = chart.append('g').attr('class', 'y-axis');

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
        .attr('class', 'time-series-tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'rgba(0, 0, 0, 0.7)')
        .style('color', 'white')
        .style('padding', '5px')
        .style('border-radius', '3px')
        .style('pointer-events', 'none');
    }

    // Create legend if enabled
    let legend = null;

    if (this.config.legendEnabled) {
      legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${(this.config.width as number) - 150}, 50)`);
    }

    // Create zoom if enabled
    if (this.config.zoomEnabled) {
      const zoom = d3
        .zoom()
        .scaleExtent([1, 10])
        .extent([
          [0, 0],
          [width, height],
        ])
        .on('zoom', (event: any) => {
          // Update scales
          const newXScale = event.transform.rescaleX(xScale);

          // Update axes
          xAxisGroup.call(xAxis.scale(newXScale));

          // Update grid
          if (this.config.gridEnabled) {
            chart.select('.x-grid').call(d3.axisBottom(newXScale).tickSize(-height).tickFormat(''));
          }

          // Update lines
          chart.selectAll('.line').attr('d', (d: IProcessedTimeSeriesDataSeries) => {
            const line = d3
              .line<IProcessedTimeSeriesDataPoint>()
              .x(d => newXScale(d.date))
              .y(d => yScale(d.value))
              .curve(this._getCurve(this.config.lineCurve as string));

            return line(d.values);
          });

          // Update areas
          if (this.config.areaEnabled) {
            chart.selectAll('.area').attr('d', (d: IProcessedTimeSeriesDataSeries) => {
              const area = d3
                .area<IProcessedTimeSeriesDataPoint>()
                .x(d => newXScale(d.date))
                .y0(height)
                .y1(d => yScale(d.value))
                .curve(this._getCurve(this.config.lineCurve as string));

              return area(d.values);
            });
          }

          // Update points
          if (this.config.pointsEnabled) {
            chart
              .selectAll('.point-group')
              .selectAll('.point')
              .attr('cx', (d: IProcessedTimeSeriesDataPoint) => newXScale(d.date))
              .attr('cy', (d: IProcessedTimeSeriesDataPoint) => yScale(d.value));
          }

          // Emit event
          this.emit('zoom', { event, transform: event.transform });
        });

      // Add zoom to chart
      svg.call(zoom);

      // Store zoom
      this.state.zoom = zoom;
    }

    // Create content group with clip path
    const contentGroup = chart
      .append('g')
      .attr('class', 'content-group')
      .attr('clip-path', 'url(#clip)');

    // Store state
    this.state.svg = svg;
    this.state.chart = chart;
    this.state.contentGroup = contentGroup;
    this.state.width = width;
    this.state.height = height;
    this.state.xScale = xScale;
    this.state.yScale = yScale;
    this.state.xAxis = xAxis;
    this.state.yAxis = yAxis;
    this.state.xAxisGroup = xAxisGroup;
    this.state.yAxisGroup = yAxisGroup;
    this.state.tooltip = tooltip;
    this.state.legend = legend;
    this.state.initialized = true;

    this.log('Time Series Chart initialized');
    this.emit('initialized');
  }

  /**
   * Set data for the chart
   * @param data - Data array
   * @returns This instance for chaining
   */
  setData(data: ITimeSeriesDataSeries[]): TimeSeriesChart {
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

    const {
      contentGroup,
      xScale,
      yScale,
      xAxis,
      yAxis,
      xAxisGroup,
      yAxisGroup,
      width,
      height,
      tooltip,
      legend,
    } = this.state;

    const data = this.state.data;

    // Process data
    const processedData: IProcessedTimeSeriesDataSeries[] = data.map(series => {
      // Ensure values have date objects
      const values = series.values.map(d => ({
        date: d.date instanceof Date ? d.date : new Date(d.date),
        value: +d.value,
      }));

      return {
        ...series,
        values,
      };
    });

    // Update scales
    const allValues = processedData.flatMap(d => d.values);

    xScale.domain(d3.extent(allValues, (d: IProcessedTimeSeriesDataPoint) => d.date));
    yScale.domain([
      d3.min(allValues, (d: IProcessedTimeSeriesDataPoint) => d.value) * 0.9,
      d3.max(allValues, (d: IProcessedTimeSeriesDataPoint) => d.value) * 1.1
    ]);

    // Update axes
    xAxisGroup.transition().duration(this.config.transitionDuration).call(xAxis);
    yAxisGroup.transition().duration(this.config.transitionDuration).call(yAxis);

    // Update grid if enabled
    if (this.config.gridEnabled) {
      this.state.chart
        .select('.x-grid')
        .transition()
        .duration(this.config.transitionDuration as number)
        .call(d3.axisBottom(xScale).tickSize(-(height as number)).tickFormat(''));

      this.state.chart
        .select('.y-grid')
        .transition()
        .duration(this.config.transitionDuration as number)
        .call(d3.axisLeft(yScale).tickSize(-(width as number)).tickFormat(''));
    }

    // Create line generator
    const line = d3
      .line<IProcessedTimeSeriesDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(this._getCurve(this.config.lineCurve as string));

    // Create area generator if enabled
    let area = null;

    if (this.config.areaEnabled) {
      area = d3
        .area<IProcessedTimeSeriesDataPoint>()
        .x(d => xScale(d.date))
        .y0(height as number)
        .y1(d => yScale(d.value))
        .curve(this._getCurve(this.config.lineCurve as string));
    }

    // Update lines
    const lines = contentGroup.selectAll('.line').data(processedData, (d: IProcessedTimeSeriesDataSeries) => d.id);

    // Remove old lines
    lines.exit().transition().duration(this.config.transitionDuration).style('opacity', 0).remove();

    // Add new lines
    const newLines = lines
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', (d: IProcessedTimeSeriesDataSeries, i: number) => 
        d.color || (this.config.colors as string[])[i % (this.config.colors as string[]).length]
      )
      .attr('stroke-width', this.config.lineWidth)
      .attr('d', (d: IProcessedTimeSeriesDataSeries) => line(d.values))
      .style('opacity', 0);

    // Update all lines
    newLines
      .merge(lines)
      .transition()
      .duration(this.config.transitionDuration as number)
      .attr('d', (d: IProcessedTimeSeriesDataSeries) => line(d.values))
      .style('opacity', 1);

    // Update areas if enabled
    if (this.config.areaEnabled && area) {
      const areas = contentGroup.selectAll('.area').data(processedData, (d: IProcessedTimeSeriesDataSeries) => d.id);

      // Remove old areas
      areas
        .exit()
        .transition()
        .duration(this.config.transitionDuration as number)
        .style('opacity', 0)
        .remove();

      // Add new areas
      const newAreas = areas
        .enter()
        .append('path')
        .attr('class', 'area')
        .attr('fill', (d: IProcessedTimeSeriesDataSeries, i: number) => 
          d.color || (this.config.colors as string[])[i % (this.config.colors as string[]).length]
        )
        .attr('opacity', this.config.areaOpacity)
        .attr('d', (d: IProcessedTimeSeriesDataSeries) => area!(d.values))
        .style('opacity', 0);

      // Update all areas
      newAreas
        .merge(areas)
        .transition()
        .duration(this.config.transitionDuration as number)
        .attr('d', (d: IProcessedTimeSeriesDataSeries) => area!(d.values))
        .style('opacity', this.config.areaOpacity);
    }

    // Update points if enabled
    if (this.config.pointsEnabled) {
      const pointGroups = contentGroup.selectAll('.point-group').data(
        processedData, 
        (d: IProcessedTimeSeriesDataSeries) => d.id
      );

      // Remove old point groups
      pointGroups
        .exit()
        .transition()
        .duration(this.config.transitionDuration as number)
        .style('opacity', 0)
        .remove();

      // Add new point groups
      const newPointGroups = pointGroups.enter().append('g').attr('class', 'point-group');

      // Update points for each group
      const updatePoints = (selection: any) => {
        const points = selection.selectAll('.point').data((d: IProcessedTimeSeriesDataSeries) => d.values);

        // Remove old points
        points
          .exit()
          .transition()
          .duration(this.config.transitionDuration as number)
          .style('opacity', 0)
          .remove();

        // Add new points
        const newPoints = points
          .enter()
          .append('circle')
          .attr('class', 'point')
          .attr('cx', (d: IProcessedTimeSeriesDataPoint) => xScale(d.date))
          .attr('cy', (d: IProcessedTimeSeriesDataPoint) => yScale(d.value))
          .attr('r', this.config.pointRadius)
          .attr('fill', function(this: any) {
            const parentData = d3.select(this.parentNode).datum() as IProcessedTimeSeriesDataSeries;
            const index = processedData.findIndex(d => d.id === parentData.id);
            return parentData.color || (this.config.colors as string[])[index % (this.config.colors as string[]).length];
          })
          .style('opacity', 0);

        // Update all points
        newPoints
          .merge(points)
          .transition()
          .duration(this.config.transitionDuration as number)
          .attr('cx', (d: IProcessedTimeSeriesDataPoint) => xScale(d.date))
          .attr('cy', (d: IProcessedTimeSeriesDataPoint) => yScale(d.value))
          .style('opacity', 1);

        // Add interactions if enabled
        if (this.config.interactive) {
          newPoints
            .on('mouseover', (event: any, d: IProcessedTimeSeriesDataPoint) => {
              // Highlight point
              d3.select(event.target).attr('r', (this.config.pointRadius as number) * 1.5);

              // Show tooltip
              if (tooltip) {
                tooltip.style('visibility', 'visible').html((this.config.tooltipFormat as Function)(d));
              }

              // Emit event
              this.emit('point-hover', { event, data: d });
            })
            .on('mousemove', (event: any) => {
              // Move tooltip
              if (tooltip) {
                tooltip
                  .style('top', `${event.pageY - 10}px`)
                  .style('left', `${event.pageX + 10}px`);
              }
            })
            .on('mouseout', (event: any, d: IProcessedTimeSeriesDataPoint) => {
              // Remove highlight
              d3.select(event.target).attr('r', this.config.pointRadius);

              // Hide tooltip
              if (tooltip) {
                tooltip.style('visibility', 'hidden');
              }

              // Emit event
              this.emit('point-leave', { event, data: d });
            })
            .on('click', (event: any, d: IProcessedTimeSeriesDataPoint) => {
              // Emit event
              this.emit('point-click', { event, data: d });
            });
        }
      };

      // Update existing point groups
      pointGroups.call(updatePoints);

      // Update new point groups
      newPointGroups.call(updatePoints);
    }

    // Update legend if enabled
    if (this.config.legendEnabled && legend) {
      const legendItems = legend.selectAll('.legend-item').data(
        processedData, 
        (d: IProcessedTimeSeriesDataSeries) => d.id
      );

      // Remove old items
      legendItems.exit().remove();

      // Add new items
      const newLegendItems = legendItems
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d: IProcessedTimeSeriesDataSeries, i: number) => `translate(0, ${i * 20})`);

      // Add legend lines
      newLegendItems
        .append('line')
        .attr('x1', 0)
        .attr('y1', 9)
        .attr('x2', 20)
        .attr('y2', 9)
        .attr('stroke', (d: IProcessedTimeSeriesDataSeries, i: number) => 
          d.color || (this.config.colors as string[])[i % (this.config.colors as string[]).length]
        )
        .attr('stroke-width', this.config.lineWidth);

      // Add legend text
      newLegendItems
        .append('text')
        .attr('x', 25)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('font-size', '12px')
        .text((d: IProcessedTimeSeriesDataSeries) => d.name);

      // Add interactions if enabled
      if (this.config.interactive) {
        newLegendItems.style('cursor', 'pointer').on('click', (event: any, d: IProcessedTimeSeriesDataSeries) => {
          // Toggle visibility
          const visible = d.visible !== false;
          d.visible = !visible;

          // Update opacity
          contentGroup
            .selectAll('.line')
            .filter((line: IProcessedTimeSeriesDataSeries) => line.id === d.id)
            .transition()
            .duration(this.config.transitionDuration as number)
            .style('opacity', visible ? 0 : 1);

          if (this.config.areaEnabled) {
            contentGroup
              .selectAll('.area')
              .filter((area: IProcessedTimeSeriesDataSeries) => area.id === d.id)
              .transition()
              .duration(this.config.transitionDuration as number)
              .style('opacity', visible ? 0 : this.config.areaOpacity);
          }

          if (this.config.pointsEnabled) {
            contentGroup
              .selectAll('.point-group')
              .filter((group: IProcessedTimeSeriesDataSeries) => group.id === d.id)
              .transition()
              .duration(this.config.transitionDuration as number)
              .style('opacity', visible ? 0 : 1);
          }

          // Update legend item
          d3.select(event.currentTarget).style('opacity', visible ? 0.5 : 1);

          // Emit event
          this.emit('series-toggle', { event, data: d, visible: !visible });
        });
      }
    }

    this.log('Time Series Chart updated');
    this.emit('updated');
  }

  /**
   * Get D3 curve function
   * @param curve - Curve type
   * @returns D3 curve function
   * @private
   */
  private _getCurve(curve: string): any {
    switch (curve) {
      case 'step':
        return d3.curveStep;
      case 'cardinal':
        return d3.curveCardinal;
      case 'monotone':
        return d3.curveMonotoneX;
      case 'linear':
      default:
        return d3.curveLinear;
    }
  }

  /**
   * Resize the chart
   * @param width - New width
   * @param height - New height
   * @returns This instance for chaining
   */
  resize(width: number, height: number): TimeSeriesChart {
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

    // Update clip path
    this.state.chart
      .select('defs clipPath rect')
      .attr('width', this.state.width)
      .attr('height', this.state.height);

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
      console.log(`[TimeSeriesChart] ${message}`);
    }
  }
}

export { 
  TimeSeriesChart, 
  ITimeSeriesDataPoint,
  ITimeSeriesDataSeries,
  ITimeSeriesChartConfig 
};
