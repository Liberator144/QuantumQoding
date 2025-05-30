/**
 * QQ-TaskVerse Page - Task Management and Project Tracking Universe
 * Middle Orbit Star Module - Advanced task management with quantum design
 * 
 * @version 1.0.0 - Modular Implementation
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// TaskVerse-specific navigation component with quantum design
const TaskVerseNavigation: React.FC<{ activeFeature: string; onFeatureSelect: (feature: string) => void }> = ({ 
    activeFeature, 
    onFeatureSelect 
}) => {
    const features = [
        { id: 'task-dashboard', name: 'Task Dashboard', icon: '📋', color: 'from-green-500 to-teal-500' },
        { id: 'project-management', name: 'Project Management', icon: '🎯', color: 'from-blue-500 to-cyan-500' },
        { id: 'collaboration', name: 'Collaboration Hub', icon: '👥', color: 'from-purple-500 to-pink-500' },
        { id: 'time-tracking', name: 'Time Tracking', icon: '⏱️', color: 'from-orange-500 to-red-500' },
        { id: 'analytics', name: 'Task Analytics', icon: '📊', color: 'from-yellow-500 to-orange-500' }
    ];

    return (
        <div className="flex flex-wrap gap-4 p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-green-500/20">
            {features.map((feature) => (
                <motion.button
                    key={feature.id}
                    onClick={() => onFeatureSelect(feature.id)}
                    className={`
                        relative px-6 py-3 rounded-lg font-medium transition-all duration-300
                        ${activeFeature === feature.id 
                            ? 'bg-gradient-to-r text-white shadow-lg shadow-green-500/25' 
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-lg opacity-0 transition-opacity duration-300 ${
                        activeFeature === feature.id ? 'opacity-100' : 'hover:opacity-20'
                    }`} />
                    <div className="relative flex items-center gap-2">
                        <span className="text-xl">{feature.icon}</span>
                        <span>{feature.name}</span>
                    </div>
                </motion.button>
            ))}
        </div>
    );
};

// TaskVerse Feature Components
const TaskDashboardPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">Task Dashboard</h3>
            <p className="text-gray-300 mb-6">Comprehensive task management and tracking</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">24</div>
                    <div className="text-sm text-gray-400">Active Tasks</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">8</div>
                    <div className="text-sm text-gray-400">In Progress</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">12</div>
                    <div className="text-sm text-gray-400">Pending Review</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">156</div>
                    <div className="text-sm text-gray-400">Completed</div>
                </div>
            </div>

            <div className="space-y-3">
                {[
                    { task: 'Implement QQ-TaskVerse modular architecture', priority: 'High', status: 'In Progress', assignee: 'Dev Team' },
                    { task: 'Design quantum task visualization system', priority: 'Medium', status: 'Planning', assignee: 'UI Team' },
                    { task: 'Set up task analytics dashboard', priority: 'Low', status: 'Backlog', assignee: 'Analytics Team' }
                ].map((task, index) => (
                    <div key={index} className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
                        <div className="text-left">
                            <div className="text-white font-medium">{task.task}</div>
                            <div className="text-sm text-gray-400">{task.assignee}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                                task.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                                task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                            }`}>
                                {task.priority}
                            </span>
                            <span className="text-cyan-400 text-sm">{task.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ProjectManagementPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Project Management</h3>
            <p className="text-gray-300 mb-6">Organize and track project progress</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { name: 'QuantumQonnect Modularization', progress: 75, tasks: 24, team: 'Core Dev Team' },
                    { name: 'Star System Implementation', progress: 45, tasks: 18, team: 'Frontend Team' },
                    { name: 'Backend API Development', progress: 90, tasks: 12, team: 'Backend Team' },
                    { name: 'UI/UX Enhancement', progress: 60, tasks: 15, team: 'Design Team' }
                ].map((project, index) => (
                    <div key={index} className="bg-black/20 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-2">{project.name}</h4>
                        <div className="text-sm text-gray-400 mb-3">{project.team}</div>
                        <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">Progress</span>
                                <span className="text-cyan-400">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-400">{project.tasks} tasks</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CollaborationPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Collaboration Hub</h3>
            <p className="text-gray-300 mb-6">Team communication and collaboration tools</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-4">Team Members</h4>
                    <div className="space-y-3">
                        {[
                            { name: 'Alex Chen', role: 'Lead Developer', status: 'online' },
                            { name: 'Sarah Kim', role: 'UI/UX Designer', status: 'away' },
                            { name: 'Mike Johnson', role: 'Backend Engineer', status: 'online' },
                            { name: 'Lisa Wang', role: 'Project Manager', status: 'offline' }
                        ].map((member, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        member.status === 'online' ? 'bg-green-400' :
                                        member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                                    }`}></div>
                                    <div>
                                        <div className="text-white font-medium">{member.name}</div>
                                        <div className="text-sm text-gray-400">{member.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-black/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                        {[
                            { action: 'Task completed', user: 'Alex Chen', time: '5 min ago' },
                            { action: 'Comment added', user: 'Sarah Kim', time: '12 min ago' },
                            { action: 'File uploaded', user: 'Mike Johnson', time: '1 hour ago' },
                            { action: 'Meeting scheduled', user: 'Lisa Wang', time: '2 hours ago' }
                        ].map((activity, index) => (
                            <div key={index} className="text-sm">
                                <div className="text-white">{activity.action}</div>
                                <div className="text-gray-400">{activity.user} • {activity.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TimeTrackingPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">⏱️</div>
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Time Tracking</h3>
            <p className="text-gray-300 mb-6">Track time spent on tasks and projects</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-400">8h 24m</div>
                    <div className="text-sm text-gray-400">Today</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">42h 15m</div>
                    <div className="text-sm text-gray-400">This Week</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">168h 30m</div>
                    <div className="text-sm text-gray-400">This Month</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-yellow-400">95%</div>
                    <div className="text-sm text-gray-400">Efficiency</div>
                </div>
            </div>
        </div>
    </div>
);

const AnalyticsPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Task Analytics</h3>
            <p className="text-gray-300 mb-6">Insights and analytics on task performance</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-400">92%</div>
                    <div className="text-sm text-gray-400">Completion Rate</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">2.3 days</div>
                    <div className="text-sm text-gray-400">Avg Task Time</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">156</div>
                    <div className="text-sm text-gray-400">Tasks Completed</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-yellow-400">8.7/10</div>
                    <div className="text-sm text-gray-400">Team Satisfaction</div>
                </div>
            </div>
        </div>
    </div>
);

// Main TaskVerse page component
const QQTaskVersePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeFeature, setActiveFeature] = useState('task-dashboard');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Extract current feature from URL
        const pathSegments = location.pathname.split('/');
        const currentFeature = pathSegments[pathSegments.length - 1];
        if (currentFeature && currentFeature !== 'taskverse') {
            setActiveFeature(currentFeature);
        }

        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, [location.pathname]);

    const handleFeatureSelect = (featureId: string) => {
        setActiveFeature(featureId);
        navigate(`/taskverse/${featureId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#050714]">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-t-4 border-green-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-r-4 border-teal-500 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <p className="mt-4 text-lg text-transparent bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text">
                        Initializing TaskVerse...
                    </p>
                    <div className="mt-2 text-sm text-gray-400">
                        Loading Task Management Systems
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-[#050714] overflow-hidden">
            {/* Background effects - preserved quantum design */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 50 }, (_, i) => (
                    <motion.div
                        key={`taskverse-star-${i}`}
                        className="absolute rounded-full bg-green-400"
                        style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.7 + 0.3,
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <motion.div
                className="relative z-10 p-6 text-center border-b border-green-500/20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text">
                    QQ-TaskVerse
                </h1>
                <p className="mt-2 text-lg text-gray-300">
                    Task Management & Project Tracking Universe
                </p>
                <div className="mt-1 text-sm text-green-400">
                    Middle Orbit • Project Management • Team Collaboration
                </div>
            </motion.div>

            {/* Navigation */}
            <div className="relative z-10 p-6">
                <TaskVerseNavigation 
                    activeFeature={activeFeature} 
                    onFeatureSelect={handleFeatureSelect} 
                />
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFeature}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <Routes>
                            <Route path="/" element={<TaskDashboardPage />} />
                            <Route path="/task-dashboard" element={<TaskDashboardPage />} />
                            <Route path="/project-management" element={<ProjectManagementPage />} />
                            <Route path="/collaboration" element={<CollaborationPage />} />
                            <Route path="/time-tracking" element={<TimeTrackingPage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Status indicator */}
            <motion.div
                className="fixed bottom-6 right-6 z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">TaskVerse Active</span>
                </div>
            </motion.div>
        </div>
    );
};

export default QQTaskVersePage;
