/**
 * Occlusion Culling System
 *
 * Provides occlusion culling for efficient rendering of complex scenes.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';

/**
 * Occlusion Culling Method
 */
export enum OcclusionCullingMethod {
  /** Hierarchical Z-Buffer */
  HIERARCHICAL_Z_BUFFER = 'hierarchical_z_buffer',
  
  /** Hardware Occlusion Queries */
  HARDWARE_OCCLUSION_QUERIES = 'hardware_occlusion_queries',
  
  /** Software Occlusion Culling */
  SOFTWARE_OCCLUSION_CULLING = 'software_occlusion_culling',
  
  /** Portal Culling */
  PORTAL_CULLING = 'portal_culling',
  
  /** Cell-Portal Culling */
  CELL_PORTAL_CULLING = 'cell_portal_culling',
}

/**
 * Occlusion Culling Options
 */
export interface OcclusionCullingOptions {
  /** Culling method */
  method?: OcclusionCullingMethod;
  
  /** Occlusion threshold (0.0 - 1.0) */
  occlusionThreshold?: number;
  
  /** Depth texture resolution */
  depthTextureResolution?: number;
  
  /** Update interval (ms) */
  updateInterval?: number;
  
  /** Cull small objects */
  cullSmallObjects?: boolean;
  
  /** Small object threshold */
  smallObjectThreshold?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default options
 */
const defaultOptions: OcclusionCullingOptions = {
  method: OcclusionCullingMethod.HIERARCHICAL_Z_BUFFER,
  occlusionThreshold: 0.8,
  depthTextureResolution: 256,
  updateInterval: 100,
  cullSmallObjects: true,
  smallObjectThreshold: 0.01,
  debugMode: false,
};/**
 * Occlusion data
 */
interface OcclusionData {
  /** Object */
  object: THREE.Object3D;
  
  /** Is occluded */
  isOccluded: boolean;
  
  /** Occlusion query */
  query: WebGLQuery | null;
  
  /** Bounding sphere */
  boundingSphere: THREE.Sphere;
  
  /** Screen space size */
  screenSpaceSize: number;
  
  /** Last update time */
  lastUpdateTime: number;
}

/**
 * Occlusion Culling System
 */
export class OcclusionCullingSystem {
  /** Options */
  private options: OcclusionCullingOptions;
  
  /** Scene */
  private scene: THREE.Scene;
  
  /** Camera */
  private camera: THREE.Camera;
  
  /** Renderer */
  private renderer: THREE.WebGLRenderer;
  
  /** Occlusion renderer */
  private occlusionRenderer: THREE.WebGLRenderer | null = null;
  
  /** Occlusion camera */
  private occlusionCamera: THREE.PerspectiveCamera | null = null;
  
  /** Occlusion render target */
  private occlusionRenderTarget: THREE.WebGLRenderTarget | null = null;
  
  /** Occlusion depth texture */
  private occlusionDepthTexture: THREE.DepthTexture | null = null;
  
  /** Occlusion depth material */
  private occlusionDepthMaterial: THREE.MeshDepthMaterial | null = null;
  
  /** Occlusion data */
  private occlusionData: Map<string, OcclusionData> = new Map();
  
  /** Update timer */
  private updateTimer: number | null = null;
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /** Stats */
  private stats = {
    totalObjects: 0,
    occludedObjects: 0,
    visibleObjects: 0,
    smallObjects: 0,
    updateTime: 0,
  };  
  /**
   * Constructor
   * @param scene - Scene
   * @param camera - Camera
   * @param renderer - Renderer
   * @param options - Options
   */
  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    options: OcclusionCullingOptions = {}
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    
    this.options = {
      ...defaultOptions,
      ...options,
    };
    
    this.log('Occlusion Culling System initialized');
  }
  
  /**
   * Initialize the occlusion culling system
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    // Initialize occlusion culling
    this.initializeOcclusionCulling();
    
    // Register all objects in the scene
    this.registerSceneObjects();
    
    // Start update timer
    this.startUpdateTimer();
    
    // Mark as initialized
    this.isInitialized = true;
    
    this.log('Occlusion Culling System started');
  }
  
  /**
   * Initialize occlusion culling
   */
  private initializeOcclusionCulling(): void {
    // Create occlusion renderer
    this.occlusionRenderer = new THREE.WebGLRenderer({
      canvas: document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') as HTMLCanvasElement,
      context: this.renderer.getContext(),
    });
    
    const resolution = this.options.depthTextureResolution!;
    this.occlusionRenderer.setSize(resolution, resolution);
    
    // Create occlusion camera
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.occlusionCamera = this.camera.clone();
    } else {
      this.occlusionCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    }    
    // Create depth texture
    this.occlusionDepthTexture = new THREE.DepthTexture(resolution, resolution);
    this.occlusionDepthTexture.format = THREE.DepthFormat;
    this.occlusionDepthTexture.type = THREE.UnsignedShortType;
    
    // Create render target
    this.occlusionRenderTarget = new THREE.WebGLRenderTarget(resolution, resolution, {
      depthTexture: this.occlusionDepthTexture,
      depthBuffer: true,
    });
    
