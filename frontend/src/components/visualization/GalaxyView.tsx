import { jsx as _jsx } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: GalaxyView.js
 * @version 2.0.0
 */
/**
 * Galaxy View Component
 *
 * This component renders a galaxy visualization using the GalaxyRenderer.
 *
 * @version 1.0.0
 */
import { useEffect, useRef } from 'react';
import { VisualizationEngine, GalaxyRenderer } from '../../../visualization';
const GalaxyView = ({ galaxy, width = 800, height = 600, showLabels = true, showConnections = true, showStarSystems = true, showNebulae = true, showBlackHoles = true, showGravitationalLensing = false, enableAnimations = true, enableInteractions = true, theme = 'quantum', onObjectClick, onObjectHover, }) => {
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
        // Create galaxy renderer
        const renderer = new GalaxyRenderer({
            showLabels,
            showConnections,
            showStarSystems,
            showNebulae,
            showBlackHoles,
            showGravitationalLensing,
            enableAnimations,
            enableInteractions,
            theme,
            width,
            height,
        });
        rendererRef.current = renderer;
        // Initialize renderer
        renderer.initialize();
        // Add event listeners
        renderer.addEventListener('select', (data) => {
            if (data.objects && data.objects.length > 0 && onObjectClick) {
                onObjectClick(data.objects[0].id);
            }
        });
        renderer.addEventListener('hover', (data) => {
            if (onObjectHover) {
                onObjectHover(data.object ? data.object.id : null);
            }
        });
        // Render galaxy
        renderer.render(containerRef.current, galaxy);
        // Cleanup
        return () => {
            renderer.dispose();
        };
    }, []);
    // Update renderer when props change
    useEffect(() => {
        if (!rendererRef.current)
            return;
        rendererRef.current.update(galaxy, {
            showLabels,
            showConnections,
            showStarSystems,
            showNebulae,
            showBlackHoles,
            showGravitationalLensing,
            enableAnimations,
            enableInteractions,
            theme,
        });
    }, [
        galaxy,
        showLabels,
        showConnections,
        showStarSystems,
        showNebulae,
        showBlackHoles,
        showGravitationalLensing,
        enableAnimations,
        enableInteractions,
        theme
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
export default GalaxyView;
