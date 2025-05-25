/**
 * Store Types
 * 
 * This module provides type definitions for state management.
 * 
 * @version 1.0.0
 */

import { User, UserSettings, UserNotification, UserPreferences } from './user';
import { QuantumState } from './quantum';
import { ConsciousnessStream, ConsciousnessStreamPacket } from './consciousness';
import { NeuralFabric } from './neural';
import { Notification } from './ui';

/**
 * Auth state interface
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

/**
 * Settings state interface
 */
export interface SettingsState extends UserSettings {
  // Actions
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

/**
 * UI state interface
 */
export interface UIState {
  isNavOpen: boolean;
  activeStarSystem: string | null;
  activeFeature: string | null;
  isLoading: boolean;
  loadingMessage: string;
  notifications: Notification[];
  
  // Actions
  toggleNav: () => void;
  setActiveStarSystem: (starSystem: string | null) => void;
  setActiveFeature: (feature: string | null) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

/**
 * Quantum state interface
 */
export interface QuantumStoreState {
  states: Record<string, QuantumState>;
  activeStateId: string | null;
  coherenceScore: number;
  isProcessing: boolean;
  
  // Actions
  createState: (type: string, properties: Record<string, any>) => string;
  updateState: (id: string, properties: Partial<Record<string, any>>) => void;
  deleteState: (id: string) => void;
  entangleStates: (sourceId: string, targetId: string) => void;
  disentangleStates: (sourceId: string, targetId: string) => void;
  setActiveState: (id: string | null) => void;
  calculateCoherence: () => number;
}

/**
 * Consciousness state interface
 */
export interface ConsciousnessStoreState {
  streams: Record<string, ConsciousnessStream>;
  activeStreamId: string | null;
  packets: Record<string, ConsciousnessStreamPacket>;
  isProcessing: boolean;
  
  // Actions
  createStream: (name: string, type: string, properties: Record<string, any>) => string;
  updateStream: (id: string, properties: Partial<Record<string, any>>) => void;
  deleteStream: (id: string) => void;
  setActiveStream: (id: string | null) => void;
  sendPacket: <T>(streamId: string, data: T, options?: any) => string;
  getStreamPackets: (streamId: string) => ConsciousnessStreamPacket[];
}

/**
 * Neural fabric state interface
 */
export interface NeuralFabricStoreState {
  fabrics: Record<string, NeuralFabric>;
  activeFabricId: string | null;
  isProcessing: boolean;
  
  // Actions
  createFabric: (name: string, properties: Record<string, any>) => string;
  updateFabric: (id: string, properties: Partial<Record<string, any>>) => void;
  deleteFabric: (id: string) => void;
  setActiveFabric: (id: string | null) => void;
  createNode: (fabricId: string, name: string, type: string, properties: Record<string, any>) => string;
  createConnection: (fabricId: string, sourceNodeId: string, targetNodeId: string, strength: number, type: string) => string;
  createPathway: (fabricId: string, name: string, nodeIds: string[], connectionIds: string[]) => string;
}