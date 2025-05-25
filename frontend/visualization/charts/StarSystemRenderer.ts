/**
 * Star System Renderer
 *
 * Renders a star system visualization using Three.js.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { BaseRenderer } from './BaseRenderer';
import { CosmicObject, CosmicObjectType, CosmicObjectStyle, CosmicSystem } from '../cosmic/types';

/**
 * Star System Renderer Options
 */
interface StarSystemRendererOptions {
  /** Show labels */
  showLabels?: boolean;
  
  /** Show connections */
  showConnections?: boolean;
  
  /** Show features */
  showFeatures?: boolean;
  
  /** Enable animations */
  enableAnimations?: boolean;
  
  /** Enable interactions */
  enableInteractions?: boolean;
  
  /** Enable physics */
  enablePhysics?: boolean;
  
  /** Enable zoom */
  enableZoom?: boolean;
  
  /** Enable pan */
  enablePan?: boolean;
  
  /** Enable rotation */
  enableRotation?: boolean;
  
  /** Theme */
  theme?: 'dark' | 'light' | 'quantum' | 'nebula';
  
  /** Width */
  width?: number;
  
  /** Height */
  height?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default options
 */
const defaultOptions: StarSystemRendererOptions = {
  showLabels: true,
  showConnections: true,
  showFeatures: true,
  enableAnimations: true,
  enableInteractions: true,
  enablePhysics: true,
  enableZoom: true,
  enablePan: true,
  enableRotation: true,
  theme: 'quantum',
  width: 800,
  height: 600,
  debugMode: false,
};

/**
 * Star System Renderer
 */
export class StarSystemRenderer implements BaseRenderer {
  /** Options */
  private options: StarSystemRendererOptions;
  
  /** Scene */
  private scene: THREE.Scene | null = null;
  
  /** Camera */
  private camera: THREE.PerspectiveCamera | null = null;
  
  /** Renderer */
  private renderer: THREE.WebGLRenderer | null = null;
  
  /** Label renderer */
  private labelRenderer: CSS2DRenderer | null = null;
  
  /** Controls */
  private controls: OrbitControls | null = null;
  
  /** Composer */
  private composer: EffectComposer | null = null;
  
  /** Animation frame ID */
  private animationFrameId: number | null = null;
  
  /** Objects map */
  private objects: Map<string, THREE.Object3D> = new Map();
  
  /** Connections map */
  private connections: Map<string, THREE.Line> = new Map();
  
  /** Labels map */
  private labels: Map<string, CSS2DObject> = new Map();
  
  /** Event listeners */
  private eventListeners: Map<string, Function[]> = new Map();
  
  /** Raycaster */
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  
  /** Mouse position */
  private mouse: THREE.Vector2 = new THREE.Vector2();
  
  /** Hovered object */
  private hoveredObject: CosmicObject | null = null;
  
  /** Selected objects */
  private selectedObjects: CosmicObject[] = [];
  
  /**
   * Constructor
   * @param options - Renderer options
   */
  constructor(options: StarSystemRendererOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }
  
  /**
   * Initialize the renderer
   * @param options - Initialization options
   */
  initialize(options: any = {}): void {
    // Merge options
    this.options = {
      ...this.options,
      ...options,
    };
    
    this.log('Initializing Star System Renderer');
  }
  
  /**
   * Render the visualization
   * @param element - DOM element
   * @param data - Visualization data
   * @param options - Render options
   */
  render(element: HTMLElement, data: any, options: any = {}): void {
    if (!element) {
      throw new Error('Element is required');
    }
    
    // Merge options
    this.options = {
      ...this.options,
      ...options,
    };
    
    // Extract system data
    const system = data as CosmicSystem;
    if (!system) {
      throw new Error('Invalid system data');
    }
    
    // Setup scene
    this.setupScene(element);
    
    // Render system
    this.renderSystem(system);
    
    // Start animation loop
    this.startAnimationLoop();
    
    this.log('Rendered star system');
  }
  
