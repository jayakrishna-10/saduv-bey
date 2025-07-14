// app/components/QnAApp.js - FIXED VERSION WITH ENHANCED LIST HANDLING
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
  Info,
  ChevronDown,
  ChevronRight,
  Loader2
} from 'lucide-react';

// Loading fallback for Mermaid diagrams
const MermaidFallback = ({ content }) => (
  <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-400/30">
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className="h-6 w-6 text-blue-400 animate-spin mx-auto mb-3" />
        <div className="text-blue-300 font-semibold text-sm">Loading diagram engine...</div>
        <div className="text-blue-200 text-xs mt-1">First time load may take a moment</div>
      </div>
    </div>
  </div>
);

export function QnAApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
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
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length && Array.isArray(questions)) {
      try {
        setCurrentQuestionIndex(index);
        setShowSolution(false);
      } catch (error) {
        console.error('Error navigating to question:', error);
        // Reset to first question if navigation fails
        setCurrentQuestionIndex(0);
        setShowSolution(false);
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
            <label className="block text-white/80 text-sm mb-2">NCE Year</label>
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
          {question.topic && (
            <span className="px-2 py-1 bg-blue-500/20 rounded-full text-blue-300">
              {question.topic}
            </span>
          )}
          {question.question_number && (
            <span className="px-2 py-1 bg-green-500/20 rounded-full text-green-300">
              Q{question.question_number}
            </span>
          )}
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

// Collapsible Section Component
function CollapsibleSection({ title, icon: Icon, children, defaultExpanded = false, bgColor = "bg-white/5", borderColor = "border-white/20", titleColor = "text-white" }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className={`h-5 w-5 ${titleColor.replace('text-', 'text-').replace('white', 'white/70')}`} />}
          <h4 className={`font-semibold text-lg ${titleColor}`}>{title}</h4>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className={`h-5 w-5 ${titleColor.replace('text-', 'text-').replace('white', 'white/70')}`} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-white/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Solution Panel Component
function SolutionPanel({ question, showSolution }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 flex flex-col overflow-hidden"
    >
      {/* Solution Header */}
      <div className="border-b border-white/20 p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">Solution</h3>
        </div>
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
              key="solution"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <SolutionContent 
                solutionData={question.solution_data}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Enhanced Content Block Renderer with Better Error Handling
function ContentBlock({ block, index }) {
  const [MermaidDiagram, setMermaidDiagram] = useState(null);
  const [isMermaidLoading, setIsMermaidLoading] = useState(false);

  useEffect(() => {
    if (block?.type === 'mermaid' && !MermaidDiagram && !isMermaidLoading) {
      setIsMermaidLoading(true);
      import('./MermaidDiagram')
        .then((module) => {
          setMermaidDiagram(() => module.default);
        })
        .catch((error) => {
          console.error('Failed to load MermaidDiagram:', error);
        })
        .finally(() => {
          setIsMermaidLoading(false);
        });
    }
  }, [block?.type, MermaidDiagram, isMermaidLoading]);

  // Enhanced validation - check for null, undefined, and malformed blocks
  if (!block) {
    console.warn('ContentBlock received null/undefined block at index:', index);
    return null;
  }

  if (typeof block !== 'object') {
    console.warn('ContentBlock received non-object block at index:', index, 'Block:', block);
    return (
      <div key={index} className="text-white/60 text-sm italic p-2 bg-red-500/10 rounded border border-red-400/20">
        ⚠️ Invalid content block (not an object): {String(block)}
      </div>
    );
  }

  if (!block.type) {
    console.warn('ContentBlock received block without type at index:', index, 'Block:', block);
    return (
      <div key={index} className="text-white/60 text-sm italic p-2 bg-yellow-500/10 rounded border border-yellow-400/20">
        ⚠️ Content block missing type property
      </div>
    );
  }

  try {
    switch (block.type) {
      case 'text':
        if (!block.content || typeof block.content !== 'string') {
          return (
            <div key={index} className="text-white/60 text-sm italic">
              ⚠️ Text block missing or invalid content
            </div>
          );
        }
        return (
          <div key={index} className="text-white/90 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {block.content}
            </ReactMarkdown>
          </div>
        );

      case 'table':
        if (!block.content || typeof block.content !== 'object') {
          return (
            <div key={index} className="text-white/60 text-sm italic">
              ⚠️ Table block missing or invalid content
            </div>
          );
        }
        
        const { headers = [], rows = [] } = block.content;
        
        if (!Array.isArray(headers) || !Array.isArray(rows)) {
          return (
            <div key={index} className="text-white/60 text-sm italic">
              ⚠️ Table headers or rows are not arrays
            </div>
          );
        }

        return (
          <div key={index} className="space-y-3">
            {block.caption && (
              <h4 className="text-white font-semibold text-center">{block.caption}</h4>
            )}
            <div className="overflow-x-auto">
              <table className="w-full bg-white/5 rounded-xl border border-white/20">
                {headers.length > 0 && (
                  <thead>
                    <tr className="border-b border-white/20">
                      {headers.map((header, idx) => (
                        <th key={idx} className="px-4 py-3 text-left text-white font-semibold">
                          {String(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-white/10">
                      {Array.isArray(row) ? row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-3 text-white">
                          {String(cell || '')}
                        </td>
                      )) : (
                        <td className="px-4 py-3 text-white">
                          {String(row)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'formula':
        if (!block.content) {
          return (
            <div key={index} className="text-white/60 text-sm italic">
              ⚠️ Formula block missing content
            </div>
          );
        }
        return (
          <div key={index} className="bg-black/20 rounded-lg p-4 border border-white/10">
            {block.format === 'latex' ? (
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {`$$${block.content}$$`}
              </ReactMarkdown>
            ) : (
              <code className="text-green-300 font-mono text-lg">{String(block.content)}</code>
            )}
          </div>
        );

      case 'list':
        // FIXED: Enhanced list handling to support multiple formats
        console.log('Processing list block:', block);
        
        // NEW FORMAT: Handle case where items and ordered are directly on the block
        if (block.items && Array.isArray(block.items)) {
          const items = block.items;
          const isOrdered = block.ordered || false;
          
          console.log('Using direct format - items:', items.length, 'ordered:', isOrdered);
          
          const ListComponent = isOrdered ? 'ol' : 'ul';
          return (
            <ListComponent key={index} className={`space-y-2 ${
              isOrdered ? 'list-decimal' : 'list-disc'
            } list-inside text-white/80`}>
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ children }) => <span>{children}</span>
                    }}
                  >
                    {String(item || '')}
                  </ReactMarkdown>
                </li>
              ))}
            </ListComponent>
          );
        }
        
        // LEGACY FORMAT: Handle nested content structure
        const listContent = block.content;
        
        if (!listContent) {
          console.warn('List block missing content:', block);
          return (
            <div key={index} className="text-white/60 text-sm italic">
              ⚠️ List block missing content
            </div>
          );
        }

        // Handle case where content is directly an array (legacy format)
        if (Array.isArray(listContent)) {
          return (
            <ul key={index} className="space-y-2 list-disc list-inside text-white/80">
              {listContent.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ children }) => <span>{children}</span>
                    }}
                  >
                    {String(item || '')}
                  </ReactMarkdown>
                </li>
              ))}
            </ul>
          );
        }

        // Handle object with items property (nested format)
        if (typeof listContent === 'object') {
          const items = listContent.items || listContent.list || [];
          
          if (!Array.isArray(items)) {
            console.warn('List items is not an array:', listContent);
            return (
              <div key={index} className="text-white/60 text-sm italic">
                ⚠️ List items is not an array
              </div>
            );
          }

          const ListComponent = listContent.type === 'ordered' || listContent.ordered ? 'ol' : 'ul';
          return (
            <ListComponent key={index} className={`space-y-2 ${
              listContent.type === 'ordered' || listContent.ordered ? 'list-decimal' : 'list-disc'
            } list-inside text-white/80`}>
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ children }) => <span>{children}</span>
                    }}
                  >
                    {String(item || '')}
                  </ReactMarkdown>
                </li>
              ))}
            </ListComponent>
          );
        }

        // Fallback for other formats
        console.warn('Unexpected list content format:', listContent);
        return (
          <div key={index} className="text-white/60 text-sm italic">
            ⚠️ Unexpected list format
          </div>
        );

      case 'mermaid':
        if (!block.content) {
          return (
            <div key={index} className="text-white/60 text-sm italic">
              ⚠️ Mermaid block missing content
            </div>
          );
        }
        return (
          <div key={index} className="space-y-3">
            {MermaidDiagram ? (
              <MermaidDiagram 
                content={block.content} 
                caption={block.caption}
                id={`diagram-${index}`}
              />
            ) : (
              <MermaidFallback content={block.content} />
            )}
          </div>
        );

      default:
        return (
          <div key={index} className="text-white/60 text-sm italic p-2 bg-orange-500/10 rounded border border-orange-400/20">
            ⚠️ Unsupported content type: {String(block.type)}
          </div>
        );
    }
  } catch (error) {
    console.error('Error rendering ContentBlock:', error, 'Block:', block);
    return (
      <div key={index} className="text-white/60 text-sm italic p-2 bg-red-500/10 rounded border border-red-400/20">
        ⚠️ Error rendering content block: {error.message}
      </div>
    );
  }
}

