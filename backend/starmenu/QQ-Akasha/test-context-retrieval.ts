/**
 * Test script for Context-based Retrieval functionality
 */

import { QQAkasha, MemoryType } from './index';

async function testContextBasedRetrieval() {
  console.log('🧪 Testing QQ-Akasha Context-based Retrieval...\n');

  // Create a new Akasha instance
  const akasha = new QQAkasha();
  await akasha.initialize();

  // Create test memories
  console.log('📝 Creating test memories...');
  
  const memory1 = await akasha.createMemory(
    'function calculateSum(a, b) { return a + b; }',
    MemoryType.CODE,
    ['javascript', 'function', 'math'],
    { importance: 0.8 },
    { 
      filePath: 'src/utils/math.js',
      projectContext: 'calculator-app'
    }
  );

  const memory2 = await akasha.createMemory(
    'function calculateProduct(x, y) { return x * y; }',
    MemoryType.CODE,
    ['javascript', 'function', 'math'],
    { importance: 0.7 },
    { 
      filePath: 'src/utils/math.js',
      projectContext: 'calculator-app'
    }
  );

  const memory3 = await akasha.createMemory(
    'React component for displaying user profile information',
    MemoryType.DOCUMENTATION,
    ['react', 'component', 'ui'],
    { importance: 0.6 },
    { 
      filePath: 'src/components/UserProfile.tsx',
      projectContext: 'user-management'
    }
  );

  const memory4 = await akasha.createMemory(
    'API endpoint for user authentication using JWT tokens',
    MemoryType.DOCUMENTATION,
    ['api', 'authentication', 'jwt'],
    { importance: 0.9 },
    { 
      filePath: 'src/api/auth.ts',
      projectContext: 'user-management'
    }
  );

  console.log(`✅ Created ${4} test memories\n`);

  // Test 1: Basic contextual search
  console.log('🔍 Test 1: Basic contextual search for "math functions"');
  const result1 = await akasha.queryMemoriesEnhanced({
    searchTerm: 'math functions',
    useContextualSearch: true,
    includeRelated: true,
    limit: 10
  });

  console.log(`Found ${result1.memories.length} memories`);
  console.log(`Search time: ${result1.searchMetadata?.searchTime}ms`);
  console.log(`Algorithm: ${result1.searchMetadata?.algorithmUsed}`);
  console.log(`Context factors: ${result1.searchMetadata?.contextFactors.join(', ')}`);
  
  if (result1.enhancedResults) {
    result1.enhancedResults.forEach((memory, index) => {
      console.log(`  ${index + 1}. ${memory.content.substring(0, 50)}...`);
      console.log(`     Relevance: ${(memory.relevanceScore! * 100).toFixed(1)}%`);
      console.log(`     Reason: ${memory.relevanceReason}`);
    });
  }
  console.log('');

  // Test 2: Project context search
  console.log('🔍 Test 2: Project context search for calculator app');
  const result2 = await akasha.queryMemoriesEnhanced({
    searchTerm: 'calculate',
    useContextualSearch: true,
    context: {
      currentProject: 'calculator-app',
      currentFile: 'src/utils/math.js'
    },
    similarityThreshold: 0.3,
    limit: 5
  });

  console.log(`Found ${result2.memories.length} memories with similarity > 30%`);
  if (result2.enhancedResults) {
    result2.enhancedResults.forEach((memory, index) => {
      console.log(`  ${index + 1}. ${memory.content.substring(0, 50)}...`);
      console.log(`     Relevance: ${(memory.relevanceScore! * 100).toFixed(1)}%`);
      console.log(`     Reason: ${memory.relevanceReason}`);
    });
  }
  console.log('');

  // Test 3: Tag-based search with context
  console.log('🔍 Test 3: Tag-based search with context');
  const result3 = await akasha.queryMemoriesEnhanced({
    tags: ['javascript'],
    useContextualSearch: true,
    includeRelated: true,
    maxRelatedDepth: 2,
    limit: 10
  });

  console.log(`Found ${result3.memories.length} memories with JavaScript tag`);
  if (result3.enhancedResults) {
    result3.enhancedResults.forEach((memory, index) => {
      console.log(`  ${index + 1}. ${memory.content.substring(0, 50)}...`);
      console.log(`     Relevance: ${(memory.relevanceScore! * 100).toFixed(1)}%`);
      console.log(`     Related memories: ${memory.relatedResults?.length || 0}`);
    });
  }
  console.log('');

  // Test 4: Compare basic vs contextual search
  console.log('🔍 Test 4: Comparing basic vs contextual search');
  
  const basicResult = await akasha.queryMemories({
    searchTerm: 'function',
    limit: 5
  });

  const contextualResult = await akasha.queryMemoriesEnhanced({
    searchTerm: 'function',
    useContextualSearch: true,
    limit: 5
  });

  console.log(`Basic search found: ${basicResult.length} memories`);
  console.log(`Contextual search found: ${contextualResult.memories.length} memories`);
  console.log(`Contextual search time: ${contextualResult.searchMetadata?.searchTime}ms`);
  console.log('');

  // Test 5: Semantic similarity
  console.log('🔍 Test 5: Semantic similarity test');
  const result5 = await akasha.queryMemoriesEnhanced({
    searchTerm: 'addition operation',
    useContextualSearch: true,
    similarityThreshold: 0.2,
    limit: 5
  });

  console.log(`Found ${result5.memories.length} memories for "addition operation"`);
  if (result5.enhancedResults) {
    result5.enhancedResults.forEach((memory, index) => {
      console.log(`  ${index + 1}. ${memory.content.substring(0, 50)}...`);
      console.log(`     Relevance: ${(memory.relevanceScore! * 100).toFixed(1)}%`);
      console.log(`     Reason: ${memory.relevanceReason}`);
    });
  }
  console.log('');

  await akasha.shutdown();
  console.log('✅ Context-based Retrieval tests completed successfully!');
}

// Run the test
testContextBasedRetrieval().catch(console.error);
