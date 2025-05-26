/**
 * Consciousness Types
 *
 * This module provides type definitions for consciousness stream management.
 *
 * @version 1.0.0
 */
export var TransitionType;
(function (TransitionType) {
    TransitionType["SMOOTH"] = "smooth";
    TransitionType["QUANTUM_LEAP"] = "quantum_leap";
    TransitionType["DIMENSIONAL_SHIFT"] = "dimensional_shift";
    TransitionType["COHERENCE_SYNC"] = "coherence_sync";
})(TransitionType || (TransitionType = {}));
export var PreservationMode;
(function (PreservationMode) {
    PreservationMode["STRICT"] = "strict";
    PreservationMode["ADAPTIVE"] = "adaptive";
    PreservationMode["QUANTUM_COHERENT"] = "quantum_coherent";
})(PreservationMode || (PreservationMode = {}));
export var ConsciousnessEventType;
(function (ConsciousnessEventType) {
    ConsciousnessEventType["STATE_CHANGE"] = "state_change";
    ConsciousnessEventType["COHERENCE_SHIFT"] = "coherence_shift";
    ConsciousnessEventType["DIMENSIONAL_BREACH"] = "dimensional_breach";
    ConsciousnessEventType["STREAM_INTERRUPTION"] = "stream_interruption";
    ConsciousnessEventType["QUANTUM_ENTANGLEMENT"] = "quantum_entanglement";
})(ConsciousnessEventType || (ConsciousnessEventType = {}));
// Type Guards
export const isConsciousnessState = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'id' in obj && 'level' in obj && 'coherence' in obj;
};
export const isValidCoherence = (value) => {
    return typeof value === 'number' && value >= 0 && value <= 1;
};
export const isValidDimensionalVector = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'x' in obj && 'y' in obj && 'z' in obj &&
        typeof obj.x === 'number';
};
