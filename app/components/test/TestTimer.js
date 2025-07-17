// app/components/test/TestTimer.js - Test Timer Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Zap, Timer } from 'lucide-react';

export function TestTimer({ 
  timeRemaining, 
  totalTime, 
  isActive,
  testType 
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [lastWarningTime, setLastWarningTime] = useState(null);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeStatus = () => {
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage > 50) return 'safe';
    if (percentage > 25) return 'warning';
    if (percentage > 10) return 'critical';
    return 'danger';
  };

  const getTimeColor = () => {
    const status = getTimeStatus();
    switch (status) {
      case 'safe': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700';
      case 'critical': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700';
      case 'danger': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700';
    }
  };

  const getIcon = () => {
    const status = getTimeStatus();
    switch (status) {
      case 'safe': return Clock;
      case 'warning': return Timer;
      case 'critical': return AlertTriangle;
      case 'danger': return Zap;
      default: return Clock;
    }
  };

  // Show warnings at specific time intervals
  useEffect(() => {
    if (!isActive) return;

    const status = getTimeStatus();
    const currentMinute = Math.floor(timeRemaining / 60);
    
    // Warning thresholds for different test types
    const warningTimes = testType === 'mock' 
      ? [30, 15, 10, 5, 2, 1] // Minutes for mock test
      : [5, 2, 1]; // Minutes for practice test
    
    const shouldShowWarning = warningTimes.includes(currentMinute) && 
                             timeRemaining % 60 === 0 && 
                             lastWarningTime !== currentMinute;

    if (shouldShowWarning) {
      setShowWarning(true);
      setLastWarningTime(currentMinute);
      
      // Auto-hide warning after 3 seconds
      setTimeout(() => setShowWarning(false), 3000);
      
      // Add vibration if available
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  }, [timeRemaining, isActive, testType, lastWarningTime]);

  const Icon = getIcon();
  const percentage = (timeRemaining / totalTime) * 100;

  return (
    <>
      {/* Main Timer Display - Fixed Position */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 right-4 z-40"
      >
        <motion.div
          animate={{ 
            scale: getTimeStatus() === 'danger' ? [1, 1.05, 1] : 1,
          }}
          transition={{ 
            duration: 1, 
            repeat: getTimeStatus() === 'danger' ? Infinity : 0,
            ease: "easeInOut"
          }}
          className={`px-4 py-3 rounded-2xl border-2 backdrop-blur-xl shadow-xl transition-all duration-300 ${getTimeColor()}`}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <div className="text-right">
              <div className="text-lg font-mono font-medium">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs opacity-75">
                {testType === 'mock' ? 'Mock Test' : 'Practice'}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 w-20 h-1 bg-current/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-current rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Time Warning Overlay */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              className={`p-8 rounded-3xl border-2 backdrop-blur-xl shadow-2xl text-center max-w-sm mx-4 ${getTimeColor()}`}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-current/20 flex items-center justify-center"
              >
                <Icon className="h-8 w-8" />
              </motion.div>
              
              <h3 className="text-xl font-semibold mb-2">
                Time Warning!
              </h3>
              
              <p className="text-sm opacity-90 mb-4">
                {Math.floor(timeRemaining / 60)} minute{Math.floor(timeRemaining / 60) !== 1 ? 's' : ''} remaining
              </p>
              
              <div className="text-xs opacity-75">
                {getTimeStatus() === 'danger' 
                  ? 'Final minutes - submit your answers!'
                  : getTimeStatus() === 'critical'
                  ? 'Time is running low!'
                  : 'Plan your remaining time wisely'
                }
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Timer Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden fixed top-0 left-0 right-0 z-30"
      >
        <div className={`px-4 py-2 border-b backdrop-blur-xl ${getTimeColor().replace('border-', 'border-b-')}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {testType === 'mock' ? 'Mock Test' : 'Practice'}
              </span>
            </div>
            
            <div className="text-sm font-mono font-medium">
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          {/* Mobile Progress Bar */}
          <div className="mt-2 w-full h-1 bg-current/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-current rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Time Status Messages */}
      <AnimatePresence>
        {isActive && getTimeStatus() !== 'safe' && !showWarning && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-20 right-4 z-30 hidden md:block"
          >
            <motion.div
              animate={{ 
                x: getTimeStatus() === 'danger' ? [-2, 2, -2, 2, 0] : 0 
              }}
              transition={{ 
                duration: 0.5, 
                repeat: getTimeStatus() === 'danger' ? Infinity : 0,
                repeatDelay: 2
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-xl border ${getTimeColor()}`}
            >
              {getTimeStatus() === 'warning' && '⚠️ Time is running low'}
              {getTimeStatus() === 'critical' && '🚨 Less than 25% time left'}
              {getTimeStatus() === 'danger' && '🔥 Final minutes!'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {getTimeStatus() === 'critical' && `${Math.floor(timeRemaining / 60)} minutes remaining`}
        {getTimeStatus() === 'danger' && `Final ${Math.floor(timeRemaining / 60)} minutes`}
      </div>
    </>
  );
}
