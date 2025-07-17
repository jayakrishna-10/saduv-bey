// app/components/test/TestQuestion.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, FlagOff, Tag, Calendar, Loader2, CheckCircle } from 'lucide-react';
import { normalizeChapterName, QUESTION_STATUS, TEST_TYPES } from '@/lib/test-utils';

export function TestQuestion({ 
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onOptionSelect,
  onToggleFlag,
  isFlagged = false,
  isTransitioning,
  testType = 'mock',
  currentQuestionNumber
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
    if (selectedOption || isTransitioning) return;
    
    setLoadingOption(option);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      onOptionSelect(option);
      setLoadingOption(null);
    }, 150);
  };

  const handleFlag = () => {
    if (!isTransitioning) {
      onToggleFlag(questionIndex);
    }
  };

  const getOptionClass = (option) => {
    if (loadingOption === option) {
      return "bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 scale-98 cursor-wait";
    }

    if (selectedOption === option) {
      return "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 shadow-md";
    }

    return "bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-800/95 border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/60 dark:hover:border-gray-600/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer";
  };

  const getOptionIconClass = (option) => {
    if (loadingOption === option) {
      return 'bg-indigo-500 text-white border-indigo-500';
    }

    if (selectedOption === option) {
      return 'bg-blue-500 text-white border-blue-500';
    }

    return 'border-current bg-white/80 dark:bg-gray-800/80';
  };

  const showChapterInfo = TEST_TYPES[testType]?.showChapterInfo;
  const showYearInfo = TEST_TYPES[testType]?.showYearInfo;

  if (isTransitioning) {
    return (
      <div className="p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Loading next question...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      {/* Progress and Question Info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
              Question {currentQuestionNumber} of {totalQuestions}
            </div>
            
            {/* Flag Button */}
            <motion.button
              onClick={handleFlag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all ${
                isFlagged
                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-600'
              }`}
              title={isFlagged ? 'Remove flag' : 'Flag question for review'}
            >
              {isFlagged ? <Flag className="h-4 w-4 fill-current" /> : <FlagOff className="h-4 w-4" />}
            </motion.button>
          </div>
          
          {/* Question Metadata - Only show if test type allows */}
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            {showChapterInfo && question.tag && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Tag className="h-3 w-3" />
                <span className={`${isMobile ? 'truncate max-w-20' : ''}`}>
                  {normalizeChapterName(question.tag)}
                </span>
              </div>
            )}
            {showYearInfo && question.year && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Calendar className="h-3 w-3" />
                <span>{question.year}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
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
        {/* Test Type Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            testType === 'mock' 
              ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
              : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
          }`}>
            {testType === 'mock' ? '🎯' : '📚'} {TEST_TYPES[testType]?.name}
          </span>
        </div>

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

      {/* Options */}
      <div className={`space-y-3 ${isMobile ? 'mb-6' : 'mb-8'}`}>
        {['a', 'b', 'c', 'd'].map((option) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleOptionClick(option)}
            disabled={isTransitioning || loadingOption}
            whileHover={
              !selectedOption && !isTransitioning && !loadingOption ? 
              { scale: 1.005, x: 2 } : 
              {}
            }
            whileTap={
              !selectedOption && !isTransitioning && !loadingOption ? 
              { scale: 0.995 } : 
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
              
              {/* Selection Indicator */}
              <AnimatePresence>
                {selectedOption === option && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selection Status */}
      <AnimatePresence>
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Answer selected: {selectedOption.toUpperCase()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flag Status */}
      <AnimatePresence>
        {isFlagged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/80 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
              <Flag className="h-3 w-3 fill-current" />
              Flagged for review
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Instructions (Mock Test Only) */}
      {testType === 'mock' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
        >
          <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
            Mock Test Mode
          </h4>
          <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
            <li>• No chapter information provided (as in real exam)</li>
            <li>• Review all answers and explanations after test completion</li>
            <li>• Use the flag feature to mark questions for review</li>
          </ul>
        </motion.div>
      )}

      {/* Mobile Quick Stats */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">{currentQuestionNumber}</div>
            <div className="text-xs">Current</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">{totalQuestions - currentQuestionNumber}</div>
            <div className="text-xs">Remaining</div>
          </div>
          {isFlagged && (
            <div className="text-center">
              <div className="font-medium text-amber-600 dark:text-amber-400">🚩</div>
              <div className="text-xs">Flagged</div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
