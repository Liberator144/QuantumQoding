/**
 * Cosmos Module
 *
 * This module exports all components related to the cosmic visualization interface.
 * These components are organized into four main categories:
 * - central-star: Components related to the central star/hub visualization
 * - orbits: Components that manage orbital paths and mechanisms
 * - planets: Components for planet visualization and interaction
 * - transitions: Components that handle transitions between cosmic views
 */
// Central Star components
export { default as QuantumSphere } from './central-star/QuantumSphere.tsx';
export { StarBackground } from './central-star/StarBackground';
// This structure allows for clean imports like:
// import { QuantumSphere, StarBackground } from './cosmos';
