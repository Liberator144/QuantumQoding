import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: StarSystemRoute.js
 * @version 2.0.0
 */
/**
 * Star System Route Component
 *
 * This component provides specialized routing for star systems,
 * maintaining quantum coherence during navigation between stars.
 *
 * @version 1.0.0
 */
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAudio } from '../utils/CoherenceHelpers/useAudio';
import { starSystems } from './routes';
/**
 * Star system route component
 */
export const StarSystemRoute = ({ children }) => {
    // Get location and audio
    const location = useLocation();
    const audio = useAudio();
    // Find current star system
    const currentPath = location.pathname;
    const currentStarSystem = starSystems.find(system => currentPath.startsWith(system.path));
    // Play star system sound on mount
    React.useEffect(() => {
        if (currentStarSystem) {
            audio.play('star-select', { volume: 0.5 });
        }
    }, [currentStarSystem?.name, audio]);
    // Apply star system specific styles
    const starSystemStyles = currentStarSystem ? {
        backgroundColor: `${currentStarSystem.color}10`,
        borderColor: currentStarSystem.color,
        color: currentStarSystem.color,
    } : {};
    return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.5 }, className: "relative w-full h-full overflow-hidden rounded-lg", style: starSystemStyles, children: [currentStarSystem && (_jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute inset-0 opacity-20", style: {
                            background: `radial-gradient(circle at center, ${currentStarSystem.color}40 0%, transparent 70%)`,
                            filter: 'blur(40px)'
                        } }), [...Array(3)].map((_, i) => (_jsx("div", { className: "absolute rounded-full border opacity-10", style: {
                            width: `${(i + 1) * 50}%`,
                            height: `${(i + 1) * 50}%`,
                            top: `${50 - (i + 1) * 25}%`,
                            left: `${50 - (i + 1) * 25}%`,
                            borderColor: currentStarSystem.color,
                            animation: `spin ${(i + 1) * 60}s linear infinite`,
                        } }, `orbital-${i}`)))] })), _jsx("div", { className: "relative z-10 w-full h-full", children: children })] }));
};
export default StarSystemRoute;
