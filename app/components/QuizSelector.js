// FILE: app/components/QuizSelector.js
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
  Loader2
} from 'lucide-react';
import { prefetchAllTopics } from '@/lib/quiz-utils';

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

export function QuizSelector({ 
  isOpen, 
  onClose, 
  currentConfig, 
  onApply,
  topics = [],
  onPaperChange
}) {
  const [config, setConfig] = useState({
    selectedPaper: 'paper1',
    selectedTopic: 'all',
    questionCount: 20,
    showExplanations: true
  });

  const [step, setStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPrefetched, setHasPrefetched] = useState(false);

  // Prefetch all topics when component first becomes visible
  useEffect(() => {
    if (isOpen && !hasPrefetched) {
      setHasPrefetched(true);
      console.log('[QuizSelector] Prefetching all topics on first open...');
      
      prefetchAllTopics()
        .then(() => {
          console.log('[QuizSelector] Topics prefetched successfully');
        })
        .catch(error => {
          console.error('[QuizSelector] Prefetch error:', error);
        });
    }
  }, [isOpen, hasPrefetched]);

  // Initialize config when modal opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setConfig({
        selectedPaper: currentConfig?.selectedPaper || 'paper1',
        selectedTopic: currentConfig?.selectedTopic || 'all',
        questionCount: currentConfig?.questionCount || 20,
        showExplanations: currentConfig?.showExplanations !== undefined ? currentConfig.showExplanations : true
      });
      setStep(1);
      setIsInitialized(true);
    } else if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen, currentConfig, isInitialized]);

  const handlePaperSelect = useCallback(async (paperId) => {
    setConfig(prev => ({
      ...prev,
      selectedPaper: paperId,
      selectedTopic: 'all'
    }));
    
    // Call the onPaperChange callback to update topics
    if (onPaperChange) {
      await onPaperChange(paperId);
    }
  }, [onPaperChange]);

  const handleNext = useCallback(() => {
    if (step < 2) setStep(step + 1);
  }, [step]);

  const handlePrevious = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const handleApply = useCallback(() => {
    console.log('[QuizSelector] Applying config:', config);
    onApply(config);
    if (onClose) onClose();
  }, [config, onApply, onClose]);

  const handleReset = useCallback(() => {
    const resetConfig = {
      selectedPaper: 'paper1',
      selectedTopic: 'all',
      questionCount: 20,
      showExplanations: true
    };
    setConfig(resetConfig);
    setStep(1);
    
    if (onPaperChange) {
      onPaperChange('paper1');
    }
  }, [onPaperChange]);

  const handleTopicSelect = useCallback((topic) => {
    setConfig(prev => ({ ...prev, selectedTopic: topic }));
  }, []);

  const handleQuestionCountChange = useCallback((count) => {
    setConfig(prev => ({ ...prev, questionCount: count }));
  }, []);

  const handleExplanationsToggle = useCallback(() => {
    setConfig(prev => ({ ...prev, showExplanations: !prev.showExplanations }));
  }, []);

  // Memoized values
  const stepProgress = useMemo(() => (step / 2) * 100, [step]);

  const questionCountLabel = useMemo(() => {
    const count = config.questionCount;
    if (count <= 10) return { label: 'Quick', icon: Zap, color: 'text-yellow-600 dark:text-yellow-400' };
    if (count <= 30) return { label: 'Standard', icon: Target, color: 'text-blue-600 dark:text-blue-400' };
    return { label: 'Comprehensive', icon: Clock, color: 'text-purple-600 dark:text-purple-400' };
  }, [config.questionCount]);

  const canClose = onClose !== undefined;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && canClose && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
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
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Customize Your Quiz
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Step {step} of 2: {step === 1 ? 'Choose Paper & Topic' : 'Configure Settings'}
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
              {/* Step 1: Paper & Topic Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Paper Selection */}
                  <div>
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

                  {/* Topic Selection */}
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
                                Practice questions from all {topics.length || PAPERS[config.selectedPaper]?.topics} available topics
                              </div>
                            </div>
                            {config.selectedTopic === 'all' && (
                              <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </div>
                        </motion.button>

                        {/* Individual Topic Options */}
                        {topics.length > 0 ? (
                          <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/50">
                            {topics.map((topic, index) => (
                              <motion.button
                                key={topic}
                                onClick={() => handleTopicSelect(topic)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.02, 0.1) }}
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
                        ) : (
                          <div className="flex items-center justify-center p-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Loading topics...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selection Summary */}
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
                    <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Current Selection</h4>
                    <div className="space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                      <div>📄 Paper: {PAPERS[config.selectedPaper]?.name}</div>
                      <div>🎯 Topic: {config.selectedTopic === 'all' ? 'All Topics' : config.selectedTopic}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Settings */}
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
                      Quiz Settings
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
                          return (
                            <>
                              <Icon className={`h-5 w-5 ${color}`} />
                              <span className={`text-sm font-medium ${color}`}>{label} Session</span>
                              <span className="text-gray-600 dark:text-gray-400 text-sm">
                                (~{Math.round(config.questionCount * 1.5)} minutes)
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Explanations Toggle */}
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">AI Explanations</span>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Get detailed explanations after each answer</p>
                      </div>
                    </div>
                    <button
                      onClick={handleExplanationsToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        config.showExplanations ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          config.showExplanations ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Final Summary */}
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl border border-indigo-200 dark:border-indigo-700">
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Ready to Start
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
                        <div className="text-indigo-700 dark:text-indigo-300 font-medium">Explanations</div>
                        <div className="text-indigo-900 dark:text-indigo-100">{config.showExplanations ? 'Enabled' : 'Disabled'}</div>
                      </div>
                      <div>
                        <div className="text-indigo-700 dark:text-indigo-300 font-medium">Duration</div>
                        <div className="text-indigo-900 dark:text-indigo-100">~{Math.round(config.questionCount * 1.5)} min</div>
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
              {step < 2 ? (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
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
                  Start Quiz
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
