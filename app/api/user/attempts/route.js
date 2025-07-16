// FILE: app/api/user/attempts/route.js
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

// Enhanced logging function
function logWithTimestamp(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }
}

// Helper function to normalize chapter names
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

// Helper function to update chapter performance
async function updateChapterPerformance(userId, attemptData, type) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const chapterStats = {};
    
    // Aggregate chapter performance from the attempt
    if (type === 'quiz') {
      attemptData.questionsData.forEach((question, index) => {
        const chapter = normalizeChapterName(question.tag);
        const paper = attemptData.paper;
        const key = `${paper}-${chapter}`;
        
        if (!chapterStats[key]) {
          chapterStats[key] = {
            paper,
            chapter,
            attempted: 0,
            correct: 0,
            timeSpent: 0
          };
        }
        
        chapterStats[key].attempted++;
        
        // Check if answer was correct
        const userAnswer = attemptData.answers.find(a => a.questionId === (question.main_id || question.id));
        if (userAnswer && userAnswer.isCorrect) {
          chapterStats[key].correct++;
        }
      });
    } else if (type === 'test') {
      attemptData.questionsData.forEach((question, index) => {
        const chapter = normalizeChapterName(question.tag);
        const paper = attemptData.testType.startsWith('paper') ? attemptData.testType : 'mixed';
        const key = `${paper}-${chapter}`;
        
        if (!chapterStats[key]) {
          chapterStats[key] = {
            paper,
            chapter,
            attempted: 0,
            correct: 0,
            timeSpent: 0
          };
        }
        
        chapterStats[key].attempted++;
        
        // Check if answer was correct
        const userAnswer = attemptData.answers[index];
        if (userAnswer && userAnswer === question.correct_answer) {
          chapterStats[key].correct++;
        }
      });
    }
    
    // Calculate time spent per chapter (distribute total time proportionally)
    const totalQuestions = type === 'quiz' ? attemptData.totalQuestions : attemptData.questionsData.length;
    const timePerQuestion = attemptData.timeTaken / totalQuestions;
    
    // Update daily_chapter_performance table
    for (const [key, stats] of Object.entries(chapterStats)) {
      const accuracy = stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0;
      const timeSpent = Math.round(stats.attempted * timePerQuestion);
      
      // Check if record exists
      const { data: existing } = await supabase
        .from('daily_chapter_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('paper', stats.paper)
        .eq('chapter_name', stats.chapter)
        .single();
      
      if (existing) {
        // Update existing record
        await supabase
          .from('daily_chapter_performance')
          .update({
            questions_attempted: existing.questions_attempted + stats.attempted,
            correct_answers: existing.correct_answers + stats.correct,
            accuracy: ((existing.correct_answers + stats.correct) / (existing.questions_attempted + stats.attempted)) * 100,
            time_spent: existing.time_spent + timeSpent,
            source_type: type
          })
          .eq('id', existing.id);
      } else {
        // Insert new record
        await supabase
          .from('daily_chapter_performance')
          .insert({
            user_id: userId,
            date: today,
            paper: stats.paper,
            chapter_name: stats.chapter,
            questions_attempted: stats.attempted,
            correct_answers: stats.correct,
            accuracy: accuracy,
            time_spent: timeSpent,
            source_type: type
          });
      }
      
      // Update user_progress table
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter', stats.chapter)
        .eq('paper', stats.paper)
        .single();
      
      if (progress) {
        const newTotal = progress.total_questions_attempted + stats.attempted;
        const newCorrect = progress.correct_answers + stats.correct;
        const newAccuracy = (newCorrect / newTotal) * 100;
        
        await supabase
          .from('user_progress')
          .update({
            total_questions_attempted: newTotal,
            correct_answers: newCorrect,
            accuracy: newAccuracy,
            last_practiced: new Date().toISOString()
          })
          .eq('id', progress.id);
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: userId,
            chapter: stats.chapter,
            paper: stats.paper,
            total_questions_attempted: stats.attempted,
            correct_answers: stats.correct,
            accuracy: accuracy,
            last_practiced: new Date().toISOString()
          });
      }
    }
    
    // Update study_sessions
    const { data: session } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('session_date', today)
      .single();
    
    const uniqueChapters = [...new Set(Object.values(chapterStats).map(s => s.chapter))];
    const avgAccuracy = Object.values(chapterStats).reduce((sum, s) => 
      sum + (s.attempted > 0 ? (s.correct / s.attempted) * 100 : 0), 0
    ) / Object.keys(chapterStats).length;
    
    if (session) {
      await supabase
        .from('study_sessions')
        .update({
          questions_answered: session.questions_answered + totalQuestions,
          quiz_attempts: type === 'quiz' ? session.quiz_attempts + 1 : session.quiz_attempts,
          test_attempts: type === 'test' ? session.test_attempts + 1 : session.test_attempts,
          time_spent: session.time_spent + attemptData.timeTaken,
          topics_studied: [...new Set([...session.topics_studied, ...uniqueChapters])],
          average_accuracy: ((session.average_accuracy * session.questions_answered + avgAccuracy * totalQuestions) / (session.questions_answered + totalQuestions)),
          unique_chapters_studied: [...new Set([...session.topics_studied, ...uniqueChapters])].length,
          [type === 'quiz' ? 'quiz_accuracy' : 'test_accuracy']: avgAccuracy
        })
        .eq('id', session.id);
    } else {
      await supabase
        .from('study_sessions')
        .insert({
          user_id: userId,
          session_date: today,
          questions_answered: totalQuestions,
          quiz_attempts: type === 'quiz' ? 1 : 0,
          test_attempts: type === 'test' ? 1 : 0,
          time_spent: attemptData.timeTaken,
          topics_studied: uniqueChapters,
          average_accuracy: avgAccuracy,
          unique_chapters_studied: uniqueChapters.length,
          quiz_accuracy: type === 'quiz' ? avgAccuracy : 0,
          test_accuracy: type === 'test' ? avgAccuracy : 0
        });
    }
    
    logWithTimestamp('info', 'Chapter performance updated successfully');
  } catch (error) {
    logWithTimestamp('error', 'Error updating chapter performance:', error);
  }
}

