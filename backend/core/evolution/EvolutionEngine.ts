/**
 * EvolutionEngine
 *
 * The EvolutionEngine provides mechanisms for system-wide evolution and
 * adaptation.
 *
 * @version 1.0.0
 */

const { EventEmitter } = require('events');

/**
 * EvolutionEngine class
 *
 * Provides mechanisms for system-wide evolution and adaptation.
 */
class EvolutionEngine extends EventEmitter {
  /**
   * Create a new EvolutionEngine instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: options.debugMode || false,

      // Evolution mode
      evolutionMode: options.evolutionMode || 'adaptive', // 'static', 'adaptive', 'progressive'

      // Evolution rate
      evolutionRate: options.evolutionRate || 0.1,

      // Evolution interval in milliseconds
      evolutionInterval: options.evolutionInterval || 3600000, // 1 hour

      // Whether to automatically evolve
      autoEvolve: options.autoEvolve !== undefined ? options.autoEvolve : true,

      // Maximum evolution level
      maxEvolutionLevel: options.maxEvolutionLevel || 10,
    };

    // State
    this.state = {
      // Evolution level
      evolutionLevel: options.initialEvolutionLevel || 1,

      // Evolution progress
      evolutionProgress: 0,

      // Evolution history
      evolutionHistory: [],

      // Registered components
      components: new Map(),

      // Component evolution levels
      componentLevels: new Map(),

      // Evolution timer
      evolutionTimer: null,

      // Statistics
      stats: {
        // Total evolutions
        evolutions: 0,

        // Total evolution points
        evolutionPoints: 0,

        // Total component evolutions
        componentEvolutions: 0,

        // Total evolution errors
        evolutionErrors: 0,
      },
    };

    // Initialize
    this._initialize();
  }

  /**
   * Initialize the evolution engine
   * @private
   */
  _initialize() {
    // Start evolution timer if auto-evolve is enabled
    if (this.config.autoEvolve) {
      this.state.evolutionTimer = setInterval(() => {
        this.evolve();
      }, this.config.evolutionInterval);
    }

    // Log initialization
    this.log(
      `Evolution engine initialized in ${this.config.evolutionMode} mode at level ${this.state.evolutionLevel}`
    );

    // Emit initialized event
    this.emit('initialized', {
      evolutionMode: this.config.evolutionMode,
      evolutionLevel: this.state.evolutionLevel,
    });
  }

  /**
   * Register a component for evolution
   * @param {string} componentId - Component ID
   * @param {Object} options - Registration options
   * @returns {boolean} Whether the component was registered
   */
  registerComponent(componentId, options = {}) {
    // Validate component ID
    if (!componentId) {
      this.log('Invalid component ID');
      return false;
    }

    // Check if component already exists
    if (this.state.components.has(componentId)) {
      this.log(`Component already registered: ${componentId}`);
      return false;
    }

    // Register component
    this.state.components.set(componentId, {
      evolutionPriority: options.evolutionPriority || 1,
      evolutionRate: options.evolutionRate || this.config.evolutionRate,
      maxEvolutionLevel: options.maxEvolutionLevel || this.config.maxEvolutionLevel,
      registeredAt: Date.now(),
      lastEvolution: null,
    });

    // Set component evolution level
    this.state.componentLevels.set(componentId, options.initialEvolutionLevel || 1);

    // Log registration
    this.log(
      `Registered component ${componentId} at evolution level ${this.state.componentLevels.get(componentId)}`
    );

    // Emit registered event
    this.emit('component:registered', {
      componentId,
      evolutionLevel: this.state.componentLevels.get(componentId),
    });

    return true;
  }

  /**
   * Unregister a component
   * @param {string} componentId - Component ID
   * @returns {boolean} Whether the component was unregistered
   */
  unregisterComponent(componentId) {
    // Validate component ID
    if (!componentId) {
      this.log('Invalid component ID');
      return false;
    }

    // Check if component exists
    if (!this.state.components.has(componentId)) {
      this.log(`Component not registered: ${componentId}`);
      return false;
    }

    // Get component data
    const component = this.state.components.get(componentId);
    const evolutionLevel = this.state.componentLevels.get(componentId);

    // Unregister component
    this.state.components.delete(componentId);
    this.state.componentLevels.delete(componentId);

    // Log unregistration
    this.log(`Unregistered component ${componentId}`);

    // Emit unregistered event
    this.emit('component:unregistered', {
      componentId,
      evolutionLevel,
    });

    return true;
  }

