// app/lib/spaced-repetition-utils.js
import { normalizeChapterName } from './quiz-utils';

// SM-2 Algorithm Constants
export const SM2_CONSTANTS = {
  MINIMUM_EASE_FACTOR: 1.3,
  MAXIMUM_EASE_FACTOR: 2.5,
  DEFAULT_EASE_FACTOR: 2.5,
  INITIAL_INTERVAL: 1,
  SECOND_INTERVAL: 3,
  EASE_FACTOR_ADJUSTMENT: 0.1,
  QUALITY_THRESHOLD: 3, // Minimum quality for successful review
};

// Card Status Types
export const CARD_STATUS = {
  NEW: 'new',          // Never reviewed
  LEARNING: 'learning', // In initial learning phase (< 3 successful reviews)
  REVIEW: 'review',     // Regular review mode
  MATURE: 'mature',     // Long intervals (> 21 days)
  OVERDUE: 'overdue',   // Past due date
};

// Review Quality Ratings (0-5 scale)
export const REVIEW_QUALITY = {
  COMPLETE_BLACKOUT: 0,      // Complete failure
  INCORRECT_EASY_RECALL: 1,  // Incorrect but answer seemed familiar
  INCORRECT_HARD_RECALL: 2,  // Incorrect with difficult recall
  CORRECT_HARD_RECALL: 3,    // Correct but difficult recall
  CORRECT_SOME_HESITATION: 4, // Correct with some hesitation
  PERFECT_RECALL: 5,         // Perfect recall
};

/**
 * SM-2 Algorithm Implementation
 * Based on the SuperMemo SM-2 algorithm with modifications for MCQ format
 */
export class SM2Algorithm {
  /**
   * Calculate next review parameters based on response quality
   * @param {Object} card - Current card state
   * @param {number} quality - Response quality (0-5)
   * @param {number} timeTaken - Time taken to answer (seconds)
   * @returns {Object} New card parameters
   */
  static calculateNextReview(card, quality, timeTaken = null) {
    const {
      ease_factor: currentEase = SM2_CONSTANTS.DEFAULT_EASE_FACTOR,
      interval_days: currentInterval = SM2_CONSTANTS.INITIAL_INTERVAL,
      repetitions = 0,
    } = card;

    let newEase = currentEase;
    let newInterval = currentInterval;
    let newRepetitions = repetitions;

    // Quality adjustment for MCQ format
    // Convert boolean correct/incorrect to SM-2 quality scale
    const adjustedQuality = this.adjustQualityForMCQ(quality, timeTaken);

    if (adjustedQuality >= SM2_CONSTANTS.QUALITY_THRESHOLD) {
      // Successful review
      newRepetitions += 1;
      
      if (newRepetitions === 1) {
        newInterval = SM2_CONSTANTS.INITIAL_INTERVAL;
      } else if (newRepetitions === 2) {
        newInterval = SM2_CONSTANTS.SECOND_INTERVAL;
      } else {
        newInterval = Math.round(currentInterval * newEase);
      }
      
      // Adjust ease factor
      newEase = Math.max(
        SM2_CONSTANTS.MINIMUM_EASE_FACTOR,
        currentEase + (0.1 - (5 - adjustedQuality) * (0.08 + (5 - adjustedQuality) * 0.02))
      );
    } else {
      // Failed review
      newRepetitions = 0;
      newInterval = SM2_CONSTANTS.INITIAL_INTERVAL;
      newEase = Math.max(
        SM2_CONSTANTS.MINIMUM_EASE_FACTOR,
        currentEase - SM2_CONSTANTS.EASE_FACTOR_ADJUSTMENT
      );
    }

    // Ensure ease factor stays within bounds
    newEase = Math.min(SM2_CONSTANTS.MAXIMUM_EASE_FACTOR, newEase);

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
      ease_factor: Number(newEase.toFixed(2)),
      interval_days: newInterval,
      repetitions: newRepetitions,
      next_review_date: nextReviewDate.toISOString().split('T')[0],
      last_review_date: new Date().toISOString(),
    };
  }

  /**
   * Adjust quality rating for MCQ format
   * @param {boolean|number} isCorrect - Whether answer was correct or quality rating
   * @param {number} timeTaken - Time taken in seconds
   * @returns {number} Adjusted quality (0-5)
   */
  static adjustQualityForMCQ(isCorrect, timeTaken = null) {
    if (typeof isCorrect === 'number') {
      // If already a quality rating, return as-is
      return Math.max(0, Math.min(5, isCorrect));
    }

    if (!isCorrect) {
      return REVIEW_QUALITY.INCORRECT_HARD_RECALL;
    }

    // Adjust quality based on response time
    if (timeTaken === null) {
      return REVIEW_QUALITY.CORRECT_SOME_HESITATION;
    }

    // Time-based quality adjustment
    if (timeTaken <= 5) {
      return REVIEW_QUALITY.PERFECT_RECALL;
    } else if (timeTaken <= 15) {
      return REVIEW_QUALITY.CORRECT_SOME_HESITATION;
    } else {
      return REVIEW_QUALITY.CORRECT_HARD_RECALL;
    }
  }
}

