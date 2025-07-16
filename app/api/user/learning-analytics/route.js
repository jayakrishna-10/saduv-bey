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

    // Fetch learning analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('user_learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (analyticsError && analyticsError.code !== 'PGRST116') {
      console.error('Error fetching analytics:', analyticsError);
      return NextResponse.json({ error: 'Failed to fetch learning analytics' }, { status: 500 });
    }

    // Fetch chapter-wise accuracy for bar chart
    const { data: chapterProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('accuracy', { ascending: false });

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return NextResponse.json({ error: 'Failed to fetch chapter progress' }, { status: 500 });
    }

    // Fetch predicted scores with chapter breakdown
    const { data: predictedScores, error: scoresError } = await supabase
      .rpc('calculate_predicted_scores', { p_user_id: userId });

    if (scoresError) {
      console.error('Error calculating predicted scores:', scoresError);
    }

    // Get chapter weightages for reference
    const { data: chapterWeightages, error: weightagesError } = await supabase
      .from('chapter_weightages')
      .select('*')
      .order('paper', { ascending: true })
      .order('weightage_percentage', { ascending: false });

    if (weightagesError) {
      console.error('Error fetching weightages:', weightagesError);
    }

    // Format chapter progress for bar chart
    const formattedChapterProgress = chapterProgress.map(chapter => ({
      chapter: chapter.chapter,
      paper: chapter.paper,
      accuracy: chapter.accuracy,
      totalQuestions: chapter.total_questions_attempted,
      correctAnswers: chapter.correct_answers,
      lastPracticed: chapter.last_practiced,
      color: getChapterColor(chapter.accuracy)
    }));

    // Calculate improvement trends
    const { data: weeklyProgress } = await supabase
      .from('daily_chapter_performance')
      .select('date, accuracy, questions_attempted')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true });

    let improvementRate = 0;
    if (weeklyProgress && weeklyProgress.length > 1) {
      const firstDayAccuracy = weeklyProgress[0].accuracy;
      const lastDayAccuracy = weeklyProgress[weeklyProgress.length - 1].accuracy;
      improvementRate = lastDayAccuracy - firstDayAccuracy;
    }

    // Calculate consistency score (based on study streak and regular practice)
    const { data: studySessions } = await supabase
      .from('study_sessions')
      .select('session_date')
      .eq('user_id', userId)
      .gte('session_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('session_date', { ascending: true });

    let consistencyScore = 0;
    if (studySessions && studySessions.length > 0) {
      const daysStudied = studySessions.length;
      consistencyScore = Math.min((daysStudied / 30) * 100, 100);
    }

    // Get user preferences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    return NextResponse.json({
      analytics: analytics || {
        total_questions_attempted: 0,
        total_correct_answers: 0,
        overall_accuracy: 0,
        predicted_paper1_score: 0,
        predicted_paper2_score: 0,
        predicted_paper3_score: 0,
        predicted_total_score: 0,
        strongest_chapter: null,
        weakest_chapter: null,
        improvement_rate: improvementRate,
        consistency_score: consistencyScore
      },
      chapterProgress: formattedChapterProgress,
      predictedScores: predictedScores || [],
      chapterWeightages: chapterWeightages || [],
      improvementRate,
      consistencyScore,
      preferences: preferences || { daily_goal: 10 }
    }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getChapterColor(accuracy) {
  if (accuracy >= 80) return '#10b981'; // green
  if (accuracy >= 60) return '#f59e0b'; // yellow
  return '#ef4444'; // red
}
