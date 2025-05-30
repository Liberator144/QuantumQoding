/**
 * Test script for Memory Deletion Workflow functionality
 */

import { QQAkasha, MemoryType, DeletionType } from './index';

async function testDeletionWorkflow() {
  console.log('🧪 Testing QQ-Akasha Memory Deletion Workflow...\n');

  const akasha = new QQAkasha();
  await akasha.initialize();

  // Create test memories with relationships
  console.log('📝 Creating test memories with relationships...');
  
  const memory1 = await akasha.createMemory(
    'Critical authentication function with JWT validation',
    MemoryType.CODE,
    ['authentication', 'security', 'jwt'],
    { importance: 0.9 },
    { 
      filePath: 'src/auth/jwt-validator.ts',
      projectContext: 'security-system'
    }
  );

  const memory2 = await akasha.createMemory(
    'User login endpoint that uses JWT authentication',
    MemoryType.DOCUMENTATION,
    ['api', 'authentication', 'endpoint'],
    { importance: 0.7 },
    { 
      filePath: 'src/api/auth.ts',
      projectContext: 'security-system'
    }
  );

  const memory3 = await akasha.createMemory(
    'Test cases for authentication system',
    MemoryType.DOCUMENTATION,
    ['testing', 'authentication'],
    { importance: 0.5 },
    { 
      filePath: 'tests/auth.test.ts',
      projectContext: 'security-system'
    }
  );

  const memory4 = await akasha.createMemory(
    'Temporary debug log for testing',
    MemoryType.DOCUMENTATION,
    ['debug', 'temporary'],
    { importance: 0.1 },
    { 
      filePath: 'debug.log',
      projectContext: 'security-system'
    }
  );

  // Create relationships
  await akasha.updateMemory(memory1.id, {
    relatedMemories: [memory2.id, memory3.id]
  });

  await akasha.updateMemory(memory2.id, {
    relatedMemories: [memory1.id]
  });

  console.log(`✅ Created ${4} test memories with relationships\n`);

  // Test 1: Validate deletion of critical memory (should warn)
  console.log('🔍 Test 1: Validating deletion of critical memory');
  const validation1 = await akasha.validateDeletion(memory1.id, DeletionType.SOFT);
  
  console.log(`Deletion allowed: ${validation1.allowed}`);
  console.log(`Reason: ${validation1.reason || 'N/A'}`);
  console.log(`Warnings: ${validation1.warnings.join(', ')}`);
  console.log(`Affected memories: ${validation1.affectedMemories.length}`);
  console.log(`Suggestions: ${validation1.suggestions.join(', ')}`);
  console.log('');

  // Test 2: Validate deletion of low-importance memory (should pass)
  console.log('🔍 Test 2: Validating deletion of low-importance memory');
  const validation2 = await akasha.validateDeletion(memory4.id, DeletionType.SOFT);
  
  console.log(`Deletion allowed: ${validation2.allowed}`);
  console.log(`Warnings: ${validation2.warnings.join(', ') || 'None'}`);
  console.log(`Affected memories: ${validation2.affectedMemories.length}`);
  console.log('');

  // Test 3: Soft delete a memory
  console.log('🗑️ Test 3: Performing soft deletion');
  const deletionRecord1 = await akasha.deleteMemoryEnhanced(memory4.id, DeletionType.SOFT, {
    reason: 'Temporary file no longer needed',
    deletedBy: 'test-user'
  });

  console.log(`Deletion operation ID: ${deletionRecord1.operationId}`);
  console.log(`Deletion type: ${deletionRecord1.deletionType}`);
  console.log(`Recoverable: ${deletionRecord1.recoverable}`);
  console.log(`Recovery deadline: ${deletionRecord1.recoveryDeadline?.toISOString()}`);
  console.log('');

  // Test 4: Verify memory is marked as deleted but still exists
  console.log('🔍 Test 4: Verifying soft-deleted memory state');
  const deletedMemories = await akasha.getDeletedMemories();
  console.log(`Found ${deletedMemories.length} deleted memories`);
  
  const memory4AfterDeletion = await akasha.getMemory(memory4.id);
  if (memory4AfterDeletion) {
    console.log(`Memory still exists with deleted flag: ${memory4AfterDeletion.metadata?.deleted}`);
  }
  console.log('');

  // Test 5: Get recoverable deletions
  console.log('🔍 Test 5: Getting recoverable deletions');
  const recoverableDeletions = akasha.getRecoverableDeletions();
  console.log(`Found ${recoverableDeletions.length} recoverable deletions`);
  
  recoverableDeletions.forEach((record, index) => {
    console.log(`  ${index + 1}. Operation ${record.operationId}`);
    console.log(`     Memory: ${record.memoryId}`);
    console.log(`     Deleted by: ${record.deletedBy}`);
    console.log(`     Reason: ${record.reason || 'No reason provided'}`);
  });
  console.log('');

  // Test 6: Recover the deleted memory
  console.log('♻️ Test 6: Recovering soft-deleted memory');
  const recoveredMemory = await akasha.recoverMemory(deletionRecord1.operationId);
  console.log(`Recovered memory ID: ${recoveredMemory.id}`);
  console.log(`Memory content: ${recoveredMemory.content.substring(0, 50)}...`);
  console.log('');

  // Test 7: Force delete critical memory
  console.log('🔍 Test 7: Force deleting critical memory');
  try {
    const deletionRecord2 = await akasha.deleteMemoryEnhanced(memory1.id, DeletionType.SOFT, {
      force: true,
      reason: 'System cleanup - forced deletion',
      deletedBy: 'admin-user'
    });
    
    console.log(`Force deletion successful: ${deletionRecord2.operationId}`);
    console.log(`Affected memories: ${deletionRecord2.affectedMemories.length}`);
  } catch (error) {
    console.log(`Force deletion failed: ${error.message}`);
  }
  console.log('');

  // Test 8: Test cascade deletion
  console.log('🔍 Test 8: Testing cascade deletion');
  const validation3 = await akasha.validateDeletion(memory2.id, DeletionType.CASCADE);
  console.log(`Cascade deletion validation:`);
  console.log(`  Allowed: ${validation3.allowed}`);
  console.log(`  Warnings: ${validation3.warnings.join(', ')}`);
  console.log(`  Affected memories: ${validation3.affectedMemories.length}`);
  console.log('');

  // Test 9: Get deletion history
  console.log('📊 Test 9: Getting deletion history');
  const history1 = akasha.getDeletionHistory(memory4.id);
  const history2 = akasha.getDeletionHistory(memory1.id);
  
  console.log(`Memory ${memory4.id} deletion history: ${history1.length} records`);
  console.log(`Memory ${memory1.id} deletion history: ${history2.length} records`);
  
  history1.forEach((record, index) => {
    console.log(`  ${index + 1}. ${record.deletionType} deletion at ${record.deletedAt.toISOString()}`);
    console.log(`     By: ${record.deletedBy}, Reason: ${record.reason || 'N/A'}`);
  });
  console.log('');

  // Test 10: Hard delete with backup
  console.log('🔍 Test 10: Testing hard deletion with backup');
  const deletionRecord3 = await akasha.deleteMemoryEnhanced(memory3.id, DeletionType.HARD, {
    reason: 'Permanent cleanup',
    deletedBy: 'system'
  });
  
  console.log(`Hard deletion completed: ${deletionRecord3.operationId}`);
  console.log(`Recoverable: ${deletionRecord3.recoverable}`);
  console.log(`Backup created: ${deletionRecord3.memoryBackup ? 'Yes' : 'No'}`);
  console.log('');

  // Test 11: Verify hard-deleted memory is gone
  console.log('🔍 Test 11: Verifying hard-deleted memory is gone');
  const memory3AfterHardDelete = await akasha.getMemory(memory3.id);
  console.log(`Memory ${memory3.id} exists after hard delete: ${memory3AfterHardDelete ? 'Yes' : 'No'}`);
  console.log('');

  // Test 12: Test orphan cleanup
  console.log('🧹 Test 12: Testing orphan reference cleanup');
  const memory2AfterCleanup = await akasha.getMemory(memory2.id);
  if (memory2AfterCleanup) {
    console.log(`Memory ${memory2.id} related memories before cleanup: ${memory2AfterCleanup.relatedMemories?.length || 0}`);
    
    // The deletion manager should have automatically cleaned up orphaned references
    const hasOrphanedRef = memory2AfterCleanup.relatedMemories?.includes(memory3.id);
    console.log(`Still has reference to deleted memory: ${hasOrphanedRef ? 'Yes' : 'No'}`);
  }
  console.log('');

  await akasha.shutdown();
  console.log('✅ Memory Deletion Workflow tests completed successfully!');
}

testDeletionWorkflow().catch(console.error);
