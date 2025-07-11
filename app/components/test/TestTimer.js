// app/components/test/TestTimer.js
import React from 'react';
import { Timer, Clock } from 'lucide-react';

export function TestTimer({ 
  timeRemaining, 
  totalTime, 
  mobile = false 
}) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = (timeRemaining / totalTime) * 100;
  
  if (mobile) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
        <Timer className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs font-mono text-gray-900 dark:text-gray-100">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
      {/* Circular Progress */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200 dark:text-gray-700"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`transition-all duration-1000 ${
              timeRemaining < 300 ? 'text-red-500' : 
              timeRemaining < 600 ? 'text-yellow-500' : 
              timeRemaining < 1800 ? 'text-orange-500' : 'text-emerald-500'
            }`}
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </div>
      </div>
      
      {/* Time Display */}
      <div className="text-gray-900 dark:text-gray-100">
        <div className="text-sm font-medium">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">remaining</div>
      </div>
    </div>
  );
}