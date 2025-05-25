/**
 * Quantum State Visualizer
 * 
 * This component visualizes quantum states and their properties, showing
 * state vectors, superpositions, and entanglements.
 * 
 * @version 1.0.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { colors, animations } from '../../design-system';
import { QuantumState, QuantumStateVector } from '../../../backend/interdimensional/quantum/QuantumStateManager';

/**
 * Quantum state visualizer props
 */
interface QuantumStateVisualizerProps {
  /** Quantum state to visualize */
  state: QuantumState;
  
  /** Width of the visualization */
  width?: number;
  
  /** Height of the visualization */
  height?: number;
  
  /** Whether to show state details */
  showDetails?: boolean;
  
  /** Whether to animate state changes */
  animate?: boolean;
  
  /** Whether to show entanglements */
  showEntanglements?: boolean;
  
  /** Callback when a state property is clicked */
  onPropertyClick?: (property: string, value: any) => void;
  
  /** Callback when the state is clicked */
  onStateClick?: (state: QuantumState) => void;
  
  /** Additional class name */
  className?: string;
}

/**
 * Quantum state visualizer component
 */
const QuantumStateVisualizer: React.FC<QuantumStateVisualizerProps> = ({
  state,
  width = 400,
  height = 400,
  showDetails = true,
  animate = true,
  showEntanglements = true,
  onPropertyClick,
  onStateClick,
  className,
}) => {
  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // State
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  
  // Create visualization when component mounts or state changes
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Create background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', colors.background.primary)
      .attr('rx', 8)
      .attr('ry', 8);
    
    // Create state circle
    const stateRadius = Math.min(width, height) * 0.3;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const stateCircle = svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', stateRadius)
      .attr('fill', 'url(#quantumGradient)')
      .attr('stroke', colors.border.primary)
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .on('click', () => onStateClick && onStateClick(state))
      .on('mouseover', () => {
        d3.select(tooltipRef.current)
          .style('display', 'block')
          .html(`
            <div style="font-weight: bold;">${state.id}</div>
            <div>Version: ${state.version}</div>
            <div>Last Synchronized: ${state.lastSynchronized ? new Date(state.lastSynchronized).toLocaleString() : 'Never'}</div>
          `);
      })
      .on('mousemove', (event) => {
        d3.select(tooltipRef.current)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', () => {
        d3.select(tooltipRef.current)
          .style('display', 'none');
      });
    
    // Add quantum gradient
    const gradient = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'quantumGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '50%')
      .attr('fy', '50%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colors.secondary.neural);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colors.secondary.quantum);
    
    // Add state ID text
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', colors.text.primary)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(state.id.slice(0, 8));
    
    // Create property circles
    const properties = Object.entries(state.properties);
    const propertyRadius = stateRadius * 0.3;
    const propertyDistance = stateRadius * 1.5;
    
    properties.forEach((property, index) => {
      const [key, value] = property;
      const angle = (index / properties.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * propertyDistance;
      const y = centerY + Math.sin(angle) * propertyDistance;
      
      // Create property circle
      const propertyCircle = svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', propertyRadius)
        .attr('fill', colors.primary.nebula)
        .attr('stroke', colors.border.primary)
        .attr('stroke-width', 1)
        .attr('cursor', 'pointer')
        .on('click', () => onPropertyClick && onPropertyClick(key, value))
        .on('mouseover', () => {
          setHoveredProperty(key);
          d3.select(tooltipRef.current)
            .style('display', 'block')
            .html(`
              <div style="font-weight: bold;">${key}</div>
              <div>${JSON.stringify(value)}</div>
              ${state.propertyTimestamps && state.propertyTimestamps[key] ? 
                `<div>Updated: ${new Date(state.propertyTimestamps[key]).toLocaleString()}</div>` : ''}
            `);
        })
        .on('mousemove', (event) => {
          d3.select(tooltipRef.current)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY + 10}px`);
        })
        .on('mouseout', () => {
          setHoveredProperty(null);
          d3.select(tooltipRef.current)
            .style('display', 'none');
        });
      
      // Add property connection line
      svg.append('line')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', colors.primary.nebula)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.5);
      
      // Add property key text
      svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', colors.text.primary)
        .attr('font-size', '12px')
        .text(key.length > 10 ? `${key.slice(0, 8)}...` : key);
    });
    
    // Add animation if enabled
    if (animate) {
      stateCircle
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .attr('opacity', 1)
        .attr('r', stateRadius);
      
      svg.selectAll('line')
        .attr('stroke-dasharray', function() { return this.getTotalLength(); })
        .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
        .transition()
        .duration(1000)
        .attr('stroke-dashoffset', 0);
    }
    
  }, [state, width, height, showDetails, animate, showEntanglements, onPropertyClick, onStateClick]);
  
  return (
    <div className={`quantum-state-visualizer ${className || ''}`} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          display: 'none',
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.primary}`,
          borderRadius: '4px',
          padding: '8px',
          pointerEvents: 'none',
          zIndex: 1000,
          color: colors.text.primary,
          fontSize: '12px',
          maxWidth: '200px',
        }}
      />
    </div>
  );
};

export default QuantumStateVisualizer;