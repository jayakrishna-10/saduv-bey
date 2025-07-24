// FILE: app/components/dashboard/StudyRecommendations.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  BookOpen, 
  Clock, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getStudyRecommendations } from '@/lib/dashboard-utils';

export function StudyRecommendations({ analytics }) {
  const [recommendations, setRecommendations] = useState([]);
  const [dailyGoal, setDailyGoal] = useState({ questions: 20, time: 30 });

  useEffect(() => {
    if (analytics) {
      const recs = getStudyRecommendations(analytics);
      setRecommendations(recs);
      
      // Calculate personalized daily goal
      if (analytics.activityData && analytics.activityData.length > 7) {
        const recentData = analytics.activityData.slice(-7);
        const avgQuestions = recentData.reduce((sum, d) => sum + (d.questionsAnswered || 0), 0) / 7;
        const avgTime = recentData.reduce((sum, d) => sum + (d.timeSpent || 0), 0) / 7 / 60; // in minutes
        
        setDailyGoal({
          questions: Math.max(20, Math.round(avgQuestions * 1.1)), // 10% increase
          time: Math.max(30, Math.round(avgTime * 1.1))
        });
      }
    }
  }, [analytics]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-amber-600';
      case 'low': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return { text: 'High Priority', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' };
      case 'medium': return { text: 'Medium Priority', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' };
      case 'low': return { text: 'Low Priority', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' };
      default: return { text: 'Priority', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' };
    }
  };

  const todayProgress = analytics?.activityData?.find(d => {
    const today = new Date().toDateString();
    return new Date(d.date).toDateString() === today;
  }) || { questionsAnswered: 0, timeSpent: 0 };

  const questionProgress = (todayProgress.questionsAnswered / dailyGoal.questions) * 100;
  const timeProgress = (todayProgress.timeSpent / (dailyGoal.time * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Personalized Study Plan
          </h3>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Today's Progress</h4>
        
        <div className="space-y-3">
          {/* Questions Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Questions</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {todayProgress.questionsAnswered} / {dailyGoal.questions}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, questionProgress)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Time Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Time</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {Math.round(todayProgress.timeSpent / 60)}m / {dailyGoal.time}m
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, timeProgress)}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </div>
          </div>
        </div>
        
        {questionProgress >= 100 && timeProgress >= 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 flex items-center gap-2 text-green-600 dark:text-green-400"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Daily goal completed! 🎉</span>
          </motion.div>
        )}
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        {recommendations.slice(0, 3).map((rec, index) => {
          const priorityBadge = getPriorityBadge(rec.priority);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-1 h-full bg-gradient-to-b ${getPriorityColor(rec.priority)} rounded-full`} />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {rec.message}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityBadge.color}`}>
                      {priorityBadge.text}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {rec.action}
                  </p>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
                  >
                    <span>Start Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <motion.a
          href="/quiz"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <BookOpen className="h-4 w-4" />
          <span>Start Quiz</span>
        </motion.a>
        
        <motion.a
          href="/test"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Target className="h-4 w-4" />
          <span>Mock Test</span>
        </motion.a>
      </div>
    </motion.div>
  );
}