/**
 * Card selection and prioritization utilities
 */
export class CardSelector {
  /**
   * Get cards due for review with priority sorting
   * @param {Array} cards - Array of card objects
   * @param {number} limit - Maximum number of cards to return
   * @returns {Array} Prioritized cards for review
   */
  static selectCardsForReview(cards, limit = 20) {
    const today = new Date().toISOString().split('T')[0];
    
    // Categorize cards
    const categorized = {
      overdue: [],
      due: [],
      new: [],
      learning: [],
    };

    cards.forEach(card => {
      if (card.total_reviews === 0) {
        categorized.new.push(card);
      } else if (card.next_review_date < today) {
        categorized.overdue.push(card);
      } else if (card.next_review_date <= today) {
        categorized.due.push(card);
      } else if (card.repetitions < 3) {
        categorized.learning.push(card);
      }
    });

    // Sort each category by priority
    this.sortCardsByPriority(categorized.overdue, 'overdue');
    this.sortCardsByPriority(categorized.due, 'due');
    this.sortCardsByPriority(categorized.new, 'new');
    this.sortCardsByPriority(categorized.learning, 'learning');

    // Combine with priority: overdue > due > new > learning
    const prioritized = [
      ...categorized.overdue,
      ...categorized.due,
      ...categorized.new,
      ...categorized.learning,
    ];

    return prioritized.slice(0, limit);
  }

  /**
   * Sort cards within a category by priority
   * @param {Array} cards - Cards to sort
   * @param {string} category - Category type
   */
  static sortCardsByPriority(cards, category) {
    switch (category) {
      case 'overdue':
        // Sort by days overdue (descending) then by ease factor (ascending)
        cards.sort((a, b) => {
          const aDaysOverdue = this.getDaysOverdue(a.next_review_date);
          const bDaysOverdue = this.getDaysOverdue(b.next_review_date);
          if (aDaysOverdue !== bDaysOverdue) {
            return bDaysOverdue - aDaysOverdue;
          }
          return a.ease_factor - b.ease_factor;
        });
        break;
      
      case 'due':
        // Sort by ease factor (ascending) - harder cards first
        cards.sort((a, b) => a.ease_factor - b.ease_factor);
        break;
      
      case 'new':
        // Sort by question difficulty or randomly
        cards.sort(() => Math.random() - 0.5);
        break;
      
      case 'learning':
        // Sort by interval (ascending) - shorter intervals first
        cards.sort((a, b) => a.interval_days - b.interval_days);
        break;
    }
  }

