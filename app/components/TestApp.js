// FILE: app/components/TestApp.js
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchQuizQuestions } from '@/lib/quiz-utils';
import { TestSelector } from './test/TestSelector';
import { TestHeader } from './test/TestHeader';
import { TestQuestion } from './test/TestQuestion';
import { QuestionPalette } from './test/QuestionPalette';
import { TestSummary } from './test/TestSummary';
import { TestReview } from './test/TestReview';
import { TestFinishConfirmation } from './test/TestFinishConfirmation';
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

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isFinishConfirmOpen, setFinishConfirmOpen] = useState(false);

  const timerRef = useRef(null);

  const startTimer = useCallback((duration) => {
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
    const fetchedQuestions = await fetchQuizQuestions(config.paper, config.questionCount, config.topic);
    setQuestions(fetchedQuestions);
    setAnswers({});
    setFlaggedQuestions(new Set());
    setCurrentQuestionIndex(0);
    setTestState(TEST_STATES.RUNNING);
    startTimer(config.timeLimit);
    setIsLoading(false);
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
    setCurrentQuestionIndex(index);
    setPaletteOpen(false);
  };
  
  const finishTest = async () => {
    clearInterval(timerRef.current);
    setTestState(TEST_STATES.FINISHED);
    
    // Save attempt if user is logged in
    if (session?.user?.id) {
      await saveTestAttempt();
    }
  };
  
  const saveTestAttempt = async () => {
    const correctAnswersCount = questions.reduce((count, q, index) => {
      const userAnswer = answers[q.main_id || q.id];
      return userAnswer === q.correct_answer ? count + 1 : count;
    }, 0);
    
    const incorrectAnswersCount = Object.keys(answers).length - correctAnswersCount;
    const unansweredCount = questions.length - Object.keys(answers).length;
    const score = questions.length > 0 ? Math.round((correctAnswersCount / questions.length) * 100) : 0;
    
    const attemptData = {
      testMode: testConfig.mode,
      testType: testConfig.mode === 'mock' ? testConfig.paper : testConfig.topic,
      testConfig: testConfig,
      questionsData: questions.map(({ id, main_id, question_text, correct_answer, tag }) => ({ id, main_id, question_text, correct_answer, tag })),
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
      await fetch('/api/user/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'test', attemptData }),
      });
    } catch (error) {
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <TestHeader
        timeRemaining={timeRemaining}
        questionProgress={{ current: currentQuestionIndex + 1, total: questions.length }}
        onPaletteToggle={() => setPaletteOpen(true)}
        onFinishConfirm={() => setFinishConfirmOpen(true)}
      />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <QuizSwipeHandler
          onSwipeLeft={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1))}
          onSwipeRight={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl"
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
        </QuizSwipeHandler>
      </main>
      
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
