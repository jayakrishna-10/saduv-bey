'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Link from 'next/link';

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
  const [remainingIndices, setRemainingIndices] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [topics, setTopics] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [completedQuestionIds, setCompletedQuestionIds] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [questionProgress, setQuestionProgress] = useState({ total: 0, attempted: 0 });
  const [particles, setParticles] = useState([]);

  // Generate floating particles for background
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 120 + 60,
      duration: Math.random() * 25 + 20
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    fetchQuestions();
    // Fetch topics and years for dropdowns (this could be optimized with a separate API call)
    fetchTopicsAndYears();
  }, [selectedPaper]);

  useEffect(() => {
    if (questions.length > 0) {
      filterQuestions();
    }
  }, [questions, completedQuestionIds]);

  // Check if current question has been attempted and skip to next available
  useEffect(() => {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    if (currentQuestion && completedQuestionIds.has(currentQuestion.main_id || currentQuestion.id) && !isTransitioning) {
      // Current question has been attempted, find next available
      const availableQuestions = filteredQuestions.filter(q => 
        !completedQuestionIds.has(q.main_id || q.id)
      );
      
      if (availableQuestions.length > 0) {
        // Find the index of the first available question
        for (let i = 0; i < filteredQuestions.length; i++) {
          if (!completedQuestionIds.has(filteredQuestions[i].main_id || filteredQuestions[i].id)) {
            setCurrentQuestionIndex(i);
            break;
          }
        }
      } else {
        setShowCompletionModal(true);
      }
    }
  }, [currentQuestionIndex, filteredQuestions, completedQuestionIds, isTransitioning]);

  const fetchTopicsAndYears = async () => {
    try {
      // Fetch a sample of questions to get available topics and years
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

  const resetRemainingIndices = () => {
    const availableIndices = filteredQuestions
      .map((_, index) => index)
      .filter(index => !completedQuestionIds.has(filteredQuestions[index].main_id || filteredQuestions[index].id));
    setRemainingIndices(availableIndices);
  };

  const filterQuestions = () => {
    // Set up all questions as available initially (they're already shuffled from API)
    setFilteredQuestions(questions);
    
    // Calculate progress based on total questions vs attempted
    const totalQuestions = questions.length;
    const attemptedQuestions = questions.filter(q => completedQuestionIds.has(q.main_id || q.id)).length;
    setQuestionProgress({
      total: totalQuestions,
      attempted: attemptedQuestions
    });
    
    // Find first non-attempted question for current index
    let startIndex = 0;
    for (let i = 0; i < questions.length; i++) {
      if (!completedQuestionIds.has(questions[i].main_id || questions[i].id)) {
        startIndex = i;
        break;
      }
    }
    
    setCurrentQuestionIndex(startIndex);
    
    // Reset question-specific state when new questions are loaded
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setExplanation('');
    setIsTransitioning(false);

    // Check if all questions are completed
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

      // Add filters to API call for more targeted fetching
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
      
      // Shuffle questions since random is always enabled
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

    setQuestionProgress(prev => ({
      ...prev,
      attempted: prev.attempted + 1
    }));
  };

  const handleOptionSelect = async (option) => {
    // Prevent selection if already selected, transitioning, or showing answer
    if (selectedOption || isTransitioning || showAnswer || showFeedback) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    
    // Immediately set the selected option to prevent double-clicking
    setSelectedOption(option);
    setShowFeedback(true);
    
    // Add to answered questions
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
    setQuestionProgress(prev => ({
      ...prev,
      attempted: prev.attempted + 1
    }));

    // Fetch explanation
    await fetchExplanation(questionId);
  };

  const handleModifyQuiz = () => {
    setShowModifyQuiz(false);
    // Reset completed questions when modifying quiz to allow fresh start
    setCompletedQuestionIds(new Set());
    setAnsweredQuestions([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setExplanation('');
    // Trigger a new fetch with updated filters
    fetchQuestions();
  };

  const handleNextQuestion = () => {
    // Start transition and reset question-specific state
    setIsTransitioning(true);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setExplanation('');
    
    // Small delay to ensure clean state transition
    setTimeout(() => {
      // Get truly available questions (not attempted)
      const availableQuestions = filteredQuestions.filter(q => 
        !completedQuestionIds.has(q.main_id || q.id)
      );
      
      if (availableQuestions.length === 0) {
        setShowCompletionModal(true);
        setIsTransitioning(false);
        return;
      }

      // Find next available question
      let nextQuestion = null;
      let nextIndex = -1;
      
      // Start from the question after current one and find first non-attempted
      for (let i = 1; i <= filteredQuestions.length; i++) {
        const checkIndex = (currentQuestionIndex + i) % filteredQuestions.length;
        const question = filteredQuestions[checkIndex];
        
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
    // Fetch fresh questions with reset filters
    fetchQuestions();
  };

  const isCorrectAnswer = (option, correctAnswer) => {
    return option === correctAnswer || 
           option.toLowerCase() === correctAnswer || 
           option.toUpperCase() === correctAnswer;
  };

  const getOptionClass = (option) => {
    if (!showFeedback && !showAnswer) {
      return "bg-white/10 hover:bg-white/20 border-white/20";
    }

    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    const isSelected = selectedOption === option;

    if (isCorrect) {
      return "bg-green-500/30 border-green-400";
    }
    if (isSelected && !isCorrect) {
      return "bg-red-500/30 border-red-400";
    }
    return "bg-white/5 border-white/10";
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

  const currentQuestion = filteredQuestions[currentQuestionIndex] || {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
            />
            <p className="text-white text-lg">Loading quiz questions...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-transparent px-4">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">saduvbey</span>
            </Link>
            <Link
              href="/nce"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white backdrop-blur-sm bg-white/10 rounded-lg border border-white/20"
            >
              NCE Home
            </Link>
          </div>
        </div>
      </header>

      {/* Animated background particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      <div className="relative z-10 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Modify Quiz Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center">
              <div className="text-white/80">
                <span className="text-sm">
                  {PAPERS[selectedPaper].name}
                  {selectedTopic !== 'all' && ` • ${selectedTopic}`}
                  {selectedYear !== 'all' && ` • ${selectedYear}`}
                </span>
              </div>
              <motion.button
                onClick={() => setShowModifyQuiz(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-xl hover:bg-white/15 transition-all duration-300"
              >
                ⚙️ Modify Quiz
              </motion.button>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
              <div className="flex justify-between text-white/80 text-sm mb-3">
                <span>Progress: {questionProgress.attempted} of {questionProgress.total} questions attempted</span>
                <span>Remaining: {questionProgress.total - questionProgress.attempted}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((questionProgress.attempted) / questionProgress.total) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Question Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentQuestionIndex}-${currentQuestion.main_id || currentQuestion.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-8"
            >
              {/* Question */}
              {isTransitioning ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
                  />
                  <p className="text-white/70">Loading next question...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                    {currentQuestion.question_text}
                  </h2>

                  {/* Options */}
                  <div className="space-y-4 mb-8">
                    {['a', 'b', 'c', 'd'].map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        disabled={showAnswer || isTransitioning}
                        whileHover={{ scale: (selectedOption || isTransitioning) ? 1 : 1.02 }}
                        whileTap={{ scale: (selectedOption || isTransitioning) ? 1 : 0.98 }}
                        className={`w-full p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 text-left group ${getOptionClass(option)} ${(isTransitioning) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                            selectedOption === option 
                              ? (isCorrectAnswer(option, currentQuestion.correct_answer) ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                              : 'bg-white/20 text-white group-hover:bg-white/30'
                          }`}>
                            {option.toUpperCase()}
                          </div>
                          <span className="text-white text-lg flex-1">{currentQuestion[`option_${option}`]}</span>
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
                    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                      {isLoadingExplanation ? (
                        <div className="flex items-center justify-center py-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span className="text-white/90 ml-3">Loading explanation...</span>
                        </div>
                      ) : (
                        <div className="explanation-content text-white/90 leading-relaxed">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {explanation}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                {answeredQuestions.length > 0 && (
                  <motion.button
                    onClick={() => setShowSummary(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-200"
                  >
                    📊 View Summary
                  </motion.button>
                )}
                
                <div className="flex gap-3 ml-auto">
                  <motion.button
                    onClick={handleGetAnswer}
                    disabled={showFeedback || showAnswer || isTransitioning}
                    whileHover={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 1.05 }}
                    whileTap={{ scale: (showFeedback || showAnswer || isTransitioning) ? 1 : 0.95 }}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      (showFeedback || showAnswer || isTransitioning)
                        ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg'
                    }`}
                  >
                    💡 Get Answer
                  </motion.button>
                  
                  <motion.button
                    onClick={handleNextQuestion}
                    disabled={isTransitioning}
                    whileHover={{ scale: isTransitioning ? 1 : 1.05 }}
                    whileTap={{ scale: isTransitioning ? 1 : 0.95 }}
                    className={`px-6 py-3 font-semibold rounded-full transition-all duration-200 ${
                      isTransitioning 
                        ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {isTransitioning ? 'Loading...' : 'Next Question →'}
                  </motion.button>
                </div>
              </div>

              {/* Question Info */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-white/70">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <span className="text-white/50">Paper:</span> {PAPERS[selectedPaper].name}
                    </div>
                    <div>
                      <span className="text-white/50">Chapter:</span> {normalizeChapterName(currentQuestion.tag)}
                    </div>
                    <div>
                      <span className="text-white/50">Year:</span> {currentQuestion.year}
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="text-purple-300">🔄 No question repeats in this session</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modify Quiz Modal */}
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
              className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 max-w-2xl w-full border border-white/20"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Modify Quiz Settings</h2>
                <p className="text-white/70">Change your quiz parameters and get fresh questions</p>
              </div>

              {/* Paper Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Select Paper</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.values(PAPERS).map((paper) => (
                    <motion.button
                      key={paper.id}
                      onClick={() => setSelectedPaper(paper.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl text-left transition-all duration-300 backdrop-blur-md border ${
                        selectedPaper === paper.id
                          ? 'bg-white/20 border-white/40 text-white'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                      }`}
                    >
                      <div className="font-semibold">{paper.name}</div>
                      <div className="text-sm text-white/70 mt-1">{paper.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Topic Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Filter by Topic</h3>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all" className="bg-gray-800 text-white">All Topics</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic} className="bg-gray-800 text-white">{topic}</option>
                  ))}
                </select>
              </div>

              {/* Year Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Filter by Year</h3>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all" className="bg-gray-800 text-white">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year} className="bg-gray-800 text-white">{year}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowModifyQuiz(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleModifyQuiz}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Apply Changes
                </motion.button>
              </div>
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
              className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 max-w-md w-full border border-white/20"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-4">All Questions Completed! 🎉</h2>
                <p className="text-white/80 mb-8">
                  You have attempted all available questions for the current selection. You can modify your quiz settings to get fresh questions from other topics or years.
                </p>
                <div className="space-y-3">
                  <motion.button
                    onClick={resetFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-200"
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
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all duration-200"
                  >
                    View Summary
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary Modal */}
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
              className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
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
                        className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center"
                      >
                        <span className="text-4xl font-bold text-white">{summary.score}%</span>
                      </motion.div>
                      
                      <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete! 🎉</h2>
                      <p className="text-xl text-white/80 mb-8">
                        You scored {summary.correctAnswers} out of {summary.totalAnswered} questions
                      </p>
                    </div>

                    {/* Overall Performance */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20"
                    >
                      <h3 className="font-semibold text-white mb-4 text-lg">📊 Performance Overview</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-white/70 text-sm">Score</p>
                          <p className="text-3xl font-bold text-white">{summary.score}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-white/70 text-sm">Time Taken</p>
                          <p className="text-3xl font-bold text-white">{formatTime(summary.timeTaken)}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Questions Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20"
                    >
                      <h3 className="font-semibold text-white mb-4 text-lg">📝 Question Breakdown</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-green-400 text-sm">Correct</p>
                          <p className="text-3xl font-bold text-green-400">{summary.correctAnswers}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-red-400 text-sm">Incorrect</p>
                          <p className="text-3xl font-bold text-red-400">{summary.incorrectAnswers}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Chapter Performance */}
                    {Object.keys(summary.chapterPerformance).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20"
                      >
                        <h3 className="font-semibold text-white mb-4 text-lg">📚 Chapter Performance</h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {Object.entries(summary.chapterPerformance).map(([chapter, stats], idx) => (
                            <motion.div
                              key={chapter}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + idx * 0.1 }}
                              className="flex justify-between items-center p-3 bg-white/5 rounded-xl"
                            >
                              <span className="text-white/80 text-sm">{chapter}</span>
                              <span className="font-semibold text-white">
                                {Math.round((stats.correct / stats.total) * 100)}% 
                                <span className="text-white/60 ml-1">({stats.correct}/{stats.total})</span>
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Close Button */}
                    <motion.button
                      onClick={() => setShowSummary(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-200"
                    >
                      Continue Learning 🚀
                    </motion.button>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
