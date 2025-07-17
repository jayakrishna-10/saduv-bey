// FILE: app/components/test/TestQuestion.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Tag } from 'lucide-react';
import { normalizeChapterName } from '@/lib/quiz-utils';

export function TestQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  isFlagged,
  onOptionSelect,
  onFlag,
  mode
}) {
  const getOptionClass = (option) => {
    return selectedOption === option
      ? "bg-indigo-100/90 dark:bg-indigo-900/60 border-indigo-300/80 dark:border-indigo-600/80 text-indigo-800 dark:text-indigo-200 shadow-indigo-200/50 dark:shadow-indigo-900/30 shadow-lg"
      : "bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-800/95 border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/60 dark:hover:border-gray-600/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer";
  };
  
  const getOptionIconClass = (option) => {
    return selectedOption === option
      ? 'bg-indigo-500 text-white border-indigo-500'
      : 'border-current bg-white/80 dark:bg-gray-800/80';
  };

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                  {questionIndex + 1} / {totalQuestions}
              </div>
              {mode === 'practice' && question.tag && (
                  <div className="hidden md:flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                      <Tag className="h-3 w-3" />
                      <span>{normalizeChapterName(question.tag)}</span>
                  </div>
              )}
          </div>
          <motion.button onClick={onFlag} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`p-3 rounded-full transition-colors ${isFlagged ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
              <Flag className="h-5 w-5" />
          </motion.button>
      </div>

      <h2 className="font-light text-gray-900 dark:text-gray-100 leading-relaxed text-xl md:text-2xl lg:text-3xl mb-8">
        {question.question_text}
      </h2>

      <div className="space-y-4">
        {['a', 'b', 'c', 'd'].map(option => (
          <motion.button
            key={option}
            onClick={() => onOptionSelect(option)}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full p-4 md:p-6 rounded-2xl border-2 text-left transition-all duration-300 backdrop-blur-sm ${getOptionClass(option)}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-medium transition-all duration-300 flex-shrink-0 ${getOptionIconClass(option)}`}>
                {option.toUpperCase()}
              </div>
              <span className="flex-1 text-lg">{question[`option_${option}`]}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
