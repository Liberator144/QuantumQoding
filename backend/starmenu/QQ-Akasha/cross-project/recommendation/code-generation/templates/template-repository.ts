/**
 * Template repository for storing and retrieving code templates
 */

import { EventEmitter } from 'events';
import {
  CodeTemplate,
  ProgrammingLanguage,
  TemplateCategory,
  TemplateRepositorySettings,
  TemplateValidationResult,
} from './types';
import { validateTemplate } from './template-validator';

/**
 * Events emitted by the template repository
 */
export enum TemplateRepositoryEvent {
  TEMPLATE_ADDED = 'template-added',
  TEMPLATE_UPDATED = 'template-updated',
  TEMPLATE_REMOVED = 'template-removed',
  TEMPLATE_USED = 'template-used',
  TEMPLATE_RATED = 'template-rated',
  REPOSITORY_INITIALIZED = 'repository-initialized',
  REPOSITORY_CLEARED = 'repository-cleared',
}

/**
 * Template query options
 */
export interface TemplateQueryOptions {
  /** Filter by language */
  language?: ProgrammingLanguage;

  /** Filter by category */
  category?: TemplateCategory;

  /** Filter by tags (must include all) */
  tags?: string[];

  /** Search term (searches in name, description, and content) */
  searchTerm?: string;

  /** Minimum rating */
  minRating?: number;

  /** Sort by field */
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating';

  /** Sort direction */
  sortDirection?: 'asc' | 'desc';

  /** Maximum number of results */
  limit?: number;

  /** Skip first n results */
  offset?: number;
}

/**
 * Template repository for storing and retrieving code templates
 */
export class TemplateRepository {
  private templates: Map<string, CodeTemplate>;
  private settings: TemplateRepositorySettings;
  private eventEmitter: EventEmitter;

