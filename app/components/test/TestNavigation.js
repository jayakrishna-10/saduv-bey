// app/components/test/TestNavigation.js - Test Navigation Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  FlagOff,
  Grid3x3, 
  CheckSquare,
  Clock,
  Target,
  MoveHorizontal,
  Pause,
  Play
} from 'lucide-react';

export function TestNavigation({
  isVisible = true,
  questionProgress,
  hasNext,
  hasPrevious,
  onPrevious,
  onNext,
  onToggleFlag,
  onShowPalette,
  onFinishTest,
  isCurrentFlagged,
  hasAnswer,
  submittedCount,
  isTestActive
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const progressPercentage = (questionProgress.current / questionProgress.total) * 100;
  const attemptedPercentage = (submittedCount / questionProgress.total) * 100;

  // Mobile Navigation
  if (isMobile) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-4 right-4 z-50"
          >
            {/* Main Navigation Dock */}
            <motion.div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Navigation Arrows with Swipe Instructions */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200/30 dark:border-gray-700/30">
                {/* Previous */}
                <motion.button
                  onClick={onPrevious}
                  disabled={!hasPrevious}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl transition-all ${
                    hasPrevious
                      ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>

                {/* Swipe Instructions with Test-specific styling */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                >
                  <span className="text-xs opacity-70">👈</span>
                  <MoveHorizontal className="h-4 w-4 opacity-60" />
                  <span className="text-xs font-medium opacity-70">Swipe to navigate</span>
                  <span className="text-xs opacity-70">👉</span>
                </motion.div>

                {/* Next */}
                <motion.button
                  onClick={onNext}
                  disabled={!hasNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl transition-all ${
                    hasNext
                      ? 'bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2 p-3">
                {/* Flag Toggle */}
                <motion.button
                  onClick={onToggleFlag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    isCurrentFlagged
                      ? 'bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900/70 text-amber-700 dark:text-amber-300'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                  title={isCurrentFlagged ? "Remove Flag" : "Flag Question"}
                >
                  {isCurrentFlagged ? (
                    <Flag className="h-5 w-5 fill-current" />
                  ) : (
                    <FlagOff className="h-5 w-5" />
                  )}
                  <span className="text-xs font-medium">Flag</span>
                </motion.button>

                {/* Question Palette */}
                <motion.button
                  onClick={onShowPalette}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 transition-all"
                  title="Question Palette"
                >
                  <Grid3x3 className="h-5 w-5" />
                  <span className="text-xs font-medium">Palette</span>
                </motion.button>

                {/* Progress Summary */}
                <motion.button
                  disabled
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 transition-all cursor-default"
                  title="Progress"
                >
                  <Target className="h-5 w-5" />
                  <span className="text-xs font-medium">{submittedCount}/{questionProgress.total}</span>
                </motion.button>

                {/* Finish Test */}
                <motion.button
                  onClick={onFinishTest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 transition-all"
                  title="Finish Test"
                >
                  <CheckSquare className="h-5 w-5" />
                  <span className="text-xs font-medium">Finish</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Navigation
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Left Navigation Orb */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50"
          >
            <motion.button
              onClick={onPrevious}
              disabled={!hasPrevious}
              whileHover={{ scale: hasPrevious ? 1.1 : 1, x: hasPrevious ? -8 : 0 }}
              whileTap={{ scale: hasPrevious ? 0.9 : 1 }}
              className={`p-4 rounded-full backdrop-blur-xl border shadow-xl transition-all ${
                hasPrevious
                  ? 'bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 cursor-pointer'
                  : 'bg-white/40 dark:bg-gray-800/40 border-white/10 dark:border-gray-700/30 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
          </motion.div>

          {/* Right Navigation Orb */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
          >
            <motion.button
              onClick={onNext}
              disabled={!hasNext}
              whileHover={{ 
                scale: hasNext ? 1.1 : 1, 
                x: hasNext ? 8 : 0 
              }}
              whileTap={{ scale: hasNext ? 0.9 : 1 }}
              className={`p-4 rounded-full backdrop-blur-xl border shadow-xl transition-all ${
                hasNext
                  ? 'bg-orange-600/90 dark:bg-orange-500/90 hover:bg-orange-700/90 dark:hover:bg-orange-600/90 border-orange-500/20 dark:border-orange-400/30 text-white cursor-pointer'
                  : 'bg-white/40 dark:bg-gray-800/40 border-white/10 dark:border-gray-700/30 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </motion.div>

          {/* Bottom Action Bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 inset-x-0 flex justify-center z-50"
          >
            <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-2">
              {/* Flag Toggle */}
              <motion.button
                onClick={onToggleFlag}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isCurrentFlagged
                    ? 'bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900/70 text-amber-700 dark:text-amber-300'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                {isCurrentFlagged ? (
                  <Flag className="h-4 w-4 fill-current" />
                ) : (
                  <FlagOff className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {isCurrentFlagged ? 'Unflag' : 'Flag'}
                </span>
              </motion.button>

              {/* Question Palette */}
              <motion.button
                onClick={onShowPalette}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-xl transition-all"
              >
                <Grid3x3 className="h-4 w-4" />
                <span className="text-sm font-medium">Question Palette</span>
              </motion.button>

              {/* Finish Test */}
              <motion.button
                onClick={onFinishTest}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 rounded-xl transition-all"
              >
                <CheckSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Finish Test</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl px-6 py-3">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Question {questionProgress.current} of {questionProgress.total}
                </div>
                
                {/* Dual Progress Bar */}
                <div className="relative w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  {/* Current Position */}
                  <motion.div
                    className="absolute h-full bg-gradient-to-r from-orange-500 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Attempted Questions */}
                  <motion.div
                    className="absolute h-full bg-emerald-500/50 dark:bg-emerald-400/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${attemptedPercentage}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {submittedCount} answered
                </div>
                
                {/* Test Status */}
                <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  isTestActive 
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {isTestActive ? (
                    <>
                      <Play className="h-3 w-3" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3 w-3" />
                      <span>Paused</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
