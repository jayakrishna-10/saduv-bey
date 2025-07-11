// app/components/QuizApp.js - Refactored into smaller components
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

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
      const { topics: fetchedTopics, years: fetchedYears } = await fetchTopicsAndYears(selectedPaper);
      setTopics(fetchedTopics);
      setYears(fetchedYears);
    } catch (error) {
      console.error('Error fetching topics and years:', error);
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
    }
  };

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await fetchQuizQuestions(selectedPaper, questionCount, selectedTopic, selectedYear);
      
      setQuestions(fetchedQuestions);
      setCompletedQuestionIds(new Set());
      setAnsweredQuestions([]);
      
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

  const handleNextQuestion = () => {
    setIsTransitioning(true);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setCurrentExplanation(null);
    
    setTimeout(() => {
      const availableQuestions = questions.filter(q => 
        !completedQuestionIds.has(q.main_id || q.id)
      );
      
      if (availableQuestions.length === 0) {
        setShowCompletionModal(true);
        setIsTransitioning(false);
        return;
      }

      let nextQuestion = null;
      let nextIndex = -1;
      
      for (let i = 1; i <= questions.length; i++) {
        const checkIndex = (currentQuestionIndex + i) % questions.length;
        const question = questions[checkIndex];
        
        if (!completedQuestionIds.has(question.main_id || question.id)) {
          nextQuestion = question;
          nextIndex = checkIndex;
          break;
        }
      }
      
      if (nextQuestion) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setShowCompletionModal(true);
      }
      
      setIsTransitioning(false);
    }, 100);
  };

  const resetFilters = () => {
    setSelectedTopic('all');
    setSelectedYear('all');
    setShowCompletionModal(false);
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

              {/* Action Buttons */}
              <QuizActions
                answeredQuestions={answeredQuestions}
                showFeedback={showFeedback}
                showAnswer={showAnswer}
                isTransitioning={isTransitioning}
                onGetAnswer={handleGetAnswer}
                onNextQuestion={handleNextQuestion}
                onViewSummary={() => setShowSummary(true)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Stats Cards */}
          <QuizStats
            questionProgress={questionProgress}
            answeredQuestions={answeredQuestions}
          />
        </div>
      </main>

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
        onViewSummary={() => setShowSummary(true)}
        onStartNewQuiz={resetFilters}
      />
    </div>
  );
}