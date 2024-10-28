'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertCircle, ChevronRight, Shuffle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

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

  const getOptionStyle = (option) => {
    if (!selectedOption) {
      return 'bg-white hover:bg-gray-50 border-gray-200';
    }
    if (option === currentQuestion.correct_answer) {
      return 'bg-green-50 border-green-500 text-green-700';
    }
    if (option === selectedOption && option !== currentQuestion.correct_answer) {
      return 'bg-red-50 border-red-500 text-red-700';
    }
    return 'bg-white border-gray-200 opacity-50';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-2xl font-bold">Quiz</CardTitle>
            <div className="flex items-center gap-3">
              <Shuffle className="h-4 w-4 text-gray-500" />
              <Switch
                checked={isRandom}
                onCheckedChange={setIsRandom}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-xl font-medium text-gray-800">
              {currentQuestion.question_text || 'No questions available'}
            </div>

            <div className="space-y-4">
              {['a', 'b', 'c', 'd'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={`w-full p-6 text-left rounded-xl border-2 transition-all 
                    ${getOptionStyle(option)}
                    ${selectedOption ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}
                    disabled:cursor-not-allowed font-medium`}
                >
                  <span className="uppercase font-bold mr-3 text-gray-500">
                    {option}.
                  </span>
                  {currentQuestion[`option_${option}`]}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Chapter: <span className="font-medium text-gray-900">{currentQuestion.tag}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Year: <span className="font-medium text-gray-900">{currentQuestion.year}</span>
                </p>
              </div>
              
              <Button
                onClick={handleNextQuestion}
                className="px-6 py-3 text-base flex items-center gap-2"
              >
                Next Question
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizApp;
