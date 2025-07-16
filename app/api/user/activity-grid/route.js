// FILE: app/api/user/activity-grid/route.js
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
    const year = searchParams.get('year') || new Date().getFullYear();

    // Get start and end dates for the year
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    // Fetch study sessions for the year
    const { data: studySessions, error: sessionsError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('session_date', startDate.toISOString().split('T')[0])
      .lte('session_date', endDate.toISOString().split('T')[0])
      .order('session_date', { ascending: true });

    if (sessionsError) {
      console.error('Error fetching study sessions:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch activity data' }, { status: 500 });
    }

    // Create activity grid data
    const activityGrid = createYearGrid(year);
    const accuracyGrid = createYearGrid(year);

    // Fill in the data
    studySessions.forEach(session => {
      const dateStr = session.session_date;
      if (activityGrid[dateStr] !== undefined) {
        activityGrid[dateStr] = {
          date: dateStr,
          count: session.questions_answered,
          level: getActivityLevel(session.questions_answered),
          details: {
            questions: session.questions_answered,
            quizzes: session.quiz_attempts,
            tests: session.test_attempts,
            time: session.time_spent,
            chapters: session.unique_chapters_studied
          }
        };

        accuracyGrid[dateStr] = {
          date: dateStr,
          accuracy: session.average_accuracy,
          level: getAccuracyLevel(session.average_accuracy),
          details: {
            accuracy: session.average_accuracy,
            quizAccuracy: session.quiz_accuracy,
            testAccuracy: session.test_accuracy,
            bestChapter: session.best_chapter,
            weakestChapter: session.weakest_chapter
          }
        };
      }
    });

    // Calculate statistics
    const totalDays = Object.keys(activityGrid).length;
    const activeDays = studySessions.length;
    const totalQuestions = studySessions.reduce((sum, s) => sum + s.questions_answered, 0);
    const averageAccuracy = studySessions.length > 0
      ? studySessions.reduce((sum, s) => sum + s.average_accuracy, 0) / studySessions.length
      : 0;

    // Find streaks
    const streaks = calculateStreaks(studySessions);

    // Get monthly summaries
    const monthlySummaries = calculateMonthlySummaries(studySessions);

    return NextResponse.json({
      activityGrid: Object.values(activityGrid),
      accuracyGrid: Object.values(accuracyGrid),
      statistics: {
        totalDays,
        activeDays,
        totalQuestions,
        averageAccuracy,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        activityRate: (activeDays / totalDays) * 100
      },
      monthlySummaries,
      year
    }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function createYearGrid(year) {
  const grid = {};
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    grid[dateStr] = {
      date: dateStr,
      count: 0,
      level: 0,
      details: null
    };
  }
  
  return grid;
}

function getActivityLevel(count) {
  if (count === 0) return 0;
  if (count < 5) return 1;
  if (count < 10) return 2;
  if (count < 20) return 3;
  return 4;
}

function getAccuracyLevel(accuracy) {
  if (accuracy === 0) return 0;
  if (accuracy < 40) return 1;
  if (accuracy < 60) return 2;
  if (accuracy < 80) return 3;
  return 4;
}

function calculateStreaks(sessions) {
  if (sessions.length === 0) return { current: 0, longest: 0 };
  
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
  const lastSessionDate = dates[dates.length - 1];
  const daysSinceLastSession = Math.floor((today - lastSessionDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastSession <= 1) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }
  
  return { current: currentStreak, longest: longestStreak };
}

function calculateMonthlySummaries(sessions) {
  const summaries = {};
  
  sessions.forEach(session => {
    const month = session.session_date.substring(0, 7); // YYYY-MM
    
    if (!summaries[month]) {
      summaries[month] = {
        month,
        totalQuestions: 0,
        totalTime: 0,
        averageAccuracy: 0,
        sessionCount: 0,
        accuracySum: 0
      };
    }
    
    summaries[month].totalQuestions += session.questions_answered;
    summaries[month].totalTime += session.time_spent;
    summaries[month].accuracySum += session.average_accuracy;
    summaries[month].sessionCount++;
  });
  
  // Calculate averages
  Object.values(summaries).forEach(summary => {
    summary.averageAccuracy = summary.sessionCount > 0
      ? summary.accuracySum / summary.sessionCount
      : 0;
    delete summary.accuracySum;
  });
  
  return summaries;
}
