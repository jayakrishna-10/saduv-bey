// FILE: app/components/QuizApp.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertTriangle, RefreshCw, Lightbulb } from 'lucide-react';

import { QuizHeader } from './quiz/QuizHeader';
import { QuizQuestion } from './quiz/QuizQuestion';
import { QuizActions } from './quiz/QuizActions';
import { QuizStats } from './quiz/QuizStats';
import { QuizSummary } from './quiz/QuizSummary';
import { QuizCompletion } from './quiz/QuizCompletion';
import { ExplanationDisplay } from './ExplanationDisplay';
import { QuizSelector } from './QuizSelector';
import { 
  fetchQuizQuestions, 
  fetchTopicsAndYears, 
  normalizeChapterName, 
  isCorrectAnswer,
  generateQuizSummary
} from '@/lib/quiz-utils';

export function QuizApp() {
  const { data: session, status } = useSession();
  
  // Quiz state - maintaining existing structure
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
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [topics, setTopics] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [questionCount, setQuestionCount] = useState(20);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [completedQuestionIds, setCompletedQuestionIds] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [questionProgress, setQuestionProgress] = useState({ total: 0, attempted: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(null);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const explanationRef = useRef(null);
  
  // Debug and error state - NEW
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'success', 'error'
  const [saveError, setSaveError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  // Enhanced logging function
  const logDebug = (message, data = null) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[QuizApp] [${timestamp}] ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  };

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

  useEffect(() => {
    fetchQuestions();
    fetchTopicsAndYears(selectedPaper).then(data => {
        if(data) {
            setTopics(data.topics);
            setYears(data.years);
        }
    });
  }, [selectedPaper]);

  useEffect(() => {
    if (questions.length > 0) {
      updateProgress();
    }
  }, [questions, completedQuestionIds]);

  useEffect(() => {
    setIsExplanationVisible(showFeedback || showAnswer);
  }, [showFeedback, showAnswer]);

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

  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(new Date());
    }
  }, [questions]);

  // Enhanced session debugging
  useEffect(() => {
    logDebug('Session status change:', {
      status,
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    setDebugInfo(prev => ({
      ...prev,
      sessionStatus: status,
      hasSession: !!session,
      userId: session?.user?.id || null,
      userEmail: session?.user?.email || null
    }));
  }, [session, status]);

  const saveQuizAttempt = async () => {
    logDebug('=== STARTING SAVE QUIZ ATTEMPT ===');
    
    // Pre-flight checks
    if (!session) {
      logDebug('Cannot save: No session');
      setSaveStatus('error');
      setSaveError('No active session');
      return;
    }

    if (!session.user) {
      logDebug('Cannot save: No user in session');
      setSaveStatus('error');
      setSaveError('No user data in session');
      return;
    }

    if (!session.user.id) {
      logDebug('Cannot save: No user ID in session');
      setSaveStatus('error');
      setSaveError('No user ID in session');
      return;
    }

    if (answeredQuestions.length === 0) {
      logDebug('Cannot save: No answered questions');
      setSaveStatus('error');
      setSaveError('No answered questions to save');
      return;
    }

    setSaveStatus('saving');
    setSaveError(null);

    try {
      logDebug('Generating quiz summary...');
      const summary = generateQuizSummary(answeredQuestions, startTime);
      
      logDebug('Quiz summary generated:', summary);

      const attemptData = {
        paper: selectedPaper,
        selectedTopic: selectedTopic,
        selectedYear: selectedYear,
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

      logDebug('Prepared attempt data:', {
        paper: attemptData.paper,
        selectedTopic: attemptData.selectedTopic,
        questionCount: attemptData.questionCount,
        questionsDataLength: attemptData.questionsData.length,
        answersLength: attemptData.answers.length,
        correctAnswers: attemptData.correctAnswers,
        totalQuestions: attemptData.totalQuestions,
        score: attemptData.score,
        timeTaken: attemptData.timeTaken
      });

      logDebug('Making API request to save attempt...');
      
      const response = await fetch('/api/user/attempts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          type: 'quiz', 
          attemptData: attemptData 
        }),
      });

      logDebug('API response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const responseData = await response.json();
      
      logDebug('API response data:', responseData);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseData.error || 'Unknown error'}`);
      }

      if (responseData.error) {
        throw new Error(`Server Error: ${responseData.error}`);
      }

      logDebug('Quiz attempt saved successfully:', responseData);
      setSaveStatus('success');
      
      // Update debug info
      setDebugInfo(prev => ({
        ...prev,
        lastSaveAttempt: {
          success: true,
          timestamp: new Date().toISOString(),
          insertedId: responseData.data?.id,
          responseData
        }
      }));

    } catch (error) {
      logDebug('Error saving quiz attempt:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      setSaveStatus('error');
      setSaveError(error.message);
      
      // Update debug info
      setDebugInfo(prev => ({
        ...prev,
        lastSaveAttempt: {
          success: false,
          timestamp: new Date().toISOString(),
          error: error.message,
          stack: error.stack
        }
      }));
    }
  };

  const updateProgress = () => {
    const totalQuestions = questions.length;
    const attemptedQuestions = questions.filter(q => completedQuestionIds.has(q.main_id || q.id)).length;
    setQuestionProgress({ total: totalQuestions, attempted: attemptedQuestions });

    if (totalQuestions > 0 && attemptedQuestions === totalQuestions) {
      logDebug('All questions completed, showing completion modal');
      setShowCompletionModal(true);
      if(session) {
        logDebug('Session exists, attempting to save quiz attempt');
        saveQuizAttempt();
      } else {
        logDebug('No session, skipping save');
      }
    }
  };
  
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      logDebug('Fetching questions...', {
        selectedPaper,
        questionCount,
        selectedTopic,
        selectedYear
      });
      
      const fetchedQuestions = await fetchQuizQuestions(selectedPaper, questionCount, selectedTopic, selectedYear);
      
      logDebug('Questions fetched:', {
        count: fetchedQuestions.length,
        firstQuestionId: fetchedQuestions[0]?.id || fetchedQuestions[0]?.main_id
      });
      
      setQuestions(fetchedQuestions);
      setCompletedQuestionIds(new Set());
      setAnsweredQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowAnswer(false);
      setCurrentExplanation(null);
      setSaveStatus(null);
      setSaveError(null);
      setIsLoading(false);
    } catch (err) {
      logDebug('Fetch questions error:', err);
      setIsLoading(false);
    }
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
  
  const handleQuizConfiguration = (config) => {
    setSelectedPaper(config.selectedPaper);
    setSelectedTopic(config.selectedTopic);
    setSelectedYear(config.selectedYear);
    setQuestionCount(config.questionCount);
    setShowModifyQuiz(false);
    fetchQuestions();
  };

  const handleOptionSelect = async (option) => {
    if (selectedOption || isTransitioning || showAnswer || showFeedback) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    
    setSelectedOption(option);
    setShowFeedback(true);
    
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

  const handleNextQuestion = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOption(null);
      setShowFeedback(false);
      setShowAnswer(false);
      setCurrentExplanation(null);
      
      const remaining = questions.filter(q => !completedQuestionIds.has(q.main_id || q.id));
      if (remaining.length === 0) {
        setShowCompletionModal(true);
      } else {
        let nextIndex = (currentQuestionIndex + 1) % questions.length;
        while(completedQuestionIds.has(questions[nextIndex].main_id || questions[nextIndex].id)) {
            nextIndex = (nextIndex + 1) % questions.length;
        }
        setCurrentQuestionIndex(nextIndex);
      }
      setIsTransitioning(false);
    }, 100);
  };

  const handleViewSummary = () => {
    if (session) {
      logDebug('Viewing summary, attempting to save if not already saved');
      if (saveStatus !== 'success') {
        saveQuizAttempt();
      }
    }
    setShowSummary(true);
  };

  const resetFilters = () => {
    setSelectedTopic('all');
    setSelectedYear('all');
    setShowCompletionModal(false);
    setSaveStatus(null);
    setSaveError(null);
    fetchQuestions();
  };
  
  const currentQuestion = questions[currentQuestionIndex] || {};

  // Save Status Indicator Component
  const SaveStatusIndicator = () => {
    if (!session) return null;
    
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {saveStatus === 'saving' && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded shadow-lg flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Saving progress...</span>
          </div>
        )}
        
        {saveStatus === 'success' && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded shadow-lg flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">Progress saved!</span>
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded shadow-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Save failed!</span>
            </div>
            <p className="text-xs mt-1">{saveError}</p>
            <button 
              onClick={saveQuizAttempt}
              className="text-xs bg-red-600 text-white px-2 py-1 rounded mt-2 hover:bg-red-700 flex items-center"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </button>
          </div>
        )}
      </div>
    );
  };

  // Debug Panel Component (only show in development)
  const DebugPanel = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="fixed top-4 left-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs max-w-sm z-50">
        <h3 className="font-bold mb-2">Debug Info</h3>
        <div className="space-y-1">
          <div>Session Status: {debugInfo.sessionStatus}</div>
          <div>Has Session: {debugInfo.hasSession ? '✓' : '✗'}</div>
          <div>User ID: {debugInfo.userId || 'None'}</div>
          <div>Save Status: {saveStatus || 'None'}</div>
          <div>Questions: {questions.length}</div>
          <div>Answered: {answeredQuestions.length}</div>
          {debugInfo.lastSaveAttempt && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div>Last Save: {debugInfo.lastSaveAttempt.success ? '✓' : '✗'}</div>
              <div>Time: {new Date(debugInfo.lastSaveAttempt.timestamp).toLocaleTimeString()}</div>
              {debugInfo.lastSaveAttempt.insertedId && (
                <div>ID: {debugInfo.lastSaveAttempt.insertedId}</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl">
          <Loader2 className="h-8 w-8 mx-auto animate-spin" />
          <p className="mt-4">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ x: mousePosition.x * 0.1, y: mousePosition.y * 0.1 }} 
          transition={{ type: "spring", stiffness: 50, damping: 15 }} 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-40 blur-3xl" 
        />
        <motion.div 
          animate={{ x: -mousePosition.x * 0.05, y: -mousePosition.y * 0.05 }} 
          transition={{ type: "spring", stiffness: 30, damping: 15 }} 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/20 dark:to-cyan-900/20 opacity-30 blur-3xl" 
        />
      </div>

      <QuizHeader 
        selectedPaper={selectedPaper} 
        questionProgress={questionProgress} 
        answeredQuestions={answeredQuestions} 
        showMobileStats={showMobileStats} 
        setShowMobileStats={setShowMobileStats} 
        setShowModifyQuiz={setShowModifyQuiz} 
      />

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
                        <div className="p-4 md:p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                          <Loader2 className="h-5 w-5 animate-spin"/>
                        </div>
                     ) : (
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
                     )}
                  </motion.div>
                )}
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
            </motion.div>
          </AnimatePresence>
          <QuizStats 
            questionProgress={questionProgress} 
            answeredQuestions={answeredQuestions} 
          />
        </div>
      </main>

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
      
      <QuizSummary 
        isOpen={showSummary} 
        onClose={() => setShowSummary(false)} 
        answeredQuestions={answeredQuestions} 
        startTime={startTime} 
      />
      
      <QuizCompletion 
        isOpen={showCompletionModal} 
        onViewSummary={handleViewSummary} 
        onStartNewQuiz={resetFilters} 
      />

      {/* Save Status Indicator */}
      <SaveStatusIndicator />
      
      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}
