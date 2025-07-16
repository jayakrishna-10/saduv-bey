// app/components/TestApp.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

import { TestConfig } from './test/TestConfig';
import { TestInterface } from './test/TestInterface';
import { TestResults } from './test/TestResults';
import { TestReview } from './test/TestReview';
import { fetchTestQuestions, calculateTestResults, normalizeChapterName } from '@/lib/test-utils';

export function TestApp() {
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

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX / window.innerWidth * 100, y: e.clientY / window.innerHeight * 100 });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
          if (result.questions) allQuestions.push(...result.questions);
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

  const saveTestAttempt = async (finalTestData) => {
    if (!session) return;
    const results = calculateTestResults(finalTestData);
    const attemptData = {
      testMode: testConfig.mode,
      testType: testConfig.type,
      testConfig,
      questionsData: finalTestData.questions.map(({ id, main_id, question_text, correct_answer }) => ({ id, main_id, question_text, correct_answer })),
      answers: finalTestData.answers,
      flaggedQuestions: Array.from(finalTestData.flagged),
      correct: results.correct,
      incorrect: results.incorrect,
      unanswered: results.unanswered,
      totalQuestions: results.totalQuestions,
      score: results.score,
      timeTaken: results.timeTaken,
      timeLimit: testConfig.timeLimit * 60,
    };
    try {
      await fetch('/api/user/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'test', attemptData })
      });
    } catch (error) {
      console.error('Error saving test attempt:', error);
    }
  };

  const submitTest = () => {
    const finalTestData = { ...testData, endTime: new Date() };
    setTestData(finalTestData);
    if (session) saveTestAttempt(finalTestData);
    setCurrentView('results');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">Loading test interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ x: mousePosition.x * 0.1, y: mousePosition.y * 0.1 }} className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 opacity-40 blur-3xl" />
        <motion.div animate={{ x: -mousePosition.x * 0.05, y: -mousePosition.y * 0.05 }} className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/20 opacity-30 blur-3xl" />
      </div>
      <AnimatePresence mode="wait">
        {currentView === 'config' && <TestConfig key="config" config={testConfig} setConfig={setTestConfig} onStart={startTest} topics={topics} years={years} />}
        {currentView === 'test' && <TestInterface key="test" config={testConfig} testData={testData} setTestData={setTestData} onSubmit={submitTest} showPalette={showPalette} setShowPalette={setShowPalette} showMobileStats={showMobileStats} setShowMobileStats={setShowMobileStats} />}
        {currentView === 'results' && <TestResults key="results" config={testConfig} testData={testData} onReview={() => setCurrentView('review')} onRestart={() => setCurrentView('config')} />}
        {currentView === 'review' && <TestReview key="review" config={testConfig} testData={testData} onBack={() => setCurrentView('results')} />}
      </AnimatePresence>
    </div>
  );
}

// Add default export for easier importing
export default TestApp;
