// app/components/test/TestFinishConfirmation.js - Test Submission Confirmation
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckSquare, 
  BarChart3, 
  Target, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Flag,
  Eye,
  Circle,
  ChevronRight,
  Award,
  Timer
} from 'lucide-react';
import { generateTestSummary, formatTime } from '@/lib/test-utils';

export function TestFinishConfirmation({ 
  isOpen, 
  onClose, 
  onConfirmFinish,
  submittedAnswers, 
  totalQuestions,
  timeRemaining,
  testType,
  questions,
  startTime
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const unansweredCount = totalQuestions - submittedAnswers.size;
  const summary = generateTestSummary(submittedAnswers, questions, startTime);
  const timeTaken = Math.floor((new Date() - startTime) / 1000);

  const handleFinishClick = () => {
    if (unansweredCount > 0) {
      setShowConfirmation(true);
    } else {
      onConfirmFinish();
    }
  };

  const handleConfirm = () => {
    onConfirmFinish();
  };

  // Get question status breakdown
  const getQuestionBreakdown = () => {
    const answered = submittedAnswers.size;
    const unanswered = totalQuestions - answered;
    const percentage = Math.round((answered / totalQuestions) * 100);
    
    return { answered, unanswered, percentage };
  };

  const breakdown = getQuestionBreakdown();

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
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {!showConfirmation ? (
            /* Summary View */
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                    <CheckSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {testType === 'mock' ? 'Mock Test' : 'Practice Test'} Summary
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Review your progress before submission
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

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Overall Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                    <div className="text-2xl font-light text-emerald-600 dark:text-emerald-400 mb-2">
                      {breakdown.answered}
                    </div>
                    <div className="text-emerald-800 dark:text-emerald-200 text-sm font-medium">Answered</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <div className="text-2xl font-light text-gray-600 dark:text-gray-400 mb-2">
                      {breakdown.unanswered}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Unanswered</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-2xl">
                    <div className="text-2xl font-light text-orange-600 dark:text-orange-400 mb-2">
                      {breakdown.percentage}%
                    </div>
                    <div className="text-orange-800 dark:text-orange-200 text-sm font-medium">Completion</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                    <div className="text-2xl font-light text-blue-600 dark:text-blue-400 mb-2">
                      {formatTime(timeTaken)}
                    </div>
                    <div className="text-blue-800 dark:text-blue-200 text-sm font-medium">Time Used</div>
                  </div>
                </div>

                {/* Progress Visualization */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Progress Overview</h3>
                  <div className="relative">
                    {/* Progress Bar */}
                    <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${breakdown.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                      {breakdown.answered} of {totalQuestions} questions answered
                    </div>
                  </div>
                </div>

                {/* Time Status */}
                <div className="mb-8">
                  <div className={`p-4 rounded-2xl border ${
                    timeRemaining > 600 // More than 10 minutes
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700'
                      : timeRemaining > 300 // More than 5 minutes
                      ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700'
                      : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Timer className={`h-5 w-5 ${
                        timeRemaining > 600 
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : timeRemaining > 300
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`} />
                      <div>
                        <h4 className={`font-medium ${
                          timeRemaining > 600 
                            ? 'text-emerald-900 dark:text-emerald-100'
                            : timeRemaining > 300
                            ? 'text-yellow-900 dark:text-yellow-100'
                            : 'text-red-900 dark:text-red-100'
                        }`}>
                          Time Remaining: {formatTime(timeRemaining)}
                        </h4>
                        <p className={`text-sm ${
                          timeRemaining > 600 
                            ? 'text-emerald-800 dark:text-emerald-200'
                            : timeRemaining > 300
                            ? 'text-yellow-800 dark:text-yellow-200'
                            : 'text-red-800 dark:text-red-200'
                        }`}>
                          {timeRemaining > 600 
                            ? 'You have plenty of time remaining'
                            : timeRemaining > 300
                            ? 'Consider reviewing your answers'
                            : 'Time is running low - consider submitting soon'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning for Unanswered Questions */}
                {unansweredCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-2xl mb-6"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                          {unansweredCount} Question{unansweredCount !== 1 ? 's' : ''} Unanswered
                        </h4>
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          {testType === 'mock' 
                            ? 'In the real exam, unanswered questions receive no marks. Consider reviewing these questions.'
                            : 'You can still review and answer the remaining questions before submitting.'
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Test Type Specific Advice */}
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-700">
                  <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
                    {testType === 'mock' ? <Award className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                    {testType === 'mock' ? 'Mock Test Submission' : 'Practice Test Submission'}
                  </h4>
                  <div className="text-sm text-indigo-800 dark:text-indigo-200 space-y-2">
                    {testType === 'mock' ? (
                      <>
                        <p>• This mock test simulates the real NCE exam conditions</p>
                        <p>• Once submitted, you'll see your score and detailed review</p>
                        <p>• Use this performance to identify areas for improvement</p>
                        {unansweredCount > 0 && <p>• Consider using remaining time to attempt unanswered questions</p>}
                      </>
                    ) : (
                      <>
                        <p>• This practice test helps you learn and improve</p>
                        <p>• You'll get detailed explanations for all questions</p>
                        <p>• Use the review to understand concepts better</p>
                        {unansweredCount > 0 && <p>• You can still answer remaining questions before submitting</p>}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all font-medium"
                >
                  Continue Test
                </button>
                
                <motion.button
                  onClick={handleFinishClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg"
                >
                  <CheckSquare className="h-4 w-4" />
                  Submit Test
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          ) : (
            /* Final Confirmation View */
            <div>
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Final Submission</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to submit your test?
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-2xl p-4 mb-6">
                  <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Final Summary:</h4>
                  <div className="text-orange-800 dark:text-orange-200 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Questions Answered:</span>
                      <span className="font-medium">{breakdown.answered} of {totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-medium">{breakdown.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Remaining:</span>
                      <span className="font-medium">{formatTime(timeRemaining)}</span>
                    </div>
                    {unansweredCount > 0 && (
                      <div className="flex justify-between text-orange-700 dark:text-orange-300">
                        <span>Unanswered Questions:</span>
                        <span className="font-medium">{unansweredCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all"
                  >
                    Go Back
                  </button>
                  
                  <motion.button
                    onClick={handleConfirm}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Submit Final Test
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
