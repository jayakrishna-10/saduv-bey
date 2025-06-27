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
  const [isRandom, setIsRandom] = useState(false);
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
  }, [selectedPaper]);

  useEffect(() => {
    if (questions.length > 0) {
      const uniqueTopics = [...new Set(questions.map(q => normalizeChapterName(q.tag)))].sort();
      const uniqueYears = [...new Set(questions.map(q => Number(q.year)))].sort((a, b) => a - b);
      
      setTopics(uniqueTopics);
      setYears(uniqueYears);
      filterQuestions();
    }
  }, [questions, selectedTopic, selectedYear]);

  useEffect(() => {
    if (questions.length > 0) {
      resetRemainingIndices();
      setStartTime(new Date());
    }
  }, [questions, isRandom]);

  const resetRemainingIndices = () => {
    const availableIndices = filteredQuestions
      .map((_, index) => index)
      .filter(index => !completedQuestionIds.has(filteredQuestions[index].main_id || filteredQuestions[index].id));
    setRemainingIndices(availableIndices);
  };

  const filterQuestions = () => {
    let filtered = [...questions];
    
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(q => 
        normalizeChapterName(q.tag) === selectedTopic
      );
    }
    
    if (selectedYear !== 'all') {
      const yearNumber = Number(selectedYear);
      filtered = filtered.filter(q => Number(q.year) === yearNumber);
    }

    filtered = filtered.map(q => ({
      ...q,
      option_a: normalizeOptionText(q.option_a),
      option_b: normalizeOptionText(q.option_b),
      option_c: normalizeOptionText(q.option_c),
      option_d: normalizeOptionText(q.option_d)
    }));

    const totalQuestions = filtered.length;
    const attemptedQuestions = filtered.filter(q => completedQuestionIds.has(q.main_id || q.id)).length;
    setQuestionProgress({
      total: totalQuestions,
      attempted: attemptedQuestions
    });

    const availableQuestions = filtered.filter(q => !completedQuestionIds.has(q.main_id || q.id));
    
    setFilteredQuestions(availableQuestions);
    
    if (availableQuestions.length > 0) {
      setCurrentQuestionIndex(0);
    }

    const newRemainingIndices = Array.from({ length: availableQuestions.length }, (_, i) => i);
    setRemainingIndices(newRemainingIndices);

    if (availableQuestions.length === 0 && 
        filtered.length > 0 && 
        completedQuestionIds.size > 0) {
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
      
      setQuestions(normalizedData);
      setCompletedQuestionIds(new Set());
      setAnsweredQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowAnswer(false);
      setSelectedTopic('all');
      setSelectedYear('all');
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
    if (selectedOption) return;
    
    const questionId = currentQuestion.main_id || currentQuestion.id;
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    
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

    setSelectedOption(option);
    setShowFeedback(true);
    await fetchExplanation(questionId);
  };

  const getNextRandomIndex = () => {
    const availableIndices = remainingIndices.filter(index => 
      !completedQuestionIds.has(filteredQuestions[index]?.main_id || filteredQuestions[index]?.id)
    );

    if (availableIndices.length === 0) {
      return currentQuestionIndex;
    }

    const randomPosition = Math.floor(Math.random() * availableIndices.length);
    const nextIndex = availableIndices[randomPosition];
    setRemainingIndices(availableIndices.filter((_, index) => index !== randomPosition));
    return nextIndex;
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    
    const availableQuestionsCount = filteredQuestions.length;

    if (availableQuestionsCount === 0 && completedQuestionIds.size > 0) {
      setShowCompletionModal(true);
      return;
    }

    if (isRandom) {
      const nextIndex = getNextRandomIndex();
      if (nextIndex === currentQuestionIndex && completedQuestionIds.size > 0) {
        setShowCompletionModal(true);
        return;
      }
      setCurrentQuestionIndex(nextIndex);
    } else {
      let nextIndex = (currentQuestionIndex + 1) % availableQuestionsCount;
      let loopCount = 0;
      
      while (completedQuestionIds.has(filteredQuestions[nextIndex]?.main_id || filteredQuestions[nextIndex]?.id) && 
             loopCount < availableQuestionsCount) {
        nextIndex = (nextIndex + 1) % availableQuestionsCount;
        loopCount++;
      }

      if (loopCount === availableQuestionsCount && completedQuestionIds.size > 0) {
        setShowCompletionModal(true);
        return;
      }

      setCurrentQuestionIndex(nextIndex);
    }
    
    setSelectedOption(null);
    setShowFeedback(false);
    setExplanation('');
  };

  const resetFilters = () => {
    setSelectedTopic('all');
    setSelectedYear('all');
    setShowCompletionModal(false);
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
          {/* Paper Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Select Paper</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(PAPERS).map((paper) => (
                <motion.button
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 backdrop-blur-md border ${
                    selectedPaper === paper.id
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                  }`}
                >
                  <div className="font-semibold text-lg">{paper.name}</div>
                  <div className="text-sm text-white/70 mt-1">{paper.description}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
              <div className="flex flex-wrap items-center gap-4">
                {/* Topic Dropdown */}
                <div className="flex-1 min-w-48">
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

                {/* Year Dropdown */}
                <div className="flex-1 min-w-32">
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

                {/* Random Toggle */}
                <motion.button
                  onClick={() => setIsRandom(!isRandom)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-md border whitespace-nowrap ${
                    isRandom 
                      ? 'bg-purple-500/30 border-purple-400 text-white' 
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                  }`}
                >
                  🎲 Random {isRandom ? 'On' : 'Off'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
              <div className="flex justify-between text-white/80 text-sm mb-3">
                <span>Progress: {questionProgress.attempted} of {questionProgress.total} questions</span>
                <span>{Math.round(((questionProgress.attempted) / questionProgress.total) * 100)}%</span>
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
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-8"
            >
              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                {currentQuestion.question_text}
              </h2>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {['a', 'b', 'c', 'd'].map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showAnswer}
                    whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                    whileTap={{ scale: selectedOption ? 1 : 0.98 }}
                    className={`w-full p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 text-left group ${getOptionClass(option)}`}
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
                    disabled={showFeedback || showAnswer}
                    whileHover={{ scale: showFeedback || showAnswer ? 1 : 1.05 }}
                    whileTap={{ scale: showFeedback || showAnswer ? 1 : 0.95 }}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      showFeedback || showAnswer
                        ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg'
                    }`}
                  >
                    💡 Get Answer
                  </motion.button>
                  
                  <motion.button
                    onClick={handleNextQuestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-200"
                  >
                    Next Question →
                  </motion.button>
                </div>
              </div>

              {/* Question Info */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex flex-wrap gap-6 text-sm text-white/70">
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
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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
                <h2 className="text-2xl font-bold text-white mb-4">Section Complete!</h2>
                <p className="text-white/80 mb-8">
                  You have completed all available questions for the selected filters.
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
                      transition={{ delay: 0.3 }}
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
