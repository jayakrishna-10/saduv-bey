// app/api/qna/route.js - Enhanced with better data validation
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

// Helper function to safely parse JSON
function safeParseJSON(jsonString, fallback = null) {
  if (!jsonString) return fallback;
  if (typeof jsonString === 'object') return jsonString;
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error, 'String:', jsonString);
    return fallback;
  }
}

// Helper function to validate and clean content blocks
function validateContentBlocks(content) {
  if (!Array.isArray(content)) return [];
  
  return content.filter(block => {
    if (!block || typeof block !== 'object') return false;
    if (!block.type) return false;
    return true;
  }).map(block => {
    // Ensure all blocks have required properties
    const cleanBlock = {
      type: String(block.type),
      ...block
    };
    
    // Validate specific block types
    switch (block.type) {
      case 'text':
        if (!cleanBlock.content) cleanBlock.content = '';
        break;
      case 'table':
        if (!cleanBlock.content || typeof cleanBlock.content !== 'object') {
          cleanBlock.content = { headers: [], rows: [] };
        }
        break;
      case 'list':
        if (!cleanBlock.content || !Array.isArray(cleanBlock.content.items)) {
          cleanBlock.content = { type: 'bullet', items: [] };
        }
        break;
      case 'formula':
        if (!cleanBlock.content) cleanBlock.content = '';
        break;
    }
    
    return cleanBlock;
  });
}

// Helper function to validate and clean solution data
function validateSolutionData(solutionData) {
  if (!solutionData) return null;
  
  if (typeof solutionData === 'string') {
    return solutionData;
  }
  
  if (typeof solutionData !== 'object') {
    return null;
  }
  
  const cleanSolution = { ...solutionData };
  
  // Validate explanation structure
  if (cleanSolution.explanation) {
    const explanation = cleanSolution.explanation;
    
    // Validate final_answer
    if (explanation.final_answer && explanation.final_answer.content) {
      explanation.final_answer.content = validateContentBlocks(explanation.final_answer.content);
    }
    
    // Validate step_by_step_solution
    if (Array.isArray(explanation.step_by_step_solution)) {
      explanation.step_by_step_solution = explanation.step_by_step_solution.filter(step => {
        return step && typeof step === 'object' && (step.title || step.content);
      }).map(step => {
        const cleanStep = { ...step };
        if (Array.isArray(cleanStep.content)) {
          cleanStep.content = validateContentBlocks(cleanStep.content);
        }
        return cleanStep;
      });
    }
    
    // Validate solving_approach
    if (explanation.solving_approach && explanation.solving_approach.content) {
      explanation.solving_approach.content = validateContentBlocks(explanation.solving_approach.content);
    }
    
    // Validate verification_check
    if (explanation.verification_check && explanation.verification_check.content) {
      explanation.verification_check.content = validateContentBlocks(explanation.verification_check.content);
    }
    
    // Ensure arrays are actually arrays
    const arrayFields = [
      'prerequisite_knowledge', 
      'formulas_used', 
      'important_concepts', 
      'tips_and_tricks', 
      'common_mistakes'
    ];
    
    arrayFields.forEach(field => {
      if (explanation[field] && !Array.isArray(explanation[field])) {
        explanation[field] = [];
      }
    });
  }
  
  return cleanSolution;
}

// Helper function to validate question data
function validateQuestionData(questionData) {
  if (!questionData) return null;
  
  if (typeof questionData === 'string') {
    return questionData;
  }
  
  if (typeof questionData !== 'object') {
    return null;
  }
  
  const cleanQuestion = { ...questionData };
  
  // Validate content blocks
  if (Array.isArray(cleanQuestion.content)) {
    cleanQuestion.content = validateContentBlocks(cleanQuestion.content);
  }
  
  // Validate sub_questions
  if (Array.isArray(cleanQuestion.sub_questions)) {
    cleanQuestion.sub_questions = cleanQuestion.sub_questions.filter(subQ => {
      return subQ && typeof subQ === 'object';
    }).map(subQ => {
      const cleanSubQ = { ...subQ };
      if (Array.isArray(cleanSubQ.content)) {
        cleanSubQ.content = validateContentBlocks(cleanSubQ.content);
      }
      return cleanSubQ;
    });
  }
  
  return cleanQuestion;
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

    // Transform and validate data to match component expectations
    const transformedData = (data || []).map(question => {
      // Parse JSON fields safely
      const questionData = safeParseJSON(question.question, null);
      const solutionData = safeParseJSON(question.explanation, null);
      
      // Validate and clean the data
      const validatedQuestionData = validateQuestionData(questionData);
      const validatedSolutionData = validateSolutionData(solutionData);
      
      return {
        id: question.id,
        nce_number: question.NCE_number,
        question_number: question.question_number,
        paper: question.paper,
        topic: question.tags,
        difficulty: question.difficulty_level,
        question_data: validatedQuestionData,
        solution_data: validatedSolutionData,
        // Extract additional metadata from question JSONB
        marks: questionData?.marks || '5',
        estimated_time: questionData?.estimated_time || '10-15 mins',
        title: questionData?.title || '',
        question_type: questionData?.type || 'short_answer',
        keywords: questionData?.keywords || []
      };
    }).filter(question => {
      // Filter out questions with invalid data
      return question.question_data !== null && question.solution_data !== null;
    });

    return NextResponse.json({
      questions: transformedData,
      filters,
      pagination: {
        offset,
        limit,
        total: transformedData.length,
        hasMore: data?.length === limit
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
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

    // Parse and validate JSON fields
    const questionData = safeParseJSON(data.question, null);
    const solutionData = safeParseJSON(data.explanation, null);
    
    const validatedQuestionData = validateQuestionData(questionData);
    const validatedSolutionData = validateSolutionData(solutionData);

    // Transform single question data
    const transformedQuestion = {
      id: data.id,
      nce_number: data.NCE_number,
      question_number: data.question_number,
      paper: data.paper,
      topic: data.tags,
      difficulty: data.difficulty_level,
      question_data: validatedQuestionData,
      solution_data: validatedSolutionData,
      marks: questionData?.marks || '5',
      estimated_time: questionData?.estimated_time || '10-15 mins',
      title: questionData?.title || '',
      question_type: questionData?.type || 'short_answer',
      keywords: questionData?.keywords || []
    };

    return NextResponse.json({ question: transformedQuestion });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
