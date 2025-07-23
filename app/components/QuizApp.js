// FILE: app/components/QuizApp.js
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

import { QuizNavigation } from './quiz/QuizNavigation';
import { QuizQuestion } from './quiz/QuizQuestion';
import { QuizExplanation } from './quiz/QuizExplanation';
import { QuizSelector } from './QuizSelector';
import { QuizSwipeHandler } from './quiz/QuizSwipeHandler';
import { QuizStats } from './quiz/QuizStats';
import { QuizSummary } from './quiz/QuizSummary';
import { QuizCompletion } from './quiz/QuizCompletion';
import { QuizFinishConfirmation } from './quiz/QuizFinishConfirmation';
import { 
  fetchQuizQuestions, 
  fetchTopics, 
  normalizeChapterName, 
  isCorrectAnswer,
  generateQuizSummary,
  getNextAvailableQuestion,
  getPreviousAvailableQuestion
} from '@/lib/quiz-utils';

export function QuizApp() {
  const { data: session, status } = useSession();
  
  // Core quiz state
  const [selectedPaper, setSelectedPaper] = useState('paper1');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // UI state - Show modify quiz by default
  const [showModifyQuiz, setShowModifyQuiz] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const [navigationMode, setNavigationMode] = useState('floating');
  
  // Feedback and explanation state
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  
  // Configuration state
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [questionCount, setQuestionCount] = useState(20);
  const [topicsCache, setTopicsCache] = useState({});
  
  // Progress state
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [completedQuestionIds, setCompletedQuestionIds] = useState(new Set());
  const [questionProgress, setQuestionProgress] = useState({ total: 0, attempted: 0, current: 1 });
  const [startTime, setStartTime] = useState(null);
  
  // Animation and interaction state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isUserIdle, setIsUserIdle] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  
  // Save state
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveError, setSaveError] = useState(null);
  
  // Track if quiz has started
  const [hasQuizStarted, setHasQuizStarted] = useState(false);
  
  // Refs
  const containerRef = useRef(null);
  const idleTimeoutRef = useRef(null);

  // Enhanced logging
  const logDebug = useCallback((message, data = null) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[QuizApp] [${timestamp}] ${message}`;
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }, []);

  // Mouse position tracking for ambient effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
      setLastInteraction(Date.now());
      setIsUserIdle(false);
      
      // Reset idle timeout
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = setTimeout(() => {
        setIsUserIdle(true);
      }, 5000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showModifyQuiz || showSummary || showFinishConfirmation) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePreviousQuestion();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (selectedOption || showAnswer) {
            handleNextQuestion();
          }
          break;
        case 'h':
          if (!showFeedback && !showAnswer) {
            handleShowAnswer();
          }
          break;
        case 'a':
        case 'b':
        case 'c':
        case 'd':
          if (!selectedOption && !showAnswer) {
            handleOptionSelect(e.key);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, showAnswer, showFeedback, showModifyQuiz, showSummary, showFinishConfirmation]);

  // Fetch topics only when needed (when paper changes)
  const fetchTopicsForPaper = useCallback(async (paper) => {
    // Check cache first
    if (topicsCache[paper]) {
      setTopics(topicsCache[paper]);
      logDebug(`Using cached topics for ${paper}`);
      return topicsCache[paper];
    }

    // Fetch if not in cache
    const data = await fetchTopics(paper);
    if (data && Array.isArray(data)) {
      setTopics(data);
      // Cache the result
      setTopicsCache(prev => ({
        ...prev,
        [paper]: data
      }));
      logDebug(`Loaded ${data.length} topics for ${paper}`);
      return data;
    }
    return [];
  }, [topicsCache, logDebug]);

  // Update progress
  useEffect(() => {
    if (questions.length > 0) {
      updateProgress();
    }
  }, [questions, completedQuestionIds, currentQuestionIndex]);

  // Set start time
  useEffect(() => {
    if (questions.length > 0 && hasQuizStarted) {
      setStartTime(new Date());
    }
  }, [questions, hasQuizStarted]);

  const updateProgress = () => {
    const totalQuestions = questions.length;
    const attemptedQuestions = questions.filter(q => completedQuestionIds.has(q.main_id || q.id)).length;
    const currentPosition = currentQuestionIndex + 1;
    
    setQuestionProgress({ 
      total: totalQuestions, 
      attempted: attemptedQuestions,
      current: currentPosition
    });

    if (totalQuestions > 0 && attemptedQuestions === totalQuestions) {
      logDebug('All questions completed');
      setShowCompletionModal(true);
      if (session) {
        saveQuizAttempt();
      }
    }
  };

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      logDebug('Fetching questions...', { selectedPaper, questionCount, selectedTopic });
      
      const fetchedQuestions = await fetchQuizQuestions(selectedPaper, questionCount, selectedTopic);
      
      setQuestions(fetchedQuestions);
      setCompletedQuestionIds(new Set());
      setAnsweredQuestions([]);
      setCurrentQuestionIndex(0);
      resetQuestionState();
      setIsLoading(false);
      setHasQuizStarted(true);
      
      logDebug(`Successfully loaded ${fetchedQuestions.length} questions`);
    } catch (err) {
      logDebug('Fetch questions error:', err);
      setIsLoading(false);
    }
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setCurrentExplanation(null);
    setIsExplanationExpanded(false);
    setSaveStatus(null);
    setSaveError(null);
  };

  const loadExplanation = async (questionId) => {
    setIsLoadingExplanation(true);
    try {
      const currentQ = questions[currentQuestionIndex];
      if (currentQ?.explanation) {
        setCurrentExplanation(currentQ.explanation);
      } else {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, paper: selectedPaper })
        });
        if (!response.ok) throw new Error('Failed to fetch explanation');
        const result = await response.json();
        setCurrentExplanation(result.explanation || { explanation: { concept: { title: "Not Available" } } });
      }
    } catch (err) {
      console.error('Error loading explanation:', err);
      setCurrentExplanation({ explanation: { concept: { title: "Error Loading" } } });
    }
    setIsLoadingExplanation(false);
  };

  const saveQuizAttempt = async () => {
    if (!session?.user?.id || answeredQuestions.length === 0) return;
    
    setSaveStatus('saving');
    setSaveError(null);

    try {
      const summary = generateQuizSummary(answeredQuestions, startTime);
      
      const attemptData = {
        paper: selectedPaper,
        selectedTopic: selectedTopic,
        questionCount: questionCount,
        questionsData: questions.map(({ id, main_id, question_text, correct_answer, tag, year }) => ({ 
          id, main_id, question_text, correct_answer, tag, year 
        })),
        answers: answeredQuestions.map(({ questionId, selectedOption, isCorrect }) => ({ 
          questionId, selectedOption, isCorrect 
        })),
        correctAnswers: summary.correctAnswers,
        totalQuestions: answeredQuestions.length,
        score: summary.score,
        timeTaken: summary.timeTaken,
      };

      const response = await fetch('/api/user/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quiz', attemptData }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseData.error || 'Unknown error'}`);
      }

      setSaveStatus('success');
      logDebug('Quiz attempt saved successfully');
    } catch (error) {
      logDebug('Error saving quiz attempt:', error);
      setSaveStatus('error');
      setSaveError(error.message);
    }
  };

  const handleOptionSelect = async (option) => {
    if (selectedOption || isTransitioning || showAnswer || showFeedback) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    
    setSelectedOption(option);
    setShowFeedback(true);
    setIsExplanationExpanded(true);
    
    const answerData = {
      questionId,
      selectedOption: option,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect,
      question: currentQuestion.question_text,
      tag: currentQuestion.tag,
      year: currentQuestion.year,
      chapter: normalizeChapterName(currentQuestion.tag),
      timestamp: new Date()
    };

    setAnsweredQuestions(prev => [...prev, answerData]);
    setCompletedQuestionIds(prev => new Set([...prev, questionId]));
    
    loadExplanation(questionId);
    logDebug('Answer submitted:', answerData);
  };

  const handleShowAnswer = () => {
    if (showAnswer || showFeedback || isTransitioning) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    
    setShowAnswer(true);
    setShowFeedback(true);
    setIsExplanationExpanded(true);
    loadExplanation(questionId);
    setCompletedQuestionIds(prev => new Set([...prev, questionId]));
    setAnsweredQuestions(prev => [...prev, {
      questionId: questionId,
      question: currentQuestion.question_text,
      selectedOption: null,
      correctOption: currentQuestion.correct_answer,
      isCorrect: false,
      chapter: normalizeChapterName(currentQuestion.tag),
      timestamp: new Date()
    }]);
  };

  const handleNextQuestion = () => {
    const nextIndex = getNextAvailableQuestion(questions, currentQuestionIndex, completedQuestionIds);
    if (nextIndex === null) {
      setShowCompletionModal(true);
      return;
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(nextIndex);
      resetQuestionState();
      setIsTransitioning(false);
    }, 150);
  };

  const handlePreviousQuestion = () => {
    const prevIndex = getPreviousAvailableQuestion(questions, currentQuestionIndex, completedQuestionIds);
    if (prevIndex === null) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex);
      resetQuestionState();
      setIsTransitioning(false);
    }, 150);
  };

  const handleSwipeLeft = () => handleNextQuestion();
  const handleSwipeRight = () => handlePreviousQuestion();

  const handleQuizConfiguration = async (config) => {
    // Update all configuration state
    setSelectedPaper(config.selectedPaper);
    setSelectedTopic(config.selectedTopic);
    setQuestionCount(config.questionCount);
    
    // Fetch topics for the selected paper if needed
    if (config.selectedPaper !== selectedPaper) {
      await fetchTopicsForPaper(config.selectedPaper);
    }
    
    setShowModifyQuiz(false);
    fetchQuestions();
  };

  const handleViewSummary = () => {
    if (session && saveStatus !== 'success') {
      saveQuizAttempt();
    }
    setShowSummary(true);
  };

  const handleFinishQuiz = () => {
    setShowFinishConfirmation(true);
  };

  const handleConfirmFinishQuiz = () => {
    setShowFinishConfirmation(false);
    if (session) {
      saveQuizAttempt();
    }
    setShowCompletionModal(true);
  };

  const resetQuiz = () => {
    setSelectedTopic('all');
    setShowCompletionModal(false);
    setShowFinishConfirmation(false);
    setSaveStatus(null);
    setSaveError(null);
    setHasQuizStarted(false);
    setShowModifyQuiz(true); // Show selector again for new quiz
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const hasNextQuestion = getNextAvailableQuestion(questions, currentQuestionIndex, completedQuestionIds) !== null;
  const hasPrevQuestion = getPreviousAvailableQuestion(questions, currentQuestionIndex, completedQuestionIds) !== null;

  // Save Status Indicator
  const SaveStatusIndicator = () => {
    if (!session) return null;
    
    return (
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-50"
          >
            {saveStatus === 'saving' && (
              <div className="bg-blue-100/90 dark:bg-blue-900/90 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 p-3 rounded-2xl shadow-lg flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm font-medium">Saving progress...</span>
              </div>
            )}
            
            {saveStatus === 'success' && (
              <div className="bg-emerald-100/90 dark:bg-emerald-900/90 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 p-3 rounded-2xl shadow-lg flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Progress saved!</span>
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="bg-red-100/90 dark:bg-red-900/90 backdrop-blur-xl border border-red-200/50 dark:border-red-700/50 text-red-700 dark:text-red-300 p-3 rounded-2xl shadow-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Save failed!</span>
                </div>
                <p className="text-xs mt-1 opacity-90">{saveError}</p>
                <button 
                  onClick={saveQuizAttempt}
                  className="text-xs bg-red-600/80 dark:bg-red-500/80 text-white px-2 py-1 rounded-lg mt-2 hover:bg-red-700/80 dark:hover:bg-red-600/80 flex items-center transition-all"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Show loading only when actually loading questions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
        >
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
          <p className="text-lg font-light text-gray-700 dark:text-gray-300">Loading quiz...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Preparing your practice session</p>
        </motion.div>
      </div>
    );
  }

  // Show selector if quiz hasn't started yet
  if (!hasQuizStarted || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <QuizSelector 
          isOpen={true} 
          onClose={null} // Pass null instead of empty function for initial view
          isInitialView={true} // Indicate this is the initial view
          currentConfig={{ 
            selectedPaper, 
            selectedTopic, 
            questionCount, 
            showExplanations: true 
          }} 
          onApply={handleQuizConfiguration} 
          topics={topics} 
          onPaperChange={fetchTopicsForPaper}
        />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans relative overflow-hidden transition-all duration-500"
    >
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: mousePosition.x * 0.1, 
            y: mousePosition.y * 0.1,
            scale: isUserIdle ? 1.1 : 1
          }} 
          transition={{ type: "spring", stiffness: 50, damping: 15 }} 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/30 dark:to-purple-900/30 blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: -mousePosition.x * 0.05, 
            y: -mousePosition.y * 0.05,
            scale: isUserIdle ? 0.9 : 1
          }} 
          transition={{ type: "spring", stiffness: 30, damping: 15 }} 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 dark:from-emerald-900/20 dark:to-cyan-900/20 blur-3xl" 
        />
      </div>

      {/* Quiz Container */}
      <QuizSwipeHandler
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        disabled={isTransitioning || showModifyQuiz}
        currentQuestionIndex={currentQuestionIndex}
      >
        <main className="relative z-10 min-h-screen flex flex-col">
          {/* Question Content */}
          <div className="flex-1 px-4 md:px-8 py-8 pb-32 md:pb-8">
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${currentQuestionIndex}-${currentQuestion.main_id || currentQuestion.id}`}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: -20, scale: 0.98 }} 
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden"
                >
                  <QuizQuestion 
                    question={currentQuestion} 
                    questionIndex={currentQuestionIndex} 
                    totalQuestions={questions.length} 
                    selectedOption={selectedOption} 
                    showFeedback={showFeedback} 
                    showAnswer={showAnswer} 
                    onOptionSelect={handleOptionSelect} 
                    isTransitioning={isTransitioning}
                    questionProgress={questionProgress}
                  />
                  
                  <QuizExplanation
                    isVisible={showFeedback || showAnswer}
                    isExpanded={isExplanationExpanded}
                    onToggleExpanded={setIsExplanationExpanded}
                    isLoading={isLoadingExplanation}
                    explanation={currentExplanation}
                    questionText={currentQuestion.question_text}
                    options={{
                      option_a: currentQuestion.option_a,
                      option_b: currentQuestion.option_b,
                      option_c: currentQuestion.option_c,
                      option_d: currentQuestion.option_d
                    }}
                    correctAnswer={currentQuestion.correct_answer?.toLowerCase()}
                    userAnswer={selectedOption}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </QuizSwipeHandler>

      {/* Navigation */}
      <QuizNavigation
        mode={navigationMode}
        isVisible={!isTransitioning}
        questionProgress={questionProgress}
        answeredQuestions={answeredQuestions}
        hasNextQuestion={hasNextQuestion}
        hasPrevQuestion={hasPrevQuestion}
        showFeedback={showFeedback}
        showAnswer={showAnswer}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onShowAnswer={handleShowAnswer}
        onShowSummary={handleViewSummary}
        onShowConfig={() => setShowModifyQuiz(true)}
        onFinishQuiz={handleFinishQuiz}
        currentQuestion={currentQuestion}
      />

      {/* Modals */}
      <QuizSelector 
        isOpen={showModifyQuiz} 
        onClose={() => setShowModifyQuiz(false)} 
        isInitialView={false} // Not the initial view when opened as modal
        currentConfig={{ 
          selectedPaper, 
          selectedTopic, 
          questionCount, 
          showExplanations: true 
        }} 
        onApply={handleQuizConfiguration} 
        topics={topics}
        onPaperChange={fetchTopicsForPaper}
      />
      
      <QuizSummary 
        isOpen={showSummary} 
        onClose={() => setShowSummary(false)} 
        answeredQuestions={answeredQuestions} 
        startTime={startTime} 
      />
      
      <QuizFinishConfirmation
        isOpen={showFinishConfirmation}
        onClose={() => setShowFinishConfirmation(false)}
        onConfirmFinish={handleConfirmFinishQuiz}
        answeredQuestions={answeredQuestions}
        startTime={startTime}
        questionProgress={questionProgress}
      />
      
      <QuizCompletion 
        isOpen={showCompletionModal} 
        onViewSummary={handleViewSummary} 
        onStartNewQuiz={resetQuiz} 
      />

      <SaveStatusIndicator />
    </div>
  );
}
