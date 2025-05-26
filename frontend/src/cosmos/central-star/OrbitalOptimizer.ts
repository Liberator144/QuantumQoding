/**
 * Orbital Optimization System - Revolutionary Implementation
 * Advanced orbital mechanics with mathematical precision and golden ratio spacing
 * @version 1.0.0
 */

interface StarNode {
    name: string;
    color: string;
    angle: number;
    distance: number;
    orbit: 'inner' | 'middle' | 'outer';
    rotationSpeed: number;
    description: string;
    style: string;
    features: Array<{ name: string; description: string; orbit: string; }>;
}

export class OrbitalOptimizer {
    private readonly GOLDEN_RATIO = 1.618033988749;
    private readonly GOLDEN_ANGLE = 137.5;
    
    private readonly ORBITAL_DISTANCES = {
        inner: 280,    // Much wider spacing like the image
        middle: 420,   // Proper separation for circular arrangement
        outer: 560     // Wide outer orbit for perfect distribution
    };

    public optimizeOrbitalPositions(nodes: StarNode[]): StarNode[] {
        const optimizedNodes = [...nodes];
        const orbitGroups = this.groupNodesByOrbit(optimizedNodes);
        
        Object.entries(orbitGroups).forEach(([orbit, groupNodes]) => {
            this.optimizeOrbitGroup(groupNodes as StarNode[], orbit as 'inner' | 'middle' | 'outer');
        });

        return optimizedNodes;
    }

    private groupNodesByOrbit(nodes: StarNode[]): Record<string, StarNode[]> {
        return nodes.reduce((groups, node) => {
            if (!groups[node.orbit]) groups[node.orbit] = [];
            groups[node.orbit].push(node);
            return groups;
        }, {} as Record<string, StarNode[]>);
    }

    private optimizeOrbitGroup(nodes: StarNode[], orbit: 'inner' | 'middle' | 'outer'): void {
        const baseDistance = this.ORBITAL_DISTANCES[orbit];
        const nodeCount = nodes.length;

        nodes.forEach((node, index) => {
            // Perfect circular distribution like the reference image
            const angleStep = 360 / nodeCount;
            const baseAngle = index * angleStep;
            
            // Stagger orbits for visual separation but maintain perfect circles
            const orbitOffset = orbit === 'inner' ? 0 : orbit === 'middle' ? 30 : 60;
            node.angle = (baseAngle + orbitOffset) % 360;
            
            // Use exact distance for perfect circular arrangement
            node.distance = baseDistance; // No variation for perfect circles
            
            // Rotation speed based on orbital mechanics (inner orbits faster)
            const baseSpeed = orbit === 'inner' ? 180 : orbit === 'middle' ? 150 : 120;
            const speedVariation = Math.cos((index / nodeCount) * 2 * Math.PI) * 15; // Reduced variation
            node.rotationSpeed = baseSpeed + speedVariation;
        });
    }

    public calculateGravitationalInfluence(nodes: StarNode[]): Record<string, { x: number; y: number }> {
        const influences: Record<string, { x: number; y: number }> = {};

        nodes.forEach(node => {
            let totalInfluenceX = 0;
            let totalInfluenceY = 0;

            nodes.forEach(otherNode => {
                if (node.name !== otherNode.name) {
                    const influence = this.calculatePairwiseInfluence(node, otherNode);
                    totalInfluenceX += influence.x;
                    totalInfluenceY += influence.y;
                }
            });

            influences[node.name] = { x: totalInfluenceX, y: totalInfluenceY };
        });

        return influences;
    }

    private calculatePairwiseInfluence(star1: StarNode, star2: StarNode): { x: number; y: number } {
        const x1 = Math.cos(star1.angle * Math.PI / 180) * star1.distance;
        const y1 = Math.sin(star1.angle * Math.PI / 180) * star1.distance;
        const x2 = Math.cos(star2.angle * Math.PI / 180) * star2.distance;
        const y2 = Math.sin(star2.angle * Math.PI / 180) * star2.distance;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return { x: 0, y: 0 };

        const force = 1000 / (distance * distance);
        return {
            x: (dx / distance) * force * 0.01,
            y: (dy / distance) * force * 0.01
        };
    }

    public generateOrbitalPaths(): Record<string, string> {
        const paths: Record<string, string> = {};

        Object.entries(this.ORBITAL_DISTANCES).forEach(([orbit, distance]) => {
            const eccentricity = orbit === 'inner' ? 0.05 : orbit === 'middle' ? 0.08 : 0.12;
            const semiMajorAxis = distance;
            const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

            paths[orbit] = `M ${semiMajorAxis} 0 
                           A ${semiMajorAxis} ${semiMinorAxis} 0 0 1 ${-semiMajorAxis} 0 
                           A ${semiMajorAxis} ${semiMinorAxis} 0 0 1 ${semiMajorAxis} 0 Z`;
        });

        return paths;
    }

    public calculateSynchronizedPulsing(nodes: StarNode[]): Record<string, { frequency: number; phase: number; amplitude: number }> {
        const pulsingData: Record<string, { frequency: number; phase: number; amplitude: number }> = {};

        nodes.forEach((node, index) => {
            const baseFrequency = node.orbit === 'inner' ? 2.0 : node.orbit === 'middle' ? 1.5 : 1.0;
            const phaseOffset = (index / nodes.length) * 2 * Math.PI;
            const amplitude = node.orbit === 'inner' ? 0.1 : node.orbit === 'middle' ? 0.15 : 0.2;

            pulsingData[node.name] = {
                frequency: baseFrequency,
                phase: phaseOffset,
                amplitude: amplitude
            };
        });

        return pulsingData;
    }
}

export const orbitalOptimizer = new OrbitalOptimizer();