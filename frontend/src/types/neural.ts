/**
 * Neural Types
 *
 * This module provides type definitions for neural network management.
 *
 * @version 1.0.0
 */

// Neural Network Types
export interface NeuralNetwork {
  readonly id: string;
  name: string;
  architecture: NetworkArchitecture;
  layers: NeuralLayer[];
  connections: NeuralConnection[];
  weights: WeightMatrix;
  biases: BiasVector;
  activationFunction: ActivationFunction;
  learningRate: number;
  isTraining: boolean;
  performance: NetworkPerformance;
  quantumEnhanced: boolean;
}

export interface NetworkArchitecture {
  inputSize: number;
  hiddenLayers: number[];
  outputSize: number;
  networkType: NetworkType;
  topology: NetworkTopology;
}

export enum NetworkType {
  FEEDFORWARD = 'feedforward',
  RECURRENT = 'recurrent',
  CONVOLUTIONAL = 'convolutional',
  TRANSFORMER = 'transformer',
  QUANTUM_NEURAL = 'quantum_neural'
}

export enum NetworkTopology {
  DENSE = 'dense',
  SPARSE = 'sparse',
  RESIDUAL = 'residual',
  ATTENTION = 'attention',
  QUANTUM_ENTANGLED = 'quantum_entangled'
}

export interface NeuralLayer {
  readonly id: string;
  type: LayerType;
  size: number;
  neurons: Neuron[];
  activationFunction: ActivationFunction;
  dropoutRate?: number;
  quantumCoherence?: number;
}

export enum LayerType {
  INPUT = 'input',
  HIDDEN = 'hidden',
  OUTPUT = 'output',
  CONVOLUTIONAL = 'convolutional',
  POOLING = 'pooling',
  ATTENTION = 'attention',
  QUANTUM = 'quantum'
}

export interface Neuron {
  readonly id: string;
  value: number;
  bias: number;
  gradient: number;
  connections: Connection[];
  activationFunction: ActivationFunction;
  quantumState?: QuantumNeuronState;
}

export interface Connection {
  readonly id: string;
  fromNeuron: string;
  toNeuron: string;
  weight: number;
  gradient: number;
  isActive: boolean;
}

export interface QuantumNeuronState {
  superposition: number[];
  entanglement: string[];
  coherence: number;
  phase: number;
}

export enum ActivationFunction {
  SIGMOID = 'sigmoid',
  TANH = 'tanh',
  RELU = 'relu',
  LEAKY_RELU = 'leaky_relu',
  SOFTMAX = 'softmax',
  LINEAR = 'linear',
  QUANTUM_ACTIVATION = 'quantum_activation'
}

// Training Types
export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: string;
  lossFunction: string;
  validationSplit: number;
  earlyStoppingPatience?: number;
  quantumEnhancement: boolean;
}

// Performance Types
export interface NetworkPerformance {
  accuracy: number;
  loss: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: number;
  inferenceTime: number;
  quantumCoherence?: number;
}

// Type Guards
export const isNeuralNetwork = (obj: unknown): obj is NeuralNetwork => {
  return typeof obj === 'object' && obj !== null && 
         'id' in obj && 'architecture' in obj && 'layers' in obj;
};

export const isValidActivationFunction = (fn: string): fn is ActivationFunction => {
  return Object.values(ActivationFunction).includes(fn as ActivationFunction);
};