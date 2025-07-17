// FILE: app/components/test/TestReviewNavigation.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';

export function TestReviewNavigation({ onPrevious, onNext, onFinishReview, hasPrev, hasNext }) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 inset-x-0 flex justify-center z-50"
    >
      <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-2">
        <motion.button onClick={onPrevious} disabled={!hasPrev} whileHover={{ scale: 1.1 }} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 disabled:opacity-50">
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        
        <motion.button 
          onClick={onFinishReview} 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 rounded-xl transition-all"
        >
          <CheckSquare className="h-4 w-4" />
          <span className="text-sm font-medium">Finish Review</span>
        </motion.button>
        
        <motion.button onClick={onNext} disabled={!hasNext} whileHover={{ scale: 1.1 }} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 disabled:opacity-50">
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
