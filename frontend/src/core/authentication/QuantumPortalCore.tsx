/**
 * TypeScript Migration
 * Migrated from: QuantumPortalCore.js
 * @version 2.0.0
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
export const QuantumPortalCore = ({ isLoggedIn, userName, onLogin }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    // Animation state
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const handlePortalClick = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        }
    };
    return <div className="relative w-[400px] h-[400px]">
      {/* Core quantum sphere */}
      <motion.div className="relative w-full h-full cursor-pointer" animate={{
            scale: isLoggedIn ? 1.5 : 1,
            rotateX,
            rotateY
        }} transition={{
            duration: 0.5
        }} onClick={handlePortalClick}>
        {/* Base sphere with quantum lattice */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-[#2d1b4e] via-[#1a0b2e] to-[#0d0628] animate-pulse">
            {/* Quantum lattice pattern */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => <div key={i} className="absolute w-full h-full opacity-30" style={{
                background: `linear-gradient(${i * 30}deg, transparent 47%, rgba(147, 51, 234, 0.3) 49%, transparent 51%)`,
                transform: `rotate(${i * 30}deg)`,
                animation: `quantumPulse ${3 + i * 0.5}s infinite ease-in-out`
            }}/>)}
            </div>
            {/* Energy veins */}
            {[...Array(16)].map((_, i) => <motion.div key={i} className="absolute h-[1px] w-full origin-center" style={{
                background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.6), transparent)',
                transform: `rotate(${i * 22.5}deg)`
            }} animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.02, 1]
            }} transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'linear'
            }}/>)}
          </div>
        </div>
        {/* Quantum arrows */}
        <div className="absolute inset-0 z-10">
          {/* Horizontal arrows */}
          <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full px-4 cursor-pointer" animate={{
            x: [-4, 0, -4]
        }} transition={{
            duration: 2,
            repeat: Infinity
        }} onClick={e => {
            e.stopPropagation();
            setRotateY(rotateY - 45);
        }}>
            <div className="w-8 h-8 border-l-2 border-t-2 border-cyan-400 rotate-[-45deg] opacity-60 hover:opacity-100 transition-opacity"/>
          </motion.div>
          <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full px-4 cursor-pointer" animate={{
            x: [4, 0, 4]
        }} transition={{
            duration: 2,
            repeat: Infinity
        }} onClick={e => {
            e.stopPropagation();
            setRotateY(rotateY + 45);
        }}>
            <div className="w-8 h-8 border-r-2 border-t-2 border-cyan-400 rotate-45 opacity-60 hover:opacity-100 transition-opacity"/>
          </motion.div>
          {/* Vertical arrows */}
          <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full py-4 cursor-pointer" animate={{
            y: [-4, 0, -4]
        }} transition={{
            duration: 2,
            repeat: Infinity
        }} onClick={e => {
            e.stopPropagation();
            setRotateX(rotateX - 45);
        }}>
            <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-400 rotate-[-45deg] opacity-60 hover:opacity-100 transition-opacity"/>
          </motion.div>
          <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full py-4 cursor-pointer" animate={{
            y: [4, 0, 4]
        }} transition={{
            duration: 2,
            repeat: Infinity
        }} onClick={e => {
            e.stopPropagation();
            setRotateX(rotateX + 45);
        }}>
            <div className="w-8 h-8 border-b-2 border-r-2 border-cyan-400 rotate-45 opacity-60 hover:opacity-100 transition-opacity"/>
          </motion.div>
        </div>
        {/* Portal content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.h1 className="text-4xl font-light bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-200 text-transparent bg-clip-text" animate={{
            opacity: [0.7, 1, 0.7]
        }} transition={{
            duration: 3,
            repeat: Infinity
        }}>
              {isLoggedIn ? `Welcome,` : 'Quantum'}
            </motion.h1>
            <motion.p className="text-2xl text-cyan-200/90 mt-2" animate={{
            opacity: [0.7, 1, 0.7]
        }} transition={{
            duration: 3,
            repeat: Infinity,
            delay: 0.5
        }}>
              {isLoggedIn ? userName : 'Portal'}
            </motion.p>
            {!isLoggedIn && <motion.p className="mt-2 text-cyan-200/60 text-sm" initial={{
                opacity: 0
            }} animate={{
                opacity: 1
            }} transition={{
                delay: 0.2
            }}>
                Click to authenticate
              </motion.p>}
          </div>
        </div>
        {/* Outer glow effect */}
        <div className="absolute inset-[-50%]">
          <div className="w-full h-full rounded-full opacity-30" style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)'
        }}/>
        </div>
      </motion.div>
      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && <motion.div initial={{
                opacity: 0,
                scale: 0.8
            }} animate={{
                opacity: 1,
                scale: 1
            }} exit={{
                opacity: 0,
                scale: 0.8
            }} className="absolute top-1/2 right-0 transform translate-x-[120%] -translate-y-1/2 w-80">
            <div className="backdrop-blur-lg rounded-lg p-6 border border-cyan-400/20 bg-black/40">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-cyan-300">Authentication</h2>
                <button onClick={() => setShowLoginModal(false)} className="text-cyan-400/60 hover:text-cyan-400">
                  <X size={20}/>
                </button>
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                const form = e.target;
                const username = form.elements.namedItem('username').value;
                const password = form.elements.namedItem('password').value;
                onLogin(username, password);
                setShowLoginModal(false);
            }} className="space-y-4">
                <div>
                  <input type="text" name="username" placeholder="Username" className="w-full bg-black/20 border border-cyan-400/20 rounded px-4 py-2 text-cyan-100 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400/40"/>
                </div>
                <div>
                  <input type="password" name="password" placeholder="Password" className="w-full bg-black/20 border border-cyan-400/20 rounded px-4 py-2 text-cyan-100 placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400/40"/>
                </div>
                <button type="submit" className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded transition-colors">
                  Enter Portal
                </button>
              </form>
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
