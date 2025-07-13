// app/api/revision-notes/route.js
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
    const { searchParams } = new URL(request.url);
    const paper = searchParams.get('paper');
    const chapter = searchParams.get('chapter');
    const chapterNo = searchParams.get('chapterNo');

    let query = supabase
      .from('revision_notes')
      .select('*')
      .order('paper_no', { ascending: true })
      .order('chapter_no', { ascending: true });

    // Filter by paper if specified
    if (paper && paper !== 'all') {
      query = query.eq('paper_no', parseInt(paper));
    }

    // Filter by chapter if specified
    if (chapter && chapter !== 'all') {
      query = query.eq('chapter_name', chapter);
    }

    // Filter by chapter number if specified
    if (chapterNo && chapterNo !== 'all') {
      query = query.eq('chapter_no', parseInt(chapterNo));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Transform data to include parsed notes
    const processedData = data.map(item => ({
      ...item,
      notes: typeof item.notes === 'string' ? JSON.parse(item.notes) : item.notes
    }));

    return NextResponse.json({
      revisionNotes: processedData,
      count: processedData.length
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get specific chapter by paper and chapter number
export async function POST(request) {
  try {
    const { paperNo, chapterNo } = await request.json();
    
    if (!paperNo || !chapterNo) {
      return NextResponse.json({ error: 'Paper number and chapter number required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('revision_notes')
      .select('*')
      .eq('paper_no', paperNo)
      .eq('chapter_no', chapterNo)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Revision notes not found' }, { status: 404 });
    }

    // Parse notes if they're stored as string
    const processedData = {
      ...data,
      notes: typeof data.notes === 'string' ? JSON.parse(data.notes) : data.notes
    };

    return NextResponse.json({
      revisionNotes: processedData
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
