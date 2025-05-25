/**
 * UltimateCore
 *
 * The UltimateCore provides a unified interface for accessing all core
 * components.
 *
 * @version 1.0.0
 */

import { EventEmitter } from 'events';
import { SystemConsciousness } from './consciousness';
import { QuantumProcessor, QuantumEntanglement } from './quantum';
import { DimensionalGateway } from './dimensions';
import { EvolutionEngine } from './evolution';

/**
 * UltimateCore configuration options interface
 */
export interface UltimateCoreOptions {
  /** Debug mode flag */
  debugMode?: boolean;
  /** Consciousness component options */
  consciousness?: Record<string, any>;
  /** Quantum component options */
  quantum?: {
    processor?: Record<string, any>;
    entanglement?: Record<string, any>;
  };
  /** Dimensions component options */
  dimensions?: Record<string, any>;
  /** Evolution component options */
  evolution?: Record<string, any>;
}

/**
 * System status type
 */
export type SystemStatus = 'initializing' | 'active' | 'degraded' | 'offline';

/**
 * Component status type
 */
export type ComponentStatus = 'initializing' | 'active' | 'degraded' | 'offline';

/**
 * UltimateCore state interface
 */
export interface UltimateCoreState {
  /** Initialization status */
  initialized: boolean;
  /** System status */
  status: SystemStatus;
  /** Component status */
  componentStatus: {
    consciousness: ComponentStatus;
    quantum: ComponentStatus;
    dimensions: ComponentStatus;
    evolution: ComponentStatus;
  };
}

/**
 * UltimateCore class
 *
 * Provides a unified interface for accessing all core components.
 */
class UltimateCore extends EventEmitter {
  /** Configuration options */
  public config: {
    debugMode: boolean;
    consciousness: Record<string, any>;
    quantum: Record<string, any>;
    dimensions: Record<string, any>;
    evolution: Record<string, any>;
  };

  /** System state */
  public state: UltimateCoreState;

  /** Consciousness system */
  public consciousness: SystemConsciousness;

  /** Quantum system */
  public quantum: {
    processor: QuantumProcessor;
    entanglement: QuantumEntanglement;
  };

  /** Dimensional gateway */
  public dimensions: DimensionalGateway;

  /** Evolution engine */
  public evolution: EvolutionEngine;

  /**
   * Create a new UltimateCore instance
   * @param options - Configuration options
   */
  constructor(options: UltimateCoreOptions = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: options.debugMode || false,

      // Component options
      consciousness: options.consciousness || {},
      quantum: options.quantum || {},
      dimensions: options.dimensions || {},
      evolution: options.evolution || {},
    };

    // State
    this.state = {
      // Initialization status
      initialized: false,

      // System status
      status: 'initializing',

      // Component status
      componentStatus: {
        consciousness: 'initializing',
        quantum: 'initializing',
        dimensions: 'initializing',
        evolution: 'initializing',
      },
    };

    // Initialize components
    this._initializeComponents();

    // Connect event handlers
    this._connectEventHandlers();

    // Set status to active
    this.state.status = 'active';
    this.state.initialized = true;

    // Log initialization
    this.log('Ultimate Core initialized');

