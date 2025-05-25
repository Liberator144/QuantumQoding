/**
 * Integration Hub for Memory Bank
 * Central hub for connecting all components
 */

import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import {
  ComponentStatus,
  DEFAULT_INTEGRATION_CONFIG,
  IntegrationComponent,
  IntegrationEvent,
  IntegrationHubConfig,
  IntegrationMessage,
} from './types';

/**
 * Central Integration Hub for connecting all components
 */
export class IntegrationHub {
  private config: IntegrationHubConfig;
  private components: Map<string, IntegrationComponent>;
  private eventEmitter: EventEmitter;
  private messageHistory: IntegrationMessage[];

  constructor(config: Partial<IntegrationHubConfig> = {}) {
    this.config = {
      ...DEFAULT_INTEGRATION_CONFIG,
      ...config,
    };

    this.components = new Map();
    this.eventEmitter = new EventEmitter();
    this.messageHistory = [];
  }

  /**
   * Register a component with the hub
   */
  async registerComponent(component: IntegrationComponent): Promise<void> {
    if (this.components.has(component.id)) {
      throw new Error(`Component with ID ${component.id} is already registered`);
    }

    this.components.set(component.id, component);

    // Initialize the component
    try {
      await component.initialize();

      // Emit registration event
      this.sendMessage({
        id: uuidv4(),
        event: IntegrationEvent.MEMORY_CREATED,
        source: 'integration-hub',
        timestamp: new Date(),
        payload: {
          componentId: component.id,
          componentName: component.name,
          componentType: component.type,
        },
      });

      console.log(`Component ${component.name} (${component.id}) registered`);
    } catch (error) {
      console.error(`Failed to initialize component ${component.name} (${component.id}):`, error);
      this.components.delete(component.id);
      throw error;
    }
  }

  /**
   * Unregister a component from the hub
   */
  async unregisterComponent(componentId: string): Promise<boolean> {
    const component = this.components.get(componentId);

    if (!component) {
      return false;
    }

    try {
      await component.shutdown();
      this.components.delete(componentId);

      // Emit unregistration event
      this.sendMessage({
        id: uuidv4(),
        event: IntegrationEvent.MEMORY_DELETED,
        source: 'integration-hub',
        timestamp: new Date(),
        payload: {
          componentId: component.id,
          componentName: component.name,
          componentType: component.type,
        },
      });

      console.log(`Component ${component.name} (${component.id}) unregistered`);
      return true;
    } catch (error) {
      console.error(`Failed to shutdown component ${component.name} (${component.id}):`, error);
      throw error;
    }
  }

  /**
   * Get a component by ID
   */
  getComponent(componentId: string): IntegrationComponent | undefined {
    return this.components.get(componentId);
  }

  /**
   * Get all registered components
   */
  getAllComponents(): IntegrationComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by type
   */
  getComponentsByType(type: string): IntegrationComponent[] {
    return Array.from(this.components.values()).filter(component => component.type === type);
  }

  /**
   * Send a message through the hub
   */
  sendMessage(
    message: Omit<IntegrationMessage, 'id' | 'timestamp'> & { id?: string; timestamp?: Date }
  ): void {
    // Create a complete message
    const completeMessage: IntegrationMessage = {
      id: message.id || uuidv4(),
      event: message.event,
      source: message.source,
      target: message.target,
      timestamp: message.timestamp || new Date(),
      payload: message.payload,
      metadata: message.metadata,
    };

    // Validate the message if configured
    if (this.config.validateMessages) {
      this.validateMessage(completeMessage);
    }

    // Log the message if configured
    if (this.config.logMessages) {
      console.log(
        `[${completeMessage.timestamp.toISOString()}] ${completeMessage.event} from ${completeMessage.source} to ${completeMessage.target || 'all'}`
      );
    }

    // Store in history if configured
    if (this.config.persistMessages) {
      this.messageHistory.push(completeMessage);

      // Trim history if needed
      if (this.messageHistory.length > this.config.maxMessageHistory) {
        this.messageHistory = this.messageHistory.slice(
          this.messageHistory.length - this.config.maxMessageHistory
        );
      }
    }

    // Emit the event
    if (completeMessage.target) {
      // Targeted message
      this.eventEmitter.emit(`${completeMessage.event}:${completeMessage.target}`, completeMessage);
    } else if (this.config.allowBroadcast) {
      // Broadcast message
      this.eventEmitter.emit(completeMessage.event, completeMessage);
    } else {
      console.warn('Broadcast messages are disabled but no target was specified');
    }
  }

  /**
   * Subscribe to messages
   */
  on(
    event: IntegrationEvent,
    listener: (message: IntegrationMessage) => void,
    targetId?: string
  ): void {
    if (targetId) {
      // Subscribe to targeted messages
      this.eventEmitter.on(`${event}:${targetId}`, listener);
    } else {
      // Subscribe to all messages of this type
      this.eventEmitter.on(event, listener);
    }
  }

  /**
   * Unsubscribe from messages
   */
  off(
    event: IntegrationEvent,
    listener: (message: IntegrationMessage) => void,
    targetId?: string
  ): void {
    if (targetId) {
      // Unsubscribe from targeted messages
      this.eventEmitter.off(`${event}:${targetId}`, listener);
    } else {
      // Unsubscribe from all messages of this type
      this.eventEmitter.off(event, listener);
    }
  }

  /**
   * Get message history
   */
  getMessageHistory(): IntegrationMessage[] {
    return [...this.messageHistory];
  }

  /**
   * Get hub status
   */
  async getStatus(): Promise<{
    componentCount: number;
    componentStatus: Record<string, ComponentStatus>;
    messageCount: number;
  }> {
    const componentStatus: Record<string, ComponentStatus> = {};

    // Get status of all components
    for (const [id, component] of this.components.entries()) {
      try {
        componentStatus[id] = await component.getStatus();
      } catch (error) {
        componentStatus[id] = {
          initialized: false,
          active: false,
          error: `Failed to get status: ${error}`,
        };
      }
    }

    return {
      componentCount: this.components.size,
      componentStatus,
      messageCount: this.messageHistory.length,
    };
  }

  /**
   * Shutdown the hub and all components
   */
  async shutdown(): Promise<void> {
    console.log('Shutting down Integration Hub...');

    // Shutdown all components
    for (const [id, component] of this.components.entries()) {
      try {
        await component.shutdown();
        console.log(`Component ${component.name} (${id}) shutdown successfully`);
      } catch (error) {
        console.error(`Failed to shutdown component ${component.name} (${id}):`, error);
      }
    }

    // Clear components and listeners
    this.components.clear();
    this.eventEmitter.removeAllListeners();
    this.messageHistory = [];

    console.log('Integration Hub shutdown complete');
  }

  /**
   * Validate a message
   */
  private validateMessage(message: IntegrationMessage): void {
    // Check required fields
    if (!message.id) {
      throw new Error('Message ID is required');
    }

    if (!message.event) {
      throw new Error('Message event is required');
    }

    if (!message.source) {
      throw new Error('Message source is required');
    }

    if (!message.timestamp) {
      throw new Error('Message timestamp is required');
    }

    // Check that source component exists
    if (message.source !== 'integration-hub' && !this.components.has(message.source)) {
      throw new Error(`Source component ${message.source} is not registered`);
    }

    // Check that target component exists if specified
    if (message.target && !this.components.has(message.target)) {
      throw new Error(`Target component ${message.target} is not registered`);
    }
  }
}
