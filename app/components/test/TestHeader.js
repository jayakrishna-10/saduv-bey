// FILE: app/components/test/TestHeader.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Grid, Flag } from 'lucide-react';

export function TestHeader({ timeRemaining, questionProgress, onPaletteToggle, onFinishConfirm }) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="font-bold text-lg text-gray-800 dark:text-gray-200">
          NCE Mock Test
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-red-500 font-semibold bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-full">
            <Clock className="h-5 w-5" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
          
          <div className="text-gray-600 dark:text-gray-300">
            {questionProgress.current} / {questionProgress.total}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onPaletteToggle} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Grid className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button onClick={onFinishConfirm} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
            <Flag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
