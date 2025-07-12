// app/lib/database.js - Fixed with consistent Google ID usage
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Helper function to get internal user ID from Google ID
const getInternalUserId = async (googleId) => {
  try {
    if (!googleId) {
      console.warn('getInternalUserId: No Google ID provided');
      return null;
    }

    console.log('getInternalUserId: Looking up user with Google ID:', googleId); // Debug log

    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('google_id', googleId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('getInternalUserId: User not found, this might be a new user');
        return null;
      }
      console.error('getInternalUserId: Database error:', error);
      return null;
    }
    
    console.log('getInternalUserId: Found user with internal ID:', user.id); // Debug log
    return user.id;
  } catch (error) {
    console.error('getInternalUserId: Unexpected error:', error);
    return null;
  }
};

// User operations
export const getUserByGoogleId = async (googleId) => {
  try {
    if (!googleId) {
      throw new Error('Google ID is required');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', googleId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getUserByGoogleId error:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('createUser error:', error);
    throw error;
  }
};

export const updateUserLastLogin = async (googleId) => {
  try {
    if (!googleId) {
      throw new Error('Google ID is required');
    }

    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('google_id', googleId);
    
    if (error) throw error;
  } catch (error) {
    console.error('updateUserLastLogin error:', error);
    throw error;
  }
};

// Quiz attempts - Fixed to handle Google ID consistently
export const saveQuizAttempt = async (googleId, attemptData) => {
  try {
    console.log('saveQuizAttempt: Saving for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('saveQuizAttempt: Cannot save, user not found');
      return null;
    }

    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        ...attemptData,
        user_id: internalUserId
      })
      .select()
      .single();
    
    if (error) {
      console.error('saveQuizAttempt: Database error:', error);
      return null;
    }

    console.log('saveQuizAttempt: Successfully saved attempt'); // Debug log
    return data;
  } catch (error) {
    console.error('saveQuizAttempt: Unexpected error:', error);
    return null;
  }
};

export const getUserQuizAttempts = async (googleId, limit = 10) => {
  try {
    console.log('getUserQuizAttempts: Fetching for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('getUserQuizAttempts: User not found');
      return [];
    }

    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', internalUserId)
      .order('completed_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('getUserQuizAttempts: Database error:', error);
      return [];
    }

    console.log('getUserQuizAttempts: Found', data?.length || 0, 'attempts'); // Debug log
    return data || [];
  } catch (error) {
    console.error('getUserQuizAttempts: Unexpected error:', error);
    return [];
  }
};

// Test attempts - Fixed to handle Google ID consistently
export const saveTestAttempt = async (googleId, attemptData) => {
  try {
    console.log('saveTestAttempt: Saving for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('saveTestAttempt: Cannot save, user not found');
      return null;
    }

    const { data, error } = await supabase
      .from('test_attempts')
      .insert({
        ...attemptData,
        user_id: internalUserId
      })
      .select()
      .single();
    
    if (error) {
      console.error('saveTestAttempt: Database error:', error);
      return null;
    }

    console.log('saveTestAttempt: Successfully saved attempt'); // Debug log
    return data;
  } catch (error) {
    console.error('saveTestAttempt: Unexpected error:', error);
    return null;
  }
};

export const getUserTestAttempts = async (googleId, limit = 10) => {
  try {
    console.log('getUserTestAttempts: Fetching for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('getUserTestAttempts: User not found');
      return [];
    }

    const { data, error } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', internalUserId)
      .order('completed_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('getUserTestAttempts: Database error:', error);
      return [];
    }

    console.log('getUserTestAttempts: Found', data?.length || 0, 'attempts'); // Debug log
    return data || [];
  } catch (error) {
    console.error('getUserTestAttempts: Unexpected error:', error);
    return [];
  }
};

