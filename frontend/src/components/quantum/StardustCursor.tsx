/**
 * TypeScript Migration
 * Migrated from: StardustCursor.js
 * @version 2.0.0
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
export const StardustCursor = () => {
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0
    });
    const [particles, setParticles] = useState([]);
    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
            // Create new particle
            const colors = ['#00ffff', '#4169e1', '#9370db', '#ff4500', '#32cd32', '#ffd700', '#ff1493', '#00fa9a', '#ff8c00'];
            const particle = {
                x: e.clientX,
                y: e.clientY,
                color: colors[Math.floor(Math.random() * colors.length)],
                id: Date.now()
            };
            setParticles(prev => [...prev.slice(-20), particle]); // Keep last 20 particles
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);
    return <div className="pointer-events-none fixed inset-0 z-50">
      {/* Cursor core */}
      <motion.div className="fixed top-0 left-0 w-4 h-4 rounded-full mix-blend-screen" animate={{
            x: mousePosition.x - 8,
            y: mousePosition.y - 8
        }} transition={{
            duration: 0,
            ease: 'linear'
        }} style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)'
        }}/>
      {/* Particle trail */}
      {particles.map((particle) => <motion.div key={particle.id} className="fixed w-2 h-2 rounded-full" initial={{
                x: particle.x,
                y: particle.y,
                scale: 1,
                opacity: 0.6
            }} animate={{
                x: particle.x + (Math.random() - 0.5) * 50,
                y: particle.y + (Math.random() - 0.5) * 50,
                scale: 0,
                opacity: 0
            }} transition={{
                duration: 1,
                ease: 'easeOut'
            }} style={{
                backgroundColor: particle.color,
                filter: 'blur(2px)'
            }}/>)}
    </div>;
};
