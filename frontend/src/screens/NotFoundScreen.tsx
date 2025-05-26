import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: NotFoundScreen.js
 * @version 2.0.0
 */
/**
 * Not Found Screen Component
 *
 * This component provides the 404 page for the QQ-Verse project,
 * displayed when a user navigates to a non-existent route.
 *
 * @version 1.0.0
 */
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAudio } from '../utils/CoherenceHelpers/useAudio';
/**
 * Not found screen component
 */
const NotFoundScreen = () => {
    // Get audio
    const audio = useAudio();
    // Play error sound on mount
    useEffect(() => {
        audio.play('error', { volume: 0.5 });
    }, [audio]);
    return (_jsx("div", { className: "flex items-center justify-center w-full h-full bg-gray-900", children: _jsxs(motion.div, { className: "w-full max-w-md p-8 text-center", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx(motion.div, { className: "mb-8 text-9xl font-bold text-red-500", animate: {
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                    }, transition: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }, children: "404" }), _jsx("h2", { className: "mb-4 text-3xl font-extrabold text-white", children: "Dimensional Void Detected" }), _jsx("p", { className: "mb-8 text-lg text-gray-300", children: "The quantum realm you're looking for doesn't exist or has collapsed into a singularity." }), _jsxs("div", { className: "space-y-4", children: [_jsx(Link, { to: "/", className: "inline-block w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: "Return to Quantum Hub" }), _jsx(Link, { to: "/help", className: "inline-block w-full px-4 py-2 font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500", children: "Seek Quantum Guidance" })] }), _jsx("div", { className: "absolute inset-0 pointer-events-none", children: [...Array(20)].map((_, i) => (_jsx(motion.div, { className: "absolute rounded-full bg-red-500", style: {
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }, animate: {
                            y: [0, Math.random() * -100 - 50],
                            x: [0, (Math.random() - 0.5) * 100],
                            opacity: [1, 0],
                        }, transition: {
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            repeatType: 'loop',
                        } }, `particle-${i}`))) })] }) }));
};
export default NotFoundScreen;
