/**
 * Copilot Adapter for Personalization System
 * Integrates personalization with GitHub Copilot
 */

import { InteractionType } from '../types';
import { PersonalizationManager } from '../personalization-manager';
import { AIAdapter, AIRequestContext, AIResponse } from './ai-adapter';

/**
 * Copilot-specific request context
 */
export interface CopilotRequestContext extends AIRequestContext {
  /** File extension */
  fileExtension: string;

  /** Current line number */
  lineNumber: number;

  /** Current column number */
  columnNumber: number;

  /** Preceding code context */
  precedingCode: string;

  /** Following code context */
  followingCode: string;
}

/**
 * Copilot-specific response
 */
export interface CopilotResponse extends AIResponse {
  /** Suggested code */
  suggestedCode: string;

  /** Alternative suggestions */
  alternatives?: string[];

  /** Confidence score */
  confidence?: number;
}

/**
 * Adapter for integrating with GitHub Copilot
 */
export class CopilotAdapter extends AIAdapter {
  private personalizationManager: PersonalizationManager;

  constructor(personalizationManager: PersonalizationManager) {
    super(personalizationManager);
    this.personalizationManager = personalizationManager;
  }

  /**
   * Process a Copilot request
   */
  async processRequest(request: CopilotRequestContext): Promise<CopilotRequestContext> {
    // First apply general AI personalization
    const personalizedRequest = await super.personalizeRequest(request);

    // Track Copilot-specific interaction data
    await this.personalizationManager.trackInteraction(
      request.userId,
      InteractionType.QUERY,
      {
        fileExtension: request.fileExtension,
        lineNumber: request.lineNumber,
        columnNumber: request.columnNumber,
        precedingCodeLength: request.precedingCode.length,
        followingCodeLength: request.followingCode.length,
      },
      { source: 'copilot' }
    );

    return personalizedRequest as CopilotRequestContext;
  }

  /**
   * Process a Copilot response
   */
  async processResponse(
    response: CopilotResponse,
    request: CopilotRequestContext
  ): Promise<CopilotResponse> {
    // First apply general AI personalization
    const personalizedResponse = (await super.personalizeResponse(
      response,
      request
    )) as CopilotResponse;

    // Personalize the suggested code
    const personalizedCode = await this.personalizationManager.personalizeContent(
      request.userId,
      response.suggestedCode,
      'code'
    );

    personalizedResponse.suggestedCode = personalizedCode as string;

    // Personalize alternative suggestions if present
    if (personalizedResponse.alternatives && personalizedResponse.alternatives.length > 0) {
      const personalizedAlternatives: string[] = [];

      for (const alternative of personalizedResponse.alternatives) {
        const personalizedAlt = await this.personalizationManager.personalizeContent(
          request.userId,
          alternative,
          'code'
        );

        personalizedAlternatives.push(personalizedAlt as string);
      }

      personalizedResponse.alternatives = personalizedAlternatives;
    }

    // Track response interaction
    await this.personalizationManager.trackInteraction(
      request.userId,
      InteractionType.FEEDBACK,
      {
        fileExtension: request.fileExtension,
        suggestedCodeLength: response.suggestedCode.length,
        alternativeCount: response.alternatives?.length || 0,
        confidence: response.confidence,
      },
      { source: 'copilot' }
    );

    return personalizedResponse;
  }

  /**
   * Track code acceptance from Copilot
   */
  async trackCodeAcceptance(
    userId: string,
    suggestedCode: string,
    fileExtension: string,
    accepted: boolean,
    edited?: boolean
  ): Promise<void> {
    await this.personalizationManager.trackInteraction(
      userId,
      InteractionType.FEEDBACK,
      {
        action: 'code-acceptance',
        fileExtension,
        suggestedCodeLength: suggestedCode.length,
        accepted,
        edited,
      },
      { source: 'copilot-acceptance' }
    );

    // If code was accepted, store it as a code style example
    if (accepted) {
      await this.personalizationManager.trackInteraction(
        userId,
        InteractionType.MEMORY_CREATION,
        {
          type: 'code',
          content: suggestedCode,
          fileExtension,
        },
        { source: 'copilot-accepted-code' }
      );
    }
  }

  /**
   * Track inline code completion
   */
  async trackInlineCompletion(
    userId: string,
    precedingCode: string,
    completion: string,
    fileExtension: string,
    accepted: boolean
  ): Promise<void> {
    await this.personalizationManager.trackInteraction(
      userId,
      InteractionType.CUSTOM,
      {
        action: 'inline-completion',
        fileExtension,
        precedingCodeLength: precedingCode.length,
        completionLength: completion.length,
        accepted,
      },
      { source: 'copilot-inline' }
    );
  }
}
