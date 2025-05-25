/**
 * Level of Detail (LOD) Manager
 *
 * Manages level of detail for visualization objects.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';

/**
 * LOD Level
 */
export interface LODLevel {
  /** Level ID */
  id: string;
  
  /** Distance threshold */
  distance: number;
  
  /** Geometry detail level */
  geometryDetail: number;
  
  /** Texture detail level */
  textureDetail: number;
  
  /** Particle count multiplier */
  particleMultiplier: number;
  
  /** Effect detail level */
  effectDetail: number;
}

/**
 * LOD Object
 */
export interface LODObject {
  /** Object ID */
  id: string;
  
  /** Object type */
  type: string;
  
  /** THREE.Object3D instance */
  object: THREE.Object3D;
  
  /** LOD levels */
  levels: LODLevel[];
  
  /** Current LOD level */
  currentLevel: LODLevel;
  
  /** Original geometry */
  originalGeometry?: THREE.BufferGeometry;
  
  /** Original material */
  originalMaterial?: THREE.Material | THREE.Material[];
  
  /** LOD geometries */
  lodGeometries?: Map<string, THREE.BufferGeometry>;
  
  /** LOD materials */
  lodMaterials?: Map<string, THREE.Material | THREE.Material[]>;
}

/**
 * LOD Manager Options
 */
export interface LODManagerOptions {
  /** Enable LOD */
  enabled?: boolean;
  
  /** Default LOD levels */
  defaultLevels?: LODLevel[];
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default LOD levels
 */
const defaultLODLevels: LODLevel[] = [
  {
    id: 'ultra',
    distance: 10,
    geometryDetail: 1.0,
    textureDetail: 1.0,
    particleMultiplier: 1.0,
    effectDetail: 1.0,
  },
  {
    id: 'high',
    distance: 50,
    geometryDetail: 0.75,
    textureDetail: 0.75,
    particleMultiplier: 0.75,
    effectDetail: 0.75,
  },
  {
    id: 'medium',
    distance: 100,
    geometryDetail: 0.5,
    textureDetail: 0.5,
    particleMultiplier: 0.5,
    effectDetail: 0.5,
  },
  {
    id: 'low',
    distance: 200,
    geometryDetail: 0.25,
    textureDetail: 0.25,
    particleMultiplier: 0.25,
    effectDetail: 0.25,
  },
  {
    id: 'minimal',
    distance: Infinity,
    geometryDetail: 0.1,
    textureDetail: 0.1,
    particleMultiplier: 0.1,
    effectDetail: 0.1,
  },
];/**
 * LOD Manager
 */
export class LODManager {
  /** Options */
  private options: LODManagerOptions;
  
  /** LOD objects */
  private objects: Map<string, LODObject> = new Map();
  
  /** Default LOD levels */
  private defaultLevels: LODLevel[];
  
  /**
   * Constructor
   * @param options - LOD manager options
   */
  constructor(options: LODManagerOptions = {}) {
    this.options = {
      enabled: true,
      defaultLevels: defaultLODLevels,
      debugMode: false,
      ...options,
    };
    
    this.defaultLevels = this.options.defaultLevels || defaultLODLevels;
    
    this.log('LOD Manager initialized');
  }
  
