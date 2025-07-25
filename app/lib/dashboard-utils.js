// FILE: app/lib/dashboard-utils.js

import { calculateAllPredictedScores } from './weightage-utils';

// Remove CHAPTER_WEIGHTAGES - now sourced from database via weightage-utils.js

/**
 * Format time spent in a human-readable format
 */
export function formatTimeSpent(seconds) {
  if (!seconds || seconds === 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Calculate predicted exam scores using database weightages
 * Now returns paper-independent scores
 */
export async function calculatePredictedScore(chapterStatsByPaper) {
  return await calculateAllPredictedScores(chapterStatsByPaper);
}

/**
 * Calculate learning velocity (rate of improvement)
 */
export function calculateLearningVelocity(activityData) {
  if (!activityData || activityData.length < 14) {
    return { velocity: 0, trend: 'insufficient_data' };
  }

  // Get last 14 days of data
  const recentData = activityData.slice(-14);
  const firstWeek = recentData.slice(0, 7);
  const secondWeek = recentData.slice(7, 14);

  // Calculate average accuracy for each week
  const firstWeekAvg = firstWeek.reduce((sum, d) => sum + (d.accuracy || 0), 0) / firstWeek.length;
  const secondWeekAvg = secondWeek.reduce((sum, d) => sum + (d.accuracy || 0), 0) / secondWeek.length;

  // Calculate velocity (percentage change per week)
  const velocity = firstWeekAvg > 0 ? ((secondWeekAvg - firstWeekAvg) / firstWeekAvg) * 100 : 0;

  let trend = 'stable';
  if (velocity > 5) trend = 'improving';
  else if (velocity < -5) trend = 'declining';

  return {
    velocity: Math.round(velocity * 10) / 10, // Round to 1 decimal
    trend,
    firstWeekAvg: Math.round(firstWeekAvg),
    secondWeekAvg: Math.round(secondWeekAvg)
  };
}

/**
 * Calculate various performance trends
 */
export function calculateTrends(activityData) {
  if (!activityData || activityData.length < 7) {
    return {
      direction: 'stable',
      change: 0,
      recentAverage: 0
    };
  }

  const recentData = activityData.slice(-7);
  const previousData = activityData.length >= 14 ? activityData.slice(-14, -7) : [];

  const recentAverage = recentData.reduce((sum, d) => sum + (d.accuracy || 0), 0) / recentData.length;
  const previousAverage = previousData.length > 0 
    ? previousData.reduce((sum, d) => sum + (d.accuracy || 0), 0) / previousData.length 
    : recentAverage;

  const change = recentAverage - previousAverage;
  let direction = 'stable';

  if (change > 2) direction = 'up';
  else if (change < -2) direction = 'down';

  return {
    direction,
    change: Math.round(change * 10) / 10,
    recentAverage: Math.round(recentAverage * 10) / 10
  };
}

/**
 * Calculate mastery levels for chapters
 */
export function calculateMasteryLevels(chapterStats) {
  if (!chapterStats) return {};

  const masteryLevels = {};

  Object.entries(chapterStats).forEach(([chapter, stats]) => {
    const accuracy = stats.accuracy || 0;
    const totalQuestions = stats.totalQuestions || 0;

    let level = 'beginner';
    let percentage = 0;

    if (totalQuestions >= 5) {
      if (accuracy >= 90) {
        level = 'expert';
        percentage = 100;
      } else if (accuracy >= 80) {
        level = 'proficient';
        percentage = 80;
      } else if (accuracy >= 70) {
        level = 'competent';
        percentage = 60;
      } else if (accuracy >= 60) {
        level = 'developing';
        percentage = 40;
      } else {
        level = 'beginner';
        percentage = 20;
      }
    }

    masteryLevels[chapter] = {
      level,
      percentage,
      accuracy,
      totalQuestions
    };
  });

  return masteryLevels;
}

/**
 * Generate personalized study recommendations
 */
export function getStudyRecommendations(analytics) {
  const recommendations = [];
  
  if (!analytics) return recommendations;

  const { studyStreak, totalStats, chapterStats, activityData } = analytics;

  // Streak-based recommendations
  if (studyStreak && studyStreak.current === 0 && studyStreak.longest > 0) {
    recommendations.push({
      type: 'streak',
      priority: 'high',
      message: 'Rebuild Your Study Streak',
      action: 'You had a great streak going! Start today to rebuild your momentum.'
    });
  } else if (studyStreak && studyStreak.current >= 1 && studyStreak.current < 7) {
    recommendations.push({
      type: 'streak',
      priority: 'medium',
      message: 'Keep Your Streak Alive',
      action: `You're on day ${studyStreak.current}. Don't break the chain!`
    });
  }

  // Volume-based recommendations
  if (activityData && activityData.length > 7) {
    const recentActivity = activityData.slice(-7);
    const avgQuestions = recentActivity.reduce((sum, d) => sum + (d.questionsAnswered || 0), 0) / 7;
    
    if (avgQuestions < 10) {
      recommendations.push({
        type: 'volume',
        priority: 'high',
        message: 'Increase Practice Volume',
        action: 'Try to practice at least 15-20 questions daily for better retention.'
      });
    } else if (avgQuestions > 30) {
      recommendations.push({
        type: 'balance',
        priority: 'low',
        message: 'Consider Quality Over Quantity',
        action: 'Great volume! Now focus on reviewing mistakes and understanding concepts.'
      });
    }
  }

  // Accuracy-based recommendations
  const overallAccuracy = analytics.analytics?.overall_accuracy || 0;
  if (overallAccuracy < 60) {
    recommendations.push({
      type: 'accuracy',
      priority: 'high',
      message: 'Focus on Understanding',
      action: 'Slow down and review explanations. Quality study beats speed.'
    });
  } else if (overallAccuracy > 85) {
    recommendations.push({
      type: 'challenge',
      priority: 'low',
      message: 'Ready for Advanced Practice',
      action: 'Try timed tests and mixed topic quizzes to challenge yourself.'
    });
  }

  // Chapter-specific recommendations
  if (chapterStats) {
    const weakChapters = Object.entries(chapterStats)
      .filter(([_, stats]) => stats.accuracy < 60 && stats.totalQuestions >= 5)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .slice(0, 2);

    weakChapters.forEach(([chapter, stats]) => {
      recommendations.push({
        type: 'chapter',
        priority: 'high',
        message: `Strengthen ${chapter}`,
        action: `Current accuracy: ${Math.round(stats.accuracy)}%. Focus next session here.`
      });
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

/**
 * Calculate overall progress metrics
 */
export function calculateProgressMetrics(analytics) {
  if (!analytics) return null;

  const { totalStats, studyStreak, activityData } = analytics;
  
  // Calculate consistency (percentage of days studied in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentActivity = activityData?.filter(d => new Date(d.date) >= thirtyDaysAgo) || [];
  const activeDays = recentActivity.filter(d => d.questionsAnswered > 0).length;
  const consistency = (activeDays / 30) * 100;

  // Calculate improvement rate
  const velocity = calculateLearningVelocity(activityData);

  return {
    totalQuestions: totalStats?.questionsAttempted || 0,
    averageAccuracy: analytics.analytics?.overall_accuracy || 0,
    currentStreak: studyStreak?.current || 0,
    longestStreak: studyStreak?.longest || 0,
    consistency: Math.round(consistency),
    improvementRate: velocity.velocity,
    studyTime: totalStats?.totalTimeSpent || 0
  };
}
