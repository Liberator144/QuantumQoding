/**
 * User Profile Storage for Personalization System
 */

import { v4 as uuidv4 } from 'uuid';
import { UserInteraction, UserPreference, UserProfile } from './types';

/**
 * Interface for user profile storage providers
 */
export interface ProfileStorage {
  /** Get a user profile by ID */
  getProfile(userId: string): Promise<UserProfile | null>;

  /** Create a new user profile */
  createProfile(name: string, metadata?: Record<string, any>): Promise<UserProfile>;

  /** Update a user profile */
  updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;

  /** Delete a user profile */
  deleteProfile(userId: string): Promise<boolean>;

  /** Add a user interaction */
  addInteraction(interaction: Omit<UserInteraction, 'id'>): Promise<UserInteraction>;

  /** Get user interactions */
  getInteractions(userId: string, limit?: number): Promise<UserInteraction[]>;

  /** Set a user preference */
  setPreference(
    userId: string,
    preference: Omit<UserPreference, 'updatedAt'>
  ): Promise<UserPreference>;

  /** Get user preferences */
  getPreferences(userId: string, category?: string, key?: string): Promise<UserPreference[]>;
}

/**
 * In-memory implementation of profile storage
 */
export class InMemoryProfileStorage implements ProfileStorage {
  private profiles: Map<string, UserProfile> = new Map();
  private interactions: Map<string, UserInteraction[]> = new Map();

  /**
   * Get a user profile by ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    return this.profiles.get(userId) || null;
  }

  /**
   * Create a new user profile
   */
  async createProfile(name: string, metadata: Record<string, any> = {}): Promise<UserProfile> {
    const id = uuidv4();
    const now = new Date();

    const profile: UserProfile = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      preferences: [],
      recentInteractions: [],
      projectContexts: [],
      metadata,
    };

    this.profiles.set(id, profile);
    this.interactions.set(id, []);

    return profile;
  }

  /**
   * Update a user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = this.profiles.get(userId);

    if (!profile) {
      throw new Error(`Profile with ID ${userId} not found`);
    }

    const updatedProfile: UserProfile = {
      ...profile,
      ...updates,
      id: profile.id, // Ensure ID doesn't change
      createdAt: profile.createdAt, // Ensure creation date doesn't change
      updatedAt: new Date(), // Update the updated timestamp
    };

    this.profiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  /**
   * Delete a user profile
   */
  async deleteProfile(userId: string): Promise<boolean> {
    const deleted = this.profiles.delete(userId);
    this.interactions.delete(userId);
    return deleted;
  }

  /**
   * Add a user interaction
   */
  async addInteraction(interaction: Omit<UserInteraction, 'id'>): Promise<UserInteraction> {
    const id = uuidv4();

    const newInteraction: UserInteraction = {
      ...interaction,
      id,
    };

    // Get or create the user's interaction array
    if (!this.interactions.has(interaction.userId)) {
      this.interactions.set(interaction.userId, []);
    }

    const userInteractions = this.interactions.get(interaction.userId)!;
    userInteractions.push(newInteraction);

    // Update the profile's recent interactions
    const profile = this.profiles.get(interaction.userId);
    if (profile) {
      profile.recentInteractions.push(newInteraction);

      // Keep only the most recent interactions
      if (profile.recentInteractions.length > 20) {
        profile.recentInteractions = profile.recentInteractions.slice(-20);
      }

      profile.updatedAt = new Date();
      this.profiles.set(interaction.userId, profile);
    }

    return newInteraction;
  }

  /**
   * Get user interactions
   */
  async getInteractions(userId: string, limit?: number): Promise<UserInteraction[]> {
    const userInteractions = this.interactions.get(userId) || [];

    // Sort by timestamp (newest first)
    const sorted = [...userInteractions].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    // Apply limit if specified
    if (limit !== undefined) {
      return sorted.slice(0, limit);
    }

    return sorted;
  }

  /**
   * Set a user preference
   */
  async setPreference(
    userId: string,
    preference: Omit<UserPreference, 'updatedAt'>
  ): Promise<UserPreference> {
    const profile = this.profiles.get(userId);

    if (!profile) {
      throw new Error(`Profile with ID ${userId} not found`);
    }

    const now = new Date();
    const newPreference: UserPreference = {
      ...preference,
      updatedAt: now,
    };

    // Check if this preference already exists
    const existingIndex = profile.preferences.findIndex(
      p => p.category === preference.category && p.key === preference.key
    );

    if (existingIndex >= 0) {
      // Update existing preference
      profile.preferences[existingIndex] = newPreference;
    } else {
      // Add new preference
      profile.preferences.push(newPreference);
    }

    profile.updatedAt = now;
    this.profiles.set(userId, profile);

    return newPreference;
  }

  /**
   * Get user preferences
   */
  async getPreferences(userId: string, category?: string, key?: string): Promise<UserPreference[]> {
    const profile = this.profiles.get(userId);

    if (!profile) {
      return [];
    }

    let preferences = profile.preferences;

    // Filter by category if specified
    if (category) {
      preferences = preferences.filter(p => p.category === category);
    }

    // Filter by key if specified
    if (key) {
      preferences = preferences.filter(p => p.key === key);
    }

    return preferences;
  }
}
