# 🧩 Tutorial 5: Building Your First Quantum Component
## Creating Custom Quantum-Coherent Components

> **Duration**: 90 minutes  
> **Level**: Intermediate  
> **Prerequisites**: Tutorials 1-4 completed  

Welcome to quantum component development! In this comprehensive tutorial, you'll learn to create custom quantum-coherent components that integrate seamlessly with consciousness streams, maintain neural fabric connections, and provide quantum-enhanced user experiences.

---

## 🎯 Learning Objectives

By the end of this tutorial, you will:
- [ ] Understand quantum component architecture principles
- [ ] Create components with consciousness stream integration
- [ ] Implement neural fabric connectivity
- [ ] Build quantum state management into components
- [ ] Add quantum animations and effects
- [ ] Create reusable quantum component patterns
- [ ] Test and validate quantum component behavior

---

## 🏗️ Step 1: Quantum Component Architecture (15 minutes)

### Understanding Quantum Component Principles

Quantum components in QQ-Verse follow specific architectural principles:

```typescript
// Quantum Component Architecture Overview
interface QuantumComponentArchitecture {
  // Consciousness Integration
  consciousness: {
    streamConnection: boolean;
    contextAwareness: boolean;
    messageHandling: boolean;
  };
  
  // Neural Fabric Integration
  neuralFabric: {
    connectionHealth: number;
    syncCapability: boolean;
    failoverSupport: boolean;
  };
  
  // Quantum State Management
  quantumState: {
    coherenceLevel: number;
    entanglements: QuantumEntanglement[];
    stateSync: boolean;
  };
  
  // Visual Coherence
  visualCoherence: {
    themeIntegration: boolean;
    quantumEffects: boolean;
    responsiveDesign: boolean;
  };
}
```

### Base Quantum Component Interface

```typescript
// Create: frontend/src/types/QuantumComponent.ts

export interface QuantumComponentProps {
  // Core Props
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  
  // Quantum Properties
  quantumCoherence?: number;
  enableConsciousnessStream?: boolean;
  enableNeuralFabric?: boolean;
  quantumEffects?: boolean;
  
  // Event Handlers
  onQuantumStateChange?: (state: QuantumState) => void;
  onConsciousnessMessage?: (message: ConsciousnessMessage) => void;
  onNeuralFabricUpdate?: (health: number) => void;
}

export interface QuantumState {
  coherenceLevel: number;
  entanglements: QuantumEntanglement[];
  lastUpdate: number;
  dimensions: string[];
}

export interface QuantumEntanglement {
  targetId: string;
  strength: number;
  type: 'component' | 'stream' | 'fabric';
  established: number;
}

export interface ConsciousnessMessage {
  type: string;
  data: any;
  timestamp: number;
  source: string;
}
```

### Base Quantum Component Hook

