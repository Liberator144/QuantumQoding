/**
 * Galaxy View Component
 *
 * This component renders a galaxy visualization using the GalaxyRenderer.
 *
 * @version 1.0.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { VisualizationEngine, GalaxyRenderer } from '../../../visualization';
import { CosmicGalaxy, GalaxyType } from '../../../visualization/cosmic';

interface GalaxyViewProps {
  /** Galaxy to visualize */
  galaxy: CosmicGalaxy;
  
  /** Container width */
  width?: number;
  
  /** Container height */
  height?: number;
  
  /** Whether to show labels */
  showLabels?: boolean;
  
  /** Whether to show connections */
  showConnections?: boolean;
  
  /** Whether to show star systems */
  showStarSystems?: boolean;
  
  /** Whether to show nebulae */
  showNebulae?: boolean;
  
  /** Whether to show black holes */
  showBlackHoles?: boolean;
  
  /** Whether to show gravitational lensing */
  showGravitationalLensing?: boolean;
  
  /** Whether to enable animations */
  enableAnimations?: boolean;
  
  /** Whether to enable interactions */
  enableInteractions?: boolean;
  
  /** Theme */
  theme?: 'dark' | 'light' | 'quantum' | 'nebula';
  
  /** Object click handler */
  onObjectClick?: (objectId: string) => void;
  
  /** Object hover handler */
  onObjectHover?: (objectId: string | null) => void;
}/**
 * Galaxy View Component
 */
const GalaxyView: React.FC<GalaxyViewProps> = ({
  galaxy,
  width = 800,
  height = 600,
  showLabels = true,
  showConnections = true,
  showStarSystems = true,
  showNebulae = true,
  showBlackHoles = true,
  showGravitationalLensing = false,
  enableAnimations = true,
  enableInteractions = true,
  theme = 'quantum',
  onObjectClick,
  onObjectHover,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<VisualizationEngine | null>(null);
  const rendererRef = useRef<GalaxyRenderer | null>(null);
  
  // Initialize visualization engine and renderer
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create visualization engine
    const engine = new VisualizationEngine();
    engineRef.current = engine;
    
    // Create galaxy renderer
    const renderer = new GalaxyRenderer({
      showLabels,
      showConnections,
      showStarSystems,
      showNebulae,
      showBlackHoles,
      showGravitationalLensing,
      enableAnimations,
      enableInteractions,
      theme,
      width,
      height,
    });
    rendererRef.current = renderer;
    
    // Initialize renderer
    renderer.initialize();
    
    // Add event listeners
    renderer.addEventListener('select', (data: any) => {
      if (data.objects && data.objects.length > 0 && onObjectClick) {
        onObjectClick(data.objects[0].id);
      }
    });
    
    renderer.addEventListener('hover', (data: any) => {
      if (onObjectHover) {
        onObjectHover(data.object ? data.object.id : null);
      }
    });
    
    // Render galaxy
    renderer.render(containerRef.current, galaxy);
    
    // Cleanup
    return () => {
      renderer.dispose();
    };
  }, []);  
  // Update renderer when props change
  useEffect(() => {
    if (!rendererRef.current) return;
    
    rendererRef.current.update(galaxy, {
      showLabels,
      showConnections,
      showStarSystems,
      showNebulae,
      showBlackHoles,
      showGravitationalLensing,
      enableAnimations,
      enableInteractions,
      theme,
    });
  }, [
    galaxy, 
    showLabels, 
    showConnections, 
    showStarSystems, 
    showNebulae, 
    showBlackHoles, 
    showGravitationalLensing, 
    enableAnimations, 
    enableInteractions, 
    theme
  ]);
  
  // Update renderer when size changes
  useEffect(() => {
    if (!rendererRef.current) return;
    
    rendererRef.current.resize(width, height);
  }, [width, height]);
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
};

export default GalaxyView;