/**
 * Quantum State Transformer
 * 
 * Provides transformation operations for quantum state vectors, enabling
 * state transitions, rotations, and other quantum operations.
 * 
 * @version 1.0.0
 */

import { QuantumStateVector } from './QuantumStateManager';

/**
 * Transformation operation
 */
export enum TransformationOperation {
  /** Rotate state vector */
  ROTATE = 'ROTATE',
  
  /** Scale state vector */
  SCALE = 'SCALE',
  
  /** Translate state vector */
  TRANSLATE = 'TRANSLATE',
  
  /** Normalize state vector */
  NORMALIZE = 'NORMALIZE',
  
  /** Invert state vector */
  INVERT = 'INVERT',
  
  /** Apply quantum gate */
  APPLY_GATE = 'APPLY_GATE'
}/**
 * Quantum gate type
 */
export enum QuantumGateType {
  /** Hadamard gate */
  HADAMARD = 'HADAMARD',
  
  /** Pauli-X gate */
  PAULI_X = 'PAULI_X',
  
  /** Pauli-Y gate */
  PAULI_Y = 'PAULI_Y',
  
  /** Pauli-Z gate */
  PAULI_Z = 'PAULI_Z',
  
  /** Phase gate */
  PHASE = 'PHASE',
  
  /** CNOT gate */
  CNOT = 'CNOT',
  
  /** SWAP gate */
  SWAP = 'SWAP'
}

/**
 * Transformation options
 */
export interface TransformationOptions {
  /** Operation to perform */
  operation: TransformationOperation;
  
  /** Parameters for the operation */
  parameters: Record<string, any>;
  
  /** Whether to create a new vector or modify the existing one */
  createNew?: boolean;
}/**
 * Quantum state transformer
 */
export class QuantumStateTransformer {
  /**
   * Transform a quantum state vector
   * @param vector - Quantum state vector
   * @param options - Transformation options
   * @returns Transformed vector
   */
  public transformVector(
    vector: QuantumStateVector,
    options: TransformationOptions
  ): QuantumStateVector {
    // Create a copy of the vector if createNew is true
    const targetVector = options.createNew ? { ...vector, values: [...vector.values] } : vector;
    
    // Apply the transformation
    switch (options.operation) {
      case TransformationOperation.ROTATE:
        return this.rotateVector(targetVector, options.parameters);
      
      case TransformationOperation.SCALE:
        return this.scaleVector(targetVector, options.parameters);
      
      case TransformationOperation.TRANSLATE:
        return this.translateVector(targetVector, options.parameters);
      
      case TransformationOperation.NORMALIZE:
        return this.normalizeVector(targetVector);
      
      case TransformationOperation.INVERT:
        return this.invertVector(targetVector);
      
      case TransformationOperation.APPLY_GATE:
        return this.applyQuantumGate(targetVector, options.parameters);
      
      default:
        throw new Error(`Unsupported transformation operation: ${options.operation}`);
    }
  }  
  /**
   * Rotate a quantum state vector
   * @param vector - Quantum state vector
   * @param parameters - Rotation parameters
   * @returns Rotated vector
   */
  private rotateVector(
    vector: QuantumStateVector,
    parameters: { angle: number; axis?: number[] }
  ): QuantumStateVector {
    const { angle, axis } = parameters;
    
    // Default rotation axis (first two dimensions)
    const rotationAxis = axis || [0, 1];
    
    if (rotationAxis.length !== 2) {
      throw new Error('Rotation axis must specify exactly two dimensions');
    }
    
    const [dim1, dim2] = rotationAxis;
    
    if (dim1 >= vector.dimensions || dim2 >= vector.dimensions) {
      throw new Error(`Rotation axis dimensions (${dim1}, ${dim2}) out of bounds for vector with ${vector.dimensions} dimensions`);
    }
    
    // Apply rotation
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    
    const val1 = vector.values[dim1];
    const val2 = vector.values[dim2];
    
    vector.values[dim1] = val1 * cosAngle - val2 * sinAngle;
    vector.values[dim2] = val1 * sinAngle + val2 * cosAngle;
    
    // Update phase
    vector.phase = (vector.phase + angle) % (2 * Math.PI);
    
    return vector;
  }  
  /**
   * Scale a quantum state vector
   * @param vector - Quantum state vector
   * @param parameters - Scale parameters
   * @returns Scaled vector
   */
  private scaleVector(
    vector: QuantumStateVector,
    parameters: { factor: number; dimensions?: number[] }
  ): QuantumStateVector {
    const { factor, dimensions } = parameters;
    
    if (dimensions) {
      // Scale specific dimensions
      for (const dim of dimensions) {
        if (dim >= vector.dimensions) {
          throw new Error(`Dimension ${dim} out of bounds for vector with ${vector.dimensions} dimensions`);
        }
        
        vector.values[dim] *= factor;
      }
    } else {
      // Scale all dimensions
      for (let i = 0; i < vector.values.length; i++) {
        vector.values[i] *= factor;
      }
    }
    
    // Update amplitude
    vector.amplitude *= Math.abs(factor);
    
    return vector;
  }  
  /**
   * Translate a quantum state vector
   * @param vector - Quantum state vector
   * @param parameters - Translation parameters
   * @returns Translated vector
   */
  private translateVector(
    vector: QuantumStateVector,
    parameters: { offset: number[]; dimensions?: number[] }
  ): QuantumStateVector {
    const { offset, dimensions } = parameters;
    
    if (dimensions) {
      // Translate specific dimensions
      if (offset.length !== dimensions.length) {
        throw new Error(`Offset length (${offset.length}) must match dimensions length (${dimensions.length})`);
      }
      
      for (let i = 0; i < dimensions.length; i++) {
        const dim = dimensions[i];
        
        if (dim >= vector.dimensions) {
          throw new Error(`Dimension ${dim} out of bounds for vector with ${vector.dimensions} dimensions`);
        }
        
        vector.values[dim] += offset[i];
      }
    } else {
      // Translate all dimensions
      if (offset.length !== vector.dimensions) {
        throw new Error(`Offset length (${offset.length}) must match vector dimensions (${vector.dimensions})`);
      }
      
      for (let i = 0; i < vector.values.length; i++) {
        vector.values[i] += offset[i];
      }
    }
    
    return vector;
  }  
  /**
   * Normalize a quantum state vector
   * @param vector - Quantum state vector
   * @returns Normalized vector
   */
  private normalizeVector(vector: QuantumStateVector): QuantumStateVector {
    // Calculate magnitude
    let magnitude = 0;
    
    for (const value of vector.values) {
      magnitude += value * value;
    }
    
    magnitude = Math.sqrt(magnitude);
    
    if (magnitude === 0) {
      throw new Error('Cannot normalize a zero vector');
    }
    
    // Normalize values
    for (let i = 0; i < vector.values.length; i++) {
      vector.values[i] /= magnitude;
    }
    
    // Update amplitude
    vector.amplitude = 1;
    
    return vector;
  }
  
