// app/lib/analytics.js - Fixed with better user authentication handling
import { createClient } from '@supabase/supabase-js';

// Use the anon key for client-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export class AnalyticsService {
  // Helper method to get authenticated supabase client
  static getAuthenticatedClient() {
    return supabase;
  }

  // Helper method to get user ID with better error handling
  static async getUserId(googleId) {
    try {
      if (!googleId) {
        console.warn('No Google ID provided');
        return null;
      }

      // First try to get the user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('google_id', googleId)
        .single();

      if (userError) {
        console.warn('User lookup error:', userError);
        
        // If user doesn't exist, this is not necessarily an error for a new user
        if (userError.code === 'PGRST116') { // No rows returned
          console.log('User not found in database - this might be a new user');
          return null;
        }
        
        // For other errors, log but don't throw
        console.error('Database error when looking up user:', userError);
        return null;
      }

      return user?.id || null;
    } catch (error) {
      console.error('Unexpected error in getUserId:', error);
      return null;
    }
  }

  // Record a quiz attempt with better error handling
  static async recordQuizAttempt(googleId, quizData) {
    try {
      const internalUserId = await this.getUserId(googleId);
      
      if (!internalUserId) {
        console.warn('Cannot record quiz attempt: user not found or not authenticated');
        return null;
      }

      if (!quizData || !quizData.questionsData || !Array.isArray(quizData.questionsData)) {
        console.warn('Invalid quiz data provided');
        return null;
      }

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
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
        });

      if (error) {
        console.error('Error inserting quiz attempt:', error);
        return null;
      }

      // Update user progress
      if (quizData.chapter) {
        await this.updateUserProgress(internalUserId, quizData.chapter, 'paper1', quizData.score || 0);
      }

      return data;
    } catch (error) {
      console.error('Error recording quiz attempt:', error);
      return null;
    }
  }

  // Record a test attempt with better error handling
  static async recordTestAttempt(googleId, testData) {
    try {
      const internalUserId = await this.getUserId(googleId);
      
      if (!internalUserId) {
        console.warn('Cannot record test attempt: user not found or not authenticated');
        return null;
      }

      if (!testData || !testData.questionsData || !Array.isArray(testData.questionsData)) {
        console.warn('Invalid test data provided');
        return null;
      }

      const { data, error } = await supabase
        .from('test_attempts')
        .insert({
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
        });

      if (error) {
        console.error('Error inserting test attempt:', error);
        return null;
      }

      // Update user progress for each chapter
      if (testData.chapters && Array.isArray(testData.chapters)) {
        for (const chapter of testData.chapters) {
          await this.updateUserProgress(internalUserId, chapter, 'mixed', testData.score || 0);
        }
      }

      return data;
    } catch (error) {
      console.error('Error recording test attempt:', error);
      return null;
    }
  }

  // Update user progress for a chapter with better error handling
  static async updateUserProgress(internalUserId, chapter, paper, score) {
    try {
      if (!internalUserId || !chapter) {
        console.warn('Missing required parameters for updateUserProgress');
        return null;
      }

      // Get existing progress
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', internalUserId)
        .eq('chapter', chapter)
        .eq('paper', paper || 'mixed')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing progress:', fetchError);
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
          console.error('Error updating progress:', updateError);
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
          console.error('Error inserting new progress:', insertError);
          return null;
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating user progress:', error);
      return null;
    }
  }

  // Get user statistics with better error handling
  static async getUserStats(googleId) {
    try {
      const internalUserId = await this.getUserId(googleId);
      
      if (!internalUserId) {
        console.warn('Cannot get user stats: user not found');
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
      console.error('Error getting user stats:', error);
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

  // Get quiz-specific statistics with better error handling
  static async getQuizStats(internalUserId) {
    try {
      if (!internalUserId) {
        return { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] };
      }

      const { data: quizzes, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', internalUserId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching quiz stats:', error);
        return { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] };
      }

      if (!quizzes || quizzes.length === 0) {
        return { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] };
      }

      const totalAttempts = quizzes.length;
      const averageScore = Math.round(
        quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / totalAttempts
      );
      const bestScore = Math.max(...quizzes.map(q => q.score || 0));
      const totalTime = quizzes.reduce((sum, quiz) => sum + (quiz.time_taken || 0), 0);

      return {
        totalAttempts,
        averageScore,
        bestScore,
        totalTime,
        recentAttempts: quizzes.slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting quiz stats:', error);
      return { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] };
    }
  }

  // Get test-specific statistics with better error handling
  static async getTestStats(internalUserId) {
    try {
      if (!internalUserId) {
        return { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] };
      }

      const { data: tests, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', internalUserId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching test stats:', error);
        return { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] };
      }

      if (!tests || tests.length === 0) {
        return { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] };
      }

      const totalAttempts = tests.length;
      const averageScore = Math.round(
        tests.reduce((sum, test) => sum + (test.score || 0), 0) / totalAttempts
      );
      const bestScore = Math.max(...tests.map(t => t.score || 0));
      const totalTime = tests.reduce((sum, test) => sum + (test.time_taken || 0), 0);

      return {
        totalAttempts,
        averageScore,
        bestScore,
        totalTime,
        recentAttempts: tests.slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting test stats:', error);
      return { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] };
    }
  }

  // Get progress statistics by chapter with better error handling
  static async getProgressStats(internalUserId) {
    try {
      if (!internalUserId) {
        return {
          totalChapters: 0,
          completedChapters: 0,
          strongAreas: [],
          weakAreas: [],
          allProgress: []
        };
      }

      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', internalUserId)
        .order('accuracy', { ascending: false });

      if (error) {
        console.error('Progress stats error:', error);
        return {
          totalChapters: 0,
          completedChapters: 0,
          strongAreas: [],
          weakAreas: [],
          allProgress: []
        };
      }

      if (!progress || progress.length === 0) {
        return {
          totalChapters: 0,
          completedChapters: 0,
          strongAreas: [],
          weakAreas: [],
          allProgress: []
        };
      }

      const strongAreas = progress.filter(p => (p.accuracy || 0) >= 80);
      const weakAreas = progress.filter(p => (p.accuracy || 0) < 60);

      return {
        totalChapters: progress.length,
        completedChapters: progress.filter(p => (p.total_questions_attempted || 0) >= 3).length,
        strongAreas: strongAreas.slice(0, 5),
        weakAreas: weakAreas.slice(0, 5),
        allProgress: progress
      };
    } catch (error) {
      console.error('Error getting progress stats:', error);
      return {
        totalChapters: 0,
        completedChapters: 0,
        strongAreas: [],
        weakAreas: [],
        allProgress: []
      };
    }
  }

  // Calculate study streak with better error handling
  static async getStudyStreak(internalUserId) {
    try {
      if (!internalUserId) {
        return 0;
      }

      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('session_date')
        .eq('user_id', internalUserId)
        .order('session_date', { ascending: false });

      if (error) {
        console.error('Error fetching study sessions for streak:', error);
        return 0;
      }

      if (!sessions || sessions.length === 0) return 0;

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (const session of sessions) {
        const sessionDate = new Date(session.session_date);
        sessionDate.setHours(0, 0, 0, 0);

        const diffTime = currentDate.getTime() - sessionDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === streak) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (diffDays > streak) {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating study streak:', error);
      return 0;
    }
  }

  // Record a study session with better error handling
  static async recordStudySession(googleId, sessionData) {
    try {
      const internalUserId = await this.getUserId(googleId);
      
      if (!internalUserId) {
        console.warn('Cannot record study session: user not found');
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
        console.error('Error fetching existing session:', fetchError);
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
          console.error('Error updating study session:', updateError);
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
          console.error('Error inserting study session:', insertError);
          return null;
        }
      }

      return true;
    } catch (error) {
      console.error('Error recording study session:', error);
      return null;
    }
  }

  // Get personalized recommendations with better error handling
  static async getRecommendations(googleId) {
    try {
      const progressStats = await this.getProgressStats(await this.getUserId(googleId));
      const recommendations = [];

      // Recommend weak areas for improvement
      if (progressStats.weakAreas && progressStats.weakAreas.length > 0) {
        recommendations.push({
          type: 'improvement',
          priority: 'high',
          title: 'Focus on Weak Areas',
          description: `Practice ${progressStats.weakAreas[0].chapter} - your accuracy is ${progressStats.weakAreas[0].accuracy}%`,
          action: 'Take Quiz',
          chapter: progressStats.weakAreas[0].chapter
        });
      }

      // Recommend review of strong areas
      if (progressStats.strongAreas && progressStats.strongAreas.length > 0) {
        const lastAttempted = progressStats.strongAreas.find(area => {
          if (!area.last_practiced) return false;
          const daysSinceLastAttempt = Math.floor(
            (new Date() - new Date(area.last_practiced)) / (1000 * 60 * 60 * 24)
          );
          return daysSinceLastAttempt > 7;
        });

        if (lastAttempted) {
          recommendations.push({
            type: 'review',
            priority: 'medium',
            title: 'Review Strong Areas',
            description: `Review ${lastAttempted.chapter} - maintain your ${lastAttempted.accuracy}% accuracy`,
            action: 'Take Quiz',
            chapter: lastAttempted.chapter
          });
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  // Get achievement progress with better error handling
  static async getAchievementProgress(googleId) {
    try {
      const stats = await this.getUserStats(googleId);
      const achievements = [];

      // First Quiz achievement
      achievements.push({
        id: 'first_quiz',
        name: 'First Quiz',
        description: 'Complete your first quiz',
        earned: (stats.quizzes?.totalAttempts || 0) >= 1,
        progress: Math.min(stats.quizzes?.totalAttempts || 0, 1),
        target: 1
      });

      // Study Streak achievement
      achievements.push({
        id: 'study_streak',
        name: 'Study Streak',
        description: '7 days of continuous study',
        earned: (stats.overall?.studyStreak || 0) >= 7,
        progress: Math.min(stats.overall?.studyStreak || 0, 7),
        target: 7
      });

      // High Scorer achievement
      const highScoreQuizzes = (stats.quizzes?.recentAttempts || []).filter(quiz => (quiz.score || 0) >= 80).length;
      achievements.push({
        id: 'high_scorer',
        name: 'High Scorer',
        description: 'Score above 80% in 5 quizzes',
        earned: highScoreQuizzes >= 5,
        progress: Math.min(highScoreQuizzes, 5),
        target: 5
      });

      // Test Master achievement
      achievements.push({
        id: 'test_master',
        name: 'Test Master',
        description: 'Complete 10 full tests',
        earned: (stats.tests?.totalAttempts || 0) >= 10,
        progress: Math.min(stats.tests?.totalAttempts || 0, 10),
        target: 10
      });

      return achievements;
    } catch (error) {
      console.error('Error getting achievement progress:', error);
      return [];
    }
  }

  // Export user data with better error handling
  static async exportUserData(googleId) {
    try {
      const internalUserId = await this.getUserId(googleId);
      
      if (!internalUserId) {
        throw new Error('User not found');
      }

      const [quizzes, tests, progress, sessions] = await Promise.all([
        supabase.from('quiz_attempts').select('*').eq('user_id', internalUserId),
        supabase.from('test_attempts').select('*').eq('user_id', internalUserId),
        supabase.from('user_progress').select('*').eq('user_id', internalUserId),
        supabase.from('study_sessions').select('*').eq('user_id', internalUserId)
      ]);

      return {
        quizzes: quizzes.data || [],
        tests: tests.data || [],
        progress: progress.data || [],
        sessions: sessions.data || [],
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }
}
