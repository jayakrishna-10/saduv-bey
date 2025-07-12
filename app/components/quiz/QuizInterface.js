// app/components/quiz/QuizInterface.js - Fixed to prevent infinite loops and validate Google ID
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
  const { data: session, status } = useSession();
  
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
  const [selectedTopics, setSelectedTopics] = useState(['Energy Management Basics']);
  const [selectedYears, setSelectedYears] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  
  // Loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Tracking state
  const [startTime, setStartTime] = useState(null);
  
  // Refs to prevent infinite loops and track state
  const analyticsRecorded = useRef(false);
  const questionsLoaded = useRef(false);
  const currentGoogleId = useRef(null);
  const initializationComplete = useRef(false);

  // Helper function to validate Google ID
  const validateGoogleId = useCallback((googleId) => {
    if (!googleId || typeof googleId !== 'string') return false;
    const googleIdPattern = /^\d{18,21}$/;
    return googleIdPattern.test(googleId);
  }, []);

  // Safe effect for session changes - only run when Google ID actually changes
  useEffect(() => {
    if (status === 'loading') return;

    const googleId = session?.user?.googleId;
    
    // Only update if the Google ID actually changed
    if (googleId !== currentGoogleId.current) {
      console.log('Quiz: Google ID changed from', currentGoogleId.current, 'to', googleId);
      
      if (googleId && validateGoogleId(googleId)) {
        currentGoogleId.current = googleId;
        analyticsRecorded.current = false; // Reset analytics flag for new user
        console.log('Quiz: Valid Google ID set:', googleId);
      } else if (googleId) {
        console.error('Quiz: Invalid Google ID format:', googleId);
        setError(`Invalid Google ID format: ${googleId}`);
      } else {
        currentGoogleId.current = null;
        console.log('Quiz: No Google ID available');
      }
    }
  }, [session?.user?.googleId, status, validateGoogleId]);

  // Safe effect for initial quiz load - only run once when properly configured
  useEffect(() => {
    if (initializationComplete.current) return;
    
    if (selectedPaper && selectedTopics.length > 0 && !questionsLoaded.current) {
      console.log('Quiz: Initializing with config:', { selectedPaper, selectedTopics });
      questionsLoaded.current = true;
      initializationComplete.current = true;
      loadQuestions();
    }
  }, [selectedPaper, selectedTopics]); // Stable dependencies

  // Mock question loading function - replace with actual API call
  const loadQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Quiz: Loading questions for topics:', selectedTopics);
      
      // Generate mock questions based on configuration
      const mockQuestions = selectedTopics.flatMap((topic, topicIndex) => {
        return Array.from({ length: Math.ceil(questionCount / selectedTopics.length) }, (_, index) => ({
          id: `q_${topicIndex}_${index}`,
          question_text: `Sample question ${index + 1} about ${topic}?`,
          option_a: "Option A",
          option_b: "Option B", 
          option_c: "Option C",
          option_d: "Option D",
          correct_answer: ["a", "b", "c", "d"][Math.floor(Math.random() * 4)],
          tag: topic,
          year: 2023,
          paper: selectedPaper
        }));
      }).slice(0, questionCount);
      
      console.log('Quiz: Generated', mockQuestions.length, 'questions');
      
      setQuestions(mockQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setAnsweredQuestions([]);
      setShowFeedback(false);
      setShowAnswer(false);
      setStartTime(Date.now());
      
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPaper, selectedTopics, questionCount]);

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
    // Prevent multiple recordings and validate authentication
    if (analyticsRecorded.current || !currentGoogleId.current) {
      console.log('Quiz: Skipping analytics recording - already recorded or no Google ID');
      return;
    }
    
    if (!validateGoogleId(currentGoogleId.current)) {
      console.error('Quiz: Cannot record analytics - invalid Google ID:', currentGoogleId.current);
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
      
      console.log('Quiz: Recording completion with Google ID:', currentGoogleId.current);
      console.log('Quiz: Quiz data:', quizData);
      
      // Record quiz attempt
      const quizResult = await AnalyticsService.recordQuizAttempt(currentGoogleId.current, quizData);
      
      // Record study session
      const sessionResult = await AnalyticsService.recordStudySession(currentGoogleId.current, {
        questionsAnswered: totalQuestions,
        quiz_attempts: 1,
        duration: Math.floor(timeTaken / 60), // Convert to minutes
        topics_studied: selectedTopics
      });
      
      if (quizResult && sessionResult) {
        console.log('Quiz: Analytics recorded successfully');
      } else {
        console.warn('Quiz: Some analytics recording failed, but continuing');
      }
    } catch (error) {
      console.error('Error recording quiz analytics:', error);
      // Don't show error to user for analytics failures
    }
  }, [answeredQuestions, startTime, selectedPaper, selectedTopics, validateGoogleId]);

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
    initializationComplete.current = false;
  }, []);

  // Calculate progress
  const questionProgress = {
    current: currentQuestionIndex + 1,
    total: questions.length,
    attempted: answeredQuestions.length
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Show loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 dark:text-gray-300">
            {status === 'loading' ? 'Loading session...' : 'Loading quiz questions...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              questionsLoaded.current = false;
              initializationComplete.current = false;
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

  // Show configuration needed state
  if (!currentQuestion && !showModifyQuiz) {
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
        {currentQuestion && (
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
        )}
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
