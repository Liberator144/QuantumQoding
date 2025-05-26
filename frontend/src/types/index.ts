/**
 * Types Index
 *
 * This module exports all type definitions for the application.
 *
 * @version 1.0.0
 */
// Export all consciousness types
export * from './consciousness';
// Export all UI types
export * from './ui';
// Export all user types
export * from './user';
// Export all store types
export * from './store';
// Export all neural types
export * from './neural';
// Export all dimensional types
export * from './dimensional';
// Export all quantum types
export * from './quantum';
// Export all API types
export * from './api';
// Type utility functions
export const createTypedAction = (type, payload) => ({
    type,
    payload,
    meta: {
        timestamp: new Date(),
        source: 'typed-action'
    }
});
export const createQuantumSignature = () => {
    return `quantum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
export const isValidId = (id) => {
    return typeof id === 'string' && id.length > 0;
};
export const createDimensionalCoordinates = (x, y, z, w) => ({
    x,
    y,
    z,
    ...(w !== undefined && { w })
});
export const createComplex = (real, imaginary) => ({
    real,
    imaginary
});
// Type constants
export const DEFAULT_COHERENCE_LEVEL = 0.95;
export const DEFAULT_QUANTUM_PHASE = 0;
export const DEFAULT_DIMENSIONAL_STABILITY = 0.8;
export const DEFAULT_NEURAL_LEARNING_RATE = 0.001;
// Quantum constants
export const PLANCK_CONSTANT = 6.62607015e-34;
export const SPEED_OF_LIGHT = 299792458;
export const QUANTUM_COHERENCE_THRESHOLD = 0.9;
