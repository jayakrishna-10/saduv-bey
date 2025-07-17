// app/components/test/TestReview.js
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  Flag,
  Eye,
  ChevronDown,
  ChevronRight,
  Tag,
  Calendar,
  Lightbulb,
  BarChart3,
  Target,
  BookOpen
} from 'lucide-react';
import { ExplanationDisplay } from '../ExplanationDisplay';
import { filterQuestionsForReview, normalizeChapterName, TEST_TYPES } from '@/lib/test-utils';

export function TestReview({
  isOpen = false,
  onClose,
  questions = [],
  answers = [],
  testType = 'mock',
  testConfig = {},
  explanations = {}
}) {
  const [filter, setFilter] = useState('all'); // 'all', 'correct', 'incorrect', 'unanswered', 'flagged'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [expandedExplanations, setExpandedExplanations] = useState(new Set());
  const [loadingExplanations, setLoadingExplanations] = useState(new Set());

  // Create answer lookup for easier access
  const answerLookup = useMemo(() => {
    const lookup = {};
    answers.forEach(answer => {
      lookup[answer.questionIndex] = answer;
    });
    return lookup;
  }, [answers]);

  // Filter and process questions
  const reviewData = useMemo(() => {
    return filterQuestionsForReview(questions, answers, filter).filter(item => {
      if (searchTerm && !item.question.question_text.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [questions, answers, filter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = questions.length;
    const answered = answers.length;
    const correct = answers.filter(a => a.isCorrect).length;
    const incorrect = answers.filter(a => !a.isCorrect).length;
    const unanswered = total - answered;
    const flagged = answers.filter(a => a.isFlagged).length;
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    return { total, answered, correct, incorrect, unanswered, flagged, accuracy };
  }, [questions, answers]);

  const loadExplanation = async (questionIndex) => {
    const questionId = questions[questionIndex]?.main_id || questions[questionIndex]?.id;
    if (!questionId || explanations[questionId]) return;

    setLoadingExplanations(prev => new Set([...prev, questionIndex]));

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionId, 
          paper: testConfig.selectedPaper || 'paper1'
        })
      });

      if (response.ok) {
        const result = await response.json();
        explanations[questionId] = result.explanation || { 
          explanation: { concept: { title: "Explanation not available" } } 
        };
      }
    } catch (error) {
      console.error('Error loading explanation:', error);
      explanations[questionId] = { 
        explanation: { concept: { title: "Error loading explanation" } } 
      };
    }

    setLoadingExplanations(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionIndex);
      return newSet;
    });
  };

  const toggleExplanation = (questionIndex) => {
    const isExpanded = expandedExplanations.has(questionIndex);
    const newExpanded = new Set(expandedExplanations);
    
    if (isExpanded) {
      newExpanded.delete(questionIndex);
    } else {
      newExpanded.add(questionIndex);
      loadExplanation(questionIndex);
    }
    
    setExpandedExplanations(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct':
        return 'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30';
      case 'incorrect':
        return 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/30';
      default:
        return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'correct':
        return <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case 'incorrect':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getOptionClass = (option, correctAnswer, userAnswer) => {
    const isCorrect = option === correctAnswer?.toLowerCase();
    const isUserAnswer = option === userAnswer?.toLowerCase();

    if (isCorrect) {
      return 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300';
    }
    if (isUserAnswer && !isCorrect) {
      return 'bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300';
    }
    return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400';
  };

  const showChapterInfo = TEST_TYPES[testType]?.showChapterInfo;

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
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Test Review</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {reviewData.length} of {questions.length} questions • {stats.accuracy}% accuracy
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
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.total}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{stats.correct}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">{stats.incorrect}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">{stats.unanswered}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Unanswered</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">{stats.flagged}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Flagged</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{stats.accuracy}%</div>
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
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'All', count: questions.length },
                  { id: 'correct', label: 'Correct', count: stats.correct },
                  { id: 'incorrect', label: 'Incorrect', count: stats.incorrect },
                  { id: 'unanswered', label: 'Unanswered', count: stats.unanswered }
                ].map(filterOption => (
                  <motion.button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                      filter === filterOption.id
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{filterOption.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      filter === filterOption.id
                        ? 'bg-white/20'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {filterOption.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="flex-1 overflow-y-auto">
            {reviewData.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No questions match your filters</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {reviewData.map(({ question, index, answer, status }) => {
                  const isExpanded = expandedExplanations.has(index);
                  const isLoading = loadingExplanations.has(index);
                  const questionId = question.main_id || question.id;
                  const explanation = explanations[questionId];

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index % 10) * 0.05 }}
                      className={`border-2 rounded-2xl overflow-hidden transition-all ${getStatusColor(status)}`}
                    >
                      {/* Question Header */}
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/70 dark:bg-gray-700/70 rounded-full flex items-center justify-center font-medium text-gray-900 dark:text-gray-100">
                              {index + 1}
                            </div>
                            {getStatusIcon(status)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {answer?.isFlagged && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg text-xs">
                                  <Flag className="h-3 w-3 fill-current" />
                                  Flagged
                                </div>
                              )}
                              {showChapterInfo && question.tag && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                                  <Tag className="h-3 w-3" />
                                  {normalizeChapterName(question.tag)}
                                </div>
                              )}
                            </div>
                            
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 leading-relaxed">
                              {question.question_text}
                            </h3>

                            {/* Options */}
                            <div className="space-y-2">
                              {['a', 'b', 'c', 'd'].map((option) => (
                                <div
                                  key={option}
                                  className={`p-3 rounded-xl border-2 transition-all ${
                                    getOptionClass(option, question.correct_answer, answer?.selectedOption)
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white/70 dark:bg-gray-700/70 flex items-center justify-center text-sm font-medium">
                                      {option.toUpperCase()}
                                    </div>
                                    <span className="text-sm">{question[`option_${option}`]}</span>
                                    {option === question.correct_answer?.toLowerCase() && (
                                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 ml-auto" />
                                    )}
                                    {option === answer?.selectedOption?.toLowerCase() && option !== question.correct_answer?.toLowerCase() && (
                                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 ml-auto" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Answer Status */}
                            <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                              <div className="flex items-center justify-between text-sm">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Your answer: </span>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {answer?.selectedOption?.toUpperCase() || 'Not answered'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Correct answer: </span>
                                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                    {question.correct_answer?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Explanation Toggle */}
                        <motion.button
                          onClick={() => toggleExplanation(index)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full mt-4 p-3 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Lightbulb className="h-4 w-4" />
                          <span className="font-medium">
                            {isExpanded ? 'Hide' : 'Show'} Explanation
                          </span>
                          {isExpanded ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </motion.button>
                      </div>

                      {/* Expanded Explanation */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30 overflow-hidden"
                          >
                            <div className="p-6">
                              {isLoading ? (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
                                  <p className="text-gray-600 dark:text-gray-400">Loading explanation...</p>
                                </div>
                              ) : explanation ? (
                                <ExplanationDisplay
                                  explanationData={explanation}
                                  questionText={question.question_text}
                                  options={{
                                    option_a: question.option_a,
                                    option_b: question.option_b,
                                    option_c: question.option_c,
                                    option_d: question.option_d
                                  }}
                                  correctAnswer={question.correct_answer?.toLowerCase()}
                                  userAnswer={answer?.selectedOption?.toLowerCase()}
                                />
                              ) : (
                                <div className="text-center py-8">
                                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                                  <p className="text-gray-600 dark:text-gray-400">
                                    Explanation not available for this question.
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
