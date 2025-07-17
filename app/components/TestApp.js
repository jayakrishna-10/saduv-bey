// app/components/TestApp.js
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertTriangle, RefreshCw, Trophy } from 'lucide-react';

import { TestNavigation } from './test/TestNavigation';
import { TestQuestion } from './test/TestQuestion';
import { TestSelector } from './TestSelector';
import { TestQuestionPalette } from './test/TestQuestionPalette';
import { TestReview } from './test/TestReview';
import { TestPerformanceAnalysis } from './test/TestPerformanceAnalysis';
import { QuizSwipeHandler } from './quiz/QuizSwipeHandler';
import { 
  fetchTestQuestions, 
  fetchTopics, 
  normalizeChapterName, 
  isCorrectAnswer,
  calculateProgress,
  saveTestProgress,
  loadTestProgress,
  clearTestProgress,
  getNextQuestion,
  getPreviousQuestion,
  getFirstUnansweredQuestion,
  getTimeWarningLevel,
  TEST_TYPES
} from '@/lib/test-utils';

export function TestApp() {
  const { data: session, status } = useSession();
  
  // Core test state
  const [testConfig, setTestConfig] = useState({
    testType: 'mock',
    selectedPaper: 'paper1',
    selectedTopic: 'all',
    questionCount: 50,
    timeLimit: 3600
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // UI state - Show test selector by default
  const [showTestSelector, setShowTestSelector] = useState(true);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const [showTestReview, setShowTestReview] = useState(false);
  const [showPerformanceAnalysis, setShowPerformanceAnalysis] = useState(false);
  
  // Test-specific state
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [answers, setAnswers] = useState([]);
  const [explanations, setExplanations] = useState({});
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  
  // Configuration state
  const [topics, setTopics] = useState([]);
  
  // Progress state
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [hasTestStarted, setHasTestStarted] = useState(false);
  
  // Animation and interaction state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isUserIdle, setIsUserIdle] = useState(false);
  
  // Save state
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveError, setSaveError] = useState(null);
  
  // Refs
  const timerIntervalRef = useRef(null);
  const autosaveIntervalRef = useRef(null);
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

  // Mouse position tracking for ambient effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
      setIsUserIdle(false);
      
      // Reset idle timeout
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = setTimeout(() => {
        setIsUserIdle(true);
      }, 10000); // 10 seconds for test
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
      if (showTestSelector || showQuestionPalette || showTestReview || showPerformanceAnalysis || isTestCompleted) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePreviousQuestion();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          handleNextQuestion();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleToggleFlag();
          break;
        case 'a':
        case 'b':
        case 'c':
        case 'd':
          if (!selectedOption) {
            handleOptionSelect(e.key);
          }
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          handlePauseResume();
          break;
        case 'Escape':
          e.preventDefault();
          setShowQuestionPalette(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, showTestSelector, showQuestionPalette, showTestReview, showPerformanceAnalysis, isTestCompleted]);

  // Timer logic
  useEffect(() => {
    if (!hasTestStarted || isPaused || isTestCompleted || timeRemaining <= 0) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [hasTestStarted, isPaused, isTestCompleted, timeRemaining]);

  // Auto-save progress
  useEffect(() => {
    if (!hasTestStarted || isTestCompleted) return;

    autosaveIntervalRef.current = setInterval(() => {
      saveProgress();
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, [hasTestStarted, isTestCompleted, testConfig, answers, flaggedQuestions, timeRemaining]);

  // Initial setup - only fetch topics for the default paper
  useEffect(() => {
    fetchTopics(testConfig.selectedPaper).then(data => {
      if (data && Array.isArray(data)) {
        setTopics(data);
        logDebug(`Loaded ${data.length} topics for initial paper ${testConfig.selectedPaper}`);
      }
    });
  }, []); // Empty dependency array - only run once

  const saveProgress = () => {
    const progressData = {
      testConfig,
      currentQuestionIndex,
      answers,
      flaggedQuestions: Array.from(flaggedQuestions),
      answeredQuestions: Array.from(answeredQuestions),
      timeRemaining,
      startTime: startTime?.toISOString(),
      questions: questions.map(q => ({ id: q.main_id || q.id, question_text: q.question_text }))
    };

    const saved = saveTestProgress(progressData);
    if (saved) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    }
  };

  const loadProgress = (testType, paper) => {
    const saved = loadTestProgress(testType, paper);
    if (saved && saved.questions?.length > 0) {
      // Ask user if they want to resume
      const resume = window.confirm('A previous test session was found. Do you want to resume where you left off?');
      if (resume) {
        return saved;
      } else {
        clearTestProgress(testType, paper);
      }
    }
    return null;
  };

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      logDebug('Fetching test questions...', testConfig);
      
      const fetchedQuestions = await fetchTestQuestions(
        testConfig.testType,
        testConfig.selectedPaper,
        testConfig.questionCount,
        testConfig.selectedTopic
      );
      
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      resetQuestionState();
      setTimeRemaining(testConfig.timeLimit);
      setStartTime(new Date());
      setHasTestStarted(true);
      setIsLoading(false);
      
      logDebug(`Successfully loaded ${fetchedQuestions.length} questions for ${testConfig.testType} test`);
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

  const handleTestConfiguration = async (config) => {
    logDebug('Test configuration:', config);
    
    // Check for saved progress
    const savedProgress = loadProgress(config.testType, config.selectedPaper);
    
    if (savedProgress) {
      // Resume previous session
      setTestConfig(config);
      setQuestions(savedProgress.questions || []);
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex || 0);
      setAnswers(savedProgress.answers || []);
      setFlaggedQuestions(new Set(savedProgress.flaggedQuestions || []));
      setAnsweredQuestions(new Set(savedProgress.answeredQuestions || []));
      setTimeRemaining(savedProgress.timeRemaining || config.timeLimit);
      if (savedProgress.startTime) {
        setStartTime(new Date(savedProgress.startTime));
      }
      setHasTestStarted(true);
      setShowTestSelector(false);
    } else {
      // Start new test
      setTestConfig(config);
      
      // Update topics based on selected paper
      const topicsData = await fetchTopics(config.selectedPaper);
      if (topicsData && Array.isArray(topicsData)) {
        setTopics(topicsData);
      }
      
      setShowTestSelector(false);
      fetchQuestions();
    }
  };

  const handleOptionSelect = (option) => {
    if (selectedOption || isTransitioning || isTestCompleted) return;
    
    const question = questions[currentQuestionIndex];
    const questionId = question.main_id || question.id;
    const isCorrect = isCorrectAnswer(option, question.correct_answer);
    
    setSelectedOption(option);
    
    const answerData = {
      questionIndex: currentQuestionIndex,
      questionId,
      selectedOption: option,
      correctAnswer: question.correct_answer,
      isCorrect,
      question: question.question_text,
      tag: question.tag,
      year: question.year,
      chapter: normalizeChapterName(question.tag),
      isFlagged: flaggedQuestions.has(currentQuestionIndex),
      timestamp: new Date()
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionIndex !== currentQuestionIndex);
      return [...filtered, answerData];
    });
    
    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
    
    logDebug('Answer submitted:', answerData);
  };

  const handleToggleFlag = () => {
    if (isTransitioning || isTestCompleted) return;
    
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleNextQuestion = () => {
    const nextIndex = getNextQuestion(currentQuestionIndex, questions.length);
    if (nextIndex === null) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(nextIndex);
      resetQuestionState();
      setIsTransitioning(false);
    }, 150);
  };

  const handlePreviousQuestion = () => {
    const prevIndex = getPreviousQuestion(currentQuestionIndex);
    if (prevIndex === null) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex);
      resetQuestionState();
      setIsTransitioning(false);
    }, 150);
  };

  const handleQuestionSelect = (questionIndex) => {
    if (questionIndex === currentQuestionIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(questionIndex);
      resetQuestionState();
      setIsTransitioning(false);
    }, 150);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleTimeUp = () => {
    logDebug('Time is up - auto-submitting test');
    setEndTime(new Date());
    setIsTestCompleted(true);
    if (session) {
      saveTestAttempt();
    }
    setShowPerformanceAnalysis(true);
  };

  const handleSubmitTest = () => {
    logDebug('Test submitted manually');
    setEndTime(new Date());
    setIsTestCompleted(true);
    if (session) {
      saveTestAttempt();
    }
    setShowPerformanceAnalysis(true);
    
    // Clear saved progress
    clearTestProgress(testConfig.testType, testConfig.selectedPaper);
  };

  const saveTestAttempt = async () => {
    if (!session?.user?.id) return;
    
    setSaveStatus('saving');
    setSaveError(null);

    try {
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      
      const attemptData = {
        testType: testConfig.testType,
        paper: testConfig.selectedPaper,
        selectedTopic: testConfig.selectedTopic,
        questionCount: testConfig.questionCount,
        timeLimit: testConfig.timeLimit,
        timeTaken,
        questionsData: questions.map(({ id, main_id, question_text, correct_answer, tag, year }) => ({ 
          id, main_id, question_text, correct_answer, tag, year 
        })),
        answers: answers.map(({ questionIndex, questionId, selectedOption, isCorrect, isFlagged }) => ({ 
          questionIndex, questionId, selectedOption, isCorrect, isFlagged 
        })),
        flaggedQuestions: Array.from(flaggedQuestions),
        correctAnswers: answers.filter(a => a.isCorrect).length,
        totalQuestions: questions.length,
        score: answers.length > 0 ? Math.round((answers.filter(a => a.isCorrect).length / answers.length) * 100) : 0,
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

  const handleSwipeLeft = () => handleNextQuestion();
  const handleSwipeRight = () => handlePreviousQuestion();

  const resetTest = () => {
    setTestConfig({
      testType: 'mock',
      selectedPaper: 'paper1',
      selectedTopic: 'all',
      questionCount: 50,
      timeLimit: 3600
    });
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAnsweredQuestions(new Set());
    setFlaggedQuestions(new Set());
    setExplanations({});
    setTimeRemaining(0);
    setIsPaused(false);
    setStartTime(null);
    setEndTime(null);
    setIsTestCompleted(false);
    setHasTestStarted(false);
    setShowTestSelector(true);
    setShowQuestionPalette(false);
    setShowTestReview(false);
    setShowPerformanceAnalysis(false);
    setSaveStatus(null);
    setSaveError(null);
    
    // Clear any saved progress
    clearTestProgress(testConfig.testType, testConfig.selectedPaper);
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const hasNextQuestion = getNextQuestion(currentQuestionIndex, questions.length) !== null;
  const hasPrevQuestion = getPreviousQuestion(currentQuestionIndex) !== null;
  const progress = calculateProgress(answeredQuestions, flaggedQuestions, questions.length);
  const warningLevel = getTimeWarningLevel(timeRemaining, testConfig.timeLimit);

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
            className="fixed bottom-20 md:bottom-6 left-4 z-50"
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

  // Show loading only when actually loading questions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
        >
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-red-600 dark:text-red-400 mb-4" />
          <p className="text-lg font-light text-gray-700 dark:text-gray-300">Loading test...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Preparing your {testConfig.testType} test</p>
        </motion.div>
      </div>
    );
  }

  // Show selector if test hasn't started yet
  if (!hasTestStarted || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <TestSelector 
          isOpen={true} 
          onClose={() => {}} // Can't close when it's the initial view
          currentConfig={testConfig} 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans relative overflow-hidden transition-all duration-500">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: mousePosition.x * 0.1, 
            y: mousePosition.y * 0.1,
            scale: isUserIdle ? 1.1 : 1
          }} 
          transition={{ type: "spring", stiffness: 50, damping: 15 }} 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-red-200/40 to-pink-200/40 dark:from-red-900/30 dark:to-pink-900/30 blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: -mousePosition.x * 0.05, 
            y: -mousePosition.y * 0.05,
            scale: isUserIdle ? 0.9 : 1
          }} 
          transition={{ type: "spring", stiffness: 30, damping: 15 }} 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 dark:from-indigo-900/20 dark:to-purple-900/20 blur-3xl" 
        />
      </div>

      {/* Test Container */}
      <QuizSwipeHandler
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        disabled={isTransitioning || isPaused || isTestCompleted}
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
                  <TestQuestion 
                    question={currentQuestion} 
                    questionIndex={currentQuestionIndex} 
                    totalQuestions={questions.length} 
                    selectedOption={selectedOption} 
                    onOptionSelect={handleOptionSelect} 
                    onToggleFlag={handleToggleFlag}
                    isFlagged={flaggedQuestions.has(currentQuestionIndex)}
                    isTransitioning={isTransitioning}
                    testType={testConfig.testType}
                    currentQuestionNumber={currentQuestionIndex + 1}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </QuizSwipeHandler>

      {/* Navigation */}
      <TestNavigation
        isVisible={!isTransitioning && !isPaused}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        answeredQuestions={answeredQuestions}
        flaggedQuestions={flaggedQuestions}
        timeRemaining={timeRemaining}
        totalTime={testConfig.timeLimit}
        isPaused={isPaused}
        isFlagged={flaggedQuestions.has(currentQuestionIndex)}
        hasNextQuestion={hasNextQuestion}
        hasPrevQuestion={hasPrevQuestion}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onToggleFlag={handleToggleFlag}
        onShowPalette={() => setShowQuestionPalette(true)}
        onSubmitTest={handleSubmitTest}
        onPauseResume={handlePauseResume}
        onShowReview={() => setShowTestReview(true)}
        onTimeUp={handleTimeUp}
      />

      {/* Modals */}
      <TestQuestionPalette
        isOpen={showQuestionPalette}
        onClose={() => setShowQuestionPalette(false)}
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        answeredQuestions={answeredQuestions}
        flaggedQuestions={flaggedQuestions}
        onQuestionSelect={handleQuestionSelect}
      />

      <TestReview
        isOpen={showTestReview}
        onClose={() => setShowTestReview(false)}
        questions={questions}
        answers={answers}
        testType={testConfig.testType}
        testConfig={testConfig}
        explanations={explanations}
      />

      <TestPerformanceAnalysis
        isOpen={showPerformanceAnalysis}
        onClose={() => setShowPerformanceAnalysis(false)}
        answers={answers}
        questions={questions}
        timeTaken={endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0}
        totalTime={testConfig.timeLimit}
        testType={testConfig.testType}
        testConfig={testConfig}
        onRetakeTest={resetTest}
        onNewTest={resetTest}
      />

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 p-8 text-center shadow-2xl max-w-md mx-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⏸️
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Test Paused
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your test is paused. Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </p>
              
              <motion.button
                onClick={handlePauseResume}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg"
              >
                Resume Test
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Completed Overlay */}
      <AnimatePresence>
        {isTestCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 p-8 text-center shadow-2xl max-w-md mx-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Trophy className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Test Completed! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You've completed your {testConfig.testType} test. View your detailed performance analysis.
              </p>
              
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={() => setShowPerformanceAnalysis(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg"
                >
                  View Performance Analysis
                </motion.button>
                
                <motion.button
                  onClick={resetTest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-all"
                >
                  Take New Test
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SaveStatusIndicator />
    </div>
  );
}
