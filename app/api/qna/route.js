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
    const tags = searchParams.get('topic'); // Using tags field for topics
    const difficulty = searchParams.get('difficulty');
    const nceNumber = searchParams.get('year'); // Using NCE_number for year filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query - selecting from the actual schema
    let query = supabase
      .from('questions')
      .select(`
        id,
        "NCE_number",
        question_number,
        paper,
        question,
        explanation,
        tags,
        difficulty_level
      `)
      .range(offset, offset + limit - 1)
      .order('NCE_number', { ascending: false })
      .order('paper', { ascending: true })
      .order('question_number', { ascending: true });

    // Add filters
    if (paper && paper !== 'all') {
      query = query.eq('paper', paper);
    }
    if (tags && tags !== 'all') {
      // Using ilike for partial tag matching
      query = query.ilike('tags', `%${tags}%`);
    }
    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty_level', difficulty);
    }
    if (nceNumber && nceNumber !== 'all') {
      query = query.eq('NCE_number', parseInt(nceNumber));
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Get unique filter values for UI
    const filtersQuery = supabase
      .from('questions')
      .select('paper, tags, difficulty_level, "NCE_number"');

    const { data: filtersData } = await filtersQuery;
    
    // Process filters data
    const filters = {
      papers: [...new Set(filtersData?.map(q => q.paper))].filter(Boolean).sort(),
      topics: [...new Set(filtersData?.flatMap(q => 
        q.tags ? q.tags.split(',').map(tag => tag.trim()) : []
      ))].filter(Boolean).sort(),
      difficulties: [...new Set(filtersData?.map(q => q.difficulty_level))].filter(Boolean).sort(),
      years: [...new Set(filtersData?.map(q => q.NCE_number))].filter(Boolean).sort((a, b) => b - a)
    };

    // Transform data to match component expectations
    const transformedData = data?.map(question => ({
      id: question.id,
      nce_number: question.NCE_number,
      question_number: question.question_number,
      paper: question.paper,
      topic: question.tags,
      difficulty: question.difficulty_level,
      question_data: question.question,
      solution_data: question.explanation,
      // Extract additional metadata from question JSONB
      marks: question.question?.marks || '5',
      estimated_time: question.question?.estimated_time || '10-15 mins',
      title: question.question?.title || '',
      question_type: question.question?.type || 'short_answer',
      keywords: question.question?.keywords || []
    })) || [];

    return NextResponse.json({
      questions: transformedData,
      filters,
      pagination: {
        offset,
        limit,
        total: count,
        hasMore: data?.length === limit
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
      .select(`
        id,
        "NCE_number",
        question_number,
        paper,
        question,
        explanation,
        tags,
        difficulty_level
      `)
      .eq('id', questionId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Transform single question data
    const transformedQuestion = {
      id: data.id,
      nce_number: data.NCE_number,
      question_number: data.question_number,
      paper: data.paper,
      topic: data.tags,
      difficulty: data.difficulty_level,
      question_data: data.question,
      solution_data: data.explanation,
      marks: data.question?.marks || '5',
      estimated_time: data.question?.estimated_time || '10-15 mins',
      title: data.question?.title || '',
      question_type: data.question?.type || 'short_answer',
      keywords: data.question?.keywords || []
    };

    return NextResponse.json({ question: transformedQuestion });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
