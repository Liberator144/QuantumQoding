// Frontend type definitions for backend interfaces
// This prevents direct backend imports in frontend code

// Boundary Manager Types
export enum BoundaryState {
  STABLE = 'stable',
  UNSTABLE = 'unstable',
  FORMING = 'forming',
  DISSOLVING = 'dissolving',
  CRITICAL = 'critical'
}

export enum BoundaryType {
  DIMENSIONAL = 'dimensional',
  TEMPORAL = 'temporal',
  CONSCIOUSNESS = 'consciousness',
  NEURAL = 'neural',
  QUANTUM = 'quantum'
}

export interface DimensionalBoundary {
  id: string;
  name: string;
  type: BoundaryType;
  state: BoundaryState;
  sourceDimensionId: string;
  targetDimensionId: string;
  stability: number;
  permeability: number;
  created: Date;
  lastModified: Date;
}

// Neural Fabric Manager Types
export enum NeuralNodeType {
  INPUT = 'input',
  HIDDEN = 'hidden',
  OUTPUT = 'output',
  MEMORY = 'memory',
  PROCESSING = 'processing',
  GATEWAY = 'gateway'
}

export enum NeuralConnectionType {
  EXCITATORY = 'excitatory',
  INHIBITORY = 'inhibitory',
  MODULATORY = 'modulatory',
  FEEDBACK = 'feedback',
  FEEDFORWARD = 'feedforward'
}

export interface NeuralNode {
  id: string;
  name: string;
  type: NeuralNodeType;
  state: string;
  activationLevel: number;
  position: { x: number; y: number; z?: number };
  radius: number;
  color: string;
}

export interface NeuralConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: NeuralConnectionType;
  weight: number;
  strength: number;
  active: boolean;
}

export interface NeuralPathway {
  id: string;
  name: string;
  nodes: string[];
  connections: string[];
  active: boolean;
  strength: number;
}

export interface NeuralFabric {
  id: string;
  name: string;
  nodes: NeuralNode[];
  connections: NeuralConnection[];
  pathways: NeuralPathway[];
  state: string;
  coherence: number;
}

// Consciousness Stream Types
export interface ConsciousnessPacket {
  id: string;
  header: {
    timestamp: number;
    sourceId: string;
    targetId: string;
    contextPreservationFlags?: {
      preserveContext: boolean;
    };
  };
  payload: {
    data: any;
    quantumState?: any;
  };
  metadata: {
    priority: number;
    ttl: number;
  };
}

// Dimensional Types
export interface Dimension {
  id: string;
  name: string;
  type: string;
  state: string;
  radius: number;
  color: string;
  position: { x: number; y: number; z?: number };
}

// Quantum State Types
export interface QuantumState {
  id: string;
  properties: Record<string, any>;
  coherence: number;
  entanglement: string[];
  timestamp: number;
}