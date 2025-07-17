// FILE: app/components/test/TestSelector.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit, Play, Loader2, BookOpen, Clock, Hash, ChevronRight } from 'lucide-react';
import { fetchTopics, PAPERS } from '@/lib/quiz-utils';

export function TestSelector({ onStartTest, isLoading }) {
  const [mode, setMode] = useState('mock'); // 'mock' or 'practice'
  const [config, setConfig] = useState({ paper: 'paper1', topic: 'all', questionCount: 10 });
  const [topics, setTopics] = useState([]);
  const [isTopicsLoading, setTopicsLoading] = useState(false);

  useEffect(() => {
    if (mode === 'practice') {
      setTopicsLoading(true);
      fetchTopics(config.paper).then(data => {
        setTopics(data || []);
        setTopicsLoading(false);
      }).finally(() => setTopicsLoading(false));
    }
  }, [mode, config.paper]);

  const handleStart = () => {
    const testConfig = mode === 'mock'
      ? { mode: 'mock', paper: config.paper, topic: 'all', questionCount: 50, timeLimit: 60 * 60 }
      : { mode: 'practice', paper: config.paper, topic: config.topic, questionCount: config.questionCount, timeLimit: config.questionCount * 72 };
    onStartTest(testConfig);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
        <h1 className="text-4xl font-light text-center text-gray-900 dark:text-gray-100 mb-2">Create a Test</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Choose your test mode and settings to begin.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ModeCard icon={FileText} title="Mock Test" description="Real exam simulation: 50 questions, 60 minutes." selected={mode==='mock'} onClick={() => setMode('mock')} />
          <ModeCard icon={Edit} title="Practice Test" description="Custom session with topic selection and adjustable length." selected={mode==='practice'} onClick={() => setMode('practice')} />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {mode === 'mock' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(PAPERS).map(p => <PaperCard key={p.id} paper={p} selected={config.paper === p.id} onClick={() => setConfig(prev => ({...prev, paper: p.id}))} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Select id="paper" label="Paper" value={config.paper} onChange={e => setConfig(prev => ({ ...prev, paper: e.target.value, topic: 'all' }))}>
                    {Object.values(PAPERS).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </Select>
                  <Select id="topic" label="Topic" value={config.topic} onChange={e => setConfig(prev => ({ ...prev, topic: e.target.value }))} disabled={isTopicsLoading}>
                    <option value="all">All Topics</option>
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </div>
                <div className="space-y-4">
                    <label className="font-medium text-gray-800 dark:text-gray-200">Questions: {config.questionCount}</label>
                    <input type="range" min="5" max="50" step="5" value={config.questionCount} onChange={e => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))} className="w-full slider" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Time: {Math.floor((config.questionCount * 72) / 60)} min { (config.questionCount * 72) % 60} sec</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 border-t border-gray-200/50 dark:border-gray-700/50 pt-6 flex justify-end">
          <motion.button onClick={handleStart} disabled={isLoading} whileHover={{ scale: 1.05 }} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Start Test <ChevronRight/></span>}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

const ModeCard = ({ icon: Icon, title, description, selected, onClick }) => (
  <motion.button onClick={onClick} whileHover={{ y: -5 }} className={`p-6 rounded-2xl text-left transition-all border-2 ${selected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg' : 'bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
    <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-3" />
    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </motion.button>
);

const PaperCard = ({ paper, selected, onClick }) => (
  <motion.button onClick={onClick} whileHover={{ y: -5 }} className={`p-6 rounded-2xl text-left transition-all border-2 ${selected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg' : 'bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{paper.name}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{paper.description}</p>
  </motion.button>
);

const Select = ({ id, label, children, ...props }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="font-medium text-gray-800 dark:text-gray-200">{label}</label>
        <select id={id} {...props} className="w-full p-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
    </div>
);
