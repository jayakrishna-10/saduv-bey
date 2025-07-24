// FILE: app/components/test/TestReview.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  X, 
  CheckCircle, 
  XCircle, 
  Flag,
  ChevronLeft,
  ChevronRight,
  Grid,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { isCorrectAnswer, normalizeChapterName } from '@/lib/quiz-utils';
import { TestReviewNavigation } from './TestReviewNavigation';
import { ExplanationDisplay } from '../ExplanationDisplay';

export function TestReview({ questions, answers, flaggedQuestions, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [explanations, setExplanations] = useState({});
  const [loadingExplanations, setLoadingExplanations] = useState({});
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Filter questions based on review mode
  const filteredIndices = questions.map((_, index) => index).filter(index => {
    const q = questions[index];
    const questionId = q.main_id || q.id;
    const userAnswer = answers[questionId];
    const isCorrect = isCorrectAnswer(userAnswer, q.correct_answer);
    const isFlagged = flaggedQuestions.has(questionId);

    if (showOnlyIncorrect && isCorrect) return false;
    if (showOnlyFlagged && !isFlagged) return false;
    return true;
  });

  const currentFilteredIndex = filteredIndices.indexOf(currentIndex);
  const actualIndex = currentFilteredIndex >= 0 ? currentIndex : filteredIndices[0] || 0;
  const currentQuestion = questions[actualIndex] || {};
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
          if (isPaletteOpen) {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaletteOpen, showDetailedExplanation]);

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      setPaletteOpen(false);
    }
  };

  const goToNext = () => {
    if (filteredIndices.length === 0) return;
    const currentPos = filteredIndices.indexOf(actualIndex);
    const nextPos = (currentPos + 1) % filteredIndices.length;
    setCurrentIndex(filteredIndices[nextPos]);
  };

  const goToPrevious = () => {
    if (filteredIndices.length === 0) return;
    const currentPos = filteredIndices.indexOf(actualIndex);
    const prevPos = currentPos === 0 ? filteredIndices.length - 1 : currentPos - 1;
    setCurrentIndex(filteredIndices[prevPos]);
  };

  const getQuestionStatus = (question) => {
    const questionId = question.main_id || question.id;
    const userAnswer = answers[questionId];
    
    if (!userAnswer) return 'unanswered';
    return isCorrectAnswer(userAnswer, question.correct_answer) ? 'correct' : 'incorrect';
  };

  const currentExplanation = explanations[currentQuestionId];
  const isLoadingExplanation = loadingExplanations[currentQuestionId];

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

      {/* Header */}
      <div className="relative z-10 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onExit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-xl transition-all border border-gray-200/50 dark:border-gray-700/50"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Summary</span>
              </motion.button>
              <div>
                <h1 className="text-2xl font-light text-gray-900 dark:text-gray-100">
                  Test Review
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Question {currentFilteredIndex + 1} of {filteredIndices.length} 
                  {filteredIndices.length !== questions.length && ` (${questions.length} total)`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border border-gray-200/50 dark:border-gray-700/50 ${
                  showDetailedExplanation
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300'
                }`}
              >
                {showDetailedExplanation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="text-sm font-medium">
                  {showDetailedExplanation ? 'Simple View' : 'Detailed View'}
                </span>
              </motion.button>
              
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showOnlyIncorrect}
                    onChange={(e) => setShowOnlyIncorrect(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Incorrect only</span>
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showOnlyFlagged}
                    onChange={(e) => setShowOnlyFlagged(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Flagged only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={actualIndex}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden"
          >
            {/* Question Header */}
            <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                    Question {actualIndex + 1} of {questions.length}
                  </span>
                  {flaggedQuestions.has(currentQuestionId) && (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                      <Flag className="h-4 w-4" />
                      <span className="text-sm font-medium">Flagged</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Correct</span>
                    </div>
                  ) : userAnswer ? (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-full">
                      <XCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Incorrect</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 px-4 py-2 rounded-full">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Unanswered</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {normalizeChapterName(currentQuestion.tag)} • {currentQuestion.year}
              </div>

              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                {currentQuestion.question_text}
              </h3>
            </div>

            {/* Options */}
            <div className="p-8 space-y-4">
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
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      isCorrectOption
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : isUserAnswer && !isCorrect
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isCorrectOption
                          ? 'bg-emerald-500 text-white'
                          : isUserAnswer && !isCorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}>
                        {option.toUpperCase()}
                      </div>
                      
                      <div className="flex-1">
                        <span className={`text-lg ${
                          isCorrectOption
                            ? 'text-emerald-900 dark:text-emerald-100'
                            : isUserAnswer && !isCorrect
                            ? 'text-red-900 dark:text-red-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {optionText}
                        </span>
                        
                        <div className="flex items-center gap-4 mt-2">
                          {isUserAnswer && (
                            <span className={`text-sm font-medium ${
                              isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {isCorrect ? '✓ Your answer' : '✗ Your answer'}
                            </span>
                          )}
                          {isCorrectOption && !isUserAnswer && (
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
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

            {/* Explanation */}
            <div className="border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="p-8">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Answer Explanation
                </h4>
                
                {isLoadingExplanation ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 text-gray-500 dark:text-gray-400 py-8"
                  >
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-lg">Loading detailed explanation...</span>
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
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
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
        hasPrev={filteredIndices.length > 1}
        hasNext={filteredIndices.length > 1}
        onPaletteToggle={() => setPaletteOpen(true)}
      />

      {/* Question Palette */}
      <AnimatePresence>
        {isPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setPaletteOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Question Navigator
                  </h3>
                  <button
                    onClick={() => setPaletteOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {filteredIndices.length} questions shown
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-5 gap-3">
                  {questions.map((q, index) => {
                    const qId = q.main_id || q.id;
                    const status = getQuestionStatus(q);
                    const isFlagged = flaggedQuestions.has(qId);
                    const isFiltered = filteredIndices.includes(index);
                    
                    return (
                      <motion.button
                        key={index}
                        onClick={() => navigateToQuestion(index)}
                        disabled={!isFiltered}
                        whileHover={isFiltered ? { scale: 1.05 } : {}}
                        whileTap={isFiltered ? { scale: 0.95 } : {}}
                        className={`
                          relative p-4 rounded-xl font-bold transition-all text-sm
                          ${!isFiltered ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                          ${index === actualIndex 
                            ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' 
                            : ''
                          }
                          ${status === 'correct' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-700' 
                            : status === 'incorrect'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-700'
                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600'
                          }
                        `}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="absolute -top-1 -right-1 h-4 w-4 text-amber-500 drop-shadow-sm" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-700 rounded" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Correct Answer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 rounded" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Incorrect Answer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-100 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Unanswered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-5 h-5 bg-gray-100 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded">
                      <Flag className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Flagged Question</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple explanation component for basic view
function SimpleExplanation({ explanation, correctAnswer, userAnswer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {explanation?.explanation?.concept && (
        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-200 dark:border-indigo-700">
          <h5 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3 text-lg">
            {explanation.explanation.concept.title}
          </h5>
          {explanation.explanation.concept.description && (
            <p className="text-indigo-800 dark:text-indigo-200">
              {explanation.explanation.concept.description}
            </p>
          )}
        </div>
      )}
      
      {explanation?.explanation?.correct_answer?.explanation && (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-700">
          <h5 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3 text-lg">
            Why {correctAnswer?.toUpperCase()} is correct:
          </h5>
          <p className="text-emerald-800 dark:text-emerald-200">
            {explanation.explanation.correct_answer.explanation}
          </p>
        </div>
      )}
      
      {userAnswer && userAnswer !== correctAnswer && explanation?.explanation?.incorrect_options?.[`option_${userAnswer}`] && (
        <div className="p-6 bg-red-50 dark:bg-red-900/30 rounded-2xl border border-red-200 dark:border-red-700">
          <h5 className="font-semibold text-red-900 dark:text-red-100 mb-3 text-lg">
            Why {userAnswer?.toUpperCase()} is incorrect:
          </h5>
          <p className="text-red-800 dark:text-red-200">
            {explanation.explanation.incorrect_options[`option_${userAnswer}`].why_wrong}
          </p>
        </div>
      )}
    </motion.div>
  );
}
