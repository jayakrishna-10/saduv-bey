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
  const [error, setError] = useState(null);

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

  const currentQuestion = questions[currentQuestionIndex] || {};
  const progress = ((currentQuestionIndex + 1) / questions.length * 100) || 0;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" 
         style={{ 
           '--radio-dot-svg': `url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(17,21,23)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%273%27/%3e%3c/svg%3e')`,
           fontFamily: 'Lexend, "Noto Sans", sans-serif'
         }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#111517]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_330)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor"/>
                </g>
                <defs>
                  <clipPath id="clip0_6_330">
                    <rect width="48" height="48" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-[#111517] text-lg font-bold leading-tight tracking-[-0.015em]">Exam Prep</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              {['Dashboard', 'Explore', 'My classes', 'My notes', 'Inbox', 'Subscriptions'].map((item) => (
                <a key={item} className="text-[#111517] text-sm font-medium leading-normal" href="#">{item}</a>
              ))}
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f3f4] text-[#111517] text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">New class</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111517] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Introduction to Machine Learning
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-3 p-4">
              <div className="flex gap-6 justify-between">
                <p className="text-[#111517] text-base font-medium leading-normal">Progress: {currentQuestionIndex + 1}/10</p>
                <p className="text-[#111517] text-sm font-normal leading-normal">{progress}%</p>
              </div>
              <div className="rounded bg-[#dce1e5]">
                <div className="h-2 rounded bg-[#111517]" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <h3 className="text-[#111517] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
              Use the interactive quizzes to test your understanding of the material.
            </h3>

            {/* Question */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111517] text-base font-medium leading-normal pb-2">Question</p>
                <div className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111517] border border-[#dce1e5] bg-white min-h-36 p-[15px] text-base font-normal leading-normal">
                  {currentQuestion.question_text}
                </div>
              </label>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3 p-4">
              {['a', 'b', 'c', 'd'].map((option) => (
                <label key={option} className="flex items-center gap-4 rounded-xl border border-solid border-[#dce1e5] p-[15px]">
                  <input
                    type="radio"
                    className="h-5 w-5 border-2 border-[#dce1e5] bg-transparent text-transparent checked:border-[#111517] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#111517]"
                    name="quiz-option"
                    checked={selectedOption === option}
                    onChange={() => handleOptionSelect(option)}
                  />
                  <div className="flex grow flex-col">
                    <p className="text-[#111517] text-sm font-medium leading-normal">
                      {currentQuestion[`option_${option}`]}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex px-4 py-3 justify-end">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f3f4] text-[#111517] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Submit</span>
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
    </div>
  );
};

export default QuizApp;
