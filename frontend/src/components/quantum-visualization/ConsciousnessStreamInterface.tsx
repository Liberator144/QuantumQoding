import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: ConsciousnessStreamInterface.js
 * @version 2.0.0
 */
/**
 * Consciousness Stream Interface
 *
 * This component provides an interface for visualizing and interacting with
 * consciousness streams between dimensions.
 *
 * @version 1.0.0
 */
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { colors } from '../../styles';
/**
 * Consciousness stream interface component
 */
const ConsciousnessStreamInterface = ({ streamId, packets, width = 800, height = 400, showPacketDetails = true, animate = true, showQuantumState = true, onPacketClick, onPacketCreate, className, }) => {
    // Refs
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    // State
    const [hoveredPacket, setHoveredPacket] = useState(null);
    const [selectedPacket, setSelectedPacket] = useState(null);
    // Create visualization when component mounts or packets change
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
        // Sort packets by timestamp
        const sortedPackets = [...packets].sort((a, b) => a.header.timestamp - b.header.timestamp);
        // Create time scale
        const timeExtent = d3.extent(sortedPackets, d => d.header.timestamp);
        const timeScale = d3.scaleLinear()
            .domain(timeExtent)
            .range([50, width - 50]);
        // Create stream path
        const streamHeight = height / 2;
        const streamPath = svg.append('path')
            .attr('d', `M 0,${streamHeight} L ${width},${streamHeight}`)
            .attr('stroke', colors.secondary.consciousness)
            .attr('stroke-width', 4)
            .attr('fill', 'none');
        // Add stream glow effect
        const streamGlow = svg.append('filter')
            .attr('id', 'stream-glow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');
        streamGlow.append('feGaussianBlur')
            .attr('stdDeviation', 4)
            .attr('result', 'blur');
        streamGlow.append('feComposite')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'blur')
            .attr('operator', 'over');
        streamPath.attr('filter', 'url(#stream-glow)');
        // Add stream flow animation
        if (animate) {
            const streamFlow = svg.append('path')
                .attr('d', `M 0,${streamHeight} L ${width},${streamHeight}`)
                .attr('stroke', colors.secondary.neural)
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('stroke-dasharray', '10,10')
                .attr('stroke-dashoffset', 0);
            function animateStreamFlow() {
                streamFlow
                    .attr('stroke-dashoffset', 0)
                    .transition()
                    .duration(5000)
                    .ease(d3.easeLinear)
                    .attr('stroke-dashoffset', -200)
                    .on('end', animateStreamFlow);
            }
            animateStreamFlow();
        }
        // Add time axis
        const timeAxis = d3.axisBottom(timeScale)
            .tickFormat(d => new Date(d).toLocaleTimeString());
        svg.append('g')
            .attr('transform', `translate(0, ${height - 30})`)
            .call(timeAxis)
            .attr('color', colors.text.secondary)
            .selectAll('text')
            .attr('fill', colors.text.secondary);
        // Add packets
        const packetGroup = svg.append('g');
        sortedPackets.forEach((packet, index) => {
            const x = timeScale(packet.header.timestamp);
            const y = streamHeight;
            const packetRadius = showPacketDetails ? 15 : 10;
            // Create packet circle
            const packetCircle = packetGroup.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', packetRadius)
                .attr('fill', getPacketColor(packet))
                .attr('stroke', colors.border.primary)
                .attr('stroke-width', 2)
                .attr('cursor', 'pointer')
                .on('click', () => {
                setSelectedPacket(packet.header.packetId);
                onPacketClick && onPacketClick(packet);
            })
                .on('mouseover', (event) => {
                setHoveredPacket(packet.header.packetId);
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .html(`
              <div style="font-weight: bold;">Packet: ${packet.header.packetId.slice(0, 8)}</div>
              <div>Time: ${new Date(packet.header.timestamp).toLocaleString()}</div>
              <div>Source: ${packet.header.sourceId}</div>
              <div>Target: ${packet.header.targetId}</div>
              ${showPacketDetails ? `<div>Data: ${JSON.stringify(packet.payload.data).slice(0, 50)}${JSON.stringify(packet.payload.data).length > 50 ? '...' : ''}</div>` : ''}
              ${showQuantumState && packet.payload.quantumState ? `<div>Quantum State: ${packet.payload.quantumState.id.slice(0, 8)}</div>` : ''}
            `);
            })
                .on('mousemove', (event) => {
                d3.select(tooltipRef.current)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY + 10}px`);
            })
                .on('mouseout', () => {
                setHoveredPacket(null);
                d3.select(tooltipRef.current)
                    .style('display', 'none');
            });
            // Add packet label
            if (showPacketDetails) {
                packetGroup.append('text')
                    .attr('x', x)
                    .attr('y', y - packetRadius - 5)
                    .attr('text-anchor', 'middle')
                    .attr('fill', colors.text.secondary)
                    .attr('font-size', '10px')
                    .text(`P${index + 1}`);
            }
            // Add quantum state visualization
            if (showQuantumState && packet.payload.quantumState) {
                packetGroup.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', packetRadius * 1.5)
                    .attr('fill', 'none')
                    .attr('stroke', colors.secondary.quantum)
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', '3,3')
                    .attr('opacity', 0.7);
            }
            // Add context preservation indicator
            if (packet.header.contextPreservationFlags) {
                if (packet.header.contextPreservationFlags.preserveQuantumState) {
                    packetGroup.append('circle')
                        .attr('cx', x + packetRadius * 0.7)
                        .attr('cy', y - packetRadius * 0.7)
                        .attr('r', 4)
                        .attr('fill', colors.secondary.quantum);
                }
                if (packet.header.contextPreservationFlags.preserveContext) {
                    packetGroup.append('circle')
                        .attr('cx', x - packetRadius * 0.7)
                        .attr('cy', y - packetRadius * 0.7)
                        .attr('r', 4)
                        .attr('fill', colors.primary.stellar);
                }
            }
            // Add animation if enabled
            if (animate) {
                packetCircle
                    .attr('opacity', 0)
                    .attr('r', 0)
                    .transition()
                    .duration(500)
                    .delay(index * 100)
                    .attr('opacity', 1)
                    .attr('r', packetRadius);
            }
        });
        // Add stream ID
        svg.append('text')
            .attr('x', 20)
            .attr('y', 30)
            .attr('fill', colors.text.primary)
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text(`Stream: ${streamId}`);
        // Add packet count
        svg.append('text')
            .attr('x', 20)
            .attr('y', 50)
            .attr('fill', colors.text.secondary)
            .attr('font-size', '12px')
            .text(`Packets: ${packets.length}`);
        // Helper functions
        function getPacketColor(packet) {
            if (packet.payload.quantumState) {
                return colors.secondary.quantum;
            }
            if (packet.header.contextPreservationFlags?.preserveContext) {
                return colors.primary.stellar;
            }
            return colors.secondary.consciousness;
        }
    }, [streamId, packets, width, height, showPacketDetails, animate, showQuantumState, onPacketClick]);
    return (_jsxs("div", { className: `consciousness-stream-interface ${className || ''}`, style: { position: 'relative' }, children: [_jsx("svg", { ref: svgRef }), _jsx("div", { ref: tooltipRef, style: {
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
                } }), selectedPacket && (_jsxs("div", { className: "packet-details-panel", style: {
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: colors.background.card,
                    border: `1px solid ${colors.border.primary}`,
                    borderRadius: '4px',
                    padding: '12px',
                    width: '300px',
                    color: colors.text.primary,
                }, children: [_jsx("h3", { children: "Packet Details" }), _jsxs("p", { children: ["ID: ", selectedPacket] }), _jsxs("p", { children: ["Time: ", new Date(packets.find(p => p.header.packetId === selectedPacket)?.header.timestamp || 0).toLocaleString()] }), _jsxs("p", { children: ["Source: ", packets.find(p => p.header.packetId === selectedPacket)?.header.sourceId] }), _jsxs("p", { children: ["Target: ", packets.find(p => p.header.packetId === selectedPacket)?.header.targetId] }), _jsxs("div", { children: [_jsx("h4", { children: "Payload:" }), _jsx("pre", { style: {
                                    maxHeight: '100px',
                                    overflow: 'auto',
                                    backgroundColor: colors.background.secondary,
                                    padding: '8px',
                                    borderRadius: '4px',
                                    fontSize: '10px'
                                }, children: JSON.stringify(packets.find(p => p.header.packetId === selectedPacket)?.payload.data, null, 2) })] }), _jsx("button", { onClick: () => setSelectedPacket(null), children: "Close" })] })), onPacketCreate && (_jsx("div", { className: "create-packet-panel", style: {
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                }, children: _jsx("button", { onClick: () => onPacketCreate({
                        header: {
                            streamId,
                            timestamp: Date.now(),
                        }
                    }), style: {
                        backgroundColor: colors.primary.stellar,
                        color: colors.text.primary,
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                    }, children: "Create Packet" }) }))] }));
};
export default ConsciousnessStreamInterface;
