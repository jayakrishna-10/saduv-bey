// FILE: app/components/test/QuestionPalette.js
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export function QuestionPalette({ isOpen, onClose, questions, answers, flaggedQuestions, currentQuestionIndex, onQuestionSelect }) {
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
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl flex flex-col z-50 focus:outline-none"
              >
                <VisuallyHidden.Root>
                  <Dialog.Title>Question Navigation Palette</Dialog.Title>
                  <Dialog.Description>
                    Navigate between test questions. Current question is highlighted in blue, answered questions in green, flagged questions in yellow, and unanswered questions in gray.
                  </Dialog.Description>
                </VisuallyHidden.Root>
                
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100" aria-hidden="true">
                    Question Palette
                  </h2>
                  <Dialog.Close asChild>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close question palette</span>
                    </button>
                  </Dialog.Close>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="grid grid-cols-5 gap-3" role="grid" aria-label="Question grid">
                    {questions.map((q, index) => {
                      const status = getStatus(index);
                      const questionId = q.main_id || q.id;
                      return (
                        <button
                          key={questionId}
                          onClick={() => onQuestionSelect(index)}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg transition-transform relative ${getStatusClasses(status)} hover:scale-110`}
                          aria-label={`Question ${index + 1}, ${status}`}
                          aria-current={status === 'current' ? 'true' : undefined}
                        >
                          {index + 1}
                          {status === 'flagged' && (
                            <Flag 
                              className="absolute top-1 right-1 h-3 w-3 text-white" 
                              fill="white" 
                              aria-label="Flagged"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2 text-sm" role="list" aria-label="Question status legend">
                    <div className="flex items-center gap-2" role="listitem">
                      <div className="w-4 h-4 rounded bg-green-500" aria-hidden="true" /> 
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2" role="listitem">
                      <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" aria-hidden="true" /> 
                      <span>Unanswered</span>
                    </div>
                    <div className="flex items-center gap-2" role="listitem">
                      <div className="w-4 h-4 rounded bg-yellow-400" aria-hidden="true" /> 
                      <span>Flagged</span>
                    </div>
                    <div className="flex items-center gap-2" role="listitem">
                      <div className="w-4 h-4 rounded bg-indigo-600" aria-hidden="true" /> 
                      <span>Current</span>
                    </div>
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
