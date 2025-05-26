import { jsx as _jsx } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: PlanetarySystemView.js
 * @version 2.0.0
 */
/**
 * Planetary System View Component
 *
 * This component renders a planetary system visualization using the PlanetarySystemRenderer.
 *
 * @version 1.0.0
 */
import { useEffect, useRef } from 'react';
import { VisualizationEngine } from '../../../visualization';
import { PlanetarySystemRenderer } from '../../../visualization/charts/PlanetarySystemRenderer';
const PlanetarySystemView = ({ system, width = 800, height = 600, showLabels = true, showOrbits = true, showFeatures = true, showPlanetDetails = true, enableAnimations = true, enableInteractions = true, enablePhysics = true, theme = 'quantum', onPlanetClick, onPlanetHover, onFeatureClick, onFeatureHover, }) => {
    // Refs
    const containerRef = useRef(null);
    const engineRef = useRef(null);
    const rendererRef = useRef(null);
    // Initialize visualization engine and renderer
    useEffect(() => {
        if (!containerRef.current)
            return;
        // Create visualization engine
        const engine = new VisualizationEngine();
        engineRef.current = engine;
        // Create planetary system renderer
        const renderer = new PlanetarySystemRenderer({
            showLabels,
            showOrbits,
            showFeatures,
            showPlanetDetails,
            enableAnimations,
            enableInteractions,
            enablePhysics,
            theme,
            width,
            height,
        });
        rendererRef.current = renderer;
        // Initialize renderer
        renderer.initialize();
        // Add event listeners
        renderer.addEventListener('select', (data) => {
            const object = data.object;
            if (object) {
                if (object.features) {
                    // Planet
                    if (onPlanetClick)
                        onPlanetClick(object);
                }
                else if (object.position) {
                    // Feature
                    if (onFeatureClick)
                        onFeatureClick(object);
                }
            }
        });
        renderer.addEventListener('hover', (data) => {
            const object = data.object;
            if (object) {
                if (object.features) {
                    // Planet
                    if (onPlanetHover)
                        onPlanetHover(object);
                }
                else if (object.position) {
                    // Feature
                    if (onFeatureHover)
                        onFeatureHover(object);
                }
            }
            else {
                if (onPlanetHover)
                    onPlanetHover(null);
                if (onFeatureHover)
                    onFeatureHover(null);
            }
        });
        // Render planetary system
        renderer.render(containerRef.current, system);
        // Cleanup
        return () => {
            renderer.dispose();
        };
    }, []);
    // Update renderer when props change
    useEffect(() => {
        if (!rendererRef.current)
            return;
        rendererRef.current.update(system, {
            showLabels,
            showOrbits,
            showFeatures,
            showPlanetDetails,
            enableAnimations,
            enableInteractions,
            enablePhysics,
            theme,
        });
    }, [
        system,
        showLabels,
        showOrbits,
        showFeatures,
        showPlanetDetails,
        enableAnimations,
        enableInteractions,
        enablePhysics,
        theme,
    ]);
    // Update renderer when size changes
    useEffect(() => {
        if (!rendererRef.current)
            return;
        rendererRef.current.resize(width, height);
    }, [width, height]);
    return (_jsx("div", { ref: containerRef, style: {
            width: `${width}px`,
            height: `${height}px`,
            position: 'relative',
            overflow: 'hidden',
        } }));
};
export default PlanetarySystemView;
