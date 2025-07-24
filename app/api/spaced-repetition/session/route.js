// app/api/spaced-repetition/session/route.js
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

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    const {
      paper,
      sessionType = 'review',
      estimatedQuestions = 20
    } = body;

    console.log(`[SPACED-REPETITION] Creating session for user ${userId}, paper: ${paper}, type: ${sessionType}`);

    // Create a new session record
    const sessionData = {
      user_id: userId,
      paper: paper,
      questions_reviewed: 0,
      correct_answers: 0,
      session_duration: 0,
      average_response_time: null,
      cards_graduated: 0,
      cards_failed: 0,
      session_type: sessionType,
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data: sessionRecord, error: sessionError } = await supabase
      .from('spaced_repetition_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    console.log(`[SPACED-REPETITION] Session created successfully: ${sessionRecord.id}`);

    return NextResponse.json({
      message: 'Session created successfully',
      sessionId: sessionRecord.id,
      session: sessionRecord
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    const {
      sessionId,
      questionsReviewed,
      correctAnswers,
      sessionDuration,
      averageResponseTime,
      cardsGraduated,
      cardsFailed
    } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    console.log(`[SPACED-REPETITION] Updating session ${sessionId} for user ${userId}`);

    // Update the session with final statistics
    const updateData = {
      questions_reviewed: questionsReviewed || 0,
      correct_answers: correctAnswers || 0,
      session_duration: sessionDuration || 0,
      average_response_time: averageResponseTime,
      cards_graduated: cardsGraduated || 0,
      cards_failed: cardsFailed || 0,
      completed_at: new Date().toISOString()
    };

    const { data: updatedSession, error: updateError } = await supabase
      .from('spaced_repetition_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .eq('user_id', userId) // Ensure user can only update their own sessions
      .select()
      .single();

    if (updateError) {
      console.error('Error updating session:', updateError);
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

    if (!updatedSession) {
      return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
    }

    console.log(`[SPACED-REPETITION] Session updated successfully: ${sessionId}`);

    return NextResponse.json({
      message: 'Session updated successfully',
      session: updatedSession
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    const sessionId = searchParams.get('session_id');
    const limit = parseInt(searchParams.get('limit') || '20');
    const paper = searchParams.get('paper');
    const sessionType = searchParams.get('session_type');

    console.log(`[SPACED-REPETITION] Fetching sessions for user ${userId}`);

    if (sessionId) {
      // Fetch specific session
      const { data: sessionData, error: fetchError } = await supabase
        .from('spaced_repetition_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
      }

      if (!sessionData) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json({ session: sessionData });
    }

    // Fetch multiple sessions with filters
    let query = supabase
      .from('spaced_repetition_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (paper) {
      query = query.eq('paper', paper);
    }

    if (sessionType) {
      query = query.eq('session_type', sessionType);
    }

    const { data: sessions, error: sessionsError } = await query;

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    // Calculate session statistics
    const stats = calculateSessionStats(sessions || []);

    console.log(`[SPACED-REPETITION] Fetched ${sessions?.length || 0} sessions for user ${userId}`);

    return NextResponse.json({
      sessions: sessions || [],
      stats,
      count: sessions?.length || 0
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    console.log(`[SPACED-REPETITION] Deleting session ${sessionId} for user ${userId}`);

    // Delete the session
    const { data: deletedSession, error: deleteError } = await supabase
      .from('spaced_repetition_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId) // Ensure user can only delete their own sessions
      .select()
      .single();

    if (deleteError) {
      console.error('Error deleting session:', deleteError);
      return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }

    if (!deletedSession) {
      return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
    }

    console.log(`[SPACED-REPETITION] Session deleted successfully: ${sessionId}`);

    return NextResponse.json({
      message: 'Session deleted successfully',
      sessionId: sessionId
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate session statistics
function calculateSessionStats(sessions) {
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      averageQuestions: 0,
      averageAccuracy: 0,
      averageDuration: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalTime: 0,
      bestAccuracy: 0,
      longestSession: 0,
      recentSessions: 0,
      weeklyAverage: 0
    };
  }

  const totalSessions = sessions.length;
  const totalQuestions = sessions.reduce((sum, s) => sum + s.questions_reviewed, 0);
  const totalCorrect = sessions.reduce((sum, s) => sum + s.correct_answers, 0);
  const totalTime = sessions.reduce((sum, s) => sum + s.session_duration, 0);

  const averageQuestions = totalSessions > 0 ? Math.round(totalQuestions / totalSessions) : 0;
  const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const averageDuration = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;

  // Find best accuracy session
  const bestAccuracy = sessions.reduce((best, session) => {
    const accuracy = session.questions_reviewed > 0 ? 
      (session.correct_answers / session.questions_reviewed) * 100 : 0;
    return Math.max(best, accuracy);
  }, 0);

  // Find longest session
  const longestSession = sessions.reduce((longest, session) => {
    return Math.max(longest, session.session_duration);
  }, 0);

  // Count recent sessions (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentSessions = sessions.filter(session => 
    new Date(session.completed_at) >= weekAgo
  ).length;

  // Calculate weekly average
  const weeklyAverage = recentSessions;

  return {
    totalSessions,
    averageQuestions,
    averageAccuracy,
    averageDuration,
    totalQuestions,
    totalCorrect,
    totalTime,
    bestAccuracy: Math.round(bestAccuracy),
    longestSession,
    recentSessions,
    weeklyAverage
  };
}
