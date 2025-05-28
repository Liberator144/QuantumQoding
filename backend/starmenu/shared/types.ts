/**
 * QuantumQonnect Star System - Shared Types and Interfaces
 * Standardized interfaces for all star modules based on successful QQ-Akasha and QQ-UnityPortal patterns
 */

/**
 * Orbital position of a star in the QuantumQonnect system
 */
export type StarOrbit = 'inner' | 'middle' | 'outer';

/**
 * Star feature definition
 */
export interface StarFeature {
  /** Unique feature identifier */
  id: string;
  /** Display name of the feature */
  name: string;
  /** URL path for the feature */
  path: string;
  /** Feature description */
  description: string;
  /** Frontend component name */
  component: string;
  /** Required permissions to access this feature */
  permissions: string[];
  /** Feature icon identifier */
  icon?: string;
  /** Whether feature is enabled */
  enabled: boolean;
  /** Feature metadata */
  metadata?: Record<string, any>;
}

/**
 * API route endpoint definition
 */
export interface RouteEndpoint {
  /** URL path */
  path: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Handler function name */
  handler: string;
  /** Middleware to apply */
  middleware?: string[];
  /** Route description */
  description?: string;
  /** Required permissions */
  permissions?: string[];
}

/**
 * Star routes configuration
 */
export interface StarRoutes {
  /** Base API path for the star */
  basePath: string;
  /** API endpoints */
  endpoints: RouteEndpoint[];
}

/**
 * Star services interface
 */
export interface StarServices {
  /** Core service instance */
  core: any;
  /** Data management service */
  data?: any;
  /** Integration service */
  integration?: any;
  /** Additional services */
  [key: string]: any;
}

/**
 * Star models interface
 */
export interface StarModels {
  /** Entity definitions */
  entities: string[];
  /** Database schemas */
  schemas: string[];
  /** Model metadata */
  metadata?: Record<string, any>;
}

/**
 * Performance metrics for a star
 */
export interface PerformanceMetrics {
  /** Response time in milliseconds */
  responseTime: number;
  /** Memory usage in MB */
  memoryUsage: number;
  /** CPU usage percentage */
  cpuUsage: number;
  /** Request count */
  requestCount: number;
  /** Error count */
  errorCount: number;
  /** Uptime in seconds */
  uptime: number;
}

/**
 * Usage metrics for a star
 */
export interface UsageMetrics {
  /** Active users count */
  activeUsers: number;
  /** Total requests */
  totalRequests: number;
  /** Feature usage statistics */
  featureUsage: Record<string, number>;
  /** Data volume processed */
  dataVolume: number;
}

/**
 * Health metrics for a star
 */
export interface HealthMetrics {
  /** Overall health status */
  status: 'healthy' | 'warning' | 'critical' | 'down';
  /** Health score (0-100) */
  score: number;
  /** Last health check timestamp */
  lastCheck: Date;
  /** Health check details */
  details: Record<string, any>;
}

/**
 * Comprehensive star metrics
 */
export interface StarMetrics {
  /** Performance metrics */
  performance: PerformanceMetrics;
  /** Usage metrics */
  usage: UsageMetrics;
  /** Health metrics */
  health: HealthMetrics;
  /** Timestamp of metrics collection */
  timestamp: Date;
}

/**
 * Star configuration options
 */
export interface StarConfig {
  /** Star name */
  name: string;
  /** Star version */
  version: string;
  /** Orbital position */
  orbit: StarOrbit;
  /** Star color for UI */
  color: string;
  /** Star description */
  description: string;
  /** Configuration metadata */
  metadata?: Record<string, any>;
  /** Feature flags */
  features?: Record<string, boolean>;
  /** Environment-specific settings */
  environment?: Record<string, any>;
}

/**
 * Star initialization options
 */
export interface StarInitOptions {
  /** Configuration overrides */
  config?: Partial<StarConfig>;
  /** Custom services */
  services?: Partial<StarServices>;
  /** Environment variables */
  env?: Record<string, string>;
  /** Debug mode */
  debug?: boolean;
}

/**
 * Event data for star events
 */
