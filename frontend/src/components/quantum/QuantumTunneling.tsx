import { jsx as _jsx } from "react/jsx-runtime";
import QuantumParticleSystem from './QuantumParticleSystem';
import { QuantumEffectType } from '../../../visualization/charts/QuantumParticleRenderer';
/**
 * Quantum Tunneling Component
 */
const QuantumTunneling = ({ tunnelingProbability = 0.3, particleCount = 1000, particleSize = 2, particleColor = '#00e5ff', width = 800, height = 600, enableAnimations = true, enableInteractions = true, theme = 'quantum', onClick, }) => {
    return (_jsx(QuantumParticleSystem, { effectType: QuantumEffectType.QUANTUM_TUNNELING, tunnelingProbability: tunnelingProbability, particleCount: particleCount, particleSize: particleSize, particleColor: particleColor, width: width, height: height, enableAnimations: enableAnimations, enableInteractions: enableInteractions, theme: theme, onClick: onClick }));
};
export default QuantumTunneling;
