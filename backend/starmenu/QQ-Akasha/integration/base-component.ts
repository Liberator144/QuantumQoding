/**
 * Base Component for Integration Hub
 * Provides common functionality for all components
 */

import { v4 as uuidv4 } from 'uuid';
import {
  ComponentStatus,
  IntegrationComponent,
  IntegrationEvent,
  IntegrationHub,
  IntegrationMessage,
} from './types';

/**
 * Base class for all integration components
 */
export abstract class BaseComponent implements IntegrationComponent {
  id: string;
  name: string;
  type: string;
  protected hub: IntegrationHub;
  protected initialized: boolean = false;
  protected active: boolean = false;
  protected error?: string;

  constructor(hub: IntegrationHub, name: string, type: string, id: string = uuidv4()) {
    this.hub = hub;
    this.name = name;
    this.type = type;
    this.id = id;
  }

  /**
   * Initialize the component
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await this.initializeComponent();
      this.initialized = true;
      this.active = true;
      this.error = undefined;
    } catch (error) {
      this.error = `Initialization error: ${error}`;
      throw error;
    }
  }

  /**
   * Shutdown the component
   */
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      await this.shutdownComponent();
      this.active = false;
    } catch (error) {
      this.error = `Shutdown error: ${error}`;
      throw error;
    } finally {
      this.initialized = false;
    }
  }

  /**
   * Get component status
   */
  async getStatus(): Promise<ComponentStatus> {
    const details = await this.getComponentDetails();

    return {
      initialized: this.initialized,
      active: this.active,
      error: this.error,
      details,
    };
  }

  /**
   * Send a message through the hub
   */
  protected sendMessage(
    event: IntegrationEvent,
    payload: any,
    target?: string,
    metadata?: Record<string, any>
  ): void {
    this.hub.sendMessage({
      event,
      source: this.id,
      target,
      payload,
      metadata,
    });
  }

  /**
   * Subscribe to messages
   */
  protected on(event: IntegrationEvent, listener: (message: IntegrationMessage) => void): void {
    this.hub.on(event, listener, this.id);
  }

  /**
   * Unsubscribe from messages
   */
  protected off(event: IntegrationEvent, listener: (message: IntegrationMessage) => void): void {
    this.hub.off(event, listener, this.id);
  }

  /**
   * Component-specific initialization
   */
  protected abstract initializeComponent(): Promise<void>;

  /**
   * Component-specific shutdown
   */
  protected abstract shutdownComponent(): Promise<void>;

  /**
   * Get component-specific details
   */
  protected abstract getComponentDetails(): Promise<Record<string, any>>;
}
