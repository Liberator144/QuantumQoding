/**
 * Black Hole Portal Core Component - Phase 2 Implementation
 * 
 * Revolutionary black hole authentication portal with advanced gravitational effects,
 * particle systems, and immersive wormhole transitions.
 * 
 * @version 1.0.0
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Types
interface BlackHolePortalProps {
    isLoggedIn: boolean;
    userName: string;
    onLogin: (provider: 'google' | 'github' | 'supabase') => void;
    onShowAuthModal: () => void;
    size?: number;
    intensity?: number;
}

interface ParticleSystemProps {
    count: number;
    radius: number;
    blackHoleStrength: number;
}

// Particle System Component for Three.js
const GravitationalParticles: React.FC<ParticleSystemProps> = ({ 
    count, 
    radius, 
    blackHoleStrength 
}) => {
    const mesh = useRef<THREE.Points>(null);
    const { viewport } = useThree();
    
    // Generate particle positions
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Random spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radius * (0.5 + Math.random() * 0.5);
            
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);
            
            // Initial velocities for orbital motion
            velocities[i3] = Math.random() * 0.01 - 0.005;
            velocities[i3 + 1] = Math.random() * 0.01 - 0.005;
            velocities[i3 + 2] = Math.random() * 0.01 - 0.005;
            
            // Color based on distance from center
            const distance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2);
            const normalizedDistance = distance / radius;
            
            colors[i3] = 1 - normalizedDistance * 0.5; // Red
            colors[i3 + 1] = 0.5 + normalizedDistance * 0.3; // Green
            colors[i3 + 2] = 1; // Blue
        }
        
        return { positions, velocities, colors };
    }, [count, radius]);
    
    // Animation loop
    useFrame((state, delta) => {
        if (!mesh.current) return;
        
        const positions = mesh.current.geometry.attributes.position.array as Float32Array;
        const colors = mesh.current.geometry.attributes.color.array as Float32Array;
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Current position
            const x = positions[i3];
            const y = positions[i3 + 1];
            const z = positions[i3 + 2];
            
            // Distance from black hole center
            const distance = Math.sqrt(x * x + y * y + z * z);
            
            // Gravitational force (simplified)
            const force = blackHoleStrength / (distance * distance + 0.1);
            
            // Apply gravitational pull toward center
            const forceX = -x * force * delta;
            const forceY = -y * force * delta;
            const forceZ = -z * force * delta;
            
            // Add orbital motion
            const orbitalSpeed = 0.5;
            const orbitalX = -y * orbitalSpeed * delta;
            const orbitalY = x * orbitalSpeed * delta;
            
            // Update positions
            positions[i3] += forceX + orbitalX;
            positions[i3 + 1] += forceY + orbitalY;
            positions[i3 + 2] += forceZ;
            
            // Reset particles that get too close to event horizon
            if (distance < 0.5) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = radius * (0.8 + Math.random() * 0.2);
                
                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = r * Math.cos(phi);
            }
            
            // Update colors based on distance
            const normalizedDistance = distance / radius;
            colors[i3] = 1 - normalizedDistance * 0.5;
            colors[i3 + 1] = 0.5 + normalizedDistance * 0.3;
            colors[i3 + 2] = 1;
        }
        
        mesh.current.geometry.attributes.position.needsUpdate = true;
        mesh.current.geometry.attributes.color.needsUpdate = true;
        
        // Rotate the entire system
        mesh.current.rotation.y += delta * 0.1;
    });
    
    return (
        <Points ref={mesh} positions={particles.positions}>
            <PointMaterial
                size={0.02}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                depthWrite={false}
            />
        </Points>
    );
};

// Event Horizon Component
const EventHorizon: React.FC<{ radius: number }> = ({ radius }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.x += 0.002;
        }
    });
    
    return (
        <Sphere ref={meshRef} args={[radius, 32, 32]}>
            <meshBasicMaterial
                color="#000000"
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
            />
        </Sphere>
    );
};

// Accretion Disk Component
const AccretionDisk: React.FC<{ innerRadius: number; outerRadius: number }> = ({ 
    innerRadius, 
    outerRadius 
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.z += delta * 0.5;
        }
    });
    
    const diskGeometry = useMemo(() => {
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
        return geometry;
    }, [innerRadius, outerRadius]);
    
    return (
        <mesh ref={meshRef} geometry={diskGeometry} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial
                color="#ff6b35"
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

// Main Black Hole Portal Component
export const BlackHolePortalCore: React.FC<BlackHolePortalProps> = ({
    isLoggedIn,
    userName,
    onLogin,
    onShowAuthModal,
    size = 400,
    intensity = 1.0
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showAuthOptions, setShowAuthOptions] = useState(false);
    const controls = useAnimation();
    
    // Handle portal interaction
    const handlePortalClick = () => {
        if (!isLoggedIn) {
            setShowAuthOptions(true);
            onShowAuthModal();
        }
    };
    
    // Authentication provider selection
    const handleProviderSelect = (provider: 'google' | 'github' | 'supabase') => {
        onLogin(provider);
        setShowAuthOptions(false);
    };
    
    // Portal hover effects
    useEffect(() => {
        if (isHovered) {
            controls.start({
                scale: 1.1,
                rotateY: 360,
                transition: { duration: 2, ease: "easeInOut" }
            });
        } else {
            controls.start({
                scale: 1,
                rotateY: 0,
                transition: { duration: 1, ease: "easeOut" }
            });
        }
    }, [isHovered, controls]);
    
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Black Hole Portal Container */}
            <motion.div
                className="relative cursor-pointer"
                style={{ width: size, height: size }}
                animate={controls}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={handlePortalClick}
            >
                {/* Three.js Canvas for 3D Effects */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                    <Canvas
                        camera={{ position: [0, 0, 5], fov: 75 }}
                        style={{ background: 'transparent' }}
                    >
                        <ambientLight intensity={0.2} />
                        <pointLight position={[10, 10, 10]} intensity={0.5} />
                        
                        {/* Event Horizon */}
                        <EventHorizon radius={1} />
                        
                        {/* Accretion Disk */}
                        <AccretionDisk innerRadius={1.2} outerRadius={2.5} />
                        
                        {/* Gravitational Particles */}
                        <GravitationalParticles
                            count={1000}
                            radius={4}
                            blackHoleStrength={2.0 * intensity}
                        />
                    </Canvas>
                </div>
                
                {/* Gravitational Lensing Effect */}
                <div className="absolute inset-0 rounded-full">
                    <div 
                        className="w-full h-full rounded-full"
                        style={{
                            background: `radial-gradient(circle at center, 
                                transparent 20%, 
                                rgba(255, 107, 53, 0.1) 40%, 
                                rgba(147, 51, 234, 0.2) 60%, 
                                transparent 80%
                            )`,
                            filter: 'blur(2px)',
                            animation: 'pulse 3s ease-in-out infinite'
                        }}
                    />
                </div>
                
                {/* Hawking Radiation Particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                            style={{
                                left: '50%',
                                top: '50%',
                            }}
                            animate={{
                                x: [0, (Math.random() - 0.5) * 400],
                                y: [0, (Math.random() - 0.5) * 400],
                                opacity: [1, 0],
                                scale: [1, 0]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                ease: "easeOut",
                                delay: Math.random() * 2
                            }}
                        />
                    ))}
                </div>
                
                {/* Authentication Status Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {isLoggedIn ? (
                        <motion.div
                            className="text-center text-white"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-lg font-semibold">Welcome</div>
                            <div className="text-sm text-cyan-300">{userName}</div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="text-center text-white"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="text-sm font-medium">Enter the Portal</div>
                            <div className="text-xs text-gray-400 mt-1">Click to authenticate</div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
            
            {/* Authentication Provider Selection Modal */}
            <AnimatePresence>
                {showAuthOptions && !isLoggedIn && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div
                            className="relative bg-[#0a0e1f]/90 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 max-w-sm w-full mx-4"
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                        >
                            <h3 className="text-white text-lg font-semibold mb-4 text-center">
                                Choose Authentication Portal
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { provider: 'google' as const, label: 'Google', color: 'from-red-500 to-yellow-500' },
                                    { provider: 'github' as const, label: 'GitHub', color: 'from-gray-600 to-gray-800' },
                                    { provider: 'supabase' as const, label: 'Supabase', color: 'from-green-500 to-emerald-500' }
                                ].map(({ provider, label, color }) => (
                                    <motion.button
                                        key={provider}
                                        onClick={() => handleProviderSelect(provider)}
                                        className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r ${color} text-white font-medium hover:scale-105 transition-transform`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Sign in with {label}
                                    </motion.button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowAuthOptions(false)}
                                className="mt-4 w-full py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlackHolePortalCore;