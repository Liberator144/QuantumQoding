// Emergency Three.js type declarations to prevent browser freezing

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, MOUSE, TOUCH, Vector3 } from 'three';
  
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    object: Camera;
    domElement: HTMLElement | Document;
    enabled: boolean;
    target: Vector3;
    minDistance: number;
    maxDistance: number;
    minZoom: number;
    maxZoom: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    zoomSpeed: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string };
    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };
    touches: { ONE: TOUCH; TWO: TOUCH };
    update(): boolean;
    saveState(): void;
    reset(): void;
    dispose(): void;
    getPolarAngle(): number;
    getAzimuthalAngle(): number;
    getDistance(): number;
    listenToKeyEvents(domElement: HTMLElement): void;
    stopListenToKeyEvents(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer, WebGLRenderTarget } from 'three';
  
  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
    renderer: WebGLRenderer;
    renderTarget1: WebGLRenderTarget;
    renderTarget2: WebGLRenderTarget;
    writeBuffer: WebGLRenderTarget;
    readBuffer: WebGLRenderTarget;
    passes: any[];
    copyPass: any;
    clock: any;
    renderToScreen: boolean;
    addPass(pass: any): void;
    insertPass(pass: any, index: number): void;
    removePass(pass: any): void;
    isLastEnabledPass(passIndex: number): boolean;
    render(deltaTime?: number): void;
    reset(renderTarget?: WebGLRenderTarget): void;
    setSize(width: number, height: number): void;
    setPixelRatio(pixelRatio: number): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Scene, Camera, Material, Color } from 'three';
  
  export class RenderPass {
    constructor(scene: Scene, camera: Camera, overrideMaterial?: Material, clearColor?: Color, clearAlpha?: number);
    scene: Scene;
    camera: Camera;
    overrideMaterial: Material;
    clearColor: Color;
    clearAlpha: number;
    clear: boolean;
    clearDepth: boolean;
    needsSwap: boolean;
    enabled: boolean;
    renderToScreen: boolean;
    render(renderer: any, writeBuffer: any, readBuffer: any, deltaTime?: number, maskActive?: boolean): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import { Vector2 } from 'three';
  
  export class UnrealBloomPass {
    constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
    resolution: Vector2;
    strength: number;
    radius: number;
    threshold: number;
    enabled: boolean;
    needsSwap: boolean;
    renderToScreen: boolean;
    render(renderer: any, writeBuffer: any, readBuffer: any, deltaTime?: number, maskActive?: boolean): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/renderers/CSS2DRenderer' {
  import { Scene, Camera } from 'three';
  
  export class CSS2DRenderer {
    constructor();
    domElement: HTMLElement;
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: Camera): void;
    dispose(): void;
  }
  
  export class CSS2DObject {
    constructor(element: HTMLElement);
    element: HTMLElement;
    position: any;
    rotation: any;
    scale: any;
    visible: boolean;
    copy(source: CSS2DObject): this;
    clone(): CSS2DObject;
  }
}

declare module 'three/examples/jsm/modifiers/SimplifyModifier' {
  import { BufferGeometry } from 'three';
  
  export class SimplifyModifier {
    constructor();
    modify(geometry: BufferGeometry, count: number): BufferGeometry;
  }
}

declare module 'three/examples/jsm/utils/BufferGeometryUtils' {
  import { BufferGeometry } from 'three';
  
  export function mergeBufferGeometries(geometries: BufferGeometry[], useGroups?: boolean): BufferGeometry | null;
  export function mergeBufferAttributes(attributes: any[]): any;
  export function interleaveAttributes(attributes: any[]): any;
  export function estimateBytesUsed(geometry: BufferGeometry): number;
  export function mergeVertices(geometry: BufferGeometry, tolerance?: number): BufferGeometry;
  export function toTrianglesDrawMode(geometry: BufferGeometry, drawMode: number): BufferGeometry;
  export function computeMorphedAttributes(object: any): any;
}