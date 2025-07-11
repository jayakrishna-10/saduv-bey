// app/profile/analytics/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AnalyticsService } from '@/lib/analytics';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Calendar,
  Clock,
  BookOpen,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');

  useEffect(() => {
    if (session?.user) {
      fetchAnalytics();
    }
  }, [session?.user, selectedTimeframe]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use API endpoints instead of direct analytics service
      const [statsRes, progressRes] = await Promise.all([
        fetch('/api/analytics?action=stats'),
        fetch('/api/analytics?action=progress')
      ]);

      const stats = statsRes.ok ? await statsRes.json() : { quizzes: {}, tests: {}, overall: {} };
      const progress = progressRes.ok ? await progressRes.json() : { allProgress: [] };

      // Combine stats and progress data
      setUserStats({
        quizzes: {
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalTime: 0,
          recentAttempts: [],
          ...stats.quizzes
        },
        tests: {
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalTime: 0,
          recentAttempts: [],
          ...stats.tests
        },
        overall: {
          totalAttempts: 0,
          averageScore: 0,
          studyTime: 0,
          studyStreak: 0,
          ...stats.overall
        },
        progress: {
          allProgress: [],
          ...progress
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getScoreTrend = (current, previous) => {
    if (!previous) return null;
    const diff = current - previous;
    if (diff > 0) return { icon: ArrowUp, color: 'text-emerald-500', text: `+${diff}%` };
    if (diff < 0) return { icon: ArrowDown, color: 'text-red-500', text: `${diff}%` };
    return { icon: Minus, color: 'text-gray-500', text: 'No change' };
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'indigo' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/50`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend.color}`}>
            <trend.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{trend.text}</span>
          </div>
        )}
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

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center p-8">
              <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
              <p className="text-gray-700 dark:text-gray-300">Loading analytics...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center p-8">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Performance Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed insights into your study progress and performance
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="mb-8">
            <div className="flex gap-2">
              {[
                { value: '7', label: '7 days' },
                { value: '30', label: '30 days' },
                { value: '90', label: '90 days' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedTimeframe(option.value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedTimeframe === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-800/90'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Study Time"
              value={formatTime(userStats?.overall?.studyTime || 0)}
              subtitle="Across all activities"
              icon={Clock}
              color="blue"
            />
            <MetricCard
              title="Quiz Performance"
              value={`${userStats?.quizzes?.averageScore || 0}%`}
              subtitle={`${userStats?.quizzes?.totalAttempts || 0} attempts`}
              icon={Target}
              color="emerald"
            />
            <MetricCard
              title="Test Performance"
              value={`${userStats?.tests?.averageScore || 0}%`}
              subtitle={`${userStats?.tests?.totalAttempts || 0} attempts`}
              icon={BarChart3}
              color="purple"
            />
            <MetricCard
              title="Study Streak"
              value={`${userStats?.overall?.studyStreak || 0} days`}
              subtitle="Current streak"
              icon={Award}
              color="orange"
            />
          </div>

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quiz Analytics */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quiz Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Best Score</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {userStats?.quizzes?.bestScore || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {userStats?.quizzes?.averageScore || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Time</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatTime(userStats?.quizzes?.totalTime || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Analytics */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Test Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Best Score</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {userStats?.tests?.bestScore || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {userStats?.tests?.averageScore || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Time</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatTime(userStats?.tests?.totalTime || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Progress */}
          <div className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Chapter Progress
            </h3>
            <div className="space-y-4">
              {userStats?.progress?.allProgress?.length > 0 ? (
                userStats.progress.allProgress.map((chapter, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {chapter.chapter}
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {chapter.accuracy}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${chapter.accuracy}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{chapter.total_questions_attempted} questions</span>
                        <span className="capitalize">{chapter.mastery_level}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No chapter progress data yet</p>
                  <p className="text-sm">Start taking quizzes to see your progress!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
