// app/components/QuizApp.js - Fixed with navigation controls, finish button, and modal issues
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Target, 
  MoreHorizontal,
  Grid3x3,
  CheckSquare,
  BarChart3
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { AnalyticsService } from '@/lib/analytics';

// Import the new split components
import { QuizHeader } from './quiz/QuizHeader';
import { QuizQuestion } from './quiz/QuizQuestion';
import { QuizActions } from './quiz/QuizActions';
import { QuizStats } from './quiz/QuizStats';
import { QuizSummary } from './quiz/QuizSummary';
import { QuizCompletion } from './quiz/QuizCompletion';

// Import existing components
import { ExplanationDisplay } from './ExplanationDisplay';
import { QuizSelector } from './QuizSelector';

// Import utility functions
import { 
  fetchQuizQuestions, 
  fetchTopicsAndYears, 
  normalizeChapterName, 
  isCorrectAnswer 
} from '@/lib/quiz-utils';

export function QuizApp() {
  // Authentication
  const { data: session } = useSession();
  
  // State management
  const [selectedPaper, setSelectedPaper] = useState('paper1');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showModifyQuiz, setShowModifyQuiz] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  
  // Explanation state
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  
  // Quiz configuration
  const [topics, setTopics] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [questionCount, setQuestionCount] = useState(20);
  
  // Quiz progress
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [showSummary, setShowSummary] = useState(false);
  const [completedQuestionIds, setCompletedQuestionIds] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [questionProgress, setQuestionProgress] = useState({ total: 0, attempted: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(null);

  // Mobile optimization state
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const explanationRef = useRef(null);

  // Mouse tracking for animations
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

  // Initialize quiz
  useEffect(() => {
    fetchQuestions();
    fetchTopicsAndYears();
  }, [selectedPaper]);

  useEffect(() => {
    if (questions.length > 0) {
      updateProgress();
    }
  }, [questions, completedQuestionIds]);

  // Update explanation visibility state
  useEffect(() => {
    setIsExplanationVisible(showFeedback || showAnswer);
  }, [showFeedback, showAnswer]);

  // Scroll to explanation when it appears on mobile
  useEffect(() => {
    if (isExplanationVisible && explanationRef.current && window.innerWidth < 768) {
      setTimeout(() => {
        explanationRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 300);
    }
  }, [isExplanationVisible]);

  const fetchTopicsAndYears = async () => {
    try {
      const result = await fetchTopicsAndYears(selectedPaper);
      // Handle the case where result might be undefined or have unexpected structure
      if (result && typeof result === 'object') {
        setTopics(result.topics || []);
        setYears(result.years || []);
      } else {
        setTopics([]);
        setYears([]);
      }
    } catch (error) {
      console.error('Error fetching topics and years:', error);
      setTopics([]);
      setYears([]);
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(new Date());
    }
  }, [questions]);

  const updateProgress = () => {
    const totalQuestions = questions.length;
    const attemptedQuestions = questions.filter(q => completedQuestionIds.has(q.main_id || q.id)).length;
    setQuestionProgress({
      total: totalQuestions,
      attempted: attemptedQuestions
    });

    if (attemptedQuestions === totalQuestions && totalQuestions > 0) {
      setShowCompletionModal(true);
      // Record quiz completion analytics
      recordQuizAttempt();
    }
  };

  const recordQuizAttempt = async () => {
    if (!session?.user?.id) return;

    try {
      const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
      const totalQuestions = answeredQuestions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const timeTaken = startTime ? Math.round((new Date() - startTime) / 1000 / 60) : 0; // in minutes
      
      // Determine the primary chapter (most common in the quiz)
      const chapterCounts = {};
      answeredQuestions.forEach(q => {
        const chapter = q.chapter || 'mixed';
        chapterCounts[chapter] = (chapterCounts[chapter] || 0) + 1;
      });
      
      const primaryChapter = Object.keys(chapterCounts).reduce((a, b) => 
        chapterCounts[a] > chapterCounts[b] ? a : b
      ) || 'mixed';

      const quizData = {
        chapter: primaryChapter,
        totalQuestions,
        correctAnswers,
        score,
        timeTaken,
        questionsData: answeredQuestions.map(q => ({
          questionId: q.questionId,
          question: q.question,
          selectedOption: q.selectedOption,
          correctOption: q.correctOption,
          isCorrect: q.isCorrect,
          chapter: q.chapter,
          timestamp: q.timestamp
        }))
      };

      await AnalyticsService.recordQuizAttempt(session.user.id, quizData);
      
      // Record study session
      await AnalyticsService.recordStudySession(session.user.id, {
        duration: timeTaken,
        questionsAnswered: totalQuestions
      });
      
      console.log('Quiz attempt recorded successfully');
    } catch (error) {
      console.error('Error recording quiz attempt:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await fetchQuizQuestions(selectedPaper, questionCount, selectedTopic, selectedYear);
      
      setQuestions(fetchedQuestions);
      setCompletedQuestionIds(new Set());
      setAnsweredQuestions([]);
      setFlaggedQuestions(new Set());
      setVisitedQuestions(new Set([0]));
      
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowAnswer(false);
      setCurrentExplanation(null);
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch questions error:', err);
      setIsLoading(false);
    }
  };

  const loadExplanation = async (questionId) => {
    setIsLoadingExplanation(true);
    try {
      if (!questionId) {
        throw new Error('No question ID provided');
      }

      // First check if explanation is already in the current question data
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && currentQuestion.explanation) {
        setCurrentExplanation(currentQuestion.explanation);
        setIsLoadingExplanation(false);
        return;
      }

      // If not in question data, fetch from API
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: questionId,
          paper: selectedPaper
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch explanation');
      }

      const result = await response.json();
      
      if (result.explanation) {
        setCurrentExplanation(result.explanation);
      } else {
        throw new Error('No explanation found');
      }
      
    } catch (err) {
      console.error('Error loading explanation:', err);
      setCurrentExplanation({
        explanation: {
          concept: {
            title: "Explanation Not Available",
            description: "The explanation for this question is currently being generated. Please try again later.",
            category: "general_aspects"
          },
          correct_answer: {
            option: currentQuestion?.correct_answer?.toLowerCase() || 'a',
            explanation: "This is the correct answer according to NCE standards.",
            supporting_facts: ["Refer to your study materials for detailed explanation"]
          },
          study_tips: {
            exam_strategy: "Review this topic in your NCE preparation materials"
          },
          difficulty_level: "intermediate",
          time_to_solve: "45-60 seconds",
          frequency: "medium"
        }
      });
    }
    setIsLoadingExplanation(false);
  };

  const handleQuizConfiguration = (config) => {
    setSelectedPaper(config.selectedPaper);
    setSelectedTopic(config.selectedTopic);
    setSelectedYear(config.selectedYear);
    setQuestionCount(config.questionCount);
    
    // Reset quiz state
    setCompletedQuestionIds(new Set());
    setAnsweredQuestions([]);
    setFlaggedQuestions(new Set());
    setVisitedQuestions(new Set([0]));
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setCurrentExplanation(null);
    setCurrentQuestionIndex(0);
    
    // Fetch new questions with the new configuration
    fetchQuestionsWithConfig(config);
  };

  const fetchQuestionsWithConfig = async (config) => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await fetchQuizQuestions(
        config.selectedPaper, 
        config.questionCount, 
        config.selectedTopic, 
        config.selectedYear
      );
      setQuestions(fetchedQuestions);
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch questions with config error:', err);
      setIsLoading(false);
    }
  };

  const handleGetAnswer = () => {
    if (showAnswer || showFeedback || isTransitioning) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    
    setShowAnswer(true);
    setShowFeedback(true);
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

  const handleOptionSelect = async (option) => {
    if (selectedOption || isTransitioning || showAnswer || showFeedback) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    setAnsweredQuestions(prev => [...prev, {
      questionId: questionId,
      question: currentQuestion.question_text,
      selectedOption: option,
      correctOption: currentQuestion.correct_answer,
      isCorrect,
      chapter: normalizeChapterName(currentQuestion.tag),
      timestamp: new Date()
    }]);

    setCompletedQuestionIds(prev => new Set([...prev, questionId]));

    await loadExplanation(questionId);
  };

  const navigateToQuestion = (index) => {
    if (index < 0 || index >= questions.length) return;
    
    setIsTransitioning(true);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setCurrentExplanation(null);
    
    setTimeout(() => {
      setCurrentQuestionIndex(index);
      setVisitedQuestions(prev => new Set([...prev, index]));
      setIsTransitioning(false);
    }, 100);
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      navigateToQuestion(nextIndex);
    } else {
      // If we're at the last question, find first unvisited question
      const availableQuestions = questions.filter((_, index) => 
        !completedQuestionIds.has(questions[index].main_id || questions[index].id)
      );
      
      if (availableQuestions.length === 0) {
        setShowCompletionModal(true);
        return;
      }

      // Find next unvisited question
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (!completedQuestionIds.has(question.main_id || question.id)) {
          navigateToQuestion(i);
          break;
        }
      }
    }
  };

  const handlePreviousQuestion = () => {
    const prevIndex = currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      navigateToQuestion(prevIndex);
    }
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(currentQuestionIndex)) {
        newFlagged.delete(currentQuestionIndex);
      } else {
        newFlagged.add(currentQuestionIndex);
      }
      return newFlagged;
    });
  };

  const handleFinishQuiz = () => {
    setShowCompletionModal(true);
    recordQuizAttempt();
  };

  const handleViewSummary = () => {
    setShowCompletionModal(false); // Close completion modal first
    setShowSummary(true);
  };

  const resetFilters = () => {
    setSelectedTopic('all');
    setSelectedYear('all');
    setShowCompletionModal(false);
    setShowSummary(false);
    fetchQuestions();
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden flex items-center justify-center transition-colors duration-300">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 dark:text-gray-300 text-sm">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-40 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/20 dark:to-cyan-900/20 opacity-30 blur-3xl"
        />
      </div>

      {/* Header */}
      <QuizHeader
        selectedPaper={selectedPaper}
        questionProgress={questionProgress}
        answeredQuestions={answeredQuestions}
        showMobileStats={showMobileStats}
        setShowMobileStats={setShowMobileStats}
        setShowModifyQuiz={setShowModifyQuiz}
      />

      {/* Main Content */}
      <main className={`relative z-10 px-4 md:px-8 py-6 md:py-12 transition-all duration-300 ${
        isExplanationVisible ? 'pb-32 md:pb-12' : 'pb-20 md:pb-12'
      }`}>
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentQuestionIndex}-${currentQuestion.main_id || currentQuestion.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-12 mb-8"
            >
              {/* Desktop Navigation and Controls */}
              <div className="hidden md:flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleFlag}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                      flaggedQuestions.has(currentQuestionIndex)
                        ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600'
                        : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
                    }`}
                  >
                    <Flag className="h-4 w-4" />
                    {flaggedQuestions.has(currentQuestionIndex) ? 'Flagged' : 'Flag Question'}
                  </button>
                  
                  <span className="text-gray-600 dark:text-gray-400 text-sm px-3">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      currentQuestionIndex === 0
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1 && completedQuestionIds.size === questions.length}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      (currentQuestionIndex === questions.length - 1 && completedQuestionIds.size === questions.length)
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleFinishQuiz}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium"
                  >
                    <CheckSquare className="h-4 w-4" />
                    Finish Quiz
                  </button>
                </div>
              </div>

              {/* Question */}
              <QuizQuestion
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedOption={selectedOption}
                showFeedback={showFeedback}
                showAnswer={showAnswer}
                onOptionSelect={handleOptionSelect}
                isTransitioning={isTransitioning}
              />

              {/* Explanation Display */}
              <AnimatePresence>
                {(showFeedback || showAnswer) && (
                  <motion.div
                    ref={explanationRef}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 md:mb-8"
                  >
                    {isLoadingExplanation ? (
                      <div className="p-4 md:p-6 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl md:rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-indigo-300 dark:border-indigo-400 border-t-indigo-600 dark:border-t-indigo-200 rounded-full animate-spin" />
                          <span className="text-indigo-800 dark:text-indigo-200 text-sm">Loading comprehensive explanation...</span>
                        </div>
                      </div>
                    ) : currentExplanation ? (
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
                        userAnswer={selectedOption}
                      />
                    ) : (
                      <div className="p-4 md:p-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl md:rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-yellow-800 dark:text-yellow-200 text-sm">Explanation is being generated. Please try again later.</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex flex-col sm:flex-row gap-4 justify-between">
                {answeredQuestions.length > 0 && (
                  <motion.button
                    onClick={() => setShowSummary(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 rounded-full transition-all font-medium"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Summary
                  </motion.button>
                )}
                
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleGetAnswer}
                    disabled={showFeedback || showAnswer || isTransitioning}
                    whileHover={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 1.05 }}
                    whileTap={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium ${
                      (showFeedback || showAnswer || isTransitioning)
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
                    }`}
                  >
                    <Lightbulb className="h-4 w-4" />
                    Show Answer
                  </motion.button>
                </div>
              </div>

              {/* Mobile Navigation at Bottom */}
              <div className="flex md:hidden items-center justify-between mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFlag}
                    className={`p-2 rounded-xl transition-colors ${
                      flaggedQuestions.has(currentQuestionIndex)
                        ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Flag className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleFinishQuiz}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors text-sm font-medium"
                  >
                    Finish
                  </button>
                </div>
                
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1 && completedQuestionIds.size === questions.length}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${
                    (currentQuestionIndex === questions.length - 1 && completedQuestionIds.size === questions.length)
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats Cards */}
          <QuizStats
            questionProgress={questionProgress}
            answeredQuestions={answeredQuestions}
          />
        </div>
      </main>

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 md:hidden z-[60]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            {answeredQuestions.length > 0 && (
              <button
                onClick={() => setShowSummary(true)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                title="View Summary"
              >
                <BarChart3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            )}
          </div>

          {/* Center Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleGetAnswer}
              disabled={showFeedback || showAnswer || isTransitioning}
              whileHover={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 1.05 }}
              whileTap={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                (showFeedback || showAnswer || isTransitioning)
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              Answer
            </motion.button>
          </div>

          {/* Right Space for balance */}
          <div className="w-12" />
        </div>
      </div>

      {/* Quiz Selector Modal */}
      <QuizSelector
        isOpen={showModifyQuiz}
        onClose={() => setShowModifyQuiz(false)}
        currentConfig={{
          selectedPaper,
          selectedTopic,
          selectedYear,
          questionCount,
          showExplanations: true
        }}
        onApply={handleQuizConfiguration}
        topics={topics}
        years={years}
      />

      {/* Summary Modal */}
      <QuizSummary
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        answeredQuestions={answeredQuestions}
        startTime={startTime}
      />

      {/* Completion Modal */}
      <QuizCompletion
        isOpen={showCompletionModal}
        onViewSummary={handleViewSummary}
        onStartNewQuiz={resetFilters}
      />
    </div>
  );
}
