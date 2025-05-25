import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import PlanetPattern from './PlanetPattern';

// Define rotation animation variants
const rotationVariants: Variants = {
  base: {
    rotate: 360,
    transition: {
      duration: 60,
      repeat: Infinity,
      ease: "linear"
    }
  },
  surface: {
    rotate: 360,
    transition: {
      duration: 40,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Random number generator for consistent planet features
const generateSeededNumber = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

type PlanetProps = {
  node: {
    name: string;
    description: string;
    color: string;
    angle: number;
    distance: number;
    orbit: string;
    rotationSpeed: number;
    style?: string;
  };
  starColor: string;
  isHovered: boolean;
  onHover: (name: string | null) => void;
  onClick?: (name: string) => void;
  connectionPoint?: { x: number; y: number };
};

const FeaturePlanet: React.FC<PlanetProps> = ({
  node,
  starColor,
  isHovered,
  onHover,
  onClick,
  connectionPoint,
}) => {
  const planetRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  // Create a stable seed for planet features based on planet name
  const seed = generateSeededNumber(node.name);

  // Derive planet style based on orbit or use default
  const getPlanetStyle = () => {
    if (node.style) return node.style;
    
    switch (node.orbit) {
      case 'inner': return 'rocky';
      case 'middle': return 'oceanic';
      case 'outer': return 'gas';
      default: return 'rocky';
    }
  };

  // Render atmospheric effects based on planet style
  const renderAtmosphericEffects = () => {
    const style = getPlanetStyle();
    
    if (style === 'gas') {
      return (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `radial-gradient(circle, ${node.color}30 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      );
    }
    
    if (style === 'oceanic') {
      return (
        <motion.div
          className="absolute inset-[-5%] rounded-full overflow-hidden"
          style={{
            background: `radial-gradient(circle, ${node.color}20 0%, transparent 70%)`,
            filter: 'blur(3px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      );
    }
    
    return null;
  };

  // Derive planet size based on orbit
  const getPlanetSize = () => {
    switch (node.orbit) {
      case 'inner': return 'w-10 h-10';
      case 'middle': return 'w-12 h-12';
      case 'outer': return 'w-14 h-14';
      default: return 'w-10 h-10';
    }
  };

  // Update position for data streams
  useEffect(() => {
    if (planetRef.current) {
      const rect = planetRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

  // Handle planet click
  const handleClick = () => {
    if (onClick) {
      onClick(node.name);
    }
  };

  return (
    <div
      ref={planetRef}
      className="absolute"
      style={{
        left: `calc(50% + ${Math.cos((node.angle * Math.PI) / 180) * node.distance}px)`,
        top: `calc(50% + ${Math.sin((node.angle * Math.PI) / 180) * node.distance}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 30 : 20,
      }}
    >
      {/* Planet rotation container - base rotation */}
      <motion.div
        variants={rotationVariants}
        animate="base"
        className="relative"
      >
        {/* Planet Body */}
        <div
          className={`relative group cursor-pointer ${getPlanetSize()}`}
          onMouseEnter={() => onHover(node.name)}
          onMouseLeave={() => onHover(null)}
          onClick={handleClick}
        >
          <motion.div
            className={`${getPlanetSize()} rounded-full relative overflow-hidden
                       transform transition-all duration-300`}
            animate={{
              scale: isHovered ? 1.15 : 1,
              boxShadow: isHovered 
                ? `0 0 15px ${node.color}80` 
                : `0 0 5px ${node.color}40`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
          >
            {/* Surface features with independent rotation */}
            <motion.div
              className="absolute inset-0"
              variants={rotationVariants}
              animate="surface"
              style={{
                boxShadow: `inset -4px -4px 20px rgba(0,0,0,0.8)`,
              }}
            >
              <PlanetPattern 
                style={getPlanetStyle()} 
                color={node.color} 
                seed={seed}
              />
            </motion.div>
            
            {/* Dynamic atmosphere effect based on planet type */}
            {renderAtmosphericEffects()}
            
            {/* Orbit ring indication */}
            {isHovered && (
              <motion.div 
                className="absolute -inset-3 rounded-full border-2 border-dashed opacity-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                style={{
                  borderColor: node.color,
                }}
              />
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Planet Name Label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <div
              className="px-2 py-1 rounded-md backdrop-blur-sm"
              style={{
                backgroundColor: `${node.color}20`,
                borderWidth: '1px',
                borderColor: `${node.color}60`,
                boxShadow: `0 0 10px ${node.color}40`
              }}
            >
              <p 
                className="text-xs whitespace-nowrap font-medium"
                style={{
                  color: '#fff',
                  textShadow: `0 0 4px ${node.color}`
                }}
              >
                {node.name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data connection line to star (if provided connection point) */}
      <AnimatePresence>
        {isHovered && connectionPoint && (
          <motion.div
            className="absolute left-1/2 top-1/2 w-0 h-0 z-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
          >
            <svg style={{ 
              position: 'absolute',
              width: '1px',
              height: '1px',
              overflow: 'visible',
            }}>
              <line
                x1="0"
                y1="0"
                x2={connectionPoint.x - position.x}
                y2={connectionPoint.y - position.y}
                stroke={starColor || node.color}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              
              {/* Data particles flowing along the line */}
              {[...Array(3)].map((_, i) => (
                <motion.circle
                  key={i}
                  r="1.5"
                  fill={starColor || node.color}
                  filter="blur(1px)"
                  animate={{
                    offsetDistance: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    offsetPath: `path("M 0 0 L ${connectionPoint.x - position.x} ${connectionPoint.y - position.y}")`,
                  }}
                />
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Planet Description Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute z-40 pointer-events-none"
            style={{
              width: '220px',
              left: '50%',
              transform: 'translateX(-50%)',
              top: 'calc(100% + 1.5rem)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div
              className="p-3 rounded-lg backdrop-blur-md"
              style={{
                backgroundColor: `${node.color}20`,
                borderWidth: '1px',
                borderColor: `${node.color}40`,
                boxShadow: `0 0 15px ${node.color}30`
              }}
            >
              {/* Planet details */}
              <div className="mb-2 flex justify-between items-center">
                <h4 
                  className="text-sm font-medium"
                  style={{
                    color: node.color,
                    textShadow: `0 0 4px ${node.color}80`
                  }}
                >
                  {node.name}
                </h4>
                <div 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${node.color}30`,
                    borderWidth: '1px',
                    borderColor: `${node.color}50`,
                  }}
                >
                  {node.orbit} orbit
                </div>
              </div>
              
              {/* Planet description */}
              <p 
                className="text-xs leading-relaxed text-white/90 mb-2"
                style={{
                  textShadow: `0 0 8px ${node.color}40`,
                }}
              >
                {node.description}
              </p>
              
              {/* Interactive elements */}
              {onClick && (
                <div className="mt-2 pt-2 border-t border-white/10 text-center">
                  <motion.button
                    className="text-xs px-3 py-1 rounded-full pointer-events-auto"
                    style={{
                      backgroundColor: `${node.color}30`,
                      borderWidth: '1px', 
                      borderColor: `${node.color}50`,
                      color: '#fff',
                    }}
                    whileHover={{
                      backgroundColor: `${node.color}50`,
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                  >
                    Explore {node.name}
                  </motion.button>
                </div>
              )}
              
              {/* Background particles effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg -z-10">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: Math.random() * 3 + 1,
                      height: Math.random() * 3 + 1,
                      backgroundColor: node.color,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: 0.6,
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 20],
                      y: [0, (Math.random() - 0.5) * 20],
                      opacity: [0.6, 0.2, 0.6],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              
              {/* Connecting line */}
              <motion.div
                className="absolute w-0.5 left-1/2 -top-6 origin-bottom"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{
                  background: `linear-gradient(to bottom, ${node.color}00, ${node.color})`,
                  height: '1.5rem',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturePlanet;
