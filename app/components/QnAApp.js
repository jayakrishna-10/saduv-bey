// app/components/QnAApp.js - Updated for new schema
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

// Solution Panel Component
function SolutionPanel({ question, showSolution, solutionType, setSolutionType }) {
  const hasQuickSolution = question.solution_data?.quick || question.solution_data?.answer;
  const hasDetailedSolution = question.solution_data?.detailed || question.solution_data?.explanation;

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
          {showSolution && (hasQuickSolution || hasDetailedSolution) && (
            <div className="flex bg-white/10 rounded-xl p-1">
              {hasQuickSolution && (
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
              )}
              {hasDetailedSolution && (
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
              )}
            </div>
          )}
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
              key={solutionType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <SolutionContent 
                solutionData={question.solution_data} 
                type={solutionType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Content Block Renderer
function ContentBlock({ block, index }) {
  if (!block || !block.type) {
    return null;
  }

  switch (block.type) {
    case 'text':
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
      return (
        <div key={index} className="space-y-3">
          {block.caption && (
            <h4 className="text-white font-semibold text-center">{block.caption}</h4>
          )}
          <div className="overflow-x-auto">
            <table className="w-full bg-white/5 rounded-xl border border-white/20">
              <thead>
                <tr className="border-b border-white/20">
                  {Array.isArray(block.content.headers) && block.content.headers.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-white font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(block.content.rows) && block.content.rows.map((row, rowIdx) => (
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
      );

    case 'formula':
      return (
        <div key={index} className="bg-black/20 rounded-lg p-4 border border-white/10">
          {block.format === 'latex' ? (
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {`$${block.content}$`}
            </ReactMarkdown>
          ) : (
            <code className="text-green-300 font-mono text-lg">{block.content}</code>
          )}
        </div>
      );

    case 'list':
      const ListComponent = block.content.type === 'ordered' ? 'ol' : 'ul';
      return (
        <ListComponent key={index} className={`space-y-2 ${
          block.content.type === 'ordered' ? 'list-decimal' : 'list-disc'
        } list-inside text-white/80`}>
          {Array.isArray(block.content.items) && block.content.items.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <span>{children}</span>
                }}
              >
                {item}
              </ReactMarkdown>
            </li>
          ))}
        </ListComponent>
      );

    case 'mermaid':
      return (
        <div key={index} className="space-y-3">
          <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-400/30">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 font-semibold text-sm">Mermaid Diagram</span>
            </div>
            <div className="bg-white rounded-lg p-4">
              <pre className="text-gray-800 text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{block.content}</code>
              </pre>
            </div>
            <p className="text-blue-200 text-xs mt-2">
              Note: Mermaid diagrams show as code. In a full implementation, this would render as an interactive diagram.
            </p>
          </div>
          {block.caption && (
            <p className="text-white/70 text-sm text-center italic">{block.caption}</p>
          )}
        </div>
      );

    default:
      return (
        <div key={index} className="text-white/60 text-sm italic">
          Unsupported content type: {block.type}
        </div>
      );
  }
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

  return (
    <div className="space-y-6">
      {/* Main Content Blocks */}
      {Array.isArray(questionData.content) && questionData.content.map((block, index) => (
        <ContentBlock key={index} block={block} index={index} />
      ))}

      {/* Sub-questions */}
      {Array.isArray(questionData.sub_questions) && questionData.sub_questions.map((subQ, index) => (
        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {subQ.part}
            </div>
            <span className="font-semibold text-white">Part {subQ.part.toUpperCase()}</span>
            <span className="text-white/60 text-sm">({subQ.marks} marks)</span>
          </div>
          <div className="space-y-4">
            {Array.isArray(subQ.content) && subQ.content.map((block, blockIdx) => (
              <ContentBlock key={blockIdx} block={block} index={blockIdx} />
            ))}
          </div>
        </div>
      ))}

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
        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/20">
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
              {part}
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

  // Handle new comprehensive explanation structure
  const explanation = solutionData.explanation || solutionData;

  if (type === 'quick') {
    return (
      <div className="space-y-6">
        {/* Final Answer */}
        {explanation.final_answer && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-400/30">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="font-semibold text-green-300 text-lg">Final Answer</span>
            </div>
            <div className="space-y-4">
              {Array.isArray(explanation.final_answer.content) && explanation.final_answer.content.map((block, idx) => (
                <ContentBlock key={idx} block={block} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Step by Step Solution */}
        {Array.isArray(explanation.step_by_step_solution) && explanation.step_by_step_solution.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 rounded-xl p-5 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                {step.step}
              </div>
              <h4 className="font-semibold text-white">{step.title}</h4>
            </div>
            
            <div className="space-y-4">
              {Array.isArray(step.content) && step.content.map((block, blockIdx) => (
                <ContentBlock key={blockIdx} block={block} index={blockIdx} />
              ))}
            </div>
            
            {step.result && (
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-400/30">
                <span className="text-green-300 font-semibold">Result: </span>
                <span className="text-white">{step.result}</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Legacy support for old quick format */}
        {!explanation.step_by_step_solution && explanation.quick && (
          <>
            {explanation.quick.answer && (
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
            {Array.isArray(explanation.quick.steps) && explanation.quick.steps.map((step, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/20">
                <h4 className="font-semibold text-white mb-4">{step.title}</h4>
                <div className="text-white/80">{step.content}</div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  // Detailed solution with comprehensive sections
  return (
    <div className="space-y-6">
      {/* Solving Approach */}
      {explanation.solving_approach && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 rounded-xl p-5 border border-blue-400/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-5 w-5 text-blue-400" />
            <h4 className="font-semibold text-blue-300 text-lg">{explanation.solving_approach.title}</h4>
          </div>
          <div className="space-y-4">
            {Array.isArray(explanation.solving_approach.content) && explanation.solving_approach.content.map((block, idx) => (
              <ContentBlock key={idx} block={block} index={idx} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Prerequisite Knowledge */}
      {Array.isArray(explanation.prerequisite_knowledge) && explanation.prerequisite_knowledge.length > 0 && (
        <div className="bg-purple-500/10 rounded-xl p-5 border border-purple-400/30">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-5 w-5 text-purple-400" />
            <h4 className="font-semibold text-purple-300 text-lg">Prerequisite Knowledge</h4>
          </div>
          <ul className="space-y-2">
            {explanation.prerequisite_knowledge.map((knowledge, idx) => (
              <li key={idx} className="flex items-center gap-2 text-white/80">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                {knowledge}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step by Step Solution */}
      {Array.isArray(explanation.step_by_step_solution) && explanation.step_by_step_solution.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/5 rounded-xl p-5 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              {step.step}
            </div>
            <h4 className="font-semibold text-white text-lg">{step.title}</h4>
          </div>
          
          <div className="space-y-4">
            {Array.isArray(step.content) && step.content.map((block, blockIdx) => (
              <ContentBlock key={blockIdx} block={block} index={blockIdx} />
            ))}
          </div>
          
          {step.result && (
            <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-400/30">
              <span className="text-green-300 font-semibold">Result: </span>
              <span className="text-white">{step.result}</span>
            </div>
          )}
        </motion.div>
      ))}

      {/* Final Answer */}
      {explanation.final_answer && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-400/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span className="font-semibold text-green-300 text-lg">Final Answer</span>
          </div>
          <div className="space-y-4">
            {Array.isArray(explanation.final_answer.content) && explanation.final_answer.content.map((block, idx) => (
              <ContentBlock key={idx} block={block} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Verification Check */}
      {explanation.verification_check && (
        <div className="bg-yellow-500/10 rounded-xl p-5 border border-yellow-400/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-yellow-400" />
            <h4 className="font-semibold text-yellow-300 text-lg">Verification</h4>
          </div>
          <div className="mb-3">
            <span className="text-yellow-200 font-medium">Method: </span>
            <span className="text-white/80">{explanation.verification_check.method}</span>
          </div>
          <div className="space-y-4">
            {Array.isArray(explanation.verification_check.content) && explanation.verification_check.content.map((block, idx) => (
              <ContentBlock key={idx} block={block} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Formulas Used */}
      {Array.isArray(explanation.formulas_used) && explanation.formulas_used.length > 0 && (
        <div className="bg-indigo-500/10 rounded-xl p-5 border border-indigo-400/30">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-5 w-5 text-indigo-400" />
            <h4 className="font-semibold text-indigo-300 text-lg">Formulas Used</h4>
          </div>
          <div className="space-y-4">
            {explanation.formulas_used.map((formula, idx) => (
              <div key={idx} className="bg-black/20 rounded-lg p-4 border border-indigo-400/20">
                <div className="mb-3">
                  <code className="text-indigo-300 font-mono text-lg">{formula.formula}</code>
                </div>
                {formula.terms && (
                  <div className="mb-3">
                    <h5 className="text-indigo-200 font-medium mb-2">Where:</h5>
                    <ul className="space-y-1">
                      {Object.entries(formula.terms).map(([term, definition]) => (
                        <li key={term} className="text-white/80 text-sm">
                          <span className="font-mono text-indigo-300">{term}</span> = {definition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {formula.application && (
                  <p className="text-white/70 text-sm italic">{formula.application}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Concepts */}
      {Array.isArray(explanation.important_concepts) && explanation.important_concepts.length > 0 && (
        <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/30">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-5 w-5 text-cyan-400" />
            <h4 className="font-semibold text-cyan-300 text-lg">Important Concepts</h4>
          </div>
          <div className="space-y-3">
            {explanation.important_concepts.map((concept, idx) => (
              <div key={idx} className="bg-cyan-500/5 rounded-lg p-3">
                <h5 className="font-medium text-cyan-200 mb-2">{concept.concept}</h5>
                <p className="text-white/80 text-sm">{concept.overview}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips and Tricks */}
      {Array.isArray(explanation.tips_and_tricks) && explanation.tips_and_tricks.length > 0 && (
        <div className="bg-green-500/10 rounded-xl p-5 border border-green-400/30">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-green-400" />
            <h4 className="font-semibold text-green-300 text-lg">Tips & Tricks</h4>
          </div>
          <div className="space-y-3">
            {explanation.tips_and_tricks.map((tip, idx) => (
              <div key={idx} className="bg-green-500/5 rounded-lg p-3">
                <h5 className="font-medium text-green-200 mb-2">💡 {tip.tip}</h5>
                <p className="text-white/80 text-sm">{tip.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Mistakes */}
      {Array.isArray(explanation.common_mistakes) && explanation.common_mistakes.length > 0 && (
        <div className="bg-red-500/10 rounded-xl p-5 border border-red-400/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h4 className="font-semibold text-red-300 text-lg">Common Mistakes</h4>
          </div>
          <div className="space-y-3">
            {explanation.common_mistakes.map((mistake, idx) => (
              <div key={idx} className="bg-red-500/5 rounded-lg p-3">
                <h5 className="font-medium text-red-200 mb-2">❌ {mistake.mistake}</h5>
                <p className="text-white/80 text-sm">✅ {mistake.correction}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Strategy */}
      {explanation.exam_strategy && (
        <div className="bg-orange-500/10 rounded-xl p-5 border border-orange-400/30">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-5 w-5 text-orange-400" />
            <h4 className="font-semibold text-orange-300 text-lg">Exam Strategy</h4>
          </div>
          <div className="space-y-4">
            {explanation.exam_strategy.time_allocation && (
              <div>
                <span className="text-orange-200 font-medium">Time Allocation: </span>
                <span className="text-white/80">{explanation.exam_strategy.time_allocation}</span>
              </div>
            )}
            {explanation.exam_strategy.marks_distribution && (
              <div>
                <h5 className="text-orange-200 font-medium mb-2">Marks Distribution:</h5>
                <ul className="space-y-1">
                  {Object.entries(explanation.exam_strategy.marks_distribution).map(([component, marks]) => (
                    <li key={component} className="text-white/80 text-sm">
                      • {component}: {marks}
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
                    <li key={idx} className="text-white/80 text-sm">• {point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legacy support for old detailed format */}
      {!explanation.step_by_step_solution && explanation.detailed && (
        <div className="bg-white/5 rounded-xl p-5 border border-white/20">
          <h4 className="font-semibold text-white mb-4 text-lg">Detailed Explanation</h4>
          <div className="text-white/80 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {explanation.detailed}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
