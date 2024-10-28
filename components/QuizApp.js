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
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold">◆</span>
            <span className="font-bold">Exam Prep</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm">Dashboard</a>
            <a href="#" className="text-sm">Explore</a>
            <a href="#" className="text-sm">My classes</a>
            <a href="#" className="text-sm">My notes</a>
            <a href="#" className="text-sm">Inbox</a>
            <a href="#" className="text-sm">Subscriptions</a>
            <button className="bg-[#F1F3F5] px-4 py-2 rounded-xl text-sm font-medium">
              New class
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[960px] mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-8">Introduction to Machine Learning</h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Progress: {currentQuestionIndex + 1}/10</span>
              <span className="text-sm">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-black rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Instructions */}
          <h2 className="text-xl font-bold mb-6">
            Use the interactive quizzes to test your understanding of the material.
          </h2>

          {/* Question Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Question</label>
            <div className="min-h-[100px] border rounded-xl p-4">
              {currentQuestion.question_text}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {['a', 'b', 'c', 'd'].map((option) => (
              <label 
                key={option}
                className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:border-black transition-colors"
              >
                <input
                  type="radio"
                  name="quiz-option"
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelect(option)}
                  className="w-5 h-5"
                />
                <span className="text-sm">{currentQuestion[`option_${option}`]}</span>
              </label>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mb-8">
            <button className="bg-[#F1F3F5] px-4 py-2 rounded-xl text-sm font-medium">
              Submit
            </button>
          </div>

          {/* Footer Info */}
          <div className="border-t pt-6 grid grid-cols-[100px_1fr] gap-y-6">
            <div className="text-sm text-gray-500">Chapter</div>
            <div className="text-sm">{currentQuestion.tag}</div>
            <div className="text-sm text-gray-500">Year</div>
            <div className="text-sm">{currentQuestion.year}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizApp;
