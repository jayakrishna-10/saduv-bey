// app/components/test/TestConfig.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Info, AlertTriangle, Play, Timer } from 'lucide-react';
import Link from 'next/link';
import { TEST_MODES, TEST_TYPES, getTestMode, getTestType } from '@/lib/test-utils';

export function TestConfig({ 
  config, 
  setConfig, 
  onStart, 
  topics, 
  years 
}) {
  const [showInfo, setShowInfo] = useState({});

  const InfoTooltip = ({ id, children, content }) => (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowInfo({...showInfo, [id]: true})}
        onMouseLeave={() => setShowInfo({...showInfo, [id]: false})}
        className="ml-2 p-1 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors"
      >
        <Info className="h-3 w-3 text-gray-600 dark:text-gray-400" />
      </button>
      {showInfo[id] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-2xl border border-gray-700 dark:border-gray-300 shadow-xl"
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative z-10 px-4 md:px-8 py-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link
              href="/nce"
              className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 transition-colors"
            >
              <Home className="h-4 w-4" />
              NCE Home
            </Link>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-gray-100 mb-4"
          >
            Create Your Test
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Configure your mock examination with precision timing and comprehensive analysis
          </motion.p>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-12 space-y-8">
          
          {/* Test Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <h3 className="text-xl md:text-2xl font-light text-gray-900 dark:text-gray-100">Test Mode</h3>
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
                  className={`p-4 md:p-6 rounded-xl md:rounded-2xl text-left transition-all duration-300 border-2 relative min-h-[120px] ${
                    config.mode === mode.id
                      ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-lg'
                      : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70'
                  }`}
                >
                  {mode.recommended && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs px-2 py-1 rounded-full text-white font-medium">
                      Recommended
                    </div>
                  )}
                  <div className="text-2xl md:text-3xl mb-3">{mode.icon}</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm md:text-base">{mode.name}</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{mode.description}</div>
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
              <h3 className="text-xl md:text-2xl font-light text-gray-900 dark:text-gray-100">Test Type</h3>
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
                  className={`p-4 md:p-6 rounded-xl md:rounded-2xl text-left transition-all duration-300 border-2 min-h-[120px] ${
                    config.type === type.id
                      ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-lg'
                      : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full mb-3"
                    style={{ backgroundColor: type.color }}
                  />
                  <div className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm md:text-base">{type.name}</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{type.description}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
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
                <h3 className="text-xl md:text-2xl font-light text-gray-900 dark:text-gray-100">Select Topics</h3>
                <InfoTooltip 
                  id="topics"
                  content="Choose specific topics to focus on. You must select at least one topic for topic-wise tests."
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                {topics.length > 0 ? (
                  topics.map(topic => (
                    <label key={topic} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={config.selectedTopics?.includes(topic)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig({...config, selectedTopics: [...(config.selectedTopics || []), topic]});
                          } else {
                            setConfig({...config, selectedTopics: (config.selectedTopics || []).filter(t => t !== topic)});
                          }
                        }}
                        className="w-4 h-4 rounded bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{topic}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Loading topics...</div>
                )}
              </div>
              {config.selectedTopics?.length > 0 && (
                <div className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
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
                <h3 className="text-xl md:text-2xl font-light text-gray-900 dark:text-gray-100">Filter by Years (Optional)</h3>
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
                        checked={config.selectedYears?.includes(year)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig({...config, selectedYears: [...(config.selectedYears || []), year]});
                          } else {
                            setConfig({...config, selectedYears: (config.selectedYears || []).filter(y => y !== year)});
                          }
                        }}
                        className="w-4 h-4 rounded bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300 text-sm bg-white/70 dark:bg-gray-800/70 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">{year}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-sm">Loading years...</div>
                )}
              </div>
              {config.selectedYears?.length > 0 && (
                <div className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
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
                <h3 className="text-xl md:text-2xl font-light text-gray-900 dark:text-gray-100">Number of Questions</h3>
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
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                  <span>10</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-lg">{config.questionCount} questions</span>
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
                <h3 className="text-xl md:text-2xl font-light text-gray-900 dark:text-gray-100">Time Limit</h3>
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
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Timer className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100 font-medium text-lg">{config.timeLimit} min</span>
                  </div>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
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
              disabled={config.type === 'topic' && (!config.selectedTopics || config.selectedTopics.length === 0)}
              whileHover={{ scale: (config.type === 'topic' && (!config.selectedTopics || config.selectedTopics.length === 0)) ? 1 : 1.05 }}
              whileTap={{ scale: (config.type === 'topic' && (!config.selectedTopics || config.selectedTopics.length === 0)) ? 1 : 0.95 }}
              className={`w-full py-3 md:py-4 font-medium rounded-xl md:rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-base md:text-lg ${
                config.type === 'topic' && (!config.selectedTopics || config.selectedTopics.length === 0)
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 shadow-lg'
              }`}
            >
              <Play className="h-5 w-5 md:h-6 md:w-6" />
              {config.type === 'topic' && (!config.selectedTopics || config.selectedTopics.length === 0)
                ? 'Select Topics to Start Test'
                : 'Start Test'
              }
            </motion.button>
            
            {/* Validation Message */}
            {config.type === 'topic' && (!config.selectedTopics || config.selectedTopics.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-2xl flex items-center gap-3"
              >
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-yellow-800 dark:text-yellow-200 text-sm">Please select at least one topic for topic-wise test</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}