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
  Loader2
} from 'lucide-react';
import { isCorrectAnswer, normalizeChapterName } from '@/lib/quiz-utils';
import { TestReviewNavigation } from './TestReviewNavigation';

export function TestReview({ questions, answers, flaggedQuestions, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [explanations, setExplanations] = useState({});
  const [loadingExplanations, setLoadingExplanations] = useState({});

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onExit}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Summary</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Test Review
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyIncorrect}
                  onChange={(e) => setShowOnlyIncorrect(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Show incorrect only</span>
              </label>
              
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyFlagged}
                  onChange={(e) => setShowOnlyFlagged(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Show flagged only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={actualIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Question Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Question {actualIndex + 1} of {questions.length}
                  </span>
                  {flaggedQuestions.has(currentQuestionId) && (
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Flag className="h-4 w-4" />
                      <span className="text-sm">Flagged</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Correct</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <XCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Incorrect</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {normalizeChapterName(currentQuestion.tag)} • {currentQuestion.year}
              </div>
            </div>

            {/* Question Content */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                {currentQuestion.question_text}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {['a', 'b', 'c', 'd'].map((option) => {
                  const optionText = currentQuestion[`option_${option}`];
                  const isUserAnswer = userAnswer === option;
                  const isCorrectOption = currentQuestion.correct_answer?.toLowerCase() === option;
                  
                  return (
                    <div
                      key={option}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isCorrectOption
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : isUserAnswer && !isCorrect
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`font-medium ${
                          isCorrectOption
                            ? 'text-green-700 dark:text-green-300'
                            : isUserAnswer && !isCorrect
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {option.toUpperCase()}.
                        </span>
                        <span className={`flex-1 ${
                          isCorrectOption
                            ? 'text-green-900 dark:text-green-100'
                            : isUserAnswer && !isCorrect
                            ? 'text-red-900 dark:text-red-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {optionText}
                        </span>
                        {isUserAnswer && (
                          <span className="text-sm font-medium">
                            {isCorrect ? '✓ Your answer' : '✗ Your answer'}
                          </span>
                        )}
                        {isCorrectOption && !isUserAnswer && (
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            ✓ Correct answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Explanation
                </h4>
                {isLoadingExplanation ? (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading explanation...</span>
                  </div>
                ) : currentExplanation ? (
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    {currentExplanation.explanation?.concept?.title && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Concept: {currentExplanation.explanation.concept.title}
                        </h5>
                        {currentExplanation.explanation.concept.description && (
                          <p className="text-sm">{currentExplanation.explanation.concept.description}</p>
                        )}
                      </div>
                    )}
                    {currentExplanation.explanation?.why_correct && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Why this is correct:
                        </h5>
                        <p className="text-sm">{currentExplanation.explanation.why_correct}</p>
                      </div>
                    )}
                    {currentExplanation.explanation?.details && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Additional Details:
                        </h5>
                        <p className="text-sm">{currentExplanation.explanation.details}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Explanation not available for this question.
                  </p>
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
        onPaletteToggle={() => setPaletteOpen(true)}
        hasPrev={filteredIndices.length > 1}
        hasNext={filteredIndices.length > 1}
        currentPosition={currentFilteredIndex + 1}
        totalFiltered={filteredIndices.length}
      />

      {/* Question Palette */}
      <AnimatePresence>
        {isPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setPaletteOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Question Navigator
                  </h3>
                  <button
                    onClick={() => setPaletteOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, index) => {
                    const qId = q.main_id || q.id;
                    const status = getQuestionStatus(q);
                    const isFlagged = flaggedQuestions.has(qId);
                    const isFiltered = filteredIndices.includes(index);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => navigateToQuestion(index)}
                        disabled={!isFiltered}
                        className={`
                          relative p-3 rounded-lg font-medium transition-all
                          ${!isFiltered ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                          ${index === actualIndex 
                            ? 'ring-2 ring-indigo-500 ring-offset-2' 
                            : ''
                          }
                          ${status === 'correct' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                            : status === 'incorrect'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }
                        `}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="absolute top-0 right-0 h-3 w-3 text-amber-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded" />
                    <span className="text-gray-700 dark:text-gray-300">Correct</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded" />
                    <span className="text-gray-700 dark:text-gray-300">Incorrect</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded" />
                    <span className="text-gray-700 dark:text-gray-300">Unanswered</span>
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
