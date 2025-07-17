// app/lib/test-utils.js - Test Utility Functions
import { clsx } from 'clsx';

// Re-export common utilities from quiz-utils
export {
  normalizeChapterName,
  normalizeOptionText,
  isCorrectAnswer,
  formatTime,
  formatTimeDetailed,
  PAPERS,
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
} from './quiz-utils';

// Test-specific constants
export const TEST_TYPES = {
  mock: {
    id: 'mock',
    name: 'Mock Test',
    description: 'Real exam simulation with 50 questions in 60 minutes',
    questionCount: 50,
    timeAllowed: 60 * 60, // 60 minutes in seconds
    timePerQuestion: 72, // 60*60/50 = 72 seconds per question
    features: ['Real Exam Conditions', 'No Chapter Hints', 'Timed Environment', 'Performance Analysis']
  },
  practice: {
    id: 'practice',
    name: 'Practice Test',
    description: 'Customizable test with chapter information',
    questionCount: 25, // Default
    timePerQuestion: 72, // 72 seconds per question
    features: ['Custom Questions', 'Chapter Information', 'Topic Selection', 'Flexible Timing']
  }
};

// Enhanced question fetching for tests with mock/practice considerations
export const fetchTestQuestions = async (testType, selectedPaper, questionCount, selectedTopic = 'all') => {
  try {
    // For mock tests, we want diverse questions without any hints
    // For practice tests, we can include chapter information
    
    const fetchMultiplier = testType === 'mock' ? 4 : 3; // More variety for mock tests
    const minFetch = Math.max(100, questionCount); // Ensure good pool for mock tests
    const maxFetch = testType === 'mock' ? 500 : 300;
    const fetchLimit = Math.min(maxFetch, Math.max(minFetch, questionCount * fetchMultiplier));

    const params = new URLSearchParams({
      paper: selectedPaper,
      limit: fetchLimit.toString(),
      testMode: testType // Add test mode to API call
    });

    if (selectedTopic !== 'all') {
      params.append('topic', selectedTopic);
    }

    console.log(`Fetching ${fetchLimit} questions for ${testType} test to randomly select ${questionCount}`);
    console.log('Test API params:', params.toString());

    const response = await fetch(`/api/test?${params}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error('Invalid response format: questions array not found');
    }

    console.log(`Successfully fetched ${result.questions.length} questions for ${testType} test`);

    // Normalize the data and remove identifying information for mock tests
    const normalizedData = result.questions.map(q => ({
      ...q,
      option_a: normalizeOptionText(q.option_a),
      option_b: normalizeOptionText(q.option_b),
      option_c: normalizeOptionText(q.option_c),
      option_d: normalizeOptionText(q.option_d),
      // For mock tests, remove year information to simulate real exam conditions
      year: testType === 'mock' ? undefined : q.year
    }));
    
    // Advanced randomization for test questions
    const randomizedQuestions = getRandomizedTestQuestionSet(normalizedData, questionCount, testType);
    
    console.log(`Selected ${randomizedQuestions.length} randomized questions for ${testType} test`);
    
    return randomizedQuestions;
  } catch (err) {
    console.error('Fetch test questions error:', err);
    throw new Error(`Failed to fetch test questions: ${err.message}`);
  }
};

// Enhanced randomization specifically for tests
export const getRandomizedTestQuestionSet = (questions, targetCount, testType) => {
  if (!questions || questions.length === 0) {
    return [];
  }

  if (questions.length <= targetCount) {
    return [...questions].sort(() => Math.random() - 0.5);
  }

  // For mock tests, ensure maximum diversity across topics and difficulty
  if (testType === 'mock') {
    return getBalancedMockTestQuestions(questions, targetCount);
  }

  // For practice tests, use similar logic to quiz but with test considerations
  return getBalancedPracticeTestQuestions(questions, targetCount);
};

// Balanced question selection for mock tests (maximum diversity)
const getBalancedMockTestQuestions = (questions, targetCount) => {
  const questionsByTopic = {};
  
  questions.forEach(q => {
    const normalizedTopic = normalizeChapterName(q.tag) || 'General';
    if (!questionsByTopic[normalizedTopic]) {
      questionsByTopic[normalizedTopic] = [];
    }
    questionsByTopic[normalizedTopic].push(q);
  });

  const topics = Object.keys(questionsByTopic);
  const questionsPerTopic = Math.floor(targetCount / topics.length);
  const remainingQuestions = targetCount % topics.length;
  
  console.log(`Mock test: Distributing ${targetCount} questions across ${topics.length} topics`);
  console.log(`Base per topic: ${questionsPerTopic}, Extra: ${remainingQuestions}`);

  const selectedQuestions = [];
  const usedQuestionIds = new Set();

  // First pass: Get base number of questions from each topic
  topics.forEach(topic => {
    const topicQuestions = questionsByTopic[topic];
    const shuffledQuestions = [...topicQuestions].sort(() => Math.random() - 0.5);
    
    let selected = 0;
    for (const question of shuffledQuestions) {
      if (selected >= questionsPerTopic) break;
      
      const questionId = question.main_id || question.id;
      if (!usedQuestionIds.has(questionId)) {
        selectedQuestions.push(question);
        usedQuestionIds.add(questionId);
        selected++;
      }
    }
  });

  // Second pass: Fill remaining slots randomly
  const remainingPool = questions.filter(q => {
    const questionId = q.main_id || q.id;
    return !usedQuestionIds.has(questionId);
  });

  while (selectedQuestions.length < targetCount && remainingPool.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingPool.length);
    selectedQuestions.push(remainingPool[randomIndex]);
    remainingPool.splice(randomIndex, 1);
  }

  // Final shuffle to ensure random order
  return selectedQuestions.sort(() => Math.random() - 0.5);
};

// Balanced question selection for practice tests
const getBalancedPracticeTestQuestions = (questions, targetCount) => {
  // Similar to quiz logic but with test-specific considerations
  const questionsByTopic = {};
  
  questions.forEach(q => {
    const normalizedTopic = normalizeChapterName(q.tag) || 'General';
    if (!questionsByTopic[normalizedTopic]) {
      questionsByTopic[normalizedTopic] = [];
    }
    questionsByTopic[normalizedTopic].push(q);
  });

  const topics = Object.keys(questionsByTopic);
  
  if (topics.length === 1) {
    // Single topic - just randomize
    return [...questions].sort(() => Math.random() - 0.5).slice(0, targetCount);
  }

  // Multi-topic - try to get representation from each
  const selectedQuestions = [];
  const usedQuestionIds = new Set();
  
  // Try to get at least one question from each topic if possible
  const minPerTopic = Math.max(1, Math.floor(targetCount / topics.length));
  
  topics.forEach(topic => {
    const topicQuestions = questionsByTopic[topic];
    const shuffledQuestions = [...topicQuestions].sort(() => Math.random() - 0.5);
    
    let selected = 0;
    for (const question of shuffledQuestions) {
      if (selected >= minPerTopic || selectedQuestions.length >= targetCount) break;
      
      const questionId = question.main_id || question.id;
      if (!usedQuestionIds.has(questionId)) {
        selectedQuestions.push(question);
        usedQuestionIds.add(questionId);
        selected++;
      }
    }
  });

  // Fill remaining slots randomly
  const remainingPool = questions.filter(q => {
    const questionId = q.main_id || q.id;
    return !usedQuestionIds.has(questionId);
  });

  while (selectedQuestions.length < targetCount && remainingPool.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingPool.length);
    selectedQuestions.push(remainingPool[randomIndex]);
    remainingPool.splice(randomIndex, 1);
  }

  return selectedQuestions.sort(() => Math.random() - 0.5);
};

// Fetch topics (same as quiz-utils but exported for clarity)
export const fetchTopics = async (selectedPaper) => {
  try {
    console.log('Fetching topics for test paper:', selectedPaper);
    
    const response = await fetch(`/api/test?paper=${selectedPaper}&getTopics=true`);
    if (response.ok) {
      const result = await response.json();
      const questions = result.questions || [];
      
      console.log(`Fetched ${questions.length} questions for topic analysis for test ${selectedPaper}`);
      
      const uniqueTopics = [...new Set(questions.map(q => normalizeChapterName(q.tag)))]
        .filter(Boolean)
        .sort();
      
      console.log(`Found ${uniqueTopics.length} unique topics for test ${selectedPaper}`);
      console.log('Test topics:', uniqueTopics);
      
      return uniqueTopics;
    } else {
      console.error('Failed to fetch test topics:', response.status);
    }
  } catch (error) {
    console.error('Error fetching test topics:', error);
  }
  return [];
};

// Generate comprehensive test summary
export const generateTestSummary = (submittedAnswers, questions, startTime) => {
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  const totalQuestions = questions.length;
  const answeredQuestions = submittedAnswers.size;
  const unanswered = totalQuestions - answeredQuestions;
  
  let correctAnswers = 0;
  const answerDetails = [];

  // Process each submitted answer
  submittedAnswers.forEach((answerData, questionId) => {
    const question = questions.find(q => (q.main_id || q.id) === questionId);
    if (question) {
      const isCorrect = isCorrectAnswer(answerData.selectedOption, question.correct_answer);
      if (isCorrect) correctAnswers++;
      
      answerDetails.push({
        questionId,
        question: question.question_text,
        selectedOption: answerData.selectedOption,
        correctOption: question.correct_answer,
        isCorrect,
        chapter: normalizeChapterName(question.tag),
        timestamp: answerData.timestamp
      });
    }
  });

  const incorrectAnswers = answeredQuestions - correctAnswers;
  const percentage = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;
  const overallScore = Math.round((correctAnswers / totalQuestions) * 100); // Score including unanswered

  // Enhanced chapter performance analysis
  const chapterPerformance = answerDetails.reduce((acc, answer) => {
    const chapter = answer.chapter || 'General';
    
    if (!acc[chapter]) {
      acc[chapter] = { 
        total: 0, 
        correct: 0, 
        questions: []
      };
    }
    acc[chapter].total += 1;
    acc[chapter].questions.push(answer);
    if (answer.isCorrect) acc[chapter].correct += 1;
    return acc;
  }, {});

  // Performance metrics
  const averageTimePerQuestion = answeredQuestions > 0 ? timeTaken / answeredQuestions : 0;
  
  // Find strongest and weakest chapters
  const chapterStats = Object.entries(chapterPerformance).map(([chapter, stats]) => ({
    chapter,
    accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
    ...stats
  }));
  
  const strongestChapter = chapterStats.length > 0 ? 
    chapterStats.reduce((a, b) => a.accuracy > b.accuracy ? a : b) : null;
  const weakestChapter = chapterStats.length > 0 ? 
    chapterStats.reduce((a, b) => a.accuracy < b.accuracy ? a : b) : null;

  // Difficulty analysis (if we had difficulty data)
  const difficultyAnalysis = {
    easy: { attempted: 0, correct: 0 },
    medium: { attempted: 0, correct: 0 },
    hard: { attempted: 0, correct: 0 }
  };

  // Time analysis
  const timeAnalysis = {
    totalTime: timeTaken,
    averagePerQuestion: Math.round(averageTimePerQuestion),
    timeEfficiency: timeTaken > 0 ? Math.round((correctAnswers / (timeTaken / 60)) * 100) / 100 : 0 // Correct answers per minute
  };

  return {
    // Basic stats
    timeTaken,
    totalQuestions,
    answeredQuestions,
    unanswered,
    correctAnswers,
    incorrectAnswers,
    percentage, // Percentage of answered questions that were correct
    overallScore, // Score including unanswered questions
    
    // Detailed analysis
    chapterPerformance,
    answerDetails,
    
    // Performance insights
    averageTimePerQuestion: Math.round(averageTimePerQuestion),
    strongestChapter: strongestChapter ? {
      name: strongestChapter.chapter,
      accuracy: Math.round(strongestChapter.accuracy)
    } : null,
    weakestChapter: weakestChapter ? {
      name: weakestChapter.chapter,
      accuracy: Math.round(weakestChapter.accuracy)
    } : null,
    
    // Advanced analytics
    difficultyAnalysis,
    timeAnalysis,
    
    // Recommendations
    recommendations: generateTestRecommendations(percentage, overallScore, chapterStats, timeAnalysis)
  };
};

// Generate personalized recommendations based on test performance
const generateTestRecommendations = (percentage, overallScore, chapterStats, timeAnalysis) => {
  const recommendations = [];

  // Score-based recommendations
  if (overallScore >= 80) {
    recommendations.push('Excellent performance! You\'re well-prepared for the exam.');
    recommendations.push('Focus on maintaining consistency across all topics.');
  } else if (overallScore >= 65) {
    recommendations.push('Good performance. Review weak areas to reach excellence.');
    recommendations.push('Practice more mock tests to improve timing.');
  } else if (overallScore >= 50) {
    recommendations.push('Moderate performance. Significant improvement needed.');
    recommendations.push('Focus on understanding fundamental concepts.');
  } else {
    recommendations.push('Low performance. Consider additional study time.');
    recommendations.push('Review all topics systematically before attempting more tests.');
  }

  // Chapter-specific recommendations
  if (chapterStats.length > 1) {
    const weakChapters = chapterStats.filter(ch => ch.accuracy < 60);
    if (weakChapters.length > 0) {
      recommendations.push(`Focus on improving: ${weakChapters.map(ch => ch.chapter).join(', ')}`);
    }
  }

  // Time-based recommendations
  if (timeAnalysis.averagePerQuestion > 90) {
    recommendations.push('Work on improving your speed. Practice time management.');
  } else if (timeAnalysis.averagePerQuestion < 30) {
    recommendations.push('You\'re working quickly. Ensure you\'re reading questions carefully.');
  }

  return recommendations.slice(0, 4); // Limit to top 4 recommendations
};

// Test performance analysis utilities
export const analyzeTestPerformance = (testSummary) => {
  const { percentage, overallScore, chapterPerformance, timeAnalysis } = testSummary;
  
  // Overall performance level
  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'emerald' };
    if (score >= 65) return { level: 'Good', color: 'blue' };
    if (score >= 50) return { level: 'Average', color: 'yellow' };
    if (score >= 35) return { level: 'Below Average', color: 'orange' };
    return { level: 'Poor', color: 'red' };
  };

  const performance = getPerformanceLevel(overallScore);
  
  // Consistency analysis
  const chapterAccuracies = Object.values(chapterPerformance).map(ch => 
    ch.total > 0 ? (ch.correct / ch.total) * 100 : 0
  );
  
  const avgAccuracy = chapterAccuracies.length > 0 ? 
    chapterAccuracies.reduce((a, b) => a + b) / chapterAccuracies.length : 0;
  
  const variance = chapterAccuracies.length > 0 ? 
    chapterAccuracies.reduce((acc, acc_curr) => acc + Math.pow(acc_curr - avgAccuracy, 2), 0) / chapterAccuracies.length : 0;
  
  const consistency = Math.max(0, 100 - Math.sqrt(variance));

  return {
    ...performance,
    consistency: Math.round(consistency),
    timeEfficiency: timeAnalysis.timeEfficiency,
    readinessLevel: getReadinessLevel(overallScore, consistency)
  };
};

// Determine exam readiness level
const getReadinessLevel = (score, consistency) => {
  if (score >= 75 && consistency >= 70) return 'Exam Ready';
  if (score >= 60 && consistency >= 60) return 'Nearly Ready';
  if (score >= 45) return 'Needs Improvement';
  return 'Requires Significant Study';
};

// Test-specific keyboard shortcuts
export const TEST_KEYBOARD_SHORTCUTS = {
  ...KEYBOARD_SHORTCUTS,
  FLAG_QUESTION: 'f',
  SHOW_PALETTE: 'p',
  SUBMIT_TEST: 'Enter'
};

// Test state management utilities
export const getTestProgress = (submittedAnswers, totalQuestions, currentIndex) => {
  const answered = submittedAnswers.size;
  const remaining = totalQuestions - answered;
  const percentage = Math.round((answered / totalQuestions) * 100);
  
  return {
    answered,
    remaining,
    percentage,
    current: currentIndex + 1,
    total: totalQuestions
  };
};

// Test timing utilities
export const calculateTimeRemaining = (startTime, timeAllowed) => {
  const now = new Date();
  const elapsed = Math.floor((now - startTime) / 1000);
  return Math.max(0, timeAllowed - elapsed);
};

export const getTimeStatus = (timeRemaining, totalTime) => {
  const percentage = (timeRemaining / totalTime) * 100;
  if (percentage > 50) return 'safe';
  if (percentage > 25) return 'warning';
  if (percentage > 10) return 'critical';
  return 'danger';
};

// Test validation utilities
export const validateTestSubmission = (submittedAnswers, questions, testType) => {
  const warnings = [];
  const unanswered = questions.length - submittedAnswers.size;
  
  if (unanswered > 0) {
    warnings.push(`${unanswered} question${unanswered !== 1 ? 's' : ''} left unanswered`);
  }
  
  if (testType === 'mock' && unanswered > questions.length * 0.1) {
    warnings.push('High number of unanswered questions may significantly impact your score');
  }
  
  return {
    canSubmit: true, // Tests can always be submitted
    warnings
  };
};

// Export default object with all utilities
export default {
  TEST_TYPES,
  fetchTestQuestions,
  getRandomizedTestQuestionSet,
  fetchTopics,
  generateTestSummary,
  analyzeTestPerformance,
  getTestProgress,
  calculateTimeRemaining,
  getTimeStatus,
  validateTestSubmission,
  TEST_KEYBOARD_SHORTCUTS,
  normalizeChapterName,
  normalizeOptionText,
  isCorrectAnswer,
  formatTime,
  cn
};
