import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: DimensionalPortalInterface.js
 * @version 2.0.0
 */
/**
 * Dimensional Portal Interface
 *
 * This component provides an interface for navigating between dimensions
 * and visualizing dimensional boundaries.
 *
 * @version 1.0.0
 */
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { colors } from '../../styles';
import { BoundaryState, BoundaryType } from '../../types/backend-types';
/**
 * Dimensional portal interface component
 */
const DimensionalPortalInterface = ({ currentDimension, availableDimensions, boundaries, width = 600, height = 400, showBoundaryDetails = true, animate = true, onDimensionSelect, onBoundarySelect, className, }) => {
    // Refs
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    // State
    const [hoveredDimension, setHoveredDimension] = useState(null);
    const [hoveredBoundary, setHoveredBoundary] = useState(null);
    // Create visualization when component mounts or data changes
    useEffect(() => {
        if (!svgRef.current)
            return;
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
        // Create force simulation
        const simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id((d) => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(50));
        // Prepare data for visualization
        const nodes = availableDimensions.map(dimension => ({
            ...dimension,
            radius: dimension.id === currentDimension.id ? 40 : 30,
            color: dimension.id === currentDimension.id ? colors.primary.stellar : colors.primary.nebula,
        }));
        const links = boundaries.map(boundary => ({
            ...boundary,
            source: boundary.sourceDimensionId,
            target: boundary.targetDimensionId,
            value: 1,
        }));
        // Add links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke', (d) => getBoundaryColor(d))
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', (d) => getBoundaryDashArray(d))
            .attr('cursor', 'pointer')
            .on('click', (event, d) => onBoundarySelect && onBoundarySelect(d))
            .on('mouseover', (event, d) => {
            setHoveredBoundary(d.id);
            d3.select(tooltipRef.current)
                .style('display', 'block')
                .html(`
            <div style="font-weight: bold;">${d.name}</div>
            <div>Type: ${d.type}</div>
            <div>State: ${d.state}</div>
            <div>From: ${d.sourceDimensionId}</div>
            <div>To: ${d.targetDimensionId}</div>
          `);
        })
            .on('mousemove', (event) => {
            d3.select(tooltipRef.current)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY + 10}px`);
        })
            .on('mouseout', () => {
            setHoveredBoundary(null);
            d3.select(tooltipRef.current)
                .style('display', 'none');
        });
        // Add nodes
        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', (d) => d.radius)
            .attr('fill', (d) => d.color)
            .attr('stroke', colors.border.primary)
            .attr('stroke-width', 2)
            .attr('cursor', 'pointer')
            .on('click', (event, d) => onDimensionSelect && onDimensionSelect(d))
            .on('mouseover', (event, d) => {
            setHoveredDimension(d.id);
            d3.select(tooltipRef.current)
                .style('display', 'block')
                .html(`
            <div style="font-weight: bold;">${d.name}</div>
            <div>Type: ${d.type}</div>
            <div>State: ${d.state}</div>
          `);
        })
            .on('mousemove', (event) => {
            d3.select(tooltipRef.current)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY + 10}px`);
        })
            .on('mouseout', () => {
            setHoveredDimension(null);
            d3.select(tooltipRef.current)
                .style('display', 'none');
        })
            .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
        // Add node labels
        const nodeLabels = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', colors.text.primary)
            .attr('font-size', '12px')
            .attr('pointer-events', 'none')
            .text((d) => d.name.length > 10 ? `${d.name.slice(0, 8)}...` : d.name);
        // Add boundary markers
        svg.append('defs').selectAll('marker')
            .data(['arrow'])
            .enter()
            .append('marker')
            .attr('id', d => d)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 25)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('fill', colors.primary.stellar)
            .attr('d', 'M0,-5L10,0L0,5');
        // Update positions on simulation tick
        simulation.nodes(nodes).on('tick', () => {
            link
                .attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);
            node
                .attr('cx', (d) => d.x)
                .attr('cy', (d) => d.y);
            nodeLabels
                .attr('x', (d) => d.x)
                .attr('y', (d) => d.y);
        });
        simulation.force('link', d3.forceLink(links).id((d) => d.id).distance(100));
        // Drag functions
        function dragstarted(event, d) {
            if (!event.active)
                simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active)
                simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        // Helper functions
        function getBoundaryColor(boundary) {
            if (boundary.state === BoundaryState.CLOSED) {
                return colors.status.error;
            }
            if (boundary.state === BoundaryState.PARTIALLY_OPEN) {
                return colors.status.warning;
            }
            if (boundary.state === BoundaryState.QUANTUM_ENTANGLED) {
                return colors.secondary.quantum;
            }
            switch (boundary.type) {
                case BoundaryType.PERMEABLE:
                    return colors.primary.stellar;
                case BoundaryType.SEMI_PERMEABLE:
                    return colors.primary.nebula;
                case BoundaryType.IMPERMEABLE:
                    return colors.status.error;
                case BoundaryType.QUANTUM:
                    return colors.secondary.quantum;
                default:
                    return colors.primary.nebula;
            }
        }
        function getBoundaryDashArray(boundary) {
            switch (boundary.state) {
                case BoundaryState.CLOSED:
                    return '5,5';
                case BoundaryState.PARTIALLY_OPEN:
                    return '10,5';
                case BoundaryState.QUANTUM_ENTANGLED:
                    return '5,2,2,2';
                default:
                    return '';
            }
        }
    }, [currentDimension, availableDimensions, boundaries, width, height, showBoundaryDetails, animate, onDimensionSelect, onBoundarySelect]);
    return (_jsxs("div", { className: `dimensional-portal-interface ${className || ''}`, style: { position: 'relative' }, children: [_jsx("svg", { ref: svgRef }), _jsx("div", { ref: tooltipRef, style: {
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
                } })] }));
};
export default DimensionalPortalInterface;
