// app/profile/settings/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  getUserPreferences, 
  updateUserPreferences, 
  createUserPreferences 
} from '@/lib/database';
import { 
  User,
  Bell,
  Palette,
  Target,
  Download,
  Trash2,
  Save,
  LogOut,
  Shield,
  Mail,
  Settings,
  Moon,
  Sun,
  Smartphone,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { isDark, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    preferred_papers: ['paper1'],
    daily_goal: 10,
    notifications_enabled: true,
    email_notifications: false,
    weekly_summary: true,
    theme_preference: 'system'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (session?.user?.googleId || session?.user?.id) {
      fetchPreferences();
    }
  }, [session?.user?.googleId, session?.user?.id]);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use googleId if available, otherwise fallback to id
      const userId = session.user.googleId || session.user.id;
      const userPrefs = await getUserPreferences(userId);
      if (userPrefs) {
        setPreferences(userPrefs);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // Don't show error for first time users who don't have preferences yet
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage('');
      
      // Use googleId if available, otherwise fallback to id
      const userId = session.user.googleId || session.user.id;
      
      // Try to update first, if it fails, create new preferences
      try {
        await updateUserPreferences(userId, preferences);
      } catch (updateError) {
        // If update fails, try to create new preferences
        await createUserPreferences(userId, preferences);
      }
      
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePaperToggle = (paper) => {
    setPreferences(prev => ({
      ...prev,
      preferred_papers: prev.preferred_papers.includes(paper)
        ? prev.preferred_papers.filter(p => p !== paper)
        : [...prev.preferred_papers, paper]
    }));
  };

  const exportData = async () => {
    try {
      // This would typically call an API to export all user data
      const exportData = {
        user: {
          name: session.user.name,
          email: session.user.email,
          created_at: session.user.createdAt
        },
        preferences,
        export_date: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profile-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data. Please try again.');
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const SettingCard = ({ title, description, children, icon: Icon }) => (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
          <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );

  const Toggle = ({ enabled, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center p-8">
              <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
              <p className="text-gray-700 dark:text-gray-300">Loading settings...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account preferences and study settings
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <p className="text-emerald-600 dark:text-emerald-400 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Settings Sections */}
          <div className="space-y-6">
            
            {/* Profile Information */}
            <SettingCard
              title="Profile Information"
              description="Your basic account information"
              icon={User}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={session?.user?.name || ''}
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={session?.user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </SettingCard>

            {/* Study Preferences */}
            <SettingCard
              title="Study Preferences"
              description="Customize your learning experience"
              icon={BookOpen}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Preferred Papers
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'paper1', name: 'Paper 1', desc: 'Energy Management' },
                      { id: 'paper2', name: 'Paper 2', desc: 'Thermal Utilities' },
                      { id: 'paper3', name: 'Paper 3', desc: 'Electrical Utilities' }
                    ].map((paper) => (
                      <label
                        key={paper.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          preferences.preferred_papers?.includes(paper.id)
                            ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/30'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={preferences.preferred_papers?.includes(paper.id)}
                          onChange={() => handlePaperToggle(paper.id)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{paper.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{paper.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Daily Question Goal: {preferences.daily_goal}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={preferences.daily_goal}
                    onChange={(e) => setPreferences(prev => ({ ...prev, daily_goal: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>5</span>
                    <span>25</span>
                    <span>50</span>
                  </div>
                </div>
              </div>
            </SettingCard>

            {/* Notifications */}
            <SettingCard
              title="Notifications"
              description="Manage how you receive updates and reminders"
              icon={Bell}
            >
              <div className="space-y-4">
                <Toggle
                  enabled={preferences.notifications_enabled}
                  onChange={(value) => setPreferences(prev => ({ ...prev, notifications_enabled: value }))}
                  label="Browser notifications"
                />
                <Toggle
                  enabled={preferences.email_notifications}
                  onChange={(value) => setPreferences(prev => ({ ...prev, email_notifications: value }))}
                  label="Email notifications"
                />
                <Toggle
                  enabled={preferences.weekly_summary}
                  onChange={(value) => setPreferences(prev => ({ ...prev, weekly_summary: value }))}
                  label="Weekly progress summary"
                />
              </div>
            </SettingCard>

            {/* Appearance */}
            <SettingCard
              title="Appearance"
              description="Customize the look and feel of the application"
              icon={Palette}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Theme Preference
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', name: 'Light', icon: Sun },
                      { id: 'dark', name: 'Dark', icon: Moon },
                      { id: 'system', name: 'System', icon: Smartphone }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setPreferences(prev => ({ ...prev, theme_preference: theme.id }));
                          if (theme.id !== 'system') {
                            // Only toggle if it's different from current
                            if ((theme.id === 'dark') !== isDark) {
                              toggleTheme();
                            }
                          }
                        }}
                        className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                          preferences.theme_preference === theme.id
                            ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/30'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <theme.icon className="h-5 w-5 mb-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </SettingCard>

            {/* Data & Privacy */}
            <SettingCard
              title="Data & Privacy"
              description="Manage your data and privacy settings"
              icon={Shield}
            >
              <div className="space-y-4">
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export My Data
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download a copy of all your data including quiz history, preferences, and progress.
                </p>
              </div>
            </SettingCard>

            {/* Account Actions */}
            <SettingCard
              title="Account Actions"
              description="Manage your account and session"
              icon={Settings}
            >
              <div className="space-y-4">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sign out of your account. You can always sign back in later.
                </p>
              </div>
            </SettingCard>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <motion.button
              onClick={savePreferences}
              disabled={isSaving}
              whileHover={{ scale: isSaving ? 1 : 1.05 }}
              whileTap={{ scale: isSaving ? 1 : 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </motion.button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
