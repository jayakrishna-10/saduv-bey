// app/components/test/TestTimer.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Zap } from 'lucide-react';
import { formatTime, getTimeWarningLevel } from '@/lib/test-utils';

export function TestTimer({ 
  totalTime, 
  onTimeUp, 
  isPaused = false, 
  isVisible = true,
  showWarnings = true 
}) {
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [warningLevel, setWarningLevel] = useState('normal');
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio for warnings (only if supported)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      // Create a simple beep sound
      const createBeep = (frequency = 800, duration = 200) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      };
      
      audioRef.current = createBeep;
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          setShowTimeUpModal(true);
          if (onTimeUp) {
            setTimeout(() => onTimeUp(), 2000); // Give 2 seconds to show modal
          }
          return 0;
        }
        
        // Update warning level
        const newWarningLevel = getTimeWarningLevel(newTime, totalTime);
        if (newWarningLevel !== warningLevel) {
          setWarningLevel(newWarningLevel);
          
          // Play warning sounds
          if (showWarnings && audioRef.current) {
            if (newWarningLevel === 'critical') {
              // Critical warning - urgent beep
              audioRef.current(1000, 300);
            } else if (newWarningLevel === 'warning') {
              // Warning - moderate beep
              audioRef.current(800, 200);
            }
          }
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, totalTime, warningLevel, showWarnings, onTimeUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getTimerColor = () => {
    switch (warningLevel) {
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-600';
      case 'warning':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-600';
      case 'caution':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-600';
      default:
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-600';
    }
  };

  const getTimerIcon = () => {
    switch (warningLevel) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <Zap className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const progressPercentage = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  if (!isVisible) return null;

  return (
    <>
      {/* Main Timer Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${getTimerColor()}`}
      >
        <motion.div
          animate={{ 
            scale: warningLevel === 'critical' ? [1, 1.2, 1] : 1,
            rotate: warningLevel === 'critical' ? [0, -5, 5, 0] : 0
          }}
          transition={{ 
            duration: warningLevel === 'critical' ? 0.5 : 0,
            repeat: warningLevel === 'critical' ? Infinity : 0,
            repeatDelay: 1
          }}
        >
          {getTimerIcon()}
        </motion.div>
        
        <motion.span 
          className="font-mono text-lg font-bold"
          animate={{ 
            scale: warningLevel === 'critical' ? [1, 1.1, 1] : 1 
          }}
          transition={{ 
            duration: 0.5,
            repeat: warningLevel === 'critical' ? Infinity : 0,
            repeatDelay: 1
          }}
        >
          {formatTime(timeRemaining)}
        </motion.span>
        
        {isPaused && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900 px-2 py-1 rounded-full"
          >
            PAUSED
          </motion.span>
        )}
      </motion.div>

      {/* Progress Bar */}
      <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ml-2">
        <motion.div
          className={`h-full transition-all duration-1000 ${
            warningLevel === 'critical' 
              ? 'bg-red-500' 
              : warningLevel === 'warning' 
                ? 'bg-orange-500'
                : warningLevel === 'caution'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Warning Notifications */}
      <AnimatePresence>
        {showWarnings && warningLevel !== 'normal' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`p-4 rounded-2xl border-2 shadow-lg backdrop-blur-xl ${getTimerColor()}`}>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ 
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  {getTimerIcon()}
                </motion.div>
                <div>
                  <div className="font-semibold">
                    {warningLevel === 'critical' 
                      ? 'Time Critical!' 
                      : warningLevel === 'warning'
                        ? 'Time Warning!'
                        : 'Time Notice'
                    }
                  </div>
                  <div className="text-sm opacity-90">
                    {warningLevel === 'critical' 
                      ? 'Less than 10% time remaining'
                      : warningLevel === 'warning'
                        ? 'Less than 25% time remaining' 
                        : 'Half time completed'
                    }
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Up Modal */}
      <AnimatePresence>
        {showTimeUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 p-8 text-center shadow-2xl max-w-md mx-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity
                }}
                className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <AlertTriangle className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Time's Up!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your test time has expired. The test will be submitted automatically.
              </p>
              
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity
                }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Submitting test...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Compact version for mobile
export function CompactTestTimer({ 
  totalTime, 
  onTimeUp, 
  isPaused = false,
  timeRemaining,
  warningLevel = 'normal'
}) {
  const getTimerColor = () => {
    switch (warningLevel) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-orange-600 dark:text-orange-400';
      case 'caution':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ 
          scale: warningLevel === 'critical' ? [1, 1.1, 1] : 1 
        }}
        transition={{ 
          duration: 0.5,
          repeat: warningLevel === 'critical' ? Infinity : 0,
          repeatDelay: 1
        }}
        className={`text-sm font-mono font-bold ${getTimerColor()}`}
      >
        {formatTime(timeRemaining)}
      </motion.div>
      
      {isPaused && (
        <span className="text-xs bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900 px-1 py-0.5 rounded">
          PAUSED
        </span>
      )}
    </div>
  );
}
