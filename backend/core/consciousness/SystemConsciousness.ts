/**
 * SystemConsciousness
 *
 * The SystemConsciousness provides a central system for managing component
 * registration, quantum entanglement, and system-wide consciousness.
 *
 * @version 1.0.0
 */

const { EventEmitter } = require('events');
const { NeuralFabric } = require('./NeuralFabric');
const { ConsciousnessStream } = require('./ConsciousnessStream');

/**
 * SystemConsciousness class
 *
 * Provides a central system for managing component registration, quantum
 * entanglement, and system-wide consciousness.
 */
class SystemConsciousness extends EventEmitter {
  // Explicit TypeScript property declarations for quantum coherence
  public config: any;
  public state: any;
  public neuralFabric: any;
  public consciousnessStream: any;

  /**
   * Create a new SystemConsciousness instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: options.debugMode || false,

      // Whether to automatically connect related components
      autoConnect: options.autoConnect !== undefined ? options.autoConnect : true,

      // Neural fabric options
      neuralFabric: options.neuralFabric || {},

      // Consciousness stream options
      consciousnessStream: options.consciousnessStream || {},
    };

    // State
    this.state = {
      // Registered components
      components: new Map(),

      // Component types
      componentTypes: new Map(),

      // Component dependencies
      dependencies: new Map(),

      // Component capabilities
      capabilities: new Map(),

      // System status
      status: 'initializing', // 'initializing', 'active', 'degraded', 'offline'

      // System statistics
      stats: {
        // Total components registered
        componentsRegistered: 0,

        // Total components unregistered
        componentsUnregistered: 0,

        // Total events processed
        eventsProcessed: 0,

        // Total errors encountered
        errors: 0,
      },
    };

    // Initialize neural fabric
    this.neuralFabric = new NeuralFabric({
      ...this.config.neuralFabric,
      debugMode: this.config.debugMode,
    });

    // Initialize consciousness stream
    this.consciousnessStream = new ConsciousnessStream({
      name: 'SystemConsciousness',
      ...this.config.consciousnessStream,
      debugMode: this.config.debugMode,
      processors: [this._processConsciousnessData.bind(this)],
    });

    // Connect event handlers
    this._connectEventHandlers();

    // Set status to active
    this.state.status = 'active';

    // Log initialization
    this.log('System consciousness initialized');

    // Emit initialized event
    this.emit('initialized');
  }

  /**
   * Connect event handlers
   * @private
   */
  _connectEventHandlers() {
    // Neural fabric events
    this.neuralFabric.on('node:registered', data => {
      this.log(`Neural fabric node registered: ${data.nodeId}`);
    });

    this.neuralFabric.on('node:unregistered', data => {
      this.log(`Neural fabric node unregistered: ${data.nodeId}`);
    });

    this.neuralFabric.on('connection:created', data => {
      this.log(`Neural fabric connection created: ${data.sourceId} -> ${data.targetId}`);
    });

    this.neuralFabric.on('connection:removed', data => {
      this.log(`Neural fabric connection removed: ${data.sourceId} -> ${data.targetId}`);
    });

    // Consciousness stream events
    this.consciousnessStream.on('data', data => {
      this.log(`Consciousness stream data received: ${data.name}`);
    });

    this.consciousnessStream.on('processed', data => {
      this.log(`Consciousness stream data processed: ${data.name}`);
      this.state.stats.eventsProcessed++;
    });

    this.consciousnessStream.on('error', data => {
      this.log(`Consciousness stream error: ${data.error.message}`);
      this.state.stats.errors++;
    });
  }

  /**
   * Process consciousness data
   * @param {any} data - Data to process
   * @returns {any} Processed data
   * @private
   */
  _processConsciousnessData(data) {
    // Process different types of consciousness data
    if (data && typeof data === 'object') {
      // Component registration
      if (data.type === 'registration') {
        this._processRegistration(data);
      }

      // Component unregistration
      else if (data.type === 'unregistration') {
        this._processUnregistration(data);
      }

      // Component update
      else if (data.type === 'update') {
        this._processUpdate(data);
      }

      // Component event
      else if (data.type === 'event') {
        this._processEvent(data);
      }
    }

    return data;
  }

