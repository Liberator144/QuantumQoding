/**
 * API Integration Test Component
 * 
 * Tests frontend-backend API communication and displays results
 * 
 * @version 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quantumAPI } from '../../services/api/QuantumAPIService';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
  data?: any;
}

const APIIntegrationTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'complete'>('idle');

  const testSuites = [
    {
      name: 'Health Check',
      test: async () => {
        const result = await quantumAPI.getHealth();
        return { success: true, data: result };
      }
    },
    {
      name: 'API Status',
      test: async () => {
        const result = await quantumAPI.getStatus();
        return { success: true, data: result };
      }
    },
    {
      name: 'Connection Test',
      test: async () => {
        const result = await quantumAPI.testConnection();
        return { success: result, data: { connected: result } };
      }
    },
    {
      name: 'Quantum States',
      test: async () => {
        const result = await quantumAPI.getQuantumStates();
        return { success: true, data: { count: result?.length || 0 } };
      }
    },
    {
      name: 'Dimensions',
      test: async () => {
        const result = await quantumAPI.getDimensions();
        return { success: true, data: { count: result?.length || 0 } };
      }
    },
    {
      name: 'Neural Fabric',
      test: async () => {
        const result = await quantumAPI.getNeuralFabric();
        return { success: true, data: { id: result?.id || 'none' } };
      }
    },
    {
      name: 'Consciousness Streams',
      test: async () => {
        const result = await quantumAPI.getConsciousnessStreams();
        return { success: true, data: { count: result?.length || 0 } };
      }
    }
  ];

  const runTest = async (testSuite: typeof testSuites[0]): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const result = await testSuite.test();
      const duration = Date.now() - startTime;
      
      return {
        name: testSuite.name,
        status: result.success ? 'success' : 'error',
        message: result.success ? 'Test passed' : 'Test failed',
        duration,
        data: result.data
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      return {
        name: testSuite.name,
        status: 'error',
        message: error.message || 'Unknown error',
        duration,
        data: error
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setTests([]);

    const results: TestResult[] = [];

    for (const testSuite of testSuites) {
      // Add pending test
      const pendingTest: TestResult = {
        name: testSuite.name,
        status: 'pending',
        message: 'Running...'
      };
      
      setTests(prev => [...prev, pendingTest]);

      // Run test
      const result = await runTest(testSuite);
      results.push(result);

      // Update test result
      setTests(prev => 
        prev.map(test => 
          test.name === testSuite.name ? result : test
        )
      );

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    setOverallStatus('complete');
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const totalTests = testSuites.length;

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">
          API Integration Test Suite
        </h3>
        <p className="text-gray-400">
          Testing frontend-backend communication and API endpoints
        </p>
      </div>

      {/* Control Panel */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isRunning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white'
          }`}
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>

        {overallStatus === 'complete' && (
          <div className="flex items-center space-x-4">
            <div className="text-green-400">
              ✅ {successCount} Passed
            </div>
            <div className="text-red-400">
              ❌ {errorCount} Failed
            </div>
            <div className="text-gray-400">
              📊 {successCount}/{totalTests} Success Rate: {((successCount/totalTests) * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Test Results */}
      <div className="space-y-3">
        {tests.map((test, index) => (
          <motion.div
            key={test.name}
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getStatusIcon(test.status)}</span>
                <div>
                  <h4 className="font-semibold text-white">{test.name}</h4>
                  <p className={`text-sm ${getStatusColor(test.status)}`}>
                    {test.message}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                {test.duration && (
                  <div className="text-sm text-gray-400">
                    {test.duration}ms
                  </div>
                )}
                {test.status === 'success' && test.data && (
                  <div className="text-xs text-green-400">
                    {typeof test.data === 'object' 
                      ? Object.keys(test.data).map(key => 
                          `${key}: ${test.data[key]}`
                        ).join(', ')
                      : String(test.data)
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Error Details */}
            {test.status === 'error' && test.data && (
              <div className="mt-3 p-3 bg-red-900/20 rounded border border-red-500/30">
                <div className="text-sm text-red-300">
                  <strong>Error Details:</strong>
                </div>
                <pre className="text-xs text-red-200 mt-1 overflow-x-auto">
                  {JSON.stringify(test.data, null, 2)}
                </pre>
              </div>
            )}

            {/* Success Data */}
            {test.status === 'success' && test.data && Object.keys(test.data).length > 1 && (
              <div className="mt-3 p-3 bg-green-900/20 rounded border border-green-500/30">
                <div className="text-sm text-green-300">
                  <strong>Response Data:</strong>
                </div>
                <pre className="text-xs text-green-200 mt-1 overflow-x-auto">
                  {JSON.stringify(test.data, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* API Configuration */}
      <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/20">
        <h4 className="font-semibold text-cyan-400 mb-2">API Configuration</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <div>Base URL: {quantumAPI.getConfig().baseURL}</div>
          <div>Timeout: {quantumAPI.getConfig().timeout}ms</div>
          <div>Retries: {quantumAPI.getConfig().retries}</div>
        </div>
      </div>
    </div>
  );
};

export default APIIntegrationTest;