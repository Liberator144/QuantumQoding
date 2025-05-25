/**
 * LOD Transition System
 *
 * Provides smooth transitions between Level of Detail (LOD) levels.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';
import { LODLevel } from './LODManager';

/**
 * Transition method
 */
export enum TransitionMethod {
  /** Instant transition */
  INSTANT = 'instant',
  
  /** Fade transition */
  FADE = 'fade',
  
  /** Morph transition */
  MORPH = 'morph',
  
  /** Cross-fade transition */
  CROSS_FADE = 'cross_fade',
  
  /** Dissolve transition */
  DISSOLVE = 'dissolve',
}

/**
 * Transition state
 */
export enum TransitionState {
  /** Idle */
  IDLE = 'idle',
  
  /** Transitioning */
  TRANSITIONING = 'transitioning',
  
  /** Completed */
  COMPLETED = 'completed',
  
  /** Failed */
  FAILED = 'failed',
}

/**
 * Transition options
 */
export interface TransitionOptions {
  /** Transition method */
  method?: TransitionMethod;
  
  /** Transition duration (seconds) */
  duration?: number;
  
  /** Easing function */
  easing?: (t: number) => number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Transition data
 */
interface TransitionData {
  /** Object */
  object: THREE.Object3D;
  
  /** From level */
  fromLevel: LODLevel;
  
  /** To level */
  toLevel: LODLevel;
  
  /** Start time */
  startTime: number;
  
  /** Duration */
  duration: number;
  
  /** Method */
  method: TransitionMethod;
  
  /** Easing function */
  easing: (t: number) => number;
  
  /** State */
  state: TransitionState;
  
  /** Progress */
  progress: number;
  
  /** Original material */
  originalMaterial?: THREE.Material | THREE.Material[];
  
  /** Transition material */
  transitionMaterial?: THREE.Material | THREE.Material[];
}/**
 * Default transition options
 */
const defaultOptions: TransitionOptions = {
  method: TransitionMethod.FADE,
  duration: 0.5,
  easing: (t: number) => t * (2 - t), // Ease out quad
  debugMode: false,
};

/**
 * LOD Transition System
 */
export class LODTransitionSystem {
  /** Options */
  private options: TransitionOptions;
  
  /** Active transitions */
  private transitions: Map<string, TransitionData> = new Map();
  
  /** Transition materials */
  private transitionMaterials: Map<string, THREE.Material> = new Map();
  
  /** Clock */
  private clock: THREE.Clock;
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /**
   * Constructor
   * @param options - Transition options
   */
  constructor(options: TransitionOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    
    this.clock = new THREE.Clock();
    
    this.log('LOD Transition System initialized');
  }
  
  /**
   * Initialize the transition system
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    // Start clock
    this.clock.start();
    
    // Mark as initialized
    this.isInitialized = true;
    
    this.log('LOD Transition System started');
  }  
  /**
   * Start transition
   * @param object - Object to transition
   * @param fromLevel - From level
   * @param toLevel - To level
   * @param options - Transition options
   * @returns Transition ID
   */
  startTransition(
    object: THREE.Object3D,
    fromLevel: LODLevel,
    toLevel: LODLevel,
    options: TransitionOptions = {}
  ): string {
    // Generate transition ID
    const transitionId = `transition-${object.uuid}-${Date.now()}`;
    
    // Merge options
    const mergedOptions: TransitionOptions = {
      ...this.options,
      ...options,
    };
    
    // Create transition data
    const transitionData: TransitionData = {
      object,
      fromLevel,
      toLevel,
      startTime: this.clock.getElapsedTime(),
      duration: mergedOptions.duration || 0.5,
      method: mergedOptions.method || TransitionMethod.FADE,
      easing: mergedOptions.easing || defaultOptions.easing!,
      state: TransitionState.TRANSITIONING,
      progress: 0,
    };
    
    // Initialize transition based on method
    switch (transitionData.method) {
      case TransitionMethod.FADE:
        this.initializeFadeTransition(transitionData);
        break;
        
      case TransitionMethod.MORPH:
        this.initializeMorphTransition(transitionData);
        break;
        
      case TransitionMethod.CROSS_FADE:
        this.initializeCrossFadeTransition(transitionData);
        break;
        
      case TransitionMethod.DISSOLVE:
        this.initializeDissolveTransition(transitionData);
        break;
        
      case TransitionMethod.INSTANT:
      default:
        // No initialization needed for instant transition
        transitionData.state = TransitionState.COMPLETED;
        break;
    }
    
    // Store transition
    this.transitions.set(transitionId, transitionData);
    
    this.log(`Started transition: ${transitionId} (${transitionData.method})`);
    
    return transitionId;
  }  
  /**
   * Initialize fade transition
   * @param transitionData - Transition data
   */
  private initializeFadeTransition(transitionData: TransitionData): void {
    // Store original material
    if (transitionData.object instanceof THREE.Mesh) {
      transitionData.originalMaterial = (transitionData.object as THREE.Mesh).material;
      
      // Create transition material
      if (Array.isArray(transitionData.originalMaterial)) {
        // Handle material array
        const materials: THREE.Material[] = [];
        
        transitionData.originalMaterial.forEach((material) => {
          const transitionMaterial = this.createTransitionMaterial(material);
          materials.push(transitionMaterial);
        });
        
        transitionData.transitionMaterial = materials;
      } else {
        // Handle single material
        const transitionMaterial = this.createTransitionMaterial(transitionData.originalMaterial);
        transitionData.transitionMaterial = transitionMaterial;
      }
      
      // Apply transition material
      (transitionData.object as THREE.Mesh).material = transitionData.transitionMaterial;
    }
  }
  