  constructor(settings: Partial<TemplateRepositorySettings> = {}) {
    this.templates = new Map();
    this.settings = {
      name: 'Default Template Repository',
      description: 'Default repository for code templates',
      location: 'memory',
      enableVersioning: false,
      enableSharing: true,
      enableRating: true,
      enableUsageTracking: true,
      ...settings,
    };
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Initialize the repository
   */
  async initialize(): Promise<void> {
    // In a real implementation, this would load templates from storage

    // Emit repository initialized event
    this.eventEmitter.emit(TemplateRepositoryEvent.REPOSITORY_INITIALIZED, {
      settings: this.settings,
      templateCount: this.templates.size,
    });
  }

  /**
   * Add a template to the repository
   */
  async addTemplate(template: CodeTemplate): Promise<TemplateValidationResult> {
    // Validate template
    const validationResult = validateTemplate(template);

    // Only add if valid
    if (validationResult.valid) {
      // Set created/updated timestamps if not set
      if (!template.createdAt) {
        template.createdAt = new Date();
      }

      if (!template.updatedAt) {
        template.updatedAt = new Date();
      }

      // Initialize usage count and rating if tracking is enabled
      if (this.settings.enableUsageTracking && template.usageCount === undefined) {
        template.usageCount = 0;
      }

      if (this.settings.enableRating && template.rating === undefined) {
        template.rating = 0;
      }

      // Add template
      this.templates.set(template.id, template);

      // Emit template added event
      this.eventEmitter.emit(TemplateRepositoryEvent.TEMPLATE_ADDED, template);
    }

    return validationResult;
  }

  /**
   * Get a template by ID
   */
  getTemplate(id: string): CodeTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Update a template
   */
  async updateTemplate(
    id: string,
    updates: Partial<CodeTemplate>
  ): Promise<TemplateValidationResult> {
    // Get existing template
    const existingTemplate = this.templates.get(id);

    // Return error if not found
    if (!existingTemplate) {
      return {
        valid: false,
        errors: [`Template with ID ${id} not found`],
        warnings: [],
      };
    }

    // Create updated template
    const updatedTemplate: CodeTemplate = {
      ...existingTemplate,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(), // Update timestamp
    };

    // Validate updated template
    const validationResult = validateTemplate(updatedTemplate);

    // Only update if valid
    if (validationResult.valid) {
      // Update template
      this.templates.set(id, updatedTemplate);

      // Emit template updated event
      this.eventEmitter.emit(TemplateRepositoryEvent.TEMPLATE_UPDATED, updatedTemplate);
    }

    return validationResult;
  }

  /**
   * Remove a template
   */
  removeTemplate(id: string): boolean {
    // Get existing template
    const existingTemplate = this.templates.get(id);

    // Return false if not found
    if (!existingTemplate) {
      return false;
    }

    // Remove template
    const removed = this.templates.delete(id);

    // Emit template removed event if successful
    if (removed) {
      this.eventEmitter.emit(TemplateRepositoryEvent.TEMPLATE_REMOVED, existingTemplate);
    }

    return removed;
  }

  /**
   * Track template usage
   */
  trackTemplateUsage(id: string): boolean {
    // Skip if usage tracking is disabled
    if (!this.settings.enableUsageTracking) {
      return false;
    }

    // Get existing template
    const existingTemplate = this.templates.get(id);

    // Return false if not found
    if (!existingTemplate) {
      return false;
    }

    // Increment usage count
    existingTemplate.usageCount = (existingTemplate.usageCount || 0) + 1;

    // Update template
    this.templates.set(id, existingTemplate);

    // Emit template used event
    this.eventEmitter.emit(TemplateRepositoryEvent.TEMPLATE_USED, existingTemplate);

    return true;
  }

  /**
   * Rate a template
   */
  rateTemplate(id: string, rating: number): boolean {
    // Skip if rating is disabled
    if (!this.settings.enableRating) {
      return false;
    }

    // Validate rating
    if (rating < 0 || rating > 5) {
      return false;
    }

    // Get existing template
    const existingTemplate = this.templates.get(id);

    // Return false if not found
    if (!existingTemplate) {
      return false;
    }

    // Update rating (simple average for now)
    // In a real implementation, this would store individual ratings and calculate the average
    existingTemplate.rating = rating;

    // Update template
    this.templates.set(id, existingTemplate);

    // Emit template rated event
    this.eventEmitter.emit(TemplateRepositoryEvent.TEMPLATE_RATED, {
      template: existingTemplate,
      rating,
    });

    return true;
  }

  /**
   * Query templates
   */
  queryTemplates(options: TemplateQueryOptions = {}): CodeTemplate[] {
    // Get all templates
    let templates = Array.from(this.templates.values());

    // Filter by language
    if (options.language) {
      templates = templates.filter(template => template.language === options.language);
    }

    // Filter by category
    if (options.category) {
      templates = templates.filter(template => template.category === options.category);
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      templates = templates.filter(template =>
        options.tags!.every(tag => template.tags.includes(tag))
      );
    }

    // Filter by search term
    if (options.searchTerm) {
      const searchTermLower = options.searchTerm.toLowerCase();
      templates = templates.filter(
        template =>
          template.name.toLowerCase().includes(searchTermLower) ||
          template.description.toLowerCase().includes(searchTermLower) ||
          template.content.toLowerCase().includes(searchTermLower) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    // Filter by minimum rating
    if (options.minRating !== undefined) {
      templates = templates.filter(template => (template.rating || 0) >= options.minRating!);
    }

    // Sort templates
    if (options.sortBy) {
      templates.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        switch (options.sortBy) {
          case 'name':
            valueA = a.name;
            valueB = b.name;
            break;
          case 'createdAt':
            valueA = a.createdAt.getTime();
            valueB = b.createdAt.getTime();
            break;
          case 'updatedAt':
            valueA = a.updatedAt.getTime();
            valueB = b.updatedAt.getTime();
            break;
          case 'usageCount':
            valueA = a.usageCount || 0;
            valueB = b.usageCount || 0;
            break;
          case 'rating':
            valueA = a.rating || 0;
            valueB = b.rating || 0;
            break;
          default:
            valueA = a.name;
            valueB = b.name;
        }

        // Sort direction
        const direction = options.sortDirection === 'desc' ? -1 : 1;

        // Compare values
        if (valueA < valueB) return -1 * direction;
        if (valueA > valueB) return 1 * direction;
        return 0;
      });
    }

    // Apply pagination
    if (options.offset !== undefined) {
      templates = templates.slice(options.offset);
    }

    if (options.limit !== undefined) {
      templates = templates.slice(0, options.limit);
    }

    return templates;
  }

  /**
   * Get all templates
   */
  getAllTemplates(): CodeTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template count
   */
  getTemplateCount(): number {
    return this.templates.size;
  }

  /**
   * Clear all templates
   */
  clearTemplates(): void {
    this.templates.clear();

    // Emit repository cleared event
    this.eventEmitter.emit(TemplateRepositoryEvent.REPOSITORY_CLEARED);
  }

  /**
   * Get repository settings
   */
  getSettings(): TemplateRepositorySettings {
    return { ...this.settings };
  }

  /**
   * Update repository settings
   */
  updateSettings(settings: Partial<TemplateRepositorySettings>): void {
    this.settings = {
      ...this.settings,
      ...settings,
    };
  }

  /**
   * Subscribe to repository events
   */
  on(event: TemplateRepositoryEvent, listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from repository events
   */
  off(event: TemplateRepositoryEvent, listener: (data: any) => void): void {
    this.eventEmitter.off(event, listener);
  }
}
