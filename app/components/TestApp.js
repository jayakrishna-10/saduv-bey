// FILE: app/components/TestApp.js
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchQuizQuestions } from '@/lib/quiz-utils';
import { Loader2 } from 'lucide-react';

import { TestSelector } from './test/TestSelector';
import { TestHeader } from './test/TestHeader';
import { TestQuestion } from './test/TestQuestion';
import { QuestionPalette } from './test/QuestionPalette';
import { TestSummary } from './test/TestSummary';
import { TestReview } from './test/TestReview';
import { TestFinishConfirmation } from './test/TestFinishConfirmation';
import { TestNavigation } from './test/TestNavigation';
import { QuizSwipeHandler } from './quiz/QuizSwipeHandler';

const TEST_STATES = {
  CONFIG: 'configuring',
  RUNNING: 'running',
  FINISHED: 'finished',
  REVIEW: 'reviewing',
};

export default function TestApp() {
  const { data: session } = useSession();
  
  // Core Test State
  const [testState, setTestState] = useState(TEST_STATES.CONFIG);
  const [testConfig, setTestConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isFinishConfirmOpen, setFinishConfirmOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const timerRef = useRef(null);

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

  const startTimer = useCallback((duration) => {
    setStartTime(Date.now());
    setTimeRemaining(duration);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startTest = async (config) => {
    setIsLoading(true);
    setTestConfig(config);
    
    try {
      // Fetch questions based on configuration
      const fetchedQuestions = await fetchQuizQuestions(
        config.paper, 
        config.questionCount, 
        config.topic
      );
      
      setQuestions(fetchedQuestions);
      setAnswers({});
      setFlaggedQuestions(new Set());
      setCurrentQuestionIndex(0);
      setTestState(TEST_STATES.RUNNING);
      startTimer(config.timeLimit);
      setIsLoading(false);
    } catch (error) {
      console.error('Error starting test:', error);
      setIsLoading(false);
      // Handle error - maybe show an error message
    }
  };
  
  const handleAnswerSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const navigateToQuestion = (index) => {
    if(index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
    setPaletteOpen(false);
  };
  
  const finishTest = async () => {
    clearInterval(timerRef.current);
    if (session?.user?.id) {
      await saveTestAttempt();
    }
    setTestState(TEST_STATES.FINISHED);
  };
  
  const saveTestAttempt = async () => {
    setSaveStatus('saving');
    const correctAnswersCount = questions.reduce((count, q) => {
      const userAnswer = answers[q.main_id || q.id];
      return userAnswer === q.correct_answer ? count + 1 : count;
    }, 0);
    
    const incorrectAnswersCount = Object.keys(answers).length - correctAnswersCount;
    const unansweredCount = questions.length - Object.keys(answers).length;
    const score = questions.length > 0 ? Math.round((correctAnswersCount / questions.length) * 100) : 0;
    
    const attemptData = {
      testMode: testConfig.mode,
      testType: testConfig.paper,
      testConfig: testConfig,
      questionsData: questions.map(({ id, main_id, question_text, correct_answer, tag, year }) => ({ 
        id, main_id, question_text, correct_answer, tag, year 
      })),
      answers: answers,
      flaggedQuestions: Array.from(flaggedQuestions),
      correct: correctAnswersCount,
      incorrect: incorrectAnswersCount,
      unanswered: unansweredCount,
      totalQuestions: questions.length,
      score: score,
      timeTaken: testConfig.timeLimit - timeRemaining,
      timeLimit: testConfig.timeLimit,
    };

    try {
      const response = await fetch('/api/user/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'test', attemptData }),
      });
      if(response.ok) setSaveStatus('success');
      else setSaveStatus('error');
    } catch (error) {
      setSaveStatus('error');
      console.error("Failed to save test attempt:", error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const currentQuestionId = currentQuestion.main_id || currentQuestion.id;

  if (testState === TEST_STATES.CONFIG || isLoading) {
    return <TestSelector onStartTest={startTest} isLoading={isLoading} />;
  }

  if (testState === TEST_STATES.FINISHED) {
    return (
      <TestSummary
        questions={questions}
        answers={answers}
        timeTaken={testConfig.timeLimit - timeRemaining}
        onReview={() => setTestState(TEST_STATES.REVIEW)}
        onRestart={() => setTestState(TEST_STATES.CONFIG)}
        saveStatus={saveStatus}
        testConfig={testConfig}
      />
    );
  }

  if (testState === TEST_STATES.REVIEW) {
    return (
      <TestReview
        questions={questions}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        onExit={() => setTestState(TEST_STATES.FINISHED)}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ x: mousePosition.x * 0.1, y: mousePosition.y * 0.1 }} 
          transition={{ type: "spring", stiffness: 50, damping: 15 }} 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/30 dark:to-purple-900/30 blur-3xl" 
        />
        <motion.div 
          animate={{ x: -mousePosition.x * 0.05, y: -mousePosition.y * 0.05 }} 
          transition={{ type: "spring", stiffness: 30, damping: 15 }} 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 dark:from-emerald-900/20 dark:to-cyan-900/20 blur-3xl" 
        />
      </div>

      <TestHeader
        timeRemaining={timeRemaining}
        questionProgress={{ current: currentQuestionIndex + 1, total: questions.length }}
        testMode={testConfig.mode}
      />
    
      <main className="relative z-10 min-h-screen flex flex-col pt-16">
        <QuizSwipeHandler
          onSwipeLeft={() => navigateToQuestion(currentQuestionIndex + 1)}
          onSwipeRight={() => navigateToQuestion(currentQuestionIndex - 1)}
          disabled={false}
          currentQuestionIndex={currentQuestionIndex}
        >
          <div className="flex-1 px-4 md:px-8 py-8 pb-32 md:pb-8">
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
                >
                  <TestQuestion
                    question={currentQuestion}
                    questionIndex={currentQuestionIndex}
                    totalQuestions={questions.length}
                    selectedOption={answers[currentQuestionId]}
                    isFlagged={flaggedQuestions.has(currentQuestionId)}
                    onOptionSelect={(option) => handleAnswerSelect(currentQuestionId, option)}
                    onFlag={() => handleFlagQuestion(currentQuestionId)}
                    mode={testConfig.mode}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </QuizSwipeHandler>
      </main>
    
      <TestNavigation
        onPrevious={() => navigateToQuestion(currentQuestionIndex - 1)}
        onNext={() => navigateToQuestion(currentQuestionIndex + 1)}
        onPaletteToggle={() => setPaletteOpen(true)}
        onFinishConfirm={() => setFinishConfirmOpen(true)}
        hasPrev={currentQuestionIndex > 0}
        hasNext={currentQuestionIndex < questions.length - 1}
      />
    
      <QuestionPalette
        isOpen={isPaletteOpen}
        onClose={() => setPaletteOpen(false)}
        questions={questions}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        currentQuestionIndex={currentQuestionIndex}
        onQuestionSelect={navigateToQuestion}
      />
    
      <TestFinishConfirmation
        isOpen={isFinishConfirmOpen}
        onClose={() => setFinishConfirmOpen(false)}
        onConfirm={finishTest}
        unansweredCount={questions.length - Object.keys(answers).length}
        flaggedCount={flaggedQuestions.size}
      />
    </div>
  );
}
