/**
 * Augment Adapter for Personalization System
 * Integrates personalization with Augment AI
 */

import { InteractionType } from '../types';
import { PersonalizationManager } from '../personalization-manager';
import { AIAdapter, AIRequestContext, AIResponse } from './ai-adapter';

/**
 * Augment-specific request context
 */
export interface AugmentRequestContext extends AIRequestContext {
  /** Augment conversation ID */
  conversationId: string;

  /** Augment message ID */
  messageId: string;

  /** Whether this is a follow-up question */
  isFollowUp: boolean;
}

/**
 * Augment-specific response
 */
export interface AugmentResponse extends AIResponse {
  /** Augment message ID */
  messageId: string;

  /** Code blocks in the response */
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;

  /** Links in the response */
  links?: string[];
}

/**
 * Adapter for integrating with Augment AI
 */
export class AugmentAdapter extends AIAdapter {
  private personalizationManager: PersonalizationManager;

  constructor(personalizationManager: PersonalizationManager) {
    super(personalizationManager);
    this.personalizationManager = personalizationManager;
  }

  /**
   * Process an Augment request
   */
  async processRequest(request: AugmentRequestContext): Promise<AugmentRequestContext> {
    // First apply general AI personalization
    const personalizedRequest = await super.personalizeRequest(request);

    // Track Augment-specific interaction data
    await this.personalizationManager.trackInteraction(
      request.userId,
      InteractionType.QUERY,
      {
        conversationId: request.conversationId,
        messageId: request.messageId,
        isFollowUp: request.isFollowUp,
        query: request.content,
      },
      { source: 'augment' }
    );

    return personalizedRequest as AugmentRequestContext;
  }

  /**
   * Process an Augment response
   */
  async processResponse(
    response: AugmentResponse,
    request: AugmentRequestContext
  ): Promise<AugmentResponse> {
    // First apply general AI personalization
    const personalizedResponse = (await super.personalizeResponse(
      response,
      request
    )) as AugmentResponse;

    // Personalize code blocks if present
    if (personalizedResponse.codeBlocks && personalizedResponse.codeBlocks.length > 0) {
      for (let i = 0; i < personalizedResponse.codeBlocks.length; i++) {
        const codeBlock = personalizedResponse.codeBlocks[i];

        // Personalize each code block
        const personalizedCode = await this.personalizationManager.personalizeContent(
          request.userId,
          codeBlock.code,
          'code'
        );

        personalizedResponse.codeBlocks[i] = {
          ...codeBlock,
          code: personalizedCode as string,
        };
      }
    }

    // Track response interaction
    await this.personalizationManager.trackInteraction(
      request.userId,
      InteractionType.FEEDBACK,
      {
        conversationId: request.conversationId,
        messageId: response.messageId,
        responseType: response.responseType,
        hasCodeBlocks: !!response.codeBlocks,
        codeBlockCount: response.codeBlocks?.length || 0,
      },
      { source: 'augment' }
    );

    return personalizedResponse;
  }

  /**
   * Track user feedback on an Augment response
   */
  async trackFeedback(
    userId: string,
    messageId: string,
    feedback: 'positive' | 'negative' | 'neutral',
    details?: string
  ): Promise<void> {
    await this.personalizationManager.trackInteraction(
      userId,
      InteractionType.FEEDBACK,
      {
        messageId,
        feedback,
        details,
      },
      { source: 'augment-feedback' }
    );
  }

  /**
   * Track code execution from Augment
   */
  async trackCodeExecution(
    userId: string,
    code: string,
    language: string,
    success: boolean,
    output?: string
  ): Promise<void> {
    await this.personalizationManager.trackInteraction(
      userId,
      InteractionType.CUSTOM,
      {
        action: 'code-execution',
        language,
        codeLength: code.length,
        success,
        hasOutput: !!output,
      },
      { source: 'augment-execution' }
    );
  }
}
