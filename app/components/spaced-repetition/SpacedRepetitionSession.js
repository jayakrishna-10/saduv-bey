// app/components/spaced-repetition/SpacedRepetitionSession.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Target, 
  CheckCircle2,
  XCircle,
  Brain,
  Zap,
  Flag,
  Home,
  RotateCcw,
  Play,
  Pause,
  AlertTriangle,
  BookOpen,
  Star
} from 'lucide-react';

import { QuizQuestion } from '../quiz/QuizQuestion';
import { QuizExplanation } from '../quiz/QuizExplanation';
import { QuizSwipeHandler } from '../quiz/QuizSwipeHandler';
import { formatTime } from '@/lib/quiz-utils';

export function SpacedRepetitionSession({
  cards,
  questions,
  currentCardIndex,
  selectedOption,
  showExplanation,
  currentExplanation,
  isLoadingExplanation,
  isExplanationExpanded,
  onOptionSelect,
  onNextCard,
  onPreviousCard,
  onToggleExplanation,
  sessionStats,
  startTime,
  isTransitioning,
  onBackToMenu
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [difficultyRating, setDifficultyRating] = useState(null);
  const [showDifficultyPrompt, setShowDifficultyPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const sessionStartRef = useRef(startTime);
  const pauseStartRef = useRef(null);
  const totalPausedTimeRef = useRef(0);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update session timer
  useEffect(() => {
    if (!startTime || isPaused) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - sessionStartRef.current) / 1000) - totalPausedTimeRef.current;
      setSessionTime(Math.max(0, elapsed));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused]);

  // Handle pause/resume
  const togglePause = () => {
    if (isPaused) {
      // Resume
      if (pauseStartRef.current) {
        const pauseDuration = Math.floor((new Date() - pauseStartRef.current) / 1000);
        totalPausedTimeRef.current += pauseDuration;
        pauseStartRef.current = null;
      }
    } else {
      // Pause
      pauseStartRef.current = new Date();
    }
    setIsPaused(!isPaused);
  };

  // Get current card and question
  const currentCard = cards[currentCardIndex];
  const currentQuestion = questions.find(q => 
    (q.main_id || q.id) === currentCard?.question_id
  );

  // Handle option selection with difficulty prompt
  const handleOptionSelect = (option) => {
    onOptionSelect(option);
    // Show difficulty rating prompt after a delay
    setTimeout(() => {
      setShowDifficultyPrompt(true);
    }, 1500);
  };

  // Handle difficulty rating
  const handleDifficultyRating = (rating) => {
    setDifficultyRating(rating);
    setShowDifficultyPrompt(false);
    // Could send this to the review API if needed
  };

  // Handle next card with cleanup
  const handleNext = () => {
    setDifficultyRating(null);
    setShowDifficultyPrompt(false);
    onNextCard();
  };

  // Handle previous card with cleanup
  const handlePrevious = () => {
    setDifficultyRating(null);
    setShowDifficultyPrompt(false);
    onPreviousCard();
  };

  // Progress calculation
  const progressPercentage = cards.length > 0 ? 
    ((currentCardIndex + 1) / cards.length) * 100 : 0;
  const remainingCards = cards.length - (currentCardIndex + 1);
  const currentAccuracy = sessionStats.reviewed > 0 ? 
    Math.round((sessionStats.correct / sessionStats.reviewed) * 100) : 0;

  // Navigation conditions
  const canGoNext = currentCardIndex < cards.length - 1 || showExplanation;
  const canGoPrevious = currentCardIndex > 0;

  // Empty state
  if (!currentCard || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/50"
        >
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Cards Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No review cards found for this session
          </p>
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Back to Menu
          </button>
        </motion.div>
      </div>
    );
  }

  const SwipeableContent = ({ children }) => (
    <QuizSwipeHandler
      onSwipeLeft={canGoNext ? handleNext : undefined}
      onSwipeRight={canGoPrevious ? handlePrevious : undefined}
      disabled={isTransitioning}
      currentQuestionIndex={currentCardIndex}
    >
      {children}
    </QuizSwipeHandler>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Session Header */}
      <div className="sticky top-16 z-30 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Card {currentCardIndex + 1} of {cards.length}
                </span>
                {currentCard.paper && (
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                    {currentCard.paper.replace('paper', 'Paper ')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(sessionTime)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Target className="h-4 w-4" />
                  <span>{sessionStats.correct}/{sessionStats.reviewed}</span>
                </div>
                {sessionStats.reviewed > 0 && (
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Brain className="h-4 w-4" />
                    <span>{currentAccuracy}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToMenu}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm">Menu</span>
              </button>
              
              <button
                onClick={togglePause}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                <span className="text-sm">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {remainingCards} cards remaining
            </div>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 m-6 text-center border border-white/20 dark:border-gray-700/50"
            >
              <Pause className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                Session Paused
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Take your time. Resume when you're ready.
              </p>
              <button
                onClick={togglePause}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Resume Session
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-4">
        <SwipeableContent>
          <div className="max-w-4xl mx-auto">
            {/* Question */}
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <QuizQuestion
                question={currentQuestion}
                questionIndex={currentCardIndex}
                totalQuestions={cards.length}
                selectedOption={selectedOption}
                showFeedback={showExplanation}
                showAnswer={showExplanation}
                onOptionSelect={handleOptionSelect}
                isTransitioning={isTransitioning}
                questionProgress={{
                  current: currentCardIndex + 1,
                  total: cards.length,
                  attempted: sessionStats.reviewed
                }}
              />
            </motion.div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && currentExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mb-6"
                >
                  <QuizExplanation
                    explanation={currentExplanation}
                    isExpanded={isExplanationExpanded}
                    onToggle={onToggleExplanation}
                    isLoading={isLoadingExplanation}
                    correctAnswer={currentQuestion.correct_answer}
                    selectedAnswer={selectedOption}
                    questionText={currentQuestion.question_text}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Difficulty Rating Prompt */}
            <AnimatePresence>
              {showDifficultyPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 text-center">
                      How difficult was this question?
                    </h3>
                    <div className="flex justify-center gap-3">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleDifficultyRating(rating)}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${
                            difficultyRating === rating
                              ? 'bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-900/50 dark:border-yellow-600 dark:text-yellow-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          <Star className={`h-5 w-5 mx-auto ${
                            difficultyRating === rating ? 'fill-current' : ''
                          }`} />
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>Very Easy</span>
                      <span>Very Hard</span>
                    </div>
                    <button
                      onClick={() => setShowDifficultyPrompt(false)}
                      className="mt-4 w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Skip rating
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SwipeableContent>
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <>
          {/* Previous Button */}
          <AnimatePresence>
            {canGoPrevious && (
              <motion.button
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-full shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all disabled:opacity-50"
              >
                <ArrowLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Next Button */}
          <AnimatePresence>
            {canGoNext && (
              <motion.button
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                onClick={handleNext}
                disabled={isTransitioning}
                className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 p-4 bg-indigo-600/90 dark:bg-indigo-500/90 backdrop-blur-xl border border-indigo-500/20 dark:border-indigo-400/30 rounded-full shadow-xl hover:bg-indigo-700/90 dark:hover:bg-indigo-600/90 transition-all disabled:opacity-50"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious || isTransitioning}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex-1 mx-4 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {currentCardIndex + 1} / {cards.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {currentAccuracy}% accuracy
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!canGoNext || isTransitioning}
                className="p-3 rounded-xl bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentCardIndex === cards.length - 1 ? (
                  <Flag className="h-5 w-5" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Complete Indicator */}
      {currentCardIndex === cards.length - 1 && selectedOption && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-emerald-100/90 dark:bg-emerald-900/90 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-6 py-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Session complete! Click next to see results.</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
