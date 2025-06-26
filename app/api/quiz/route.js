// app/api/quiz/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use SERVICE_ROLE key (server-side only, bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Add this to your env vars
  {
    auth: {
      persistSession: false
    }
  }
);

// Rate limiting storage (in production, use Redis or database)
const rateLimits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10; // Max 10 requests per minute

  const userRequests = rateLimits.get(ip) || [];
  const validRequests = userRequests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return true;
  }
  
  validRequests.push(now);
  rateLimits.set(ip, validRequests);
  return false;
}

export async function GET(request) {
  try {
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' }, 
        { status: 429 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const paper = searchParams.get('paper') || 'paper1';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Max 100 questions per request
    const offset = parseInt(searchParams.get('offset') || '0');
    const topic = searchParams.get('topic');
    const year = searchParams.get('year');

    // Validate paper parameter
    const validPapers = { paper1: 'mcqs_p1', paper2: 'mcqs_p2', paper3: 'mcqs_p3' };
    const tableName = validPapers[paper];
    
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid paper' }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from(tableName)
      .select('id, main_id, question_text, option_a, option_b, option_c, option_d, correct_answer, tag, year')
      .range(offset, offset + limit - 1);

    // Add filters
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

// Optional: Add POST method for getting specific questions
export async function POST(request) {
  try {
    const { questionIds, paper } = await request.json();
    
    if (!questionIds || !Array.isArray(questionIds) || questionIds.length > 10) {
      return NextResponse.json({ error: 'Invalid question IDs' }, { status: 400 });
    }

    const validPapers = { paper1: 'mcqs_p1', paper2: 'mcqs_p2', paper3: 'mcqs_p3' };
    const tableName = validPapers[paper];
    
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid paper' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .in('id', questionIds);

    if (error) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ questions: data });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
