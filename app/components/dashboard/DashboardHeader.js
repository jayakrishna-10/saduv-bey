// FILE: app/components/dashboard/DashboardHeader.js
'use client';

import { motion } from 'framer-motion';
import { Calendar, Flame, Target, Clock } from 'lucide-react';
import { formatTimeSpent } from '@/lib/dashboard-utils';

export function DashboardHeader({ session, analytics }) {
  const totalQuestions = analytics.totalStats?.questionsAttempted || 0;
  const overallAccuracy = analytics.analytics?.overall_accuracy || 0;
  const studyStreak = analytics.studyStreak?.current || 0;
  const totalTime = analytics.totalStats?.totalTimeSpent || 0;

  const stats = [
    { 
      label: 'Streak', 
      value: `${studyStreak} days`, 
      icon: Flame, 
      color: 'from-orange-400 to-red-500',
      subtext: studyStreak > 0 ? 'Keep it up!' : 'Start today'
    },
    { 
      label: 'Accuracy', 
      value: `${Math.round(overallAccuracy)}%`, 
      icon: Target, 
      color: 'from-emerald-400 to-green-500',
      subtext: overallAccuracy >= 70 ? 'Excellent' : 'Keep practicing'
    },
    { 
      label: 'Questions', 
      value: totalQuestions.toLocaleString(), 
      icon: Calendar, 
      color: 'from-blue-400 to-indigo-500',
      subtext: 'Total attempted'
    },
    { 
      label: 'Time Invested', 
      value: formatTimeSpent(totalTime), 
      icon: Clock, 
      color: 'from-purple-400 to-pink-500',
      subtext: 'Total study time'
    }
  ];

  return (
    <div className="relative">
      {/* User Info Section - Compact */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={session.user.image}
            alt="User Avatar"
            className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {session.user.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Let's continue your learning journey
            </p>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <motion.a
            href="/nce/quiz"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Quiz
          </motion.a>
          <motion.a
            href="/nce/test"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
          >
            Take Test
          </motion.a>
        </div>
      </div>

      {/* Stats Grid - Horizontal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden group hover:shadow-xl transition-shadow"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${stat.color}`} />
              
              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                    <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.subtext}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
