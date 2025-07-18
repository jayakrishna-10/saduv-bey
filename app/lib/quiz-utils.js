// app/lib/quiz-utils.js - Removed year filtering, streamlined for topics only
import { clsx } from 'clsx';

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

// Enhanced navigation utilities
export const getNextAvailableQuestion = (questions, currentIndex, completedQuestionIds) => {
  if (!questions || questions.length === 0) return null;
  
  const totalQuestions = questions.length;
  let nextIndex = (currentIndex + 1) % totalQuestions;
  let searchCount = 0;
  
  // Look for the next unanswered question
  while (searchCount < totalQuestions) {
    const question = questions[nextIndex];
    const questionId = question?.main_id || question?.id;
    
    if (questionId && !completedQuestionIds.has(questionId)) {
      return nextIndex;
    }
    
    nextIndex = (nextIndex + 1) % totalQuestions;
    searchCount++;
  }
  
  // If all questions are completed, return null
  return null;
};

export const getPreviousAvailableQuestion = (questions, currentIndex, completedQuestionIds) => {
  if (!questions || questions.length === 0) return null;
  
  const totalQuestions = questions.length;
  let prevIndex = currentIndex === 0 ? totalQuestions - 1 : currentIndex - 1;
  let searchCount = 0;
  
  // Look for the previous question (prioritize unanswered, but allow answered)
  while (searchCount < totalQuestions) {
    if (prevIndex !== currentIndex) {
      return prevIndex;
    }
    
    prevIndex = prevIndex === 0 ? totalQuestions - 1 : prevIndex - 1;
    searchCount++;
  }
  
  return null;
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

export const getRandomQuestionIndex = (questions, completedQuestionIds, excludeIndex = -1) => {
  const availableIndices = questions
    .map((_, index) => index)
    .filter(index => {
      const question = questions[index];
      const questionId = question?.main_id || question?.id;
      return index !== excludeIndex && questionId && !completedQuestionIds.has(questionId);
    });

  if (availableIndices.length === 0) return null;
  
  return availableIndices[Math.floor(Math.random() * availableIndices.length)];
};

// Enhanced question fetching with smart randomization - removed year parameter
export const fetchQuizQuestions = async (selectedPaper, questionCount, selectedTopic = 'all') => {
  try {
    // Calculate how many questions to fetch for better randomization
    // Fetch 3x the requested amount (minimum 50, maximum 500) to ensure variety
    const fetchMultiplier = 3;
    const minFetch = Math.max(50, questionCount);
    const maxFetch = 500;
    const fetchLimit = Math.min(maxFetch, Math.max(minFetch, questionCount * fetchMultiplier));

    const params = new URLSearchParams({
      paper: selectedPaper,
      limit: fetchLimit.toString()
    });

    if (selectedTopic !== 'all') {
      params.append('topic', selectedTopic);
    }

    console.log(`Fetching ${fetchLimit} questions to randomly select ${questionCount} for better variety`);
    console.log('Fetching questions with params:', params.toString());

    const response = await fetch(`/api/quiz?${params}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error('Invalid response format: questions array not found');
    }

    console.log(`Successfully fetched ${result.questions.length} questions from ${selectedPaper}`);

    // Normalize the data
    const normalizedData = result.questions.map(q => ({
      ...q,
      option_a: normalizeOptionText(q.option_a),
      option_b: normalizeOptionText(q.option_b),
      option_c: normalizeOptionText(q.option_c),
      option_d: normalizeOptionText(q.option_d)
    }));
    
    // Advanced randomization strategy
    const randomizedQuestions = getRandomizedQuestionSet(normalizedData, questionCount);
    
    console.log(`Selected ${randomizedQuestions.length} randomized questions from pool of ${normalizedData.length}`);
    
    return randomizedQuestions;
  } catch (err) {
    console.error('Fetch questions error:', err);
    throw new Error(`Failed to fetch questions: ${err.message}`);
  }
};

// Advanced randomization function to ensure variety across quiz attempts
export const getRandomizedQuestionSet = (questions, targetCount) => {
  if (!questions || questions.length === 0) {
    return [];
  }

  // If we have fewer questions than requested, return all shuffled
  if (questions.length <= targetCount) {
    return [...questions].sort(() => Math.random() - 0.5);
  }

  // Strategy 1: Try to get diverse questions across different topics/years
  const questionsByTopic = {};
  const questionsByYear = {};
  
  questions.forEach(q => {
    const normalizedTopic = normalizeChapterName(q.tag) || 'Unknown';
    const year = q.year || 'Unknown';
    
    if (!questionsByTopic[normalizedTopic]) {
      questionsByTopic[normalizedTopic] = [];
    }
    if (!questionsByYear[year]) {
      questionsByYear[year] = [];
    }
    
    questionsByTopic[normalizedTopic].push(q);
    questionsByYear[year].push(q);
  });

  const topics = Object.keys(questionsByTopic);
  const years = Object.keys(questionsByYear);
  
  console.log(`Randomizing from ${topics.length} topics and ${years.length} years`);

  // Strategy: Balanced selection across topics when possible
  const selectedQuestions = [];
  const usedQuestionIds = new Set();
  
  // First pass: Try to get at least one question from each topic
  if (topics.length > 1 && targetCount >= topics.length) {
    topics.forEach(topic => {
      const topicQuestions = questionsByTopic[topic];
      if (topicQuestions.length > 0 && selectedQuestions.length < targetCount) {
        const randomQuestion = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
        const questionId = randomQuestion.main_id || randomQuestion.id;
        
        if (!usedQuestionIds.has(questionId)) {
          selectedQuestions.push(randomQuestion);
          usedQuestionIds.add(questionId);
        }
      }
    });
  }

  // Second pass: Fill remaining slots with random questions
  const remainingQuestions = questions.filter(q => {
    const questionId = q.main_id || q.id;
    return !usedQuestionIds.has(questionId);
  });

  while (selectedQuestions.length < targetCount && remainingQuestions.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const randomQuestion = remainingQuestions[randomIndex];
    const questionId = randomQuestion.main_id || randomQuestion.id;
    
    selectedQuestions.push(randomQuestion);
    usedQuestionIds.add(questionId);
    
    // Remove the selected question from remaining pool
    remainingQuestions.splice(randomIndex, 1);
  }

  // Final shuffle of the selected questions
  const finalQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
  
  // Log the distribution for debugging
  const finalTopicDistribution = {};
  finalQuestions.forEach(q => {
    const topic = normalizeChapterName(q.tag) || 'Unknown';
    finalTopicDistribution[topic] = (finalTopicDistribution[topic] || 0) + 1;
  });
  
  console.log('Final question distribution by topic:', finalTopicDistribution);
  
  return finalQuestions;
};

// Streamlined to only fetch topics - removed years entirely
export const fetchTopics = async (selectedPaper) => {
  try {
    console.log('Fetching topics for paper:', selectedPaper);
    
    // Fetch all questions to get comprehensive topic list (no limit to ensure we get all topics)
    const response = await fetch(`/api/quiz?paper=${selectedPaper}`);
    if (response.ok) {
      const result = await response.json();
      const questions = result.questions || [];
      
      console.log(`Fetched ${questions.length} questions for topic analysis for ${selectedPaper}`);
      
      // Extract unique topics and normalize them
      const uniqueTopics = [...new Set(questions.map(q => normalizeChapterName(q.tag)))]
        .filter(Boolean)
        .sort();
      
      console.log(`Found ${uniqueTopics.length} unique topics for ${selectedPaper}`);
      console.log('Topics:', uniqueTopics);
      
      return uniqueTopics;
    } else {
      console.error('Failed to fetch topics:', response.status);
    }
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
  return [];
};

// Legacy function name kept for backward compatibility - now only returns topics
export const fetchTopicsAndYears = async (selectedPaper) => {
  const topics = await fetchTopics(selectedPaper);
  return { topics, years: [] }; // Always return empty years array
};

export const generateQuizSummary = (answeredQuestions, startTime) => {
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  const totalAnswered = answeredQuestions.length;
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const incorrectAnswers = totalAnswered - correctAnswers;
  const score = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  // Enhanced chapter performance analysis
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

  // Calculate performance metrics
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

  // Calculate performance trend (last 10 vs first 10)
  const firstHalf = answeredQuestions.slice(0, Math.floor(totalQuestions / 2));
  const secondHalf = answeredQuestions.slice(Math.floor(totalQuestions / 2));
  
  const firstHalfAccuracy = firstHalf.length > 0 ? 
    (firstHalf.filter(q => q.isCorrect).length / firstHalf.length) * 100 : 0;
  const secondHalfAccuracy = secondHalf.length > 0 ? 
    (secondHalf.filter(q => q.isCorrect).length / secondHalf.length) * 100 : 0;

  let trend = 'stable';
  if (secondHalfAccuracy > firstHalfAccuracy + 10) trend = 'improving';
  else if (secondHalfAccuracy < firstHalfAccuracy - 10) trend = 'declining';

  // Calculate consistency (standard deviation of running accuracy)
  const runningAccuracies = [];
  for (let i = 1; i <= totalQuestions; i++) {
    const subset = answeredQuestions.slice(0, i);
    const accuracy = (subset.filter(q => q.isCorrect).length / subset.length) * 100;
    runningAccuracies.push(accuracy);
  }
  
  const meanAccuracy = runningAccuracies.reduce((a, b) => a + b, 0) / runningAccuracies.length;
  const variance = runningAccuracies.reduce((acc, acc_curr) => acc + Math.pow(acc_curr - meanAccuracy, 2), 0) / runningAccuracies.length;
  const consistency = Math.max(0, 100 - Math.sqrt(variance));

  // Generate recommendations
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
    recommendations: recommendations.slice(0, 3) // Limit to top 3
  };
};

// Utility for creating custom question sets with advanced randomization
export const createCustomQuestionSet = (questions, filters = {}) => {
  let filteredQuestions = [...questions];

  // Apply filters
  if (filters.topics && filters.topics.length > 0) {
    filteredQuestions = filteredQuestions.filter(q => 
      filters.topics.some(topic => 
        normalizeChapterName(q.tag).toLowerCase().includes(topic.toLowerCase())
      )
    );
  }

  if (filters.difficulty) {
    // If we had difficulty ratings, we could filter by them here
  }

  // Apply smart randomization instead of simple limit
  if (filters.limit && filters.limit > 0) {
    filteredQuestions = getRandomizedQuestionSet(filteredQuestions, filters.limit);
  } else if (filters.shuffle !== false) {
    // If no limit but shuffle requested, just shuffle all
    filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
  }

  return filteredQuestions;
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

// Local storage utilities (with error handling)
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
  SUBMIT: ' ', // Space
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
  getRandomQuestionIndex,
  fetchQuizQuestions,
  fetchTopics,
  fetchTopicsAndYears, // Legacy function for backward compatibility
  getRandomizedQuestionSet,
  generateQuizSummary,
  analyzePerformance,
  createCustomQuestionSet,
  cn,
  getProgressColor,
  getAccuracyColor,
  slideVariants,
  fadeVariants,
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  KEYBOARD_SHORTCUTS,
  handleKeyboardShortcut,
  announceToScreenReader
};
