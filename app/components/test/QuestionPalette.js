// app/components/test/QuestionPalette.js
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Flag, Circle, ArrowLeft, X } from 'lucide-react';
import { getQuestionStatusColor } from '@/lib/test-utils';

export function QuestionPalette({ 
  questions, 
  currentIndex, 
  answers, 
  flagged, 
  visited, 
  onNavigate, 
  onClose 
}) {
  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      
      {/* Palette */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        className="fixed md:relative top-0 left-0 h-screen w-80 md:w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 p-4 overflow-y-auto z-50 md:z-30"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Questions</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-700 dark:text-gray-300 md:hidden" />
            <ArrowLeft className="h-4 w-4 text-gray-700 dark:text-gray-300 hidden md:block" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {questions.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                onNavigate(index);
                // Auto-close on mobile after selection
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`aspect-square p-2 rounded-lg border-2 transition-all duration-200 flex items-center justify-center touch-manipulation ${getQuestionStatusColor(index, currentIndex, answers, flagged, visited)}`}
            >
              <span className="text-xs font-medium">{index + 1}</span>
            </motion.button>
          ))}
        </div>

        {/* Legend */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>Answered ({Object.keys(answers).length})</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Flag className="h-4 w-4 text-yellow-500" />
            <span>Flagged ({flagged.size})</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Circle className="h-4 w-4 text-blue-500" />
            <span>Visited ({visited.size})</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Circle className="h-4 w-4 text-gray-400" />
            <span>Not visited</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}