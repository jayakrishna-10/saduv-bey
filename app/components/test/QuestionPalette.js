// FILE: app/components/test/QuestionPalette.js
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function QuestionPalette({ isOpen, onClose, questions, answers, flaggedQuestions, currentQuestionIndex, onQuestionSelect }) {
  if (!isOpen) return null;

  const getStatus = (index) => {
    const questionId = questions[index].main_id || questions[index].id;
    if (index === currentQuestionIndex) return 'current';
    if (flaggedQuestions.has(questionId)) return 'flagged';
    if (answers[questionId]) return 'answered';
    return 'unanswered';
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'current': return 'bg-indigo-600 text-white ring-2 ring-indigo-400';
      case 'answered': return 'bg-green-500 text-white';
      case 'flagged': return 'bg-yellow-400 text-white';
      default: return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Question Palette</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, index) => {
                const status = getStatus(index);
                return (
                  <button
                    key={q.main_id || q.id}
                    onClick={() => onQuestionSelect(index)}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg transition-transform relative ${getStatusClasses(status)} hover:scale-110`}
                  >
                    {index + 1}
                    {status === 'flagged' && <Flag className="absolute top-1 right-1 h-3 w-3 text-white" fill="white" />}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-500" /> Answered</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" /> Unanswered</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-400" /> Flagged</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-indigo-600" /> Current</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
