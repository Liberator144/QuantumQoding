import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: FeatureScreen.js
 * @version 2.0.0
 */
/**
 * Feature Screen Component
 *
 * This component provides the interface for a specific feature within a star system
 * in the QQ-Verse project.
 *
 * @version 1.0.0
 */
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuantumRouter } from '../../router/useQuantumRouter';
import { starSystems } from '../../router/routes';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
import { StarSystemRoute } from '../../router/StarSystemRoute';
/**
 * Feature screen component
 */
const FeatureScreen = ({ starSystem, feature }) => {
    // Get router and audio
    const { navigate } = useQuantumRouter();
    const audio = useAudio();
    // Find star system and feature data
    const starSystemData = starSystems.find(system => system.name === starSystem);
    const featureData = starSystemData?.features.find(f => f.name === feature);
    // Play feature sound on mount
    useEffect(() => {
        if (featureData) {
            audio.play('feature-enter', { volume: 0.4 });
        }
    }, [featureData?.name, audio]);
    // If star system or feature not found, show error
    if (!starSystemData || !featureData) {
        return (_jsx("div", { className: "flex items-center justify-center w-full h-full bg-gray-900", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-red-500", children: "Feature Not Found" }), _jsx("p", { className: "mt-2 text-gray-300", children: "The feature you're looking for doesn't exist." }), _jsx(Link, { to: "/", className: "inline-block px-4 py-2 mt-4 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700", children: "Return to Quantum Hub" })] }) }));
    }
    return (_jsx(StarSystemRoute, { children: _jsxs("div", { className: "flex flex-col w-full h-full p-6", children: [_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h2", { className: "text-3xl font-extrabold", children: featureData.name }), _jsx("span", { className: "px-2 py-1 text-xs rounded-full", style: { backgroundColor: `${starSystemData.color}30` }, children: starSystemData.name })] }), _jsx("p", { className: "mt-1 text-lg opacity-80", children: featureData.description })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { onClick: () => {
                                            audio.play('click', { volume: 0.3 });
                                            navigate(starSystemData.path);
                                        }, className: "px-4 py-2 text-sm font-medium rounded-md bg-opacity-20 hover:bg-opacity-30", style: { backgroundColor: `${starSystemData.color}30` }, children: ["Back to ", starSystemData.name] }), _jsx(Link, { to: "/", className: "px-4 py-2 text-sm font-medium bg-gray-700 rounded-md hover:bg-gray-600", onClick: () => audio.play('click', { volume: 0.3 }), children: "Return to Hub" })] })] }) }), _jsx("div", { className: "flex-1 p-6 overflow-auto rounded-lg", style: { backgroundColor: `${starSystemData.color}10` }, children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block p-4 mb-4 rounded-full", style: { backgroundColor: `${starSystemData.color}20` }, children: _jsx("svg", { className: "w-16 h-16", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm10.293-4.707a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L10 7.414V12a1 1 0 102 0V7.414l.293.293a1 1 0 001.414-1.414l-2-2z", clipRule: "evenodd" }) }) }), _jsx("h3", { className: "mb-2 text-2xl font-bold", children: "Feature Under Construction" }), _jsx("p", { className: "mb-4 text-lg opacity-80", children: "This feature is currently being developed. Check back soon for updates!" }), _jsx("div", { className: "w-16 h-1 mx-auto mb-4 rounded-full", style: { backgroundColor: starSystemData.color } }), _jsxs("p", { className: "opacity-60", children: ["Feature ID: ", starSystemData.name.toLowerCase(), "-", featureData.name.toLowerCase().replace(/\s+/g, '-')] })] }) }) })] }) }));
};
export default FeatureScreen;
