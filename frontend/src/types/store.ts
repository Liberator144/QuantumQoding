/**
 * Store Types
 *
 * This module provides type definitions for state management.
 *
 * @version 1.0.0
 */

// Store State Types
export interface RootState {
  user: UserState;
  ui: UIState;
  consciousness: ConsciousnessState;
  quantum: QuantumState;
  neural: NeuralState;
  dimensional: DimensionalState;
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  preferences: UserPreferences;
}

export interface UIState {
  theme: 'light' | 'dark' | 'quantum';
  sidebarOpen: boolean;
  modalStack: Modal[];
  notifications: Notification[];
  loading: LoadingState;
}

export interface ConsciousnessState {
  currentStream: ConsciousnessStream | null;
  coherenceLevel: number;
  streamHistory: ConsciousnessStream[];
  isActive: boolean;
  lastSync: Date | null;
}

export interface QuantumState {
  entanglements: QuantumEntanglement[];
  superpositions: QuantumSuperposition[];
  coherenceMatrix: CoherenceMatrix;
  dimensionalPhase: number;
  isQuantumActive: boolean;
}

export interface NeuralState {
  networks: NeuralNetwork[];
  activeConnections: NeuralConnection[];
  learningRate: number;
  trainingData: TrainingDataset[];
  modelPerformance: ModelMetrics;
}

export interface DimensionalState {
  currentDimension: number;
  availableDimensions: Dimension[];
  transitions: DimensionalTransition[];
  stability: number;
  harmonics: DimensionalHarmonic[];
}

// Action Types
export interface Action<T = unknown> {
  type: string;
  payload?: T;
  meta?: ActionMeta;
}

export interface ActionMeta {
  timestamp: Date;
  source: string;
  quantumSignature?: string;
}

// Store Configuration
export interface StoreConfig {
  middleware: Middleware[];
  enhancers: StoreEnhancer[];
  devTools: boolean;
  preloadedState?: Partial<RootState>;
  quantumMode: boolean;
}

export type Middleware = (store: Store) => (next: Dispatch) => (action: Action) => unknown;
export type StoreEnhancer = (createStore: StoreCreator) => StoreCreator;
export type StoreCreator = (reducer: Reducer, preloadedState?: unknown) => Store;
export type Reducer<S = unknown, A extends Action = Action> = (state: S | undefined, action: A) => S;
export type Dispatch = (action: Action) => Action;

export interface Store {
  getState: () => RootState;
  dispatch: Dispatch;
  subscribe: (listener: () => void) => () => void;
  replaceReducer: (nextReducer: Reducer) => void;
}

// Selector Types
export type Selector<T> = (state: RootState) => T;
export type ParametricSelector<T, P> = (state: RootState, props: P) => T;

// Async Action Types
export interface AsyncAction<T = unknown> {
  type: string;
  payload: Promise<T>;
  meta?: ActionMeta;
}

export interface ThunkAction<R = void, S = RootState, E = unknown, A extends Action = Action> {
  (dispatch: ThunkDispatch<S, E, A>, getState: () => S, extraArgument: E): R;
}

export type ThunkDispatch<S, E, A extends Action> = (action: A | ThunkAction<void, S, E, A>) => void;

// Quantum Store Types
export interface QuantumStore extends Store {
  getQuantumState: () => QuantumState;
  entangle: (targetStore: QuantumStore) => void;
  superpose: (states: RootState[]) => void;
  collapse: () => RootState;
}

// Type Guards
export const isAction = (obj: unknown): obj is Action => {
  return typeof obj === 'object' && obj !== null && 'type' in obj;
};

export const isAsyncAction = (obj: unknown): obj is AsyncAction => {
  return isAction(obj) && 'payload' in obj && obj.payload instanceof Promise;
};