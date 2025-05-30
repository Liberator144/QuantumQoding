/**
 * Test script for Memory Archival Workflow functionality
 */

import { QQAkasha, MemoryType, ArchiveTier, ArchivalTrigger } from './index';

async function testArchivalWorkflow() {
  console.log('🧪 Testing QQ-Akasha Memory Archival Workflow...\n');

  const akasha = new QQAkasha();
  await akasha.initialize();

  // Create test memories with different characteristics
  console.log('📝 Creating test memories with different characteristics...');
  
  // Old, low-importance memory (should be archived by policy)
  const oldMemory = await akasha.createMemory(
    'Old debug log from last year',
    MemoryType.DOCUMENTATION,
    ['debug', 'old', 'temporary'],
    { importance: 0.2 },
    { 
      filePath: 'logs/debug-2023.log',
      projectContext: 'legacy-project'
    }
  );

  // Simulate old creation date
  await akasha.updateMemory(oldMemory.id, {
    createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000), // 400 days ago
    lastAccessedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // 200 days ago
    accessCount: 2
  });

  // High-importance, recent memory (should NOT be archived)
  const importantMemory = await akasha.createMemory(
    'Critical authentication algorithm implementation',
    MemoryType.CODE,
    ['authentication', 'security', 'critical'],
    { importance: 0.9 },
    { 
      filePath: 'src/auth/core.ts',
      projectContext: 'security-system'
    }
  );

  // Temporary test file (should be archived quickly)
  const tempMemory = await akasha.createMemory(
    'Temporary test data for unit tests',
    MemoryType.DOCUMENTATION,
    ['temporary', 'test', 'debug'],
    { importance: 0.1 },
    { 
      filePath: 'temp/test-data.json',
      projectContext: 'testing'
    }
  );

  // Simulate old creation for temp file
  await akasha.updateMemory(tempMemory.id, {
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
    lastAccessedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    accessCount: 1
  });

  // Inactive memory (not accessed for long time)
  const inactiveMemory = await akasha.createMemory(
    'Documentation for deprecated feature',
    MemoryType.DOCUMENTATION,
    ['documentation', 'deprecated'],
    { importance: 0.5 },
    { 
      filePath: 'docs/deprecated-feature.md',
      projectContext: 'legacy-features'
    }
  );

  // Simulate long inactivity
  await akasha.updateMemory(inactiveMemory.id, {
    lastAccessedAt: new Date(Date.now() - 190 * 24 * 60 * 60 * 1000), // 190 days ago
    accessCount: 5
  });

  console.log(`✅ Created ${4} test memories with different characteristics\n`);

  // Test 1: View current archival policies
  console.log('📋 Test 1: Viewing current archival policies');
  const policies = akasha.getArchivalPolicies();
  console.log(`Found ${policies.length} archival policies:`);
  policies.forEach((policy, index) => {
    console.log(`  ${index + 1}. ${policy.name} (${policy.enabled ? 'enabled' : 'disabled'})`);
    console.log(`     Description: ${policy.description}`);
    console.log(`     Target tier: ${policy.targetTier}`);
    console.log(`     Priority: ${policy.priority}`);
  });
  console.log('');

  // Test 2: Manual archival
  console.log('📦 Test 2: Manual archival of temporary memory');
  const manualArchiveRecord = await akasha.archiveMemory(tempMemory.id, ArchiveTier.HOT, {
    reason: 'Manual archival of temporary test data',
    archivedBy: 'test-user'
  });

  console.log(`Manual archival completed:`);
  console.log(`  Operation ID: ${manualArchiveRecord.operationId}`);
  console.log(`  Archive tier: ${manualArchiveRecord.tier}`);
  console.log(`  Trigger: ${manualArchiveRecord.trigger}`);
  console.log(`  Reason: ${manualArchiveRecord.reason}`);
  console.log(`  Restorable: ${manualArchiveRecord.restorable}`);
  console.log('');

  // Test 3: Verify memory is marked as archived
  console.log('🔍 Test 3: Verifying archived memory state');
  const archivedMemories = await akasha.getArchivedMemories();
  console.log(`Found ${archivedMemories.length} archived memories`);
  
  const tempMemoryAfterArchival = await akasha.getMemory(tempMemory.id);
  if (tempMemoryAfterArchival) {
    console.log(`Memory ${tempMemory.id} archived flag: ${tempMemoryAfterArchival.metadata?.archived}`);
    console.log(`Archive tier: ${tempMemoryAfterArchival.metadata?.archiveTier}`);
  }
  console.log('');

  // Test 4: Run archival policies
  console.log('🤖 Test 4: Running automatic archival policies');
  const policyArchiveRecords = await akasha.runArchivalPolicies();
  console.log(`Archival policies processed ${policyArchiveRecords.length} memories:`);
  
  policyArchiveRecords.forEach((record, index) => {
    console.log(`  ${index + 1}. Memory ${record.memoryId}`);
    console.log(`     Policy: ${record.policyName}`);
    console.log(`     Tier: ${record.tier}`);
    console.log(`     Trigger: ${record.trigger}`);
    console.log(`     Reason: ${record.reason}`);
  });
  console.log('');

  // Test 5: Search archived memories
  console.log('🔍 Test 5: Searching archived memories');
  
  // Search by tag
  const tagSearchResult = await akasha.searchArchives({
    tags: ['temporary'],
    limit: 10
  });
  console.log(`Search by 'temporary' tag found ${tagSearchResult.archives.length} archives`);
  console.log(`Search time: ${tagSearchResult.searchMetadata.searchTime}ms`);
  console.log(`Tiers searched: ${tagSearchResult.searchMetadata.tiersSearched.join(', ')}`);
  
  // Search by tier
  const tierSearchResult = await akasha.searchArchives({
    tier: ArchiveTier.HOT,
    limit: 10
  });
  console.log(`Search in HOT tier found ${tierSearchResult.archives.length} archives`);
  
  // Search by project
  const projectSearchResult = await akasha.searchArchives({
    projectContext: 'legacy-project',
    limit: 10
  });
  console.log(`Search in 'legacy-project' found ${projectSearchResult.archives.length} archives`);
  console.log('');

  // Test 6: Get archive statistics
  console.log('📊 Test 6: Archive statistics');
  const stats = akasha.getArchiveStatistics();
  console.log(`Total archives: ${stats.totalArchives}`);
  console.log(`Archives by tier:`);
  Object.entries(stats.archivesByTier).forEach(([tier, count]) => {
    if (count > 0) {
      console.log(`  ${tier}: ${count}`);
    }
  });
  console.log(`Archives by trigger:`);
  Object.entries(stats.archivesByTrigger).forEach(([trigger, count]) => {
    if (count > 0) {
      console.log(`  ${trigger}: ${count}`);
    }
  });
  console.log(`Average compression ratio: ${stats.averageCompressionRatio.toFixed(2)}`);
  console.log('');

  // Test 7: Restore archived memory
  console.log('♻️ Test 7: Restoring archived memory');
  const restoredMemory = await akasha.restoreMemory(manualArchiveRecord.operationId);
  console.log(`Restored memory ID: ${restoredMemory.id}`);
  console.log(`Memory content: ${restoredMemory.content.substring(0, 50)}...`);
  console.log(`Restored flag: ${restoredMemory.metadata?.restoredAt ? 'Yes' : 'No'}`);
  console.log('');

  // Test 8: Test custom archival policy
  console.log('⚙️ Test 8: Adding custom archival policy');
  akasha.setArchivalPolicy({
    name: 'test-project-cleanup',
    description: 'Archive all memories from test projects',
    triggers: {
      archiveProjects: ['testing'],
      maxAge: 7 // 7 days
    },
    targetTier: ArchiveTier.COLD,
    enabled: true,
    priority: 5
  });

  const updatedPolicies = akasha.getArchivalPolicies();
  console.log(`Added custom policy. Total policies: ${updatedPolicies.length}`);
  
  const customPolicy = updatedPolicies.find(p => p.name === 'test-project-cleanup');
  if (customPolicy) {
    console.log(`Custom policy found: ${customPolicy.name}`);
    console.log(`  Target tier: ${customPolicy.targetTier}`);
    console.log(`  Priority: ${customPolicy.priority}`);
  }
  console.log('');

  // Test 9: Get archived memories by tier
  console.log('🗂️ Test 9: Getting archived memories by tier');
  const hotTierMemories = await akasha.getArchivedMemoriesByTier(ArchiveTier.HOT);
  const warmTierMemories = await akasha.getArchivedMemoriesByTier(ArchiveTier.WARM);
  const coldTierMemories = await akasha.getArchivedMemoriesByTier(ArchiveTier.COLD);
  
  console.log(`HOT tier: ${hotTierMemories.length} memories`);
  console.log(`WARM tier: ${warmTierMemories.length} memories`);
  console.log(`COLD tier: ${coldTierMemories.length} memories`);
  console.log('');

  // Test 10: Search with date range
  console.log('📅 Test 10: Searching archives with date range');
  const dateRangeResult = await akasha.searchArchives({
    archivedBetween: {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      end: new Date()
    },
    limit: 10
  });
  console.log(`Archives from last 24 hours: ${dateRangeResult.archives.length}`);
  
  dateRangeResult.archives.forEach((archive, index) => {
    console.log(`  ${index + 1}. ${archive.memoryId} (${archive.trigger})`);
    console.log(`     Archived: ${archive.archivedAt.toISOString()}`);
    console.log(`     Tier: ${archive.tier}`);
  });
  console.log('');

  // Test 11: Remove custom policy
  console.log('🗑️ Test 11: Removing custom archival policy');
  const removed = akasha.removeArchivalPolicy('test-project-cleanup');
  console.log(`Custom policy removed: ${removed}`);
  
  const finalPolicies = akasha.getArchivalPolicies();
  console.log(`Remaining policies: ${finalPolicies.length}`);
  console.log('');

  await akasha.shutdown();
  console.log('✅ Memory Archival Workflow tests completed successfully!');
}

testArchivalWorkflow().catch(console.error);
