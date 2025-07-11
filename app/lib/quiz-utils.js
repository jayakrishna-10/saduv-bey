// app/lib/quiz-utils.js - Fixed with better error handling for topics and years
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
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const PAPERS = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1',
    description: 'General Aspects of Energy Management and Energy Audit'
  },
  paper2: {
    id: 'paper2',
    name: 'Paper 2', 
    description: 'Energy Efficiency in Thermal Utilities'
  },
  paper3: {
    id: 'paper3',
    name: 'Paper 3',
    description: 'Energy Efficiency in Electrical Utilities'
  }
};

export const fetchQuizQuestions = async (selectedPaper, questionCount, selectedTopic = 'all', selectedYear = 'all') => {
  try {
    const params = new URLSearchParams({
      paper: selectedPaper,
      limit: questionCount.toString()
    });

    if (selectedTopic !== 'all') {
      params.append('topic', selectedTopic);
    }
    if (selectedYear !== 'all') {
      params.append('year', selectedYear);
    }

    const response = await fetch(`/api/quiz?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    const normalizedData = result.questions?.map(q => ({
      ...q,
      option_a: normalizeOptionText(q.option_a),
      option_b: normalizeOptionText(q.option_b),
      option_c: normalizeOptionText(q.option_c),
      option_d: normalizeOptionText(q.option_d)
    })) || [];
    
    const shuffledQuestions = [...normalizedData].sort(() => Math.random() - 0.5);
    
    return shuffledQuestions;
  } catch (err) {
    console.error('Fetch questions error:', err);
    return [];
  }
};

export const fetchTopicsAndYears = async (selectedPaper) => {
  try {
    if (!selectedPaper) {
      return { topics: [], years: [] };
    }

    const response = await fetch(`/api/quiz?paper=${selectedPaper}&limit=1000`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch topics and years: ${response.status}`);
      return { topics: [], years: [] };
    }
    
    const result = await response.json();
    
    // Safely extract questions array
    const sampleQuestions = Array.isArray(result.questions) ? result.questions : [];
    
    if (sampleQuestions.length === 0) {
      console.warn('No questions found for topics/years extraction');
      return { topics: [], years: [] };
    }
    
    // Extract unique topics with safe handling
    const uniqueTopics = [...new Set(
      sampleQuestions
        .map(q => q && q.tag ? normalizeChapterName(q.tag) : null)
        .filter(Boolean)
    )].sort();
    
    // Extract unique years with safe handling
    const uniqueYears = [...new Set(
      sampleQuestions
        .map(q => {
          const year = q && q.year ? Number(q.year) : null;
          return (!isNaN(year) && year > 1900 && year < 2100) ? year : null;
        })
        .filter(year => year !== null)
    )].sort((a, b) => a - b);
    
    return { 
      topics: uniqueTopics, 
      years: uniqueYears 
    };
  } catch (error) {
    console.error('Error fetching topics and years:', error);
    return { topics: [], years: [] };
  }
};

export const generateQuizSummary = (answeredQuestions, startTime) => {
  if (!Array.isArray(answeredQuestions) || answeredQuestions.length === 0) {
    return {
      timeTaken: 0,
      totalAnswered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      score: 0,
      chapterPerformance: {}
    };
  }

  const endTime = new Date();
  const timeTaken = startTime ? Math.floor((endTime - startTime) / 1000) : 0;

  const totalAnswered = answeredQuestions.length;
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const incorrectAnswers = totalAnswered - correctAnswers;
  const score = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  const chapterPerformance = answeredQuestions.reduce((acc, q) => {
    const normalizedChapter = normalizeChapterName(q.chapter) || 'Unknown';
    
    if (!acc[normalizedChapter]) {
      acc[normalizedChapter] = { total: 0, correct: 0 };
    }
    acc[normalizedChapter].total += 1;
    if (q.isCorrect) acc[normalizedChapter].correct += 1;
    return acc;
  }, {});

  return {
    timeTaken,
    totalAnswered,
    correctAnswers,
    incorrectAnswers,
    score,
    chapterPerformance
  };
};
