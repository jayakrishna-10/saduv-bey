// app/profile/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import { AnalyticsService } from '@/lib/analytics';
import { 
  User, 
  Trophy, 
  Target, 
  BarChart3, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award,
  TrendingUp,
  Star,
  Settings,
  Download
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user statistics when component mounts or session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session?.user?.id]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [stats, achievementsData, recommendationsData] = await Promise.all([
        AnalyticsService.getUserStats(session.user.id),
        AnalyticsService.getAchievementProgress(session.user.id),
        AnalyticsService.getRecommendations(session.user.id)
      ]);

      setUserStats(stats);
      setAchievements(achievementsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'indigo' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/50`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Handle data export
  const handleExportData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const userData = await AnalyticsService.exportUserData(session.user.id);
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nce-study-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
          <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
            <p className="text-gray-700 dark:text-gray-300 text-sm">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
          <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchUserData}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {session?.user?.name || 'User'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {session?.user?.email}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                    <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {userStats?.overall?.studyStreak || 0} day streak
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {formatTime(userStats?.overall?.studyTime || 0)} studied
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Target}
                  title="Quizzes Taken"
                  value={userStats?.quizzes?.totalAttempts || 0}
                  subtitle={`Best: ${userStats?.quizzes?.bestScore || 0}%`}
                  color="indigo"
                />
                <StatCard
                  icon={BookOpen}
                  title="Tests Completed"
                  value={userStats?.tests?.totalAttempts || 0}
                  subtitle={`Best: ${userStats?.tests?.bestScore || 0}%`}
                  color="emerald"
                />
                <StatCard
                  icon={TrendingUp}
                  title="Average Score"
                  value={`${userStats?.overall?.averageScore || 0}%`}
                  subtitle="Quiz & Test Combined"
                  color="blue"
                />
                <StatCard
                  icon={Award}
                  title="Chapter Progress"
                  value={`${userStats?.progress?.completedChapters || 0}/${userStats?.progress?.totalChapters || 0}`}
                  subtitle={`${Math.round(((userStats?.progress?.completedChapters || 0) / Math.max(userStats?.progress?.totalChapters || 1, 1)) * 100)}% complete`}
                  color="purple"
                />
              </div>

              {/* Recent Activity and Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {/* Combine recent quiz and test attempts */}
                    {[
                      ...(userStats?.quizzes?.recentAttempts || []).map(quiz => ({
                        ...quiz,
                        type: 'quiz',
                        date: quiz.completed_at
                      })),
                      ...(userStats?.tests?.recentAttempts || []).map(test => ({
                        ...test,
                        type: 'test',
                        date: test.completed_at
                      }))
                    ]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5)
                    .map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'quiz' 
                              ? 'bg-indigo-100 dark:bg-indigo-900/50' 
                              : 'bg-purple-100 dark:bg-purple-900/50'
                          }`}>
                            <Target className={`h-4 w-4 ${
                              activity.type === 'quiz' 
                                ? 'text-indigo-600 dark:text-indigo-400' 
                                : 'text-purple-600 dark:text-purple-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                              {activity.type} - {activity.chapter || activity.chapters?.[0] || 'Mixed'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(activity.date)}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          activity.score >= 80 
                            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                            : activity.score >= 60
                            ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                        }`}>
                          {activity.score}%
                        </div>
                      </div>
                    ))}
                    {(!userStats?.quizzes?.recentAttempts?.length && !userStats?.tests?.recentAttempts?.length) && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No recent activity yet</p>
                        <p className="text-sm">Start taking quizzes and tests to see your progress!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Areas for Improvement</h3>
                  <div className="space-y-3">
                    {userStats?.progress?.weakAreas?.map((area, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{area.chapter}</span>
                          <span className="text-sm text-red-600 dark:text-red-400 font-medium">{area.average_score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${area.average_score}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {area.attempts} attempts • {area.mastery_level}
                        </p>
                      </div>
                    ))}
                    {(!userStats?.progress?.weakAreas?.length) && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No weak areas identified yet</p>
                        <p className="text-sm">Keep practicing to get personalized insights!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-8">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Strong Areas</h3>
                <div className="space-y-3">
                  {userStats?.progress?.strongAreas?.map((area, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{area.chapter}</span>
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{area.average_score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${area.average_score}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {area.attempts} attempts • {area.mastery_level}
                      </p>
                    </div>
                  ))}
                  {(!userStats?.progress?.strongAreas?.length) && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No strong areas identified yet</p>
                      <p className="text-sm">Start practicing to identify your strengths!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements?.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl border shadow-lg ${
                      achievement.earned
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        achievement.earned
                          ? 'bg-yellow-100 dark:bg-yellow-900/50'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <Trophy className={`h-6 w-6 ${
                          achievement.earned
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-1 ${
                          achievement.earned
                            ? 'text-yellow-800 dark:text-yellow-200'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {achievement.name}
                        </h4>
                        <p className={`text-sm mb-2 ${
                          achievement.earned
                            ? 'text-yellow-700 dark:text-yellow-300'
                            : 'text-gray-500 dark:text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                        {/* Progress bar */}
                        <div className="mb-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                achievement.earned ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}
                              style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {achievement.progress} / {achievement.target}
                          </p>
                        </div>
                        {achievement.earned && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                              Earned
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {(!achievements?.length) && (
                  <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                    <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No achievements yet</p>
                    <p className="text-sm">Start studying to unlock achievements!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      defaultValue={session?.user?.name}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={session?.user?.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Data Export</h4>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Export Study Data
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}