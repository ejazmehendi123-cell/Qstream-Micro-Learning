import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export function calculateSpacedInterval(accuracy, currentInterval = 1, repetitionCount = 0) {
  let nextDays = 1;

  if (accuracy < 40) {
    nextDays = 1;
  } else if (accuracy < 60) {
    nextDays = 2;
  } else if (accuracy < 80) {
    nextDays = 5;
  } else if (accuracy < 90) {
    nextDays = 10;
  } else {
    // 90%+
    nextDays = Math.min(30, Math.max(20, Math.round(currentInterval * 2.2)));
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextDays);

  return {
    intervalDays: nextDays,
    nextReviewAt: nextReviewDate.toISOString(),
    repetitionCount: repetitionCount + 1
  };
}

export async function scheduleTopicRevision({ userId, topic, subtopic = '', accuracy }) {
  if (!userId || !topic) return;

  const { intervalDays, nextReviewAt, repetitionCount } = calculateSpacedInterval(accuracy);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: existing } = await supabase
        .from('revision_schedule')
        .select('*')
        .eq('user_id', userId)
        .eq('topic', topic)
        .eq('subtopic', subtopic || '')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('revision_schedule')
          .update({
            interval_days: intervalDays,
            next_review_at: nextReviewAt,
            repetition_count: existing.repetition_count + 1,
            status: 'pending'
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('revision_schedule')
          .insert({
            user_id: userId,
            topic,
            subtopic: subtopic || '',
            interval_days: intervalDays,
            next_review_at: nextReviewAt,
            repetition_count: 1,
            status: 'pending'
          });
      }
    } catch (err) {
      console.warn('[Schedule Revision Error]', err.message);
    }
  }
}

export async function getDueRevisions(userId) {
  if (!userId) return [];

  if (isSupabaseConfigured && supabase) {
    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('revision_schedule')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_at', nowIso)
        .order('next_review_at', { ascending: true });

      if (!error && data) return data;
    } catch (err) {
      console.warn('[Get Due Revisions Error]', err.message);
    }
  }

  // Fallback due revisions
  return [
    {
      id: 'rev-001',
      topic: 'JavaScript',
      subtopic: 'Closures & Scopes',
      next_review_at: new Date(Date.now() - 3600000).toISOString(),
      interval_days: 1,
      repetition_count: 2,
      status: 'pending'
    },
    {
      id: 'rev-002',
      topic: 'React',
      subtopic: 'Virtual DOM & Reconciliation',
      next_review_at: new Date(Date.now() - 7200000).toISOString(),
      interval_days: 2,
      repetition_count: 1,
      status: 'pending'
    },
    {
      id: 'rev-003',
      topic: 'PostgreSQL',
      subtopic: 'Window Functions & CTEs',
      next_review_at: new Date(Date.now() - 14400000).toISOString(),
      interval_days: 5,
      repetition_count: 3,
      status: 'pending'
    }
  ];
}
