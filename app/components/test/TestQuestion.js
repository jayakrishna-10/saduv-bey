// FILE: app/components/test/TestQuestion.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Question {questionIndex + 1} of {totalQuestions}</p>
          {mode === 'practice' && question.tag && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Chapter: {normalizeChapterName(question.tag)}</p>
          )}
        </div>
        <button onClick={onFlag} className={`p-2 rounded-full transition-colors ${isFlagged ? 'bg-yellow-400 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <Flag className="h-5 w-5" />
        </button>
      </div>
      
      <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 mb-8 leading-relaxed">
        {question.question_text}
      </p>

      <div className="space-y-4">
        {['a', 'b', 'c', 'd'].map(option => (
          <motion.button
            key={option}
            onClick={() => onOptionSelect(option)}
            whileHover={{ scale: 1.02 }}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              selectedOption === option
                ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500'
                : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center">
              <span className={`w-8 h-8 flex-shrink-0 mr-4 rounded-full flex items-center justify-center font-bold ${
                selectedOption === option ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                {option.toUpperCase()}
              </span>
              <span className="text-gray-700 dark:text-gray-300">{question[`option_${option}`]}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
