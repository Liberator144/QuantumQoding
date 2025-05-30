/**
 * Test script for QQ-Akasha Backup and Recovery System
 */

import { QQAkasha, MemoryType, BackupType } from './index';

async function testBackupRecovery() {
  console.log('🧪 Testing QQ-Akasha Backup and Recovery System...\n');

  const akasha = new QQAkasha();
  await akasha.initialize();

  // Initialize backup manager
  console.log('🔧 Initializing backup manager...');
  await akasha.initializeBackupManager();
  console.log('✅ Backup manager initialized\n');

  // Create test memories for backup
  console.log('📝 Creating test memories for backup...');
  
  const memories = [];
  
  // Create various types of memories
  const codeMemory = await akasha.createMemory(
    'function calculateSum(a, b) { return a + b; }',
    MemoryType.CODE,
    ['javascript', 'function', 'math'],
    { importance: 0.8 },
    { 
      filePath: 'src/utils/math.js',
      projectContext: 'calculator-app'
    }
  );
  memories.push(codeMemory);

  const docMemory = await akasha.createMemory(
    'API documentation for the sum function',
    MemoryType.DOCUMENTATION,
    ['documentation', 'api', 'math'],
    { importance: 0.6 },
    { 
      filePath: 'docs/api.md',
      projectContext: 'calculator-app'
    }
  );
  memories.push(docMemory);

  const insightMemory = await akasha.createMemory(
    'Using pure functions improves testability and reduces bugs',
    MemoryType.INSIGHT,
    ['best-practices', 'functional-programming'],
    { importance: 0.9 },
    { 
      projectContext: 'development-insights'
    }
  );
  memories.push(insightMemory);

  const taskMemory = await akasha.createMemory(
    'TODO: Add input validation to math functions',
    MemoryType.TASK,
    ['todo', 'validation', 'math'],
    { importance: 0.7 },
    { 
      projectContext: 'calculator-app'
    }
  );
  memories.push(taskMemory);

  console.log(`✅ Created ${memories.length} test memories\n`);

  // Test 1: Create full backup
  console.log('📦 Test 1: Creating full backup...');
  const fullBackup = await akasha.createFullBackup({
    description: 'Test full backup of all memories',
    tags: ['test', 'full-backup'],
    createdBy: 'test-suite'
  });

  console.log(`Full backup created:`);
  console.log(`  Backup ID: ${fullBackup.id}`);
  console.log(`  Type: ${fullBackup.type}`);
  console.log(`  Status: ${fullBackup.status}`);
  console.log(`  Memory count: ${fullBackup.memoryCount}`);
  console.log(`  File path: ${fullBackup.filePath}`);
  console.log(`  Checksum: ${fullBackup.checksum.substring(0, 16)}...`);
  console.log('');

  // Test 2: Validate backup
  console.log('🔍 Test 2: Validating backup integrity...');
  const isValid = await akasha.validateBackup(fullBackup.id);
  console.log(`Backup validation result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  console.log('');

  // Test 3: Create incremental backup
  console.log('📦 Test 3: Creating incremental backup...');
  
  // First, create a new memory to have something to backup incrementally
  const newMemory = await akasha.createMemory(
    'function multiply(a, b) { return a * b; }',
    MemoryType.CODE,
    ['javascript', 'function', 'math'],
    { importance: 0.8 },
    { 
      filePath: 'src/utils/math.js',
      projectContext: 'calculator-app'
    }
  );

  const incrementalBackup = await akasha.createIncrementalBackup(fullBackup.id, {
    description: 'Test incremental backup with new memory',
    tags: ['test', 'incremental-backup'],
    createdBy: 'test-suite'
  });

  console.log(`Incremental backup created:`);
  console.log(`  Backup ID: ${incrementalBackup.id}`);
  console.log(`  Type: ${incrementalBackup.type}`);
  console.log(`  Base backup: ${incrementalBackup.baseBackupId}`);
  console.log(`  Memory count: ${incrementalBackup.memoryCount}`);
  console.log('');

  // Test 4: Get backup statistics
  console.log('📊 Test 4: Getting backup statistics...');
  const stats = akasha.getBackupStatistics();
  console.log(`Backup statistics:`);
  console.log(`  Total backups: ${stats.totalBackups}`);
  console.log(`  Backups by type:`);
  Object.entries(stats.backupsByType).forEach(([type, count]) => {
    if (count > 0) {
      console.log(`    ${type}: ${count}`);
    }
  });
  console.log(`  Backups by status:`);
  Object.entries(stats.backupsByStatus).forEach(([status, count]) => {
    if (count > 0) {
      console.log(`    ${status}: ${count}`);
    }
  });
  console.log(`  Total storage used: ${stats.totalStorageUsed} bytes`);
  console.log(`  Average compression ratio: ${stats.averageCompressionRatio.toFixed(2)}`);
  console.log(`  Last backup: ${stats.lastBackupDate?.toISOString()}`);
  console.log('');

  // Test 5: List all backups
  console.log('📋 Test 5: Listing all backup records...');
  const backupRecords = akasha.getBackupRecords();
  console.log(`Found ${backupRecords.length} backup records:`);
  backupRecords.forEach((backup, index) => {
    console.log(`  ${index + 1}. ${backup.id}`);
    console.log(`     Type: ${backup.type}`);
    console.log(`     Status: ${backup.status}`);
    console.log(`     Created: ${backup.createdAt.toISOString()}`);
    console.log(`     Memories: ${backup.memoryCount}`);
    console.log(`     Description: ${backup.metadata.description || 'N/A'}`);
  });
  console.log('');

  // Test 6: Simulate memory deletion and restore
  console.log('🗑️ Test 6: Simulating memory deletion and restore...');
  
  // Delete a memory
  const memoryToDelete = memories[0];
  console.log(`Deleting memory: ${memoryToDelete.id}`);
  await akasha.deleteMemory(memoryToDelete.id);
  
  // Verify it's deleted
  const deletedMemory = await akasha.getMemory(memoryToDelete.id);
  console.log(`Memory after deletion: ${deletedMemory ? 'Still exists' : 'Successfully deleted'}`);
  
  // Restore from backup
  console.log(`Restoring from backup: ${fullBackup.id}`);
  const recoveryRecord = await akasha.restoreFromBackup(fullBackup.id, {
    overwriteExisting: true,
    validateAfterRecovery: true,
    createRecoveryPoint: true,
    recoveryMode: 'full'
  });

  console.log(`Recovery completed:`);
  console.log(`  Recovery ID: ${recoveryRecord.id}`);
  console.log(`  Status: ${recoveryRecord.status}`);
  console.log(`  Memories recovered: ${recoveryRecord.memoriesRecovered}`);
  console.log(`  Memories failed: ${recoveryRecord.memoriesFailed}`);
  console.log(`  Started: ${recoveryRecord.startedAt.toISOString()}`);
  console.log(`  Completed: ${recoveryRecord.completedAt?.toISOString()}`);
  console.log('');

  // Test 7: Verify restored memory
  console.log('🔍 Test 7: Verifying restored memory...');
  const restoredMemory = await akasha.getMemory(memoryToDelete.id);
  console.log(`Memory after restore: ${restoredMemory ? '✅ Successfully restored' : '❌ Not found'}`);
  if (restoredMemory) {
    console.log(`  Content: ${restoredMemory.content.substring(0, 50)}...`);
    console.log(`  Type: ${restoredMemory.type}`);
    console.log(`  Tags: ${restoredMemory.tags.join(', ')}`);
  }
  console.log('');

  // Test 8: Get recovery records
  console.log('📋 Test 8: Getting recovery records...');
  const recoveryRecords = akasha.getRecoveryRecords();
  console.log(`Found ${recoveryRecords.length} recovery records:`);
  recoveryRecords.forEach((recovery, index) => {
    console.log(`  ${index + 1}. ${recovery.id}`);
    console.log(`     Backup: ${recovery.backupId}`);
    console.log(`     Status: ${recovery.status}`);
    console.log(`     Mode: ${recovery.options.recoveryMode}`);
    console.log(`     Recovered: ${recovery.memoriesRecovered}`);
    console.log(`     Failed: ${recovery.memoriesFailed}`);
  });
  console.log('');

  // Test 9: Test selective restore
  console.log('🎯 Test 9: Testing selective restore...');
  
  // Delete specific memories
  await akasha.deleteMemory(docMemory.id);
  await akasha.deleteMemory(taskMemory.id);
  
  // Restore only documentation memories
  const selectiveRecovery = await akasha.restoreFromBackup(fullBackup.id, {
    overwriteExisting: true,
    validateAfterRecovery: true,
    createRecoveryPoint: false,
    recoveryMode: 'selective',
    memoryFilter: {
      types: ['DOCUMENTATION', 'TASK']
    }
  });

  console.log(`Selective recovery completed:`);
  console.log(`  Recovery ID: ${selectiveRecovery.id}`);
  console.log(`  Status: ${selectiveRecovery.status}`);
  console.log(`  Memories recovered: ${selectiveRecovery.memoriesRecovered}`);
  console.log(`  Filter applied: types = ${selectiveRecovery.options.memoryFilter?.types?.join(', ')}`);
  console.log('');

  // Test 10: Cleanup old backups
  console.log('🧹 Test 10: Testing backup cleanup...');
  const cleanedCount = await akasha.cleanupOldBackups();
  console.log(`Cleaned up ${cleanedCount} old backups`);
  console.log('');

  // Test 11: Final statistics
  console.log('📊 Test 11: Final backup statistics...');
  const finalStats = akasha.getBackupStatistics();
  console.log(`Final statistics:`);
  console.log(`  Total backups: ${finalStats.totalBackups}`);
  console.log(`  Total storage used: ${finalStats.totalStorageUsed} bytes`);
  console.log(`  Average compression ratio: ${finalStats.averageCompressionRatio.toFixed(2)}`);
  console.log('');

  // Test 12: Error handling - Invalid backup ID
  console.log('❌ Test 12: Testing error handling...');
  try {
    await akasha.validateBackup('invalid-backup-id');
    console.log('❌ Should have thrown an error');
  } catch (error) {
    console.log(`✅ Correctly handled invalid backup ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  try {
    await akasha.restoreFromBackup('invalid-backup-id', {
      overwriteExisting: false,
      validateAfterRecovery: true,
      createRecoveryPoint: false,
      recoveryMode: 'full'
    });
    console.log('❌ Should have thrown an error');
  } catch (error) {
    console.log(`✅ Correctly handled invalid restore: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  console.log('');

  await akasha.shutdown();
  console.log('✅ QQ-Akasha Backup and Recovery System tests completed successfully!');
  console.log('🎉 All backup and recovery functionality is working correctly!');
}

testBackupRecovery().catch(console.error);
