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
