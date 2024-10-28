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

  const currentQuestion = questions[currentQuestionIndex] || {};

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Title Section */}
      <h1 className="text-3xl font-bold mb-8">Introduction to Machine Learning</h1>

      {/* Progress Section */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span>Progress: {currentQuestionIndex + 1}/10</span>
          <span>{((currentQuestionIndex + 1) / 10 * 100).toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div 
            className="h-full bg-black rounded"
            style={{ width: `${((currentQuestionIndex + 1) / 10 * 100)}%` }}
          />
        </div>
      </div>

      {/* Question Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          {currentQuestion.question_text}
        </h2>
        
        <div className="space-y-4">
          {['a', 'b', 'c', 'd'].map((option) => (
            <label 
              key={option}
              className="flex items-center space-x-3 p-4 border rounded-lg hover:border-black transition-colors cursor-pointer"
            >
              <input
                type="radio"
                name="answer"
                checked={selectedOption === option}
                onChange={() => handleOptionSelect(option)}
                className="w-4 h-4"
              />
              <span>{currentQuestion[`option_${option}`]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t pt-4">
        <div className="mb-4">
          <div className="text-gray-600">Chapter</div>
          <div>{currentQuestion.tag}</div>
        </div>
        <div>
          <div className="text-gray-600">Year</div>
          <div>{currentQuestion.year}</div>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
