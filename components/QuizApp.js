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
    <div className="min-h-screen bg-white p-8">
      {/* Random Toggle */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleRandomToggle}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          Random
        </button>
      </div>

      {/* Title Section */}
      <h1 className="text-3xl font-bold mb-8">Introduction to Machine Learning</h1>

      {/* Progress Section */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span>Progress: {currentQuestionIndex + 1}/100</span>
          <span>{((currentQuestionIndex + 1) / 100 * 100).toFixed(2)}%</span>
        </div>
        <div className="h-2 bg-[#dce1e5] rounded">
          <div 
            className="h-full bg-[#111517] rounded"
            style={{ width: `${((currentQuestionIndex + 1) / 100 * 100)}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl mb-6">
        Use the interactive quizzes to test your understanding of the material.
      </h2>

      {/* Question */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Question</h3>
        <div className="mb-4">{currentQuestion.question_text}</div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-6">
        {['a', 'b', 'c', 'd'].map((option) => (
          <label 
            key={option}
            className="flex items-center gap-4 rounded-xl border border-solid border-[#dce1e5] p-[15px] cursor-pointer hover:border-[#111517] transition-colors"
          >
            <input
              type="radio"
              name="quiz-option"
              checked={selectedOption === option}
              onChange={() => handleOptionSelect(option)}
              className="h-5 w-5 border-2 border-[#dce1e5] bg-transparent text-transparent checked:border-[#111517] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#111517]"
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
      <div className="flex justify-end mb-8">
        <button 
          onClick={handleNextQuestion}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f3f4] text-[#111517] text-sm font-bold leading-normal tracking-[0.015em]"
        >
          Next Question
        </button>
      </div>

      {/* Footer Section */}
      <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
          <p className="text-[#647987] text-sm font-normal leading-normal">Chapter</p>
          <p className="text-[#111517] text-sm font-normal leading-normal">{currentQuestion.tag}</p>
        </div>
        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
          <p className="text-[#647987] text-sm font-normal leading-normal">Year</p>
          <p className="text-[#111517] text-sm font-normal leading-normal">{currentQuestion.year}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
