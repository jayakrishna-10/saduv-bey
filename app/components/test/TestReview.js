// app/components/test/TestReview.js - Mobile optimized for better readability
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Flag,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { isCorrectAnswer, normalizeChapterName } from '@/lib/quiz-utils';
import { TestReviewNavigation } from './TestReviewNavigation';
import { QuestionPalette } from './QuestionPalette';
import { ExplanationDisplay } from '../ExplanationDisplay';
import { QuizFeedbackModal } from '../quiz/QuizFeedbackModal';

export function TestReview({ questions, answers, flaggedQuestions, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [explanations, setExplanations] = useState({});
  const [loadingExplanations, setLoadingExplanations] = useState({});
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse position tracking for ambient effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentQuestion = questions[currentIndex] || {};
  const currentQuestionId = currentQuestion.main_id || currentQuestion.id;
  const userAnswer = answers[currentQuestionId];
  const isCorrect = isCorrectAnswer(userAnswer, currentQuestion.correct_answer);

  // Load explanation for current question
  const loadExplanation = useCallback(async (questionId, paper) => {
    // Check if already loaded or loading
    if (explanations[questionId] || loadingExplanations[questionId]) {
      return;
    }

    setLoadingExplanations(prev => ({ ...prev, [questionId]: true }));

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, paper })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch explanation');
      }

      const result = await response.json();
      setExplanations(prev => ({
        ...prev,
        [questionId]: result.explanation || null
      }));
    } catch (error) {
      console.error('Error loading explanation:', error);
      setExplanations(prev => ({
        ...prev,
        [questionId]: null
      }));
    } finally {
      setLoadingExplanations(prev => {
        const newState = { ...prev };
        delete newState[questionId];
        return newState;
      });
    }
  }, [explanations, loadingExplanations]);

  // Load explanation when question changes
  useEffect(() => {
    if (currentQuestion && currentQuestionId) {
      // Determine the paper from the question tag or use a default
      const paper = currentQuestion.paper || 
                   (currentQuestion.tag?.toLowerCase().includes('paper1') ? 'paper1' :
                    currentQuestion.tag?.toLowerCase().includes('paper2') ? 'paper2' :
                    currentQuestion.tag?.toLowerCase().includes('paper3') ? 'paper3' : 'paper1');
      
      loadExplanation(currentQuestionId, paper);
    }
  }, [currentQuestionId, currentQuestion, loadExplanation]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          if (isFeedbackModalOpen) {
            setIsFeedbackModalOpen(false);
          } else if (isPaletteOpen) {
            setPaletteOpen(false);
          } else {
            onExit();
          }
          break;
        case 'p':
          e.preventDefault();
          setPaletteOpen(!isPaletteOpen);
          break;
        case 'e':
          e.preventDefault();
          setShowDetailedExplanation(!showDetailedExplanation);
          break;
        case 'r':
          e.preventDefault();
          setIsFeedbackModalOpen(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaletteOpen, showDetailedExplanation, isFeedbackModalOpen]);

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      setPaletteOpen(false);
    }
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % questions.length;
    setCurrentIndex(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? questions.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
  };

  // Custom status function for review mode
  const getQuestionStatus = (index) => {
    const question = questions[index];
    const questionId = question.main_id || question.id;
    const userAnswer = answers[questionId];
    
    // Always show current question status first
    if (index === currentIndex) return 'current';
    
    // Then check answer status
    if (!userAnswer) return 'unanswered';
    return isCorrectAnswer(userAnswer, question.correct_answer) ? 'correct' : 'incorrect';
  };

  // Custom status configuration for review mode
  const reviewStatusConfig = {
    current: 'bg-indigo-600 text-white ring-2 ring-indigo-400',
    correct: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-700',
    incorrect: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-700',
    unanswered: 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600'
  };

  // Custom legend for review mode
  const reviewLegendItems = [
    { color: 'bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-700', label: 'Correct Answer' },
    { color: 'bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700', label: 'Incorrect Answer' },
    { color: 'bg-gray-100 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600', label: 'Unanswered' },
    { color: 'bg-indigo-600', label: 'Current' }
  ];

  const currentExplanation = explanations[currentQuestionId];
  const isLoadingExplanation = loadingExplanations[currentQuestionId];

  // Determine the paper for the current question for feedback modal
  const currentPaper = currentQuestion.paper || 
                      (currentQuestion.tag?.toLowerCase().includes('paper1') ? 'paper1' :
                       currentQuestion.tag?.toLowerCase().includes('paper2') ? 'paper2' :
                       currentQuestion.tag?.toLowerCase().includes('paper3') ? 'paper3' : 'paper1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 opacity-40 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-30 blur-3xl"
        />
      </div>

      {/* Header - Mobile optimized */}
      <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30">
        <div className={`max-w-6xl mx-auto ${isMobile ? 'px-4 py-4' : 'px-6 py-6'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-6">
              <motion.button
                onClick={onExit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 md:gap-3 ${isMobile ? 'px-3 py-2' : 'px-4 py-2.5'} bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-xl md:rounded-2xl transition-all border border-gray-200/50 dark:border-gray-700/50 shadow-sm`}
              >
                <ArrowLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {isMobile ? 'Back' : 'Back to Summary'}
                </span>
              </motion.button>
              
              <div>
                <h1 className={`font-light text-gray-900 dark:text-gray-100 mb-1 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  Test Review
                </h1>
                <p className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile optimized */}
      <main className={`relative z-10 max-w-6xl mx-auto ${isMobile ? 'px-4 py-4 pb-20' : 'px-6 py-8 pb-32'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden"
          >
            {/* Question Header - Mobile optimized */}
            <div className={`${isMobile ? 'p-4' : 'p-8'} border-b border-gray-200/50 dark:border-gray-700/50`}>
              <div className={`flex items-center justify-between ${isMobile ? 'mb-4' : 'mb-6'}`}>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className={`font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 ${isMobile ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'} rounded-full`}>
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  {flaggedQuestions.has(currentQuestionId) && (
                    <div className={`flex items-center gap-1 md:gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 ${isMobile ? 'px-3 py-1' : 'px-4 py-2'} rounded-full`}>
                      <Flag className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                      <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Flagged</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  {isCorrect ? (
                    <div className={`flex items-center gap-2 md:gap-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 ${isMobile ? 'px-3 py-1.5' : 'px-5 py-2.5'} rounded-full`}>
                      <CheckCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      <span className={`font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>Correct</span>
                    </div>
                  ) : userAnswer ? (
                    <div className={`flex items-center gap-2 md:gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 ${isMobile ? 'px-3 py-1.5' : 'px-5 py-2.5'} rounded-full`}>
                      <XCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      <span className={`font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>Incorrect</span>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2 md:gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 ${isMobile ? 'px-3 py-1.5' : 'px-5 py-2.5'} rounded-full`}>
                      <AlertCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      <span className={`font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>Unanswered</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'mb-4 text-xs' : 'mb-6 text-sm'}`}>
                {normalizeChapterName(currentQuestion.tag)} • {currentQuestion.year}
              </div>

              <h3 className={`leading-relaxed text-gray-900 dark:text-gray-100 ${isMobile ? 'text-base' : 'text-xl'}`}>
                {currentQuestion.question_text}
              </h3>
            </div>

            {/* Options - Mobile optimized */}
            <div className={`${isMobile ? 'p-4' : 'p-8'} space-y-3 md:space-y-4`}>
              {['a', 'b', 'c', 'd'].map((option) => {
                const optionText = currentQuestion[`option_${option}`];
                const isUserAnswer = userAnswer === option;
                const isCorrectOption = currentQuestion.correct_answer?.toLowerCase() === option;
                
                return (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * parseInt(option.charCodeAt(0) - 97) }}
                    className={`${isMobile ? 'p-3' : 'p-6'} rounded-xl md:rounded-2xl border-2 transition-all ${
                      isCorrectOption
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : isUserAnswer && !isCorrect
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className={`flex-shrink-0 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center font-bold ${isMobile ? 'text-xs' : 'text-sm'} ${
                        isCorrectOption
                          ? 'bg-emerald-500 text-white'
                          : isUserAnswer && !isCorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}>
                        {option.toUpperCase()}
                      </div>
                      
                      <div className="flex-1">
                        <span className={`${isMobile ? 'text-sm' : 'text-lg'} ${
                          isCorrectOption
                            ? 'text-emerald-900 dark:text-emerald-100'
                            : isUserAnswer && !isCorrect
                            ? 'text-red-900 dark:text-red-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {optionText}
                        </span>
                        
                        <div className={`flex items-center gap-4 ${isMobile ? 'mt-2' : 'mt-3'}`}>
                          {isUserAnswer && (
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium ${
                              isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {isCorrect ? '✓ Your answer' : '✗ Your answer'}
                            </span>
                          )}
                          {isCorrectOption && !isUserAnswer && (
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-emerald-600 dark:text-emerald-400`}>
                              ✓ Correct answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Explanation - Mobile optimized */}
            <div className="border-t border-gray-200/50 dark:border-gray-700/50">
              <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-gray-200/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center`}>
                      <Eye className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-indigo-600 dark:text-indigo-400`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-gray-900 dark:text-gray-100 ${isMobile ? 'text-base' : 'text-lg'}`}>
                        Explanation
                      </h4>
                      <p className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        Understanding the correct solution
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isLoadingExplanation && currentExplanation && (
                      <motion.button
                        onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-1 md:gap-2 ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 rounded-lg md:rounded-xl transition-all border border-gray-200/50 dark:border-gray-700/50 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}
                      >
                        {showDetailedExplanation ? (
                          <>
                            <EyeOff className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                            <span className="hidden sm:inline">Simple</span>
                          </>
                        ) : (
                          <>
                            <Eye className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                            <span className="hidden sm:inline">Detailed</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                {isLoadingExplanation ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center gap-3 md:gap-4 text-gray-500 dark:text-gray-400 ${isMobile ? 'py-6' : 'py-8'}`}
                  >
                    <Loader2 className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} animate-spin`} />
                    <span className={`${isMobile ? 'text-base' : 'text-lg'}`}>Loading detailed explanation...</span>
                  </motion.div>
                ) : currentExplanation && showDetailedExplanation ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ExplanationDisplay
                      explanationData={currentExplanation}
                      questionText={currentQuestion.question_text}
                      options={{
                        option_a: currentQuestion.option_a,
                        option_b: currentQuestion.option_b,
                        option_c: currentQuestion.option_c,
                        option_d: currentQuestion.option_d
                      }}
                      correctAnswer={currentQuestion.correct_answer?.toLowerCase()}
                      userAnswer={userAnswer}
                    />
                  </motion.div>
                ) : currentExplanation ? (
                  <SimpleExplanation
                    explanation={currentExplanation}
                    correctAnswer={currentQuestion.correct_answer?.toLowerCase()}
                    userAnswer={userAnswer}
                    isMobile={isMobile}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}
                  >
                    <AlertCircle className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-gray-400 dark:text-gray-500 mx-auto mb-4`} />
                    <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-base' : 'text-lg'}`}>
                      Explanation not available for this question.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <TestReviewNavigation
        onPrevious={goToPrevious}
        onNext={goToNext}
        onFinishReview={onExit}
        hasPrev={questions.length > 1}
        hasNext={questions.length > 1}
        onPaletteToggle={() => setPaletteOpen(true)}
        onFeedbackOpen={() => setIsFeedbackModalOpen(true)}
      />

      {/* Reusable Question Palette */}
      <QuestionPalette
        isOpen={isPaletteOpen}
        onClose={() => setPaletteOpen(false)}
        questions={questions}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        currentQuestionIndex={currentIndex}
        onQuestionSelect={navigateToQuestion}
        getQuestionStatus={getQuestionStatus}
        statusConfig={reviewStatusConfig}
        legendItems={reviewLegendItems}
        title="Question Navigator"
      />

      {/* Feedback Modal */}
      <QuizFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        question={currentQuestion}
        selectedPaper={currentPaper}
      />
    </div>
  );
}

// Simple explanation component for basic view - Mobile optimized
function SimpleExplanation({ explanation, correctAnswer, userAnswer, isMobile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 md:space-y-6`}
    >
      {explanation?.explanation?.concept && (
        <div className={`${isMobile ? 'p-4' : 'p-6'} bg-indigo-50 dark:bg-indigo-900/30 rounded-xl md:rounded-2xl border border-indigo-200 dark:border-indigo-700`}>
          <h5 className={`font-semibold text-indigo-900 dark:text-indigo-100 mb-2 md:mb-3 ${isMobile ? 'text-base' : 'text-lg'}`}>
            {explanation.explanation.concept.title}
          </h5>
          {explanation.explanation.concept.description && (
            <p className={`text-indigo-800 dark:text-indigo-200 ${isMobile ? 'text-sm' : 'text-base'}`}>
              {explanation.explanation.concept.description}
            </p>
          )}
        </div>
      )}
      
      {explanation?.explanation?.correct_answer?.explanation && (
        <div className={`${isMobile ? 'p-4' : 'p-6'} bg-emerald-50 dark:bg-emerald-900/30 rounded-xl md:rounded-2xl border border-emerald-200 dark:border-emerald-700`}>
          <h5 className={`font-semibold text-emerald-900 dark:text-emerald-100 mb-2 md:mb-3 ${isMobile ? 'text-base' : 'text-lg'}`}>
            Why {correctAnswer?.toUpperCase()} is correct:
          </h5>
          <p className={`text-emerald-800 dark:text-emerald-200 ${isMobile ? 'text-sm' : 'text-base'}`}>
            {explanation.explanation.correct_answer.explanation}
          </p>
        </div>
      )}
      
      {userAnswer && userAnswer !== correctAnswer && explanation?.explanation?.incorrect_options?.[`option_${userAnswer}`] && (
        <div className={`${isMobile ? 'p-4' : 'p-6'} bg-red-50 dark:bg-red-900/30 rounded-xl md:rounded-2xl border border-red-200 dark:border-red-700`}>
          <h5 className={`font-semibold text-red-900 dark:text-red-100 mb-2 md:mb-3 ${isMobile ? 'text-base' : 'text-lg'}`}>
            Why {userAnswer?.toUpperCase()} is incorrect:
          </h5>
          <p className={`text-red-800 dark:text-red-200 ${isMobile ? 'text-sm' : 'text-base'}`}>
            {explanation.explanation.incorrect_options[`option_${userAnswer}`].why_wrong}
          </p>
        </div>
      )}
    </motion.div>
  );
}
