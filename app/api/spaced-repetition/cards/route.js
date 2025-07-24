// app/api/spaced-repetition/cards/route.js
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { CardSelector, CardUtils, SM2_CONSTANTS } from '@/lib/spaced-repetition-utils';

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
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    const paper = searchParams.get('paper') || 'all';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const type = searchParams.get('type') || 'all'; // 'due', 'overdue', 'new', 'learning', 'all'
    const includeQuestions = searchParams.get('include_questions') === 'true';

    console.log(`[SPACED-REPETITION] Fetching cards for user ${userId}, paper: ${paper}, limit: ${limit}, type: ${type}`);

    // Build base query for cards
    let cardsQuery = supabase
      .from('spaced_repetition_cards')
      .select('*')
      .eq('user_id', userId);

    // Apply paper filter
    if (paper !== 'all') {
      cardsQuery = cardsQuery.eq('paper', paper);
    }

    // Apply type filter
    const today = new Date().toISOString().split('T')[0];
    switch (type) {
      case 'due':
        cardsQuery = cardsQuery.lte('next_review_date', today).gt('total_reviews', 0);
        break;
      case 'overdue':
        cardsQuery = cardsQuery.lt('next_review_date', today);
        break;
      case 'new':
        cardsQuery = cardsQuery.eq('total_reviews', 0);
        break;
      case 'learning':
        cardsQuery = cardsQuery.lt('repetitions', 3).gt('total_reviews', 0);
        break;
      case 'mature':
        cardsQuery = cardsQuery.gte('repetitions', 3).gt('interval_days', 21);
        break;
      // 'all' - no additional filter
    }

    const { data: cards, error: cardsError } = await cardsQuery;

    if (cardsError) {
      console.error('Error fetching spaced repetition cards:', cardsError);
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }

    if (!cards || cards.length === 0) {
      // Check if user has any quiz attempts to seed cards from
      const shouldCreateCards = await checkAndCreateInitialCards(userId, paper);
      
      return NextResponse.json({
        cards: [],
        questions: [],
        meta: {
          totalCards: 0,
          dueCards: 0,
          overdueCards: 0,
          newCards: 0,
          learningCards: 0,
          matureCards: 0,
          suggestCreateCards: shouldCreateCards,
          paper,
          type,
          limit
        }
      });
    }

    // Use CardSelector to prioritize cards
    const prioritizedCards = CardSelector.selectCardsForReview(cards, limit);

    // Fetch question data if requested
    let questionsData = [];
    if (includeQuestions && prioritizedCards.length > 0) {
      questionsData = await fetchQuestionsForCards(prioritizedCards);
    }

    // Calculate metadata
    const metadata = calculateCardsMetadata(cards, today);

    console.log(`[SPACED-REPETITION] Returning ${prioritizedCards.length} prioritized cards`);

    return NextResponse.json({
      cards: prioritizedCards.map(card => ({
        ...card,
        status: getCardStatus(card, today),
        relativeDate: CardUtils.getRelativeDate(card.next_review_date)
      })),
      questions: questionsData,
      meta: {
        ...metadata,
        paper,
        type,
        limit,
        returned: prioritizedCards.length
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { action, questionIds, paper } = body;

    console.log(`[SPACED-REPETITION] ${action} action for user ${userId}, questions: ${questionIds?.length || 0}`);

    switch (action) {
      case 'create_from_weak_questions':
        return await createCardsFromWeakQuestions(userId, paper);
      
      case 'create_from_questions':
        return await createCardsFromQuestionIds(userId, questionIds, paper);
      
      case 'reset_cards':
        return await resetCards(userId, questionIds);
      
      case 'delete_cards':
        return await deleteCards(userId, questionIds);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to check if initial cards should be created
async function checkAndCreateInitialCards(userId, paper) {
  try {
    // Check if user has quiz attempts but no cards
    let attemptsQuery = supabase
      .from('quiz_attempts')
      .select('id')
      .eq('user_id', userId);

    if (paper !== 'all') {
      attemptsQuery = attemptsQuery.eq('paper', paper);
    }

    const { data: attempts } = await attemptsQuery.limit(1);
    return attempts && attempts.length > 0;
    
  } catch (error) {
    console.error('Error checking for initial cards:', error);
    return false;
  }
}

// Helper function to create cards from weak questions
async function createCardsFromWeakQuestions(userId, paper) {
  try {
    console.log(`[SPACED-REPETITION] Creating cards from weak questions for user ${userId}, paper: ${paper}`);

    // Find questions where user has low accuracy
    let progressQuery = supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .lt('accuracy', 70) // Less than 70% accuracy
      .gte('total_questions_attempted', 3); // At least 3 attempts

    if (paper !== 'all') {
      progressQuery = progressQuery.eq('paper', paper);
    }

    const { data: weakChapters, error: progressError } = await progressQuery;

    if (progressError) {
      throw progressError;
    }

    if (!weakChapters || weakChapters.length === 0) {
      return NextResponse.json({
        message: 'No weak areas found to create cards from',
        created: 0
      });
    }

    // Get questions from weak chapters
    const questionIds = [];
    for (const chapter of weakChapters) {
      const tableName = `mcqs_${chapter.paper}`;
      
      const { data: questions } = await supabase
        .from(tableName)
        .select('main_id')
        .ilike('tag', `%${chapter.chapter}%`)
        .limit(10); // Limit per chapter

      if (questions) {
        questionIds.push(...questions.map(q => q.main_id));
      }
    }

    if (questionIds.length === 0) {
      return NextResponse.json({
        message: 'No questions found for weak chapters',
        created: 0
      });
    }

    // Create cards for these questions
    const cardsToCreate = questionIds.map(questionId => ({
      user_id: userId,
      question_id: questionId,
      paper: paper === 'all' ? 'paper1' : paper, // Default to paper1 if 'all'
      ease_factor: SM2_CONSTANTS.DEFAULT_EASE_FACTOR,
      interval_days: SM2_CONSTANTS.INITIAL_INTERVAL,
      repetitions: 0,
      next_review_date: new Date().toISOString().split('T')[0],
      total_reviews: 0,
      correct_reviews: 0
    }));

    // Insert cards (ignore conflicts for existing cards)
    const { data: createdCards, error: insertError } = await supabase
      .from('spaced_repetition_cards')
      .upsert(cardsToCreate, { 
        onConflict: 'user_id,question_id,paper',
        ignoreDuplicates: true 
      })
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(`[SPACED-REPETITION] Created ${createdCards?.length || 0} cards from weak questions`);

    return NextResponse.json({
      message: `Created ${createdCards?.length || 0} cards from weak questions`,
      created: createdCards?.length || 0,
      cards: createdCards
    });

  } catch (error) {
    console.error('Error creating cards from weak questions:', error);
    return NextResponse.json({ error: 'Failed to create cards' }, { status: 500 });
  }
}

// Helper function to create cards from specific question IDs
async function createCardsFromQuestionIds(userId, questionIds, paper) {
  try {
    if (!questionIds || questionIds.length === 0) {
      return NextResponse.json({ error: 'Question IDs required' }, { status: 400 });
    }

    const cardsToCreate = questionIds.map(questionId => ({
      user_id: userId,
      question_id: questionId,
      paper: paper,
      ease_factor: SM2_CONSTANTS.DEFAULT_EASE_FACTOR,
      interval_days: SM2_CONSTANTS.INITIAL_INTERVAL,
      repetitions: 0,
      next_review_date: new Date().toISOString().split('T')[0],
      total_reviews: 0,
      correct_reviews: 0
    }));

    const { data: createdCards, error } = await supabase
      .from('spaced_repetition_cards')
      .upsert(cardsToCreate, { 
        onConflict: 'user_id,question_id,paper',
        ignoreDuplicates: true 
      })
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: `Created ${createdCards?.length || 0} cards`,
      created: createdCards?.length || 0,
      cards: createdCards
    });

  } catch (error) {
    console.error('Error creating cards from question IDs:', error);
    return NextResponse.json({ error: 'Failed to create cards' }, { status: 500 });
  }
}

// Helper function to reset cards
async function resetCards(userId, questionIds) {
  try {
    const { data, error } = await supabase
      .from('spaced_repetition_cards')
      .update({
        ease_factor: SM2_CONSTANTS.DEFAULT_EASE_FACTOR,
        interval_days: SM2_CONSTANTS.INITIAL_INTERVAL,
        repetitions: 0,
        next_review_date: new Date().toISOString().split('T')[0],
        total_reviews: 0,
        correct_reviews: 0,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .in('question_id', questionIds)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: `Reset ${data?.length || 0} cards`,
      updated: data?.length || 0
    });

  } catch (error) {
    console.error('Error resetting cards:', error);
    return NextResponse.json({ error: 'Failed to reset cards' }, { status: 500 });
  }
}

// Helper function to delete cards
async function deleteCards(userId, questionIds) {
  try {
    const { data, error } = await supabase
      .from('spaced_repetition_cards')
      .delete()
      .eq('user_id', userId)
      .in('question_id', questionIds)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: `Deleted ${data?.length || 0} cards`,
      deleted: data?.length || 0
    });

  } catch (error) {
    console.error('Error deleting cards:', error);
    return NextResponse.json({ error: 'Failed to delete cards' }, { status: 500 });
  }
}

