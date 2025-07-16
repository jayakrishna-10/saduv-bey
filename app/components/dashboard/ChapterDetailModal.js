// FILE: app/components/dashboard/ChapterDetailModal.js
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Calendar,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';

export function ChapterDetailModal({ isOpen, onClose, chapterData }) {
  const [detailedStats, setDetailedStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && chapterData) {
      fetchDetailedStats();
    }
  }, [isOpen, chapterData]);

  const fetchDetailedStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/chapter-performance?chapters=${chapterData.chapter}&days=30`);
      const data = await response.json();
      
      if (response.ok) {
        setDetailedStats(data);
      }
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getMasteryLevel = (accuracy) => {
    if (accuracy >= 90) return { level: 'Expert', color: 'text-purple-600 dark:text-purple-400' };
    if (accuracy >= 80) return { level: 'Proficient', color: 'text-green-600 dark:text-green-400' };
    if (accuracy >= 70) return { level: 'Competent', color: 'text-blue-600 dark:text-blue-400' };
    if (accuracy >= 60) return { level: 'Developing', color: 'text-yellow-600 dark:text-yellow-400' };
    return { level: 'Beginner', color: 'text-red-600 dark:text-red-400' };
  };

  const mastery = getMasteryLevel(chapterData.accuracy);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Chapter Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {chapterData.chapter}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Accuracy</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {chapterData.accuracy}%
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Questions</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {chapterData.totalQuestions}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Avg Time</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {chapterData.avgTimePerQuestion || 45}s
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Mastery</span>
                    </div>
                    <p className={`text-lg font-bold ${mastery.color}`}>
                      {mastery.level}
                    </p>
                  </div>
                </div>

                {/* Progress Visualization */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Mastery Progress
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Current Level: {mastery.level}</span>
                      <span>{chapterData.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${chapterData.accuracy}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>

                {/* Recent Performance */}
                {detailedStats?.performanceData && detailedStats.performanceData.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Recent Performance (Last 5 Sessions)
                    </h3>
                    <div className="space-y-2">
                      {detailedStats.performanceData.slice(-5).reverse().map((session, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {format(new Date(session.date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {session.totalQuestions} questions
                            </span>
                            <span className={`text-sm font-medium ${
                              session.accuracy >= 80 ? 'text-green-600 dark:text-green-400' :
                              session.accuracy >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {session.accuracy}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Improvement Recommendations
                      </h3>
                      <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        {chapterData.accuracy < 60 ? (
                          <>
                            <li>• Review fundamental concepts in this chapter</li>
                            <li>• Practice 10-15 questions daily to build confidence</li>
                            <li>• Focus on understanding rather than memorization</li>
                          </>
                        ) : chapterData.accuracy < 80 ? (
                          <>
                            <li>• Target specific weak areas within this chapter</li>
                            <li>• Try timed practice to improve speed and accuracy</li>
                            <li>• Review incorrect answers thoroughly</li>
                          </>
                        ) : (
                          <>
                            <li>• Maintain your excellent performance</li>
                            <li>• Help others by explaining concepts</li>
                            <li>• Challenge yourself with advanced questions</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {format(new Date(), 'MMM dd, yyyy')}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
