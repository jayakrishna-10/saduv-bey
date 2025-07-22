// app/components/quiz/QuizNavigation.js - Simplified with only essential action buttons
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  Flag,
  MessageSquare
} from 'lucide-react';
import { QuizFeedbackModal } from './QuizFeedbackModal';

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
  onFinishQuiz,
  currentQuestion
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

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

  // Mobile Floating Navigation - Simplified single row design
  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-6 left-4 right-4 z-50"
            >
              {/* Single Row Navigation Dock */}
              <motion.div
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-3"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="flex items-center justify-between gap-2">
                  {/* Previous */}
                  <motion.button
                    onClick={onPrevious}
                    disabled={!hasPrevQuestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-xl transition-all ${
                      hasPrevQuestion
                        ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </motion.button>

                  {/* Center Action Buttons - Only 3 essential buttons */}
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    {/* Show Answer Button */}
                    <motion.button
                      onClick={onShowAnswer}
                      disabled={showFeedback || showAnswer}
                      whileHover={{ scale: (showFeedback || showAnswer) ? 1 : 1.05 }}
                      whileTap={{ scale: (showFeedback || showAnswer) ? 1 : 0.95 }}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        (showFeedback || showAnswer)
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
                      }`}
                      title="Show Answer"
                    >
                      <Lightbulb className="h-4 w-4" />
                      <span className="hidden xs:inline">Answer</span>
                    </motion.button>

                    {/* Feedback Button */}
                    <motion.button
                      onClick={() => setIsFeedbackModalOpen(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 transition-all text-sm font-medium"
                      title="Report Issue"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden xs:inline">Report</span>
                    </motion.button>

                    {/* Finish Button */}
                    <motion.button
                      onClick={onFinishQuiz}
                      disabled={answeredQuestions.length === 0}
                      whileHover={{ scale: answeredQuestions.length === 0 ? 1 : 1.05 }}
                      whileTap={{ scale: answeredQuestions.length === 0 ? 1 : 0.95 }}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        answeredQuestions.length === 0
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/70 text-orange-700 dark:text-orange-300'
                      }`}
                      title="Finish Quiz"
                    >
                      <Flag className="h-4 w-4" />
                      <span className="hidden xs:inline">Finish</span>
                    </motion.button>
                  </div>

                  {/* Next */}
                  <motion.button
                    onClick={onNext}
                    disabled={!hasNextQuestion && !(showFeedback || showAnswer)}
                    whileHover={{ scale: (hasNextQuestion || showFeedback || showAnswer) ? 1.05 : 1 }}
                    whileTap={{ scale: (hasNextQuestion || showFeedback || showAnswer) ? 0.95 : 1 }}
                    className={`p-2.5 rounded-xl transition-all ${
                      hasNextQuestion || showFeedback || showAnswer
                        ? 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Modal */}
        <QuizFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          question={currentQuestion}
          selectedPaper={currentQuestion?.paper}
        />
      </>
    );
  }

  // Desktop Ambient Navigation - Simplified version
  return (
    <>
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

            {/* Bottom Action Bar - Only 3 essential buttons */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 inset-x-0 flex justify-center z-50"
            >
              <div className="flex items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-3">
                {/* Show Answer */}
                {!showFeedback && !showAnswer && (
                  <motion.button
                    onClick={onShowAnswer}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300 rounded-xl transition-all"
                  >
                    <Lightbulb className="h-5 w-5" />
                    <span className="text-sm font-medium">Show Answer</span>
                  </motion.button>
                )}

                {/* Feedback */}
                <motion.button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-xl transition-all"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">Report Issue</span>
                </motion.button>

                {/* Finish Quiz */}
                {answeredQuestions.length > 0 && (
                  <motion.button
                    onClick={onFinishQuiz}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/70 text-orange-700 dark:text-orange-300 rounded-xl transition-all"
                  >
                    <Flag className="h-5 w-5" />
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

      {/* Feedback Modal for Desktop */}
      <QuizFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        question={currentQuestion}
        selectedPaper={currentQuestion?.paper}
      />
    </>
  );
}
