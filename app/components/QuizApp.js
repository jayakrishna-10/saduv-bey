'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
  
  // New state variables for summary
  const [startTime, setStartTime] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      resetRemainingIndices();
      setStartTime(new Date()); // Start the timer when questions are loaded
    }
  }, [questions, isRandom]);

  // ... (keep existing functions: resetRemainingIndices, fetchQuestions, fetchExplanation)

  const handleOptionSelect = async (option) => {
    if (selectedOption) return;
    
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    
    // Record the answer
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

  // ... (keep existing functions: getNextRandomIndex, handleNextQuestion, isCorrectAnswer, getOptionStyle)

  const generateSummary = () => {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds

    // Calculate overall statistics
    const totalAnswered = answeredQuestions.length;
    const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
    const incorrectAnswers = totalAnswered - correctAnswers;
    const score = Math.round((correctAnswers / totalAnswered) * 100);

    // Calculate chapter-wise performance
    const chapterPerformance = answeredQuestions.reduce((acc, q) => {
      if (!acc[q.chapter]) {
        acc[q.chapter] = { total: 0, correct: 0 };
      }
      acc[q.chapter].total += 1;
      if (q.isCorrect) acc[q.chapter].correct += 1;
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

  const currentQuestion = questions[currentQuestionIndex] || {};

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-4 max-w-2xl mx-auto">
      {/* Existing Random Toggle */}
      {/* ... */}

      {/* Question */}
      {/* ... */}

      {/* Options */}
      {/* ... */}

      {/* Buttons Section */}
      <div className="flex justify-between mb-6">
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
      {/* ... */}

      {/* Footer Section */}
      {/* ... */}

      {/* Results Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Quiz Summary</h2>
            
            {/* Calculate and display summary */}
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
  );
}
