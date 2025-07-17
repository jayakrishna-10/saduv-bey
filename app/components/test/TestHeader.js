// FILE: app/components/test/TestHeader.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export function TestHeader({ timeRemaining, questionProgress }) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="font-bold text-lg text-gray-800 dark:text-gray-200">
                NCE Test
            </div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/50 px-4 py-2 rounded-full shadow-inner">
                    <Clock className="h-5 w-5" />
                    <span>{formatTime(timeRemaining)}</span>
                </div>
            </motion.div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200/50 dark:bg-gray-700/50">
            <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                animate={{ width: `${(questionProgress.current / questionProgress.total) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            />
        </div>
    </header>
  );
}