  /**
   * Register object for LOD management
   * @param object - THREE.Object3D instance
   * @param type - Object type
   * @param levels - LOD levels
   * @returns LOD object
   */
  registerObject(
    object: THREE.Object3D,
    type: string,
    levels?: LODLevel[]
  ): LODObject {
    // Generate ID
    const id = `lod-${object.uuid}`;
    
    // Create LOD object
    const lodObject: LODObject = {
      id,
      type,
      object,
      levels: levels || this.defaultLevels,
      currentLevel: levels ? levels[0] : this.defaultLevels[0],
      lodGeometries: new Map(),
      lodMaterials: new Map(),
    };
    
    // Store original geometry and material
    if (object instanceof THREE.Mesh) {
      lodObject.originalGeometry = object.geometry;
      lodObject.originalMaterial = object.material;
    }
    
    // Store LOD object
    this.objects.set(id, lodObject);
    
    this.log(`Registered object: ${id} (${type})`);
    
    return lodObject;
  }  
  /**
   * Unregister object
   * @param id - Object ID
   * @returns Success
   */
  unregisterObject(id: string): boolean {
    if (!this.objects.has(id)) {
      return false;
    }
    
    // Get LOD object
    const lodObject = this.objects.get(id)!;
    
    // Restore original geometry and material
    if (lodObject.object instanceof THREE.Mesh && lodObject.originalGeometry && lodObject.originalMaterial) {
      lodObject.object.geometry = lodObject.originalGeometry;
      lodObject.object.material = lodObject.originalMaterial;
    }
    
    // Remove LOD object
    this.objects.delete(id);
    
    this.log(`Unregistered object: ${id}`);
    
    return true;
  }
  
  /**
   * Update LOD levels based on camera position
   * @param camera - THREE.Camera instance
   */
  update(camera: THREE.Camera): void {
    if (!this.options.enabled) {
      return;
    }
    
    // Get camera position
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
    
    // Update LOD for each object
    this.objects.forEach((lodObject) => {
      // Get object position
      const objectPosition = new THREE.Vector3();
      lodObject.object.getWorldPosition(objectPosition);
      
      // Calculate distance to camera
      const distance = objectPosition.distanceTo(cameraPosition);
      
      // Find appropriate LOD level
      const level = this.findLODLevel(lodObject, distance);
      
      // Update LOD if level changed
      if (level.id !== lodObject.currentLevel.id) {
        this.applyLODLevel(lodObject, level);
        lodObject.currentLevel = level;
      }
    });
  }  
  /**
   * Find appropriate LOD level for distance
   * @param lodObject - LOD object
   * @param distance - Distance to camera
   * @returns LOD level
   */
  private findLODLevel(lodObject: LODObject, distance: number): LODLevel {
    // Find first level with distance greater than or equal to the camera distance
    for (const level of lodObject.levels) {
      if (distance <= level.distance) {
        return level;
      }
    }
    
    // Return last level if no match
    return lodObject.levels[lodObject.levels.length - 1];
  }
  
  /**
   * Apply LOD level to object
   * @param lodObject - LOD object
   * @param level - LOD level
   */
  private applyLODLevel(lodObject: LODObject, level: LODLevel): void {
    // Apply LOD based on object type
    switch (lodObject.type) {
      case 'mesh':
        this.applyMeshLOD(lodObject, level);
        break;
        
      case 'particles':
        this.applyParticlesLOD(lodObject, level);
        break;
        
      case 'galaxy':
        this.applyGalaxyLOD(lodObject, level);
        break;
        
      case 'starSystem':
        this.applyStarSystemLOD(lodObject, level);
        break;
        
      case 'nebula':
        this.applyNebulaLOD(lodObject, level);
        break;
        
      default:
        // No specific LOD handling for this type
        break;
    }
    
    this.log(`Applied LOD level ${level.id} to object ${lodObject.id}`);
  }  
  /**
   * Apply LOD to mesh
   * @param lodObject - LOD object
   * @param level - LOD level
   */
  private applyMeshLOD(lodObject: LODObject, level: LODLevel): void {
    if (!(lodObject.object instanceof THREE.Mesh)) {
      return;
    }
    
    // Apply geometry LOD
    this.applyGeometryLOD(lodObject, level);
    
    // Apply material LOD
    this.applyMaterialLOD(lodObject, level);
  }
  
