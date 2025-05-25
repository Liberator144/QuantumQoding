/**
 * IDE Integration for Predictive Knowledge Recommendation
 * Integrates recommendation engine with IDE
 */

import { EventEmitter } from 'events';
import {
  DeveloperContext,
  KnowledgeRecommendation,
  RecommendationFilter,
  RecommendationConfig,
  RecommendationTrigger,
  RecommendationContext,
  RelevanceLevel,
} from '../types';
import { RecommendationEngine, RecommendationEvent } from '../recommendation-engine';

/**
 * IDE integration events
 */
export enum IDERecommendationEvent {
  RECOMMENDATIONS_SHOWN = 'recommendations-shown',
  RECOMMENDATION_SELECTED = 'recommendation-selected',
  RECOMMENDATION_APPLIED = 'recommendation-applied',
  RECOMMENDATION_DISMISSED = 'recommendation-dismissed',
  RECOMMENDATION_FEEDBACK = 'recommendation-feedback',
  CONTEXT_CHANGED = 'context-changed',
}

/**
 * IDE notification options
 */
export interface NotificationOptions {
  /** Whether to show inline */
  showInline: boolean;

  /** Whether to show in a separate panel */
  showInPanel: boolean;

  /** Whether to show as a notification */
  showAsNotification: boolean;

  /** Whether to show code preview */
  showCodePreview: boolean;

  /** Whether to auto-dismiss after a timeout */
  autoDismiss: boolean;

  /** Auto-dismiss timeout (in milliseconds) */
  autoDismissTimeout: number;
}

/**
 * Default notification options
 */
export const DEFAULT_NOTIFICATION_OPTIONS: NotificationOptions = {
  showInline: true,
  showInPanel: true,
  showAsNotification: true,
  showCodePreview: true,
  autoDismiss: false,
  autoDismissTimeout: 10000,
};

/**
 * IDE context provider interface
 */
export interface IDEContextProvider {
  /** Get current file path */
  getCurrentFilePath(): string | undefined;

  /** Get current file content */
  getCurrentFileContent(): string | undefined;

  /** Get current cursor position */
  getCursorPosition(): { line: number; column: number } | undefined;

  /** Get current selection */
  getSelection():
    | {
        startLine: number;
        startColumn: number;
        endLine: number;
        endColumn: number;
        text: string;
      }
    | undefined;

  /** Get recent files */
  getRecentFiles(): Array<{
    path: string;
    lastAccessed: Date;
    accessType: 'view' | 'edit';
  }>;

  /** Get recent commands */
  getRecentCommands(): Array<{
    command: string;
    timestamp: Date;
  }>;

  /** Get recent errors */
  getRecentErrors(): Array<{
    message: string;
    location?: string;
    timestamp: Date;
  }>;

  /** Get recent searches */
  getRecentSearches(): Array<{
    query: string;
    timestamp: Date;
  }>;

  /** Get current project ID */
  getCurrentProjectId(): string;
}

/**
 * IDE UI provider interface
 */
export interface IDEUIProvider {
  /** Show recommendations inline */
  showInlineRecommendations(
    recommendations: KnowledgeRecommendation[],
    position: { line: number; column: number }
  ): void;

  /** Show recommendations in panel */
  showPanelRecommendations(recommendations: KnowledgeRecommendation[]): void;

  /** Show recommendation notification */
  showNotification(recommendation: KnowledgeRecommendation): void;

  /** Hide recommendations */
  hideRecommendations(): void;

  /** Apply recommendation */
  applyRecommendation(recommendation: KnowledgeRecommendation): Promise<boolean>;

  /** Show feedback UI */
  showFeedbackUI(recommendation: KnowledgeRecommendation): void;
}

/**
 * Integrates recommendation engine with IDE
 */