// Helper function to update learning analytics
async function updateLearningAnalytics(userId) {
  try {
    // Get overall statistics
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (!progress || progress.length === 0) return;
    
    const totalAttempted = progress.reduce((sum, p) => sum + p.total_questions_attempted, 0);
    const totalCorrect = progress.reduce((sum, p) => sum + p.correct_answers, 0);
    const overallAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    
    // Find strongest and weakest chapters
    const sortedByAccuracy = progress.sort((a, b) => b.accuracy - a.accuracy);
    const strongestChapter = sortedByAccuracy[0]?.chapter || null;
    const weakestChapter = sortedByAccuracy[sortedByAccuracy.length - 1]?.chapter || null;
    
    // Calculate predicted scores using the database function
    const { data: predictedScores } = await supabase
      .rpc('calculate_predicted_scores', { p_user_id: userId });
    
    const paper1Score = predictedScores?.find(s => s.paper === 'paper1')?.predicted_score || 0;
    const paper2Score = predictedScores?.find(s => s.paper === 'paper2')?.predicted_score || 0;
    const paper3Score = predictedScores?.find(s => s.paper === 'paper3')?.predicted_score || 0;
    const totalScore = paper1Score + paper2Score + paper3Score;
    
    // Check if analytics record exists
    const { data: existing } = await supabase
      .from('user_learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    const analyticsData = {
      total_questions_attempted: totalAttempted,
      total_correct_answers: totalCorrect,
      overall_accuracy: overallAccuracy,
      predicted_paper1_score: paper1Score,
      predicted_paper2_score: paper2Score,
      predicted_paper3_score: paper3Score,
      predicted_total_score: totalScore,
      strongest_chapter: strongestChapter,
      weakest_chapter: weakestChapter,
      last_calculated: new Date().toISOString()
    };
    
    if (existing) {
      await supabase
        .from('user_learning_analytics')
        .update(analyticsData)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('user_learning_analytics')
        .insert({ user_id: userId, ...analyticsData });
    }
    
    logWithTimestamp('info', 'Learning analytics updated successfully');
  } catch (error) {
    logWithTimestamp('error', 'Error updating learning analytics:', error);
  }
}