  /**
   * Apply LOD to geometry
   * @param lodObject - LOD object
   * @param level - LOD level
   */
  private applyGeometryLOD(lodObject: LODObject, level: LODLevel): void {
    if (!(lodObject.object instanceof THREE.Mesh) || !lodObject.originalGeometry) {
      return;
    }
    
    // Check if we already have a LOD geometry for this level
    if (lodObject.lodGeometries?.has(level.id)) {
      lodObject.object.geometry = lodObject.lodGeometries.get(level.id)!;
      return;
    }
    
    // Create LOD geometry
    let lodGeometry: THREE.BufferGeometry;
    
    if (level.geometryDetail >= 1.0) {
      // Use original geometry for highest detail level
      lodGeometry = lodObject.originalGeometry;
    } else {
      // Create simplified geometry
      lodGeometry = this.simplifyGeometry(lodObject.originalGeometry, level.geometryDetail);
      
      // Store LOD geometry
      lodObject.lodGeometries?.set(level.id, lodGeometry);
    }
    
    // Apply LOD geometry
    lodObject.object.geometry = lodGeometry;
  }  
  /**
   * Apply LOD to material
   * @param lodObject - LOD object
   * @param level - LOD level
   */
  private applyMaterialLOD(lodObject: LODObject, level: LODLevel): void {
    if (!(lodObject.object instanceof THREE.Mesh) || !lodObject.originalMaterial) {
      return;
    }
    
    // Check if we already have a LOD material for this level
    if (lodObject.lodMaterials?.has(level.id)) {
      lodObject.object.material = lodObject.lodMaterials.get(level.id)!;
      return;
    }
    
    // Create LOD material
    let lodMaterial: THREE.Material | THREE.Material[];
    
    if (level.textureDetail >= 1.0) {
      // Use original material for highest detail level
      lodMaterial = lodObject.originalMaterial;
    } else {
      // Create simplified material
      lodMaterial = this.simplifyMaterial(lodObject.originalMaterial, level.textureDetail);
      
      // Store LOD material
      lodObject.lodMaterials?.set(level.id, lodMaterial);
    }
    
    // Apply LOD material
    lodObject.object.material = lodMaterial;
  }
  
