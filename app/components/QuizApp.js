'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import NavBar from './NavBar';

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

const normalizeChapterName = (chapter) => {
  return chapter
    .replace(/['"]/g, '')
    .trim()
    .replace(/Act,?\s+(\d{4})/g, 'Act $1')
    .replace(/\s+/g, ' ')
    .replace(/\s+and\s+/g, ' and ');
};

export function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRandom, setIsRandom] = useState(false);
  const [remainingIndices, setRemainingIndices] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
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

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      resetRemainingIndices();
      setStartTime(new Date());
    }
  }, [questions, isRandom]);

  useEffect(() => {
    if (questions.length > 0) {
      const uniqueTopics = [...new Set(questions.map(q => q.tag))].sort();
      const uniqueYears = [...new Set(questions.map(q => q.year))].sort();
      
      setTopics(uniqueTopics);
      setYears(uniqueYears);
      filterQuestions();
    }
  }, [questions, selectedTopic, selectedYear]);

  const resetRemainingIndices = () => {
    const indices = Array.from({ length: filteredQuestions.length }, (_, i) => i);
    setRemainingIndices(indices);
  };

  const filterQuestions = () => {
    let filtered = [...questions];
    
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(q => q.tag === selectedTopic);
    }
    
    if (selectedYear !== 'all') {
      filtered = filtered.filter(q => q.year === selectedYear);
    }
    
    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0);
    setRemainingIndices(Array.from({ length: filtered.length }, (_, i) => i));
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase.from('MCQ1').select('*');
      if (error) throw error;
      setQuestions(data || []);
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

  const handleOptionSelect = async (option) => {
    if (selectedOption) return;
    
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    
    setAnsweredQuestions(prev => [...prev, {
      questionId: currentQuestion.id,
      question: currentQuestion.question_text,
      selectedOption: option,
      correctOption: currentQuestion.correct_answer,
      isCorrect,
      chapter: currentQuestion.tag,
      timestamp: new Date()
    }]);

    setSelectedOption(option);
    setShowFeedback(true);
    await fetchExplanation(currentQuestion.id);
  };

  const getNextRandomIndex = () => {
    if (remainingIndices.length === 0) {
      setRemainingIndices(Array.from({ length: filteredQuestions.length }, (_, i) => i));
      return 0;
    }
    const randomPosition = Math.floor(Math.random() * remainingIndices.length);
    const nextIndex = remainingIndices[randomPosition];
    setRemainingIndices(remainingIndices.filter((_, index) => index !== randomPosition));
    return nextIndex;
  };

  const handleNextQuestion = () => {
    if (isRandom) {
      setCurrentQuestionIndex(getNextRandomIndex());
    } else {
      setCurrentQuestionIndex((prev) => (prev + 1) % filteredQuestions.length);
    }
    setSelectedOption(null);
    setShowFeedback(false);
    setExplanation('');
  };

  const isCorrectAnswer = (option, correctAnswer) => {
    return option === correctAnswer || 
           option.toLowerCase() === correctAnswer || 
           option.toUpperCase() === correctAnswer;
  };

  const getOptionStyle = (option) => {
    if (!showFeedback) {
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
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">
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

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-8">{currentQuestion.question_text}</h2>
        </div>

        {/* Options */}
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
                className="h-4 w-4 border-2 border-gray-300 bg-transparent text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              />
              <div className="flex grow flex-col">
                <p className={`text-sm font-medium leading-normal ${
                  showFeedback && isCorrectAnswer(option, currentQuestion.correct_answer)
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
        <div className="flex justify-between mb-8">
          {answeredQuestions.length > 0 && (
            <button 
              onClick={() => setShowSummary(true)}
              className="px-4 py-2 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm font-medium"
            >
              Finish Quiz
            </button>
          )}
          <button 
            onClick={handleNextQuestion}
            className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
          >
            Next Question
          </button>
        </div>

        {/* Explanation Section */}
        {showFeedback && (
          <div className="mb-8 border-t border-b py-6">
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
        <div className="border-t mt-8 pt-6">
          <div className="flex gap-8">
            <div className="flex gap-2">
              <div className="text-gray-600 text-sm">Chapter:</div>
              <div className="text-sm">{currentQuestion.tag}</div>
            </div>
            <div className="flex gap-2">
              <div className="text-gray-600 text-sm">Year:</div>
              <div className="text-sm">{currentQuestion.year}</div>
            </div>
          </div>
        </div>

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
