// app/components/quiz/QuizActions.js - Centered action buttons layout
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
      {/* Desktop Action Buttons - Centered */}
      <div className="hidden md:flex flex-col gap-6 items-center">
        {/* Primary Actions Row - Centered */}
        <div className="flex items-center justify-center gap-4">
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

        {/* Secondary Actions Row - Centered */}
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
      </div>

      {/* Mobile Bottom Action Bar - Already handled in QuizNavigation */}
      {/* This component is now primarily for desktop centered layout */}
    </>
  );
}
