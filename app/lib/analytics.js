// app/lib/analytics.js - Fixed with Google ID validation and better error handling
import { createClient } from '@supabase/supabase-js';

// Use the anon key for client-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export class AnalyticsService {
  // Helper method to validate Google ID format
  static validateGoogleId(googleId) {
    if (!googleId) {
      console.warn('validateGoogleId: No Google ID provided');
      return false;
    }
    
    if (typeof googleId !== 'string') {
      console.warn('validateGoogleId: Google ID is not a string:', typeof googleId, googleId);
      return false;
    }
    
    // Google IDs should be numeric strings, typically 18-21 digits
    const googleIdPattern = /^\d{18,21}$/;
    if (!googleIdPattern.test(googleId)) {
      console.warn('validateGoogleId: Invalid Google ID format. Expected numeric string, got:', googleId);
      return false;
    }
    
    // Check if it looks like a UUID (which would be wrong)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(googleId)) {
      console.error('validateGoogleId: Received UUID instead of Google ID:', googleId);
      return false;
    }
    
    return true;
  }

  // Helper method to get user ID with strict Google ID validation
  static async getUserId(googleId) {
    try {
      if (!this.validateGoogleId(googleId)) {
        console.error('getUserId: Invalid Google ID provided:', googleId);
        return null;
      }

      console.log('getUserId: Looking up user with validated Google ID:', googleId);

      // Get the user by Google ID
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, google_id')
        .eq('google_id', googleId)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') { // No rows returned
          console.log('getUserId: User not found in database - this might be a new user');
          return null;
        }
        
        console.error('getUserId: Database error when looking up user:', userError);
        return null;
      }

      // Double-check that the returned Google ID matches what we searched for
      if (user.google_id !== googleId) {
        console.error('getUserId: Google ID mismatch! Searched for:', googleId, 'Found:', user.google_id);
        return null;
      }

      console.log('getUserId: Found user with internal ID:', user.id, 'Google ID:', user.google_id);
      return user.id;
    } catch (error) {
      console.error('getUserId: Unexpected error:', error);
      return null;
    }
  }

  // Record a quiz attempt with enhanced validation
  static async recordQuizAttempt(googleId, quizData) {
    try {
      console.log('recordQuizAttempt: Starting with Google ID:', googleId, typeof googleId);
      
      if (!this.validateGoogleId(googleId)) {
        console.error('recordQuizAttempt: Invalid Google ID, aborting');
        return null;
      }
      
      const internalUserId = await this.getUserId(googleId);
      
      if (!internalUserId) {
        console.warn('recordQuizAttempt: Cannot record, user not found or invalid Google ID');
        return null;
      }

      if (!quizData || !quizData.questionsData || !Array.isArray(quizData.questionsData)) {
        console.warn('recordQuizAttempt: Invalid quiz data provided');
        return null;
      }

      const insertData = {
        user_id: internalUserId,
        paper: quizData.paper || 'paper1',
        selected_topic: quizData.chapter || 'mixed',
        selected_year: new Date().getFullYear(),
        question_count: quizData.totalQuestions || 0,
        questions_data: quizData.questionsData,
        answers: quizData.questionsData.reduce((acc, q) => {
          if (q.questionId && q.selectedOption) {
            acc[q.questionId] = q.selectedOption;
          }
          return acc;
        }, {}),
        correct_answers: quizData.correctAnswers || 0,
        total_questions: quizData.totalQuestions || 0,
        score: quizData.score || 0,
        time_taken: quizData.timeTaken || 0,
        completed_at: new Date().toISOString()
      };

      console.log('recordQuizAttempt: Inserting data for user:', internalUserId);

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('recordQuizAttempt: Database insertion error:', error);
        return null;
      }

      console.log('recordQuizAttempt: Successfully recorded quiz attempt');

      // Update user progress
      if (quizData.chapter) {
        await this.updateUserProgress(internalUserId, quizData.chapter, 'paper1', quizData.score || 0);
      }

      return data;
    } catch (error) {
      console.error('recordQuizAttempt: Unexpected error:', error);
      return null;
    }
  }

  // Record a test attempt with enhanced validation
  static async recordTestAttempt(googleId, testData) {
    try {
      console.log('recordTestAttempt: Starting with Google ID:', googleId, typeof googleId);
      
      if (!this.validateGoogleId(googleId)) {
        console.error('recordTestAttempt: Invalid Google ID, aborting');
        return null;
      }
      
      const internalUserId = await this.getUserId(googleId);
      
      if (!internalUserId) {
        console.warn('recordTestAttempt: Cannot record, user not found or invalid Google ID');
        return null;
      }

      if (!testData || !testData.questionsData || !Array.isArray(testData.questionsData)) {
        console.warn('recordTestAttempt: Invalid test data provided');
        return null;
      }

      const insertData = {
        user_id: internalUserId,
        test_mode: testData.testType || 'mock',
        test_type: testData.testType || 'mock',
        test_config: { type: testData.testType || 'mock' },
        questions_data: testData.questionsData,
        answers: testData.questionsData.reduce((acc, q) => {
          if (q.questionId && q.selectedOption) {
            acc[q.questionId] = q.selectedOption;
          }
          return acc;
        }, {}),
        correct_answers: testData.correctAnswers || 0,
        incorrect_answers: (testData.totalQuestions || 0) - (testData.correctAnswers || 0) - (testData.unanswered || 0),
        unanswered: testData.unanswered || 0,
        total_questions: testData.totalQuestions || 0,
        score: testData.score || 0,
        time_taken: testData.timeTaken || 0,
        completed_at: new Date().toISOString()
      };

      console.log('recordTestAttempt: Inserting data for user:', internalUserId);

      const { data, error } = await supabase
        .from('test_attempts')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('recordTestAttempt: Database insertion error:', error);
        return null;
      }

      console.log('recordTestAttempt: Successfully recorded test attempt');

      // Update user progress for each chapter
      if (testData.chapters && Array.isArray(testData.chapters)) {
        for (const chapter of testData.chapters) {
          await this.updateUserProgress(internalUserId, chapter, 'mixed', testData.score || 0);
        }
      }

      return data;
    } catch (error) {
      console.error('recordTestAttempt: Unexpected error:', error);
      return null;
    }
  }

  // Update user progress for a chapter (internal method, uses internal user ID)
  static async updateUserProgress(internalUserId, chapter, paper, score) {
    try {
      if (!internalUserId || !chapter) {
        console.warn('updateUserProgress: Missing required parameters');
        return null;
      }

      console.log('updateUserProgress: Updating for internal user ID:', internalUserId);

      // Get existing progress
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', internalUserId)
        .eq('chapter', chapter)
        .eq('paper', paper || 'mixed')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('updateUserProgress: Error fetching existing progress:', fetchError);
        return null;
      }

      if (existingProgress) {
        // Update existing progress
        const newAttempts = (existingProgress.total_questions_attempted || 0) + 1;
        const newCorrect = (existingProgress.correct_answers || 0) + (score >= 60 ? 1 : 0);
        const newAccuracy = newAttempts > 0 ? Math.round((newCorrect / newAttempts) * 100) : 0;
        const newCurrentStreak = score >= 60 ? (existingProgress.current_streak || 0) + 1 : 0;
        const newBestStreak = Math.max(existingProgress.best_streak || 0, newCurrentStreak);

        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            total_questions_attempted: newAttempts,
            correct_answers: newCorrect,
            accuracy: newAccuracy,
            current_streak: newCurrentStreak,
            best_streak: newBestStreak,
            last_practiced: new Date().toISOString()
          })
          .eq('id', existingProgress.id);

        if (updateError) {
          console.error('updateUserProgress: Update error:', updateError);
          return null;
        }
      } else {
        // Create new progress entry
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: internalUserId,
            chapter: chapter,
            paper: paper || 'mixed',
            total_questions_attempted: 1,
            correct_answers: score >= 60 ? 1 : 0,
            accuracy: score >= 60 ? 100 : 0,
            current_streak: score >= 60 ? 1 : 0,
            best_streak: score >= 60 ? 1 : 0,
            last_practiced: new Date().toISOString()
          });

        if (insertError) {
          console.error('updateUserProgress: Insert error:', insertError);
          return null;
        }
      }

      return true;
    } catch (error) {
      console.error('updateUserProgress: Unexpected error:', error);
      return null;
    }
  }

  // Record a study session with enhanced validation
  static async recordStudySession(googleId, sessionData) {
    try {
      console.log('recordStudySession: Starting with Google ID:', googleId, typeof googleId);
      
      if (!this.validateGoogleId(googleId)) {
        console.error('recordStudySession: Invalid Google ID, aborting');
        return null;
      }
      
      const internalUserId = await this.getUserId(googleId);
      
      if (!internalUserId) {
        console.warn('recordStudySession: Cannot record, user not found');
        return null;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingSession, error: fetchError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', internalUserId)
        .eq('session_date', today)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('recordStudySession: Error fetching existing session:', fetchError);
        return null;
      }

      if (existingSession) {
        // Update existing session
        const { error: updateError } = await supabase
          .from('study_sessions')
          .update({
            questions_answered: (existingSession.questions_answered || 0) + (sessionData.questionsAnswered || 0),
            quiz_attempts: (existingSession.quiz_attempts || 0) + (sessionData.quiz_attempts || 1),
            test_attempts: (existingSession.test_attempts || 0) + (sessionData.test_attempts || 0),
            time_spent: (existingSession.time_spent || 0) + (sessionData.duration || 0),
            topics_studied: [...new Set([...(existingSession.topics_studied || []), ...(sessionData.topics_studied || [])])]
          })
          .eq('id', existingSession.id);

        if (updateError) {
          console.error('recordStudySession: Update error:', updateError);
          return null;
        }
      } else {
        // Create new session
        const { error: insertError } = await supabase
          .from('study_sessions')
          .insert({
            user_id: internalUserId,
            session_date: today,
            questions_answered: sessionData.questionsAnswered || 0,
            quiz_attempts: sessionData.quiz_attempts || 1,
            test_attempts: sessionData.test_attempts || 0,
            time_spent: sessionData.duration || 0,
            topics_studied: sessionData.topics_studied || []
          });

        if (insertError) {
          console.error('recordStudySession: Insert error:', insertError);
          return null;
        }
      }

      console.log('recordStudySession: Successfully recorded study session');
      return true;
    } catch (error) {
      console.error('recordStudySession: Unexpected error:', error);
      return null;
    }
  }

  // Rest of the methods remain the same but with enhanced Google ID validation
  // Get user statistics with enhanced validation
  static async getUserStats(googleId) {
    try {
      if (!this.validateGoogleId(googleId)) {
        console.error('getUserStats: Invalid Google ID provided');
        return this.getEmptyStats();
      }

      const internalUserId = await this.getUserId(googleId);
      
      if (!internalUserId) {
        console.warn('getUserStats: User not found');
        return this.getEmptyStats();
      }

      const [quizStats, testStats, progressStats] = await Promise.all([
        this.getQuizStats(internalUserId),
        this.getTestStats(internalUserId),
        this.getProgressStats(internalUserId)
      ]);

      return {
        quizzes: quizStats,
        tests: testStats,
        progress: progressStats,
        overall: {
          totalAttempts: quizStats.totalAttempts + testStats.totalAttempts,
          averageScore: quizStats.totalAttempts + testStats.totalAttempts > 0 
            ? Math.round((quizStats.averageScore + testStats.averageScore) / 2) 
            : 0,
          studyTime: quizStats.totalTime + testStats.totalTime,
          studyStreak: await this.getStudyStreak(internalUserId)
        }
      };
    } catch (error) {
      console.error('getUserStats: Unexpected error:', error);
      return this.getEmptyStats();
    }
  }

  // Helper method to return empty stats
  static getEmptyStats() {
    return {
      quizzes: { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] },
      tests: { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] },
      progress: { totalChapters: 0, completedChapters: 0, strongAreas: [], weakAreas: [], allProgress: [] },
      overall: { totalAttempts: 0, averageScore: 0, studyTime: 0, studyStreak: 0 }
    };
  }

  // [Include all other methods from the original file with the same validation approach]
  // For brevity, I'm not repeating all methods, but they should all follow the same pattern:
  // 1. Validate Google ID format
  // 2. Get internal user ID
  // 3. Perform operation
  // 4. Handle errors gracefully
}
