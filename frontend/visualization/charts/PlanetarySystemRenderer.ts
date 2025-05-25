/**
 * Planetary System Renderer
 *
 * Renders a planetary system visualization using Three.js.
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

/**
 * Planet type
 */
export enum PlanetType {
  /** Rocky planet */
  ROCKY = 'rocky',
  
  /** Gas giant */
  GAS = 'gas',
  
  /** Ice planet */
  ICE = 'ice',
  
  /** Oceanic planet */
  OCEANIC = 'oceanic',
  
  /** Lava planet */
  LAVA = 'lava',
}

/**
 * Planet data
 */
export interface PlanetData {
  /** Planet ID */
  id: string;
  
  /** Planet name */
  name: string;
  
  /** Planet description */
  description?: string;
  
  /** Planet type */
  type: PlanetType;
  
  /** Planet color */
  color: string;
  
  /** Planet size */
  size: number;
  
  /** Planet orbit distance */
  orbitDistance: number;
  
  /** Planet orbit angle */
  orbitAngle: number;
  
  /** Planet orbit speed */
  orbitSpeed: number;
  
  /** Planet rotation speed */
  rotationSpeed: number;
  
  /** Planet features */
  features?: PlanetFeature[];
  
  /** Planet properties */
  properties?: Record<string, any>;
}

/**
 * Planet feature
 */
export interface PlanetFeature {
  /** Feature name */
  name: string;
  
  /** Feature description */
  description?: string;
  
  /** Feature type */
  type: 'mountain' | 'crater' | 'ocean' | 'canyon' | 'volcano' | 'storm' | 'custom';
  
  /** Feature size */
  size: number;
  
  /** Feature position (latitude, longitude) */
  position: { lat: number; lng: number };
  
  /** Feature color */
  color?: string;
  
  /** Feature properties */
  properties?: Record<string, any>;
}/**
 * Planetary system data
 */
export interface PlanetarySystemData {
  /** System ID */
  id: string;
  
  /** System name */
  name: string;
  
  /** System description */
  description?: string;
  
  /** Star data */
  star: {
    /** Star name */
    name: string;
    
    /** Star color */
    color: string;
    
    /** Star size */
    size: number;
    
    /** Star rotation speed */
    rotationSpeed: number;
  };
  
  /** Planets */
  planets: PlanetData[];
  
  /** System properties */
  properties?: Record<string, any>;
}

/**
 * Planetary System Renderer Options
 */
interface PlanetarySystemRendererOptions {
  /** Show labels */
  showLabels?: boolean;
  
  /** Show orbits */
  showOrbits?: boolean;
  
  /** Show features */
  showFeatures?: boolean;
  
