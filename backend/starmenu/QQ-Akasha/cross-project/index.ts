/**
 * Cross-Project Knowledge Transfer System
 * Enables knowledge sharing and reuse across different projects
 */

// Core types and interfaces
export * from './types';

// Knowledge storage
export * from './knowledge-storage';

// Project context management
export * from './project-context';

// Cross-project search
export * from './cross-project-search';

// Knowledge graph models
export * from './models/knowledge-graph';
export * from './models/knowledge-graph-builder';
export * from './models/knowledge-graph-merger';
export * from './models/knowledge-graph-analyzer';
export * from './models/knowledge-translator';
export * from './models/ide-integration';

// Knowledge extractors
export * from './extractors/knowledge-extractor';
export * from './extractors/code-pattern-extractor';

// Knowledge transfer manager
export * from './knowledge-transfer-manager';

// Knowledge synthesis
export * from './synthesis';

// Knowledge graph visualization
export * from './visualization';

// Predictive knowledge recommendation
export * from './recommendation';

/**
 * Creates a complete cross-project knowledge transfer system
 */
export function createKnowledgeTransferSystem() {
  // Create storage
  const storage = new InMemoryKnowledgeStorage();

  // Create project manager
  const projectManager = new ProjectContextManager();

  // Create knowledge transfer manager
  const transferManager = new KnowledgeTransferManager(storage, projectManager);

  // Create graph builder
  const graphBuilder = new KnowledgeGraphBuilder(storage, projectManager);

  // Create graph merger
  const graphMerger = new KnowledgeGraphMerger(graphBuilder);

  // Create graph analyzer
  const graphAnalyzer = new KnowledgeGraphAnalyzer();

  // Create knowledge translator
  const translator = new KnowledgeTranslator();

  // Create IDE integration
  const ideIntegration = new IDEIntegration(transferManager, projectManager);

  // Create synthesis manager
  const synthesisMgr = new SynthesisManager(storage, projectManager);

  // Create AI service and integrate with synthesis manager
  const aiService = AIFactory.createMockAIService();
  AIFactory.integrateWithSynthesisManager(synthesisMgr, aiService, projectManager);

  // Create visualization manager
  const visualizationMgr = new VisualizationManager(graphBuilder, graphAnalyzer);

  // Create recommendation engine with adaptive scoring and code generation
  const recommendationEngine = new RecommendationEngine(
    storage,
    projectManager,
    { learnFromFeedback: true },
    { enabled: true, learningRate: 0.1 }
  );

  // Initialize template repository
  const templateRepository = recommendationEngine.getTemplateRepository();
  await templateRepository.initialize();

  // Add sample templates
  const { addSampleTemplates } = await import(
    './recommendation/code-generation/templates/sample-templates'
  );
  await addSampleTemplates(templateRepository);

  return {
    storage,
    projectManager,
    transferManager,
    graphBuilder,
    graphMerger,
    graphAnalyzer,
    translator,
    ideIntegration,
    synthesisMgr,
    visualizationMgr,
    recommendationEngine,
  };
}

// Import necessary classes for the factory function
import { InMemoryKnowledgeStorage } from './knowledge-storage';
import { ProjectContextManager } from './project-context';
import { KnowledgeTransferManager } from './knowledge-transfer-manager';
import { KnowledgeGraphBuilder } from './models/knowledge-graph-builder';
import { KnowledgeGraphMerger } from './models/knowledge-graph-merger';
import { KnowledgeGraphAnalyzer } from './models/knowledge-graph-analyzer';
import { KnowledgeTranslator } from './models/knowledge-translator';
import { IDEIntegration } from './models/ide-integration';
import { SynthesisManager } from './synthesis/synthesis-manager';
import { AIFactory } from './synthesis/ai/ai-factory';
import { VisualizationManager } from './visualization/visualization-manager';
import { RecommendationEngine } from './recommendation/recommendation-engine';
