/**
 * TypeScript Migration
 * Migrated from: ProfileScreen.js
 * @version 2.0.0
 */
/**
 * Profile Screen Component
 *
 * This component provides the user profile interface for the QQ-Verse project,
 * allowing users to view and edit their quantum identity.
 *
 * @version 1.0.0
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/AuthContext';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
/**
 * Profile screen component
 */
const ProfileScreen = () => {
    // Get user from auth context
    const { user, updateProfile } = useAuth();
    const audio = useAudio();
    // State for form inputs
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Handle edit toggle
    const handleEditToggle = () => {
        audio.play('click', { volume: 0.3 });
        setIsEditing(!isEditing);
        setError('');
        setSuccess('');
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSaving(true);
        try {
            // Play sound
            audio.play('quantum-pulse', { volume: 0.5 });
            // Update profile
            await updateProfile({ name, bio });
            // Set success message
            setSuccess('Quantum identity updated successfully');
            setIsEditing(false);
        }
        catch (err) {
            // Play error sound
            audio.play('error', { volume: 0.5 });
            // Set error message
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsSaving(false);
        }
    };
    return (<div className="flex items-center justify-center w-full h-full bg-gray-900">
      <motion.div className="w-full max-w-2xl p-8 bg-gray-800 rounded-lg shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-white">
            Quantum Identity
          </h2>
          <button onClick={handleEditToggle} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        {error && (<div className="p-3 mb-4 text-sm text-red-300 bg-red-900 rounded-md">
            {error}
          </div>)}
        
        {success && (<div className="p-3 mb-4 text-sm text-green-300 bg-green-900 rounded-md">
            {success}
          </div>)}
        
        {isEditing ? (<form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                  Bio
                </label>
                <textarea id="bio" name="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              
              <div>
                <button type="submit" disabled={isSaving} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>) : (<div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-300">Profile Information</h3>
              <div className="mt-2 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Name</p>
                  <p className="mt-1 text-lg text-white">{user?.name || 'Not set'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-400">Email</p>
                  <p className="mt-1 text-lg text-white">{user?.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-400">Bio</p>
                  <p className="mt-1 text-lg text-white">{user?.bio || 'Not set'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-300">Quantum Statistics</h3>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-400">Coherence Level</p>
                  <p className="mt-1 text-2xl font-bold text-blue-400">98%</p>
                </div>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-400">Star Systems</p>
                  <p className="mt-1 text-2xl font-bold text-green-400">5</p>
                </div>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-400">Dimensional Shifts</p>
                  <p className="mt-1 text-2xl font-bold text-purple-400">42</p>
                </div>
              </div>
            </div>
          </div>)}
      </motion.div>
    </div>);
};
export default ProfileScreen;