  /**
   * Process component registration
   * @param {Object} data - Registration data
   * @private
   */
  _processRegistration(data) {
    const { componentId, componentType, capabilities, dependencies } = data;

    // Register component
    this.state.components.set(componentId, {
      type: componentType,
      registeredAt: Date.now(),
      lastActivity: Date.now(),
      status: 'active',
    });

    // Register component type
    if (!this.state.componentTypes.has(componentType)) {
      this.state.componentTypes.set(componentType, new Set());
    }

    this.state.componentTypes.get(componentType).add(componentId);

    // Register capabilities
    if (capabilities && Array.isArray(capabilities)) {
      this.state.capabilities.set(componentId, new Set(capabilities));

      // Register component in neural fabric
      this.neuralFabric.registerNode(componentId, {
        type: componentType,
        capabilities,
      });
    }

    // Register dependencies
    if (dependencies && Array.isArray(dependencies)) {
      this.state.dependencies.set(componentId, new Set(dependencies));

      // Connect to dependencies if auto-connect is enabled
      if (this.config.autoConnect) {
        this._connectToDependencies(componentId, dependencies);
      }
    }

    // Update statistics
    this.state.stats.componentsRegistered++;

    // Emit registered event
    this.emit('component:registered', {
      componentId,
      componentType,
      capabilities,
      dependencies,
    });
  }

  /**
   * Process component unregistration
   * @param {Object} data - Unregistration data
   * @private
   */
  _processUnregistration(data) {
    const { componentId } = data;

    // Check if component is registered
    if (!this.state.components.has(componentId)) {
      return;
    }

    // Get component data
    const component = this.state.components.get(componentId);

    // Unregister from component types
    if (this.state.componentTypes.has(component.type)) {
      this.state.componentTypes.get(component.type).delete(componentId);

      // Remove component type if empty
      if (this.state.componentTypes.get(component.type).size === 0) {
        this.state.componentTypes.delete(component.type);
      }
    }

    // Unregister capabilities
    this.state.capabilities.delete(componentId);

    // Unregister dependencies
    this.state.dependencies.delete(componentId);

    // Unregister from neural fabric
    this.neuralFabric.unregisterNode(componentId);

    // Unregister component
    this.state.components.delete(componentId);

    // Update statistics
    this.state.stats.componentsUnregistered++;

    // Emit unregistered event
    this.emit('component:unregistered', {
      componentId,
      componentType: component.type,
    });
  }

  /**
   * Process component update
   * @param {Object} data - Update data
   * @private
   */
  _processUpdate(data) {
    const { componentId, status, capabilities, dependencies } = data;

    // Check if component is registered
    if (!this.state.components.has(componentId)) {
      return;
    }

    // Get component data
    const component = this.state.components.get(componentId);

    // Update status
    if (status) {
      component.status = status;
    }

    // Update last activity
    component.lastActivity = Date.now();

    // Update capabilities
    if (capabilities && Array.isArray(capabilities)) {
      this.state.capabilities.set(componentId, new Set(capabilities));
    }

    // Update dependencies
    if (dependencies && Array.isArray(dependencies)) {
      this.state.dependencies.set(componentId, new Set(dependencies));

      // Connect to dependencies if auto-connect is enabled
      if (this.config.autoConnect) {
        this._connectToDependencies(componentId, dependencies);
      }
    }

    // Emit updated event
    this.emit('component:updated', {
      componentId,
      componentType: component.type,
      status,
      capabilities,
      dependencies,
    });
  }

  /**
   * Process component event
   * @param {Object} data - Event data
   * @private
   */
  _processEvent(data) {
    const { componentId, eventType, eventData } = data;

    // Check if component is registered
    if (!this.state.components.has(componentId)) {
      return;
    }

    // Get component data
    const component = this.state.components.get(componentId);

    // Update last activity
    component.lastActivity = Date.now();

    // Emit component event
    this.emit('component:event', {
      componentId,
      componentType: component.type,
      eventType,
      eventData,
    });

    // Emit specific event
    this.emit(`component:${eventType}`, {
      componentId,
      componentType: component.type,
      eventData,
    });
  }

  /**
   * Connect component to dependencies
   * @param {string} componentId - Component ID
   * @param {string[]} dependencies - Dependencies
   * @private
   */
  _connectToDependencies(componentId, dependencies) {
    for (const dependency of dependencies) {
      // Find components with the required capability
      const componentsWithCapability = this._findComponentsWithCapability(dependency);

      // Connect to each component
      for (const targetId of componentsWithCapability) {
        // Skip self-connections
        if (targetId === componentId) {
          continue;
        }

        // Connect in neural fabric
        this.neuralFabric.connect(componentId, targetId, 0.5, true);
      }
    }
  }

