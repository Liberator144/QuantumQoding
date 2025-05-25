/**
 * Unified Quantum Database
 *
 * A comprehensive database system that follows the Unified Singularity Approach,
 * ensuring absolute clarity and preventing quantum fragmentation.
 *
 * This system provides:
 * 1. A unified interface for all data operations
 * 2. Pluggable storage adapters (LocalStorage, IndexedDB, Memory, File, SQLite)
 * 3. Schema definition and validation
 * 4. Event-based architecture
 * 5. Quantum coherence verification
 *
 * @version 1.0.0
 */

/**
 * Database configuration options
 */
export interface DatabaseOptions {
  /** Default adapter name */
  defaultAdapter?: string;
  /** Storage prefix for browser storage */
  storagePrefix?: string;
  /** Auto-sync flag */
  autoSync?: boolean;
  /** Sync interval in milliseconds */
  syncInterval?: number;
  /** Debug mode flag */
  debugMode?: boolean;
  /** Schema validation flag */
  validateSchema?: boolean;
  /** Coherence verification flag */
  verifyCoherence?: boolean;
  /** Storage directory for file adapter */
  storageDirectory?: string;
  /** Sync on close flag */
  syncOnClose?: boolean;
  /** Defer initialization flag */
  deferInitialization?: boolean;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  /** Load data from storage */
  load(collectionName: string): Promise<any[]>;
  /** Save data to storage */
  save(collectionName: string, data: any[]): Promise<any>;
  /** Close adapter and clean up resources */
  close?(): Promise<void>;
}

/**
 * Schema field definition
 */
export interface SchemaField {
  /** Field type */
  type?: string;
  /** Required flag */
  required?: boolean;
  /** Default value */
  default?: any;
  /** Enum values */
  enum?: any[];
  /** Validation function */
  validate?: (value: any) => boolean;
}

/**
 * Schema definition
 */
export interface Schema {
  [field: string]: SchemaField;
}

/**
 * Event listener type
 */
export type EventListener = (data: any) => void;

/**
 * Query options interface
 */
export interface QueryOptions {
  /** Sort specification */
  sort?: Record<string, 1 | -1>;
  /** Number of documents to skip */
  skip?: number;
  /** Maximum number of documents to return */
  limit?: number;
}

class UnifiedQuantumDatabase {
  /** Configuration options */
  public config: {
    defaultAdapter: string;
    storagePrefix: string;
    autoSync: boolean;
    syncInterval: number;
    debugMode: boolean;
    validateSchema: boolean;
    verifyCoherence: boolean;
    storageDirectory?: string;
    syncOnClose?: boolean;
    deferInitialization?: boolean;
    [key: string]: any;
  };

  /** Initialization status */
  public initialized: boolean;

  /** Storage adapters map */
  public adapters: Map<string, StorageAdapter>;

  /** Schemas map */
  public schemas: Map<string, Schema>;

  /** Collections map */
  public collections: Map<string, any>; // Will be Collection type

  /** Event listeners map */
  private eventListeners: Map<string, EventListener[]>;

  /** Auto-sync interval ID */
  private _syncInterval?: NodeJS.Timeout;

  /**
   * Create a new UnifiedQuantumDatabase instance
   * @param options - Configuration options
   */
  constructor(options: DatabaseOptions = {}) {
    // Configuration
    this.config = {
      // Default adapter
      defaultAdapter: 'localStorage',

      // Storage prefix
      storagePrefix: 'quantum-db-',

      // Auto-sync
      autoSync: true,

      // Sync interval (ms)
      syncInterval: 5000,

      // Debug mode
      debugMode: false,

      // Schema validation
      validateSchema: true,

      // Coherence verification
      verifyCoherence: true,

      // Merge with provided options
      ...options,
    };

    // State
    this.initialized = false;
    this.adapters = new Map<string, StorageAdapter>();
    this.schemas = new Map<string, Schema>();
    this.collections = new Map<string, any>();
    this.eventListeners = new Map<string, EventListener[]>();

    // Initialize if not deferred
    if (!this.config.deferInitialization) {
      // We can't use await in constructor, so we call _init and handle any errors
      this._init().catch(error => {
        this.log(`Error during initialization: ${error.message}`);
        // Emit error event for better error handling
        this._emit('error', {
          phase: 'initialization',
          error: error instanceof Error ? error : new Error(String(error)),
          timestamp: Date.now(),
        });
      });
    }
  }

