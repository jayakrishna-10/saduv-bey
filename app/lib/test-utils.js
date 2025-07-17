// app/lib/test-utils.js
import { clsx } from 'clsx';

// Import functions from quiz-utils that we need to re-export
const normalizeChapterName = (chapter) => {
  if (!chapter || typeof chapter !== 'string') return 'Unknown';
  
  return chapter
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
};

const normalizeOptionText = (text) => {
  if (!text) return '';
  return text.trim();
};

const isCorrectAnswer = (selectedOption, correctAnswer) => {
  if (!selectedOption || !correctAnswer) return false;
  return selectedOption.toLowerCase() === correctAnswer.toLowerCase();
};

// Test-specific constants
export const TEST_TYPES = {
  mock: {
    id: 'mock',
    name: 'Mock Test',
    description: 'Simulate the real NCE exam experience',
    icon: '🎯',
    questionCount: 50,
    timeLimit: 3600, // 60 minutes in seconds
    showChapterInfo: false,
    showYearInfo: false,
    color: 'from-red-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30'
  },
  practice: {
    id: 'practice',
    name: 'Practice Test',
    description: 'Focused practice with topic selection',
    icon: '📚',
    timePerQuestion: 72, // 72 seconds per question
    showChapterInfo: true,
    showYearInfo: false,
    color: 'from-blue-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30'
  }
};

export const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
    icon: '📊',
    topics: 9
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    description: 'Energy Efficiency in Thermal Utilities',
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
    icon: '🔥',
    topics: 8
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    color: 'from-emerald-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-emerald-50 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30',
    icon: '⚡',
    topics: 10
  }
};

// Test question status
export const QUESTION_STATUS = {
  UNANSWERED: 'unanswered',
  ANSWERED: 'answered',
  FLAGGED: 'flagged',
  ANSWERED_FLAGGED: 'answered_flagged',
  CURRENT: 'current'
};

// Time utilities
export const formatTime = (seconds) => {
  if (!seconds || seconds < 0) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatTimeDetailed = (seconds) => {
  if (!seconds || seconds < 0) return { hours: 0, minutes: 0, seconds: 0 };
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return { hours, minutes, seconds: remainingSeconds };
};

export const getTimeWarningLevel = (remainingTime, totalTime) => {
  const percentage = (remainingTime / totalTime) * 100;
  if (percentage <= 10) return 'critical'; // Red
  if (percentage <= 25) return 'warning'; // Orange
  if (percentage <= 50) return 'caution'; // Yellow
  return 'normal'; // Green
};

// Question status utilities
export const getQuestionStatus = (questionIndex, currentIndex, answeredQuestions, flaggedQuestions) => {
  const isAnswered = answeredQuestions.has(questionIndex);
  const isFlagged = flaggedQuestions.has(questionIndex);
  const isCurrent = questionIndex === currentIndex;
  
  if (isCurrent) return QUESTION_STATUS.CURRENT;
  if (isAnswered && isFlagged) return QUESTION_STATUS.ANSWERED_FLAGGED;
  if (isFlagged) return QUESTION_STATUS.FLAGGED;
  if (isAnswered) return QUESTION_STATUS.ANSWERED;
  return QUESTION_STATUS.UNANSWERED;
};

export const getStatusColor = (status) => {
  switch (status) {
    case QUESTION_STATUS.CURRENT:
      return 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-500';
    case QUESTION_STATUS.ANSWERED:
      return 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600';
    case QUESTION_STATUS.FLAGGED:
      return 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600';
    case QUESTION_STATUS.ANSWERED_FLAGGED:
      return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case QUESTION_STATUS.CURRENT:
      return '👁️';
    case QUESTION_STATUS.ANSWERED:
      return '✓';
    case QUESTION_STATUS.FLAGGED:
      return '🚩';
    case QUESTION_STATUS.ANSWERED_FLAGGED:
      return '✓🚩';
    default:
      return '';
  }
};

// Test navigation utilities
export const getNextQuestion = (currentIndex, totalQuestions) => {
  return currentIndex < totalQuestions - 1 ? currentIndex + 1 : null;
};

export const getPreviousQuestion = (currentIndex) => {
  return currentIndex > 0 ? currentIndex - 1 : null;
};

export const getFirstUnansweredQuestion = (answeredQuestions, totalQuestions) => {
  for (let i = 0; i < totalQuestions; i++) {
    if (!answeredQuestions.has(i)) {
      return i;
    }
  }
  return null;
};

// Fetch topics function
export const fetchTopics = async (paper) => {
  try {
    const response = await fetch(`/api/quiz/topics?paper=${paper}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch topics`);
    }
    
    const result = await response.json();
    
    if (!result.topics || !Array.isArray(result.topics)) {
      throw new Error('Invalid response format: topics array not found');
    }
    
    return result.topics;
  } catch (err) {
    console.error('Fetch topics error:', err);
    // Return default topics if fetch fails
    return [
      'Energy Management Fundamentals',
      'Energy Audit Principles',
      'Thermal Systems',
      'Electrical Systems',
      'Renewable Energy',
      'Energy Conservation',
      'Energy Economics',
      'Environmental Impact'
    ];
  }
};

