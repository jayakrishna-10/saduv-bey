// app/components/quiz/QuizNavigation.js - Intelligent navigation system
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  BarChart3, 
  Grid3x3,
  Settings,
  Eye,
  EyeOff,
  Target,
  Clock,
  Award
} from 'lucide-react';

export function QuizNavigation({
  mode = 'floating', // 'floating' | 'ambient' | 'hidden'
  isVisible = true,
  questionProgress,
  answeredQuestions,
  hasNextQuestion,
  hasPrevQuestion,
  showFeedback,
  showAnswer,
  onPrevious,
  onNext,
  onShowAnswer,
  onShowOverview,
  onShowSummary,
  onShowConfig
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const accuracy = answeredQuestions.length > 0 ? Math.round((correctAnswers / answeredQuestions.length) * 100) : 0;
  const progressPercentage = (questionProgress.attempted / questionProgress.total) * 100;

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
            {/* Stats Bar (Expandable) */}
            <AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl overflow-hidden"
                >
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 mb-1">
                          <Target className="h-4 w-4" />
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {questionProgress.current}/{questionProgress.total}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Progress</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
                          <Award className="h-4 w-4" />
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {correctAnswers}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Correct</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 mb-1">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {accuracy}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{questionProgress.attempted} answered</span>
                        <span>{questionProgress.total - questionProgress.attempted} remaining</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Navigation Dock */}
            <motion.div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center justify-between p-3">
                {/* Left Section - Navigation */}
                <div className="flex items-center gap-2">
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

                  <motion.button
                    onClick={() => setShowStats(!showStats)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-xl transition-all ${
                      showStats
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {showStats ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </div>

                {/* Center Section - Current Question */}
                <div className="flex-1 text-center px-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Question {questionProgress.current}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {questionProgress.attempted}/{questionProgress.total} completed
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2">
                  {!showFeedback && !showAnswer && (
                    <motion.button
                      onClick={onShowAnswer}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300 transition-all"
                    >
                      <Lightbulb className="h-5 w-5" />
                    </motion.button>
                  )}

                  <motion.button
                    onClick={onNext}
                    disabled={!hasNextQuestion && !(showFeedback || showAnswer)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-xl transition-all ${
                      hasNextQuestion || showFeedback || showAnswer
                        ? 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Secondary Actions (Expandable) */}
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0 }}
                className="overflow-hidden border-t border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="p-3 flex items-center justify-center gap-2">
                  <motion.button
                    onClick={onShowOverview}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    <span className="text-sm">Overview</span>
                  </motion.button>

                  {answeredQuestions.length > 0 && (
                    <motion.button
                      onClick={onShowSummary}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 rounded-lg transition-all"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm">Summary</span>
                    </motion.button>
                  )}

                  <motion.button
                    onClick={onShowConfig}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 rounded-lg transition-all"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Expand/Collapse Toggle */}
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full border border-white/20 dark:border-gray-700/50 shadow-lg flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 rotate-90" />
                </motion.div>
              </motion.button>
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
              whileHover={{ scale: hasPrevQuestion ? 1.1 : 1, x: hasPrevious ? -8 : 0 }}
              whileTap={{ scale: hasPrevious ? 0.9 : 1 }}
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
              disabled={!hasNextQuestion && !(showFeedback || showAnswer)}
              whileHover={{ 
                scale: (hasNextQuestion || showFeedback || showAnswer) ? 1.1 : 1, 
                x: (hasNextQuestion || showFeedback || showAnswer) ? 8 : 0 
              }}
              whileTap={{ scale: (hasNextQuestion || showFeedback || showAnswer) ? 0.9 : 1 }}
              className={`p-4 rounded-full backdrop-blur-xl border shadow-xl transition-all ${
                hasNextQuestion || showFeedback || showAnswer
                  ? 'bg-indigo-600/90 dark:bg-indigo-500/90 hover:bg-indigo-700/90 dark:hover:bg-indigo-600/90 border-indigo-500/20 dark:border-indigo-400/30 text-white cursor-pointer'
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
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-2">
              {!showFeedback && !showAnswer && (
                <motion.button
                  onClick={onShowAnswer}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300 rounded-xl transition-all"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="text-sm font-medium">Show Answer</span>
                </motion.button>
              )}

              <motion.button
                onClick={onShowOverview}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all"
              >
                <Grid3x3 className="h-4 w-4" />
                <span className="text-sm font-medium">Overview</span>
              </motion.button>

              {answeredQuestions.length > 0 && (
                <motion.button
                  onClick={onShowSummary}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 rounded-xl transition-all"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm font-medium">Summary</span>
                </motion.button>
              )}

              <motion.button
                onClick={onShowConfig}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 rounded-xl transition-all"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
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
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(questionProgress.current / questionProgress.total) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {accuracy}% accuracy
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
