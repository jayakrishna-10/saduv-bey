// FILE: app/lib/quiz-utils.js
import { clsx } from 'clsx';
import { dedupeRequest } from './request-dedup';

// Common utility functions for quiz and test components

export const normalizeChapterName = (chapter) => {
  if (!chapter) return '';
  return chapter
    .replace(/['"]/g, '')
    .trim()
    .replace(/Act,?\s+(\d{4})/g, 'Act $1')
    .replace(/\s+/g, ' ')
    .replace(/\s+and\s+/g, ' and ')
    .replace(/^Chapter\s+/i, '')
    .replace(/^chapter_/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const normalizeOptionText = (text) => {
  if (!text) return '';
  let normalizedText = text.replace(/['"]/g, '').trim();
  return normalizedText.charAt(0).toUpperCase() + normalizedText.slice(1);
};

export const isCorrectAnswer = (option, correctAnswer) => {
  if (!option || !correctAnswer) return false;
  return option === correctAnswer || 
         option.toLowerCase() === correctAnswer.toLowerCase() || 
         option.toUpperCase() === correctAnswer.toUpperCase();
};

export const formatTime = (seconds) => {
  if (!seconds || seconds < 0) return '0m 0s';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const formatTimeDetailed = (seconds) => {
  if (!seconds || seconds < 0) return { hours: 0, minutes: 0, seconds: 0 };
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return { hours, minutes, seconds: remainingSeconds };
};

export const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit',
    color: 'from-blue-500 to-indigo-600',
    topics: ['Energy Scenario', 'Energy Forms', 'Energy Management', 'Material Balance', 'Financial Management']
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    description: 'Energy Efficiency in Thermal Utilities',
    color: 'from-orange-500 to-red-600',
    topics: ['Fuels & Combustion', 'Boilers', 'Steam Systems', 'Furnaces', 'Cogeneration']
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    color: 'from-emerald-500 to-cyan-600',
    topics: ['Motors', 'Compressed Air', 'HVAC', 'Lighting', 'Power Factor']
  }
};

// Cache for topics to prevent repeated fetching
const topicsCache = new Map();
const TOPICS_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Enhanced navigation utilities
export const getNextAvailableQuestion = (questions, currentIndex, completedQuestionIds) => {
  if (!questions || questions.length === 0) return null;
  
  const totalQuestions = questions.length;
  let nextIndex = (currentIndex + 1) % totalQuestions;
  let searchCount = 0;
  
  while (searchCount < totalQuestions) {
    const question = questions[nextIndex];
    const questionId = question?.main_id || question?.id;
    
    if (questionId && !completedQuestionIds.has(questionId)) {
      return nextIndex;
    }
    
    nextIndex = (nextIndex + 1) % totalQuestions;
    searchCount++;
  }
  
  return null;
};

export const getPreviousAvailableQuestion = (questions, currentIndex, completedQuestionIds) => {
  if (!questions || questions.length === 0) return null;
  
  const totalQuestions = questions.length;
  let prevIndex = currentIndex === 0 ? totalQuestions - 1 : currentIndex - 1;
  let searchCount = 0;
  
  while (searchCount < totalQuestions) {
    if (prevIndex !== currentIndex) {
      return prevIndex;
    }
    
    prevIndex = prevIndex === 0 ? totalQuestions - 1 : prevIndex - 1;
    searchCount++;
  }
  
  return null;
};

/**
 * Optimized question fetching with deduplication
 */
export const fetchQuizQuestions = async (selectedPaper, questionCount, selectedTopic = 'all') => {
  const requestKey = `quiz-${selectedPaper}-${questionCount}-${selectedTopic}`;
  
  return dedupeRequest(requestKey, async () => {
    try {
      const startTime = performance.now();
      
      const params = new URLSearchParams({
        paper: selectedPaper,
        limit: questionCount.toString(),
        ...(selectedTopic !== 'all' && { topic: selectedTopic })
      });

      console.log(`[QUIZ] Fetching ${questionCount} questions from ${selectedPaper}`);

      const response = await fetch(`/api/quiz?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache headers for browser caching
        cache: 'no-store' // Disable browser cache since we handle server-side caching
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.questions || !Array.isArray(result.questions)) {
        throw new Error('Invalid response format: questions array not found');
      }

      const loadTime = performance.now() - startTime;
      console.log(`[QUIZ] Loaded ${result.questions.length} questions in ${loadTime.toFixed(0)}ms`);

      // Normalize the data
      const normalizedData = result.questions.map(q => ({
        ...q,
        option_a: normalizeOptionText(q.option_a),
        option_b: normalizeOptionText(q.option_b),
        option_c: normalizeOptionText(q.option_c),
        option_d: normalizeOptionText(q.option_d),
        // Add paper info for explanation fetching
        paper: selectedPaper
      }));
      
      return normalizedData;
    } catch (err) {
      console.error('[QUIZ] Fetch error:', err);
      throw new Error(`Failed to fetch questions: ${err.message}`);
    }
  });
};

/**
 * Optimized topics fetching with caching and deduplication
 */
export const fetchTopics = async (selectedPaper) => {
  const cacheKey = `topics-${selectedPaper}`;
  
  // Check in-memory cache first
  const cached = topicsCache.get(cacheKey);
  if (cached && cached.timestamp > Date.now() - TOPICS_CACHE_DURATION) {
    console.log(`[TOPICS] Using in-memory cache for ${selectedPaper}`);
    return cached.data;
  }
  
  const requestKey = `topics-${selectedPaper}`;
  
  return dedupeRequest(requestKey, async () => {
    try {
      const startTime = performance.now();
      console.log(`[TOPICS] Fetching topics for ${selectedPaper}`);
      
      const response = await fetch(`/api/topics?paper=${selectedPaper}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const loadTime = performance.now() - startTime;
        console.log(`[TOPICS] Loaded ${result.topics?.length || 0} topics in ${loadTime.toFixed(0)}ms`);
        
        const topics = result.topics || [];
        
        // Cache the result in memory
        topicsCache.set(cacheKey, {
          data: topics,
          timestamp: Date.now()
        });
        
        return topics;
      } else {
        console.error('[TOPICS] Failed to fetch:', response.status);
        return [];
      }
    } catch (error) {
      console.error('[TOPICS] Fetch error:', error);
      return [];
    }
  });
};

/**
 * Prefetch topics for all papers (for performance)
 */
export const prefetchAllTopics = async () => {
  console.log('[TOPICS] Prefetching all topics');
  const papers = ['paper1', 'paper2', 'paper3'];
  
  // Check if already cached
  const allCached = papers.every(paper => {
    const cached = topicsCache.get(`topics-${paper}`);
    return cached && cached.timestamp > Date.now() - TOPICS_CACHE_DURATION;
  });
  
  if (allCached) {
    console.log('[TOPICS] All topics already cached');
    return;
  }
  
  // Fetch all topics in parallel
  await Promise.all(papers.map(paper => fetchTopics(paper)));
};

/**
 * Fetch explanation for a specific question
 */
export const fetchQuestionExplanation = async (questionId, paper) => {
  const requestKey = `explanation-${paper}-${questionId}`;
  
  return dedupeRequest(requestKey, async () => {
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, paper })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch explanation');
      }
      
      const result = await response.json();
      return result.explanation || null;
    } catch (error) {
      console.error('[EXPLANATION] Fetch error:', error);
      return null;
    }
  });
};

/**
 * Enhanced quiz attempt saving with deduplication and proper error handling
 * This prevents duplicate saves that were causing wrong dashboard stats
 */
export const saveQuizAttemptWithDedup = async (params) => {
  const { session, answeredQuestions, startTime, selectedPaper, selectedTopic, questionCount, questions } = params;
  
  if (!session?.user?.id || !answeredQuestions || answeredQuestions.length === 0) {
    throw new Error('Invalid save parameters');
  }

  // Create a unique key for this specific quiz attempt
  const userId = session.user.id;
  const attemptTimestamp = startTime ? startTime.getTime() : Date.now();
  const quizSignature = `${selectedPaper}-${selectedTopic}-${questionCount}-${answeredQuestions.length}`;
  const requestKey = `save-quiz-${userId}-${attemptTimestamp}-${quizSignature}`;
  
  console.log(`[QUIZ-SAVE] Attempting to save quiz with key: ${requestKey}`);
  
  return dedupeRequest(requestKey, async () => {
    try {
      const summary = generateQuizSummary(answeredQuestions, startTime);
      
      const attemptData = {
        paper: selectedPaper,
        selectedTopic: selectedTopic,
        questionCount: questionCount,
        questionsData: questions.map(({ id, main_id, question_text, correct_answer, tag, year }) => ({ 
          id, main_id, question_text, correct_answer, tag, year 
        })),
        answers: answeredQuestions.map(({ questionId, selectedOption, isCorrect }) => ({ 
          questionId, selectedOption, isCorrect 
        })),
        correctAnswers: summary.correctAnswers,
        totalQuestions: answeredQuestions.length,
        score: summary.score,
        timeTaken: summary.timeTaken,
      };

      console.log(`[QUIZ-SAVE] Saving quiz attempt:`, {
        paper: selectedPaper,
        questionCount: questionCount,
        answeredCount: answeredQuestions.length,
        score: summary.score,
        timeTaken: summary.timeTaken
      });

      const response = await fetch('/api/user/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quiz', attemptData }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseData.error || 'Unknown error'}`);
      }

      console.log(`[QUIZ-SAVE] Quiz attempt saved successfully with ID: ${responseData.data?.id}`);
      return responseData.data?.id || `saved-${Date.now()}`;
      
    } catch (error) {
      console.error('[QUIZ-SAVE] Error saving quiz attempt:', error);
      throw error;
    }
  });
};

// Legacy function name kept for backward compatibility
export const fetchTopicsAndYears = async (selectedPaper) => {
  const topics = await fetchTopics(selectedPaper);
  return { topics, years: [] };
};

export const getQuestionsByStatus = (questions, completedQuestionIds, answeredQuestions) => {
  const answerLookup = {};
  answeredQuestions.forEach(answer => {
    answerLookup[answer.questionId] = answer;
  });

  const categorized = {
    unanswered: [],
    correct: [],
    incorrect: [],
    viewed: []
  };

  questions.forEach((question, index) => {
    const questionId = question.main_id || question.id;
    const isCompleted = completedQuestionIds.has(questionId);
    const answer = answerLookup[questionId];

    if (!isCompleted) {
      categorized.unanswered.push({ question, index });
    } else if (answer?.isCorrect) {
      categorized.correct.push({ question, index, answer });
    } else if (answer && !answer.isCorrect) {
      categorized.incorrect.push({ question, index, answer });
    } else {
      categorized.viewed.push({ question, index });
    }
  });

  return categorized;
};

export const generateQuizSummary = (answeredQuestions, startTime) => {
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  const totalAnswered = answeredQuestions.length;
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const incorrectAnswers = totalAnswered - correctAnswers;
  const score = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  const chapterPerformance = answeredQuestions.reduce((acc, q) => {
    const normalizedChapter = normalizeChapterName(q.chapter || q.tag);
    
    if (!acc[normalizedChapter]) {
      acc[normalizedChapter] = { 
        total: 0, 
        correct: 0, 
        timeSpent: 0,
        questions: []
      };
    }
    acc[normalizedChapter].total += 1;
    acc[normalizedChapter].questions.push(q);
    if (q.isCorrect) acc[normalizedChapter].correct += 1;
    return acc;
  }, {});

  const averageTimePerQuestion = totalAnswered > 0 ? timeTaken / totalAnswered : 0;
  const strongestChapter = Object.entries(chapterPerformance)
    .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total))[0];
  const weakestChapter = Object.entries(chapterPerformance)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))[0];

  return {
    timeTaken,
    totalAnswered,
    correctAnswers,
    incorrectAnswers,
    score,
    chapterPerformance,
    averageTimePerQuestion: Math.round(averageTimePerQuestion),
    strongestChapter: strongestChapter ? {
      name: strongestChapter[0],
      accuracy: Math.round((strongestChapter[1].correct / strongestChapter[1].total) * 100)
    } : null,
    weakestChapter: weakestChapter ? {
      name: weakestChapter[0],
      accuracy: Math.round((weakestChapter[1].correct / weakestChapter[1].total) * 100)
    } : null
  };
};

// Performance analysis utilities
export const analyzePerformance = (answeredQuestions) => {
  if (!answeredQuestions || answeredQuestions.length === 0) {
    return {
      overallAccuracy: 0,
      trend: 'stable',
      consistency: 0,
      recommendations: []
    };
  }

  const totalQuestions = answeredQuestions.length;
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const overallAccuracy = Math.round((correctAnswers / totalQuestions) * 100);

  const firstHalf = answeredQuestions.slice(0, Math.floor(totalQuestions / 2));
  const secondHalf = answeredQuestions.slice(Math.floor(totalQuestions / 2));
  
  const firstHalfAccuracy = firstHalf.length > 0 ? 
    (firstHalf.filter(q => q.isCorrect).length / firstHalf.length) * 100 : 0;
  const secondHalfAccuracy = secondHalf.length > 0 ? 
    (secondHalf.filter(q => q.isCorrect).length / secondHalf.length) * 100 : 0;

  let trend = 'stable';
  if (secondHalfAccuracy > firstHalfAccuracy + 10) trend = 'improving';
  else if (secondHalfAccuracy < firstHalfAccuracy - 10) trend = 'declining';

  const runningAccuracies = [];
  for (let i = 1; i <= totalQuestions; i++) {
    const subset = answeredQuestions.slice(0, i);
    const accuracy = (subset.filter(q => q.isCorrect).length / subset.length) * 100;
    runningAccuracies.push(accuracy);
  }
  
  const meanAccuracy = runningAccuracies.reduce((a, b) => a + b, 0) / runningAccuracies.length;
  const variance = runningAccuracies.reduce((acc, acc_curr) => acc + Math.pow(acc_curr - meanAccuracy, 2), 0) / runningAccuracies.length;
  const consistency = Math.max(0, 100 - Math.sqrt(variance));

  const recommendations = [];
  if (overallAccuracy < 60) {
    recommendations.push('Focus on understanding fundamental concepts');
    recommendations.push('Review explanation for each incorrect answer');
  } else if (overallAccuracy < 80) {
    recommendations.push('Practice more questions in weaker topics');
    recommendations.push('Time yourself to improve speed');
  } else {
    recommendations.push('Excellent performance! Try timed practice tests');
    recommendations.push('Focus on consistency across all topics');
  }

  if (trend === 'declining') {
    recommendations.push('Take breaks to avoid fatigue');
  }

  return {
    overallAccuracy,
    trend,
    consistency: Math.round(consistency),
    recommendations: recommendations.slice(0, 3)
  };
};

// Utility functions for UI state management
export const cn = (...classes) => {
  return clsx(classes);
};

export const getProgressColor = (percentage) => {
  if (percentage < 25) return 'from-red-500 to-orange-500';
  if (percentage < 50) return 'from-orange-500 to-yellow-500';
  if (percentage < 75) return 'from-yellow-500 to-blue-500';
  return 'from-blue-500 to-green-500';
};

export const getAccuracyColor = (accuracy) => {
  if (accuracy < 40) return 'text-red-600 dark:text-red-400';
  if (accuracy < 60) return 'text-orange-600 dark:text-orange-400';
  if (accuracy < 80) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-green-600 dark:text-green-400';
};

// Animation utilities
export const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

export const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Local storage utilities with error handling
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
    return false;
  }
};

// Clear topics cache (useful for forcing refresh)
export const clearTopicsCache = () => {
  topicsCache.clear();
  console.log('[TOPICS] Cache cleared');
};

// Keyboard shortcuts utility
export const KEYBOARD_SHORTCUTS = {
  PREVIOUS_QUESTION: 'ArrowLeft',
  NEXT_QUESTION: 'ArrowRight',
  SHOW_ANSWER: 'h',
  OPTION_A: 'a',
  OPTION_B: 'b',
  OPTION_C: 'c',
  OPTION_D: 'd',
  OVERVIEW: 'Escape',
  SUBMIT: ' ',
};

export const handleKeyboardShortcut = (event, handlers) => {
  const { key } = event;
  
  if (handlers[key]) {
    event.preventDefault();
    handlers[key]();
  }
};

// Accessibility utilities
export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export default {
  normalizeChapterName,
  normalizeOptionText,
  isCorrectAnswer,
  formatTime,
  formatTimeDetailed,
  PAPERS,
  getNextAvailableQuestion,
  getPreviousAvailableQuestion,
  getQuestionsByStatus,
  fetchQuizQuestions,
  fetchTopics,
  fetchTopicsAndYears,
  prefetchAllTopics,
  fetchQuestionExplanation,
  saveQuizAttemptWithDedup,
  generateQuizSummary,
  analyzePerformance,
  cn,
  getProgressColor,
  getAccuracyColor,
  slideVariants,
  fadeVariants,
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  clearTopicsCache,
  KEYBOARD_SHORTCUTS,
  handleKeyboardShortcut,
  announceToScreenReader
};
