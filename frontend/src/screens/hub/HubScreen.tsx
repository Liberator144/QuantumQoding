import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import QuantumSphere from '../../cosmos/central-star/QuantumSphere';
import { useQuantumRouter } from '../../router/useQuantumRouter';
import { starSystems } from '../../router/routes';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
/**
 * Hub screen component
 * @returns {JSX.Element} The hub screen component
 */
const HubScreen = () => {
    // Get router and audio
    const { navigateToStarSystem } = useQuantumRouter();
    const audio = useAudio();
    // Handle star system selection
    const handleStarSystemSelect = (starSystemName) => {
        audio.play('star-select', { volume: 0.5 });
        navigateToStarSystem(starSystemName);
    };
    return (_jsxs("div", { className: "relative flex items-center justify-center w-full h-full overflow-hidden bg-black", children: [_jsx("div", { className: "absolute inset-0 pointer-events-none", children: Array.from({ length: 100 }, (_, i) => (_jsx(motion.div, { className: "absolute rounded-full bg-white", style: {
                        width: `${Math.random() * 2 + 1}px`,
                        height: `${Math.random() * 2 + 1}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.7 + 0.3,
                    }, animate: {
                        opacity: [0.3, 1, 0.3],
                    }, transition: {
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    } }, `star-${i}`))) }), _jsx("div", { className: "relative z-10 w-full h-full", children: _jsx(QuantumSphere, { starSystems: starSystems, onStarSystemSelect: handleStarSystemSelect }) }), _jsxs(motion.div, { className: "absolute top-0 left-0 right-0 z-20 p-6 text-center", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5, duration: 0.5 }, children: [_jsx("h1", { className: "text-4xl font-bold text-white", children: "QQ-Verse Hub" }), _jsx("p", { className: "mt-2 text-lg text-blue-300", children: "Navigate the Quantum Universe" })] })] }));
};
export default HubScreen;
