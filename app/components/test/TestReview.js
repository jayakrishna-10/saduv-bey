// app/components/test/TestReview.js - Test Results and Review
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Award,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Eye,
  BarChart3,
  TrendingUp,
  BookOpen,
  Lightbulb,
  RefreshCw,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { ExplanationDisplay } from '../ExplanationDisplay';
import { generateTestSummary, isCorrectAnswer, normalizeChapterName, formatTime } from '@/lib/test-utils';

export function TestReview({
  questions = [],
  submittedAnswers = new Map(),
  flaggedQuestions = new Set(),
  testType,
  selectedPaper,
  startTime,
  timeTaken,
  onStartNewTest
}) {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'correct', 'incorrect', 'flagged', 'unanswered'
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState(null);

  const summary = generateTestSummary(submittedAnswers, questions, startTime);

  // Filter questions based on current filter
  const filteredQuestions = questions.filter((question, index) => {
    const questionId = question.main_id || question.id;
    const answer = submittedAnswers.get(questionId);
    const isAnswered = submittedAnswers.has(questionId);
    const isFlagged = flaggedQuestions.has(questionId);
    const isCorrect = answer ? isCorrectAnswer(answer.selectedOption, question.correct_answer) : false;
    
    switch (filterBy) {
      case 'correct': return isAnswered && isCorrect;
      case 'incorrect': return isAnswered && !isCorrect;
      case 'flagged': return isFlagged;
      case 'unanswered': return !isAnswered;
      default: return true;
    }
  });

  const currentQuestion = filteredQuestions[selectedQuestionIndex] || questions[0];
  const currentQuestionId = currentQuestion?.main_id || currentQuestion?.id;
  const currentAnswer = submittedAnswers.get(currentQuestionId);
  const isCurrentCorrect = currentAnswer ? isCorrectAnswer(currentAnswer.selectedOption, currentQuestion.correct_answer) : null;

  // Load explanation for current question
  useEffect(() => {
    if (currentQuestion && showExplanation) {
      loadExplanation(currentQuestionId);
    }
  }, [currentQuestion, showExplanation]);

  const loadExplanation = async (questionId) => {
    setIsLoadingExplanation(true);
    try {
      // Check if question already has explanation
      const questionData = questions.find(q => (q.main_id || q.id) === questionId);
      if (questionData?.explanation) {
        setCurrentExplanation(questionData.explanation);
      } else {
        // Fetch explanation from API
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, paper: selectedPaper })
        });
        if (!response.ok) throw new Error('Failed to fetch explanation');
        const result = await response.json();
        setCurrentExplanation(result.explanation || { explanation: { concept: { title: "Not Available" } } });
      }
    } catch (err) {
      console.error('Error loading explanation:', err);
      setCurrentExplanation({ explanation: { concept: { title: "Error Loading" } } });
    }
    setIsLoadingExplanation(false);
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 80) return { level: 'Excellent', color: 'emerald', message: 'Outstanding performance! You\'re well prepared.' };
    if (percentage >= 65) return { level: 'Good', color: 'blue', message: 'Good performance. A bit more practice will make you exam-ready.' };
    if (percentage >= 50) return { level: 'Average', color: 'yellow', message: 'Decent performance. Focus on weak areas to improve.' };
    if (percentage >= 35) return { level: 'Below Average', color: 'orange', message: 'More practice needed. Review concepts thoroughly.' };
    return { level: 'Poor', color: 'red', message: 'Significant improvement needed. Consider additional study time.' };
  };

  const performance = getPerformanceLevel(summary.percentage);

  const getQuestionStatus = (question) => {
    const questionId = question.main_id || question.id;
    const answer = submittedAnswers.get(questionId);
    const isFlagged = flaggedQuestions.has(questionId);
    
    if (!answer) return { status: 'unanswered', icon: null, color: 'text-gray-500' };
    
    const isCorrect = isCorrectAnswer(answer.selectedOption, question.correct_answer);
    if (isCorrect && isFlagged) return { status: 'correct-flagged', icon: <Flag className="h-3 w-3 fill-current" />, color: 'text-emerald-600' };
    if (!isCorrect && isFlagged) return { status: 'incorrect-flagged', icon: <Flag className="h-3 w-3 fill-current" />, color: 'text-red-600' };
    if (isCorrect) return { status: 'correct', icon: <CheckCircle className="h-3 w-3" />, color: 'text-emerald-600' };
    return { status: 'incorrect', icon: <XCircle className="h-3 w-3" />, color: 'text-red-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-light text-gray-900 dark:text-gray-100">
                {testType === 'mock' ? 'Mock Test' : 'Practice Test'} Review
              </h1>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                performance.color === 'emerald' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                performance.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                performance.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                performance.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
              }`}>
                {summary.percentage}% - {performance.level}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onStartNewTest}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                New Test
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Summary & Question List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Performance Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 p-6 shadow-xl"
            >
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                  performance.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                  performance.color === 'blue' ? 'from-blue-400 to-blue-600' :
                  performance.color === 'yellow' ? 'from-yellow-400 to-yellow-600' :
                  performance.color === 'orange' ? 'from-orange-400 to-orange-600' :
                  'from-red-400 to-red-600'
                } flex items-center justify-center`}>
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {performance.level} Performance
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {performance.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                  <div className="text-2xl font-light text-emerald-600 dark:text-emerald-400 mb-1">
                    {summary.correctAnswers}
                  </div>
                  <div className="text-emerald-800 dark:text-emerald-200 text-xs">Correct</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/30 rounded-xl">
                  <div className="text-2xl font-light text-red-600 dark:text-red-400 mb-1">
                    {summary.incorrectAnswers}
                  </div>
                  <div className="text-red-800 dark:text-red-200 text-xs">Incorrect</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="text-2xl font-light text-gray-600 dark:text-gray-400 mb-1">
                    {summary.unanswered}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">Unanswered</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <div className="text-2xl font-light text-blue-600 dark:text-blue-400 mb-1">
                    {formatTime(timeTaken)}
                  </div>
                  <div className="text-blue-800 dark:text-blue-200 text-xs">Time</div>
                </div>
              </div>

              {/* Chapter Performance */}
              {Object.keys(summary.chapterPerformance).length > 1 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Chapter Performance</h4>
                  <div className="space-y-2">
                    {Object.entries(summary.chapterPerformance).map(([chapter, performance]) => (
                      <div key={chapter} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">{chapter}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                              style={{ width: `${(performance.correct / performance.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-xs w-8">
                            {Math.round((performance.correct / performance.total) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Question Filter */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Filter Questions</span>
              </div>
              <select
                value={filterBy}
                onChange={(e) => {
                  setFilterBy(e.target.value);
                  setSelectedQuestionIndex(0);
                }}
                className="w-full px-3 py-2 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Questions ({questions.length})</option>
                <option value="correct">Correct ({summary.correctAnswers})</option>
                <option value="incorrect">Incorrect ({summary.incorrectAnswers})</option>
                <option value="unanswered">Unanswered ({summary.unanswered})</option>
                <option value="flagged">Flagged ({flaggedQuestions.size})</option>
              </select>
            </div>

            {/* Question List */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Questions ({filteredQuestions.length})
                </h4>
              </div>
              <div className="p-2">
                {filteredQuestions.map((question, index) => {
                  const originalIndex = questions.findIndex(q => q === question);
                  const status = getQuestionStatus(question);
                  
                  return (
                    <button
                      key={question.main_id || question.id || index}
                      onClick={() => setSelectedQuestionIndex(index)}
                      className={`w-full p-3 rounded-xl mb-2 text-left transition-all ${
                        index === selectedQuestionIndex
                          ? 'bg-orange-100 dark:bg-orange-900/50 border border-orange-300 dark:border-orange-600'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                            index === selectedQuestionIndex
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                          }`}>
                            {originalIndex + 1}
                          </div>
                          <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                            {question.question_text.substring(0, 40)}...
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 ${status.color}`}>
                          {status.icon}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Question Detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl overflow-hidden"
              >
                {/* Question Header */}
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                        Question {questions.findIndex(q => q === currentQuestion) + 1}
                      </h2>
                      {testType === 'practice' && currentQuestion.tag && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                          {normalizeChapterName(currentQuestion.tag)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {flaggedQuestions.has(currentQuestionId) && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg text-xs">
                          <Flag className="h-3 w-3 fill-current" />
                          Flagged
                        </div>
                      )}
                      
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                        isCurrentCorrect === true 
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                          : isCurrentCorrect === false
                          ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {isCurrentCorrect === true ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Correct
                          </>
                        ) : isCurrentCorrect === false ? (
                          <>
                            <XCircle className="h-3 w-3" />
                            Incorrect
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3" />
                            Unanswered
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 dark:text-gray-100 text-lg leading-relaxed">
                    {currentQuestion.question_text}
                  </p>
                </div>

                {/* Options */}
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="space-y-3">
                    {['a', 'b', 'c', 'd'].map((option) => {
                      const isCorrect = option === currentQuestion.correct_answer;
                      const isUserAnswer = currentAnswer?.selectedOption === option;
                      
                      return (
                        <div
                          key={option}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-600 shadow-sm'
                              : isUserAnswer && !isCorrect
                              ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600 shadow-sm'
                              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                              isCorrect
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : isUserAnswer && !isCorrect
                                ? 'bg-red-500 text-white border-red-500'
                                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                            }`}>
                              {option.toUpperCase()}
                            </div>
                            
                            <span className={`flex-1 ${
                              isCorrect
                                ? 'text-emerald-900 dark:text-emerald-100'
                                : isUserAnswer && !isCorrect
                                ? 'text-red-900 dark:text-red-100'
                                : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {currentQuestion[`option_${option}`]}
                            </span>
                            
                            {isCorrect && (
                              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            )}
                            {isUserAnswer && !isCorrect && (
                              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation Toggle */}
                <div className="p-6">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center justify-between w-full p-3 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-medium text-indigo-900 dark:text-indigo-100">
                        Detailed Explanation
                      </span>
                    </div>
                    {showExplanation ? (
                      <ChevronUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        {isLoadingExplanation ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading explanation...</span>
                          </div>
                        ) : currentExplanation ? (
                          <ExplanationDisplay
                            explanationData={currentExplanation}
                            questionText={currentQuestion.question_text}
                            options={{
                              option_a: currentQuestion.option_a,
                              option_b: currentQuestion.option_b,
                              option_c: currentQuestion.option_c,
                              option_d: currentQuestion.option_d
                            }}
                            correctAnswer={currentQuestion.correct_answer}
                            userAnswer={currentAnswer?.selectedOption}
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <p className="text-gray-600 dark:text-gray-400">No explanation available for this question.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setSelectedQuestionIndex(Math.max(0, selectedQuestionIndex - 1))}
                disabled={selectedQuestionIndex === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  selectedQuestionIndex === 0
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedQuestionIndex + 1} of {filteredQuestions.length}
              </span>

              <button
                onClick={() => setSelectedQuestionIndex(Math.min(filteredQuestions.length - 1, selectedQuestionIndex + 1))}
                disabled={selectedQuestionIndex === filteredQuestions.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  selectedQuestionIndex === filteredQuestions.length - 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300'
                }`}
              >
                Next
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
