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
-- ====================================================
-- QSTREAM AI - 002_rls_policies.sql
-- Row Level Security (RLS) policies for complete data isolation.
-- ====================================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
-- Anyone authenticated can view public profile details (for leaderboards)
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Service role has full access
CREATE POLICY "Service role full access on profiles"
    ON public.profiles FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. LEARNING PATHS POLICIES
-- Anyone can view published learning paths
CREATE POLICY "Published learning paths are viewable by everyone"
    ON public.learning_paths FOR SELECT
    USING (is_published = true);

CREATE POLICY "Service role full access on learning_paths"
    ON public.learning_paths FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. MODULES POLICIES
CREATE POLICY "Modules are viewable by everyone"
    ON public.modules FOR SELECT
    USING (true);

CREATE POLICY "Service role full access on modules"
    ON public.modules FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. NOTES POLICIES
CREATE POLICY "Notes are viewable by authenticated users"
    ON public.notes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role full access on notes"
    ON public.notes FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. QUESTIONS POLICIES
-- Standard reads restricted or handled via secure backend service
CREATE POLICY "Questions readable by authenticated users"
    ON public.questions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role full access on questions"
    ON public.questions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 6. USER PROGRESS POLICIES
CREATE POLICY "Users can manage own progress"
    ON public.user_progress FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on user_progress"
    ON public.user_progress FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 7. QUIZ ATTEMPTS POLICIES
CREATE POLICY "Users can view own quiz attempts"
    ON public.quiz_attempts FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
    ON public.quiz_attempts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on quiz_attempts"
    ON public.quiz_attempts FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8. QUIZ ATTEMPT ANSWERS POLICIES
CREATE POLICY "Users can view own attempt answers"
    ON public.quiz_attempt_answers FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts
            WHERE quiz_attempts.id = quiz_attempt_answers.attempt_id
            AND quiz_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own attempt answers"
    ON public.quiz_attempt_answers FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts
            WHERE quiz_attempts.id = quiz_attempt_answers.attempt_id
            AND quiz_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role full access on quiz_attempt_answers"
    ON public.quiz_attempt_answers FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 9. TOPIC PERFORMANCE POLICIES
CREATE POLICY "Users can manage own topic performance"
    ON public.topic_performance FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on topic_performance"
    ON public.topic_performance FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 10. REVISION SCHEDULE POLICIES
CREATE POLICY "Users can manage own revision schedule"
    ON public.revision_schedule FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on revision_schedule"
    ON public.revision_schedule FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 11. CERTIFICATES POLICIES
CREATE POLICY "Certificates are viewable by anyone for public verification"
    ON public.certificates FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own certificates"
    ON public.certificates FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on certificates"
    ON public.certificates FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 12. NOTIFICATIONS POLICIES
CREATE POLICY "Users can manage own notifications"
    ON public.notifications FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on notifications"
    ON public.notifications FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
-- ====================================================
-- QSTREAM AI - 003_functions_triggers.sql
-- Functions & Triggers: Automatic Profile Creation, 
-- updated_at handlers, and streak maintenance.
-- ====================================================

-- 1. Helper to auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_learning_paths_updated_at ON public.learning_paths;
CREATE TRIGGER set_learning_paths_updated_at
    BEFORE UPDATE ON public.learning_paths
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_modules_updated_at ON public.modules;
CREATE TRIGGER set_modules_updated_at
    BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_notes_updated_at ON public.notes;
CREATE TRIGGER set_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Automatic profile creation when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        learning_goal,
        preferred_difficulty,
        daily_goal_minutes,
        streak,
        longest_streak,
        total_learning_minutes,
        xp
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id),
        COALESCE(NEW.raw_user_meta_data->>'learning_goal', 'Full Stack Web Development'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_difficulty', 'medium'),
        30,
        1,
        1,
        0,
        50
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert welcome notification
    INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type
    ) VALUES (
        NEW.id,
        'Welcome to Qstream AI! 🚀',
        'Welcome aboard! Start by exploring your personalized learning paths and taking your first diagnostic quiz.',
        'achievement'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- ====================================================
-- QSTREAM AI - 004_indexes.sql
-- High performance PostgreSQL indexes for fast queries.
-- ====================================================

CREATE INDEX IF NOT EXISTS idx_learning_paths_slug ON public.learning_paths (slug);
CREATE INDEX IF NOT EXISTS idx_learning_paths_category ON public.learning_paths (category);
CREATE INDEX IF NOT EXISTS idx_learning_paths_published ON public.learning_paths (is_published);

CREATE INDEX IF NOT EXISTS idx_modules_path_id ON public.modules (learning_path_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules (learning_path_id, order_index);
CREATE INDEX IF NOT EXISTS idx_modules_topic ON public.modules (topic);

CREATE INDEX IF NOT EXISTS idx_notes_module_id ON public.notes (module_id);

CREATE INDEX IF NOT EXISTS idx_questions_module_id ON public.questions (module_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions (topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions (difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_hash ON public.questions (question_hash);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_module ON public.user_progress (user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON public.user_progress (status);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_module ON public.quiz_attempts (module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_date ON public.quiz_attempts (completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt ON public.quiz_attempt_answers (attempt_id);

CREATE INDEX IF NOT EXISTS idx_topic_perf_user ON public.topic_performance (user_id);
CREATE INDEX IF NOT EXISTS idx_topic_perf_topic ON public.topic_performance (user_id, topic);

CREATE INDEX IF NOT EXISTS idx_revision_user_status ON public.revision_schedule (user_id, status);
CREATE INDEX IF NOT EXISTS idx_revision_next_review ON public.revision_schedule (user_id, next_review_at);

CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_token ON public.certificates (verification_token);
CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON public.certificates (certificate_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_date ON public.notifications (user_id, created_at DESC);
