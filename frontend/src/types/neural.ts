/**
 * Neural Types
 * 
 * This module provides type definitions for neural fabric management.
 * 
 * @version 1.0.0
 */

/**
 * Neural node interface
 */
export interface NeuralNode {
  id: string;
  name: string;
  type: 'consciousness' | 'data' | 'processing' | 'interface' | 'storage';
  activationLevel: number;
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Neural connection interface
 */
export interface NeuralConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  strength: number;
  type: 'direct' | 'indirect' | 'bidirectional' | 'temporal';
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Neural pathway interface
 */
export interface NeuralPathway {
  id: string;
  name: string;
  nodeIds: string[];
  connectionIds: string[];
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Neural fabric interface
 */
export interface NeuralFabric {
  id: string;
  name: string;
  nodes: NeuralNode[];
  connections: NeuralConnection[];
  pathways: NeuralPathway[];
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Neural fabric verification result interface
 */
export interface FabricVerificationResult {
  isIntact: boolean;
  integrityScore: number;
  pathwayCoherenceScores: Record<string, number>;
  issues?: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: string;
  }[];
  recommendations?: {
    type: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    action: string;
  }[];
}

/**
 * Neural fabric checkpoint interface
 */
export interface NeuralFabricCheckpoint {
  id: string;
  fabricId: string;
  timestamp: number;
  nodes: NeuralNode[];
  connections: NeuralConnection[];
  pathways: NeuralPathway[];
}

/**
 * Neural fabric restoration result interface
 */
export interface FabricRestorationResult {
  success: boolean;
  fabricId: string;
  checkpointId: string;
  timestamp: number;
  integrityScore: number;
  error?: string;
}

/**
 * Neural fabric optimization options interface
 */
export interface OptimizationOptions {
  strategy: 'performance' | 'coherence' | 'balanced';
  targetActivationLevel: number;
  targetConnectionStrength: number;
  pruneWeakConnections: boolean;
  weakConnectionThreshold: number;
  maxIterations: number;
}

/**
 * Neural fabric optimization result interface
 */
export interface OptimizationResult {
  id: string;
  fabricId: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  completedTimestamp?: number;
  iterations: number;
  performanceScore: number;
  coherenceScore: number;
  nodesOptimized: number;
  connectionsOptimized: number;
  pathwaysOptimized: number;
  error?: string;
}