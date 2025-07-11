// app/lib/analytics.js - Fixed with proper authentication
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

  // Record a quiz attempt
  static async recordQuizAttempt(userId, quizData) {
    try {
      // Get the user's internal ID from the Google ID
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('google_id', userId)
        .single();

      if (userError || !user) {
        console.error('User not found:', userError);
        throw new Error('User not found');
      }

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          paper: quizData.paper || 'paper1',
          selected_topic: quizData.chapter,
          selected_year: new Date().getFullYear(),
          question_count: quizData.totalQuestions,
          questions_data: quizData.questionsData,
          answers: quizData.questionsData.reduce((acc, q) => {
            acc[q.questionId] = q.selectedOption;
            return acc;
          }, {}),
          correct_answers: quizData.correctAnswers,
          total_questions: quizData.totalQuestions,
          score: quizData.score,
          time_taken: quizData.timeTaken,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update user progress
      await this.updateUserProgress(user.id, quizData.chapter, 'paper1', quizData.score);

      return data;
    } catch (error) {
      console.error('Error recording quiz attempt:', error);
      // Don't throw error, just log it to prevent breaking the UI
      return null;
    }
  }

  // Record a test attempt
  static async recordTestAttempt(userId, testData) {
    try {
      // Get the user's internal ID from the Google ID
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('google_id', userId)
        .single();

      if (userError || !user) {
        console.error('User not found:', userError);
        throw new Error('User not found');
      }

      const { data, error } = await supabase
        .from('test_attempts')
        .insert({
          user_id: user.id,
          test_mode: testData.testType,
          test_type: testData.testType,
          test_config: { type: testData.testType },
          questions_data: testData.questionsData,
          answers: testData.questionsData.reduce((acc, q) => {
            acc[q.questionId] = q.selectedOption;
            return acc;
          }, {}),
          correct_answers: testData.correctAnswers,
          incorrect_answers: testData.totalQuestions - testData.correctAnswers - (testData.unanswered || 0),
          unanswered: testData.unanswered || 0,
          total_questions: testData.totalQuestions,
          score: testData.score,
          time_taken: testData.timeTaken,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update user progress for each chapter
      for (const chapter of testData.chapters) {
        await this.updateUserProgress(user.id, chapter, 'mixed', testData.score);
      }

      return data;
    } catch (error) {
      console.error('Error recording test attempt:', error);
      // Don't throw error, just log it to prevent breaking the UI
      return null;
    }
  }

  // Update user progress for a chapter
  static async updateUserProgress(internalUserId, chapter, paper, score) {
    try {
      // Get existing progress
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', internalUserId)
        .eq('chapter', chapter)
        .eq('paper', paper)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProgress) {
        // Update existing progress
        const newAttempts = existingProgress.total_questions_attempted + 1;
        const newCorrect = existingProgress.correct_answers + (score >= 60 ? 1 : 0);
        const newAccuracy = Math.round((newCorrect / newAttempts) * 100);
        const newCurrentStreak = score >= 60 ? existingProgress.current_streak + 1 : 0;
        const newBestStreak = Math.max(existingProgress.best_streak, newCurrentStreak);

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

        if (updateError) throw updateError;
      } else {
        // Create new progress entry
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: internalUserId,
            chapter: chapter,
            paper: paper,
            total_questions_attempted: 1,
            correct_answers: score >= 60 ? 1 : 0,
            accuracy: score >= 60 ? 100 : 0,
            current_streak: score >= 60 ? 1 : 0,
            best_streak: score >= 60 ? 1 : 0,
            last_practiced: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
      // Don't throw error, just log it
    }
  }

  // Get user statistics - FIXED VERSION
  static async getUserStats(googleId) {
    try {
      // First get the user's internal ID
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('google_id', googleId)
        .single();

      if (userError || !user) {
        console.error('User not found:', userError);
        // Return empty stats instead of throwing error
        return {
          quizzes: { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] },
          tests: { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] },
          progress: { totalChapters: 0, completedChapters: 0, strongAreas: [], weakAreas: [], allProgress: [] },
          overall: { totalAttempts: 0, averageScore: 0, studyTime: 0, studyStreak: 0 }
        };
      }

      const [quizStats, testStats, progressStats] = await Promise.all([
        this.getQuizStats(user.id),
        this.getTestStats(user.id),
        this.getProgressStats(user.id)
      ]);

      return {
        quizzes: quizStats,
        tests: testStats,
        progress: progressStats,
        overall: {
          totalAttempts: quizStats.totalAttempts + testStats.totalAttempts,
          averageScore: Math.round((quizStats.averageScore + testStats.averageScore) / 2),
          studyTime: quizStats.totalTime + testStats.totalTime,
          studyStreak: await this.getStudyStreak(user.id)
        }
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      // Return empty stats instead of throwing error
      return {
        quizzes: { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] },
        tests: { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTime: 0, recentAttempts: [] },
        progress: { totalChapters: 0, completedChapters: 0, strongAreas: [], weakAreas: [], allProgress: [] },
        overall: { totalAttempts: 0, averageScore: 0, studyTime: 0, studyStreak: 0 }
      };
    }
  }

  // Get quiz-specific statistics
  static async getQuizStats(internalUserId) {
    try {
      const { data: quizzes, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', internalUserId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      if (!quizzes || quizzes.length === 0) {
        return {
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalTime: 0,
          recentAttempts: []
        };
      }

      const totalAttempts = quizzes.length;
      const averageScore = Math.round(
        quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / totalAttempts
      );
      const bestScore = Math.max(...quizzes.map(q => q.score));
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
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        totalTime: 0,
        recentAttempts: []
      };
    }
  }

  // Get test-specific statistics
  static async getTestStats(internalUserId) {
    try {
      const { data: tests, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', internalUserId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      if (!tests || tests.length === 0) {
        return {
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          totalTime: 0,
          recentAttempts: []
        };
      }

      const totalAttempts = tests.length;
      const averageScore = Math.round(
        tests.reduce((sum, test) => sum + test.score, 0) / totalAttempts
      );
      const bestScore = Math.max(...tests.map(t => t.score));
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
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        totalTime: 0,
        recentAttempts: []
      };
    }
  }

  // Get progress statistics by chapter - FIXED VERSION
  static async getProgressStats(internalUserId) {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', internalUserId)
        .order('accuracy', { ascending: false });

      if (error) {
        console.error('Progress stats error:', error);
        throw error;
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

      const strongAreas = progress.filter(p => p.accuracy >= 80);
      const weakAreas = progress.filter(p => p.accuracy < 60);

      return {
        totalChapters: progress.length,
        completedChapters: progress.filter(p => p.total_questions_attempted >= 3).length,
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

  // Calculate study streak
  static async getStudyStreak(internalUserId) {
    try {
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('session_date')
        .eq('user_id', internalUserId)
        .order('session_date', { ascending: false });

      if (error) throw error;

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

  // Record a study session
  static async recordStudySession(userId, sessionData) {
    try {
      // Get the user's internal ID from the Google ID
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('google_id', userId)
        .single();

      if (userError || !user) {
        console.error('User not found for study session:', userError);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingSession, error: fetchError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_date', today)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingSession) {
        // Update existing session
        const { error: updateError } = await supabase
          .from('study_sessions')
          .update({
            questions_answered: existingSession.questions_answered + (sessionData.questionsAnswered || 0),
            quiz_attempts: existingSession.quiz_attempts + (sessionData.quiz_attempts || 1),
            test_attempts: existingSession.test_attempts + (sessionData.test_attempts || 0),
            time_spent: existingSession.time_spent + (sessionData.duration || 0),
            topics_studied: [...new Set([...existingSession.topics_studied, ...(sessionData.topics_studied || [])])]
          })
          .eq('id', existingSession.id);

        if (updateError) throw updateError;
      } else {
        // Create new session
        const { error: insertError } = await supabase
          .from('study_sessions')
          .insert({
            user_id: user.id,
            session_date: today,
            questions_answered: sessionData.questionsAnswered || 0,
            quiz_attempts: sessionData.quiz_attempts || 1,
            test_attempts: sessionData.test_attempts || 0,
            time_spent: sessionData.duration || 0,
            topics_studied: sessionData.topics_studied || []
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error recording study session:', error);
      // Don't throw error
    }
  }

  // Get personalized recommendations
  static async getRecommendations(googleId) {
    try {
      const progressStats = await this.getProgressStats(googleId);
      const recommendations = [];

      // Recommend weak areas for improvement
      if (progressStats.weakAreas.length > 0) {
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
      if (progressStats.strongAreas.length > 0) {
        const lastAttempted = progressStats.strongAreas.find(area => {
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

  // Get achievement progress
  static async getAchievementProgress(googleId) {
    try {
      const stats = await this.getUserStats(googleId);
      const achievements = [];

      // First Quiz achievement
      achievements.push({
        id: 'first_quiz',
        name: 'First Quiz',
        description: 'Complete your first quiz',
        earned: stats.quizzes.totalAttempts >= 1,
        progress: Math.min(stats.quizzes.totalAttempts, 1),
        target: 1
      });

      // Study Streak achievement
      achievements.push({
        id: 'study_streak',
        name: 'Study Streak',
        description: '7 days of continuous study',
        earned: stats.overall.studyStreak >= 7,
        progress: Math.min(stats.overall.studyStreak, 7),
        target: 7
      });

      // High Scorer achievement
      const highScoreQuizzes = stats.quizzes.recentAttempts?.filter(quiz => quiz.score >= 80).length || 0;
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
        earned: stats.tests.totalAttempts >= 10,
        progress: Math.min(stats.tests.totalAttempts, 10),
        target: 10
      });

      return achievements;
    } catch (error) {
      console.error('Error getting achievement progress:', error);
      return [];
    }
  }

  // Export user data
  static async exportUserData(googleId) {
    try {
      // Get the user's internal ID
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('google_id', googleId)
        .single();

      if (userError || !user) {
        throw new Error('User not found');
      }

      const [quizzes, tests, progress, sessions] = await Promise.all([
        supabase.from('quiz_attempts').select('*').eq('user_id', user.id),
        supabase.from('test_attempts').select('*').eq('user_id', user.id),
        supabase.from('user_progress').select('*').eq('user_id', user.id),
        supabase.from('study_sessions').select('*').eq('user_id', user.id)
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
