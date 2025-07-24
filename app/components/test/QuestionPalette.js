// FILE: app/components/test/QuestionPalette.js
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export function QuestionPalette({ 
  isOpen, 
  onClose, 
  questions, 
  answers, 
  flaggedQuestions, 
  currentQuestionIndex, 
  onQuestionSelect,
  // New flexible props
  getQuestionStatus,
  statusConfig,
  legendItems,
  title = "Questions"
}) {
  // Default status function for test mode
  const defaultGetStatus = (index) => {
    const questionId = questions[index].main_id || questions[index].id;
    if (index === currentQuestionIndex) return 'current';
    if (flaggedQuestions.has(questionId)) return 'flagged';
    if (answers[questionId]) return 'answered';
    return 'unanswered';
  };

  // Default status configuration for test mode
  const defaultStatusConfig = {
    current: 'bg-indigo-600 text-white ring-2 ring-indigo-400',
    answered: 'bg-green-500 text-white',
    flagged: 'bg-yellow-400 text-white',
    correct: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-700',
    incorrect: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-700',
    unanswered: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  };

  // Default legend items for test mode
  const defaultLegendItems = [
    { color: 'bg-green-500', label: 'Answered' },
    { color: 'bg-gray-200 dark:bg-gray-700', label: 'Unanswered' },
    { color: 'bg-yellow-400', label: 'Flagged' },
    { color: 'bg-indigo-600', label: 'Current' }
  ];

  // Use provided functions/config or defaults
  const getStatus = getQuestionStatus || defaultGetStatus;
  const statusClasses = statusConfig || defaultStatusConfig;
  const legend = legendItems || defaultLegendItems;

  const getStatusClasses = (status) => {
    return statusClasses[status] || statusClasses.unanswered;
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed right-0 top-0 h-full w-3/4 max-w-xs sm:max-w-sm bg-white dark:bg-gray-800 shadow-2xl flex flex-col z-50 focus:outline-none"
              >
                <VisuallyHidden.Root>
                  <Dialog.Title>Question Navigation Palette</Dialog.Title>
                  <Dialog.Description>
                    Navigate between test questions. Different colors indicate question status.
                  </Dialog.Description>
                </VisuallyHidden.Root>
                
                <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100" aria-hidden="true">
                    {title}
                  </h2>
                  <Dialog.Close asChild>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close question palette</span>
                    </button>
                  </Dialog.Close>
                </div>
                
                <ScrollArea className="flex-1 p-3 sm:p-4">
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3" role="grid" aria-label="Question grid">
                    {questions.map((q, index) => {
                      const status = getStatus(index);
                      const questionId = q.main_id || q.id;
                      const isFlagged = flaggedQuestions.has(questionId);
                      const isCurrentQuestion = index === currentQuestionIndex;
                      
                      return (
                        <button
                          key={questionId}
                          onClick={() => onQuestionSelect(index)}
                          className={`
                            relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-sm sm:text-lg transition-transform
                            ${getStatusClasses(status)} hover:scale-110
                            ${isCurrentQuestion ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' : ''}
                          `}
                          aria-label={`Question ${index + 1}, ${status}`}
                          aria-current={isCurrentQuestion ? 'true' : undefined}
                        >
                          {index + 1}
                          {isFlagged && (
                            <Flag 
                              className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-white drop-shadow-sm" 
                              fill="currentColor" 
                              aria-label="Flagged"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm" role="list" aria-label="Question status legend">
                    {legend.map((item, index) => (
                      <div key={index} className="flex items-center gap-1.5 sm:gap-2" role="listitem">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${item.color}`} aria-hidden="true" /> 
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
