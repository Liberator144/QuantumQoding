import { useEffect, useState, useId } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { motion, useAnimation } from 'framer-motion';
import type { Container } from '@tsparticles/engine';
type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};
export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity
  } = props;
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();
  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  const particlesLoaded = async (container?: Container) => {
    if (container) {
      await controls.start({
        opacity: 1,
        transition: {
          duration: 1
        }
      });
    }
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={controls} className={className}>
      {init && <Particles id={id || generatedId} className="h-full w-full" particlesLoaded={particlesLoaded} options={{
      background: {
        color: {
          value: background || 'transparent'
        }
      },
      fullScreen: {
        enable: false,
        zIndex: 1
      },
      particles: {
        color: {
          value: particleColor || '#ffffff'
        },
        number: {
          density: {
            enable: true,
            width: 1920,
            height: 1080
          },
          value: particleDensity || 100
        },
        opacity: {
          value: {
            min: 0.1,
            max: 1
          },
          animation: {
            enable: true,
            speed: speed || 4
          }
        },
        size: {
          value: {
            min: minSize || 1,
            max: maxSize || 3
          }
        },
        move: {
          enable: true,
          speed: {
            min: 0.1,
            max: 1
          }
        }
      }
    }} />}
    </motion.div>;
};