  /**
   * Apply LOD to particles
   * @param lodObject - LOD object
   * @param level - LOD level
   */
  private applyParticlesLOD(lodObject: LODObject, level: LODLevel): void {
    if (!(lodObject.object instanceof THREE.Points)) {
      return;
    }
    
    // Adjust particle size based on LOD level
    if (lodObject.object.material instanceof THREE.PointsMaterial) {
      const baseMaterial = lodObject.object.material;
      
      // Adjust size
      if (baseMaterial.size !== undefined) {
        const originalSize = baseMaterial.userData.originalSize || baseMaterial.size;
        baseMaterial.userData.originalSize = originalSize;
        
        // Increase size for lower detail levels to maintain visual presence
        baseMaterial.size = originalSize * (2.0 - level.particleMultiplier);
      }
      
      // Adjust opacity for distant particles
      if (baseMaterial.opacity !== undefined) {
        const originalOpacity = baseMaterial.userData.originalOpacity || baseMaterial.opacity;
        baseMaterial.userData.originalOpacity = originalOpacity;
        
        baseMaterial.opacity = originalOpacity * level.particleMultiplier;
      }
    }
  }  
  /**
   * Apply LOD to galaxy
   * @param lodObject - LOD object
   * @param level - LOD level
   */
  private applyGalaxyLOD(lodObject: LODObject, level: LODLevel): void {
    // Galaxy is a complex object with multiple components
    
    // Apply LOD to each component
    lodObject.object.traverse((child) => {
      if (child instanceof THREE.Points) {
        // Apply particle LOD
        const childLodObject: LODObject = {
          id: `lod-${child.uuid}`,
          type: 'particles',
          object: child,
          levels: lodObject.levels,
          currentLevel: level,
        };
        
        this.applyParticlesLOD(childLodObject, level);
      } else if (child instanceof THREE.Mesh) {
        // Apply mesh LOD
        const childLodObject: LODObject = {
          id: `lod-${child.uuid}`,
          type: 'mesh',
          object: child,
          levels: lodObject.levels,
          currentLevel: level,
          originalGeometry: child.geometry,
          originalMaterial: child.material,
          lodGeometries: new Map(),
          lodMaterials: new Map(),
        };
        
        this.applyMeshLOD(childLodObject, level);
      }
    });
    
    // Apply specific galaxy optimizations
    if (lodObject.object.userData.starCount !== undefined) {
      const originalStarCount = lodObject.object.userData.originalStarCount || lodObject.object.userData.starCount;
      lodObject.object.userData.originalStarCount = originalStarCount;
      
      // Adjust visible star count based on LOD level
      const visibleStarCount = Math.max(100, Math.floor(originalStarCount * level.particleMultiplier));
      lodObject.object.userData.starCount = visibleStarCount;
      
      // Update star visibility if the object has a updateStarVisibility method
      if (typeof lodObject.object.userData.updateStarVisibility === 'function') {
        lodObject.object.userData.updateStarVisibility(visibleStarCount);
      }
    }
  }  
  /**
   * Apply LOD to star system
   * @param lodObject - LOD object
   * @param level - LOD level
   */
  private applyStarSystemLOD(lodObject: LODObject, level: LODLevel): void {
    // Similar to galaxy LOD, but with star system specific optimizations
    
    // Apply LOD to each component
    lodObject.object.traverse((child) => {
      if (child instanceof THREE.Points) {
        // Apply particle LOD
        const childLodObject: LODObject = {
          id: `lod-${child.uuid}`,
          type: 'particles',
          object: child,
          levels: lodObject.levels,
          currentLevel: level,
        };
        
        this.applyParticlesLOD(childLodObject, level);
      } else if (child instanceof THREE.Mesh) {
        // Apply mesh LOD
        const childLodObject: LODObject = {
          id: `lod-${child.uuid}`,
          type: 'mesh',
          object: child,
          levels: lodObject.levels,
          currentLevel: level,
          originalGeometry: child.geometry,
          originalMaterial: child.material,
          lodGeometries: new Map(),
          lodMaterials: new Map(),
        };
        
        this.applyMeshLOD(childLodObject, level);
      }
    });
    
    // Apply specific star system optimizations
    
    // Adjust orbit line segments
    const orbitLines = lodObject.object.children.filter(
      (child) => child.userData.isOrbit
    );
    
    for (const orbitLine of orbitLines) {
      if (orbitLine instanceof THREE.Line && orbitLine.geometry instanceof THREE.BufferGeometry) {
        // Get original segment count
        const originalSegments = orbitLine.userData.originalSegments || 64;
        orbitLine.userData.originalSegments = originalSegments;
        
        // Calculate new segment count
        const newSegments = Math.max(8, Math.floor(originalSegments * level.geometryDetail));
        
        // Only update if segment count changed significantly
        if (Math.abs(orbitLine.userData.currentSegments - newSegments) > 4) {
          // Create new orbit geometry
          const geometry = new THREE.BufferGeometry();
          const positions = new Float32Array(newSegments * 3);
          
          for (let i = 0; i < newSegments; i++) {
            const angle = (i / newSegments) * Math.PI * 2;
            const radius = orbitLine.userData.radius || 10;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
          }
          
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          
          // Update geometry
          orbitLine.geometry.dispose();
          orbitLine.geometry = geometry;
          
          // Store current segments
          orbitLine.userData.currentSegments = newSegments;
        }
      }
    }
  }  
  /**
   * Apply LOD to nebula
   * @param lodObject - LOD object
   * @param level - LOD level
   */
  private applyNebulaLOD(lodObject: LODObject, level: LODLevel): void {
    // Nebula is primarily particle-based
    
    // Apply LOD to each component
    lodObject.object.traverse((child) => {
      if (child instanceof THREE.Points) {
        // Apply particle LOD
        const childLodObject: LODObject = {
          id: `lod-${child.uuid}`,
          type: 'particles',
          object: child,
          levels: lodObject.levels,
          currentLevel: level,
        };
        
        this.applyParticlesLOD(childLodObject, level);
        
        // Adjust particle count
        if (child.geometry instanceof THREE.BufferGeometry) {
          const positionAttribute = child.geometry.getAttribute('position');
          
          if (positionAttribute) {
            const originalCount = child.userData.originalParticleCount || positionAttribute.count;
            child.userData.originalParticleCount = originalCount;
            
            // Calculate visible count
            const visibleCount = Math.max(100, Math.floor(originalCount * level.particleMultiplier));
            
            // Update visibility attribute if it exists
            if (child.geometry.getAttribute('visibility')) {
              const visibilityAttribute = child.geometry.getAttribute('visibility');
              const visibilityArray = visibilityAttribute.array;
              
              // Set visibility based on particle index
              for (let i = 0; i < originalCount; i++) {
                visibilityArray[i] = i < visibleCount ? 1 : 0;
              }
              
              visibilityAttribute.needsUpdate = true;
            }
          }
        }
      }
    });
  }
  
