// app/api/spaced-repetition/review/route.js
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { SM2Algorithm, SpacedRepetitionAnalytics } from '@/lib/spaced-repetition-utils';

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
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    const {
      cardId,
      isCorrect,
      userResponse,
      correctAnswer,
      timeTaken,
      difficultyRating,
      sessionId
    } = body;

    // Validate required fields
    if (!cardId || isCorrect === undefined || !correctAnswer) {
      return NextResponse.json({ 
        error: 'Missing required fields: cardId, isCorrect, correctAnswer' 
      }, { status: 400 });
    }

    console.log(`[SPACED-REPETITION] Processing review for card ${cardId}, correct: ${isCorrect}`);

    // Start a transaction
    const { data: currentCard, error: fetchError } = await supabase
      .from('spaced_repetition_cards')
      .select('*')
      .eq('id', cardId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !currentCard) {
      console.error('Error fetching card:', fetchError);
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Calculate new review parameters using SM-2 algorithm
    const reviewQuality = SM2Algorithm.adjustQualityForMCQ(isCorrect, timeTaken);
    const newCardData = SM2Algorithm.calculateNextReview(currentCard, reviewQuality, timeTaken);

    // Update card statistics
    const updatedCard = {
      ...newCardData,
      total_reviews: currentCard.total_reviews + 1,
      correct_reviews: currentCard.correct_reviews + (isCorrect ? 1 : 0),
      difficulty_rating: difficultyRating || currentCard.difficulty_rating,
      updated_at: new Date().toISOString()
    };

    // Update the card
    const { data: updatedCardData, error: updateError } = await supabase
      .from('spaced_repetition_cards')
      .update(updatedCard)
      .eq('id', cardId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating card:', updateError);
      return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
    }

    // Record review history
    const reviewHistoryData = {
      card_id: cardId,
      session_id: sessionId,
      user_response: userResponse,
      correct_answer: correctAnswer.toLowerCase(),
      was_correct: isCorrect,
      time_taken: timeTaken || 0,
      difficulty_rating: difficultyRating,
      previous_ease_factor: currentCard.ease_factor,
      new_ease_factor: updatedCard.ease_factor,
      previous_interval: currentCard.interval_days,
      new_interval: updatedCard.interval_days,
      review_type: currentCard.next_review_date < new Date().toISOString().split('T')[0] ? 'overdue' : 'normal'
    };

    const { error: historyError } = await supabase
      .from('spaced_repetition_review_history')
      .insert(reviewHistoryData);

    if (historyError) {
      console.error('Error recording review history:', historyError);
      // Don't fail the request if history recording fails
    }

    // Update user progress (for integration with existing analytics)
    await updateUserProgress(userId, currentCard, isCorrect, timeTaken);

    // Calculate performance analytics
    const performanceAnalytics = await calculatePerformanceAnalytics(cardId, isCorrect);

    console.log(`[SPACED-REPETITION] Review processed successfully. Next review: ${updatedCard.next_review_date}`);

    return NextResponse.json({
      message: 'Review processed successfully',
      card: {
        ...updatedCardData,
        status: getCardStatus(updatedCardData),
        relativeDate: getRelativeDate(updatedCardData.next_review_date)
      },
      analytics: performanceAnalytics,
      algorithm: {
        qualityUsed: reviewQuality,
        easeFactor: {
          previous: currentCard.ease_factor,
          new: updatedCard.ease_factor,
          changed: Math.abs(updatedCard.ease_factor - currentCard.ease_factor) > 0.01
        },
        interval: {
          previous: currentCard.interval_days,
          new: updatedCard.interval_days,
          multiplier: currentCard.interval_days > 0 ? updatedCard.interval_days / currentCard.interval_days : 1
        },
        repetitions: {
          previous: currentCard.repetitions,
          new: updatedCard.repetitions,
          graduated: updatedCard.repetitions > currentCard.repetitions
        }
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Batch review endpoint for multiple cards
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { reviews, sessionId } = body;

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json({ error: 'Reviews array required' }, { status: 400 });
    }

    console.log(`[SPACED-REPETITION] Processing batch review of ${reviews.length} cards`);

    const results = [];
    const errors = [];

    // Process each review
    for (const review of reviews) {
      try {
        const result = await processSingleReview(userId, review, sessionId);
        results.push(result);
      } catch (error) {
        console.error(`Error processing review for card ${review.cardId}:`, error);
        errors.push({
          cardId: review.cardId,
          error: error.message
        });
      }
    }

    // Update session statistics if sessionId provided
    if (sessionId && results.length > 0) {
      await updateSessionStatistics(sessionId, results);
    }

    return NextResponse.json({
      message: `Processed ${results.length} reviews successfully`,
      processed: results.length,
      errors: errors.length,
      results: results,
      errors: errors
    });

  } catch (error) {
    console.error('Batch review API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to process a single review
async function processSingleReview(userId, review, sessionId) {
  const { cardId, isCorrect, userResponse, correctAnswer, timeTaken, difficultyRating } = review;

  // Fetch current card
  const { data: currentCard, error: fetchError } = await supabase
    .from('spaced_repetition_cards')
    .select('*')
    .eq('id', cardId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !currentCard) {
    throw new Error('Card not found');
  }

  // Calculate new parameters
  const reviewQuality = SM2Algorithm.adjustQualityForMCQ(isCorrect, timeTaken);
  const newCardData = SM2Algorithm.calculateNextReview(currentCard, reviewQuality, timeTaken);

  // Update card
  const updatedCard = {
    ...newCardData,
    total_reviews: currentCard.total_reviews + 1,
    correct_reviews: currentCard.correct_reviews + (isCorrect ? 1 : 0),
    difficulty_rating: difficultyRating || currentCard.difficulty_rating,
    updated_at: new Date().toISOString()
  };

  const { data: updatedCardData, error: updateError } = await supabase
    .from('spaced_repetition_cards')
    .update(updatedCard)
    .eq('id', cardId)
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) {
    throw new Error('Failed to update card');
  }

  // Record history
  const reviewHistoryData = {
    card_id: cardId,
    session_id: sessionId,
    user_response: userResponse,
    correct_answer: correctAnswer.toLowerCase(),
    was_correct: isCorrect,
    time_taken: timeTaken || 0,
    difficulty_rating: difficultyRating,
    previous_ease_factor: currentCard.ease_factor,
    new_ease_factor: updatedCard.ease_factor,
    previous_interval: currentCard.interval_days,
    new_interval: updatedCard.interval_days,
    review_type: currentCard.next_review_date < new Date().toISOString().split('T')[0] ? 'overdue' : 'normal'
  };

  await supabase
    .from('spaced_repetition_review_history')
    .insert(reviewHistoryData);

  return {
    cardId,
    success: true,
    card: updatedCardData,
    wasCorrect: isCorrect,
    nextReview: updatedCard.next_review_date,
    easeFactor: updatedCard.ease_factor,
    interval: updatedCard.interval_days
  };
}

// Helper function to update user progress
async function updateUserProgress(userId, card, isCorrect, timeTaken) {
  try {
    // Get question details to extract chapter
    const tableName = `mcqs_${card.paper}`;
    const { data: question } = await supabase
      .from(tableName)
      .select('tag')
      .eq('main_id', card.question_id)
      .single();

    if (!question) return;

    const chapter = normalizeChapterName(question.tag);

    // Update or create user progress record
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter', chapter)
      .eq('paper', card.paper)
      .single();

    if (existingProgress) {
      const newTotal = existingProgress.total_questions_attempted + 1;
      const newCorrect = existingProgress.correct_answers + (isCorrect ? 1 : 0);
      const newAccuracy = (newCorrect / newTotal) * 100;

      await supabase
        .from('user_progress')
        .update({
          total_questions_attempted: newTotal,
          correct_answers: newCorrect,
          accuracy: newAccuracy,
          last_practiced: new Date().toISOString()
        })
        .eq('id', existingProgress.id);
    } else {
      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          chapter: chapter,
          paper: card.paper,
          total_questions_attempted: 1,
          correct_answers: isCorrect ? 1 : 0,
          accuracy: isCorrect ? 100 : 0,
          last_practiced: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Error updating user progress:', error);
  }
}

// Helper function to calculate performance analytics
async function calculatePerformanceAnalytics(cardId, wasCorrect) {
  try {
    const { data: reviewHistory } = await supabase
      .from('spaced_repetition_review_history')
      .select('*')
      .eq('card_id', cardId)
      .order('reviewed_at', { ascending: false })
      .limit(10);

    if (!reviewHistory || reviewHistory.length === 0) {
      return {
        totalReviews: 1,
        accuracy: wasCorrect ? 100 : 0,
        trend: 'insufficient_data'
      };
    }

    const analytics = SpacedRepetitionAnalytics.calculateRetentionRate(reviewHistory);
    
    return {
      totalReviews: analytics.totalReviews,
      accuracy: analytics.overall,
      recentAccuracy: analytics.recent,
      trend: analytics.trend
    };
  } catch (error) {
    console.error('Error calculating performance analytics:', error);
    return {
      totalReviews: 1,
      accuracy: wasCorrect ? 100 : 0,
      trend: 'error'
    };
  }
}

// Helper function to update session statistics
async function updateSessionStatistics(sessionId, results) {
  try {
    const correctAnswers = results.filter(r => r.wasCorrect).length;
    const totalQuestions = results.length;
    const cardsGraduated = results.filter(r => r.card.repetitions > 0).length;
    const cardsFailed = results.filter(r => !r.wasCorrect).length;

    await supabase
      .from('spaced_repetition_sessions')
      .update({
        questions_reviewed: totalQuestions,
        correct_answers: correctAnswers,
        cards_graduated: cardsGraduated,
        cards_failed: cardsFailed
      })
      .eq('id', sessionId);

  } catch (error) {
    console.error('Error updating session statistics:', error);
  }
}

// Helper function to normalize chapter name
function normalizeChapterName(tag) {
  if (!tag) return '';
  return tag
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

// Helper function to get card status
function getCardStatus(card) {
  const today = new Date().toISOString().split('T')[0];
  
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

// Helper function to get relative date
function getRelativeDate(nextReviewDate) {
  const today = new Date();
  const reviewDate = new Date(nextReviewDate);
  const diffTime = reviewDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays < 7) {
    return `Due in ${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Due in ${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `Due in ${months} month${months !== 1 ? 's' : ''}`;
  }
}
