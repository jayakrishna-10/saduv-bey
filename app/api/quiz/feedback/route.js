// app/api/quiz/feedback/route.js
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
  try {
    // Get session if available (optional for feedback)
    const session = await getServerSession(authOptions);
    
    // Parse request body
    const body = await request.json();
    const {
      questionId,
      questionText,
      paper,
      feedbackType,
      feedbackText,
      contactEmail,
      userId
    } = body;
    
    // Validate required fields
    if (!questionId || !feedbackText || !paper) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Prepare feedback data
    const feedbackData = {
      question_id: questionId,
      question_text: questionText,
      paper: paper,
      feedback_type: feedbackType || 'issue',
      feedback_text: feedbackText,
      contact_email: contactEmail || (session?.user?.email || null),
      user_id: userId || (session?.user?.id || null),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    // Insert feedback into database
    const { data, error } = await supabase
      .from('quiz_feedback')
      .insert(feedbackData)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving feedback:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Feedback submitted successfully',
      id: data.id
    }, { status: 201 });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch feedback (for admin use)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow authenticated users to view feedback
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const paper = searchParams.get('paper');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query = supabase
      .from('quiz_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (paper) {
      query = query.eq('paper', paper);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching feedback:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ feedback: data || [] });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
