// FILE: app/components/test/TestReview.js
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle, XCircle, Flag } from 'lucide-react';
import { QuizExplanation } from '../quiz/QuizExplanation';
import { normalizeChapterName } from '@/lib/quiz-utils';
import { TestReviewNavigation } from './TestReviewNavigation';

export function TestReview({ questions, answers, flaggedQuestions, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const currentQuestionId = currentQuestion.main_id || currentQuestion.id;
  const userAnswer = answers[currentQuestionId];

  const getOptionClass = (option) => {
    const isCorrect = option === currentQuestion.correct_answer;
    const isUserChoice = option === userAnswer;

    if (isCorrect) {
      return "bg-emerald-100/90 dark:bg-emerald-900/60 border-emerald-300/80 dark:border-emerald-600/80 text-emerald-800 dark:text-emerald-200";
    }
    if (isUserChoice && !isCorrect) {
      return "bg-red-100/90 dark:bg-red-900/60 border-red-300/80 dark:border-red-600/80 text-red-800 dark:text-red-200";
    }
    return "bg-gray-100/80 dark:bg-gray-700/80 border-gray-200/60 dark:border-gray-600/60 text-gray-600 dark:text-gray-400 opacity-75";
  };
  
  const getOptionIcon = (option) => {
    const isCorrect = option === currentQuestion.correct_answer;
    const isUserChoice = option === userAnswer;

    if (isCorrect) return <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
    if (isUserChoice && !isCorrect) return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-50 flex flex-col font-sans">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Test Review</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
        </div>
        <motion.button whileHover={{ scale: 1.1 }} onClick={onExit} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X /></motion.button>
      </header>
      
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl p-8 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                                Question {currentIndex + 1}
                                {flaggedQuestions.has(currentQuestionId) && <Flag className="inline-block h-4 w-4 ml-2 text-yellow-500" />}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{normalizeChapterName(currentQuestion.tag)}</p>
                        </div>

                        <p className="text-xl text-gray-800 dark:text-gray-200 mb-8 leading-relaxed">{currentQuestion.question_text}</p>
                        
                        <div className="space-y-4">
                            {['a', 'b', 'c', 'd'].map(opt => (
                                <div key={opt} className={`p-4 rounded-xl border-2 flex items-center justify-between ${getOptionClass(opt)}`}>
                                    <span>{opt.toUpperCase()}. {currentQuestion[`option_${opt}`]}</span>
                                    {getOptionIcon(opt)}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <QuizExplanation
                        isVisible={true}
                        isExpanded={true}
                        explanation={currentQuestion.explanation}
                        questionText={currentQuestion.question_text}
                        options={{
                            option_a: currentQuestion.option_a,
                            option_b: currentQuestion.option_b,
                            option_c: currentQuestion.option_c,
                            option_d: currentQuestion.option_d
                        }}
                        correctAnswer={currentQuestion.correct_answer}
                        userAnswer={userAnswer}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      <TestReviewNavigation
        onPrevious={() => setCurrentIndex(p => Math.max(0, p - 1))}
        onNext={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
        onFinishReview={onExit}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < questions.length - 1}
      />
    </div>
  );
}
