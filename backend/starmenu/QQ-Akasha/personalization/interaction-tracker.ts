/**
 * Interaction Tracker for Personalization System
 */

import { EventEmitter } from 'events';
import { InteractionType, UserInteraction } from './types';
import { ProfileStorage } from './profile-storage';

/**
 * Events emitted by the interaction tracker
 */
export enum InteractionEvent {
  INTERACTION_RECORDED = 'interaction-recorded',
  PATTERN_DETECTED = 'pattern-detected',
}

/**
 * Tracks user interactions for personalization
 */
export class InteractionTracker {
  private storage: ProfileStorage;
  private eventEmitter: EventEmitter;
  private patternDetectors: Map<string, (interaction: UserInteraction) => Promise<void>>;

  constructor(storage: ProfileStorage) {
    this.storage = storage;
    this.eventEmitter = new EventEmitter();
    this.patternDetectors = new Map();
  }

  /**
   * Record a user interaction
   */
  async trackInteraction(
    userId: string,
    type: InteractionType,
    context: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<UserInteraction> {
    const interaction = await this.storage.addInteraction({
      userId,
      type,
      timestamp: new Date(),
      context,
      metadata,
    });

    // Emit event
    this.eventEmitter.emit(InteractionEvent.INTERACTION_RECORDED, interaction);

    // Run pattern detectors
    for (const detector of this.patternDetectors.values()) {
      try {
        await detector(interaction);
      } catch (error) {
        console.error('Error in pattern detector:', error);
      }
    }

    return interaction;
  }

  /**
   * Get recent interactions for a user
   */
  async getRecentInteractions(userId: string, limit: number = 20): Promise<UserInteraction[]> {
    return this.storage.getInteractions(userId, limit);
  }

  /**
   * Get interactions of a specific type
   */
  async getInteractionsByType(
    userId: string,
    type: InteractionType,
    limit?: number
  ): Promise<UserInteraction[]> {
    const interactions = await this.storage.getInteractions(userId);

    const filtered = interactions.filter(i => i.type === type);

    // Sort by timestamp (newest first)
    const sorted = filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit if specified
    if (limit !== undefined) {
      return sorted.slice(0, limit);
    }

    return sorted;
  }

  /**
   * Register a pattern detector
   */
  registerPatternDetector(
    id: string,
    detector: (interaction: UserInteraction) => Promise<void>
  ): void {
    this.patternDetectors.set(id, detector);
  }

  /**
   * Unregister a pattern detector
   */
  unregisterPatternDetector(id: string): boolean {
    return this.patternDetectors.delete(id);
  }

  /**
   * Subscribe to interaction events
   */
  on(event: InteractionEvent, listener: (interaction: UserInteraction) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from interaction events
   */
  off(event: InteractionEvent, listener: (interaction: UserInteraction) => void): void {
    this.eventEmitter.off(event, listener);
  }

  /**
   * Emit a pattern detected event
   */
  emitPatternDetected(patternType: string, userId: string, details: Record<string, any>): void {
    this.eventEmitter.emit(InteractionEvent.PATTERN_DETECTED, {
      patternType,
      userId,
      timestamp: new Date(),
      details,
    });
  }
}