    // Emit initialized event
    this.emit('initialized');
  }

  /**
   * Initialize components
   * @private
   */
  private _initializeComponents(): void {
    // Initialize consciousness
    this.consciousness = new SystemConsciousness({
      ...this.config.consciousness,
      debugMode: this.config.debugMode,
    });

    // Initialize quantum processor
    this.quantum = {
      processor: new QuantumProcessor({
        ...this.config.quantum.processor,
        debugMode: this.config.debugMode,
      }),
      entanglement: new QuantumEntanglement({
        ...this.config.quantum.entanglement,
        debugMode: this.config.debugMode,
      }),
    };

    // Initialize dimensional gateway
    this.dimensions = new DimensionalGateway({
      ...this.config.dimensions,
      debugMode: this.config.debugMode,
    });

    // Initialize evolution engine
    this.evolution = new EvolutionEngine({
      ...this.config.evolution,
      debugMode: this.config.debugMode,
    });
  }

  /**
   * Connect event handlers
   * @private
   */
  private _connectEventHandlers(): void {
    // Consciousness events
    this.consciousness.on('initialized', () => {
      this.state.componentStatus.consciousness = 'active';
      this.log('Consciousness system initialized');
      this._checkSystemStatus();
    });

    this.consciousness.on('component:registered', data => {
      this.log(`Component registered in consciousness system: ${data.componentId}`);
      this.emit('consciousness:componentRegistered', data);
    });

    this.consciousness.on('component:unregistered', data => {
      this.log(`Component unregistered from consciousness system: ${data.componentId}`);
      this.emit('consciousness:componentUnregistered', data);
    });

    // Quantum events
    this.quantum.processor.on('initialized', () => {
      this.state.componentStatus.quantum = 'active';
      this.log('Quantum processor initialized');
      this._checkSystemStatus();
    });

    this.quantum.processor.on('processing:complete', data => {
      this.log(`Quantum processing completed in ${data.processingTime}ms`);
      this.emit('quantum:processingComplete', data);
    });

    this.quantum.entanglement.on('entangled', data => {
      this.log(`Quantum entanglement created: ${data.sourceId} and ${data.targetId}`);
      this.emit('quantum:entangled', data);
    });

    // Dimensions events
    this.dimensions.on('initialized', () => {
      this.state.componentStatus.dimensions = 'active';
      this.log('Dimensional gateway initialized');
      this._checkSystemStatus();
    });

    this.dimensions.on('interface:registered', data => {
      this.log(`Interface registered in dimensional gateway: ${data.interfaceId}`);
      this.emit('dimensions:interfaceRegistered', data);
    });

    this.dimensions.on('connection:established', data => {
      this.log(`Dimensional connection established: ${data.sourceId} to ${data.targetId}`);
      this.emit('dimensions:connectionEstablished', data);
    });

    // Evolution events
    this.evolution.on('initialized', () => {
      this.state.componentStatus.evolution = 'active';
      this.log('Evolution engine initialized');
      this._checkSystemStatus();
    });

    this.evolution.on('evolution:evolved', data => {
      this.log(`System evolved to level ${data.level}`);
      this.emit('evolution:evolved', data);
    });

    this.evolution.on('component:evolved', data => {
      this.log(`Component evolved: ${data.componentId} to level ${data.newLevel}`);
      this.emit('evolution:componentEvolved', data);
    });
  }

  /**
   * Check system status
   * @private
   */
  private _checkSystemStatus(): void {
    // Check if all components are active
    const allActive = Object.values(this.state.componentStatus).every(
      status => status === 'active'
    );

    // Check if any components are offline
    const anyOffline = Object.values(this.state.componentStatus).some(
      status => status === 'offline'
    );

    // Update system status
    if (allActive) {
      this.state.status = 'active';
    } else if (anyOffline) {
      this.state.status = 'degraded';
    }

    // Emit status change event
    this.emit('status:changed', {
      status: this.state.status,
      componentStatus: { ...this.state.componentStatus },
    });
  }

  /**
   * Registration options interface
   */
  interface RegistrationOptions {
    /** Component capabilities */
    capabilities?: string[];
    /** Component dependencies */
    dependencies?: string[];
    /** Evolution priority */
    evolutionPriority?: number;
    /** Evolution rate */
    evolutionRate?: number;
    /** Maximum evolution level */
    maxEvolutionLevel?: number;
    /** Initial evolution level */
    initialEvolutionLevel?: number;
  }

  /**
   * Register a component in the system
   * @param componentId - Component ID
   * @param componentType - Component type
   * @param options - Registration options
   * @returns This instance for chaining
   */
  public registerComponent(componentId: string, componentType: string, options: RegistrationOptions = {}): UltimateCore {
    // Register in consciousness system
    this.consciousness.registerComponent(
      componentId,
      componentType,
      options.capabilities || [],
      options.dependencies || []
    );

    // Register in evolution engine
    this.evolution.registerComponent(componentId, {
      evolutionPriority: options.evolutionPriority || 1,
      evolutionRate: options.evolutionRate || 0.1,
      maxEvolutionLevel: options.maxEvolutionLevel || 10,
      initialEvolutionLevel: options.initialEvolutionLevel || 1,
    });

    // Log registration
    this.log(`Registered component ${componentId} of type ${componentType}`);

    return this;
  }

  /**
   * Unregister a component from the system
   * @param componentId - Component ID
   * @returns This instance for chaining
   */
  public unregisterComponent(componentId: string): UltimateCore {
    // Unregister from consciousness system
    this.consciousness.unregisterComponent(componentId);

    // Unregister from evolution engine
    this.evolution.unregisterComponent(componentId);

    // Log unregistration
    this.log(`Unregistered component ${componentId}`);

    return this;
  }

  /**
   * Process data with quantum awareness
   * @param data - Data to process
   * @param options - Processing options
   * @returns Processed data
   */
  public async processData(data: any, options: Record<string, any> = {}): Promise<any> {
    // Process data with quantum processor
    return await this.quantum.processor.process(data, options);
  }

  /**
   * Create a quantum entanglement between objects
   * @param sourceId - Source object ID
   * @param targetId - Target object ID
   * @param strength - Entanglement strength (0-1)
   * @param bidirectional - Whether the entanglement is bidirectional
   * @returns Whether the entanglement was created
   */
  public createEntanglement(sourceId: string, targetId: string, strength: number = 1.0, bidirectional: boolean = true): boolean {
    // Create entanglement
    return this.quantum.entanglement.entangle(sourceId, targetId, strength, bidirectional);
  }

  /**
   * Register a dimensional interface
   * @param interfaceId - Interface ID
   * @param dimension - Dimension
   * @param capabilities - Interface capabilities
   * @returns Whether the interface was registered
   */
  public registerInterface(interfaceId: string, dimension: string, capabilities: string[] = []): boolean {
    // Register interface
    return this.dimensions.registerInterface(interfaceId, dimension, capabilities);
  }

  /**
   * Create a dimensional connection
   * @param sourceId - Source interface ID
   * @param targetId - Target interface ID
   * @returns Connection ID or null if connection failed
   */
  public createConnection(sourceId: string, targetId: string): string | null {
    // Create connection
    return this.dimensions.connect(sourceId, targetId);
  }

  /**
   * Transfer data through a dimensional connection
   * @param connectionId - Connection ID
   * @param data - Data to transfer
   * @param options - Transfer options
   * @returns Transferred data
   */
  public async transferData(connectionId: string, data: any, options: Record<string, any> = {}): Promise<any> {
    // Transfer data
    return await this.dimensions.transfer(connectionId, data, options);
  }

  /**
   * Add evolution points
   * @param points - Evolution points to add
   * @returns New evolution progress
   */
  public addEvolutionPoints(points: number): number {
    // Add evolution points
    return this.evolution.addEvolutionPoints(points);
  }

  /**
   * Evolve the system
   * @returns Whether evolution occurred
   */
  public evolve(): boolean {
    // Evolve the system
    return this.evolution.evolve();
  }

  /**
   * Evolve a component
   * @param componentId - Component ID
   * @param levels - Number of levels to evolve
   * @returns Whether evolution occurred
   */
  public evolveComponent(componentId: string, levels: number = 1): boolean {
    // Evolve component
    return this.evolution.evolveComponent(componentId, levels);
  }

  /**
   * System state interface
   */
  export interface SystemStateSnapshot {
    status: SystemStatus;
    componentStatus: {
      consciousness: ComponentStatus;
      quantum: ComponentStatus;
      dimensions: ComponentStatus;
      evolution: ComponentStatus;
    };
    consciousness: any;
    quantum: {
      processor: any;
      entanglement: any;
    };
    dimensions: any;
    evolution: any;
  }

  /**
   * Get the system state
   * @returns System state snapshot
   */
  public getState(): SystemStateSnapshot {
    return {
      status: this.state.status,
      componentStatus: { ...this.state.componentStatus },
      consciousness: this.consciousness.getState(),
      quantum: {
        processor: this.quantum.processor.getState(),
        entanglement: this.quantum.entanglement.getState(),
      },
      dimensions: this.dimensions.getState(),
      evolution: this.evolution.getState(),
    };
  }

  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   * @private
   */
  private log(message: string): void {
    if (this.config.debugMode) {
      console.log(`[UltimateCore] ${message}`);
    }
  }
}

export { UltimateCore };
