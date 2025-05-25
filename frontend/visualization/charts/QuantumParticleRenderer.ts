/**
 * Quantum Particle Renderer
 *
 * Renders quantum particle effects using Three.js.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import { BaseRenderer } from './BaseRenderer';

/**
 * Quantum Particle Effect Type
 */
export enum QuantumEffectType {
  /** Wave-particle duality effect */
  WAVE_PARTICLE_DUALITY = 'wave_particle_duality',
  
  /** Quantum entanglement effect */
  QUANTUM_ENTANGLEMENT = 'quantum_entanglement',
  
  /** Quantum tunneling effect */
  QUANTUM_TUNNELING = 'quantum_tunneling',
  
  /** Quantum superposition effect */
  QUANTUM_SUPERPOSITION = 'quantum_superposition',
  
  /** Quantum interference effect */
  QUANTUM_INTERFERENCE = 'quantum_interference',
}

/**
 * Quantum Particle Renderer Options
 */
interface QuantumParticleRendererOptions {
  /** Effect type */
  effectType?: QuantumEffectType;
  
  /** Number of particles */
  particleCount?: number;
  
  /** Particle size */
  particleSize?: number;
  
  /** Particle color */
  particleColor?: string;
  
  /** Wave amplitude */
  waveAmplitude?: number;
  
  /** Wave frequency */
  waveFrequency?: number;
  
  /** Entanglement strength */
  entanglementStrength?: number;
  
  /** Tunneling probability */
  tunnelingProbability?: number;
  
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
const defaultOptions: QuantumParticleRendererOptions = {
  effectType: QuantumEffectType.WAVE_PARTICLE_DUALITY,
  particleCount: 1000,
  particleSize: 2,
  particleColor: '#4fc3f7',
  waveAmplitude: 20,
  waveFrequency: 0.02,
  entanglementStrength: 0.8,
  tunnelingProbability: 0.3,
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
 * Wave-Particle Duality Shader
 */
const WaveParticleDualityShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    amplitude: { value: 20.0 },
    frequency: { value: 0.02 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float amplitude;
    uniform float frequency;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Wave effect
      float wave = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time) * amplitude * 0.001;
      uv.x += wave;
      uv.y += wave;
      
      // Particle effect
      float particle = smoothstep(0.4, 0.5, 0.5 - length(uv - vec2(0.5 + sin(time * frequency) * 0.1, 0.5 + cos(time * frequency) * 0.1)));
      
      vec4 color = texture2D(tDiffuse, uv);
      color.rgb += particle * 0.5;
      
      gl_FragColor = color;
    }
  `,
};/**
 * Quantum Entanglement Shader
 */
const QuantumEntanglementShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    entanglementStrength: { value: 0.8 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float entanglementStrength;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Create two entangled particles
      vec2 particle1 = vec2(0.3 + sin(time) * 0.1, 0.5 + cos(time) * 0.1);
      vec2 particle2 = vec2(0.7 - sin(time) * 0.1, 0.5 - cos(time) * 0.1);
      
      // Calculate distance to particles
      float dist1 = length(uv - particle1);
      float dist2 = length(uv - particle2);
      
      // Create particles
      float p1 = smoothstep(0.05, 0.04, dist1);
      float p2 = smoothstep(0.05, 0.04, dist2);
      
      // Create entanglement effect (connection between particles)
      float entanglement = smoothstep(0.01, 0.0, abs(dist1 - dist2) - 0.3) * entanglementStrength;
      
      vec4 color = texture2D(tDiffuse, uv);
      color.rgb += p1 * vec3(0.0, 0.5, 1.0);
      color.rgb += p2 * vec3(1.0, 0.5, 0.0);
      color.rgb += entanglement * vec3(1.0, 0.0, 1.0);
      
      gl_FragColor = color;
    }
  `,
};/**
 * Quantum Tunneling Shader
 */
const QuantumTunnelingShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    tunnelingProbability: { value: 0.3 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float tunnelingProbability;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Create barrier
      float barrier = smoothstep(0.03, 0.02, abs(uv.x - 0.5));
      
      // Create particle
      float particleX = mod(time * 0.2, 1.4) - 0.2;
      float particleY = 0.5 + sin(time) * 0.1;
      float particle = smoothstep(0.03, 0.02, length(uv - vec2(particleX, particleY)));
      
      // Create tunneling effect
      float tunneling = 0.0;
      if (particleX > 0.4 && particleX < 0.6) {
        tunneling = smoothstep(0.1, 0.0, abs(uv.y - particleY)) * 
                   smoothstep(0.1, 0.0, abs(uv.x - 0.5)) * 
                   tunnelingProbability;
      }
      
      vec4 color = texture2D(tDiffuse, uv);
      color.rgb += barrier * vec3(0.5, 0.5, 0.5);
      color.rgb += particle * vec3(0.0, 1.0, 1.0);
      color.rgb += tunneling * vec3(1.0, 0.0, 1.0);
      
      gl_FragColor = color;
    }
  `,
};/**
 * Quantum Superposition Shader
 */
const QuantumSuperpositionShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Create superposition effect (multiple states)
      float state1 = smoothstep(0.05, 0.04, length(uv - vec2(0.5 + sin(time) * 0.1, 0.5)));
      float state2 = smoothstep(0.05, 0.04, length(uv - vec2(0.5, 0.5 + cos(time) * 0.1)));
      float state3 = smoothstep(0.05, 0.04, length(uv - vec2(0.5 - sin(time) * 0.1, 0.5)));
      float state4 = smoothstep(0.05, 0.04, length(uv - vec2(0.5, 0.5 - cos(time) * 0.1)));
      
      // Probability cloud
      float cloud = smoothstep(0.2, 0.0, length(uv - vec2(0.5, 0.5))) * 0.2;
      
      vec4 color = texture2D(tDiffuse, uv);
      color.rgb += state1 * vec3(1.0, 0.0, 0.0);
      color.rgb += state2 * vec3(0.0, 1.0, 0.0);
      color.rgb += state3 * vec3(0.0, 0.0, 1.0);
      color.rgb += state4 * vec3(1.0, 1.0, 0.0);
      color.rgb += cloud * vec3(0.5, 0.5, 1.0);
      
      gl_FragColor = color;
    }
  `,
};/**
 * Quantum Interference Shader
 */
const QuantumInterferenceShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Create two wave sources
      vec2 source1 = vec2(0.3, 0.5);
      vec2 source2 = vec2(0.7, 0.5);
      
      // Calculate distance to sources
      float dist1 = length(uv - source1);
      float dist2 = length(uv - source2);
      
      // Create wave patterns
      float wave1 = sin(dist1 * 50.0 - time * 2.0) * 0.5 + 0.5;
      float wave2 = sin(dist2 * 50.0 - time * 2.0) * 0.5 + 0.5;
      
      // Create interference pattern
      float interference = (wave1 + wave2) / 2.0;
      float constructive = smoothstep(0.9, 1.0, interference);
      float destructive = smoothstep(0.0, 0.1, interference);
      
      vec4 color = texture2D(tDiffuse, uv);
      color.rgb += constructive * vec3(0.0, 1.0, 1.0);
      color.rgb -= destructive * vec3(0.0, 0.5, 0.5);
      
      gl_FragColor = color;
    }
  `,
};/**
 * Quantum Particle Renderer
 */
export class QuantumParticleRenderer implements BaseRenderer {
  /** Options */
  private options: QuantumParticleRendererOptions;
  
  /** Scene */
  private scene: THREE.Scene | null = null;
  
  /** Camera */
  private camera: THREE.PerspectiveCamera | null = null;
  
  /** Renderer */
  private renderer: THREE.WebGLRenderer | null = null;
  
  /** Controls */
  private controls: OrbitControls | null = null;
  
  /** Composer */
  private composer: EffectComposer | null = null;
  
  /** Shader pass */
  private shaderPass: ShaderPass | null = null;
  
  /** Animation frame ID */
  private animationFrameId: number | null = null;
  
  /** Particles */
  private particles: THREE.Points | null = null;
  
  /** Particle geometry */
  private particleGeometry: THREE.BufferGeometry | null = null;
  
  /** Particle material */
  private particleMaterial: THREE.PointsMaterial | null = null;
  
  /** Event listeners */
  private eventListeners: Map<string, Function[]> = new Map();
  
  /** Time */
  private time: number = 0;
  
  /**
   * Constructor
   * @param options - Renderer options
   */
  constructor(options: QuantumParticleRendererOptions = {}) {
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
    
    this.log('Initializing Quantum Particle Renderer');
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
    
    // Setup scene
    this.setupScene(element);
    
    // Create particles
    this.createParticles();
    
    // Setup shader
    this.setupShader();
    
    // Start animation loop
    this.startAnimationLoop();
    
    this.log('Rendered quantum particles');
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
    this.camera.position.z = 100;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    element.appendChild(this.renderer.domElement);
    
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
  }
  
  /**
   * Create particles
   */
  private createParticles(): void {
    if (!this.scene) return;
    
    // Create particle geometry
    this.particleGeometry = new THREE.BufferGeometry();
    
    // Create particle positions
    const particleCount = this.options.particleCount || 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color(this.options.particleColor || '#4fc3f7');
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;      
      // Color
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size
      sizes[i] = Math.random() * (this.options.particleSize || 2);
    }
    
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create particle material
    this.particleMaterial = new THREE.PointsMaterial({
      size: this.options.particleSize || 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    
    // Create particles
    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particles);
  }
  
  /**
   * Setup shader
   */
  private setupShader(): void {
    if (!this.composer) return;
    
    // Create shader pass based on effect type
    let shader;
    
    switch (this.options.effectType) {
      case QuantumEffectType.WAVE_PARTICLE_DUALITY:
        shader = WaveParticleDualityShader;
        break;
      case QuantumEffectType.QUANTUM_ENTANGLEMENT:
        shader = QuantumEntanglementShader;
        break;
      case QuantumEffectType.QUANTUM_TUNNELING:
        shader = QuantumTunnelingShader;
        break;
      case QuantumEffectType.QUANTUM_SUPERPOSITION:
        shader = QuantumSuperpositionShader;
        break;
      case QuantumEffectType.QUANTUM_INTERFERENCE:
        shader = QuantumInterferenceShader;
        break;
      default:
        shader = WaveParticleDualityShader;
    }    
    this.shaderPass = new ShaderPass(shader);
    
    // Set shader uniforms
    if (this.options.effectType === QuantumEffectType.WAVE_PARTICLE_DUALITY) {
      this.shaderPass.uniforms.amplitude.value = this.options.waveAmplitude || 20.0;
      this.shaderPass.uniforms.frequency.value = this.options.waveFrequency || 0.02;
    } else if (this.options.effectType === QuantumEffectType.QUANTUM_ENTANGLEMENT) {
      this.shaderPass.uniforms.entanglementStrength.value = this.options.entanglementStrength || 0.8;
    } else if (this.options.effectType === QuantumEffectType.QUANTUM_TUNNELING) {
      this.shaderPass.uniforms.tunnelingProbability.value = this.options.tunnelingProbability || 0.3;
    }
    
    this.composer.addPass(this.shaderPass);
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
      
      // Update time
      this.time += 0.01;
      
      // Update shader uniforms
      if (this.shaderPass) {
        this.shaderPass.uniforms.time.value = this.time;
      }
      
      // Update particles
      if (this.particles && this.options.enableAnimations !== false) {
        this.updateParticles();
      }
      
      // Update controls
      if (this.controls) {
        this.controls.update();
      }
      
      // Render
      if (this.composer) {
        this.composer.render();
      } else if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    
    animate();
  }  
  /**
   * Update particles
   */
  private updateParticles(): void {
    if (!this.particleGeometry || !this.particles) return;
    
    const positions = this.particleGeometry.attributes.position.array as Float32Array;
    const particleCount = positions.length / 3;
    
    // Update particles based on effect type
    switch (this.options.effectType) {
      case QuantumEffectType.WAVE_PARTICLE_DUALITY:
        this.updateWaveParticleDuality(positions, particleCount);
        break;
      case QuantumEffectType.QUANTUM_ENTANGLEMENT:
        this.updateQuantumEntanglement(positions, particleCount);
        break;
      case QuantumEffectType.QUANTUM_TUNNELING:
        this.updateQuantumTunneling(positions, particleCount);
        break;
      case QuantumEffectType.QUANTUM_SUPERPOSITION:
        this.updateQuantumSuperposition(positions, particleCount);
        break;
      case QuantumEffectType.QUANTUM_INTERFERENCE:
        this.updateQuantumInterference(positions, particleCount);
        break;
      default:
        this.updateWaveParticleDuality(positions, particleCount);
    }
    
    this.particleGeometry.attributes.position.needsUpdate = true;
  }
  
  /**
   * Update wave-particle duality effect
   * @param positions - Particle positions
   * @param particleCount - Particle count
   */
  private updateWaveParticleDuality(positions: Float32Array, particleCount: number): void {
    const amplitude = this.options.waveAmplitude || 20;
    const frequency = this.options.waveFrequency || 0.02;
    
    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      // Wave effect
      positions[iy] = Math.sin(positions[ix] * frequency + this.time) * 
                      Math.cos(positions[iz] * frequency + this.time) * 
                      amplitude;    }
  }
  
  /**
   * Update quantum entanglement effect
   * @param positions - Particle positions
   * @param particleCount - Particle count
   */
  private updateQuantumEntanglement(positions: Float32Array, particleCount: number): void {
    const entanglementStrength = this.options.entanglementStrength || 0.8;
    
    // Create two groups of entangled particles
    const halfCount = Math.floor(particleCount / 2);
    
    for (let i = 0; i < halfCount; i++) {
      const ix1 = i * 3;
      const iy1 = i * 3 + 1;
      const iz1 = i * 3 + 2;
      
      const ix2 = (i + halfCount) * 3;
      const iy2 = (i + halfCount) * 3 + 1;
      const iz2 = (i + halfCount) * 3 + 2;
      
      // Entanglement effect (mirrored positions with some randomness)
      positions[ix2] = -positions[ix1] + (Math.random() - 0.5) * (1 - entanglementStrength) * 10;
      positions[iy2] = -positions[iy1] + (Math.random() - 0.5) * (1 - entanglementStrength) * 10;
      positions[iz2] = -positions[iz1] + (Math.random() - 0.5) * (1 - entanglementStrength) * 10;
    }
  }
  
  /**
   * Update quantum tunneling effect
   * @param positions - Particle positions
   * @param particleCount - Particle count
   */
  private updateQuantumTunneling(positions: Float32Array, particleCount: number): void {
    const tunnelingProbability = this.options.tunnelingProbability || 0.3;
    
    // Create barrier at x = 0
    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      // Move particles
      positions[ix] += Math.random() * 0.5 - 0.2;
      
      // Check if particle is near barrier
      if (Math.abs(positions[ix]) < 2) {
        // Tunneling effect
        if (Math.random() < tunnelingProbability) {
          // Tunnel through barrier
          positions[ix] = -positions[ix];
        }
      }    }
  }
  
  /**
   * Update quantum superposition effect
   * @param positions - Particle positions
   * @param particleCount - Particle count
   */
  private updateQuantumSuperposition(positions: Float32Array, particleCount: number): void {
    // Create superposition effect (particles in multiple states)
    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      // Superposition effect (multiple possible positions)
      const state = Math.floor(this.time * 2) % 4;
      
      if (state === 0) {
        positions[ix] = Math.sin(this.time + i) * 30;
        positions[iy] = Math.cos(this.time + i) * 30;
        positions[iz] = Math.sin(this.time * 0.5 + i) * 30;
      } else if (state === 1) {
        positions[ix] = Math.cos(this.time + i) * 30;
        positions[iy] = Math.sin(this.time + i) * 30;
        positions[iz] = Math.cos(this.time * 0.5 + i) * 30;
      } else if (state === 2) {
        positions[ix] = Math.sin(this.time * 0.5 + i) * 30;
        positions[iy] = Math.cos(this.time * 0.5 + i) * 30;
        positions[iz] = Math.sin(this.time + i) * 30;
      } else {
        positions[ix] = Math.cos(this.time * 0.5 + i) * 30;
        positions[iy] = Math.sin(this.time * 0.5 + i) * 30;
        positions[iz] = Math.cos(this.time + i) * 30;
      }
    }
  }
  
  /**
   * Update quantum interference effect
   * @param positions - Particle positions
   * @param particleCount - Particle count
   */
  private updateQuantumInterference(positions: Float32Array, particleCount: number): void {
    // Create interference pattern
    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;      
      // Calculate distance from two wave sources
      const source1 = new THREE.Vector3(-30, 0, 0);
      const source2 = new THREE.Vector3(30, 0, 0);
      
      const particlePos = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
      
      const dist1 = particlePos.distanceTo(source1);
      const dist2 = particlePos.distanceTo(source2);
      
      // Create wave patterns
      const wave1 = Math.sin(dist1 * 0.2 - this.time * 2.0);
      const wave2 = Math.sin(dist2 * 0.2 - this.time * 2.0);
      
      // Create interference pattern
      const interference = wave1 + wave2;
      
      // Move particles based on interference pattern
      positions[iy] = interference * 10;
    }
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
    
    // Update shader
    this.setupShader();
    
    this.log('Updated quantum particles');
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
    
    // Dispose resources
    if (this.particleGeometry) {
      this.particleGeometry.dispose();
    }
    
    if (this.particleMaterial) {
      this.particleMaterial.dispose();
    }
    
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
      console.log(`[QuantumParticleRenderer] ${message}`);
    }
  }
}