  /**
   * Add evolution points
   * @param {number} points - Evolution points to add
   * @returns {number} New evolution progress
   */
  addEvolutionPoints(points) {
    // Validate points
    if (points <= 0) {
      this.log(`Invalid evolution points: ${points}`);
      return this.state.evolutionProgress;
    }

    // Add points
    this.state.evolutionProgress += points;

    // Update statistics
    this.state.stats.evolutionPoints += points;

    // Log points
    this.log(`Added ${points} evolution points (progress: ${this.state.evolutionProgress})`);

    // Emit points event
    this.emit('evolution:points', {
      points,
      progress: this.state.evolutionProgress,
    });

    // Check if evolution is ready
    if (this.state.evolutionProgress >= 100) {
      this.evolve();
    }

    return this.state.evolutionProgress;
  }

  /**
   * Evolve the system
   * @returns {boolean} Whether evolution occurred
   */
  evolve() {
    // Check if evolution is ready
    if (this.state.evolutionProgress < 100 && this.config.evolutionMode !== 'static') {
      this.log(`Evolution not ready: ${this.state.evolutionProgress}%`);
      return false;
    }

    // Check if already at maximum level
    if (this.state.evolutionLevel >= this.config.maxEvolutionLevel) {
      this.log(`Already at maximum evolution level: ${this.state.evolutionLevel}`);
      return false;
    }

    try {
      // Evolve based on evolution mode
      let evolved = false;

      switch (this.config.evolutionMode) {
        case 'progressive':
          evolved = this._evolveProgressive();
          break;

        case 'adaptive':
          evolved = this._evolveAdaptive();
          break;

        case 'static':
        default:
          evolved = this._evolveStatic();
          break;
      }

      if (evolved) {
        // Reset evolution progress
        this.state.evolutionProgress = 0;

        // Update statistics
        this.state.stats.evolutions++;

        // Add to evolution history
        this.state.evolutionHistory.push({
          level: this.state.evolutionLevel,
          timestamp: Date.now(),
          mode: this.config.evolutionMode,
        });

        // Log evolution
        this.log(`Evolved to level ${this.state.evolutionLevel}`);

        // Emit evolved event
        this.emit('evolution:evolved', {
          level: this.state.evolutionLevel,
          mode: this.config.evolutionMode,
        });
      }

      return evolved;
    } catch (error) {
      // Update statistics
      this.state.stats.evolutionErrors++;

      // Log error
      this.log(`Evolution error: ${error.message}`);

      // Emit error event
      this.emit('evolution:error', { error });

      return false;
    }
  }

  /**
   * Evolve a component
   * @param {string} componentId - Component ID
   * @param {number} levels - Number of levels to evolve
   * @returns {boolean} Whether evolution occurred
   */
  evolveComponent(componentId, levels = 1) {
    // Validate component ID
    if (!componentId) {
      this.log('Invalid component ID');
      return false;
    }

    // Check if component exists
    if (!this.state.components.has(componentId)) {
      this.log(`Component not registered: ${componentId}`);
      return false;
    }

    // Get component data
    const component = this.state.components.get(componentId);
    const currentLevel = this.state.componentLevels.get(componentId);

    // Check if already at maximum level
    if (currentLevel >= component.maxEvolutionLevel) {
      this.log(`Component already at maximum evolution level: ${currentLevel}`);
      return false;
    }

    // Calculate new level
    const newLevel = Math.min(currentLevel + levels, component.maxEvolutionLevel);

    // Update component level
    this.state.componentLevels.set(componentId, newLevel);

    // Update component data
    component.lastEvolution = Date.now();

    // Update statistics
    this.state.stats.componentEvolutions++;

    // Log evolution
    this.log(`Evolved component ${componentId} from level ${currentLevel} to ${newLevel}`);

    // Emit evolved event
    this.emit('component:evolved', {
      componentId,
      previousLevel: currentLevel,
      newLevel,
    });

    return true;
  }

