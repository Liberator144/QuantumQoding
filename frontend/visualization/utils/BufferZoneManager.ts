/**
 * Buffer Zone Manager
 *
 * Manages buffer zones for efficient rendering of large scenes.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';

/**
 * Buffer Zone
 */
export interface BufferZone {
  /** Zone ID */
  id: string;
  
  /** Center position */
  center: THREE.Vector3;
  
  /** Size */
  size: THREE.Vector3;
  
  /** Bounding box */
  boundingBox: THREE.Box3;
  
  /** Objects in zone */
  objects: THREE.Object3D[];
  
  /** Is active */
  isActive: boolean;
  
  /** Distance to camera */
  distanceToCamera: number;
  
  /** Last update time */
  lastUpdateTime: number;
}

/**
 * Buffer Zone Manager Options
 */
export interface BufferZoneManagerOptions {
  /** Zone size */
  zoneSize?: number;
  
  /** Active zone radius */
  activeZoneRadius?: number;
  
  /** Preload zone radius */
  preloadZoneRadius?: number;
  
  /** Load zone buffer */
  loadZoneBuffer?: number;
  
  /** Unload zone buffer */
  unloadZoneBuffer?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default options
 */
const defaultOptions: BufferZoneManagerOptions = {
  zoneSize: 100,
  activeZoneRadius: 2,
  preloadZoneRadius: 3,
  loadZoneBuffer: 1,
  unloadZoneBuffer: 2,
  debugMode: false,
};/**
 * Zone coordinates
 */
interface ZoneCoordinates {
  x: number;
  y: number;
  z: number;
}

/**
 * Buffer Zone Manager
 */
export class BufferZoneManager {
  /** Options */
  private options: BufferZoneManagerOptions;
  
  /** Scene */
  private scene: THREE.Scene;
  
  /** Camera */
  private camera: THREE.Camera;
  
  /** Buffer zones */
  private zones: Map<string, BufferZone> = new Map();
  
  /** Current zone coordinates */
  private currentZoneCoordinates: ZoneCoordinates = { x: 0, y: 0, z: 0 };
  
  /** Active zones */
  private activeZones: Set<string> = new Set();
  
  /** Preload zones */
  private preloadZones: Set<string> = new Set();
  
  /** Object zone map */
  private objectZoneMap: Map<string, string> = new Map();
  
  /** Zone helpers */
  private zoneHelpers: Map<string, THREE.Box3Helper> = new Map();
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /** Stats */
  private stats = {
    totalZones: 0,
    activeZones: 0,
    preloadZones: 0,
    totalObjects: 0,
    visibleObjects: 0,
  };
  
