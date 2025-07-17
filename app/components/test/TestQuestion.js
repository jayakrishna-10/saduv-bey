// app/components/test/TestQuestion.js - Test Question Display Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Flag, FlagOff, Tag, Loader2, Shield } from 'lucide-react';
import { normalizeChapterName } from '@/lib/test-utils';

export function TestQuestion({ 
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onOptionSelect,
  isTransitioning,
  questionProgress,
  testType,
  isCurrentFlagged,
  hasAnswer,
  timeRemaining
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

  const getOptionClass = (option) => {
    if (loadingOption === option) {
      return "bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300 scale-98 cursor-wait";
    }

    if (selectedOption === option) {
      return "bg-orange-100/90 dark:bg-orange-900/60 border-orange-300/80 dark:border-orange-600/80 text-orange-800 dark:text-orange-200 shadow-orange-200/50 dark:shadow-orange-900/30 shadow-lg scale-[1.02]";
    }

    return "bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-800/95 border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/60 dark:hover:border-gray-600/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer hover:scale-[1.01]";
  };

  const getOptionIconClass = (option) => {
    if (loadingOption === option) {
      return 'bg-orange-500 text-white border-orange-500';
    }

    if (selectedOption === option) {
      return 'bg-orange-500 text-white border-orange-500 shadow-lg';
    }

    return 'border-current bg-white/80 dark:bg-gray-800/80';
  };

  const getTimeStatus = () => {
    if (testType === 'mock') {
      const totalSeconds = 60 * 60; // 60 minutes
      const timeLeft = timeRemaining;
      const percentage = (timeLeft / totalSeconds) * 100;
      
      if (percentage > 50) return 'safe';
      if (percentage > 25) return 'warning';
      return 'critical';
    } else {
      // Practice test - 72 seconds per question
      const questionsRemaining = totalQuestions - questionProgress.current + 1;
      const timePerQuestion = timeRemaining / questionsRemaining;
      
      if (timePerQuestion > 60) return 'safe';
      if (timePerQuestion > 30) return 'warning';
      return 'critical';
    }
  };

  if (isTransitioning) {
    return (
      <div className="p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-orange-600 dark:text-orange-400" />
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Loading question...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      {/* Progress and Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
              {questionProgress.current} / {questionProgress.total}
            </div>
            
            {/* Test Type Indicator */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
              testType === 'mock' 
                ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
            }`}>
              {testType === 'mock' ? (
                <>
                  <Shield className="h-3 w-3" />
                  <span>Mock Test</span>
                </>
              ) : (
                <>
                  <Tag className="h-3 w-3" />
                  <span>Practice</span>
                </>
              )}
            </div>

            {/* Answer Status */}
            {hasAnswer && (
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium">
                <CheckCircle className="h-3 w-3" />
                <span>Answered</span>
              </div>
            )}

            {/* Flag Status */}
            {isCurrentFlagged && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium">
                <Flag className="h-3 w-3 fill-current" />
                <span>Flagged</span>
              </div>
            )}
          </div>
          
          {/* Time Remaining Indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            getTimeStatus() === 'safe' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' :
            getTimeStatus() === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' :
            'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
          }`}>
            <Clock className="h-3 w-3" />
            <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
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
        {/* Question Metadata - Only show chapter for practice tests */}
        {!isMobile && testType === 'practice' && question.tag && (
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="font-medium">Question {questionIndex + 1}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>Chapter: {normalizeChapterName(question.tag)}</span>
            </div>
          </div>
        )}

        {/* Mobile Chapter Info for Practice Tests */}
        {isMobile && testType === 'practice' && question.tag && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 mb-4 w-fit">
            <Tag className="h-3 w-3" />
            <span className="truncate max-w-32">{normalizeChapterName(question.tag)}</span>
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
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-orange-600 dark:text-orange-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Subtle selection background effect */}
            {selectedOption === option && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                className="absolute inset-0 bg-orange-500 rounded-2xl"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Selection Confirmation */}
      <AnimatePresence>
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100/80 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Answer selected: {selectedOption.toUpperCase()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Instructions (Mock Test Only) */}
      {testType === 'mock' && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-3 bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-700/50"
        >
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-xs">
            <Shield className="h-3 w-3" />
            <span className="font-medium">Mock Test Mode</span>
          </div>
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">
            Real exam conditions - no hints or chapter information provided
          </p>
        </motion.div>
      )}

      {/* Question Stats (Mobile Only) */}
      {isMobile && questionProgress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 mt-6"
        >
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">{questionProgress.attempted}</div>
            <div className="text-xs">Answered</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">{questionProgress.total - questionProgress.attempted}</div>
            <div className="text-xs">Remaining</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {Math.round((questionProgress.attempted / questionProgress.total) * 100)}%
            </div>
            <div className="text-xs">Progress</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
