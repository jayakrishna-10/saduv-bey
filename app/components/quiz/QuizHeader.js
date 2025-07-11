// app/components/quiz/QuizHeader.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Target, BarChart3, CheckCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { PAPERS } from '@/lib/quiz-utils';

export function QuizHeader({ 
  selectedPaper,
  questionProgress,
  answeredQuestions,
  showMobileStats,
  setShowMobileStats,
  setShowModifyQuiz 
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      {/* Top Row - Desktop */}
      <div className="hidden md:block">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/nce" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <Home className="h-5 w-5" />
              <span className="font-medium">NCE Home</span>
            </Link>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <h1 className="text-xl font-light text-gray-900 dark:text-gray-100">Practice Quiz</h1>
            <span className="px-3 py-1 bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-sm rounded-full">
              {PAPERS[selectedPaper]?.name}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <Target className="h-4 w-4" />
              Progress: {questionProgress.attempted}/{questionProgress.total}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModifyQuiz(true)}
              className="p-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-all"
            >
              <BarChart3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Compact Header */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{PAPERS[selectedPaper]?.name}</h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">{questionProgress.attempted}/{questionProgress.total}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Stats Toggle */}
            <button 
              onClick={() => setShowMobileStats(!showMobileStats)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModifyQuiz(true)}
              className="p-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-all"
            >
              <BarChart3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>

        {/* Expandable Mobile Stats */}
        <AnimatePresence>
          {showMobileStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">Answered: {questionProgress.attempted}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-gray-700 dark:text-gray-300">Correct: {answeredQuestions.filter(q => q.isCorrect).length}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Accuracy: {answeredQuestions.length > 0 ? Math.round((answeredQuestions.filter(q => q.isCorrect).length / answeredQuestions.length) * 100) : 0}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200/50 dark:bg-gray-700/50">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${((questionProgress.attempted) / questionProgress.total) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </header>
  );
}