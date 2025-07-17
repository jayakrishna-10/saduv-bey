// app/api/test/route.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paper = searchParams.get('paper') || 'paper1';
    const limit = parseInt(searchParams.get('limit')) || null;
    const topic = searchParams.get('topic');
    const testMode = searchParams.get('testMode');
    const getTopics = searchParams.get('getTopics') === 'true';
    
    console.log('API Test Route - Parameters:', { paper, limit, topic, testMode, getTopics });

    // Get the table name
    const tableMap = {
      paper1: 'mcqs_p1',
      paper2: 'mcqs_p2', 
      paper3: 'mcqs_p3'
    };
    
    const tableName = tableMap[paper];
    if (!tableName) {
      return Response.json({ error: 'Invalid paper' }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from(tableName)
      .select('*');

    // Apply topic filter if specified
    if (topic && topic !== 'all') {
      query = query.ilike('tag', `%${topic}%`);
    }

    // Apply limit
    if (limit && limit > 0) {
      const maxLimit = 1000;
      const effectiveLimit = Math.min(limit, maxLimit);
      query = query.limit(effectiveLimit);
      console.log(`Applied limit: ${effectiveLimit} (requested: ${limit})`);
    } else {
      console.log('No limit applied - fetching all records');
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return Response.json({ error: 'Database query failed' }, { status: 500 });
    }

    console.log(`Fetched ${data?.length || 0} records from ${tableName}`);
    
    // Log distribution for debugging
    if (data && data.length > 0 && !getTopics) {
      const years = [...new Set(data.map(q => q.year))].filter(Boolean).sort();
      const topics = [...new Set(data.map(q => q.tag))].filter(Boolean);
      console.log(`Years found in ${tableName}:`, years);
      console.log(`Topics found in ${tableName}: ${topics.length} unique topics`);
    }

    return Response.json({
      questions: data || [],
      meta: {
        total: data?.length || 0,
        paper: paper,
        table: tableName,
        limitApplied: limit || 'none',
        topicFilter: topic || 'all',
        testMode: testMode || 'practice'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  // Handle explanation requests
  try {
    const { questionId, paper } = await request.json();
    
    if (!questionId) {
      return Response.json({ error: 'Question ID required' }, { status: 400 });
    }

    const tableMap = {
      paper1: 'mcqs_p1',
      paper2: 'mcqs_p2', 
      paper3: 'mcqs_p3'
    };
    
    const tableName = tableMap[paper];
    if (!tableName) {
      return Response.json({ error: 'Invalid paper' }, { status: 400 });
    }

    // Try to fetch existing explanation from database
    const { data: questionData, error } = await supabase
      .from(tableName)
      .select('explanation')
      .eq('main_id', questionId)
      .single();

    if (error) {
      console.error('Error fetching explanation:', error);
    }

    // Return explanation (either from DB or generated)
    return Response.json({ 
      explanation: questionData?.explanation || { 
        explanation: { 
          concept: { 
            title: "Explanation Loading...",
            description: "Detailed explanation will be generated based on the question content."
          } 
        } 
      } 
    });
  } catch (error) {
    console.error('POST Error:', error);
    return Response.json({ error: 'Failed to fetch explanation' }, { status: 500 });
  }
}
