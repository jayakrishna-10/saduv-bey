// FILE: app/lib/dashboard-utils.js

import { format, subDays, startOfDay, endOfDay } from 'date-fns';

// Chapter weightages for NCE exam (as per database)
export const CHAPTER_WEIGHTAGES = {
  paper1: {
    'Energy Scenario': 8,
    'Basics of Energy and its Various Forms': 8,
    'Energy Management and Audit': 12,
    'Material and Energy Balance': 10,
    'Energy Action Planning': 8,
    'Financial Management': 12,
    'Project Management': 10,
    'Energy Monitoring and Targeting': 8,
    'Global Environmental Concerns': 8,
    'Energy Policy': 8,
    'Energy Security': 8
  },
  paper2: {
    'Fuels and Combustion': 10,
    'Boilers': 15,
    'Steam System': 12,
    'Furnaces': 10,
    'Insulation and Refractories': 8,
    'FBC Boilers': 8,
    'Cogeneration': 10,
    'Waste Heat Recovery': 10,
    'Energy Conservation in HVAC': 8,
    'Energy Conservation in Cooling Towers': 9
  },
  paper3: {
    'Electrical System': 10,
    'Electric Motors': 12,
    'Variable Speed Drives': 8,
    'Compressed Air System': 10,
    'HVAC and Refrigeration System': 10,
    'Fans and Blowers': 8,
    'Pumps and Pumping System': 10,
    'Cooling Towers': 8,
    'Lighting System': 10,
    'DG Set': 8,
    'Energy Efficient Transformers': 6
  }
};

/**
 * Calculate predicted exam score based on chapter performance
 * @param {Object} chapterStats - Chapter-wise statistics
 * @returns {Object} Predicted scores by paper and overall
 */
export function calculatePredictedScore(chapterStats) {
  if (!chapterStats || Object.keys(chapterStats).length === 0) {
    return null;
  }

  const paperScores = {
    paper1: { score: 0, totalWeight: 0, chapterBreakdown: [] },
    paper2: { score: 0, totalWeight: 0, chapterBreakdown: [] },
    paper3: { score: 0, totalWeight: 0, chapterBreakdown: [] }
  };

  // Calculate score for each paper
  Object.entries(CHAPTER_WEIGHTAGES).forEach(([paper, chapters]) => {
    Object.entries(chapters).forEach(([chapter, weightage]) => {
      const stats = chapterStats[chapter];
      if (stats && stats.totalQuestions > 0) {
        const contribution = (stats.accuracy * weightage) / 100;
        paperScores[paper].score += contribution;
        paperScores[paper].totalWeight += weightage;
        paperScores[paper].chapterBreakdown.push({
          name: chapter,
          accuracy: stats.accuracy,
          weightage: weightage,
          contribution: contribution,
          questions: stats.totalQuestions
        });
      }
    });

    // Normalize score to 100
    if (paperScores[paper].totalWeight > 0) {
      paperScores[paper].score = (paperScores[paper].score / paperScores[paper].totalWeight) * 100;
    }
  });

  // Calculate overall score
  let totalScore = 0;
  let totalPapers = 0;
  Object.values(paperScores).forEach(paper => {
    if (paper.score > 0) {
      totalScore += paper.score;
      totalPapers++;
    }
  });

  const overallScore = totalPapers > 0 ? totalScore / totalPapers : 0;

  return {
    overall: overallScore,
    papers: paperScores
  };
}

/**
 * Calculate learning velocity (improvement rate)
 * @param {Array} performanceData - Array of performance records over time
 * @returns {Object} Learning velocity metrics
 */
export function calculateLearningVelocity(performanceData) {
  if (!performanceData || performanceData.length < 2) {
    return { velocity: 0, trend: 'stable', improvement: 0 };
  }

  // Sort by date
  const sorted = [...performanceData].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Calculate weekly averages
  const weeklyAverages = [];
  for (let i = 0; i < sorted.length; i += 7) {
    const weekData = sorted.slice(i, i + 7);
    const avgAccuracy = weekData.reduce((sum, d) => sum + d.accuracy, 0) / weekData.length;
    weeklyAverages.push(avgAccuracy);
  }

  if (weeklyAverages.length < 2) {
    return { velocity: 0, trend: 'stable', improvement: 0 };
  }

  // Calculate improvement
  const firstWeek = weeklyAverages[0];
  const lastWeek = weeklyAverages[weeklyAverages.length - 1];
  const improvement = lastWeek - firstWeek;
  const velocity = improvement / weeklyAverages.length;

  let trend = 'stable';
  if (velocity > 2) trend = 'improving';
  else if (velocity < -2) trend = 'declining';

  return {
    velocity: Math.round(velocity * 10) / 10,
    trend,
    improvement: Math.round(improvement * 10) / 10,
    weeklyAverages
  };
}

/**
 * Calculate study streak
 * @param {Array} activityData - Array of daily activity records
 * @returns {Object} Streak information
 */
