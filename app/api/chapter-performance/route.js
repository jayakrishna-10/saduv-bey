// FILE: app/api/user/chapter-performance/route.js
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { eachDayOfInterval, format, subDays } from 'date-fns';

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
    const chapters = searchParams.get('chapters'); // For multiple chapters (legacy)
    const paper = searchParams.get('paper');
    const dateRange = searchParams.get('range') || '30'; // 7, 30, or 'all'
    const days = searchParams.get('days') || dateRange; // Support both params
    const mode = searchParams.get('mode') || 'single'; // 'single' or 'comparison'

    // Build the query
    let query = supabase
      .from('daily_chapter_performance')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    // Add date filter
    if (dateRange !== 'all' && days !== 'all') {
      const daysAgo = parseInt(days);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      query = query.gte('date', startDate.toISOString().split('T')[0]);
    }

    // Add chapter/paper filters
    if (mode === 'single' && chapter && paper) {
      query = query.eq('chapter_name', chapter).eq('paper', paper);
    } else if (chapters) {
      // Legacy support for multiple chapters
      const chapterList = chapters.split(',');
      query = query.in('chapter_name', chapterList);
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

      // Get last 10 sessions for this chapter
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
    
    if (mode === 'single' || chapter) {
      // For weekly view, ensure we have data for all days in the range
      if (parseInt(days) <= 7 && chapter && paper) {
        // Generate complete week data with zero-filled missing days
        const endDate = new Date();
        const startDate = subDays(endDate, parseInt(days) - 1);
        const allDays = eachDayOfInterval({ start: startDate, end: endDate });
        
        const completeChartData = allDays.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayData = performanceData.find(item => item.date === dateStr);
          
          return {
            date: dateStr,
            accuracy: dayData ? dayData.accuracy : 0,
            questions: dayData ? dayData.questions_attempted : 0,
            correct: dayData ? dayData.correct_answers : 0,
            timeSpent: dayData ? dayData.time_spent : 0
          };
        });
        
        formattedData.chartData = completeChartData;
      } else {
        // Regular chart data
        formattedData.chartData = performanceData.map(item => ({
          date: item.date,
          accuracy: item.accuracy,
          questions: item.questions_attempted,
          correct: item.correct_answers,
          timeSpent: item.time_spent
        }));
      }
    } else if (chapters) {
      // Legacy format for multiple chapters
      formattedData.performanceData = performanceData.map(item => ({
        date: item.date,
        chapter: item.chapter_name,
        accuracy: item.accuracy,
        questions: item.questions_attempted
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

    // Calculate weekly summary stats for single chapter mode
    let weeklyStats = null;
    if (mode === 'single' && chapter && paper && parseInt(days) <= 7) {
      const totalQuestions = performanceData.reduce((sum, item) => sum + item.questions_attempted, 0);
      const totalCorrect = performanceData.reduce((sum, item) => sum + item.correct_answers, 0);
      const totalTime = performanceData.reduce((sum, item) => sum + item.time_spent, 0);
      const avgAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
      const activeDays = performanceData.filter(item => item.questions_attempted > 0).length;
      
      weeklyStats = {
        totalQuestions,
        totalCorrect,
        avgAccuracy,
        totalTime,
        activeDays,
        consistency: activeDays > 0 ? (activeDays / parseInt(days)) * 100 : 0
      };
    }

    return NextResponse.json({
      performanceData: formattedData,
      overallStats,
      masteryData,
      weeklyStats,
      dateRange,
      mode,
      requestedDays: parseInt(days)
    }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
