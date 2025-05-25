/**
 * Persona Model for Personalization System
 * Supports multiple context-specific personas for a user
 */

import { v4 as uuidv4 } from 'uuid';
import { PreferenceCategory, UserPreference } from '../types';

/**
 * Persona context types
 */
export enum PersonaContextType {
  PROJECT = 'project',
  LANGUAGE = 'language',
  DOMAIN = 'domain',
  ROLE = 'role',
  TIME = 'time',
  CUSTOM = 'custom',
}

/**
 * Persona activation rule
 */
export interface PersonaActivationRule {
  /** Context type this rule applies to */
  contextType: PersonaContextType;

  /** Context value to match */
  contextValue: string;

  /** Whether to use exact matching */
  exactMatch: boolean;

  /** Priority of this rule (higher wins in conflicts) */
  priority: number;
}

/**
 * User persona
 */
export interface Persona {
  /** Unique identifier for the persona */
  id: string;

  /** User ID this persona belongs to */
  userId: string;

  /** Name of the persona */
  name: string;

  /** Description of the persona */
  description?: string;

  /** When the persona was created */
  createdAt: Date;

  /** When the persona was last updated */
  updatedAt: Date;

  /** Activation rules for this persona */
  activationRules: PersonaActivationRule[];

  /** Preferences specific to this persona */
  preferences: UserPreference[];

  /** Whether this is the default persona */
  isDefault: boolean;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Persona manager for handling multiple personas per user
 */
export class PersonaManager {
  private personas: Map<string, Persona[]> = new Map();

  /**
   * Create a new persona for a user
   */
  createPersona(
    userId: string,
    name: string,
    activationRules: PersonaActivationRule[] = [],
    preferences: UserPreference[] = [],
    isDefault: boolean = false,
    description?: string,
    metadata?: Record<string, any>
  ): Persona {
    const now = new Date();

    const persona: Persona = {
      id: uuidv4(),
      userId,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      activationRules,
      preferences,
      isDefault,
      metadata,
    };

    // Get or create user's persona array
    if (!this.personas.has(userId)) {
      this.personas.set(userId, []);
    }

    const userPersonas = this.personas.get(userId)!;

    // If this is the default persona, unset any existing default
    if (isDefault) {
      for (const p of userPersonas) {
        p.isDefault = false;
      }
    }

    // Add the new persona
    userPersonas.push(persona);

    return persona;
  }

  /**
   * Get all personas for a user
   */
  getPersonas(userId: string): Persona[] {
    return this.personas.get(userId) || [];
  }

  /**
   * Get a specific persona
   */
  getPersona(personaId: string): Persona | null {
    for (const userPersonas of this.personas.values()) {
      const persona = userPersonas.find(p => p.id === personaId);
      if (persona) {
        return persona;
      }
    }

    return null;
  }

  /**
   * Update a persona
   */
  updatePersona(
    personaId: string,
    updates: Partial<Omit<Persona, 'id' | 'userId' | 'createdAt'>>
  ): Persona | null {
    for (const userPersonas of this.personas.values()) {
      const index = userPersonas.findIndex(p => p.id === personaId);

      if (index >= 0) {
        const persona = userPersonas[index];

        // If setting as default, unset any existing default
        if (updates.isDefault) {
          for (const p of userPersonas) {
            p.isDefault = false;
          }
        }

        // Update the persona
        const updatedPersona: Persona = {
          ...persona,
          ...updates,
          id: persona.id, // Ensure ID doesn't change
          userId: persona.userId, // Ensure user ID doesn't change
          createdAt: persona.createdAt, // Ensure creation date doesn't change
          updatedAt: new Date(), // Update the updated timestamp
        };

        userPersonas[index] = updatedPersona;
        return updatedPersona;
      }
    }

    return null;
  }

  /**
   * Delete a persona
   */
  deletePersona(personaId: string): boolean {
    for (const [userId, userPersonas] of this.personas.entries()) {
      const index = userPersonas.findIndex(p => p.id === personaId);

      if (index >= 0) {
        // Remove the persona
        userPersonas.splice(index, 1);

        // If we removed the default persona and there are others, make one the default
        if (userPersonas.length > 0 && !userPersonas.some(p => p.isDefault)) {
          userPersonas[0].isDefault = true;
        }

        return true;
      }
    }

    return false;
  }

  /**
   * Add a preference to a persona
   */
  addPreference(
    personaId: string,
    preference: Omit<UserPreference, 'updatedAt'>
  ): UserPreference | null {
    const persona = this.getPersona(personaId);

    if (!persona) {
      return null;
    }

    const now = new Date();
    const newPreference: UserPreference = {
      ...preference,
      updatedAt: now,
    };

    // Check if this preference already exists
    const existingIndex = persona.preferences.findIndex(
      p => p.category === preference.category && p.key === preference.key
    );

    if (existingIndex >= 0) {
      // Update existing preference
      persona.preferences[existingIndex] = newPreference;
    } else {
      // Add new preference
      persona.preferences.push(newPreference);
    }

    persona.updatedAt = now;

    return newPreference;
  }

  /**
   * Remove a preference from a persona
   */
  removePreference(personaId: string, category: PreferenceCategory, key: string): boolean {
    const persona = this.getPersona(personaId);

    if (!persona) {
      return false;
    }

    const initialLength = persona.preferences.length;

    persona.preferences = persona.preferences.filter(
      p => !(p.category === category && p.key === key)
    );

    if (persona.preferences.length !== initialLength) {
      persona.updatedAt = new Date();
      return true;
    }

    return false;
  }

  /**
   * Get the active persona for a context
   */
  getActivePersona(userId: string, context: Record<string, any>): Persona | null {
    const userPersonas = this.personas.get(userId) || [];

    if (userPersonas.length === 0) {
      return null;
    }

    // Calculate scores for each persona based on matching rules
    const scores: Record<string, number> = {};

    for (const persona of userPersonas) {
      scores[persona.id] = 0;

      // Check each activation rule
      for (const rule of persona.activationRules) {
        const contextValue = context[rule.contextType];

        if (contextValue) {
          if (rule.exactMatch) {
            // Exact matching
            if (contextValue === rule.contextValue) {
              scores[persona.id] += rule.priority;
            }
          } else {
            // Partial matching
            if (typeof contextValue === 'string' && contextValue.includes(rule.contextValue)) {
              scores[persona.id] += rule.priority;
            }
          }
        }
      }

      // Add a small score for the default persona
      if (persona.isDefault) {
        scores[persona.id] += 0.1;
      }
    }

    // Find the persona with the highest score
    let highestScore = -1;
    let activePersonaId: string | null = null;

    for (const [personaId, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        activePersonaId = personaId;
      }
    }

    // If no persona matched, use the default
    if (highestScore <= 0) {
      const defaultPersona = userPersonas.find(p => p.isDefault);
      return defaultPersona || null;
    }

    // Return the active persona
    return userPersonas.find(p => p.id === activePersonaId) || null;
  }

  /**
   * Get preferences from the active persona
   */
  getActivePreferences(userId: string, context: Record<string, any>): UserPreference[] {
    const activePersona = this.getActivePersona(userId, context);

    if (!activePersona) {
      return [];
    }

    return activePersona.preferences;
  }
}
