/**
 * Components Module
 *
 * This module exports all reusable UI components organized by their category.
 * Components are divided into three main categories:
 * - common: Generic UI components that can be used across the application
 * - layout: Components that define the application's layout structure
 * - quantum: Specialized quantum-themed UI components
 */

// Layout components
export { Header } from './layout/Header';

// Quantum components
export { StardustCursor } from './quantum/StardustCursor';

// This structure allows for clean imports like:
// import { Header, StardustCursor } from './components';