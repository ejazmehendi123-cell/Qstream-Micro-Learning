-- ====================================================
-- QSTREAM AI - 001_initial_schema.sql
-- Core PostgreSQL schema with primary/foreign keys, 
-- constraints, UUID generation and timestamps.
-- ====================================================

-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    learning_goal TEXT DEFAULT 'Full Stack Web Development',
    preferred_difficulty TEXT CHECK (preferred_difficulty IN ('easy', 'medium', 'hard', 'advanced')) DEFAULT 'medium',
    daily_goal_minutes INT DEFAULT 30 CHECK (daily_goal_minutes > 0),
    streak INT DEFAULT 0 CHECK (streak >= 0),
    longest_streak INT DEFAULT 0 CHECK (longest_streak >= 0),
    total_learning_minutes INT DEFAULT 0 CHECK (total_learning_minutes >= 0),
    xp INT DEFAULT 0 CHECK (xp >= 0),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. LEARNING PATHS TABLE
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')) DEFAULT 'Beginner',
    estimated_minutes INT NOT NULL CHECK (estimated_minutes > 0),
    thumbnail TEXT,
    prerequisites TEXT[] DEFAULT '{}',
    learning_objectives TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INT NOT NULL CHECK (order_index >= 0),
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'advanced')) DEFAULT 'medium',
    estimated_minutes INT NOT NULL CHECK (estimated_minutes > 0),
    topic TEXT NOT NULL,
    subtopic TEXT DEFAULT '',
    learning_objectives TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_module_path_slug UNIQUE (learning_path_id, slug)
);

-- 4. USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    completion_percentage NUMERIC(5,2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    time_spent INT DEFAULT 0 CHECK (time_spent >= 0),
    last_accessed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_module_progress UNIQUE (user_id, module_id)
);

-- 5. LEARNING NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL UNIQUE REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    code_examples JSONB DEFAULT '[]'::jsonb,
    key_concepts JSONB DEFAULT '[]'::jsonb,
    common_mistakes JSONB DEFAULT '[]'::jsonb,
    interview_questions JSONB DEFAULT '[]'::jsonb,
    quick_revision JSONB DEFAULT '[]'::jsonb,
    related_topics JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. QUESTIONS BANK TABLE
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INT NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
    explanation TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'advanced')) DEFAULT 'medium',
    topic TEXT NOT NULL,
    subtopic TEXT DEFAULT '',
    source TEXT DEFAULT 'question_bank',
    learning_objective TEXT,
    question_hash TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL CHECK (score >= 0),
    total_questions INT NOT NULL CHECK (total_questions > 0),
    correct_answers INT NOT NULL CHECK (correct_answers >= 0),
    wrong_answers INT NOT NULL CHECK (wrong_answers >= 0),
    accuracy NUMERIC(5,2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
    time_spent INT NOT NULL CHECK (time_spent >= 0),
    difficulty TEXT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. QUIZ ATTEMPT ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    selected_answer INT CHECK (selected_answer >= 0 AND selected_answer <= 3),
    is_correct BOOLEAN NOT NULL,
    time_spent INT DEFAULT 0 CHECK (time_spent >= 0)
);

-- 9. TOPIC PERFORMANCE TABLE
CREATE TABLE IF NOT EXISTS public.topic_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    subtopic TEXT DEFAULT '',
    attempts INT DEFAULT 0 CHECK (attempts >= 0),
    correct_answers INT DEFAULT 0 CHECK (correct_answers >= 0),
    wrong_answers INT DEFAULT 0 CHECK (wrong_answers >= 0),
    accuracy NUMERIC(5,2) DEFAULT 0 CHECK (accuracy >= 0 AND accuracy <= 100),
    average_time NUMERIC(8,2) DEFAULT 0 CHECK (average_time >= 0),
    last_attempt_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_topic_subtopic UNIQUE (user_id, topic, subtopic)
);

-- 10. REVISION SCHEDULE TABLE (Spaced Repetition)
CREATE TABLE IF NOT EXISTS public.revision_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    subtopic TEXT DEFAULT '',
    next_review_at TIMESTAMPTZ NOT NULL,
    interval_days INT DEFAULT 1 CHECK (interval_days > 0),
    repetition_count INT DEFAULT 0 CHECK (repetition_count >= 0),
    ease_factor NUMERIC(4,2) DEFAULT 2.50 CHECK (ease_factor >= 1.30),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    CONSTRAINT unique_user_revision_topic UNIQUE (user_id, topic, subtopic)
);

-- 11. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    certificate_id TEXT UNIQUE NOT NULL,
    completion_percentage NUMERIC(5,2) NOT NULL CHECK (completion_percentage >= 100),
    completion_date TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    verification_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_path_cert UNIQUE (user_id, learning_path_id)
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'reminder', 'achievement')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
