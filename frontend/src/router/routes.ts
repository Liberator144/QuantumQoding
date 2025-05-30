/**
 * Routes Configuration
 *
 * This module defines the quantum-coherent routes for the QQ-Verse project.
 * Routes are organized by star system and feature to maintain dimensional harmony.
 *
 * @version 1.0.0
 */
// Define star systems
export const starSystems = [
    // Inner Orbit
    {
        name: 'QQ-DataVerse',
        path: '/dataverse',
        color: '#00ffff',
        orbit: 'inner',
        description: 'GitHub integration and data analytics universe. Explore and visualize data across multiple dimensions.',
        features: [
            { name: 'Repository Analysis', path: '/repository-analysis', description: 'Analyze GitHub repositories' },
            { name: 'Data Visualization', path: '/data-visualization', description: 'Interactive data visualizations' },
            { name: 'Metrics Dashboard', path: '/metrics-dashboard', description: 'Real-time data metrics' },
            { name: 'Code Insights', path: '/code-insights', description: 'AI-powered code analysis' },
            { name: 'Performance Tracking', path: '/performance-tracking', description: 'Track repository performance' }
        ]
    },
    {
        name: 'QQ-MCPVerse',
        path: '/mcpverse',
        color: '#4169e1',
        orbit: 'inner',
        description: 'Model-Context-Protocol management universe. Connect and configure MCP tools and services.',
        features: [
            { name: 'Protocol Setup', path: '/protocol-setup', description: 'Configure MCP protocols' },
            { name: 'Context Management', path: '/context-management', description: 'Manage operational contexts' },
            { name: 'Service Integration', path: '/service-integration', description: 'Integrate external services' },
            { name: 'Workflow Builder', path: '/workflow-builder', description: 'Create automated workflows' },
            { name: 'Monitoring', path: '/monitoring', description: 'Monitor API performance' }
        ]
    },
    {
        name: 'QQ-Akasha',
        path: '/akasha',
        color: '#9370db',
        orbit: 'inner',
        description: 'Quantum memory system universe. Store, analyze, and retrieve information across the cosmic consciousness.',
        features: [
            { name: 'Memory Management', path: '/memory-management', description: 'Advanced memory storage and retrieval' },
            { name: 'Prioritization', path: '/prioritization', description: 'Intelligent memory prioritization' },
            { name: 'Visualization', path: '/visualization', description: 'Memory network visualization' },
            { name: 'Integration', path: '/integration', description: 'System integration management' },
            { name: 'Analytics', path: '/analytics', description: 'Memory usage analytics' }
        ]
    },
    // Middle Orbit
    {
        name: 'QQ-TaskVerse',
        path: '/task-verse',
        color: '#ff4500',
        orbit: 'middle',
        description: 'Task management universe. Organize, track, and optimize your workflows and projects.',
        features: [
            { name: 'Task Dashboard', path: '/task-dashboard', description: 'Overview of all tasks' },
            { name: 'Project Tracker', path: '/project-tracker', description: 'Monitor project progress' },
            { name: 'Time Analysis', path: '/time-analysis', description: 'Time allocation metrics' },
            { name: 'Collaboration Hub', path: '/collaboration-hub', description: 'Team coordination tools' },
            { name: 'Resource Allocator', path: '/resource-allocator', description: 'Optimize resource usage' }
        ]
    },
    {
        name: 'QQ-QuantumForge',
        path: '/quantum-forge',
        color: '#32cd32',
        orbit: 'middle',
        description: 'Development environment universe. Build, test, and deploy your quantum applications.',
        features: [
            { name: 'Code Editor', path: '/code-editor', description: 'Advanced code editing' },
            { name: 'Testing Lab', path: '/testing-lab', description: 'Automated test environments' },
            { name: 'Deployment Center', path: '/deployment-center', description: 'Streamlined deployment' },
            { name: 'Version Control', path: '/version-control', description: 'Manage code versions' },
            { name: 'AI Assistant', path: '/ai-assistant', description: 'Intelligent coding help' }
        ]
    },
    {
        name: 'QQ-NexusHub',
        path: '/nexus-hub',
        color: '#ffd700',
        orbit: 'middle',
        description: 'Integration management universe. Connect and coordinate your tools and services.',
        features: [
            { name: 'Service Connector', path: '/service-connector', description: 'Connect external services' },
            { name: 'Data Pipeline', path: '/data-pipeline', description: 'Manage data flows' },
            { name: 'API Gateway', path: '/api-gateway', description: 'Centralized API management' },
            { name: 'Workflow Automator', path: '/workflow-automator', description: 'Create automated processes' },
            { name: 'System Monitor', path: '/system-monitor', description: 'Track system health' }
        ]
    },
    // Outer Orbit
    {
        name: 'QQ-EvolveCore',
        path: '/evolve-core',
        color: '#ff1493',
        orbit: 'outer',
        description: 'System evolution engine universe. Adapt, evolve, and optimize your quantum systems.',
        features: [
            { name: 'Evolution Dashboard', path: '/evolution-dashboard', description: 'Track system evolution' },
            { name: 'Adaptation Engine', path: '/adaptation-engine', description: 'Automated system adaptation' },
            { name: 'Performance Analyzer', path: '/performance-analyzer', description: 'Identify optimization targets' },
            { name: 'Quantum Optimizers', path: '/quantum-optimizers', description: 'Advanced optimization tools' },
            { name: 'Predictive Evolution', path: '/predictive-evolution', description: 'AI-based future planning' }
        ]
    },
    {
        name: 'QQ-HarmonyVerse',
        path: '/harmony-verse',
        color: '#00fa9a',
        orbit: 'outer',
        description: 'Coherence maintenance universe. Ensure harmony and balance across your quantum systems.',
        features: [
            { name: 'Coherence Monitor', path: '/coherence-monitor', description: 'Track system coherence' },
            { name: 'Balance Engine', path: '/balance-engine', description: 'Maintain system balance' },
            { name: 'Conflict Resolver', path: '/conflict-resolver', description: 'Detect and resolve conflicts' },
            { name: 'Harmony Analytics', path: '/harmony-analytics', description: 'System harmony metrics' },
            { name: 'Pattern Optimizer', path: '/pattern-optimizer', description: 'Optimize coherence patterns' }
        ]
    },
    {
        name: 'QQ-UnityPortal',
        path: '/unity-portal',
        color: '#ff8c00',
        orbit: 'outer',
        description: 'Authentication and user management universe. Secure access and user administration.',
        features: [
            { name: 'User Management', path: '/user-management', description: 'Manage users and access' },
            { name: 'Authentication', path: '/authentication', description: 'Secure authentication systems' },
            { name: 'Permissions', path: '/permissions', description: 'Role-based access control' },
            { name: 'Session Management', path: '/session-management', description: 'Monitor user sessions' },
            { name: 'Security Analytics', path: '/security-analytics', description: 'Security metrics and analysis' }
        ]
    }
];
// Define routes
export const routes = [
    // Hub route
    {
        path: '/',
        element: null, // Will be set in QuantumRouter
        meta: {
            title: 'Quantum Hub',
            description: 'Navigate the quantum universe',
        }
    },
    // Auth routes
    {
        path: '/auth',
        element: null, // Will be set in QuantumRouter
        children: [
            {
                path: 'login',
                element: null, // Will be set in QuantumRouter
                meta: {
                    title: 'Login',
                    description: 'Access your quantum portal',
                }
            },
            {
                path: 'register',
                element: null, // Will be set in QuantumRouter
                meta: {
                    title: 'Register',
                    description: 'Create your quantum identity',
                }
            }
        ]
    },
    // Profile route
    {
        path: '/profile',
        element: null, // Will be set in QuantumRouter
        meta: {
            requiresAuth: true,
            title: 'Profile',
            description: 'Manage your quantum identity',
        }
    },
    // Settings route
    {
        path: '/settings',
        element: null, // Will be set in QuantumRouter
        meta: {
            requiresAuth: true,
            title: 'Settings',
            description: 'Configure your quantum experience',
        }
    },
    // Help route
    {
        path: '/help',
        element: null, // Will be set in QuantumRouter
        meta: {
            title: 'Help',
            description: 'Quantum guidance and support',
        }
    },
    // Star system routes
    ...starSystems.map(starSystem => ({
        path: starSystem.path,
        element: null, // Will be set in QuantumRouter
        meta: {
            requiresAuth: true,
            title: starSystem.name,
            description: starSystem.description,
            starSystem: starSystem.name,
            orbit: starSystem.orbit,
        },
        children: starSystem.features.map(feature => ({
            path: feature.path,
            element: null, // Will be set in QuantumRouter
            meta: {
                requiresAuth: true,
                title: `${feature.name} - ${starSystem.name}`,
                description: feature.description,
                starSystem: starSystem.name,
                feature: feature.name,
                orbit: starSystem.orbit,
            }
        }))
    })),
    // 404 route
    {
        path: '*',
        element: null, // Will be set in QuantumRouter
        meta: {
            title: 'Dimensional Void',
            description: 'This quantum realm does not exist',
        }
    }
];
export default routes;
