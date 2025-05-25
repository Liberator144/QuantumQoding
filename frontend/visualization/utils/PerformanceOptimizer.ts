/**
 * Performance Optimizer
 *
 * Provides performance optimization utilities for the visualization engine.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';

/**
 * Performance Optimization Level
 */
export enum OptimizationLevel {
  /** No optimization */
  NONE = 'none',
  
  /** Low optimization */
  LOW = 'low',
  
  /** Medium optimization */
  MEDIUM = 'medium',
  
  /** High optimization */
  HIGH = 'high',
  
  /** Ultra optimization */
  ULTRA = 'ultra',
  
  /** Adaptive optimization */
  ADAPTIVE = 'adaptive',
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  /** Frames per second */
  fps: number;
  
  /** Frame time (ms) */
  frameTime: number;
  
  /** Memory usage (MB) */
  memoryUsage: number;
  
  /** Entity count */
  entityCount: number;
  
  /** Draw calls */
  drawCalls: number;
  
  /** Triangle count */
  triangleCount: number;
  
  /** Texture memory (MB) */
  textureMemory: number;
  
  /** Geometry memory (MB) */
  geometryMemory: number;
  
  /** Last update timestamp */
  timestamp: number;
}

/**
 * Performance Optimizer Options
 */
export interface PerformanceOptimizerOptions {
  /** Target FPS */
  targetFPS?: number;
  
  /** Minimum FPS */
  minFPS?: number;
  
  /** Maximum entity count */
  maxEntityCount?: number;
  
  /** Maximum triangle count */
  maxTriangleCount?: number;
  
  /** Maximum texture memory (MB) */
  maxTextureMemory?: number;
  
  /** Maximum geometry memory (MB) */
  maxGeometryMemory?: number;
  
  /** Optimization level */
  optimizationLevel?: OptimizationLevel;
  
  /** Enable instancing */
  enableInstancing?: boolean;
  
  /** Enable frustum culling */
  enableFrustumCulling?: boolean;
  
  /** Enable occlusion culling */
  enableOcclusionCulling?: boolean;
  
  /** Enable level of detail */
  enableLOD?: boolean;
  
  /** Enable texture compression */
  enableTextureCompression?: boolean;
  
  /** Enable geometry compression */
  enableGeometryCompression?: boolean;
  
  /** Enable shader optimization */
  enableShaderOptimization?: boolean;
  
  /** Enable worker threads */
  enableWorkerThreads?: boolean;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default options
 */
const defaultOptions: PerformanceOptimizerOptions = {
  targetFPS: 60,
  minFPS: 30,
  maxEntityCount: 10000,
  maxTriangleCount: 1000000,
  maxTextureMemory: 512,
  maxGeometryMemory: 256,
  optimizationLevel: OptimizationLevel.ADAPTIVE,
  enableInstancing: true,
  enableFrustumCulling: true,
  enableOcclusionCulling: false,
  enableLOD: true,
  enableTextureCompression: true,
  enableGeometryCompression: true,
  enableShaderOptimization: true,
  enableWorkerThreads: false,
  debugMode: false,
};/**
 * Performance Optimizer
 */
export class PerformanceOptimizer {
  /** Options */
  private options: PerformanceOptimizerOptions;
  
  /** Performance metrics */
  private metrics: PerformanceMetrics;
  
  /** FPS history */
  private fpsHistory: number[] = [];
  
  /** FPS history max length */
  private readonly FPS_HISTORY_LENGTH = 60;
  
  /** Last frame timestamp */
  private lastFrameTime: number = 0;
  
  /** Frame count */
  private frameCount: number = 0;
  
  /** Last FPS update timestamp */
  private lastFPSUpdate: number = 0;
  
  /** FPS update interval (ms) */
  private readonly FPS_UPDATE_INTERVAL = 1000;
  
  /** Optimization level history */
  private optimizationLevelHistory: OptimizationLevel[] = [];
  
  /** Optimization level history max length */
  private readonly OPTIMIZATION_LEVEL_HISTORY_LENGTH = 10;
  
  /** Instanced meshes */
  private instancedMeshes: Map<string, THREE.InstancedMesh> = new Map();
  
  /** Geometry cache */
  private geometryCache: Map<string, THREE.BufferGeometry> = new Map();
  
  /** Material cache */
  private materialCache: Map<string, THREE.Material> = new Map();
  
  /** Texture cache */
  private textureCache: Map<string, THREE.Texture> = new Map();
  
