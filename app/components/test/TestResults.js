// app/components/test/TestResults.js
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Home } from 'lucide-react';
import { calculateTestResults, formatTime } from '@/lib/test-utils';

export function TestResults({ 
  config, 
  testData, 
  onReview, 
  onRestart 
}) {
  const results = calculateTestResults(testData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative z-10 px-4 md:px-8 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl md:text-4xl font-light text-white">{results.score}%</span>
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">Test Complete! 🎉</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
            You scored {results.correct} out of {results.answered} attempted questions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-200/50 dark:border-gray-700/50 text-center"
          >
            <div className="text-2xl md:text-4xl font-light text-emerald-600 dark:text-emerald-400 mb-2">{results.correct}</div>
            <div className="text-gray-700 dark:text-gray-300 text-xs md:text-sm">Correct</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-200/50 dark:border-gray-700/50 text-center"
          >
            <div className="text-2xl md:text-4xl font-light text-red-500 dark:text-red-400 mb-2">{results.incorrect}</div>
            <div className="text-gray-700 dark:text-gray-300 text-xs md:text-sm">Incorrect</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-200/50 dark:border-gray-700/50 text-center"
          >
            <div className="text-2xl md:text-4xl font-light text-yellow-500 dark:text-yellow-400 mb-2">{results.unanswered}</div>
            <div className="text-gray-700 dark:text-gray-300 text-xs md:text-sm">Unanswered</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-200/50 dark:border-gray-700/50 text-center"
          >
            <div className="text-2xl md:text-4xl font-light text-blue-500 dark:text-blue-400 mb-2">{formatTime(results.timeTaken)}</div>
            <div className="text-gray-700 dark:text-gray-300 text-xs md:text-sm">Time Taken</div>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={onReview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 md:px-8 py-3 md:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl md:rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
          >
            <FileText className="h-4 w-4 md:h-5 md:w-5" />
            Review Answers
          </motion.button>
          
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 md:px-8 py-3 md:py-4 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-xl md:rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Home className="h-4 w-4 md:h-5 md:w-5" />
            New Test
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
