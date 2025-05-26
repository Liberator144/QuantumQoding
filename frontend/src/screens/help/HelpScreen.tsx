import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: HelpScreen.js
 * @version 2.0.0
 */
/**
 * Help Screen Component
 *
 * This component provides the help and documentation interface for the QQ-Verse project,
 * offering guidance on using the quantum universe.
 *
 * @version 1.0.0
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
/**
 * Help screen component
 */
const HelpScreen = () => {
    // State for selected topic
    const [selectedTopic, setSelectedTopic] = useState(null);
    // Get audio
    const audio = useAudio();
    // Handle topic selection
    const handleTopicSelect = (topicId) => {
        audio.play('click', { volume: 0.3 });
        setSelectedTopic(topicId);
    };
    // Help topics
    const helpTopics = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            content: `
        <h3>Welcome to QQ-Verse</h3>
        <p>QQ-Verse is a quantum-coherent universe that allows you to navigate between different star systems and features.</p>
        <p>To get started, use the central Quantum Sphere to navigate to different star systems. Each star represents a different module or feature set.</p>
        <h4>Key Concepts</h4>
        <ul>
          <li><strong>Star Systems</strong>: Different modules or feature sets</li>
          <li><strong>Quantum Coherence</strong>: The seamless flow of information between different parts of the system</li>
          <li><strong>Dimensional Boundaries</strong>: Transitions between different star systems</li>
        </ul>
      `
        },
        {
            id: 'navigation',
            title: 'Navigation',
            content: `
        <h3>Navigating the Quantum Universe</h3>
        <p>QQ-Verse uses a unique navigation system based on a cosmic metaphor.</p>
        <h4>Hub Navigation</h4>
        <p>The central hub displays a 3D visualization of the star system. Click on any star to navigate to that system.</p>
        <h4>Star System Navigation</h4>
        <p>Within each star system, you'll find a list of features. Click on any feature to access it.</p>
        <h4>Keyboard Shortcuts</h4>
        <ul>
          <li><strong>H</strong>: Return to hub</li>
          <li><strong>Esc</strong>: Go back</li>
          <li><strong>1-9</strong>: Quick access to star systems</li>
        </ul>
      `
        },
        {
            id: 'star-systems',
            title: 'Star Systems',
            content: `
        <h3>Star Systems Overview</h3>
        <p>QQ-Verse contains multiple star systems, each representing a different module or feature set.</p>
        <h4>Inner Orbit</h4>
        <ul>
          <li><strong>QQ-DataVerse</strong>: GitHub integration and data analytics</li>
          <li><strong>QQ-MCPVerse</strong>: Model-Context-Protocol management</li>
          <li><strong>QQ-Akasha</strong>: Quantum memory system</li>
        </ul>
        <h4>Middle Orbit</h4>
        <ul>
          <li><strong>QQ-TaskVerse</strong>: Task management</li>
          <li><strong>QQ-QuantumForge</strong>: Development environment</li>
          <li><strong>QQ-NexusHub</strong>: Integration management</li>
        </ul>
        <h4>Outer Orbit</h4>
        <ul>
          <li><strong>QQ-EvolveCore</strong>: System evolution engine</li>
          <li><strong>QQ-HarmonyVerse</strong>: Coherence maintenance</li>
          <li><strong>QQ-UnityPortal</strong>: Community ecosystem</li>
        </ul>
      `
        },
        {
            id: 'account',
            title: 'Account Management',
            content: `
        <h3>Managing Your Quantum Identity</h3>
        <p>Your quantum identity is your profile within the QQ-Verse.</p>
        <h4>Profile</h4>
        <p>Access your profile by clicking on your avatar in the top-right corner. Here you can update your name, bio, and other information.</p>
        <h4>Settings</h4>
        <p>Access settings by clicking on the gear icon in the top-right corner. Here you can configure your quantum experience, including theme, animations, sounds, and more.</p>
        <h4>Security</h4>
        <p>We recommend using a strong password and enabling two-factor authentication for your account.</p>
      `
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            content: `
        <h3>Common Issues and Solutions</h3>
        <h4>Quantum Decoherence</h4>
        <p>If you experience "quantum decoherence" (unexpected behavior), try the following:</p>
        <ul>
          <li>Refresh the page</li>
          <li>Clear your browser cache</li>
          <li>Ensure your browser is up to date</li>
          <li>Check your internet connection</li>
        </ul>
        <h4>Performance Issues</h4>
        <p>If you experience performance issues, try disabling animations and dimensional effects in the settings.</p>
        <h4>Contact Support</h4>
        <p>If you continue to experience issues, please contact our support team at support@qq-verse.com.</p>
      `
        }
    ];
    // Get selected topic
    const selectedTopicData = selectedTopic
        ? helpTopics.find(topic => topic.id === selectedTopic)
        : null;
    return (_jsx("div", { className: "flex w-full h-full bg-gray-900", children: _jsxs(motion.div, { className: "w-full max-w-6xl p-8 mx-auto bg-gray-800 rounded-lg shadow-lg", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-3xl font-extrabold text-white", children: "Quantum Guidance" }), _jsx("p", { className: "mt-2 text-sm text-gray-400", children: "Help and documentation for navigating the quantum universe" })] }), _jsxs("div", { className: "flex h-full", children: [_jsxs("div", { className: "w-1/4 pr-4", children: [_jsx("h3", { className: "mb-4 text-lg font-medium text-gray-300", children: "Topics" }), _jsx("ul", { className: "space-y-2", children: helpTopics.map(topic => (_jsx("li", { children: _jsx("button", { onClick: () => handleTopicSelect(topic.id), className: `w-full px-3 py-2 text-left rounded-md ${selectedTopic === topic.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700'}`, children: topic.title }) }, topic.id))) })] }), _jsx("div", { className: "w-3/4 pl-4 border-l border-gray-700", children: selectedTopicData ? (_jsxs("div", { children: [_jsx("h2", { className: "mb-4 text-2xl font-bold text-white", children: selectedTopicData.title }), _jsx("div", { className: "prose prose-invert max-w-none", dangerouslySetInnerHTML: { __html: selectedTopicData.content } })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [_jsx("h3", { className: "text-xl font-medium text-gray-300", children: "Select a topic to get started" }), _jsx("p", { className: "mt-2 text-gray-400", children: "Choose a topic from the sidebar to view help content" })] })) })] })] }) }));
};
export default HelpScreen;
