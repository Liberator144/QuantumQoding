/**
 * Hub Screen Component
 * 
 * This component serves as the main navigation hub for the QQ-Verse project,
 * providing access to all star systems and features.
 * 
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { QuantumSphere } from '../../cosmos/central-star/QuantumSphere';
import { useQuantumRouter } from '../../router/useQuantumRouter';
import { starSystems } from '../../router/routes';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';

/**
 * Hub screen component
 */
const HubScreen: React.FC = () => {
  // Get router and audio
  const { navigateToStarSystem } = useQuantumRouter();
  const audio = useAudio();
  
  // Handle star system selection
  const handleStarSystemSelect = (starSystemName: string) => {
    audio.play('star-select', { volume: 0.5 });
    navigateToStarSystem(starSystemName);
  };
  
  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden bg-black">
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>
      
      {/* Quantum sphere */}
      <div className="relative z-10 w-full h-full">
        <QuantumSphere 
          starSystems={starSystems}
          onStarSystemSelect={handleStarSystemSelect}
        />
      </div>
      
      {/* Hub title */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 p-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white">QQ-Verse Hub</h1>
        <p className="mt-2 text-lg text-blue-300">Navigate the Quantum Universe</p>
      </motion.div>
    </div>
  );
};

export default HubScreen;