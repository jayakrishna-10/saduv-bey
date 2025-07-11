-- Database Schema for User Profiles
-- Run this SQL in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    paper VARCHAR(50) NOT NULL, -- 'paper1', 'paper2', 'paper3'
    selected_topic VARCHAR(255),
    selected_year INTEGER,
    question_count INTEGER NOT NULL,
    questions_data JSONB NOT NULL, -- Store the actual questions and options
    answers JSONB NOT NULL, -- Store user answers
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL,
    score DECIMAL(5,2) NOT NULL, -- Percentage score
    time_taken INTEGER, -- Time in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test attempts table  
CREATE TABLE IF NOT EXISTS test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_mode VARCHAR(50) NOT NULL, -- 'mock', 'practice', 'timed_practice'
    test_type VARCHAR(50) NOT NULL, -- 'paper1', 'paper2', 'paper3', 'topic', 'custom'
    test_config JSONB NOT NULL, -- Store full test configuration
    questions_data JSONB NOT NULL, -- Store the actual questions
    answers JSONB NOT NULL, -- Store user answers with timestamps
    flagged_questions JSONB, -- Store flagged question indices
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    unanswered INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL,
    score DECIMAL(5,2) NOT NULL, -- Percentage score
    time_taken INTEGER, -- Time in seconds
    time_limit INTEGER, -- Time limit in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress by chapter/topic
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chapter VARCHAR(255) NOT NULL,
    paper VARCHAR(50) NOT NULL,
    total_questions_attempted INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    accuracy DECIMAL(5,2) NOT NULL DEFAULT 0, -- Percentage accuracy
    best_streak INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    last_practiced TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, chapter, paper)
);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    preferred_papers TEXT[] DEFAULT ARRAY['paper1'], -- Array of preferred papers
    daily_goal INTEGER DEFAULT 10, -- Daily question goal
    study_streak INTEGER DEFAULT 0, -- Current study streak in days
    longest_streak INTEGER DEFAULT 0, -- Longest study streak
    last_study_date DATE,
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT false,
    weekly_summary BOOLEAN DEFAULT true,
    theme_preference VARCHAR(20) DEFAULT 'system', -- 'light', 'dark', 'system'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study sessions for tracking daily activity
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    questions_answered INTEGER NOT NULL DEFAULT 0,
    quiz_attempts INTEGER NOT NULL DEFAULT 0,
    test_attempts INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL DEFAULT 0, -- Time in seconds
    topics_studied TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of topics studied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, session_date)
);

-- Achievement system (optional for gamification)
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- 'first_quiz', 'perfect_score', 'study_streak_7', etc.
    achievement_name VARCHAR(255) NOT NULL,
    achievement_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_paper ON quiz_attempts(paper);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed_at ON quiz_attempts(completed_at);

CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_type ON test_attempts(test_type);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed_at ON test_attempts(completed_at);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_chapter ON user_progress(chapter);
CREATE INDEX IF NOT EXISTS idx_user_progress_paper ON user_progress(paper);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(session_date);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_policy ON users FOR ALL USING (auth.uid()::text = google_id);
CREATE POLICY quiz_attempts_policy ON quiz_attempts FOR ALL USING (user_id IN (SELECT id FROM users WHERE google_id = auth.uid()::text));
CREATE POLICY test_attempts_policy ON test_attempts FOR ALL USING (user_id IN (SELECT id FROM users WHERE google_id = auth.uid()::text));
CREATE POLICY user_progress_policy ON user_progress FOR ALL USING (user_id IN (SELECT id FROM users WHERE google_id = auth.uid()::text));
CREATE POLICY user_preferences_policy ON user_preferences FOR ALL USING (user_id IN (SELECT id FROM users WHERE google_id = auth.uid()::text));
CREATE POLICY study_sessions_policy ON study_sessions FOR ALL USING (user_id IN (SELECT id FROM users WHERE google_id = auth.uid()::text));
CREATE POLICY user_achievements_policy ON user_achievements FOR ALL USING (user_id IN (SELECT id FROM users WHERE google_id = auth.uid()::text));

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_sessions_updated_at BEFORE UPDATE ON study_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();