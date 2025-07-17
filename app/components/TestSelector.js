// app/components/TestSelector.js - Test Configuration Selector
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  BookOpen, 
  Filter, 
  Hash, 
  Play, 
  RotateCcw,
  CheckCircle2,
  Target,
  Timer,
  ChevronRight,
  Zap,
  Award,
  FileCheck
} from 'lucide-react';

const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit',
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
    icon: '📊',
    topics: 9
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    description: 'Energy Efficiency in Thermal Utilities',
    color: 'from-red-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30',
    icon: '🔥',
    topics: 8
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    color: 'from-yellow-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30',
    icon: '⚡',
    topics: 10
  }
};

const TEST_TYPES = {
  mock: {
    id: 'mock',
    name: 'Mock Test',
    description: 'Real exam simulation with 50 questions in 60 minutes',
    icon: Award,
    color: 'from-red-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30',
    features: ['50 Questions', '60 Minutes', 'Real Exam Conditions', 'No Chapter Hints'],
    questionCount: 50,
    timePerQuestion: 72 // 60*60/50 = 72 seconds per question
  },
  practice: {
    id: 'practice',
    name: 'Practice Test',
    description: 'Customizable test with chapter information',
    icon: Target,
    color: 'from-orange-500 to-yellow-600',
    gradient: 'bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30',
    features: ['Custom Questions', '72s per Question', 'Chapter Information', 'Topic Selection'],
    questionCount: 25,
    timePerQuestion: 72
  }
};

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
    questionCount: 50
  });

  const [step, setStep] = useState(1); // 1: Test Type, 2: Paper Selection, 3: Configuration
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize config when modal opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setConfig({
        testType: currentConfig?.testType || 'mock',
        selectedPaper: currentConfig?.selectedPaper || 'paper1',
        selectedTopic: currentConfig?.selectedTopic || 'all',
        questionCount: currentConfig?.questionCount || 50
      });
      setStep(1);
      setIsInitialized(true);
    } else if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen, currentConfig]);

  const handleTestTypeSelect = (testType) => {
    setConfig(prev => ({
      ...prev,
      testType,
      questionCount: TEST_TYPES[testType].questionCount,
      selectedTopic: testType === 'mock' ? 'all' : prev.selectedTopic
    }));
    setStep(2);
  };

  const handlePaperSelect = useCallback(async (paperId) => {
    setConfig(prev => ({
      ...prev,
      selectedPaper: paperId,
      selectedTopic: 'all'
    }));
    
    if (onPaperChange) {
      await onPaperChange(paperId);
    }
    
    // For mock tests, skip to final step since no topic selection
    if (config.testType === 'mock') {
      setStep(3);
    } else {
      setStep(3);
    }
  }, [onPaperChange, config.testType]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleApply = useCallback(() => {
    onApply(config);
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

  const getStepProgress = () => (step / 3) * 100;

  const getEstimatedTime = () => {
    if (config.testType === 'mock') {
      return '60 minutes';
    } else {
      const minutes = Math.ceil((config.questionCount * 72) / 60);
      return `${minutes} minutes`;
    }
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
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                  <FileCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Setup Your Test
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Step {step} of 3: {step === 1 ? 'Choose Test Type' : step === 2 ? 'Select Paper' : 'Final Configuration'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
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
                    <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-3">
                      Choose Your Test Type
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select the type of test you want to take
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.values(TEST_TYPES).map((testType) => (
                      <motion.button
                        key={testType.id}
                        onClick={() => handleTestTypeSelect(testType.id)}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-8 rounded-3xl text-center transition-all duration-300 border-2 relative overflow-hidden ${
                          config.testType === testType.id
                            ? 'border-orange-300 dark:border-orange-600 shadow-xl ring-4 ring-orange-100 dark:ring-orange-900/50 transform scale-[1.02]'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
                        } ${testType.gradient}`}
                      >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute top-4 right-4 text-6xl">
                            {testType.id === 'mock' ? '🏆' : '🎯'}
                          </div>
                        </div>

                        <div className="relative z-10">
                          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${testType.color} text-white text-3xl shadow-lg flex items-center justify-center`}>
                            <testType.icon className="h-10 w-10" />
                          </div>
                          
                          <div className="mb-4">
                            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                              {testType.name}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                              {testType.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {testType.features.map((feature, index) => (
                              <div key={index} className="text-xs bg-white/50 dark:bg-gray-800/50 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300">
                                {feature}
                              </div>
                            ))}
                          </div>

                          {config.testType === testType.id && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="mt-4"
                            >
                              <CheckCircle2 className="h-6 w-6 text-orange-600 dark:text-orange-400 mx-auto" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Test Type Comparison */}
                  <div className="mt-8 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-center">Quick Comparison</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Mock Test</div>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Exactly like real NCE exam</li>
                          <li>• Fixed 50 questions, 60 minutes</li>
                          <li>• No hints or chapter information</li>
                          <li>• Best for final preparation</li>
                        </ul>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">Practice Test</div>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Customizable question count</li>
                          <li>• 72 seconds per question</li>
                          <li>• Chapter names for context</li>
                          <li>• Great for topic-wise practice</li>
                        </ul>
                      </div>
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
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-3">
                      Select Your Paper
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose which NCE paper you want to practice
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.values(PAPERS).map((paper) => (
                      <motion.button
                        key={paper.id}
                        onClick={() => handlePaperSelect(paper.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 rounded-2xl text-center transition-all duration-300 border-2 ${
                          config.selectedPaper === paper.id
                            ? 'border-orange-300 dark:border-orange-600 shadow-lg ring-2 ring-orange-100 dark:ring-orange-900/50 transform scale-[1.02]'
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
                            <CheckCircle2 className="h-5 w-5 text-orange-600 dark:text-orange-400 mx-auto" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Final Configuration */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-3">
                      {config.testType === 'mock' ? 'Ready to Start' : 'Final Configuration'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {config.testType === 'mock' 
                        ? 'Your mock test is configured and ready'
                        : 'Customize your practice test settings'
                      }
                    </p>
                  </div>

                  {/* Practice Test Configuration */}
                  {config.testType === 'practice' && (
                    <div className="space-y-6 mb-8">
                      {/* Question Count */}
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                          <Hash className="h-4 w-4" />
                          Number of Questions: {config.questionCount}
                        </label>
                        
                        <div className="space-y-4">
                          <input
                            type="range"
                            min="10"
                            max="50"
                            step="5"
                            value={config.questionCount}
                            onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                          
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>10 (Quick)</span>
                            <span>30 (Standard)</span>
                            <span>50 (Comprehensive)</span>
                          </div>

                          <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <Timer className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                              Estimated Time: {getEstimatedTime()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Topic Selection */}
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                          <Filter className="h-4 w-4" />
                          Choose Topic Focus
                        </label>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {/* All Topics Option */}
                          <motion.button
                            onClick={() => setConfig(prev => ({ ...prev, selectedTopic: 'all' }))}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`p-4 rounded-xl text-left transition-all border-2 ${
                              config.selectedTopic === 'all'
                                ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/30 shadow-md'
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
                                <CheckCircle2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
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
                                    ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/30 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {topic}
                                  </span>
                                  {config.selectedTopic === topic && (
                                    <CheckCircle2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Final Summary */}
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl border border-orange-200 dark:border-orange-700">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Test Configuration
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-orange-700 dark:text-orange-300 font-medium">Test Type</div>
                        <div className="text-orange-900 dark:text-orange-100">{TEST_TYPES[config.testType]?.name}</div>
                      </div>
                      <div>
                        <div className="text-orange-700 dark:text-orange-300 font-medium">Paper</div>
                        <div className="text-orange-900 dark:text-orange-100">{PAPERS[config.selectedPaper]?.name}</div>
                      </div>
                      <div>
                        <div className="text-orange-700 dark:text-orange-300 font-medium">Questions</div>
                        <div className="text-orange-900 dark:text-orange-100">{config.questionCount}</div>
                      </div>
                      <div>
                        <div className="text-orange-700 dark:text-orange-300 font-medium">Time</div>
                        <div className="text-orange-900 dark:text-orange-100">{getEstimatedTime()}</div>
                      </div>
                      {config.testType === 'practice' && (
                        <div className="col-span-2">
                          <div className="text-orange-700 dark:text-orange-300 font-medium">Topic</div>
                          <div className="text-orange-900 dark:text-orange-100">
                            {config.selectedTopic === 'all' ? 'All Topics' : config.selectedTopic}
                          </div>
                        </div>
                      )}
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
              {step < 3 ? (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg"
                >
                  Next Step
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleApply}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg"
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
