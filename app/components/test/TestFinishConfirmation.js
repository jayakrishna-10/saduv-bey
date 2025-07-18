// FILE: app/components/test/TestFinishConfirmation.js
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, AlertTriangle } from 'lucide-react';

export function TestFinishConfirmation({ isOpen, onClose, onConfirm, unansweredCount, flaggedCount }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6"
        >
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Finish Test?</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Are you sure you want to submit your test?
            </p>

            <div className="my-6 space-y-2 text-left bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              {unansweredCount > 0 && <p>You have <strong className="text-red-500">{unansweredCount} unanswered</strong> questions.</p>}
              {flaggedCount > 0 && <p>You have <strong className="text-yellow-500">{flaggedCount} flagged</strong> questions for review.</p>}
            </div>

            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 py-3 bg-gray-200 dark:bg-gray-600 rounded-lg font-semibold">
                Cancel
              </button>
              <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600">
                Submit Test
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
