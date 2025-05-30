/**
 * Repository Analysis Page - GitHub Repository Analysis Component
 * Part of QQ-DataVerse - Preserves quantum design with enhanced functionality
 * 
 * @version 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repository, AnalyticsData } from '../types/DataVerseTypes';
import { DataVerseAPI } from '../services/DataVerseAPI';

interface RepositoryCardProps {
    repository: Repository;
    onAnalyze: (repo: Repository) => void;
    isAnalyzing: boolean;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository, onAnalyze, isAnalyzing }) => {
    return (
        <motion.div
            className="relative p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            layout
        >
            {/* Repository Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-1">
                        {repository.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                        {repository.fullName}
                    </p>
                    {repository.description && (
                        <p className="text-gray-300 text-sm line-clamp-2">
                            {repository.description}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        repository.isPrivate 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                        {repository.isPrivate ? 'Private' : 'Public'}
                    </span>
                </div>
            </div>

            {/* Repository Stats */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">⭐</div>
                    <div className="text-sm text-gray-400">{repository.stargazersCount}</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">🍴</div>
                    <div className="text-sm text-gray-400">{repository.forksCount}</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-red-400">🐛</div>
                    <div className="text-sm text-gray-400">{repository.openIssuesCount}</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">📊</div>
                    <div className="text-sm text-gray-400">{Math.round(repository.size / 1024)}KB</div>
                </div>
            </div>

            {/* Language and Topics */}
            <div className="mb-4">
                {repository.language && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                        <span className="text-sm text-gray-300">{repository.language}</span>
                    </div>
                )}
                {repository.topics && repository.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {repository.topics.slice(0, 3).map((topic) => (
                            <span
                                key={topic}
                                className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                            >
                                {topic}
                            </span>
                        ))}
                        {repository.topics.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded-full">
                                +{repository.topics.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Analyze Button */}
            <motion.button
                onClick={() => onAnalyze(repository)}
                disabled={isAnalyzing}
                className={`
                    w-full py-2 px-4 rounded-lg font-medium transition-all duration-300
                    ${isAnalyzing 
                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
                    }
                `}
                whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
                whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
            >
                {isAnalyzing ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-t-2 border-gray-400 rounded-full animate-spin"></div>
                        Analyzing...
                    </div>
                ) : (
                    'Analyze Repository'
                )}
            </motion.button>
        </motion.div>
    );
};

export const RepositoryAnalysisPage: React.FC = () => {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
    const [analysisData, setAnalysisData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const dataVerseAPI = new DataVerseAPI();

    useEffect(() => {
        loadRepositories();
    }, []);

    const loadRepositories = async () => {
        try {
            setLoading(true);
            const repos = await dataVerseAPI.getRepositories();
            setRepositories(repos);
        } catch (error) {
            console.error('Failed to load repositories:', error);
            // Mock data for development
            setRepositories([
                {
                    id: '1',
                    name: 'QuantumQoding',
                    fullName: 'Liberator144/QuantumQoding',
                    description: 'Advanced quantum-coherent development platform with AI integration',
                    url: 'https://api.github.com/repos/Liberator144/QuantumQoding',
                    htmlUrl: 'https://github.com/Liberator144/QuantumQoding',
                    cloneUrl: 'https://github.com/Liberator144/QuantumQoding.git',
                    sshUrl: 'git@github.com:Liberator144/QuantumQoding.git',
                    language: 'TypeScript',
                    languages: { TypeScript: 85, JavaScript: 10, CSS: 5 },
                    stargazersCount: 42,
                    forksCount: 8,
                    watchersCount: 15,
                    openIssuesCount: 3,
                    size: 15420,
                    defaultBranch: 'main',
                    isPrivate: false,
                    isFork: false,
                    isArchived: false,
                    createdAt: '2024-01-15T10:30:00Z',
                    updatedAt: '2024-12-19T14:22:00Z',
                    pushedAt: '2024-12-19T14:22:00Z',
                    owner: {
                        id: 'liberator144',
                        login: 'Liberator144',
                        avatarUrl: 'https://avatars.githubusercontent.com/u/liberator144',
                        type: 'User'
                    },
                    topics: ['quantum', 'ai', 'development', 'typescript', 'react'],
                    license: {
                        key: 'mit',
                        name: 'MIT License',
                        spdxId: 'MIT'
                    }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeRepository = async (repository: Repository) => {
        try {
            setAnalyzing(true);
            setSelectedRepo(repository);
            
            // Simulate analysis delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const analysis = await dataVerseAPI.analyzeRepository(repository.id);
            setAnalysisData(analysis);
        } catch (error) {
            console.error('Failed to analyze repository:', error);
            // Mock analysis data
            setAnalysisData({
                repository,
                metrics: {
                    codeQuality: {
                        score: 85,
                        issues: 12,
                        complexity: 3.2,
                        maintainability: 78,
                        testCoverage: 65
                    },
                    activity: {
                        commits: 156,
                        contributors: 3,
                        pullRequests: 24,
                        issues: 18,
                        releases: 5
                    },
                    performance: {
                        buildTime: 45,
                        testTime: 12,
                        deploymentFrequency: 2.5,
                        leadTime: 1.2,
                        mttr: 0.8
                    },
                    community: {
                        stars: repository.stargazersCount,
                        forks: repository.forksCount,
                        watchers: repository.watchersCount,
                        discussions: 8,
                        contributors: 3
                    }
                },
                trends: {
                    commits: [],
                    issues: [],
                    pullRequests: [],
                    contributors: []
                },
                insights: [],
                lastAnalyzed: new Date().toISOString()
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const filteredRepositories = repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-64">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-t-4 border-cyan-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-cyan-400">Loading repositories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Repository Analysis</h2>
                <p className="text-gray-300">Analyze GitHub repositories with comprehensive metrics and insights</p>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
            </div>

            {/* Repository Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredRepositories.map((repo) => (
                        <RepositoryCard
                            key={repo.id}
                            repository={repo}
                            onAnalyze={handleAnalyzeRepository}
                            isAnalyzing={analyzing && selectedRepo?.id === repo.id}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Analysis Results */}
            {analysisData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20"
                >
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">
                        Analysis Results: {analysisData.repository.name}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">
                                {analysisData.metrics.codeQuality.score}
                            </div>
                            <div className="text-sm text-gray-400">Code Quality</div>
                        </div>
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">
                                {analysisData.metrics.activity.commits}
                            </div>
                            <div className="text-sm text-gray-400">Commits</div>
                        </div>
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">
                                {analysisData.metrics.activity.contributors}
                            </div>
                            <div className="text-sm text-gray-400">Contributors</div>
                        </div>
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">
                                {analysisData.metrics.codeQuality.testCoverage}%
                            </div>
                            <div className="text-sm text-gray-400">Test Coverage</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
