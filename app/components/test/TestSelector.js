// FILE: app/components/test/TestSelector.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  Play, 
  RotateCcw,
  CheckCircle2,
  FileText,
  Edit,
  ChevronRight,
  Filter,
  Hash,
  Clock
} from 'lucide-react';
import { fetchTopics, PAPERS } from '@/lib/quiz-utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TestSelector({ onStartTest, isLoading }) {
  const [mode, setMode] = useState('mock');
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ paper: 'paper1', topic: 'all', questionCount: 10 });
  const [topics, setTopics] = useState([]);
  const [isTopicsLoading, setTopicsLoading] = useState(false);

  useEffect(() => {
    // Fetch topics whenever the paper changes in practice mode
    if (mode === 'practice') {
      setTopicsLoading(true);
      fetchTopics(config.paper)
        .then(data => setTopics(data || []))
        .finally(() => setTopicsLoading(false));
    }
  }, [mode, config.paper]);

  const handleStart = () => {
    const testConfig = mode === 'mock'
      ? { mode: 'mock', paper: config.paper, topic: 'all', questionCount: 50, timeLimit: 60 * 60 }
      : { mode: 'practice', paper: config.paper, topic: config.topic, questionCount: config.questionCount, timeLimit: config.questionCount * 72 };
    onStartTest(testConfig);
  };

  const handleReset = () => {
    setMode('mock');
    setStep(1);
    setConfig({ paper: 'paper1', topic: 'all', questionCount: 10 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden">
        <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl"><Settings className="h-6 w-6 text-white" /></div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Customize Your Test</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Step {step} of 2: {step === 1 ? 'Choose Mode' : 'Configure Test'}</p>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" animate={{ width: `${(step / 2) * 100}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && <Step1_ModeSelection key="step1" mode={mode} setMode={setMode} />}
            {step === 2 && <Step2_Configuration key="step2" mode={mode} config={config} setConfig={setConfig} topics={topics} isTopicsLoading={isTopicsLoading} />}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            {step > 1 && <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium">Previous</button>}
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"><RotateCcw className="h-4 w-4" /> Reset</button>
          </div>
          {step < 2 ? (
            <motion.button onClick={() => setStep(2)} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg"><ChevronRight className="h-4 w-4" /> Next Step</motion.button>
          ) : (
            <motion.button onClick={handleStart} disabled={isLoading} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium rounded-xl shadow-lg disabled:opacity-50">{isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Play className="h-4 w-4" />} Start Test</motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const Step1_ModeSelection = ({ mode, setMode }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
    <div className="text-center mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select Your Test Mode</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">Choose between a realistic exam simulation or a flexible practice session.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ModeCard icon={FileText} title="Mock Test" description="Real exam simulation: 50 Qs, 60 mins." selected={mode === 'mock'} onClick={() => setMode('mock')} />
      <ModeCard icon={Edit} title="Practice Test" description="Custom session with topic & length choice." selected={mode === 'practice'} onClick={() => setMode('practice')} />
    </div>
  </motion.div>
);

const Step2_Configuration = ({ mode, config, setConfig, topics, isTopicsLoading }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
    {mode === 'mock' ? (
      <MockOptions config={config} setConfig={setConfig} />
    ) : (
      <PracticeOptions config={config} setConfig={setConfig} topics={topics} isTopicsLoading={isTopicsLoading} />
    )}
  </motion.div>
);

const MockOptions = ({ config, setConfig }) => (
  <div className="space-y-6">
    <div className="text-center mb-6"><h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select Your Paper</h3></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.values(PAPERS).map(p => <PaperCard key={p.id} paper={p} selected={config.paper === p.id} onClick={() => setConfig(prev => ({...prev, paper: p.id}))} />)}
    </div>
  </div>
);

const PracticeOptions = ({ config, setConfig, topics, isTopicsLoading }) => (
  <div className="space-y-6">
    <div className="text-center"><h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select Your Paper</h3></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.values(PAPERS).map(p => <PaperCard key={p.id} paper={p} selected={config.paper === p.id} onClick={() => setConfig(prev => ({...prev, paper: p.id, topic: 'all'}))} />)}
    </div>

    <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6 space-y-4">
      <label className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100"><Filter className="h-5 w-5" /> Choose Topic Focus</label>
      <div className="grid grid-cols-1 gap-3">
        <TopicButton label="All Topics" description={`Practice from all ${topics.length} available topics`} selected={config.topic === 'all'} onClick={() => setConfig(prev => ({ ...prev, topic: 'all' }))} />
        <ScrollArea className="max-h-48 space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/50">
          {isTopicsLoading ? <Loader2 className="mx-auto animate-spin" /> : topics.map(topic => <TopicButton key={topic} label={topic} selected={config.topic === topic} onClick={() => setConfig(prev => ({ ...prev, topic: topic }))} />)}
        </ScrollArea>
      </div>
    </div>
    
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6 space-y-4">
        <label className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100"><Hash className="h-5 w-5" /> Number of Questions: {config.questionCount}</label>
        <input type="range" min="5" max="50" step="5" value={config.questionCount} onChange={e => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider" />
        <div className="text-sm text-gray-600 dark:text-gray-400"><Clock className="inline h-4 w-4 mr-1" />Time Allotment: {Math.floor((config.questionCount * 72) / 60)} min { (config.questionCount * 72) % 60} sec</div>
    </div>
  </div>
);

const ModeCard = ({ icon: Icon, title, description, selected, onClick }) => (
    <motion.button onClick={onClick} whileHover={{ y: -5 }} className={`p-6 rounded-2xl text-left transition-all border-2 h-full relative ${selected ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-md' : 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
        <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-3" />
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        {selected && <CheckCircle2 className="h-5 w-5 text-indigo-500 absolute top-4 right-4" />}
    </motion.button>
);

const PaperCard = ({ paper, selected, onClick }) => (
    <motion.button onClick={onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`p-6 rounded-2xl text-center transition-all duration-300 border-2 relative h-full flex flex-col justify-center items-center ${selected ? 'border-indigo-300 dark:border-indigo-600 shadow-lg transform scale-[1.02]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'} ${paper.gradient}`}>
        <div className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-r ${paper.color} text-white text-2xl shadow-lg flex items-center justify-center`}>{paper.icon}</div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{paper.name}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">{paper.description}</p>
        {selected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2"><CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /></motion.div>}
    </motion.button>
);

const TopicButton = ({ label, description, selected, onClick }) => (
    <motion.button onClick={onClick} whileHover={{ scale: 1.01 }} className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center justify-between ${selected ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-md' : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600'}`}>
        <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{label}</div>
            {description && <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>}
        </div>
        {selected && <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
    </motion.button>
);

const Select = ({ id, label, children, ...props }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="font-medium text-gray-900 dark:text-gray-100">{label}</label>
        <select id={id} {...props} className="w-full p-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
    </div>
);
