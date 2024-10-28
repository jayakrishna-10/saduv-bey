import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertCircle, ChevronRight, Shuffle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

// Initialize Supabase client - replace with your credentials
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
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

      setQuestions(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchExplanation = async (id) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('nce-resources')
        .download(`${id}.md`);

      if (error) throw error;

      const text = await data.text();
      setExplanation(text);
    } catch (err) {
      setExplanation('Failed to load explanation.');
    }
  };

  const handleOptionSelect = async (option) => {
    if (selectedOption) return; // Prevent multiple selections

    setSelectedOption(option);
    await fetchExplanation(currentQuestion.id);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setExplanation('');
    
    if (isRandom) {
      const remainingQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      setCurrentQuestionIndex(randomIndex);
    } else {
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  const getOptionStyle = (option) => {
    if (!selectedOption) return 'bg-white hover:bg-gray-50';
    if (option === currentQuestion.correct_answer) return 'bg-green-100 border-green-500';
    if (option === selectedOption && option !== currentQuestion.correct_answer) {
      return 'bg-red-100 border-red-500';
    }
    return 'bg-white';
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
          <div className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            <Switch
              checked={isRandom}
              onCheckedChange={setIsRandom}
            />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['a', 'b', 'c', 'd'].map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
                className={`w-full p-4 text-left rounded-lg border transition-colors
                  ${getOptionStyle(option)}
                  ${selectedOption ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                {currentQuestion[`option_${option}`]}
              </button>
            ))}
          </CardContent>
        </Card>

        {selectedOption && (
          <Card className="mb-6">
            <CardContent className="prose max-w-none p-4">
              <div dangerouslySetInnerHTML={{ __html: explanation }} />
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            <p>Chapter: {currentQuestion.tag}</p>
            <p>Year: {currentQuestion.year}</p>
          </div>
          <Button
            onClick={handleNextQuestion}
            className="flex items-center gap-2"
          >
            Next Question
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
