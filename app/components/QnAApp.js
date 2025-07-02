// app/components/QnAApp.js - Complete Fixed Version
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Link from 'next/link';
import { 
  Brain, 
  BookOpen, 
  Clock, 
  Target, 
  Filter, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Zap,
  FileText,
  Settings,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export function QnAApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionType, setSolutionType] = useState('quick'); // 'quick' or 'detailed'
  const [showFilters, setShowFilters] = useState(false);
  const [particles, setParticles] = useState([]);
  
  // Filters
  const [filters, setFilters] = useState({
    papers: [],
    topics: [],
    difficulties: [],
    years: []
  });
  
  const [activeFilters, setActiveFilters] = useState({
    paper: 'all',
    topic: 'all',
    difficulty: 'all',
    year: 'all'
  });

  // Generate floating particles for background
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 40,
      duration: Math.random() * 25 + 20
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [activeFilters]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        limit: '50'
      });

      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== 'all') {
          params.append(key, value);
        }
      });

      const response = await fetch(`/api/qna?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Ensure we always have arrays
      setQuestions(Array.isArray(result.questions) ? result.questions : []);
      setFilters(result.filters || {});
      setCurrentQuestionIndex(0);
      setShowSolution(false);
      
    } catch (err) {
      console.error('Fetch questions error:', err);
      setQuestions([]);
      setFilters({});
    } finally {
      setIsLoading(false);
    }
  };

  const resetProgress = () => {
    setShowSolution(false);
    setSolutionType('quick');
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length && Array.isArray(questions)) {
      try {
        setCurrentQuestionIndex(index);
        setShowSolution(false);
        setSolutionType('quick');
      } catch (error) {
        console.error('Error navigating to question:', error);
        // Reset to first question if navigation fails
        setCurrentQuestionIndex(0);
        setShowSolution(false);
        setSolutionType('quick');
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Safety check for current question
  if (!currentQuestion && questions.length > 0) {
    setCurrentQuestionIndex(0);
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-3"
            />
            <p className="text-white text-sm">Loading questions...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-white/60 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No Questions Found</h2>
            <p className="text-white/70 mb-6">Try adjusting your filters or check back later.</p>
            <button
              onClick={() => setActiveFilters({
                paper: 'all',
                topic: 'all',
                difficulty: 'all',
                year: 'all'
              })}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-transparent px-2 sm:px-4">
        <div className="container mx-auto">
          <div className="flex h-12 sm:h-14 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-bold text-white">saduvbey</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/nce"
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white backdrop-blur-sm bg-white/10 rounded-lg border border-white/20"
              >
                NCE Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Animated background particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      <div className="relative z-10 pt-16 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Controls Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">NCE Practice Questions</h1>
                      <p className="text-white/70 text-sm">Short & Long Answer Questions</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetProgress}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Reset Progress"
                  >
                    <RotateCcw className="h-4 w-4 text-white/70" />
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-colors ${
                      showFilters ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
                    }`}
                    title="Filters"
                  >
                    <Filter className="h-4 w-4 text-white/70" />
                  </button>
                </div>
              </div>
              
              {/* Progress and Navigation */}
              <div className="flex items-center justify-between">
                <div className="text-white/70 text-sm">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      currentQuestionIndex === 0
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <button
                    onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      currentQuestionIndex === questions.length - 1
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <FiltersPanel
                filters={filters}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                onClose={() => setShowFilters(false)}
              />
            )}
          </AnimatePresence>

          {/* Main Content */}
          {currentQuestion && (
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              {/* Question Panel */}
              <QuestionPanel 
                question={currentQuestion}
                onShowSolution={() => setShowSolution(true)}
                showSolution={showSolution}
              />
              
              {/* Solution Panel */}
              <SolutionPanel
                question={currentQuestion}
                showSolution={showSolution}
                solutionType={solutionType}
                setSolutionType={setSolutionType}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Filters Panel Component
function FiltersPanel({ filters, activeFilters, setActiveFilters, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6"
    >
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-white/70" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Paper Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Paper</label>
            <select
              value={activeFilters.paper}
              onChange={(e) => setActiveFilters({...activeFilters, paper: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all" className="bg-gray-800">All Papers</option>
              {Array.isArray(filters.papers) && filters.papers.map(paper => (
                <option key={paper} value={paper} className="bg-gray-800">{paper}</option>
              ))}
            </select>
          </div>
          
          {/* Topic Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Topic</label>
            <select
              value={activeFilters.topic}
              onChange={(e) => setActiveFilters({...activeFilters, topic: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all" className="bg-gray-800">All Topics</option>
              {Array.isArray(filters.topics) && filters.topics.map(topic => (
                <option key={topic} value={topic} className="bg-gray-800">{topic}</option>
              ))}
            </select>
          </div>
          
          {/* Difficulty Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Difficulty</label>
            <select
              value={activeFilters.difficulty}
              onChange={(e) => setActiveFilters({...activeFilters, difficulty: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all" className="bg-gray-800">All Levels</option>
              {Array.isArray(filters.difficulties) && filters.difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty} className="bg-gray-800">{difficulty}</option>
              ))}
            </select>
          </div>
          
          {/* Year Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Year</label>
            <select
              value={activeFilters.year}
              onChange={(e) => setActiveFilters({...activeFilters, year: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all" className="bg-gray-800">All Years</option>
              {Array.isArray(filters.years) && filters.years.map(year => (
                <option key={year} value={year} className="bg-gray-800">{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Question Panel Component
function QuestionPanel({ question, onShowSolution, showSolution }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 flex flex-col overflow-hidden"
    >
      {/* Question Header */}
      <div className="border-b border-white/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">Question</h3>
        </div>
        
        {/* Question Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-4">
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {question.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {question.estimated_time}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
            {question.marks} marks
          </span>
          <span className="px-2 py-1 bg-blue-500/20 rounded-full text-blue-300">
            {question.topic}
          </span>
        </div>
        
        {question.title && (
          <h4 className="text-white font-semibold">{question.title}</h4>
        )}
      </div>

      {/* Question Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <QuestionContent questionData={question.question_data} />
        
        {/* Show Solution Button */}
        {!showSolution && (
          <motion.button
            onClick={onShowSolution}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Eye className="h-5 w-5" />
            View Solution
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Solution Panel Component
function SolutionPanel({ question, showSolution, solutionType, setSolutionType }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 flex flex-col overflow-hidden"
    >
      {/* Solution Header */}
      <div className="border-b border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Solution</h3>
          </div>
          
          {/* Solution Type Toggle */}
          {showSolution && (
            <div className="flex bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setSolutionType('quick')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  solutionType === 'quick'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Zap className="h-3 w-3" />
                Quick
              </button>
              <button
                onClick={() => setSolutionType('detailed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  solutionType === 'detailed'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <BookOpen className="h-3 w-3" />
                Detailed
              </button>
            </div>
          )}
        </div>

        {/* Solution Info */}
        {showSolution && question.solution_data?.[solutionType] && (
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {question.solution_data[solutionType].estimated_time}
            </span>
          </div>
        )}
      </div>

      {/* Solution Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showSolution ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center text-center p-6"
            >
              <div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <EyeOff className="h-10 w-10 text-white/40" />
                </div>
                <h4 className="text-white font-semibold mb-2">Solution Ready</h4>
                <p className="text-white/60 text-sm">Click "View Solution" to see the answer</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={solutionType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <SolutionContent 
                solutionData={question.solution_data?.[solutionType]} 
                type={solutionType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Question Content Renderer
function QuestionContent({ questionData }) {
  if (!questionData || typeof questionData !== 'object') {
    return (
      <div className="text-white/60 text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <p>Question content is not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Question Text */}
      {questionData.text && (
        <div className="text-white/90 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {questionData.text}
          </ReactMarkdown>
        </div>
      )}

      {/* Context */}
      {questionData.context && (
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/30">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-blue-300">Context</span>
          </div>
          <div className="text-white/80 text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {questionData.context}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Tables */}
      {Array.isArray(questionData.tables) && questionData.tables.map((table, index) => (
        <div key={table.id || index} className="space-y-3">
          {table.title && (
            <h4 className="text-white font-semibold">{table.title}</h4>
          )}
          <div className="overflow-x-auto">
            <table className="w-full bg-white/5 rounded-xl border border-white/20">
              <thead>
                <tr className="border-b border-white/20">
                  {Array.isArray(table.headers) && table.headers.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-white font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(table.rows) && table.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-white/10">
                    {Array.isArray(row) && row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-white">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Additional Info Boxes */}
      {Array.isArray(questionData.additional_info) && questionData.additional_info.map((info, index) => (
        <div key={index} className={`rounded-xl p-4 border ${
          info.type === 'warning' ? 'bg-yellow-500/10 border-yellow-400/30' :
          info.type === 'note' ? 'bg-green-500/10 border-green-400/30' :
          'bg-blue-500/10 border-blue-400/30'
        }`}>
          {info.title && (
            <div className="flex items-center gap-2 mb-2">
              <Info className={`h-4 w-4 ${
                info.type === 'warning' ? 'text-yellow-400' :
                info.type === 'note' ? 'text-green-400' :
                'text-blue-400'
              }`} />
              <span className={`font-semibold ${
                info.type === 'warning' ? 'text-yellow-300' :
                info.type === 'note' ? 'text-green-300' :
                'text-blue-300'
              }`}>{info.title}</span>
            </div>
          )}
          <div className="text-white/80 text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {info.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}

// Solution Content Renderer
function SolutionContent({ solutionData, type }) {
  if (!solutionData || typeof solutionData !== 'object') {
    return (
      <div className="text-white/60 text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <p>Solution content is not available</p>
      </div>
    );
  }

  if (type === 'quick') {
    return (
      <div className="space-y-6">
        {/* Answer */}
        {solutionData.answer && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-400/30">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="font-semibold text-green-300 text-lg">Answer</span>
            </div>
            <div className="text-white font-mono text-lg mb-2">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {solutionData.answer}
              </ReactMarkdown>
            </div>
            {solutionData.interpretation && (
              <p className="text-white/80 text-sm">{solutionData.interpretation}</p>
            )}
          </div>
        )}

        {/* Steps */}
        {Array.isArray(solutionData.steps) && solutionData.steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 rounded-xl p-5 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                {idx + 1}
              </div>
              <h4 className="font-semibold text-white">{step.title}</h4>
            </div>
            
            {step.content && (
              <div className="text-white/80 mb-4">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {step.content}
                </ReactMarkdown>
              </div>
            )}
            
            {step.formula && (
              <div className="bg-black/20 rounded-lg p-3 mb-4 border border-white/10">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {`$$${step.formula}$$`}
                </ReactMarkdown>
              </div>
            )}
            
            {step.calculation && (
              <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                <code className="text-green-300 font-mono">{step.calculation}</code>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  // Detailed solution
  return (
    <div className="space-y-6">
      {Array.isArray(solutionData.sections) && solutionData.sections.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/5 rounded-xl p-5 border border-white/20"
        >
          <h4 className="font-semibold text-white mb-4 text-lg flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {idx + 1}
            </div>
            {section.title}
          </h4>
          
          {section.content && (
            <div className="text-white/80 leading-relaxed mb-4">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {section.content}
              </ReactMarkdown>
            </div>
          )}
          
          {Array.isArray(section.key_points) && (
            <ul className="space-y-2 mb-4">
              {section.key_points.map((point, pointIdx) => (
                <li key={pointIdx} className="flex items-start gap-3 text-white/80">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}
      
      {solutionData.conclusion && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-5 border border-purple-400/30">
          <h4 className="font-semibold text-purple-300 mb-3">Conclusion</h4>
          <div className="text-white/80">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {solutionData.conclusion}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
