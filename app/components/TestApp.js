// app/components/TestApp.js - Main Test Component
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertTriangle, RefreshCw, Clock } from 'lucide-react';

import { TestNavigation } from './test/TestNavigation';
import { TestQuestion } from './test/TestQuestion';
import { TestSelector } from './TestSelector';
import { TestSwipeHandler } from './test/TestSwipeHandler';
import { TestTimer } from './test/TestTimer';
import { TestPalette } from './test/TestPalette';
import { TestReview } from './test/TestReview';
import { TestFinishConfirmation } from './test/TestFinishConfirmation';
import { 
  fetchTestQuestions, 
  fetchTopics, 
  normalizeChapterName, 
  isCorrectAnswer,
  generateTestSummary,
  getNextAvailableQuestion,
  getPreviousAvailableQuestion,
  TEST_KEYBOARD_SHORTCUTS // Added this import
} from '@/lib/test-utils';

export function TestApp() {
  const { data: session, status } = useSession();
  
  // Core test state
  const [testType, setTestType] = useState('mock'); // 'mock' or 'practice'
  const [selectedPaper, setSelectedPaper] = useState('paper1');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // UI state
  const [showTestSelector, setShowTestSelector] = useState(true);
  const [showPalette, setShowPalette] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [isTestActive, setIsTestActive] = useState(false);
  
  // Test-specific state
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [totalTimeAllotted, setTotalTimeAllotted] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [submittedAnswers, setSubmittedAnswers] = useState(new Map());
  
  // Configuration state
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [questionCount, setQuestionCount] = useState(50);
  
  // Progress state
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [questionProgress, setQuestionProgress] = useState({ total: 0, attempted: 0, current: 1 });
  const [startTime, setStartTime] = useState(null);
  
  // Animation and interaction state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isUserIdle, setIsUserIdle] = useState(false);
  
  // Save state
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveError, setSaveError] = useState(null);
  
  // Refs
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const idleTimeoutRef = useRef(null);

  // Enhanced logging
  const logDebug = useCallback((message, data = null) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[TestApp] [${timestamp}] ${message}`;
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }, []);

  // Mouse position tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
      setIsUserIdle(false);
      
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

  // Timer management
  useEffect(() => {
    if (isTestActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTestActive, timeRemaining]);

  // Keyboard shortcuts - Fixed to use TEST_KEYBOARD_SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showTestSelector || showReview || showFinishConfirmation) return;
      
      switch (e.key) {
        case TEST_KEYBOARD_SHORTCUTS.PREVIOUS_QUESTION:
          e.preventDefault();
          handlePreviousQuestion();
          break;
        case TEST_KEYBOARD_SHORTCUTS.NEXT_QUESTION:
        case TEST_KEYBOARD_SHORTCUTS.SUBMIT:
          e.preventDefault();
          handleNextQuestion();
          break;
        case TEST_KEYBOARD_SHORTCUTS.FLAG_QUESTION:
          e.preventDefault();
          handleToggleFlag();
          break;
        case TEST_KEYBOARD_SHORTCUTS.OPTION_A:
        case TEST_KEYBOARD_SHORTCUTS.OPTION_B:
        case TEST_KEYBOARD_SHORTCUTS.OPTION_C:
        case TEST_KEYBOARD_SHORTCUTS.OPTION_D:
          if (!selectedOption) {
            handleOptionSelect(e.key);
          }
          break;
        case TEST_KEYBOARD_SHORTCUTS.SHOW_PALETTE:
          e.preventDefault();
          setShowPalette(!showPalette);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, showTestSelector, showReview, showFinishConfirmation, showPalette]);

  // Initial setup
  useEffect(() => {
    fetchTopics(selectedPaper).then(data => {
      if (data && Array.isArray(data)) {
        setTopics(data);
        logDebug(`Loaded ${data.length} topics for initial paper ${selectedPaper}`);
      }
    });
  }, []);

  // Update progress
  useEffect(() => {
    if (questions.length > 0) {
      updateProgress();
    }
  }, [questions, submittedAnswers, currentQuestionIndex, visitedQuestions]);

  const updateProgress = () => {
    const totalQuestions = questions.length;
    const attemptedQuestions = submittedAnswers.size;
    const currentPosition = currentQuestionIndex + 1;
    
    setQuestionProgress({ 
      total: totalQuestions, 
      attempted: attemptedQuestions,
      current: currentPosition
    });
  };

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      logDebug('Fetching test questions...', { testType, selectedPaper, questionCount, selectedTopic });
      
      const fetchedQuestions = await fetchTestQuestions(testType, selectedPaper, questionCount, selectedTopic);
      
      setQuestions(fetchedQuestions);
      setSubmittedAnswers(new Map());
      setFlaggedQuestions(new Set());
      setVisitedQuestions(new Set([0])); // Mark first question as visited
      setCurrentQuestionIndex(0);
      resetQuestionState();
      setIsLoading(false);
      
      // Set timer based on test type
      const timeAllowed = testType === 'mock' ? 60 * 60 : fetchedQuestions.length * 72; // 60 min for mock, 72s per question for practice
      setTimeRemaining(timeAllowed);
      setTotalTimeAllotted(timeAllowed);
      setStartTime(new Date());
      setIsTestActive(true);
      
      logDebug(`Successfully loaded ${fetchedQuestions.length} questions for ${testType} test`);
    } catch (err) {
      logDebug('Fetch questions error:', err);
      setIsLoading(false);
    }
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setSaveStatus(null);
    setSaveError(null);
  };

  const handleTimeUp = () => {
    setIsTestActive(false);
    logDebug('Time up! Auto-submitting test');
    handleFinishTest(true); // true indicates auto-submit due to time
  };

  const handleTestConfiguration = async (config) => {
    setTestType(config.testType);
    setSelectedPaper(config.selectedPaper);
    setSelectedTopic(config.selectedTopic || 'all');
    setQuestionCount(config.questionCount);
    
    // Update topics based on selected paper
    logDebug('Fetching topics for paper:', config.selectedPaper);
    const topicsData = await fetchTopics(config.selectedPaper);
    if (topicsData && Array.isArray(topicsData)) {
      setTopics(topicsData);
      logDebug(`Updated topics: ${topicsData.length} topics loaded`);
    }
    
    setShowTestSelector(false);
    await fetchQuestions();
  };

  const handleOptionSelect = (option) => {
    if (selectedOption || !isTestActive) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    setSelectedOption(option);
    
    // Store the answer
    setSubmittedAnswers(prev => new Map(prev.set(questionId, {
      selectedOption: option,
      questionIndex: currentQuestionIndex,
      timestamp: new Date()
    })));
    
    logDebug('Answer selected:', { questionId, option });
  };

  const handleToggleFlag = () => {
    const questionId = currentQuestion.main_id || currentQuestion.id;
    setFlaggedQuestions(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      return newFlagged;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      navigateToQuestion(nextIndex);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      navigateToQuestion(prevIndex);
    }
  };

  const navigateToQuestion = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(index);
      setVisitedQuestions(prev => new Set([...prev, index]));
      
      // Check if this question was already answered
      const questionId = questions[index]?.main_id || questions[index]?.id;
      const existingAnswer = submittedAnswers.get(questionId);
      setSelectedOption(existingAnswer?.selectedOption || null);
      
      setIsTransitioning(false);
    }, 150);
  };

  const handleSwipeLeft = () => handleNextQuestion();
  const handleSwipeRight = () => handlePreviousQuestion();

  const handleFinishTest = async (autoSubmit = false) => {
    setIsTestActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (!autoSubmit) {
      setShowFinishConfirmation(true);
    } else {
      await submitTest();
    }
  };

  const submitTest = async () => {
    if (session) {
      await saveTestAttempt();
    }
    setShowReview(true);
  };

  const saveTestAttempt = async () => {
    if (!session?.user?.id || submittedAnswers.size === 0) return;
    
    setSaveStatus('saving');
    setSaveError(null);

    try {
      const endTime = new Date();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      const summary = generateTestSummary(submittedAnswers, questions, startTime);
      
      const attemptData = {
        testMode: testType,
        testType: testType === 'mock' ? 'mock' : 'practice',
        testConfig: {
          paper: selectedPaper,
          topic: selectedTopic,
          questionCount: questionCount
        },
        questionsData: questions.map(({ id, main_id, question_text, correct_answer, tag }) => ({ 
          id, main_id, question_text, correct_answer, tag 
        })),
        answers: Array.from(submittedAnswers.entries()).map(([questionId, answerData]) => answerData.selectedOption),
        flaggedQuestions: Array.from(flaggedQuestions),
        correct: summary.correctAnswers,
        incorrect: summary.incorrectAnswers,
        unanswered: summary.unanswered,
        totalQuestions: questions.length,
        score: summary.percentage,
        timeTaken,
        timeLimit: totalTimeAllotted
      };

      const response = await fetch('/api/user/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'test', attemptData }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseData.error || 'Unknown error'}`);
      }

      setSaveStatus('success');
      logDebug('Test attempt saved successfully');
    } catch (error) {
      logDebug('Error saving test attempt:', error);
      setSaveStatus('error');
      setSaveError(error.message);
    }
  };

  const resetTest = () => {
    setShowTestSelector(true);
    setShowReview(false);
    setShowFinishConfirmation(false);
    setIsTestActive(false);
    setTimeRemaining(0);
    setSubmittedAnswers(new Map());
    setFlaggedQuestions(new Set());
    setVisitedQuestions(new Set());
    setSaveStatus(null);
    setSaveError(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const currentQuestionId = currentQuestion.main_id || currentQuestion.id;
  const isCurrentFlagged = flaggedQuestions.has(currentQuestionId);
  const hasAnswer = submittedAnswers.has(currentQuestionId);

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
              <div className="bg-orange-100/90 dark:bg-orange-900/90 backdrop-blur-xl border border-orange-200/50 dark:border-orange-700/50 text-orange-700 dark:text-orange-300 p-3 rounded-2xl shadow-lg flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm font-medium">Saving test...</span>
              </div>
            )}
            
            {saveStatus === 'success' && (
              <div className="bg-emerald-100/90 dark:bg-emerald-900/90 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 p-3 rounded-2xl shadow-lg flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Test saved!</span>
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
                  onClick={saveTestAttempt}
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

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
        >
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-orange-600 dark:text-orange-400 mb-4" />
          <p className="text-lg font-light text-gray-700 dark:text-gray-300">Preparing your test...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Setting up questions and timer</p>
        </motion.div>
      </div>
    );
  }

  // Show selector if test hasn't started
  if (showTestSelector || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
        <TestSelector 
          isOpen={true} 
          onClose={() => {}} 
          currentConfig={{ 
            testType,
            selectedPaper, 
            selectedTopic, 
            questionCount
          }} 
          onApply={handleTestConfiguration} 
          topics={topics} 
          onPaperChange={async (paperId) => {
            logDebug('Paper changed to:', paperId);
            const topicsData = await fetchTopics(paperId);
            if (topicsData && Array.isArray(topicsData)) {
              setTopics(topicsData);
              logDebug(`Topics updated for ${paperId}: ${topicsData.length} topics`);
            }
          }}
        />
      </div>
    );
  }

  // Show review
  if (showReview) {
    return (
      <TestReview
        questions={questions}
        submittedAnswers={submittedAnswers}
        flaggedQuestions={flaggedQuestions}
        testType={testType}
        selectedPaper={selectedPaper}
        startTime={startTime}
        timeTaken={totalTimeAllotted - timeRemaining}
        onStartNewTest={resetTest}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 font-sans relative overflow-hidden transition-all duration-500"
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
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-orange-200/40 to-red-200/40 dark:from-orange-900/30 dark:to-red-900/30 blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: -mousePosition.x * 0.05, 
            y: -mousePosition.y * 0.05,
            scale: isUserIdle ? 0.9 : 1
          }} 
          transition={{ type: "spring", stiffness: 30, damping: 15 }} 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-200/30 dark:from-yellow-900/20 dark:to-orange-900/20 blur-3xl" 
        />
      </div>

      {/* Timer Display */}
      <TestTimer 
        timeRemaining={timeRemaining}
        totalTime={totalTimeAllotted}
        isActive={isTestActive}
        testType={testType}
      />

      {/* Test Container */}
      <TestSwipeHandler
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        disabled={isTransitioning || showTestSelector}
        currentQuestionIndex={currentQuestionIndex}
      >
        <main className="relative z-10 min-h-screen flex flex-col">
          {/* Question Content */}
          <div className="flex-1 px-4 md:px-8 py-8 pb-32 md:pb-8">
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${currentQuestionIndex}-${currentQuestionId}`}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: -20, scale: 0.98 }} 
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden"
                >
                  <TestQuestion 
                    question={currentQuestion} 
                    questionIndex={currentQuestionIndex} 
                    totalQuestions={questions.length} 
                    selectedOption={selectedOption} 
                    onOptionSelect={handleOptionSelect} 
                    isTransitioning={isTransitioning}
                    questionProgress={questionProgress}
                    testType={testType}
                    isCurrentFlagged={isCurrentFlagged}
                    hasAnswer={hasAnswer}
                    timeRemaining={timeRemaining}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </TestSwipeHandler>

      {/* Navigation */}
      <TestNavigation
        isVisible={!isTransitioning}
        questionProgress={questionProgress}
        hasNext={currentQuestionIndex < questions.length - 1}
        hasPrevious={currentQuestionIndex > 0}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onToggleFlag={handleToggleFlag}
        onShowPalette={() => setShowPalette(true)}
        onFinishTest={() => handleFinishTest()}
        isCurrentFlagged={isCurrentFlagged}
        hasAnswer={hasAnswer}
        submittedCount={submittedAnswers.size}
        isTestActive={isTestActive}
      />

      {/* Question Palette */}
      <TestPalette
        isOpen={showPalette}
        onClose={() => setShowPalette(false)}
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        submittedAnswers={submittedAnswers}
        flaggedQuestions={flaggedQuestions}
        visitedQuestions={visitedQuestions}
        onQuestionSelect={navigateToQuestion}
      />

      {/* Finish Confirmation */}
      <TestFinishConfirmation
        isOpen={showFinishConfirmation}
        onClose={() => setShowFinishConfirmation(false)}
        onConfirmFinish={submitTest}
        submittedAnswers={submittedAnswers}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        testType={testType}
        questions={questions}
        startTime={startTime}
      />

      <SaveStatusIndicator />
    </div>
  );
}