  /** Show planet details */
  showPlanetDetails?: boolean;
  
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
const defaultOptions: PlanetarySystemRendererOptions = {
  showLabels: true,
  showOrbits: true,
  showFeatures: true,
  showPlanetDetails: true,
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
 * Planetary System Renderer
 */
export class PlanetarySystemRenderer implements BaseRenderer {
  /** Options */
  private options: PlanetarySystemRendererOptions;
  
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
  
  /** Star object */
  private starObject: THREE.Object3D | null = null;
  
  /** Planet objects */
  private planetObjects: Map<string, THREE.Object3D> = new Map();
  
  /** Orbit objects */
  private orbitObjects: Map<string, THREE.Line> = new Map();
  
  /** Feature objects */
  private featureObjects: Map<string, THREE.Object3D> = new Map();
  
  /** Label objects */
  private labelObjects: Map<string, CSS2DObject> = new Map();
  
  /** Event listeners */
  private eventListeners: Map<string, Function[]> = new Map();
  
  /** Raycaster */
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  
  /** Mouse position */
  private mouse: THREE.Vector2 = new THREE.Vector2();
  
  /** Hovered object */
  private hoveredObject: any | null = null;
  
  /** Selected object */
  private selectedObject: any | null = null;
  
  /** Last data rendered */
  private lastData: PlanetarySystemData | null = null;  
  /**
   * Constructor
   * @param options - Renderer options
   */
  constructor(options: PlanetarySystemRendererOptions = {}) {
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
    
    this.log('Initializing Planetary System Renderer');
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
    
    // Extract planetary system data
    const systemData = data as PlanetarySystemData;
    if (!systemData) {
      throw new Error('Invalid planetary system data');
    }
    
    // Store last data
    this.lastData = systemData;
    
    // Setup scene
    this.setupScene(element);
    
    // Render planetary system
    this.renderPlanetarySystem(systemData);
    
    // Start animation loop
    this.startAnimationLoop();
    
    this.log('Rendered planetary system');
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
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 50;
    
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
            intersect.object.userData.planetData || 
            intersect.object.userData.featureData
          );          
          if (intersectedObject) {
            const userData = intersectedObject.object.userData;
            const data = userData.planetData || userData.featureData;
            
            if (this.hoveredObject?.id !== data.id) {
              this.hoveredObject = data;
              this.emit('hover', { object: data });
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
            intersect.object.userData.planetData || 
            intersect.object.userData.featureData
          );
          
          if (intersectedObject) {
            const userData = intersectedObject.object.userData;
            const data = userData.planetData || userData.featureData;
            
            this.selectedObject = data;
            this.emit('select', { object: data });
            
            return;
          }
        }        
        // No intersection, clear selection
        this.selectedObject = null;
        this.emit('select', { object: null });
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
   * Render a planetary system
   * @param systemData - Planetary system data
   */
  private renderPlanetarySystem(systemData: PlanetarySystemData): void {
    if (!this.scene) return;
    
    // Clear previous objects
    if (this.starObject) {
      this.scene.remove(this.starObject);
    }
    
    this.planetObjects.forEach((object) => {
      this.scene?.remove(object);
    });
    this.planetObjects.clear();
    
    this.orbitObjects.forEach((object) => {
      this.scene?.remove(object);
    });
    this.orbitObjects.clear();
    
    this.featureObjects.forEach((object) => {
      this.scene?.remove(object);
    });
    this.featureObjects.clear();
    
    this.labelObjects.forEach((object) => {
      this.scene?.remove(object);
    });
    this.labelObjects.clear();
    
    // Create star
    this.starObject = this.createStar(systemData.star);
    if (this.starObject) {
      this.scene.add(this.starObject);
      
      // Create label for star
      if (this.options.showLabels !== false) {
        const label = this.createLabel(systemData.star.name);
        if (label) {
          this.starObject.add(label);
          this.labelObjects.set('star', label);
        }
      }    }
    
    // Create planets
    systemData.planets.forEach((planetData) => {
      // Create orbit
      if (this.options.showOrbits !== false) {
        const orbit = this.createOrbit(planetData);
        if (orbit) {
          this.scene?.add(orbit);
          this.orbitObjects.set(planetData.id, orbit);
        }
      }
      
      // Create planet
      const planet = this.createPlanet(planetData);
      if (planet) {
        // Position planet
        this.positionPlanet(planet, planetData);
        
        this.scene?.add(planet);
        this.planetObjects.set(planetData.id, planet);
        
        // Create label for planet
        if (this.options.showLabels !== false) {
          const label = this.createLabel(planetData.name);
          if (label) {
            planet.add(label);
            this.labelObjects.set(planetData.id, label);
          }
        }
        
        // Create features
        if (this.options.showFeatures !== false && planetData.features) {
          planetData.features.forEach((featureData) => {
            const feature = this.createFeature(featureData, planetData);
            if (feature) {
              planet.add(feature);
              this.featureObjects.set(featureData.name, feature);
            }
          });
        }
      }
    });
  }
  
  /**
   * Create a star
   * @param starData - Star data
   * @returns Three.js object
   */
  private createStar(starData: PlanetarySystemData['star']): THREE.Object3D {
    // Create star geometry
    const geometry = new THREE.SphereGeometry(starData.size, 32, 32);
    
    // Create star material
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(starData.color),
      emissive: new THREE.Color(starData.color),
      emissiveIntensity: 1.0,
      roughness: 0.2,
      metalness: 0.5,
    });    
    // Create star mesh
    const star = new THREE.Mesh(geometry, material);
    
    // Add point light
    const light = new THREE.PointLight(new THREE.Color(starData.color), 1.0, 100, 2);
    star.add(light);
    
    // Store star data
    star.userData.starData = starData;
    
    return star;
  }
  
