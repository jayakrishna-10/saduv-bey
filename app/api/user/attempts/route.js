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

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json();
  const { type, attemptData } = body;

  if (!type || !attemptData) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

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
  } else {
    return NextResponse.json({ error: 'Invalid attempt type' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error(`Error inserting ${type} attempt:`, error);
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: `${type} attempt saved successfully`, data }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const { data: quizAttempts, error: quizError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        if (quizError) {
            console.error('Error fetching quiz attempts:', quizError);
            return NextResponse.json({ error: 'Failed to fetch quiz attempts' }, { status: 500 });
        }

        const { data: testAttempts, error: testError } = await supabase
            .from('test_attempts')
            .select('*')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });
            
        if (testError) {
            console.error('Error fetching test attempts:', testError);
            return NextResponse.json({ error: 'Failed to fetch test attempts' }, { status: 500 });
        }

        return NextResponse.json({ quizAttempts, testAttempts }, { status: 200 });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
