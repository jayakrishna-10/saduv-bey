// FILE: app/components/test/TestSelector.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit, Play, Loader2, BookOpen, Clock, Hash, ChevronRight } from 'lucide-react';
import { fetchTopics, PAPERS } from '@/lib/quiz-utils';

export function TestSelector({ onStartTest, isLoading }) {
  const [mode, setMode] = useState('mock'); // 'mock' or 'practice'
  const [config, setConfig] = useState({
    paper: 'paper1',
    topic: 'all',
    questionCount: 10,
  });
  const [topics, setTopics] = useState([]);
  const [isTopicsLoading, setTopicsLoading] = useState(false);

  useEffect(() => {
    if (mode === 'practice') {
      setTopicsLoading(true);
      fetchTopics(config.paper).then(data => {
        setTopics(data || []);
        setTopicsLoading(false);
      });
    }
  }, [mode, config.paper]);

  const handleStart = () => {
    let testConfig;
    if (mode === 'mock') {
      testConfig = {
        mode: 'mock',
        paper: config.paper,
        topic: 'all',
        questionCount: 50,
        timeLimit: 60 * 60, // 60 minutes in seconds
      };
    } else {
      testConfig = {
        mode: 'practice',
        paper: config.paper,
        topic: config.topic,
        questionCount: config.questionCount,
        timeLimit: config.questionCount * 72, // 72 seconds per question
      };
    }
    onStartTest(testConfig);
  };

  const renderMockOptions = () => (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-400">Simulate the real exam with 50 questions and a 60-minute time limit.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(PAPERS).map(paper => (
          <motion.button
            key={paper.id}
            onClick={() => setConfig(prev => ({ ...prev, paper: paper.id }))}
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-2xl text-left transition-all border-2 ${
              config.paper === paper.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{paper.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{paper.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderPracticeOptions = () => (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400">Customize your practice session. Time is allocated at 72 seconds per question.</p>
      
      {/* Paper Selection */}
      <div className="space-y-2">
        <label className="font-medium text-gray-800 dark:text-gray-200">Paper</label>
        <select value={config.paper} onChange={e => setConfig(prev => ({ ...prev, paper: e.target.value, topic: 'all' }))} className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
          {Object.values(PAPERS).map(p => <option key={p.id} value={p.id}>{p.name}: {p.description}</option>)}
        </select>
      </div>

      {/* Topic Selection */}
      <div className="space-y-2">
        <label className="font-medium text-gray-800 dark:text-gray-200">Topic</label>
        {isTopicsLoading ? <Loader2 className="animate-spin" /> : (
          <select value={config.topic} onChange={e => setConfig(prev => ({ ...prev, topic: e.target.value }))} className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
            <option value="all">All Topics</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
      </div>

      {/* Question Count */}
      <div className="space-y-2">
        <label className="font-medium text-gray-800 dark:text-gray-200">Number of Questions: {config.questionCount}</label>
        <input type="range" min="5" max="50" step="5" value={config.questionCount} onChange={e => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))} className="w-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create a Test</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Choose your test mode and settings to begin.</p>
        
        {/* Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-8">
          <button onClick={() => setMode('mock')} className={`w-1/2 p-3 rounded-md font-medium transition-colors ${mode === 'mock' ? 'bg-white dark:bg-gray-800 shadow text-indigo-600' : 'text-gray-600 dark:text-gray-300'}`}>
            <FileText className="inline-block mr-2 h-5 w-5" /> Mock Test
          </button>
          <button onClick={() => setMode('practice')} className={`w-1/2 p-3 rounded-md font-medium transition-colors ${mode === 'practice' ? 'bg-white dark:bg-gray-800 shadow text-indigo-600' : 'text-gray-600 dark:text-gray-300'}`}>
            <Edit className="inline-block mr-2 h-5 w-5" /> Practice Test
          </button>
        </div>

        {mode === 'mock' ? renderMockOptions() : renderPracticeOptions()}

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'mock' ? (
              <div className="flex gap-4"><span className="flex items-center gap-1"><Hash/> 50 Qs</span> <span className="flex items-center gap-1"><Clock/> 60 mins</span></div>
            ) : (
              <div className="flex gap-4"><span className="flex items-center gap-1"><Hash/> {config.questionCount} Qs</span> <span className="flex items-center gap-1"><Clock/> {Math.floor((config.questionCount * 72) / 60)} mins</span></div>
            )}
          </div>
          <motion.button onClick={handleStart} disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
            {isLoading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Start Test <ChevronRight/></span>}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