export async function POST(request) {
  logWithTimestamp('info', '=== STARTING POST REQUEST ===');
  
  try {
    // Step 1: Get and validate session
    logWithTimestamp('info', 'Attempting to get server session...');
    const session = await getServerSession(authOptions);
    
    logWithTimestamp('info', 'Session retrieved:', {
      exists: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id || 'NO_USER_ID',
      userEmail: session?.user?.email || 'NO_EMAIL'
    });

    if (!session) {
      logWithTimestamp('error', 'No session found');
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    if (!session.user) {
      logWithTimestamp('error', 'No user in session');
      return NextResponse.json({ error: 'No user in session' }, { status: 401 });
    }

    if (!session.user.id) {
      logWithTimestamp('error', 'No user ID in session');
      return NextResponse.json({ error: 'No user ID in session' }, { status: 401 });
    }

    const userId = session.user.id;
    logWithTimestamp('info', 'Valid user ID obtained:', userId);

    // Step 2: Parse and validate request body
    logWithTimestamp('info', 'Parsing request body...');
    let body;
    try {
      body = await request.json();
      logWithTimestamp('info', 'Request body parsed successfully:', {
        hasType: !!body.type,
        type: body.type,
        hasAttemptData: !!body.attemptData,
        attemptDataKeys: body.attemptData ? Object.keys(body.attemptData) : []
      });
    } catch (parseError) {
      logWithTimestamp('error', 'Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { type, attemptData } = body;

    if (!type) {
      logWithTimestamp('error', 'Missing type in request');
      return NextResponse.json({ error: 'Missing type field' }, { status: 400 });
    }

    if (!attemptData) {
      logWithTimestamp('error', 'Missing attemptData in request');
      return NextResponse.json({ error: 'Missing attemptData field' }, { status: 400 });
    }

    // Step 3: Validate environment variables
    logWithTimestamp('info', 'Validating environment variables:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
    });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logWithTimestamp('error', 'Missing Supabase environment variables');
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
    }

    // Step 4: Prepare data based on type
    let tableName;
    let dataToInsert;

    if (type === 'quiz') {
      tableName = 'quiz_attempts';
      
      // Convert "all" values to null and handle data type conversions
      const selectedTopic = attemptData.selectedTopic === 'all' ? null : attemptData.selectedTopic;
      let selectedYear = null;
      
      if (attemptData.selectedYear && attemptData.selectedYear !== 'all') {
        const yearNum = parseInt(attemptData.selectedYear);
        if (!isNaN(yearNum)) {
          selectedYear = yearNum;
        } else {
          logWithTimestamp('warn', 'Invalid year value, setting to null:', attemptData.selectedYear);
        }
      }
      
      dataToInsert = {
        user_id: userId,
        paper: attemptData.paper,
        selected_topic: selectedTopic,
        selected_year: selectedYear,
        question_count: attemptData.questionCount,
        questions_data: attemptData.questionsData,
        answers: attemptData.answers,
        correct_answers: attemptData.correctAnswers,
        total_questions: attemptData.totalQuestions,
        score: attemptData.score,
        time_taken: attemptData.timeTaken,
      };
      
      logWithTimestamp('info', 'Prepared quiz data for insertion:', {
        tableName,
        userId,
        paper: attemptData.paper,
        originalSelectedTopic: attemptData.selectedTopic,
        convertedSelectedTopic: selectedTopic,
        originalSelectedYear: attemptData.selectedYear,
        convertedSelectedYear: selectedYear,
        questionCount: attemptData.questionCount,
        totalQuestions: attemptData.totalQuestions,
        score: attemptData.score,
        timeTaken: attemptData.timeTaken,
        questionsDataLength: attemptData.questionsData?.length || 0,
        answersLength: attemptData.answers?.length || 0
      });

    } else if (type === 'test') {
      tableName = 'test_attempts';
      dataToInsert = {
        user_id: userId,
        test_mode: attemptData.testMode,
        test_type: attemptData.testType,
        test_config: attemptData.testConfig,
        questions_data: attemptData.questionsData,
        answers: attemptData.answers,
        flagged_questions: attemptData.flaggedQuestions,
        correct_answers: attemptData.correct,
        incorrect_answers: attemptData.incorrect,
        unanswered: attemptData.unanswered,
        total_questions: attemptData.totalQuestions,
        score: attemptData.score,
        time_taken: attemptData.timeTaken,
        time_limit: attemptData.timeLimit,
      };

      logWithTimestamp('info', 'Prepared test data for insertion:', {
        tableName,
        userId,
        testMode: attemptData.testMode,
        testType: attemptData.testType,
        totalQuestions: attemptData.totalQuestions,
        score: attemptData.score,
        timeTaken: attemptData.timeTaken,
        timeLimit: attemptData.timeLimit
      });

    } else {
      logWithTimestamp('error', 'Invalid attempt type:', type);
      return NextResponse.json({ error: `Invalid attempt type: ${type}` }, { status: 400 });
    }

    // Step 5: Validate data before insertion
    logWithTimestamp('info', 'Validating data before insertion...');
    
    if (!dataToInsert.user_id) {
      logWithTimestamp('error', 'User ID missing in data to insert');
      return NextResponse.json({ error: 'User ID validation failed' }, { status: 400 });
    }

    // Step 6: Attempt database insertion
    logWithTimestamp('info', 'Attempting database insertion...', {
      tableName,
      dataKeys: Object.keys(dataToInsert),
      dataToInsertPreview: {
        user_id: dataToInsert.user_id,
        total_questions: dataToInsert.total_questions,
        score: dataToInsert.score
      }
    });

    const { data, error } = await supabase
      .from(tableName)
      .insert(dataToInsert)
      .select()
      .single();

    // Step 7: Handle database response
    if (error) {
      logWithTimestamp('error', 'Database insertion error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        tableName
      });
      
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }

    if (!data) {
      logWithTimestamp('error', 'No data returned from successful insertion');
      return NextResponse.json({ error: 'No data returned from database' }, { status: 500 });
    }

    logWithTimestamp('info', 'Database insertion successful:', {
      insertedId: data.id,
      tableName,
      userId: data.user_id
    });
    
    // Step 8: Update chapter performance and analytics
    await updateChapterPerformance(userId, attemptData, type);
    await updateLearningAnalytics(userId);

    return NextResponse.json({ 
      message: `${type} attempt saved successfully`, 
      data: data,
      debug: {
        userId,
        tableName,
        insertedAt: new Date().toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    logWithTimestamp('error', 'Unexpected API error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request) {
  logWithTimestamp('info', '=== STARTING GET REQUEST ===');
  
  try {
    const session = await getServerSession(authOptions);

    logWithTimestamp('info', 'Session for GET request:', {
      exists: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id || 'NO_USER_ID'
    });

    if (!session || !session.user || !session.user.id) {
      logWithTimestamp('error', 'Unauthorized GET request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    logWithTimestamp('info', 'Fetching attempts for user:', userId);

    // Fetch quiz attempts
    const { data: quizAttempts, error: quizError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (quizError) {
      logWithTimestamp('error', 'Error fetching quiz attempts:', quizError);
      return NextResponse.json({ error: 'Failed to fetch quiz attempts' }, { status: 500 });
    }

    // Fetch test attempts
    const { data: testAttempts, error: testError } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
      
    if (testError) {
      logWithTimestamp('error', 'Error fetching test attempts:', testError);
      return NextResponse.json({ error: 'Failed to fetch test attempts' }, { status: 500 });
    }

    logWithTimestamp('info', 'Successfully fetched attempts:', {
      quizCount: quizAttempts?.length || 0,
      testCount: testAttempts?.length || 0
    });

    return NextResponse.json({ 
      quizAttempts: quizAttempts || [], 
      testAttempts: testAttempts || []
    }, { status: 200 });

  } catch (error) {
    logWithTimestamp('error', 'GET request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