  /**
   * Initialize morph transition
   * @param transitionData - Transition data
   */
  private initializeMorphTransition(transitionData: TransitionData): void {
    // Morph transition requires morph targets
    if (transitionData.object instanceof THREE.Mesh) {
      const mesh = transitionData.object as THREE.Mesh;
      
      // Check if mesh has morph targets
      if (!mesh.geometry.morphAttributes.position) {
        // Fallback to fade transition
        this.initializeFadeTransition(transitionData);
        return;
      }
      
      // Store original material
      transitionData.originalMaterial = mesh.material;
      
      // Create transition material
      if (Array.isArray(transitionData.originalMaterial)) {
        // Handle material array
        const materials: THREE.Material[] = [];
        
        transitionData.originalMaterial.forEach((material) => {
          if (material instanceof THREE.MeshBasicMaterial ||
              material instanceof THREE.MeshLambertMaterial ||
              material instanceof THREE.MeshPhongMaterial ||
              material instanceof THREE.MeshStandardMaterial ||
              material instanceof THREE.MeshPhysicalMaterial) {
            
            // Enable morph targets
            material.morphTargets = true;
            
            // Add to materials
            materials.push(material);
          } else {
            // Fallback for unsupported materials
            const transitionMaterial = this.createTransitionMaterial(material);
            materials.push(transitionMaterial);
          }
        });
        
        transitionData.transitionMaterial = materials;
      } else {
        // Handle single material
        const material = transitionData.originalMaterial;        
        if (material instanceof THREE.MeshBasicMaterial ||
            material instanceof THREE.MeshLambertMaterial ||
            material instanceof THREE.MeshPhongMaterial ||
            material instanceof THREE.MeshStandardMaterial ||
            material instanceof THREE.MeshPhysicalMaterial) {
          
          // Enable morph targets
          material.morphTargets = true;
          
          transitionData.transitionMaterial = material;
        } else {
          // Fallback for unsupported materials
          const transitionMaterial = this.createTransitionMaterial(material);
          transitionData.transitionMaterial = transitionMaterial;
        }
      }
      
      // Apply transition material
      mesh.material = transitionData.transitionMaterial;
    }
  }
  
  /**
   * Initialize cross-fade transition
   * @param transitionData - Transition data
   */
  private initializeCrossFadeTransition(transitionData: TransitionData): void {
    // Cross-fade transition requires two objects
    // For now, fallback to fade transition
    this.initializeFadeTransition(transitionData);
  }
  
