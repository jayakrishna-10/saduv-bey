// app/components/quiz/QuizInterface.js - Fixed to prevent infinite loops
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion } from './QuizQuestion';
import { QuizActions } from './QuizActions';
import { QuizHeader } from './QuizHeader';
import { QuizStats } from './QuizStats';
import { QuizSummary } from './QuizSummary';
import { QuizCompletion } from './QuizCompletion';
import { AnalyticsService } from '@/lib/analytics';

export default function QuizInterface() {
  // Session and user data
  const { data: session } = useSession();
  
  // Core quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // UI state
  const [showSummary, setShowSummary] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showModifyQuiz, setShowModifyQuiz] = useState(false);
  
  // Config state
  const [selectedPaper, setSelectedPaper] = useState('paper1');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  
  // Loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Tracking state
  const [startTime, setStartTime] = useState(null);
  
  // Refs to prevent infinite loops
  const analyticsRecorded = useRef(false);
  const questionsLoaded = useRef(false);
  const currentSession = useRef(session?.user?.googleId);

  // Safe effect for session changes
  useEffect(() => {
    if (session?.user?.googleId && session.user.googleId !== currentSession.current) {
      console.log('Quiz: Session changed, updating current session ref');
      currentSession.current = session.user.googleId;
      analyticsRecorded.current = false; // Reset analytics flag for new user
    }
  }, [session?.user?.googleId]);

  // Safe effect for initial quiz load
  useEffect(() => {
    if (!questionsLoaded.current && selectedPaper && selectedTopics.length > 0) {
      console.log('Quiz: Loading initial questions');
      questionsLoaded.current = true;
      loadQuestions();
    }
  }, [selectedPaper, selectedTopics]); // Remove loadQuestions from deps to prevent infinite loop

  // Memoized functions to prevent recreation
  const loadQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock question loading - replace with actual API call
      const mockQuestions = [
        {
          id: 1,
          question_text: "What is energy management?",
          option_a: "Managing energy consumption",
          option_b: "Producing energy",
          option_c: "Storing energy",
          option_d: "Selling energy",
          correct_answer: "a",
          tag: "Energy Management Basics",
          year: 2023,
          paper: selectedPaper
        }
        // Add more mock questions as needed
      ];
      
      setQuestions(mockQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setAnsweredQuestions([]);
      setStartTime(Date.now());
      
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPaper, selectedTopics, selectedYears, questionCount]); // Only include necessary dependencies

  const handleOptionSelect = useCallback((option) => {
    if (showAnswer || isTransitioning) return;
    setSelectedOption(option);
  }, [showAnswer, isTransitioning]);

  const handleGetAnswer = useCallback(() => {
    if (showFeedback || showAnswer || isTransitioning) return;
    setShowAnswer(true);
    setShowFeedback(true);
  }, [showFeedback, showAnswer, isTransitioning]);

  const handleNextQuestion = useCallback(async () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    try {
      // Record the current answer if one was selected
      if (selectedOption) {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correct_answer;
        
        const newAnsweredQuestion = {
          questionId: currentQuestion.id,
          question: currentQuestion.question_text,
          selectedOption,
          correctAnswer: currentQuestion.correct_answer,
          isCorrect,
          chapter: currentQuestion.tag,
          timeTaken: Math.floor((Date.now() - startTime) / 1000)
        };
        
        setAnsweredQuestions(prev => [...prev, newAnsweredQuestion]);
      }
      
      // Check if this is the last question
      if (currentQuestionIndex >= questions.length - 1) {
        setShowCompletion(true);
        await recordQuizCompletion();
      } else {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error('Error handling next question:', error);
      setError('Failed to proceed to next question');
    } finally {
      setIsTransitioning(false);
    }
  }, [isTransitioning, selectedOption, questions, currentQuestionIndex, startTime]);

  const recordQuizCompletion = useCallback(async () => {
    // Prevent multiple recordings
    if (analyticsRecorded.current || !session?.user?.googleId) {
      return;
    }
    
    analyticsRecorded.current = true;
    
    try {
      const totalQuestions = answeredQuestions.length;
      const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      const quizData = {
        paper: selectedPaper,
        chapter: selectedTopics[0] || 'mixed',
        totalQuestions,
        correctAnswers,
        score,
        timeTaken,
        questionsData: answeredQuestions
      };
      
      console.log('Quiz: Recording completion with data:', quizData);
      
      // Record quiz attempt
      await AnalyticsService.recordQuizAttempt(session.user.googleId, quizData);
      
      // Record study session
      await AnalyticsService.recordStudySession(session.user.googleId, {
        questionsAnswered: totalQuestions,
        quiz_attempts: 1,
        duration: Math.floor(timeTaken / 60), // Convert to minutes
        topics_studied: selectedTopics
      });
      
      console.log('Quiz: Analytics recorded successfully');
    } catch (error) {
      console.error('Error recording quiz analytics:', error);
      // Don't show error to user for analytics failures
    }
  }, [session?.user?.googleId, answeredQuestions, startTime, selectedPaper, selectedTopics]);

  const handleViewSummary = useCallback(() => {
    setShowSummary(true);
  }, []);

  const handleStartNewQuiz = useCallback(() => {
    // Reset all state for new quiz
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnsweredQuestions([]);
    setShowFeedback(false);
    setShowAnswer(false);
    setIsTransitioning(false);
    setShowSummary(false);
    setShowCompletion(false);
    setShowModifyQuiz(true);
    setStartTime(null);
    
    // Reset flags
    analyticsRecorded.current = false;
    questionsLoaded.current = false;
  }, []);

  // Calculate progress
  const questionProgress = {
    current: currentQuestionIndex + 1,
    total: questions.length,
    attempted: answeredQuestions.length
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 dark:text-gray-300">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              questionsLoaded.current = false;
              loadQuestions();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
          <p className="text-gray-700 dark:text-gray-300 mb-4">No questions available</p>
          <button
            onClick={handleStartNewQuiz}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Configure Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
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
      <div className="max-w-4xl mx-auto px-6 py-8 pb-32 md:pb-8">
        {/* Stats (Desktop only) */}
        <QuizStats
          questionProgress={questionProgress}
          answeredQuestions={answeredQuestions}
        />

        {/* Question */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12 mb-8 shadow-lg">
          <AnimatePresence mode="wait">
            <QuizQuestion
              key={currentQuestionIndex}
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              selectedOption={selectedOption}
              showFeedback={showFeedback}
              showAnswer={showAnswer}
              onOptionSelect={handleOptionSelect}
              isTransitioning={isTransitioning}
            />
          </AnimatePresence>

          <QuizActions
            answeredQuestions={answeredQuestions}
            showFeedback={showFeedback}
            showAnswer={showAnswer}
            isTransitioning={isTransitioning}
            onGetAnswer={handleGetAnswer}
            onNextQuestion={handleNextQuestion}
            onViewSummary={handleViewSummary}
          />
        </div>
      </div>

      {/* Modals */}
      <QuizSummary
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        answeredQuestions={answeredQuestions}
        startTime={startTime}
      />

      <QuizCompletion
        isOpen={showCompletion}
        onViewSummary={handleViewSummary}
        onStartNewQuiz={handleStartNewQuiz}
      />
    </div>
  );
}
