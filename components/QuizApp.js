'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const QuizApp = () => {
  // ... [Previous state declarations remain the same]

  // ... [Previous useEffect and utility functions remain the same until fetchExplanation]

  const fetchExplanation = async (questionId) => {
    setIsLoadingExplanation(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/nce-resources/${questionId}.md`
      );
      if (!response.ok) throw new Error('Failed to fetch explanation');
      const text = await response.text();
      setExplanation(text);
    } catch (err) {
      console.error('Error fetching explanation:', err);
      setExplanation('Failed to load explanation.');
    }
    setIsLoadingExplanation(false);
  };

  // ... [Rest of the functions remain the same until the render section]

  return (
    <div className="min-h-screen bg-white p-4 max-w-2xl mx-auto">
      {/* Random Toggle Section - remains the same */}
      {/* Question Section - remains the same */}
      {/* Options Section - remains the same */}
      
      {/* Next Question Button */}
      <div className="flex justify-end mb-6">
        <button 
          onClick={handleNextQuestion}
          className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
        >
          Next Question
        </button>
      </div>

      {/* Explanation Section */}
      {showFeedback && (
        <div className="mb-6 border-t border-b py-4">
          <h3 className="text-lg font-medium mb-3">Explanation</h3>
          {isLoadingExplanation ? (
            <div>Loading explanation...</div>
          ) : (
            <div className="explanation-content">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {explanation}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {/* Footer Section - remains the same */}
    </div>
  );
};

export default QuizApp;
