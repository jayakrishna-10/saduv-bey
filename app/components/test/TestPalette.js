// app/components/test/TestPalette.js - Question Navigation Palette
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Grid3x3, 
  Filter, 
  CheckCircle,
  Flag,
  Eye,
  Circle,
  Search,
  Target,
  BarChart3
} from 'lucide-react';

export function TestPalette({
  isOpen = false,
  onClose,
  questions = [],
  currentQuestionIndex = 0,
  submittedAnswers = new Map(),
  flaggedQuestions = new Set(),
  visitedQuestions = new Set(),
  onQuestionSelect
}) {
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'answered', 'unanswered', 'flagged', 'visited'
  const [searchTerm, setSearchTerm] = useState('');

  // Filter questions based on current filters
  const filteredQuestions = useMemo(() => {
    return questions.filter((question, index) => {
      const questionId = question.main_id || question.id;
      const isAnswered = submittedAnswers.has(questionId);
      const isFlagged = flaggedQuestions.has(questionId);
      const isVisited = visitedQuestions.has(index);
      
      // Apply status filters
      if (filterBy === 'answered' && !isAnswered) return false;
      if (filterBy === 'unanswered' && isAnswered) return false;
      if (filterBy === 'flagged' && !isFlagged) return false;
      if (filterBy === 'visited' && !isVisited) return false;
      
      // Apply search filter
      if (searchTerm && !question.question_text.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });
  }, [questions, filterBy, searchTerm, submittedAnswers, flaggedQuestions, visitedQuestions]);

  const getQuestionStatus = (question, index) => {
    const questionId = question.main_id || question.id;
    const isAnswered = submittedAnswers.has(questionId);
    const isFlagged = flaggedQuestions.has(questionId);
    const isVisited = visitedQuestions.has(index);
    const isCurrent = index === currentQuestionIndex;
    
    if (isCurrent) return 'current';
    if (isAnswered) return 'answered';
    if (isFlagged) return 'flagged';
    if (isVisited) return 'visited';
    return 'unvisited';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-orange-600 dark:bg-orange-500 text-white border-orange-500 shadow-lg ring-2 ring-orange-200 dark:ring-orange-900/50';
      case 'answered': return 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600';
      case 'flagged': return 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600';
      case 'visited': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status, isFlagged) => {
    if (isFlagged && status !== 'current') {
      return <Flag className="h-3 w-3 fill-current" />;
    }
    
    switch (status) {
      case 'current': return <Eye className="h-3 w-3" />;
      case 'answered': return <CheckCircle className="h-3 w-3" />;
      case 'visited': return <Circle className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleQuestionClick = (questionIndex) => {
    const originalIndex = questions.findIndex(q => q === filteredQuestions[questionIndex]);
    onQuestionSelect(originalIndex);
    onClose();
  };

  // Statistics
  const stats = useMemo(() => {
    const total = questions.length;
    const answered = submittedAnswers.size;
    const flagged = flaggedQuestions.size;
    const visited = visitedQuestions.size;
    const unanswered = total - answered;
    
    return { total, answered, flagged, visited, unanswered };
  }, [questions.length, submittedAnswers.size, flaggedQuestions.size, visitedQuestions.size]);

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
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <Grid3x3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Question Palette</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Navigate through all {questions.length} questions
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                  <Target className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.answered}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Answered</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-1">
                  <Flag className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.flagged}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Flagged</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                  <Eye className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.visited}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Visited</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                  <Circle className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.unanswered}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Questions</option>
                  <option value="answered">Answered</option>
                  <option value="unanswered">Unanswered</option>
                  <option value="flagged">Flagged</option>
                  <option value="visited">Visited</option>
                </select>
              </div>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="p-6 overflow-y-auto max-h-96">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <Circle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No questions match your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {filteredQuestions.map((question, index) => {
                  const originalIndex = questions.findIndex(q => q === question);
                  const status = getQuestionStatus(question, originalIndex);
                  const questionNumber = originalIndex + 1;
                  const questionId = question.main_id || question.id;
                  const isFlagged = flaggedQuestions.has(questionId);
                  
                  return (
                    <motion.button
                      key={questionId || index}
                      onClick={() => handleQuestionClick(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative p-3 rounded-xl border-2 transition-all duration-200 group
                        ${getStatusColor(status)}
                        hover:shadow-lg hover:shadow-current/20
                        ${status === 'current' ? 'transform scale-105' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {/* Question Number */}
                        <span className="text-sm font-semibold">
                          {questionNumber}
                        </span>
                        
                        {/* Status Icon */}
                        <div className="flex items-center justify-center h-4">
                          {getStatusIcon(status, isFlagged)}
                        </div>
                      </div>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-2 py-1 whitespace-nowrap max-w-48 truncate">
                          Q{questionNumber}: {question.question_text.substring(0, 50)}...
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                      </div>

                      {/* Flag indicator */}
                      {isFlagged && status !== 'current' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                          <Flag className="h-2 w-2 text-white fill-current" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Legend */}
          <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-600 rounded border flex items-center justify-center">
                  <Eye className="h-2 w-2 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-600 rounded flex items-center justify-center">
                  <CheckCircle className="h-2 w-2 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-600 rounded flex items-center justify-center">
                  <Flag className="h-2 w-2 text-amber-600 dark:text-amber-400 fill-current" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Flagged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600 rounded flex items-center justify-center">
                  <Circle className="h-2 w-2 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Unvisited</span>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-4 px-4 py-2 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Progress: {Math.round((stats.answered / stats.total) * 100)}%
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredQuestions.length} of {stats.total} shown
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