```typescript
// Create: frontend/src/hooks/useQuantumComponent.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { useConsciousnessStream } from './useConsciousnessStream';
import { useQuantumState } from './useQuantumState';

interface UseQuantumComponentOptions {
  componentId: string;
  enableConsciousnessStream?: boolean;
  enableNeuralFabric?: boolean;
  initialCoherence?: number;
  autoSync?: boolean;
}

export const useQuantumComponent = (options: UseQuantumComponentOptions) => {
  const {
    componentId,
    enableConsciousnessStream = true,
    enableNeuralFabric = true,
    initialCoherence = 0.95,
    autoSync = true
  } = options;

  // State Management
  const [coherenceLevel, setCoherenceLevel] = useState(initialCoherence);
  const [entanglements, setEntanglements] = useState<QuantumEntanglement[]>([]);
  const [neuralFabricHealth, setNeuralFabricHealth] = useState(0.95);
  const [isActive, setIsActive] = useState(false);
  
  // Refs for cleanup
  const mountedRef = useRef(true);
  const syncIntervalRef = useRef<NodeJS.Timeout>();

  // Consciousness Stream Integration
  const { sendMessage, onMessage } = useConsciousnessStream(
    enableConsciousnessStream ? `component-${componentId}` : null
  );
  
  // Quantum State Integration
  const { quantumState, updateQuantumState } = useQuantumState(componentId);

  // Initialize component
  useEffect(() => {
    setIsActive(true);
    
    // Register component in quantum state
    updateQuantumState({
      componentId,
      coherenceLevel: initialCoherence,
      entanglements: [],
      lastUpdate: Date.now(),
      status: 'active'
    });

    // Send initialization message
    if (enableConsciousnessStream) {
      sendMessage({
        type: 'component-initialized',
        data: {
          componentId,
          coherenceLevel: initialCoherence,
          timestamp: Date.now()
        }
      });
    }

    // Setup auto-sync if enabled
    if (autoSync) {
      syncIntervalRef.current = setInterval(syncQuantumState, 5000);
    }

    return () => {
      mountedRef.current = false;
      setIsActive(false);
      
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      
      // Send cleanup message
      if (enableConsciousnessStream) {
        sendMessage({
          type: 'component-destroyed',
          data: { componentId, timestamp: Date.now() }
        });
      }
    };
  }, [componentId, initialCoherence, enableConsciousnessStream, autoSync]);

  // Handle consciousness stream messages
  useEffect(() => {
    if (enableConsciousnessStream) {
      onMessage((message: ConsciousnessMessage) => {
        if (!mountedRef.current) return;

        switch (message.type) {
          case 'entanglement-request':
            handleEntanglementRequest(message.data);
            break;
          case 'coherence-update':
            handleCoherenceUpdate(message.data);
            break;
          case 'neural-fabric-health':
            setNeuralFabricHealth(message.data.health);
            break;
          default:
            // Handle custom messages
            break;
        }
      });
    }
  }, [enableConsciousnessStream, onMessage]);

  // Sync quantum state
  const syncQuantumState = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      // Update quantum state with current component state
      updateQuantumState({
        componentId,
        coherenceLevel,
        entanglements,
        lastUpdate: Date.now(),
        neuralFabricHealth
      });

      // Send sync message
      if (enableConsciousnessStream) {
        sendMessage({
          type: 'quantum-sync',
          data: {
            componentId,
            coherenceLevel,
            entanglements: entanglements.length,
            timestamp: Date.now()
          }
        });
      }
    } catch (error) {
      console.error('Quantum state sync failed:', error);
      // Reduce coherence on sync failure
      setCoherenceLevel(prev => Math.max(0.1, prev - 0.1));
    }
  }, [componentId, coherenceLevel, entanglements, neuralFabricHealth, enableConsciousnessStream]);

  // Handle entanglement requests
  const handleEntanglementRequest = useCallback((data: any) => {
    const newEntanglement: QuantumEntanglement = {
      targetId: data.sourceId,
      strength: data.strength || 0.8,
      type: data.type || 'component',
      established: Date.now()
    };

    setEntanglements(prev => [...prev, newEntanglement]);
    setCoherenceLevel(prev => Math.min(1.0, prev + 0.05));

    // Send entanglement confirmation
    if (enableConsciousnessStream) {
      sendMessage({
        type: 'entanglement-confirmed',
        data: {
          sourceId: componentId,
          targetId: data.sourceId,
          strength: newEntanglement.strength,
          timestamp: Date.now()
        }
      });
    }
  }, [componentId, enableConsciousnessStream, sendMessage]);

  // Handle coherence updates
  const handleCoherenceUpdate = useCallback((data: any) => {
    if (data.targetId === componentId || data.targetId === 'all') {
      setCoherenceLevel(data.newCoherence);
    }
  }, [componentId]);

  // Create entanglement with another component
  const createEntanglement = useCallback((targetId: string, strength: number = 0.8) => {
    if (enableConsciousnessStream) {
      sendMessage({
        type: 'entanglement-request',
        data: {
          sourceId: componentId,
          targetId,
          strength,
          timestamp: Date.now()
        }
      });
    }
  }, [componentId, enableConsciousnessStream, sendMessage]);

  // Update coherence level
  const updateCoherence = useCallback((newCoherence: number) => {
    const clampedCoherence = Math.max(0, Math.min(1, newCoherence));
    setCoherenceLevel(clampedCoherence);
    
    // Broadcast coherence update
    if (enableConsciousnessStream) {
      sendMessage({
        type: 'coherence-update',
        data: {
          sourceId: componentId,
          newCoherence: clampedCoherence,
          timestamp: Date.now()
        }
      });
    }
  }, [componentId, enableConsciousnessStream, sendMessage]);

  // Send custom message
  const sendQuantumMessage = useCallback((type: string, data: any) => {
    if (enableConsciousnessStream) {
      sendMessage({
        type,
        data: {
          ...data,
          sourceId: componentId,
          timestamp: Date.now()
        }
      });
    }
  }, [componentId, enableConsciousnessStream, sendMessage]);

  return {
    // State
    coherenceLevel,
    entanglements,
    neuralFabricHealth,
    isActive,
    quantumState,
    
    // Actions
    createEntanglement,
    updateCoherence,
    sendQuantumMessage,
    syncQuantumState,
    
    // Utilities
    isQuantumReady: coherenceLevel > 0.5 && isActive,
    entanglementCount: entanglements.length,
    componentId
  };
};
```

