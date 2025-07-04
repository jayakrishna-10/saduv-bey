// app/components/TestApp.js - Redesigned with minimalist geometric style
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Grid3x3, CheckCircle, Circle, Flag, AlertTriangle, Info, Play, Settings, BarChart3, FileText, ArrowLeft, ArrowRight, Home, Timer, Target, User } from 'lucide-react';
import Link from 'next/link';

// Test Configuration
const TEST_MODES = {
  MOCK_EXAM: {
    id: 'mock',
    name: "Mock Exam",
    description: "Full exam simulation with timer and no review during test",
    timer: true,
    defaultTime: 90,
    reviewDuringTest: false,
    shuffleQuestions: true,
    shuffleOptions: false,
    icon: "🎯",
    recommended: true,
    color: '#6366f1'
  },
  PRACTICE: {
    id: 'practice',
    name: "Practice Test",
    description: "Relaxed practice with no timer and review allowed",
    timer: false,
    defaultTime: 0,
    reviewDuringTest: true,
    shuffleQuestions: false,
    shuffleOptions: false,
    icon: "📚",
    recommended: false,
    color: '#10b981'
  },
  TIMED_PRACTICE: {
    id: 'timed_practice',
    name: "Timed Practice",
    description: "Practice with timer but review allowed during test",
    timer: true,
    defaultTime: 60,
    reviewDuringTest: true,
    shuffleQuestions: true,
    shuffleOptions: false,
    icon: "⏱️",
    recommended: false,
    color: '#f59e0b'
  }
};

const TEST_TYPES = {
  PAPER1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit',
    questionCount: 50,
    fixed: true,
    paper: 'paper1',
    color: '#6366f1'
  },
  PAPER2: {
    id: 'paper2', 
    name: 'Paper 2',
    description: 'Energy Efficiency in Thermal Utilities',
    questionCount: 50,
    fixed: true,
    paper: 'paper2',
    color: '#f59e0b'
  },
  PAPER3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    questionCount: 50,
    fixed: true,
    paper: 'paper3',
    color: '#10b981'
  },
  TOPIC_WISE: {
    id: 'topic',
    name: 'Topic-wise Test',
    description: 'Focus on specific topics',
    questionCount: 25,
    fixed: false,
    configurable: true,
    color: '#8b5cf6'
  },
  CUSTOM: {
    id: 'custom',
    name: 'Custom Test',
    description: 'Mix topics and set your own parameters',
    questionCount: 30,
    fixed: false,
    configurable: true,
    color: '#ec4899'
  }
};