  /**
   * Initialize the database
   * @returns Promise that resolves when initialization is complete
   */
  public async init(): Promise<void> {
    if (this.initialized) return;
    return this._init();
  }

  /**
   * Initialize the database
   * @private
   * @returns Promise that resolves when initialization is complete
   */
  private async _init(): Promise<void> {
    if (this.initialized) return;

    this.log('Initializing Unified Quantum Database');

    try {
      // Register built-in adapters
      this._registerBuiltInAdapters();

      // Register built-in schemas
      this._registerBuiltInSchemas();

      // Set up auto-sync
      if (this.config.autoSync) {
        this._setupAutoSync();
      }

      // Set initialized flag
      this.initialized = true;

      this.log('Unified Quantum Database initialized');

      // Emit initialized event
      this._emit('initialized');
    } catch (error) {
      this.log(`Error initializing database: ${error.message}`);
      throw error;
    }
  }

  /**
   * Register built-in adapters
   * @private
   */
  private _registerBuiltInAdapters(): void {
    // Register adapters based on environment
    if (typeof window !== 'undefined') {
      // Browser environment

      // Register LocalStorage adapter
      if (typeof localStorage !== 'undefined') {
        // Use dynamic import for browser environment
        import('../adapters/LocalStorageAdapter').then(({ LocalStorageAdapter }) => {
          this.registerAdapter(
            'localStorage',
            new LocalStorageAdapter({
              prefix: this.config.storagePrefix,
            })
          );
        }).catch(error => {
          this.log(`Error loading LocalStorageAdapter: ${error.message}`);
        });
      }

      // Register IndexedDB adapter if available
      if (typeof indexedDB !== 'undefined') {
        // Use dynamic import for browser environment
        import('../adapters/IndexedDBAdapter').then(({ IndexedDBAdapter }) => {
          this.registerAdapter(
            'indexedDB',
            new IndexedDBAdapter({
              dbName: `${this.config.storagePrefix}db`,
              version: 1,
            })
          );
        }).catch(error => {
          this.log(`Error loading IndexedDBAdapter: ${error.message}`);
        });
      }
    } else {
      // Node.js environment

      // Register FileAdapter
      import('../adapters/FileAdapter').then(({ FileAdapter }) => {
        this.registerAdapter(
          'file',
          new FileAdapter({
            directory: this.config.storageDirectory || './data',
          })
        );
      }).catch(error => {
        this.log(`Error loading FileAdapter: ${error.message}`);
      });
    }

    // Register Memory adapter (always available)
    import('../adapters/MemoryAdapter').then(({ MemoryAdapter }) => {
      this.registerAdapter('memory', new MemoryAdapter());
    }).catch(error => {
      this.log(`Error loading MemoryAdapter: ${error.message}`);
    });

    this.log(`Registered ${this.adapters.size} built-in adapters`);
  }

  /**
   * Register built-in schemas
   * @private
   */
  private _registerBuiltInSchemas(): void {
    // Load schema definitions using dynamic import
    import('../schemas').then((schemas) => {
      const {
        taskSchema,
        settingsSchema,
        statisticsSchema,
        queryAnalyticsSchema,
      } = schemas;

      // Register schemas
      this.registerSchema('task', taskSchema);
      this.registerSchema('settings', settingsSchema);
      this.registerSchema('statistics', statisticsSchema);
      this.registerSchema('query_analytics', queryAnalyticsSchema);

      this.log(`Registered ${this.schemas.size} built-in schemas`);
    }).catch(error => {
      this.log(`Error loading schemas: ${error.message}`);
    });
  }

  /**
   * Set up auto-sync
   * @private
   */
  private _setupAutoSync(): void {
    // Clear existing interval
    if (this._syncInterval) {
      clearInterval(this._syncInterval);
    }

    // Set up new interval
    this._syncInterval = setInterval(() => {
      this.sync().catch(error => {
        this.log(`Auto-sync error: ${error.message}`);
      });
    }, this.config.syncInterval);

    this.log(`Auto-sync enabled with interval: ${this.config.syncInterval}ms`);
  }

  /**
   * Register an adapter
   * @param name - Adapter name
   * @param adapter - Adapter instance
   * @returns This instance for chaining
   * @throws Error if name or adapter is missing
   */
  public registerAdapter(name: string, adapter: StorageAdapter): UnifiedQuantumDatabase {
    if (!name || !adapter) {
      throw new Error('Adapter name and instance are required');
    }

    this.adapters.set(name, adapter);
    this.log(`Registered adapter: ${name}`);

    return this;
  }

