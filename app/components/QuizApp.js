// FILE: app/components/QuizApp.js
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { QuizHeader } from './quiz/QuizHeader';
import { QuizQuestion } from './quiz/QuizQuestion';
import { QuizActions } from './quiz/QuizActions';
import { QuizStats } from './quiz/QuizStats';
import { QuizSummary } from './quiz/QuizSummary';
import { QuizCompletion } from './quiz/QuizCompletion';
import { ExplanationDisplay } from './ExplanationDisplay';
import { QuizSelector } from './QuizSelector';
import { 
  fetchQuizQuestions, 
  fetchTopicsAndYears, 
  normalizeChapterName, 
  isCorrectAnswer,
  generateQuizSummary
} from '@/lib/quiz-utils';

export function QuizApp() {
  const { data: session } = useSession();
  const [selectedPaper, setSelectedPaper] = useState('paper1');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showModifyQuiz, setShowModifyQuiz] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [topics, setTopics] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [questionCount, setQuestionCount] = useState(20);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [completedQuestionIds, setCompletedQuestionIds] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [questionProgress, setQuestionProgress] = useState({ total: 0, attempted: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(null);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const explanationRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    fetchQuestions();
    fetchTopicsAndYears(selectedPaper).then(data => {
        if(data) {
            setTopics(data.topics);
            setYears(data.years);
        }
    });
  }, [selectedPaper]);

  useEffect(() => {
    if (questions.length > 0) {
      updateProgress();
    }
  }, [questions, completedQuestionIds]);

  useEffect(() => {
    setIsExplanationVisible(showFeedback || showAnswer);
  }, [showFeedback, showAnswer]);

  useEffect(() => {
    if (isExplanationVisible && explanationRef.current && window.innerWidth < 768) {
      setTimeout(() => {
        explanationRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 300);
    }
  }, [isExplanationVisible]);

  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(new Date());
    }
  }, [questions]);

  const saveQuizAttempt = async () => {
    if (!session || answeredQuestions.length === 0) return;

    const summary = generateQuizSummary(answeredQuestions, startTime);

    const attemptData = {
        paper: selectedPaper,
        selectedTopic: selectedTopic,
        selectedYear: selectedYear,
        questionCount: questionCount,
        questionsData: questions.map(({ id, main_id, question_text, correct_answer, tag, year }) => ({ id, main_id, question_text, correct_answer, tag, year })),
        answers: answeredQuestions.map(({ questionId, selectedOption, isCorrect }) => ({ questionId, selectedOption, isCorrect })),
        correctAnswers: summary.correctAnswers,
        totalQuestions: answeredQuestions.length,
        score: summary.score,
        timeTaken: summary.timeTaken,
    };

    try {
        await fetch('/api/user/attempts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'quiz', attemptData: attemptData }),
        });
    } catch (error) {
        console.error('Error saving quiz attempt:', error);
    }
  };

  const updateProgress = () => {
    const totalQuestions = questions.length;
    const attemptedQuestions = questions.filter(q => completedQuestionIds.has(q.main_id || q.id)).length;
    setQuestionProgress({ total: totalQuestions, attempted: attemptedQuestions });

    if (totalQuestions > 0 && attemptedQuestions === totalQuestions) {
      setShowCompletionModal(true);
      if(session) saveQuizAttempt();
    }
  };
  
    const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await fetchQuizQuestions(selectedPaper, questionCount, selectedTopic, selectedYear);
      setQuestions(fetchedQuestions);
      setCompletedQuestionIds(new Set());
      setAnsweredQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowAnswer(false);
      setCurrentExplanation(null);
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch questions error:', err);
      setIsLoading(false);
    }
  };

  const loadExplanation = async (questionId) => {
    setIsLoadingExplanation(true);
    try {
      const currentQ = questions[currentQuestionIndex];
      if (currentQ?.explanation) {
        setCurrentExplanation(currentQ.explanation);
      } else {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, paper: selectedPaper })
        });
        if (!response.ok) throw new Error('Failed to fetch explanation');
        const result = await response.json();
        setCurrentExplanation(result.explanation || { explanation: { concept: { title: "Not Available" } } });
      }
    } catch (err) {
      console.error('Error loading explanation:', err);
      setCurrentExplanation({ explanation: { concept: { title: "Error Loading" } } });
    }
    setIsLoadingExplanation(false);
  };
  
  const handleQuizConfiguration = (config) => {
    setSelectedPaper(config.selectedPaper);
    setSelectedTopic(config.selectedTopic);
    setSelectedYear(config.selectedYear);
    setQuestionCount(config.questionCount);
    setCompletedQuestionIds(new Set());
    setAnsweredQuestions([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setCurrentExplanation(null);
    setCurrentQuestionIndex(0);
    fetchQuestionsWithConfig(config);
  };

  const fetchQuestionsWithConfig = async (config) => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await fetchQuizQuestions(config.selectedPaper, config.questionCount, config.selectedTopic, config.selectedYear);
      setQuestions(fetchedQuestions);
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch questions with config error:', err);
      setIsLoading(false);
    }
  };

  const handleGetAnswer = () => {
    if (showAnswer || showFeedback || isTransitioning) return;
    const questionId = currentQuestion.main_id || currentQuestion.id;
    setShowAnswer(true);
    setShowFeedback(true);
    loadExplanation(questionId);
    setCompletedQuestionIds(prev => new Set(prev).add(questionId));
    setAnsweredQuestions(prev => [...prev, {
      questionId,
      question: currentQuestion.question_text,
      selectedOption: null,
      correctOption: currentQuestion.correct_answer,
      isCorrect: false,
      chapter: normalizeChapterName(currentQuestion.tag),
      timestamp: new Date()
    }]);
  };

  const handleOptionSelect = async (option) => {
    if (selectedOption || isTransitioning || showAnswer || showFeedback) return;
    const questionId = currentQuestion.main_id || currentQuestion.id;
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    setSelectedOption(option);
    setShowFeedback(true);
    setAnsweredQuestions(prev => [...prev, {
      questionId,
      question: currentQuestion.question_text,
      selectedOption: option,
      correctOption: currentQuestion.correct_answer,
      isCorrect,
      chapter: normalizeChapterName(currentQuestion.tag),
      timestamp: new Date()
    }]);
    setCompletedQuestionIds(prev => new Set(prev).add(questionId));
    await loadExplanation(questionId);
  };

  const handleNextQuestion = () => {
    setIsTransitioning(true);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowAnswer(false);
    setCurrentExplanation(null);
    setTimeout(() => {
      const remaining = questions.filter(q => !completedQuestionIds.has(q.main_id || q.id));
      if (remaining.length === 0) {
        setShowCompletionModal(true);
      } else {
        let nextIndex = (currentQuestionIndex + 1) % questions.length;
        while(completedQuestionIds.has(questions[nextIndex].main_id || questions[nextIndex].id)) {
            nextIndex = (nextIndex + 1) % questions.length;
        }
        setCurrentQuestionIndex(nextIndex);
      }
      setIsTransitioning(false);
    }, 100);
  };

  const handleViewSummary = () => {
    if (session) saveQuizAttempt();
    setShowSummary(true);
  };

  const resetFilters = () => {
    setSelectedTopic('all');
    setSelectedYear('all');
    setShowCompletionModal(false);
    fetchQuestions();
  };
  
  const currentQuestion = questions[currentQuestionIndex] || {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl">
          <Loader2 className="h-8 w-8 mx-auto animate-spin" />
          <p className="mt-4">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ x: mousePosition.x * 0.1, y: mousePosition.y * 0.1 }} transition={{ type: "spring", stiffness: 50, damping: 15 }} className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-40 blur-3xl" />
        <motion.div animate={{ x: -mousePosition.x * 0.05, y: -mousePosition.y * 0.05 }} transition={{ type: "spring", stiffness: 30, damping: 15 }} className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/20 dark:to-cyan-900/20 opacity-30 blur-3xl" />
      </div>

      <QuizHeader selectedPaper={selectedPaper} questionProgress={questionProgress} answeredQuestions={answeredQuestions} showMobileStats={showMobileStats} setShowMobileStats={setShowMobileStats} setShowModifyQuiz={setShowModifyQuiz} />

      <main className={`relative z-10 px-4 md:px-8 py-6 md:py-12 transition-all duration-300 ${ isExplanationVisible ? 'pb-32 md:pb-12' : 'pb-20 md:pb-12' }`}>
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={`${currentQuestionIndex}-${currentQuestion.main_id || currentQuestion.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-12 mb-8">
              <QuizQuestion question={currentQuestion} questionIndex={currentQuestionIndex} totalQuestions={questions.length} selectedOption={selectedOption} showFeedback={showFeedback} showAnswer={showAnswer} onOptionSelect={handleOptionSelect} isTransitioning={isTransitioning} />
              <AnimatePresence>
                {(showFeedback || showAnswer) && (
                  <motion.div ref={explanationRef} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 md:mb-8">
                     {isLoadingExplanation ? (
                        <div className="p-4 md:p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                          <Loader2 className="h-5 w-5 animate-spin"/>
                        </div>
                     ) : (
                        <ExplanationDisplay explanationData={currentExplanation} questionText={currentQuestion.question_text} options={{ option_a: currentQuestion.option_a, option_b: currentQuestion.option_b, option_c: currentQuestion.option_c, option_d: currentQuestion.option_d }} correctAnswer={currentQuestion.correct_answer?.toLowerCase()} userAnswer={selectedOption} />
                     )}
                  </motion.div>
                )}
              </AnimatePresence>
              <QuizActions answeredQuestions={answeredQuestions} showFeedback={showFeedback} showAnswer={showAnswer} isTransitioning={isTransitioning} onGetAnswer={handleGetAnswer} onNextQuestion={handleNextQuestion} onViewSummary={handleViewSummary} />
            </motion.div>
          </AnimatePresence>
          <QuizStats questionProgress={questionProgress} answeredQuestions={answeredQuestions} />
        </div>
      </main>

      <QuizSelector isOpen={showModifyQuiz} onClose={() => setShowModifyQuiz(false)} currentConfig={{ selectedPaper, selectedTopic, selectedYear, questionCount, showExplanations: true }} onApply={handleQuizConfiguration} topics={topics} years={years} />
      <QuizSummary isOpen={showSummary} onClose={() => setShowSummary(false)} answeredQuestions={answeredQuestions} startTime={startTime} />
      <QuizCompletion isOpen={showCompletionModal} onViewSummary={handleViewSummary} onStartNewQuiz={resetFilters} />
    </div>
  );
}