  /**
   * Initialize dissolve transition
   * @param transitionData - Transition data
   */
  private initializeDissolveTransition(transitionData: TransitionData): void {
    // Store original material
    if (transitionData.object instanceof THREE.Mesh) {
      transitionData.originalMaterial = (transitionData.object as THREE.Mesh).material;
      
      // Create dissolve material
      if (Array.isArray(transitionData.originalMaterial)) {
        // Handle material array
        const materials: THREE.Material[] = [];
        
        transitionData.originalMaterial.forEach((material) => {
          const dissolveMaterial = this.createDissolveMaterial(material);
          materials.push(dissolveMaterial);
        });
        
        transitionData.transitionMaterial = materials;
      } else {
        // Handle single material
        const dissolveMaterial = this.createDissolveMaterial(transitionData.originalMaterial);
        transitionData.transitionMaterial = dissolveMaterial;
      }
      
      // Apply dissolve material
      (transitionData.object as THREE.Mesh).material = transitionData.transitionMaterial;
    }
  }  
  /**
   * Create transition material
   * @param originalMaterial - Original material
   * @returns Transition material
   */
  private createTransitionMaterial(originalMaterial: THREE.Material): THREE.Material {
    // Generate material key
    const materialKey = `transition-${originalMaterial.uuid}`;
    
    // Check if material already exists
    if (this.transitionMaterials.has(materialKey)) {
      return this.transitionMaterials.get(materialKey)!;
    }
    
    // Create transition material based on original material type
    let transitionMaterial: THREE.Material;
    
    if (originalMaterial instanceof THREE.MeshBasicMaterial) {
      transitionMaterial = new THREE.MeshBasicMaterial({
        color: originalMaterial.color,
        map: originalMaterial.map,
        transparent: true,
        opacity: 1.0,
        wireframe: originalMaterial.wireframe,
        side: originalMaterial.side,
      });
    } else if (originalMaterial instanceof THREE.MeshLambertMaterial) {
      transitionMaterial = new THREE.MeshLambertMaterial({
        color: originalMaterial.color,
        map: originalMaterial.map,
        emissive: originalMaterial.emissive,
        emissiveMap: originalMaterial.emissiveMap,
        transparent: true,
        opacity: 1.0,
        wireframe: originalMaterial.wireframe,
        side: originalMaterial.side,
      });
    } else if (originalMaterial instanceof THREE.MeshPhongMaterial) {
      transitionMaterial = new THREE.MeshPhongMaterial({
        color: originalMaterial.color,
        map: originalMaterial.map,
        emissive: originalMaterial.emissive,
        emissiveMap: originalMaterial.emissiveMap,
        specular: originalMaterial.specular,
        shininess: originalMaterial.shininess,
        transparent: true,
        opacity: 1.0,
        wireframe: originalMaterial.wireframe,
        side: originalMaterial.side,
      });
    } else if (originalMaterial instanceof THREE.MeshStandardMaterial) {
      transitionMaterial = new THREE.MeshStandardMaterial({
        color: originalMaterial.color,
        map: originalMaterial.map,
        roughness: originalMaterial.roughness,
        metalness: originalMaterial.metalness,
        emissive: originalMaterial.emissive,
        emissiveMap: originalMaterial.emissiveMap,
        transparent: true,
        opacity: 1.0,
        wireframe: originalMaterial.wireframe,
        side: originalMaterial.side,
      });    } else {
      // Fallback to basic material
      transitionMaterial = new THREE.MeshBasicMaterial({
        color: originalMaterial instanceof THREE.MeshBasicMaterial ? originalMaterial.color : 0xffffff,
        transparent: true,
        opacity: 1.0,
        wireframe: originalMaterial.wireframe,
        side: originalMaterial.side,
      });
    }
    
    // Store transition material
    this.transitionMaterials.set(materialKey, transitionMaterial);
    
    return transitionMaterial;
  }
  
  /**
   * Create dissolve material
   * @param originalMaterial - Original material
   * @returns Dissolve material
   */
  private createDissolveMaterial(originalMaterial: THREE.Material): THREE.Material {
    // Generate material key
    const materialKey = `dissolve-${originalMaterial.uuid}`;
    
    // Check if material already exists
    if (this.transitionMaterials.has(materialKey)) {
      return this.transitionMaterials.get(materialKey)!;
    }
    
    // Create noise texture
    const noiseTexture = this.createNoiseTexture();
    
    // Create dissolve material based on original material type
    let dissolveMaterial: THREE.Material;
    
    if (originalMaterial instanceof THREE.MeshStandardMaterial) {
      // Create shader material for dissolve effect
      dissolveMaterial = new THREE.ShaderMaterial({
        uniforms: {
          baseColor: { value: originalMaterial.color },
          baseMap: { value: originalMaterial.map },
          dissolveMap: { value: noiseTexture },
          dissolveAmount: { value: 0.0 },
          edgeColor: { value: new THREE.Color(0x0088ff) },
          edgeWidth: { value: 0.05 },
        },
        vertexShader: `
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 baseColor;
          uniform sampler2D baseMap;
          uniform sampler2D dissolveMap;
          uniform float dissolveAmount;
          uniform vec3 edgeColor;
          uniform float edgeWidth;
          
          varying vec2 vUv;
          
          void main() {
            vec4 baseColor = texture2D(baseMap, vUv);
            float noise = texture2D(dissolveMap, vUv).r;
            
            if (noise < dissolveAmount) {
              discard;
            }
            
            if (noise < dissolveAmount + edgeWidth) {
              gl_FragColor = vec4(edgeColor, 1.0);
            } else {
              gl_FragColor = baseColor;
            }
          }
        `,
        transparent: true,
        side: originalMaterial.side,
      });    } else {
      // Fallback to basic material with opacity
      dissolveMaterial = new THREE.MeshBasicMaterial({
        color: originalMaterial instanceof THREE.MeshBasicMaterial ? originalMaterial.color : 0xffffff,
        map: originalMaterial instanceof THREE.MeshBasicMaterial ? originalMaterial.map : null,
        transparent: true,
        opacity: 1.0,
        side: originalMaterial.side,
      });
    }
    
    // Store dissolve material
    this.transitionMaterials.set(materialKey, dissolveMaterial);
    
    return dissolveMaterial;
  }
  
