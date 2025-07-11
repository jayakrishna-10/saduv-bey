// app/components/quiz/QuizQuestion.js
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Flag } from 'lucide-react';
import { normalizeChapterName, isCorrectAnswer } from '@/lib/quiz-utils';

export function QuizQuestion({ 
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  showFeedback,
  showAnswer,
  onOptionSelect,
  isTransitioning
}) {
  const getOptionClass = (option) => {
    if (!showFeedback && !showAnswer) {
      return "bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100";
    }

    const isCorrect = isCorrectAnswer(option, question.correct_answer);
    const isSelected = selectedOption === option;

    if (isCorrect) {
      return "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200";
    }
    if (isSelected && !isCorrect) {
      return "bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-600 text-red-800 dark:text-red-200";
    }
    return "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400";
  };

  if (isTransitioning) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">Loading next question...</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 md:mb-8"
      >
        {/* Mobile Question Header */}
        <div className="flex items-center gap-2 mb-4 md:hidden">
          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
            Q{questionIndex + 1}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{question.year}</span>
        </div>

        {/* Desktop Question Header */}
        <div className="hidden md:block mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Question {questionIndex + 1}</span>
            <span>Chapter: {normalizeChapterName(question.tag)}</span>
            <span>Year: {question.year}</span>
          </div>
        </div>

        <h2 className="text-lg md:text-2xl lg:text-3xl font-light text-gray-900 dark:text-gray-100 leading-relaxed mb-4">
          {question.question_text}
        </h2>
        
        {/* Mobile Chapter Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 md:hidden mb-4">
          {normalizeChapterName(question.tag)}
        </p>
      </motion.div>

      {/* Options */}
      <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
        {['a', 'b', 'c', 'd'].map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onClick={() => onOptionSelect(option)}
            disabled={showAnswer || isTransitioning}
            whileHover={selectedOption === null && !isTransitioning ? { scale: 1.01, x: 4 } : {}}
            whileTap={selectedOption === null && !isTransitioning ? { scale: 0.99 } : {}}
            className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border-2 text-left transition-all duration-300 backdrop-blur-sm touch-manipulation min-h-[56px] md:min-h-[auto] ${getOptionClass(option)} ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center text-sm md:text-base font-medium ${
                selectedOption === option 
                  ? (isCorrectAnswer(option, question.correct_answer) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-red-500 text-white border-red-500')
                  : isCorrectAnswer(option, question.correct_answer) && showFeedback
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'border-current'
              }`}>
                {option.toUpperCase()}
              </div>
              <span className="flex-1 text-base md:text-lg">{question[`option_${option}`]}</span>
              {showFeedback && isCorrectAnswer(option, question.correct_answer) && (
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </>
  );
}