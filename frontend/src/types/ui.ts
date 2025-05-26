/**
 * UI Types
 *
 * This module provides type definitions for UI components.
 *
 * @version 1.0.0
 */
export var UIEventType;
(function (UIEventType) {
    UIEventType["CLICK"] = "click";
    UIEventType["HOVER"] = "hover";
    UIEventType["FOCUS"] = "focus";
    UIEventType["BLUR"] = "blur";
    UIEventType["SCROLL"] = "scroll";
    UIEventType["RESIZE"] = "resize";
    UIEventType["QUANTUM_INTERACTION"] = "quantum_interaction";
})(UIEventType || (UIEventType = {}));
// Type Guards
export const isValidSize = (size) => {
    return ['xs', 'sm', 'md', 'lg', 'xl'].includes(size);
};
export const isValidVariant = (variant) => {
    return ['primary', 'secondary', 'accent', 'quantum'].includes(variant);
};
