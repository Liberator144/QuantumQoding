/**
 * Virtual Renderer
 *
 * Provides viewport-based rendering with buffer zones and occlusion culling.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';

/**
 * Culling method
 */
export enum CullingMethod {
  /** Frustum culling */
  FRUSTUM = 'frustum',
  
  /** Occlusion culling */
  OCCLUSION = 'occlusion',
  
  /** Distance culling */
  DISTANCE = 'distance',
  
  /** Bounding volume culling */
  BOUNDING_VOLUME = 'bounding_volume',
  
  /** Screen space culling */
  SCREEN_SPACE = 'screen_space',
}

/**
 * Virtual Renderer Options
 */
export interface VirtualRendererOptions {
  /** Enable frustum culling */
  enableFrustumCulling?: boolean;
  
  /** Enable occlusion culling */
  enableOcclusionCulling?: boolean;
  
  /** Enable distance culling */
  enableDistanceCulling?: boolean;
  
  /** Maximum render distance */
  maxRenderDistance?: number;
  
  /** Buffer zone size (percentage of viewport) */
  bufferZoneSize?: number;
  
  /** Occlusion threshold (0.0 - 1.0) */
  occlusionThreshold?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default options
 */
const defaultOptions: VirtualRendererOptions = {
  enableFrustumCulling: true,
  enableOcclusionCulling: true,
  enableDistanceCulling: true,
  maxRenderDistance: 1000,
  bufferZoneSize: 0.2,
  occlusionThreshold: 0.8,
  debugMode: false,
};/**
 * Object visibility state
 */
interface ObjectVisibilityState {
  /** Object */
  object: THREE.Object3D;
  
  /** Is visible */
  isVisible: boolean;
  
  /** Is in frustum */
  isInFrustum: boolean;
  
  /** Is occluded */
  isOccluded: boolean;
  
  /** Is in buffer zone */
  isInBufferZone: boolean;
  
  /** Distance to camera */
  distanceToCamera: number;
  
  /** Screen space size */
  screenSpaceSize: number;
  
  /** Last update time */
  lastUpdateTime: number;
}

/**
 * Virtual Renderer
 */
export class VirtualRenderer {
  /** Options */
  private options: VirtualRendererOptions;
  
  /** Scene */
  private scene: THREE.Scene;
  
  /** Camera */
  private camera: THREE.Camera;
  
  /** Renderer */
  private renderer: THREE.WebGLRenderer;
  
  /** Frustum */
  private frustum: THREE.Frustum;
  
  /** Frustum matrix */
  private frustumMatrix: THREE.Matrix4;
  
  /** Buffer zone frustum */
  private bufferZoneFrustum: THREE.Frustum;
  
  /** Buffer zone frustum matrix */
  private bufferZoneFrustumMatrix: THREE.Matrix4;
  
  /** Object visibility states */
  private objectVisibilityStates: Map<string, ObjectVisibilityState> = new Map();
  
  /** Occlusion query */
  private occlusionQuery: WebGLQuery | null = null;
  
  /** Occlusion renderer */
  private occlusionRenderer: THREE.WebGLRenderer | null = null;
  
  /** Occlusion camera */
  private occlusionCamera: THREE.PerspectiveCamera | null = null;  
  /** Occlusion render target */
  private occlusionRenderTarget: THREE.WebGLRenderTarget | null = null;
  
  /** Occlusion depth material */
  private occlusionDepthMaterial: THREE.MeshDepthMaterial | null = null;
  
  /** Occlusion depth texture */
  private occlusionDepthTexture: THREE.DepthTexture | null = null;
  
