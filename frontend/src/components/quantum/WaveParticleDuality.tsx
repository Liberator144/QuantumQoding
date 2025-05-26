import { jsx as _jsx } from "react/jsx-runtime";
import QuantumParticleSystem from './QuantumParticleSystem';
import { QuantumEffectType } from '../../../visualization/charts/QuantumParticleRenderer';
/**
 * Wave-Particle Duality Component
 */
const WaveParticleDuality = ({ amplitude = 20, frequency = 0.02, particleCount = 1000, particleSize = 2, particleColor = '#4fc3f7', width = 800, height = 600, enableAnimations = true, enableInteractions = true, theme = 'quantum', onClick, }) => {
    return (_jsx(QuantumParticleSystem, { effectType: QuantumEffectType.WAVE_PARTICLE_DUALITY, waveAmplitude: amplitude, waveFrequency: frequency, particleCount: particleCount, particleSize: particleSize, particleColor: particleColor, width: width, height: height, enableAnimations: enableAnimations, enableInteractions: enableInteractions, theme: theme, onClick: onClick }));
};
export default WaveParticleDuality;
