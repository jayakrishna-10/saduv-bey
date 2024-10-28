'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRandom, setIsRandom] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

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

  const handleOptionSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (isRandom) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestionIndex(randomIndex);
    } else {
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    }
    setSelectedOption(null);
  };

  const handleRandomToggle = () => {
    setIsRandom(!isRandom);
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-4 max-w-2xl mx-auto">
      {/* Random Toggle */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleRandomToggle}
          className="flex items-center gap-2 px-3 py-1 border rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          Random
        </button>
      </div>

      {/* Title Section */}
      <h1 className="text-2xl font-bold mb-4">Introduction to Machine Learning</h1>

      {/* Simple Progress Text */}
      <div className="mb-4">
        Progress: {currentQuestionIndex + 1}/100
      </div>

      <h2 className="text-lg mb-4">
        Use the interactive quizzes to test your understanding of the material.
      </h2>

      {/* Question */}
      <div className="mb-4">
        <h3 className="font-bold mb-2">Question</h3>
        <div className="mb-4">{currentQuestion.question_text}</div>
      </div>

      {/* Options - with reduced width */}
      <div className="flex flex-col gap-2 mb-4 max-w-xl">
        {['a', 'b', 'c', 'd'].map((option) => (
          <label 
            key={option}
            className="flex items-center gap-3 rounded-lg border border-solid border-[#dce1e5] p-3 cursor-pointer hover:border-[#111517] transition-colors"
          >
            <input
              type="radio"
              name="quiz-option"
              checked={selectedOption === option}
              onChange={() => handleOptionSelect(option)}
              className="h-4 w-4 border-2 border-[#dce1e5] bg-transparent text-transparent checked:border-[#111517] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#111517]"
            />
            <div className="flex grow flex-col">
              <p className="text-[#111517] text-sm font-medium leading-normal">
                {currentQuestion[`option_${option}`]}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Next Question Button */}
      <div className="flex justify-end mb-6">
        <button 
          onClick={handleNextQuestion}
          className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
        >
          Next Question
        </button>
      </div>

      {/* Footer Section */}
      <div className="border-t pt-4">
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
    </div>
  );
};

export default QuizApp;
