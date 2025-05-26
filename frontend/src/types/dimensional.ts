/**
 * Dimensional Types
 *
 * This module provides type definitions for dimensional management.
 *
 * @version 1.0.0
 */
export var TransitionType;
(function (TransitionType) {
    TransitionType["SMOOTH"] = "smooth";
    TransitionType["QUANTUM_LEAP"] = "quantum_leap";
    TransitionType["PHASE_SHIFT"] = "phase_shift";
    TransitionType["HARMONIC_RESONANCE"] = "harmonic_resonance";
    TransitionType["ENTANGLEMENT_BRIDGE"] = "entanglement_bridge";
})(TransitionType || (TransitionType = {}));
export var BoundaryType;
(function (BoundaryType) {
    BoundaryType["HARD"] = "hard";
    BoundaryType["SOFT"] = "soft";
    BoundaryType["PERMEABLE"] = "permeable";
    BoundaryType["QUANTUM_BARRIER"] = "quantum_barrier";
    BoundaryType["TEMPORAL_WALL"] = "temporal_wall";
})(BoundaryType || (BoundaryType = {}));
// Type Guards
export const isDimension = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'id' in obj && 'coordinates' in obj && 'stability' in obj;
};
export const isValidTransitionType = (type) => {
    return Object.values(TransitionType).includes(type);
};
export const isDimensionalCoordinates = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'x' in obj && 'y' in obj && 'z' in obj;
};
