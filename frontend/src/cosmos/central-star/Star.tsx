import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: Star.js
 * @version 2.0.0
 */
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../lib/useAudio';
export const Star = ({ node, isHovered, onHover, onNavigate, }) => {
    const starRef = useRef(null);
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });
    // Initialize audio
    const audio = useAudio();
    // Update position for data streams
    useEffect(() => {
        if (starRef.current) {
            const rect = starRef.current.getBoundingClientRect();
            setPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            });
        }
    }, []);
    // Handle star click with sound effect
    const handleClick = () => {
        audio.play('star-click', { volume: 0.5 });
    };
    // Handle navigation with sound effect and animations
    // Play navigation sound and effects
    const handleNavigate = () => {
        audio.play('star-select', { volume: 0.6 });
        // Play a sequence of quantum effects
        audio.playSequence([
            { sound: 'quantum-pulse', delay: 100, options: { volume: 0.4 } },
            { sound: 'energy-burst', delay: 300, options: { volume: 0.5 } },
            { sound: 'data-flow', delay: 500, options: { volume: 0.3 } }
        ]);
        // Navigate to the star system
        onNavigate(node);
    };
    // Center coordinates for data streams
    const centerPosition = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };
    return (_jsxs("div", { ref: starRef, className: "absolute", style: {
            left: `calc(50% + ${Math.cos((node.angle * Math.PI) / 180) * node.distance}px)`,
            top: `calc(50% + ${Math.sin((node.angle * Math.PI) / 180) * node.distance}px)`,
            transform: 'translate(-50%, -50%)',
            zIndex: isHovered ? 20 : 10,
        }, children: [_jsx(motion.div, { className: "relative cursor-pointer group", animate: {
                    scale: isHovered ? 1.2 : 1,
                    rotate: 360,
                }, transition: {
                    scale: {
                        duration: 0.3,
                        type: 'spring',
                        stiffness: 300,
                        damping: 15,
                    },
                    rotate: {
                        duration: node.rotationSpeed,
                        repeat: Infinity,
                        ease: 'linear',
                    },
                }, onMouseEnter: () => onHover(node.name), onMouseLeave: () => onHover(null), onClick: handleNavigate, children: _jsxs("div", { className: "relative flex items-center justify-center w-24 h-24", children: [_jsx("div", { className: "absolute inset-0 overflow-hidden rounded-full", style: {
                                boxShadow: `0 0 30px ${node.color}80, inset 0 0 20px ${node.color}`,
                            }, children: _jsx("div", { className: "absolute inset-0", style: {
                                    background: `radial-gradient(circle, ${node.color} 0%, ${node.color}90 40%, ${node.color}30 70%, transparent 100%)`,
                                }, children: _jsx("div", { className: "absolute inset-0 mix-blend-overlay", children: [...Array(8)].map((_, i) => (_jsx("div", { className: "absolute rounded-full", style: {
                                            width: `${Math.random() * 60 + 40}%`,
                                            height: `${Math.random() * 60 + 40}%`,
                                            left: `${Math.random() * 40}%`,
                                            top: `${Math.random() * 40}%`,
                                            background: `radial-gradient(circle, ${node.color}80 0%, transparent 70%)`,
                                            animation: `pulse ${2 + Math.random() * 3}s infinite ease-in-out`,
                                        } }, i))) }) }) }), [...Array(6)].map((_, i) => (_jsx("div", { className: "absolute", style: {
                                width: '100%',
                                height: '4px',
                                top: '50%',
                                left: '50%',
                                background: `linear-gradient(90deg, transparent, ${node.color}, transparent)`,
                                transform: `translateX(-50%) translateY(-50%) rotate(${i * 30}deg)`,
                                animation: `flare ${3 + i * 0.5}s infinite ease-in-out`,
                                opacity: 0.7,
                                filter: 'blur(1px)',
                            } }, i))), [...Array(12)].map((_, i) => (_jsx(motion.div, { className: "absolute rounded-full", style: {
                                width: Math.random() * 3 + 1,
                                height: Math.random() * 3 + 1,
                                backgroundColor: node.color,
                                left: '50%',
                                top: '50%',
                                filter: 'blur(1px)',
                            }, animate: {
                                x: [0, (Math.random() - 0.5) * 30],
                                y: [0, (Math.random() - 0.5) * 30],
                                opacity: [1, 0],
                            }, transition: {
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                ease: 'easeOut',
                                delay: Math.random() * 2,
                            } }, i))), _jsx("div", { className: "absolute inset-[-50%] rounded-full", style: {
                                background: `radial-gradient(circle, ${node.color}40 0%, ${node.color}10 30%, transparent 70%)`,
                                filter: 'blur(15px)',
                            } })] }) }), _jsx("div", { className: "absolute mt-2 -translate-x-1/2 top-full left-1/2", children: _jsx(motion.div, { className: "relative", animate: {
                        y: [0, -2, 0],
                        scale: isHovered ? 1.1 : 1,
                    }, transition: {
                        y: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        scale: {
                            duration: 0.3
                        }
                    }, children: _jsx("div", { className: `px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300
                     ${isHovered ? 'bg-black/50 border-opacity-100' : 'bg-black/20 border-opacity-50'}`, style: {
                            borderWidth: '1px',
                            borderColor: node.color,
                            boxShadow: isHovered ? `0 0 10px ${node.color}60` : 'none',
                        }, children: _jsx("p", { className: "text-sm whitespace-nowrap", style: {
                                color: node.color,
                                textShadow: `0 0 5px ${node.color}80`
                            }, children: node.name }) }) }) }), _jsx(AnimatePresence, { children: isHovered && (_jsx(motion.div, { className: "absolute top-0 left-0 w-full h-full", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsxs("svg", { className: "absolute w-full h-full", children: [_jsx("line", { x1: centerPosition.x - position.x, y1: centerPosition.y - position.y, x2: "0", y2: "0", stroke: node.color, strokeWidth: "1", strokeDasharray: "5,5", className: "animate-pulse" }), [...Array(5)].map((_, i) => (_jsx(motion.circle, { r: "2", fill: node.color, filter: "blur(1px)", animate: {
                                    offsetDistance: ['0%', '100%'],
                                }, transition: {
                                    duration: 2,
                                    delay: i * 0.4,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }, style: {
                                    offsetPath: `path("M ${centerPosition.x - position.x} ${centerPosition.y - position.y} L 0 0")`,
                                } }, i)))] }) })) }), _jsx(AnimatePresence, { children: isHovered && (_jsx(motion.div, { initial: {
                        opacity: 0,
                        scale: 0.8,
                        y: 10,
                    }, animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }, exit: {
                        opacity: 0,
                        scale: 0.8,
                        y: 10,
                    }, className: "absolute z-30 transform -translate-x-1/2 left-1/2", style: {
                        top: 'calc(100% + 2rem)',
                        width: '280px',
                    }, children: _jsxs("div", { className: "relative p-4 border rounded-lg backdrop-blur-md", style: {
                            background: `linear-gradient(45deg, ${node.color}15, ${node.color}25)`,
                            borderColor: `${node.color}40`,
                            boxShadow: `0 0 20px ${node.color}20`,
                        }, children: [_jsx("div", { className: "absolute inset-0 overflow-hidden rounded-lg", children: [...Array(20)].map((_, i) => (_jsx(motion.div, { className: "absolute rounded-full", style: {
                                        width: Math.random() * 4 + 2,
                                        height: Math.random() * 4 + 2,
                                        background: node.color,
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }, animate: {
                                        opacity: [0.2, 0.5, 0.2],
                                        scale: [1, 1.2, 1],
                                    }, transition: {
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    } }, i))) }), _jsxs(motion.div, { className: "relative", initial: {
                                    opacity: 0,
                                }, animate: {
                                    opacity: 1,
                                }, transition: {
                                    delay: 0.2,
                                }, children: [_jsx("h3", { className: "mb-2 text-lg font-medium", style: {
                                            color: node.color,
                                            textShadow: `0 0 8px ${node.color}60`,
                                        }, children: node.name }), _jsx("p", { className: "mb-3 text-sm leading-relaxed text-white/90", style: {
                                            textShadow: `0 0 8px ${node.color}30`,
                                        }, children: node.description }), _jsxs("div", { className: "pt-3 mt-3 border-t border-white/20", children: [_jsx("p", { className: "mb-2 text-xs text-white/70", children: "Key Features:" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [node.features.slice(0, 3).map(feature => (_jsx("div", { className: "px-2 py-1 text-xs rounded-full", style: {
                                                            backgroundColor: `${node.color}20`,
                                                            borderWidth: '1px',
                                                            borderColor: `${node.color}40`,
                                                        }, children: feature.name }, feature.name))), node.features.length > 3 && (_jsxs("div", { className: "px-2 py-1 text-xs rounded-full bg-white/10", children: ["+", node.features.length - 3, " more"] }))] })] }), _jsx("div", { className: "mt-4 text-center", children: _jsxs(motion.div, { className: "inline-block text-xs px-3 py-1.5 rounded-full cursor-pointer", style: {
                                                backgroundColor: `${node.color}30`,
                                                borderWidth: '1px',
                                                borderColor: `${node.color}60`,
                                            }, whileHover: {
                                                scale: 1.05,
                                                backgroundColor: `${node.color}40`,
                                            }, whileTap: {
                                                scale: 0.95,
                                            }, onClick: handleNavigate, children: ["Enter ", node.name, " Universe"] }) })] }), _jsx(motion.div, { className: "absolute w-px origin-bottom left-1/2 -top-8", initial: {
                                    scaleY: 0,
                                }, animate: {
                                    scaleY: 1,
                                }, style: {
                                    background: `linear-gradient(to bottom, ${node.color}00, ${node.color})`,
                                    height: '2rem',
                                } })] }) })) })] }));
};
export default Star;
