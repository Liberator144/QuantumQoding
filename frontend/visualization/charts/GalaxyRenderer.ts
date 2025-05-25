/**
 * Galaxy Renderer
 *
 * Renders a galaxy visualization using Three.js.
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
import { 
  CosmicGalaxy, 
  CosmicSystem, 
  CosmicObject, 
  CosmicStarCluster,
  CosmicObjectType, 
  CosmicObjectStyle,
  GalaxyType
} from '../cosmic/types';

/**
 * Galaxy Renderer Options
 */
interface GalaxyRendererOptions {
  /** Show labels */
  showLabels?: boolean;
  
  /** Show connections */
  showConnections?: boolean;
  
  /** Show star systems */
  showStarSystems?: boolean;
  
  /** Show nebulae */
  showNebulae?: boolean;
  
  /** Show black holes */
  showBlackHoles?: boolean;
  
  /** Show gravitational lensing */
  showGravitationalLensing?: boolean;
  
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
}/**
 * Default options
 */
const defaultOptions: GalaxyRendererOptions = {
  showLabels: true,
  showConnections: true,
  showStarSystems: true,
  showNebulae: true,
  showBlackHoles: true,
  showGravitationalLensing: false,
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
 * Galaxy Renderer
 */
export class GalaxyRenderer implements BaseRenderer {
  /** Options */
  private options: GalaxyRendererOptions;
  
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
  
  /** Galaxy object */
  private galaxyObject: THREE.Object3D | null = null;
  
  /** Star systems map */
  private starSystems: Map<string, THREE.Object3D> = new Map();
  
  /** Star clusters map */
  private starClusters: Map<string, THREE.Object3D> = new Map();
  
  /** Nebulae map */
  private nebulae: Map<string, THREE.Object3D> = new Map();
  
  /** Black holes map */
  private blackHoles: Map<string, THREE.Object3D> = new Map();
  
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
  private hoveredObject: any | null = null;
  
  /** Selected objects */
  private selectedObjects: any[] = [];
  
  /** Last data rendered */
  private lastData: CosmicGalaxy | null = null;  
  /**
   * Constructor
   * @param options - Renderer options
   */
  constructor(options: GalaxyRendererOptions = {}) {
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
    
    this.log('Initializing Galaxy Renderer');
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
    
    // Extract galaxy data
    const galaxy = data as CosmicGalaxy;
    if (!galaxy) {
      throw new Error('Invalid galaxy data');
    }
    
    // Store last data
    this.lastData = galaxy;
    
    // Setup scene
    this.setupScene(element);
    
    // Render galaxy
    this.renderGalaxy(galaxy);
    
    // Start animation loop
    this.startAnimationLoop();
    
    this.log('Rendered galaxy');
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
    this.camera = new THREE.PerspectiveCamera(60, width / height, 10, 50000);
    this.camera.position.z = 2000;
    
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
    this.controls.maxDistance = 10000;
    this.controls.minDistance = 100;
    
    // Create post-processing
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Add bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.0, // strength
      0.8, // radius
      0.3  // threshold
    );
    this.composer.addPass(bloomPass);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);
    
    // Add point light at camera position
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
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
          // Find the first intersected object that has userData
          const intersectedObject = intersects.find(intersect => 
            intersect.object.userData.cosmicObject || 
            intersect.object.userData.cosmicSystem ||
            intersect.object.userData.cosmicCluster
          );
          
          if (intersectedObject) {
            const userData = intersectedObject.object.userData;
            const cosmicObject = userData.cosmicObject || userData.cosmicSystem || userData.cosmicCluster;
            
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
          // Find the first intersected object that has userData
          const intersectedObject = intersects.find(intersect => 
            intersect.object.userData.cosmicObject || 
            intersect.object.userData.cosmicSystem ||
            intersect.object.userData.cosmicCluster
          );
          
          if (intersectedObject) {
            const userData = intersectedObject.object.userData;
            const cosmicObject = userData.cosmicObject || userData.cosmicSystem || userData.cosmicCluster;
            
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
   * Render a galaxy
   * @param galaxy - Cosmic galaxy
   */
  private renderGalaxy(galaxy: CosmicGalaxy): void {
    if (!this.scene) return;
    
    // Clear previous objects
    if (this.galaxyObject) {
      this.scene.remove(this.galaxyObject);
    }
    
    this.starSystems.forEach((object) => {
      this.scene?.remove(object);
    });
    this.starSystems.clear();
    
    this.starClusters.forEach((object) => {
      this.scene?.remove(object);
    });
    this.starClusters.clear();
    
    this.nebulae.forEach((object) => {
      this.scene?.remove(object);
    });
    this.nebulae.clear();
    
    this.blackHoles.forEach((object) => {
      this.scene?.remove(object);
    });
    this.blackHoles.clear();
    
    this.connections.forEach((line) => {
      this.scene?.remove(line);
    });
    this.connections.clear();
    
    this.labels.forEach((label) => {
      this.scene?.remove(label);
    });
    this.labels.clear();
    
    // Create galaxy object
    this.galaxyObject = this.createGalaxyObject(galaxy);
    if (this.galaxyObject) {
      this.scene.add(this.galaxyObject);
      
      // Create label for galaxy
      if (this.options.showLabels !== false) {
        const label = this.createLabel(galaxy.name, galaxy.description);
        if (label) {
          this.galaxyObject.add(label);
          this.labels.set('galaxy', label);
        }
      }
    }
    
    // Create star clusters
    if (galaxy.clusters) {
      galaxy.clusters.forEach((cluster) => {
        const clusterObject = this.createStarCluster(cluster);
        if (clusterObject) {
          this.scene?.add(clusterObject);
          this.starClusters.set(cluster.id, clusterObject);
          
          // Create label for cluster
          if (this.options.showLabels !== false) {
            const label = this.createLabel(cluster.name, cluster.description);
            if (label) {
              clusterObject.add(label);
              this.labels.set(cluster.id, label);
            }
          }
        }
      });
    }    
    // Create star systems
    if (this.options.showStarSystems !== false) {
      galaxy.systems.forEach((system) => {
        const systemObject = this.createStarSystem(system);
        if (systemObject) {
          // Position system based on galaxy type
          this.positionSystemInGalaxy(systemObject, system, galaxy);
          
          this.scene?.add(systemObject);
          this.starSystems.set(system.id, systemObject);
          
          // Create label for system
          if (this.options.showLabels !== false) {
            const label = this.createLabel(system.name, system.description);
            if (label) {
              systemObject.add(label);
              this.labels.set(system.id, label);
            }
          }
        }
      });
    }
    
    // Create nebulae
    if (this.options.showNebulae !== false && galaxy.nebulae) {
      galaxy.nebulae.forEach((nebula) => {
        const nebulaObject = this.createNebula(nebula);
        if (nebulaObject) {
          this.scene?.add(nebulaObject);
          this.nebulae.set(nebula.id, nebulaObject);
          
          // Create label for nebula
          if (this.options.showLabels !== false) {
            const label = this.createLabel(nebula.name, nebula.description);
            if (label) {
              nebulaObject.add(label);
              this.labels.set(nebula.id, label);
            }
          }
        }
      });
    }
    
    // Create black holes
    if (this.options.showBlackHoles !== false && galaxy.blackHoles) {
      galaxy.blackHoles.forEach((blackHole) => {
        const blackHoleObject = this.createBlackHole(blackHole);
        if (blackHoleObject) {
          this.scene?.add(blackHoleObject);
          this.blackHoles.set(blackHole.id, blackHoleObject);
          
          // Create label for black hole
          if (this.options.showLabels !== false) {
            const label = this.createLabel(blackHole.name, blackHole.description);
            if (label) {
              blackHoleObject.add(label);
              this.labels.set(blackHole.id, label);
            }
          }
        }
      });
    }
    
    // Create connections
    if (this.options.showConnections !== false) {
      galaxy.connections.forEach((connection) => {
        const line = this.createConnection(connection);
        if (line) {
          this.scene?.add(line);
          this.connections.set(connection.id, line);
        }
      });
    }
  }  
  /**
   * Create a galaxy object
   * @param galaxy - Cosmic galaxy
   * @returns Three.js object
   */
  private createGalaxyObject(galaxy: CosmicGalaxy): THREE.Object3D {
    const galaxyGroup = new THREE.Group();
    galaxyGroup.name = `galaxy-${galaxy.id}`;
    
    // Create galaxy based on type
    switch (galaxy.type) {
      case GalaxyType.SPIRAL:
        this.createSpiralGalaxy(galaxyGroup, galaxy);
        break;
      case GalaxyType.ELLIPTICAL:
        this.createEllipticalGalaxy(galaxyGroup, galaxy);
        break;
      case GalaxyType.IRREGULAR:
        this.createIrregularGalaxy(galaxyGroup, galaxy);
        break;
      case GalaxyType.LENTICULAR:
        this.createLenticularGalaxy(galaxyGroup, galaxy);
        break;
      case GalaxyType.RING:
        this.createRingGalaxy(galaxyGroup, galaxy);
        break;
      default:
        this.createDefaultGalaxy(galaxyGroup, galaxy);
    }
    
    // Store galaxy data
    galaxyGroup.userData.cosmicGalaxy = galaxy;
    
    return galaxyGroup;
  }
  
  /**
   * Create a spiral galaxy
   * @param group - Galaxy group
   * @param galaxy - Cosmic galaxy
   */
  private createSpiralGalaxy(group: THREE.Group, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    const numArms = galaxy.spiralArms || 2;
    const tightness = galaxy.spiralTightness || 0.5;
    const density = galaxy.density || 0.5;
    
    // Create galaxy core
    const coreGeometry = new THREE.SphereGeometry(size * 0.2, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(galaxy.color),
      emissive: new THREE.Color(galaxy.color),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);
    
    // Create galaxy disk
    const diskGeometry = new THREE.CircleGeometry(size, 64);
    const diskMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(galaxy.color),
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 2;
    group.add(disk);
    
    // Create spiral arms
    for (let arm = 0; arm < numArms; arm++) {
      const armGroup = new THREE.Group();
      const startAngle = (arm / numArms) * Math.PI * 2;
      
      // Create particles for the arm
      const numParticles = Math.floor(1000 * density);
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);
      const sizes = new Float32Array(numParticles);
      
      const color = new THREE.Color(galaxy.color);
      
      for (let i = 0; i < numParticles; i++) {
        // Calculate position along spiral
        const t = i / numParticles;
        const radius = t * size;
        const angle = startAngle + t * Math.PI * 2 * tightness * 3;
        
        // Add some randomness
        const randomRadius = radius * (1 + (Math.random() - 0.5) * 0.3);
        const randomAngle = angle + (Math.random() - 0.5) * 0.5;
        
        // Set position
        positions[i * 3] = Math.cos(randomAngle) * randomRadius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * size * 0.1; // Height
        positions[i * 3 + 2] = Math.sin(randomAngle) * randomRadius;        
        // Set color (brighter toward center)
        const brightness = 0.5 + 0.5 * (1 - t);
        const starColor = color.clone().multiplyScalar(brightness);
        colors[i * 3] = starColor.r;
        colors[i * 3 + 1] = starColor.g;
        colors[i * 3 + 2] = starColor.b;
        
        // Set size (larger toward center)
        sizes[i] = 2 + 8 * (1 - t) * Math.random();
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });
      
      const particleSystem = new THREE.Points(particles, particleMaterial);
      armGroup.add(particleSystem);
      
      group.add(armGroup);
    }
  }
  
  /**
   * Create an elliptical galaxy
   * @param group - Galaxy group
   * @param galaxy - Cosmic galaxy
   */
  private createEllipticalGalaxy(group: THREE.Group, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    const density = galaxy.density || 0.5;
    
    // Create particles for the elliptical galaxy
    const numParticles = Math.floor(2000 * density);
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const sizes = new Float32Array(numParticles);
    
    const color = new THREE.Color(galaxy.color);
    
    for (let i = 0; i < numParticles; i++) {
      // Calculate random position in ellipsoid
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      // Randomize radius with higher density toward center
      const r = Math.pow(Math.random(), 2) * size;
      
      // Set position (ellipsoid shape)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 0.8; // x-axis (shorter)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8; // y-axis (shorter)
      positions[i * 3 + 2] = r * Math.cos(phi); // z-axis (longer)
      
      // Set color (brighter toward center)
      const distance = Math.sqrt(
        positions[i * 3] * positions[i * 3] +
        positions[i * 3 + 1] * positions[i * 3 + 1] +
        positions[i * 3 + 2] * positions[i * 3 + 2]
      );
      const brightness = 0.5 + 0.5 * (1 - distance / size);
      const starColor = color.clone().multiplyScalar(brightness);
      colors[i * 3] = starColor.r;
      colors[i * 3 + 1] = starColor.g;
      colors[i * 3 + 2] = starColor.b;
      
      // Set size (larger toward center)
      sizes[i] = 2 + 8 * (1 - distance / size) * Math.random();
    }    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    group.add(particleSystem);
  }
  
  /**
   * Create an irregular galaxy
   * @param group - Galaxy group
   * @param galaxy - Cosmic galaxy
   */
  private createIrregularGalaxy(group: THREE.Group, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    const density = galaxy.density || 0.5;
    
    // Create particles for the irregular galaxy
    const numParticles = Math.floor(2000 * density);
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const sizes = new Float32Array(numParticles);
    
    const color = new THREE.Color(galaxy.color);
    
    // Create several clumps of stars
    const numClumps = 3 + Math.floor(Math.random() * 4);
    const clumpCenters = [];
    
    for (let i = 0; i < numClumps; i++) {
      clumpCenters.push({
        x: (Math.random() - 0.5) * size,
        y: (Math.random() - 0.5) * size * 0.3,
        z: (Math.random() - 0.5) * size,
        radius: size * (0.2 + Math.random() * 0.3),
      });
    }
    
    for (let i = 0; i < numParticles; i++) {
      // Choose a random clump
      const clumpIndex = Math.floor(Math.random() * numClumps);
      const clump = clumpCenters[clumpIndex];
      
      // Calculate random position in clump
      const radius = Math.random() * clump.radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Set position
      positions[i * 3] = clump.x + radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = clump.y + radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = clump.z + radius * Math.cos(phi);
      
      // Set color (random variations)
      const hue = (color.getHSL({}).h + (Math.random() - 0.5) * 0.2) % 1;
      const saturation = Math.min(1, Math.max(0, color.getHSL({}).s + (Math.random() - 0.5) * 0.2));
      const lightness = Math.min(1, Math.max(0, color.getHSL({}).l + (Math.random() - 0.5) * 0.2));
      
      const starColor = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i * 3] = starColor.r;
      colors[i * 3 + 1] = starColor.g;
      colors[i * 3 + 2] = starColor.b;
      
      // Set size (random)
      sizes[i] = 2 + 8 * Math.random();
    }    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    group.add(particleSystem);
  }
  
  /**
   * Create a lenticular galaxy
   * @param group - Galaxy group
   * @param galaxy - Cosmic galaxy
   */
  private createLenticularGalaxy(group: THREE.Group, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    const density = galaxy.density || 0.5;
    
    // Create galaxy core
    const coreGeometry = new THREE.SphereGeometry(size * 0.2, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(galaxy.color),
      emissive: new THREE.Color(galaxy.color),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);
    
    // Create galaxy disk
    const diskGeometry = new THREE.CircleGeometry(size, 64);
    const diskMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(galaxy.color),
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 2;
    group.add(disk);
    
    // Create particles for the lenticular galaxy
    const numParticles = Math.floor(2000 * density);
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const sizes = new Float32Array(numParticles);
    
    const color = new THREE.Color(galaxy.color);
    
    for (let i = 0; i < numParticles; i++) {
      // Calculate random position in disk
      const radius = Math.pow(Math.random(), 0.5) * size; // Higher density toward center
      const angle = Math.random() * Math.PI * 2;
      
      // Set position (flat disk with bulge)
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * size * 0.1 * (1 - radius / size); // Height (thicker in center)
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Set color (brighter toward center)
      const brightness = 0.5 + 0.5 * (1 - radius / size);
      const starColor = color.clone().multiplyScalar(brightness);
      colors[i * 3] = starColor.r;
      colors[i * 3 + 1] = starColor.g;
      colors[i * 3 + 2] = starColor.b;
      
      // Set size (larger toward center)
      sizes[i] = 2 + 8 * (1 - radius / size) * Math.random();
    }    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    group.add(particleSystem);
  }
  
  /**
   * Create a ring galaxy
   * @param group - Galaxy group
   * @param galaxy - Cosmic galaxy
   */
  private createRingGalaxy(group: THREE.Group, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    const density = galaxy.density || 0.5;
    
    // Create galaxy core
    const coreGeometry = new THREE.SphereGeometry(size * 0.1, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(galaxy.color),
      emissive: new THREE.Color(galaxy.color),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);
    
    // Create particles for the ring galaxy
    const numParticles = Math.floor(2000 * density);
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const sizes = new Float32Array(numParticles);
    
    const color = new THREE.Color(galaxy.color);
    
    for (let i = 0; i < numParticles; i++) {
      // Calculate position in ring
      const ringRadius = size * 0.6 + (Math.random() - 0.5) * size * 0.2;
      const angle = Math.random() * Math.PI * 2;
      
      // Set position
      positions[i * 3] = Math.cos(angle) * ringRadius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * size * 0.1;
      positions[i * 3 + 2] = Math.sin(angle) * ringRadius;
      
      // Set color (random variations)
      const hue = (color.getHSL({}).h + (Math.random() - 0.5) * 0.1) % 1;
      const saturation = Math.min(1, Math.max(0, color.getHSL({}).s + (Math.random() - 0.5) * 0.1));
      const lightness = Math.min(1, Math.max(0, color.getHSL({}).l + (Math.random() - 0.5) * 0.1));
      
      const starColor = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i * 3] = starColor.r;
      colors[i * 3 + 1] = starColor.g;
      colors[i * 3 + 2] = starColor.b;
      
      // Set size (random)
      sizes[i] = 2 + 8 * Math.random();
    }    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    group.add(particleSystem);
  }
  
  /**
   * Create a default galaxy
   * @param group - Galaxy group
   * @param galaxy - Cosmic galaxy
   */
  private createDefaultGalaxy(group: THREE.Group, galaxy: CosmicGalaxy): void {
    // Default to spiral galaxy
    this.createSpiralGalaxy(group, galaxy);
  }
  
  /**
   * Create a star cluster
   * @param cluster - Cosmic star cluster
   * @returns Three.js object
   */
  private createStarCluster(cluster: CosmicStarCluster): THREE.Object3D {
    const clusterGroup = new THREE.Group();
    clusterGroup.name = `cluster-${cluster.id}`;
    
    // Set position
    if (cluster.position) {
      clusterGroup.position.set(
        cluster.position.x,
        cluster.position.y,
        cluster.position.z
      );
    }
    
    // Create particles for the star cluster
    const numParticles = Math.floor(500 * (cluster.size || 1));
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const sizes = new Float32Array(numParticles);
    
    const color = new THREE.Color(cluster.color);
    const radius = cluster.size * 100;
    
    for (let i = 0; i < numParticles; i++) {
      // Calculate random position in sphere
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      // Randomize radius with higher density toward center
      const r = Math.pow(Math.random(), 0.5) * radius;
      
      // Set position
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Set color (brighter toward center)
      const brightness = 0.5 + 0.5 * (1 - r / radius);
      const starColor = color.clone().multiplyScalar(brightness);
      colors[i * 3] = starColor.r;
      colors[i * 3 + 1] = starColor.g;
      colors[i * 3 + 2] = starColor.b;
      
      // Set size (larger toward center)
      sizes[i] = 2 + 8 * (1 - r / radius) * Math.random();
    }    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    clusterGroup.add(particleSystem);
    
    // Store cluster data
    clusterGroup.userData.cosmicCluster = cluster;
    
    return clusterGroup;
  }
  
  /**
   * Create a star system
   * @param system - Cosmic system
   * @returns Three.js object
   */
  private createStarSystem(system: CosmicSystem): THREE.Object3D {
    const systemGroup = new THREE.Group();
    systemGroup.name = `system-${system.id}`;
    
    // Create central star
    const starGeometry = new THREE.SphereGeometry(system.centralObject.size || 1, 16, 16);
    const starMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(system.centralObject.color),
      emissive: new THREE.Color(system.centralObject.color),
      emissiveIntensity: 0.8,
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    systemGroup.add(star);
    
    // Store system data
    systemGroup.userData.cosmicSystem = system;
    
    return systemGroup;
  }
  
  /**
   * Create a nebula
   * @param nebula - Cosmic object (nebula)
   * @returns Three.js object
   */
  private createNebula(nebula: CosmicObject): THREE.Object3D {
    const nebulaGroup = new THREE.Group();
    nebulaGroup.name = `nebula-${nebula.id}`;
    
    // Create nebula cloud
    const size = nebula.size || 200;
    
    // Create particles for the nebula
    const numParticles = Math.floor(1000 * (nebula.size || 1));
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const sizes = new Float32Array(numParticles);
    
    const color = new THREE.Color(nebula.color);
    
    for (let i = 0; i < numParticles; i++) {
      // Calculate random position in nebula
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      // Randomize radius with irregular shape
      const r = Math.pow(Math.random(), 0.3) * size;
      
      // Set position
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5; // Flatter
      positions[i * 3 + 2] = r * Math.cos(phi);      
      // Set color (random variations)
      const hue = (color.getHSL({}).h + (Math.random() - 0.5) * 0.2) % 1;
      const saturation = Math.min(1, Math.max(0, color.getHSL({}).s + (Math.random() - 0.5) * 0.2));
      const lightness = Math.min(1, Math.max(0, color.getHSL({}).l + (Math.random() - 0.5) * 0.2));
      
      const nebulaColor = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i * 3] = nebulaColor.r;
      colors[i * 3 + 1] = nebulaColor.g;
      colors[i * 3 + 2] = nebulaColor.b;
      
      // Set size (random)
      sizes[i] = 5 + 15 * Math.random();
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 10,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    nebulaGroup.add(particleSystem);
    
    // Store nebula data
    nebulaGroup.userData.cosmicObject = nebula;
    
    return nebulaGroup;
  }
  
  /**
   * Create a black hole
   * @param blackHole - Cosmic object (black hole)
   * @returns Three.js object
   */
  private createBlackHole(blackHole: CosmicObject): THREE.Object3D {
    const blackHoleGroup = new THREE.Group();
    blackHoleGroup.name = `blackhole-${blackHole.id}`;
    
    // Create black hole event horizon
    const size = blackHole.size || 50;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.9,
    });
    const sphere = new THREE.Mesh(geometry, material);
    blackHoleGroup.add(sphere);
    
    // Create accretion disk
    const diskGeometry = new THREE.RingGeometry(size * 1.5, size * 4, 64);
    const diskMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(blackHole.color),
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 2;
    blackHoleGroup.add(disk);
    
    // Store black hole data
    blackHoleGroup.userData.cosmicObject = blackHole;
    
    return blackHoleGroup;
  }  
  /**
   * Create a connection
   * @param connection - Cosmic connection
   * @returns Three.js line
   */
  private createConnection(connection: any): THREE.Line | null {
    const sourceObject = this.starSystems.get(connection.sourceId) || 
                         this.starClusters.get(connection.sourceId) ||
                         this.nebulae.get(connection.sourceId) ||
                         this.blackHoles.get(connection.sourceId);
                         
    const targetObject = this.starSystems.get(connection.targetId) || 
                         this.starClusters.get(connection.targetId) ||
                         this.nebulae.get(connection.targetId) ||
                         this.blackHoles.get(connection.targetId);
    
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
        dashSize: 10,
        gapSize: 5,
      });
    } else if (connection.style === 'dotted') {
      material = new THREE.LineDashedMaterial({
        color: new THREE.Color(connection.color || 0xffffff),
        linewidth: connection.width || 1,
        scale: 1,
        dashSize: 2,
        gapSize: 2,
      });
    } else {
      material = new THREE.LineBasicMaterial({
        color: new THREE.Color(connection.color || 0xffffff),
        linewidth: connection.width || 1,
        transparent: true,
        opacity: connection.strength || 0.7,
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
   * Position a star system in the galaxy
   * @param systemObject - Three.js object
   * @param system - Cosmic system
   * @param galaxy - Cosmic galaxy
   */
  private positionSystemInGalaxy(systemObject: THREE.Object3D, system: CosmicSystem, galaxy: CosmicGalaxy): void {
    switch (galaxy.type) {
      case GalaxyType.SPIRAL:
        this.positionSystemInSpiralGalaxy(systemObject, system, galaxy);
        break;
      case GalaxyType.ELLIPTICAL:
        this.positionSystemInEllipticalGalaxy(systemObject, system, galaxy);
        break;
      case GalaxyType.IRREGULAR:
        this.positionSystemInIrregularGalaxy(systemObject, system, galaxy);
        break;
      case GalaxyType.LENTICULAR:
        this.positionSystemInLenticularGalaxy(systemObject, system, galaxy);
        break;
      case GalaxyType.RING:
        this.positionSystemInRingGalaxy(systemObject, system, galaxy);
        break;
      default:
        this.positionSystemInSpiralGalaxy(systemObject, system, galaxy);
    }
  }  
  /**
   * Position a star system in a spiral galaxy
   * @param systemObject - Three.js object
   * @param system - Cosmic system
   * @param galaxy - Cosmic galaxy
   */
  private positionSystemInSpiralGalaxy(systemObject: THREE.Object3D, system: CosmicSystem, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    const numArms = galaxy.spiralArms || 2;
    const tightness = galaxy.spiralTightness || 0.5;
    
    // Choose a random arm
    const arm = Math.floor(Math.random() * numArms);
    
    // Calculate position along spiral
    const t = Math.random(); // Position along arm (0-1)
    const radius = t * size * 0.8;
    const startAngle = (arm / numArms) * Math.PI * 2;
    const angle = startAngle + t * Math.PI * 2 * tightness * 3;
    
    // Add some randomness
    const randomRadius = radius * (1 + (Math.random() - 0.5) * 0.2);
    const randomAngle = angle + (Math.random() - 0.5) * 0.3;
    
    // Set position
    systemObject.position.x = Math.cos(randomAngle) * randomRadius;
    systemObject.position.y = (Math.random() - 0.5) * size * 0.1; // Height
    systemObject.position.z = Math.sin(randomAngle) * randomRadius;
  }
  
  /**
   * Position a star system in an elliptical galaxy
   * @param systemObject - Three.js object
   * @param system - Cosmic system
   * @param galaxy - Cosmic galaxy
   */
  private positionSystemInEllipticalGalaxy(systemObject: THREE.Object3D, system: CosmicSystem, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    
    // Calculate random position in ellipsoid
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    
    // Randomize radius with higher density toward center
    const r = Math.pow(Math.random(), 2) * size;
    
    // Set position (ellipsoid shape)
    systemObject.position.x = r * Math.sin(phi) * Math.cos(theta) * 0.8; // x-axis (shorter)
    systemObject.position.y = r * Math.sin(phi) * Math.sin(theta) * 0.8; // y-axis (shorter)
    systemObject.position.z = r * Math.cos(phi); // z-axis (longer)
  }
  
  /**
   * Position a star system in an irregular galaxy
   * @param systemObject - Three.js object
   * @param system - Cosmic system
   * @param galaxy - Cosmic galaxy
   */
  private positionSystemInIrregularGalaxy(systemObject: THREE.Object3D, system: CosmicSystem, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    
    // Create several clumps of stars
    const numClumps = 3 + Math.floor(Math.random() * 4);
    const clumpCenters = [];
    
    for (let i = 0; i < numClumps; i++) {
      clumpCenters.push({
        x: (Math.random() - 0.5) * size,
        y: (Math.random() - 0.5) * size * 0.3,
        z: (Math.random() - 0.5) * size,
        radius: size * (0.2 + Math.random() * 0.3),
      });
    }    
    // Choose a random clump
    const clumpIndex = Math.floor(Math.random() * numClumps);
    const clump = clumpCenters[clumpIndex];
    
    // Calculate random position in clump
    const radius = Math.random() * clump.radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    // Set position
    systemObject.position.x = clump.x + radius * Math.sin(phi) * Math.cos(theta);
    systemObject.position.y = clump.y + radius * Math.sin(phi) * Math.sin(theta);
    systemObject.position.z = clump.z + radius * Math.cos(phi);
  }
  
  /**
   * Position a star system in a lenticular galaxy
   * @param systemObject - Three.js object
   * @param system - Cosmic system
   * @param galaxy - Cosmic galaxy
   */
  private positionSystemInLenticularGalaxy(systemObject: THREE.Object3D, system: CosmicSystem, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    
    // Calculate random position in disk
    const radius = Math.pow(Math.random(), 0.5) * size; // Higher density toward center
    const angle = Math.random() * Math.PI * 2;
    
    // Set position (flat disk with bulge)
    systemObject.position.x = Math.cos(angle) * radius;
    systemObject.position.y = (Math.random() - 0.5) * size * 0.1 * (1 - radius / size); // Height (thicker in center)
    systemObject.position.z = Math.sin(angle) * radius;
  }
  
  /**
   * Position a star system in a ring galaxy
   * @param systemObject - Three.js object
   * @param system - Cosmic system
   * @param galaxy - Cosmic galaxy
   */
  private positionSystemInRingGalaxy(systemObject: THREE.Object3D, system: CosmicSystem, galaxy: CosmicGalaxy): void {
    const size = galaxy.size || 1000;
    
    // Calculate position in ring
    const ringRadius = size * 0.6 + (Math.random() - 0.5) * size * 0.2;
    const angle = Math.random() * Math.PI * 2;
    
    // Set position
    systemObject.position.x = Math.cos(angle) * ringRadius;
    systemObject.position.y = (Math.random() - 0.5) * size * 0.1;
    systemObject.position.z = Math.sin(angle) * ringRadius;
  }
  
  /**
   * Create a label
   * @param name - Label name
   * @param description - Label description
   * @returns CSS2D object
   */
  private createLabel(name: string, description?: string): CSS2DObject | null {
    const div = document.createElement('div');
    div.className = 'cosmic-label';
    div.textContent = name;
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    div.style.color = 'white';
    div.style.padding = '2px 5px';
    div.style.borderRadius = '3px';
    div.style.fontSize = '12px';
    div.style.pointerEvents = 'none';
    
    if (description) {
      div.title = description;
    }
    
    const label = new CSS2DObject(div);
    label.position.set(0, 50, 0);
    
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
        // Rotate galaxy
        if (this.galaxyObject && this.lastData?.rotationSpeed) {
          this.galaxyObject.rotation.y += 0.0001 * this.lastData.rotationSpeed;
        }
        
        // Rotate star systems
        this.starSystems.forEach((system) => {
          system.rotation.y += 0.001;
        });
        
        // Rotate star clusters
        this.starClusters.forEach((cluster) => {
          cluster.rotation.y += 0.0005;
        });
        
        // Rotate nebulae
        this.nebulae.forEach((nebula) => {
          nebula.rotation.y += 0.0002;
        });
        
        // Rotate black holes
        this.blackHoles.forEach((blackHole) => {
          if (blackHole.children.length > 1) {
            blackHole.children[1].rotation.z += 0.002; // Rotate accretion disk
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
    
    // Extract galaxy data
    const galaxy = data as CosmicGalaxy;
    if (!galaxy) {
      throw new Error('Invalid galaxy data');
    }
    
    // Store last data
    this.lastData = galaxy;
    
    // Render galaxy
    this.renderGalaxy(galaxy);
    
    this.log('Updated galaxy');
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
    this.starSystems.forEach((system) => {
      this.disposeObject(system);
    });
    
    this.starClusters.forEach((cluster) => {
      this.disposeObject(cluster);
    });
    
    this.nebulae.forEach((nebula) => {
      this.disposeObject(nebula);
    });
    
    this.blackHoles.forEach((blackHole) => {
      this.disposeObject(blackHole);
    });
    
    this.connections.forEach((line) => {
      this.disposeObject(line);
    });
    
    if (this.galaxyObject) {
      this.disposeObject(this.galaxyObject);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Clear event listeners
    this.eventListeners.clear();
    
    this.log('Disposed');
  }
  
  /**
   * Dispose Three.js object
   * @param object - Three.js object
   */
  private disposeObject(object: THREE.Object3D): void {
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
    // Recursively dispose children
    object.children.forEach(child => {
      this.disposeObject(child);
    });
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
      console.log(`[GalaxyRenderer] ${message}`);
    }
  }
}