### 🔍 **Knowledge Check 1**
**Question**: What is the primary purpose of the `useQuantumComponent` hook?
- A) To manage component styling
- B) To provide quantum-coherent state management and consciousness stream integration
- C) To handle API calls
- D) To manage component lifecycle

<details>
<summary>Click to reveal answer</summary>
<strong>Answer: B</strong> - The `useQuantumComponent` hook provides quantum-coherent state management, consciousness stream integration, and neural fabric connectivity for components.
</details>

---

## ⚛️ Step 2: Creating Your First Quantum Component (20 minutes)

### Building a Quantum Particle Visualizer

Let's create a comprehensive quantum component that demonstrates all the principles:

```typescript
// Create: frontend/src/components/quantum/QuantumParticleVisualizer.tsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumComponent } from '../../hooks/useQuantumComponent';
import { QUANTUM_COLORS } from '../../styles/theme/quantum-theme';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  entangled: boolean;
  color: string;
  size: number;
}

interface QuantumParticleVisualizerProps {
  width?: number;
  height?: number;
  particleCount?: number;
  enableInteraction?: boolean;
  enableQuantumEffects?: boolean;
  onParticleClick?: (particle: Particle) => void;
  className?: string;
}

export const QuantumParticleVisualizer: React.FC<QuantumParticleVisualizerProps> = ({
  width = 400,
  height = 300,
  particleCount = 50,
  enableInteraction = true,
  enableQuantumEffects = true,
  onParticleClick,
  className
}) => {
  // Quantum component integration
  const {
    coherenceLevel,
    entanglements,
    neuralFabricHealth,
    isQuantumReady,
    createEntanglement,
    updateCoherence,
    sendQuantumMessage
  } = useQuantumComponent({
    componentId: 'particle-visualizer',
    enableConsciousnessStream: true,
    enableNeuralFabric: true,
    initialCoherence: 0.9
  });

  // Component state
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null);
  
  // Refs
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: `particle-${i}`,
      x: Math.random() * (width - 20) + 10,
      y: Math.random() * (height - 20) + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      energy: Math.random() * 100,
      entangled: false,
      color: QUANTUM_COLORS.primary.quantum,
      size: Math.random() * 8 + 4
    }));

    setParticles(initialParticles);
    setIsAnimating(true);

    // Send initialization message
    sendQuantumMessage('particles-initialized', {
      count: particleCount,
      dimensions: { width, height }
    });
  }, [particleCount, width, height, sendQuantumMessage]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating || !isQuantumReady) return;

    const animate = () => {
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          let newX = particle.x + particle.vx * coherenceLevel;
          let newY = particle.y + particle.vy * coherenceLevel;

          // Boundary collision
          if (newX <= 0 || newX >= width) {
            particle.vx *= -1;
            newX = Math.max(0, Math.min(width, newX));
          }
          if (newY <= 0 || newY >= height) {
            particle.vy *= -1;
            newY = Math.max(0, Math.min(height, newY));
          }

          // Quantum entanglement effects
          if (particle.entangled && enableQuantumEffects) {
            // Entangled particles move in harmony
            const entanglementForce = 0.1 * coherenceLevel;
            particle.vx += (Math.random() - 0.5) * entanglementForce;
            particle.vy += (Math.random() - 0.5) * entanglementForce;
          }

          // Energy decay based on neural fabric health
          const energyDecay = (1 - neuralFabricHealth) * 0.1;
          const newEnergy = Math.max(0, particle.energy - energyDecay);

          return {
            ...particle,
            x: newX,
            y: newY,
            energy: newEnergy,
            color: particle.entangled 
              ? QUANTUM_COLORS.primary.stellar 
              : QUANTUM_COLORS.primary.quantum
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, isQuantumReady, coherenceLevel, neuralFabricHealth, width, height, enableQuantumEffects]);

  // Handle particle interaction
  const handleParticleClick = useCallback((particle: Particle) => {
    if (!enableInteraction) return;

    // Toggle entanglement
    setParticles(prev => prev.map(p => 
      p.id === particle.id 
        ? { ...p, entangled: !p.entangled }
        : p
    ));

    // Update coherence based on entanglement
    const entangledCount = particles.filter(p => p.entangled).length;
    const newCoherence = Math.min(1.0, 0.7 + (entangledCount / particleCount) * 0.3);
    updateCoherence(newCoherence);

    // Set selected particle
    setSelectedParticle(particle.id);
    setTimeout(() => setSelectedParticle(null), 1000);

    // Send interaction message
    sendQuantumMessage('particle-interaction', {
      particleId: particle.id,
      entangled: !particle.entangled,
      newCoherence
    });

    // Call external handler
    onParticleClick?.(particle);
  }, [enableInteraction, particles, particleCount, updateCoherence, sendQuantumMessage, onParticleClick]);

  // Quantum effect: Entangle all particles
  const entangleAllParticles = useCallback(() => {
    setParticles(prev => prev.map(p => ({ ...p, entangled: true })));
    updateCoherence(0.98);
    
    sendQuantumMessage('mass-entanglement', {
      particleCount: particles.length,
      coherenceLevel: 0.98
    });
  }, [particles.length, updateCoherence, sendQuantumMessage]);

  // Quantum effect: Reset quantum state
  const resetQuantumState = useCallback(() => {
    setParticles(prev => prev.map(p => ({ 
      ...p, 
      entangled: false,
      energy: Math.random() * 100,
      color: QUANTUM_COLORS.primary.quantum
    })));
    updateCoherence(0.9);
    
    sendQuantumMessage('quantum-reset', {
      particleCount: particles.length
    });
  }, [particles.length, updateCoherence, sendQuantumMessage]);

  return (
    <div className={className}>
      {/* Quantum Status Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <span style={{ color: '#ffffff' }}>
            Coherence: <strong style={{ color: QUANTUM_COLORS.primary.quantum }}>
              {(coherenceLevel * 100).toFixed(1)}%
            </strong>
          </span>
          <span style={{ color: '#ffffff' }}>
            Entangled: <strong style={{ color: QUANTUM_COLORS.primary.stellar }}>
              {particles.filter(p => p.entangled).length}/{particles.length}
            </strong>
          </span>
          <span style={{ color: '#ffffff' }}>
            Neural Fabric: <strong style={{ 
              color: neuralFabricHealth > 0.8 ? QUANTUM_COLORS.semantic.success : QUANTUM_COLORS.semantic.warning 
            }}>
              {(neuralFabricHealth * 100).toFixed(1)}%
            </strong>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={entangleAllParticles}
            style={{
              padding: '5px 10px',
              background: QUANTUM_COLORS.primary.quantum,
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ⚛️ Entangle All
          </button>
          <button
            onClick={resetQuantumState}
            style={{
              padding: '5px 10px',
              background: 'transparent',
              color: QUANTUM_COLORS.primary.quantum,
              border: `1px solid ${QUANTUM_COLORS.primary.quantum}`,
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Particle Visualization Container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: `${width}px`,
          height: `${height}px`,
          background: `linear-gradient(135deg, ${QUANTUM_COLORS.background.primary}, ${QUANTUM_COLORS.background.secondary})`,
          borderRadius: '8px',
          border: `2px solid ${QUANTUM_COLORS.primary.quantum}`,
          overflow: 'hidden',
          cursor: enableInteraction ? 'pointer' : 'default'
        }}
      >
        {/* Quantum Field Background Effect */}
        {enableQuantumEffects && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${QUANTUM_COLORS.primary.quantum}10, transparent 70%)`,
            opacity: coherenceLevel
          }} />
        )}

        {/* Particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              style={{
                position: 'absolute',
                left: particle.x - particle.size / 2,
                top: particle.y - particle.size / 2,
                width: particle.size,
                height: particle.size,
                borderRadius: '50%',
                background: particle.entangled 
                  ? `radial-gradient(circle, ${particle.color}, ${QUANTUM_COLORS.primary.stellar})`
                  : particle.color,
                boxShadow: particle.entangled 
                  ? `0 0 ${particle.size * 2}px ${particle.color}`
                  : `0 0 ${particle.size}px ${particle.color}`,
                cursor: enableInteraction ? 'pointer' : 'default',
                zIndex: selectedParticle === particle.id ? 10 : 1
              }}
              animate={{
                scale: selectedParticle === particle.id ? 1.5 : 1,
                opacity: particle.energy / 100
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut'
              }}
              onClick={() => handleParticleClick(particle)}
              whileHover={enableInteraction ? { scale: 1.2 } : {}}
            />
          ))}
        </AnimatePresence>

        {/* Entanglement Lines */}
        {enableQuantumEffects && (
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0
            }}
            width={width}
            height={height}
          >
            {particles
              .filter(p => p.entangled)
              .map((particle, index, entangledParticles) => 
                entangledParticles.slice(index + 1).map((otherParticle) => (
                  <line
                    key={`${particle.id}-${otherParticle.id}`}
                    x1={particle.x}
                    y1={particle.y}
                    x2={otherParticle.x}
                    y2={otherParticle.y}
                    stroke={QUANTUM_COLORS.primary.stellar}
                    strokeWidth="1"
                    opacity={coherenceLevel * 0.5}
                    strokeDasharray="2,2"
                  />
                ))
              )
            }
          </svg>
        )}

        {/* Quantum Ready Indicator */}
        {!isQuantumReady && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            🌌 Initializing Quantum Field...
          </div>
        )}
      </div>

      {/* Component Info */}
      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '12px',
        color: '#cccccc'
      }}>
        <p style={{ margin: '0 0 5px' }}>
          <strong>Quantum Component:</strong> QuantumParticleVisualizer
        </p>
        <p style={{ margin: '0 0 5px' }}>
          <strong>Entanglements:</strong> {entanglements.length} active connections
        </p>
        <p style={{ margin: 0 }}>
          <strong>Status:</strong> {isQuantumReady ? '✅ Quantum Ready' : '⏳ Initializing'}
        </p>
      </div>
    </div>
  );
};

export default QuantumParticleVisualizer;
```