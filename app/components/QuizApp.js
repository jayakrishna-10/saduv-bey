// app/components/QuizApp.js - Fixed with proper exports and minimalist design
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Link from 'next/link';
import { Settings, Lightbulb, ArrowRight, CheckCircle, Clock, Target, TrendingUp, RotateCcw, Play, Home, BarChart3 } from 'lucide-react';

// Paper configuration
const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit'
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    description: 'Energy Efficiency in Thermal Utilities'
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities'
  }
};

const normalizeChapterName = (chapter) => {
  if (!chapter) return '';
  return chapter
    .replace(/['"]/g, '')
    .trim()
    .replace(/Act,?\s+(\d{4})/g, 'Act $1')
    .replace(/\s+/g, ' ')
    .replace(/\s+and\s+/g, ' and ')
    .replace(/^Chapter\s+/i, '')
    .replace(/^chapter_/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeOptionText = (text) => {
  if (!text) return '';
  let normalizedText = text.replace(/['"]/g, '').trim();
  return normalizedText.charAt(0).toUpperCase() + normalizedText.slice(1);
};

export function QuizApp() {
  const [selectedPaper, setSelectedPaper] = useState('paper1');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showModifyQuiz, setShowModifyQuiz] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [topics, setTopics] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [completedQuestionIds, setCompletedQuestionIds] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [questionProgress, setQuestionProgress] = useState({ total: 0, attempted: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(null);

  // Mouse tracking for subtle animations
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

  useEffect(() => {
    fetchQuestions();
    fetchTopicsAndYears();
  }, [selectedPaper]);

  useEffect(() => {
    if (questions.length > 0) {
      updateProgress();
    }
  }, [questions, completedQuestionIds]);

  const fetchTopicsAndYears = async () => {
    try {
      const response = await fetch(`/api/quiz?paper=${selectedPaper}&limit=1000`);
      if (response.ok) {
        const result = await response.json();
        const sampleQuestions = result.questions || [];
        
        const uniqueTopics = [...new Set(sampleQuestions.map(q => normalizeChapterName(q.tag)))].filter(Boolean).sort();
        const uniqueYears = [...new Set(sampleQuestions.map(q => Number(q.year)))].filter(year => !isNaN(year)).sort((a, b) => a - b);
        
        setTopics(uniqueTopics);
        setYears(uniqueYears);
      }
    } catch (error) {
      console.error('Error fetching topics and years:', error);
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(new Date());
    }
  }, [questions]);

  const updateProgress = () => {
    const totalQuestions = questions.length;
    const attemptedQuestions = questions.filter(q => completedQuestionIds.has(q.main_id || q.id)).length;
    setQuestionProgress({
      total: totalQuestions,
      attempted: attemptedQuestions
    });

    if (attemptedQuestions === totalQuestions && totalQuestions > 0) {
      setShowCompletionModal(true);
    }
  };

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching questions from API for paper:', selectedPaper);
      
      const params = new URLSearchParams({
        paper: selectedPaper,
        limit: '1000'
      });

      if (selectedTopic !== 'all') {
        params.append('topic', selectedTopic);
      }
      if (selectedYear !== 'all') {
        params.append('year', selectedYear);
      }

      const response = await fetch(`/api/quiz?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API response:', result);
      
      const normalizedData = result.questions?.map(q => ({
        ...q,
        option_a: normalizeOptionText(q.option_a),
        option_b: normalizeOptionText(q.option_b),
        option_c: normalizeOptionText(q.option_c),
        option_d: normalizeOptionText(q.option_d)
      })) || [];
      
      const shuffledQuestions = [...normalizedData].sort(() => Math.random() - 0.5);
      
      setQuestions(shuffledQuestions);
      setCompletedQuestionIds(new Set());
      setAnsweredQuestions([]);
      
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowAnswer(false);
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch questions error:', err);
      setIsLoading(false);
    }
  };

  const fetchExplanation = async (questionId) => {
    setIsLoadingExplanation(true);
    try {
      console.log('Fetching explanation for questionId:', questionId);
      
      if (!questionId) {
        throw new Error('No question ID provided');
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/nce-resources/${questionId}.md`
      );
      if (!response.ok) throw new Error('Failed to fetch explanation');
      const text = await response.text();
      setExplanation(text);
    } catch (err) {
      console.error('Error fetching explanation:', err);
      setExplanation('Failed to load explanation.');
    }
    setIsLoadingExplanation(false);
  };

  const handleGetAnswer = () => {
    if (showAnswer || showFeedback || isTransitioning) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    console.log('Current question:', currentQuestion);
    console.log('Question ID being used:', questionId);
    
    setShowAnswer(true);
    setShowFeedback(true);
    fetchExplanation(questionId);
    setCompletedQuestionIds(prev => new Set([...prev, questionId]));
    setAnsweredQuestions(prev => [...prev, {
      questionId: questionId,
      question: currentQuestion.question_text,
      selectedOption: null,
      correctOption: currentQuestion.correct_answer,
      isCorrect: false,
      chapter: normalizeChapterName(currentQuestion.tag),
      timestamp: new Date()
    }]);
  };

  const handleOptionSelect = async (option) => {
    if (selectedOption || isTransitioning || showAnswer || showFeedback) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    setAnsweredQuestions(prev => [...prev, {
      questionId: questionId,
      question: currentQuestion.question_text,
      selectedOption: option,
      correctOption: currentQuestion.correct_answer,
      isCorrect,
      chapter: normalizeChapterName(currentQuestion.tag),
      timestamp: new Date()
    }]);

    setCompletedQuestionIds(prev => new Set([...prev, questionId]));

    await fetchExplanation(questionId);
  };

  const handleModifyQuiz = () => {
    setShowModifyQuiz(false);
    setCompletedQuestionIds(new Set());
    setAnsweredQuestions([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setExplanation('');
    fetchQuestions();
  };

  const handleNextQuestion = () => {
    setIsTransitioning(true);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setExplanation('');
    
    setTimeout(() => {
      const availableQuestions = questions.filter(q => 
        !completedQuestionIds.has(q.main_id || q.id)
      );
      
      if (availableQuestions.length === 0) {
        setShowCompletionModal(true);
        setIsTransitioning(false);
        return;
      }

      let nextQuestion = null;
      let nextIndex = -1;
      
      for (let i = 1; i <= questions.length; i++) {
        const checkIndex = (currentQuestionIndex + i) % questions.length;
        const question = questions[checkIndex];
        
        if (!completedQuestionIds.has(question.main_id || question.id)) {
          nextQuestion = question;
          nextIndex = checkIndex;
          break;
        }
      }
      
      if (nextQuestion) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setShowCompletionModal(true);
      }
      
      setIsTransitioning(false);
    }, 100);
  };

  const resetFilters = () => {
    setSelectedTopic('all');
    setSelectedYear('all');
    setShowCompletionModal(false);
    fetchQuestions();
  };

  const isCorrectAnswer = (option, correctAnswer) => {
    return option === correctAnswer || 
           option.toLowerCase() === correctAnswer || 
           option.toUpperCase() === correctAnswer;
  };

  const getOptionClass = (option) => {
    if (!showFeedback && !showAnswer) {
      return "bg-white/70 hover:bg-white/90 border-gray-200/50 hover:border-gray-300/50 text-gray-700 hover:text-gray-900";
    }

    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    const isSelected = selectedOption === option;

    if (isCorrect) {
      return "bg-emerald-100 border-emerald-300 text-emerald-800";
    }
    if (isSelected && !isCorrect) {
      return "bg-red-100 border-red-300 text-red-800";
    }
    return "bg-gray-100 border-gray-200 text-gray-600";
  };

  const generateSummary = () => {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    const totalAnswered = answeredQuestions.length;
    const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
    const incorrectAnswers = totalAnswered - correctAnswers;
    const score = Math.round((correctAnswers / totalAnswered) * 100);

    const chapterPerformance = answeredQuestions.reduce((acc, q) => {
      const normalizedChapter = normalizeChapterName(q.chapter);
      
      if (!acc[normalizedChapter]) {
        acc[normalizedChapter] = { total: 0, correct: 0 };
      }
      acc[normalizedChapter].total += 1;
      if (q.isCorrect) acc[normalizedChapter].correct += 1;
      return acc;
    }, {});

    return {
      timeTaken,
      totalAnswered,
      correctAnswers,
      incorrectAnswers,
      score,
      chapterPerformance
    };
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans relative overflow-hidden flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 text-sm">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

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
            <Link href="/nce" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Home className="h-5 w-5" />
              <span className="font-medium">NCE Home</span>
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <h1 className="text-xl font-light text-gray-900">Practice Quiz</h1>
            <span className="px-3 py-1 bg-white/50 text-gray-600 text-sm rounded-full">
              {PAPERS[selectedPaper]?.name}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Target className="h-4 w-4" />
              Progress: {questionProgress.attempted}/{questionProgress.total}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModifyQuiz(true)}
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
              animate={{ width: `${((questionProgress.attempted) / questionProgress.total) * 100}%` }}
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
              key={`${currentQuestionIndex}-${currentQuestion.main_id || currentQuestion.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 md:p-12 mb-8"
            >
              {/* Question */}
              {isTransitioning ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600 text-sm">Loading next question...</p>
                </div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed mb-4">
                      {currentQuestion.question_text}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Chapter: {normalizeChapterName(currentQuestion.tag)}</span>
                      <span>Year: {currentQuestion.year}</span>
                    </div>
                  </motion.div>

                  {/* Options */}
                  <div className="space-y-4 mb-8">
                    {['a', 'b', 'c', 'd'].map((option, index) => (
                      <motion.button
                        key={option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        onClick={() => handleOptionSelect(option)}
                        disabled={showAnswer || isTransitioning}
                        whileHover={selectedOption === null && !isTransitioning ? { scale: 1.01, x: 4 } : {}}
                        whileTap={selectedOption === null && !isTransitioning ? { scale: 0.99 } : {}}
                        className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 backdrop-blur-sm ${getOptionClass(option)} ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                            selectedOption === option 
                              ? (isCorrectAnswer(option, currentQuestion.correct_answer) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-red-500 text-white border-red-500')
                              : isCorrectAnswer(option, currentQuestion.correct_answer) && showFeedback
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'border-current'
                          }`}>
                            {option.toUpperCase()}
                          </div>
                          <span className="flex-1 text-lg">{currentQuestion[`option_${option}`]}</span>
                          {showFeedback && isCorrectAnswer(option, currentQuestion.correct_answer) && (
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {/* Explanation */}
              <AnimatePresence>
                {(showFeedback || showAnswer) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                  >
                    <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-medium text-indigo-900 mb-2">Explanation</h3>
                          {isLoadingExplanation ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                              <span className="text-indigo-800 text-sm">Loading explanation...</span>
                            </div>
                          ) : (
                            <div className="text-indigo-800 leading-relaxed">
                              <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {explanation}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                {answeredQuestions.length > 0 && (
                  <motion.button
                    onClick={() => setShowSummary(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full transition-all font-medium"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Summary
                  </motion.button>
                )}
                
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleGetAnswer}
                    disabled={showFeedback || showAnswer || isTransitioning}
                    whileHover={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 1.05 }}
                    whileTap={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium ${
                      (showFeedback || showAnswer || isTransitioning)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                    }`}
                  >
                    <Lightbulb className="h-4 w-4" />
                    Show Answer
                  </motion.button>
                  
                  <motion.button
                    onClick={handleNextQuestion}
                    disabled={isTransitioning}
                    whileHover={{ scale: isTransitioning ? 1 : 1.05 }}
                    whileTap={{ scale: isTransitioning ? 1 : 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium ${
                      isTransitioning 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {isTransitioning ? 'Loading...' : 'Next Question'}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 text-center">
              <Target className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <div className="text-2xl font-light text-gray-900 mb-1">{questionProgress.attempted}/{questionProgress.total}</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            
            <div className="p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-light text-gray-900 mb-1">{answeredQuestions.filter(q => q.isCorrect).length}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            
            <div className="p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 text-center">
              <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
              <div className="text-2xl font-light text-gray-900 mb-1">
                {answeredQuestions.length > 0 ? Math.round((answeredQuestions.filter(q => q.isCorrect).length / answeredQuestions.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Modals would go here - keeping existing modal logic */}
      {/* Settings Modal */}
      <AnimatePresence>
        {showModifyQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200/50"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-light text-gray-900 mb-2">Quiz Settings</h2>
                <p className="text-gray-600 text-sm">Customize your practice session</p>
              </div>

              {/* Paper Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Select Paper</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.values(PAPERS).map((paper) => (
                    <motion.button
                      key={paper.id}
                      onClick={() => setSelectedPaper(paper.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-4 rounded-2xl text-left transition-all duration-300 border-2 ${
                        selectedPaper === paper.id
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                          : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-white/70'
                      }`}
                    >
                      <div className="font-medium text-sm">{paper.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{paper.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Topic Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Filter by Topic</h3>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-white/50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-700 text-sm focus:outline-none focus:border-indigo-300"
                >
                  <option value="all">All Topics</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              {/* Year Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Filter by Year</h3>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-white/50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-700 text-sm focus:outline-none focus:border-indigo-300"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowModifyQuiz(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-all font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleModifyQuiz}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-all font-medium"
                >
                  Apply Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200/50"
            >
              {(() => {
                const summary = generateSummary();
                return (
                  <div className="space-y-6">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center"
                      >
                        <span className="text-2xl font-light text-white">{summary.score}%</span>
                      </motion.div>
                      
                      <h2 className="text-2xl font-light text-gray-900 mb-2">Practice Session Complete</h2>
                      <p className="text-gray-600 mb-6">
                        You scored {summary.correctAnswers} out of {summary.totalAnswered} questions
                      </p>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-emerald-50 rounded-2xl">
                        <div className="text-2xl font-light text-emerald-700 mb-1">{summary.correctAnswers}</div>
                        <div className="text-sm text-emerald-600">Correct</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-2xl">
                        <div className="text-2xl font-light text-red-700 mb-1">{summary.incorrectAnswers}</div>
                        <div className="text-sm text-red-600">Incorrect</div>
                      </div>
                    </div>

                    {/* Chapter Performance */}
                    {Object.keys(summary.chapterPerformance).length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Chapter Performance</h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {Object.entries(summary.chapterPerformance).map(([chapter, stats], idx) => (
                            <div key={chapter} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                              <span className="text-gray-700 text-sm truncate flex-1 mr-2">{chapter}</span>
                              <span className="font-medium text-gray-900 text-sm">
                                {Math.round((stats.correct / stats.total) * 100)}% 
                                <span className="text-gray-500 ml-1">({stats.correct}/{stats.total})</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Close Button */}
                    <motion.button
                      onClick={() => setShowSummary(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-all"
                    >
                      Continue Learning
                    </motion.button>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 max-w-sm w-full border border-gray-200/50"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-xl font-light text-gray-900 mb-3">All Questions Completed!</h2>
                <p className="text-gray-600 text-sm mb-6">
                  You have attempted all available questions. Try different topics or years for fresh questions.
                </p>
                <div className="space-y-3">
                  <motion.button
                    onClick={resetFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-all"
                  >
                    Try Other Topics/Years
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setShowCompletionModal(false);
                      setShowSummary(true);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-full transition-all"
                  >
                    View Summary
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