  /**
   * Calculate days overdue for a card
   * @param {string} nextReviewDate - ISO date string
   * @returns {number} Days overdue (positive if overdue)
   */
  static getDaysOverdue(nextReviewDate) {
    const today = new Date();
    const reviewDate = new Date(nextReviewDate);
    const diffTime = today - reviewDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}

/**
 * Analytics and progress tracking utilities
 */
export class SpacedRepetitionAnalytics {
  /**
   * Calculate card status based on its properties
   * @param {Object} card - Card object
   * @returns {string} Card status
   */
  static getCardStatus(card) {
    const today = new Date().toISOString().split('T')[0];
    
    if (card.total_reviews === 0) {
      return CARD_STATUS.NEW;
    }
    
    if (card.next_review_date < today) {
      return CARD_STATUS.OVERDUE;
    }
    
    if (card.repetitions < 3) {
      return CARD_STATUS.LEARNING;
    }
    
    if (card.interval_days > 21) {
      return CARD_STATUS.MATURE;
    }
    
    return CARD_STATUS.REVIEW;
  }

  /**
   * Calculate retention rate for a user
   * @param {Array} reviewHistory - Array of review history records
   * @returns {Object} Retention statistics
   */
  static calculateRetentionRate(reviewHistory) {
    if (!reviewHistory || reviewHistory.length === 0) {
      return {
        overall: 0,
        recent: 0,
        trend: 'insufficient_data'
      };
    }

    const totalReviews = reviewHistory.length;
    const correctReviews = reviewHistory.filter(r => r.was_correct).length;
    const overallRetention = (correctReviews / totalReviews) * 100;

    // Calculate recent retention (last 20 reviews or 50% if fewer)
    const recentCount = Math.min(20, Math.ceil(totalReviews * 0.5));
    const recentReviews = reviewHistory.slice(-recentCount);
    const recentCorrect = recentReviews.filter(r => r.was_correct).length;
    const recentRetention = (recentCorrect / recentCount) * 100;

    // Determine trend
    let trend = 'stable';
    if (totalReviews >= 10) {
      const diff = recentRetention - overallRetention;
      if (diff > 10) {
        trend = 'improving';
      } else if (diff < -10) {
        trend = 'declining';
      }
    }

    return {
      overall: Math.round(overallRetention),
      recent: Math.round(recentRetention),
      trend,
      totalReviews,
      correctReviews
    };
  }

