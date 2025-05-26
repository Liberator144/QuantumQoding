/**
 * TypeScript Migration
 * Migrated from: QuantumSphere.js
 * @version 2.0.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesCore } from '../../components/quantum/SparklesCore';
import { QuantumPortalCore } from '../../core/authentication/QuantumPortalCore';
import Star from './Star';
import StarSystemView from '../../cosmos/orbits/StarSystemView';
import { useTransitionControls } from '../../utils/CoherenceHelpers/useTransitionControls';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
// Protocol-compliant, strictly typed orbitNodes array
const orbitNodes = [
    // Inner Orbit
    {
        name: 'QQ-DataVerse',
        color: '#00ffff',
        angle: 0,
        distance: 200,
        orbit: 'inner',
        rotationSpeed: 100,
        description: 'GitHub integration and data analytics universe. Explore and visualize data across multiple dimensions.',
        style: 'star',
        features: [
            { name: 'Repository Analysis', description: 'Analyze GitHub repositories', orbit: 'inner' },
            { name: 'Data Visualization', description: 'Interactive data visualizations', orbit: 'inner' },
            { name: 'Metrics Dashboard', description: 'Real-time data metrics', orbit: 'middle' },
            { name: 'Code Insights', description: 'AI-powered code analysis', orbit: 'middle' },
            { name: 'Performance Tracking', description: 'Track repository performance', orbit: 'outer' }
        ]
    },
    {
        name: 'QQ-MCPVerse',
        color: '#4169e1',
        angle: 120,
        distance: 200,
        orbit: 'inner',
        rotationSpeed: 100,
        description: 'Model-Context-Protocol management universe. Connect and configure MCP tools and services.',
        style: 'star',
        features: [
            { name: 'Protocol Setup', description: 'Configure MCP protocols', orbit: 'inner' },
            { name: 'Context Manager', description: 'Manage operational contexts', orbit: 'inner' },
            { name: 'Service Integration', description: 'Integrate external services', orbit: 'middle' },
            { name: 'Workflow Builder', description: 'Create automated workflows', orbit: 'middle' },
            { name: 'API Monitoring', description: 'Monitor API performance', orbit: 'outer' }
        ]
    },
    {
        name: 'QQ-Akasha',
        color: '#9370db',
        angle: 210,
        distance: 200,
        orbit: 'inner',
        rotationSpeed: 100,
        description: 'Quantum memory system universe. Store, analyze, and retrieve information across the cosmic consciousness.',
        style: 'star',
        features: [
            { name: 'Memory Bank', description: 'Long-term knowledge storage', orbit: 'inner' },
            { name: 'Consciousness Stream', description: 'Information flow management', orbit: 'inner' },
            { name: 'Recollection Engine', description: 'Advanced retrieval system', orbit: 'middle' },
            { name: 'Knowledge Graph', description: 'Visual relationship mapping', orbit: 'middle' },
            { name: 'Neural Archive', description: 'Neural network optimized storage', orbit: 'outer' }
        ]
    },
    // Middle Orbit
    {
        name: 'QQ-TaskVerse',
        color: '#ff4500',
        angle: 60,
        distance: 300,
        orbit: 'middle',
        rotationSpeed: 150,
        description: 'Task management universe. Organize, track, and optimize your workflows and projects.',
        style: 'star',
        features: [
            { name: 'Task Dashboard', description: 'Overview of all tasks', orbit: 'inner' },
            { name: 'Project Tracker', description: 'Monitor project progress', orbit: 'inner' },
            { name: 'Time Analysis', description: 'Time allocation metrics', orbit: 'middle' },
            { name: 'Collaboration Hub', description: 'Team coordination tools', orbit: 'middle' },
            { name: 'Resource Allocator', description: 'Optimize resource usage', orbit: 'outer' }
        ]
    },
    {
        name: 'QQ-QuantumForge',
        color: '#32cd32',
        angle: 180,
        distance: 300,
        orbit: 'middle',
        rotationSpeed: 150,
        description: 'Development environment universe. Build, test, and deploy your quantum applications.',
        style: 'star',
        features: [
            { name: 'Code Editor', description: 'Advanced code editing', orbit: 'inner' },
            { name: 'Testing Lab', description: 'Automated test environments', orbit: 'inner' },
            { name: 'Deployment Center', description: 'Streamlined deployment', orbit: 'middle' },
            { name: 'Version Control', description: 'Manage code versions', orbit: 'middle' },
            { name: 'AI Assistant', description: 'Intelligent coding help', orbit: 'outer' }
        ]
    },
    {
        name: 'QQ-NexusHub',
        color: '#ffd700',
        angle: 300,
        distance: 300,
        orbit: 'middle',
        rotationSpeed: 150,
        description: 'Integration management universe. Connect and coordinate your tools and services.',
        style: 'star',
        features: [
            { name: 'Service Connector', description: 'Connect external services', orbit: 'inner' },
            { name: 'Data Pipeline', description: 'Manage data flows', orbit: 'inner' },
            { name: 'API Gateway', description: 'Centralized API management', orbit: 'middle' },
            { name: 'Workflow Automator', description: 'Create automated processes', orbit: 'middle' },
            { name: 'System Monitor', description: 'Track system health', orbit: 'outer' }
        ]
    },
    // Outer Orbit
    {
        name: 'QQ-EvolveCore',
        color: '#ff1493',
        angle: 0,
        distance: 400,
        orbit: 'outer',
        rotationSpeed: 200,
        description: 'System evolution engine universe. Adapt, evolve, and optimize your quantum systems.',
        style: 'star',
        features: [
            { name: 'Evolution Dashboard', description: 'Track system evolution', orbit: 'inner' },
            { name: 'Adaptation Engine', description: 'Automated system adaptation', orbit: 'inner' },
            { name: 'Performance Analyzer', description: 'Identify optimization targets', orbit: 'middle' },
            { name: 'Quantum Optimizers', description: 'Advanced optimization tools', orbit: 'middle' },
            { name: 'Predictive Evolution', description: 'AI-based future planning', orbit: 'outer' }
        ]
    },
    {
        name: 'QQ-HarmonyVerse',
        color: '#00fa9a',
        angle: 120,
        distance: 400,
        orbit: 'outer',
        rotationSpeed: 200,
        description: 'Coherence maintenance universe. Ensure harmony and balance across your quantum systems.',
        style: 'star',
        features: [
            { name: 'Coherence Monitor', description: 'Track system coherence', orbit: 'inner' },
            { name: 'Balance Engine', description: 'Maintain system balance', orbit: 'inner' },
            { name: 'Conflict Resolver', description: 'Detect and resolve conflicts', orbit: 'middle' },
            { name: 'Harmony Analytics', description: 'System harmony metrics', orbit: 'middle' },
            { name: 'Pattern Optimizer', description: 'Optimize coherence patterns', orbit: 'outer' }
        ]
    },
    {
        name: 'QQ-UnityPortal',
        color: '#ff8c00',
        angle: 240,
        distance: 400,
        orbit: 'outer',
        rotationSpeed: 200,
        description: 'Community ecosystem universe. Collaborate, share, and engage with the quantum community.',
        style: 'star',
        features: [
            { name: 'Community Hub', description: 'Connect with other users', orbit: 'inner' },
            { name: 'Knowledge Exchange', description: 'Share and discover insights', orbit: 'inner' },
            { name: 'Collaboration Space', description: 'Work together on projects', orbit: 'middle' },
            { name: 'Event Horizon', description: 'Upcoming community events', orbit: 'middle' },
            { name: 'Resource Center', description: 'Learning and development tools', orbit: 'outer' }
        ]
    },
];
// QuantumSphere component with strict protocol-compliant types and best key practices
const QuantumSphere = () => {
    const [scale, setScale] = useState(1);
    const [hoveredStar, setHoveredStar] = useState(null);
    const [currentView, setCurrentView] = useState('hub');
    const [selectedStar, setSelectedStar] = useState(null);
    // Audio system
    const audio = useAudio();
    // Use the transition controls hook
    const { transitionState, enterStarSystem, exitToHub, } = useTransitionControls({
        transitionDuration: 1500,
        onTransitionStart: (state) => {
            // Play transition sounds
            if (state === 'entering') {
                audio.play('wormhole-enter');
                setTimeout(() => audio.play('quantum-surge', { volume: 0.6 }), 300);
            }
            else if (state === 'exiting') {
                audio.play('wormhole-exit');
                setTimeout(() => audio.play('quantum-collapse', { volume: 0.6 }), 300);
            }
        },
        onTransitionComplete: (state) => {
            // Update view after transition completes
            if (state === 'entering') {
                setCurrentView('star-system');
                audio.play('dimensional-shift', { volume: 0.5 });
            }
            else if (state === 'exiting') {
                setCurrentView('hub');
            }
        },
    });
    // Play ambient sound on component mount
    useEffect(() => {
        const ambientSound = audio.playAmbient('space-ambience', { volume: 0.3 });
        return () => {
            ambientSound?.stop();
        };
    }, []);
    // Handle navigation to a star system
    const navigateToStarSystem = (star) => {
        setSelectedStar(star);
        enterStarSystem();
    };
    // Handle return to hub
    const returnToHub = () => {
        exitToHub();
    };
    // Handle star hover with sound effect
    const handleStarHover = (name) => {
        if (name && !hoveredStar) {
            audio.play('hover', { volume: 0.3 });
        }
        setHoveredStar(name);
    };
    return (<div className="relative w-full h-[100vh] overflow-hidden bg-[#050714]">
      <div className="absolute inset-0">
        <SparklesCore id="quantum-sparkles" background="transparent" particleColor="#ffffff" particleDensity={100} speed={1} minSize={0.5} maxSize={1}/>
      </div>
      
      {/* Enhanced Transition Effects */}
      <AnimatePresence>
        {transitionState !== 'none' && (<motion.div className="absolute inset-0 z-50 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            {/* Background blur and darkness */}
            <motion.div className="absolute inset-0 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}/>

            <div className="absolute inset-0 flex items-center justify-center">
              {/* Wormhole outer glow */}
              <motion.div className="absolute rounded-full" initial={{
                width: transitionState === 'entering' ? 0 : '150vmax',
                height: transitionState === 'entering' ? 0 : '150vmax',
                opacity: 0
            }} animate={{
                width: transitionState === 'entering' ? '150vmax' : 0,
                height: transitionState === 'entering' ? '150vmax' : 0,
                opacity: [0, 0.7, 0]
            }} transition={{
                duration: 1.8,
                ease: "easeInOut"
            }}/>
              {/* Main wormhole funnel */}
              <motion.div className="relative flex items-center justify-center" initial={{
                scale: transitionState === 'entering' ? 0.1 : 15,
                opacity: 0,
                rotateZ: 0
            }} animate={{
                scale: transitionState === 'entering' ? 15 : 0.1,
                opacity: [0, 1, 0],
                rotateZ: transitionState === 'entering' ? 720 : -720
            }} transition={{
                duration: 1.5,
                ease: "easeInOut"
            }}>
                {/* Wormhole rings */}
                {[...Array(8)].map((_, i) => (<motion.div key={`ring-${selectedStar?.name ?? 'default'}-${i}`} className="absolute border-2 rounded-full border-opacity-60" style={{
                    width: `${(i + 1) * 40}px`,
                    height: `${(i + 1) * 40}px`,
                    borderColor: selectedStar ? selectedStar.color : '#4fc3f7',
                    opacity: 1 - (i / 10),
                    transform: `rotateX(${75 - i * 5}deg)`,
                }} animate={{
                    rotateZ: 360,
                    scaleX: [1, 1.1, 1],
                    scaleY: [1, 0.9, 1],
                }} transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}/>))}
                
                {/* Wormhole core */}
                <div className="relative w-40 h-40">
                  <motion.div className="absolute inset-0 rounded-full" style={{
                background: selectedStar
                    ? `radial-gradient(circle, ${selectedStar.color} 0%, ${selectedStar.color}80 40%, ${selectedStar.color}30 70%, transparent 100%)`
                    : 'radial-gradient(circle, rgba(79,195,247,1) 0%, rgba(79,195,247,0.8) 40%, rgba(79,195,247,0.3) 70%, transparent 100%)',
                boxShadow: selectedStar
                    ? `0 0 30px ${selectedStar.color}80`
                    : '0 0 30px rgba(79,195,247,0.8)',
            }} animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
            }} transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
            }}/>
                  
                  {/* Energy flares from core */}
                  {[...Array(12)].map((_, i) => (<motion.div key={`flare-${selectedStar?.name ?? 'default'}-${i}`} className="absolute" style={{
                    width: '150%',
                    height: '2px',
                    top: '50%',
                    left: '50%',
                    background: selectedStar
                        ? `linear-gradient(90deg, transparent, ${selectedStar.color}, transparent)`
                        : 'linear-gradient(90deg, transparent, #4fc3f7, transparent)',
                    transform: `translateX(-50%) translateY(-50%) rotate(${i * 30}deg)`,
                    opacity: 0.7,
                }} animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scaleX: [0.8, 1.2, 0.8],
                }} transition={{
                    duration: 3 + i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}/>))}
                </div>
              </motion.div>
              
              {/* Fluid particles - outer to inner */}
              {[...Array(80)].map((_, i) => (<motion.div key={`outerparticle-${i}-${selectedStar?.name ?? 'default'}`} className="absolute rounded-full" style={{
                    width: Math.random() * 5 + 2,
                    height: Math.random() * 5 + 2,
                    backgroundColor: selectedStar
                        ? selectedStar.color
                        : '#4fc3f7',
                    top: '50%',
                    left: '50%',
                    opacity: 0,
                    filter: 'blur(1px)',
                }} animate={transitionState === 'entering' ? {
                    opacity: [0, 0.8, 0],
                    x: [
                        (Math.random() - 0.5) * window.innerWidth * 0.8,
                        0
                    ],
                    y: [
                        (Math.random() - 0.5) * window.innerHeight * 0.8,
                        0
                    ],
                    scale: [1, 0.2]
                } : {
                    opacity: [0, 0.8, 0],
                    x: [
                        0,
                        (Math.random() - 0.5) * window.innerWidth * 0.8
                    ],
                    y: [
                        0,
                        (Math.random() - 0.5) * window.innerHeight * 0.8
                    ],
                    scale: [0.2, 1]
                }} transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    delay: Math.random() * 0.5
                }}/>))}
              
              {/* Enhanced spiral particles with varying opacity, sizes and colors */}
              {[...Array(100)].map((_, i) => {
                const angle = (i / 100) * Math.PI * 15;
                const radius = transitionState === 'entering' ? 400 - (angle * 10) : angle * 10;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const sizeVariation = 0.5 + Math.sin(i * 0.5) * 0.5;
                const size = (7 - (i / 100) * 5) * sizeVariation;
                // Extracted color logic for clarity
                let particleColor;
                if (selectedStar) {
                    switch (i % 3) {
                        case 0:
                            particleColor = selectedStar.color;
                            break;
                        case 1:
                            particleColor = '#ffffff';
                            break;
                        default:
                            particleColor = `#${Math.floor(parseInt(selectedStar.color.slice(1), 16) * 0.7).toString(16).padStart(6, '0')}`;
                            break;
                    }
                }
                else {
                    // Refactored to avoid lonely if
                    if (i % 3 === 0) {
                        particleColor = '#4fc3f7';
                    }
                    else if (i % 3 === 1) {
                        particleColor = '#ffffff';
                    }
                    else {
                        particleColor = '#2196f3';
                    }
                }
                // Use a stable, unique key based on angle and color
                const spiralKey = `spiral-${angle.toFixed(2)}-${particleColor}-${selectedStar?.name ?? 'default'}`;
                return (<motion.div key={spiralKey} className="absolute rounded-full" style={{
                        width: size,
                        height: size,
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        background: particleColor,
                        opacity: 0.7 - (i / 120)
                    }}/>);
            })}
              
              {/* Adding quantum dust particles - small background particles */}
              {[...Array(200)].fill(undefined).map(() => {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 600;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const dustKey = `dust-${angle.toFixed(3)}-${distance.toFixed(1)}-${selectedStar?.name ?? 'default'}`;
                return (<motion.div key={dustKey} className="absolute rounded-full" style={{
                        width: Math.random() * 2 + 0.5,
                        height: Math.random() * 2 + 0.5,
                        backgroundColor: selectedStar
                            ? `${selectedStar.color}90`
                            : '#4fc3f790',
                        top: '50%',
                        left: '50%',
                        transform: `translate(${x}px, ${y}px)`
                    }}/>);
            })}
              
              {/* Energy flare bursts */}
              {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * Math.PI * 2;
                const flareColor = selectedStar ? selectedStar.color : '#4fc3f7';
                const flareKey = `flare-${angle.toFixed(3)}-${flareColor}-${selectedStar?.name ?? 'default'}`;
                return (<motion.div key={flareKey} className="absolute" style={{
                        width: '4px',
                        height: '150px',
                        background: `linear-gradient(to top, transparent, ${flareColor})`,
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${(angle * 180) / Math.PI}deg) translateY(-75px)`
                    }}/>);
            })}
            </div>
            
            {/* Enhanced camera movement effect with more natural motion and rotation */}
            <motion.div className="absolute inset-0 pointer-events-none" initial={{ scale: 1, rotate: 0, x: 0, y: 0 }} animate={transitionState === 'entering'
                ? {
                    scale: [1, 1.1, 1.15, 1.2],
                    rotate: [0, 2, 3, 5],
                    x: [0, 5, 10, 15],
                    y: [0, -5, -8, -12],
                }
                : {
                    scale: [1.2, 1.15, 1.1, 1],
                    rotate: [5, 3, 2, 0],
                    x: [15, 10, 5, 0],
                    y: [-12, -8, -5, 0],
                }} transition={{
                duration: 1.5,
                ease: "easeInOut",
                times: [0, 0.3, 0.6, 1] // Control timing of each keyframe
            }}/>
            
            {/* UI Elements fade effect that occurs during transition */}
            <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{
                opacity: [0, 0.3, 0],
            }} transition={{
                duration: 1.5,
                ease: "easeInOut",
                times: [0, 0.5, 1]
            }} style={{ backgroundColor: "black" }}/>
          </motion.div>)}
      </AnimatePresence>
      
      {/* Enhanced audio for transition effects with multiple layered sounds */}
      {transitionState !== 'none' && (<>
          <audio src={`/audio/${transitionState === 'entering' ? 'wormhole-enter.mp3' : 'wormhole-exit.mp3'}`} autoPlay>
            <track kind="captions"/>
          </audio>
          <audio src={`/audio/${transitionState === 'entering' ? 'quantum-surge.mp3' : 'quantum-collapse.mp3'}`} autoPlay>
            <track kind="captions"/>
          </audio>
          <audio src="/audio/space-ambience.mp3" autoPlay loop>
            <track kind="captions"/>
          </audio>
        </>)}
      
      {/* Hub View */}
      {currentView === 'hub' && (<motion.div className="relative w-full h-full" style={{
                scale,
            }} drag dragConstraints={{
                left: -1000,
                right: 1000,
                top: -1000,
                bottom: 1000,
            }} whileDrag={{
                cursor: 'grabbing',
            }} dragElastic={0.1} onWheel={(e) => {
                const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.001), 2);
                setScale(newScale);
            }}>
          {/* Enhanced Orbital Paths */}
          {['inner', 'middle', 'outer'].map((orbit, i) => (<div key={orbit} className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <div className="rounded-full border border-[#1a2040]/30 relative" style={{
                    width: `${(i + 1) * 400}px`,
                    height: `${(i + 1) * 400}px`,
                }}>
                {/* Orbital Trail Effect */}
                <div className="absolute inset-0 rounded-full" style={{
                    background: `linear-gradient(90deg, transparent, ${i === 0 ? '#00ffff' : i === 1 ? '#ff4500' : '#ff8c00'}05)`,
                    animation: `spin ${(i + 1) * 100}s linear infinite`,
                }}/>
              </div>
            </div>))}
          
          {/* Enhanced Quantum Core */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <div className="relative w-[400px] h-[400px]">
              {/* Base quantum star sphere */}
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-[0_0_100px_rgba(147,51,234,0.3)]">
                {/* Core gradient and pulsing effect */}
                <div className="absolute inset-0 bg-gradient-radial from-[#2d1b4e] via-[#6e3bc4] to-[#b83280] animate-pulse">
                  {/* Quantum latticework base */}
                  <div className="absolute inset-0 opacity-30">
                    {[...Array(12)].map((_, i) => {
                const latticeKey = `lattice-${i * 30}`;
                return (<div key={latticeKey} className="absolute w-full h-full" style={{
                        background: `linear-gradient(${i * 30}deg, transparent 47%, rgba(147, 51, 234, 0.4) 49%, transparent 51%)`,
                        transform: `rotate(${i * 30}deg)`,
                        animation: `quantumPulse ${3 + i * 0.5}s infinite ease-in-out`,
                    }}/>);
            })}
                  </div>
                  {/* Ethereal flames corona */}
                  {[...Array(24)].map((_, i) => {
                const flameKey = `flame-${i * 15}`;
                return (<motion.div key={flameKey} className="absolute top-1/2 left-1/2 w-full h-[2px] origin-left" style={{
                        background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.6), transparent)',
                        transform: `rotate(${i * 15}deg)`,
                    }} animate={{
                        scaleX: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }} transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}/>);
            })}
                  {/* Dynamic data bursts */}
                  {[...Array(30)].map((_, i) => (<motion.div key={`databurst-${i}`} className="absolute rounded-full bg-cyan-400" style={{
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    left: '50%',
                    top: '50%',
                }} animate={{
                    x: [0, (Math.random() - 0.5) * 300],
                    y: [0, (Math.random() - 0.5) * 300],
                    opacity: [1, 0],
                    scale: [1, 0],
                }} transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: Math.random() * 2,
                }}/>))}
                  {/* Code-like streams */}
                  {[...Array(8)].map((_, i) => {
                const streamKey = `stream-${i * 45}`;
                return (<motion.div key={streamKey} className="absolute top-1/2 left-1/2 h-full w-[1px] origin-center" style={{
                        background: 'linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.8), transparent)',
                        transform: `rotate(${i * 45}deg)`,
                    }} animate={{
                        scaleY: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }} transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: Math.random() * 2,
                    }}/>);
            })}
                </div>
              </div>
              {/* Quantum Portal Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <QuantumPortalCore isLoggedIn={false} userName="" onLogin={(username, password) => {
                console.log('Login attempt:', username, password);
            }}/>
              </div>
              {/* Outer glow corona */}
              <div className="absolute inset-[-25%] rounded-full">
                <div className="w-full h-full opacity-30" style={{
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
                filter: 'blur(50px)',
            }}/>
              </div>
            </div>
          </div>
          
          {/* Stars */}
          {orbitNodes.map((node) => (<Star key={`star-${node.name}`} node={node} isHovered={hoveredStar === node.name} onHover={handleStarHover} onNavigate={navigateToStarSystem}/>))}
        </motion.div>)}
      
      {/* Star System View */}
      {currentView === 'star-system' && selectedStar && (<StarSystemView star={selectedStar} onReturnToHub={returnToHub}/>)}
      
      {/* Zoom Controls */}
      <div className="absolute flex gap-2 bottom-4 right-4">
        <button onClick={() => setScale(Math.min(scale + 0.1, 2))} className="p-2 text-white rounded-full bg-white/10 hover:bg-white/20">
          +
        </button>
        <button onClick={() => setScale(Math.max(scale - 0.1, 0.5))} className="p-2 text-white rounded-full bg-white/10 hover:bg-white/20">
          -
        </button>
      </div>
    </div>);
};
export default QuantumSphere;
