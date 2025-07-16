// FILE: app/api/user/learning-analytics/route.js
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

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

    // First, ensure user_progress and analytics are up to date
    await ensureUserDataIsAggregated(userId);

    // Fetch user learning analytics
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('user_learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (analyticsError && analyticsError.code !== 'PGRST116') {
      console.error('Error fetching analytics:', analyticsError);
    }

    // Fetch chapter progress
    const { data: chapterProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('accuracy', { ascending: false });

    if (progressError) {
      console.error('Error fetching progress:', progressError);
    }

    // Fetch recent activity data for trends
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentActivity } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('session_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('session_date', { ascending: true });

    // Calculate total stats
    let totalStats = {
      questionsAttempted: 0,
      correctAnswers: 0,
      totalTimeSpent: 0
    };

    if (chapterProgress && chapterProgress.length > 0) {
      totalStats.questionsAttempted = chapterProgress.reduce((sum, p) => sum + p.total_questions_attempted, 0);
      totalStats.correctAnswers = chapterProgress.reduce((sum, p) => sum + p.correct_answers, 0);
    }

    if (recentActivity && recentActivity.length > 0) {
      totalStats.totalTimeSpent = recentActivity.reduce((sum, s) => sum + s.time_spent, 0);
    }

    // Format chapter stats for the dashboard
    const chapterStats = {};
    if (chapterProgress) {
      chapterProgress.forEach(progress => {
        chapterStats[progress.chapter] = {
          paper: progress.paper,
          accuracy: Math.round(progress.accuracy),
          totalQuestions: progress.total_questions_attempted,
          correctAnswers: progress.correct_answers,
          lastPracticed: progress.last_practiced,
          avgTimePerQuestion: progress.avg_time_per_question || 45
        };
      });
    }

    // Calculate study streak
    const studyStreak = calculateStudyStreak(recentActivity || []);

    // Get activity data for the last 30 days
    const activityData = (recentActivity || []).map(session => ({
      date: session.session_date,
      questionsAnswered: session.questions_answered,
      accuracy: session.average_accuracy,
      timeSpent: session.time_spent
    }));

    return NextResponse.json({
      analytics: analyticsData || {
        total_questions_attempted: totalStats.questionsAttempted,
        total_correct_answers: totalStats.correctAnswers,
        overall_accuracy: totalStats.questionsAttempted > 0 
          ? Math.round((totalStats.correctAnswers / totalStats.questionsAttempted) * 100) 
          : 0,
        predicted_paper1_score: 0,
        predicted_paper2_score: 0,
        predicted_paper3_score: 0,
        predicted_total_score: 0,
        improvement_rate: 0,
        consistency_score: 0
      },
      totalStats,
      chapterStats,
      studyStreak,
      activityData,
      userCreatedAt: session.user.createdAt || new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function ensureUserDataIsAggregated(userId) {
  try {
    // Check if user_progress exists, if not create from attempts
    const { data: hasProgress } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (!hasProgress || hasProgress.length === 0) {
      // Aggregate from quiz attempts
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId);

      const { data: testAttempts } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', userId);

      // Process and aggregate by chapter
      const chapterStats = {};

      // Process quiz attempts
      if (quizAttempts) {
        quizAttempts.forEach(attempt => {
          if (attempt.questions_data) {
            attempt.questions_data.forEach((question, index) => {
              const chapter = normalizeChapterName(question.tag);
              const key = `${attempt.paper}-${chapter}`;
              
              if (!chapterStats[key]) {
                chapterStats[key] = {
                  user_id: userId,
                  paper: attempt.paper,
                  chapter: chapter,
                  total_questions_attempted: 0,
                  correct_answers: 0,
                  last_practiced: attempt.completed_at
                };
              }
              
              chapterStats[key].total_questions_attempted++;
              
              const answer = attempt.answers.find(a => 
                a.questionId === (question.main_id || question.id)
              );
              if (answer && answer.isCorrect) {
                chapterStats[key].correct_answers++;
              }
              
              if (new Date(attempt.completed_at) > new Date(chapterStats[key].last_practiced)) {
                chapterStats[key].last_practiced = attempt.completed_at;
              }
            });
          }
        });
      }

      // Process test attempts
      if (testAttempts) {
        testAttempts.forEach(attempt => {
          if (attempt.questions_data) {
            attempt.questions_data.forEach((question, index) => {
              const chapter = normalizeChapterName(question.tag);
              const paper = attempt.test_type.startsWith('paper') ? attempt.test_type : 'mixed';
              const key = `${paper}-${chapter}`;
              
              if (!chapterStats[key]) {
                chapterStats[key] = {
                  user_id: userId,
                  paper: paper,
                  chapter: chapter,
                  total_questions_attempted: 0,
                  correct_answers: 0,
                  last_practiced: attempt.completed_at
                };
              }
              
              chapterStats[key].total_questions_attempted++;
              
              if (attempt.answers[index] === question.correct_answer) {
                chapterStats[key].correct_answers++;
              }
              
              if (new Date(attempt.completed_at) > new Date(chapterStats[key].last_practiced)) {
                chapterStats[key].last_practiced = attempt.completed_at;
              }
            });
          }
        });
      }

      // Insert aggregated data
      for (const stats of Object.values(chapterStats)) {
        stats.accuracy = stats.total_questions_attempted > 0
          ? (stats.correct_answers / stats.total_questions_attempted) * 100
          : 0;
        
        await supabase
          .from('user_progress')
          .insert(stats);
      }
    }

    // Update user_learning_analytics
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    if (progress && progress.length > 0) {
      const totalAttempted = progress.reduce((sum, p) => sum + p.total_questions_attempted, 0);
      const totalCorrect = progress.reduce((sum, p) => sum + p.correct_answers, 0);
      const overallAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;

      const analyticsData = {
        user_id: userId,
        total_questions_attempted: totalAttempted,
        total_correct_answers: totalCorrect,
        overall_accuracy: overallAccuracy,
        last_calculated: new Date().toISOString()
      };

      await supabase
        .from('user_learning_analytics')
        .upsert(analyticsData, { onConflict: 'user_id' });
    }
  } catch (error) {
    console.error('Error ensuring user data is aggregated:', error);
  }
}

function normalizeChapterName(tag) {
  if (!tag) return '';
  return tag
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
}

function calculateStudyStreak(sessions) {
  if (!sessions || sessions.length === 0) {
    return { current: 0, longest: 0, total: 0 };
  }

  const dates = sessions.map(s => new Date(s.session_date));
  dates.sort((a, b) => a - b);

  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const diffDays = Math.floor((dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  // Check if current streak is still active
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastSessionDate = new Date(dates[dates.length - 1]);
  lastSessionDate.setHours(0, 0, 0, 0);
  const daysSinceLastSession = Math.floor((today - lastSessionDate) / (1000 * 60 * 60 * 24));

  if (daysSinceLastSession <= 1) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  return {
    current: currentStreak,
    longest: longestStreak,
    total: sessions.length
  };
}