  /**
   * Register a schema
   * @param name - Schema name
   * @param schema - Schema definition
   * @returns This instance for chaining
   * @throws Error if name or schema is missing
   */
  public registerSchema(name: string, schema: Schema): UnifiedQuantumDatabase {
    if (!name || !schema) {
      throw new Error('Schema name and definition are required');
    }

    this.schemas.set(name, schema);
    this.log(`Registered schema: ${name}`);

    return this;
  }

  /**
   * Collection options interface
   */
  export interface CollectionOptions {
    /** Adapter name */
    adapter?: string;
    /** Schema name */
    schema?: string;
    /** Validate schema flag */
    validateSchema?: boolean;
    /** Other options */
    [key: string]: any;
  }

  /**
   * Create a collection
   * @param name - Collection name
   * @param options - Collection options
   * @returns The created collection
   * @throws Error if name is missing or collection creation fails
   */
  public async createCollection(name: string, options: CollectionOptions = {}): Promise<any> {
    if (!name) {
      throw new Error('Collection name is required');
    }

    // Check if collection already exists
    if (this.collections.has(name)) {
      return this.collections.get(name);
    }

    // Merge options with defaults
    const collectionOptions = {
      adapter: this.config.defaultAdapter,
      schema: name,
      validateSchema: this.config.validateSchema,
      ...options,
    };

    // Create collection using dynamic import
    let collection;
    try {
      // We need to use a dynamic import here
      const { Collection } = await import('./Collection');
      collection = new Collection(name, this, collectionOptions);
    } catch (error) {
      this.log(`Error loading Collection: ${error.message}`);
      throw error;
    }

    // Store collection
    this.collections.set(name, collection);

    this.log(`Created collection: ${name}`);

    return collection;
  }

  /**
   * Get a collection
   * @param name - Collection name
   * @returns The collection
   * @throws Error if collection is not found
   */
  public getCollection(name: string): any {
    if (!this.collections.has(name)) {
      throw new Error(`Collection not found: ${name}`);
    }

    return this.collections.get(name);
  }

  /**
   * Sync result interface
   */
  export interface SyncResults {
    [collectionName: string]: {
      success?: boolean;
      synced?: number;
      count?: number;
      error?: string;
    };
  }

  /**
   * Synchronize all collections
   * @returns Sync results for all collections
   */
  public async sync(): Promise<SyncResults> {
    this.log('Syncing all collections');

    const results = {};

    // Sync each collection
    for (const [name, collection] of this.collections.entries()) {
      try {
        results[name] = await collection.sync();
      } catch (error) {
        console.error(`Error syncing collection ${name}:`, error);
        results[name] = { error: error.message };
      }
    }

    // Emit sync event
    this._emit('sync', results);

    return results;
  }

  /**
   * Add event listener
   * @param event - Event name
   * @param listener - Event listener
   * @returns This instance for chaining
   */
  public on(event: string, listener: EventListener): UnifiedQuantumDatabase {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }

    this.eventListeners.get(event).push(listener);

    return this;
  }

  /**
   * Remove event listener
   * @param event - Event name
   * @param listener - Event listener
   * @returns This instance for chaining
   */
  public off(event: string, listener: EventListener): UnifiedQuantumDatabase {
    if (!this.eventListeners.has(event)) {
      return this;
    }

    const listeners = this.eventListeners.get(event);
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

    const listeners = this.eventListeners.get(event);

    for (const listener of listeners) {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    }
  }

  /**
   * Close the database and clean up resources
   * @returns Success status
   */
  public async close(): Promise<boolean> {
    try {
      this.log('Closing Unified Quantum Database');

      // Stop auto-sync if enabled
      if (this._syncInterval) {
        clearInterval(this._syncInterval);
        this._syncInterval = null;
      }

      // Sync all collections one last time
      if (this.config.syncOnClose) {
        await this.sync();
      }

      // Close all collections
      for (const [name, collection] of this.collections.entries()) {
        this.log(`Closing collection: ${name}`);
        if (typeof collection.close === 'function') {
          await collection.close();
        }
      }

      // Clear collections
      this.collections.clear();

      this.log('Unified Quantum Database closed');
      return true;
    } catch (error) {
      this.log(`Error closing database: ${error.message}`);
      return false;
    }
  }

  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   * @private
   */
  private log(message: string): void {
    if (this.config.debugMode) {
      console.log(`[UnifiedQuantumDatabase] ${message}`);
    }
  }
}

export { UnifiedQuantumDatabase };
