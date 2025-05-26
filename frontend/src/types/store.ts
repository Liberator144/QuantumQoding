/**
 * Store Types
 *
 * This module provides type definitions for state management.
 *
 * @version 1.0.0
 */
// Type Guards
export const isAction = (obj) => {
    return typeof obj === 'object' && obj !== null && 'type' in obj;
};
export const isAsyncAction = (obj) => {
    return isAction(obj) && 'payload' in obj && obj.payload instanceof Promise;
};
