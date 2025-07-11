// app/components/quiz/QuizActions.js
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, BarChart3 } from 'lucide-react';

export function QuizActions({ 
  answeredQuestions,
  showFeedback,
  showAnswer,
  isTransitioning,
  onGetAnswer,
  onNextQuestion,
  onViewSummary
}) {
  return (
    <>
      {/* Desktop Action Buttons */}
      <div className="hidden md:flex flex-col sm:flex-row gap-4 justify-between">
        {answeredQuestions.length > 0 && (
          <motion.button
            onClick={onViewSummary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 rounded-full transition-all font-medium"
          >
            <BarChart3 className="h-4 w-4" />
            View Summary
          </motion.button>
        )}
        
        <div className="flex gap-3">
          <motion.button
            onClick={onGetAnswer}
            disabled={showFeedback || showAnswer || isTransitioning}
            whileHover={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 1.05 }}
            whileTap={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 0.95 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium ${
              (showFeedback || showAnswer || isTransitioning)
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            Show Answer
          </motion.button>
          
          <motion.button
            onClick={onNextQuestion}
            disabled={isTransitioning}
            whileHover={{ scale: isTransitioning ? 1 : 1.05 }}
            whileTap={{ scale: isTransitioning ? 1 : 0.95 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium ${
              isTransitioning 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900'
            }`}
          >
            {isTransitioning ? 'Loading...' : 'Next Question'}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 md:hidden z-[60]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            {answeredQuestions.length > 0 && (
              <button
                onClick={onViewSummary}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                title="View Summary"
              >
                <BarChart3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            )}
          </div>

          {/* Center Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onGetAnswer}
              disabled={showFeedback || showAnswer || isTransitioning}
              whileHover={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 1.05 }}
              whileTap={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                (showFeedback || showAnswer || isTransitioning)
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              Answer
            </motion.button>
            
            <motion.button
              onClick={onNextQuestion}
              disabled={isTransitioning}
              whileHover={{ scale: isTransitioning ? 1 : 1.05 }}
              whileTap={{ scale: isTransitioning ? 1 : 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                isTransitioning 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900'
              }`}
            >
              {isTransitioning ? 'Loading...' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Right Actions */}
          <div className="w-12" />
        </div>
      </div>
    </>
  );
}