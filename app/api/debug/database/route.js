// FILE: app/api/debug/database/route.js
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
    console.log('=== DATABASE DEBUG ENDPOINT ===');
    
    // Check environment variables
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING'
    };
    
    console.log('Environment variables check:', envCheck);

    // Check session
    const session = await getServerSession(authOptions);
    const sessionCheck = {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id || 'NO_USER_ID',
      userEmail: session?.user?.email || 'NO_EMAIL'
    };
    
    console.log('Session check:', sessionCheck);

    // Test basic Supabase connection
    let connectionTest = {};
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count(*)')
        .limit(1);
      
      connectionTest = {
        success: !error,
        error: error?.message || null,
        canQueryUsers: true
      };
    } catch (err) {
      connectionTest = {
        success: false,
        error: err.message,
        canQueryUsers: false
      };
    }
    
    console.log('Connection test:', connectionTest);

    // Test quiz_attempts table structure
    let quizTableTest = {};
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .limit(1);
      
      quizTableTest = {
        exists: !error,
        error: error?.message || null,
        sampleRecord: data?.[0] || null,
        recordCount: data?.length || 0
      };
    } catch (err) {
      quizTableTest = {
        exists: false,
        error: err.message,
        sampleRecord: null
      };
    }
    
    console.log('Quiz table test:', quizTableTest);

    // Test test_attempts table structure
    let testTableTest = {};
    try {
      const { data, error } = await supabase
        .from('test_attempts')
        .select('*')
        .limit(1);
      
      testTableTest = {
        exists: !error,
        error: error?.message || null,
        sampleRecord: data?.[0] || null,
        recordCount: data?.length || 0
      };
    } catch (err) {
      testTableTest = {
        exists: false,
        error: err.message,
        sampleRecord: null
      };
    }
    
    console.log('Test table test:', testTableTest);

    // If we have a user, try to query their specific data
    let userDataTest = {};
    if (session?.user?.id) {
      try {
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', session.user.id)
          .limit(5);

        const { data: testData, error: testError } = await supabase
          .from('test_attempts')
          .select('*')
          .eq('user_id', session.user.id)
          .limit(5);

        userDataTest = {
          quizAttempts: {
            count: quizData?.length || 0,
            error: quizError?.message || null,
            sampleData: quizData?.[0] || null
          },
          testAttempts: {
            count: testData?.length || 0,
            error: testError?.message || null,
            sampleData: testData?.[0] || null
          }
        };
      } catch (err) {
        userDataTest = {
          error: err.message
        };
      }
    }
    
    console.log('User data test:', userDataTest);

    // Test insertion capability (dry run)
    let insertionTest = {};
    if (session?.user?.id) {
      try {
        // Test with minimal data that should work
        const testData = {
          user_id: session.user.id,
          paper: 'paper1',
          selected_topic: 'test',
          selected_year: 2024,
          question_count: 1,
          questions_data: [],
          answers: [],
          correct_answers: 0,
          total_questions: 0,
          score: 0,
          time_taken: 0
        };

        // Actually try to insert (we'll delete it right after)
        const { data, error } = await supabase
          .from('quiz_attempts')
          .insert(testData)
          .select()
          .single();

        if (!error && data) {
          // Clean up the test record
          await supabase
            .from('quiz_attempts')
            .delete()
            .eq('id', data.id);

          insertionTest = {
            canInsert: true,
            testRecordId: data.id,
            cleanedUp: true
          };
        } else {
          insertionTest = {
            canInsert: false,
            error: error?.message || 'Unknown error',
            errorCode: error?.code,
            errorDetails: error?.details
          };
        }
      } catch (err) {
        insertionTest = {
          canInsert: false,
          error: err.message,
          stack: err.stack
        };
      }
    }
    
    console.log('Insertion test:', insertionTest);

    const result = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      session: sessionCheck,
      connection: connectionTest,
      tables: {
        quiz_attempts: quizTableTest,
        test_attempts: testTableTest
      },
      userData: userDataTest,
      insertion: insertionTest,
      recommendations: []
    };

    // Add recommendations based on test results
    if (!envCheck.NEXT_PUBLIC_SUPABASE_URL) {
      result.recommendations.push('CRITICAL: NEXT_PUBLIC_SUPABASE_URL environment variable is missing');
    }
    if (!envCheck.SUPABASE_SERVICE_ROLE_KEY) {
      result.recommendations.push('CRITICAL: SUPABASE_SERVICE_ROLE_KEY environment variable is missing');
    }
    if (!connectionTest.success) {
      result.recommendations.push('CRITICAL: Cannot connect to Supabase database');
    }
    if (!sessionCheck.hasSession) {
      result.recommendations.push('WARNING: No active session - user must be logged in to save progress');
    }
    if (!sessionCheck.hasUserId) {
      result.recommendations.push('CRITICAL: Session exists but no user ID - check auth configuration');
    }
    if (!quizTableTest.exists) {
      result.recommendations.push('CRITICAL: quiz_attempts table does not exist or is not accessible');
    }
    if (!testTableTest.exists) {
      result.recommendations.push('CRITICAL: test_attempts table does not exist or is not accessible');
    }
    if (insertionTest.error) {
      result.recommendations.push(`CRITICAL: Cannot insert data - ${insertionTest.error}`);
    }

    console.log('Final result:', result);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Database debug endpoint error:', error);
    return NextResponse.json({
      error: 'Database debug endpoint failed',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
