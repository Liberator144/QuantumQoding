import React from 'react';
import { motion } from 'framer-motion';

function seededRandom(seed: number, n: number): number {
  // Simple deterministic pseudo-random generator for visual patterns
  const x = Math.sin(seed + n) * 10000;
  return x - Math.floor(x);
}

const seed = 42; // Or use a prop/context if needed for deterministic visuals

type PlanetPatternProps = {
  style: string;
  color: string;
  seed: number;
};

const PlanetPattern: React.FC<PlanetPatternProps> = ({ style, color, seed }) => {
  // Depending on the style, create different planet surfaces
  
  // For rocky planets
  if (style === 'rocky') {
    return (
      <div className="absolute inset-0">
        {/* Surface texture */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${color}DD, ${color}88)`
          }}
        >
          {/* Craters and surface features */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 30 + 5}%`,
                height: `${Math.random() * 30 + 5}%`,
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
                background: `radial-gradient(circle, ${color}50 0%, ${color}90 70%)`,
                opacity: 0.7,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
        
        {/* Highlights */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)',
          }}
        />
      </div>
    );
  }
  
  // For gas giants
  if (style === 'gas') {
    return (
      <div className="absolute inset-0">
        {/* Base atmosphere */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${color} 0%, ${color}88 100%)`,
          }}
        >
          {/* Cloud bands */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full"
              style={{
                height: `${Math.random() * 15 + 5}%`,
                top: `${i * 15 + Math.random() * 5}%`,
                background: `linear-gradient(90deg, ${color}AA, ${color}55, ${color}AA)`,
                opacity: 0.7,
              }}
            />
          ))}
          
          {/* Storm systems */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 20 + 10}%`,
                height: `${Math.random() * 20 + 10}%`,
                left: `${Math.random() * 70}%`,
                top: `${Math.random() * 70}%`,
                background: `radial-gradient(circle, ${color}FF 0%, ${color}88 100%)`,
                opacity: 0.8,
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Highlights */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
        />
        
        {/* Outer atmospheric ring - enhanced on hover */}
        <div className="absolute inset-[-15%] rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: `5px solid ${color}30`,
              filter: 'blur(10px)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    );
  }
  
  // For icy planets
  if (style === 'ice') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Icy surface */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${color}EE, ${color}AA)`
          }}
        >
          {/* Ice cracks and fissures */}
          {[...Array(12)].map((_, i) => {
            const rand = seededRandom(seed, i + 300);
            
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  width: `${rand * 40 + 10}%`,
                  height: `${1 + rand * 1}px`,
                  left: `${seededRandom(seed, i + 320) * 80}%`,
                  top: `${seededRandom(seed, i + 340) * 80}%`,
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)`,
                  transform: `rotate(${seededRandom(seed, i + 360) * 360}deg)`,
                  opacity: 0.7,
                  boxShadow: '0 0 2px rgba(255,255,255,0.5)',
                }}
              />
            );
          })}
          
          {/* Ice caps with subtle movements */}
          <motion.div
            className="absolute"
            style={{
              width: '70%',
              height: '30%',
              left: '15%',
              top: '0',
              background: `radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, transparent 70%)`,
              borderRadius: '50% 50% 100% 100%',
            }}
            animate={{
              opacity: [0.5, 0.7, 0.5],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute"
            style={{
              width: '70%',
              height: '30%',
              left: '15%',
              bottom: '0',
              background: `radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, transparent 70%)`,
              borderRadius: '100% 100% 50% 50%',
            }}
            animate={{
              opacity: [0.5, 0.7, 0.5],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Ice crystal formations */}
          {[...Array(6)].map((_, i) => {
            const rand = seededRandom(seed, i + 380);
            
            return (
              <div
                key={`crystal-${i}`}
                className="absolute"
                style={{
                  width: `${rand * 15 + 5}%`,
                  height: `${rand * 15 + 5}%`,
                  left: `${seededRandom(seed, i + 400) * 70}%`,
                  top: `${seededRandom(seed, i + 420) * 70}%`,
                  background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 60%, transparent 100%)`,
                  borderRadius: `${seededRandom(seed, i + 440) * 50}%`,
                  transform: `rotate(${seededRandom(seed, i + 460) * 360}deg)`,
                }}
              />
            );
          })}
        </div>
        
        {/* Crystalline highlights */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 60%)',
          }}
        />
        
        {/* Icy mist atmosphere - enhanced on hover */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-70 transition-opacity duration-500">
          {[...Array(5)].map((_, i) => {
            const rand = seededRandom(seed, i + 480);
            
            return (
              <motion.div
                key={`mist-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${rand * 60 + 40}%`,
                  height: `${rand * 20 + 20}%`,
                  left: `${seededRandom(seed, i + 500) * 50}%`,
                  top: `${seededRandom(seed, i + 520) * 70}%`,
                  background: `radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                  filter: 'blur(10px)',
                }}
                animate={{
                  x: [`${-5 - rand * 10}px`, `${5 + rand * 10}px`, `${-5 - rand * 10}px`],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 10 + rand * 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>
        
        {/* Outer icy ring - only visible on hover */}
        <div className="absolute inset-[-20%] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid rgba(255,255,255,0.2)`,
              filter: 'blur(5px)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    );
  }
  
  // For oceanic planets
  if (style === 'oceanic') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Ocean surface */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${color}DD, ${color}88)`
          }}
        >
          {/* Animated wave patterns */}
          {[...Array(8)].map((_, i) => {
            const rand = seededRandom(seed, i + 540);
            const height = rand * 10 + 5;
            const top = i * 10 + seededRandom(seed, i + 560) * 5;
            const duration = 5 + rand * 5;
            const delay = rand * 2;
            
            return (
              <motion.div
                key={i}
                className="absolute w-full"
                style={{
                  height: `${height}%`,
                  top: `${top}%`,
                  background: `linear-gradient(90deg, ${color}88, ${color}CC)`,
                  opacity: 0.4,
                }}
                animate={{
                  x: ['-5%', '5%', '-5%'],
                }}
                transition={{
                  duration: duration,
                  delay: delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
          
          {/* Continental land masses */}
          {[...Array(4)].map((_, i) => {
            const rand = seededRandom(seed, i + 580);
            const width = rand * 30 + 10;
            const height = rand * 30 + 10;
            const left = seededRandom(seed, i + 600) * 70;
            const top = seededRandom(seed, i + 620) * 70;
            const borderRadius = 30 + seededRandom(seed, i + 640) * 50;
            
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: `${width}%`,
                  height: `${height}%`,
                  left: `${left}%`,
                  top: `${top}%`,
                  background: `radial-gradient(circle, ${color}60 0%, transparent 80%)`,
                  borderRadius: `${borderRadius}%`,
                  opacity: 0.7,
                }}
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 8 + rand * 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
          
          {/* Dynamic cloud systems - more visible on hover */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-500">
            {[...Array(6)].map((_, i) => {
              const rand = seededRandom(seed, i + 660);
              const width = rand * 50 + 30;
              const height = rand * 20 + 10;
              const left = seededRandom(seed, i + 680) * 70;
              const top = seededRandom(seed, i + 700) * 70;
              
              return (
                <motion.div
                  key={`cloud-${i}`}
                  className="absolute rounded-full blur-md"
                  style={{
                    width: `${width}%`,
                    height: `${height}%`,
                    left: `${left}%`,
                    top: `${top}%`,
                    background: `radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)`,
                  }}
                  animate={{
                    x: [`${-10 - rand * 10}px`, `${10 + rand * 10}px`, `${-10 - rand * 10}px`],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 15 + rand * 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>
        </div>
        
        {/* Light reflection */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
        />
        
        {/* Watery atmosphere glow - enhanced on hover */}
        <div className="absolute inset-[-10%] rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
              filter: 'blur(10px)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    );
  }
  
  // For lava planets
  if (style === 'lava') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Molten surface */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${color} 0%, ${color}88 100%)`,
          }}
        >
          {/* Lava flows with dynamic animation */}
          {[...Array(6)].map((_, i) => {
            const rand = seededRandom(seed, i + 720);
            const width = rand * 40 + 20;
            const height = rand * 10 + 5;
            const left = seededRandom(seed, i + 740) * 60;
            const top = seededRandom(seed, i + 760) * 80;
            
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: `${width}%`,
                  height: `${height}%`,
                  left: `${left}%`,
                  top: `${top}%`,
                  background: `linear-gradient(90deg, #ff6a00, #ff0000)`,
                  borderRadius: `${seededRandom(seed, i + 780) * 50}%`,
                  filter: 'blur(2px)',
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  width: [`${width}%`, `${width + rand * 10}%`, `${width}%`],
                }}
                transition={{
                  duration: 2 + rand * 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
          
          {/* Volcanic eruptions - dynamic and enhanced on hover */}
          {[...Array(4)].map((_, i) => {
            const rand = seededRandom(seed, i + 800);
            const size = rand * 15 + 5;
            const left = seededRandom(seed, i + 820) * 80;
            const top = seededRandom(seed, i + 840) * 80;
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${size}%`,
                  height: `${size}%`,
                  left: `${left}%`,
                  top: `${top}%`,
                  background: `radial-gradient(circle, #ff9500 0%, #ff0000 100%)`,
                  boxShadow: '0 0 10px rgba(255,100,0,0.6)',
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 1 + rand * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
          
          {/* Lava particles shooting out - enhanced on hover */}
          <div className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-300">
            {[...Array(8)].map((_, i) => {
              const rand = seededRandom(seed, i + 860);
              const size = rand * 3 + 1;
              const startLeft = 40 + seededRandom(seed, i + 880) * 20; // Eruption point
              const startTop = 40 + seededRandom(seed, i + 900) * 20;
              const endLeft = startLeft + (seededRandom(seed, i + 920) - 0.5) * 60;
              const endTop = startTop + (seededRandom(seed, i + 940) - 0.5) * 60;
              
              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${startLeft}%`,
                    top: `${startTop}%`,
                    background: '#ff9500',
                    boxShadow: '0 0 5px rgba(255,150,0,0.8)',
                  }}
                  animate={{
                    left: [`${startLeft}%`, `${endLeft}%`, `${startLeft}%`],
                    top: [`${startTop}%`, `${endTop}%`, `${startTop}%`],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + rand * 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: rand * 2
                  }}
                />
              );
            })}
          </div>
        </div>
        
        {/* Heat glow effect - pulsating */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,200,0,0.3) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Hot atmospheric glow - enhanced on hover */}
        <div className="absolute inset-[-20%] rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-300">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255,100,0,0.4) 0%, transparent 70%)`,
              filter: 'blur(15px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    );
  }
  
  // Default pattern
  return (
    <div className="absolute inset-0">
      {/* Basic planet texture */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, ${color}, ${color}88)`,
        }}
      >
        {/* Surface features */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 20 + 10}%`,
              height: `${Math.random() * 20 + 10}%`,
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              background: `radial-gradient(circle, ${color}50 0%, ${color}80 70%)`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
      
      {/* Base highlight */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)',
        }}
      />
    </div>
  );
};

export default PlanetPattern;
