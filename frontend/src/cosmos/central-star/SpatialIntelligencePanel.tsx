/**
 * Spatial Intelligence Panel System - Revolutionary Implementation
 * 
 * Advanced panel system with spatial awareness, automatic positioning in empty space,
 * quantum attachment effects, draggable functionality, and non-intrusive design.
 * 
 * @version 1.0.0
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Move } from 'lucide-react';

interface SpatialIntelligencePanelProps {
    node: {
        name: string;
        color: string;
        description: string;
        style: string;
        features: Array<{
            name: string;
            description: string;
            orbit: string;
        }>;
    };
    isVisible: boolean;
    starPosition: { x: number; y: number };
    onClose: () => void;
}

interface SpatialZone {
    x: number;
    y: number;
    width: number;
    height: number;
    isEmpty: boolean;
    score: number; // Higher score = better position
}

export const SpatialIntelligencePanel: React.FC<SpatialIntelligencePanelProps> = ({
    node,
    isVisible,
    starPosition,
    onClose
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [connectionPath, setConnectionPath] = useState('');
    const [isPositioned, setIsPositioned] = useState(false);

    // Spatial intelligence algorithm to find optimal empty space
    const findOptimalPosition = useCallback((): { x: number; y: number } => {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const panelWidth = 350;
        const panelHeight = 280;
        const minDistance = 100; // Minimum distance from star
        const maxDistance = 400; // Maximum distance from star
        const gridSize = 50; // Grid resolution for spatial analysis

        // Get all UI elements to avoid
        const uiElements = [
            // Navigation controls
            { x: 16, y: viewport.height - 100, width: 200, height: 80 },
            // Header area
            { x: 0, y: 0, width: viewport.width, height: 80 },
            // Portal area (center)
            { x: viewport.width/2 - 150, y: viewport.height/2 - 150, width: 300, height: 300 },
            // Star positions (approximate orbital areas)
            { x: viewport.width/2 - 200, y: viewport.height/2 - 200, width: 400, height: 400 }
        ];

        // Create spatial grid and analyze empty zones
        const zones: SpatialZone[] = [];
        
        for (let x = 0; x < viewport.width - panelWidth; x += gridSize) {
            for (let y = 0; y < viewport.height - panelHeight; y += gridSize) {
                const zone: SpatialZone = {
                    x,
                    y,
                    width: panelWidth,
                    height: panelHeight,
                    isEmpty: true,
                    score: 0
                };

                // Check if zone overlaps with any UI elements
                for (const element of uiElements) {
                    if (x < element.x + element.width &&
                        x + panelWidth > element.x &&
                        y < element.y + element.height &&
                        y + panelHeight > element.y) {
                        zone.isEmpty = false;
                        break;
                    }
                }

                if (zone.isEmpty) {
                    // Calculate distance from star
                    const centerX = x + panelWidth / 2;
                    const centerY = y + panelHeight / 2;
                    const distance = Math.sqrt(
                        Math.pow(centerX - starPosition.x, 2) + 
                        Math.pow(centerY - starPosition.y, 2)
                    );

                    // Only consider positions within reasonable distance
                    if (distance >= minDistance && distance <= maxDistance) {
                        // Calculate score based on multiple factors
                        let score = 100;

                        // Prefer positions closer to star (but not too close)
                        const distanceScore = Math.max(0, 100 - (distance - minDistance) / (maxDistance - minDistance) * 50);
                        score += distanceScore;

                        // Prefer positions in corners/edges (less likely to interfere)
                        const edgeBonus = Math.min(
                            Math.min(x, viewport.width - x - panelWidth),
                            Math.min(y, viewport.height - y - panelHeight)
                        );
                        score += Math.min(edgeBonus / 10, 20);

                        // Prefer positions that don't block the center view
                        const centerDistance = Math.sqrt(
                            Math.pow(centerX - viewport.width/2, 2) + 
                            Math.pow(centerY - viewport.height/2, 2)
                        );
                        if (centerDistance > 200) {
                            score += 30;
                        }

                        zone.score = score;
                        zones.push(zone);
                    }
                }
            }
        }

        // Find the best zone
        if (zones.length === 0) {
            // Fallback: position in top-right corner
            return {
                x: viewport.width - panelWidth - 20,
                y: 20
            };
        }

        const bestZone = zones.reduce((best, current) => 
            current.score > best.score ? current : best
        );

        return { x: bestZone.x, y: bestZone.y };
    }, [starPosition]);

    // Calculate connection path from star to panel
    const calculateConnectionPath = useCallback((panelPos: { x: number; y: number }) => {
        const panelCenter = {
            x: panelPos.x + 175, // Half of panel width
            y: panelPos.y + 140  // Half of panel height
        };

        // Create a curved path from star to panel
        const midX = (starPosition.x + panelCenter.x) / 2;
        const midY = (starPosition.y + panelCenter.y) / 2;
        
        // Add some curve to make it more organic
        const curveOffset = 50;
        const controlX = midX + (Math.random() - 0.5) * curveOffset;
        const controlY = midY - curveOffset;

        return `M ${starPosition.x} ${starPosition.y} Q ${controlX} ${controlY} ${panelCenter.x} ${panelCenter.y}`;
    }, [starPosition]);

    // Initialize position when panel becomes visible
    useEffect(() => {
        if (isVisible && !isPositioned) {
            const optimalPos = findOptimalPosition();
            setPosition(optimalPos);
            setConnectionPath(calculateConnectionPath(optimalPos));
            setIsPositioned(true);
        } else if (!isVisible) {
            setIsPositioned(false);
        }
    }, [isVisible, findOptimalPosition, calculateConnectionPath, isPositioned]);

    // Handle dragging
    const handleDrag = (event: any, info: PanInfo) => {
        const newPosition = {
            x: position.x + info.delta.x,
            y: position.y + info.delta.y
        };
        
        // Keep panel within viewport bounds
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        newPosition.x = Math.max(0, Math.min(newPosition.x, viewport.width - 350));
        newPosition.y = Math.max(0, Math.min(newPosition.y, viewport.height - 280));
        
        setPosition(newPosition);
        setConnectionPath(calculateConnectionPath(newPosition));
    };

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    if (!isVisible || !isPositioned) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 pointer-events-none z-40">
                {/* Quantum Connection Line */}
                <svg className="absolute inset-0 w-full h-full">
                    <motion.path
                        d={connectionPath}
                        stroke={node.color}
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                            pathLength: 1, 
                            opacity: 0.6,
                            strokeDashoffset: [0, -10]
                        }}
                        exit={{ pathLength: 0, opacity: 0 }}
                        transition={{ 
                            pathLength: { duration: 0.8, ease: "easeOut" },
                            strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
                        }}
                        style={{
                            filter: `drop-shadow(0 0 8px ${node.color})`
                        }}
                    />
                    
                    {/* Connection particles */}
                    {[...Array(3)].map((_, i) => (
                        <motion.circle
                            key={i}
                            r="3"
                            fill={node.color}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                offsetDistance: ['0%', '100%']
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                offsetPath: `path("${connectionPath}")`,
                                filter: `drop-shadow(0 0 6px ${node.color})`
                            }}
                        />
                    ))}
                </svg>

                {/* Smart Panel */}
                <motion.div
                    ref={panelRef}
                    className="absolute pointer-events-auto"
                    style={{
                        left: position.x,
                        top: position.y,
                        width: '350px',
                        height: '280px'
                    }}
                    initial={{ 
                        scale: 0, 
                        opacity: 0,
                        rotate: -10
                    }}
                    animate={{ 
                        scale: 1, 
                        opacity: 1,
                        rotate: 0
                    }}
                    exit={{ 
                        scale: 0, 
                        opacity: 0,
                        rotate: 10
                    }}
                    transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                        duration: 0.6
                    }}
                    drag
                    dragMomentum={false}
                    onDrag={handleDrag}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    whileDrag={{ 
                        scale: 1.05,
                        boxShadow: `0 20px 40px ${node.color}40`
                    }}
                >
                    <div
                        className={`relative w-full h-full border-2 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                            isDragging ? 'cursor-grabbing' : 'cursor-grab'
                        }`}
                        style={{
                            background: `linear-gradient(135deg, 
                                ${node.color}15, 
                                ${node.color}25, 
                                ${node.color}10)`,
                            borderColor: `${node.color}60`,
                            boxShadow: `0 0 30px ${node.color}30, inset 0 0 20px ${node.color}10`,
                        }}
                    >
                        {/* Header with drag handle and close button */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-600/30">
                            <div className="flex items-center space-x-3">
                                <Move 
                                    className="w-4 h-4 text-gray-400 cursor-grab" 
                                    style={{ color: `${node.color}80` }}
                                />
                                <h3
                                    className="text-lg font-semibold"
                                    style={{
                                        color: node.color,
                                        textShadow: `0 0 10px ${node.color}80`
                                    }}
                                >
                                    {node.name}
                                </h3>
                            </div>
                            
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-red-500/20 transition-colors"
                                style={{ color: '#ff6b6b' }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            {/* Style badge */}
                            <div className="flex justify-end">
                                <div
                                    className="px-3 py-1 text-xs rounded-full"
                                    style={{
                                        backgroundColor: `${node.color}30`,
                                        color: node.color,
                                        border: `1px solid ${node.color}50`
                                    }}
                                >
                                    {node.style}
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {node.description}
                            </p>

                            {/* Features */}
                            {node.features && node.features.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                                        Key Features:
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {node.features.slice(0, 4).map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-center space-x-2 text-xs p-2 rounded-lg"
                                                style={{
                                                    backgroundColor: `${node.color}20`,
                                                    border: `1px solid ${node.color}30`
                                                }}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: node.color }}
                                                />
                                                <span className="text-gray-300 truncate">
                                                    {feature.name}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action button */}
                            <div className="pt-2">
                                <motion.button
                                    className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all"
                                    style={{
                                        backgroundColor: `${node.color}40`,
                                        color: 'white',
                                        border: `1px solid ${node.color}60`
                                    }}
                                    whileHover={{
                                        backgroundColor: `${node.color}60`,
                                        scale: 1.02
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Explore {node.name}
                                </motion.button>
                            </div>
                        </div>

                        {/* Quantum particles background */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 rounded-full"
                                    style={{
                                        backgroundColor: node.color,
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        opacity: [0.2, 0.8, 0.2],
                                        scale: [1, 1.5, 1],
                                        x: [0, (Math.random() - 0.5) * 20],
                                        y: [0, (Math.random() - 0.5) * 20]
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: Math.random() * 2
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};