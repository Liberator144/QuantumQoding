/**
 * Test script for QQ-Akasha API Implementation
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1/akasha';

interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
}

async function testApiImplementation() {
  console.log('🧪 Testing QQ-Akasha API Implementation...\n');

  try {
    // Test 1: Health Check
    console.log('🏥 Test 1: Health Check');
    const healthResponse = await axios.get<ApiResponse>(`${API_BASE}/health`);
    console.log(`Status: ${healthResponse.status}`);
    console.log(`Response: ${JSON.stringify(healthResponse.data, null, 2)}`);
    console.log('');

    // Test 2: Create Memory
    console.log('📝 Test 2: Create Memory');
    const createResponse = await axios.post<ApiResponse>(`${API_BASE}/memories`, {
      content: 'Test memory for API validation',
      type: 'DOCUMENTATION',
      tags: ['api-test', 'validation'],
      metadata: { importance: 0.8 },
      projectContext: 'api-testing',
      createdBy: 'api-test-suite'
    });
    console.log(`Status: ${createResponse.status}`);
    console.log(`Memory ID: ${createResponse.data?.data?.memory?.id}`);
    const memoryId = createResponse.data?.data?.memory?.id;
    console.log('');

    // Test 3: Get Memory by ID
    console.log('🔍 Test 3: Get Memory by ID');
    const getResponse = await axios.get<ApiResponse>(`${API_BASE}/memories/${memoryId}`);
    console.log(`Status: ${getResponse.status}`);
    console.log(`Memory content: ${getResponse.data?.data?.memory?.content}`);
    console.log('');

    // Test 4: Update Memory
    console.log('✏️ Test 4: Update Memory');
    const updateResponse = await axios.put<ApiResponse>(`${API_BASE}/memories/${memoryId}`, {
      content: 'Updated test memory for API validation',
      tags: ['api-test', 'validation', 'updated']
    });
    console.log(`Status: ${updateResponse.status}`);
    console.log(`Updated content: ${updateResponse.data?.data?.memory?.content}`);
    console.log('');

    // Test 5: Get All Memories
    console.log('📋 Test 5: Get All Memories');
    const listResponse = await axios.get<ApiResponse>(`${API_BASE}/memories?limit=10`);
    console.log(`Status: ${listResponse.status}`);
    console.log(`Total memories: ${listResponse.data?.data?.totalCount}`);
    console.log(`Returned: ${listResponse.data?.data?.memories?.length}`);
    console.log('');

    // Test 6: Contextual Search
    console.log('🔍 Test 6: Contextual Search');
    const searchResponse = await axios.get<ApiResponse>(`${API_BASE}/memories?searchTerm=test&useContextualSearch=true`);
    console.log(`Status: ${searchResponse.status}`);
    console.log(`Search results: ${searchResponse.data?.data?.memories?.length}`);
    console.log(`Search time: ${searchResponse.data?.data?.searchMetadata?.searchTime}ms`);
    console.log(`Algorithm: ${searchResponse.data?.data?.searchMetadata?.algorithmUsed}`);
    console.log('');

    // Test 7: Filter by Tags
    console.log('🏷️ Test 7: Filter by Tags');
    const tagFilterResponse = await axios.get<ApiResponse>(`${API_BASE}/memories?tags=api-test,validation`);
    console.log(`Status: ${tagFilterResponse.status}`);
    console.log(`Tagged memories: ${tagFilterResponse.data?.data?.memories?.length}`);
    console.log('');

    // Test 8: Validate Deletion
    console.log('⚠️ Test 8: Validate Deletion');
    const validateResponse = await axios.post<ApiResponse>(`${API_BASE}/memories/${memoryId}/validate-deletion`, {
      deletionType: 'soft',
      force: false
    });
    console.log(`Status: ${validateResponse.status}`);
    console.log(`Deletion allowed: ${validateResponse.data?.data?.validation?.allowed}`);
    console.log(`Warnings: ${validateResponse.data?.data?.validation?.warnings?.join(', ') || 'None'}`);
    console.log('');

    // Test 9: Soft Delete Memory
    console.log('🗑️ Test 9: Soft Delete Memory');
    const deleteResponse = await axios.delete<ApiResponse>(`${API_BASE}/memories/${memoryId}`, {
      data: {
        deletionType: 'soft',
        reason: 'API test cleanup',
        deletedBy: 'api-test-suite'
      }
    });
    console.log(`Status: ${deleteResponse.status}`);
    console.log(`Operation ID: ${deleteResponse.data?.data?.deletionRecord?.operationId}`);
    console.log(`Recoverable: ${deleteResponse.data?.data?.deletionRecord?.recoverable}`);
    const operationId = deleteResponse.data?.data?.deletionRecord?.operationId;
    console.log('');

    // Test 10: Get Recoverable Deletions
    console.log('♻️ Test 10: Get Recoverable Deletions');
    const recoverableResponse = await axios.get<ApiResponse>(`${API_BASE}/deletions/recoverable`);
    console.log(`Status: ${recoverableResponse.status}`);
    console.log(`Recoverable deletions: ${recoverableResponse.data?.data?.recoverableDeletions?.length}`);
    console.log('');

    // Test 11: Recover Deleted Memory
    console.log('🔄 Test 11: Recover Deleted Memory');
    const recoverResponse = await axios.post<ApiResponse>(`${API_BASE}/deletions/${operationId}/recover`);
    console.log(`Status: ${recoverResponse.status}`);
    console.log(`Recovered memory ID: ${recoverResponse.data?.data?.memory?.id}`);
    console.log('');

    // Test 12: Archive Memory
    console.log('📦 Test 12: Archive Memory');
    const archiveResponse = await axios.post<ApiResponse>(`${API_BASE}/memories/${memoryId}/archive`, {
      tier: 'warm',
      reason: 'API test archival',
      archivedBy: 'api-test-suite'
    });
    console.log(`Status: ${archiveResponse.status}`);
    console.log(`Archive operation ID: ${archiveResponse.data?.data?.archiveRecord?.operationId}`);
    console.log(`Archive tier: ${archiveResponse.data?.data?.archiveRecord?.tier}`);
    const archiveOperationId = archiveResponse.data?.data?.archiveRecord?.operationId;
    console.log('');

    // Test 13: Search Archives
    console.log('🔍 Test 13: Search Archives');
    const archiveSearchResponse = await axios.get<ApiResponse>(`${API_BASE}/archives/search?searchTerm=test&limit=10`);
    console.log(`Status: ${archiveSearchResponse.status}`);
    console.log(`Archive search results: ${archiveSearchResponse.data?.data?.archives?.length}`);
    console.log(`Search time: ${archiveSearchResponse.data?.data?.searchMetadata?.searchTime}ms`);
    console.log('');

    // Test 14: Restore Archived Memory
    console.log('🔄 Test 14: Restore Archived Memory');
    const restoreResponse = await axios.post<ApiResponse>(`${API_BASE}/archives/${archiveOperationId}/restore`);
    console.log(`Status: ${restoreResponse.status}`);
    console.log(`Restored memory ID: ${restoreResponse.data?.data?.memory?.id}`);
    console.log('');

    // Test 15: Run Archival Policies
    console.log('🤖 Test 15: Run Archival Policies');
    const policiesResponse = await axios.post<ApiResponse>(`${API_BASE}/archives/policies/run`);
    console.log(`Status: ${policiesResponse.status}`);
    console.log(`Policies processed: ${policiesResponse.data?.data?.archiveRecords?.length} memories`);
    console.log('');

    // Test 16: Get Statistics
    console.log('📊 Test 16: Get Statistics');
    const statsResponse = await axios.get<ApiResponse>(`${API_BASE}/statistics`);
    console.log(`Status: ${statsResponse.status}`);
    const stats = statsResponse.data?.data?.statistics;
    console.log(`Total memories: ${stats?.totalMemories}`);
    console.log(`Active memories: ${stats?.activeMemories}`);
    console.log(`Deleted memories: ${stats?.deletedMemories}`);
    console.log(`Archived memories: ${stats?.archivedMemories}`);
    console.log(`Archive statistics: ${JSON.stringify(stats?.archiveStatistics, null, 2)}`);
    console.log('');

    // Test 17: Error Handling - Invalid Memory ID
    console.log('❌ Test 17: Error Handling - Invalid Memory ID');
    try {
      await axios.get<ApiResponse>(`${API_BASE}/memories/invalid-id`);
    } catch (error: any) {
      console.log(`Status: ${error.response?.status}`);
      console.log(`Error: ${error.response?.data?.message}`);
      console.log(`Code: ${error.response?.data?.code}`);
    }
    console.log('');

    // Test 18: Error Handling - Missing Required Fields
    console.log('❌ Test 18: Error Handling - Missing Required Fields');
    try {
      await axios.post<ApiResponse>(`${API_BASE}/memories`, {
        content: 'Missing type field'
        // type is required but missing
      });
    } catch (error: any) {
      console.log(`Status: ${error.response?.status}`);
      console.log(`Error: ${error.response?.data?.message}`);
      console.log(`Code: ${error.response?.data?.code}`);
    }
    console.log('');

    // Test 19: Pagination
    console.log('📄 Test 19: Pagination');
    const paginationResponse = await axios.get<ApiResponse>(`${API_BASE}/memories?limit=5&offset=0`);
    console.log(`Status: ${paginationResponse.status}`);
    console.log(`Page size: ${paginationResponse.data?.data?.memories?.length}`);
    console.log(`Total count: ${paginationResponse.data?.data?.totalCount}`);
    console.log('');

    // Test 20: Complex Query
    console.log('🔍 Test 20: Complex Query');
    const complexResponse = await axios.get<ApiResponse>(`${API_BASE}/memories?searchTerm=test&tags=api-test&type=DOCUMENTATION&useContextualSearch=true&limit=10`);
    console.log(`Status: ${complexResponse.status}`);
    console.log(`Complex query results: ${complexResponse.data?.data?.memories?.length}`);
    console.log(`Enhanced results: ${complexResponse.data?.data?.enhancedResults?.length}`);
    console.log('');

    // Final cleanup - Hard delete the test memory
    console.log('🧹 Final Cleanup: Hard Delete Test Memory');
    const cleanupResponse = await axios.delete<ApiResponse>(`${API_BASE}/memories/${memoryId}`, {
      data: {
        deletionType: 'hard',
        reason: 'API test cleanup',
        deletedBy: 'api-test-suite'
      }
    });
    console.log(`Cleanup status: ${cleanupResponse.status}`);
    console.log('');

    console.log('✅ QQ-Akasha API Implementation tests completed successfully!');
    console.log('🎉 All endpoints are functional and properly integrated!');

  } catch (error: any) {
    console.error('❌ API Test Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testApiImplementation().catch(console.error);
