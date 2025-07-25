// FILE: app/api/weightages/route.js
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
    // Fetch all weightages from database
    const { data: weightageData, error } = await supabase
      .from('nce_chapter_weightages')
      .select('paper, chapter_name, weightage_percentage')
      .order('paper, chapter_name');

    if (error) {
      console.error('Error fetching weightages:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch weightages',
        weightages: getFallbackWeightages() 
      }, { status: 500 });
    }

    // Organize weightages by paper
    const organizedWeightages = {
      paper1: {},
      paper2: {},
      paper3: {}
    };

    if (weightageData) {
      weightageData.forEach(row => {
        const paper = row.paper?.toLowerCase();
        if (organizedWeightages[paper]) {
          organizedWeightages[paper][row.chapter_name] = row.weightage_percentage || 0;
        }
      });
    }

    // Validate that we have data for all papers
    const hasData = Object.values(organizedWeightages).some(paper => 
      Object.keys(paper).length > 0
    );

    if (!hasData) {
      console.warn('No weightage data found in database, using fallback');
      return NextResponse.json({ 
        weightages: getFallbackWeightages(),
        source: 'fallback',
        message: 'Using fallback weightages - database appears empty'
      });
    }

    return NextResponse.json({ 
      weightages: organizedWeightages,
      source: 'database',
      totalRecords: weightageData.length
    });

  } catch (error) {
    console.error('API error in weightages route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      weightages: getFallbackWeightages(),
      source: 'fallback'
    }, { status: 500 });
  }
}

// Fallback weightages if database is empty or unavailable
function getFallbackWeightages() {
  return {
    paper1: {
      "Company Law": 15,
      "Financial Accounting": 25,
      "Economics": 20,
      "Quantitative Methods": 15,
      "Business Law": 10,
      "Taxation": 15
    },
    paper2: {
      "Advanced Financial Accounting": 30,
      "Cost Accounting": 25,
      "Management Accounting": 20,
      "Auditing": 25
    },
    paper3: {
      "Financial Management": 35,
      "Strategic Management": 25,
      "Corporate Governance": 15,
      "Risk Management": 25
    }
  };
}