// User progress - Fixed to handle Google ID consistently
export const updateUserProgress = async (googleId, chapter, paper, isCorrect) => {
  try {
    console.log('updateUserProgress: Updating for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('updateUserProgress: Cannot update, user not found');
      return null;
    }

    // First, try to get existing progress
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', internalUserId)
      .eq('chapter', chapter)
      .eq('paper', paper)
      .single();

    if (existingProgress) {
      // Update existing progress
      const newCorrectAnswers = existingProgress.correct_answers + (isCorrect ? 1 : 0);
      const newTotalQuestions = existingProgress.total_questions_attempted + 1;
      const newAccuracy = (newCorrectAnswers / newTotalQuestions) * 100;
      
      let newCurrentStreak = existingProgress.current_streak;
      let newBestStreak = existingProgress.best_streak;
      
      if (isCorrect) {
        newCurrentStreak += 1;
        newBestStreak = Math.max(newBestStreak, newCurrentStreak);
      } else {
        newCurrentStreak = 0;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .update({
          total_questions_attempted: newTotalQuestions,
          correct_answers: newCorrectAnswers,
          accuracy: newAccuracy,
          current_streak: newCurrentStreak,
          best_streak: newBestStreak,
          last_practiced: new Date().toISOString()
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) {
        console.error('updateUserProgress: Update error:', error);
        return null;
      }
      return data;
    } else {
      // Create new progress record
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: internalUserId,
          chapter,
          paper,
          total_questions_attempted: 1,
          correct_answers: isCorrect ? 1 : 0,
          accuracy: isCorrect ? 100 : 0,
          current_streak: isCorrect ? 1 : 0,
          best_streak: isCorrect ? 1 : 0,
          last_practiced: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('updateUserProgress: Insert error:', error);
        return null;
      }
      return data;
    }
  } catch (error) {
    console.error('updateUserProgress: Unexpected error:', error);
    return null;
  }
};

export const getUserProgress = async (googleId) => {
  try {
    console.log('getUserProgress: Fetching for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('getUserProgress: User not found');
      return [];
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', internalUserId)
      .order('last_practiced', { ascending: false });
    
    if (error) {
      console.error('getUserProgress: Database error:', error);
      return [];
    }

    console.log('getUserProgress: Found', data?.length || 0, 'progress records'); // Debug log
    return data || [];
  } catch (error) {
    console.error('getUserProgress: Unexpected error:', error);
    return [];
  }
};

// User preferences - Fixed to handle Google ID consistently
export const getUserPreferences = async (googleId) => {
  try {
    console.log('getUserPreferences: Fetching for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('getUserPreferences: User not found');
      return null;
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', internalUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('getUserPreferences: Database error:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('getUserPreferences: Unexpected error:', error);
    return null;
  }
};

export const createUserPreferences = async (googleId, preferences = {}) => {
  try {
    console.log('createUserPreferences: Creating for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('createUserPreferences: Cannot create, user not found');
      return null;
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .insert({
        user_id: internalUserId,
        ...preferences
      })
      .select()
      .single();
    
    if (error) {
      console.error('createUserPreferences: Database error:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('createUserPreferences: Unexpected error:', error);
    return null;
  }
};

export const updateUserPreferences = async (googleId, preferences) => {
  try {
    console.log('updateUserPreferences: Updating for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('updateUserPreferences: Cannot update, user not found');
      return null;
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .update(preferences)
      .eq('user_id', internalUserId)
      .select()
      .single();
    
    if (error) {
      console.error('updateUserPreferences: Database error:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('updateUserPreferences: Unexpected error:', error);
    return null;
  }
};

// Study sessions - Fixed to handle Google ID consistently
export const updateStudySession = async (googleId, sessionData) => {
  try {
    console.log('updateStudySession: Updating for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('updateStudySession: Cannot update, user not found');
      return null;
    }

    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingSession } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', internalUserId)
      .eq('session_date', today)
      .single();

    if (existingSession) {
      // Update existing session
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          questions_answered: existingSession.questions_answered + (sessionData.questions_answered || 0),
          quiz_attempts: existingSession.quiz_attempts + (sessionData.quiz_attempts || 0),
          test_attempts: existingSession.test_attempts + (sessionData.test_attempts || 0),
          time_spent: existingSession.time_spent + (sessionData.time_spent || 0),
          topics_studied: [...new Set([...existingSession.topics_studied, ...(sessionData.topics_studied || [])])]
        })
        .eq('id', existingSession.id)
        .select()
        .single();

      if (error) {
        console.error('updateStudySession: Update error:', error);
        return null;
      }
      return data;
    } else {
      // Create new session
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: internalUserId,
          session_date: today,
          ...sessionData
        })
        .select()
        .single();

      if (error) {
        console.error('updateStudySession: Insert error:', error);
        return null;
      }
      return data;
    }
  } catch (error) {
    console.error('updateStudySession: Unexpected error:', error);
    return null;
  }
};

export const getUserStudySessions = async (googleId, days = 30) => {
  try {
    console.log('getUserStudySessions: Fetching for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('getUserStudySessions: User not found');
      return [];
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', internalUserId)
      .gte('session_date', startDate.toISOString().split('T')[0])
      .order('session_date', { ascending: false });
    
    if (error) {
      console.error('getUserStudySessions: Database error:', error);
      return [];
    }

    console.log('getUserStudySessions: Found', data?.length || 0, 'sessions'); // Debug log
    return data || [];
  } catch (error) {
    console.error('getUserStudySessions: Unexpected error:', error);
    return [];
  }
};

// Analytics queries - Fixed to handle Google ID consistently
export const getUserAnalytics = async (googleId, days = 30) => {
  try {
    console.log('getUserAnalytics: Fetching for Google ID:', googleId); // Debug log
    
    const internalUserId = await getInternalUserId(googleId);
    
    if (!internalUserId) {
      console.warn('getUserAnalytics: User not found');
      return {
        quizAttempts: [],
        testAttempts: [],
        progress: [],
        sessions: []
      };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString();

    // Get quiz attempts
    const { data: quizAttempts, error: quizError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', internalUserId)
      .gte('completed_at', startDateStr);

    if (quizError) {
      console.error('getUserAnalytics: Quiz error:', quizError);
    }

    // Get test attempts
    const { data: testAttempts, error: testError } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', internalUserId)
      .gte('completed_at', startDateStr);

    if (testError) {
      console.error('getUserAnalytics: Test error:', testError);
    }

    // Get progress data
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', internalUserId);

    if (progressError) {
      console.error('getUserAnalytics: Progress error:', progressError);
    }

    // Get study sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', internalUserId)
      .gte('session_date', startDate.toISOString().split('T')[0]);

    if (sessionsError) {
      console.error('getUserAnalytics: Sessions error:', sessionsError);
    }

    return {
      quizAttempts: quizAttempts || [],
      testAttempts: testAttempts || [],
      progress: progress || [],
      sessions: sessions || []
    };
  } catch (error) {
    console.error('getUserAnalytics: Unexpected error:', error);
    return {
      quizAttempts: [],
      testAttempts: [],
      progress: [],
      sessions: []
    };
  }
};
