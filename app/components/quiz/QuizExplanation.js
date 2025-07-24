// app/components/quiz/QuizExplanation.js - Mobile optimized with improved readability
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Calculator,
  Target,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import { ExplanationDisplay } from '../ExplanationDisplay';

export function QuizExplanation({
  isVisible = false,
  isExpanded = false,
  onToggleExpanded,
  isLoading = false,
  explanation,
  questionText,
  options,
  correctAnswer,
  userAnswer
}) {
  const [localExpanded, setLocalExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [showDetailed, setShowDetailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef(null);
  const [feedback, setFeedback] = useState(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isExpanded !== localExpanded) {
      setLocalExpanded(isExpanded);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [explanation, showDetailed]);

  const handleToggleExpanded = () => {
    const newExpanded = !localExpanded;
    setLocalExpanded(newExpanded);
    onToggleExpanded?.(newExpanded);
  };

  const handleFeedback = (isHelpful) => {
    setFeedback(isHelpful ? 'helpful' : 'not-helpful');
    // Here you could send feedback to your analytics system
  };

  const getResultIcon = () => {
    if (!userAnswer) return <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />;
    if (userAnswer === correctAnswer) return <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />;
    return <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />;
  };

  const getResultText = () => {
    if (!userAnswer) return "Answer revealed";
    if (userAnswer === correctAnswer) return "Correct!";
    return "Incorrect";
  };

  const getResultColor = () => {
    if (!userAnswer) return "text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700";
    if (userAnswer === correctAnswer) return "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700";
    return "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700";
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="border-t border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
      >
        {/* Header Bar - Mobile optimized */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-3 md:p-4 border-b border-gray-200/30 dark:border-gray-700/30 ${getResultColor()}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="flex-shrink-0"
              >
                {getResultIcon()}
              </motion.div>
              
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm md:text-base">{getResultText()}</div>
                {userAnswer && (
                  <div className="text-xs md:text-sm opacity-90 truncate">
                    Your answer: {userAnswer?.toUpperCase()} • Correct: {correctAnswer?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              {!isLoading && explanation && (
                <motion.button
                  onClick={() => setShowDetailed(!showDetailed)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-lg transition-all"
                >
                  {showDetailed ? (
                    <>
                      <EyeOff className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="text-xs md:text-sm hidden sm:inline">Less</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="text-xs md:text-sm hidden sm:inline">More</span>
                    </>
                  )}
                </motion.button>
              )}

              <motion.button
                onClick={handleToggleExpanded}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 md:p-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-lg transition-all"
              >
                <motion.div
                  animate={{ rotate: localExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content Area - Mobile optimized */}
        <AnimatePresence>
          {localExpanded && (
            <motion.div
              ref={contentRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-3 md:p-6 bg-white/50 dark:bg-gray-800/50 overflow-hidden">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-6 md:py-8"
                  >
                    <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-indigo-600 dark:text-indigo-400 mr-3" />
                    <span className="text-sm md:text-base text-gray-600 dark:text-gray-400">Loading explanation...</span>
                  </motion.div>
                ) : explanation ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-full overflow-hidden"
                  >
                    {showDetailed ? (
                      <ExplanationDisplay
                        explanationData={explanation}
                        questionText={questionText}
                        options={options}
                        correctAnswer={correctAnswer}
                        userAnswer={userAnswer}
                      />
                    ) : (
                      <QuickExplanation
                        explanation={explanation}
                        options={options}
                        correctAnswer={correctAnswer}
                        userAnswer={userAnswer}
                        onShowDetailed={() => setShowDetailed(true)}
                        isMobile={isMobile}
                      />
                    )}

                    {/* Feedback Section - Mobile optimized */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          Was this explanation helpful?
                        </span>
                        
                        <div className="flex items-center gap-1 md:gap-2">
                          <motion.button
                            onClick={() => handleFeedback(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-1.5 md:p-2 rounded-lg transition-all ${
                              feedback === 'helpful'
                                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3 md:h-4 md:w-4" />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleFeedback(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-1.5 md:p-2 rounded-lg transition-all ${
                              feedback === 'not-helpful'
                                ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <ThumbsDown className="h-3 w-3 md:h-4 md:w-4" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {feedback && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-400"
                          >
                            {feedback === 'helpful' 
                              ? "Thank you! Your feedback helps us improve." 
                              : "Thank you for your feedback. We'll work on making explanations clearer."}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 md:py-8"
                  >
                    <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      Explanation not available for this question.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

// Quick explanation component for minimal view - Mobile optimized
function QuickExplanation({ explanation, options, correctAnswer, userAnswer, onShowDetailed, isMobile }) {
  const getOptionStatus = (option) => {
    const isCorrect = option === correctAnswer;
    const isUserAnswer = option === userAnswer;
    
    if (isCorrect) return 'correct';
    if (isUserAnswer && !isCorrect) return 'incorrect';
    return 'neutral';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct': return 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300';
      case 'incorrect': return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300';
      default: return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'correct': return <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />;
      case 'incorrect': return <XCircle className="h-3 w-3 md:h-4 md:w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-3 md:space-y-4 max-w-full overflow-hidden">
      {/* Quick Answer Summary - Mobile optimized */}
      {explanation?.explanation?.correct_answer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 md:p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl md:rounded-2xl border border-indigo-200 dark:border-indigo-700"
        >
          <div className="flex items-start gap-2 md:gap-3">
            <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-indigo-900 dark:text-indigo-100 font-medium mb-1 text-sm md:text-base">
                Correct Answer: {correctAnswer?.toUpperCase()}
              </p>
              <p className="text-indigo-800 dark:text-indigo-200 text-xs md:text-sm leading-relaxed break-words">
                {explanation.explanation.correct_answer.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Option Analysis (Simplified) - Mobile optimized */}
      <div className="space-y-2">
        <h4 className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Target className="h-3 w-3 md:h-4 md:w-4 text-indigo-600 dark:text-indigo-400" />
          Quick Option Review
        </h4>
        
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {['a', 'b', 'c', 'd'].map((option) => {
            const status = getOptionStatus(option);
            const optionData = explanation?.explanation?.incorrect_options?.[`option_${option}`];
            
            return (
              <motion.div
                key={option}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * parseInt(option.charCodeAt(0) - 97) }}
                className={`p-2 md:p-3 rounded-lg md:rounded-xl border-2 transition-all ${getStatusColor(status)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/70 dark:bg-gray-700/70 flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {option.toUpperCase()}
                  </div>
                  {getStatusIcon(status)}
                  <span className="text-xs font-medium truncate">
                    {status === 'correct' ? 'Correct' : status === 'incorrect' ? 'Your choice' : ''}
                  </span>
                </div>
                
                <p className="text-xs leading-relaxed line-clamp-2 break-words mb-1">
                  {options[`option_${option}`]}
                </p>
                
                {status === 'incorrect' && optionData?.why_wrong && (
                  <p className="text-xs mt-1 opacity-75 italic break-words">
                    {optionData.why_wrong}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Key Learning Points - Mobile optimized */}
      {explanation?.explanation?.study_tips?.focus_areas && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3 md:p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl md:rounded-2xl border border-emerald-200 dark:border-emerald-700"
        >
          <h5 className="text-sm md:text-base font-medium text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
            <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
            Key Learning Points
          </h5>
          <ul className="text-xs md:text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
            {explanation.explanation.study_tips.focus_areas.slice(0, 2).map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                <span className="break-words">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Show More Button - Mobile optimized */}
      <motion.button
        onClick={onShowDetailed}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full p-2 md:p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
      >
        <Layers className="h-3 w-3 md:h-4 md:w-4" />
        <span className="text-xs md:text-sm font-medium">Show Detailed Explanation</span>
      </motion.button>
    </div>
  );
}
