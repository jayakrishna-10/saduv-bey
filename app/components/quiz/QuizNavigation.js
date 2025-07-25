// app/components/quiz/QuizNavigation.js - Enhanced with responsive bottom navigation for all screen sizes
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  Flag,
  MessageSquare,
  BarChart3,
  Settings
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
  const [screenWidth, setScreenWidth] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const accuracy = answeredQuestions.length > 0 ? Math.round((correctAnswers / answeredQuestions.length) * 100) : 0;

  // Determine layout based on screen width
  const isExtraSmall = screenWidth > 0 && screenWidth < 320;
  const isSmall = screenWidth > 0 && screenWidth < 360;
  const isMediumMobile = screenWidth > 0 && screenWidth < 480;

  // Mobile Responsive Navigation - Adapts to all screen sizes
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
              className="fixed bottom-4 left-2 right-2 sm:bottom-6 sm:left-4 sm:right-4 z-50"
            >
              {/* Responsive Navigation Dock */}
              <motion.div
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-2 sm:p-3"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className={`flex items-center ${isExtraSmall ? 'gap-1' : isSmall ? 'gap-1.5' : 'gap-2'}`}>
                  {/* Previous Button - Always visible */}
                  <motion.button
                    onClick={onPrevious}
                    disabled={!hasPrevQuestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${
                      isExtraSmall ? 'p-1.5' : isSmall ? 'p-2' : 'p-2.5'
                    } rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                      hasPrevQuestion
                        ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className={`${isExtraSmall ? 'h-4 w-4' : 'h-5 w-5'}`} />
                  </motion.button>

                  {/* Center Action Buttons - Responsive layout */}
                  <div className="flex items-center flex-1 justify-center overflow-hidden">
                    {isExtraSmall ? (
                      // Extra small screens: Only icons, no text, minimal padding
                      <div className="flex items-center gap-1 w-full justify-center">
                        {/* Show Answer Button */}
                        <motion.button
                          onClick={onShowAnswer}
                          disabled={showFeedback || showAnswer}
                          whileHover={{ scale: (showFeedback || showAnswer) ? 1 : 1.05 }}
                          whileTap={{ scale: (showFeedback || showAnswer) ? 1 : 0.95 }}
                          className={`flex items-center justify-center p-1.5 rounded-lg transition-all flex-1 max-w-[60px] ${
                            (showFeedback || showAnswer)
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
                          }`}
                          title="Show Answer"
                        >
                          <Lightbulb className="h-3.5 w-3.5" />
                        </motion.button>

                        {/* Feedback Button */}
                        <motion.button
                          onClick={() => setIsFeedbackModalOpen(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 transition-all flex-1 max-w-[60px]"
                          title="Report Issue"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </motion.button>

                        {/* Finish Button */}
                        <motion.button
                          onClick={onFinishQuiz}
                          disabled={answeredQuestions.length === 0}
                          whileHover={{ scale: answeredQuestions.length === 0 ? 1 : 1.05 }}
                          whileTap={{ scale: answeredQuestions.length === 0 ? 1 : 0.95 }}
                          className={`flex items-center justify-center p-1.5 rounded-lg transition-all flex-1 max-w-[60px] ${
                            answeredQuestions.length === 0
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/70 text-orange-700 dark:text-orange-300'
                          }`}
                          title="Finish Quiz"
                        >
                          <Flag className="h-3.5 w-3.5" />
                        </motion.button>
                      </div>
                    ) : isSmall ? (
                      // Small screens: Icons only, slightly bigger
                      <div className="flex items-center gap-1.5 w-full justify-center">
                        {/* Show Answer Button */}
                        <motion.button
                          onClick={onShowAnswer}
                          disabled={showFeedback || showAnswer}
                          whileHover={{ scale: (showFeedback || showAnswer) ? 1 : 1.05 }}
                          whileTap={{ scale: (showFeedback || showAnswer) ? 1 : 0.95 }}
                          className={`flex items-center justify-center p-2 rounded-lg transition-all flex-1 max-w-[70px] ${
                            (showFeedback || showAnswer)
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
                          }`}
                          title="Show Answer"
                        >
                          <Lightbulb className="h-4 w-4" />
                        </motion.button>

                        {/* Feedback Button */}
                        <motion.button
                          onClick={() => setIsFeedbackModalOpen(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 transition-all flex-1 max-w-[70px]"
                          title="Report Issue"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </motion.button>

                        {/* Finish Button */}
                        <motion.button
                          onClick={onFinishQuiz}
                          disabled={answeredQuestions.length === 0}
                          whileHover={{ scale: answeredQuestions.length === 0 ? 1 : 1.05 }}
                          whileTap={{ scale: answeredQuestions.length === 0 ? 1 : 0.95 }}
                          className={`flex items-center justify-center p-2 rounded-lg transition-all flex-1 max-w-[70px] ${
                            answeredQuestions.length === 0
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/70 text-orange-700 dark:text-orange-300'
                          }`}
                          title="Finish Quiz"
                        >
                          <Flag className="h-4 w-4" />
                        </motion.button>
                      </div>
                    ) : isMediumMobile ? (
                      // Medium mobile screens: Icons with minimal text
                      <div className="flex items-center gap-2 w-full justify-center">
                        {/* Show Answer Button */}
                        <motion.button
                          onClick={onShowAnswer}
                          disabled={showFeedback || showAnswer}
                          whileHover={{ scale: (showFeedback || showAnswer) ? 1 : 1.05 }}
                          whileTap={{ scale: (showFeedback || showAnswer) ? 1 : 0.95 }}
                          className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-all text-xs font-medium flex-1 justify-center min-w-0 ${
                            (showFeedback || showAnswer)
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
                          }`}
                          title="Show Answer"
                        >
                          <Lightbulb className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Ans</span>
                        </motion.button>

                        {/* Feedback Button */}
                        <motion.button
                          onClick={() => setIsFeedbackModalOpen(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1 px-2 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 transition-all text-xs font-medium flex-1 justify-center min-w-0"
                          title="Report Issue"
                        >
                          <MessageSquare className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Report</span>
                        </motion.button>

                        {/* Finish Button */}
                        <motion.button
                          onClick={onFinishQuiz}
                          disabled={answeredQuestions.length === 0}
                          whileHover={{ scale: answeredQuestions.length === 0 ? 1 : 1.05 }}
                          whileTap={{ scale: answeredQuestions.length === 0 ? 1 : 0.95 }}
                          className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-all text-xs font-medium flex-1 justify-center min-w-0 ${
                            answeredQuestions.length === 0
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/70 text-orange-700 dark:text-orange-300'
                          }`}
                          title="Finish Quiz"
                        >
                          <Flag className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Done</span>
                        </motion.button>
                      </div>
                    ) : (
                      // Larger mobile screens: Standard layout with responsive text
                      <div className="flex items-center gap-2 w-full justify-center">
                        {/* Show Answer Button */}
                        <motion.button
                          onClick={onShowAnswer}
                          disabled={showFeedback || showAnswer}
                          whileHover={{ scale: (showFeedback || showAnswer) ? 1 : 1.05 }}
                          whileTap={{ scale: (showFeedback || showAnswer) ? 1 : 0.95 }}
                          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all text-sm font-medium flex-1 justify-center min-w-0 ${
                            (showFeedback || showAnswer)
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
                          }`}
                          title="Show Answer"
                        >
                          <Lightbulb className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Answer</span>
                        </motion.button>

                        {/* Feedback Button */}
                        <motion.button
                          onClick={() => setIsFeedbackModalOpen(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 transition-all text-sm font-medium flex-1 justify-center min-w-0"
                          title="Report Issue"
                        >
                          <MessageSquare className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Report</span>
                        </motion.button>

                        {/* Finish Button */}
                        <motion.button
                          onClick={onFinishQuiz}
                          disabled={answeredQuestions.length === 0}
                          whileHover={{ scale: answeredQuestions.length === 0 ? 1 : 1.05 }}
                          whileTap={{ scale: answeredQuestions.length === 0 ? 1 : 0.95 }}
                          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all text-sm font-medium flex-1 justify-center min-w-0 ${
                            answeredQuestions.length === 0
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/70 text-orange-700 dark:text-orange-300'
                          }`}
                          title="Finish Quiz"
                        >
                          <Flag className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Finish</span>
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Next Button - Always visible */}
                  <motion.button
                    onClick={onNext}
                    disabled={!hasNextQuestion && !(showFeedback || showAnswer)}
                    whileHover={{ scale: (hasNextQuestion || showFeedback || showAnswer) ? 1.05 : 1 }}
                    whileTap={{ scale: (hasNextQuestion || showFeedback || showAnswer) ? 0.95 : 1 }}
                    className={`${
                      isExtraSmall ? 'p-1.5' : isSmall ? 'p-2' : 'p-2.5'
                    } rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                      hasNextQuestion || showFeedback || showAnswer
                        ? 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight className={`${isExtraSmall ? 'h-4 w-4' : 'h-5 w-5'}`} />
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

  // Desktop Enhanced Bottom Navigation - Consolidated design
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

            {/* Simplified Bottom Action Bar */}
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

                {/* Report Issue */}
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
