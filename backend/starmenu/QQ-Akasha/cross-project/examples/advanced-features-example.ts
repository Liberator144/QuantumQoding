/**
 * Example usage of Advanced Cross-Project Knowledge Transfer Features
 * Demonstrates AI-Powered Knowledge Synthesis and Knowledge Graph Visualization
 */

import {
  createKnowledgeTransferSystem,
  KnowledgeType,
  GraphMergeStrategy,
  SynthesisOperationType,
  LayoutAlgorithm,
  ExportFormat,
} from '../index';

/**
 * Run the example
 */
async function runExample() {
  console.log('Advanced Cross-Project Knowledge Transfer Example');
  console.log('------------------------------------------------');

  // Create the knowledge transfer system
  const system = createKnowledgeTransferSystem();

  // Add some projects
  console.log('\n1. Setting up projects...');

  system.projectManager.addProject({
    id: 'project-a',
    name: 'Project A',
    description: 'A web application project',
    rootPath: '/path/to/project-a',
    primaryLanguage: 'typescript',
    languages: ['typescript', 'javascript', 'html', 'css'],
    frameworks: ['react', 'express'],
    dependencies: {
      react: '^17.0.2',
      express: '^4.17.1',
      typescript: '^4.5.4',
    },
    tags: ['web', 'frontend', 'backend'],
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {},
  });

  system.projectManager.addProject({
    id: 'project-b',
    name: 'Project B',
    description: 'A mobile application project',
    rootPath: '/path/to/project-b',
    primaryLanguage: 'typescript',
    languages: ['typescript', 'javascript'],
    frameworks: ['react-native'],
    dependencies: {
      'react-native': '^0.66.4',
      typescript: '^4.5.4',
    },
    tags: ['mobile', 'frontend'],
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {},
  });

  console.log(
    `Added projects: ${system.projectManager
      .getAllProjects()
      .map(p => p.name)
      .join(', ')}`
  );

  // Create some knowledge in Project A
  console.log('\n2. Creating knowledge in Project A...');

  const errorHandlingPattern = await system.transferManager.createKnowledge(
    KnowledgeType.CODE_PATTERN,
    'Error Handling Pattern',
    'A reusable pattern for handling errors in async operations',
    `
async function safeOperation<T>(operation: () => Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    console.error('Operation failed:', error);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

// Usage example
async function fetchData(url: string) {
  const [data, error] = await safeOperation(() => fetch(url).then(res => res.json()));
  
  if (error) {
    // Handle error
    return null;
  }
  
  return data;
}
    `,
    'project-a',
    ['error-handling', 'async', 'utility'],
    {
      language: 'typescript',
      compatibility: {
        languages: ['typescript', 'javascript'],
        frameworks: ['react', 'react-native', 'express'],
        environments: ['web', 'mobile', 'server'],
      },
    }
  );

  // Create some knowledge in Project B
  console.log('\n3. Creating knowledge in Project B...');

  const performancePattern = await system.transferManager.createKnowledge(
    KnowledgeType.CODE_PATTERN,
    'Performance Optimization Pattern',
    'A pattern for optimizing performance in async operations with caching',
    `
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function cachedOperation<T>(key: string, operation: () => Promise<T>): Promise<T> {
  // Check cache
  const cached = cache.get(key);
  const now = Date.now();
  
  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log('Cache hit for', key);
    return cached.data;
  }
  
  // Perform operation
  const result = await operation();
  
  // Update cache
  cache.set(key, { data: result, timestamp: now });
  
  return result;
}

// Usage example
async function fetchData(url: string) {
  return cachedOperation(url, () => fetch(url).then(res => res.json()));
}
    `,
    'project-b',
    ['performance', 'caching', 'async', 'utility'],
    {
      language: 'typescript',
      compatibility: {
        languages: ['typescript', 'javascript'],
        frameworks: ['react-native'],
        environments: ['mobile'],
      },
    }
  );

  console.log(
    `Created knowledge entities: ${[errorHandlingPattern, performancePattern].map(k => k.title).join(', ')}`
  );

  // Part 1: AI-Powered Knowledge Synthesis
  console.log('\n4. Performing AI-Powered Knowledge Synthesis...');

  // Synthesize a new pattern that combines error handling and performance optimization
  const synthesisResult = await system.synthesisMgr.synthesize({
    primaryKnowledge: errorHandlingPattern,
    additionalKnowledge: [performancePattern],
    targetProjectId: 'project-a',
    operationType: SynthesisOperationType.PATTERN_COMBINATION,
  });

  console.log(`Synthesized new knowledge: "${synthesisResult.synthesizedKnowledge.title}"`);
  console.log(`Confidence: ${synthesisResult.confidence.toFixed(2)}`);
  console.log(`Explanation: ${synthesisResult.explanation}`);
  console.log('Notes:');
  synthesisResult.notes.forEach(note => console.log(`- ${note}`));
  console.log('Suggestions:');
  synthesisResult.suggestions.forEach(suggestion => console.log(`- ${suggestion}`));

  // Part 2: Knowledge Graph Visualization
  console.log('\n5. Building and visualizing knowledge graph...');

  // Build graph for all projects
  const graph = await system.graphBuilder.buildGraph({}, { name: 'Combined Knowledge Graph' });

  // Analyze the graph
  const analysisResult = await system.graphAnalyzer.analyzeGraph(graph);

  console.log('Graph analysis insights:');
  for (const insight of analysisResult.insights) {
    console.log(`- ${insight}`);
  }

  // Visualize the graph
  const visGraph = await system.visualizationMgr.loadGraph(graph);

  console.log(
    `Visualization created with ${visGraph.nodes.length} nodes and ${visGraph.edges.length} edges`
  );

  // Change layout
  system.visualizationMgr.changeLayout(LayoutAlgorithm.HIERARCHICAL);
  console.log('Changed visualization layout to hierarchical');

  // Apply filter to show only code patterns
  system.visualizationMgr.applyFilter({
    knowledgeTypes: [KnowledgeType.CODE_PATTERN],
    minRelationshipStrength: 0.5,
  });
  console.log('Applied filter to show only code patterns');

  // Export visualization
  const exportResult = await system.visualizationMgr.exportVisualization(ExportFormat.JSON);
  console.log('Exported visualization to JSON format');

  // Find synthesis opportunities
  console.log('\n6. Finding synthesis opportunities...');

  const opportunities = await system.synthesisMgr.findOpportunities('project-a');

  console.log(`Found ${opportunities.length} synthesis opportunities:`);
  for (const opportunity of opportunities) {
    console.log(`- ${opportunity.description} (Value: ${opportunity.estimatedValue.toFixed(2)})`);
    console.log(`  Suggested operation: ${opportunity.suggestedOperation}`);
    console.log(`  Potential benefit: ${opportunity.potentialBenefit}`);
  }

  console.log('\nExample completed successfully!');
}

// Run the example
runExample().catch(error => {
  console.error('Error running example:', error);
});
