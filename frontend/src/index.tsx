/**
 * Application Entry Point
 * 
 * This file serves as the main entry point for the QQ-Verse React application,
 * initializing the React root and rendering the App component.
 * 
 * @version 2.0.0
 */
import './index.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// Get the root element
const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element not found');
}

// Create root and render app
const root = createRoot(container);
root.render(<App />);

// Add loaded class to body for styling
document.body.classList.add('app-loaded');