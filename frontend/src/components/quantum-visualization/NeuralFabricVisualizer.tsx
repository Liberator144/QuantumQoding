/**
 * TypeScript Migration
 * Migrated from: NeuralFabricVisualizer.js
 * @version 2.0.0
 */
/**
 * Neural Fabric Visualizer
 *
 * This component visualizes the neural fabric, showing nodes, connections,
 * and pathways between different dimensions.
 *
 * @version 1.0.0
 */
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { colors } from '../../design-system';
import { NeuralNodeType, NeuralConnectionType } from '../../../backend/interdimensional/neural/NeuralFabricManager';
/**
 * Neural fabric visualizer component
 */
const NeuralFabricVisualizer = ({ fabric, width = 800, height = 600, showNodeDetails = true, showConnectionDetails = true, showPathwayDetails = true, animate = true, enable3D = false, onNodeClick, onConnectionClick, onPathwayClick, className, }) => {
    // Refs
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    // State
    const [hoveredNode, setHoveredNode] = useState(null);
    const [hoveredConnection, setHoveredConnection] = useState(null);
    const [hoveredPathway, setHoveredPathway] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [selectedPathway, setSelectedPathway] = useState(null);
    // Create visualization when component mounts or fabric changes
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
            .force('collision', d3.forceCollide().radius(30));
        // Prepare data for visualization
        const nodes = fabric.nodes.map(node => ({
            ...node,
            radius: getNodeRadius(node),
            color: getNodeColor(node),
        }));
        const links = fabric.connections.map(connection => ({
            ...connection,
            source: connection.sourceNodeId,
            target: connection.targetNodeId,
            value: connection.strength,
        }));
        // Add links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke', (d) => getConnectionColor(d))
            .attr('stroke-width', (d) => Math.max(1, d.strength * 3))
            .attr('stroke-dasharray', (d) => getConnectionDashArray(d))
            .attr('cursor', 'pointer')
            .on('click', (event, d) => {
            setSelectedConnection(d.id);
            onConnectionClick && onConnectionClick(d);
        })
            .on('mouseover', (event, d) => {
            setHoveredConnection(d.id);
            d3.select(tooltipRef.current)
                .style('display', 'block')
                .html(`
            <div style="font-weight: bold;">Connection: ${d.id.slice(0, 8)}</div>
            <div>Type: ${d.type}</div>
            <div>Strength: ${d.strength.toFixed(2)}</div>
            <div>State: ${d.state}</div>
            <div>Source: ${d.sourceNodeId.slice(0, 8)}</div>
            <div>Target: ${d.targetNodeId.slice(0, 8)}</div>
          `);
        })
            .on('mousemove', (event) => {
            d3.select(tooltipRef.current)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY + 10}px`);
        })
            .on('mouseout', () => {
            setHoveredConnection(null);
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
            .on('click', (event, d) => {
            setSelectedNode(d.id);
            onNodeClick && onNodeClick(d);
        })
            .on('mouseover', (event, d) => {
            setHoveredNode(d.id);
            d3.select(tooltipRef.current)
                .style('display', 'block')
                .html(`
            <div style="font-weight: bold;">${d.name}</div>
            <div>Type: ${d.type}</div>
            <div>State: ${d.state}</div>
            <div>Activation: ${d.activationLevel.toFixed(2)}</div>
          `);
        })
            .on('mousemove', (event) => {
            d3.select(tooltipRef.current)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY + 10}px`);
        })
            .on('mouseout', () => {
            setHoveredNode(null);
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
            .attr('font-size', '10px')
            .attr('pointer-events', 'none')
            .text((d) => d.name.length > 10 ? `${d.name.slice(0, 8)}...` : d.name);
        // Add pathways
        if (showPathwayDetails && fabric.pathways.length > 0) {
            // Create pathway groups
            const pathwayGroups = fabric.pathways.map(pathway => {
                const pathwayNodes = pathway.nodeIds.map(nodeId => fabric.nodes.find(node => node.id === nodeId)).filter(Boolean);
                const pathwayConnections = pathway.connectionIds.map(connectionId => fabric.connections.find(connection => connection.id === connectionId)).filter(Boolean);
                return {
                    ...pathway,
                    nodes: pathwayNodes,
                    connections: pathwayConnections,
                };
            });
            // Visualize pathways
            pathwayGroups.forEach(pathway => {
                if (pathway.connections.length > 0) {
                    const pathwayLine = svg.append('path')
                        .attr('fill', 'none')
                        .attr('stroke', getPathwayColor(pathway))
                        .attr('stroke-width', 5)
                        .attr('stroke-opacity', 0.3)
                        .attr('cursor', 'pointer')
                        .on('click', () => {
                        setSelectedPathway(pathway.id);
                        onPathwayClick && onPathwayClick(pathway);
                    })
                        .on('mouseover', (event) => {
                        setHoveredPathway(pathway.id);
                        d3.select(tooltipRef.current)
                            .style('display', 'block')
                            .html(`
                  <div style="font-weight: bold;">${pathway.name}</div>
                  <div>Type: ${pathway.type}</div>
                  <div>State: ${pathway.state}</div>
                  <div>Strength: ${pathway.strength.toFixed(2)}</div>
                  <div>Nodes: ${pathway.nodeIds.length}</div>
                  <div>Connections: ${pathway.connectionIds.length}</div>
                `);
                    })
                        .on('mousemove', (event) => {
                        d3.select(tooltipRef.current)
                            .style('left', `${event.pageX + 10}px`)
                            .style('top', `${event.pageY + 10}px`);
                    })
                        .on('mouseout', () => {
                        setHoveredPathway(null);
                        d3.select(tooltipRef.current)
                            .style('display', 'none');
                    });
                    // Update pathway path on simulation tick
                    simulation.on('tick.pathway', () => {
                        const pathData = [];
                        for (let i = 0; i < pathway.connections.length; i++) {
                            const connection = pathway.connections[i];
                            const source = nodes.find((n) => n.id === connection.sourceNodeId);
                            const target = nodes.find((n) => n.id === connection.targetNodeId);
                            if (source && target) {
                                if (i === 0) {
                                    pathData.push(`M${source.x},${source.y}`);
                                }
                                pathData.push(`L${target.x},${target.y}`);
                            }
                        }
                        pathwayLine.attr('d', pathData.join(' '));
                    });
                }
            });
        }
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
        function getNodeRadius(node) {
            switch (node.type) {
                case NeuralNodeType.CONSCIOUSNESS:
                    return 20;
                case NeuralNodeType.QUANTUM_STATE:
                    return 18;
                case NeuralNodeType.DATA:
                    return 15;
                case NeuralNodeType.SERVICE:
                    return 12;
                default:
                    return 10;
            }
        }
        function getNodeColor(node) {
            switch (node.type) {
                case NeuralNodeType.CONSCIOUSNESS:
                    return colors.secondary.consciousness;
                case NeuralNodeType.QUANTUM_STATE:
                    return colors.secondary.quantum;
                case NeuralNodeType.DATA:
                    return colors.primary.nebula;
                case NeuralNodeType.SERVICE:
                    return colors.primary.stellar;
                default:
                    return colors.primary.cosmic;
            }
        }
        function getConnectionColor(connection) {
            switch (connection.type) {
                case NeuralConnectionType.DIRECT:
                    return colors.primary.stellar;
                case NeuralConnectionType.INDIRECT:
                    return colors.primary.nebula;
                case NeuralConnectionType.QUANTUM_ENTANGLED:
                    return colors.secondary.quantum;
                case NeuralConnectionType.CONSCIOUSNESS_STREAM:
                    return colors.secondary.consciousness;
                default:
                    return colors.primary.cosmic;
            }
        }
        function getConnectionDashArray(connection) {
            switch (connection.type) {
                case NeuralConnectionType.INDIRECT:
                    return '5,5';
                case NeuralConnectionType.QUANTUM_ENTANGLED:
                    return '5,2,2,2';
                case NeuralConnectionType.CONSCIOUSNESS_STREAM:
                    return '10,5';
                default:
                    return '';
            }
        }
        function getPathwayColor(pathway) {
            switch (pathway.type) {
                case 'consciousness':
                    return colors.secondary.consciousness;
                case 'data':
                    return colors.primary.nebula;
                case 'control':
                    return colors.primary.stellar;
                default:
                    return colors.primary.cosmic;
            }
        }
    }, [fabric, width, height, showNodeDetails, showConnectionDetails, showPathwayDetails, animate, enable3D, onNodeClick, onConnectionClick, onPathwayClick]);
    return (<div className={`neural-fabric-visualizer ${className || ''}`} style={{ position: 'relative' }}>
      <svg ref={svgRef}/>
      <div ref={tooltipRef} style={{
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
        }}/>
      {showNodeDetails && selectedNode && (<div className="node-details-panel" style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '4px',
                padding: '12px',
                width: '250px',
                color: colors.text.primary,
            }}>
          <h3>Node Details</h3>
          <p>ID: {selectedNode}</p>
          <p>Name: {fabric.nodes.find(node => node.id === selectedNode)?.name}</p>
          <p>Type: {fabric.nodes.find(node => node.id === selectedNode)?.type}</p>
          <p>State: {fabric.nodes.find(node => node.id === selectedNode)?.state}</p>
          <button onClick={() => setSelectedNode(null)}>Close</button>
        </div>)}
    </div>);
};
export default NeuralFabricVisualizer;
