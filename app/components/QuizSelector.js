// app/components/QuizSelector.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  BookOpen, 
  Calendar, 
  Hash, 
  Play, 
  RotateCcw,
  Info,
  CheckCircle2,
  Filter
} from 'lucide-react';

const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit',
    color: 'from-blue-500 to-indigo-600',
    icon: '📊'
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    description: 'Energy Efficiency in Thermal Utilities',
    color: 'from-orange-500 to-red-600',
    icon: '🔥'
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    color: 'from-emerald-500 to-cyan-600',
    icon: '⚡'
  }
};

export function QuizSelector({ 
  isOpen, 
  onClose, 
  currentConfig, 
  onApply,
  topics = [],
  years = []
}) {
  const [config, setConfig] = useState({
    selectedPaper: 'paper1',
    selectedTopic: 'all',
    selectedYear: 'all',
    questionCount: 20,
    showExplanations: true
  });

  const [expandedSections, setExpandedSections] = useState({
    paper: true,
    filters: false,
    settings: false
  });

  // Initialize config when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('QuizSelector opened with currentConfig:', currentConfig);
      setConfig(prevConfig => ({
        selectedPaper: currentConfig?.selectedPaper || 'paper1',
        selectedTopic: currentConfig?.selectedTopic || 'all',
        selectedYear: currentConfig?.selectedYear || 'all',
        questionCount: currentConfig?.questionCount || 20,
        showExplanations: currentConfig?.showExplanations !== undefined ? currentConfig.showExplanations : true
      }));
    }
  }, [isOpen, currentConfig]);

  // Debug config changes
  useEffect(() => {
    console.log('Config updated:', config);
  }, [config]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePaperSelect = (paperId) => {
    console.log('Selecting paper:', paperId);
    setConfig(prev => ({
      ...prev,
      selectedPaper: paperId
    }));
  };

  const handleTopicChange = (topic) => {
    console.log('Selecting topic:', topic);
    setConfig(prev => ({
      ...prev,
      selectedTopic: topic
    }));
  };

  const handleYearChange = (year) => {
    console.log('Selecting year:', year);
    setConfig(prev => ({
      ...prev,
      selectedYear: year
    }));
  };

  const handleQuestionCountChange = (count) => {
    console.log('Setting question count:', count);
    setConfig(prev => ({
      ...prev,
      questionCount: parseInt(count)
    }));
  };

  const handleExplanationsToggle = () => {
    console.log('Toggling explanations:', !config.showExplanations);
    setConfig(prev => ({
      ...prev,
      showExplanations: !prev.showExplanations
    }));
  };

  const handleApply = () => {
    console.log('Applying config:', config);
    onApply(config);
    onClose();
  };

  const handleReset = () => {
    const resetConfig = {
      selectedPaper: 'paper1',
      selectedTopic: 'all',
      selectedYear: 'all', 
      questionCount: 20,
      showExplanations: true
    };
    console.log('Resetting to:', resetConfig);
    setConfig(resetConfig);
  };

  const SectionHeader = ({ title, icon: Icon, section, count }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-white/70 hover:bg-white/90 rounded-2xl border border-gray-200/50 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-indigo-600" />
        <span className="font-medium text-gray-900">{title}</span>
        {count && (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            {count}
          </span>
        )}
      </div>
      <motion.div
        animate={{ rotate: expandedSections[section] ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </button>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/70">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Quiz Configuration</h2>
                <p className="text-gray-600 text-sm">Customize your practice session</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
            
            {/* Paper Selection */}
            <div>
              <SectionHeader 
                title="Select Paper" 
                icon={BookOpen} 
                section="paper"
                count={Object.keys(PAPERS).length}
              />
              <AnimatePresence>
                {expandedSections.paper && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-3"
                  >
                    {Object.values(PAPERS).map((paper) => (
                      <motion.button
                        key={paper.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePaperSelect(paper.id);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border-2 ${
                          config.selectedPaper === paper.id
                            ? 'bg-white border-indigo-300 shadow-lg ring-2 ring-indigo-100'
                            : 'bg-white/50 border-gray-200 hover:bg-white/70 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${paper.color} text-white text-xl`}>
                            {paper.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">{paper.name}</div>
                            <div className="text-sm text-gray-600">{paper.description}</div>
                          </div>
                          {config.selectedPaper === paper.id && (
                            <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filters */}
            <div>
              <SectionHeader 
                title="Filters" 
                icon={Filter} 
                section="filters"
                count={topics.length + years.length}
              />
              <AnimatePresence>
                {expandedSections.filters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-6"
                  >
                    {/* Topic Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Filter by Topic
                      </label>
                      <select
                        value={config.selectedTopic}
                        onChange={(e) => handleTopicChange(e.target.value)}
                        className="w-full p-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="all">All Topics</option>
                        {topics.map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>

                    {/* Year Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Filter by Year
                      </label>
                      <select
                        value={config.selectedYear}
                        onChange={(e) => handleYearChange(e.target.value)}
                        className="w-full p-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="all">All Years</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <div>
              <SectionHeader 
                title="Quiz Settings" 
                icon={Hash} 
                section="settings"
              />
              <AnimatePresence>
                {expandedSections.settings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-6"
                  >
                    {/* Question Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Number of Questions: {config.questionCount}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={config.questionCount}
                        onChange={(e) => handleQuestionCountChange(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5</span>
                        <span>25</span>
                        <span>50</span>
                      </div>
                    </div>

                    {/* Show Explanations Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Info className="h-5 w-5 text-indigo-600" />
                        <div>
                          <span className="text-gray-900 font-medium">Show Explanations</span>
                          <p className="text-gray-600 text-sm">Display detailed explanations after answering</p>
                        </div>
                      </div>
                      <button
                        onClick={handleExplanationsToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          config.showExplanations ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.showExplanations ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Current Selection Summary */}
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
              <h4 className="font-medium text-indigo-900 mb-3">Current Selection</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-700">Paper:</span>
                  <span className="text-indigo-900 font-medium">{PAPERS[config.selectedPaper]?.name || config.selectedPaper}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Topic:</span>
                  <span className="text-indigo-900 font-medium">{config.selectedTopic === 'all' ? 'All Topics' : config.selectedTopic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Year:</span>
                  <span className="text-indigo-900 font-medium">{config.selectedYear === 'all' ? 'All Years' : config.selectedYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Questions:</span>
                  <span className="text-indigo-900 font-medium">{config.questionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Explanations:</span>
                  <span className="text-indigo-900 font-medium">{config.showExplanations ? 'On' : 'Off'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200/50 bg-white/70">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleApply}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                <Play className="h-4 w-4" />
                Apply & Start Quiz
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