export class IDERecommendationIntegration {
  private recommendationEngine: RecommendationEngine;
  private contextProvider: IDEContextProvider;
  private uiProvider: IDEUIProvider;
  private notificationOptions: NotificationOptions;
  private eventEmitter: EventEmitter;
  private activeRecommendations: KnowledgeRecommendation[] = [];
  private lastContextChangeTime: number = 0;
  private contextChangeDebounceTime: number = 500; // ms
  private isProcessingContext: boolean = false;

  constructor(
    recommendationEngine: RecommendationEngine,
    contextProvider: IDEContextProvider,
    uiProvider: IDEUIProvider,
    notificationOptions: Partial<NotificationOptions> = {}
  ) {
    this.recommendationEngine = recommendationEngine;
    this.contextProvider = contextProvider;
    this.uiProvider = uiProvider;
    this.notificationOptions = {
      ...DEFAULT_NOTIFICATION_OPTIONS,
      ...notificationOptions,
    };
    this.eventEmitter = new EventEmitter();

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Listen for recommendation events
    this.recommendationEngine.on(
      RecommendationEvent.RECOMMENDATION_CREATED,
      this.handleRecommendationCreated.bind(this)
    );

    this.recommendationEngine.on(
      RecommendationEvent.RECOMMENDATION_APPLIED,
      this.handleRecommendationApplied.bind(this)
    );

    this.recommendationEngine.on(
      RecommendationEvent.RECOMMENDATION_DISMISSED,
      this.handleRecommendationDismissed.bind(this)
    );

    this.recommendationEngine.on(
      RecommendationEvent.RECOMMENDATION_FEEDBACK,
      this.handleRecommendationFeedback.bind(this)
    );
  }

  /**
   * Handle context change
   */
  async handleContextChange(): Promise<void> {
    // Debounce context changes
    const now = Date.now();
    this.lastContextChangeTime = now;

    // Wait for debounce time
    setTimeout(async () => {
      // Skip if another context change happened during debounce time
      if (this.lastContextChangeTime !== now || this.isProcessingContext) {
        return;
      }

      this.isProcessingContext = true;

      try {
        // Get current context
        const context = this.getCurrentContext();

        // Emit context changed event
        this.eventEmitter.emit(IDERecommendationEvent.CONTEXT_CHANGED, context);

        // Generate recommendations
        const recommendations = await this.recommendationEngine.generateRecommendations(context);

        // Update active recommendations
        this.activeRecommendations = recommendations;

        // Show recommendations if any
        if (recommendations.length > 0) {
          this.showRecommendations(recommendations);
        }
      } finally {
        this.isProcessingContext = false;
      }
    }, this.contextChangeDebounceTime);
  }

  /**
   * Get current context
   */
  private getCurrentContext(): DeveloperContext {
    return {
      projectId: this.contextProvider.getCurrentProjectId(),
      filePath: this.contextProvider.getCurrentFilePath(),
      fileContent: this.contextProvider.getCurrentFileContent(),
      cursorPosition: this.contextProvider.getCursorPosition(),
      selection: this.contextProvider.getSelection(),
      recentFiles: this.contextProvider.getRecentFiles(),
      recentCommands: this.contextProvider.getRecentCommands(),
      recentErrors: this.contextProvider.getRecentErrors(),
      recentSearches: this.contextProvider.getRecentSearches(),
    };
  }

  /**
   * Show recommendations
   */
  private showRecommendations(recommendations: KnowledgeRecommendation[]): void {
    // Show inline if enabled and cursor position is available
    if (this.notificationOptions.showInline) {
      const cursorPosition = this.contextProvider.getCursorPosition();
      if (cursorPosition) {
        this.uiProvider.showInlineRecommendations(recommendations, cursorPosition);
      }
    }

    // Show in panel if enabled
    if (this.notificationOptions.showInPanel) {
      this.uiProvider.showPanelRecommendations(recommendations);
    }

    // Show notification for high relevance recommendations
    if (this.notificationOptions.showAsNotification) {
      const highRelevanceRecommendations = recommendations.filter(
        r =>
          r.relevanceLevel === RelevanceLevel.CRITICAL || r.relevanceLevel === RelevanceLevel.HIGH
      );

      for (const recommendation of highRelevanceRecommendations) {
        this.uiProvider.showNotification(recommendation);

        // Mark as viewed
        this.recommendationEngine.markAsViewed(recommendation.id);
      }
    }

    // Emit recommendations shown event
    this.eventEmitter.emit(IDERecommendationEvent.RECOMMENDATIONS_SHOWN, recommendations);
  }

