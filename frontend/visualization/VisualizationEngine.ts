/**
 * Visualization Engine
 *
 * A comprehensive engine for creating and managing data visualizations.
 *
 * @version 1.0.0
 */

// Import renderers
import { PatternHeatMapRenderer } from './charts/PatternHeatMapRenderer';
import { QueryRelationshipGraphRenderer } from './charts/QueryRelationshipGraphRenderer';
import { TimeSeriesRenderer } from './charts/TimeSeriesRenderer';

/**
 * Visualization Engine Configuration
 */
interface IVisualizationEngineConfig {
  /** Debug mode */
  debugMode?: boolean;
  
  /** Default theme */
  theme?: string;
  
  /** Default color palette */
  colorPalette?: string;
  
  /** Animation enabled */
  animationsEnabled?: boolean;
  
  /** Responsive design */
  responsive?: boolean;
  
  /** Additional options */
  [key: string]: any;
}

/**
 * Visualization State
 */
interface IVisualizationState {
  /** Is initialized */
  initialized: boolean;
  
  /** Is rendered */
  rendered: boolean;
  
  /** Error message (if any) */
  error: string | null;
}

/**
 * Visualization
 */
interface IVisualization {
  /** Visualization ID */
  id: string;
  
  /** Visualization type */
  type: string;
  
  /** Visualization options */
  options: IVisualizationEngineConfig;
  
  /** Visualization renderer */
  renderer: any;
  
  /** Visualization data */
  data: any;
  
  /** DOM element */
  element: HTMLElement | null;
  
  /** Visualization state */
  state: IVisualizationState;
  
  /** Creation timestamp */
  createdAt: number;
}

/**
 * Event listener
 */
type EventListener = (data: any) => void;

/**
 * Visualization Engine
 */
class VisualizationEngine {
  /** Configuration */
  private config: IVisualizationEngineConfig;
  
  /** Visualizations map */
  private visualizations: Map<string, IVisualization>;
  
  /** Renderers map */
  private renderers: Map<string, any>;
  
  /** Event listeners map */
  private eventListeners: Map<string, EventListener[]>;
  
  /** Next visualization ID */
  private nextVisualizationId: number;

  /**
   * Create a new VisualizationEngine instance
   * @param options - Configuration options
   */
  constructor(options: IVisualizationEngineConfig = {}) {
    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Default theme
      theme: 'light',

      // Default color palette
      colorPalette: 'quantum',

      // Animation enabled
      animationsEnabled: true,

      // Responsive design
      responsive: true,

      // Merge with provided options
      ...options,
    };

    // State
    this.visualizations = new Map<string, IVisualization>();
    this.renderers = new Map<string, any>();
    this.eventListeners = new Map<string, EventListener[]>();
    this.nextVisualizationId = 1;

