// app/api/spaced-repetition/stats/route.js
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { SpacedRepetitionAnalytics, CardUtils } from '@/lib/spaced-repetition-utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    const period = searchParams.get('period') || '30'; // days
    const includeHistory = searchParams.get('include_history') === 'true';
    const includeRecommendations = searchParams.get('include_recommendations') === 'true';

    console.log(`[SPACED-REPETITION] Fetching stats for user ${userId}, period: ${period} days`);

    // Fetch user's cards
    const { data: cards, error: cardsError } = await supabase
      .from('spaced_repetition_cards')
      .select('*')
      .eq('user_id', userId);

    if (cardsError) {
      console.error('Error fetching cards:', cardsError);
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }

    // Fetch recent sessions
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const { data: sessions, error: sessionsError } = await supabase
      .from('spaced_repetition_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', startDate.toISOString())
      .order('completed_at', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
    }

    // Fetch review history for the period
    const { data: reviewHistory, error: historyError } = await supabase
      .from('spaced_repetition_review_history')
      .select(`
        *,
        spaced_repetition_cards!inner(user_id)
      `)
      .eq('spaced_repetition_cards.user_id', userId)
      .gte('reviewed_at', startDate.toISOString())
      .order('reviewed_at', { ascending: false });

    if (historyError) {
      console.error('Error fetching review history:', historyError);
    }

    // Get user's study streak
    const { data: streakData } = await supabase
      .rpc('get_spaced_repetition_streak', { p_user_id: userId });

    const streak = streakData && streakData.length > 0 ? streakData[0] : 
      { current_streak: 0, longest_streak: 0, total_days: 0 };

    // Calculate comprehensive statistics
    const stats = await calculateComprehensiveStats(
      cards || [], 
      sessions || [], 
      reviewHistory || [], 
      streak
    );

    // Include additional data if requested
    let additionalData = {};

    if (includeHistory && reviewHistory) {
      additionalData.recentHistory = reviewHistory.slice(0, 50);
    }

    if (includeRecommendations) {
      additionalData.recommendations = SpacedRepetitionAnalytics.generateStudyRecommendations(
        stats, 
        cards || []
      );
    }

    console.log(`[SPACED-REPETITION] Returning stats for ${cards?.length || 0} cards, ${sessions?.length || 0} sessions`);

    return NextResponse.json({
      stats,
      period: periodDays,
      lastUpdated: new Date().toISOString(),
      ...additionalData
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Calculate comprehensive statistics
async function calculateComprehensiveStats(cards, sessions, reviewHistory, streak) {
  const today = new Date().toISOString().split('T')[0];
  
  // Card statistics by status
  const cardsByStatus = SpacedRepetitionAnalytics.groupCardsByStatus(cards);
  
  // Overall retention statistics
  const retention = SpacedRepetitionAnalytics.calculateRetentionRate(reviewHistory);
  
  // Session statistics
  const sessionStats = calculateSessionStats(sessions);
  
  // Time-based statistics
  const timeStats = calculateTimeStats(reviewHistory, sessions);
  
  // Paper-based breakdown
  const paperStats = calculatePaperStats(cards, reviewHistory);
  
  // Difficulty analysis
  const difficultyStats = calculateDifficultyStats(reviewHistory);
  
  // Performance trends
  const trends = calculatePerformanceTrends(reviewHistory, sessions);
  
  // Predicted scores
  const predictedScores = SpacedRepetitionAnalytics.calculatePredictedScores({}, cards);

  return {
    // Card overview
    cards: {
      total: cards.length,
      byStatus: {
        new: cardsByStatus.new.length,
        learning: cardsByStatus.learning.length,
        review: cardsByStatus.review.length,
        mature: cardsByStatus.mature.length,
        overdue: cardsByStatus.overdue.length
      },
      dueToday: cards.filter(c => c.next_review_date === today).length,
      dueTomorrow: cards.filter(c => c.next_review_date === getDateString(1)).length,
      dueThisWeek: cards.filter(c => {
        const reviewDate = new Date(c.next_review_date);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return reviewDate <= weekFromNow;
      }).length
    },

    // Retention and accuracy
    retention,

    // Session statistics
    sessions: sessionStats,

    // Time statistics
    time: timeStats,

    // Study streak
    streak: {
      current: streak.current_streak || 0,
      longest: streak.longest_streak || 0,
      totalDays: streak.total_days || 0
    },

    // Paper breakdown
    papers: paperStats,

    // Difficulty analysis
    difficulty: difficultyStats,

    // Performance trends
    trends,

    // Predictions
    predictions: predictedScores,

    // Achievement progress
    achievements: calculateAchievements(cards, sessions, streak, retention)
  };
}

// Calculate session statistics
function calculateSessionStats(sessions) {
  if (!sessions || sessions.length === 0) {
    return {
      total: 0,
      averageQuestions: 0,
      averageAccuracy: 0,
      averageDuration: 0,
      longestSession: 0,
      totalTime: 0,
      thisWeek: 0,
      thisMonth: 0
    };
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalQuestions = sessions.reduce((sum, s) => sum + s.questions_reviewed, 0);
  const totalCorrect = sessions.reduce((sum, s) => sum + s.correct_answers, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + s.session_duration, 0);

  return {
    total: sessions.length,
    averageQuestions: sessions.length > 0 ? Math.round(totalQuestions / sessions.length) : 0,
    averageAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    averageDuration: sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0,
    longestSession: Math.max(...sessions.map(s => s.session_duration), 0),
    totalTime: totalDuration,
    thisWeek: sessions.filter(s => new Date(s.completed_at) >= weekAgo).length,
    thisMonth: sessions.filter(s => new Date(s.completed_at) >= monthAgo).length
  };
}

// Calculate time-based statistics
function calculateTimeStats(reviewHistory, sessions) {
  if (!reviewHistory || reviewHistory.length === 0) {
    return {
      averageResponseTime: 0,
      fastestResponse: 0,
      slowestResponse: 0,
      totalStudyTime: 0,
      dailyAverage: 0
    };
  }

  const responseTimes = reviewHistory.map(r => r.time_taken).filter(t => t > 0);
  const totalSessionTime = sessions.reduce((sum, s) => sum + s.session_duration, 0);
  
  // Calculate daily average study time
  const uniqueDays = new Set(sessions.map(s => s.completed_at.split('T')[0])).size;
  const dailyAverage = uniqueDays > 0 ? totalSessionTime / uniqueDays : 0;

  return {
    averageResponseTime: responseTimes.length > 0 ? 
      Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0,
    fastestResponse: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
    slowestResponse: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
    totalStudyTime: totalSessionTime,
    dailyAverage: Math.round(dailyAverage)
  };
}

// Calculate paper-specific statistics
function calculatePaperStats(cards, reviewHistory) {
  const papers = ['paper1', 'paper2', 'paper3'];
  const stats = {};

  papers.forEach(paper => {
    const paperCards = cards.filter(c => c.paper === paper);
    const paperReviews = reviewHistory.filter(r => {
      const card = cards.find(c => c.id === r.card_id);
      return card && card.paper === paper;
    });

    const totalReviews = paperReviews.length;
    const correctReviews = paperReviews.filter(r => r.was_correct).length;

    stats[paper] = {
      totalCards: paperCards.length,
      totalReviews,
      accuracy: totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0,
      averageEaseFactor: paperCards.length > 0 ? 
        paperCards.reduce((sum, c) => sum + c.ease_factor, 0) / paperCards.length : 0,
      averageInterval: paperCards.length > 0 ?
        paperCards.reduce((sum, c) => sum + c.interval_days, 0) / paperCards.length : 0,
      matureCards: paperCards.filter(c => c.repetitions >= 3 && c.interval_days > 21).length
    };
  });

  return stats;
}

// Calculate difficulty-based statistics
function calculateDifficultyStats(reviewHistory) {
  if (!reviewHistory || reviewHistory.length === 0) {
    return {
      averageDifficulty: 0,
      difficultyDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      correlationAccuracy: 0
    };
  }

  const ratingsWithDifficulty = reviewHistory.filter(r => r.difficulty_rating);
  
  if (ratingsWithDifficulty.length === 0) {
    return {
      averageDifficulty: 0,
      difficultyDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      correlationAccuracy: 0
    };
  }

  const avgDifficulty = ratingsWithDifficulty.reduce((sum, r) => sum + r.difficulty_rating, 0) / ratingsWithDifficulty.length;
  
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingsWithDifficulty.forEach(r => {
    if (distribution[r.difficulty_rating] !== undefined) {
      distribution[r.difficulty_rating]++;
    }
  });

  // Simple correlation between difficulty and accuracy
  const correlation = calculateDifficultyAccuracyCorrelation(ratingsWithDifficulty);

  return {
    averageDifficulty: Math.round(avgDifficulty * 10) / 10,
    difficultyDistribution: distribution,
    correlationAccuracy: correlation
  };
}

// Calculate performance trends
function calculatePerformanceTrends(reviewHistory, sessions) {
  if (!reviewHistory || reviewHistory.length < 10) {
    return {
      accuracyTrend: 'insufficient_data',
      speedTrend: 'insufficient_data',
      volumeTrend: 'insufficient_data',
      weeklyProgress: []
    };
  }

  // Split history into first and second half for trend analysis
  const midpoint = Math.floor(reviewHistory.length / 2);
  const firstHalf = reviewHistory.slice(midpoint);
  const secondHalf = reviewHistory.slice(0, midpoint);

  const firstHalfAccuracy = firstHalf.filter(r => r.was_correct).length / firstHalf.length * 100;
  const secondHalfAccuracy = secondHalf.filter(r => r.was_correct).length / secondHalf.length * 100;

  const firstHalfSpeed = firstHalf.reduce((sum, r) => sum + r.time_taken, 0) / firstHalf.length;
  const secondHalfSpeed = secondHalf.reduce((sum, r) => sum + r.time_taken, 0) / secondHalf.length;

  // Calculate weekly progress
  const weeklyProgress = calculateWeeklyProgress(sessions);

  return {
    accuracyTrend: secondHalfAccuracy > firstHalfAccuracy + 5 ? 'improving' :
                   secondHalfAccuracy < firstHalfAccuracy - 5 ? 'declining' : 'stable',
    speedTrend: secondHalfSpeed < firstHalfSpeed - 5 ? 'improving' :
                secondHalfSpeed > firstHalfSpeed + 5 ? 'declining' : 'stable',
    volumeTrend: sessions.length >= 7 ? 
      (sessions.slice(0, 3).reduce((s, sess) => s + sess.questions_reviewed, 0) >
       sessions.slice(-3).reduce((s, sess) => s + sess.questions_reviewed, 0) ? 'increasing' : 'stable') : 'insufficient_data',
    weeklyProgress
  };
}

// Calculate achievements and milestones
function calculateAchievements(cards, sessions, streak, retention) {
  const achievements = [];
  
  // Cards milestones
  if (cards.length >= 100) achievements.push({ type: 'cards', level: 'expert', title: '100+ Cards Created' });
  else if (cards.length >= 50) achievements.push({ type: 'cards', level: 'advanced', title: '50+ Cards Created' });
  else if (cards.length >= 10) achievements.push({ type: 'cards', level: 'beginner', title: '10+ Cards Created' });

  // Streak achievements
  if (streak.current_streak >= 30) achievements.push({ type: 'streak', level: 'expert', title: '30-Day Streak' });
  else if (streak.current_streak >= 7) achievements.push({ type: 'streak', level: 'advanced', title: '7-Day Streak' });
  else if (streak.current_streak >= 3) achievements.push({ type: 'streak', level: 'beginner', title: '3-Day Streak' });

  // Accuracy achievements
  if (retention.overall >= 90) achievements.push({ type: 'accuracy', level: 'expert', title: '90%+ Accuracy' });
  else if (retention.overall >= 80) achievements.push({ type: 'accuracy', level: 'advanced', title: '80%+ Accuracy' });
  else if (retention.overall >= 70) achievements.push({ type: 'accuracy', level: 'beginner', title: '70%+ Accuracy' });

  // Volume achievements
  const totalReviews = sessions.reduce((sum, s) => sum + s.questions_reviewed, 0);
  if (totalReviews >= 1000) achievements.push({ type: 'volume', level: 'expert', title: '1000+ Reviews' });
  else if (totalReviews >= 500) achievements.push({ type: 'volume', level: 'advanced', title: '500+ Reviews' });
  else if (totalReviews >= 100) achievements.push({ type: 'volume', level: 'beginner', title: '100+ Reviews' });

  return {
    unlocked: achievements,
    nextMilestones: calculateNextMilestones(cards, sessions, streak, retention)
  };
}

// Helper functions
function getDateString(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

function calculateDifficultyAccuracyCorrelation(reviews) {
  if (reviews.length < 5) return 0;
  
  // Simple correlation calculation
  const n = reviews.length;
  const sumX = reviews.reduce((sum, r) => sum + r.difficulty_rating, 0);
  const sumY = reviews.reduce((sum, r) => sum + (r.was_correct ? 1 : 0), 0);
  const sumXY = reviews.reduce((sum, r) => sum + r.difficulty_rating * (r.was_correct ? 1 : 0), 0);
  const sumX2 = reviews.reduce((sum, r) => sum + r.difficulty_rating * r.difficulty_rating, 0);
  const sumY2 = reviews.reduce((sum, r) => sum + (r.was_correct ? 1 : 0), 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator !== 0 ? Math.round((numerator / denominator) * 100) / 100 : 0;
}

function calculateWeeklyProgress(sessions) {
  const weeks = {};
  
  sessions.forEach(session => {
    const date = new Date(session.completed_at);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = { week: weekKey, sessions: 0, questions: 0, accuracy: 0, totalCorrect: 0 };
    }
    
    weeks[weekKey].sessions++;
    weeks[weekKey].questions += session.questions_reviewed;
    weeks[weekKey].totalCorrect += session.correct_answers;
  });
  
  // Calculate accuracy and sort by week
  return Object.values(weeks)
    .map(week => ({
      ...week,
      accuracy: week.questions > 0 ? Math.round((week.totalCorrect / week.questions) * 100) : 0
    }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-12); // Last 12 weeks
}

function calculateNextMilestones(cards, sessions, streak, retention) {
  const milestones = [];
  
  // Next card milestone
  if (cards.length < 10) milestones.push({ type: 'cards', target: 10, current: cards.length, title: 'Create 10 Cards' });
  else if (cards.length < 50) milestones.push({ type: 'cards', target: 50, current: cards.length, title: 'Create 50 Cards' });
  else if (cards.length < 100) milestones.push({ type: 'cards', target: 100, current: cards.length, title: 'Create 100 Cards' });
  
  // Next streak milestone
  const currentStreak = streak.current_streak || 0;
  if (currentStreak < 3) milestones.push({ type: 'streak', target: 3, current: currentStreak, title: '3-Day Streak' });
  else if (currentStreak < 7) milestones.push({ type: 'streak', target: 7, current: currentStreak, title: '7-Day Streak' });
  else if (currentStreak < 30) milestones.push({ type: 'streak', target: 30, current: currentStreak, title: '30-Day Streak' });
  
  return milestones.slice(0, 3); // Return top 3 next milestones
}