  /**
   * Create a planet
   * @param planetData - Planet data
   * @returns Three.js object
   */
  private createPlanet(planetData: PlanetData): THREE.Object3D {
    // Create planet group
    const planetGroup = new THREE.Group();
    planetGroup.name = `planet-${planetData.id}`;
    
    // Create planet geometry
    const geometry = new THREE.SphereGeometry(planetData.size, 32, 32);
    
    // Create planet material based on type
    let material: THREE.Material;
    
    switch (planetData.type) {
      case PlanetType.ROCKY:
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planetData.color),
          roughness: 0.8,
          metalness: 0.2,
        });
        break;
        
      case PlanetType.GAS:
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planetData.color),
          roughness: 0.4,
          metalness: 0.3,
          transparent: true,
          opacity: 0.9,
        });
        break;
        
      case PlanetType.ICE:
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planetData.color),
          roughness: 0.3,
          metalness: 0.5,
          transparent: true,
          opacity: 0.8,
        });
        break;        
      case PlanetType.OCEANIC:
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planetData.color),
          roughness: 0.2,
          metalness: 0.3,
          transparent: true,
          opacity: 0.9,
        });
        break;
        
      case PlanetType.LAVA:
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planetData.color),
          emissive: new THREE.Color('#ff4500'),
          emissiveIntensity: 0.3,
          roughness: 0.7,
          metalness: 0.3,
        });
        break;
        
      default:
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planetData.color),
          roughness: 0.5,
          metalness: 0.5,
        });
    }
    
    // Create planet mesh
    const planet = new THREE.Mesh(geometry, material);
    planetGroup.add(planet);
    
    // Store planet data
    planetGroup.userData.planetData = planetData;
    
    return planetGroup;
  }
  
  /**
   * Create an orbit
   * @param planetData - Planet data
   * @returns Three.js line
   */
  private createOrbit(planetData: PlanetData): THREE.Line {
    // Create orbit geometry
    const segments = 64;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(segments * 3);
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * planetData.orbitDistance;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(angle) * planetData.orbitDistance;
    }    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create orbit material
    const material = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.3,
    });
    
    // Create orbit line
    const orbit = new THREE.Line(geometry, material);
    
    return orbit;
  }
  
  /**
   * Create a feature
   * @param featureData - Feature data
   * @param planetData - Planet data
   * @returns Three.js object
   */
  private createFeature(featureData: PlanetFeature, planetData: PlanetData): THREE.Object3D {
    // Create feature group
    const featureGroup = new THREE.Group();
    featureGroup.name = `feature-${featureData.name}`;
    
    // Calculate feature position on planet surface
    const lat = featureData.position.lat * Math.PI / 180;
    const lng = featureData.position.lng * Math.PI / 180;
    
    const x = planetData.size * Math.cos(lat) * Math.cos(lng);
    const y = planetData.size * Math.sin(lat);
    const z = planetData.size * Math.cos(lat) * Math.sin(lng);
    
    featureGroup.position.set(x, y, z);
    
    // Orient feature to face outward from planet center
    featureGroup.lookAt(0, 0, 0);
    featureGroup.rotateX(Math.PI / 2);
    
    // Create feature based on type
    let featureObject: THREE.Object3D;
    
    switch (featureData.type) {
      case 'mountain':
        featureObject = this.createMountainFeature(featureData);
        break;
        
      case 'crater':
        featureObject = this.createCraterFeature(featureData);
        break;        
      case 'ocean':
        featureObject = this.createOceanFeature(featureData);
        break;
        
      case 'canyon':
        featureObject = this.createCanyonFeature(featureData);
        break;
        
      case 'volcano':
        featureObject = this.createVolcanoFeature(featureData);
        break;
        
      case 'storm':
        featureObject = this.createStormFeature(featureData);
        break;
        
      default:
        featureObject = this.createDefaultFeature(featureData);
    }
    
    featureGroup.add(featureObject);
    
    // Store feature data
    featureGroup.userData.featureData = featureData;
    
    return featureGroup;
  }
  
  /**
   * Create a mountain feature
   * @param featureData - Feature data
   * @returns Three.js object
   */
  private createMountainFeature(featureData: PlanetFeature): THREE.Object3D {
    // Create mountain geometry
    const geometry = new THREE.ConeGeometry(
      featureData.size * 0.5,
      featureData.size,
      4
    );
    
    // Create mountain material
    const material = new THREE.MeshStandardMaterial({
      color: featureData.color || 0x8B4513,
      roughness: 0.8,
      metalness: 0.2,
    });
    
    // Create mountain mesh
    const mountain = new THREE.Mesh(geometry, material);
    
    return mountain;
  }  
  /**
   * Create a crater feature
   * @param featureData - Feature data
   * @returns Three.js object
   */
  private createCraterFeature(featureData: PlanetFeature): THREE.Object3D {
    // Create crater geometry
    const geometry = new THREE.CircleGeometry(featureData.size * 0.5, 32);
    
    // Create crater material
    const material = new THREE.MeshStandardMaterial({
      color: featureData.color || 0x333333,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    
    // Create crater mesh
    const crater = new THREE.Mesh(geometry, material);
    
    return crater;
  }
  
  /**
   * Create an ocean feature
   * @param featureData - Feature data
   * @returns Three.js object
   */
  private createOceanFeature(featureData: PlanetFeature): THREE.Object3D {
    // Create ocean geometry
    const geometry = new THREE.CircleGeometry(featureData.size * 0.5, 32);
    
    // Create ocean material
    const material = new THREE.MeshStandardMaterial({
      color: featureData.color || 0x0077be,
      roughness: 0.2,
      metalness: 0.3,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    
    // Create ocean mesh
    const ocean = new THREE.Mesh(geometry, material);
    
    return ocean;
  }  
  /**
   * Create a canyon feature
   * @param featureData - Feature data
   * @returns Three.js object
   */
  private createCanyonFeature(featureData: PlanetFeature): THREE.Object3D {
    // Create canyon geometry
    const shape = new THREE.Shape();
    const width = featureData.size;
    const height = featureData.size * 0.3;
    
    shape.moveTo(-width / 2, -height / 2);
    shape.lineTo(-width / 2, height / 2);
    shape.lineTo(width / 2, height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(-width / 2, -height / 2);
    
    const geometry = new THREE.ShapeGeometry(shape);
    
    // Create canyon material
    const material = new THREE.MeshStandardMaterial({
      color: featureData.color || 0x8B4513,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    
    // Create canyon mesh
    const canyon = new THREE.Mesh(geometry, material);
    
    return canyon;
  }
  
  /**
   * Create a volcano feature
   * @param featureData - Feature data
   * @returns Three.js object
   */
  private createVolcanoFeature(featureData: PlanetFeature): THREE.Object3D {
    // Create volcano group
    const volcanoGroup = new THREE.Group();
    
    // Create volcano cone
    const coneGeometry = new THREE.ConeGeometry(
      featureData.size * 0.5,
      featureData.size * 0.8,
      16
    );    
    const coneMaterial = new THREE.MeshStandardMaterial({
      color: featureData.color || 0x8B4513,
      roughness: 0.8,
      metalness: 0.2,
    });
    
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    volcanoGroup.add(cone);
    
    // Create volcano crater
    const craterGeometry = new THREE.CircleGeometry(featureData.size * 0.2, 32);
    
    const craterMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      emissive: 0xff4500,
      emissiveIntensity: 0.5,
      roughness: 0.7,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    
    const crater = new THREE.Mesh(craterGeometry, craterMaterial);
    crater.position.y = featureData.size * 0.4;
    crater.rotateX(-Math.PI / 2);
    volcanoGroup.add(crater);
    
    return volcanoGroup;
  }
  
  /**
   * Create a storm feature
   * @param featureData - Feature data
   * @returns Three.js object
   */
  private createStormFeature(featureData: PlanetFeature): THREE.Object3D {
    // Create storm geometry
    const geometry = new THREE.CircleGeometry(featureData.size * 0.5, 32);
    
    // Create storm material
    const material = new THREE.MeshStandardMaterial({
      color: featureData.color || 0xFFFFFF,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });    
    // Create storm mesh
    const storm = new THREE.Mesh(geometry, material);
    
    return storm;
  }
  
  /**
   * Create a default feature
   * @param featureData - Feature data
   * @returns Three.js object
   */
  private createDefaultFeature(featureData: PlanetFeature): THREE.Object3D {
    // Create default geometry
    const geometry = new THREE.BoxGeometry(
      featureData.size,
      featureData.size * 0.2,
      featureData.size
    );
    
    // Create default material
    const material = new THREE.MeshStandardMaterial({
      color: featureData.color || 0xFFFFFF,
      roughness: 0.5,
      metalness: 0.5,
    });
    
    // Create default mesh
    const defaultFeature = new THREE.Mesh(geometry, material);
    
    return defaultFeature;
  }
  
  /**
   * Position a planet
   * @param planet - Planet object
   * @param planetData - Planet data
   */
  private positionPlanet(planet: THREE.Object3D, planetData: PlanetData): void {
    const angle = planetData.orbitAngle;
    const distance = planetData.orbitDistance;
    
    planet.position.x = Math.cos(angle) * distance;
    planet.position.z = Math.sin(angle) * distance;
  }  
  /**
   * Create a label
   * @param text - Label text
   * @returns CSS2D object
   */
  private createLabel(text: string): CSS2DObject | null {
    const div = document.createElement('div');
    div.className = 'cosmic-label';
    div.textContent = text;
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    div.style.color = 'white';
    div.style.padding = '2px 5px';
    div.style.borderRadius = '3px';
    div.style.fontSize = '12px';
    div.style.pointerEvents = 'none';
    
    const label = new CSS2DObject(div);
    label.position.set(0, 2, 0);
    
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
      if (this.options.enableAnimations !== false && this.lastData) {
        this.updateAnimations();
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
   * Update animations
   */
  private updateAnimations(): void {
    if (!this.lastData) return;
    
    // Update star rotation
    if (this.starObject && this.lastData.star.rotationSpeed) {
      this.starObject.rotation.y += 0.01 * this.lastData.star.rotationSpeed;
    }
    
    // Update planets
    this.lastData.planets.forEach((planetData) => {
      const planet = this.planetObjects.get(planetData.id);
      if (planet) {
        // Update planet rotation
        planet.rotation.y += 0.01 * planetData.rotationSpeed;
        
        // Update planet orbit
        if (this.options.enablePhysics !== false) {
          planetData.orbitAngle += 0.001 * planetData.orbitSpeed;
          this.positionPlanet(planet, planetData);
        }
      }
    });
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
    
    // Extract planetary system data
    const systemData = data as PlanetarySystemData;
    if (systemData) {
      // Store last data
      this.lastData = systemData;
      
      // Render planetary system
      this.renderPlanetarySystem(systemData);
    }
    
    this.log('Updated planetary system');
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
    this.planetObjects.forEach((object) => {
      this.disposeObject(object);
    });
    
    this.orbitObjects.forEach((object) => {
      this.disposeObject(object);
    });
    
    this.featureObjects.forEach((object) => {
      this.disposeObject(object);
    });
    
    if (this.starObject) {
      this.disposeObject(this.starObject);
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
      console.log(`[PlanetarySystemRenderer] ${message}`);
    }
  }
}