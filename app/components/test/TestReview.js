// app/components/test/TestReview.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { isCorrectAnswer, getReviewOptionClass } from '@/lib/test-utils';

export function TestReview({ 
  config, 
  testData, 
  onBack 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = testData.questions[currentIndex];
  const userAnswer = testData.answers[currentIndex];
  const isCorrect = isCorrectAnswer(userAnswer, currentQuestion?.correct_answer);

  const getResultIcon = () => {
    if (!userAnswer) return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    return isCorrect ? <CheckCircle className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-red-500" />;
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <p>Loading review...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative z-10 min-h-screen p-4 md:p-6 pb-20 md:pb-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200/50 dark:border-gray-700/50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Results</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="text-gray-900 dark:text-gray-100 text-center">
            <h1 className="text-xl md:text-2xl font-light">Review Answers</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Question {currentIndex + 1} of {testData.questions.length}</p>
          </div>
          
          <div className="w-16 md:w-32" />
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 mb-8"
        >
          {/* Question Status */}
          <div className="flex items-center gap-4 mb-6">
            {getResultIcon()}
            <div>
              <span className="text-gray-900 dark:text-gray-100 font-medium text-base md:text-lg">
                {!userAnswer ? 'Not Attempted' : isCorrect ? 'Correct' : 'Incorrect'}
              </span>
              {userAnswer && (
                <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1">
                  Your answer: {userAnswer?.toUpperCase()} | Correct answer: {currentQuestion?.correct_answer?.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Question */}
          <h2 className="text-lg md:text-xl font-light text-gray-900 dark:text-gray-100 mb-6 md:mb-8 leading-relaxed">
            {currentQuestion?.question_text}
          </h2>

          {/* Options */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {['a', 'b', 'c', 'd'].map((option) => (
              <div
                key={option}
                className={`p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${getReviewOptionClass(option, userAnswer, currentQuestion?.correct_answer)}`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium bg-white/50 dark:bg-gray-700/50">
                    {option.toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm md:text-base">{currentQuestion?.[`option_${option}`]}</span>
                  {userAnswer === option && <span className="text-xs bg-white/70 dark:bg-gray-700/70 px-2 py-1 rounded">Your Answer</span>}
                  {isCorrectAnswer(option, currentQuestion?.correct_answer) && <span className="text-xs bg-emerald-500 px-2 py-1 rounded text-white">Correct</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${
                currentIndex === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {currentIndex + 1} of {testData.questions.length}
            </div>

            <button
              onClick={() => setCurrentIndex(Math.min(testData.questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === testData.questions.length - 1}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${
                currentIndex === testData.questions.length - 1
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}