  /**
   * Simplify geometry
   * @param geometry - Original geometry
   * @param detailLevel - Detail level (0.0 - 1.0)
   * @returns Simplified geometry
   */
  private simplifyGeometry(geometry: THREE.BufferGeometry, detailLevel: number): THREE.BufferGeometry {
    // Create a copy of the geometry
    const simplifiedGeometry = geometry.clone();
    
    // Skip if detail level is high
    if (detailLevel >= 0.9) {
      return simplifiedGeometry;
    }    
    // Simple geometry simplification by reducing vertex count
    // This is a basic implementation; a more advanced implementation would use proper decimation
    
    // Get position attribute
    const positionAttribute = simplifiedGeometry.getAttribute('position');
    
    if (positionAttribute && positionAttribute.count > 100) {
      // Calculate target vertex count
      const targetCount = Math.max(20, Math.floor(positionAttribute.count * detailLevel));
      
      // Skip if target count is close to original
      if (targetCount >= positionAttribute.count * 0.9) {
        return simplifiedGeometry;
      }
      
      // Create new position array with reduced vertices
      const stride = Math.ceil(positionAttribute.count / targetCount);
      const newPositions = new Float32Array(targetCount * 3);
      
      for (let i = 0, j = 0; i < positionAttribute.count && j < targetCount; i += stride, j++) {
        newPositions[j * 3] = positionAttribute.getX(i);
        newPositions[j * 3 + 1] = positionAttribute.getY(i);
        newPositions[j * 3 + 2] = positionAttribute.getZ(i);
      }
      
      // Create new geometry with reduced vertices
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
      
      // Copy other attributes if possible
      for (const key in simplifiedGeometry.attributes) {
        if (key !== 'position' && simplifiedGeometry.attributes[key].count === positionAttribute.count) {
          const attribute = simplifiedGeometry.attributes[key];
          const itemSize = attribute.itemSize;
          const newArray = new Float32Array(targetCount * itemSize);
          
          for (let i = 0, j = 0; i < attribute.count && j < targetCount; i += stride, j++) {
            for (let k = 0; k < itemSize; k++) {
              newArray[j * itemSize + k] = attribute.array[i * itemSize + k];
            }
          }
          
          newGeometry.setAttribute(key, new THREE.BufferAttribute(newArray, itemSize));
        }
      }
      
      // Compute vertex normals if needed
      if (!newGeometry.attributes.normal) {
        newGeometry.computeVertexNormals();
      }
      
      // Compute bounding sphere
      newGeometry.computeBoundingSphere();
      
      return newGeometry;
    }
    
    return simplifiedGeometry;
  }  
  /**
   * Simplify material
   * @param material - Original material
   * @param detailLevel - Detail level (0.0 - 1.0)
   * @returns Simplified material
   */
  private simplifyMaterial(
    material: THREE.Material | THREE.Material[],
    detailLevel: number
  ): THREE.Material | THREE.Material[] {
    // Handle material array
    if (Array.isArray(material)) {
      return material.map((m) => this.simplifyMaterial(m, detailLevel) as THREE.Material);
    }
    
    // Create a copy of the material
    const simplifiedMaterial = material.clone();
    
    // Skip if detail level is high
    if (detailLevel >= 0.9) {
      return simplifiedMaterial;
    }
    
    // Apply material simplifications based on type
    if (simplifiedMaterial instanceof THREE.MeshStandardMaterial) {
      // Reduce texture resolution
      this.simplifyTexture(simplifiedMaterial, 'map', detailLevel);
      this.simplifyTexture(simplifiedMaterial, 'normalMap', detailLevel);
      this.simplifyTexture(simplifiedMaterial, 'roughnessMap', detailLevel);
      this.simplifyTexture(simplifiedMaterial, 'metalnessMap', detailLevel);
      this.simplifyTexture(simplifiedMaterial, 'emissiveMap', detailLevel);
      this.simplifyTexture(simplifiedMaterial, 'aoMap', detailLevel);
      
      // Simplify material properties
      if (detailLevel < 0.5) {
        // For very low detail, disable some features
        simplifiedMaterial.flatShading = true;
        simplifiedMaterial.wireframe = detailLevel < 0.2;
      }
    } else if (simplifiedMaterial instanceof THREE.MeshBasicMaterial) {
      // Reduce texture resolution
      this.simplifyTexture(simplifiedMaterial, 'map', detailLevel);
      
      // Simplify material properties
      if (detailLevel < 0.3) {
        simplifiedMaterial.wireframe = true;
      }
    }
    
    return simplifiedMaterial;
  }  
  /**
   * Simplify texture
   * @param material - Material
   * @param mapName - Texture map name
   * @param detailLevel - Detail level (0.0 - 1.0)
   */
  private simplifyTexture(material: any, mapName: string, detailLevel: number): void {
    const texture = material[mapName];
    
    if (!texture) {
      return;
    }
    
    // Store original texture if not already stored
    if (!material.userData.originalTextures) {
      material.userData.originalTextures = {};
    }
    
    if (!material.userData.originalTextures[mapName]) {
      material.userData.originalTextures[mapName] = texture;
    }
    
    // Skip if detail level is high
    if (detailLevel >= 0.9) {
      return;
    }
    
    // Reduce texture resolution
    if (detailLevel < 0.5) {
      // For very low detail, remove texture
      material[mapName] = null;
    } else {
      // Reduce anisotropy
      if (texture.anisotropy) {
        texture.anisotropy = Math.max(1, Math.floor(texture.anisotropy * detailLevel));
      }
      
      // Reduce mipmaps
      if (detailLevel < 0.7 && texture.generateMipmaps) {
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
      }
    }
  }
  
  /**
   * Dispose resources
   */
  dispose(): void {
    // Restore original geometries and materials
    this.objects.forEach((lodObject) => {
      if (lodObject.object instanceof THREE.Mesh && lodObject.originalGeometry && lodObject.originalMaterial) {
        lodObject.object.geometry = lodObject.originalGeometry;
        lodObject.object.material = lodObject.originalMaterial;
      }
      
      // Dispose LOD geometries
      lodObject.lodGeometries?.forEach((geometry) => {
        geometry.dispose();
      });
      
      // Dispose LOD materials
      lodObject.lodMaterials?.forEach((material) => {
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else {
          material.dispose();
        }
      });
    });
    
    // Clear objects
    this.objects.clear();
    
    this.log('LOD Manager disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[LODManager] ${message}`);
    }
  }
}

export { LODManager };