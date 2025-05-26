// Emergency global type declarations to prevent browser freezing

// Allow any module imports
declare module '*' {
  const content: any;
  export default content;
  export = content;
}

// Global window extensions
declare global {
  interface Window {
    [key: string]: any;
  }
  
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
  
  // D3 global types
  namespace d3 {
    interface Selection<GElement, Datum, PElement, PDatum> {
      [key: string]: any;
    }
    
    interface Transition<GElement, Datum, PElement, PDatum> {
      ease?: any;
      delay?: any;
      [key: string]: any;
    }
    
    interface Drag<GElement, Datum, Subject> {
      [key: string]: any;
    }
    
    interface Zoom<GElement, Datum> {
      [key: string]: any;
    }
  }
  
  // Three.js extensions
  namespace THREE {
    interface Material {
      color?: any;
      wireframe?: boolean;
      morphTargets?: boolean;
      emissive?: any;
      [key: string]: any;
    }
    
    interface Object3D {
      geometry?: any;
      material?: any;
      visible?: boolean;
      [key: string]: any;
    }
    
    interface BufferGeometry {
      mergeVertices?: () => BufferGeometry;
      [key: string]: any;
    }
  }
}

// Backend module declarations
declare module '../../../backend/interdimensional/boundary/BoundaryManager' {
  export const BoundaryManager: any;
  export default BoundaryManager;
}

declare module '../../../backend/interdimensional/neural/NeuralFabricManager' {
  export const NeuralFabricManager: any;
  export default NeuralFabricManager;
}

// Quantum types
export interface QuantumState {
  [key: string]: any;
}

export interface ConsciousnessPacket {
  [key: string]: any;
}

export interface NeuralFabric {
  [key: string]: any;
}

export interface DimensionalBoundary {
  [key: string]: any;
}

export {};