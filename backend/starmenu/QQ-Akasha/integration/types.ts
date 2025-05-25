/**
 * Types for the Integration Hub
 */

import { EventEmitter } from 'events';

/**
 * Events emitted by the Integration Hub
 */
export enum IntegrationEvent {
  MEMORY_CREATED = 'memory-created',
  MEMORY_UPDATED = 'memory-updated',
  MEMORY_DELETED = 'memory-deleted',
  MEMORY_ACCESSED = 'memory-accessed',
  PRIORITY_UPDATED = 'priority-updated',
  VISUALIZATION_CREATED = 'visualization-created',
  USER_PROFILE_UPDATED = 'user-profile-updated',
  CROSS_PROJECT_TRANSFER = 'cross-project-transfer',
  CODE_GENERATION = 'code-generation',
  DOCUMENTATION_GENERATION = 'documentation-generation',
  ERROR = 'error',
}

/**
 * Base interface for all integration components
 */
export interface IntegrationComponent {
  /** Unique identifier for the component */
  id: string;

  /** Name of the component */
  name: string;

  /** Type of component */
  type: string;

  /** Initialize the component */
  initialize(): Promise<void>;

  /** Shutdown the component */
  shutdown(): Promise<void>;

  /** Get component status */
  getStatus(): Promise<ComponentStatus>;
}

/**
 * Status of a component
 */
export interface ComponentStatus {
  /** Whether the component is initialized */
  initialized: boolean;

  /** Whether the component is active */
  active: boolean;

  /** Any error message */
  error?: string;

  /** Additional status information */
  details?: Record<string, any>;
}

/**
 * Message passed between components
 */
export interface IntegrationMessage {
  /** Unique identifier for the message */
  id: string;

  /** Type of event */
  event: IntegrationEvent;

  /** Source component ID */
  source: string;

  /** Target component ID (optional) */
  target?: string;

  /** Timestamp of the message */
  timestamp: Date;

  /** Message payload */
  payload: any;

  /** Message metadata */
  metadata?: Record<string, any>;
}

/**
 * Configuration for the Integration Hub
 */
export interface IntegrationHubConfig {
  /** Whether to log messages */
  logMessages: boolean;

  /** Whether to persist messages */
  persistMessages: boolean;

  /** Maximum number of messages to keep in memory */
  maxMessageHistory: number;

  /** Whether to validate message schemas */
  validateMessages: boolean;

  /** Whether to allow broadcasting to all components */
  allowBroadcast: boolean;
}

/**
 * Default configuration for the Integration Hub
 */
export const DEFAULT_INTEGRATION_CONFIG: IntegrationHubConfig = {
  logMessages: true,
  persistMessages: false,
  maxMessageHistory: 1000,
  validateMessages: true,
  allowBroadcast: true,
};
