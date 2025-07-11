// app/lib/analytics.js - Analytics and progress tracking utilities
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export class AnalyticsService {
  // Record a quiz attempt
  static async recordQuizAttempt(userId, quizData) {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          chapter: quizData.chapter,
          total_questions: quizData.totalQuestions,
          correct_answers: quizData.correctAnswers,
          score: quizData.score,
          time_taken: quizData.timeTaken,
          questions_data: quizData.questionsData,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update user progress
      await this.updateUserProgress(userId, quizData.chapter, 'quiz', quizData.score);

      return data;
    } catch (error) {
      console.error('Error recording quiz attempt:', error);
      throw error;
    }
  }

  // Record a test attempt
  static async recordTestAttempt(userId, testData) {
    try {
      const { data, error } = await supabase
        .from('test_attempts')
        .insert({
          user_id: userId,
          test_type: testData.testType,
          chapters: testData.chapters,
          total_questions: testData.totalQuestions,
          correct_answers: testData.correctAnswers,
          score: testData.score,
          time_taken: testData.timeTaken,
          questions_data: testData.questionsData,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update user progress for each chapter
      for (const chapter of testData.chapters) {
        await this.updateUserProgress(userId, chapter, 'test', testData.score);
      }

      return data;
    } catch (error) {
      console.error('Error recording test attempt:', error);
      throw error;
    }
  }

  // Update user progress for a chapter
  static async updateUserProgress(userId, chapter, activityType, score) {
    try {
      // Get existing progress
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter', chapter)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProgress) {
        // Update existing progress
        const newAttempts = existingProgress.attempts + 1;
        const newTotalScore = existingProgress.total_score + score;
        const newAverageScore = Math.round(newTotalScore / newAttempts);
        const newBestScore = Math.max(existingProgress.best_score, score);

        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            attempts: newAttempts,
            total_score: newTotalScore,
            average_score: newAverageScore,
            best_score: newBestScore,
            last_attempted: new Date().toISOString(),
            mastery_level: this.calculateMasteryLevel(newAverageScore, newAttempts)
          })
          .eq('user_id', userId)
          .eq('chapter', chapter);

        if (updateError) throw updateError;
      } else {
        // Create new progress entry
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: userId,
            chapter: chapter,
            attempts: 1,
            total_score: score,
            average_score: score,
            best_score: score,
            last_attempted: new Date().toISOString(),
            mastery_level: this.calculateMasteryLevel(score, 1)
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  }

  // Calculate mastery level based on average score and attempts
  static calculateMasteryLevel(averageScore, attempts) {
    if (attempts >= 5 && averageScore >= 90) return 'expert';
    if (attempts >= 3 && averageScore >= 80) return 'advanced';
    if (attempts >= 2 && averageScore >= 70) return 'intermediate';
    if (attempts >= 1 && averageScore >= 60) return 'beginner';
    return 'novice';
  }

  // Get user statistics
  static async getUserStats(userId) {
    try {
      const [quizStats, testStats, progressStats] = await Promise.all([
        this.getQuizStats(userId),
        this.getTestStats(userId),
        this.getProgressStats(userId)
      ]);

      return {
        quizzes: quizStats,
        tests: testStats,
        progress: progressStats,
        overall: {
          totalAttempts: quizStats.totalAttempts + testStats.totalAttempts,
          averageScore: Math.round((quizStats.averageScore + testStats.averageScore) / 2),
          studyTime: quizStats.totalTime + testStats.totalTime,
          studyStreak: await this.getStudyStreak(userId)
        }
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Get quiz-specific statistics
  static async getQuizStats(userId) {
    try {
      const { data: quizzes, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
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
      throw error;
    }
  }

  // Get test-specific statistics
  static async getTestStats(userId) {
    try {
      const { data: tests, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', userId)
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
      throw error;
    }
  }

  // Get progress statistics by chapter
  static async getProgressStats(userId) {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('average_score', { ascending: false });

      if (error) throw error;

      if (!progress || progress.length === 0) {
        return {
          totalChapters: 0,
          completedChapters: 0,
          strongAreas: [],
          weakAreas: [],
          masteryDistribution: {}
        };
      }

      const strongAreas = progress.filter(p => p.average_score >= 80);
      const weakAreas = progress.filter(p => p.average_score < 60);
      
      const masteryDistribution = progress.reduce((acc, p) => {
        acc[p.mastery_level] = (acc[p.mastery_level] || 0) + 1;
        return acc;
      }, {});

      return {
        totalChapters: progress.length,
        completedChapters: progress.filter(p => p.attempts >= 3).length,
        strongAreas: strongAreas.slice(0, 5),
        weakAreas: weakAreas.slice(0, 5),
        masteryDistribution,
        allProgress: progress
      };
    } catch (error) {
      console.error('Error getting progress stats:', error);
      throw error;
    }
  }

  // Calculate study streak
  static async getStudyStreak(userId) {
    try {
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('session_date')
        .eq('user_id', userId)
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
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingSession, error: fetchError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
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
            duration_minutes: existingSession.duration_minutes + sessionData.duration,
            activities_completed: existingSession.activities_completed + 1,
            questions_answered: existingSession.questions_answered + (sessionData.questionsAnswered || 0)
          })
          .eq('user_id', userId)
          .eq('session_date', today);

        if (updateError) throw updateError;
      } else {
        // Create new session
        const { error: insertError } = await supabase
          .from('study_sessions')
          .insert({
            user_id: userId,
            session_date: today,
            duration_minutes: sessionData.duration,
            activities_completed: 1,
            questions_answered: sessionData.questionsAnswered || 0
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error recording study session:', error);
      throw error;
    }
  }

  // Get personalized recommendations
  static async getRecommendations(userId) {
    try {
      const progressStats = await this.getProgressStats(userId);
      const recommendations = [];

      // Recommend weak areas for improvement
      if (progressStats.weakAreas.length > 0) {
        recommendations.push({
          type: 'improvement',
          priority: 'high',
          title: 'Focus on Weak Areas',
          description: `Practice ${progressStats.weakAreas[0].chapter} - your accuracy is ${progressStats.weakAreas[0].average_score}%`,
          action: 'Take Quiz',
          chapter: progressStats.weakAreas[0].chapter
        });
      }

      // Recommend review of strong areas
      if (progressStats.strongAreas.length > 0) {
        const lastAttempted = progressStats.strongAreas.find(area => {
          const daysSinceLastAttempt = Math.floor(
            (new Date() - new Date(area.last_attempted)) / (1000 * 60 * 60 * 24)
          );
          return daysSinceLastAttempt > 7;
        });

        if (lastAttempted) {
          recommendations.push({
            type: 'review',
            priority: 'medium',
            title: 'Review Strong Areas',
            description: `Review ${lastAttempted.chapter} - maintain your ${lastAttempted.average_score}% accuracy`,
            action: 'Take Quiz',
            chapter: lastAttempted.chapter
          });
        }
      }

      // Recommend taking a comprehensive test
      const quizStats = await this.getQuizStats(userId);
      if (quizStats.totalAttempts >= 10) {
        recommendations.push({
          type: 'assessment',
          priority: 'medium',
          title: 'Take a Comprehensive Test',
          description: 'Test your knowledge across multiple chapters',
          action: 'Take Test',
          chapter: 'mixed'
        });
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  // Get achievement progress
  static async getAchievementProgress(userId) {
    try {
      const stats = await this.getUserStats(userId);
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
  static async exportUserData(userId) {
    try {
      const [quizzes, tests, progress, sessions] = await Promise.all([
        supabase.from('quiz_attempts').select('*').eq('user_id', userId),
        supabase.from('test_attempts').select('*').eq('user_id', userId),
        supabase.from('user_progress').select('*').eq('user_id', userId),
        supabase.from('study_sessions').select('*').eq('user_id', userId)
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