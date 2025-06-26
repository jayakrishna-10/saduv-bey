'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    },
    realtime: {
      enabled: false
    }
  }
);

// Paper configuration
const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    table: 'mcqs_p1',
    description: 'General Aspects of Energy Management and Energy Audit'
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    table: 'mcqs_p2',
    description: 'Energy Efficiency in Thermal Utilities'
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    table: 'mcqs_p3', 
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
      const currentPaper = PAPERS[selectedPaper];
      const { data, error } = await supabase.from(currentPaper.table).select('*');
      if (error) throw error;
      
      const normalizedData = data?.map(q => ({
        ...q,
        option_a: normalizeOptionText(q.option_a),
        option_b: normalizeOptionText(q.option_b),
        option_c: normalizeOptionText(q.option_c),
        option_d: normalizeOptionText(q.option_d)
      })) || [];
      
      setQuestions(normalizedData);
      // Reset state when changing papers
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
      console.error(err);
      setIsLoading(false);
    }
  };

  const fetchExplanation = async (questionId) => {
    setIsLoadingExplanation(true);
    try {
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

  const getOptionStyle = (option) => {
    if (!showFeedback && !showAnswer) {
      return "border-gray-200 hover:border-gray-300";
    }

    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    const isSelected = selectedOption === option;

    if (isCorrect) {
      return "border-green-500 bg-green-50";
    }
    if (isSelected && !isCorrect) {
      return "border-red-500 bg-red-50";
    }
    return "border-gray-200";
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7ff] to-[#ffffff]">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-transparent px-4">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">saduvbey</span>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
      
      <div className="max-w-2xl mx-auto px-4 py-8 pt-16">
        {/* Paper Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Select Paper</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.values(PAPERS).map((paper) => (
              <button
                key={paper.id}
                onClick={() => setSelectedPaper(paper.id)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  selectedPaper === paper.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } border`}
              >
                <div className="font-medium">{paper.name}</div>
                <div className="text-xs text-gray-600">{paper.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-4 mb-8">
          {/* Topic Dropdown */}
          <div className="relative flex-1">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Year Dropdown */}
          <div className="relative flex-1">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Random Toggle */}
          <button
            onClick={() => setIsRandom(!isRandom)}
            className={`flex items-center gap-1 px-4 py-2 text-sm border rounded-lg transition-colors whitespace-nowrap ${
              isRandom 
                ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
            Random {isRandom ? 'On' : 'Off'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {questionProgress.attempted} of {questionProgress.total} questions</span>
            <span>Remaining: {questionProgress.total - questionProgress.attempted}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ 
                width: `${(questionProgress.attempted / questionProgress.total) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-8">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Options Section */}
        <div className="flex flex-col gap-3 mb-8">
          {['a', 'b', 'c', 'd'].map((option) => (
            <label 
              key={option}
              className={`flex items-center gap-4 rounded-lg border border-solid p-4 cursor-pointer transition-colors hover:bg-gray-50 ${getOptionStyle(option)}`}
            >
              <input
                type="radio"
                name="quiz-option"
                checked={selectedOption === option}
                onChange={() => handleOptionSelect(option)}
                disabled={showAnswer}
                className="h-4 w-4 border-2 border-gray-300 bg-transparent text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              />
              <div className="flex grow flex-col">
                <p className={`text-sm font-medium leading-normal ${
                  (showFeedback || showAnswer) && isCorrectAnswer(option, currentQuestion.correct_answer)
                    ? 'text-green-700'
                    : showFeedback && selectedOption === option && !isCorrectAnswer(option, currentQuestion.correct_answer)
                      ? 'text-red-700'
                      : 'text-gray-900'
                }`}>
                  {currentQuestion[`option_${option}`]}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="flex justify-between items-center mb-4">
          {answeredQuestions.length > 0 && (
            <button 
              onClick={() => setShowSummary(true)}
              className="px-4 py-2 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm font-medium"
            >
              Finish Quiz
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button 
              onClick={handleGetAnswer}
              disabled={showFeedback || showAnswer}
              className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Answer
            </button>
            <button 
              onClick={handleNextQuestion}
              className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
            >
              Next Question
            </button>
          </div>
        </div>

        {/* Explanation Section */}
        {(showFeedback || showAnswer) && (
          <div className="mb-4">
            {isLoadingExplanation ? (
              <div>Loading explanation...</div>
            ) : (
              <div className="explanation-content">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {explanation}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Footer Section */}
        <div className="border-t pt-4">
          <div className="flex gap-8">
            <div className="flex gap-2">
              <div className="text-gray-600 text-sm">Paper:</div>
              <div className="text-sm">{PAPERS[selectedPaper].name}</div>
            </div>
            <div className="flex gap-2">
              <div className="text-gray-600 text-sm">Chapter:</div>
              <div className="text-sm">{normalizeChapterName(currentQuestion.tag)}</div>
            </div>
            <div className="flex gap-2">
              <div className="text-gray-600 text-sm">Year:</div>
              <div className="text-sm">{currentQuestion.year}</div>
            </div>
          </div>
        </div>

        {/* Completion Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Section Complete!</h2>
              <p className="text-gray-600 mb-6">
                You have completed all available questions for the selected filters. Would you like to:
              </p>
              <div className="space-y-3">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Try Questions from Other Topics/Years
                </button>
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    setShowSummary(true);
                  }}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  View Summary
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary Modal */}
        {showSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Quiz Summary</h2>
              
              {(() => {
                const summary = generateSummary();
                return (
                  <div className="space-y-6">
                    {/* Overall Performance */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Overall Performance</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600">Score</p>
                          <p className="text-2xl font-bold">{summary.score}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Time Taken</p>
                          <p className="text-2xl font-bold">{formatTime(summary.timeTaken)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Questions Stats */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Questions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600">Correct</p>
                          <p className="text-2xl font-bold text-green-600">{summary.correctAnswers}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Incorrect</p>
                          <p className="text-2xl font-bold text-red-600">{summary.incorrectAnswers}</p>
                        </div>
                      </div>
                    </div>

                    {/* Chapter Performance */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Chapter Performance</h3>
                      <div className="space-y-3">
                        {Object.entries(summary.chapterPerformance).map(([chapter, stats]) => (
                          <div key={chapter} className="flex justify-between items-center">
                            <span className="text-gray-600">{chapter}</span>
                            <span className="font-medium">
                              {Math.round((stats.correct / stats.total) * 100)}% 
                              ({stats.correct}/{stats.total})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => setShowSummary(false)}
                      className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                    >
                      Close Summary
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
