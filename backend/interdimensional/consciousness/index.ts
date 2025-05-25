/**
 * Consciousness Stream Module
 * 
 * This module exports the consciousness stream components for interdimensional communication.
 * 
 * @version 1.0.0
 */

// Consciousness stream protocol
export {
  ProtocolVersion,
  ConsciousnessStreamHeader,
  ContextPreservationFlags,
  NeuralFabricConnection,
  ConsciousnessStreamPayload,
  ConsciousnessStreamPacket,
  ProtocolError,
  ProtocolErrorCode,
  ProtocolValidationResult
} from './ConsciousnessStreamProtocol';
export { default as ProtocolUtils } from './ConsciousnessStreamProtocol';

// Consciousness stream serializer
export {
  SerializationFormat,
  SerializationOptions,
  SerializationResult,
  DeserializationOptions,
  DeserializationResult
} from './ConsciousnessStreamSerializer';
export { default as ConsciousnessStreamSerializer } from './ConsciousnessStreamSerializer';

// Context preservation manager
export {
  ContextEntry,
  ContextStore,
  ContextPreservationOptions
} from './ContextPreservationManager';
export { default as ContextPreservationManager } from './ContextPreservationManager';