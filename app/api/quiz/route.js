// app/api/quiz/route.js
import { createClient } from '@supabase/supabase-js';
import { getCachedData, generateCacheKey, CACHE_DURATION } from '@/lib/cache';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Get lightweight question metadata (IDs, tags, years)
 * This is cached and used for randomization
 */
async function getQuestionMetadata(paper, topic, isAuthenticated) {
  const key = generateCacheKey('question-meta', { paper, topic, isAuthenticated });
  
  return getCachedData(key, async () => {
    const tableMap = {
      paper1: 'mcqs_p1',
      paper2: 'mcqs_p2', 
      paper3: 'mcqs_p3'
    };
    
    const tableName = tableMap[paper];
    if (!tableName) {
      throw new Error('Invalid paper');
    }
    
    let query = supabase
      .from(tableName)
      .select('id, main_id, tag, year');
    
    // Apply authentication-based filters
    if (!isAuthenticated) {
      // Limit to 2023 questions only for non-authenticated users
      query = query.eq('year', 2023);
    }
    
    if (topic && topic !== 'all') {
      // Use exact match for topics to ensure we only get questions from the selected topic
      query = query.eq('tag', topic);
      console.log(`[QUIZ API] Filtering for exact topic: "${topic}"`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    console.log(`[QUIZ API] Found ${data.length} questions for topic: "${topic || 'all'}"`);
    
    // Log year distribution for debugging
    const yearDistribution = {};
    data.forEach(q => {
      yearDistribution[q.year] = (yearDistribution[q.year] || 0) + 1;
    });
    console.log('[QUIZ API] Year distribution:', yearDistribution);
    
    // Return lightweight metadata
    return data.map(q => ({
      id: q.id,
      main_id: q.main_id,
      tag: q.tag,
      year: q.year
    }));
  }, CACHE_DURATION.QUESTION_IDS);
}

/**
 * Fetch specific questions by their IDs
 * This is NOT cached to protect your data
 */
async function getQuestionsByIds(paper, ids) {
  const tableMap = {
    paper1: 'mcqs_p1',
    paper2: 'mcqs_p2', 
    paper3: 'mcqs_p3'
  };
  
  const tableName = tableMap[paper];
  if (!tableName) {
    throw new Error('Invalid paper');
  }
  
  // Fetch questions without explanations first (lighter payload)
  const { data: questions, error } = await supabase
    .from(tableName)
    .select('id, main_id, question_text, option_a, option_b, option_c, option_d, correct_answer, tag, year')
    .in('main_id', ids);
    
  if (error) throw error;
  
  return questions;
}

/**
 * Smart randomization that ensures topic diversity (only when no specific topic is selected)
 * Pure random selection when a specific topic is selected
 */
function smartRandomSelect(questionMetadata, limit, selectedTopic = null) {
  // If a specific topic is selected, just do pure random selection
  if (selectedTopic && selectedTopic !== 'all') {
    console.log(`[QUIZ API] Pure random selection for topic: "${selectedTopic}"`);
    
    // Shuffle the array using Fisher-Yates algorithm for true randomness
    const shuffled = [...questionMetadata];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the requested number of questions
    const selected = shuffled.slice(0, limit);
    
    // Log the selected questions' topics and years for debugging
    console.log('[QUIZ API] Selected questions distribution:');
    const selectedTopics = {};
    const selectedYears = {};
    selected.forEach(q => {
      selectedTopics[q.tag] = (selectedTopics[q.tag] || 0) + 1;
      selectedYears[q.year] = (selectedYears[q.year] || 0) + 1;
    });
    console.log('Topics:', selectedTopics);
    console.log('Years:', selectedYears);
    
    return selected;
  }
  
  // Original smart selection for "all topics" - ensures diversity
  console.log('[QUIZ API] Smart topic-diverse selection for all topics');
  
  // Group by topic
  const byTopic = {};
  questionMetadata.forEach(q => {
    const topic = q.tag || 'Unknown';
    if (!byTopic[topic]) byTopic[topic] = [];
    byTopic[topic].push(q);
  });
  
  const selected = [];
  const topics = Object.keys(byTopic);
  
  // Shuffle topics to ensure randomness in topic selection order
  for (let i = topics.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [topics[i], topics[j]] = [topics[j], topics[i]];
  }
  
  // First pass: Try to get at least one from each topic
  if (topics.length > 1 && limit >= topics.length) {
    topics.forEach(topic => {
      if (selected.length < limit && byTopic[topic].length > 0) {
        const randomIndex = Math.floor(Math.random() * byTopic[topic].length);
        selected.push(byTopic[topic][randomIndex]);
        byTopic[topic].splice(randomIndex, 1);
      }
    });
  }
  
  // Second pass: Fill remaining slots randomly
  const allRemaining = Object.values(byTopic).flat();
  
  // Shuffle the remaining questions for true randomness
  for (let i = allRemaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allRemaining[i], allRemaining[j]] = [allRemaining[j], allRemaining[i]];
  }
  
  // Add remaining questions
  while (selected.length < limit && allRemaining.length > 0) {
    selected.push(allRemaining.shift());
  }
  
  // Final shuffle of selected questions
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }
  
  return selected;
}