    // Create depth material
    this.occlusionDepthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
    });
    
    this.log('Occlusion culling initialized');
  }
  
  /**
   * Register scene objects
   */
  private registerSceneObjects(): void {
    // Clear existing objects
    this.occlusionData.clear();
    
    // Register all objects in the scene
    this.scene.traverse((object) => {
      if (object.visible && !(object instanceof THREE.Camera) && !(object instanceof THREE.Light)) {
        this.registerObject(object);
      }
    });
    
    // Update stats
    this.stats.totalObjects = this.occlusionData.size;
    
    this.log(`Registered ${this.stats.totalObjects} objects`);
  }
  
  /**
   * Register object
   * @param object - Object to register
   */
  registerObject(object: THREE.Object3D): void {
    // Generate object ID
    const objectId = `object-${object.uuid}`;
    
    // Create bounding sphere
    let boundingSphere: THREE.Sphere;
    
    if (object instanceof THREE.Mesh && object.geometry.boundingSphere) {
      // Use geometry bounding sphere
      boundingSphere = object.geometry.boundingSphere.clone();
      boundingSphere.applyMatrix4(object.matrixWorld);
    } else {
      // Create bounding sphere from object position
      const objectPosition = new THREE.Vector3();
      object.getWorldPosition(objectPosition);
      boundingSphere = new THREE.Sphere(objectPosition, 1);
    }    
    // Create occlusion data
    const occlusionData: OcclusionData = {
      object,
      isOccluded: false,
      query: null,
      boundingSphere,
      screenSpaceSize: 0,
      lastUpdateTime: performance.now(),
    };
    
    // Store occlusion data
    this.occlusionData.set(objectId, occlusionData);
    
    // Update stats
    this.stats.totalObjects = this.occlusionData.size;
  }
  
  /**
   * Unregister object
   * @param object - Object to unregister
   */
  unregisterObject(object: THREE.Object3D): void {
    // Generate object ID
    const objectId = `object-${object.uuid}`;
    
    // Remove occlusion data
    this.occlusionData.delete(objectId);
    
    // Update stats
    this.stats.totalObjects = this.occlusionData.size;
  }
  
  /**
   * Start update timer
   */
  private startUpdateTimer(): void {
    // Clear existing timer
    this.stopUpdateTimer();
    
    // Start new timer
    this.updateTimer = window.setInterval(() => {
      this.updateOcclusion();
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
   * Update occlusion
   */
  private updateOcclusion(): void {
    if (!this.isInitialized || 
        !this.occlusionRenderer || 
        !this.occlusionCamera || 
        !this.occlusionRenderTarget || 
        !this.occlusionDepthMaterial) {
      return;
    }
    
    // Start timer
    const startTime = performance.now();    
    // Reset stats
    this.stats.occludedObjects = 0;
    this.stats.visibleObjects = 0;
    this.stats.smallObjects = 0;
    
    // Update occlusion camera
    this.occlusionCamera.position.copy(this.camera.position);
    this.occlusionCamera.rotation.copy(this.camera.rotation);
    this.occlusionCamera.updateMatrixWorld();
    
    // Render depth
    const currentRenderTarget = this.renderer.getRenderTarget();
    const currentMaterials = new Map<THREE.Object3D, THREE.Material | THREE.Material[]>();
    
    // Store original materials
    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        currentMaterials.set(node, node.material);
        node.material = this.occlusionDepthMaterial!;
      }
    });
    
    // Render to occlusion render target
    this.renderer.setRenderTarget(this.occlusionRenderTarget);
    this.renderer.render(this.scene, this.occlusionCamera);
    
    // Update each object
    this.occlusionData.forEach((data, objectId) => {
      // Skip if object is not visible
      if (!data.object.visible) {
        return;
      }
      
      // Calculate screen space size
      data.screenSpaceSize = this.calculateScreenSpaceSize(data.boundingSphere);
      
      // Check if object is small
      if (this.options.cullSmallObjects && 
          data.screenSpaceSize < this.options.smallObjectThreshold!) {
        data.isOccluded = true;
        this.stats.occludedObjects++;
        this.stats.smallObjects++;
        return;
      }
      
      // Check if object is occluded
      data.isOccluded = this.isObjectOccluded(data);
      
      // Update stats
      if (data.isOccluded) {
        this.stats.occludedObjects++;
      } else {
        this.stats.visibleObjects++;
      }
      
      // Update last update time
      data.lastUpdateTime = performance.now();
    });
    
    // Restore original materials
    currentMaterials.forEach((material, node) => {
      (node as THREE.Mesh).material = material;
    });    
    // Restore render target
    this.renderer.setRenderTarget(currentRenderTarget);
    
    // Apply visibility
    this.applyVisibility();
    
    // Update stats
    this.stats.updateTime = performance.now() - startTime;
  }
  
  /**
   * Calculate screen space size
   * @param boundingSphere - Bounding sphere
   * @returns Screen space size
   */
  private calculateScreenSpaceSize(boundingSphere: THREE.Sphere): number {
    if (!(this.camera instanceof THREE.PerspectiveCamera)) {
      return 1;
    }
    
    // Calculate distance to camera
    const cameraPosition = new THREE.Vector3();
    this.camera.getWorldPosition(cameraPosition);
    const distance = boundingSphere.center.distanceTo(cameraPosition);
    
    // Calculate screen space size
    const fov = this.camera.fov * Math.PI / 180;
    const height = 2 * Math.tan(fov / 2) * distance;
    const screenSpaceSize = boundingSphere.radius * 2 / height;
    
    return screenSpaceSize;
  }
  
  /**
   * Check if object is occluded
   * @param data - Occlusion data
   * @returns Is occluded
   */
  private isObjectOccluded(data: OcclusionData): boolean {
    if (!this.occlusionRenderTarget || !this.occlusionDepthTexture) {
      return false;
    }
    
    // Get object position in screen space
    const screenPosition = this.getScreenPosition(data.boundingSphere.center);
    
    // Check if object is outside screen
    if (screenPosition.x < 0 || screenPosition.x > 1 || 
        screenPosition.y < 0 || screenPosition.y > 1 || 
        screenPosition.z < 0 || screenPosition.z > 1) {
      return false;
    }
    
    // Read depth buffer
    const resolution = this.options.depthTextureResolution!;
    const x = Math.floor(screenPosition.x * resolution);
    const y = Math.floor(screenPosition.y * resolution);
    
    const pixelBuffer = new Float32Array(4);
    this.renderer.readRenderTargetPixels(
      this.occlusionRenderTarget,
      x, y, 1, 1,
      pixelBuffer
    );    
    // Get depth from buffer
    const depth = pixelBuffer[0];
    
    // Get object depth
    const objectDepth = screenPosition.z;
    
    // Check if object is occluded
    return objectDepth > depth + this.options.occlusionThreshold!;
  }
  
  /**
   * Get screen position
   * @param worldPosition - World position
   * @returns Screen position
   */
  private getScreenPosition(worldPosition: THREE.Vector3): THREE.Vector3 {
    // Create vector
    const vector = new THREE.Vector3();
    
    // Copy world position
    vector.copy(worldPosition);
    
    // Project to screen space
    vector.project(this.camera);
    
    // Convert to 0-1 range
    vector.x = (vector.x + 1) / 2;
    vector.y = (vector.y + 1) / 2;
    
    return vector;
  }
  
  /**
   * Apply visibility
   */
  private applyVisibility(): void {
    // Apply visibility to objects
    this.occlusionData.forEach((data) => {
      data.object.visible = !data.isOccluded;
    });
  }
  
  /**
   * Update
   */
  update(): void {
    if (!this.isInitialized) {
      return;
    }
    
    // Update occlusion
    this.updateOcclusion();
  }
  
  /**
   * Get visible objects
   * @returns Visible objects
   */
  getVisibleObjects(): THREE.Object3D[] {
    const visibleObjects: THREE.Object3D[] = [];
    
    this.occlusionData.forEach((data) => {
      if (!data.isOccluded) {
        visibleObjects.push(data.object);
      }
    });
    
    return visibleObjects;
  }  
  /**
   * Get occluded objects
   * @returns Occluded objects
   */
  getOccludedObjects(): THREE.Object3D[] {
    const occludedObjects: THREE.Object3D[] = [];
    
    this.occlusionData.forEach((data) => {
      if (data.isOccluded) {
        occludedObjects.push(data.object);
      }
    });
    
    return occludedObjects;
  }
  
  /**
   * Get stats
   * @returns Stats
   */
  getStats(): any {
    return { ...this.stats };
  }
  
  /**
   * Set options
   * @param options - Options
   */
  setOptions(options: OcclusionCullingOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };
    
    // Reinitialize occlusion culling if needed
    if (options.depthTextureResolution !== undefined) {
      this.dispose();
      this.initialize();
    }
  }
  
  /**
   * Resize
   * @param width - Width
   * @param height - Height
   */
  resize(width: number, height: number): void {
    // Resize occlusion camera
    if (this.occlusionCamera instanceof THREE.PerspectiveCamera) {
      this.occlusionCamera.aspect = width / height;
      this.occlusionCamera.updateProjectionMatrix();
    }
  }
  
  /**
   * Dispose
   */
  dispose(): void {
    // Stop update timer
    this.stopUpdateTimer();
    
    // Dispose occlusion resources
    if (this.occlusionRenderTarget) {
      this.occlusionRenderTarget.dispose();
      this.occlusionRenderTarget = null;
    }
    
    if (this.occlusionDepthTexture) {
      this.occlusionDepthTexture.dispose();
      this.occlusionDepthTexture = null;
    }
    
    if (this.occlusionDepthMaterial) {
      this.occlusionDepthMaterial.dispose();
      this.occlusionDepthMaterial = null;
    }    
    // Clear occlusion data
    this.occlusionData.clear();
    
    // Mark as not initialized
    this.isInitialized = false;
    
    this.log('Occlusion Culling System disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[OcclusionCullingSystem] ${message}`);
    }
  }
}

export { OcclusionCullingSystem };