  /** Visible objects */
  private visibleObjects: THREE.Object3D[] = [];
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /** Stats */
  private stats = {
    totalObjects: 0,
    visibleObjects: 0,
    culledByFrustum: 0,
    culledByOcclusion: 0,
    culledByDistance: 0,
    inBufferZone: 0,
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
    options: VirtualRendererOptions = {}
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    
    this.options = {
      ...defaultOptions,
      ...options,
    };
    
    // Initialize frustum
    this.frustum = new THREE.Frustum();
    this.frustumMatrix = new THREE.Matrix4();
    
    // Initialize buffer zone frustum
    this.bufferZoneFrustum = new THREE.Frustum();
    this.bufferZoneFrustumMatrix = new THREE.Matrix4();
    
    this.log('Virtual Renderer initialized');
  }  
  /**
   * Initialize the virtual renderer
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    // Initialize occlusion culling
    if (this.options.enableOcclusionCulling) {
      this.initializeOcclusionCulling();
    }
    
    // Register all objects in the scene
    this.registerSceneObjects();
    
    // Mark as initialized
    this.isInitialized = true;
    
    this.log('Virtual Renderer started');
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
    
    this.occlusionRenderer.setSize(256, 256);
    
    // Create occlusion camera
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.occlusionCamera = this.camera.clone();
    } else {
      this.occlusionCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    }
    
    // Create depth texture
    this.occlusionDepthTexture = new THREE.DepthTexture(256, 256);
    this.occlusionDepthTexture.format = THREE.DepthFormat;
    this.occlusionDepthTexture.type = THREE.UnsignedShortType;
    
    // Create render target
    this.occlusionRenderTarget = new THREE.WebGLRenderTarget(256, 256, {
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
    this.objectVisibilityStates.clear();
    
    // Register all objects in the scene
    this.scene.traverse((object) => {
      if (object.visible && !(object instanceof THREE.Camera) && !(object instanceof THREE.Light)) {
        this.registerObject(object);
      }
    });
    
    // Update stats
    this.stats.totalObjects = this.objectVisibilityStates.size;
    
    this.log(`Registered ${this.stats.totalObjects} objects`);
  }
  
  /**
   * Register object
   * @param object - Object to register
   */
  registerObject(object: THREE.Object3D): void {
    // Generate object ID
    const objectId = `object-${object.uuid}`;
    
    // Create object visibility state
    const objectVisibilityState: ObjectVisibilityState = {
      object,
      isVisible: true,
      isInFrustum: true,
      isOccluded: false,
      isInBufferZone: false,
      distanceToCamera: Infinity,
      screenSpaceSize: 0,
      lastUpdateTime: performance.now(),
    };
    
    // Store object visibility state
    this.objectVisibilityStates.set(objectId, objectVisibilityState);
    
    // Update stats
    this.stats.totalObjects = this.objectVisibilityStates.size;
  }
  
  /**
   * Unregister object
   * @param object - Object to unregister
   */
  unregisterObject(object: THREE.Object3D): void {
    // Generate object ID
    const objectId = `object-${object.uuid}`;
    
    // Remove object visibility state
    this.objectVisibilityStates.delete(objectId);
    
    // Update stats
    this.stats.totalObjects = this.objectVisibilityStates.size;
  }  
  /**
   * Update frustum
   */
  private updateFrustum(): void {
    // Update frustum
    this.frustumMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    );
    
    this.frustum.setFromProjectionMatrix(this.frustumMatrix);
    
    // Update buffer zone frustum
    if (this.camera instanceof THREE.PerspectiveCamera) {
      // Create a slightly larger frustum for the buffer zone
      const bufferCamera = this.camera.clone();
      
      // Increase FOV for buffer zone
      bufferCamera.fov *= (1 + this.options.bufferZoneSize!);
      bufferCamera.updateProjectionMatrix();
      
      this.bufferZoneFrustumMatrix.multiplyMatrices(
        bufferCamera.projectionMatrix,
        this.camera.matrixWorldInverse
      );
      
      this.bufferZoneFrustum.setFromProjectionMatrix(this.bufferZoneFrustumMatrix);
    } else {
      // For non-perspective cameras, use the same frustum
      this.bufferZoneFrustum.copy(this.frustum);
    }
  }
  
  /**
   * Update object visibility
   */
  private updateObjectVisibility(): void {
    // Reset stats
    this.stats.visibleObjects = 0;
    this.stats.culledByFrustum = 0;
    this.stats.culledByOcclusion = 0;
    this.stats.culledByDistance = 0;
    this.stats.inBufferZone = 0;
    
    // Clear visible objects
    this.visibleObjects = [];
    
    // Get camera position
    const cameraPosition = new THREE.Vector3();
    this.camera.getWorldPosition(cameraPosition);
    
    // Update each object
    this.objectVisibilityStates.forEach((state) => {
      // Skip if object is not visible
      if (!state.object.visible) {
        return;
      }
      
      // Get object position
      const objectPosition = new THREE.Vector3();
      state.object.getWorldPosition(objectPosition);
      
      // Calculate distance to camera
      state.distanceToCamera = objectPosition.distanceTo(cameraPosition);
      
      // Update last update time
      state.lastUpdateTime = performance.now();      
      // Check distance culling
      if (this.options.enableDistanceCulling && 
          state.distanceToCamera > this.options.maxRenderDistance!) {
        state.isVisible = false;
        this.stats.culledByDistance++;
        return;
      }
      
      // Check frustum culling
      if (this.options.enableFrustumCulling) {
        // Get bounding sphere
        let boundingSphere: THREE.Sphere | null = null;
        
        if (state.object instanceof THREE.Mesh && state.object.geometry.boundingSphere) {
          // Use geometry bounding sphere
          boundingSphere = state.object.geometry.boundingSphere.clone();
          boundingSphere.applyMatrix4(state.object.matrixWorld);
        } else {
          // Create bounding sphere from object position
          boundingSphere = new THREE.Sphere(objectPosition, 1);
        }
        
        // Check if object is in frustum
        state.isInFrustum = this.frustum.intersectsSphere(boundingSphere);
        
        // Check if object is in buffer zone
        state.isInBufferZone = !state.isInFrustum && 
                               this.bufferZoneFrustum.intersectsSphere(boundingSphere);
        
        if (!state.isInFrustum && !state.isInBufferZone) {
          state.isVisible = false;
          this.stats.culledByFrustum++;
          return;
        }
        
        if (state.isInBufferZone) {
          this.stats.inBufferZone++;
        }
      } else {
        state.isInFrustum = true;
        state.isInBufferZone = false;
      }
      
      // Check occlusion culling
      if (this.options.enableOcclusionCulling && 
          this.occlusionRenderer && 
          this.occlusionCamera && 
          this.occlusionRenderTarget && 
          this.occlusionDepthMaterial) {
        
        // Skip occlusion culling for objects in the buffer zone
        if (!state.isInBufferZone) {
          state.isOccluded = this.isObjectOccluded(state.object);
          
          if (state.isOccluded) {
            state.isVisible = false;
            this.stats.culledByOcclusion++;
            return;
          }
        }
      } else {
        state.isOccluded = false;
      }      
      // Object is visible
      state.isVisible = true;
      this.stats.visibleObjects++;
      
      // Add to visible objects
      this.visibleObjects.push(state.object);
    });
  }
  
