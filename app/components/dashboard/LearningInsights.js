// FILE: app/components/dashboard/LearningInsights.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Brain,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react';

export function LearningInsights({ analytics }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    generateInsights();
  }, [analytics]);

  const generateInsights = () => {
    if (!analytics) return;

    const newInsights = [];
    const { chapterStats, activityData, studyStreak, totalStats } = analytics;

    // Learning Pattern Insight
    if (activityData && activityData.length > 7) {
      const recentActivity = activityData.slice(-7);
      const avgQuestionsPerDay = recentActivity.reduce((sum, d) => sum + (d.questionsAnswered || 0), 0) / 7;
      
      if (avgQuestionsPerDay > 20) {
        newInsights.push({
          type: 'pattern',
          icon: Brain,
          title: 'Consistent Learner',
          description: `You're averaging ${Math.round(avgQuestionsPerDay)} questions per day. Great consistency!`,
          action: 'Maintain this pace for optimal learning',
          priority: 'positive'
        });
      } else if (avgQuestionsPerDay < 10 && avgQuestionsPerDay > 0) {
        newInsights.push({
          type: 'pattern',
          icon: Brain,
          title: 'Increase Practice Volume',
          description: `You're averaging only ${Math.round(avgQuestionsPerDay)} questions per day`,
          action: 'Try to practice at least 15-20 questions daily',
          priority: 'warning'
        });
      }
    }

    // Accuracy Trend Insight
    if (activityData && activityData.length > 14) {
      const lastWeek = activityData.slice(-7);
      const previousWeek = activityData.slice(-14, -7);
      
      const lastWeekAvg = lastWeek.reduce((sum, d) => sum + (d.accuracy || 0), 0) / lastWeek.length;
      const prevWeekAvg = previousWeek.reduce((sum, d) => sum + (d.accuracy || 0), 0) / previousWeek.length;
      
      if (lastWeekAvg > prevWeekAvg + 5) {
        newInsights.push({
          type: 'trend',
          icon: TrendingUp,
          title: 'Improving Performance',
          description: `Your accuracy improved by ${Math.round(lastWeekAvg - prevWeekAvg)}% this week`,
          action: 'Keep up the great work!',
          priority: 'positive'
        });
      } else if (lastWeekAvg < prevWeekAvg - 5) {
        newInsights.push({
          type: 'trend',
          icon: TrendingUp,
          title: 'Performance Dip Detected',
          description: `Your accuracy dropped by ${Math.round(prevWeekAvg - lastWeekAvg)}% this week`,
          action: 'Review difficult topics and take breaks to avoid fatigue',
          priority: 'warning'
        });
      }
    }

    // Time Optimization Insight
    if (totalStats?.totalTimeSpent) {
      const totalHours = Math.round(totalStats.totalTimeSpent / 3600);
      const questionsPerHour = totalStats.questionsAttempted / totalHours;
      
      if (questionsPerHour < 20) {
        newInsights.push({
          type: 'efficiency',
          icon: Clock,
          title: 'Speed Up Your Pace',
          description: `You're completing ${Math.round(questionsPerHour)} questions per hour`,
          action: 'Try timed practice to improve speed',
          priority: 'info'
        });
      } else if (questionsPerHour > 40) {
        newInsights.push({
          type: 'efficiency',
          icon: Clock,
          title: 'Excellent Speed',
          description: `You're completing ${Math.round(questionsPerHour)} questions per hour`,
          action: 'Ensure you\'re not sacrificing accuracy for speed',
          priority: 'positive'
        });
      }
    }

    // Weak Chapter Insight
    if (chapterStats) {
      const weakChapters = Object.entries(chapterStats)
        .filter(([_, stats]) => stats.accuracy < 60 && stats.totalQuestions >= 10)
        .sort((a, b) => a[1].accuracy - b[1].accuracy)
        .slice(0, 2);
      
      if (weakChapters.length > 0) {
        newInsights.push({
          type: 'focus',
          icon: Target,
          title: 'Focus Areas Identified',
          description: `${weakChapters[0][0]} needs attention (${Math.round(weakChapters[0][1].accuracy)}% accuracy)`,
          action: 'Dedicate next study session to this topic',
          priority: 'warning'
        });
      }
    }

    // Streak Insight
    if (studyStreak) {
      if (studyStreak.current >= 7) {
        newInsights.push({
          type: 'streak',
          icon: Zap,
          title: `${studyStreak.current} Day Streak!`,
          description: 'You\'re building a strong study habit',
          action: 'Keep the momentum going',
          priority: 'positive'
        });
      } else if (studyStreak.current === 0 && studyStreak.longest > 7) {
        newInsights.push({
          type: 'streak',
          icon: Zap,
          title: 'Streak Broken',
          description: `Your longest streak was ${studyStreak.longest} days`,
          action: 'Start a new streak today!',
          priority: 'warning'
        });
      }
    }

    setInsights(newInsights.slice(0, 4)); // Show top 4 insights
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'positive': return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700';
      case 'warning': return 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700';
      case 'info': return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700';
      default: return 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const getIconColor = (priority) => {
    switch (priority) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-amber-600 dark:text-amber-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Learning Insights
        </h3>
      </div>

      {insights.length > 0 ? (
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl bg-gradient-to-r ${getPriorityColor(insight.priority)} border backdrop-blur-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 ${getIconColor(insight.priority)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                      <span>{insight.action}</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Brain className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Complete more activities to see insights</p>
        </div>
      )}
    </motion.div>
  );
}