    // Initialize
    this._init();
  }

  /**
   * Initialize the engine
   * @private
   */
  private _init(): void {
    this.log('Initializing Visualization Engine');

    // Register built-in renderers
    this._registerBuiltInRenderers();

    this.log('Visualization Engine initialized');
  }

  /**
   * Register built-in renderers
   * @private
   */
  private _registerBuiltInRenderers(): void {
    try {
      // Register renderers
      this.registerRenderer('patternHeatMap', new PatternHeatMapRenderer());
      this.registerRenderer('queryRelationshipGraph', new QueryRelationshipGraphRenderer());
      this.registerRenderer('timeSeries', new TimeSeriesRenderer());

      this.log(`Registered ${this.renderers.size} built-in renderers`);
    } catch (error) {
      this.log(`Error registering built-in renderers: ${(error as Error).message}`);
    }
  }

  /**
   * Register a renderer
   * @param name - Renderer name
   * @param renderer - Renderer instance
   * @returns This instance for chaining
   */
  registerRenderer(name: string, renderer: any): VisualizationEngine {
    if (!name || !renderer) {
      throw new Error('Renderer name and instance are required');
    }

    // Check if renderer is valid
    if (!renderer.render || typeof renderer.render !== 'function') {
      throw new Error('Invalid renderer: must implement render method');
    }

    this.renderers.set(name, renderer);
    this.log(`Registered renderer: ${name}`);

    return this;
  }

  /**
   * Get a renderer
   * @param name - Renderer name
   * @returns Renderer instance
   */
  getRenderer(name: string): any {
    if (!this.renderers.has(name)) {
      throw new Error(`Renderer not found: ${name}`);
    }

    return this.renderers.get(name);
  }

  /**
   * Create a visualization
   * @param type - Visualization type
   * @param options - Visualization options
   * @returns Visualization instance
   */
  createVisualization(type: string, options: IVisualizationEngineConfig = {}): IVisualization {
    // Check if renderer exists
    if (!this.renderers.has(type)) {
      throw new Error(`Renderer not found: ${type}`);
    }

    // Get renderer
    const renderer = this.renderers.get(type);

    // Generate ID
    const id = this._generateId();

    // Create visualization
    const visualization: IVisualization = {
      id,
      type,
      options: {
        ...this.config,
        ...options,
      },
      renderer,
      data: null,
      element: null,
      state: {
        initialized: false,
        rendered: false,
        error: null,
      },
      createdAt: Date.now(),
    };

    // Store visualization
    this.visualizations.set(id, visualization);

    this.log(`Created visualization: ${id} (${type})`);

    return visualization;
  }

  /**
   * Get a visualization
   * @param id - Visualization ID
   * @returns Visualization instance
   */
  getVisualization(id: string): IVisualization {
    if (!this.visualizations.has(id)) {
      throw new Error(`Visualization not found: ${id}`);
    }

    return this.visualizations.get(id)!;
  }

  /**
   * Remove a visualization
   * @param id - Visualization ID
   * @returns Success
   */
  removeVisualization(id: string): boolean {
    if (!this.visualizations.has(id)) {
      return false;
    }

    // Get visualization
    const visualization = this.visualizations.get(id)!;

    // Clean up
    if (visualization.element) {
      try {
        // Clear element
        visualization.element.innerHTML = '';
      } catch (error) {
        this.log(`Error clearing element: ${(error as Error).message}`);
      }
    }

    // Remove from map
    this.visualizations.delete(id);

    this.log(`Removed visualization: ${id}`);

    return true;
  }

  /**
   * Set data for a visualization
   * @param id - Visualization ID
   * @param data - Visualization data
   * @returns Visualization instance
   */
  setData(id: string, data: any): IVisualization {
    // Get visualization
    const visualization = this.getVisualization(id);

    // Set data
    visualization.data = data;

    // Update visualization if already rendered
    if (visualization.state.rendered && visualization.element) {
      this._renderVisualization(visualization);
    }

    this.log(`Set data for visualization: ${id}`);

    return visualization;
  }

  /**
   * Render a visualization
   * @param id - Visualization ID
   * @param element - DOM element to render into
   * @returns Visualization instance
   */
  render(id: string, element: HTMLElement): IVisualization {
    // Get visualization
    const visualization = this.getVisualization(id);

    // Check element
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error('Valid DOM element is required');
    }

    // Set element
    visualization.element = element;

    // Render visualization
    this._renderVisualization(visualization);

    return visualization;
  }

  /**
   * Render a visualization
   * @param visualization - Visualization instance
   * @private
   */
  private _renderVisualization(visualization: IVisualization): void {
    try {
      // Clear element
      if (visualization.element) {
        visualization.element.innerHTML = '';
      }

      // Initialize if not already
      if (!visualization.state.initialized) {
        visualization.renderer.initialize(visualization.options);
        visualization.state.initialized = true;
      }

      // Render
      visualization.renderer.render(
        visualization.element,
        visualization.data,
        visualization.options
      );

      // Update state
      visualization.state.rendered = true;
      visualization.state.error = null;

      // Emit event
      this._emit('render', {
        id: visualization.id,
        type: visualization.type,
        element: visualization.element,
      });

      this.log(`Rendered visualization: ${visualization.id}`);
    } catch (error) {
      // Update state
      visualization.state.error = (error as Error).message;

      // Emit event
      this._emit('error', {
        id: visualization.id,
        type: visualization.type,
        error: (error as Error).message,
      });

      this.log(`Error rendering visualization: ${(error as Error).message}`);

      // Re-throw error
      throw error;
    }
  }

  /**
   * Update a visualization
   * @param id - Visualization ID
   * @param options - Visualization options
   * @returns Visualization instance
   */
  update(id: string, options: IVisualizationEngineConfig = {}): IVisualization {
    // Get visualization
    const visualization = this.getVisualization(id);

    // Update options
    visualization.options = {
      ...visualization.options,
      ...options,
    };

    // Update visualization if already rendered
    if (visualization.state.rendered && visualization.element) {
      this._renderVisualization(visualization);
    }

    this.log(`Updated visualization: ${id}`);

    return visualization;
  }

  /**
   * Destroy a visualization
   * @param id - Visualization ID
   * @returns Success
   */
  destroy(id: string): boolean {
    // Get visualization
    const visualization = this.getVisualization(id);

    // Destroy renderer
    if (visualization.renderer && visualization.element) {
      visualization.renderer.destroy(visualization.element);
    }

    // Remove visualization
    return this.removeVisualization(id);
  }

  /**
   * Add event listener
   * @param event - Event name
   * @param listener - Event listener
   * @returns This instance for chaining
   */
  on(event: string, listener: EventListener): VisualizationEngine {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }

    this.eventListeners.get(event)!.push(listener);

    return this;
  }

  /**
   * Remove event listener
   * @param event - Event name
   * @param listener - Event listener
   * @returns This instance for chaining
   */
  off(event: string, listener: EventListener): VisualizationEngine {
    if (!this.eventListeners.has(event)) {
      return this;
    }

    const listeners = this.eventListeners.get(event)!;
    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    return this;
  }

  /**
   * Emit event
   * @param event - Event name
   * @param data - Event data
   * @private
   */
  private _emit(event: string, data: any): void {
    if (!this.eventListeners.has(event)) {
      return;
    }

    const listeners = this.eventListeners.get(event)!;

    for (const listener of listeners) {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    }
  }

  /**
   * Generate unique ID
   * @returns Unique ID
   * @private
   */
  private _generateId(): string {
    return `viz-${this.nextVisualizationId++}`;
  }

  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   * @private
   */
  private log(message: string): void {
    if (this.config.debugMode) {
      console.log(`[VisualizationEngine] ${message}`);
    }
  }
}

export { VisualizationEngine };
