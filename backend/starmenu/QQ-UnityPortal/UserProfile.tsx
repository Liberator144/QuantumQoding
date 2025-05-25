import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { UserPreferences } from '../lib/types/auth';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.preferences || {
      theme: 'quantum',
      animationLevel: 'high',
      notifications: true,
      dataVisibility: true,
      uiDensity: 'comfortable',
    }
  );

  const handleSavePreferences = async () => {
    if (!user) return;
    
    try {
      await updateUser({
        preferences
      });
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed top-20 right-6 w-96 backdrop-blur-lg rounded-lg overflow-hidden border border-cyan-400/20 bg-black/40 z-50"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-cyan-400/20">
            <h2 className="text-xl font-light bg-gradient-to-r from-cyan-300 to-purple-300 text-transparent bg-clip-text">
              Quantum Profile
            </h2>
            <button
              onClick={onClose}
              className="text-cyan-400/60 hover:text-cyan-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-cyan-400/20">
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'text-cyan-300 border-b-2 border-cyan-400'
                  : 'text-cyan-400/60 hover:text-cyan-400'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="flex items-center justify-center gap-2">
                <User size={16} />
                Profile
              </span>
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'preferences'
                  ? 'text-cyan-300 border-b-2 border-cyan-400'
                  : 'text-cyan-400/60 hover:text-cyan-400'
              }`}
              onClick={() => setActiveTab('preferences')}
            >
              <span className="flex items-center justify-center gap-2">
                <Settings size={16} />
                Preferences
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === 'profile' ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                    {user.username.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg text-cyan-200">{user.username}</h3>
                    <p className="text-sm text-cyan-400/60">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-300">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-400/60">Member since</span>
                    <span className="text-cyan-200">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-400/60">Last login</span>
                    <span className="text-cyan-200">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 py-2 rounded transition-colors"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm text-cyan-400/80">UI Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        theme: e.target.value as UserPreferences['theme'],
                      })
                    }
                    className="w-full bg-black/20 border border-cyan-400/20 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400/40"
                  >
                    <option value="default">Default</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="quantum">Quantum</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-cyan-400/80">Animation Level</label>
                  <select
                    value={preferences.animationLevel}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        animationLevel: e.target.value as UserPreferences['animationLevel'],
                      })
                    }
                    className="w-full bg-black/20 border border-cyan-400/20 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400/40"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-cyan-400/80">UI Density</label>
                  <select
                    value={preferences.uiDensity}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        uiDensity: e.target.value as UserPreferences['uiDensity'],
                      })
                    }
                    className="w-full bg-black/20 border border-cyan-400/20 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400/40"
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-cyan-400/80">Notifications</label>
                  <div
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                      preferences.notifications ? 'bg-cyan-500/50' : 'bg-gray-700'
                    }`}
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        notifications: !preferences.notifications,
                      })
                    }
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full"
                      animate={{ translateX: preferences.notifications ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-cyan-400/80">Data Visibility</label>
                  <div
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                      preferences.dataVisibility ? 'bg-cyan-500/50' : 'bg-gray-700'
                    }`}
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        dataVisibility: !preferences.dataVisibility,
                      })
                    }
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full"
                      animate={{ translateX: preferences.dataVisibility ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="mt-4 w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
