/**
 * Star System View Component
 *
 * This component renders a star system visualization using the StarSystemRenderer.
 *
 * @version 1.0.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { VisualizationEngine, StarSystemRenderer } from '../../../visualization';
import { CosmicSystem } from '../../../visualization/cosmic';

interface StarSystemViewProps {
  /** Star system to visualize */
  system: CosmicSystem;
  
  /** Container width */
  width?: number;
  
  /** Container height */
  height?: number;
  
  /** Whether to show labels */
  showLabels?: boolean;
  
  /** Whether to show connections */
  showConnections?: boolean;
  
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
}

/**
 * Star System View Component
 */
const StarSystemView: React.FC<StarSystemViewProps> = ({
  system,
  width = 800,
  height = 600,
  showLabels = true,
  showConnections = true,
  enableAnimations = true,
  enableInteractions = true,
  theme = 'quantum',
  onObjectClick,
  onObjectHover,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<VisualizationEngine | null>(null);
  const rendererRef = useRef<StarSystemRenderer | null>(null);
  
  // Initialize visualization engine and renderer
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create visualization engine
    const engine = new VisualizationEngine();
    engineRef.current = engine;
    
    // Create star system renderer
    const renderer = new StarSystemRenderer({
      showLabels,
      showConnections,
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
    
    // Render system
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
      showConnections,
      enableAnimations,
      enableInteractions,
      theme,
    });
  }, [system, showLabels, showConnections, enableAnimations, enableInteractions, theme]);
  
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

export default StarSystemView;