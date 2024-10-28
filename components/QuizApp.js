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
      const { data, error } = await supabase.from('MCQ1').select('*');
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
  const progress = ((currentQuestionIndex + 1) / questions.length * 100) || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#111517] border-t-transparent"></div>
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
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] px-10 py-3">
        <div className="flex items-center gap-4 text-[#111517]">
          <h2 className="text-[#111517] text-lg font-bold leading-tight tracking-[-0.015em]">Quiz App</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRandom(!isRandom)}
            className={`flex min-w-[84px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 ${
              isRandom ? 'bg-[#111517] text-white' : 'bg-[#f0f3f4] text-[#111517]'
            } text-sm font-bold leading-normal tracking-[0.015em]`}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Random
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1">
          {/* Progress Bar */}
          <div className="flex flex-col gap-3 p-4">
            <div className="flex gap-6 justify-between">
              <p className="text-[#111517] text-base font-medium leading-normal">
                Progress: {currentQuestionIndex + 1}/{questions.length}
              </p>
              <p className="text-[#111517] text-sm font-normal leading-normal">{progress.toFixed(0)}%</p>
            </div>
            <div className="rounded bg-[#dce1e5]">
              <div className="h-2 rounded bg-[#111517]" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Question */}
          <h3 className="text-[#111517] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
            {currentQuestion.question_text}
          </h3>

          {/* Options */}
          <div className="flex flex-col gap-3 p-4">
            {['a', 'b', 'c', 'd'].map((option) => (
              <label 
                key={option}
                className="flex items-center gap-4 rounded-xl border border-solid border-[#dce1e5] p-[15px] cursor-pointer hover:border-[#111517] transition-colors"
                onClick={() => handleOptionSelect(option)}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  disabled={selectedOption !== null}
                  checked={selectedOption === option}
                  className="h-5 w-5 border-2 border-[#dce1e5] bg-transparent text-transparent checked:border-[#111517] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#111517]"
                  onChange={() => {}}
                />
                <div className="flex grow flex-col">
                  <p className="text-[#111517] text-sm font-medium leading-normal">
                    {currentQuestion[`option_${option}`]}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Next Button */}
          <div className="flex px-4 py-3 justify-end">
            <button
              onClick={handleNextQuestion}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f3f4] text-[#111517] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#dce1e5] transition-colors"
            >
              <span className="truncate">Next Question</span>
            </button>
          </div>

          {/* Footer Info */}
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
      </div>
    </div>
  );
};

export default QuizApp;
