// app/components/quiz/QuizSummary.js
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { generateQuizSummary, formatTime } from '@/lib/quiz-utils';

export function QuizSummary({ 
  isOpen, 
  onClose, 
  answeredQuestions, 
  startTime 
}) {
  if (!isOpen) return null;

  const summary = generateQuizSummary(answeredQuestions, startTime);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">Quiz Summary</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowRight className="h-5 w-5 text-gray-500 dark:text-gray-400 rotate-45" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                <div className="text-3xl font-light text-emerald-600 dark:text-emerald-400 mb-2">{summary.correctAnswers}</div>
                <div className="text-emerald-800 dark:text-emerald-200 text-sm">Correct</div>
              </div>
              <div className="text-center p-6 bg-red-50 dark:bg-red-900/30 rounded-2xl">
                <div className="text-3xl font-light text-red-600 dark:text-red-400 mb-2">{summary.incorrectAnswers}</div>
                <div className="text-red-800 dark:text-red-200 text-sm">Incorrect</div>
              </div>
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                <div className="text-3xl font-light text-blue-600 dark:text-blue-400 mb-2">{summary.score}%</div>
                <div className="text-blue-800 dark:text-blue-200 text-sm">Score</div>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
                <div className="text-3xl font-light text-purple-600 dark:text-purple-400 mb-2">{formatTime(summary.timeTaken)}</div>
                <div className="text-purple-800 dark:text-purple-200 text-sm">Time</div>
              </div>
            </div>

            {/* Chapter Performance */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Chapter Performance</h3>
              <div className="space-y-3">
                {Object.entries(summary.chapterPerformance).map(([chapter, performance]) => (
                  <div key={chapter} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{chapter}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {performance.correct}/{performance.total}
                      </span>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                          style={{ width: `${(performance.correct / performance.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 text-sm font-medium w-12">
                        {Math.round((performance.correct / performance.total) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}