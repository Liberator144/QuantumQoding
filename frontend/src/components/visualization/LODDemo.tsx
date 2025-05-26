import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: LODDemo.js
 * @version 2.0.0
 */
/**
 * Level of Detail (LOD) Demo Component
 *
 * This component demonstrates the Level of Detail rendering system.
 *
 * @version 1.0.0
 */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LODManager, ModelSimplifier, SimplificationMethod, LODTransitionSystem, TransitionMethod, ViewDistanceOptimizer, } from '../../../visualization/utils';
/**
 * LOD Demo Component
 */
const LODDemo = ({ width = 800, height = 600, modelComplexity = 'medium', transitionMethod = TransitionMethod.FADE, debugMode = false, }) => {
    // Refs
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const modelsRef = useRef([]);
    // LOD system refs
    const lodManagerRef = useRef(null);
    const modelSimplifierRef = useRef(null);
    const transitionSystemRef = useRef(null);
    const viewDistanceOptimizerRef = useRef(null);
    // State
    const [fps, setFps] = useState(0);
    const [objectCount, setObjectCount] = useState(0);
    const [triangleCount, setTriangleCount] = useState(0);
    // Initialize scene
    useEffect(() => {
        if (!containerRef.current)
            return;
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);
        sceneRef.current = scene;
        // Create camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 20;
        cameraRef.current = camera;
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;
        // Create controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;
        // Create LOD system
        lodManagerRef.current = new LODManager({ debugMode });
        modelSimplifierRef.current = new ModelSimplifier({ debugMode });
        transitionSystemRef.current = new LODTransitionSystem({
            method: transitionMethod,
            debugMode,
        });
        viewDistanceOptimizerRef.current = new ViewDistanceOptimizer(lodManagerRef.current, transitionSystemRef.current, {
            enableTransitions: true,
            transitionMethod,
            debugMode,
        });
        // Initialize LOD system
        viewDistanceOptimizerRef.current.initialize();
        // Create models
        createModels();
        // Animation loop
        let frameCount = 0;
        let lastTime = performance.now();
        const animate = () => {
            requestAnimationFrame(animate);
            // Update controls
            if (controlsRef.current) {
                controlsRef.current.update();
            }
            // Update LOD system
            if (viewDistanceOptimizerRef.current && cameraRef.current) {
                viewDistanceOptimizerRef.current.updateDistances(cameraRef.current);
            }
            // Render
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
            // Update FPS counter
            frameCount++;
            const now = performance.now();
            const elapsed = now - lastTime;
            if (elapsed >= 1000) {
                setFps(Math.round((frameCount * 1000) / elapsed));
                // Update stats
                if (rendererRef.current) {
                    const info = rendererRef.current.info;
                    setTriangleCount(info.render?.triangles || 0);
                }
                frameCount = 0;
                lastTime = now;
            }
        };
        animate();
        // Cleanup
        return () => {
            // Dispose renderer
            if (rendererRef.current) {
                rendererRef.current.dispose();
                if (containerRef.current && rendererRef.current.domElement) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                }
            }
            // Dispose controls
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
            // Dispose LOD system
            if (viewDistanceOptimizerRef.current) {
                viewDistanceOptimizerRef.current.dispose();
            }
            // Dispose models
            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object instanceof THREE.Mesh) {
                        if (object.geometry) {
                            object.geometry.dispose();
                        }
                        if (object.material) {
                            if (Array.isArray(object.material)) {
                                object.material.forEach((material) => material.dispose());
                            }
                            else {
                                object.material.dispose();
                            }
                        }
                    }
                });
            }
        };
    }, [width, height, modelComplexity, transitionMethod, debugMode]);
    /**
     * Create models
     */
    const createModels = () => {
        if (!sceneRef.current || !modelSimplifierRef.current || !viewDistanceOptimizerRef.current) {
            return;
        }
        // Clear existing models
        modelsRef.current.forEach((model) => {
            sceneRef.current?.remove(model);
        });
        modelsRef.current = [];
        // Determine model count and complexity
        let modelCount;
        let segments;
        switch (modelComplexity) {
            case 'low':
                modelCount = 10;
                segments = 8;
                break;
            case 'medium':
                modelCount = 50;
                segments = 16;
                break;
            case 'high':
                modelCount = 100;
                segments = 32;
                break;
            default:
                modelCount = 50;
                segments = 16;
        }
        // Create models
        for (let i = 0; i < modelCount; i++) {
            // Create geometry
            const geometry = new THREE.SphereGeometry(1, segments, segments);
            // Create material
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(Math.random(), Math.random(), Math.random()),
                roughness: 0.7,
                metalness: 0.3,
            });
            // Create LOD model
            const lodModel = modelSimplifierRef.current.createLODModel(geometry, material, 5, {
                method: SimplificationMethod.MESH_DECIMATION,
                preserveTexCoords: true,
                preserveNormals: true,
            });
            // Position model
            const radius = 10 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            lodModel.position.x = radius * Math.sin(phi) * Math.cos(theta);
            lodModel.position.y = radius * Math.sin(phi) * Math.sin(theta);
            lodModel.position.z = radius * Math.cos(phi);
            // Add to scene
            sceneRef.current.add(lodModel);
            // Register with view distance optimizer
            viewDistanceOptimizerRef.current.registerObject(lodModel);
            // Add to models
            modelsRef.current.push(lodModel);
        }
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        sceneRef.current.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(1, 1, 1);
        sceneRef.current.add(directionalLight);
        // Update object count
        setObjectCount(modelCount);
    };
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { ref: containerRef, style: {
                    width: `${width}px`,
                    height: `${height}px`,
                    position: 'relative',
                    overflow: 'hidden',
                } }), _jsxs("div", { className: "absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-xs", children: [_jsxs("div", { children: ["FPS: ", fps] }), _jsxs("div", { children: ["Objects: ", objectCount] }), _jsxs("div", { children: ["Triangles: ", triangleCount.toLocaleString()] })] })] }));
};
export default LODDemo;
