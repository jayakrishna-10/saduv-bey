// app/api/topics/route.js
import { createClient } from '@supabase/supabase-js';
import { getCachedData, generateCacheKey, CACHE_DURATION } from '@/lib/cache';
import { NextResponse } from 'next/server';

// Enable edge runtime for better performance
export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Normalize topic names for consistency
 */
function normalizeTopicName(topic) {
  if (!topic) return '';
  return topic
    .replace(/['"]/g, '')
    .trim()
    .replace(/Act,?\s+(\d{4})/g, 'Act $1')
    .replace(/\s+/g, ' ')
    .replace(/\s+and\s+/g, ' and ')
    .replace(/^Chapter\s+/i, '')
    .replace(/^chapter_/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET(request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const paper = searchParams.get('paper');
    
    if (!paper) {
      // Return topics for all papers
      const allTopics = await getAllPapersTopics();
      return NextResponse.json({ 
        topics: allTopics,
        loadTime: Date.now() - startTime
      });
    }
    
    // Get topics for specific paper
    const key = generateCacheKey('topics', { paper });
    
    const topics = await getCachedData(key, async () => {
      const tableMap = {
        paper1: 'mcqs_p1',
        paper2: 'mcqs_p2', 
        paper3: 'mcqs_p3'
      };
      
      const tableName = tableMap[paper];
      if (!tableName) {
        throw new Error('Invalid paper');
      }
      
      console.log(`[TOPICS API] Fetching topics for ${paper}`);
      
      // Fetch only the tag column
      const { data, error } = await supabase
        .from(tableName)
        .select('tag');
        
      if (error) throw error;
      
      // Extract and normalize unique topics
      const topicsSet = new Set();
      data.forEach(item => {
        if (item.tag) {
          const normalized = normalizeTopicName(item.tag);
          if (normalized) {
            topicsSet.add(normalized);
          }
        }
      });
      
      const uniqueTopics = Array.from(topicsSet).sort();
      console.log(`[TOPICS API] Found ${uniqueTopics.length} unique topics for ${paper}`);
      
      return uniqueTopics;
    }, CACHE_DURATION.TOPICS);
    
    const totalTime = Date.now() - startTime;
    console.log(`[TOPICS API] Request completed in ${totalTime}ms`);
    
    return NextResponse.json({ 
      topics,
      paper,
      loadTime: totalTime
    });
    
  } catch (error) {
    console.error('[TOPICS API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics', message: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * Get topics for all papers at once (for prefetching)
 */
async function getAllPapersTopics() {
  const key = generateCacheKey('all-topics', {});
  
  return getCachedData(key, async () => {
    const papers = ['paper1', 'paper2', 'paper3'];
    const allTopics = {};
    
    await Promise.all(papers.map(async (paper) => {
      const tableMap = {
        paper1: 'mcqs_p1',
        paper2: 'mcqs_p2', 
        paper3: 'mcqs_p3'
      };
      
      const { data, error } = await supabase
        .from(tableMap[paper])
        .select('tag');
        
      if (!error && data) {
        const topicsSet = new Set();
        data.forEach(item => {
          if (item.tag) {
            const normalized = normalizeTopicName(item.tag);
            if (normalized) {
              topicsSet.add(normalized);
            }
          }
        });
        
        allTopics[paper] = Array.from(topicsSet).sort();
      }
    }));
    
    return allTopics;
  }, CACHE_DURATION.TOPICS);
}
