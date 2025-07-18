// FILE: app/components/test/TestHeader.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Edit } from 'lucide-react';

export function TestHeader({ timeRemaining, questionProgress, testMode = 'mock' }) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const totalTime = testMode === 'mock' ? 3600 : questionProgress.total * 72; // 60 min for mock, 72s per question for practice
    const percentRemaining = (timeRemaining / totalTime) * 100;
    
    if (percentRemaining > 25) return 'text-emerald-600 dark:text-emerald-400';
    if (percentRemaining > 10) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getModeIcon = () => {
    return testMode === 'mock' ? FileText : Edit;
  };

  const ModeIcon = getModeIcon();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Test Mode Badge */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              testMode === 'mock' 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            }`}>
              <ModeIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {testMode === 'mock' ? 'Mock Test' : 'Practice Test'}
              </span>
            </div>
          </div>

          {/* Progress and Timer */}
          <div className="flex items-center gap-6">
            {/* Question Progress */}
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Question <span className="text-gray-900 dark:text-gray-100">{questionProgress.current}</span> of {questionProgress.total}
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl ${getTimeColor()}`}>
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
