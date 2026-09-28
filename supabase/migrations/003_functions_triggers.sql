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
