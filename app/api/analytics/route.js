// app/api/analytics/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/api/auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Analytics API: Session user:', session.user); // Debug log

    // Get the Google ID from the session - this is the key fix
    const googleId = session.user.googleId;
    
    if (!googleId) {
      console.error('Analytics API: No Google ID found in session');
      return NextResponse.json({ error: 'Google ID not found in session' }, { status: 400 });
    }

    console.log('Analytics API: Using Google ID:', googleId); // Debug log

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Get user's internal ID using Google ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('google_id', googleId)
      .single();

    if (userError || !user) {
      console.error('Analytics API: User not found for Google ID:', googleId, userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Analytics API: Found user with internal ID:', user.id); // Debug log
    const userId = user.id;

    switch (action) {
      case 'stats':
        return await getStats(userId);
      case 'progress':
        return await getProgress(userId);
      case 'achievements':
        return await getAchievements(userId);
      case 'recommendations':
        return await getRecommendations(userId);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getStats(userId) {
  try {
    console.log('getStats: Fetching for user ID:', userId); // Debug log
    
    // Get quiz attempts
    const { data: quizzes, error: quizError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (quizError) {
      console.error('getStats: Quiz error:', quizError);
      throw quizError;
    }

    // Get test attempts
    const { data: tests, error: testError } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (testError) {
      console.error('getStats: Test error:', testError);
      throw testError;
    }

    console.log('getStats: Found', quizzes?.length || 0, 'quizzes and', tests?.length || 0, 'tests'); // Debug log

    // Calculate quiz stats
    const quizStats = {
      totalAttempts: quizzes?.length || 0,
      averageScore: quizzes?.length ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length) : 0,
      bestScore: quizzes?.length ? Math.max(...quizzes.map(q => q.score)) : 0,
      totalTime: quizzes?.reduce((sum, q) => sum + (q.time_taken || 0), 0) || 0,
      recentAttempts: quizzes?.slice(0, 10) || []
    };

    // Calculate test stats
    const testStats = {
      totalAttempts: tests?.length || 0,
      averageScore: tests?.length ? Math.round(tests.reduce((sum, t) => sum + t.score, 0) / tests.length) : 0,
      bestScore: tests?.length ? Math.max(...tests.map(t => t.score)) : 0,
      totalTime: tests?.reduce((sum, t) => sum + (t.time_taken || 0), 0) || 0,
      recentAttempts: tests?.slice(0, 10) || []
    };

    // Calculate overall stats
    const overallStats = {
      totalAttempts: quizStats.totalAttempts + testStats.totalAttempts,
      averageScore: quizStats.totalAttempts + testStats.totalAttempts > 0 
        ? Math.round((quizStats.averageScore + testStats.averageScore) / 2) 
        : 0,
      studyTime: quizStats.totalTime + testStats.totalTime,
      studyStreak: await getStudyStreak(userId)
    };

    return NextResponse.json({
      quizzes: quizStats,
      tests: testStats,
      overall: overallStats
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}

async function getProgress(userId) {
  try {
    console.log('getProgress: Fetching for user ID:', userId); // Debug log
    
    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('accuracy', { ascending: false });

    if (error) {
      console.error('getProgress: Error:', error);
      throw error;
    }

    console.log('getProgress: Found', progress?.length || 0, 'progress records'); // Debug log

    const progressData = progress || [];
    const strongAreas = progressData.filter(p => p.accuracy >= 80);
    const weakAreas = progressData.filter(p => p.accuracy < 60);

    return NextResponse.json({
      totalChapters: progressData.length,
      completedChapters: progressData.filter(p => p.total_questions_attempted >= 3).length,
      strongAreas: strongAreas.slice(0, 5),
      weakAreas: weakAreas.slice(0, 5),
      allProgress: progressData
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    return NextResponse.json({ error: 'Failed to get progress' }, { status: 500 });
  }
}

async function getAchievements(userId) {
  try {
    // Get basic stats for achievement calculation
    const statsResponse = await getStats(userId);
    const stats = await statsResponse.json();

    const achievements = [];

    // First Quiz achievement
    achievements.push({
      id: 'first_quiz',
      name: 'First Quiz',
      description: 'Complete your first quiz',
      earned: stats.quizzes.totalAttempts >= 1,
      progress: Math.min(stats.quizzes.totalAttempts, 1),
      target: 1
    });

    // Study Streak achievement
    achievements.push({
      id: 'study_streak',
      name: 'Study Streak',
      description: '7 days of continuous study',
      earned: stats.overall.studyStreak >= 7,
      progress: Math.min(stats.overall.studyStreak, 7),
      target: 7
    });

    // High Scorer achievement
    const highScoreQuizzes = stats.quizzes.recentAttempts?.filter(quiz => quiz.score >= 80).length || 0;
    achievements.push({
      id: 'high_scorer',
      name: 'High Scorer',
      description: 'Score above 80% in 5 quizzes',
      earned: highScoreQuizzes >= 5,
      progress: Math.min(highScoreQuizzes, 5),
      target: 5
    });

    // Test Master achievement
    achievements.push({
      id: 'test_master',
      name: 'Test Master',
      description: 'Complete 10 full tests',
      earned: stats.tests.totalAttempts >= 10,
      progress: Math.min(stats.tests.totalAttempts, 10),
      target: 10
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error getting achievements:', error);
    return NextResponse.json({ error: 'Failed to get achievements' }, { status: 500 });
  }
}

async function getRecommendations(userId) {
  try {
    const progressResponse = await getProgress(userId);
    const progress = await progressResponse.json();
    
    const recommendations = [];

    // Recommend weak areas for improvement
    if (progress.weakAreas?.length > 0) {
      recommendations.push({
        type: 'improvement',
        priority: 'high',
        title: 'Focus on Weak Areas',
        description: `Practice ${progress.weakAreas[0].chapter} - your accuracy is ${progress.weakAreas[0].accuracy}%`,
        action: 'Take Quiz',
        chapter: progress.weakAreas[0].chapter
      });
    }

    // Recommend review of strong areas
    if (progress.strongAreas?.length > 0) {
      const lastAttempted = progress.strongAreas.find(area => {
        const daysSinceLastAttempt = Math.floor(
          (new Date() - new Date(area.last_practiced)) / (1000 * 60 * 60 * 24)
        );
        return daysSinceLastAttempt > 7;
      });

      if (lastAttempted) {
        recommendations.push({
          type: 'review',
          priority: 'medium',
          title: 'Review Strong Areas',
          description: `Review ${lastAttempted.chapter} - maintain your ${lastAttempted.accuracy}% accuracy`,
          action: 'Take Quiz',
          chapter: lastAttempted.chapter
        });
      }
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}

async function getStudyStreak(userId) {
  try {
    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select('session_date')
      .eq('user_id', userId)
      .order('session_date', { ascending: false });

    if (error) throw error;

    if (!sessions || sessions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sessions) {
      const sessionDate = new Date(session.session_date);
      sessionDate.setHours(0, 0, 0, 0);

      const diffTime = currentDate.getTime() - sessionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating study streak:', error);
    return 0;
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await request.json();

    // Get the Google ID from the session
    const googleId = session.user.googleId;
    
    if (!googleId) {
      console.error('Analytics POST: No Google ID found in session');
      return NextResponse.json({ error: 'Google ID not found in session' }, { status: 400 });
    }

    // Get user's internal ID using Google ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('google_id', googleId)
      .single();

    if (userError || !user) {
      console.error('Analytics POST: User not found for Google ID:', googleId, userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'record_quiz':
        return await recordQuizAttempt(user.id, data);
      case 'record_test':
        return await recordTestAttempt(user.id, data);
      case 'record_session':
        return await recordStudySession(user.id, data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function recordQuizAttempt(userId, quizData) {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        paper: quizData.paper || 'paper1',
        selected_topic: quizData.chapter,
        selected_year: new Date().getFullYear(),
        question_count: quizData.totalQuestions,
        questions_data: quizData.questionsData,
        answers: quizData.questionsData.reduce((acc, q) => {
          acc[q.questionId] = q.selectedOption;
          return acc;
        }, {}),
        correct_answers: quizData.correctAnswers,
        total_questions: quizData.totalQuestions,
        score: quizData.score,
        time_taken: quizData.timeTaken,
        completed_at: new Date().toISOString()
      });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error recording quiz attempt:', error);
    return NextResponse.json({ error: 'Failed to record quiz attempt' }, { status: 500 });
  }
}

async function recordTestAttempt(userId, testData) {
  try {
    const { data, error } = await supabase
      .from('test_attempts')
      .insert({
        user_id: userId,
        test_mode: testData.testType,
        test_type: testData.testType,
        test_config: { type: testData.testType },
        questions_data: testData.questionsData,
        answers: testData.questionsData.reduce((acc, q) => {
          acc[q.questionId] = q.selectedOption;
          return acc;
        }, {}),
        correct_answers: testData.correctAnswers,
        incorrect_answers: testData.totalQuestions - testData.correctAnswers - (testData.unanswered || 0),
        unanswered: testData.unanswered || 0,
        total_questions: testData.totalQuestions,
        score: testData.score,
        time_taken: testData.timeTaken,
        completed_at: new Date().toISOString()
      });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error recording test attempt:', error);
    return NextResponse.json({ error: 'Failed to record test attempt' }, { status: 500 });
  }
}

async function recordStudySession(userId, sessionData) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingSession, error: fetchError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('session_date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingSession) {
      // Update existing session
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          questions_answered: existingSession.questions_answered + (sessionData.questionsAnswered || 0),
          quiz_attempts: existingSession.quiz_attempts + (sessionData.quiz_attempts || 1),
          test_attempts: existingSession.test_attempts + (sessionData.test_attempts || 0),
          time_spent: existingSession.time_spent + (sessionData.duration || 0),
          topics_studied: [...new Set([...existingSession.topics_studied, ...(sessionData.topics_studied || [])])]
        })
        .eq('id', existingSession.id);

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      // Create new session
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: userId,
          session_date: today,
          questions_answered: sessionData.questionsAnswered || 0,
          quiz_attempts: sessionData.quiz_attempts || 1,
          test_attempts: sessionData.test_attempts || 0,
          time_spent: sessionData.duration || 0,
          topics_studied: sessionData.topics_studied || []
        });

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.error('Error recording study session:', error);
    return NextResponse.json({ error: 'Failed to record study session' }, { status: 500 });
  }
}
