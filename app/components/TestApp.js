// app/components/TestApp.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Grid3x3, CheckCircle, Circle, Flag, AlertTriangle, Info, Play, Settings, BarChart3, FileText, ArrowLeft, ArrowRight, Home } from 'lucide-react';
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
    recommended: true
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
    recommended: false
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
    recommended: false
  }
};

const TEST_TYPES = {
  PAPER1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit',
    questionCount: 50,
    fixed: true,
    paper: 'paper1'
  },
  PAPER2: {
    id: 'paper2', 
    name: 'Paper 2',
    description: 'Energy Efficiency in Thermal Utilities',
    questionCount: 50,
    fixed: true,
    paper: 'paper2'
  },
  PAPER3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    questionCount: 50,
    fixed: true,
    paper: 'paper3'
  },
  TOPIC_WISE: {
    id: 'topic',
    name: 'Topic-wise Test',
    description: 'Focus on specific topics',
    questionCount: 25,
    fixed: false,
    configurable: true
  },
  CUSTOM: {
    id: 'custom',
    name: 'Custom Test',
    description: 'Mix topics and set your own parameters',
    questionCount: 30,
    fixed: false,
    configurable: true
  }
};

// Normalize functions from QuizApp
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

// Helper function to safely get test mode
const getTestMode = (modeId) => {
  return TEST_MODES[modeId?.toUpperCase()] || TEST_MODES.MOCK_EXAM;
};

// Helper function to safely get test type
const getTestType = (typeId) => {
  return TEST_TYPES[typeId?.toUpperCase()] || TEST_TYPES.PAPER1;
};