  /**
   * Setup Three.js scene
   * @param element - DOM element
   */
  private setupScene(element: HTMLElement): void {
    const width = this.options.width || element.clientWidth;
    const height = this.options.height || element.clientHeight;
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Set background based on theme
    if (this.options.theme === 'dark') {
      this.scene.background = new THREE.Color(0x000000);
    } else if (this.options.theme === 'light') {
      this.scene.background = new THREE.Color(0xffffff);
    } else if (this.options.theme === 'quantum') {
      this.scene.background = new THREE.Color(0x0a0a1a);
    } else if (this.options.theme === 'nebula') {
      this.scene.background = new THREE.Color(0x0a001a);
    }
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    this.camera.position.z = 500;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    element.appendChild(this.renderer.domElement);
    
    // Create label renderer
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(width, height);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    element.appendChild(this.labelRenderer.domElement);
    
    // Create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = this.options.enableZoom !== false;
    this.controls.enablePan = this.options.enablePan !== false;
    this.controls.enableRotate = this.options.enableRotation !== false;
    
    // Create post-processing
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Add bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    this.composer.addPass(bloomPass);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    
    // Add point light at camera position
    const pointLight = new THREE.PointLight(0xffffff, 1);
    this.camera.add(pointLight);
    this.scene.add(this.camera);
    
    // Add event listeners
    if (this.options.enableInteractions !== false) {
      this.setupEventListeners(element);
    }
  }  
  /**
   * Setup event listeners
   * @param element - DOM element
   */
  private setupEventListeners(element: HTMLElement): void {
    const onMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = element.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / (this.options.width || element.clientWidth)) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / (this.options.height || element.clientHeight)) * 2 + 1;
      
