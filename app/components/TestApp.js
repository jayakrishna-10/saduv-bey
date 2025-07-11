// app/components/TestApp.js - Refactored into smaller components
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { AnalyticsService } from '@/lib/analytics';

// Import the new split components
import { TestConfig } from './test/TestConfig';
import { TestInterface } from './test/TestInterface';
import { TestResults } from './test/TestResults';
import { TestReview } from './test/TestReview';

// Import utility functions
import { 
  fetchTestQuestions, 
  getTestMode, 
  getTestType,
  normalizeChapterName 
} from '@/lib/test-utils';
import { fetchTopicsAndYears } from '@/lib/quiz-utils';

export function TestApp() {
  // Authentication
  const { data: session } = useSession();
  
  const [currentView, setCurrentView] = useState('config');
  const [testConfig, setTestConfig] = useState({
    mode: 'mock',
    type: 'paper1',
    questionCount: 50,
    timeLimit: 90,
    selectedTopics: [],
    selectedYears: []
  });
  const [testData, setTestData] = useState({
    questions: [],
    currentIndex: 0,
    answers: {},
    flagged: new Set(),
    visited: new Set(),
    startTime: null,
    endTime: null,
    timeRemaining: 0
  });
  const [showPalette, setShowPalette] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [topics, setTopics] = useState([]);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Initialize component
  useEffect(() => {
    fetchTopicsAndYears();
    setIsLoading(false);
  }, []);

  const fetchTopicsAndYears = async () => {
    try {
      const papers = ['paper1', 'paper2', 'paper3'];
      let allQuestions = [];
      
      for (const paper of papers) {
        const response = await fetch(`/api/quiz?paper=${paper}&limit=1000`);
        if (response.ok) {
          const result = await response.json();
          if (result.questions) {
            allQuestions.push(...result.questions);
          }
        }
      }
      
      const uniqueTopics = [...new Set(allQuestions.map(q => normalizeChapterName(q.tag)))].filter(Boolean).sort();
      const uniqueYears = [...new Set(allQuestions.map(q => Number(q.year)))].filter(year => !isNaN(year)).sort((a, b) => a - b);
      
      setTopics(uniqueTopics);
      setYears(uniqueYears);
    } catch (error) {
      console.error('Error fetching topics and years:', error);
    }
  };

  const startTest = async () => {
    const questions = await fetchTestQuestions(testConfig);
    
    setTestData({
      questions,
      currentIndex: 0,
      answers: {},
      flagged: new Set(),
      visited: new Set([0]),
      startTime: new Date(),
      endTime: null,
      timeRemaining: testConfig.timeLimit * 60
    });
    setCurrentView('test');
  };

  const submitTest = () => {
    const endTime = new Date();
    setTestData(prev => ({
      ...prev,
      endTime
    }));
    setCurrentView('results');
    
    // Record test attempt analytics
    recordTestAttempt(endTime);
  };

  const recordTestAttempt = async (endTime) => {
    if (!session?.user?.id) return;

    try {
      const { questions, answers, startTime } = testData;
      
      // Calculate results
      const correctAnswers = Object.entries(answers).filter(([questionId, answer]) => {
        const question = questions.find(q => (q.main_id || q.id) === questionId);
        return question && question.correct_answer?.toLowerCase() === answer?.toLowerCase();
      }).length;
      
      const totalQuestions = questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const timeTaken = Math.round((endTime - startTime) / 1000 / 60); // in minutes
      
      // Get chapters covered in the test
      const chapters = [...new Set(questions.map(q => normalizeChapterName(q.tag) || 'mixed'))];
      
      // Create questions data for analytics
      const questionsData = questions.map(q => {
        const questionId = q.main_id || q.id;
        const userAnswer = answers[questionId];
        const isCorrect = userAnswer?.toLowerCase() === q.correct_answer?.toLowerCase();
        
        return {
          questionId,
          question: q.question_text,
          selectedOption: userAnswer,
          correctOption: q.correct_answer,
          isCorrect,
          chapter: normalizeChapterName(q.tag) || 'mixed',
          timestamp: endTime
        };
      });

      const testData = {
        testType: testConfig.mode,
        chapters,
        totalQuestions,
        correctAnswers,
        score,
        timeTaken,
        questionsData
      };

      await AnalyticsService.recordTestAttempt(session.user.id, testData);
      
      // Record study session
      await AnalyticsService.recordStudySession(session.user.id, {
        duration: timeTaken,
        questionsAnswered: totalQuestions
      });
      
      console.log('Test attempt recorded successfully');
    } catch (error) {
      console.error('Error recording test attempt:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden flex items-center justify-center transition-colors duration-300">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 dark:text-gray-300 text-sm">Initializing test interface...</p>
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
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 opacity-40 blur-3xl"
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

      <AnimatePresence mode="wait">
        {currentView === 'config' && (
          <TestConfig 
            key="config"
            config={testConfig}
            setConfig={setTestConfig}
            onStart={startTest}
            topics={topics}
            years={years}
          />
        )}
        {currentView === 'test' && (
          <TestInterface
            key="test"
            config={testConfig}
            testData={testData}
            setTestData={setTestData}
            onSubmit={submitTest}
            showPalette={showPalette}
            setShowPalette={setShowPalette}
            showMobileStats={showMobileStats}
            setShowMobileStats={setShowMobileStats}
          />
        )}
        {currentView === 'results' && (
          <TestResults
            key="results"
            config={testConfig}
            testData={testData}
            onReview={() => setCurrentView('review')}
            onRestart={() => setCurrentView('config')}
          />
        )}
        {currentView === 'review' && (
          <TestReview
            key="review"
            config={testConfig}
            testData={testData}
            onBack={() => setCurrentView('results')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}