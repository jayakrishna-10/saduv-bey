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
      dataToInsert = {
        user_id: userId,
        paper: attemptData.paper,
        selected_topic: attemptData.selectedTopic,
        selected_year: attemptData.selectedYear,
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
        timeTaken: attemptData.timeTaken
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
