// app/components/quiz/QuizFinishConfirmation.js - Finish quiz with summary and confirmation
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Flag, 
  BarChart3, 
  Target, 
  Clock, 
  Award,
  CheckCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { generateQuizSummary, formatTime } from '@/lib/quiz-utils';

export function QuizFinishConfirmation({ 
  isOpen, 
  onClose, 
  onConfirmFinish,
  answeredQuestions, 
  startTime,
  questionProgress
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const summary = generateQuizSummary(answeredQuestions, startTime);
  const remainingQuestions = questionProgress.total - questionProgress.attempted;

  const handleFinishClick = () => {
    if (remainingQuestions > 0) {
      setShowConfirmation(true);
    } else {
      onConfirmFinish();
    }
  };

  const handleConfirm = () => {
    onConfirmFinish();
  };

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
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {!showConfirmation ? (
            /* Summary View */
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                    <Flag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Quiz Summary</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Review your performance
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
                      {summary.correctAnswers}
                    </div>
                    <div className="text-emerald-800 dark:text-emerald-200 text-sm font-medium">Correct</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-2xl">
                    <div className="text-2xl font-light text-red-600 dark:text-red-400 mb-2">
                      {summary.incorrectAnswers}
                    </div>
                    <div className="text-red-800 dark:text-red-200 text-sm font-medium">Incorrect</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                    <div className="text-2xl font-light text-blue-600 dark:text-blue-400 mb-2">
                      {summary.score}%
                    </div>
                    <div className="text-blue-800 dark:text-blue-200 text-sm font-medium">Score</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
                    <div className="text-2xl font-light text-purple-600 dark:text-purple-400 mb-2">
                      {formatTime(summary.timeTaken)}
                    </div>
                    <div className="text-purple-800 dark:text-purple-200 text-sm font-medium">Time</div>
                  </div>
                </div>

                {/* Progress Warning */}
                {remainingQuestions > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-2xl mb-6"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                          Quiz In Progress
                        </h4>
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          You still have {remainingQuestions} unanswered question{remainingQuestions !== 1 ? 's' : ''}. 
                          Finishing now will complete your quiz with the current progress.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Chapter Performance (if multiple chapters) */}
                {Object.keys(summary.chapterPerformance).length > 1 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Chapter Performance</h3>
                    <div className="space-y-3">
                      {Object.entries(summary.chapterPerformance).map(([chapter, performance]) => (
                        <div key={chapter} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">{chapter}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              {performance.correct}/{performance.total}
                            </span>
                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                                style={{ width: `${(performance.correct / performance.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-900 dark:text-gray-100 text-sm font-medium w-10">
                              {Math.round((performance.correct / performance.total) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Insights */}
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-700">
                  <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-3">Performance Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-indigo-700 dark:text-indigo-300 font-medium">Questions Answered</div>
                      <div className="text-indigo-900 dark:text-indigo-100">{summary.totalAnswered} of {questionProgress.total}</div>
                    </div>
                    <div>
                      <div className="text-indigo-700 dark:text-indigo-300 font-medium">Average Time</div>
                      <div className="text-indigo-900 dark:text-indigo-100">{summary.averageTimePerQuestion}s per question</div>
                    </div>
                    {summary.strongestChapter && (
                      <div>
                        <div className="text-indigo-700 dark:text-indigo-300 font-medium">Strongest Topic</div>
                        <div className="text-indigo-900 dark:text-indigo-100 truncate">{summary.strongestChapter.name}</div>
                      </div>
                    )}
                    {summary.weakestChapter && (
                      <div>
                        <div className="text-indigo-700 dark:text-indigo-300 font-medium">Focus Area</div>
                        <div className="text-indigo-900 dark:text-indigo-100 truncate">{summary.weakestChapter.name}</div>
                      </div>
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
                  Continue Quiz
                </button>
                
                <motion.button
                  onClick={handleFinishClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg"
                >
                  <Flag className="h-4 w-4" />
                  Finish Quiz
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          ) : (
            /* Confirmation View */
            <div>
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Confirm Finish Quiz</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to finish? You have {remainingQuestions} unanswered questions.
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-4 mb-6">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">What happens next:</h4>
                  <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                    <li>• Your current progress will be saved</li>
                    <li>• Unanswered questions won't affect your score</li>
                    <li>• You can start a new quiz anytime</li>
                  </ul>
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
                    Yes, Finish Quiz
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
