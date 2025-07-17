// FILE: app/components/test/TestReview.js
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { TestQuestion } from './TestQuestion';
import { QuizExplanation } from '../quiz/QuizExplanation';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TestReview({ questions, answers, flaggedQuestions, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const currentQuestionId = currentQuestion.main_id || currentQuestion.id;
  const userAnswer = answers[currentQuestionId];

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 flex flex-col">
      <header className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Test Review</h2>
        <button onClick={onExit} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X /></button>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Question List */}
        <aside className="w-1/4 hidden md:block border-r border-gray-200 dark:border-gray-700">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              {questions.map((q, index) => {
                const qId = q.main_id || q.id;
                const isCorrect = answers[qId] === q.correct_answer;
                const isAnswered = qId in answers;
                return (
                  <button key={qId} onClick={() => setCurrentIndex(index)} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${currentIndex === index ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                    <span className="truncate">Q{index + 1}: {q.question_text}</span>
                    <div className="flex items-center gap-2">
                      {flaggedQuestions.has(qId) && <Flag className="h-4 w-4 text-yellow-500" />}
                      {isAnswered ? (isCorrect ? <div className="w-3 h-3 rounded-full bg-green-500" /> : <div className="w-3 h-3 rounded-full bg-red-500" />) : <div className="w-3 h-3 rounded-full bg-gray-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">Question {currentIndex + 1}</p>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">{currentQuestion.question_text}</p>
                
                <div className="space-y-3">
                  {['a', 'b', 'c', 'd'].map(opt => {
                    const isCorrect = opt === currentQuestion.correct_answer;
                    const isUserChoice = opt === userAnswer;
                    let classes = "border-gray-300 dark:border-gray-600";
                    if(isCorrect) classes = "border-green-500 bg-green-50 dark:bg-green-900/30";
                    if(isUserChoice && !isCorrect) classes = "border-red-500 bg-red-50 dark:bg-red-900/30";
                    
                    return (
                      <div key={opt} className={`p-4 rounded-lg border-2 ${classes}`}>
                        {opt.toUpperCase()}. {currentQuestion[`option_${opt}`]}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <QuizExplanation
                isVisible={true}
                isExpanded={true}
                explanation={{ explanation: currentQuestion.explanation }}
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
        </main>
      </div>

      <footer className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center items-center gap-4">
        <button onClick={() => setCurrentIndex(p => Math.max(0, p - 1))} disabled={currentIndex === 0} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50"><ChevronLeft /> Prev</button>
        <span>{currentIndex + 1} / {questions.length}</span>
        <button onClick={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))} disabled={currentIndex === questions.length - 1} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50">Next <ChevronRight /></button>
      </footer>
    </div>
  );
}
