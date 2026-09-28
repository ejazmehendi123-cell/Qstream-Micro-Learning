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