  /**
   * Invert a quantum state vector
   * @param vector - Quantum state vector
   * @returns Inverted vector
   */
  private invertVector(vector: QuantumStateVector): QuantumStateVector {
    // Invert values
    for (let i = 0; i < vector.values.length; i++) {
      vector.values[i] = -vector.values[i];
    }
    
    // Update phase
    vector.phase = (vector.phase + Math.PI) % (2 * Math.PI);
    
    return vector;
  }  
  /**
   * Apply a quantum gate to a state vector
   * @param vector - Quantum state vector
   * @param parameters - Gate parameters
   * @returns Transformed vector
   */
  private applyQuantumGate(
    vector: QuantumStateVector,
    parameters: { gate: QuantumGateType; targetDimensions: number[]; controlDimensions?: number[]; phaseAngle?: number }
  ): QuantumStateVector {
    const { gate, targetDimensions, controlDimensions, phaseAngle } = parameters;
    
    switch (gate) {
      case QuantumGateType.HADAMARD:
        return this.applyHadamardGate(vector, targetDimensions);
      
      case QuantumGateType.PAULI_X:
        return this.applyPauliXGate(vector, targetDimensions);
      
      case QuantumGateType.PAULI_Y:
        return this.applyPauliYGate(vector, targetDimensions);
      
      case QuantumGateType.PAULI_Z:
        return this.applyPauliZGate(vector, targetDimensions);
      
      case QuantumGateType.PHASE:
        return this.applyPhaseGate(vector, targetDimensions, phaseAngle || 0);
      
      case QuantumGateType.CNOT:
      case QuantumGateType.CNOT: {
        if (!controlDimensions || controlDimensions.length === 0) {
          throw new Error('CNOT gate requires control dimensions');
        }
        return this.applyCNOTGate(vector, targetDimensions, controlDimensions);
      }

      case QuantumGateType.SWAP:
        return this.applySwapGate(vector, targetDimensions);
      default:
        throw new Error(`Unsupported quantum gate: ${gate}`);
    }
  }  
  /**
   * Apply Hadamard gate to a state vector
   * @param vector - Quantum state vector
   * @param dimensions - Target dimensions
   * @returns Transformed vector
   */
  private applyHadamardGate(vector: QuantumStateVector, dimensions: number[]): QuantumStateVector {
    if (dimensions.length !== 1) {
      throw new Error('Hadamard gate requires exactly one target dimension');
    }
    
    const dim = dimensions[0];
    
    if (dim >= vector.dimensions) {
      throw new Error(`Dimension ${dim} out of bounds for vector with ${vector.dimensions} dimensions`);
    }
    
    // Apply Hadamard transformation
    const value = vector.values[dim];
    vector.values[dim] = value / Math.sqrt(2) + (1 - value) / Math.sqrt(2);
    
    return vector;
  }
  
