'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertCircle, ChevronRight, Shuffle } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [explanation, setExplanation] = useState('');
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
    setExplanation('');
    
    if (isRandom) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestionIndex(randomIndex);
    } else {
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <AlertCircle className="inline-block mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quiz</h1>
          <div className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            <button
              onClick={() => setIsRandom(!isRandom)}
              className={`px-3 py-1 rounded ${
                isRandom ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Random
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">
            {currentQuestion.question_text || 'No questions available'}
          </h2>

          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedOption === option
                    ? selectedOption === currentQuestion.correct_answer
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                {currentQuestion[`option_${option}`]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>Chapter: {currentQuestion.tag}</p>
            <p>Year: {currentQuestion.year}</p>
          </div>
          <button
            onClick={handleNextQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            Next Question
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