  /** LOD models */
  private lodModels: Map<string, THREE.LOD> = new Map();
  
  /** Worker threads */
  private workers: Worker[] = [];
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /**
   * Constructor
   * @param options - Performance optimizer options
   */
  constructor(options: PerformanceOptimizerOptions = {}) {
    // Merge options
    this.options = {
      ...defaultOptions,
      ...options,
    };
    
    // Initialize metrics
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      entityCount: 0,
      drawCalls: 0,
      triangleCount: 0,
      textureMemory: 0,
      geometryMemory: 0,
      timestamp: Date.now(),
    };
  }  
  /**
   * Initialize the performance optimizer
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    // Initialize caches
    this.initializeCaches();
    
    // Initialize worker threads
    if (this.options.enableWorkerThreads) {
      this.initializeWorkers();
    }
    
    // Mark as initialized
    this.isInitialized = true;
    
    this.log('Performance Optimizer initialized');
  }
  
  /**
   * Initialize caches
   */
  private initializeCaches(): void {
    // Clear caches
    this.geometryCache.clear();
    this.materialCache.clear();
    this.textureCache.clear();
    this.instancedMeshes.clear();
    this.lodModels.clear();
    
    this.log('Caches initialized');
  }
  
  /**
   * Initialize worker threads
   */
  private initializeWorkers(): void {
    // Clear workers
    this.terminateWorkers();
    
    // Create workers
    const workerCount = navigator.hardwareConcurrency || 4;
    
    for (let i = 0; i < workerCount; i++) {
      try {
        const worker = new Worker(new URL('./workers/VisualizationWorker.ts', import.meta.url));
        this.workers.push(worker);
      } catch (error) {
        this.log(`Error creating worker: ${(error as Error).message}`);
      }
    }
    
    this.log(`Created ${this.workers.length} worker threads`);
  }
  
  /**
   * Terminate worker threads
   */
  private terminateWorkers(): void {
    // Terminate workers
    for (const worker of this.workers) {
      worker.terminate();
    }
    
    // Clear workers
    this.workers = [];
    
    this.log('Worker threads terminated');
  }  
  /**
   * Update performance metrics
   * @param renderer - THREE.WebGLRenderer instance
   * @param scene - THREE.Scene instance
   * @param entityCount - Entity count
   */
  updateMetrics(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    entityCount: number
  ): void {
    // Calculate FPS
    const now = performance.now();
    const elapsed = now - this.lastFrameTime;
    this.lastFrameTime = now;
    
    // Update frame count
    this.frameCount++;
    
    // Update FPS every second
    if (now - this.lastFPSUpdate > this.FPS_UPDATE_INTERVAL) {
      // Calculate FPS
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFPSUpdate));
      
      // Update FPS history
      this.fpsHistory.push(fps);
      if (this.fpsHistory.length > this.FPS_HISTORY_LENGTH) {
        this.fpsHistory.shift();
      }
      
      // Calculate average FPS
      const avgFPS = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
      
      // Reset frame count and last update time
      this.frameCount = 0;
      this.lastFPSUpdate = now;
      
      // Get renderer info
      const info = renderer.info;
      
      // Update metrics
      this.metrics = {
        fps: avgFPS,
        frameTime: elapsed,
        memoryUsage: this.getMemoryUsage(),
        entityCount,
        drawCalls: info.render?.calls || 0,
        triangleCount: info.render?.triangles || 0,
        textureMemory: this.getTextureMemory(renderer),
        geometryMemory: this.getGeometryMemory(scene),
        timestamp: Date.now(),
      };
      
