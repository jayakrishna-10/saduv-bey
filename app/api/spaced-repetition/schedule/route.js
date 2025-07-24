// app/api/spaced-repetition/schedule/route.js
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { CardUtils } from '@/lib/spaced-repetition-utils';

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
    
    const startDate = searchParams.get('start_date') || new Date().toISOString().split('T')[0];
    const endDate = searchParams.get('end_date') || getDateString(30); // Next 30 days
    const paper = searchParams.get('paper') || 'all';
    const includeHistory = searchParams.get('include_history') === 'true';

    console.log(`[SPACED-REPETITION] Fetching schedule for user ${userId}, ${startDate} to ${endDate}`);

    // Fetch user's cards
    let cardsQuery = supabase
      .from('spaced_repetition_cards')
      .select('*')
      .eq('user_id', userId)
      .gte('next_review_date', startDate)
      .lte('next_review_date', endDate);

    if (paper !== 'all') {
      cardsQuery = cardsQuery.eq('paper', paper);
    }

    const { data: cards, error: cardsError } = await cardsQuery;

    if (cardsError) {
      console.error('Error fetching cards for schedule:', cardsError);
      return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
    }

    // Group cards by date
    const scheduleByDate = {};
    const today = new Date().toISOString().split('T')[0];

    // Initialize all dates in range
    const currentDate = new Date(startDate);
    const finalDate = new Date(endDate);
    
    while (currentDate <= finalDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      scheduleByDate[dateKey] = {
        date: dateKey,
        total: 0,
        overdue: 0,
        due: 0,
        byPaper: {
          paper1: 0,
          paper2: 0,
          paper3: 0
        },
        cards: [],
        isToday: dateKey === today,
        isPast: dateKey < today
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Populate with actual card data
    (cards || []).forEach(card => {
      const reviewDate = card.next_review_date;
      if (scheduleByDate[reviewDate]) {
        scheduleByDate[reviewDate].total++;
        scheduleByDate[reviewDate].byPaper[card.paper]++;
        scheduleByDate[reviewDate].cards.push({
          id: card.id,
          question_id: card.question_id,
          paper: card.paper,
          ease_factor: card.ease_factor,
          interval_days: card.interval_days,
          total_reviews: card.total_reviews,
          retention_rate: card.total_reviews > 0 ? 
            Math.round((card.correct_reviews / card.total_reviews) * 100) : 0
        });

        // Categorize by status
        if (reviewDate < today) {
          scheduleByDate[reviewDate].overdue++;
        } else if (reviewDate === today) {
          scheduleByDate[reviewDate].due++;
        }
      }
    });

    // Calculate summary statistics
    const summary = calculateScheduleSummary(scheduleByDate, today);

    // Get historical data if requested
    let historicalData = null;
    if (includeHistory) {
      historicalData = await getHistoricalActivity(userId, startDate, endDate);
    }

    // Calculate workload distribution
    const workloadDistribution = calculateWorkloadDistribution(scheduleByDate);

    // Generate recommendations
    const recommendations = generateScheduleRecommendations(scheduleByDate, summary);

    console.log(`[SPACED-REPETITION] Returning schedule with ${summary.totalCards} cards across ${Object.keys(scheduleByDate).length} days`);

    return NextResponse.json({
      schedule: Object.values(scheduleByDate).sort((a, b) => a.date.localeCompare(b.date)),
      summary,
      workload: workloadDistribution,
      recommendations,
      historical: historicalData,
      dateRange: {
        start: startDate,
        end: endDate,
        paper
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate schedule summary
function calculateScheduleSummary(scheduleByDate, today) {
  const dates = Object.keys(scheduleByDate).sort();
  let totalCards = 0;
  let overdueCards = 0;
  let dueTodayCards = 0;
  let dueThisWeekCards = 0;
  let dueNextWeekCards = 0;
  
  const oneWeekFromToday = getDateString(7);
  const twoWeeksFromToday = getDateString(14);

  dates.forEach(date => {
    const dayData = scheduleByDate[date];
    totalCards += dayData.total;
    
    if (date < today) {
      overdueCards += dayData.total;
    } else if (date === today) {
      dueTodayCards += dayData.total;
    } else if (date <= oneWeekFromToday) {
      dueThisWeekCards += dayData.total;
    } else if (date <= twoWeeksFromToday) {
      dueNextWeekCards += dayData.total;
    }
  });

  // Find busiest day
  const busiestDay = dates.reduce((busiest, date) => {
    return scheduleByDate[date].total > scheduleByDate[busiest].total ? date : busiest;
  }, dates[0]);

  // Calculate average daily load
  const futureDates = dates.filter(date => date >= today);
  const averageDailyLoad = futureDates.length > 0 ?
    Math.round(futureDates.reduce((sum, date) => sum + scheduleByDate[date].total, 0) / futureDates.length) : 0;

  return {
    totalCards,
    overdueCards,
    dueTodayCards,
    dueThisWeekCards,
    dueNextWeekCards,
    busiestDay: {
      date: busiestDay,
      count: scheduleByDate[busiestDay]?.total || 0
    },
    averageDailyLoad,
    totalDays: dates.length,
    activeDays: dates.filter(date => scheduleByDate[date].total > 0).length
  };
}

// Helper function to calculate workload distribution
function calculateWorkloadDistribution(scheduleByDate) {
  const distribution = {
    byDayOfWeek: {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 // Sunday = 0
    },
    byPaper: {
      paper1: 0,
      paper2: 0,
      paper3: 0
    },
    weekly: []
  };

  // Calculate by day of week
  Object.values(scheduleByDate).forEach(dayData => {
    const dayOfWeek = new Date(dayData.date).getDay();
    distribution.byDayOfWeek[dayOfWeek] += dayData.total;
    
    // Sum by paper
    distribution.byPaper.paper1 += dayData.byPaper.paper1;
    distribution.byPaper.paper2 += dayData.byPaper.paper2;
    distribution.byPaper.paper3 += dayData.byPaper.paper3;
  });

  // Calculate weekly totals
  const dates = Object.keys(scheduleByDate).sort();
  let weekStart = null;
  let weekTotal = 0;
  let weekData = { paper1: 0, paper2: 0, paper3: 0 };

  dates.forEach(date => {
    const currentDate = new Date(date);
    const currentWeekStart = getWeekStart(currentDate);
    
    if (weekStart === null) {
      weekStart = currentWeekStart;
    }
    
    if (currentWeekStart.getTime() === weekStart.getTime()) {
      // Same week
      weekTotal += scheduleByDate[date].total;
      weekData.paper1 += scheduleByDate[date].byPaper.paper1;
      weekData.paper2 += scheduleByDate[date].byPaper.paper2;
      weekData.paper3 += scheduleByDate[date].byPaper.paper3;
    } else {
      // New week started
      if (weekTotal > 0) {
        distribution.weekly.push({
          weekStart: weekStart.toISOString().split('T')[0],
          total: weekTotal,
          byPaper: { ...weekData }
        });
      }
      
      weekStart = currentWeekStart;
      weekTotal = scheduleByDate[date].total;
      weekData = {
        paper1: scheduleByDate[date].byPaper.paper1,
        paper2: scheduleByDate[date].byPaper.paper2,
        paper3: scheduleByDate[date].byPaper.paper3
      };
    }
  });

  // Add the last week
  if (weekTotal > 0) {
    distribution.weekly.push({
      weekStart: weekStart.toISOString().split('T')[0],
      total: weekTotal,
      byPaper: { ...weekData }
    });
  }

  return distribution;
}

// Helper function to generate schedule recommendations
function generateScheduleRecommendations(scheduleByDate, summary) {
  const recommendations = [];

  // Overdue cards warning
  if (summary.overdueCards > 0) {
    recommendations.push({
      type: 'overdue',
      priority: 'high',
      title: 'Overdue Reviews',
      description: `You have ${summary.overdueCards} overdue cards that need immediate attention.`,
      action: 'Review overdue cards now',
      count: summary.overdueCards
    });
  }

  // Heavy workload warning
  if (summary.busiestDay.count > 30) {
    recommendations.push({
      type: 'workload',
      priority: 'medium',
      title: 'Heavy Review Day',
      description: `${summary.busiestDay.date} has ${summary.busiestDay.count} cards scheduled. Consider reviewing some cards early.`,
      action: 'Distribute workload',
      date: summary.busiestDay.date,
      count: summary.busiestDay.count
    });
  }

  // Daily review suggestion
  if (summary.dueTodayCards > 0) {
    recommendations.push({
      type: 'daily',
      priority: 'normal',
      title: 'Daily Reviews Available',
      description: `${summary.dueTodayCards} cards are due for review today.`,
      action: 'Start daily review session',
      count: summary.dueTodayCards
    });
  }

  // Consistency recommendation
  if (summary.averageDailyLoad > 15) {
    recommendations.push({
      type: 'consistency',
      priority: 'low',
      title: 'Maintain Consistency',
      description: `You have an average of ${summary.averageDailyLoad} cards per day. Try to maintain a consistent daily review habit.`,
      action: 'Set daily review reminder',
      average: summary.averageDailyLoad
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, normal: 1, low: 0 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// Helper function to get historical activity
async function getHistoricalActivity(userId, startDate, endDate) {
  try {
    const { data: sessions, error } = await supabase
      .from('spaced_repetition_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', startDate)
      .lte('completed_at', endDate + 'T23:59:59')
      .order('completed_at', { ascending: true });

    if (error) {
      console.error('Error fetching historical sessions:', error);
      return null;
    }

    // Group by date
    const activityByDate = {};
    (sessions || []).forEach(session => {
      const date = session.completed_at.split('T')[0];
      if (!activityByDate[date]) {
        activityByDate[date] = {
          date,
          sessions: 0,
          questionsReviewed: 0,
          averageAccuracy: 0,
          totalTime: 0,
          accuracySum: 0
        };
      }
      
      activityByDate[date].sessions++;
      activityByDate[date].questionsReviewed += session.questions_reviewed;
      activityByDate[date].totalTime += session.session_duration;
      activityByDate[date].accuracySum += session.correct_answers / session.questions_reviewed * 100;
    });

    // Calculate averages
    Object.values(activityByDate).forEach(day => {
      day.averageAccuracy = day.sessions > 0 ? 
        Math.round(day.accuracySum / day.sessions) : 0;
      delete day.accuracySum;
    });

    return Object.values(activityByDate).sort((a, b) => a.date.localeCompare(b.date));

  } catch (error) {
    console.error('Error fetching historical activity:', error);
    return null;
  }
}

// Helper function to get date string
function getDateString(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// Helper function to get week start (Sunday)
function getWeekStart(date) {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}
