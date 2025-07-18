// app/components/quiz/QuizNavigation.js - Updated with swipe instructions
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  BarChart3, 
  Settings,
  Target,
  Award,
  Flag,
  CheckSquare,
  MoveHorizontal
} from 'lucide-react';

export function QuizNavigation({
  mode = 'floating',
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
  onShowSummary,
  onShowConfig,
  onFinishQuiz
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

  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const accuracy = answeredQuestions.length > 0 ? Math.round((correctAnswers / answeredQuestions.length) * 100) : 0;

  // Mobile Floating Navigation - With swipe instructions
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
            {/* Main Navigation Dock - Always shows 4 buttons */}
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

              {/* Always Visible Action Buttons */}
              <div className="grid grid-cols-4 gap-2 p-3">
                {/* Show Answer Button */}
                <motion.button
                  onClick={onShowAnswer}
                  disabled={showFeedback || showAnswer}
                  whileHover={{ scale: (showFeedback || showAnswer) ? 1 : 1.05 }}
                  whileTap={{ scale: (showFeedback || showAnswer) ? 1 : 0.95 }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    (showFeedback || showAnswer)
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
                  }`}
                  title="Show Answer"
                >
                  <Lightbulb className="h-5 w-5" />
                  <span className="text-xs font-medium">Answer</span>
                </motion.button>

                {/* Summary Button */}
                <motion.button
                  onClick={onShowSummary}
                  disabled={answeredQuestions.length === 0}
                  whileHover={{ scale: answeredQuestions.length === 0 ? 1 : 1.05 }}
                  whileTap={{ scale: answeredQuestions.length === 0 ? 1 : 0.95 }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    answeredQuestions.length === 0
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300'
                  }`}
                  title="View Summary"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs font-medium">Summary</span>
                </motion.button>

                {/* Settings Button */}
                <motion.button
                  onClick={onShowConfig}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 transition-all"
                  title="Quiz Settings"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-xs font-medium">Settings</span>
                </motion.button>

                {/* Finish Button */}
                <motion.button
                  onClick={onFinishQuiz}
                  disabled={answeredQuestions.length === 0}
                  whileHover={{ scale: answeredQuestions.length === 0 ? 1 : 1.05 }}
                  whileTap={{ scale: answeredQuestions.length === 0 ? 1 : 0.95 }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    answeredQuestions.length === 0
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/70 text-orange-700 dark:text-orange-300'
                  }`}
                  title="Finish Quiz"
                >
                  <Flag className="h-5 w-5" />
                  <span className="text-xs font-medium">Finish</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Ambient Navigation - Keep existing behavior with centered bottom bar
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

          {/* Bottom Action Bar - Properly centered */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 inset-x-0 flex justify-center z-50"
          >
            <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-2">
              {/* Show Answer */}
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

              {/* Summary */}
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

              {/* Settings */}
              <motion.button
                onClick={onShowConfig}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 rounded-xl transition-all"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
              </motion.button>

              {/* Finish Quiz */}
              {answeredQuestions.length > 0 && (
                <motion.button
                  onClick={onFinishQuiz}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/70 text-orange-700 dark:text-orange-300 rounded-xl transition-all"
                >
                  <Flag className="h-4 w-4" />
                  <span className="text-sm font-medium">Finish Quiz</span>
                </motion.button>
              )}
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
