// FILE: app/components/dashboard/RecentAchievements.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  Star, 
  Target,
  Flame,
  TrendingUp,
  Zap,
  CheckCircle
} from 'lucide-react';

export function RecentAchievements({ analytics, recentActivity }) {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    checkAchievements();
  }, [analytics, recentActivity]);

  const checkAchievements = () => {
    if (!analytics) return;

    const newAchievements = [];
    const { studyStreak, totalStats, chapterStats } = analytics;

    // Streak Achievements
    if (studyStreak?.current >= 7) {
      newAchievements.push({
        id: 'week-streak',
        title: 'Week Warrior',
        description: '7 day study streak',
        icon: Flame,
        color: 'from-orange-400 to-red-500',
        date: new Date()
      });
    }
    
    if (studyStreak?.current >= 30) {
      newAchievements.push({
        id: 'month-streak',
        title: 'Dedicated Scholar',
        description: '30 day study streak',
        icon: Trophy,
        color: 'from-yellow-400 to-orange-500',
        date: new Date()
      });
    }

    // Questions Milestones
    const totalQuestions = totalStats?.questionsAttempted || 0;
    if (totalQuestions >= 100 && totalQuestions < 500) {
      newAchievements.push({
        id: 'century',
        title: 'Century Club',
        description: '100 questions completed',
        icon: Star,
        color: 'from-blue-400 to-indigo-500',
        date: new Date()
      });
    } else if (totalQuestions >= 500 && totalQuestions < 1000) {
      newAchievements.push({
        id: '500-club',
        title: 'Half Thousand',
        description: '500 questions completed',
        icon: Award,
        color: 'from-purple-400 to-pink-500',
        date: new Date()
      });
    } else if (totalQuestions >= 1000) {
      newAchievements.push({
        id: 'thousand',
        title: 'Question Master',
        description: '1000 questions completed',
        icon: Trophy,
        color: 'from-yellow-400 to-gold-500',
        date: new Date()
      });
    }

    // Accuracy Achievements
    const overallAccuracy = analytics.analytics?.overall_accuracy || 0;
    if (overallAccuracy >= 80) {
      newAchievements.push({
        id: 'accuracy-80',
        title: 'Sharp Shooter',
        description: '80%+ overall accuracy',
        icon: Target,
        color: 'from-green-400 to-emerald-500',
        date: new Date()
      });
    }

    // Perfect Score Achievements
    const perfectQuizzes = recentActivity?.quizAttempts?.filter(q => q.score === 100).length || 0;
    if (perfectQuizzes >= 5) {
      newAchievements.push({
        id: 'perfect-5',
        title: 'Perfectionist',
        description: '5 perfect quizzes',
        icon: CheckCircle,
        color: 'from-emerald-400 to-green-500',
        date: new Date()
      });
    }

    // Chapter Master
    if (chapterStats) {
      const masteredChapters = Object.values(chapterStats)
        .filter(stats => stats.accuracy >= 90 && stats.totalQuestions >= 20).length;
      
      if (masteredChapters >= 3) {
        newAchievements.push({
          id: 'chapter-master',
          title: 'Chapter Master',
          description: `${masteredChapters} chapters mastered`,
          icon: Zap,
          color: 'from-indigo-400 to-purple-500',
          date: new Date()
        });
      }
    }

    setAchievements(newAchievements.slice(0, 4)); // Show latest 4
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Achievements
        </h3>
      </div>

      {achievements.length > 0 ? (
        <div className="space-y-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`p-3 rounded-lg bg-gradient-to-br ${achievement.color} shadow-lg`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                  
                  {/* Sparkle Effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: 3,
                      delay: index * 0.5 
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Award className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Keep studying to unlock achievements!</p>
        </div>
      )}

      {/* Progress to Next Achievement */}
      {analytics?.totalStats?.questionsAttempted && (
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Next Milestone
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {analytics.totalStats.questionsAttempted < 100 ? '100' :
               analytics.totalStats.questionsAttempted < 500 ? '500' :
               analytics.totalStats.questionsAttempted < 1000 ? '1000' : '2000'} questions
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${
                  analytics.totalStats.questionsAttempted < 100 
                    ? (analytics.totalStats.questionsAttempted / 100) * 100
                    : analytics.totalStats.questionsAttempted < 500 
                    ? ((analytics.totalStats.questionsAttempted - 100) / 400) * 100
                    : analytics.totalStats.questionsAttempted < 1000
                    ? ((analytics.totalStats.questionsAttempted - 500) / 500) * 100
                    : ((analytics.totalStats.questionsAttempted - 1000) / 1000) * 100
                }%` 
              }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