// Main Test App Component
export function TestApp() {
  const [currentView, setCurrentView] = useState('config'); // config, test, results, review
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

  // Initialize component
  useEffect(() => {
    fetchTopicsAndYears();
    setIsLoading(false);
  }, []);

  const fetchTopicsAndYears = async () => {
    try {
      const papers = ['paper1', 'paper2', 'paper3'];
      let allQuestions = [];
      
      // Fetch questions from all papers to get comprehensive topic list
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
      
      // For topic-wise or custom tests, we need to fetch from multiple papers and filter
      if (testConfig.type === 'topic' || testConfig.type === 'custom') {
        // Fetch from all papers and then filter by selected topics
        const papers = ['paper1', 'paper2', 'paper3'];
        
        for (const paper of papers) {
          const params = new URLSearchParams({
            paper: paper,
            limit: '1000' // Get more questions to have a good pool for filtering
          });

          const response = await fetch(`/api/quiz?${params}`);
          if (response.ok) {
            const result = await response.json();
            if (result.questions) {
              allQuestions.push(...result.questions);
            }
          }
        }
        
        // Filter by selected topics
        if (testConfig.selectedTopics.length > 0) {
          allQuestions = allQuestions.filter(q => 
            testConfig.selectedTopics.some(topic => 
              normalizeChapterName(q.tag) === topic
            )
          );
        }
        
        // Filter by selected years (for custom tests)
        if (testConfig.type === 'custom' && testConfig.selectedYears.length > 0) {
          allQuestions = allQuestions.filter(q => 
            testConfig.selectedYears.includes(Number(q.year))
          );
        }
        
      } else {
        // For paper-based tests, fetch from specific paper
        const params = new URLSearchParams({
          paper: testType.paper || testConfig.type,
          limit: (testConfig.questionCount * 2).toString() // Get more questions for better shuffling
        });

        const response = await fetch(`/api/quiz?${params}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        allQuestions = result.questions || [];
      }
      
      // Normalize the data
      const normalizedData = allQuestions.map(q => ({
        ...q,
        option_a: normalizeOptionText(q.option_a),
        option_b: normalizeOptionText(q.option_b),
        option_c: normalizeOptionText(q.option_c),
        option_d: normalizeOptionText(q.option_d)
      }));
      
      // Shuffle if required
      let shuffledQuestions = [...normalizedData];
      const testMode = getTestMode(testConfig.mode);
      if (testMode.shuffleQuestions) {
        shuffledQuestions = shuffledQuestions.sort(() => Math.random() - 0.5);
      }
      
      // Take only the required number of questions
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
      timeRemaining: testConfig.timeLimit * 60 // in seconds
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-3 animate-spin" />
            <p className="text-white text-sm">Initializing test interface...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
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
        className="ml-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <Info className="h-3 w-3 text-white/70" />
      </button>
      {showInfo[id] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg border border-white/20 shadow-xl"
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
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link
              href="/nce"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg border border-white/20 transition-colors"
            >
              <Home className="h-4 w-4" />
              NCE Home
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Test</h1>
          <p className="text-white/70">Configure your test parameters</p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 space-y-6">
          
          {/* Test Mode Selection */}
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Test Mode</h3>
              <InfoTooltip 
                id="mode"
                content="Choose how you want to take the test. Mock Exam simulates real exam conditions with timer and no review during test. Practice allows unlimited time and review. Timed Practice combines both."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.values(TEST_MODES).map((mode) => (
                <motion.button
                  key={mode.id}
                  onClick={() => setConfig({...config, mode: mode.id, timeLimit: mode.defaultTime})}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl text-left transition-all duration-300 backdrop-blur-md border relative ${
                    config.mode === mode.id
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                  }`}
                >
                  {mode.recommended && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs px-2 py-1 rounded-full text-white font-medium">
                      Recommended
                    </div>
                  )}
                  <div className="text-2xl mb-2">{mode.icon}</div>
                  <div className="font-semibold text-sm mb-1">{mode.name}</div>
                  <div className="text-xs text-white/70">{mode.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Test Type Selection */}
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Test Type</h3>
              <InfoTooltip 
                id="type"
                content="Paper tests contain 50 questions from all topics of that paper. Topic-wise tests focus on specific areas. Custom tests let you mix different parameters."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className={`p-4 rounded-xl text-left transition-all duration-300 backdrop-blur-md border ${
                    config.type === type.id
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{type.name}</div>
                  <div className="text-xs text-white/70 mb-2">{type.description}</div>
                  <div className="text-xs text-white/50">
                    {type.fixed ? `${type.questionCount} questions (fixed)` : `${type.questionCount} questions (configurable)`}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Topic Selection (for topic-wise and custom tests) */}
          {(config.type === 'topic' || config.type === 'custom') && (
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Select Topics</h3>
                <InfoTooltip 
                  id="topics"
                  content="Choose specific topics to focus on. You must select at least one topic for topic-wise tests."
                />
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-white/5 rounded-lg border border-white/20">
                {topics.length > 0 ? (
                  topics.map(topic => (
                    <label key={topic} className="flex items-center gap-3 cursor-pointer">
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
                        className="rounded bg-white/20 border-white/40 text-purple-500 focus:ring-purple-400"
                      />
                      <span className="text-white/90 text-sm">{topic}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-white/60 text-sm text-center py-2">Loading topics...</div>
                )}
              </div>
              {config.selectedTopics.length > 0 && (
                <div className="mt-2 text-white/70 text-sm">
                  {config.selectedTopics.length} topic{config.selectedTopics.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          )}

          {/* Year Selection (for custom tests) */}
          {config.type === 'custom' && (
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Filter by Years (Optional)</h3>
                <InfoTooltip 
                  id="years"
                  content="Optionally filter questions by specific exam years. Leave empty to include all years."
                />
              </div>
              <div className="flex flex-wrap gap-2">
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
                        className="rounded bg-white/20 border-white/40 text-purple-500 focus:ring-purple-400"
                      />
                      <span className="text-white/90 text-sm bg-white/10 px-2 py-1 rounded">{year}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-white/60 text-sm">Loading years...</div>
                )}
              </div>
              {config.selectedYears.length > 0 && (
                <div className="mt-2 text-white/70 text-sm">
                  {config.selectedYears.length} year{config.selectedYears.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          )}

          {/* Question Count (if configurable) */}
          {!getTestType(config.type)?.fixed && (
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Number of Questions</h3>
                <InfoTooltip 
                  id="count"
                  content="Choose how many questions you want in your test. More questions provide better assessment but take longer to complete."
                />
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={config.questionCount}
                onChange={(e) => setConfig({...config, questionCount: parseInt(e.target.value)})}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-white/70 text-sm mt-2">
                <span>10</span>
                <span className="font-semibold text-white">{config.questionCount} questions</span>
                <span>50</span>
              </div>
            </div>
          )}

          {/* Timer Settings */}
          {getTestMode(config.mode)?.timer && (
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Time Limit</h3>
                <InfoTooltip 
                  id="timer"
                  content="Set the time limit for your test. The test will auto-submit when time expires. Recommended: 1.5-2 minutes per question."
                />
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={config.timeLimit}
                  onChange={(e) => setConfig({...config, timeLimit: parseInt(e.target.value)})}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-white font-semibold min-w-[80px] text-center">
                  {config.timeLimit} min
                </div>
              </div>
              <div className="text-white/60 text-sm mt-2">
                ≈ {Math.round(config.timeLimit / config.questionCount * 60)} seconds per question
              </div>
            </div>
          )}

          {/* Start Test Button */}
          <motion.button
            onClick={onStart}
            disabled={config.type === 'topic' && config.selectedTopics.length === 0}
            whileHover={{ scale: (config.type === 'topic' && config.selectedTopics.length === 0) ? 1 : 1.05 }}
            whileTap={{ scale: (config.type === 'topic' && config.selectedTopics.length === 0) ? 1 : 0.95 }}
            className={`w-full py-4 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              config.type === 'topic' && config.selectedTopics.length === 0
                ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
            }`}
          >
            <Play className="h-5 w-5" />
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
              className="mt-2 p-3 bg-yellow-500/20 border border-yellow-400/50 rounded-lg flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-200 text-sm">Please select at least one topic for topic-wise test</span>
            </motion.div>
          )}
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
        <div className="text-center text-white">
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
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">
              {testType?.name} - {testMode?.name}
            </h1>
            {isTimerEnabled && <TestTimer timeRemaining={testData.timeRemaining} totalTime={config.timeLimit * 60} />}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-white/70 text-sm">
              {answeredCount}/{testData.questions.length} answered
            </div>
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Grid3x3 className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Submit Test
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-6xl mx-auto mt-3">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
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
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={testData.currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-white font-semibold text-sm">
                    Q{testData.currentIndex + 1}
                  </span>
                  <span className="text-white/70 text-sm">
                    {normalizeChapterName(currentQuestion?.tag)} • {currentQuestion?.year}
                  </span>
                </div>
                <button
                  onClick={toggleFlag}
                  className={`p-2 rounded-lg transition-colors ${
                    testData.flagged.has(testData.currentIndex)
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Flag className="h-5 w-5" />
                </button>
              </div>

              {/* Question */}
              <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
                {currentQuestion?.question_text}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {['a', 'b', 'c', 'd'].map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => selectAnswer(option)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-4 rounded-xl backdrop-blur-md border transition-all duration-300 text-left ${
                      testData.answers[testData.currentIndex] === option
                        ? 'bg-white/20 border-white/40 text-white'
                        : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        testData.answers[testData.currentIndex] === option
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/20 text-white'
                      }`}>
                        {option.toUpperCase()}
                      </div>
                      <span className="text-white flex-1">{currentQuestion?.[`option_${option}`]}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigateToQuestion(Math.max(0, testData.currentIndex - 1))}
                  disabled={testData.currentIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    testData.currentIndex === 0
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="text-white/70 text-sm">
                  {testData.currentIndex + 1} of {testData.questions.length}
                </div>

                <button
                  onClick={() => navigateToQuestion(Math.min(testData.questions.length - 1, testData.currentIndex + 1))}
                  disabled={testData.currentIndex === testData.questions.length - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    testData.currentIndex === testData.questions.length - 1
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20 text-white'
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

// Non-distracting Timer Component
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
            className="text-white/20"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`transition-all duration-1000 ${
              timeRemaining < 300 ? 'text-red-400' : 
              timeRemaining < 600 ? 'text-yellow-400' : 
              timeRemaining < 1800 ? 'text-orange-400' : 'text-green-400'
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
          <Clock className="h-4 w-4 text-white" />
        </div>
      </div>
      
      {/* Time Display */}
      <div className="text-white">
        <div className="text-sm font-semibold">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="text-xs text-white/70">remaining</div>
      </div>
    </div>
  );
}

// Question Palette Component
function QuestionPalette({ questions, currentIndex, answers, flagged, visited, onNavigate, onClose }) {
  const getStatusColor = (index) => {
    if (index === currentIndex) return 'bg-purple-500 border-purple-400';
    if (answers[index]) return 'bg-green-500/20 border-green-400/50';
    if (flagged.has(index)) return 'bg-yellow-500/20 border-yellow-400/50';
    if (visited.has(index)) return 'bg-blue-500/20 border-blue-400/50';
    return 'bg-white/10 border-white/20';
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="w-80 backdrop-blur-xl bg-white/10 border-r border-white/20 p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Questions</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onNavigate(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`aspect-square p-2 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${getStatusColor(index)}`}
          >
            <span className="text-xs font-semibold text-white">{index + 1}</span>
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-white/80">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span>Answered ({Object.keys(answers).length})</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <Flag className="h-4 w-4 text-yellow-400" />
          <span>Flagged ({flagged.size})</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <Circle className="h-4 w-4 text-blue-400" />
          <span>Visited ({visited.size})</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <Circle className="h-4 w-4 text-white/40" />
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
      if (testData.questions[index].correct_answer === answer) {
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
      timeTaken: Math.floor(timeTaken / 1000), // in seconds
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
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center"
          >
            <span className="text-3xl font-bold text-white">{results.score}%</span>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Test Complete! 🎉</h1>
          <p className="text-xl text-white/80 mb-6">
            You scored {results.correct} out of {results.answered} attempted questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center"
          >
            <div className="text-3xl font-bold text-green-400 mb-2">{results.correct}</div>
            <div className="text-white/80 text-sm">Correct</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center"
          >
            <div className="text-3xl font-bold text-red-400 mb-2">{results.incorrect}</div>
            <div className="text-white/80 text-sm">Incorrect</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center"
          >
            <div className="text-3xl font-bold text-yellow-400 mb-2">{results.unanswered}</div>
            <div className="text-white/80 text-sm">Unanswered</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center"
          >
            <div className="text-3xl font-bold text-blue-400 mb-2">{formatTime(results.timeTaken)}</div>
            <div className="text-white/80 text-sm">Time Taken</div>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={onReview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FileText className="h-5 w-5" />
            Review Answers
          </motion.button>
          
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
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
  const isCorrect = userAnswer === currentQuestion?.correct_answer;

  const getOptionClass = (option) => {
    const isUserAnswer = userAnswer === option;
    const isCorrectAnswer = currentQuestion?.correct_answer === option;

    if (isCorrectAnswer) {
      return "bg-green-500/30 border-green-400 text-white";
    }
    if (isUserAnswer && !isCorrectAnswer) {
      return "bg-red-500/30 border-red-400 text-white";
    }
    return "bg-white/10 border-white/20 text-white/80";
  };

  const getResultIcon = () => {
    if (!userAnswer) return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    return isCorrect ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-red-500" />;
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
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
      className="min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </button>
          
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold">Review Answers</h1>
            <p className="text-white/70">Question {currentIndex + 1} of {testData.questions.length}</p>
          </div>
          
          <div className="w-32" /> {/* Spacer */}
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-6"
        >
          {/* Question Status */}
          <div className="flex items-center gap-3 mb-6">
            {getResultIcon()}
            <div>
              <span className="text-white font-semibold">
                {!userAnswer ? 'Not Attempted' : isCorrect ? 'Correct' : 'Incorrect'}
              </span>
              {userAnswer && (
                <div className="text-white/70 text-sm">
                  Your answer: {userAnswer?.toUpperCase()} | Correct answer: {currentQuestion?.correct_answer?.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
            {currentQuestion?.question_text}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {['a', 'b', 'c', 'd'].map((option) => (
              <div
                key={option}
                className={`p-4 rounded-xl backdrop-blur-md border transition-all duration-300 ${getOptionClass(option)}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-white/20">
                    {option.toUpperCase()}
                  </div>
                  <span className="flex-1">{currentQuestion?.[`option_${option}`]}</span>
                  {userAnswer === option && <span className="text-xs bg-white/20 px-2 py-1 rounded">Your Answer</span>}
                  {currentQuestion?.correct_answer === option && <span className="text-xs bg-green-500 px-2 py-1 rounded text-white">Correct</span>}
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
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="text-white/70 text-sm">
              {currentIndex + 1} of {testData.questions.length}
            </div>

            <button
              onClick={() => setCurrentIndex(Math.min(testData.questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === testData.questions.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentIndex === testData.questions.length - 1
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white'
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