  /**
   * Check if object is occluded
   * @param object - Object to check
   * @returns Is occluded
   */
  private isObjectOccluded(object: THREE.Object3D): boolean {
    if (!this.occlusionRenderer || 
        !this.occlusionCamera || 
        !this.occlusionRenderTarget || 
        !this.occlusionDepthMaterial) {
      return false;
    }
    
    // Get object position
    const objectPosition = new THREE.Vector3();
    object.getWorldPosition(objectPosition);
    
    // Update occlusion camera
    this.occlusionCamera.position.copy(this.camera.position);
    this.occlusionCamera.rotation.copy(this.camera.rotation);
    this.occlusionCamera.updateMatrixWorld();
    
    // Point camera at object
    this.occlusionCamera.lookAt(objectPosition);
    
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
    
    // Read depth buffer
    const pixelBuffer = new Float32Array(4);
    this.renderer.readRenderTargetPixels(
      this.occlusionRenderTarget,
      128, 128, 1, 1,
      pixelBuffer
    );
    
    // Restore original materials
    currentMaterials.forEach((material, node) => {
      (node as THREE.Mesh).material = material;
    });
    
    // Restore render target
    this.renderer.setRenderTarget(currentRenderTarget);
    
    // Check if object is occluded
    const depth = pixelBuffer[0];
    
    return depth > this.options.occlusionThreshold!;
  }  
  /**
   * Update
   */
  update(): void {
    if (!this.isInitialized) {
      return;
    }
    
    // Update frustum
    this.updateFrustum();
    
    // Update object visibility
    this.updateObjectVisibility();
    
    // Apply visibility
    this.applyVisibility();
  }
  
  /**
   * Apply visibility
   */
  private applyVisibility(): void {
    // Apply visibility to objects
    this.objectVisibilityStates.forEach((state) => {
      state.object.visible = state.isVisible;
    });
  }
  
  /**
   * Render
   */
  render(): void {
    if (!this.isInitialized) {
      return;
    }
    
    // Update
    this.update();
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * Get visible objects
   * @returns Visible objects
   */
  getVisibleObjects(): THREE.Object3D[] {
    return [...this.visibleObjects];
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
  setOptions(options: VirtualRendererOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };
    
    // Reinitialize occlusion culling if needed
    if (options.enableOcclusionCulling !== undefined && 
        options.enableOcclusionCulling !== this.options.enableOcclusionCulling) {
      if (options.enableOcclusionCulling) {
        this.initializeOcclusionCulling();
      }
    }
  }  
  /**
   * Resize
   * @param width - Width
   * @param height - Height
   */
  resize(width: number, height: number): void {
    // Resize renderer
    this.renderer.setSize(width, height);
    
    // Resize camera
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
    
    // Resize occlusion renderer
    if (this.occlusionRenderer) {
      this.occlusionRenderer.setSize(256, 256);
    }
    
    // Resize occlusion camera
    if (this.occlusionCamera) {
      this.occlusionCamera.aspect = width / height;
      this.occlusionCamera.updateProjectionMatrix();
    }
  }
  
  /**
   * Dispose
   */
  dispose(): void {
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
    
    // Clear object visibility states
    this.objectVisibilityStates.clear();
    
    // Clear visible objects
    this.visibleObjects = [];
    
    // Mark as not initialized
    this.isInitialized = false;
    
    this.log('Virtual Renderer disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[VirtualRenderer] ${message}`);
    }
  }
}

export { VirtualRenderer };