      // Update the picking ray with the camera and mouse position
      if (this.camera) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
      }
      
      // Calculate objects intersecting the picking ray
      if (this.scene) {
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
          // Find the first intersected object that has userData.cosmicObject
          const intersectedObject = intersects.find(intersect => 
            intersect.object.userData.cosmicObject
          );
          
          if (intersectedObject) {
            const cosmicObject = intersectedObject.object.userData.cosmicObject as CosmicObject;
            
            if (this.hoveredObject?.id !== cosmicObject.id) {
              this.hoveredObject = cosmicObject;
              this.emit('hover', { object: cosmicObject });
            }
            
            return;
          }
        }
        
        // No intersection
        if (this.hoveredObject) {
          this.hoveredObject = null;
          this.emit('hover', { object: null });
        }
      }
    };
    
    const onClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = element.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / (this.options.width || element.clientWidth)) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / (this.options.height || element.clientHeight)) * 2 + 1;
      
      // Update the picking ray with the camera and mouse position
      if (this.camera) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
      }
      
      // Calculate objects intersecting the picking ray
      if (this.scene) {
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
          // Find the first intersected object that has userData.cosmicObject
          const intersectedObject = intersects.find(intersect => 
            intersect.object.userData.cosmicObject
          );
          
          if (intersectedObject) {
            const cosmicObject = intersectedObject.object.userData.cosmicObject as CosmicObject;
            
            // Update selection
            if (event.ctrlKey || event.metaKey) {
              // Multi-select
              const index = this.selectedObjects.findIndex(obj => obj.id === cosmicObject.id);
              
              if (index >= 0) {
                // Deselect
                this.selectedObjects.splice(index, 1);
              } else {
                // Select
                this.selectedObjects.push(cosmicObject);
              }
            } else {
              // Single select
              this.selectedObjects = [cosmicObject];
            }
            
            this.emit('select', { objects: this.selectedObjects, lastSelected: cosmicObject });
            
            return;
          }
        }
        
        // No intersection, clear selection if not multi-select
        if (!(event.ctrlKey || event.metaKey)) {
          this.selectedObjects = [];
          this.emit('select', { objects: [] });
        }
      }
    };
    
    // Add event listeners
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('click', onClick);
    
    // Store event listeners for cleanup
    this.addEventListener('cleanup', () => {
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('click', onClick);
    });
  }
  
  /**
   * Render a cosmic system
   * @param system - Cosmic system
   */
  private renderSystem(system: CosmicSystem): void {
    if (!this.scene) return;
    
    // Clear previous objects
    this.objects.forEach((object) => {
      this.scene?.remove(object);
    });
    this.objects.clear();
    
    // Clear previous connections
    this.connections.forEach((line) => {
      this.scene?.remove(line);
    });
    this.connections.clear();
    
    // Clear previous labels
    this.labels.forEach((label) => {
      this.scene?.remove(label);
    });
    this.labels.clear();
    
    // Create central object
    const centralObject = this.createCosmicObject(system.centralObject);
    if (centralObject) {
      this.scene.add(centralObject);
      this.objects.set(system.centralObject.id, centralObject);
      
      // Create label for central object
      if (this.options.showLabels !== false) {
        const label = this.createLabel(system.centralObject);
        if (label) {
          centralObject.add(label);
          this.labels.set(system.centralObject.id, label);
        }
      }
    }
    
    // Create orbiting objects
    system.orbitingObjects.forEach((cosmicObject) => {
      const object = this.createCosmicObject(cosmicObject);
      if (object) {
        // Position object based on orbit
        this.positionObjectInOrbit(object, cosmicObject);
        
        this.scene?.add(object);
        this.objects.set(cosmicObject.id, object);
        
        // Create label for object
        if (this.options.showLabels !== false) {
          const label = this.createLabel(cosmicObject);
          if (label) {
            object.add(label);
            this.labels.set(cosmicObject.id, label);
          }
        }
      }
    });
    
    // Create connections
    if (this.options.showConnections !== false) {
      system.connections.forEach((connection) => {
        const line = this.createConnection(connection);
        if (line) {
          this.scene?.add(line);
          this.connections.set(connection.id, line);
        }
      });
    }
  }  
  /**
   * Create a cosmic object
   * @param cosmicObject - Cosmic object
   * @returns Three.js object
   */
  private createCosmicObject(cosmicObject: CosmicObject): THREE.Object3D | null {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;
    
    // Create geometry based on object type
    switch (cosmicObject.type) {
      case CosmicObjectType.STAR_SYSTEM:
      case CosmicObjectType.STAR:
        geometry = new THREE.SphereGeometry(cosmicObject.size || 1, 32, 32);
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cosmicObject.color),
          emissive: new THREE.Color(cosmicObject.color),
          emissiveIntensity: 0.8,
          roughness: 0.2,
          metalness: 0.5,
        });
        break;
        
      case CosmicObjectType.PLANET:
        geometry = new THREE.SphereGeometry(cosmicObject.size || 0.5, 32, 32);
        
        if (cosmicObject.style === CosmicObjectStyle.ROCKY) {
          material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(cosmicObject.color),
            roughness: 0.8,
            metalness: 0.2,
          });
        } else if (cosmicObject.style === CosmicObjectStyle.GAS) {
          material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(cosmicObject.color),
            roughness: 0.4,
            metalness: 0.3,
            transparent: true,
            opacity: 0.9,
          });
        } else if (cosmicObject.style === CosmicObjectStyle.QUANTUM) {
          material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(cosmicObject.color),
            emissive: new THREE.Color(cosmicObject.color),
            emissiveIntensity: 0.3,
            roughness: 0.3,
            metalness: 0.7,
          });
        } else {
          material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(cosmicObject.color),
            roughness: 0.5,
            metalness: 0.5,
          });
        }
        break;
        
      case CosmicObjectType.MOON:
        geometry = new THREE.SphereGeometry(cosmicObject.size || 0.3, 24, 24);
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cosmicObject.color),
          roughness: 0.7,
          metalness: 0.3,
        });
        break;
        
      case CosmicObjectType.ASTEROID:
        geometry = new THREE.IcosahedronGeometry(cosmicObject.size || 0.2, 0);
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cosmicObject.color),
          roughness: 0.9,
          metalness: 0.1,
        });
        break;
        
      case CosmicObjectType.COMET:
        // Create comet head
        const cometGroup = new THREE.Group();
        
        const headGeometry = new THREE.SphereGeometry(cosmicObject.size || 0.3, 24, 24);
        const headMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cosmicObject.color),
          emissive: new THREE.Color(cosmicObject.color),
          emissiveIntensity: 0.5,
          roughness: 0.4,
          metalness: 0.6,
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        cometGroup.add(head);
        
        // Create comet tail
        const tailGeometry = new THREE.ConeGeometry(0.2, 1, 16);
        tailGeometry.rotateX(Math.PI / 2);
        tailGeometry.translate(0, 0, -0.5);
        const tailMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cosmicObject.color),
          emissive: new THREE.Color(cosmicObject.color),
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.7,
        });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        cometGroup.add(tail);
        
        // Store cosmic object data
        cometGroup.userData.cosmicObject = cosmicObject;
        
        return cometGroup;
        
      default:
        geometry = new THREE.SphereGeometry(cosmicObject.size || 0.5, 16, 16);
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cosmicObject.color),
          roughness: 0.5,
          metalness: 0.5,
        });
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Store cosmic object data
    mesh.userData.cosmicObject = cosmicObject;
    
    return mesh;
  }  
  /**
   * Position object in orbit
   * @param object - Three.js object
   * @param cosmicObject - Cosmic object
   */
  private positionObjectInOrbit(object: THREE.Object3D, cosmicObject: CosmicObject): void {
    const angle = cosmicObject.angle || Math.random() * Math.PI * 2;
    const distance = cosmicObject.distance || 100;
    
    object.position.x = Math.cos(angle) * distance;
    object.position.z = Math.sin(angle) * distance;
  }
  
  /**
   * Create a connection
   * @param connection - Cosmic connection
   * @returns Three.js line
   */
  private createConnection(connection: any): THREE.Line | null {
    const sourceObject = this.objects.get(connection.sourceId);
    const targetObject = this.objects.get(connection.targetId);
    
    if (!sourceObject || !targetObject) {
      return null;
    }
    
    // Create line geometry
    const points = [
      sourceObject.position,
      targetObject.position,
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create line material
    let material: THREE.LineBasicMaterial | THREE.LineDashedMaterial;
    
    if (connection.style === 'dashed') {
      material = new THREE.LineDashedMaterial({
        color: new THREE.Color(connection.color || 0xffffff),
        linewidth: connection.width || 1,
        scale: 1,
        dashSize: 3,
        gapSize: 1,
      });
    } else if (connection.style === 'dotted') {
      material = new THREE.LineDashedMaterial({
        color: new THREE.Color(connection.color || 0xffffff),
        linewidth: connection.width || 1,
        scale: 1,
        dashSize: 1,
        gapSize: 1,
      });
    } else {
      material = new THREE.LineBasicMaterial({
        color: new THREE.Color(connection.color || 0xffffff),
        linewidth: connection.width || 1,
      });
    }
    
    const line = new THREE.Line(geometry, material);
    
    // Compute line distances for dashed lines
    if (connection.style === 'dashed' || connection.style === 'dotted') {
      line.computeLineDistances();
    }
    
    // Store connection data
    line.userData.cosmicConnection = connection;
    
    return line;
  }
  
  /**
   * Create a label
   * @param cosmicObject - Cosmic object
   * @returns CSS2D object
   */
  private createLabel(cosmicObject: CosmicObject): CSS2DObject | null {
    const div = document.createElement('div');
    div.className = 'cosmic-label';
    div.textContent = cosmicObject.name;
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    div.style.color = 'white';
    div.style.padding = '2px 5px';
    div.style.borderRadius = '3px';
    div.style.fontSize = '12px';
    div.style.pointerEvents = 'none';
    
    const label = new CSS2DObject(div);
    label.position.set(0, cosmicObject.size ? cosmicObject.size + 0.5 : 1.5, 0);
    
    return label;
  }
  
  /**
   * Start animation loop
   */
  private startAnimationLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      
      // Update controls
      if (this.controls) {
        this.controls.update();
      }
      
      // Update animations
      if (this.options.enableAnimations !== false) {
        // Rotate objects
        this.objects.forEach((object) => {
          const cosmicObject = object.userData.cosmicObject as CosmicObject;
          if (cosmicObject.rotationSpeed) {
            object.rotation.y += 0.01 * cosmicObject.rotationSpeed;
          }
        });
      }
      
      // Render
      if (this.composer) {
        this.composer.render();
      } else if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      
      // Render labels
      if (this.labelRenderer && this.scene && this.camera) {
        this.labelRenderer.render(this.scene, this.camera);
      }
    };
    
    animate();
  }
  
  /**
   * Update the visualization
   * @param data - Visualization data
   * @param options - Update options
   */
  update(data: any, options: any = {}): void {
    // Merge options
    this.options = {
      ...this.options,
      ...options,
    };
    
    // Extract system data
    const system = data as CosmicSystem;
    if (!system) {
      throw new Error('Invalid system data');
    }
    
    // Render system
    this.renderSystem(system);
    
    this.log('Updated star system');
  }
  
  /**
   * Resize the visualization
   * @param width - New width
   * @param height - New height
   */
  resize(width: number, height: number): void {
    this.options.width = width;
    this.options.height = height;
    
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
    
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
    
    if (this.labelRenderer) {
      this.labelRenderer.setSize(width, height);
    }
    
    if (this.composer) {
      this.composer.setSize(width, height);
    }
    
    this.log(`Resized to ${width}x${height}`);
  }
  
  /**
   * Dispose the renderer
   */
  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Emit cleanup event
    this.emit('cleanup', {});
    
    // Dispose resources
    this.objects.forEach((object) => {
      if ((object as any).geometry) {
        (object as any).geometry.dispose();
      }
      
      if ((object as THREE.Mesh).material) {
        const material = (object as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach(m => m.dispose());
        } else {
          material.dispose();
        }
      }
    });
    
    this.connections.forEach((line) => {
      if (line.geometry) {
        line.geometry.dispose();
      }
      
      if (line.material) {
        const material = line.material;
        if (Array.isArray(material)) {
          material.forEach(m => m.dispose());
        } else {
          material.dispose();
        }
      }
    });
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Clear event listeners
    this.eventListeners.clear();
    
    this.log('Disposed');
  }
  
  /**
   * Add event listener
   * @param event - Event name
   * @param callback - Event callback
   */
  addEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    
    this.eventListeners.get(event)?.push(callback);
  }
  
  /**
   * Remove event listener
   * @param event - Event name
   * @param callback - Event callback
   */
  removeEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      return;
    }
    
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    }
  }
  
  /**
   * Emit event
   * @param event - Event name
   * @param data - Event data
   */
  private emit(event: string, data: any): void {
    if (!this.eventListeners.has(event)) {
      return;
    }
    
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
  
  /**
   * Log message
   * @param message - Log message
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[StarSystemRenderer] ${message}`);
    }
  }
}