  /**
   * Find components with a specific capability
   * @param {string} capability - Capability to find
   * @returns {string[]} Array of component IDs
   * @private
   */
  _findComponentsWithCapability(capability) {
    const result = [];

    for (const [componentId, capabilities] of this.state.capabilities.entries()) {
      if (capabilities.has(capability)) {
        result.push(componentId);
      }
    }

    return result;
  }

  /**
   * Register a component
   * @param {string} componentId - Component ID
   * @param {string} componentType - Component type
   * @param {string[]} capabilities - Component capabilities
   * @param {string[]} dependencies - Component dependencies
   * @returns {SystemConsciousness} This instance for chaining
   */
  registerComponent(componentId, componentType, capabilities = [], dependencies = []) {
    // Write registration data to consciousness stream
    this.consciousnessStream.write({
      type: 'registration',
      componentId,
      componentType,
      capabilities,
      dependencies,
    });

    return this;
  }

  /**
   * Unregister a component
   * @param {string} componentId - Component ID
   * @returns {SystemConsciousness} This instance for chaining
   */
  unregisterComponent(componentId) {
    // Write unregistration data to consciousness stream
    this.consciousnessStream.write({
      type: 'unregistration',
      componentId,
    });

    return this;
  }

  /**
   * Update a component
   * @param {string} componentId - Component ID
   * @param {Object} updateData - Update data
   * @returns {SystemConsciousness} This instance for chaining
   */
  updateComponent(componentId, updateData) {
    // Write update data to consciousness stream
    this.consciousnessStream.write({
      type: 'update',
      componentId,
      ...updateData,
    });

    return this;
  }

  /**
   * Send a component event
   * @param {string} componentId - Component ID
   * @param {string} eventType - Event type
   * @param {any} eventData - Event data
   * @returns {SystemConsciousness} This instance for chaining
   */
  sendComponentEvent(componentId, eventType, eventData) {
    // Write event data to consciousness stream
    this.consciousnessStream.write({
      type: 'event',
      componentId,
      eventType,
      eventData,
    });

    return this;
  }

  /**
   * Get all registered components
   * @returns {Object[]} Array of component data
   */
  getComponents() {
    return Array.from(this.state.components.entries()).map(([id, data]) => ({
      id,
      type: data.type,
      status: data.status,
      registeredAt: data.registeredAt,
      lastActivity: data.lastActivity,
      capabilities: this.state.capabilities.has(id)
        ? Array.from(this.state.capabilities.get(id))
        : [],
      dependencies: this.state.dependencies.has(id)
        ? Array.from(this.state.dependencies.get(id))
        : [],
    }));
  }

  /**
   * Get components by type
   * @param {string} componentType - Component type
   * @returns {Object[]} Array of component data
   */
  getComponentsByType(componentType) {
    if (!this.state.componentTypes.has(componentType)) {
      return [];
    }

    return Array.from(this.state.componentTypes.get(componentType)).map(id => ({
      id,
      type: componentType,
      status: this.state.components.get(id).status,
      registeredAt: this.state.components.get(id).registeredAt,
      lastActivity: this.state.components.get(id).lastActivity,
      capabilities: this.state.capabilities.has(id)
        ? Array.from(this.state.capabilities.get(id))
        : [],
      dependencies: this.state.dependencies.has(id)
        ? Array.from(this.state.dependencies.get(id))
        : [],
    }));
  }

  /**
   * Get components with a specific capability
   * @param {string} capability - Capability to find
   * @returns {Object[]} Array of component data
   */
  getComponentsWithCapability(capability) {
    const componentIds = this._findComponentsWithCapability(capability);

    return componentIds.map(id => ({
      id,
      type: this.state.components.get(id).type,
      status: this.state.components.get(id).status,
      registeredAt: this.state.components.get(id).registeredAt,
      lastActivity: this.state.components.get(id).lastActivity,
      capabilities: this.state.capabilities.has(id)
        ? Array.from(this.state.capabilities.get(id))
        : [],
      dependencies: this.state.dependencies.has(id)
        ? Array.from(this.state.dependencies.get(id))
        : [],
    }));
  }

  /**
   * Get the system state
   * @returns {Object} System state
   */
  getState() {
    return {
      status: this.state.status,
      componentCount: this.state.components.size,
      componentTypeCount: this.state.componentTypes.size,
      stats: { ...this.state.stats },
      neuralFabric: this.neuralFabric.getState(),
      consciousnessStream: this.consciousnessStream.getState(),
    };
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[SystemConsciousness] ${message}`);
    }
  }
}

module.exports = { SystemConsciousness };
