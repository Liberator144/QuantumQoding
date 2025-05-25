/**
 * Visualization Utilities
 *
 * This module exports utility functions and classes for the visualization engine.
 *
 * @version 1.0.0
 */

export { PerformanceOptimizer, OptimizationLevel } from './PerformanceOptimizer';
export type { PerformanceMetrics, PerformanceOptimizerOptions } from './PerformanceOptimizer';

export { LODManager } from './LODManager';
export type { LODLevel, LODObject, LODManagerOptions } from './LODManager';

export { ModelSimplifier, SimplificationMethod } from './ModelSimplifier';
export type { SimplificationOptions } from './ModelSimplifier';

export { LODTransitionSystem, TransitionMethod, TransitionState } from './LODTransitionSystem';
export type { TransitionOptions } from './LODTransitionSystem';

export { ViewDistanceOptimizer } from './ViewDistanceOptimizer';
export type { DistanceThreshold, ViewDistanceOptimizerOptions } from './ViewDistanceOptimizer';

export { VirtualRenderer, CullingMethod } from './VirtualRenderer';
export type { VirtualRendererOptions } from './VirtualRenderer';

export { BufferZoneManager } from './BufferZoneManager';
export type { BufferZone, BufferZoneManagerOptions } from './BufferZoneManager';

export { OcclusionCullingSystem, OcclusionCullingMethod } from './OcclusionCullingSystem';
export type { OcclusionCullingOptions } from './OcclusionCullingSystem';

export { UniversePartitioner, SectorType } from './UniversePartitioner';
export type { SectorCoordinates, Sector, UniversePartitionerOptions } from './UniversePartitioner';

export { ConsciousnessStreamTester, ConsciousnessEventType } from './ConsciousnessStreamTester';
export type { 
  ConsciousnessEvent, 
  ConsciousnessCheckpoint, 
  ConsciousnessStreamTestResult 
} from './ConsciousnessStreamTester';

export { ConsciousnessStreamMonitor } from './ConsciousnessStreamMonitor';
export type { ConsciousnessStreamMonitorOptions } from './ConsciousnessStreamMonitor';

export { colorUtils } from './colorUtils';
export type { RGB, HSL } from './colorUtils';