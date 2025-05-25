/**
 * Quantum Entanglement Component
 *
 * This component renders a quantum entanglement effect using the QuantumParticleSystem.
 *
 * @version 1.0.0
 */

import React from 'react';
import QuantumParticleSystem from './QuantumParticleSystem';
import { QuantumEffectType } from '../../../visualization/charts/QuantumParticleRenderer';

interface QuantumEntanglementProps {
  /** Entanglement strength */
  entanglementStrength?: number;
  
  /** Particle count */
  particleCount?: number;
  
  /** Particle size */
  particleSize?: number;
  
  /** Particle color */
  particleColor?: string;
  
  /** Container width */
  width?: number;
  
  /** Container height */
  height?: number;
  
  /** Whether to enable animations */
  enableAnimations?: boolean;
  
  /** Whether to enable interactions */
  enableInteractions?: boolean;
  
  /** Theme */
  theme?: 'dark' | 'light' | 'quantum' | 'nebula';
  
  /** Click handler */
  onClick?: () => void;
}

/**
 * Quantum Entanglement Component
 */
const QuantumEntanglement: React.FC<QuantumEntanglementProps> = ({
  entanglementStrength = 0.8,
  particleCount = 1000,
  particleSize = 2,
  particleColor = '#ff4081',
  width = 800,
  height = 600,
  enableAnimations = true,
  enableInteractions = true,
  theme = 'quantum',
  onClick,
}) => {
  return (
    <QuantumParticleSystem
      effectType={QuantumEffectType.QUANTUM_ENTANGLEMENT}
      entanglementStrength={entanglementStrength}
      particleCount={particleCount}
      particleSize={particleSize}
      particleColor={particleColor}
      width={width}
      height={height}
      enableAnimations={enableAnimations}
      enableInteractions={enableInteractions}
      theme={theme}
      onClick={onClick}
    />
  );
};

export default QuantumEntanglement;