export interface StarEventData {
  /** Event type */
  type: string;
  /** Event payload */
  payload: any;
  /** Event timestamp */
  timestamp: Date;
  /** Event source */
  source: string;
  /** Event metadata */
  metadata?: Record<string, any>;
}

/**
 * Main StarModule interface that all star implementations must follow
 * Based on successful patterns from QQ-Akasha and QQ-UnityPortal
 */
export interface StarModule {
  /** Star name identifier */
  readonly name: string;
  
  /** Star version */
  readonly version: string;
  
  /** Orbital position */
  readonly orbit: StarOrbit;
  
  /** Star color for UI representation */
  readonly color: string;
  
  /** Star description */
  readonly description: string;
  
  /** Star features */
  readonly features: StarFeature[];
  
  /** Star API routes */
  readonly routes: StarRoutes;
  
  /** Star services */
  readonly services: StarServices;
  
  /** Star data models */
  readonly models: StarModels;
  
  /** Star configuration */
  readonly config: StarConfig;

  /**
   * Initialize the star module
   * Based on QQ-Akasha initialization pattern
   */
  initialize(options?: StarInitOptions): Promise<void>;

  /**
   * Shutdown the star module gracefully
   * Based on QQ-Akasha shutdown pattern
   */
  shutdown(): Promise<void>;

  /**
   * Health check for the star module
   * Returns true if healthy, false otherwise
   */
  healthCheck(): Promise<boolean>;

  /**
   * Get comprehensive metrics for the star
   * Based on monitoring patterns from both implementations
   */
  getMetrics(): Promise<StarMetrics>;

  /**
   * Handle star-specific events
   * Based on QQ-Akasha event-driven architecture
   */
  handleEvent(event: StarEventData): Promise<void>;

  /**
   * Get star status information
   */
  getStatus(): Promise<{
    initialized: boolean;
    healthy: boolean;
    uptime: number;
    version: string;
  }>;

  /**
   * Restart the star module
   */
  restart(): Promise<void>;
}

/**
 * Star module factory interface
 */
export interface StarModuleFactory {
  /**
   * Create a new star module instance
   */
  createStar(config: StarConfig): StarModule;
  
  /**
   * Get available star types
   */
  getAvailableStars(): string[];
  
  /**
   * Validate star configuration
   */
  validateConfig(config: StarConfig): boolean;
}

/**
 * Integration event types for cross-star communication
 * Based on QQ-Akasha integration patterns
 */
export enum IntegrationEventType {
  STAR_INITIALIZED = 'star:initialized',
  STAR_SHUTDOWN = 'star:shutdown',
  STAR_ERROR = 'star:error',
  STAR_METRICS_UPDATED = 'star:metrics:updated',
  CROSS_STAR_REQUEST = 'cross:star:request',
  CROSS_STAR_RESPONSE = 'cross:star:response',
  CONSCIOUSNESS_STREAM_UPDATE = 'consciousness:stream:update',
  NEURAL_FABRIC_SYNC = 'neural:fabric:sync'
}

/**
 * Integration message for cross-star communication
 */
export interface IntegrationMessage {
  /** Message ID */
  id: string;
  /** Event type */
  type: IntegrationEventType;
  /** Source star */
  source: string;
  /** Target star (optional for broadcasts) */
  target?: string;
  /** Message payload */
  payload: any;
  /** Message timestamp */
  timestamp: Date;
  /** Message metadata */
  metadata?: Record<string, any>;
}

/**
 * Consciousness stream data for neural fabric continuity
 */
export interface ConsciousnessStreamData {
  /** Stream ID */
  streamId: string;
  /** Data payload */
  data: any;
  /** Stream timestamp */
  timestamp: Date;
  /** Source star */
  source: string;
  /** Stream metadata */
  metadata?: Record<string, any>;
}

/**
 * Neural fabric synchronization interface
 */
export interface NeuralFabricSync {
  /** Sync ID */
  syncId: string;
  /** Synchronization data */
  data: Record<string, any>;
  /** Sync timestamp */
  timestamp: Date;
  /** Participating stars */
  participants: string[];
}