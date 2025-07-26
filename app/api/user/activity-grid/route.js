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
    const requestedDays = parseInt(searchParams.get('days') || '30');

    // Get date range for the last 30 days (or requested days, max 90)
    const daysToFetch = Math.min(requestedDays, 90); // Cap at 90 days for performance
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (daysToFetch - 1)); // Include today

    // First, check if we have any study sessions at all
    const { data: hasData } = await supabase
      .from('study_sessions')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (!hasData || hasData.length === 0) {
      // If no study sessions, try to create them from existing quiz/test attempts
      await createStudySessionsFromAttempts(userId);
    }

    // Fetch study sessions for the date range
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

    // Create activity grids
    const questionsGrid = [];
    const accuracyGrid = [];
    
    // Create a map for quick lookup
    const sessionMap = {};
    if (studySessions) {
      studySessions.forEach(session => {
        sessionMap[session.session_date] = session;
      });
    }

    // Generate data for each day in the range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const session = sessionMap[dateStr];
      
      questionsGrid.push({
        date: dateStr,
        count: session ? session.questions_answered : 0,
        level: getActivityLevel(session ? session.questions_answered : 0),
        details: session ? {
          questions: session.questions_answered,
          quizzes: session.quiz_attempts,
          tests: session.test_attempts,
          time: session.time_spent,
          chapters: session.unique_chapters_studied
        } : null
      });

      accuracyGrid.push({
        date: dateStr,
        accuracy: session ? Math.round(session.average_accuracy) : 0,
        level: getAccuracyLevel(session ? session.average_accuracy : 0),
        details: session ? {
          accuracy: Math.round(session.average_accuracy),
          quizAccuracy: Math.round(session.quiz_accuracy || 0),
          testAccuracy: Math.round(session.test_accuracy || 0),
          bestChapter: session.best_chapter,
          weakestChapter: session.weakest_chapter
        } : null
      });
    }

    // Calculate statistics for the fetched period
    const totalDays = questionsGrid.length;
    const activeDays = studySessions ? studySessions.length : 0;
    const totalQuestions = studySessions ? studySessions.reduce((sum, s) => sum + s.questions_answered, 0) : 0;
    const averageAccuracy = studySessions && studySessions.length > 0
      ? studySessions.reduce((sum, s) => sum + s.average_accuracy, 0) / studySessions.length
      : 0;

    // Calculate streaks for the period
    const streaks = calculateStreaks(studySessions || []);

    // Get monthly summaries (limit to requested period)
    const monthlySummaries = calculateMonthlySummaries(studySessions || []);

    return NextResponse.json({
      questionsGrid,
      accuracyGrid,
      statistics: {
        totalDays,
        activeDays,
        totalQuestions,
        averageAccuracy: Math.round(averageAccuracy),
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        activityRate: Math.round((activeDays / totalDays) * 100),
        period: `${daysToFetch} days`,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      monthlySummaries
    }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to create study sessions from existing attempts
async function createStudySessionsFromAttempts(userId) {
  try {
    // Fetch all quiz attempts
    const { data: quizAttempts } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    // Fetch all test attempts
    const { data: testAttempts } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    // Group by date
    const sessionsByDate = {};

    // Process quiz attempts
    if (quizAttempts) {
      quizAttempts.forEach(attempt => {
        const date = attempt.completed_at.split('T')[0];
        if (!sessionsByDate[date]) {
          sessionsByDate[date] = {
            user_id: userId,
            session_date: date,
            questions_answered: 0,
            quiz_attempts: 0,
            test_attempts: 0,
            time_spent: 0,
            topics_studied: [],
            average_accuracy: 0,
            unique_chapters_studied: 0,
            quiz_accuracy: 0,
            test_accuracy: 0,
            quiz_scores: [],
            test_scores: []
          };
        }
        
        sessionsByDate[date].questions_answered += attempt.total_questions;
        sessionsByDate[date].quiz_attempts += 1;
        sessionsByDate[date].time_spent += attempt.time_taken;
        sessionsByDate[date].quiz_scores.push(attempt.score);
        
        // Extract chapters from questions_data
        if (attempt.questions_data) {
          attempt.questions_data.forEach(q => {
            if (q.tag) {
              const chapter = normalizeChapterName(q.tag);
              if (!sessionsByDate[date].topics_studied.includes(chapter)) {
                sessionsByDate[date].topics_studied.push(chapter);
              }
            }
          });
        }
      });
    }

    // Process test attempts
    if (testAttempts) {
      testAttempts.forEach(attempt => {
        const date = attempt.completed_at.split('T')[0];
        if (!sessionsByDate[date]) {
          sessionsByDate[date] = {
            user_id: userId,
            session_date: date,
            questions_answered: 0,
            quiz_attempts: 0,
            test_attempts: 0,
            time_spent: 0,
            topics_studied: [],
            average_accuracy: 0,
            unique_chapters_studied: 0,
            quiz_accuracy: 0,
            test_accuracy: 0,
            quiz_scores: [],
            test_scores: []
          };
        }
        
        sessionsByDate[date].questions_answered += attempt.total_questions;
        sessionsByDate[date].test_attempts += 1;
        sessionsByDate[date].time_spent += attempt.time_taken;
        sessionsByDate[date].test_scores.push(attempt.score);
        
        // Extract chapters from questions_data
        if (attempt.questions_data) {
          attempt.questions_data.forEach(q => {
            if (q.tag) {
              const chapter = normalizeChapterName(q.tag);
              if (!sessionsByDate[date].topics_studied.includes(chapter)) {
                sessionsByDate[date].topics_studied.push(chapter);
              }
            }
          });
        }
      });
    }

    // Calculate averages and insert
    for (const [date, session] of Object.entries(sessionsByDate)) {
      // Calculate average accuracies
      if (session.quiz_scores.length > 0) {
        session.quiz_accuracy = session.quiz_scores.reduce((a, b) => a + b, 0) / session.quiz_scores.length;
      }
      if (session.test_scores.length > 0) {
        session.test_accuracy = session.test_scores.reduce((a, b) => a + b, 0) / session.test_scores.length;
      }
      
      // Overall average
      const allScores = [...session.quiz_scores, ...session.test_scores];
      if (allScores.length > 0) {
        session.average_accuracy = allScores.reduce((a, b) => a + b, 0) / allScores.length;
      }
      
      session.unique_chapters_studied = session.topics_studied.length;
      
      // Clean up temporary arrays
      delete session.quiz_scores;
      delete session.test_scores;
      
      // Insert into database
      await supabase
        .from('study_sessions')
        .insert(session);
    }
  } catch (error) {
    console.error('Error creating study sessions from attempts:', error);
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
  if (!sessions || sessions.length === 0) return { current: 0, longest: 0 };
  
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
      ? Math.round(summary.accuracySum / summary.sessionCount)
      : 0;
    delete summary.accuracySum;
  });
  
  return summaries;
}
