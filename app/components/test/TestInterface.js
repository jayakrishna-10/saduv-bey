// app/components/test/TestInterface.js
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid3x3, 
  MoreHorizontal, 
  Target, 
  Flag, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { TestTimer } from './TestTimer';
import { QuestionPalette } from './QuestionPalette';
import { getTestMode, getTestType } from '@/lib/test-utils';
import { normalizeChapterName } from '@/lib/quiz-utils';

export function TestInterface({ 
  config, 
  testData, 
  setTestData, 
  onSubmit, 
  showPalette, 
  setShowPalette, 
  showMobileStats, 
  setShowMobileStats 
}) {
  const currentQuestion = testData.questions[testData.currentIndex];
  const testMode = getTestMode(config.mode);
  const testType = getTestType(config.type);
  const isTimerEnabled = testMode?.timer || false;

  // Timer effect
  useEffect(() => {
    if (!isTimerEnabled || testData.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTestData(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        if (newTimeRemaining <= 0) {
          onSubmit();
          return prev;
        }
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerEnabled, testData.timeRemaining, onSubmit, setTestData]);

  const selectAnswer = (option) => {
    setTestData(prev => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentIndex]: option }
    }));
  };

  const navigateToQuestion = (index) => {
    setTestData(prev => ({
      ...prev,
      currentIndex: index,
      visited: new Set([...prev.visited, index])
    }));
  };

  const toggleFlag = () => {
    setTestData(prev => {
      const newFlagged = new Set(prev.flagged);
      if (newFlagged.has(prev.currentIndex)) {
        newFlagged.delete(prev.currentIndex);
      } else {
        newFlagged.add(prev.currentIndex);
      }
      return { ...prev, flagged: newFlagged };
    });
  };

  const answeredCount = Object.keys(testData.answers).length;
  const progressPercentage = (answeredCount / testData.questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative"
    >
      {/* Mobile-Optimized Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        
        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-light text-gray-900 dark:text-gray-100">
                  {testType?.name} - {testMode?.name}
                </h1>
                {isTimerEnabled && (
                  <TestTimer timeRemaining={testData.timeRemaining} totalTime={config.timeLimit * 60} />
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">
                  {answeredCount}/{testData.questions.length} answered
                </div>
                
                <button
                  onClick={() => setShowPalette(!showPalette)}
                  className="p-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 rounded-lg transition-colors border border-gray-200/50 dark:border-gray-700/50"
                  title="Question Palette"
                >
                  <Grid3x3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
                
                <motion.button
                  onClick={onSubmit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200"
                >
                  Submit Test
                </motion.button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{testType?.name}</h1>
              <span className="text-sm text-gray-600 dark:text-gray-400">{testData.currentIndex + 1}/{testData.questions.length}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile Timer */}
              {isTimerEnabled && (
                <TestTimer timeRemaining={testData.timeRemaining} totalTime={config.timeLimit * 60} mobile />
              )}
              
              {/* Mobile Stats Toggle */}
              <button 
                onClick={() => setShowMobileStats(!showMobileStats)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              
              <motion.button
                onClick={onSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200"
              >
                Submit
              </motion.button>
            </div>
          </div>

          {/* Expandable Mobile Stats */}
          <AnimatePresence>
            {showMobileStats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">Answered: {answeredCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flag className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-gray-700 dark:text-gray-300">Flagged: {testData.flagged.size}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Progress: {Math.round(progressPercentage)}%
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200/50 dark:bg-gray-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Question Palette Sidebar */}
        <AnimatePresence>
          {showPalette && (
            <QuestionPalette
              questions={testData.questions}
              currentIndex={testData.currentIndex}
              answers={testData.answers}
              flagged={testData.flagged}
              visited={testData.visited}
              onNavigate={navigateToQuestion}
              onClose={() => setShowPalette(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={testData.currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-12 mb-8"
            >
              {/* Mobile Question Header */}
              <div className="flex items-center gap-2 mb-4 md:hidden">
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                  Q{testData.currentIndex + 1}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{currentQuestion?.year}</span>
                {testData.flagged.has(testData.currentIndex) && (
                  <Flag className="h-3 w-3 text-yellow-500" />
                )}
              </div>

              {/* Desktop Question Header */}
              <div className="hidden md:flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/70 dark:bg-gray-800/70 rounded-full text-gray-900 dark:text-gray-100 font-medium text-sm border border-gray-200/50 dark:border-gray-700/50">
                    Q{testData.currentIndex + 1}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {normalizeChapterName(currentQuestion?.tag)} • {currentQuestion?.year}
                  </span>
                </div>
              </div>

              {/* Desktop Navigation and Flag Controls */}
              <div className="hidden md:flex items-center justify-between mb-6">
                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    testData.flagged.has(testData.currentIndex)
                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600'
                      : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
                  }`}
                >
                  <Flag className="h-4 w-4" />
                  {testData.flagged.has(testData.currentIndex) ? 'Flagged' : 'Flag Question'}
                </button>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateToQuestion(Math.max(0, testData.currentIndex - 1))}
                    disabled={testData.currentIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      testData.currentIndex === 0
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <span className="text-gray-600 dark:text-gray-400 text-sm px-3">
                    {testData.currentIndex + 1} of {testData.questions.length}
                  </span>
                  
                  <button
                    onClick={() => navigateToQuestion(Math.min(testData.questions.length - 1, testData.currentIndex + 1))}
                    disabled={testData.currentIndex === testData.questions.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      testData.currentIndex === testData.questions.length - 1
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Question */}
              <h2 className="text-lg md:text-xl lg:text-2xl font-light text-gray-900 dark:text-gray-100 mb-6 md:mb-8 leading-relaxed">
                {currentQuestion?.question_text}
              </h2>

              {/* Mobile Chapter Info */}
              <p className="text-xs text-gray-500 dark:text-gray-400 md:hidden mb-6">
                {normalizeChapterName(currentQuestion?.tag)}
              </p>

              {/* Options */}
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {['a', 'b', 'c', 'd'].map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => selectAnswer(option)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all duration-300 text-left min-h-[56px] md:min-h-[auto] touch-manipulation ${
                      testData.answers[testData.currentIndex] === option
                        ? 'bg-white dark:bg-gray-700 border-indigo-300 dark:border-indigo-600 shadow-lg'
                        : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                        testData.answers[testData.currentIndex] === option
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}>
                        {option.toUpperCase()}
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 flex-1 text-sm md:text-base">{currentQuestion?.[`option_${option}`]}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              title="Question Palette"
            >
              <Grid3x3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={toggleFlag}
              className={`p-3 rounded-xl transition-colors ${
                testData.flagged.has(testData.currentIndex)
                  ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              title="Flag Question"
            >
              <Flag className="h-5 w-5" />
            </button>
          </div>

          {/* Center Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToQuestion(Math.max(0, testData.currentIndex - 1))}
              disabled={testData.currentIndex === 0}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${
                testData.currentIndex === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            
            <button
              onClick={() => navigateToQuestion(Math.min(testData.questions.length - 1, testData.currentIndex + 1))}
              disabled={testData.currentIndex === testData.questions.length - 1}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${
                testData.currentIndex === testData.questions.length - 1
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right Space for balance */}
          <div className="w-16" />
        </div>
      </div>
    </motion.div>
  );
}