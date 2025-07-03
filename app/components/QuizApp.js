// app/components/QuizApp.js - Redesigned with minimalist geometric style
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Lightbulb, ArrowRight, CheckCircle, Clock, Target, TrendingUp, RotateCcw, Play } from 'lucide-react';

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Sample question data - in real app this would come from API
  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of energy auditing in industrial facilities?",
      options: [
        "To reduce electricity bills only",
        "To identify energy saving opportunities and improve efficiency",
        "To comply with environmental regulations",
        "To increase production capacity"
      ],
      correct: 1,
      explanation: "Energy auditing is a systematic approach to identify energy saving opportunities, improve efficiency, and optimize energy consumption across all systems in a facility."
    },
    {
      id: 2,
      question: "Which of the following is NOT a type of energy audit?",
      options: [
        "Preliminary audit",
        "Detailed audit", 
        "Investment grade audit",
        "Compliance audit"
      ],
      correct: 3,
      explanation: "The three main types of energy audits are Preliminary (Walk-through), Detailed (General), and Investment Grade audits. Compliance audit is not a standard energy audit type."
    }
  ];

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === currentQ.correct) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
  };

  const getOptionClassName = (index) => {
    if (selectedAnswer === null) {
      return "bg-white/70 hover:bg-white/90 border-gray-200/50 hover:border-gray-300/50 text-gray-700 hover:text-gray-900";
    }
    
    if (index === currentQ.correct) {
      return "bg-emerald-100 border-emerald-300 text-emerald-800";
    }
    
    if (index === selectedAnswer && index !== currentQ.correct) {
      return "bg-red-100 border-red-300 text-red-800";
    }
    
    return "bg-gray-100 border-gray-200 text-gray-600";
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-40 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 opacity-30 blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="relative z-50 px-8 py-6 bg-white/30 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-light text-gray-900">NCE Practice Quiz</h1>
            <span className="px-3 py-1 bg-white/50 text-gray-600 text-sm rounded-full">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Target className="h-4 w-4" />
              Score: {score.correct}/{score.total}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/70 hover:bg-white/90 rounded-lg border border-gray-200/50 transition-all"
            >
              <Settings className="h-5 w-5 text-gray-700" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="relative z-40 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 md:p-12"
            >
              {/* Question */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed">
                  {currentQ.question}
                </h2>
              </motion.div>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.01, x: 4 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 backdrop-blur-sm ${getOptionClassName(index)}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                        selectedAnswer === index 
                          ? (index === currentQ.correct ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-red-500 text-white border-red-500')
                          : index === currentQ.correct && selectedAnswer !== null
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'border-current'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1 text-lg">{option}</span>
                      {selectedAnswer !== null && index === currentQ.correct && (
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                  >
                    <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-indigo-900 mb-2">Explanation</h3>
                          <p className="text-indigo-800 leading-relaxed">{currentQ.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetQuiz}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-all font-medium"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Quiz
                </motion.button>

                {currentQuestion < questions.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    disabled={!showExplanation}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium ${
                      showExplanation
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next Question
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                ) : showExplanation ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-200"
                  >
                    <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                    <h3 className="text-xl font-light text-emerald-900 mb-2">Quiz Complete!</h3>
                    <p className="text-emerald-800 mb-4">
                      You scored {score.correct} out of {score.total} questions
                    </p>
                    <div className="flex gap-3 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetQuiz}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all font-medium"
                      >
                        <Play className="h-4 w-4" />
                        Try Again
                      </motion.button>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div className="p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 text-center">
              <Target className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <div className="text-2xl font-light text-gray-900 mb-1">{score.correct}/{score.total}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            
            <div className="p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-light text-gray-900 mb-1">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            
            <div className="p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 text-center">
              <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
              <div className="text-2xl font-light text-gray-900 mb-1">
                {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
