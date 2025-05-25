/**
 * IDE Integration for Cross-Project Knowledge Transfer
 * Provides integration with development environments
 */

import { EventEmitter } from 'events';
import { KnowledgeTransferManager, KnowledgeSuggestion } from '../knowledge-transfer-manager';
import { ProjectContextManager } from '../project-context';
import { Knowledge, KnowledgeType } from '../types';

/**
 * IDE integration events
 */
export enum IDEIntegrationEvent {
  SUGGESTION_CREATED = 'suggestion-created',
  SUGGESTION_ACCEPTED = 'suggestion-accepted',
  SUGGESTION_REJECTED = 'suggestion-rejected',
  KNOWLEDGE_APPLIED = 'knowledge-applied',
  KNOWLEDGE_EXTRACTED = 'knowledge-extracted',
}

/**
 * IDE context information
 */
export interface IDEContext {
  /** Current file path */
  filePath: string;

  /** Current file content */
  content: string;

  /** Current cursor position */
  cursorPosition: {
    line: number;
    column: number;
  };

  /** Selected text (if any) */
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
    text: string;
  };

  /** Current project ID */
  projectId: string;
}

/**
 * Suggestion display options
 */
export interface SuggestionDisplayOptions {
  /** Whether to show inline */
  showInline: boolean;

  /** Whether to show in a separate panel */
  showInPanel: boolean;

  /** Whether to highlight related code */
  highlightRelatedCode: boolean;

  /** Whether to show diff preview */
  showDiffPreview: boolean;

  /** Whether to show compatibility information */
  showCompatibility: boolean;
}

/**
 * Default suggestion display options
 */
const DEFAULT_DISPLAY_OPTIONS: SuggestionDisplayOptions = {
  showInline: true,
  showInPanel: true,
  highlightRelatedCode: true,
  showDiffPreview: true,
  showCompatibility: true,
};

/**
 * Provides integration with development environments
 */
export class IDEIntegration {
  private transferManager: KnowledgeTransferManager;
  private projectManager: ProjectContextManager;
  private eventEmitter: EventEmitter;
  private activeSuggestions: Map<string, KnowledgeSuggestion> = new Map();
  private displayOptions: SuggestionDisplayOptions;

