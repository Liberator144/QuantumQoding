/**
 * TypeScript Migration
 * Migrated from: VirtualRenderingDemo.js
 * @version 2.0.0
 */
/**
 * Virtual Rendering Demo Component
 *
 * This component demonstrates the Virtual Rendering System.
 *
 * @version 1.0.0
 */
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VirtualRenderer, BufferZoneManager, OcclusionCullingSystem, OcclusionCullingMethod, } from '../../../visualization/utils';
/**
 * Virtual Rendering Demo Component
 */
const VirtualRenderingDemo = ({ width = 800, height = 600, objectCount = 1000, enableBufferZones = true, enableOcclusionCulling = true, debugMode = false, }) => {
    // Refs
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const objectsRef = useRef([]);
    // Virtual rendering system refs
    const virtualRendererRef = useRef(null);
    const bufferZoneManagerRef = useRef(null);
    const occlusionCullingSystemRef = useRef(null);
    // State
    const [fps, setFps] = useState(0);
    const [visibleObjects, setVisibleObjects] = useState(0);
    const [culledObjects, setCulledObjects] = useState(0);
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
        camera.position.z = 50;
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
        // Create virtual rendering system
        if (enableBufferZones) {
            bufferZoneManagerRef.current = new BufferZoneManager(scene, camera, {
                zoneSize: 20,
                activeZoneRadius: 2,
                preloadZoneRadius: 3,
                debugMode,
            });
            bufferZoneManagerRef.current.initialize();
        }
        if (enableOcclusionCulling) {
            occlusionCullingSystemRef.current = new OcclusionCullingSystem(scene, camera, renderer, {
                method: OcclusionCullingMethod.HIERARCHICAL_Z_BUFFER,
                occlusionThreshold: 0.8,
                depthTextureResolution: 256,
                updateInterval: 100,
                debugMode,
            });
            occlusionCullingSystemRef.current.initialize();
        }
        virtualRendererRef.current = new VirtualRenderer(scene, camera, renderer, {
            enableFrustumCulling: true,
            enableOcclusionCulling,
            enableDistanceCulling: true,
            maxRenderDistance: 200,
            bufferZoneSize: 0.2,
            debugMode,
        });
        virtualRendererRef.current.initialize();
        // Create objects
        createObjects();
        // Animation loop
        let frameCount = 0;
        let lastTime = performance.now();
        const animate = () => {
            requestAnimationFrame(animate);
            // Update controls
            if (controlsRef.current) {
                controlsRef.current.update();
            }
            // Update virtual rendering system
            if (virtualRendererRef.current) {
                virtualRendererRef.current.update();
                // Update stats
                const stats = virtualRendererRef.current.getStats();
                setVisibleObjects(stats.visibleObjects);
                setCulledObjects(stats.totalObjects - stats.visibleObjects);
            }
            // Update buffer zone manager
            if (bufferZoneManagerRef.current) {
                bufferZoneManagerRef.current.update();
            }
            // Update occlusion culling system
            if (occlusionCullingSystemRef.current) {
                occlusionCullingSystemRef.current.update();
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
            // Dispose virtual rendering system
            if (virtualRendererRef.current) {
                virtualRendererRef.current.dispose();
            }
            // Dispose buffer zone manager
            if (bufferZoneManagerRef.current) {
                bufferZoneManagerRef.current.dispose();
            }
            // Dispose occlusion culling system
            if (occlusionCullingSystemRef.current) {
                occlusionCullingSystemRef.current.dispose();
            }
            // Dispose objects
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
    }, [width, height, objectCount, enableBufferZones, enableOcclusionCulling, debugMode]);
    /**
     * Create objects
     */
    const createObjects = () => {
        if (!sceneRef.current) {
            return;
        }
        // Clear existing objects
        objectsRef.current.forEach((object) => {
            sceneRef.current?.remove(object);
        });
        objectsRef.current = [];
        // Create objects
        for (let i = 0; i < objectCount; i++) {
            // Create geometry
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            // Create material
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(Math.random(), Math.random(), Math.random()),
                roughness: 0.7,
                metalness: 0.3,
            });
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            // Position object
            const radius = 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
            mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
            mesh.position.z = radius * Math.cos(phi);
            // Rotate object
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            // Scale object
            const scale = 0.5 + Math.random() * 2;
            mesh.scale.set(scale, scale, scale);
            // Add to scene
            sceneRef.current.add(mesh);
            // Register with virtual rendering system
            if (virtualRendererRef.current) {
                virtualRendererRef.current.registerObject(mesh);
            }
            // Register with buffer zone manager
            if (bufferZoneManagerRef.current) {
                bufferZoneManagerRef.current.registerObject(mesh);
            }
            // Register with occlusion culling system
            if (occlusionCullingSystemRef.current) {
                occlusionCullingSystemRef.current.registerObject(mesh);
            }
            // Add to objects
            objectsRef.current.push(mesh);
        }
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        sceneRef.current.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(1, 1, 1);
        sceneRef.current.add(directionalLight);
    };
    return (<div className="relative">
      {/* Renderer container */}
      <div ref={containerRef} style={{
            width: `${width}px`,
            height: `${height}px`,
            position: 'relative',
            overflow: 'hidden',
        }}/>
      
      {/* Stats overlay */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
        <div>FPS: {fps}</div>
        <div>Visible Objects: {visibleObjects}</div>
        <div>Culled Objects: {culledObjects}</div>
      </div>
    </div>);
};
export default VirtualRenderingDemo;
