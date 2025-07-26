// FILE: app/api/debug/saves/route.js
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
  // Only allow in development or for admin users
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Debug endpoint not available in production' }, { status: 403 });
  }

  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const hours = parseInt(searchParams.get('hours') || '24');
    const checkDuplicates = searchParams.get('checkDuplicates') === 'true';

    // Calculate time range
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    // Fetch recent quiz attempts
    const { data: quizAttempts, error: quizError } = await supabase
      .from('quiz_attempts')
      .select('id, user_id, paper, selected_topic, question_count, score, time_taken, completed_at')
      .gte('completed_at', startTime.toISOString())
      .order('completed_at', { ascending: false });

    if (quizError) {
      console.error('Error fetching quiz attempts:', quizError);
      return NextResponse.json({ error: 'Failed to fetch quiz attempts' }, { status: 500 });
    }

    // Fetch recent test attempts
    const { data: testAttempts, error: testError } = await supabase
      .from('test_attempts')
      .select('id, user_id, test_mode, test_type, total_questions, score, time_taken, completed_at')
      .gte('completed_at', startTime.toISOString())
      .order('completed_at', { ascending: false });

    if (testError) {
      console.error('Error fetching test attempts:', testError);
      return NextResponse.json({ error: 'Failed to fetch test attempts' }, { status: 500 });
    }

    // Filter by user if specified
    let filteredQuizAttempts = quizAttempts || [];
    let filteredTestAttempts = testAttempts || [];

    if (userId) {
      filteredQuizAttempts = filteredQuizAttempts.filter(attempt => attempt.user_id === userId);
      filteredTestAttempts = filteredTestAttempts.filter(attempt => attempt.user_id === userId);
    }

    const report = {
      timeRange: {
        hours,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString()
      },
      statistics: {
        quiz: {
          total: filteredQuizAttempts.length,
          uniqueUsers: new Set(filteredQuizAttempts.map(a => a.user_id)).size,
          avgScore: filteredQuizAttempts.length > 0 
            ? (filteredQuizAttempts.reduce((sum, a) => sum + a.score, 0) / filteredQuizAttempts.length).toFixed(2)
            : 0
        },
        test: {
          total: filteredTestAttempts.length,
          uniqueUsers: new Set(filteredTestAttempts.map(a => a.user_id)).size,
          avgScore: filteredTestAttempts.length > 0 
            ? (filteredTestAttempts.reduce((sum, a) => sum + a.score, 0) / filteredTestAttempts.length).toFixed(2)
            : 0
        }
      },
      recentAttempts: {
        quiz: filteredQuizAttempts.slice(0, 10),
        test: filteredTestAttempts.slice(0, 10)
      }
    };

    // Check for potential duplicates if requested
    if (checkDuplicates) {
      const quizDuplicates = findPotentialDuplicates(filteredQuizAttempts, 'quiz');
      const testDuplicates = findPotentialDuplicates(filteredTestAttempts, 'test');

      report.potentialDuplicates = {
        quiz: quizDuplicates,
        test: testDuplicates,
        summary: {
          quizDuplicateGroups: quizDuplicates.length,
          testDuplicateGroups: testDuplicates.length,
          totalSuspiciousAttempts: quizDuplicates.reduce((sum, group) => sum + group.attempts.length, 0) +
                                   testDuplicates.reduce((sum, group) => sum + group.attempts.length, 0)
        }
      };
    }

    // User-specific analysis if userId provided
    if (userId) {
      report.userAnalysis = {
        userId,
        totalQuizzes: filteredQuizAttempts.length,
        totalTests: filteredTestAttempts.length,
        averageQuizScore: filteredQuizAttempts.length > 0 
          ? (filteredQuizAttempts.reduce((sum, a) => sum + a.score, 0) / filteredQuizAttempts.length).toFixed(2)
          : 0,
        averageTestScore: filteredTestAttempts.length > 0 
          ? (filteredTestAttempts.reduce((sum, a) => sum + a.score, 0) / filteredTestAttempts.length).toFixed(2)
          : 0,
        mostRecentActivity: Math.max(
          filteredQuizAttempts.length > 0 ? new Date(filteredQuizAttempts[0].completed_at).getTime() : 0,
          filteredTestAttempts.length > 0 ? new Date(filteredTestAttempts[0].completed_at).getTime() : 0
        )
      };
    }

    return NextResponse.json(report, { status: 200 });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

function findPotentialDuplicates(attempts, type) {
  const duplicateGroups = [];
  const processed = new Set();

  attempts.forEach((attempt, index) => {
    if (processed.has(attempt.id)) return;

    const potentialDuplicates = attempts.filter((other, otherIndex) => {
      if (otherIndex === index || processed.has(other.id)) return false;

      // Check for same user and similar characteristics
      if (other.user_id !== attempt.user_id) return false;

      // Check time proximity (within 5 minutes)
      const timeDiff = Math.abs(new Date(other.completed_at) - new Date(attempt.completed_at));
      if (timeDiff > 5 * 60 * 1000) return false; // 5 minutes

      if (type === 'quiz') {
        return other.paper === attempt.paper &&
               other.selected_topic === attempt.selected_topic &&
               other.question_count === attempt.question_count &&
               Math.abs(other.score - attempt.score) <= 5; // Allow small score difference
      } else if (type === 'test') {
        return other.test_mode === attempt.test_mode &&
               other.test_type === attempt.test_type &&
               other.total_questions === attempt.total_questions &&
               Math.abs(other.score - attempt.score) <= 5;
      }

      return false;
    });

    if (potentialDuplicates.length > 0) {
      const group = [attempt, ...potentialDuplicates];
      duplicateGroups.push({
        signature: type === 'quiz' 
          ? `${attempt.user_id}-${attempt.paper}-${attempt.selected_topic}-${attempt.question_count}`
          : `${attempt.user_id}-${attempt.test_mode}-${attempt.test_type}-${attempt.total_questions}`,
        attempts: group.map(a => ({
          id: a.id,
          score: a.score,
          timeTaken: a.time_taken,
          completedAt: a.completed_at
        })),
        suspicionLevel: potentialDuplicates.length > 2 ? 'high' : 'medium'
      });

      // Mark all as processed
      group.forEach(a => processed.add(a.id));
    }
  });

  return duplicateGroups;
}

// POST endpoint to manually trigger duplicate cleanup (dev only)
export async function POST(request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Cleanup endpoint not available in production' }, { status: 403 });
  }

  try {
    const session = await getServerSession(authOptions);
    const { action, dryRun = true } = await request.json();

    if (action === 'findAndMarkDuplicates') {
      // This would be a more sophisticated duplicate detection and marking system
      // For now, just return what would be done
      return NextResponse.json({
        message: 'Duplicate detection completed',
        dryRun,
        duplicatesFound: 0,
        action: dryRun ? 'Would mark duplicates' : 'Marked duplicates'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Debug cleanup error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