  /**
   * Create noise texture
   * @returns Noise texture
   */
  private createNoiseTexture(): THREE.Texture {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    
    // Get context
    const context = canvas.getContext('2d')!;
    
    // Create noise
    const imageData = context.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i + 1] = data[i + 2] = Math.floor(Math.random() * 256);
      data[i + 3] = 255;
    }
    
    context.putImageData(imageData, 0, 0);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }  
  /**
   * Update transitions
   */
  update(): void {
    // Get current time
    const currentTime = this.clock.getElapsedTime();
    
    // Update each transition
    this.transitions.forEach((transitionData, transitionId) => {
      // Skip completed or failed transitions
      if (transitionData.state === TransitionState.COMPLETED || 
          transitionData.state === TransitionState.FAILED) {
        return;
      }
      
      // Calculate progress
      const elapsed = currentTime - transitionData.startTime;
      const rawProgress = Math.min(1.0, elapsed / transitionData.duration);
      
      // Apply easing
      transitionData.progress = transitionData.easing(rawProgress);
      
      // Update transition based on method
      switch (transitionData.method) {
        case TransitionMethod.FADE:
          this.updateFadeTransition(transitionData);
          break;
          
        case TransitionMethod.MORPH:
          this.updateMorphTransition(transitionData);
          break;
          
        case TransitionMethod.CROSS_FADE:
          this.updateCrossFadeTransition(transitionData);
          break;
          
        case TransitionMethod.DISSOLVE:
          this.updateDissolveTransition(transitionData);
          break;
          
        case TransitionMethod.INSTANT:
        default:
          // No update needed for instant transition
          break;
      }
      
      // Check if transition is complete
      if (rawProgress >= 1.0) {
        this.completeTransition(transitionId, transitionData);
      }
    });
  }  
  /**
   * Update fade transition
   * @param transitionData - Transition data
   */
  private updateFadeTransition(transitionData: TransitionData): void {
    if (transitionData.object instanceof THREE.Mesh && transitionData.transitionMaterial) {
      // Update opacity
      if (Array.isArray(transitionData.transitionMaterial)) {
        // Handle material array
        transitionData.transitionMaterial.forEach((material) => {
          if (material.opacity !== undefined) {
            // Fade out when going to lower detail, fade in when going to higher detail
            const isIncreasingDetail = transitionData.toLevel.geometryDetail > transitionData.fromLevel.geometryDetail;
            material.opacity = isIncreasingDetail ? transitionData.progress : 1 - transitionData.progress;
          }
        });
      } else {
        // Handle single material
        if (transitionData.transitionMaterial.opacity !== undefined) {
          // Fade out when going to lower detail, fade in when going to higher detail
          const isIncreasingDetail = transitionData.toLevel.geometryDetail > transitionData.fromLevel.geometryDetail;
          transitionData.transitionMaterial.opacity = isIncreasingDetail ? transitionData.progress : 1 - transitionData.progress;
        }
      }
    }
  }
  
  /**
   * Update morph transition
   * @param transitionData - Transition data
   */
  private updateMorphTransition(transitionData: TransitionData): void {
    if (transitionData.object instanceof THREE.Mesh) {
      const mesh = transitionData.object as THREE.Mesh;
      
      // Update morph target influences
      if (mesh.morphTargetInfluences && mesh.morphTargetInfluences.length > 0) {
        mesh.morphTargetInfluences[0] = transitionData.progress;
      } else {
        // Fallback to fade transition
        this.updateFadeTransition(transitionData);
      }
    }
  }  
  /**
   * Update cross-fade transition
   * @param transitionData - Transition data
   */
  private updateCrossFadeTransition(transitionData: TransitionData): void {
    // Cross-fade transition requires two objects
    // For now, fallback to fade transition
    this.updateFadeTransition(transitionData);
  }
  
  /**
   * Update dissolve transition
   * @param transitionData - Transition data
   */
  private updateDissolveTransition(transitionData: TransitionData): void {
    if (transitionData.object instanceof THREE.Mesh && transitionData.transitionMaterial) {
      // Update dissolve amount
      if (Array.isArray(transitionData.transitionMaterial)) {
        // Handle material array
        transitionData.transitionMaterial.forEach((material) => {
          if (material instanceof THREE.ShaderMaterial && material.uniforms.dissolveAmount !== undefined) {
            material.uniforms.dissolveAmount.value = transitionData.progress;
          } else if (material.opacity !== undefined) {
            // Fallback to opacity
            material.opacity = 1 - transitionData.progress;
          }
        });
      } else {
        // Handle single material
        if (transitionData.transitionMaterial instanceof THREE.ShaderMaterial && 
            transitionData.transitionMaterial.uniforms.dissolveAmount !== undefined) {
          transitionData.transitionMaterial.uniforms.dissolveAmount.value = transitionData.progress;
        } else if (transitionData.transitionMaterial.opacity !== undefined) {
          // Fallback to opacity
          transitionData.transitionMaterial.opacity = 1 - transitionData.progress;
        }
      }
    }
  }
  
  /**
   * Complete transition
   * @param transitionId - Transition ID
   * @param transitionData - Transition data
   */
  private completeTransition(transitionId: string, transitionData: TransitionData): void {
    // Restore original material
    if (transitionData.object instanceof THREE.Mesh && transitionData.originalMaterial) {
      (transitionData.object as THREE.Mesh).material = transitionData.originalMaterial;
    }
    
    // Mark as completed
    transitionData.state = TransitionState.COMPLETED;
    
    this.log(`Completed transition: ${transitionId}`);
  }  
  /**
   * Cancel transition
   * @param transitionId - Transition ID
   * @returns Success
   */
  cancelTransition(transitionId: string): boolean {
    if (!this.transitions.has(transitionId)) {
      return false;
    }
    
    // Get transition data
    const transitionData = this.transitions.get(transitionId)!;
    
    // Restore original material
    if (transitionData.object instanceof THREE.Mesh && transitionData.originalMaterial) {
      (transitionData.object as THREE.Mesh).material = transitionData.originalMaterial;
    }
    
    // Mark as failed
    transitionData.state = TransitionState.FAILED;
    
    this.log(`Cancelled transition: ${transitionId}`);
    
    return true;
  }
  
  /**
   * Get transition state
   * @param transitionId - Transition ID
   * @returns Transition state
   */
  getTransitionState(transitionId: string): TransitionState | null {
    if (!this.transitions.has(transitionId)) {
      return null;
    }
    
    return this.transitions.get(transitionId)!.state;
  }
  
  /**
   * Get transition progress
   * @param transitionId - Transition ID
   * @returns Transition progress
   */
  getTransitionProgress(transitionId: string): number | null {
    if (!this.transitions.has(transitionId)) {
      return null;
    }
    
    return this.transitions.get(transitionId)!.progress;
  }
  
  /**
   * Clear completed transitions
   */
  clearCompletedTransitions(): void {
    // Remove completed and failed transitions
    this.transitions.forEach((transitionData, transitionId) => {
      if (transitionData.state === TransitionState.COMPLETED || 
          transitionData.state === TransitionState.FAILED) {
        this.transitions.delete(transitionId);
      }
    });
  }  
  /**
   * Dispose resources
   */
  dispose(): void {
    // Cancel all transitions
    this.transitions.forEach((_, transitionId) => {
      this.cancelTransition(transitionId);
    });
    
    // Clear transitions
    this.transitions.clear();
    
    // Dispose transition materials
    this.transitionMaterials.forEach((material) => {
      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose());
      } else {
        material.dispose();
      }
    });
    
    // Clear transition materials
    this.transitionMaterials.clear();
    
    // Stop clock
    this.clock.stop();
    
    // Mark as not initialized
    this.isInitialized = false;
    
    this.log('LOD Transition System disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[LODTransitionSystem] ${message}`);
    }
  }
}

export { LODTransitionSystem };