export async function GET(request) {
  const startTime = Date.now();
  
  try {
    // Check authentication status
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!(session?.user?.id);
    
    const { searchParams } = new URL(request.url);
    const paper = searchParams.get('paper') || 'paper1';
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100); // Cap at 100
    const topic = searchParams.get('topic');
    
    console.log(`[QUIZ API] Request: paper=${paper}, limit=${limit}, topic="${topic || 'all'}", authenticated=${isAuthenticated}`);
    
    // Step 1: Get all question metadata (cached)
    const metadataFetchStart = Date.now();
    const allQuestionMetadata = await getQuestionMetadata(paper, topic, isAuthenticated);
    console.log(`[QUIZ API] Metadata fetch: ${Date.now() - metadataFetchStart}ms, found ${allQuestionMetadata.length} questions`);
    
    if (allQuestionMetadata.length === 0) {
      return NextResponse.json({
        questions: [],
        meta: {
          total: 0,
          paper: paper,
          topicFilter: topic || 'all',
          loadTime: Date.now() - startTime,
          isAuthenticated,
          yearRestriction: isAuthenticated ? null : 2023
        }
      });
    }
    
    // Step 2: Smart random selection (now with topic awareness)
    const selectionStart = Date.now();
    const selectedMetadata = smartRandomSelect(allQuestionMetadata, limit, topic);
    const selectedIds = selectedMetadata.map(q => q.main_id || q.id);
    console.log(`[QUIZ API] Selection: ${Date.now() - selectionStart}ms, selected ${selectedIds.length} questions`);
    
    // Step 3: Fetch only selected questions (not cached to protect data)
    const questionsFetchStart = Date.now();
    const questions = await getQuestionsByIds(paper, selectedIds);
    console.log(`[QUIZ API] Questions fetch: ${Date.now() - questionsFetchStart}ms`);
    
    // Step 4: Final shuffle for randomized order
    const finalQuestions = questions.sort(() => Math.random() - 0.5);
    
    const totalTime = Date.now() - startTime;
    console.log(`[QUIZ API] Total request time: ${totalTime}ms`);
    
    return NextResponse.json({
      questions: finalQuestions,
      meta: {
        total: finalQuestions.length,
        paper: paper,
        topicFilter: topic || 'all',
        loadTime: totalTime,
        cached: metadataFetchStart - startTime < 50, // Indicates if metadata was cached
        isAuthenticated,
        yearRestriction: isAuthenticated ? null : 2023,
        availableYears: isAuthenticated ? 'all' : [2023]
      }
    });
    
  } catch (error) {
    console.error('[QUIZ API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for fetching explanations
 * Explanations are fetched separately to keep initial load fast
 */
export async function POST(request) {
  try {
    const { questionId, paper } = await request.json();
    
    if (!questionId || !paper) {
      return NextResponse.json(
        { error: 'Question ID and paper required' }, 
        { status: 400 }
      );
    }
    
    // Check authentication for explanations as well
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!(session?.user?.id);
    
    const tableMap = {
      paper1: 'mcqs_p1',
      paper2: 'mcqs_p2', 
      paper3: 'mcqs_p3'
    };
    
    const tableName = tableMap[paper];
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid paper' }, { status: 400 });
    }
    
    // Build query with potential year restriction
    let query = supabase
      .from(tableName)
      .select('explanation, year')
      .eq('main_id', questionId);
    
    // Apply year restriction for non-authenticated users
    if (!isAuthenticated) {
      query = query.eq('year', 2023);
    }
    
    const { data: questionData, error } = await query.single();
    
    if (error) {
      console.error('Error fetching explanation:', error);
      
      // If not found and user is not authenticated, inform them about the restriction
      if (error.code === 'PGRST116' && !isAuthenticated) {
        return NextResponse.json(
          { 
            error: 'Question not available',
            message: 'This question is only available to registered users. Please sign in to access all questions.',
            requiresAuth: true
          }, 
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch explanation' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      explanation: questionData?.explanation || null,
      isAuthenticated,
      yearRestriction: isAuthenticated ? null : 2023
    });
    
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch explanation' }, 
      { status: 500 }
    );
  }
}
