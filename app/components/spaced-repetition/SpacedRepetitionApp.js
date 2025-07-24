// app/components/spaced-repetition/SpacedRepetitionApp.js
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Loader2, 
  AlertTriangle, 
  RefreshCw,
  Clock,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react';

import { QuizQuestion } from '../quiz/QuizQuestion';
import { QuizExplanation } from '../quiz/QuizExplanation';
import { QuizSwipeHandler } from '../quiz/QuizSwipeHandler';
import { QuizNavigation } from '../quiz/QuizNavigation';
import { SpacedRepetitionSelector } from './SpacedRepetitionSelector';
import { SpacedRepetitionStats } from './SpacedRepetitionStats';
import { SpacedRepetitionSession } from './SpacedRepetitionSession';
import { SpacedRepetitionProgress } from './SpacedRepetitionProgress';

import { 
  normalizeChapterName, 
  isCorrectAnswer,
  formatTime
} from '@/lib/quiz-utils';

export function SpacedRepetitionApp() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Core state
  const [selectedPaper, setSelectedPaper] = useState('all');
  const [cards, setCards] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // UI state
  const [currentView, setCurrentView] = useState('selector'); // selector, session, stats, progress
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  
  // Session state
  const [sessionId, setSessionId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [reviewedCards, setReviewedCards] = useState([]);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    timeSpent: 0
  });
  
  // Progress and explanation state
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [userStats, setUserStats] = useState(null);
  
  // Save state
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveError, setSaveError] = useState(null);
  
  // Refs
  const containerRef = useRef(null);

  // Enhanced logging
  const logDebug = useCallback((message, data = null) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[SpacedRepetition] [${timestamp}] ${message}`;
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }, []);

  // Fetch cards for review
  const fetchCardsForReview = async (paper = 'all', limit = 20) => {
    try {
      setIsLoading(true);
      logDebug('Fetching cards for review...', { paper, limit });
      
      const params = new URLSearchParams({
        paper: paper,
        limit: limit.toString(),
        type: 'all',
        include_questions: 'true'
      });

      const response = await fetch(`/api/spaced-repetition/cards?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      setCards(result.cards || []);
      setQuestions(result.questions || []);
      setCurrentCardIndex(0);
      resetQuestionState();
      
      logDebug(`Successfully loaded ${result.cards?.length || 0} cards and ${result.questions?.length || 0} questions`);
      
      // Check if we should suggest creating cards
      if (result.meta?.suggestCreateCards && (!result.cards || result.cards.length === 0)) {
        await createCardsFromWeakQuestions(paper);
        // Retry fetching after creating cards
        setTimeout(() => fetchCardsForReview(paper, limit), 1000);
      }
      
    } catch (err) {
      logDebug('Fetch cards error:', err);
      setSaveError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create cards from weak questions
  const createCardsFromWeakQuestions = async (paper) => {
    try {
      const response = await fetch('/api/spaced-repetition/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_from_weak_questions',
          paper: paper
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        logDebug(`Created ${result.created} cards from weak questions`);
      }
    } catch (error) {
      logDebug('Error creating cards from weak questions:', error);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/spaced-repetition/stats?period=30&include_recommendations=true');
      if (response.ok) {
        const result = await response.json();
        setUserStats(result.stats);
        logDebug('User stats loaded:', result.stats);
      }
    } catch (error) {
      logDebug('Error fetching user stats:', error);
    }
  };

  // Initialize session
  const startSession = async (paper) => {
    setSelectedPaper(paper);
    setCurrentView('session');
    setStartTime(new Date());
    
    // Create session record
    try {
      const response = await fetch('/api/spaced-repetition/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper: paper === 'all' ? null : paper,
          session_type: 'review'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSessionId(result.sessionId);
        logDebug('Session started:', result.sessionId);
      }
    } catch (error) {
      logDebug('Error starting session:', error);
    }
    
    await fetchCardsForReview(paper);
  };

  // Reset question state
  const resetQuestionState = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentExplanation(null);
    setIsExplanationExpanded(false);
    setSaveStatus(null);
    setSaveError(null);
  };

  // Load explanation for current question
  const loadExplanation = async (questionId, paper) => {
    setIsLoadingExplanation(true);
    try {
      const currentQ = questions.find(q => q.main_id === questionId || q.id === questionId);
      if (currentQ?.explanation) {
        setCurrentExplanation(currentQ.explanation);
      } else {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, paper })
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

  // Submit review
  const submitReview = async (cardId, isCorrect, userResponse, timeTaken, difficultyRating = null) => {
    setSaveStatus('saving');
    
    try {
      const currentCard = cards[currentCardIndex];
      const currentQuestion = questions.find(q => 
        (q.main_id || q.id) === currentCard.question_id
      );
      
      const response = await fetch('/api/spaced-repetition/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          isCorrect,
          userResponse,
          correctAnswer: currentQuestion.correct_answer.toLowerCase(),
          timeTaken,
          difficultyRating,
          sessionId
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }

      // Update card in local state
      setCards(prev => prev.map(card => 
        card.id === cardId ? result.card : card
      ));
      
      // Add to reviewed cards
      setReviewedCards(prev => [...prev, {
        cardId,
        questionId: currentCard.question_id,
        isCorrect,
        userResponse,
        timeTaken,
        timestamp: new Date()
      }]);
      
      // Update session stats
      setSessionStats(prev => ({
        reviewed: prev.reviewed + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        timeSpent: prev.timeSpent + timeTaken
      }));
      
      setSaveStatus('success');
      logDebug('Review submitted successfully:', result);
      
    } catch (error) {
      logDebug('Error submitting review:', error);
      setSaveStatus('error');
      setSaveError(error.message);
    }
  };

  // Handle option selection
  const handleOptionSelect = async (option) => {
    if (selectedOption || isTransitioning || showExplanation) return;
    
    const currentCard = cards[currentCardIndex];
    const currentQuestion = questions.find(q => 
      (q.main_id || q.id) === currentCard.question_id
    );
    
    if (!currentCard || !currentQuestion) return;
    
    const isCorrect = isCorrectAnswer(option, currentQuestion.correct_answer);
    const timeTaken = startTime ? Math.floor((new Date() - startTime) / 1000) : 30;
    
    setSelectedOption(option);
    setShowExplanation(true);
    setIsExplanationExpanded(true);
    
    // Load explanation and submit review
    await Promise.all([
      loadExplanation(currentQuestion.main_id || currentQuestion.id, currentQuestion.paper),
      submitReview(currentCard.id, isCorrect, option, timeTaken)
    ]);
  };

  // Handle next card
  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1);
        resetQuestionState();
        setIsTransitioning(false);
        setStartTime(new Date()); // Reset timer for next question
      }, 150);
    } else {
      // Session complete
      setCurrentView('stats');
    }
  };

  // Handle previous card
  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCardIndex(prev => prev - 1);
        resetQuestionState();
        setIsTransitioning(false);
        setStartTime(new Date());
      }, 150);
    }
  };

  // Navigate between views
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'stats' || view === 'progress') {
      fetchUserStats();
    }
  };

  // Get current question and card
  const currentCard = cards[currentCardIndex] || {};
  const currentQuestion = questions.find(q => 
    (q.main_id || q.id) === currentCard.question_id
  ) || {};

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentView !== 'session') return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePreviousCard();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (selectedOption) {
            handleNextCard();
          }
          break;
        case 'a':
        case 'b':
        case 'c':
        case 'd':
          if (!selectedOption) {
            handleOptionSelect(e.key);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, selectedOption, currentCardIndex, cards.length]);

  // Save Status Indicator
  const SaveStatusIndicator = () => {
    if (!session) return null;
    
    return (
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-50"
          >
            {saveStatus === 'saving' && (
              <div className="bg-blue-100/90 dark:bg-blue-900/90 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 p-3 rounded-2xl shadow-lg flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm font-medium">Saving review...</span>
              </div>
            )}
            
            {saveStatus === 'success' && (
              <div className="bg-emerald-100/90 dark:bg-emerald-900/90 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 p-3 rounded-2xl shadow-lg flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Review saved!</span>
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="bg-red-100/90 dark:bg-red-900/90 backdrop-blur-xl border border-red-200/50 dark:border-red-700/50 text-red-700 dark:text-red-300 p-3 rounded-2xl shadow-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Save failed!</span>
                </div>
                {saveError && (
                  <p className="text-xs mt-1 opacity-90">{saveError}</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Loading screen
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
        >
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
          <p className="text-lg font-light text-gray-700 dark:text-gray-300">
            {currentView === 'selector' ? 'Loading spaced repetition...' : 'Loading cards...'}
          </p>
        </motion.div>
      </div>
    );
  }

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'selector':
        return (
          <SpacedRepetitionSelector
            onStartSession={startSession}
            userStats={userStats}
          />
        );
      
      case 'session':
        return (
          <SpacedRepetitionSession
            cards={cards}
            questions={questions}
            currentCardIndex={currentCardIndex}
            selectedOption={selectedOption}
            showExplanation={showExplanation}
            currentExplanation={currentExplanation}
            isLoadingExplanation={isLoadingExplanation}
            isExplanationExpanded={isExplanationExpanded}
            onOptionSelect={handleOptionSelect}
            onNextCard={handleNextCard}
            onPreviousCard={handlePreviousCard}
            onToggleExplanation={setIsExplanationExpanded}
            sessionStats={sessionStats}
            startTime={startTime}
            isTransitioning={isTransitioning}
            onBackToMenu={() => setCurrentView('selector')}
          />
        );
      
      case 'stats':
        return (
          <SpacedRepetitionStats
            userStats={userStats}
            sessionStats={sessionStats}
            reviewedCards={reviewedCards}
            onBackToMenu={() => setCurrentView('selector')}
            onStartNewSession={() => setCurrentView('selector')}
          />
        );
      
      case 'progress':
        return (
          <SpacedRepetitionProgress
            userStats={userStats}
            onBackToMenu={() => setCurrentView('selector')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans relative overflow-hidden transition-all duration-500"
    >
      {/* Navigation Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-light text-gray-900 dark:text-gray-100">
                Spaced Repetition
              </h1>
              {currentView === 'session' && (
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {currentCardIndex + 1} / {cards.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {sessionStats.correct} / {sessionStats.reviewed}
                  </span>
                  {startTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(Math.floor((new Date() - startTime) / 1000))}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleViewChange('selector')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  currentView === 'selector' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleViewChange('stats')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  currentView === 'stats' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Stats
              </button>
              <button
                onClick={() => handleViewChange('progress')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  currentView === 'progress' 
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </div>

      <SaveStatusIndicator />
    </div>
  );
}
