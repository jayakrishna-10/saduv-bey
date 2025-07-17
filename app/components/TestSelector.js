// app/components/TestSelector.js
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Target, 
  BookOpen, 
  Filter, 
  Hash, 
  Play, 
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronRight,
  Timer,
  Users,
  Trophy,
  Zap,
  Brain,
  AlertCircle
} from 'lucide-react';
import { TEST_TYPES, PAPERS, formatTime } from '@/lib/test-utils';

export function TestSelector({ 
  isOpen, 
  onClose, 
  currentConfig, 
  onApply,
  topics = [],
  onPaperChange
}) {
  const [config, setConfig] = useState({
    testType: 'mock',
    selectedPaper: 'paper1',
    selectedTopic: 'all',
    questionCount: 20
  });

  const [step, setStep] = useState(1); // 1: Test Type, 2: Paper Selection, 3: Settings (Practice only)
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize config when modal opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setConfig({
        testType: currentConfig?.testType || 'mock',
        selectedPaper: currentConfig?.selectedPaper || 'paper1',
        selectedTopic: currentConfig?.selectedTopic || 'all',
        questionCount: currentConfig?.questionCount || 20
      });
      setStep(1);
      setIsInitialized(true);
    } else if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen, currentConfig]);

  const handlePaperSelect = useCallback(async (paperId) => {
    setConfig(prev => ({
      ...prev,
      selectedPaper: paperId,
      selectedTopic: 'all'
    }));
    
    if (onPaperChange) {
      await onPaperChange(paperId);
    }
  }, [onPaperChange]);

  const handleTestTypeSelect = (testType) => {
    setConfig(prev => ({
      ...prev,
      testType,
      // Reset other config when changing test type
      selectedTopic: 'all',
      questionCount: testType === 'mock' ? 50 : 20
    }));
  };

  const handleNext = () => {
    const maxSteps = config.testType === 'mock' ? 2 : 3;
    if (step < maxSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleApply = useCallback(() => {
    const finalConfig = {
      ...config,
      timeLimit: config.testType === 'mock' 
        ? TEST_TYPES.mock.timeLimit 
        : config.questionCount * TEST_TYPES.practice.timePerQuestion
    };
    onApply(finalConfig);
    if (onClose) onClose();
  }, [config, onApply, onClose]);

  const handleReset = useCallback(() => {
    const resetConfig = {
      testType: 'mock',
      selectedPaper: 'paper1',
      selectedTopic: 'all',
      questionCount: 50
    };
    setConfig(resetConfig);
    setStep(1);
    
    if (onPaperChange) {
      onPaperChange('paper1');
    }
  }, [onPaperChange]);

  const getStepProgress = () => {
    const maxSteps = config.testType === 'mock' ? 2 : 3;
    return (step / maxSteps) * 100;
  };

  const getTimeLimit = () => {
    if (config.testType === 'mock') {
      return TEST_TYPES.mock.timeLimit;
    }
    return config.questionCount * TEST_TYPES.practice.timePerQuestion;
  };

  const canClose = onClose !== undefined;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && canClose && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            {canClose && (
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}

            <div className="pr-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    NCE Practice Test
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Step {step} of {config.testType === 'mock' ? '2' : '3'}: {
                      step === 1 ? 'Choose Test Type' : 
                      step === 2 ? 'Select Paper' : 
                      'Configure Settings'
                    }
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getStepProgress()}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <AnimatePresence mode="wait">
              {/* Step 1: Test Type Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Choose Your Test Experience
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Select the type of test that matches your preparation goals
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mock Test */}
                    <motion.button
                      onClick={() => handleTestTypeSelect('mock')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-8 rounded-3xl text-left transition-all duration-300 border-2 ${
                        config.testType === 'mock'
                          ? 'border-red-300 dark:border-red-600 shadow-xl ring-4 ring-red-100 dark:ring-red-900/50 transform scale-[1.02]'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
                      } ${TEST_TYPES.mock.gradient}`}
                    >
                      <div className="text-center mb-6">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${TEST_TYPES.mock.color} text-white text-3xl shadow-lg flex items-center justify-center`}>
                          {TEST_TYPES.mock.icon}
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {TEST_TYPES.mock.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {TEST_TYPES.mock.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                            <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 mb-1">
                              <Hash className="h-4 w-4" />
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {TEST_TYPES.mock.questionCount}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Questions</div>
                          </div>
                          
                          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                            <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 mb-1">
                              <Timer className="h-4 w-4" />
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              60 min
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Time Limit</div>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border border-red-200 dark:border-red-700">
                          <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">
                            🎯 Real Exam Simulation
                          </h5>
                          <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
                            <li>• Strict time limits like actual NCE</li>
                            <li>• No chapter hints or clues</li>
                            <li>• Full review after completion</li>
                            <li>• Performance analytics</li>
                          </ul>
                        </div>
                      </div>

                      {config.testType === 'mock' && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="mt-4 text-center"
                        >
                          <CheckCircle2 className="h-6 w-6 text-red-600 dark:text-red-400 mx-auto" />
                        </motion.div>
                      )}
                    </motion.button>

                    {/* Practice Test */}
                    <motion.button
                      onClick={() => handleTestTypeSelect('practice')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-8 rounded-3xl text-left transition-all duration-300 border-2 ${
                        config.testType === 'practice'
                          ? 'border-blue-300 dark:border-blue-600 shadow-xl ring-4 ring-blue-100 dark:ring-blue-900/50 transform scale-[1.02]'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
                      } ${TEST_TYPES.practice.gradient}`}
                    >
                      <div className="text-center mb-6">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${TEST_TYPES.practice.color} text-white text-3xl shadow-lg flex items-center justify-center`}>
                          {TEST_TYPES.practice.icon}
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {TEST_TYPES.practice.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {TEST_TYPES.practice.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                            <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                              <Zap className="h-4 w-4" />
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              Custom
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Questions</div>
                          </div>
                          
                          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                            <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              72s
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Per Question</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                            📚 Focused Learning
                          </h5>
                          <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                            <li>• Choose specific topics</li>
                            <li>• Flexible question count</li>
                            <li>• Chapter information provided</li>
                            <li>• Detailed explanations</li>
                          </ul>
                        </div>
                      </div>

                      {config.testType === 'practice' && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="mt-4 text-center"
                        >
                          <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto" />
                        </motion.div>
                      )}
                    </motion.button>
                  </div>

                  {/* Comparison Table */}
                  <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                      Quick Comparison
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-2 text-gray-700 dark:text-gray-300">Feature</th>
                            <th className="text-center py-2 text-red-700 dark:text-red-300">Mock Test</th>
                            <th className="text-center py-2 text-blue-700 dark:text-blue-300">Practice Test</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400">
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2">Questions</td>
                            <td className="text-center py-2">50 (Fixed)</td>
                            <td className="text-center py-2">5-50 (Custom)</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2">Time Limit</td>
                            <td className="text-center py-2">60 minutes</td>
                            <td className="text-center py-2">72s/question</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2">Chapter Info</td>
                            <td className="text-center py-2">❌ Hidden</td>
                            <td className="text-center py-2">✅ Shown</td>
                          </tr>
                          <tr>
                            <td className="py-2">Topic Selection</td>
                            <td className="text-center py-2">❌ All Topics</td>
                            <td className="text-center py-2">✅ Custom</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Paper Selection */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Select Your Paper
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Choose which NCE paper you want to practice
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  {/* Test Configuration Preview */}
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-200 dark:border-indigo-700">
                    <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-4">Test Configuration</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                          {config.testType === 'mock' ? TEST_TYPES.mock.name : TEST_TYPES.practice.name}
                        </div>
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">Test Type</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                          {PAPERS[config.selectedPaper]?.name}
                        </div>
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">Paper</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                          {config.testType === 'mock' ? '50' : config.questionCount}
                        </div>
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                          {formatTime(getTimeLimit())}
                        </div>
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">Time Limit</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Practice Test Settings */}
              {step === 3 && config.testType === 'practice' && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Customize Your Practice Test
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Configure your practice session settings
                    </p>
                  </div>

                  {/* Topic Selection */}
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
                        onClick={() => setConfig(prev => ({ ...prev, selectedTopic: 'all' }))}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`p-4 rounded-xl text-left transition-all border-2 ${
                          config.selectedTopic === 'all'
                            ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-md'
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
                            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      </motion.button>

                      {/* Individual Topic Options */}
                      <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/50">
                        {topics.map((topic, index) => (
                          <motion.button
                            key={topic}
                            onClick={() => setConfig(prev => ({ ...prev, selectedTopic: topic }))}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`w-full p-3 rounded-lg text-left transition-all border ${
                              config.selectedTopic === topic
                                ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-sm'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {topic}
                              </span>
                              {config.selectedTopic === topic && (
                                <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
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
                        onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>5 (Quick)</span>
                        <span>25 (Standard)</span>
                        <span>50 (Comprehensive)</span>
                      </div>

                      {/* Time Information */}
                      <div className="flex items-center justify-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                        <div className="text-center">
                          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {formatTime(getTimeLimit())}
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">Total Time</div>
                        </div>
                        <div className="text-center">
                          <Timer className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            72s
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">Per Question</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Summary */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Ready to Start Practice Test
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-blue-700 dark:text-blue-300 font-medium">Paper</div>
                        <div className="text-blue-900 dark:text-blue-100">{PAPERS[config.selectedPaper]?.name}</div>
                      </div>
                      <div>
                        <div className="text-blue-700 dark:text-blue-300 font-medium">Questions</div>
                        <div className="text-blue-900 dark:text-blue-100">{config.questionCount}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-blue-700 dark:text-blue-300 font-medium">Topic</div>
                        <div className="text-blue-900 dark:text-blue-100">
                          {config.selectedTopic === 'all' ? 'All Topics' : config.selectedTopic}
                        </div>
                      </div>
                      <div>
                        <div className="text-blue-700 dark:text-blue-300 font-medium">Time Limit</div>
                        <div className="text-blue-900 dark:text-blue-100">{formatTime(getTimeLimit())}</div>
                      </div>
                      <div>
                        <div className="text-blue-700 dark:text-blue-300 font-medium">Chapter Info</div>
                        <div className="text-blue-900 dark:text-blue-100">Visible</div>
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
              {(step < (config.testType === 'mock' ? 2 : 3)) ? (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                >
                  Next Step
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleApply}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
                >
                  <Play className="h-4 w-4" />
                  Start Test
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