// Test data fetching
export const fetchTestQuestions = async (testType, selectedPaper, questionCount = null, selectedTopic = 'all') => {
  try {
    const params = new URLSearchParams({
      paper: selectedPaper,
      limit: (questionCount || TEST_TYPES[testType].questionCount || 50).toString()
    });

    if (selectedTopic !== 'all') {
      params.append('topic', selectedTopic);
    }

    console.log(`Fetching ${testType} test questions with params:`, params.toString());

    const response = await fetch(`/api/quiz?${params}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error('Invalid response format: questions array not found');
    }

    console.log(`Successfully fetched ${result.questions.length} questions for ${testType} test`);

    // Normalize the data
    const normalizedData = result.questions.map(q => ({
      ...q,
      option_a: normalizeOptionText(q.option_a),
      option_b: normalizeOptionText(q.option_b),
      option_c: normalizeOptionText(q.option_c),
      option_d: normalizeOptionText(q.option_d)
    }));
    
    // Shuffle for randomization
    const shuffledQuestions = normalizedData.sort(() => Math.random() - 0.5);
    
    return shuffledQuestions;
  } catch (err) {
    console.error('Fetch test questions error:', err);
    throw new Error(`Failed to fetch test questions: ${err.message}`);
  }
};

// Test analysis utilities
export const analyzeTestPerformance = (answers, questions, timeTaken, totalTime) => {
  if (!answers || answers.length === 0) {
    return {
      totalQuestions: questions?.length || 0,
      attemptedQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      unansweredQuestions: questions?.length || 0,
      accuracy: 0,
      timeEfficiency: 0,
      averageTimePerQuestion: 0,
      topicPerformance: {},
      recommendations: []
    };
  }

  const totalQuestions = questions.length;
  const attemptedQuestions = answers.length;
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = attemptedQuestions - correctAnswers;
  const unansweredQuestions = totalQuestions - attemptedQuestions;
  const accuracy = attemptedQuestions > 0 ? Math.round((correctAnswers / attemptedQuestions) * 100) : 0;
  const timeEfficiency = Math.round((timeTaken / totalTime) * 100);
  const averageTimePerQuestion = attemptedQuestions > 0 ? Math.round(timeTaken / attemptedQuestions) : 0;

  // Topic-wise performance analysis
  const topicPerformance = {};
  answers.forEach(answer => {
    const topic = normalizeChapterName(answer.chapter || answer.tag) || 'Unknown';
    if (!topicPerformance[topic]) {
      topicPerformance[topic] = { total: 0, correct: 0, timeSpent: 0 };
    }
    topicPerformance[topic].total += 1;
    if (answer.isCorrect) topicPerformance[topic].correct += 1;
  });

  // Generate recommendations
  const recommendations = [];
  
  if (accuracy < 40) {
    recommendations.push('Focus on fundamental concepts and theory');
    recommendations.push('Review all incorrect answers carefully');
  } else if (accuracy < 60) {
    recommendations.push('Practice more questions in weak topics');
    recommendations.push('Improve time management strategies');
  } else if (accuracy < 80) {
    recommendations.push('Fine-tune knowledge in specific areas');
    recommendations.push('Practice under timed conditions');
  } else {
    recommendations.push('Excellent performance! Continue regular practice');
    recommendations.push('Focus on consistency across all topics');
  }

  if (unansweredQuestions > totalQuestions * 0.1) {
    recommendations.push('Improve time management - too many unanswered questions');
  }

  if (timeEfficiency > 90) {
    recommendations.push('Consider spending more time on difficult questions');
  } else if (timeEfficiency < 60) {
    recommendations.push('Good time management - you finished early');
  }

  return {
    totalQuestions,
    attemptedQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    accuracy,
    timeEfficiency,
    averageTimePerQuestion,
    topicPerformance,
    recommendations: recommendations.slice(0, 4) // Limit to top 4
  };
};

// Progress calculation
export const calculateProgress = (answeredQuestions, flaggedQuestions, totalQuestions) => {
  const answered = answeredQuestions.size;
  const flagged = flaggedQuestions.size;
  const progress = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;
  
  return {
    answered,
    flagged,
    unanswered: totalQuestions - answered,
    total: totalQuestions,
    progress
  };
};

// Question filtering for review
export const filterQuestionsForReview = (questions, answers, filter = 'all') => {
  const answerLookup = {};
  answers.forEach(answer => {
    answerLookup[answer.questionIndex] = answer;
  });

  return questions.map((question, index) => ({
    question,
    index,
    answer: answerLookup[index] || null,
    status: answerLookup[index] 
      ? (answerLookup[index].isCorrect ? 'correct' : 'incorrect')
      : 'unanswered'
  })).filter(item => {
    switch (filter) {
      case 'correct':
        return item.status === 'correct';
      case 'incorrect':
        return item.status === 'incorrect';
      case 'unanswered':
        return item.status === 'unanswered';
      default:
        return true;
    }
  });
};

// Export utility class name function
export const cn = (...classes) => {
  return clsx(classes);
};

// Animation variants for test components
export const testSlideVariants = {
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

export const testFadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Test completion scoring
export const calculateGrade = (accuracy) => {
  if (accuracy >= 90) return { grade: 'A+', color: 'emerald', message: 'Outstanding!' };
  if (accuracy >= 80) return { grade: 'A', color: 'green', message: 'Excellent!' };
  if (accuracy >= 70) return { grade: 'B+', color: 'blue', message: 'Very Good!' };
  if (accuracy >= 60) return { grade: 'B', color: 'indigo', message: 'Good!' };
  if (accuracy >= 50) return { grade: 'C+', color: 'yellow', message: 'Satisfactory' };
  if (accuracy >= 40) return { grade: 'C', color: 'orange', message: 'Needs Improvement' };
  return { grade: 'F', color: 'red', message: 'Requires Significant Study' };
};

// Auto-save functionality for test progress
export const saveTestProgress = (testData) => {
  try {
    const progressKey = `test_progress_${testData.testType}_${testData.paper}`;
    const progressData = {
      ...testData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(progressKey, JSON.stringify(progressData));
    return true;
  } catch (error) {
    console.warn('Failed to save test progress:', error);
    return false;
  }
};

export const loadTestProgress = (testType, paper) => {
  try {
    const progressKey = `test_progress_${testType}_${paper}`;
    const saved = localStorage.getItem(progressKey);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load test progress:', error);
    return null;
  }
};

export const clearTestProgress = (testType, paper) => {
  try {
    const progressKey = `test_progress_${testType}_${paper}`;
    localStorage.removeItem(progressKey);
    return true;
  } catch (error) {
    console.warn('Failed to clear test progress:', error);
    return false;
  }
};

// Re-export functions from quiz-utils that TestApp needs
export { normalizeChapterName, normalizeOptionText, isCorrectAnswer };

// Default export
export default {
  TEST_TYPES,
  PAPERS,
  QUESTION_STATUS,
  formatTime,
  formatTimeDetailed,
  getTimeWarningLevel,
  getQuestionStatus,
  getStatusColor,
  getStatusIcon,
  getNextQuestion,
  getPreviousQuestion,
  getFirstUnansweredQuestion,
  fetchTopics,
  fetchTestQuestions,
  analyzeTestPerformance,
  calculateProgress,
  filterQuestionsForReview,
  calculateGrade,
  saveTestProgress,
  loadTestProgress,
  clearTestProgress,
  normalizeChapterName,
  normalizeOptionText,
  isCorrectAnswer,
  cn,
  testSlideVariants,
  testFadeVariants
};