// Enhanced Question Content Renderer
function QuestionContent({ questionData }) {
  if (!questionData) {
    return (
      <div className="text-white/60 text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <p>Question content is not available</p>
      </div>
    );
  }

  try {
    // Handle legacy format (fallback)
    if (typeof questionData === 'string') {
      return (
        <div className="text-white/90 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {questionData}
          </ReactMarkdown>
        </div>
      );
    }

    if (typeof questionData !== 'object') {
      return (
        <div className="text-white/60 text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
          <p>Invalid question data format</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Main Content Blocks */}
        {Array.isArray(questionData.content) && questionData.content.length > 0 && (
          <div className="space-y-4">
            {questionData.content.map((block, index) => (
              <ContentBlock key={`content-${index}`} block={block} index={`content-${index}`} />
            ))}
          </div>
        )}

        {/* Sub-questions */}
        {Array.isArray(questionData.sub_questions) && questionData.sub_questions.length > 0 && (
          <div className="space-y-4">
            {questionData.sub_questions.map((subQ, index) => {
              if (!subQ || typeof subQ !== 'object') {
                return (
                  <div key={`sub-${index}`} className="text-white/60 text-sm italic">
                    ⚠️ Invalid sub-question at index {index}
                  </div>
                );
              }

              return (
                <div key={`sub-${index}`} className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {subQ.part || String.fromCharCode(97 + index)}
                    </div>
                    <span className="font-semibold text-white">Part {(subQ.part || String.fromCharCode(97 + index)).toUpperCase()}</span>
                    {subQ.marks && (
                      <span className="text-white/60 text-sm">({subQ.marks} marks)</span>
                    )}
                  </div>
                  <div className="space-y-4">
                    {Array.isArray(subQ.content) && subQ.content.map((block, blockIdx) => (
                      <ContentBlock key={`sub-${index}-${blockIdx}`} block={block} index={`sub-${index}-${blockIdx}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legacy support for old format */}
        {questionData.text && !questionData.content && (
          <div className="text-white/90 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {questionData.text}
            </ReactMarkdown>
          </div>
        )}

        {/* Legacy parts support */}
        {Array.isArray(questionData.parts) && !questionData.sub_questions && questionData.parts.map((part, index) => (
          <div key={`legacy-${index}`} className="bg-white/5 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                {String.fromCharCode(97 + index)}
              </div>
              <span className="font-semibold text-white">Part {String.fromCharCode(97 + index).toUpperCase()}</span>
            </div>
            <div className="text-white/80">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {String(part || '')}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Show message if no content available */}
        {!questionData.content && !questionData.sub_questions && !questionData.text && !questionData.parts && (
          <div className="text-white/60 text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
            <p>No question content available</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering QuestionContent:', error);
    return (
      <div className="text-white/60 text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <p>Error loading question content: {error.message}</p>
      </div>
    );
  }
}

// Enhanced Solution Content Renderer with Robust Error Handling
function SolutionContent({ solutionData }) {
  if (!solutionData) {
    return (
      <div className="text-white/60 text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <p>Solution content is not available</p>
      </div>
    );
  }

  try {
    // Handle the legacy schema where explanation might be a string
    if (typeof solutionData === 'string') {
      return (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-400/30">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span className="font-semibold text-green-300 text-lg">Solution</span>
          </div>
          <div className="text-white/90 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {solutionData}
            </ReactMarkdown>
          </div>
        </div>
      );
    }

    if (typeof solutionData !== 'object') {
      return (
        <div className="text-white/60 text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
          <p>Invalid solution data format</p>
        </div>
      );
    }

    // Handle new comprehensive explanation structure
    const explanation = solutionData.explanation || solutionData;

    if (!explanation || typeof explanation !== 'object') {
      return (
        <div className="text-white/60 text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
          <p>No explanation data found</p>
        </div>
      );
    }

    // For legacy format, show simple version
    if (!explanation.step_by_step_solution && !explanation.final_answer && (explanation.quick || explanation.detailed)) {
      return (
        <div className="space-y-6">
          {/* Quick Answer (if available) */}
          {explanation.quick?.answer && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-400/30">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="font-semibold text-green-300 text-lg">Answer</span>
              </div>
              <div className="text-white font-mono text-lg">
                {explanation.quick.answer}
              </div>
            </div>
          )}
          
          {/* Quick Steps (if available) */}
          {Array.isArray(explanation.quick?.steps) && explanation.quick.steps.map((step, idx) => {
            if (!step || typeof step !== 'object') return null;
            return (
              <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/20">
                <h4 className="font-semibold text-white mb-4">{step.title || `Step ${idx + 1}`}</h4>
                <div className="text-white/80">{step.content || ''}</div>
              </div>
            );
          })}
          
          {/* Detailed explanation (if available and no quick format) */}
          {!explanation.quick && explanation.detailed && (
            <div className="bg-white/5 rounded-xl p-5 border border-white/20">
              <h4 className="font-semibold text-white mb-4 text-lg">Detailed Explanation</h4>
              <div className="text-white/80 leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {typeof explanation.detailed === 'string' ? explanation.detailed : explanation.detailed.content || ''}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      );
    }

    // New comprehensive format - always show all sections
    return (
      <div className="space-y-6">
        {/* Final Answer - Always expanded */}
        {explanation.final_answer && typeof explanation.final_answer === 'object' && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-400/30">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="font-semibold text-green-300 text-lg">Final Answer</span>
            </div>
            <div className="space-y-4">
              {Array.isArray(explanation.final_answer.content) && explanation.final_answer.content.map((block, idx) => (
                <ContentBlock key={`final-${idx}`} block={block} index={`final-${idx}`} />
              ))}
            </div>
          </div>
        )}

        {/* Step by Step Solution - Always expanded */}
        {Array.isArray(explanation.step_by_step_solution) && explanation.step_by_step_solution.length > 0 && (
          <div className="bg-white/5 rounded-xl border border-white/20">
            <div className="p-5 flex items-center gap-3 border-b border-white/10">
              <Brain className="h-5 w-5 text-white/70" />
              <h4 className="font-semibold text-white text-lg">Step-by-Step Solution</h4>
            </div>
            <div className="p-5 space-y-4">
              {explanation.step_by_step_solution.map((step, idx) => {
                if (!step || typeof step !== 'object') {
                  return (
                    <div key={idx} className="text-white/60 text-sm italic">
                      ⚠️ Invalid step at index {idx}
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {step.step || idx + 1}
                      </div>
                      <h5 className="font-semibold text-white">{step.title || `Step ${idx + 1}`}</h5>
                    </div>
                    
                    <div className="space-y-4">
                      {Array.isArray(step.content) && step.content.map((block, blockIdx) => (
                        <ContentBlock key={`step-${idx}-${blockIdx}`} block={block} index={`step-${idx}-${blockIdx}`} />
                      ))}
                    </div>
                    
                    {step.result && (
                      <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-400/30">
                        <span className="text-green-300 font-semibold">Result: </span>
                        <span className="text-white">{step.result}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Solving Approach - Collapsible */}
        {explanation.solving_approach && typeof explanation.solving_approach === 'object' && (
          <CollapsibleSection
            title={explanation.solving_approach.title || "Solving Approach"}
            icon={Target}
            bgColor="bg-blue-500/10"
            borderColor="border-blue-400/30"
            titleColor="text-blue-300"
          >
            <div className="space-y-4">
              {Array.isArray(explanation.solving_approach.content) && explanation.solving_approach.content.map((block, idx) => (
                <ContentBlock key={`approach-${idx}`} block={block} index={`approach-${idx}`} />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Prerequisite Knowledge - Collapsible */}
        {Array.isArray(explanation.prerequisite_knowledge) && explanation.prerequisite_knowledge.length > 0 && (
          <CollapsibleSection
            title="Prerequisite Knowledge"
            icon={BookOpen}
            bgColor="bg-purple-500/10"
            borderColor="border-purple-400/30"
            titleColor="text-purple-300"
          >
            <ul className="space-y-2">
              {explanation.prerequisite_knowledge.map((knowledge, idx) => (
                <li key={idx} className="flex items-center gap-2 text-white/80">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  {String(knowledge || '')}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        {/* Verification Check - Collapsible */}
        {explanation.verification_check && typeof explanation.verification_check === 'object' && (
          <CollapsibleSection
            title="Verification Check"
            icon={CheckCircle}
            bgColor="bg-yellow-500/10"
            borderColor="border-yellow-400/30"
            titleColor="text-yellow-300"
          >
            <div className="mb-3">
              <span className="text-yellow-200 font-medium">Method: </span>
              <span className="text-white/80">{explanation.verification_check.method || 'Not specified'}</span>
            </div>
            <div className="space-y-4">
              {Array.isArray(explanation.verification_check.content) && explanation.verification_check.content.map((block, idx) => (
                <ContentBlock key={`verification-${idx}`} block={block} index={`verification-${idx}`} />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Formulas Used - Collapsible */}
        {Array.isArray(explanation.formulas_used) && explanation.formulas_used.length > 0 && (
          <CollapsibleSection
            title="Formulas Used"
            icon={Brain}
            bgColor="bg-indigo-500/10"
            borderColor="border-indigo-400/30"
            titleColor="text-indigo-300"
          >
            <div className="space-y-4">
              {explanation.formulas_used.map((formula, idx) => {
                if (!formula || typeof formula !== 'object') return null;
                return (
                  <div key={idx} className="bg-black/20 rounded-lg p-4 border border-indigo-400/20">
                    <div className="mb-3">
                      <code className="text-indigo-300 font-mono text-lg">{formula.formula || 'Formula not provided'}</code>
                    </div>
                    {formula.terms && typeof formula.terms === 'object' && (
                      <div className="mb-3">
                        <h5 className="text-indigo-200 font-medium mb-2">Where:</h5>
                        <ul className="space-y-1">
                          {Object.entries(formula.terms).map(([term, definition]) => (
                            <li key={term} className="text-white/80 text-sm">
                              <span className="font-mono text-indigo-300">{term}</span> = {String(definition)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {formula.application && (
                      <p className="text-white/70 text-sm italic">{formula.application}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>
        )}

        {/* Important Concepts - Collapsible */}
        {Array.isArray(explanation.important_concepts) && explanation.important_concepts.length > 0 && (
          <CollapsibleSection
            title="Important Concepts"
            icon={Info}
            bgColor="bg-cyan-500/10"
            borderColor="border-cyan-400/30"
            titleColor="text-cyan-300"
          >
            <div className="space-y-3">
              {explanation.important_concepts.map((concept, idx) => {
                if (!concept || typeof concept !== 'object') return null;
                return (
                  <div key={idx} className="bg-cyan-500/5 rounded-lg p-3">
                    <h5 className="font-medium text-cyan-200 mb-2">{concept.concept || `Concept ${idx + 1}`}</h5>
                    <p className="text-white/80 text-sm">{concept.overview || 'No overview available'}</p>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>
        )}

        {/* Tips and Tricks - Collapsible */}
        {Array.isArray(explanation.tips_and_tricks) && explanation.tips_and_tricks.length > 0 && (
          <CollapsibleSection
            title="Tips & Tricks"
            icon={Zap}
            bgColor="bg-green-500/10"
            borderColor="border-green-400/30"
            titleColor="text-green-300"
          >
            <div className="space-y-3">
              {explanation.tips_and_tricks.map((tip, idx) => {
                if (!tip || typeof tip !== 'object') return null;
                return (
                  <div key={idx} className="bg-green-500/5 rounded-lg p-3">
                    <h5 className="font-medium text-green-200 mb-2">💡 {tip.tip || `Tip ${idx + 1}`}</h5>
                    <p className="text-white/80 text-sm">{tip.reason || 'No reason provided'}</p>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>
        )}

        {/* Common Mistakes - Collapsible */}
        {Array.isArray(explanation.common_mistakes) && explanation.common_mistakes.length > 0 && (
          <CollapsibleSection
            title="Common Mistakes"
            icon={AlertCircle}
            bgColor="bg-red-500/10"
            borderColor="border-red-400/30"
            titleColor="text-red-300"
          >
            <div className="space-y-3">
              {explanation.common_mistakes.map((mistake, idx) => {
                if (!mistake || typeof mistake !== 'object') return null;
                return (
                  <div key={idx} className="bg-red-500/5 rounded-lg p-3">
                    <h5 className="font-medium text-red-200 mb-2">❌ {mistake.mistake || `Mistake ${idx + 1}`}</h5>
                    <p className="text-white/80 text-sm">✅ {mistake.correction || 'No correction provided'}</p>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>
        )}

        {/* Exam Strategy - Collapsible */}
        {explanation.exam_strategy && typeof explanation.exam_strategy === 'object' && (
          <CollapsibleSection
            title="Exam Strategy"
            icon={Target}
            bgColor="bg-orange-500/10"
            borderColor="border-orange-400/30"
            titleColor="text-orange-300"
          >
            <div className="space-y-4">
              {explanation.exam_strategy.time_allocation && (
                <div>
                  <span className="text-orange-200 font-medium">Time Allocation: </span>
                  <span className="text-white/80">{explanation.exam_strategy.time_allocation}</span>
                </div>
              )}
              {explanation.exam_strategy.marks_distribution && typeof explanation.exam_strategy.marks_distribution === 'object' && (
                <div>
                  <h5 className="text-orange-200 font-medium mb-2">Marks Distribution:</h5>
                  <ul className="space-y-1">
                    {Object.entries(explanation.exam_strategy.marks_distribution).map(([component, marks]) => (
                      <li key={component} className="text-white/80 text-sm">
                        • {component}: {String(marks)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(explanation.exam_strategy.key_points) && (
                <div>
                  <h5 className="text-orange-200 font-medium mb-2">Key Points for Exam:</h5>
                  <ul className="space-y-1">
                    {explanation.exam_strategy.key_points.map((point, idx) => (
                      <li key={idx} className="text-white/80 text-sm">• {String(point)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering SolutionContent:', error);
    return (
      <div className="text-white/60 text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <p>Error loading solution content: {error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg border border-red-400/30 hover:bg-red-500/30 transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }
}
