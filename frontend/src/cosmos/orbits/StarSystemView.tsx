import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: StarSystemView.js
 * @version 2.0.0
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeaturePlanet from '../planets/FeaturePlanet.tsx';
import { SparklesCore } from '../../components/quantum/SparklesCore';
export const StarSystemView = ({ star, onReturnToHub }) => {
    const [hoveredPlanet, setHoveredPlanet] = useState(null);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [showFeatureDetails, setShowFeatureDetails] = useState(false);
    const starRef = useRef(null);
    const [starPosition, setStarPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        if (starRef.current) {
            const rect = starRef.current.getBoundingClientRect();
            setStarPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            });
        }
    }, []);
    // Set selected planet and show details modal
    const handlePlanetClick = (planetName) => {
        setSelectedPlanet(planetName);
        setShowFeatureDetails(true);
    };
    // Close details modal
    const closeFeatureDetails = () => {
        setShowFeatureDetails(false);
        setTimeout(() => setSelectedPlanet(null), 300); // Wait for animation to complete
    };
    // Find the selected feature data
    const selectedFeature = star.features.find(feature => feature.name === selectedPlanet);
    // Generate orbits for planets based on their type
    const getOrbits = () => {
        const orbits = {
            inner: [],
            middle: [],
            outer: []
        };
        star.features.forEach(feature => {
            if (feature.orbit === 'inner' || feature.orbit === 'middle' || feature.orbit === 'outer') {
                orbits[feature.orbit].push(feature);
            }
        });
        return orbits;
    };
    const orbits = getOrbits();
    // Generate planet angles evenly around orbits
    const distributeFeatures = (features, orbitRadius) => {
        return features.map((feature, index) => {
            const angle = (360 / features.length) * index;
            const color = deriveColorFromStar(star.color, index, features.length);
            // Generate a planet style based on the feature
            const getPlanetStyle = () => {
                const styles = ['rocky', 'gas', 'ice', 'oceanic', 'lava'];
                return styles[index % styles.length];
            };
            return {
                ...feature,
                angle,
                distance: orbitRadius,
                rotationSpeed: 120 + (Math.random() * 60),
                color,
                style: getPlanetStyle(),
            };
        });
    };
    // Derive planet colors from star color
    const deriveColorFromStar = (starColor, index, totalPlanets) => {
        // Extract the RGB components from the star color
        const r = parseInt(starColor.slice(1, 3), 16);
        const g = parseInt(starColor.slice(3, 5), 16);
        const b = parseInt(starColor.slice(5, 7), 16);
        // Create variation based on position
        const hueShift = (360 / totalPlanets) * index;
        // Convert to HSL
        let hsl = rgbToHsl(r, g, b);
        // Modify the hue
        if (hsl[0] !== undefined) {
            hsl[0] = (hsl[0] + hueShift) % 360;
        }
        // Convert back to RGB
        const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
        // Convert to hex
        return `#${(1 << 24 | rgb[0] << 16 | rgb[1] << 8 | rgb[2]).toString(16).slice(1)}`;
    };
    // Helper: RGB to HSL conversion
    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0; // achromatic
        }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            if (h !== undefined) {
                h /= 6;
            }
        }
        return [h !== undefined ? h * 360 : 0, s, l];
    };
    // Helper: HSL to RGB conversion
    const hslToRgb = (h, s, l) => {
        h /= 360;
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            const hue2rgb = (p, q, t) => {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };
    // Distribute planets on different orbital paths
    const innerPlanets = distributeFeatures(orbits.inner, 150);
    const middlePlanets = distributeFeatures(orbits.middle, 250);
    const outerPlanets = distributeFeatures(orbits.outer, 350);
    // All planets in one array
    const allPlanets = [...innerPlanets, ...middlePlanets, ...outerPlanets];
    return (_jsxs("div", { className: "relative w-full h-full bg-[#050714] overflow-hidden", children: [_jsx("div", { className: "absolute inset-0", children: _jsx(SparklesCore, { id: "star-system-sparkles", background: "transparent", particleColor: star.color, particleDensity: 80, speed: 0.8, minSize: 0.5, maxSize: 1 }) }), _jsxs(motion.button, { className: "absolute top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 rounded-full", style: {
                    backgroundColor: `${star.color}20`,
                    borderWidth: '1px',
                    borderColor: `${star.color}60`,
                }, whileHover: {
                    scale: 1.05,
                    backgroundColor: `${star.color}30`,
                }, whileTap: { scale: 0.95 }, onClick: onReturnToHub, children: [_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "transform rotate-180", style: { color: star.color }, children: [_jsx("path", { d: "M5 12h14" }), _jsx("path", { d: "m12 5 7 7-7 7" })] }), _jsx("span", { className: "text-sm font-medium", style: { color: star.color }, children: "Return to Hub" })] }), _jsxs(motion.div, { className: "absolute top-4 left-1/2 transform -translate-x-1/2 z-40", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: [_jsxs("h2", { className: "text-2xl font-light text-center", style: {
                            color: star.color,
                            textShadow: `0 0 10px ${star.color}80`
                        }, children: [star.name, " Universe"] }), _jsx("p", { className: "text-sm text-center mt-1 max-w-md", style: { color: `${star.color}CC` }, children: star.description })] }), _jsx("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30", children: _jsx(motion.div, { ref: starRef, className: "relative", initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.8 }, children: _jsxs("div", { className: "relative w-32 h-32", children: [_jsx("div", { className: "absolute inset-0 rounded-full overflow-hidden", style: {
                                    boxShadow: `0 0 40px ${star.color}80, inset 0 0 30px ${star.color}`,
                                }, children: _jsx("div", { className: "absolute inset-0", style: {
                                        background: `radial-gradient(circle, ${star.color} 0%, ${star.color}90 40%, ${star.color}30 70%, transparent 100%)`,
                                    }, children: _jsx("div", { className: "absolute inset-0 mix-blend-overlay", children: [...Array(10)].map((_, i) => (_jsx("div", { className: "absolute rounded-full", style: {
                                                width: `${Math.random() * 60 + 40}%`,
                                                height: `${Math.random() * 60 + 40}%`,
                                                left: `${Math.random() * 40}%`,
                                                top: `${Math.random() * 40}%`,
                                                background: `radial-gradient(circle, ${star.color}80 0%, transparent 70%)`,
                                                animation: `pulse ${2 + Math.random() * 3}s infinite ease-in-out`,
                                            } }, i))) }) }) }), [...Array(8)].map((_, i) => (_jsx("div", { className: "absolute", style: {
                                    width: '150%',
                                    height: '4px',
                                    top: '50%',
                                    left: '50%',
                                    background: `linear-gradient(90deg, transparent, ${star.color}, transparent)`,
                                    transform: `translateX(-50%) translateY(-50%) rotate(${i * 22.5}deg)`,
                                    animation: `flare ${3 + i * 0.5}s infinite ease-in-out`,
                                    opacity: 0.7,
                                    filter: 'blur(2px)',
                                } }, i))), [...Array(20)].map((_, i) => (_jsx(motion.div, { className: "absolute rounded-full", style: {
                                    width: Math.random() * 4 + 2,
                                    height: Math.random() * 4 + 2,
                                    backgroundColor: star.color,
                                    left: '50%',
                                    top: '50%',
                                    filter: 'blur(2px)',
                                }, animate: {
                                    x: [0, (Math.random() - 0.5) * 40],
                                    y: [0, (Math.random() - 0.5) * 40],
                                    opacity: [1, 0],
                                }, transition: {
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    ease: 'easeOut',
                                    delay: Math.random() * 2,
                                } }, i))), _jsx("div", { className: "absolute inset-[-100%] rounded-full", style: {
                                    background: `radial-gradient(circle, ${star.color}40 0%, ${star.color}10 30%, transparent 70%)`,
                                    filter: 'blur(20px)',
                                } })] }) }) }), [150, 250, 350].map((radius, i) => (_jsx(motion.div, { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10", initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 0.7, scale: 1 }, transition: { delay: 0.2 + i * 0.1 }, children: _jsx("div", { className: "rounded-full border border-dashed", style: {
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                        borderColor: `${star.color}40`,
                    }, children: _jsx("div", { className: "absolute inset-0 rounded-full", style: {
                            background: `conic-gradient(${star.color}30, transparent)`,
                            animation: `spin ${100 + i * 20}s linear infinite`,
                            opacity: 0.3,
                        } }) }) }, `orbit-${i}`))), _jsx(motion.div, { className: "absolute inset-0 z-20", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.5, duration: 0.5 }, children: allPlanets.map((planet) => (_jsx(FeaturePlanet, { node: planet, starColor: star.color, isHovered: hoveredPlanet === planet.name, onHover: setHoveredPlanet, onClick: handlePlanetClick, connectionPoint: starPosition }, planet.name))) }), _jsx(AnimatePresence, { children: showFeatureDetails && selectedFeature && (_jsxs(motion.div, { className: "fixed inset-0 z-50 flex items-center justify-center p-4", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [_jsx(motion.div, { className: "absolute inset-0 backdrop-blur-sm", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: closeFeatureDetails, style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }), _jsxs(motion.div, { className: "relative z-10 bg-[#0d0d1f] max-w-lg w-full rounded-lg overflow-hidden shadow-2xl", style: {
                                borderWidth: '1px',
                                borderColor: `${star.color}40`,
                                boxShadow: `0 0 30px ${star.color}30`
                            }, initial: { scale: 0.9, y: 20 }, animate: { scale: 1, y: 0 }, exit: { scale: 0.9, y: 20 }, children: [_jsx("div", { className: "h-2", style: { backgroundColor: star.color } }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-xl font-medium", style: {
                                                        color: star.color,
                                                        textShadow: `0 0 8px ${star.color}60`
                                                    }, children: selectedFeature.name }), _jsx("button", { className: "w-8 h-8 rounded-full flex items-center justify-center", style: {
                                                        backgroundColor: `${star.color}20`,
                                                        color: star.color
                                                    }, onClick: closeFeatureDetails, children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M18 6L6 18" }), _jsx("path", { d: "M6 6l12 12" })] }) })] }), _jsx("p", { className: "text-white/80 mb-6 leading-relaxed", children: selectedFeature.description }), _jsxs("div", { className: "rounded-lg p-4 mb-6", style: {
                                                backgroundColor: `${star.color}15`,
                                                borderWidth: '1px',
                                                borderColor: `${star.color}30`
                                            }, children: [_jsx("h4", { className: "text-sm font-medium mb-2", style: { color: star.color }, children: "Suggested Interactions" }), _jsxs("ul", { className: "space-y-2", children: [_jsxs("li", { className: "flex items-center text-sm text-white/70", children: [_jsx("span", { className: "mr-2 text-[${star.color}]", children: "\u25CF" }), "Explore data visualization techniques"] }), _jsxs("li", { className: "flex items-center text-sm text-white/70", children: [_jsx("span", { className: "mr-2 text-[${star.color}]", children: "\u25CF" }), "Analyze performance metrics in real-time"] }), _jsxs("li", { className: "flex items-center text-sm text-white/70", children: [_jsx("span", { className: "mr-2 text-[${star.color}]", children: "\u25CF" }), "Connect with external data sources"] })] })] }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx(motion.button, { className: "px-4 py-2 rounded-lg text-sm", style: {
                                                        backgroundColor: 'transparent',
                                                        borderWidth: '1px',
                                                        borderColor: `${star.color}60`,
                                                        color: star.color
                                                    }, whileHover: {
                                                        backgroundColor: `${star.color}20`,
                                                    }, whileTap: { scale: 0.95 }, children: "Learn More" }), _jsx(motion.button, { className: "px-4 py-2 rounded-lg text-sm text-white", style: { backgroundColor: star.color }, whileHover: {
                                                        filter: 'brightness(1.1)',
                                                    }, whileTap: { scale: 0.95 }, children: "Activate Feature" })] })] }), _jsx("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: [...Array(30)].map((_, i) => (_jsx(motion.div, { className: "absolute rounded-full", style: {
                                            width: Math.random() * 4 + 2,
                                            height: Math.random() * 4 + 2,
                                            backgroundColor: star.color,
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            opacity: 0.3,
                                        }, animate: {
                                            x: [0, (Math.random() - 0.5) * 30],
                                            y: [0, (Math.random() - 0.5) * 30],
                                            opacity: [0.3, 0.1, 0.3],
                                        }, transition: {
                                            duration: 3 + Math.random() * 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        } }, i))) })] })] })) }), _jsx("div", { className: "absolute inset-0 z-15 pointer-events-none", children: _jsx("svg", { className: "w-full h-full", children: hoveredPlanet && allPlanets.filter(p => p.name === hoveredPlanet).map(planet => (allPlanets
                        .filter(p => p.name !== planet.name && p.orbit === planet.orbit)
                        .map((relatedPlanet, i) => (_jsxs("g", { children: [_jsx(motion.line, { x1: `calc(50% + ${Math.cos((planet.angle * Math.PI) / 180) * planet.distance}px)`, y1: `calc(50% + ${Math.sin((planet.angle * Math.PI) / 180) * planet.distance}px)`, x2: `calc(50% + ${Math.cos((relatedPlanet.angle * Math.PI) / 180) * relatedPlanet.distance}px)`, y2: `calc(50% + ${Math.sin((relatedPlanet.angle * Math.PI) / 180) * relatedPlanet.distance}px)`, stroke: planet.color, strokeWidth: "1", strokeDasharray: "3,3", initial: { opacity: 0 }, animate: { opacity: 0.6 }, exit: { opacity: 0 } }), _jsx(motion.circle, { r: "1.5", fill: planet.color, filter: "blur(1px)", animate: {
                                    offsetDistance: ['0%', '100%'],
                                }, transition: {
                                    duration: 2,
                                    delay: i * 0.2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }, style: {
                                    offsetPath: `path("M calc(50% + ${Math.cos((planet.angle * Math.PI) / 180) * planet.distance}px) calc(50% + ${Math.sin((planet.angle * Math.PI) / 180) * planet.distance}px) L calc(50% + ${Math.cos((relatedPlanet.angle * Math.PI) / 180) * relatedPlanet.distance}px) calc(50% + ${Math.sin((relatedPlanet.angle * Math.PI) / 180) * relatedPlanet.distance}px)")`,
                                } })] }, `connection-${planet.name}-${relatedPlanet.name}`))))) }) })] }));
};
export default StarSystemView;
