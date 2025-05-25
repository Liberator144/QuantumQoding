/**
 * AI Adapter for Personalization System
 * Adapts AI responses based on user preferences
 */

import { InteractionType, PreferenceCategory, UserPreference } from '../types';
import { PersonalizationManager } from '../personalization-manager';

/**
 * Base interface for AI request context
 */
export interface AIRequestContext {
  /** User ID */
  userId: string;

  /** Request type */
  requestType: string;

  /** Request content */
  content: string;

  /** Project context */
  projectContext?: string;

  /** File path context */
  filePath?: string;

  /** Additional context */
  additionalContext?: Record<string, any>;
}

/**
 * Base interface for AI response
 */
export interface AIResponse {
  /** Response content */
  content: string;

  /** Response type */
  responseType: string;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Adapter for personalizing AI interactions
 */
export class AIAdapter {
  private personalizationManager: PersonalizationManager;

  constructor(personalizationManager: PersonalizationManager) {
    this.personalizationManager = personalizationManager;
  }

  /**
   * Personalize an AI request
   */
  async personalizeRequest(request: AIRequestContext): Promise<AIRequestContext> {
    // Track the interaction
    await this.personalizationManager.trackInteraction(request.userId, InteractionType.QUERY, {
      query: request.content,
      requestType: request.requestType,
      projectContext: request.projectContext,
      filePath: request.filePath,
    });

    // Get user preferences
    const preferences = await this.personalizationManager.getAllPreferences(request.userId);

    // Apply preferences to request
    const personalizedRequest = { ...request };

    // Add preference context to the request
    personalizedRequest.additionalContext = {
      ...personalizedRequest.additionalContext,
      userPreferences: this.extractRelevantPreferences(preferences, request.requestType),
    };

    return personalizedRequest;
  }

  /**
   * Personalize an AI response
   */
  async personalizeResponse(response: AIResponse, request: AIRequestContext): Promise<AIResponse> {
    // Determine content type based on response type
    let contentType: string;
    switch (response.responseType) {
      case 'code':
        contentType = 'code';
        break;
      case 'documentation':
        contentType = 'documentation';
        break;
      case 'visualization':
        contentType = 'visualization';
        break;
      default:
        contentType = 'response';
    }

    // Personalize the content
    const personalizedContent = await this.personalizationManager.personalizeContent(
      request.userId,
      response.content,
      contentType
    );

    // Track the interaction
    await this.personalizationManager.trackInteraction(request.userId, InteractionType.FEEDBACK, {
      responseType: response.responseType,
      contentLength: response.content.length,
      projectContext: request.projectContext,
      filePath: request.filePath,
    });

    return {
      ...response,
      content: personalizedContent,
    };
  }

  /**
   * Extract relevant preferences for a request type
   */
  private extractRelevantPreferences(
    preferences: UserPreference[],
    requestType: string
  ): Record<string, any> {
    const relevantPreferences: Record<string, any> = {};

    // Filter preferences based on request type
    let categories: PreferenceCategory[] = [];

    switch (requestType) {
      case 'code-generation':
        categories = [PreferenceCategory.CODE_STYLE, PreferenceCategory.RESPONSE_STYLE];
        break;
      case 'documentation-generation':
        categories = [PreferenceCategory.DOCUMENTATION_STYLE, PreferenceCategory.RESPONSE_STYLE];
        break;
      case 'visualization':
        categories = [PreferenceCategory.VISUALIZATION_STYLE];
        break;
      default:
        categories = [PreferenceCategory.RESPONSE_STYLE, PreferenceCategory.CONTENT_FORMAT];
    }

    // Extract preferences in the relevant categories
    for (const category of categories) {
      relevantPreferences[category] = {};

      const categoryPrefs = preferences.filter(p => p.category === category && p.confidence >= 0.6);

      for (const pref of categoryPrefs) {
        relevantPreferences[category][pref.key] = pref.value;
      }
    }

    return relevantPreferences;
  }
}
