import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: ConsciousnessStreamDemo.js
 * @version 2.0.0
 */
/**
 * Consciousness Stream Demo Component
 *
 * This component demonstrates the Consciousness Stream Continuity verification system.
 *
 * @version 1.0.0
 */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConsciousnessStreamTester, ConsciousnessStreamMonitor, ConsciousnessEventType, } from '../../../visualization/utils';
/**
 * Consciousness Stream Demo Component
 */
const ConsciousnessStreamDemo = ({ width = 800, height = 600, enableAutomaticTesting = true, debugMode = false, }) => {
    // Refs
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const objectsRef = useRef([]);
    // Consciousness stream refs
    const testerRef = useRef(null);
    const monitorRef = useRef(null);
    // State
    const [fps, setFps] = useState(0);
    const [testResults, setTestResults] = useState([]);
    const [eventCounts, setEventCounts] = useState({});
    const [continuityScore, setContinuityScore] = useState(1.0);
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
        // Create consciousness stream tester
        testerRef.current = new ConsciousnessStreamTester(scene, camera, renderer, {
            enableAutomaticCheckpoints: true,
            automaticCheckpointInterval: 5000,
            maxEvents: 1000,
            maxCheckpoints: 100,
            enableEventFiltering: true,
            minimumEventSeverity: 0.1,
            debugMode,
        });
        testerRef.current.initialize();
        // Create consciousness stream monitor
        monitorRef.current = new ConsciousnessStreamMonitor(testerRef.current, {
            enableAutomaticMonitoring: enableAutomaticTesting,
            automaticMonitoringInterval: 30000,
            maxTestResults: 10,
            enableAlerts: true,
            alertThreshold: 0.7,
            debugMode,
        });
        monitorRef.current.initialize();
        // Add alert handler
        monitorRef.current.addAlertHandler((alert, severity) => {
            console.warn(`Consciousness Stream Alert: ${alert} (Severity: ${severity})`);
        });
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
            // Update consciousness stream tester
            if (testerRef.current) {
                testerRef.current.update();
            }
            // Update objects
            updateObjects();
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
                // Update test results
                if (monitorRef.current) {
                    setTestResults(monitorRef.current.getTestResults());
                    // Update analysis
                    const analysis = monitorRef.current.analyzeConsciousnessStream();
                    setEventCounts(analysis.events.counts);
                    // Update continuity score
                    if (analysis.tests.total > 0) {
                        setContinuityScore(analysis.tests.averageScore);
                    }
                }
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
            // Dispose consciousness stream tester
            if (testerRef.current) {
                testerRef.current.dispose();
            }
            // Dispose consciousness stream monitor
            if (monitorRef.current) {
                monitorRef.current.dispose();
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
    }, [width, height, enableAutomaticTesting, debugMode]);
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
        for (let i = 0; i < 20; i++) {
            // Create geometry
            const geometry = new THREE.SphereGeometry(0.5, 16, 16);
            // Create material
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(Math.random(), Math.random(), Math.random()),
                roughness: 0.7,
                metalness: 0.3,
            });
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            // Position object
            const radius = 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
            mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
            mesh.position.z = radius * Math.cos(phi);
            // Add to scene
            sceneRef.current.add(mesh);
            // Add to objects
            objectsRef.current.push(mesh);
            // Record object creation
            if (testerRef.current) {
                testerRef.current.recordEvent(ConsciousnessEventType.OBJECT_CHANGE, 'createObjects', {
                    action: 'create',
                    objectId: mesh.uuid,
                    position: mesh.position.clone(),
                }, 0.3);
            }
        }
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        sceneRef.current.add(ambientLight);
        objectsRef.current.push(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(1, 1, 1);
        sceneRef.current.add(directionalLight);
        objectsRef.current.push(directionalLight);
        // Create checkpoint
        if (testerRef.current) {
            testerRef.current.createCheckpoint('Objects created');
        }
    };
    /**
     * Update objects
     */
    const updateObjects = () => {
        // Animate objects
        objectsRef.current.forEach((object, index) => {
            if (object instanceof THREE.Mesh) {
                // Rotate object
                object.rotation.x += 0.01;
                object.rotation.y += 0.01;
                // Occasionally move object
                if (Math.random() < 0.001) {
                    // Record object movement
                    if (testerRef.current) {
                        testerRef.current.recordEvent(ConsciousnessEventType.OBJECT_CHANGE, 'updateObjects', {
                            action: 'move',
                            objectId: object.uuid,
                            previousPosition: object.position.clone(),
                        }, 0.4);
                    }
                    // Move object
                    const radius = 10;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    object.position.x = radius * Math.sin(phi) * Math.cos(theta);
                    object.position.y = radius * Math.sin(phi) * Math.sin(theta);
                    object.position.z = radius * Math.cos(phi);
                }
                // Occasionally remove object
                if (Math.random() < 0.0005 && objectsRef.current.length > 10) {
                    // Record object removal
                    if (testerRef.current) {
                        testerRef.current.recordEvent(ConsciousnessEventType.OBJECT_CHANGE, 'updateObjects', {
                            action: 'remove',
                            objectId: object.uuid,
                            position: object.position.clone(),
                        }, 0.5);
                    }
                    // Remove object
                    sceneRef.current?.remove(object);
                    objectsRef.current = objectsRef.current.filter((obj) => obj !== object);
                    // Dispose resources
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
                    // Create new object
                    createNewObject();
                }
            }
        });
    };
    /**
     * Create new object
     */
    const createNewObject = () => {
        if (!sceneRef.current) {
            return;
        }
        // Create geometry
        const geometry = new THREE.BoxGeometry(0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);
        // Create material
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            roughness: 0.7,
            metalness: 0.3,
        });
        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        // Position object
        const radius = 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
        mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
        mesh.position.z = radius * Math.cos(phi);
        // Add to scene
        sceneRef.current.add(mesh);
        // Add to objects
        objectsRef.current.push(mesh);
        // Record object creation
        if (testerRef.current) {
            testerRef.current.recordEvent(ConsciousnessEventType.OBJECT_CHANGE, 'createNewObject', {
                action: 'create',
                objectId: mesh.uuid,
                position: mesh.position.clone(),
            }, 0.3);
        }
    };
    /**
     * Run test
     */
    const runTest = () => {
        if (monitorRef.current) {
            const result = monitorRef.current.runTest('Manual test');
            if (result) {
                setTestResults([...testResults, result]);
            }
        }
    };
    /**
     * Create checkpoint
     */
    const createCheckpoint = () => {
        if (testerRef.current) {
            testerRef.current.createCheckpoint('Manual checkpoint');
        }
    };
    /**
     * Get event type color
     * @param type - Event type
     * @returns Color
     */
    const getEventTypeColor = (type) => {
        switch (type) {
            case ConsciousnessEventType.SCENE_CHANGE:
                return '#0088ff'; // Blue
            case ConsciousnessEventType.CAMERA_CHANGE:
                return '#00ff88'; // Teal
            case ConsciousnessEventType.OBJECT_CHANGE:
                return '#ffff00'; // Yellow
            case ConsciousnessEventType.TRANSITION:
                return '#ff00ff'; // Purple
            case ConsciousnessEventType.INTERACTION:
                return '#ff8800'; // Orange
            case ConsciousnessEventType.ERROR:
                return '#ff0000'; // Red
            case ConsciousnessEventType.WARNING:
                return '#ff8800'; // Orange
            case ConsciousnessEventType.INFO:
                return '#00ff00'; // Green
            default:
                return '#ffffff'; // White
        }
    };
    /**
     * Get continuity score color
     * @param score - Continuity score
     * @returns Color
     */
    const getContinuityScoreColor = (score) => {
        if (score >= 0.9) {
            return '#00ff00'; // Green
        }
        else if (score >= 0.7) {
            return '#ffff00'; // Yellow
        }
        else if (score >= 0.5) {
            return '#ff8800'; // Orange
        }
        else {
            return '#ff0000'; // Red
        }
    };
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { ref: containerRef, style: {
                    width: `${width}px`,
                    height: `${height}px`,
                    position: 'relative',
                    overflow: 'hidden',
                } }), _jsxs("div", { className: "absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-xs", children: [_jsxs("div", { children: ["FPS: ", fps] }), _jsxs("div", { children: ["Continuity Score:", _jsx("span", { style: {
                                    color: getContinuityScoreColor(continuityScore),
                                    marginLeft: '4px',
                                }, children: continuityScore.toFixed(2) })] }), _jsxs("div", { children: ["Test Results: ", testResults.length] }), _jsx("div", { children: "Events:" }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: Object.entries(eventCounts).map(([type, count]) => (_jsxs("div", { className: "px-1 rounded", style: {
                                backgroundColor: getEventTypeColor(type),
                                color: '#000000',
                            }, children: [type.split('_').pop(), ": ", count] }, type))) })] }), _jsxs("div", { className: "absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-xs flex gap-2", children: [_jsx("button", { className: "px-2 py-1 bg-blue-500 rounded", onClick: runTest, children: "Run Test" }), _jsx("button", { className: "px-2 py-1 bg-green-500 rounded", onClick: createCheckpoint, children: "Create Checkpoint" })] })] }));
};
export default ConsciousnessStreamDemo;