// Normalize functions
const normalizeChapterName = (chapter) => {
  if (!chapter) return '';
  return chapter
    .replace(/['"]/g, '')
    .trim()
    .replace(/Act,?\s+(\d{4})/g, 'Act $1')
    .replace(/\s+/g, ' ')
    .replace(/\s+and\s+/g, ' and ')
    .replace(/^Chapter\s+/i, '')
    .replace(/^chapter_/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeOptionText = (text) => {
  if (!text) return '';
  let normalizedText = text.replace(/['"]/g, '').trim();
  return normalizedText.charAt(0).toUpperCase() + normalizedText.slice(1);
};

const isCorrectAnswer = (option, correctAnswer) => {
  if (!option || !correctAnswer) return false;
  return option === correctAnswer || 
         option.toLowerCase() === correctAnswer.toLowerCase() || 
         option.toUpperCase() === correctAnswer.toUpperCase();
};

const getTestMode = (modeId) => {
  return TEST_MODES[modeId?.toUpperCase()] || TEST_MODES.MOCK_EXAM;
};

const getTestType = (typeId) => {
  return TEST_TYPES[typeId?.toUpperCase()] || TEST_TYPES.PAPER1;
};

// Main Test App Component
export function TestApp() {
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

  const fetchQuestions = async () => {
    try {
      console.log('Fetching questions for test:', testConfig);
      
      const testType = getTestType(testConfig.type);
      let allQuestions = [];
      
      if (testConfig.type === 'topic' || testConfig.type === 'custom') {
        const papers = ['paper1', 'paper2', 'paper3'];
        
        for (const paper of papers) {
          const params = new URLSearchParams({
            paper: paper,
            limit: '1000'
          });

          const response = await fetch(`/api/quiz?${params}`);
          if (response.ok) {
            const result = await response.json();
            if (result.questions) {
              allQuestions.push(...result.questions);
            }
          }
        }
        
        if (testConfig.selectedTopics.length > 0) {
          allQuestions = allQuestions.filter(q => 
            testConfig.selectedTopics.some(topic => 
              normalizeChapterName(q.tag) === topic
            )
          );
        }
        
        if (testConfig.type === 'custom' && testConfig.selectedYears.length > 0) {
          allQuestions = allQuestions.filter(q => 
            testConfig.selectedYears.includes(Number(q.year))
          );
        }
        
      } else {
        const params = new URLSearchParams({
          paper: testType.paper || testConfig.type,
          limit: (testConfig.questionCount * 2).toString()
        });

        const response = await fetch(`/api/quiz?${params}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        allQuestions = result.questions || [];
      }
      
      const normalizedData = allQuestions.map(q => ({
        ...q,
        option_a: normalizeOptionText(q.option_a),
        option_b: normalizeOptionText(q.option_b),
        option_c: normalizeOptionText(q.option_c),
        option_d: normalizeOptionText(q.option_d)
      }));
      
      let shuffledQuestions = [...normalizedData];
      const testMode = getTestMode(testConfig.mode);
      if (testMode.shuffleQuestions) {
        shuffledQuestions = shuffledQuestions.sort(() => Math.random() - 0.5);
      }
      
      const finalQuestions = shuffledQuestions.slice(0, testConfig.questionCount);
      
      console.log(`Fetched ${finalQuestions.length} questions for test`);
      return finalQuestions;
    } catch (err) {
      console.error('Fetch questions error:', err);
      return [];
    }
  };

  const startTest = async () => {
    const questions = await fetchQuestions();
    
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
    setTestData(prev => ({
      ...prev,
      endTime: new Date()
    }));
    setCurrentView('results');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans relative overflow-hidden flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 text-sm">Initializing test interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-40 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 opacity-30 blur-3xl"
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

// Test Configuration Component
function TestConfig({ config, setConfig, onStart, topics, years }) {
  const [showInfo, setShowInfo] = useState({});

  const InfoTooltip = ({ id, children, content }) => (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowInfo({...showInfo, [id]: true})}
        onMouseLeave={() => setShowInfo({...showInfo, [id]: false})}
        className="ml-2 p-1 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
      >
        <Info className="h-3 w-3 text-gray-600" />
      </button>
      {showInfo[id] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-2xl border border-gray-700 shadow-xl"
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative z-10 px-8 py-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link
              href="/nce"
              className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white/90 text-gray-700 text-sm rounded-full border border-gray-200/50 transition-colors"
            >
              <Home className="h-4 w-4" />
              NCE Home
            </Link>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-light text-gray-900 mb-4"
          >
            Create Your Test
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Configure your mock examination with precision timing and comprehensive analysis
          </motion.p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 md:p-12 space-y-8">
          
          {/* Test Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <h3 className="text-2xl font-light text-gray-900">Test Mode</h3>
              <InfoTooltip 
                id="mode"
                content="Choose how you want to take the test. Mock Exam simulates real exam conditions with timer and no review during test. Practice allows unlimited time and review. Timed Practice combines both."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(TEST_MODES).map((mode) => (
                <motion.button
                  key={mode.id}
                  onClick={() => setConfig({...config, mode: mode.id, timeLimit: mode.defaultTime})}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 relative ${
                    config.mode === mode.id
                      ? 'bg-white border-gray-300 shadow-lg'
                      : 'bg-white/50 border-gray-200 hover:bg-white/70'
                  }`}
                >
                  {mode.recommended && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs px-2 py-1 rounded-full text-white font-medium">
                      Recommended
                    </div>
                  )}
                  <div className="text-3xl mb-3">{mode.icon}</div>
                  <div className="font-medium text-gray-900 mb-2">{mode.name}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{mode.description}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Test Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <h3 className="text-2xl font-light text-gray-900">Test Type</h3>
              <InfoTooltip 
                id="type"
                content="Paper tests contain 50 questions from all topics of that paper. Topic-wise tests focus on specific areas. Custom tests let you mix different parameters."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(TEST_TYPES).map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setConfig({
                    ...config, 
                    type: type.id,
                    questionCount: type.questionCount
                  })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                    config.type === type.id
                      ? 'bg-white border-gray-300 shadow-lg'
                      : 'bg-white/50 border-gray-200 hover:bg-white/70'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full mb-3"
                    style={{ backgroundColor: type.color }}
                  />
                  <div className="font-medium text-gray-900 mb-2">{type.name}</div>
                  <div className="text-sm text-gray-600 mb-3 leading-relaxed">{type.description}</div>
                  <div className="text-xs text-gray-500">
                    {type.fixed ? `${type.questionCount} questions (fixed)` : `${type.questionCount} questions (configurable)`}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Topic Selection */}
          {(config.type === 'topic' || config.type === 'custom') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-light text-gray-900">Select Topics</h3>
                <InfoTooltip 
                  id="topics"
                  content="Choose specific topics to focus on. You must select at least one topic for topic-wise tests."
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-3 p-4 bg-white/50 rounded-2xl border border-gray-200">
                {topics.length > 0 ? (
                  topics.map(topic => (
                    <label key={topic} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={config.selectedTopics.includes(topic)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig({...config, selectedTopics: [...config.selectedTopics, topic]});
                          } else {
                            setConfig({...config, selectedTopics: config.selectedTopics.filter(t => t !== topic)});
                          }
                        }}
                        className="w-4 h-4 rounded bg-white border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">{topic}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm text-center py-4">Loading topics...</div>
                )}
              </div>
              {config.selectedTopics.length > 0 && (
                <div className="mt-3 text-gray-600 text-sm">
                  ✓ {config.selectedTopics.length} topic{config.selectedTopics.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </motion.div>
          )}

          {/* Year Selection */}
          {config.type === 'custom' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-light text-gray-900">Filter by Years (Optional)</h3>
                <InfoTooltip 
                  id="years"
                  content="Optionally filter questions by specific exam years. Leave empty to include all years."
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {years.length > 0 ? (
                  years.map(year => (
                    <label key={year} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.selectedYears.includes(year)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig({...config, selectedYears: [...config.selectedYears, year]});
                          } else {
                            setConfig({...config, selectedYears: config.selectedYears.filter(y => y !== year)});
                          }
                        }}
                        className="w-4 h-4 rounded bg-white border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 text-sm bg-white/70 px-3 py-1 rounded-full border border-gray-200">{year}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">Loading years...</div>
                )}
              </div>
              {config.selectedYears.length > 0 && (
                <div className="mt-3 text-gray-600 text-sm">
                  ✓ {config.selectedYears.length} year{config.selectedYears.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </motion.div>
          )}

          {/* Question Count */}
          {!getTestType(config.type)?.fixed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-light text-gray-900">Number of Questions</h3>
                <InfoTooltip 
                  id="count"
                  content="Choose how many questions you want in your test. More questions provide better assessment but take longer to complete."
                />
              </div>
              <div className="space-y-4">
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={config.questionCount}
                  onChange={(e) => setConfig({...config, questionCount: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>10</span>
                  <span className="font-medium text-gray-900 text-lg">{config.questionCount} questions</span>
                  <span>50</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timer Settings */}
          {getTestMode(config.mode)?.timer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-light text-gray-900">Time Limit</h3>
                <InfoTooltip 
                  id="timer"
                  content="Set the time limit for your test. The test will auto-submit when time expires. Recommended: 1.5-2 minutes per question."
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="15"
                    value={config.timeLimit}
                    onChange={(e) => setConfig({...config, timeLimit: parseInt(e.target.value)})}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Timer className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900 font-medium text-lg">{config.timeLimit} min</span>
                  </div>
                </div>
                <div className="text-gray-600 text-sm">
                  ≈ {Math.round(config.timeLimit / config.questionCount * 60)} seconds per question
                </div>
              </div>
            </motion.div>
          )}

          {/* Start Test Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-6"
          >
            <motion.button
              onClick={onStart}
              disabled={config.type === 'topic' && config.selectedTopics.length === 0}
              whileHover={{ scale: (config.type === 'topic' && config.selectedTopics.length === 0) ? 1 : 1.05 }}
              whileTap={{ scale: (config.type === 'topic' && config.selectedTopics.length === 0) ? 1 : 0.95 }}
              className={`w-full py-4 font-medium rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-lg ${
                config.type === 'topic' && config.selectedTopics.length === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg'
              }`}
            >
              <Play className="h-6 w-6" />
              {config.type === 'topic' && config.selectedTopics.length === 0 
                ? 'Select Topics to Start Test'
                : 'Start Test'
              }
            </motion.button>
            
            {/* Validation Message */}
            {config.type === 'topic' && config.selectedTopics.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-center gap-3"
              >
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800 text-sm">Please select at least one topic for topic-wise test</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Test Interface Component
function TestInterface({ config, testData, setTestData, onSubmit, showPalette, setShowPalette }) {
  const currentQuestion = testData.questions[testData.currentIndex];
  const testMode = getTestMode(config.mode);
  const testType = getTestType(config.type);
  const isTimerEnabled = testMode?.timer || false;

  // Timer effect
  useEffect(() => {
    if (!isTimerEnabled || testData.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTestData(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        if (newTimeRemaining <= 0) {
          onSubmit();
          return prev;
        }
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerEnabled, testData.timeRemaining, onSubmit, setTestData]);

  const selectAnswer = (option) => {
    setTestData(prev => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentIndex]: option }
    }));
  };

  const navigateToQuestion = (index) => {
    setTestData(prev => ({
      ...prev,
      currentIndex: index,
      visited: new Set([...prev.visited, index])
    }));
  };

  const toggleFlag = () => {
    setTestData(prev => {
      const newFlagged = new Set(prev.flagged);
      if (newFlagged.has(prev.currentIndex)) {
        newFlagged.delete(prev.currentIndex);
      } else {
        newFlagged.add(prev.currentIndex);
      }
      return { ...prev, flagged: newFlagged };
    });
  };

  const answeredCount = Object.keys(testData.answers).length;
  const progressPercentage = (answeredCount / testData.questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-700">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative"
    >
      {/* Fixed Test Header */}
      <div className="sticky top-0 z-40 bg-white/30 backdrop-blur-xl border-b border-gray-200/50 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Main header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-light text-gray-900">
                {testType?.name} - {testMode?.name}
              </h1>
              {isTimerEnabled && (
                <div className="hidden sm:block">
                  <TestTimer timeRemaining={testData.timeRemaining} totalTime={config.timeLimit * 60} />
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <div className="text-gray-600 text-sm whitespace-nowrap">
                {answeredCount}/{testData.questions.length} answered
              </div>
              
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="p-2 bg-white/70 hover:bg-white/90 rounded-lg transition-colors border border-gray-200/50"
                title="Question Palette"
              >
                <Grid3x3 className="h-5 w-5 text-gray-700" />
              </button>
              
              <motion.button
                onClick={onSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200"
              >
                Submit Test
              </motion.button>
            </div>
          </div>
          
          {/* Timer row for mobile */}
          {isTimerEnabled && (
            <div className="flex justify-center sm:hidden mb-3">
              <TestTimer timeRemaining={testData.timeRemaining} totalTime={config.timeLimit * 60} />
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="sticky top-20 z-30 bg-white/20 backdrop-blur-md border-b border-gray-200/30 p-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm">Quick Actions:</span>
            <button
              onClick={toggleFlag}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                testData.flagged.has(testData.currentIndex)
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : 'bg-white/70 text-gray-700 hover:bg-white/90 border border-gray-200/50'
              }`}
            >
              <Flag className="h-4 w-4 inline mr-1" />
              {testData.flagged.has(testData.currentIndex) ? 'Flagged' : 'Flag'}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateToQuestion(Math.max(0, testData.currentIndex - 1))}
              disabled={testData.currentIndex === 0}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                testData.currentIndex === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border border-gray-200/50'
              }`}
            >
              ← Prev
            </button>
            
            <span className="text-gray-700 text-sm px-3">
              {testData.currentIndex + 1} / {testData.questions.length}
            </span>
            
            <button
              onClick={() => navigateToQuestion(Math.min(testData.questions.length - 1, testData.currentIndex + 1))}
              disabled={testData.currentIndex === testData.questions.length - 1}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                testData.currentIndex === testData.questions.length - 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border border-gray-200/50'
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Question Palette Sidebar */}
        <AnimatePresence>
          {showPalette && (
            <QuestionPalette
              questions={testData.questions}
              currentIndex={testData.currentIndex}
              answers={testData.answers}
              flagged={testData.flagged}
              visited={testData.visited}
              onNavigate={navigateToQuestion}
              onClose={() => setShowPalette(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={testData.currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/70 rounded-full text-gray-900 font-medium text-sm border border-gray-200/50">
                    Q{testData.currentIndex + 1}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {normalizeChapterName(currentQuestion?.tag)} • {currentQuestion?.year}
                  </span>
                </div>
              </div>

              {/* Question */}
              <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-8 leading-relaxed">
                {currentQuestion?.question_text}
              </h2>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {['a', 'b', 'c', 'd'].map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => selectAnswer(option)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      testData.answers[testData.currentIndex] === option
                        ? 'bg-white border-indigo-300 shadow-lg'
                        : 'bg-white/50 border-gray-200 hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                        testData.answers[testData.currentIndex] === option
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {option.toUpperCase()}
                      </div>
                      <span className="text-gray-900 flex-1">{currentQuestion?.[`option_${option}`]}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Mobile Navigation */}
              <div className="flex justify-between items-center md:hidden">
                <button
                  onClick={() => navigateToQuestion(Math.max(0, testData.currentIndex - 1))}
                  disabled={testData.currentIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    testData.currentIndex === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white/70 hover:bg-white/90 text-gray-700 border border-gray-200/50'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="text-gray-700 text-sm">
                  {testData.currentIndex + 1} of {testData.questions.length}
                </div>

                <button
                  onClick={() => navigateToQuestion(Math.min(testData.questions.length - 1, testData.currentIndex + 1))}
                  disabled={testData.currentIndex === testData.questions.length - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    testData.currentIndex === testData.questions.length - 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white/70 hover:bg-white/90 text-gray-700 border border-gray-200/50'
                  }`}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Timer Component
function TestTimer({ timeRemaining, totalTime }) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = (timeRemaining / totalTime) * 100;
  
  return (
    <div className="flex items-center gap-3">
      {/* Circular Progress */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`transition-all duration-1000 ${
              timeRemaining < 300 ? 'text-red-500' : 
              timeRemaining < 600 ? 'text-yellow-500' : 
              timeRemaining < 1800 ? 'text-orange-500' : 'text-emerald-500'
            }`}
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className="h-4 w-4 text-gray-700" />
        </div>
      </div>
      
      {/* Time Display */}
      <div className="text-gray-900">
        <div className="text-sm font-medium">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-600">remaining</div>
      </div>
    </div>
  );
}

// Question Palette Component
function QuestionPalette({ questions, currentIndex, answers, flagged, visited, onNavigate, onClose }) {
  const getStatusColor = (index) => {
    if (index === currentIndex) return 'bg-indigo-500 border-indigo-400 text-white';
    if (answers[index]) return 'bg-emerald-100 border-emerald-300 text-emerald-800';
    if (flagged.has(index)) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    if (visited.has(index)) return 'bg-blue-100 border-blue-300 text-blue-800';
    return 'bg-white/70 border-gray-200 text-gray-700';
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="fixed top-32 left-0 h-[calc(100vh-128px)] w-80 bg-white/70 backdrop-blur-xl border-r border-gray-200/50 p-4 overflow-y-auto z-30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Questions</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/70 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {questions.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onNavigate(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`aspect-square p-2 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${getStatusColor(index)}`}
          >
            <span className="text-xs font-medium">{index + 1}</span>
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-gray-700">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <span>Answered ({Object.keys(answers).length})</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Flag className="h-4 w-4 text-yellow-500" />
          <span>Flagged ({flagged.size})</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Circle className="h-4 w-4 text-blue-500" />
          <span>Visited ({visited.size})</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Circle className="h-4 w-4 text-gray-400" />
          <span>Not visited</span>
        </div>
      </div>
    </motion.div>
  );
}

// Test Results Component
function TestResults({ config, testData, onReview, onRestart }) {
  const calculateResults = () => {
    const totalQuestions = testData.questions.length;
    const answered = Object.keys(testData.answers).length;
    const unanswered = totalQuestions - answered;
    
    let correct = 0;
    Object.entries(testData.answers).forEach(([index, answer]) => {
      if (isCorrectAnswer(answer, testData.questions[index].correct_answer)) {
        correct++;
      }
    });
    
    const incorrect = answered - correct;
    const score = Math.round((correct / totalQuestions) * 100);
    const timeTaken = testData.endTime - testData.startTime;
    
    return {
      totalQuestions,
      answered,
      unanswered,
      correct,
      incorrect,
      score,
      timeTaken: Math.floor(timeTaken / 1000),
      percentage: Math.round((correct / answered) * 100) || 0
    };
  };

  const results = calculateResults();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative z-10 px-8 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg"
          >
            <span className="text-4xl font-light text-white">{results.score}%</span>
          </motion.div>
          
          <h1 className="text-4xl font-light text-gray-900 mb-4">Test Complete! 🎉</h1>
          <p className="text-xl text-gray-600 mb-8">
            You scored {results.correct} out of {results.answered} attempted questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 text-center"
          >
            <div className="text-4xl font-light text-emerald-600 mb-2">{results.correct}</div>
            <div className="text-gray-700 text-sm">Correct</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 text-center"
          >
            <div className="text-4xl font-light text-red-500 mb-2">{results.incorrect}</div>
            <div className="text-gray-700 text-sm">Incorrect</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 text-center"
          >
            <div className="text-4xl font-light text-yellow-500 mb-2">{results.unanswered}</div>
            <div className="text-gray-700 text-sm">Unanswered</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 text-center"
          >
            <div className="text-4xl font-light text-blue-500 mb-2">{formatTime(results.timeTaken)}</div>
            <div className="text-gray-700 text-sm">Time Taken</div>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={onReview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
          >
            <FileText className="h-5 w-5" />
            Review Answers
          </motion.button>
          
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Home className="h-5 w-5" />
            New Test
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Test Review Component
function TestReview({ config, testData, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = testData.questions[currentIndex];
  const userAnswer = testData.answers[currentIndex];
  const isCorrect = isCorrectAnswer(userAnswer, currentQuestion?.correct_answer);

  const getOptionClass = (option) => {
    const isUserAnswer = userAnswer === option;
    const isOptionCorrect = isCorrectAnswer(option, currentQuestion?.correct_answer);

    if (isOptionCorrect) {
      return "bg-emerald-100 border-emerald-300 text-emerald-800";
    }
    if (isUserAnswer && !isOptionCorrect) {
      return "bg-red-100 border-red-300 text-red-800";
    }
    return "bg-white/70 border-gray-200 text-gray-700";
  };

  const getResultIcon = () => {
    if (!userAnswer) return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    return isCorrect ? <CheckCircle className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-red-500" />;
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-700">
          <p>Loading review...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative z-10 min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white/90 text-gray-700 rounded-lg transition-colors border border-gray-200/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </button>
          
          <div className="text-gray-900 text-center">
            <h1 className="text-2xl font-light">Review Answers</h1>
            <p className="text-gray-600">Question {currentIndex + 1} of {testData.questions.length}</p>
          </div>
          
          <div className="w-32" />
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 mb-8"
        >
          {/* Question Status */}
          <div className="flex items-center gap-4 mb-6">
            {getResultIcon()}
            <div>
              <span className="text-gray-900 font-medium text-lg">
                {!userAnswer ? 'Not Attempted' : isCorrect ? 'Correct' : 'Incorrect'}
              </span>
              {userAnswer && (
                <div className="text-gray-600 text-sm mt-1">
                  Your answer: {userAnswer?.toUpperCase()} | Correct answer: {currentQuestion?.correct_answer?.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-light text-gray-900 mb-8 leading-relaxed">
            {currentQuestion?.question_text}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {['a', 'b', 'c', 'd'].map((option) => (
              <div
                key={option}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${getOptionClass(option)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-medium bg-white/50">
                    {option.toUpperCase()}
                  </div>
                  <span className="flex-1">{currentQuestion?.[`option_${option}`]}</span>
                  {userAnswer === option && <span className="text-xs bg-white/70 px-2 py-1 rounded">Your Answer</span>}
                  {isCorrectAnswer(option, currentQuestion?.correct_answer) && <span className="text-xs bg-emerald-500 px-2 py-1 rounded text-white">Correct</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border border-gray-200/50'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="text-gray-600 text-sm">
              {currentIndex + 1} of {testData.questions.length}
            </div>

            <button
              onClick={() => setCurrentIndex(Math.min(testData.questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === testData.questions.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentIndex === testData.questions.length - 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border border-gray-200/50'
              }`}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
