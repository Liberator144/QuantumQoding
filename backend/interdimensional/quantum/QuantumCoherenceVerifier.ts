/**
 * Quantum Coherence Verifier
 * 
 * Provides verification of quantum coherence between quantum states and entities
 * specifically for the interdimensional communication framework.
 * 
 * @version 1.0.0
 */

import { QuantumState } from '../../database/schemas/BaseSchema';
import { CoherenceLevel, QuantumStateVector } from './QuantumStateManager';

/**
 * Verification result
 */
export interface VerificationResult {
  /** Success flag */
  success: boolean;
  
  /** Coherence level */
  coherenceLevel: CoherenceLevel;
  
  /** Verification messages */
  messages: string[];
  
  /** Error message */
  error?: string;
  
  /** Detailed results */
  details?: Record<string, any>;
}

/**
 * Verification options
 */
export interface VerificationOptions {
  /** Verification depth */
  depth?: number;
  
  /** Verification timeout in milliseconds */
  timeoutMs?: number;
  
  /** Whether to include detailed results */
  includeDetails?: boolean;
  
  /** Minimum required coherence level */
  minCoherenceLevel?: CoherenceLevel;
}/**
 * Quantum coherence verifier
 */
export class QuantumCoherenceVerifier {
  /**
   * Verify coherence between two quantum states
   * @param state1 - First quantum state
   * @param state2 - Second quantum state
   * @param options - Verification options
   * @returns Verification result
   */
  public verifyCoherence(
    state1: QuantumState,
    state2: QuantumState,
    options: VerificationOptions = {}
  ): VerificationResult {
    try {
      // Default options
      const defaultOptions: Required<VerificationOptions> = {
        depth: 1,
        timeoutMs: 5000,
        includeDetails: false,
        minCoherenceLevel: CoherenceLevel.MINIMAL
      };
      
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Initialize result
      const result: VerificationResult = {
        success: false,
        coherenceLevel: CoherenceLevel.NONE,
        messages: []
      };
      
      // Verify basic properties
      if (state1.version !== state2.version) {
        result.messages.push(`Version mismatch: ${state1.version} vs ${state2.version}`);
      }
      
      // Verify properties
      const propertyCoherence = this.verifyPropertyCoherence(state1, state2);
      result.coherenceLevel = propertyCoherence.coherenceLevel;
      result.messages.push(...propertyCoherence.messages);      
      // Include detailed results if requested
      if (mergedOptions.includeDetails) {
        result.details = {
          propertyCoherence: propertyCoherence.details
        };
      }
      
      // Check if coherence level meets the minimum requirement
      result.success = result.coherenceLevel >= mergedOptions.minCoherenceLevel;
      
      return result;
    } catch (error) {
      return {
        success: false,
        coherenceLevel: CoherenceLevel.NONE,
        messages: ['Verification failed with error'],
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Verify coherence between properties of two quantum states
   * @param state1 - First quantum state
   * @param state2 - Second quantum state
   * @returns Verification result
   */
  private verifyPropertyCoherence(
    state1: QuantumState,
    state2: QuantumState
  ): { coherenceLevel: CoherenceLevel; messages: string[]; details?: Record<string, any> } {
    const messages: string[] = [];
    const details: Record<string, any> = {};
    let coherenceLevel = CoherenceLevel.FULL;    
    // Check property counts
    const state1PropertyCount = Object.keys(state1.properties).length;
    const state2PropertyCount = Object.keys(state2.properties).length;
    
    if (state1PropertyCount !== state2PropertyCount) {
      messages.push(`Property count mismatch: ${state1PropertyCount} vs ${state2PropertyCount}`);
      coherenceLevel = Math.min(coherenceLevel, CoherenceLevel.PARTIAL);
    }
    
    // Check property values
    const allPropertyKeys = new Set([
      ...Object.keys(state1.properties),
      ...Object.keys(state2.properties)
    ]);
    
    let matchCount = 0;
    let mismatchCount = 0;
    
    for (const key of allPropertyKeys) {
      const value1 = state1.properties[key];
      const value2 = state2.properties[key];
      
      if (value1 === undefined || value2 === undefined) {
        messages.push(`Property ${key} missing in one state`);
        mismatchCount++;
        details[key] = { status: 'missing', value1, value2 };
      } else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        messages.push(`Property ${key} value mismatch`);
        mismatchCount++;
        details[key] = { status: 'mismatch', value1, value2 };
      } else {
        matchCount++;
        details[key] = { status: 'match', value: value1 };
      }
    }    
    // Calculate coherence level based on match/mismatch ratio
    const totalProperties = matchCount + mismatchCount;
    
    if (totalProperties > 0) {
      const matchRatio = matchCount / totalProperties;
      
      if (matchRatio < 0.5) {
        coherenceLevel = Math.min(coherenceLevel, CoherenceLevel.MINIMAL);
      } else if (matchRatio < 0.8) {
        coherenceLevel = Math.min(coherenceLevel, CoherenceLevel.PARTIAL);
      }
      
      messages.push(`Property match ratio: ${(matchRatio * 100).toFixed(2)}%`);
    }
    
    return {
      coherenceLevel,
      messages,
      details
    };
  }
  
  /**
   * Verify coherence between two quantum state vectors
   * @param vector1 - First quantum state vector
   * @param vector2 - Second quantum state vector
   * @returns Verification result
   */
  public verifyVectorCoherence(
    vector1: QuantumStateVector,
    vector2: QuantumStateVector
  ): VerificationResult {
    try {
      // Initialize result
      const result: VerificationResult = {
        success: false,
        coherenceLevel: CoherenceLevel.NONE,
        messages: []
      };      
      // Verify dimensions
      if (vector1.dimensions !== vector2.dimensions) {
        result.messages.push(`Dimension mismatch: ${vector1.dimensions} vs ${vector2.dimensions}`);
        return {
          ...result,
          coherenceLevel: CoherenceLevel.NONE
        };
      }
      
      // Verify values
      if (vector1.values.length !== vector2.values.length) {
        result.messages.push(`Value count mismatch: ${vector1.values.length} vs ${vector2.values.length}`);
        return {
          ...result,
          coherenceLevel: CoherenceLevel.NONE
        };
      }
      
      // Calculate vector similarity
      let dotProduct = 0;
      let magnitude1 = 0;
      let magnitude2 = 0;
      
      for (let i = 0; i < vector1.values.length; i++) {
        dotProduct += vector1.values[i] * vector2.values[i];
        magnitude1 += vector1.values[i] * vector1.values[i];
        magnitude2 += vector2.values[i] * vector2.values[i];
      }
      
      magnitude1 = Math.sqrt(magnitude1);
      magnitude2 = Math.sqrt(magnitude2);
      
      const similarity = dotProduct / (magnitude1 * magnitude2 || 1);
      
      result.messages.push(`Vector similarity: ${(similarity * 100).toFixed(2)}%`);
      
      // Determine coherence level based on similarity
      if (similarity > 0.95) {
        result.coherenceLevel = CoherenceLevel.FULL;
      } else if (similarity > 0.8) {
        result.coherenceLevel = CoherenceLevel.PARTIAL;
      } else if (similarity > 0.5) {
        result.coherenceLevel = CoherenceLevel.MINIMAL;
      } else {
        result.coherenceLevel = CoherenceLevel.NONE;
      }      
      // Check phase coherence
      const phaseDifference = Math.abs(vector1.phase - vector2.phase) % (2 * Math.PI);
      const normalizedPhaseDifference = Math.min(phaseDifference, 2 * Math.PI - phaseDifference) / Math.PI;
      
      result.messages.push(`Phase difference: ${(normalizedPhaseDifference * 100).toFixed(2)}%`);
      
      // Adjust coherence level based on phase difference
      if (normalizedPhaseDifference > 0.5) {
        result.coherenceLevel = Math.max(CoherenceLevel.NONE, result.coherenceLevel - 2);
      } else if (normalizedPhaseDifference > 0.2) {
        result.coherenceLevel = Math.max(CoherenceLevel.NONE, result.coherenceLevel - 1);
      }
      
      // Check amplitude coherence
      const amplitudeRatio = Math.min(vector1.amplitude, vector2.amplitude) / 
                            Math.max(vector1.amplitude, vector2.amplitude);
      
      result.messages.push(`Amplitude ratio: ${(amplitudeRatio * 100).toFixed(2)}%`);
      
      // Adjust coherence level based on amplitude ratio
      if (amplitudeRatio < 0.5) {
        result.coherenceLevel = Math.max(CoherenceLevel.NONE, result.coherenceLevel - 1);
      }
      
      result.success = result.coherenceLevel > CoherenceLevel.NONE;
      
      return result;
    } catch (error) {
      return {
        success: false,
        coherenceLevel: CoherenceLevel.NONE,
        messages: ['Vector verification failed with error'],
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

export default QuantumCoherenceVerifier;