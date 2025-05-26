/**
 * Quantum Types
 *
 * This module provides type definitions for quantum mechanics and quantum computing.
 *
 * @version 1.0.0
 */
export var CorrelationType;
(function (CorrelationType) {
    CorrelationType["SPIN"] = "spin";
    CorrelationType["POLARIZATION"] = "polarization";
    CorrelationType["MOMENTUM"] = "momentum";
    CorrelationType["POSITION"] = "position";
    CorrelationType["ENERGY"] = "energy";
})(CorrelationType || (CorrelationType = {}));
// Type Guards
export const isQuantumState = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'id' in obj && 'amplitude' in obj && 'phase' in obj;
};
export const isComplex = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'real' in obj && 'imaginary' in obj;
};
export const isQubit = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'id' in obj && 'index' in obj && 'state' in obj;
};