  /**
   * Constructor
   * @param scene - Scene
   * @param camera - Camera
   * @param options - Options
   */
  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    options: BufferZoneManagerOptions = {}
  ) {
    this.scene = scene;
    this.camera = camera;
    
    this.options = {
      ...defaultOptions,
      ...options,
    };
    
    this.log('Buffer Zone Manager initialized');
  }  
  /**
   * Initialize the buffer zone manager
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    // Create initial zones
    this.createInitialZones();
    
    // Mark as initialized
    this.isInitialized = true;
    
    this.log('Buffer Zone Manager started');
  }
  
  /**
   * Create initial zones
   */
  private createInitialZones(): void {
    // Get camera position
    const cameraPosition = new THREE.Vector3();
    this.camera.getWorldPosition(cameraPosition);
    
    // Calculate current zone coordinates
    this.currentZoneCoordinates = this.getZoneCoordinates(cameraPosition);
    
    // Create zones around camera
    const radius = this.options.preloadZoneRadius!;
    
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        for (let z = -radius; z <= radius; z++) {
          const zoneCoordinates: ZoneCoordinates = {
            x: this.currentZoneCoordinates.x + x,
            y: this.currentZoneCoordinates.y + y,
            z: this.currentZoneCoordinates.z + z,
          };
          
          this.createZone(zoneCoordinates);
        }
      }
    }
    
    // Update active zones
    this.updateActiveZones();
    
    // Assign objects to zones
    this.assignObjectsToZones();
  }
  
  /**
   * Get zone coordinates for position
   * @param position - Position
   * @returns Zone coordinates
   */
  private getZoneCoordinates(position: THREE.Vector3): ZoneCoordinates {
    const zoneSize = this.options.zoneSize!;
    
    return {
      x: Math.floor(position.x / zoneSize),
      y: Math.floor(position.y / zoneSize),
      z: Math.floor(position.z / zoneSize),
    };
  }  
  /**
   * Get zone ID for coordinates
   * @param coordinates - Zone coordinates
   * @returns Zone ID
   */
  private getZoneId(coordinates: ZoneCoordinates): string {
    return `zone-${coordinates.x}-${coordinates.y}-${coordinates.z}`;
  }
  
  /**
   * Create zone
   * @param coordinates - Zone coordinates
   * @returns Buffer zone
   */
  private createZone(coordinates: ZoneCoordinates): BufferZone {
    // Generate zone ID
    const zoneId = this.getZoneId(coordinates);
    
    // Check if zone already exists
    if (this.zones.has(zoneId)) {
      return this.zones.get(zoneId)!;
    }
    
    // Calculate zone center
    const zoneSize = this.options.zoneSize!;
    const center = new THREE.Vector3(
      (coordinates.x + 0.5) * zoneSize,
      (coordinates.y + 0.5) * zoneSize,
      (coordinates.z + 0.5) * zoneSize
    );
    
    // Calculate zone size
    const size = new THREE.Vector3(zoneSize, zoneSize, zoneSize);
    
    // Calculate bounding box
    const boundingBox = new THREE.Box3(
      new THREE.Vector3(
        coordinates.x * zoneSize,
        coordinates.y * zoneSize,
        coordinates.z * zoneSize
      ),
      new THREE.Vector3(
        (coordinates.x + 1) * zoneSize,
        (coordinates.y + 1) * zoneSize,
        (coordinates.z + 1) * zoneSize
      )
    );
    
    // Create zone
    const zone: BufferZone = {
      id: zoneId,
      center,
      size,
      boundingBox,
      objects: [],
      isActive: false,
      distanceToCamera: Infinity,
      lastUpdateTime: performance.now(),
    };
    
    // Store zone
    this.zones.set(zoneId, zone);
    
    // Create zone helper if debug mode is enabled
    if (this.options.debugMode) {
      const helper = new THREE.Box3Helper(boundingBox, new THREE.Color(0x00ff00));
      this.scene.add(helper);
      this.zoneHelpers.set(zoneId, helper);
    }
    
    // Update stats
    this.stats.totalZones = this.zones.size;
    
    return zone;
  }  
  /**
   * Update active zones
   */
  private updateActiveZones(): void {
    // Get camera position
    const cameraPosition = new THREE.Vector3();
    this.camera.getWorldPosition(cameraPosition);
    
    // Calculate current zone coordinates
    const currentCoordinates = this.getZoneCoordinates(cameraPosition);
    
    // Check if camera moved to a new zone
    if (currentCoordinates.x !== this.currentZoneCoordinates.x ||
        currentCoordinates.y !== this.currentZoneCoordinates.y ||
        currentCoordinates.z !== this.currentZoneCoordinates.z) {
      
      // Update current zone coordinates
      this.currentZoneCoordinates = currentCoordinates;
      
      // Create new zones if needed
      const preloadRadius = this.options.preloadZoneRadius!;
      
      for (let x = -preloadRadius; x <= preloadRadius; x++) {
        for (let y = -preloadRadius; y <= preloadRadius; y++) {
          for (let z = -preloadRadius; z <= preloadRadius; z++) {
            const zoneCoordinates: ZoneCoordinates = {
              x: currentCoordinates.x + x,
              y: currentCoordinates.y + y,
              z: currentCoordinates.z + z,
            };
            
            // Create zone if it doesn't exist
            if (!this.zones.has(this.getZoneId(zoneCoordinates))) {
              this.createZone(zoneCoordinates);
            }
          }
        }
      }
    }
    
    // Clear active and preload zones
    this.activeZones.clear();
    this.preloadZones.clear();
    
    // Update zone distances and status
    this.zones.forEach((zone) => {
      // Calculate distance to camera
      zone.distanceToCamera = zone.center.distanceTo(cameraPosition);
      
      // Calculate zone coordinates
      const zoneCoordinates = this.getZoneCoordinates(zone.center);
      
      // Calculate distance to current zone in zone units
      const zoneDistance = Math.max(
        Math.abs(zoneCoordinates.x - currentCoordinates.x),
        Math.abs(zoneCoordinates.y - currentCoordinates.y),
        Math.abs(zoneCoordinates.z - currentCoordinates.z)
      );
      
      // Update zone status
      if (zoneDistance <= this.options.activeZoneRadius!) {
        zone.isActive = true;
        this.activeZones.add(zone.id);
      } else if (zoneDistance <= this.options.preloadZoneRadius!) {
        zone.isActive = false;
        this.preloadZones.add(zone.id);
      } else {
        zone.isActive = false;
      }      
      // Update zone helper color if debug mode is enabled
      if (this.options.debugMode && this.zoneHelpers.has(zone.id)) {
        const helper = this.zoneHelpers.get(zone.id)!;
        
        if (zone.isActive) {
          helper.material.color.set(0x00ff00); // Green for active zones
        } else if (this.preloadZones.has(zone.id)) {
          helper.material.color.set(0xffff00); // Yellow for preload zones
        } else {
          helper.material.color.set(0xff0000); // Red for inactive zones
        }
      }
    });
    
    // Update stats
    this.stats.activeZones = this.activeZones.size;
    this.stats.preloadZones = this.preloadZones.size;
    
    // Update object visibility
    this.updateObjectVisibility();
  }
  
  /**
   * Assign objects to zones
   */
  private assignObjectsToZones(): void {
    // Clear object zone map
    this.objectZoneMap.clear();
    
    // Clear zone objects
    this.zones.forEach((zone) => {
      zone.objects = [];
    });
    
    // Assign objects to zones
    this.scene.traverse((object) => {
      if (object.visible && !(object instanceof THREE.Camera) && !(object instanceof THREE.Light)) {
        this.assignObjectToZone(object);
      }
    });
    
    // Update stats
    this.stats.totalObjects = this.objectZoneMap.size;
  }
  
  /**
   * Assign object to zone
   * @param object - Object to assign
   */
  private assignObjectToZone(object: THREE.Object3D): void {
    // Generate object ID
    const objectId = `object-${object.uuid}`;
    
    // Get object position
    const objectPosition = new THREE.Vector3();
    object.getWorldPosition(objectPosition);
    
    // Get zone coordinates
    const zoneCoordinates = this.getZoneCoordinates(objectPosition);
    
    // Get zone ID
    const zoneId = this.getZoneId(zoneCoordinates);
    
    // Create zone if it doesn't exist
    if (!this.zones.has(zoneId)) {
      this.createZone(zoneCoordinates);
    }    
    // Get zone
    const zone = this.zones.get(zoneId)!;
    
    // Add object to zone
    zone.objects.push(object);
    
    // Map object to zone
    this.objectZoneMap.set(objectId, zoneId);
  }
  
  /**
   * Update object visibility
   */
  private updateObjectVisibility(): void {
    // Reset visible objects count
    this.stats.visibleObjects = 0;
    
    // Update object visibility based on zone status
    this.objectZoneMap.forEach((zoneId, objectId) => {
      // Get object
      const objectUuid = objectId.replace('object-', '');
      let object: THREE.Object3D | null = null;
      
      this.scene.traverse((node) => {
        if (node.uuid === objectUuid) {
          object = node;
        }
      });
      
      if (!object) {
        return;
      }
      
      // Get zone
      if (!this.zones.has(zoneId)) {
        return;
      }
      
      const zone = this.zones.get(zoneId)!;
      
      // Update object visibility
      if (zone.isActive || this.preloadZones.has(zoneId)) {
        object.visible = true;
        this.stats.visibleObjects++;
      } else {
        object.visible = false;
      }
    });
  }
  
  /**
   * Register object
   * @param object - Object to register
   */
  registerObject(object: THREE.Object3D): void {
    // Assign object to zone
    this.assignObjectToZone(object);
    
    // Update object visibility
    this.updateObjectVisibility();
  }
  
  /**
   * Unregister object
   * @param object - Object to unregister
   */
  unregisterObject(object: THREE.Object3D): void {
    // Generate object ID
    const objectId = `object-${object.uuid}`;
    
    // Check if object is registered
    if (!this.objectZoneMap.has(objectId)) {
      return;
    }    
    // Get zone ID
    const zoneId = this.objectZoneMap.get(objectId)!;
    
    // Get zone
    if (this.zones.has(zoneId)) {
      const zone = this.zones.get(zoneId)!;
      
      // Remove object from zone
      zone.objects = zone.objects.filter((obj) => obj !== object);
    }
    
    // Remove object from map
    this.objectZoneMap.delete(objectId);
    
    // Update stats
    this.stats.totalObjects = this.objectZoneMap.size;
  }
  
  /**
   * Update
   */
  update(): void {
    if (!this.isInitialized) {
      return;
    }
    
    // Update active zones
    this.updateActiveZones();
  }
  
  /**
   * Get active zones
   * @returns Active zones
   */
  getActiveZones(): BufferZone[] {
    return Array.from(this.activeZones).map((zoneId) => this.zones.get(zoneId)!);
  }
  
  /**
   * Get preload zones
   * @returns Preload zones
   */
  getPreloadZones(): BufferZone[] {
    return Array.from(this.preloadZones).map((zoneId) => this.zones.get(zoneId)!);
  }
  
  /**
   * Get zone for position
   * @param position - Position
   * @returns Zone
   */
  getZoneForPosition(position: THREE.Vector3): BufferZone | null {
    // Get zone coordinates
    const zoneCoordinates = this.getZoneCoordinates(position);
    
    // Get zone ID
    const zoneId = this.getZoneId(zoneCoordinates);
    
    // Return zone if it exists
    if (this.zones.has(zoneId)) {
      return this.zones.get(zoneId)!;
    }
    
    return null;
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
  setOptions(options: BufferZoneManagerOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };
    
    // Update zones if needed
    if (options.zoneSize !== undefined || 
        options.activeZoneRadius !== undefined || 
        options.preloadZoneRadius !== undefined) {
      
      // Clear existing zones
      this.zones.clear();
      this.activeZones.clear();
      this.preloadZones.clear();
      this.objectZoneMap.clear();
      
      // Remove zone helpers
      if (this.options.debugMode) {
        this.zoneHelpers.forEach((helper) => {
          this.scene.remove(helper);
        });
        
        this.zoneHelpers.clear();
      }
      
      // Create initial zones
      this.createInitialZones();
    }
  }
  
  /**
   * Dispose
   */
  dispose(): void {
    // Remove zone helpers
    if (this.options.debugMode) {
      this.zoneHelpers.forEach((helper) => {
        this.scene.remove(helper);
      });
      
      this.zoneHelpers.clear();
    }
    
    // Clear zones
    this.zones.clear();
    this.activeZones.clear();
    this.preloadZones.clear();
    this.objectZoneMap.clear();
    
    // Mark as not initialized
    this.isInitialized = false;
    
    this.log('Buffer Zone Manager disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[BufferZoneManager] ${message}`);
    }
  }
}

export { BufferZoneManager };