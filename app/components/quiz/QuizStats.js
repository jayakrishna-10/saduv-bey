// app/components/quiz/QuizStats.js
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp } from 'lucide-react';

export function QuizStats({ 
  questionProgress,
  answeredQuestions 
}) {
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const accuracy = answeredQuestions.length > 0 ? Math.round((correctAnswers / answeredQuestions.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 text-center">
        <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
        <div className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-1">
          {questionProgress.attempted}/{questionProgress.total}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
      </div>
      
      <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 text-center">
        <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
        <div className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-1">
          {correctAnswers}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
      </div>
      
      <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 text-center">
        <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
        <div className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-1">
          {accuracy}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
      </div>
    </motion.div>
  );
}