      // Adaptive optimization
      if (this.options.optimizationLevel === OptimizationLevel.ADAPTIVE) {
        this.adaptOptimizationLevel();
      }
    }
  }  
  /**
   * Get memory usage in MB
   * @returns Memory usage in MB
   */
  private getMemoryUsage(): number {
    if (window.performance && window.performance.memory) {
      return Math.round((window.performance.memory.usedJSHeapSize / 1048576) * 100) / 100;
    }
    
    return 0;
  }
  
  /**
   * Get texture memory in MB
   * @param renderer - THREE.WebGLRenderer instance
   * @returns Texture memory in MB
   */
  private getTextureMemory(renderer: THREE.WebGLRenderer): number {
    // Estimate texture memory
    let textureMemory = 0;
    
    // Get textures from cache
    this.textureCache.forEach((texture) => {
      if (texture.image) {
        const width = texture.image.width || 0;
        const height = texture.image.height || 0;
        const bytesPerPixel = 4; // RGBA
        
        textureMemory += (width * height * bytesPerPixel) / 1048576; // Convert to MB
      }
    });
    
    return Math.round(textureMemory * 100) / 100;
  }
  
  /**
   * Get geometry memory in MB
   * @param scene - THREE.Scene instance
   * @returns Geometry memory in MB
   */
  private getGeometryMemory(scene: THREE.Scene): number {
    // Estimate geometry memory
    let geometryMemory = 0;
    
    // Get geometries from cache
    this.geometryCache.forEach((geometry) => {
      if (geometry.attributes) {
        Object.values(geometry.attributes).forEach((attribute: any) => {
          if (attribute.array) {
            geometryMemory += (attribute.array.length * 4) / 1048576; // Convert to MB (assuming Float32Array)
          }
        });
      }
    });
    
    return Math.round(geometryMemory * 100) / 100;
  }  
  /**
   * Adapt optimization level based on performance metrics
   */
  private adaptOptimizationLevel(): void {
    // Get current FPS
    const currentFPS = this.metrics.fps;
    
    // Get target and minimum FPS
    const targetFPS = this.options.targetFPS || 60;
    const minFPS = this.options.minFPS || 30;
    
    // Determine optimization level
    let newLevel: OptimizationLevel;
    
    if (currentFPS >= targetFPS * 1.2) {
      // FPS is well above target, reduce optimization
      newLevel = OptimizationLevel.LOW;
    } else if (currentFPS >= targetFPS) {
      // FPS is at or above target, maintain current level
      newLevel = OptimizationLevel.MEDIUM;
    } else if (currentFPS >= minFPS) {
      // FPS is below target but above minimum, increase optimization
      newLevel = OptimizationLevel.HIGH;
    } else {
      // FPS is below minimum, maximize optimization
      newLevel = OptimizationLevel.ULTRA;
    }
    
    // Update optimization level history
    this.optimizationLevelHistory.push(newLevel);
    if (this.optimizationLevelHistory.length > this.OPTIMIZATION_LEVEL_HISTORY_LENGTH) {
      this.optimizationLevelHistory.shift();
    }
    
    // Only change optimization level if it's been consistent for a few frames
    const mostFrequentLevel = this.getMostFrequentOptimizationLevel();
    
    if (mostFrequentLevel !== this.options.optimizationLevel) {
      this.setOptimizationLevel(mostFrequentLevel);
    }
  }
  
  /**
   * Get most frequent optimization level from history
   * @returns Most frequent optimization level
   */
  private getMostFrequentOptimizationLevel(): OptimizationLevel {
    // Count occurrences
    const counts = new Map<OptimizationLevel, number>();
    
    for (const level of this.optimizationLevelHistory) {
      counts.set(level, (counts.get(level) || 0) + 1);
    }
    
    // Find most frequent
    let mostFrequent: OptimizationLevel = OptimizationLevel.MEDIUM;
    let maxCount = 0;
    
    counts.forEach((count, level) => {
      if (count > maxCount) {
        mostFrequent = level;
        maxCount = count;
      }
    });
    
    return mostFrequent;
  }  
  /**
   * Set optimization level
   * @param level - Optimization level
   */
  setOptimizationLevel(level: OptimizationLevel): void {
    // Update options
    this.options.optimizationLevel = level;
    
    // Apply optimization settings based on level
    switch (level) {
      case OptimizationLevel.NONE:
        this.options.enableInstancing = false;
        this.options.enableFrustumCulling = false;
        this.options.enableOcclusionCulling = false;
        this.options.enableLOD = false;
        this.options.enableTextureCompression = false;
        this.options.enableGeometryCompression = false;
        this.options.enableShaderOptimization = false;
        this.options.enableWorkerThreads = false;
        break;
        
      case OptimizationLevel.LOW:
        this.options.enableInstancing = true;
        this.options.enableFrustumCulling = true;
        this.options.enableOcclusionCulling = false;
        this.options.enableLOD = false;
        this.options.enableTextureCompression = true;
        this.options.enableGeometryCompression = false;
        this.options.enableShaderOptimization = false;
        this.options.enableWorkerThreads = false;
        break;
        
      case OptimizationLevel.MEDIUM:
        this.options.enableInstancing = true;
        this.options.enableFrustumCulling = true;
        this.options.enableOcclusionCulling = false;
        this.options.enableLOD = true;
        this.options.enableTextureCompression = true;
        this.options.enableGeometryCompression = true;
        this.options.enableShaderOptimization = false;
        this.options.enableWorkerThreads = false;
        break;
        
      case OptimizationLevel.HIGH:
        this.options.enableInstancing = true;
        this.options.enableFrustumCulling = true;
        this.options.enableOcclusionCulling = true;
        this.options.enableLOD = true;
        this.options.enableTextureCompression = true;
        this.options.enableGeometryCompression = true;
        this.options.enableShaderOptimization = true;
        this.options.enableWorkerThreads = false;
        break;        
      case OptimizationLevel.ULTRA:
        this.options.enableInstancing = true;
        this.options.enableFrustumCulling = true;
        this.options.enableOcclusionCulling = true;
        this.options.enableLOD = true;
        this.options.enableTextureCompression = true;
        this.options.enableGeometryCompression = true;
        this.options.enableShaderOptimization = true;
        this.options.enableWorkerThreads = true;
        break;
        
      default:
        // Keep current settings
        break;
    }
    
    this.log(`Set optimization level: ${level}`);
  }
  
  /**
   * Optimize scene
   * @param scene - THREE.Scene instance
   * @param camera - THREE.Camera instance
   */
  optimizeScene(scene: THREE.Scene, camera: THREE.Camera): void {
    // Apply optimizations based on current level
    if (this.options.enableFrustumCulling) {
      this.applyFrustumCulling(scene, camera);
    }
    
    if (this.options.enableOcclusionCulling) {
      this.applyOcclusionCulling(scene, camera);
    }
    
    if (this.options.enableLOD) {
      this.updateLOD(camera);
    }
  }
  
  /**
   * Apply frustum culling
   * @param scene - THREE.Scene instance
   * @param camera - THREE.Camera instance
   */
  private applyFrustumCulling(scene: THREE.Scene, camera: THREE.Camera): void {
    // Create frustum
    const frustum = new THREE.Frustum();
    const projScreenMatrix = new THREE.Matrix4();
    
    // Update projection matrix
    camera.updateMatrixWorld();
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);
    
    // Traverse scene and cull objects
    scene.traverse((object) => {
      if (object.type === 'Mesh' || object.type === 'Line' || object.type === 'Points') {
        // Skip if no geometry or no bounding sphere
        if (!object.geometry || !object.geometry.boundingSphere) {
          return;
        }
        
        // Update world matrix
        object.updateMatrixWorld();
        
        // Get bounding sphere in world space
        const boundingSphere = object.geometry.boundingSphere.clone();
        boundingSphere.applyMatrix4(object.matrixWorld);
        
        // Check if in frustum
        const visible = frustum.intersectsSphere(boundingSphere);
        
        // Update visibility
        if (object.visible !== visible) {
          object.visible = visible;
        }
      }
    });
  }  
  /**
   * Apply occlusion culling
   * @param scene - THREE.Scene instance
   * @param camera - THREE.Camera instance
   */
  private applyOcclusionCulling(scene: THREE.Scene, camera: THREE.Camera): void {
    // Simple occlusion culling based on distance and size
    // More advanced occlusion culling would require a hierarchical Z-buffer or similar
    
    // Get camera position
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
    
    // Sort objects by distance to camera
    const objects: { object: THREE.Object3D; distance: number }[] = [];
    
    scene.traverse((object) => {
      if (object.type === 'Mesh' || object.type === 'Line' || object.type === 'Points') {
        // Skip if no geometry or no bounding sphere
        if (!object.geometry || !object.geometry.boundingSphere) {
          return;
        }
        
        // Update world matrix
        object.updateMatrixWorld();
        
        // Get object position
        const position = new THREE.Vector3();
        object.getWorldPosition(position);
        
        // Calculate distance to camera
        const distance = position.distanceTo(cameraPosition);
        
        // Add to objects array
        objects.push({ object, distance });
      }
    });
    
    // Sort objects by distance (closest first)
    objects.sort((a, b) => a.distance - b.distance);
    
    // Simple occlusion: hide small distant objects that are likely occluded
    for (let i = 0; i < objects.length; i++) {
      const { object, distance } = objects[i];
      
      // Get bounding sphere radius in world space
      const boundingSphere = (object as THREE.Mesh).geometry.boundingSphere.clone();
      const scale = new THREE.Vector3();
      object.getWorldScale(scale);
      const radius = boundingSphere.radius * Math.max(scale.x, scale.y, scale.z);
      
      // Calculate apparent size (solid angle)
      const apparentSize = radius / distance;
      
      // Hide small distant objects
      if (apparentSize < 0.01 && distance > 100) {
        object.visible = false;
      }
    }
  }  
  /**
   * Update level of detail
   * @param camera - THREE.Camera instance
   */
  private updateLOD(camera: THREE.Camera): void {
    // Update LOD models
    this.lodModels.forEach((lod) => {
      lod.update(camera);
    });
  }
  
  /**
   * Create instanced mesh
   * @param geometry - THREE.BufferGeometry instance
   * @param material - THREE.Material instance
   * @param count - Instance count
   * @param key - Cache key
   * @returns Instanced mesh
   */
  createInstancedMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    count: number,
    key: string
  ): THREE.InstancedMesh {
    // Check if instanced mesh already exists
    if (this.instancedMeshes.has(key)) {
      return this.instancedMeshes.get(key)!;
    }
    
    // Create instanced mesh
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    
    // Store in cache
    this.instancedMeshes.set(key, mesh);
    
    return mesh;
  }
  
  /**
   * Create LOD model
   * @param key - Cache key
   * @returns LOD model
   */
  createLOD(key: string): THREE.LOD {
    // Check if LOD model already exists
    if (this.lodModels.has(key)) {
      return this.lodModels.get(key)!;
    }
    
    // Create LOD model
    const lod = new THREE.LOD();
    
    // Store in cache
    this.lodModels.set(key, lod);
    
    return lod;
  }  
  /**
   * Get cached geometry
   * @param key - Cache key
   * @returns Cached geometry or null
   */
  getCachedGeometry(key: string): THREE.BufferGeometry | null {
    return this.geometryCache.get(key) || null;
  }
  
  /**
   * Cache geometry
   * @param key - Cache key
   * @param geometry - Geometry to cache
   */
  cacheGeometry(key: string, geometry: THREE.BufferGeometry): void {
    this.geometryCache.set(key, geometry);
  }
  
  /**
   * Get cached material
   * @param key - Cache key
   * @returns Cached material or null
   */
  getCachedMaterial(key: string): THREE.Material | null {
    return this.materialCache.get(key) || null;
  }
  
  /**
   * Cache material
   * @param key - Cache key
   * @param material - Material to cache
   */
  cacheMaterial(key: string, material: THREE.Material): void {
    this.materialCache.set(key, material);
  }
  
  /**
   * Get cached texture
   * @param key - Cache key
   * @returns Cached texture or null
   */
  getCachedTexture(key: string): THREE.Texture | null {
    return this.textureCache.get(key) || null;
  }
  
  /**
   * Cache texture
   * @param key - Cache key
   * @param texture - Texture to cache
   */
  cacheTexture(key: string, texture: THREE.Texture): void {
    this.textureCache.set(key, texture);
  }  
  /**
   * Optimize geometry
   * @param geometry - Geometry to optimize
   * @returns Optimized geometry
   */
  optimizeGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    // Skip if already optimized
    if (geometry.userData.optimized) {
      return geometry;
    }
    
    // Merge vertices
    if (this.options.enableGeometryCompression) {
      geometry.mergeVertices();
    }
    
    // Compute vertex normals if not present
    if (!geometry.attributes.normal) {
      geometry.computeVertexNormals();
    }
    
    // Compute bounding sphere if not present
    if (!geometry.boundingSphere) {
      geometry.computeBoundingSphere();
    }
    
    // Mark as optimized
    geometry.userData.optimized = true;
    
    return geometry;
  }
  
  /**
   * Get performance metrics
   * @returns Performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Dispose resources
   */
  dispose(): void {
    // Dispose geometries
    this.geometryCache.forEach((geometry) => {
      geometry.dispose();
    });
    
    // Dispose materials
    this.materialCache.forEach((material) => {
      material.dispose();
    });
    
    // Dispose textures
    this.textureCache.forEach((texture) => {
      texture.dispose();
    });
    
    // Clear caches
    this.geometryCache.clear();
    this.materialCache.clear();
    this.textureCache.clear();
    this.instancedMeshes.clear();
    this.lodModels.clear();
    
    // Terminate workers
    this.terminateWorkers();
    
    this.log('Performance Optimizer disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[PerformanceOptimizer] ${message}`);
    }
  }
}

export { PerformanceOptimizer };