  constructor(
    transferManager: KnowledgeTransferManager,
    projectManager: ProjectContextManager,
    displayOptions: Partial<SuggestionDisplayOptions> = {}
  ) {
    this.transferManager = transferManager;
    this.projectManager = projectManager;
    this.eventEmitter = new EventEmitter();
    this.displayOptions = {
      ...DEFAULT_DISPLAY_OPTIONS,
      ...displayOptions,
    };

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Process IDE context to generate suggestions
   */
  async processDEContext(context: IDEContext): Promise<KnowledgeSuggestion[]> {
    // Set active project
    this.projectManager.setActiveProject(context.projectId);

    // Generate suggestions based on context
    const suggestions = await this.transferManager.suggestKnowledge(context.projectId, {
      filePath: context.filePath,
      content: context.selection?.text || context.content,
    });

    // Store active suggestions
    for (const suggestion of suggestions) {
      const suggestionId = `${suggestion.knowledge.id}-${Date.now()}`;
      this.activeSuggestions.set(suggestionId, suggestion);

      // Emit event
      this.eventEmitter.emit(IDEIntegrationEvent.SUGGESTION_CREATED, {
        suggestionId,
        suggestion,
        context,
      });
    }

    return suggestions;
  }

  /**
   * Accept a suggestion
   */
  async acceptSuggestion(
    suggestionId: string,
    options: {
      applyDirectly?: boolean;
      insertPosition?: {
        line: number;
        column: number;
      };
      modifications?: string;
      notes?: string;
    } = {}
  ): Promise<void> {
    const suggestion = this.activeSuggestions.get(suggestionId);

    if (!suggestion) {
      throw new Error(`Suggestion with ID ${suggestionId} not found`);
    }

    // Record knowledge application
    await this.transferManager.applyKnowledge(
      suggestion.knowledge.id,
      suggestion.context.projectContext,
      {
        filePath: suggestion.context.filePath,
        modifications: options.modifications,
        notes: options.notes,
      }
    );

    // Emit event
    this.eventEmitter.emit(IDEIntegrationEvent.SUGGESTION_ACCEPTED, {
      suggestionId,
      suggestion,
      options,
    });

    // Remove from active suggestions
    this.activeSuggestions.delete(suggestionId);
  }

  /**
   * Reject a suggestion
   */
  async rejectSuggestion(suggestionId: string, reason?: string): Promise<void> {
    const suggestion = this.activeSuggestions.get(suggestionId);

    if (!suggestion) {
      throw new Error(`Suggestion with ID ${suggestionId} not found`);
    }

    // Emit event
    this.eventEmitter.emit(IDEIntegrationEvent.SUGGESTION_REJECTED, {
      suggestionId,
      suggestion,
      reason,
    });

    // Remove from active suggestions
    this.activeSuggestions.delete(suggestionId);
  }

  /**
   * Extract knowledge from IDE selection
   */
  async extractFromSelection(
    context: IDEContext,
    options: {
      title?: string;
      description?: string;
      type?: KnowledgeType;
      tags?: string[];
    } = {}
  ): Promise<Knowledge[]> {
    if (!context.selection) {
      throw new Error('No selection provided');
    }

    // Extract knowledge from selection
    const extractedKnowledge = await this.transferManager.extractKnowledge(
      context.selection.text,
      context.filePath,
      context.projectId
    );

    // If user provided metadata, update the first knowledge entity
    if (
      extractedKnowledge.length > 0 &&
      (options.title || options.description || options.type || options.tags)
    ) {
      const knowledge = extractedKnowledge[0];

      const updates: Partial<Knowledge> = {};

      if (options.title) {
        updates.title = options.title;
      }

      if (options.description) {
        updates.description = options.description;
      }

      if (options.type) {
        updates.type = options.type;
      }

      if (options.tags) {
        updates.tags = [...knowledge.tags, ...options.tags];
      }

      await this.transferManager.updateKnowledge(knowledge.id, updates);
    }

    // Emit event
    this.eventEmitter.emit(IDEIntegrationEvent.KNOWLEDGE_EXTRACTED, {
      knowledge: extractedKnowledge,
      context,
    });

    return extractedKnowledge;
  }

  /**
   * Apply knowledge to current file
   */
  async applyKnowledgeToFile(
    knowledgeId: string,
    context: IDEContext,
    options: {
      insertPosition?: {
        line: number;
        column: number;
      };
      replaceSelection?: boolean;
      modifications?: string;
      notes?: string;
    } = {}
  ): Promise<void> {
    // Get knowledge
    const knowledge = await this.transferManager.getKnowledge(knowledgeId);

    if (!knowledge) {
      throw new Error(`Knowledge with ID ${knowledgeId} not found`);
    }

    // Record knowledge application
    await this.transferManager.applyKnowledge(knowledgeId, context.projectId, {
      filePath: context.filePath,
      modifications: options.modifications,
      notes: options.notes,
    });

    // Emit event
    this.eventEmitter.emit(IDEIntegrationEvent.KNOWLEDGE_APPLIED, {
      knowledge,
      context,
      options,
    });
  }

  /**
   * Get active suggestions
   */
  getActiveSuggestions(): KnowledgeSuggestion[] {
    return Array.from(this.activeSuggestions.values());
  }

  /**
   * Get display options
   */
  getDisplayOptions(): SuggestionDisplayOptions {
    return { ...this.displayOptions };
  }

  /**
   * Update display options
   */
  updateDisplayOptions(options: Partial<SuggestionDisplayOptions>): void {
    this.displayOptions = {
      ...this.displayOptions,
      ...options,
    };
  }

  /**
   * Subscribe to IDE integration events
   */
  on(event: IDEIntegrationEvent, listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from IDE integration events
   */
  off(event: IDEIntegrationEvent, listener: (data: any) => void): void {
    this.eventEmitter.off(event, listener);
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Example: Log suggestion events
    this.eventEmitter.on(IDEIntegrationEvent.SUGGESTION_CREATED, data => {
      console.log(`Suggestion created: ${data.suggestion.knowledge.title}`);
    });

    this.eventEmitter.on(IDEIntegrationEvent.SUGGESTION_ACCEPTED, data => {
      console.log(`Suggestion accepted: ${data.suggestion.knowledge.title}`);
    });

    this.eventEmitter.on(IDEIntegrationEvent.SUGGESTION_REJECTED, data => {
      console.log(`Suggestion rejected: ${data.suggestion.knowledge.title}`);
    });
  }
}
