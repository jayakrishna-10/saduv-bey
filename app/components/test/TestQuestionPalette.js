// app/components/test/TestQuestionPalette.js
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Grid3x3, 
  Target, 
  Flag, 
  CheckCircle,
  AlertCircle,
  Eye,
  Filter,
  Search,
  BarChart3
} from 'lucide-react';
import { getQuestionStatus, getStatusColor, getStatusIcon, calculateProgress } from '@/lib/test-utils';

export function TestQuestionPalette({
  isOpen = false,
  onClose,
  questions = [],
  currentQuestionIndex = 0,
  answeredQuestions = new Set(),
  flaggedQuestions = new Set(),
  onQuestionSelect
}) {
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'answered', 'unanswered', 'flagged'
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate progress statistics
  const progress = useMemo(() => {
    return calculateProgress(answeredQuestions, flaggedQuestions, questions.length);
  }, [answeredQuestions, flaggedQuestions, questions.length]);

  // Filter questions based on current filters
  const filteredQuestions = useMemo(() => {
    return questions.map((question, index) => ({
      question,
      index,
      status: getQuestionStatus(index, currentQuestionIndex, answeredQuestions, flaggedQuestions)
    })).filter(item => {
      // Apply status filter
      switch (filterBy) {
        case 'answered':
          return answeredQuestions.has(item.index);
        case 'unanswered':
          return !answeredQuestions.has(item.index) && item.index !== currentQuestionIndex;
        case 'flagged':
          return flaggedQuestions.has(item.index);
        case 'current':
          return item.index === currentQuestionIndex;
        default:
          return true;
      }
    }).filter(item => {
      // Apply search filter
      if (searchTerm && !item.question.question_text.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [questions, currentQuestionIndex, answeredQuestions, flaggedQuestions, filterBy, searchTerm]);

  const handleQuestionClick = (questionIndex) => {
    onQuestionSelect(questionIndex);
    onClose();
  };

  const getFilterCount = (filter) => {
    switch (filter) {
      case 'answered':
        return answeredQuestions.size;
      case 'unanswered':
        return questions.length - answeredQuestions.size - 1; // -1 for current question
      case 'flagged':
        return flaggedQuestions.size;
      case 'current':
        return 1;
      default:
        return questions.length;
    }
  };

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
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <Grid3x3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Question Navigator</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {filteredQuestions.length} of {questions.length} questions
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 mb-1">
                  <Target className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {progress.answered}/{progress.total}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Answered</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-1">
                  <Flag className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {progress.flagged}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Flagged</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {progress.unanswered}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {progress.progress}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span>Test Progress</span>
                <span>{progress.answered} answered</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
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
                    className="w-full pl-10 pr-4 py-2 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'All', icon: Grid3x3 },
                  { id: 'current', label: 'Current', icon: Eye },
                  { id: 'answered', label: 'Answered', icon: CheckCircle },
                  { id: 'unanswered', label: 'Pending', icon: AlertCircle },
                  { id: 'flagged', label: 'Flagged', icon: Flag }
                ].map(filter => (
                  <motion.button
                    key={filter.id}
                    onClick={() => setFilterBy(filter.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                      filterBy === filter.id
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <filter.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{filter.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      filterBy === filter.id
                        ? 'bg-white/20'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {getFilterCount(filter.id)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="p-6 overflow-y-auto max-h-96">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No questions match your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                {filteredQuestions.map(({ question, index, status }) => {
                  const questionNumber = index + 1;
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleQuestionClick(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index % 20) * 0.02 }}
                      className={`
                        relative p-3 rounded-xl border-2 transition-all duration-200 group aspect-square
                        ${getStatusColor(status)}
                        hover:shadow-lg hover:shadow-current/20 hover:z-10
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-xs">
                            {getStatusIcon(status)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">
                          {questionNumber}
                        </span>
                      </div>
                      
                      {/* Additional Status Indicators */}
                      <div className="absolute top-1 right-1 flex gap-1">
                        {answeredQuestions.has(index) && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                        {flaggedQuestions.has(index) && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        )}
                      </div>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                        <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-2 py-1 whitespace-nowrap max-w-48 truncate">
                          Q{questionNumber}: {question.question_text.slice(0, 50)}...
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-600 rounded border"></div>
                <span className="text-gray-700 dark:text-gray-300">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Flagged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Answered + Flagged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Unanswered</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Quick access mini palette for mobile
export function MiniQuestionPalette({
  currentQuestionIndex = 0,
  totalQuestions = 0,
  answeredQuestions = new Set(),
  flaggedQuestions = new Set(),
  onShowFullPalette
}) {
  const progress = calculateProgress(answeredQuestions, flaggedQuestions, totalQuestions);

  return (
    <motion.button
      onClick={onShowFullPalette}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <Grid3x3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
      <div className="text-left">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {currentQuestionIndex + 1}/{totalQuestions}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {progress.answered} answered • {progress.flagged} flagged
        </div>
      </div>
    </motion.button>
  );
}
