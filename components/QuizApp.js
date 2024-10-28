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
  const [remainingIndices, setRemainingIndices] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      resetRemainingIndices();
    }
  }, [questions, isRandom]);

  const resetRemainingIndices = () => {
    const indices = Array.from({ length: questions.length }, (_, i) => i);
    setRemainingIndices(indices);
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

  const handleOptionSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowFeedback(true);
  };

  const getNextRandomIndex = () => {
    if (remainingIndices.length === 0) {
      resetRemainingIndices();
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
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    }
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const isCorrectAnswer = (option, correctAnswer) => {
    return option === correctAnswer || 
           option.toLowerCase() === correctAnswer || 
           option.toUpperCase() === correctAnswer;
  };

  const getOptionStyle = (option) => {
    if (!showFeedback) {
      return "border-[#dce1e5] hover:border-[#111517]";
    }

    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    const isSelected = selectedOption === option;

    if (isCorrect) {
      return "border-green-500 bg-green-50";
    }
    if (isSelected && !isCorrect) {
      return "border-red-500 bg-red-50";
    }
    return "border-[#dce1e5]";
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-4 max-w-2xl mx-auto">
      {/* Random Toggle */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setIsRandom(!isRandom)}
          className={`flex items-center gap-1 px-2 py-0.5 text-xs border rounded-lg transition-colors ${
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
        <h2 className="text-xl font-medium mb-6">{currentQuestion.question_text}</h2>
      </div>

      {/* Options - with reduced width */}
      <div className="flex flex-col gap-2 mb-4 max-w-xl">
        {['a', 'b', 'c', 'd'].map((option) => (
          <label 
            key={option}
            className={`flex items-center gap-3 rounded-lg border border-solid p-3 cursor-pointer transition-colors ${getOptionStyle(option)}`}
          >
            <input
              type="radio"
              name="quiz-option"
              checked={selectedOption === option}
              onChange={() => handleOptionSelect(option)}
              className="h-4 w-4 border-2 border-[#dce1e5] bg-transparent text-transparent checked:border-[#111517] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#111517]"
            />
            <div className="flex grow flex-col">
              <p className={`text-sm font-medium leading-normal ${
                showFeedback && isCorrectAnswer(option, currentQuestion.correct_answer)
                  ? 'text-green-700'
                  : showFeedback && selectedOption === option && !isCorrectAnswer(option, currentQuestion.correct_answer)
                    ? 'text-red-700'
                    : 'text-[#111517]'
              }`}>
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
