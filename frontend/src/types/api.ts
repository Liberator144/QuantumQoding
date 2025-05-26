/**
 * API Types
 *
 * This module provides type definitions for API interactions.
 *
 * @version 1.0.0
 */
export var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["OPTIONS"] = "OPTIONS";
})(HttpMethod || (HttpMethod = {}));
export var DimensionalState;
(function (DimensionalState) {
    DimensionalState["STABLE"] = "stable";
    DimensionalState["TRANSITIONING"] = "transitioning";
    DimensionalState["SUPERPOSITION"] = "superposition";
    DimensionalState["ENTANGLED"] = "entangled";
})(DimensionalState || (DimensionalState = {}));
export var MessageType;
(function (MessageType) {
    MessageType["CONNECT"] = "connect";
    MessageType["DISCONNECT"] = "disconnect";
    MessageType["MESSAGE"] = "message";
    MessageType["ERROR"] = "error";
    MessageType["PING"] = "ping";
    MessageType["PONG"] = "pong";
    MessageType["QUANTUM_SYNC"] = "quantum_sync";
})(MessageType || (MessageType = {}));
// Type Guards
export const isApiResponse = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'data' in obj && 'success' in obj && 'timestamp' in obj;
};
export const isApiError = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'code' in obj && 'message' in obj && 'timestamp' in obj;
};
export const isQuantumApiResponse = (obj) => {
    return isApiResponse(obj) && 'quantumMetadata' in obj;
};
