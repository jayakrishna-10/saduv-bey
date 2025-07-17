// app/components/test/TestNavigation.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  FlagOff,
  Grid3x3, 
  Settings,
  Target,
  Clock,
  CheckSquare,
  MoveHorizontal,
  Send,
  Pause,
  Play,
  BarChart3
} from 'lucide-react';
import { TestTimer, CompactTestTimer } from './TestTimer';
import { MiniQuestionPalette } from './TestQuestionPalette';
import { formatTime, getTimeWarningLevel } from '@/lib/test-utils';

export function TestNavigation({
  mode = 'floating',
  isVisible = true,
  currentQuestionIndex = 0,
  totalQuestions = 0,
  answeredQuestions = new Set(),
  flaggedQuestions = new Set(),
  timeRemaining = 0,
  totalTime = 0,
  isPaused = false,
  isFlagged = false,
  hasNextQuestion = true,
  hasPrevQuestion = true,
  onPrevious,
  onNext,
  onToggleFlag,
  onShowPalette,
  onSubmitTest,
  onPauseResume,
  onShowReview,
  onTimeUp
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const warningLevel = getTimeWarningLevel(timeRemaining, totalTime);

  // Mobile Floating Navigation
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
              {/* Timer and Progress Bar */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200/30 dark:border-gray-700/30">
                <div className="flex items-center gap-3">
                  <CompactTestTimer 
                    totalTime={totalTime}
                    onTimeUp={onTimeUp}
                    isPaused={isPaused}
                    timeRemaining={timeRemaining}
                    warningLevel={warningLevel}
                  />
                  
                  <MiniQuestionPalette
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={totalQuestions}
                    answeredQuestions={answeredQuestions}
                    flaggedQuestions={flaggedQuestions}
                    onShowFullPalette={onShowPalette}
                  />
                </div>

                {/* Pause/Resume Button */}
                <motion.button
                  onClick={onPauseResume}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl transition-all ${
                    isPaused
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400'
                  }`}
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </motion.button>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200/30 dark:border-gray-700/30">
                {/* Previous */}
                <motion.button
                  onClick={onPrevious}
                  disabled={!hasPrevQuestion}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl transition-all ${
                    hasPrevQuestion
                      ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>

                {/* Swipe Instructions */}
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
                  disabled={!hasNextQuestion}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl transition-all ${
                    hasNextQuestion
                      ? 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2 p-3">
                {/* Flag Button */}
                <motion.button
                  onClick={onToggleFlag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    isFlagged
                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                  title={isFlagged ? 'Remove flag' : 'Flag question'}
                >
                  {isFlagged ? <Flag className="h-5 w-5 fill-current" /> : <FlagOff className="h-5 w-5" />}
                  <span className="text-xs font-medium">Flag</span>
                </motion.button>

                {/* Palette Button */}
                <motion.button
                  onClick={onShowPalette}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 transition-all"
                  title="Question Navigator"
                >
                  <Grid3x3 className="h-5 w-5" />
                  <span className="text-xs font-medium">Navigate</span>
                </motion.button>

                {/* Review Button */}
                <motion.button
                  onClick={onShowReview}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 transition-all"
                  title="Review Test"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs font-medium">Review</span>
                </motion.button>

                {/* Submit Button */}
                <motion.button
                  onClick={() => setShowSubmitConfirm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 transition-all"
                  title="Submit Test"
                >
                  <Send className="h-5 w-5" />
                  <span className="text-xs font-medium">Submit</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Ambient Navigation
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
              disabled={!hasPrevQuestion}
              whileHover={{ scale: hasPrevQuestion ? 1.1 : 1, x: hasPrevQuestion ? -8 : 0 }}
              whileTap={{ scale: hasPrevQuestion ? 0.9 : 1 }}
              className={`p-4 rounded-full backdrop-blur-xl border shadow-xl transition-all ${
                hasPrevQuestion
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
              disabled={!hasNextQuestion}
              whileHover={{ 
                scale: hasNextQuestion ? 1.1 : 1, 
                x: hasNextQuestion ? 8 : 0 
              }}
              whileTap={{ scale: hasNextQuestion ? 0.9 : 1 }}
              className={`p-4 rounded-full backdrop-blur-xl border shadow-xl transition-all ${
                hasNextQuestion
                  ? 'bg-indigo-600/90 dark:bg-indigo-500/90 hover:bg-indigo-700/90 dark:hover:bg-indigo-600/90 border-indigo-500/20 dark:border-indigo-400/30 text-white cursor-pointer'
                  : 'bg-white/40 dark:bg-gray-800/40 border-white/10 dark:border-gray-700/30 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </motion.div>

          {/* Top Timer Bar */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl px-6 py-3">
              <TestTimer 
                totalTime={totalTime}
                onTimeUp={onTimeUp}
                isPaused={isPaused}
                isVisible={true}
                showWarnings={true}
              />
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {answeredQuestions.size} answered • {flaggedQuestions.size} flagged
              </div>

              {/* Pause/Resume Button */}
              <motion.button
                onClick={onPauseResume}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  isPaused
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                    : 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
                }`}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                <span className="text-sm font-medium">
                  {isPaused ? 'Resume' : 'Pause'}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Bottom Action Bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 inset-x-0 flex justify-center z-50"
          >
            <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-2">
              {/* Flag */}
              <motion.button
                onClick={onToggleFlag}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isFlagged
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                {isFlagged ? <Flag className="h-4 w-4 fill-current" /> : <FlagOff className="h-4 w-4" />}
                <span className="text-sm font-medium">
                  {isFlagged ? 'Flagged' : 'Flag'}
                </span>
              </motion.button>

              {/* Navigator */}
              <motion.button
                onClick={onShowPalette}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 rounded-xl transition-all"
              >
                <Grid3x3 className="h-4 w-4" />
                <span className="text-sm font-medium">Navigate</span>
              </motion.button>

              {/* Review */}
              <motion.button
                onClick={onShowReview}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-xl transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-medium">Review</span>
              </motion.button>

              {/* Submit */}
              <motion.button
                onClick={() => setShowSubmitConfirm(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 rounded-xl transition-all"
              >
                <Send className="h-4 w-4" />
                <span className="text-sm font-medium">Submit Test</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-md p-6 shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Submit Test?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to submit your test? This action cannot be undone.
                </p>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Answered:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {answeredQuestions.size}/{totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Flagged:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {flaggedQuestions.size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time remaining:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSubmitConfirm(false)}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all font-medium"
                  >
                    Cancel
                  </button>
                  
                  <motion.button
                    onClick={() => {
                      setShowSubmitConfirm(false);
                      onSubmitTest();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-lg"
                  >
                    Submit Test
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