  /**
   * Handle recommendation created
   */
  private handleRecommendationCreated(recommendation: KnowledgeRecommendation): void {
    // This is handled by the showRecommendations method
  }

  /**
   * Handle recommendation applied
   */
  private handleRecommendationApplied(recommendation: KnowledgeRecommendation): void {
    // Emit recommendation applied event
    this.eventEmitter.emit(IDERecommendationEvent.RECOMMENDATION_APPLIED, recommendation);
  }

  /**
   * Handle recommendation dismissed
   */
  private handleRecommendationDismissed(recommendation: KnowledgeRecommendation): void {
    // Emit recommendation dismissed event
    this.eventEmitter.emit(IDERecommendationEvent.RECOMMENDATION_DISMISSED, recommendation);
  }

  /**
   * Handle recommendation feedback
   */
  private handleRecommendationFeedback(data: {
    recommendation: KnowledgeRecommendation;
    rating: number;
    comment?: string;
  }): void {
    // Emit recommendation feedback event
    this.eventEmitter.emit(IDERecommendationEvent.RECOMMENDATION_FEEDBACK, data);
  }

  /**
   * Select recommendation
   */
  selectRecommendation(recommendationId: string): KnowledgeRecommendation | undefined {
    const recommendation = this.activeRecommendations.find(r => r.id === recommendationId);

    if (recommendation) {
      // Mark as viewed
      this.recommendationEngine.markAsViewed(recommendation.id);

      // Emit recommendation selected event
      this.eventEmitter.emit(IDERecommendationEvent.RECOMMENDATION_SELECTED, recommendation);
    }

    return recommendation;
  }

  /**
   * Apply recommendation
   */
  async applyRecommendation(recommendationId: string): Promise<boolean> {
    const recommendation = this.activeRecommendations.find(r => r.id === recommendationId);

    if (!recommendation) {
      return false;
    }

    // Apply recommendation using UI provider
    const success = await this.uiProvider.applyRecommendation(recommendation);

    if (success) {
      // Mark as applied
      this.recommendationEngine.markAsApplied(recommendation.id);
    }

    return success;
  }

  /**
   * Dismiss recommendation
   */
  dismissRecommendation(recommendationId: string): boolean {
    return this.recommendationEngine.dismissRecommendation(recommendationId);
  }

  /**
   * Provide feedback for recommendation
   */
  provideFeedback(
    recommendationId: string,
    rating: number,
    comment?: string
  ): KnowledgeRecommendation | undefined {
    return this.recommendationEngine.provideFeedback(recommendationId, rating, comment);
  }

  /**
   * Show feedback UI for recommendation
   */
  showFeedbackUI(recommendationId: string): void {
    const recommendation = this.activeRecommendations.find(r => r.id === recommendationId);

    if (recommendation) {
      this.uiProvider.showFeedbackUI(recommendation);
    }
  }

  /**
   * Hide recommendations
   */
  hideRecommendations(): void {
    this.uiProvider.hideRecommendations();
  }

  /**
   * Update notification options
   */
  updateNotificationOptions(options: Partial<NotificationOptions>): void {
    this.notificationOptions = {
      ...this.notificationOptions,
      ...options,
    };
  }

  /**
   * Subscribe to IDE recommendation events
   */
  on(event: IDERecommendationEvent, listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from IDE recommendation events
   */
  off(event: IDERecommendationEvent, listener: (data: any) => void): void {
    this.eventEmitter.off(event, listener);
  }
}
