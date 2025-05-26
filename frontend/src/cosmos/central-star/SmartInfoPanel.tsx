/**
 * Smart Information Panel - Revolutionary Enhancement
 * 
 * Advanced information panel with smart edge detection, responsive positioning,
 * accessibility features, and quantum-coherent animations.
 * 
 * @version 1.0.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartInfoPanelProps {
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
    triggerElement: HTMLElement | null;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

interface PanelPosition {
    x: number;
    y: number;
    placement: 'top' | 'bottom' | 'left' | 'right';
    offset: { x: number; y: number };
}

export const SmartInfoPanel: React.FC<SmartInfoPanelProps> = ({
    node,
    isVisible,
    triggerElement,
    onMouseEnter,
    onMouseLeave
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<PanelPosition>({
        x: 0,
        y: 0,
        placement: 'bottom',
        offset: { x: 0, y: 0 }
    });
    const [isPositioned, setIsPositioned] = useState(false);

    // Smart positioning algorithm
    const calculateOptimalPosition = (): PanelPosition => {
        if (!triggerElement || !panelRef.current) {
            return { x: 0, y: 0, placement: 'bottom', offset: { x: 0, y: 0 } };
        }

        const triggerRect = triggerElement.getBoundingClientRect();
        const panelRect = panelRef.current.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const spacing = 16; // Minimum spacing from viewport edges
        const panelWidth = 320; // Panel width
        const panelHeight = 200; // Estimated panel height

        // Calculate available space in each direction
        const spaceTop = triggerRect.top - spacing;
        const spaceBottom = viewport.height - triggerRect.bottom - spacing;
        const spaceLeft = triggerRect.left - spacing;
        const spaceRight = viewport.width - triggerRect.right - spacing;

        // Determine optimal placement
        let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
        let x = triggerRect.left + triggerRect.width / 2;
        let y = triggerRect.bottom + spacing;

        // Priority: bottom > top > right > left
        if (spaceBottom >= panelHeight) {
            placement = 'bottom';
            y = triggerRect.bottom + spacing;
        } else if (spaceTop >= panelHeight) {
            placement = 'top';
            y = triggerRect.top - panelHeight - spacing;
        } else if (spaceRight >= panelWidth) {
            placement = 'right';
            x = triggerRect.right + spacing;
            y = triggerRect.top + triggerRect.height / 2;
        } else if (spaceLeft >= panelWidth) {
            placement = 'left';
            x = triggerRect.left - panelWidth - spacing;
            y = triggerRect.top + triggerRect.height / 2;
        }

        // Adjust for horizontal centering (top/bottom placements)
        if (placement === 'top' || placement === 'bottom') {
            x = triggerRect.left + triggerRect.width / 2;
            
            // Ensure panel doesn't overflow horizontally
            const halfPanelWidth = panelWidth / 2;
            if (x - halfPanelWidth < spacing) {
                x = spacing + halfPanelWidth;
            } else if (x + halfPanelWidth > viewport.width - spacing) {
                x = viewport.width - spacing - halfPanelWidth;
            }
        }

        // Adjust for vertical centering (left/right placements)
        if (placement === 'left' || placement === 'right') {
            y = triggerRect.top + triggerRect.height / 2;
            
            // Ensure panel doesn't overflow vertically
            const halfPanelHeight = panelHeight / 2;
            if (y - halfPanelHeight < spacing) {
                y = spacing + halfPanelHeight;
            } else if (y + halfPanelHeight > viewport.height - spacing) {
                y = viewport.height - spacing - halfPanelHeight;
            }
        }

        // Calculate offset for transform origin
        const offset = {
            x: placement === 'left' || placement === 'right' ? 0 : -50,
            y: placement === 'top' || placement === 'bottom' ? 0 : -50
        };

        return { x, y, placement, offset };
    };

    // Update position when visibility changes or window resizes
    useEffect(() => {
        if (isVisible && triggerElement) {
            const updatePosition = () => {
                const newPosition = calculateOptimalPosition();
                setPosition(newPosition);
                setIsPositioned(true);
            };

            // Initial positioning
            updatePosition();

            // Update on window resize
            const handleResize = () => {
                updatePosition();
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        } else {
            setIsPositioned(false);
        }
    }, [isVisible, triggerElement]);

    // Animation variants based on placement
    const getAnimationVariants = () => {
        const baseVariants = {
            hidden: {
                opacity: 0,
                scale: 0.8,
            },
            visible: {
                opacity: 1,
                scale: 1,
            },
            exit: {
                opacity: 0,
                scale: 0.8,
            }
        };

        // Add directional animation based on placement
        switch (position.placement) {
            case 'top':
                baseVariants.hidden.y = 10;
                baseVariants.visible.y = 0;
                baseVariants.exit.y = 10;
                break;
            case 'bottom':
                baseVariants.hidden.y = -10;
                baseVariants.visible.y = 0;
                baseVariants.exit.y = -10;
                break;
            case 'left':
                baseVariants.hidden.x = 10;
                baseVariants.visible.x = 0;
                baseVariants.exit.x = 10;
                break;
            case 'right':
                baseVariants.hidden.x = -10;
                baseVariants.visible.x = 0;
                baseVariants.exit.x = -10;
                break;
        }

        return baseVariants;
    };

    // Get arrow position based on placement
    const getArrowStyle = () => {
        const arrowSize = 8;
        const arrowOffset = 16;

        switch (position.placement) {
            case 'top':
                return {
                    position: 'absolute' as const,
                    bottom: -arrowSize / 2,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: arrowSize,
                    height: arrowSize,
                    backgroundColor: `${node.color}40`,
                    borderRight: `1px solid ${node.color}50`,
                    borderBottom: `1px solid ${node.color}50`,
                };
            case 'bottom':
                return {
                    position: 'absolute' as const,
                    top: -arrowSize / 2,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: arrowSize,
                    height: arrowSize,
                    backgroundColor: `${node.color}40`,
                    borderLeft: `1px solid ${node.color}50`,
                    borderTop: `1px solid ${node.color}50`,
                };
            case 'left':
                return {
                    position: 'absolute' as const,
                    right: -arrowSize / 2,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(45deg)',
                    width: arrowSize,
                    height: arrowSize,
                    backgroundColor: `${node.color}40`,
                    borderTop: `1px solid ${node.color}50`,
                    borderRight: `1px solid ${node.color}50`,
                };
            case 'right':
                return {
                    position: 'absolute' as const,
                    left: -arrowSize / 2,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(45deg)',
                    width: arrowSize,
                    height: arrowSize,
                    backgroundColor: `${node.color}40`,
                    borderBottom: `1px solid ${node.color}50`,
                    borderLeft: `1px solid ${node.color}50`,
                };
            default:
                return {};
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isPositioned && (
                <motion.div
                    ref={panelRef}
                    className="fixed z-50 pointer-events-auto"
                    style={{
                        left: position.x,
                        top: position.y,
                        transform: `translate(${position.offset.x}%, ${position.offset.y}%)`,
                        width: '320px',
                    }}
                    variants={getAnimationVariants()}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                        duration: 0.3
                    }}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    role="tooltip"
                    aria-label={`Information about ${node.name}`}
                >
                    {/* Arrow */}
                    <div style={getArrowStyle()} />

                    {/* Panel Content */}
                    <div
                        className="relative p-5 border rounded-xl backdrop-blur-xl"
                        style={{
                            background: `linear-gradient(135deg, ${node.color}20, ${node.color}35, ${node.color}15)`,
                            borderColor: `${node.color}50`,
                            boxShadow: `0 0 30px ${node.color}25, inset 0 0 20px ${node.color}10`,
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <h3
                                className="text-lg font-semibold"
                                style={{
                                    color: node.color,
                                    textShadow: `0 0 10px ${node.color}80`
                                }}
                            >
                                {node.name}
                            </h3>
                            <div
                                className="px-2 py-1 text-xs rounded-full"
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
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                            {node.description}
                        </p>

                        {/* Features */}
                        {node.features && node.features.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-400 mb-2">
                                    Key Features:
                                </h4>
                                <div className="space-y-1">
                                    {node.features.slice(0, 3).map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center space-x-2 text-xs"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: node.color }}
                                            />
                                            <span className="text-gray-300">
                                                {feature.name}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Interactive Elements */}
                        <div className="mt-4 pt-3 border-t border-gray-600/30">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Click to explore</span>
                                <motion.div
                                    className="flex space-x-1"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div
                                        className="w-1 h-1 rounded-full"
                                        style={{ backgroundColor: node.color }}
                                    />
                                    <div
                                        className="w-1 h-1 rounded-full"
                                        style={{ backgroundColor: node.color }}
                                    />
                                    <div
                                        className="w-1 h-1 rounded-full"
                                        style={{ backgroundColor: node.color }}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};