  /**
   * Evolve in static mode
   * @returns {boolean} Whether evolution occurred
   * @private
   */
  _evolveStatic() {
    // Increment evolution level
    this.state.evolutionLevel++;

    return true;
  }

  /**
   * Evolve in adaptive mode
   * @returns {boolean} Whether evolution occurred
   * @private
   */
  _evolveAdaptive() {
    // Evolve components based on priority
    const components = Array.from(this.state.components.entries()).sort(
      (a, b) => b[1].evolutionPriority - a[1].evolutionPriority
    );

    let evolvedCount = 0;

    for (const [componentId, component] of components) {
      // Check if component can evolve
      const currentLevel = this.state.componentLevels.get(componentId);

      if (currentLevel < component.maxEvolutionLevel) {
        // Calculate evolution probability
        const probability = component.evolutionRate * component.evolutionPriority;

        // Evolve component with probability
        if (Math.random() < probability) {
          this.evolveComponent(componentId);
          evolvedCount++;
        }
      }
    }

    // Increment evolution level if any components evolved
    if (evolvedCount > 0) {
      this.state.evolutionLevel++;
      return true;
    }

    return false;
  }

  /**
   * Evolve in progressive mode
   * @returns {boolean} Whether evolution occurred
   * @private
   */
  _evolveProgressive() {
    // Evolve all components
    for (const componentId of this.state.components.keys()) {
      this.evolveComponent(componentId);
    }

    // Increment evolution level
    this.state.evolutionLevel++;

    return true;
  }

  /**
   * Set the evolution mode
   * @param {string} mode - Evolution mode ('static', 'adaptive', 'progressive')
   * @returns {EvolutionEngine} This instance for chaining
   */
  setEvolutionMode(mode) {
    if (['static', 'adaptive', 'progressive'].includes(mode)) {
      this.config.evolutionMode = mode;
      this.log(`Evolution mode set to ${mode}`);

      // Emit mode change event
      this.emit('evolution:modeChanged', { mode });
    } else {
      this.log(`Invalid evolution mode: ${mode}`);
    }

    return this;
  }

  /**
   * Set the evolution rate
   * @param {number} rate - Evolution rate (0-1)
   * @returns {EvolutionEngine} This instance for chaining
   */
  setEvolutionRate(rate) {
    if (rate >= 0 && rate <= 1) {
      this.config.evolutionRate = rate;
      this.log(`Evolution rate set to ${rate}`);

      // Emit rate change event
      this.emit('evolution:rateChanged', { rate });
    } else {
      this.log(`Invalid evolution rate: ${rate}`);
    }

    return this;
  }

  /**
   * Get all registered components
   * @returns {Object[]} Array of component data
   */
  getComponents() {
    return Array.from(this.state.components.entries()).map(([id, data]) => ({
      id,
      evolutionLevel: this.state.componentLevels.get(id),
      evolutionPriority: data.evolutionPriority,
      evolutionRate: data.evolutionRate,
      maxEvolutionLevel: data.maxEvolutionLevel,
      registeredAt: data.registeredAt,
      lastEvolution: data.lastEvolution,
    }));
  }

  /**
   * Get the evolution history
   * @param {number} limit - Maximum number of history items to return
   * @returns {Object[]} Evolution history
   */
  getEvolutionHistory(limit = 0) {
    if (limit <= 0) {
      return [...this.state.evolutionHistory];
    }

    return this.state.evolutionHistory.slice(-limit);
  }

  /**
   * Get the engine state
   * @returns {Object} Engine state
   */
  getState() {
    return {
      evolutionLevel: this.state.evolutionLevel,
      evolutionProgress: this.state.evolutionProgress,
      evolutionMode: this.config.evolutionMode,
      componentCount: this.state.components.size,
      stats: { ...this.state.stats },
    };
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[EvolutionEngine] ${message}`);
    }
  }
}

module.exports = { EvolutionEngine };
