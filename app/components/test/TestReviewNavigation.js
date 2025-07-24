// FILE: app/components/test/TestReviewNavigation.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckSquare, Grid, MessageSquare } from 'lucide-react';

export function TestReviewNavigation({ 
  onPrevious, 
  onNext, 
  onFinishReview, 
  hasPrev, 
  hasNext, 
  onPaletteToggle,
  onFeedbackOpen
}) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 inset-x-0 flex justify-center z-50"
    >
      <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-2">
        {/* Previous Button */}
        <motion.button 
          onClick={onPrevious} 
          disabled={!hasPrev} 
          whileHover={{ scale: hasPrev ? 1.1 : 1 }} 
          whileTap={{ scale: hasPrev ? 0.95 : 1 }}
          className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-700 transition-all"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </motion.button>
        
        {/* Question Palette Button */}
        <motion.button 
          onClick={onPaletteToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 rounded-xl transition-all font-medium"
        >
          <Grid className="h-4 w-4" />
          <span className="text-sm">Questions</span>
        </motion.button>

        {/* Feedback Button */}
        <motion.button 
          onClick={onFeedbackOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-xl transition-all font-medium"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm">Report</span>
        </motion.button>
        
        {/* Finish Review Button */}
        <motion.button 
          onClick={onFinishReview} 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 rounded-xl transition-all font-medium"
        >
          <CheckSquare className="h-4 w-4" />
          <span className="text-sm">Finish Review</span>
        </motion.button>
        
        {/* Next Button */}
        <motion.button 
          onClick={onNext} 
          disabled={!hasNext} 
          whileHover={{ scale: hasNext ? 1.1 : 1 }} 
          whileTap={{ scale: hasNext ? 0.95 : 1 }}
          className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-700 transition-all"
        >
          <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </motion.button>
      </div>
    </motion.div>
  );
}
