// app/api/qna/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use SERVICE_ROLE key (server-side only, bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

// Rate limiting storage
const rateLimits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 20; // Max 20 requests per minute

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
    const paper = searchParams.get('paper');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');
    const year = searchParams.get('year');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('questions')
      .select(`
        id,
        nce_number,
        nce_year,
        paper,
        question_code,
        marks,
        title,
        topic,
        subtopic,
        difficulty,
        estimated_time,
        question_type,
        question_data,
        solution_data,
        status
      `)
      .eq('status', 'published')
      .range(offset, offset + limit - 1)
      .order('nce_year', { ascending: false })
      .order('paper', { ascending: true })
      .order('question_code', { ascending: true });

    // Add filters
    if (paper && paper !== 'all') {
      query = query.eq('paper', paper);
    }
    if (topic && topic !== 'all') {
      query = query.eq('topic', topic);
    }
    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty', difficulty);
    }
    if (year && year !== 'all') {
      query = query.eq('nce_year', parseInt(year));
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Get unique filter values for UI
    const filtersQuery = supabase
      .from('questions')
      .select('paper, topic, difficulty, nce_year')
      .eq('status', 'published');

    const { data: filtersData } = await filtersQuery;
    
    const filters = {
      papers: [...new Set(filtersData?.map(q => q.paper))].sort(),
      topics: [...new Set(filtersData?.map(q => q.topic))].filter(Boolean).sort(),
      difficulties: [...new Set(filtersData?.map(q => q.difficulty))].filter(Boolean).sort(),
      years: [...new Set(filtersData?.map(q => q.nce_year))].sort((a, b) => b - a)
    };

    return NextResponse.json({
      questions: data,
      filters,
      pagination: {
        offset,
        limit,
        total: count,
        hasMore: data.length === limit
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get specific question by ID
export async function POST(request) {
  try {
    const { questionId } = await request.json();
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ question: data });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