  /**
   * Generate study recommendations based on user performance
   * @param {Object} userStats - User statistics
   * @param {Array} cards - User's cards
   * @returns {Array} Array of recommendation objects
   */
  static generateStudyRecommendations(userStats, cards) {
    const recommendations = [];
    const cardsByStatus = this.groupCardsByStatus(cards);
    
    // Check for overdue cards
    if (cardsByStatus.overdue.length > 0) {
      recommendations.push({
        type: 'overdue',
        priority: 'high',
        title: 'Overdue Reviews',
        description: `You have ${cardsByStatus.overdue.length} overdue cards that need immediate attention.`,
        action: 'Review overdue cards',
        count: cardsByStatus.overdue.length
      });
    }

    // Check for low retention rate
    if (userStats.retention && userStats.retention.overall < 70) {
      recommendations.push({
        type: 'retention',
        priority: 'medium',
        title: 'Low Retention Rate',
        description: `Your overall retention rate is ${userStats.retention.overall}%. Consider reviewing explanations more carefully.`,
        action: 'Focus on understanding',
        rate: userStats.retention.overall
      });
    }

    // Check for new cards
    if (cardsByStatus.new.length > 0) {
      recommendations.push({
        type: 'new_cards',
        priority: 'low',
        title: 'New Cards Available',
        description: `${cardsByStatus.new.length} new cards are ready for introduction.`,
        action: 'Learn new cards',
        count: cardsByStatus.new.length
      });
    }

    // Check for learning cards
    if (cardsByStatus.learning.length > 5) {
      recommendations.push({
        type: 'learning',
        priority: 'medium',
        title: 'Cards in Learning Phase',
        description: `${cardsByStatus.learning.length} cards are in the learning phase and need regular practice.`,
        action: 'Practice learning cards',
        count: cardsByStatus.learning.length
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Group cards by their status
   * @param {Array} cards - Array of cards
   * @returns {Object} Cards grouped by status
   */
  static groupCardsByStatus(cards) {
    const grouped = {
      new: [],
      learning: [],
      review: [],
      mature: [],
      overdue: []
    };

    cards.forEach(card => {
      const status = this.getCardStatus(card);
      if (grouped[status]) {
        grouped[status].push(card);
      }
    });

    return grouped;
  }

  /**
   * Calculate predicted scores based on spaced repetition performance
   * @param {Object} userStats - User statistics
   * @param {Array} cards - User's cards
   * @returns {Object} Predicted scores by paper
   */
  static calculatePredictedScores(userStats, cards) {
    const cardsByPaper = {
      paper1: cards.filter(c => c.paper === 'paper1'),
      paper2: cards.filter(c => c.paper === 'paper2'),
      paper3: cards.filter(c => c.paper === 'paper3'),
    };

    const predictions = {};

    Object.entries(cardsByPaper).forEach(([paper, paperCards]) => {
      if (paperCards.length === 0) {
        predictions[paper] = 0;
        return;
      }

      // Calculate weighted accuracy based on card maturity
      let weightedAccuracy = 0;
      let totalWeight = 0;

      paperCards.forEach(card => {
        const accuracy = card.total_reviews > 0 ? 
          (card.correct_reviews / card.total_reviews) * 100 : 0;
        
        // Weight based on number of reviews (more reviews = more reliable)
        const weight = Math.min(card.total_reviews, 10);
        weightedAccuracy += accuracy * weight;
        totalWeight += weight;
      });

      predictions[paper] = totalWeight > 0 ? 
        Math.round(weightedAccuracy / totalWeight) : 0;
    });

    predictions.overall = Math.round(
      (predictions.paper1 + predictions.paper2 + predictions.paper3) / 3
    );

    return predictions;
  }
}

/**
 * Utility functions for card management
 */
export const CardUtils = {
  /**
   * Create a new spaced repetition card from a quiz question
   * @param {string} userId - User ID
   * @param {Object} question - Question object
   * @param {string} paper - Paper identifier
   * @returns {Object} New card object
   */
  createCardFromQuestion(userId, question, paper) {
    return {
      user_id: userId,
      question_id: question.main_id || question.id,
      paper: paper,
      ease_factor: SM2_CONSTANTS.DEFAULT_EASE_FACTOR,
      interval_days: SM2_CONSTANTS.INITIAL_INTERVAL,
      repetitions: 0,
      next_review_date: new Date().toISOString().split('T')[0],
      total_reviews: 0,
      correct_reviews: 0,
    };
  },

  /**
   * Determine if a card should be graduated to the next level
   * @param {Object} card - Card object
   * @returns {boolean} Whether card should be graduated
   */
  shouldGraduateCard(card) {
    return card.repetitions >= 3 && card.interval_days >= 7;
  },

  /**
   * Calculate next review session size based on user performance
   * @param {Object} userStats - User statistics
   * @param {number} availableTime - Available time in minutes
   * @returns {number} Recommended number of cards
   */
  calculateOptimalSessionSize(userStats, availableTime = 20) {
    const averageTimePerCard = userStats.averageTimePerCard || 60; // seconds
    const maxCardsForTime = Math.floor((availableTime * 60) / averageTimePerCard);
    
    // Consider user's current performance
    const performanceMultiplier = userStats.retention?.overall > 80 ? 1.2 : 
                                 userStats.retention?.overall < 60 ? 0.8 : 1.0;
    
    return Math.min(50, Math.max(5, Math.round(maxCardsForTime * performanceMultiplier)));
  },

  /**
   * Format time duration for display
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  formatDuration(seconds) {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  },

  /**
   * Get next review date in human-readable format
   * @param {string} nextReviewDate - ISO date string
   * @returns {string} Human-readable date
   */
  getRelativeDate(nextReviewDate) {
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
};

export default {
  SM2Algorithm,
  CardSelector,
  SpacedRepetitionAnalytics,
  CardUtils,
  SM2_CONSTANTS,
  CARD_STATUS,
  REVIEW_QUALITY,
};
