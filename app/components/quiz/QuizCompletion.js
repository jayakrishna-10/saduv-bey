// app/components/quiz/QuizCompletion.js
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export function QuizCompletion({ 
  isOpen, 
  onViewSummary, 
  onStartNewQuiz 
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 w-full max-w-lg p-8 shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">Quiz Complete! 🎉</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You've completed all available questions. Great job!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            onClick={onViewSummary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-2xl transition-all duration-200"
          >
            View Summary
          </motion.button>
          <motion.button
            onClick={onStartNewQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-2xl transition-all duration-200"
          >
            Start New Quiz
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}