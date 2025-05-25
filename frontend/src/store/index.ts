/**
 * Store Module
 * 
 * This module exports the quantum-coherent state management for the QQ-Verse project.
 * These stores maintain quantum state preservation across different dimensional spaces.
 * 
 * @version 1.0.0
 */

// Export store hooks
export { useAuthStore } from './authStore';
export { useSettingsStore } from './settingsStore';
export { useUIStore } from './uiStore';
export { useQuantumStore } from './quantumStore';

// Export store types
export type { AuthState } from './authStore';
export type { SettingsState } from './settingsStore';
export type { UIState } from './uiStore';
export type { QuantumState } from './quantumStore';