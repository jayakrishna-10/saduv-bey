// app/components/quiz/QuizQuestion.js - Reduced animations and centered actions
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Calendar, Tag, Loader2 } from 'lucide-react';
import { normalizeChapterName, isCorrectAnswer } from '@/lib/quiz-utils';

export function QuizQuestion({ 
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  showFeedback,
  showAnswer,
  onOptionSelect,
  isTransitioning,
  questionProgress
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [loadingOption, setLoadingOption] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOptionClick = async (option) => {
    if (selectedOption || isTransitioning || showAnswer || showFeedback) return;
    
    setLoadingOption(option);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      onOptionSelect(option);
      setLoadingOption(null);
    }, 150);
  };

  const getOptionClass = (option) => {
    if (loadingOption === option) {
      return "bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 scale-98 cursor-wait";
    }

    if (!showFeedback && !showAnswer) {
      return "bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-800/95 border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/60 dark:hover:border-gray-600/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer";
    }

    const isCorrect = isCorrectAnswer(option, question.correct_answer);
    const isSelected = selectedOption === option;

    if (isCorrect) {
      return "bg-emerald-100/90 dark:bg-emerald-900/60 border-emerald-300/80 dark:border-emerald-600/80 text-emerald-800 dark:text-emerald-200 shadow-emerald-200/50 dark:shadow-emerald-900/30 shadow-lg";
    }
    if (isSelected && !isCorrect) {
      return "bg-red-100/90 dark:bg-red-900/60 border-red-300/80 dark:border-red-600/80 text-red-800 dark:text-red-200 shadow-red-200/50 dark:shadow-red-900/30 shadow-lg";
    }
    return "bg-gray-100/80 dark:bg-gray-700/80 border-gray-200/60 dark:border-gray-600/60 text-gray-600 dark:text-gray-400 opacity-75";
  };

  const getOptionIconClass = (option) => {
    if (loadingOption === option) {
      return 'bg-indigo-500 text-white border-indigo-500';
    }

    if (!showFeedback && !showAnswer) {
      return 'border-current bg-white/80 dark:bg-gray-800/80';
    }

    const isCorrect = isCorrectAnswer(option, question.correct_answer);
    const isSelected = selectedOption === option;

    if (isCorrect) {
      return 'bg-emerald-500 text-white border-emerald-500';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-500 text-white border-red-500';
    }
    return 'border-current bg-gray-200/80 dark:bg-gray-600/80';
  };

  if (isTransitioning) {
    return (
      <div className="p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Loader2 className="h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-indigo-600 dark:border-t-indigo-400 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Loading next question...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
              {questionProgress.current} / {questionProgress.total}
            </div>
            {question.year && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                <Calendar className="h-3 w-3" />
                <span>{question.year}</span>
              </div>
            )}
          </div>
          
          {/* Mobile Chapter Tag */}
          {isMobile && question.tag && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400">
              <Tag className="h-3 w-3" />
              <span className="truncate max-w-24">{normalizeChapterName(question.tag)}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionProgress.current / questionProgress.total) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Question Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        {/* Desktop Chapter Info */}
        {!isMobile && (
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="font-medium">Question {questionIndex + 1}</span>
            {question.tag && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>Chapter: {normalizeChapterName(question.tag)}</span>
                </div>
              </>
            )}
            {question.year && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Year: {question.year}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Question Text */}
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`font-light text-gray-900 dark:text-gray-100 leading-relaxed ${
            isMobile ? 'text-lg' : 'text-2xl lg:text-3xl'
          }`}
        >
          {question.question_text}
        </motion.h2>
      </motion.div>

      {/* Options - Removed staggered animation delays */}
      <div className={`space-y-3 ${isMobile ? 'mb-6' : 'mb-8'}`}>
        {['a', 'b', 'c', 'd'].map((option) => (
          <motion.button
            key={option}
            // Removed individual delays for less distraction
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleOptionClick(option)}
            disabled={showAnswer || isTransitioning || loadingOption}
            whileHover={
              !selectedOption && !isTransitioning && !loadingOption ? 
              { scale: 1.005, x: 2 } : // Reduced hover effect
              {}
            }
            whileTap={
              !selectedOption && !isTransitioning && !loadingOption ? 
              { scale: 0.995 } : // Reduced tap effect
              {}
            }
            className={`
              w-full p-4 md:p-6 rounded-2xl border-2 text-left transition-all duration-300 
              backdrop-blur-sm touch-manipulation relative overflow-hidden
              ${getOptionClass(option)} 
              ${(isTransitioning || loadingOption) ? 'pointer-events-none' : ''}
            `}
          >
            <div className="flex items-center gap-3 md:gap-4 relative z-10">
              <div className={`
                w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center 
                text-sm md:text-base font-medium transition-all duration-300 relative
                ${getOptionIconClass(option)}
              `}>
                {loadingOption === option ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  option.toUpperCase()
                )}
              </div>
              
              <span className={`flex-1 ${isMobile ? 'text-base' : 'text-lg'} transition-all duration-300`}>
                {question[`option_${option}`]}
              </span>
              
              {/* Success/Error Indicator */}
              <AnimatePresence>
                {showFeedback && isCorrectAnswer(option, question.correct_answer) && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selection Confirmation */}
      <AnimatePresence>
        {selectedOption && !showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Answer selected: {selectedOption.toUpperCase()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats (Mobile Only) */}
      {isMobile && questionProgress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">{questionProgress.attempted}</div>
            <div className="text-xs">Answered</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">{questionProgress.total - questionProgress.attempted}</div>
            <div className="text-xs">Remaining</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
