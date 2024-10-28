'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shuffle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRandom, setIsRandom] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('MCQ1')
        .select('*');

      if (error) throw error;
      setQuestions(data || []);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (isRandom) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestionIndex(randomIndex);
    } else {
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  const getOptionStyle = (option) => {
    if (!selectedOption) {
      return 'bg-white hover:bg-gray-50';
    }
    if (option === currentQuestion.correct_answer) {
      return 'bg-green-100 border-green-500 text-green-700';
    }
    if (option === selectedOption && option !== currentQuestion.correct_answer) {
      return 'bg-red-100 border-red-500 text-red-700';
    }
    return 'bg-white opacity-50';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quiz</h1>
            <div className="flex items-center gap-3">
              <Shuffle className="h-5 w-5 text-gray-500" />
              <button
                onClick={() => setIsRandom(!isRandom)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isRandom 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Random
              </button>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-6">
              {currentQuestion.question_text || 'No questions available'}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {['a', 'b', 'c', 'd'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={`w-full p-6 text-left rounded-xl border-2 transition-all 
                    ${getOptionStyle(option)}
                    ${selectedOption ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}
                    disabled:cursor-not-allowed`}
                >
                  <span className="inline-block w-8 text-lg font-bold text-gray-500">
                    {option.toUpperCase()}.
                  </span>
                  <span className="font-medium text-gray-800">
                    {currentQuestion[`option_${option}`]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="space-y-1">
              <p className="text-sm md:text-base text-gray-600">
                Chapter: <span className="font-medium text-gray-900">{currentQuestion.tag}</span>
              </p>
              <p className="text-sm md:text-base text-gray-600">
                Year: <span className="font-medium text-gray-900">{currentQuestion.year}</span>
              </p>
            </div>
            
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                font-medium transition-colors flex items-center gap-2"
            >
              Next Question
              <svg 
                className="w-5 h-5" 
                fill="none" 
                strokeWidth="2" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
