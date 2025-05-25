/**
 * View Distance Optimizer
 *
 * Optimizes rendering based on viewing distance.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';
import { LODManager, LODLevel } from './LODManager';
import { LODTransitionSystem, TransitionMethod } from './LODTransitionSystem';

/**
 * Distance threshold
 */
export interface DistanceThreshold {
  /** Minimum distance */
  min: number;
  
  /** Maximum distance */
  max: number;
  
  /** LOD level */
  level: LODLevel;
}

/**
 * View Distance Optimizer Options
 */
export interface ViewDistanceOptimizerOptions {
  /** Distance thresholds */
  thresholds?: DistanceThreshold[];
  
  /** Enable transitions */
  enableTransitions?: boolean;
  
  /** Transition method */
  transitionMethod?: TransitionMethod;
  
  /** Transition duration */
  transitionDuration?: number;
  
  /** Update interval (ms) */
  updateInterval?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default distance thresholds
 */
const defaultThresholds: DistanceThreshold[] = [
  {
    min: 0,
    max: 50,
    level: {
      id: 'ultra',
      distance: 50,
      geometryDetail: 1.0,
      textureDetail: 1.0,
      particleMultiplier: 1.0,
      effectDetail: 1.0,
    },
  },
  {
    min: 50,
    max: 100,
    level: {
      id: 'high',
      distance: 100,
      geometryDetail: 0.75,
      textureDetail: 0.75,
      particleMultiplier: 0.75,
      effectDetail: 0.75,
    },
  },
  {
    min: 100,
    max: 200,
    level: {
      id: 'medium',
      distance: 200,
      geometryDetail: 0.5,
      textureDetail: 0.5,
      particleMultiplier: 0.5,
      effectDetail: 0.5,
    },
  },  {
    min: 200,
    max: 500,
    level: {
      id: 'low',
      distance: 500,
      geometryDetail: 0.25,
      textureDetail: 0.25,
      particleMultiplier: 0.25,
      effectDetail: 0.25,
    },
  },
  {
    min: 500,
    max: Infinity,
    level: {
      id: 'minimal',
      distance: Infinity,
      geometryDetail: 0.1,
      textureDetail: 0.1,
      particleMultiplier: 0.1,
      effectDetail: 0.1,
    },
  },
];

/**
 * Default options
 */
const defaultOptions: ViewDistanceOptimizerOptions = {
  thresholds: defaultThresholds,
  enableTransitions: true,
  transitionMethod: TransitionMethod.FADE,
  transitionDuration: 0.5,
  updateInterval: 1000,
  debugMode: false,
};

/**
 * Object distance data
 */
interface ObjectDistanceData {
  /** Object */
  object: THREE.Object3D;
  
  /** Distance to camera */
  distance: number;
  
  /** Current LOD level */
  currentLevel: LODLevel;
  
  /** Target LOD level */
  targetLevel: LODLevel;
  
  /** Active transition ID */
  activeTransitionId?: string;
}

/**
 * View Distance Optimizer
 */
export class ViewDistanceOptimizer {
  /** Options */
  private options: ViewDistanceOptimizerOptions;
  
  /** LOD manager */
  private lodManager: LODManager;
  
  /** LOD transition system */
  private transitionSystem: LODTransitionSystem;
  
  /** Object distance data */
  private objectDistanceData: Map<string, ObjectDistanceData> = new Map();
  
  /** Update timer */
  private updateTimer: number | null = null;  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /**
   * Constructor
   * @param lodManager - LOD manager
   * @param transitionSystem - LOD transition system
   * @param options - View distance optimizer options
   */
  constructor(
    lodManager: LODManager,
    transitionSystem: LODTransitionSystem,
    options: ViewDistanceOptimizerOptions = {}
  ) {
    this.lodManager = lodManager;
    this.transitionSystem = transitionSystem;
    
    this.options = {
      ...defaultOptions,
      ...options,
    };
    
    this.log('View Distance Optimizer initialized');
  }
  
