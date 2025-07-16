// FILE: app/api/user/chapter-performance/route.js
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
    const { searchParams } = new URL(request.url);
    const chapter = searchParams.get('chapter');
    const paper = searchParams.get('paper');
    const dateRange = searchParams.get('range') || '30'; // 7, 30, or 'all'
    const mode = searchParams.get('mode') || 'single'; // 'single' or 'comparison'

    // Build the query
    let query = supabase
      .from('daily_chapter_performance')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    // Add date filter
    if (dateRange !== 'all') {
      const daysAgo = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      query = query.gte('date', startDate.toISOString().split('T')[0]);
    }

    // Add chapter/paper filters
    if (mode === 'single' && chapter && paper) {
      query = query.eq('chapter_name', chapter).eq('paper', paper);
    } else if (mode === 'comparison' && paper) {
      query = query.eq('paper', paper);
    }

    const { data: performanceData, error } = await query;

    if (error) {
      console.error('Error fetching chapter performance:', error);
      return NextResponse.json({ error: 'Failed to fetch chapter performance' }, { status: 500 });
    }

    // Get overall statistics for the chapter
    let overallStats = null;
    if (chapter && paper) {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter', chapter)
        .eq('paper', paper)
        .single();

      // Get last 10 active sessions for this chapter
      const { data: recentSessions } = await supabase
        .from('daily_chapter_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_name', chapter)
        .eq('paper', paper)
        .order('date', { ascending: false })
        .limit(10);

      if (recentSessions && recentSessions.length > 0) {
        const totalQuestions = recentSessions.reduce((sum, s) => sum + s.questions_attempted, 0);
        const totalCorrect = recentSessions.reduce((sum, s) => sum + s.correct_answers, 0);
        const totalTime = recentSessions.reduce((sum, s) => sum + s.time_spent, 0);
        const avgAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

        overallStats = {
          totalQuestions,
          totalCorrect,
          avgAccuracy,
          totalTime,
          sessionsCount: recentSessions.length,
          lastPracticed: progressData?.last_practiced,
          allTimeStats: progressData
        };
      }
    }

    // Get chapter mastery level
    let masteryData = null;
    if (chapter && paper) {
      const { data: mastery } = await supabase
        .from('chapter_mastery')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_name', chapter)
        .eq('paper', paper)
        .single();

      masteryData = mastery;
    }

    // Format data for charts
    const formattedData = {};
    
    if (mode === 'single') {
      formattedData.chartData = performanceData.map(item => ({
        date: item.date,
        accuracy: item.accuracy,
        questions: item.questions_attempted,
        correct: item.correct_answers,
        timeSpent: item.time_spent
      }));
    } else {
      // Group by chapter for comparison
      const groupedData = {};
      performanceData.forEach(item => {
        if (!groupedData[item.chapter_name]) {
          groupedData[item.chapter_name] = [];
        }
        groupedData[item.chapter_name].push({
          date: item.date,
          accuracy: item.accuracy,
          questions: item.questions_attempted
        });
      });
      formattedData.comparisonData = groupedData;
    }

    return NextResponse.json({
      performanceData: formattedData,
      overallStats,
      masteryData,
      dateRange,
      mode
    }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
