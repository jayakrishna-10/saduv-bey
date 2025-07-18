// app/components/quiz/QuizOverview.js - Quick access palette
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Grid3x3, 
  Target, 
  Clock, 
  Award, 
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  BarChart3,
  Search
} from 'lucide-react';
import { normalizeChapterName } from '@/lib/quiz-utils';

export function QuizOverview({
  isOpen = false,
  onClose,
  questions = [],
  currentQuestionIndex = 0,
  completedQuestionIds = new Set(),
  answeredQuestions = [],
  onQuestionSelect,
  questionProgress
}) {
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'answered', 'unanswered', 'correct', 'incorrect'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('all');

  // Create answer lookup for quick access
  const answerLookup = useMemo(() => {
    const lookup = {};
    answeredQuestions.forEach(answer => {
      lookup[answer.questionId] = answer;
    });
    return lookup;
  }, [answeredQuestions]);

  // Get unique chapters
  const chapters = useMemo(() => {
    const uniqueChapters = [...new Set(questions.map(q => normalizeChapterName(q.tag)))].filter(Boolean);
    return uniqueChapters.sort();
  }, [questions]);

  // Filter questions based on current filters
  const filteredQuestions = useMemo(() => {
    return questions.filter((question, index) => {
      const questionId = question.main_id || question.id;
      const isCompleted = completedQuestionIds.has(questionId);
      const answer = answerLookup[questionId];
      const chapter = normalizeChapterName(question.tag);
      
      // Apply filters
      if (filterBy === 'answered' && !isCompleted) return false;
      if (filterBy === 'unanswered' && isCompleted) return false;
      if (filterBy === 'correct' && (!answer || !answer.isCorrect)) return false;
      if (filterBy === 'incorrect' && (!answer || answer.isCorrect)) return false;
      
      // Chapter filter
      if (selectedChapter !== 'all' && chapter !== selectedChapter) return false;
      
      // Search filter
      if (searchTerm && !question.question_text.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });
  }, [questions, filterBy, selectedChapter, searchTerm, completedQuestionIds, answerLookup]);

  const getQuestionStatus = (question, index) => {
    const questionId = question.main_id || question.id;
    const isCompleted = completedQuestionIds.has(questionId);
    const answer = answerLookup[questionId];
    const isCurrent = index === currentQuestionIndex;
    
    if (isCurrent) return 'current';
    if (!isCompleted) return 'unanswered';
    if (answer?.isCorrect) return 'correct';
    if (answer && !answer.isCorrect) return 'incorrect';
    return 'viewed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-500';
      case 'correct': return 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600';
      case 'incorrect': return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600';
      case 'viewed': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'current': return <Eye className="h-3 w-3" />;
      case 'correct': return <CheckCircle className="h-3 w-3" />;
      case 'incorrect': return <XCircle className="h-3 w-3" />;
      case 'viewed': return <AlertCircle className="h-3 w-3" />;
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
    const completed = completedQuestionIds.size;
    const correct = answeredQuestions.filter(a => a.isCorrect).length;
    const incorrect = answeredQuestions.filter(a => !a.isCorrect).length;
    const accuracy = answeredQuestions.length > 0 ? Math.round((correct / answeredQuestions.length) * 100) : 0;
    
    return { total, completed, correct, incorrect, accuracy };
  }, [questions.length, completedQuestionIds.size, answeredQuestions]);

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
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <Grid3x3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Quiz Overview</h2>
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
                  {stats.completed}/{stats.total}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Progress</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.correct}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Correct</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 mb-1">
                  <XCircle className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.incorrect}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Incorrect</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 mb-1">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.accuracy}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
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
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Questions</option>
                  <option value="answered">Answered</option>
                  <option value="unanswered">Unanswered</option>
                  <option value="correct">Correct</option>
                  <option value="incorrect">Incorrect</option>
                </select>
              </div>

              {/* Chapter Filter */}
              {chapters.length > 0 && (
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="px-3 py-2 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Chapters</option>
                  {chapters.map(chapter => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              )}
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
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {filteredQuestions.map((question, index) => {
                  const originalIndex = questions.findIndex(q => q === question);
                  const status = getQuestionStatus(question, originalIndex);
                  const questionNumber = originalIndex + 1;
                  
                  return (
                    <motion.button
                      key={question.main_id || question.id || index}
                      onClick={() => handleQuestionClick(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative p-3 rounded-xl border-2 transition-all duration-200 group
                        ${getStatusColor(status)}
                        hover:shadow-lg hover:shadow-current/20
                      `}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getStatusIcon(status)}
                        <span className="text-sm font-semibold">
                          {questionNumber}
                        </span>
                      </div>
                      
                      <div className="text-xs opacity-80 line-clamp-2 leading-tight">
                        {normalizeChapterName(question.tag)}
                      </div>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-2 py-1 whitespace-nowrap max-w-48 truncate">
                          {question.question_text}
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
                <span className="text-gray-700 dark:text-gray-300">Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Incorrect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Viewed</span>
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