  /**
   * Initialize the view distance optimizer
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    // Initialize LOD manager
    this.lodManager.initialize();
    
    // Initialize transition system
    this.transitionSystem.initialize();
    
    // Start update timer
    this.startUpdateTimer();
    
    // Mark as initialized
    this.isInitialized = true;
    
    this.log('View Distance Optimizer started');
  }
  
  /**
   * Start update timer
   */
  private startUpdateTimer(): void {
    // Clear existing timer
    this.stopUpdateTimer();
    
    // Start new timer
    this.updateTimer = window.setInterval(() => {
      this.transitionSystem.update();
      this.transitionSystem.clearCompletedTransitions();
    }, this.options.updateInterval);
  }  
  /**
   * Stop update timer
   */
  private stopUpdateTimer(): void {
    if (this.updateTimer !== null) {
      window.clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }
  
  /**
   * Register object
   * @param object - Object to register
   * @returns Object ID
   */
  registerObject(object: THREE.Object3D): string {
    // Generate object ID
    const objectId = `object-${object.uuid}`;
    
    // Register with LOD manager
    this.lodManager.registerObject(object, 'mesh');
    
    // Create object distance data
    const objectDistanceData: ObjectDistanceData = {
      object,
      distance: Infinity,
      currentLevel: this.options.thresholds![0].level,
      targetLevel: this.options.thresholds![0].level,
    };
    
    // Store object distance data
    this.objectDistanceData.set(objectId, objectDistanceData);
    
    this.log(`Registered object: ${objectId}`);
    
    return objectId;
  }
  
  /**
   * Unregister object
   * @param objectId - Object ID
   * @returns Success
   */
  unregisterObject(objectId: string): boolean {
    if (!this.objectDistanceData.has(objectId)) {
      return false;
    }
    
    // Get object distance data
    const objectDistanceData = this.objectDistanceData.get(objectId)!;
    
    // Unregister from LOD manager
    this.lodManager.unregisterObject(objectId);
    
    // Cancel active transition
    if (objectDistanceData.activeTransitionId) {
      this.transitionSystem.cancelTransition(objectDistanceData.activeTransitionId);
    }
    
    // Remove object distance data
    this.objectDistanceData.delete(objectId);
    
    this.log(`Unregistered object: ${objectId}`);
    
    return true;
  }  
  /**
   * Update object distances
   * @param camera - Camera
   */
  updateDistances(camera: THREE.Camera): void {
    // Get camera position
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
    
    // Update each object
    this.objectDistanceData.forEach((objectDistanceData, objectId) => {
      // Get object position
      const objectPosition = new THREE.Vector3();
      objectDistanceData.object.getWorldPosition(objectPosition);
      
      // Calculate distance to camera
      const distance = objectPosition.distanceTo(cameraPosition);
      
      // Update distance
      objectDistanceData.distance = distance;
      
      // Find appropriate LOD level
      const level = this.findLODLevel(distance);
      
      // Update target level
      objectDistanceData.targetLevel = level;
      
      // Check if level changed
      if (level.id !== objectDistanceData.currentLevel.id) {
        this.applyLODLevel(objectId, objectDistanceData);
      }
    });
  }
  
  /**
   * Find appropriate LOD level for distance
   * @param distance - Distance to camera
   * @returns LOD level
   */
  private findLODLevel(distance: number): LODLevel {
    // Find threshold for distance
    for (const threshold of this.options.thresholds!) {
      if (distance >= threshold.min && distance < threshold.max) {
        return threshold.level;
      }
    }
    
    // Return last level if no match
    return this.options.thresholds![this.options.thresholds!.length - 1].level;
  }  
  /**
   * Apply LOD level to object
   * @param objectId - Object ID
   * @param objectDistanceData - Object distance data
   */
  private applyLODLevel(objectId: string, objectDistanceData: ObjectDistanceData): void {
    // Cancel active transition
    if (objectDistanceData.activeTransitionId) {
      this.transitionSystem.cancelTransition(objectDistanceData.activeTransitionId);
      objectDistanceData.activeTransitionId = undefined;
    }
    
    // Apply LOD level
    this.lodManager.applyLODLevel(objectId, objectDistanceData.targetLevel);
    
    // Start transition if enabled
    if (this.options.enableTransitions) {
      const transitionId = this.transitionSystem.startTransition(
        objectDistanceData.object,
        objectDistanceData.currentLevel,
        objectDistanceData.targetLevel,
        {
          method: this.options.transitionMethod,
          duration: this.options.transitionDuration,
        }
      );
      
      objectDistanceData.activeTransitionId = transitionId;
    }
    
    // Update current level
    objectDistanceData.currentLevel = objectDistanceData.targetLevel;
    
    this.log(`Applied LOD level ${objectDistanceData.currentLevel.id} to object ${objectId}`);
  }
  
  /**
   * Get object distance
   * @param objectId - Object ID
   * @returns Distance to camera
   */
  getObjectDistance(objectId: string): number | null {
    if (!this.objectDistanceData.has(objectId)) {
      return null;
    }
    
    return this.objectDistanceData.get(objectId)!.distance;
  }  
  /**
   * Get object LOD level
   * @param objectId - Object ID
   * @returns LOD level
   */
  getObjectLODLevel(objectId: string): LODLevel | null {
    if (!this.objectDistanceData.has(objectId)) {
      return null;
    }
    
    return this.objectDistanceData.get(objectId)!.currentLevel;
  }
  
  /**
   * Set distance thresholds
   * @param thresholds - Distance thresholds
   */
  setDistanceThresholds(thresholds: DistanceThreshold[]): void {
    this.options.thresholds = thresholds;
    
    this.log('Updated distance thresholds');
  }
  
  /**
   * Set transition options
   * @param enableTransitions - Enable transitions
   * @param transitionMethod - Transition method
   * @param transitionDuration - Transition duration
   */
  setTransitionOptions(
    enableTransitions: boolean,
    transitionMethod?: TransitionMethod,
    transitionDuration?: number
  ): void {
    this.options.enableTransitions = enableTransitions;
    
    if (transitionMethod !== undefined) {
      this.options.transitionMethod = transitionMethod;
    }
    
    if (transitionDuration !== undefined) {
      this.options.transitionDuration = transitionDuration;
    }
    
    this.log('Updated transition options');
  }
  
  /**
   * Dispose resources
   */
  dispose(): void {
    // Stop update timer
    this.stopUpdateTimer();
    
    // Dispose transition system
    this.transitionSystem.dispose();
    
    // Dispose LOD manager
    this.lodManager.dispose();
    
    // Clear object distance data
    this.objectDistanceData.clear();
    
    // Mark as not initialized
    this.isInitialized = false;
    
    this.log('View Distance Optimizer disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[ViewDistanceOptimizer] ${message}`);
    }
  }
}

export { ViewDistanceOptimizer };