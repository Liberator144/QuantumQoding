/**
 * Planetary System View Component
 *
 * This component renders a planetary system visualization using the PlanetarySystemRenderer.
 *
 * @version 1.0.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { VisualizationEngine } from '../../../visualization';
import { 
  PlanetarySystemRenderer, 
  PlanetarySystemData, 
  PlanetData, 
  PlanetType, 
  PlanetFeature 
} from '../../../visualization/charts/PlanetarySystemRenderer';

interface PlanetarySystemViewProps {
  /** Planetary system data */
  system: PlanetarySystemData;
  
  /** Container width */
  width?: number;
  
  /** Container height */
  height?: number;
  
  /** Whether to show labels */
  showLabels?: boolean;
  
  /** Whether to show orbits */
  showOrbits?: boolean;
  
  /** Whether to show features */
  showFeatures?: boolean;
  
  /** Whether to show planet details */
  showPlanetDetails?: boolean;
  
  /** Whether to enable animations */
  enableAnimations?: boolean;
  
  /** Whether to enable interactions */
  enableInteractions?: boolean;
  
  /** Whether to enable physics */
  enablePhysics?: boolean;
  
  /** Theme */
  theme?: 'dark' | 'light' | 'quantum' | 'nebula';
  
  /** Planet click handler */
  onPlanetClick?: (planet: PlanetData) => void;
  
  /** Planet hover handler */
  onPlanetHover?: (planet: PlanetData | null) => void;
  
  /** Feature click handler */
  onFeatureClick?: (feature: PlanetFeature) => void;
  
  /** Feature hover handler */
  onFeatureHover?: (feature: PlanetFeature | null) => void;
}/**
 * Planetary System View Component
 */
const PlanetarySystemView: React.FC<PlanetarySystemViewProps> = ({
  system,
  width = 800,
  height = 600,
  showLabels = true,
  showOrbits = true,
  showFeatures = true,
  showPlanetDetails = true,
  enableAnimations = true,
  enableInteractions = true,
  enablePhysics = true,
  theme = 'quantum',
  onPlanetClick,
  onPlanetHover,
  onFeatureClick,
  onFeatureHover,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<VisualizationEngine | null>(null);
  const rendererRef = useRef<PlanetarySystemRenderer | null>(null);
  
  // Initialize visualization engine and renderer
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create visualization engine
    const engine = new VisualizationEngine();
    engineRef.current = engine;
    
    // Create planetary system renderer
    const renderer = new PlanetarySystemRenderer({
      showLabels,
      showOrbits,
      showFeatures,
      showPlanetDetails,
      enableAnimations,
      enableInteractions,
      enablePhysics,
      theme,
      width,
      height,
    });
    rendererRef.current = renderer;
    
    // Initialize renderer
    renderer.initialize();
    
    // Add event listeners
    renderer.addEventListener('select', (data: any) => {
      const object = data.object;
      
      if (object) {
        if (object.features) {
          // Planet
          if (onPlanetClick) onPlanetClick(object);
        } else if (object.position) {
          // Feature
          if (onFeatureClick) onFeatureClick(object);
        }
      }
    });    
    renderer.addEventListener('hover', (data: any) => {
      const object = data.object;
      
      if (object) {
        if (object.features) {
          // Planet
          if (onPlanetHover) onPlanetHover(object);
        } else if (object.position) {
          // Feature
          if (onFeatureHover) onFeatureHover(object);
        }
      } else {
        if (onPlanetHover) onPlanetHover(null);
        if (onFeatureHover) onFeatureHover(null);
      }
    });
    
    // Render planetary system
    renderer.render(containerRef.current, system);
    
    // Cleanup
    return () => {
      renderer.dispose();
    };
  }, []);
  
  // Update renderer when props change
  useEffect(() => {
    if (!rendererRef.current) return;
    
    rendererRef.current.update(system, {
      showLabels,
      showOrbits,
      showFeatures,
      showPlanetDetails,
      enableAnimations,
      enableInteractions,
      enablePhysics,
      theme,
    });
  }, [
    system,
    showLabels,
    showOrbits,
    showFeatures,
    showPlanetDetails,
    enableAnimations,
    enableInteractions,
    enablePhysics,
    theme,
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

export default PlanetarySystemView;