// Helper function to fetch question data for cards
async function fetchQuestionsForCards(cards) {
  try {
    const questionsByPaper = {
      paper1: [],
      paper2: [],
      paper3: []
    };

    // Group question IDs by paper
    cards.forEach(card => {
      if (questionsByPaper[card.paper]) {
        questionsByPaper[card.paper].push(card.question_id);
      }
    });

    const questions = [];

    // Fetch questions from each paper's table
    for (const [paper, questionIds] of Object.entries(questionsByPaper)) {
      if (questionIds.length === 0) continue;

      const tableName = `mcqs_${paper}`;
      const { data: paperQuestions, error } = await supabase
        .from(tableName)
        .select('main_id, id, question_text, option_a, option_b, option_c, option_d, correct_answer, tag, year, explanation')
        .in('main_id', questionIds);

      if (error) {
        console.error(`Error fetching questions from ${tableName}:`, error);
        continue;
      }

      if (paperQuestions) {
        questions.push(...paperQuestions.map(q => ({ ...q, paper })));
      }
    }

    return questions;

  } catch (error) {
    console.error('Error fetching questions for cards:', error);
    return [];
  }
}

// Helper function to calculate metadata
function calculateCardsMetadata(cards, today) {
  const metadata = {
    totalCards: cards.length,
    dueCards: 0,
    overdueCards: 0,
    newCards: 0,
    learningCards: 0,
    matureCards: 0
  };

  cards.forEach(card => {
    const status = getCardStatus(card, today);
    switch (status) {
      case 'due':
        metadata.dueCards++;
        break;
      case 'overdue':
        metadata.overdueCards++;
        break;
      case 'new':
        metadata.newCards++;
        break;
      case 'learning':
        metadata.learningCards++;
        break;
      case 'mature':
        metadata.matureCards++;
        break;
    }
  });

  return metadata;
}

// Helper function to get card status
function getCardStatus(card, today) {
  if (card.total_reviews === 0) {
    return 'new';
  }
  
  if (card.next_review_date < today) {
    return 'overdue';
  }
  
  if (card.next_review_date === today) {
    return 'due';
  }
  
  if (card.repetitions < 3) {
    return 'learning';
  }
  
  if (card.interval_days > 21) {
    return 'mature';
  }
  
  return 'review';
}
