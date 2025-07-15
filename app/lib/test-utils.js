// Test-specific utility functions and constants

import { normalizeChapterName, normalizeOptionText, isCorrectAnswer, formatTime } from './quiz-utils';

// Re-exporting for convenience in test components
export { normalizeChapterName, isCorrectAnswer, formatTime };

// Test Configuration
export const TEST_MODES = {
  MOCK_EXAM: {
    id: 'mock',
    name: "Mock Exam",
    description: "Full exam simulation with timer and no review during test",
    timer: true,
    defaultTime: 90,
    reviewDuringTest: false,
    shuffleQuestions: true,
    shuffleOptions: false,
    icon: "🎯",
    recommended: true,
    color: '#6366f1'
  },
  PRACTICE: {
    id: 'practice',
    name: "Practice Test",
    description: "Relaxed practice with no timer and review allowed",
    timer: false,
    defaultTime: 0,
    reviewDuringTest: true,
    shuffleQuestions: false,
    shuffleOptions: false,
    icon: "📚",
    recommended: false,
    color: '#10b981'
  },
  TIMED_PRACTICE: {
    id: 'timed_practice',
    name: "Timed Practice",
    description: "Practice with timer but review allowed during test",
    timer: true,
    defaultTime: 60,
    reviewDuringTest: true,
    shuffleQuestions: true,
    shuffleOptions: false,
    icon: "⏱️",
    recommended: false,
    color: '#f59e0b'
  }
};

export const TEST_TYPES = {
  PAPER1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit',
    questionCount: 50,
    fixed: true,
    paper: 'paper1',
    color: '#6366f1'
  },
  PAPER2: {
    id: 'paper2', 
    name: 'Paper 2',
    description: 'Energy Efficiency in Thermal Utilities',
    questionCount: 50,
    fixed: true,
    paper: 'paper2',
    color: '#f59e0b'
  },
  PAPER3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities',
    questionCount: 50,
    fixed: true,
    paper: 'paper3',
    color: '#10b981'
  },
  TOPIC_WISE: {
    id: 'topic',
    name: 'Topic-wise Test',
    description: 'Focus on specific topics',
    questionCount: 25,
    fixed: false,
    configurable: true,
    color: '#8b5cf6'
  },
  CUSTOM: {
    id: 'custom',
    name: 'Custom Test',
    description: 'Mix topics and set your own parameters',
    questionCount: 30,
    fixed: false,
    configurable: true,
    color: '#ec4899'
  }
};

export const getTestMode = (modeId) => {
  return TEST_MODES[modeId?.toUpperCase()] || TEST_MODES.MOCK_EXAM;
};

export const getTestType = (typeId) => {
  return TEST_TYPES[typeId?.toUpperCase()] || TEST_TYPES.PAPER1;
};

export const fetchTestQuestions = async (testConfig) => {
  try {
    const testType = getTestType(testConfig.type);
    let allQuestions = [];
    
    if (testConfig.type === 'topic' || testConfig.type === 'custom') {
      const papers = ['paper1', 'paper2', 'paper3'];
      
      for (const paper of papers) {
        const params = new URLSearchParams({
          paper: paper,
          limit: '1000'
        });

        const response = await fetch(`/api/quiz?${params}`);
        if (response.ok) {
          const result = await response.json();
          if (result.questions) {
            allQuestions.push(...result.questions);
          }
        }
      }
      
      if (testConfig.selectedTopics?.length > 0) {
        allQuestions = allQuestions.filter(q => 
          testConfig.selectedTopics.some(topic => 
            normalizeChapterName(q.tag) === topic
          )
        );
      }
      
      if (testConfig.type === 'custom' && testConfig.selectedYears?.length > 0) {
        allQuestions = allQuestions.filter(q => 
          testConfig.selectedYears.includes(Number(q.year))
        );
      }
      
    } else {
      const params = new URLSearchParams({
        paper: testType.paper || testConfig.type,
        limit: (testConfig.questionCount * 2).toString()
      });

      const response = await fetch(`/api/quiz?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      allQuestions = result.questions || [];
    }
    
    const normalizedData = allQuestions.map(q => ({
      ...q,
      option_a: normalizeOptionText(q.option_a),
      option_b: normalizeOptionText(q.option_b),
      option_c: normalizeOptionText(q.option_c),
      option_d: normalizeOptionText(q.option_d)
    }));
    
    let shuffledQuestions = [...normalizedData];
    const testMode = getTestMode(testConfig.mode);
    if (testMode.shuffleQuestions) {
      shuffledQuestions = shuffledQuestions.sort(() => Math.random() - 0.5);
    }
    
    const finalQuestions = shuffledQuestions.slice(0, testConfig.questionCount);
    
    return finalQuestions;
  } catch (err) {
    console.error('Fetch test questions error:', err);
    return [];
  }
};

export const calculateTestResults = (testData) => {
  const totalQuestions = testData.questions.length;
  const answered = Object.keys(testData.answers).length;
  const unanswered = totalQuestions - answered;
  
  let correct = 0;
  Object.entries(testData.answers).forEach(([index, answer]) => {
    if (isCorrectAnswer(answer, testData.questions[index].correct_answer)) {
      correct++;
    }
  });
  
  const incorrect = answered - correct;
  const score = Math.round((correct / totalQuestions) * 100);
  const timeTaken = testData.endTime - testData.startTime;
  
  return {
    totalQuestions,
    answered,
    unanswered,
    correct,
    incorrect,
    score,
    timeTaken: Math.floor(timeTaken / 1000),
    percentage: Math.round((correct / answered) * 100) || 0
  };
};

export const getQuestionStatusColor = (index, currentIndex, answers, flagged, visited) => {
  if (index === currentIndex) return 'bg-indigo-500 border-indigo-400 text-white';
  if (answers[index]) return 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200';
  if (flagged.has(index)) return 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200';
  if (visited.has(index)) return 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200';
  return 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
};

export const getReviewOptionClass = (option, userAnswer, correctAnswer) => {
  const isUserAnswer = userAnswer === option;
  const isOptionCorrect = isCorrectAnswer(option, correctAnswer);

  if (isOptionCorrect) {
    return "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200";
  }
  if (isUserAnswer && !isOptionCorrect) {
    return "bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-600 text-red-800 dark:text-red-200";
  }
  return "bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300";
};
