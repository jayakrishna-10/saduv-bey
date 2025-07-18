// FILE: app/components/test/TestSelector.js
'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  BookOpen, 
  Filter, 
  Hash, 
  Play, 
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  Clock,
  ChevronRight,
  FileText,
  Edit,
  Loader2
} from 'lucide-react';
import { fetchTopics, prefetchAllTopics } from '@/lib/quiz-utils';

const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
    icon: '📊',
    topics: 9
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    description: 'Energy Efficiency in Thermal Utilities',
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
    icon: '🔥',
    topics: 8
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    color: 'from-emerald-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-emerald-50 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30',
    icon: '⚡',
    topics: 10
  }
};

export function TestSelector({ onStartTest, isLoading }) {
  const [config, setConfig] = useState({
    mode: 'mock', // 'mock' or 'practice'
    selectedPaper: 'paper1',
    selectedTopic: 'all',
    questionCount: 50, // Default for mock, will change for practice
  });

  const [step, setStep] = useState(1); // 1: Mode + Paper + Topic (if practice), 2: Settings (if practice)
  const [topics, setTopics] = useState([]);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);
  const [topicsCache, setTopicsCache] = useState({});
  const [hasPrefetched, setHasPrefetched] = useState(false);

  // Prefetch all topics on component mount (only once)
  useEffect(() => {
    if (!hasPrefetched) {
      console.log('[TestSelector] Prefetching all topics...');
      setHasPrefetched(true);
      
      prefetchAllTopics()
        .then(() => {
          console.log('[TestSelector] Topics prefetched successfully');
        })
        .catch(error => {
          console.error('[TestSelector] Prefetch error:', error);
        });
    }
  }, [hasPrefetched]);

  // Fetch topics when paper changes in practice mode
  useEffect(() => {
    if (config.mode === 'practice' && config.selectedPaper) {
      // Check cache first
      if (topicsCache[config.selectedPaper]) {
        setTopics(topicsCache[config.selectedPaper]);
        return;
      }

      setIsTopicsLoading(true);
      fetchTopics(config.selectedPaper)
        .then(data => {
          const topicsData = data || [];
          setTopics(topicsData);
          // Cache the result
          setTopicsCache(prev => ({
            ...prev,
            [config.selectedPaper]: topicsData
          }));
          setIsTopicsLoading(false);
        })
        .catch(() => {
          setTopics([]);
          setIsTopicsLoading(false);
        });
    }
  }, [config.mode, config.selectedPaper, topicsCache]);

  const handlePaperSelect = useCallback((paperId) => {
    setConfig(prev => ({
      ...prev,
      selectedPaper: paperId,
      selectedTopic: 'all' // Reset topic when paper changes
    }));
  }, []);

  const handleNext = useCallback(() => {
    // For mock tests, we can start directly after paper selection
    if (config.mode === 'mock') {
      handleApply();
    } else if (step < 2) {
      setStep(step + 1);
    }
  }, [config.mode, step]);

  const handlePrevious = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const handleApply = useCallback(() => {
    // Build test configuration
    let testConfig;
    
    if (config.mode === 'mock') {
      testConfig = {
        mode: 'mock',
        paper: config.selectedPaper,
        topic: 'all',
        questionCount: 50,
        timeLimit: 60 * 60 // 60 minutes in seconds
      };
    } else {
      testConfig = {
        mode: 'practice',
        paper: config.selectedPaper,
        topic: config.selectedTopic,
        questionCount: config.questionCount,
        timeLimit: config.questionCount * 72 // 72 seconds per question
      };
    }
    
    onStartTest(testConfig);
  }, [config, onStartTest]);

  const handleReset = useCallback(() => {
    setConfig({
      mode: 'mock',
      selectedPaper: 'paper1',
      selectedTopic: 'all',
      questionCount: 50
    });
    setStep(1);
  }, []);

  const handleModeChange = useCallback((mode) => {
    setConfig(prev => ({
      ...prev,
      mode,
      questionCount: mode === 'mock' ? 50 : 20
    }));
  }, []);

  const handleTopicSelect = useCallback((topic) => {
    setConfig(prev => ({ ...prev, selectedTopic: topic }));
  }, []);

  const handleQuestionCountChange = useCallback((count) => {
    setConfig(prev => ({ ...prev, questionCount: count }));
  }, []);

  // Memoized values
  const stepProgress = useMemo(() => {
    if (config.mode === 'mock') return 100;
    return (step / 2) * 100;
  }, [config.mode, step]);

  const questionCountLabel = useMemo(() => {
    const count = config.questionCount;
    if (count <= 10) return { label: 'Quick', icon: Zap, color: 'text-yellow-600 dark:text-yellow-400' };
    if (count <= 30) return { label: 'Standard', icon: Target, color: 'text-blue-600 dark:text-blue-400' };
    return { label: 'Comprehensive', icon: Clock, color: 'text-purple-600 dark:text-purple-400' };
  }, [config.questionCount]);

  const stepText = useMemo(() => {
    if (config.mode === 'mock') {
      return 'Choose Paper for Mock Test';
    }
    return step === 1 ? 'Choose Mode, Paper & Topic' : 'Configure Test Settings';
  }, [config.mode, step]);

  const totalSteps = config.mode === 'mock' ? 1 : 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="pr-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Customize Your Test
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Step {step} of {totalSteps}: {stepText}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stepProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Mode Selection + Paper + Topic (for practice) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Mode Selection */}
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Select Your Test Mode
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Choose between a realistic exam simulation or a flexible practice session
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <motion.button
                      onClick={() => handleModeChange('mock')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                        config.mode === 'mock'
                          ? 'border-indigo-300 dark:border-indigo-600 shadow-lg ring-2 ring-indigo-100 dark:ring-indigo-900/50 transform scale-[1.02]'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                      } bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30`}
                    >
                      <div className="w-16 h-16 mb-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white text-2xl shadow-lg flex items-center justify-center">
                        <FileText className="h-8 w-8" />
                      </div>
                      <div className="mb-2">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Mock Test
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Real exam simulation
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        50 questions, 60 minutes timer. Experience the actual exam conditions.
                      </p>
                      {config.mode === 'mock' && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="mt-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </motion.div>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={() => handleModeChange('practice')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                        config.mode === 'practice'
                          ? 'border-indigo-300 dark:border-indigo-600 shadow-lg ring-2 ring-indigo-100 dark:ring-indigo-900/50 transform scale-[1.02]'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                      } bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30`}
                    >
                      <div className="w-16 h-16 mb-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl shadow-lg flex items-center justify-center">
                        <Edit className="h-8 w-8" />
                      </div>
                      <div className="mb-2">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Practice Test
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Custom practice session
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Choose your topics and question count. 72 seconds per question.
                      </p>
                      {config.mode === 'practice' && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="mt-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Paper Selection */}
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Select Your Paper
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Choose which NCE paper you'd like to practice
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {Object.values(PAPERS).map((paper) => (
                      <motion.button
                        key={paper.id}
                        onClick={() => handlePaperSelect(paper.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 rounded-2xl text-center transition-all duration-300 border-2 ${
                          config.selectedPaper === paper.id
                            ? 'border-indigo-300 dark:border-indigo-600 shadow-lg ring-2 ring-indigo-100 dark:ring-indigo-900/50 transform scale-[1.02]'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                        } ${paper.gradient}`}
                      >
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${paper.color} text-white text-2xl shadow-lg flex items-center justify-center`}>
                          {paper.icon}
                        </div>
                        <div className="mb-2">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {paper.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {paper.topics} topics available
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {paper.description}
                        </p>
                        {config.selectedPaper === paper.id && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="mt-3"
                          >
                            <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mx-auto" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Topic Selection (Only for Practice Mode) */}
                {config.mode === 'practice' && (
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                        <Filter className="h-5 w-5" />
                        Choose Topic Focus
                      </label>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Select a specific topic or practice all topics from {PAPERS[config.selectedPaper]?.name}
                      </p>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {/* All Topics Option */}
                        <motion.button
                          onClick={() => handleTopicSelect('all')}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`p-4 rounded-xl text-left transition-all border-2 ${
                            config.selectedTopic === 'all'
                              ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                All Topics
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Practice questions from all {topics.length} available topics
                              </div>
                            </div>
                            {config.selectedTopic === 'all' && (
                              <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </div>
                        </motion.button>

                        {/* Individual Topic Options */}
                        {isTopicsLoading ? (
                          <div className="flex items-center justify-center p-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Loading topics...</span>
                          </div>
                        ) : topics.length > 0 ? (
                          <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/50">
                            {topics.map((topic, index) => (
                              <motion.button
                                key={topic}
                                onClick={() => handleTopicSelect(topic)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={`w-full p-3 rounded-lg text-left transition-all border ${
                                  config.selectedTopic === topic
                                    ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {topic}
                                  </span>
                                  {config.selectedTopic === topic && (
                                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                {/* Selection Summary */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
                  <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Current Selection</h4>
                  <div className="space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                    <div>🎯 Mode: {config.mode === 'mock' ? 'Mock Test' : 'Practice Test'}</div>
                    <div>📄 Paper: {PAPERS[config.selectedPaper]?.name}</div>
                    {config.mode === 'practice' && (
                      <div>🎯 Topic: {config.selectedTopic === 'all' ? 'All Topics' : config.selectedTopic}</div>
                    )}
                    {config.mode === 'mock' && (
                      <>
                        <div>📊 Questions: 50</div>
                        <div>⏱️ Time: 60 minutes</div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Settings (Only for Practice Mode) */}
            {step === 2 && config.mode === 'practice' && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Practice Test Settings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Configure your practice session
                  </p>
                </div>

                {/* Question Count */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <Hash className="h-4 w-4" />
                    Number of Questions: {config.questionCount}
                  </label>
                  
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={config.questionCount}
                      onChange={(e) => handleQuestionCountChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>5 (Quick)</span>
                      <span>25 (Standard)</span>
                      <span>50 (Comprehensive)</span>
                    </div>

                    {/* Question Count Indicator */}
                    <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      {(() => {
                        const { label, icon: Icon, color } = questionCountLabel;
                        const totalTime = config.questionCount * 72; // 72 seconds per question
                        const minutes = Math.floor(totalTime / 60);
                        const seconds = totalTime % 60;
                        return (
                          <>
                            <Icon className={`h-5 w-5 ${color}`} />
                            <span className={`text-sm font-medium ${color}`}>{label} Session</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              ({minutes} min {seconds > 0 ? `${seconds} sec` : ''})
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Time Information */}
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">Time Allotment</span>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">72 seconds per question</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {Math.floor((config.questionCount * 72) / 60)} min {(config.questionCount * 72) % 60} sec
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total test duration
                    </div>
                  </div>
                </div>

                {/* Final Summary */}
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl border border-indigo-200 dark:border-indigo-700">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Ready to Start Practice Test
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-indigo-700 dark:text-indigo-300 font-medium">Paper</div>
                      <div className="text-indigo-900 dark:text-indigo-100">{PAPERS[config.selectedPaper]?.name}</div>
                    </div>
                    <div>
                      <div className="text-indigo-700 dark:text-indigo-300 font-medium">Questions</div>
                      <div className="text-indigo-900 dark:text-indigo-100">{config.questionCount}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-indigo-700 dark:text-indigo-300 font-medium">Topic</div>
                      <div className="text-indigo-900 dark:text-indigo-100">
                        {config.selectedTopic === 'all' ? 'All Topics' : config.selectedTopic}
                      </div>
                    </div>
                    <div>
                      <div className="text-indigo-700 dark:text-indigo-300 font-medium">Time per Question</div>
                      <div className="text-indigo-900 dark:text-indigo-100">72 seconds</div>
                    </div>
                    <div>
                      <div className="text-indigo-700 dark:text-indigo-300 font-medium">Total Duration</div>
                      <div className="text-indigo-900 dark:text-indigo-100">
                        {Math.floor((config.questionCount * 72) / 60)} min {(config.questionCount * 72) % 60} sec
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium"
              >
                Previous
              </button>
            )}
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {(config.mode === 'mock' || (config.mode === 'practice' && step === 2)) ? (
              <motion.button
                onClick={handleApply}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                Start Test
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
