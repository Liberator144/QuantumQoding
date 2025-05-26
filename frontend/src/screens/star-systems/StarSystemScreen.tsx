/**
 * TypeScript Migration
 * Migrated from: StarSystemScreen.js
 * @version 2.0.0
 */
/**
 * Star System Screen Component
 *
 * This component provides the main interface for a star system in the QQ-Verse project,
 * displaying the star system's features and information.
 *
 * @version 1.0.0
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuantumRouter } from '../../router/useQuantumRouter';
import { starSystems } from '../../router/routes';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
import { StarSystemRoute } from '../../router/StarSystemRoute';
/**
 * Star system screen component
 */
const StarSystemScreen = ({ starSystem }) => {
    // Get router and audio
    const { navigateToFeature } = useQuantumRouter();
    const audio = useAudio();
    // Find star system data
    const starSystemData = starSystems.find(system => system.name === starSystem);
    // Play star system sound on mount
    useEffect(() => {
        if (starSystemData) {
            audio.play('star-enter', { volume: 0.5 });
        }
    }, [starSystemData?.name, audio]);
    // Handle feature selection
    const handleFeatureSelect = (featurePath) => {
        if (!starSystemData)
            return;
        audio.play('feature-select', { volume: 0.3 });
        navigateToFeature(starSystemData.name, featurePath);
    };
    // If star system not found, show error
    if (!starSystemData) {
        return (<div className="flex items-center justify-center w-full h-full bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Star System Not Found</h2>
          <p className="mt-2 text-gray-300">The star system you're looking for doesn't exist.</p>
          <Link to="/" className="inline-block px-4 py-2 mt-4 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Return to Quantum Hub
          </Link>
        </div>
      </div>);
    }
    return (<StarSystemRoute>
      <div className="flex flex-col w-full h-full p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold">
                {starSystemData.name}
              </h2>
              <p className="mt-1 text-lg opacity-80">
                {starSystemData.description}
              </p>
            </div>
            
            <Link to="/" className="px-4 py-2 text-sm font-medium rounded-md bg-opacity-20 hover:bg-opacity-30" style={{ backgroundColor: `${starSystemData.color}30` }} onClick={() => audio.play('click', { volume: 0.3 })}>
              Return to Hub
            </Link>
          </div>
        </div>
        
        {/* Features grid */}
        <div className="grid flex-1 grid-cols-3 gap-6">
          {starSystemData.features.map(feature => (<motion.div key={feature.path} className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer" style={{ backgroundColor: `${starSystemData.color}15` }} whileHover={{
                scale: 1.03,
                backgroundColor: `${starSystemData.color}25`,
            }} onClick={() => handleFeatureSelect(feature.path)}>
              {/* Feature content */}
              <div className="p-6">
                <h3 className="text-xl font-bold">{feature.name}</h3>
                <p className="mt-2 opacity-80">{feature.description}</p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute bottom-0 right-0 w-16 h-16 rounded-tl-full opacity-20" style={{ backgroundColor: starSystemData.color }}/>
              
              <div className="absolute top-0 left-0 w-4 h-4 rounded-br-full opacity-30" style={{ backgroundColor: starSystemData.color }}/>
            </motion.div>))}
        </div>
      </div>
    </StarSystemRoute>);
};
export default StarSystemScreen;
