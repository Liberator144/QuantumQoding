/**
 * Universe Partitioning Demo Component
 *
 * This component demonstrates the Universe Partitioning System.
 *
 * @version 1.0.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { 
  UniversePartitioner,
  SectorType,
} from '../../../visualization/utils';

interface UniversePartitioningDemoProps {
  /** Container width */
  width?: number;
  
  /** Container height */
  height?: number;
  
  /** Sector size */
  sectorSize?: number;
  
  /** Enable sector transitions */
  enableSectorTransitions?: boolean;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Universe Partitioning Demo Component
 */
const UniversePartitioningDemo: React.FC<UniversePartitioningDemoProps> = ({
  width = 800,
  height = 600,
  sectorSize = 200,
  enableSectorTransitions = true,
  debugMode = false,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Universe partitioning system ref
  const universePartitionerRef = useRef<UniversePartitioner | null>(null);
  
  // State
  const [fps, setFps] = useState<number>(0);
  const [activeSectors, setActiveSectors] = useState<number>(0);
  const [totalSectors, setTotalSectors] = useState<number>(0);
  const [currentSectorType, setCurrentSectorType] = useState<SectorType | null>(null);  
  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.z = 100;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 1000;
    controlsRef.current = controls;
    
    // Create universe partitioner
    universePartitionerRef.current = new UniversePartitioner(
      scene,
      camera,
      {
        sectorSize,
        activeSectorRadius: 1,
        loadSectorRadius: 2,
        unloadSectorRadius: 3,
        maxSectors: 100,
        loadSectorDelay: 500,
        unloadSectorDelay: 1000,
        enableSectorTransitions,
        sectorTransitionDuration: 1000,
        debugMode,
      }
    );
    
    universePartitionerRef.current.initialize();
    
    // Animation loop
    let frameCount = 0;
    let lastTime = performance.now();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }      
      // Update universe partitioner
      if (universePartitionerRef.current) {
        universePartitionerRef.current.update();
        
        // Update stats
        const stats = universePartitionerRef.current.getStats();
        setActiveSectors(stats.activeSectors);
        setTotalSectors(stats.totalSectors);
        
        // Update current sector type
        const currentSector = universePartitionerRef.current.getCurrentSector();
        if (currentSector) {
          setCurrentSectorType(currentSector.type);
        }
      }
      
      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Update FPS counter
      frameCount++;
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= 1000) {
        setFps(Math.round((frameCount * 1000) / elapsed));
        frameCount = 0;
        lastTime = now;
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      // Dispose renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      
      // Dispose controls
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      // Dispose universe partitioner
      if (universePartitionerRef.current) {
        universePartitionerRef.current.dispose();
      }
    };
  }, [width, height, sectorSize, enableSectorTransitions, debugMode]);  
  /**
   * Get sector type color
   * @param type - Sector type
   * @returns Color
   */
  const getSectorTypeColor = (type: SectorType | null): string => {
    switch (type) {
      case SectorType.EMPTY:
        return '#444444'; // Gray
      case SectorType.STAR:
        return '#ffff00'; // Yellow
      case SectorType.GALAXY:
        return '#0088ff'; // Blue
      case SectorType.NEBULA:
        return '#ff00ff'; // Purple
      case SectorType.BLACK_HOLE:
        return '#000000'; // Black
      case SectorType.QUANTUM:
        return '#00ff88'; // Teal
      default:
        return '#ffffff'; // White
    }
  };
  
  /**
   * Get sector type name
   * @param type - Sector type
   * @returns Name
   */
  const getSectorTypeName = (type: SectorType | null): string => {
    switch (type) {
      case SectorType.EMPTY:
        return 'Empty';
      case SectorType.STAR:
        return 'Star';
      case SectorType.GALAXY:
        return 'Galaxy';
      case SectorType.NEBULA:
        return 'Nebula';
      case SectorType.BLACK_HOLE:
        return 'Black Hole';
      case SectorType.QUANTUM:
        return 'Quantum';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <div className="relative">
      {/* Renderer container */}
      <div 
        ref={containerRef} 
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          position: 'relative',
          overflow: 'hidden',
        }}
      />      
      {/* Stats overlay */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
        <div>FPS: {fps}</div>
        <div>Active Sectors: {activeSectors}</div>
        <div>Total Sectors: {totalSectors}</div>
        <div>
          Current Sector: 
          <span 
            style={{ 
              color: getSectorTypeColor(currentSectorType),
              marginLeft: '4px',
            }}
          >
            {getSectorTypeName(currentSectorType)}
          </span>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
        <div>Use mouse to rotate camera</div>
        <div>Use scroll wheel to zoom in/out</div>
        <div>Move around to explore different sectors</div>
      </div>
    </div>
  );
};

export default UniversePartitioningDemo;