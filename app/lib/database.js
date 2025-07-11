// app/lib/database.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// User operations
export const getUserByGoogleId = async (googleId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('google_id', googleId)
    .single();
  
  if (error) throw error;
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserLastLogin = async (googleId) => {
  const { error } = await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('google_id', googleId);
  
  if (error) throw error;
};

// Quiz attempts
export const saveQuizAttempt = async (attemptData) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert(attemptData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserQuizAttempts = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// Test attempts
export const saveTestAttempt = async (attemptData) => {
  const { data, error } = await supabase
    .from('test_attempts')
    .insert(attemptData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserTestAttempts = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// User progress
export const updateUserProgress = async (userId, chapter, paper, isCorrect) => {
  // First, try to get existing progress
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
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

    if (error) throw error;
    return data;
  } else {
    // Create new progress record
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
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

    if (error) throw error;
    return data;
  }
};

export const getUserProgress = async (userId) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_practiced', { ascending: false });
  
  if (error) throw error;
  return data;
};

// User preferences
export const getUserPreferences = async (userId) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createUserPreferences = async (userId, preferences = {}) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .insert({
      user_id: userId,
      ...preferences
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserPreferences = async (userId, preferences) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(preferences)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Study sessions
export const updateStudySession = async (userId, sessionData) => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: existingSession } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', userId)
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

    if (error) throw error;
    return data;
  } else {
    // Create new session
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: userId,
        session_date: today,
        ...sessionData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const getUserStudySessions = async (userId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('session_date', startDate.toISOString().split('T')[0])
    .order('session_date', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Analytics queries
export const getUserAnalytics = async (userId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString();

  // Get quiz attempts
  const { data: quizAttempts, error: quizError } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .gte('completed_at', startDateStr);

  if (quizError) throw quizError;

  // Get test attempts
  const { data: testAttempts, error: testError } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('user_id', userId)
    .gte('completed_at', startDateStr);

  if (testError) throw testError;

  // Get progress data
  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (progressError) throw progressError;

  // Get study sessions
  const { data: sessions, error: sessionsError } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('session_date', startDate.toISOString().split('T')[0]);

  if (sessionsError) throw sessionsError;

  return {
    quizAttempts,
    testAttempts,
    progress,
    sessions
  };
};