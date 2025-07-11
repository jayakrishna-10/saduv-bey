// app/api/quiz/route.js - Updated to include explanations
import { createClient } from '@supabase/supabase-js';
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
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting (existing code)
    // ... keep your existing rate limiting code

    const { searchParams } = new URL(request.url);
    const paper = searchParams.get('paper') || 'paper1';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const topic = searchParams.get('topic');
    const year = searchParams.get('year');

    const validPapers = { paper1: 'mcqs_p1', paper2: 'mcqs_p2', paper3: 'mcqs_p3' };
    const tableName = validPapers[paper];
    
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid paper' }, { status: 400 });
    }

    // UPDATED: Include explanation column in the select
    let query = supabase
      .from(tableName)
      .select('id, main_id, question_text, option_a, option_b, option_c, option_d, correct_answer, tag, year, explanation')
      .range(offset, offset + limit - 1);

    // Add filters (existing code)
    if (topic && topic !== 'all') {
      query = query.eq('tag', topic);
    }
    if (year && year !== 'all') {
      query = query.eq('year', parseInt(year));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      questions: data,
      pagination: {
        offset,
        limit,
        count: data.length
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// NEW: Separate endpoint for fetching single explanation
export async function POST(request) {
  try {
    const { questionId, paper } = await request.json();
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }

    const validPapers = { paper1: 'mcqs_p1', paper2: 'mcqs_p2', paper3: 'mcqs_p3' };
    const tableName = validPapers[paper] || 'mcqs_p1';

    const { data, error } = await supabase
      .from(tableName)
      .select('explanation')
      .eq('main_id', questionId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Explanation not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      explanation: data.explanation,
      questionId: questionId
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
