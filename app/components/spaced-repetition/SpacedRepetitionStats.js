// app/components/spaced-repetition/SpacedRepetitionStats.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award,
  Calendar,
  Brain,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Zap,
  ArrowLeft,
  Play,
  Trophy,
  Fire,
  Timer,
  BookOpen,
  RefreshCw
} from 'lucide-react';

import { formatTime, CardUtils } from '@/lib/spaced-repetition-utils';

export function SpacedRepetitionStats({ 
  userStats, 
  sessionStats, 
  reviewedCards, 
  onBackToMenu, 
  onStartNewSession 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30');

  // Session completion stats
  const sessionAccuracy = sessionStats.reviewed > 0 ? 
    Math.round((sessionStats.correct / sessionStats.reviewed) * 100) : 0;
  const sessionDuration = sessionStats.timeSpent || 0;
  const averageTimePerCard = sessionStats.reviewed > 0 ? 
    Math.round(sessionDuration / sessionStats.reviewed) : 0;

  // Get streak information
  const currentStreak = userStats?.streak?.current || 0;
  const longestStreak = userStats?.streak?.longest || 0;

  // Get retention rates
  const overallRetention = userStats?.retention?.overall || 0;
  const recentRetention = userStats?.retention?.recent || 0;
  const retentionTrend = userStats?.retention?.trend || 'stable';

  // Calculate performance metrics
  const totalCardsReviewed = userStats?.sessions?.total || 0;
  const totalStudyTime = userStats?.time?.totalStudyTime || 0;
  const averageSessionAccuracy = userStats?.sessions?.averageAccuracy || 0;

  // Achievement progress
  const achievements = userStats?.achievements?.unlocked || [];
  const nextMilestones = userStats?.achievements?.nextMilestones || [];

  // Paper-specific stats
  const paperStats = userStats?.papers || {};

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'session', label: 'Session', icon: Target },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Trophy }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'improving' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
            trend === 'declining' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {trend}
          </div>
        )}
      </div>
      <div className="mb-2">
        <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
          {value}
        </div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </div>
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </div>
      )}
    </motion.div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Retention Rate"
          value={`${overallRetention}%`}
          subtitle="Overall accuracy"
          icon={Brain}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
          trend={retentionTrend}
        />
        <StatCard
          title="Study Streak"
          value={currentStreak}
          subtitle={`Longest: ${longestStreak} days`}
          icon={Fire}
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
        />
        <StatCard
          title="Cards Reviewed"
          value={totalCardsReviewed}
          subtitle="Total sessions"
          icon={Target}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
        />
        <StatCard
          title="Study Time"
          value={CardUtils.formatDuration(totalStudyTime)}
          subtitle="Total time spent"
          icon={Clock}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
        />
      </div>

      {/* Paper Performance */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Performance by Paper
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['paper1', 'paper2', 'paper3'].map((paper, index) => {
            const stats = paperStats[paper] || {};
            const paperNames = ['Paper 1', 'Paper 2', 'Paper 3'];
            const colors = [
              'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
              'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
              'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
            ];
            
            return (
              <div key={paper} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${colors[index]}`}>
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {paperNames[index]}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cards:</span>
                    <span className="font-medium">{stats.totalCards || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
                    <span className="font-medium">{stats.accuracy || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mature:</span>
                    <span className="font-medium">{stats.matureCards || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {userStats?.trends?.weeklyProgress && (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Weekly Progress
          </h3>
          <div className="space-y-3">
            {userStats.trends.weeklyProgress.slice(-4).map((week, index) => (
              <div key={week.week} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Week of {new Date(week.week).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {week.sessions} sessions • {week.questions} questions
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {week.accuracy}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    accuracy
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSessionTab = () => (
    <div className="space-y-6">
      {/* Session Summary */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
          Session Complete!
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-1">
              {sessionStats.reviewed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cards Reviewed
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-emerald-600 dark:text-emerald-400 mb-1">
              {sessionStats.correct}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Correct
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-indigo-600 dark:text-indigo-400 mb-1">
              {sessionAccuracy}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Accuracy
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-purple-600 dark:text-purple-400 mb-1">
              {formatTime(sessionDuration)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Duration
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Session Performance
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {sessionAccuracy}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                sessionAccuracy >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                sessionAccuracy >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
              style={{ width: `${Math.min(sessionAccuracy, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Avg. Time per Card:</span>
            <span className="font-medium">{averageTimePerCard}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Cards per Minute:</span>
            <span className="font-medium">
              {sessionDuration > 0 ? Math.round((sessionStats.reviewed * 60) / sessionDuration) : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Card Review Breakdown */}
      {reviewedCards && reviewedCards.length > 0 && (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Review Breakdown
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reviewedCards.map((review, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    review.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    {review.isCorrect ? '✓' : '✗'}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Question {index + 1}
                  </span>
                </div>
                <div className="text-right text-sm">
                  <div className="text-gray-900 dark:text-gray-100">
                    {review.timeTaken}s
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Answer: {review.userResponse?.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <motion.button
          onClick={onStartNewSession}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          <Play className="h-5 w-5" />
          New Session
        </motion.button>
        <motion.button
          onClick={onBackToMenu}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:border-gray-400 dark:hover:border-gray-500 transition-all"
        >
          Back to Menu
        </motion.button>
      </div>
    </div>
  );

  const renderTrendsTab = () => (
    <div className="space-y-6">
      {/* Performance Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Accuracy Trend"
          value={retentionTrend}
          subtitle={`${recentRetention}% recent vs ${overallRetention}% overall`}
          icon={TrendingUp}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
          trend={retentionTrend}
        />
        <StatCard
          title="Speed Trend"
          value={userStats?.trends?.speedTrend || 'stable'}
          subtitle="Response time improvement"
          icon={Zap}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400"
        />
        <StatCard
          title="Volume Trend"
          value={userStats?.trends?.volumeTrend || 'stable'}
          subtitle="Questions per session"
          icon={BarChart3}
          color="bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Learning Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Time Distribution
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Average per session:</span>
                <span className="font-medium">{CardUtils.formatDuration(userStats?.time?.averageSessionTime || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Daily average:</span>
                <span className="font-medium">{CardUtils.formatDuration(userStats?.time?.dailyAverage || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Avg. per card:</span>
                <span className="font-medium">{userStats?.time?.averageResponseTime || 0}s</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Difficulty Analysis
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Average difficulty:</span>
                <span className="font-medium">{userStats?.difficulty?.averageDifficulty || 0}/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Correlation with accuracy:</span>
                <span className="font-medium">{userStats?.difficulty?.correlationAccuracy || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      {/* Current Achievements */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Unlocked Achievements
        </h3>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {achievement.type} • {achievement.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Keep studying to unlock achievements!
            </p>
          </div>
        )}
      </div>

      {/* Next Milestones */}
      {nextMilestones.length > 0 && (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Next Milestones
          </h3>
          <div className="space-y-4">
            {nextMilestones.map((milestone, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {milestone.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {milestone.type}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {milestone.current} / {milestone.target}
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((milestone.current / milestone.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">
            Learning Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and review performance
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/20 dark:border-gray-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'session' && renderSessionTab()}
            {activeTab === 'trends' && renderTrendsTab()}
            {activeTab === 'achievements' && renderAchievementsTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
