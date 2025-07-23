// app/api/topics/route.js
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
    // Check authentication status
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!(session?.user?.id);
    
    const { searchParams } = new URL(request.url);
    const paper = searchParams.get('paper');
    
    console.log(`[TOPICS API] Request for paper=${paper}, authenticated=${isAuthenticated}`);
    
    if (!paper) {
      // Return topics for all papers
      const allTopics = await getAllPapersTopics(isAuthenticated);
      return NextResponse.json({ 
        topics: allTopics,
        loadTime: Date.now() - startTime,
        isAuthenticated,
        yearRestriction: isAuthenticated ? null : 2023
      });
    }
    
    // Get topics for specific paper
    const key = generateCacheKey('topics', { paper, isAuthenticated });
    
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
      
      console.log(`[TOPICS API] Fetching topics for ${paper}, authenticated=${isAuthenticated}`);
      
      // Build query with potential year restriction
      let query = supabase.from(tableName).select('tag, year');
      
      // Apply year restriction for non-authenticated users
      if (!isAuthenticated) {
        query = query.eq('year', 2023);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      console.log(`[TOPICS API] Raw data count: ${data.length}`);
      
      // Extract and normalize unique topics
      const topicsSet = new Set();
      const topicCounts = {};
      
      data.forEach(item => {
        if (item.tag) {
          const normalized = normalizeTopicName(item.tag);
          if (normalized) {
            topicsSet.add(normalized);
            topicCounts[normalized] = (topicCounts[normalized] || 0) + 1;
          }
        }
      });
      
      const uniqueTopics = Array.from(topicsSet).sort();
      
      // Log topic distribution for debugging
      console.log(`[TOPICS API] Found ${uniqueTopics.length} unique topics for ${paper} (auth: ${isAuthenticated})`);
      console.log('[TOPICS API] Topic counts:', topicCounts);
      
      return uniqueTopics;
    }, CACHE_DURATION.TOPICS);
    
    const totalTime = Date.now() - startTime;
    console.log(`[TOPICS API] Request completed in ${totalTime}ms`);
    
    return NextResponse.json({ 
      topics,
      paper,
      loadTime: totalTime,
      isAuthenticated,
      yearRestriction: isAuthenticated ? null : 2023
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
async function getAllPapersTopics(isAuthenticated) {
  const key = generateCacheKey('all-topics', { isAuthenticated });
  
  return getCachedData(key, async () => {
    const papers = ['paper1', 'paper2', 'paper3'];
    const allTopics = {};
    
    await Promise.all(papers.map(async (paper) => {
      const tableMap = {
        paper1: 'mcqs_p1',
        paper2: 'mcqs_p2', 
        paper3: 'mcqs_p3'
      };
      
      let query = supabase.from(tableMap[paper]).select('tag, year');
      
      // Apply year restriction for non-authenticated users
      if (!isAuthenticated) {
        query = query.eq('year', 2023);
      }
      
      const { data, error } = await query;
        
      if (!error && data) {
        const topicsSet = new Set();
        const topicCounts = {};
        
        data.forEach(item => {
          if (item.tag) {
            const normalized = normalizeTopicName(item.tag);
            if (normalized) {
              topicsSet.add(normalized);
              topicCounts[normalized] = (topicCounts[normalized] || 0) + 1;
            }
          }
        });
        
        allTopics[paper] = Array.from(topicsSet).sort();
        
        console.log(`[TOPICS API] ${paper} topics (${allTopics[paper].length}):`, topicCounts);
      }
    }));
    
    return allTopics;
  }, CACHE_DURATION.TOPICS);
}