export function calculateStreak(activityData) {
  if (!activityData || activityData.length === 0) {
    return { current: 0, longest: 0, total: 0 };
  }

  // Sort by date descending
  const sorted = [...activityData].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = null;

  for (const activity of sorted) {
    const activityDate = new Date(activity.date);
    
    if (!lastDate) {
      // First record
      tempStreak = 1;
      currentStreak = 1;
    } else {
      const dayDiff = Math.floor((lastDate - activityDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day
        tempStreak++;
        if (currentStreak > 0) currentStreak++;
      } else {
        // Streak broken
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        if (currentStreak > 0 && dayDiff > 1) {
          currentStreak = 0;
        }
      }
    }
    
    lastDate = activityDate;
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    current: currentStreak,
    longest: longestStreak,
    total: sorted.length
  };
}

/**
 * Calculate chapter mastery levels
 * @param {Object} chapterStats - Chapter statistics
 * @returns {Object} Mastery level breakdown
 */
export function calculateMasteryLevels(chapterStats) {
  const levels = {
    expert: [],      // 90%+
    proficient: [],  // 80-89%
    competent: [],   // 70-79%
    developing: [],  // 60-69%
    beginner: []     // <60%
  };

  Object.entries(chapterStats).forEach(([chapter, stats]) => {
    if (stats.totalQuestions > 0) {
      const accuracy = stats.accuracy;
      const entry = { chapter, ...stats };

      if (accuracy >= 90) levels.expert.push(entry);
      else if (accuracy >= 80) levels.proficient.push(entry);
      else if (accuracy >= 70) levels.competent.push(entry);
      else if (accuracy >= 60) levels.developing.push(entry);
      else levels.beginner.push(entry);
    }
  });

  return levels;
}

/**
 * Get study recommendations based on performance
 * @param {Object} analytics - User learning analytics
 * @returns {Array} Array of recommendations
 */
export function getStudyRecommendations(analytics) {
  const recommendations = [];

  if (!analytics || !analytics.chapterStats) {
    return [{
      type: 'start',
      priority: 'high',
      message: 'Start with Paper 1 fundamentals to build a strong foundation',
      action: 'Begin with Energy Scenario and Basics of Energy chapters'
    }];
  }

  // Analyze weak chapters
  const weakChapters = Object.entries(analytics.chapterStats)
    .filter(([_, stats]) => stats.accuracy < 60 && stats.totalQuestions >= 5)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .slice(0, 3);

  if (weakChapters.length > 0) {
    recommendations.push({
      type: 'focus',
      priority: 'high',
      message: `Focus on improving ${weakChapters[0][0]} (currently at ${weakChapters[0][1].accuracy}%)`,
      action: 'Dedicate 30 minutes daily to practice questions from this chapter'
    });
  }

  // Check for inconsistent chapters
  const inconsistentChapters = Object.entries(analytics.chapterStats)
    .filter(([_, stats]) => stats.accuracy >= 60 && stats.accuracy <= 75)
    .slice(0, 2);

  if (inconsistentChapters.length > 0) {
    recommendations.push({
      type: 'consistency',
      priority: 'medium',
      message: `Stabilize performance in ${inconsistentChapters[0][0]}`,
      action: 'Review concepts and practice 10 questions daily'
    });
  }

  // Check study consistency
  if (analytics.studyStreak && analytics.studyStreak.current < 3) {
    recommendations.push({
      type: 'habit',
      priority: 'medium',
      message: 'Build a consistent study habit',
      action: 'Set a daily reminder to practice at least 10 questions'
    });
  }

  // High performers
  const strongChapters = Object.entries(analytics.chapterStats)
    .filter(([_, stats]) => stats.accuracy >= 85)
    .length;

  if (strongChapters >= 5) {
    recommendations.push({
      type: 'challenge',
      priority: 'low',
      message: 'Great progress! Time for advanced practice',
      action: 'Try timed mock tests to improve speed and accuracy'
    });
  }

  return recommendations;
}

/**
 * Format time for display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTimeSpent(seconds) {
  if (!seconds || seconds === 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Calculate performance trends
 * @param {Array} data - Historical performance data
 * @returns {Object} Trend analysis
 */
export function calculateTrends(data) {
  if (!data || data.length < 2) {
    return { direction: 'stable', change: 0 };
  }

  const recent = data.slice(-7); // Last 7 entries
  const previous = data.slice(-14, -7); // Previous 7 entries

  const recentAvg = recent.reduce((sum, d) => sum + d.accuracy, 0) / recent.length;
  const previousAvg = previous.reduce((sum, d) => sum + d.accuracy, 0) / previous.length;

  const change = recentAvg - previousAvg;
  let direction = 'stable';
  
  if (change > 5) direction = 'up';
  else if (change < -5) direction = 'down';

  return {
    direction,
    change: Math.round(change * 10) / 10,
    recentAverage: Math.round(recentAvg * 10) / 10,
    previousAverage: Math.round(previousAvg * 10) / 10
  };
}
