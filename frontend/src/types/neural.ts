/**
 * Neural Types
 *
 * This module provides type definitions for neural network management.
 *
 * @version 1.0.0
 */
export var NetworkType;
(function (NetworkType) {
    NetworkType["FEEDFORWARD"] = "feedforward";
    NetworkType["RECURRENT"] = "recurrent";
    NetworkType["CONVOLUTIONAL"] = "convolutional";
    NetworkType["TRANSFORMER"] = "transformer";
    NetworkType["QUANTUM_NEURAL"] = "quantum_neural";
})(NetworkType || (NetworkType = {}));
export var NetworkTopology;
(function (NetworkTopology) {
    NetworkTopology["DENSE"] = "dense";
    NetworkTopology["SPARSE"] = "sparse";
    NetworkTopology["RESIDUAL"] = "residual";
    NetworkTopology["ATTENTION"] = "attention";
    NetworkTopology["QUANTUM_ENTANGLED"] = "quantum_entangled";
})(NetworkTopology || (NetworkTopology = {}));
export var LayerType;
(function (LayerType) {
    LayerType["INPUT"] = "input";
    LayerType["HIDDEN"] = "hidden";
    LayerType["OUTPUT"] = "output";
    LayerType["CONVOLUTIONAL"] = "convolutional";
    LayerType["POOLING"] = "pooling";
    LayerType["ATTENTION"] = "attention";
    LayerType["QUANTUM"] = "quantum";
})(LayerType || (LayerType = {}));
export var ActivationFunction;
(function (ActivationFunction) {
    ActivationFunction["SIGMOID"] = "sigmoid";
    ActivationFunction["TANH"] = "tanh";
    ActivationFunction["RELU"] = "relu";
    ActivationFunction["LEAKY_RELU"] = "leaky_relu";
    ActivationFunction["SOFTMAX"] = "softmax";
    ActivationFunction["LINEAR"] = "linear";
    ActivationFunction["QUANTUM_ACTIVATION"] = "quantum_activation";
})(ActivationFunction || (ActivationFunction = {}));
// Type Guards
export const isNeuralNetwork = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'id' in obj && 'architecture' in obj && 'layers' in obj;
};
export const isValidActivationFunction = (fn) => {
    return Object.values(ActivationFunction).includes(fn);
};
