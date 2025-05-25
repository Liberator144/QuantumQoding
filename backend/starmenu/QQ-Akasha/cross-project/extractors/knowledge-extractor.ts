/**
 * Knowledge Extractor for Cross-Project Knowledge Transfer
 * Extracts reusable knowledge from project artifacts
 */

import { Knowledge, KnowledgeType } from '../types';
import { ProjectInfo } from '../project-context';

/**
 * Base interface for knowledge extractors
 */
export interface KnowledgeExtractor {
  /** Extractor ID */
  id: string;

  /** Extractor name */
  name: string;

  /** Knowledge types this extractor can handle */
  supportedTypes: KnowledgeType[];

  /** File extensions this extractor can handle */
  supportedExtensions: string[];

  /** Extract knowledge from content */
  extractKnowledge(
    content: string,
    filePath: string,
    project: ProjectInfo,
    options?: Record<string, any>
  ): Promise<Knowledge[]>;

  /** Check if this extractor can handle a file */
  canHandle(filePath: string, content?: string): boolean;
}

/**
 * Base class for knowledge extractors
 */
export abstract class BaseKnowledgeExtractor implements KnowledgeExtractor {
  id: string;
  name: string;
  supportedTypes: KnowledgeType[];
  supportedExtensions: string[];

  constructor(
    id: string,
    name: string,
    supportedTypes: KnowledgeType[],
    supportedExtensions: string[]
  ) {
    this.id = id;
    this.name = name;
    this.supportedTypes = supportedTypes;
    this.supportedExtensions = supportedExtensions;
  }

  /**
   * Extract knowledge from content
   */
  abstract extractKnowledge(
    content: string,
    filePath: string,
    project: ProjectInfo,
    options?: Record<string, any>
  ): Promise<Knowledge[]>;

  /**
   * Check if this extractor can handle a file
   */
  canHandle(filePath: string, content?: string): boolean {
    const extension = filePath.split('.').pop()?.toLowerCase();
    return extension ? this.supportedExtensions.includes(extension) : false;
  }

  /**
   * Get language from file extension
   */
  protected getLanguageFromExtension(filePath: string): string | undefined {
    const extension = filePath.split('.').pop()?.toLowerCase();

    if (!extension) {
      return undefined;
    }

    // Map common extensions to languages
    const extensionMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      tsx: 'typescript',
      py: 'python',
      rb: 'ruby',
      java: 'java',
      cs: 'csharp',
      go: 'go',
      rs: 'rust',
      php: 'php',
      swift: 'swift',
      kt: 'kotlin',
      c: 'c',
      cpp: 'cpp',
      h: 'c',
      hpp: 'cpp',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      md: 'markdown',
      sql: 'sql',
      sh: 'shell',
      bash: 'shell',
      yml: 'yaml',
      yaml: 'yaml',
      xml: 'xml',
      graphql: 'graphql',
      gql: 'graphql',
    };

    return extensionMap[extension];
  }

  /**
   * Create a basic knowledge entity
   */
  protected createBaseKnowledge(
    type: KnowledgeType,
    title: string,
    description: string,
    content: string,
    filePath: string,
    project: ProjectInfo,
    tags: string[] = []
  ): Omit<
    Knowledge,
    'id' | 'createdAt' | 'updatedAt' | 'accessCount' | 'applicationCount' | 'appliedProjects'
  > {
    return {
      type,
      title,
      description,
      content,
      sourceProject: project.id,
      sourceFilePath: filePath,
      language: this.getLanguageFromExtension(filePath) || project.primaryLanguage,
      tags,
      createdBy: 'system',
      metadata: {},
    };
  }
}