  /**
   * Apply Pauli-X gate to a state vector
   * @param vector - Quantum state vector
   * @param dimensions - Target dimensions
   * @returns Transformed vector
   */
  private applyPauliXGate(vector: QuantumStateVector, dimensions: number[]): QuantumStateVector {
    if (dimensions.length !== 1) {
      throw new Error('Pauli-X gate requires exactly one target dimension');
    }
    
    const dim = dimensions[0];
    
    if (dim >= vector.dimensions) {
      throw new Error(`Dimension ${dim} out of bounds for vector with ${vector.dimensions} dimensions`);
    }
    
    // Apply Pauli-X transformation (bit flip)
    vector.values[dim] = 1 - vector.values[dim];
    
    return vector;
  }  
  /**
   * Apply Pauli-Y gate to a state vector
   * @param vector - Quantum state vector
   * @param dimensions - Target dimensions
   * @returns Transformed vector
   */
  private applyPauliYGate(vector: QuantumStateVector, dimensions: number[]): QuantumStateVector {
    if (dimensions.length !== 1) {
      throw new Error('Pauli-Y gate requires exactly one target dimension');
    }
    
    const dim = dimensions[0];
    
    if (dim >= vector.dimensions) {
      throw new Error(`Dimension ${dim} out of bounds for vector with ${vector.dimensions} dimensions`);
    }
    
    // Apply Pauli-Y transformation
    const value = vector.values[dim];
    vector.values[dim] = -value;
    vector.phase = (vector.phase + Math.PI / 2) % (2 * Math.PI);
    
    return vector;
  }
  
  /**
   * Apply Pauli-Z gate to a state vector
   * @param vector - Quantum state vector
   * @param dimensions - Target dimensions
   * @returns Transformed vector
   */
  private applyPauliZGate(vector: QuantumStateVector, dimensions: number[]): QuantumStateVector {
    if (dimensions.length !== 1) {
      throw new Error('Pauli-Z gate requires exactly one target dimension');
    }
    
    const dim = dimensions[0];
    
    if (dim >= vector.dimensions) {
      throw new Error(`Dimension ${dim} out of bounds for vector with ${vector.dimensions} dimensions`);
    }
    
    // Apply Pauli-Z transformation (phase flip)
    if (vector.values[dim] !== 0) {
      vector.phase = (vector.phase + Math.PI) % (2 * Math.PI);
    }
    
    return vector;
  }  
  /**
   * Apply Phase gate to a state vector
   * @param vector - Quantum state vector
   * @param dimensions - Target dimensions
   * @param angle - Phase angle
   * @returns Transformed vector
   */
  private applyPhaseGate(vector: QuantumStateVector, dimensions: number[], angle: number): QuantumStateVector {
    if (dimensions.length !== 1) {
      throw new Error('Phase gate requires exactly one target dimension');
    }
    
    const dim = dimensions[0];
    
    if (dim >= vector.dimensions) {
      throw new Error(`Dimension ${dim} out of bounds for vector with ${vector.dimensions} dimensions`);
    }
    
    // Apply Phase transformation
    if (vector.values[dim] !== 0) {
      vector.phase = (vector.phase + angle) % (2 * Math.PI);
    }
    
    return vector;
  }
  
  /**
   * Apply CNOT gate to a state vector
   * @param vector - Quantum state vector
   * @param targetDimensions - Target dimensions
   * @param controlDimensions - Control dimensions
   * @returns Transformed vector
   */
  private applyCNOTGate(
    vector: QuantumStateVector,
    targetDimensions: number[],
    controlDimensions: number[]
  ): QuantumStateVector {
    if (targetDimensions.length !== 1) {
      throw new Error('CNOT gate requires exactly one target dimension');
    }
    
    if (controlDimensions.length !== 1) {
      throw new Error('CNOT gate requires exactly one control dimension');
    }    
    const targetDim = targetDimensions[0];
    const controlDim = controlDimensions[0];
    
    if (targetDim >= vector.dimensions) {
      throw new Error(`Target dimension ${targetDim} out of bounds for vector with ${vector.dimensions} dimensions`);
    }
    
    if (controlDim >= vector.dimensions) {
      throw new Error(`Control dimension ${controlDim} out of bounds for vector with ${vector.dimensions} dimensions`);
    }
    
    // Apply CNOT transformation
    if (vector.values[controlDim] !== 0) {
      vector.values[targetDim] = 1 - vector.values[targetDim];
    }
    
    return vector;
  }
  
  /**
   * Apply SWAP gate to a state vector
   * @param vector - Quantum state vector
   * @param dimensions - Target dimensions
   * @returns Transformed vector
   */
  private applySwapGate(vector: QuantumStateVector, dimensions: number[]): QuantumStateVector {
    if (dimensions.length !== 2) {
      throw new Error('SWAP gate requires exactly two target dimensions');
    }
    
    const dim1 = dimensions[0];
    const dim2 = dimensions[1];
    
    if (dim1 >= vector.dimensions) {
      throw new Error(`Dimension ${dim1} out of bounds for vector with ${vector.dimensions} dimensions`);
    }
    
    if (dim2 >= vector.dimensions) {
      throw new Error(`Dimension ${dim2} out of bounds for vector with ${vector.dimensions} dimensions`);
    }    
    // Apply SWAP transformation
    const temp = vector.values[dim1];
    vector.values[dim1] = vector.values[dim2];
    vector.values[dim2] = temp;
    
    return vector;
  }
}

export default QuantumStateTransformer;