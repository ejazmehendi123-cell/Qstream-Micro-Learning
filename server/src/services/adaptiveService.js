import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export function calculateDifficultyFromAccuracy(accuracy) {
  if (accuracy < 40) return 'easy';
  if (accuracy < 70) return 'medium';
  if (accuracy < 85) return 'hard';
  return 'advanced';
}

export async function updateUserTopicPerformance({
  userId,
  topic,
  subtopic = '',
  isCorrect,
  timeSpent = 0
}) {
  if (!userId || !topic) return;

  if (isSupabaseConfigured && supabase) {
    try {
      // Fetch existing performance
      const { data: existing } = await supabase
        .from('topic_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('topic', topic)
        .eq('subtopic', subtopic || '')
        .maybeSingle();

      if (existing) {
        const attempts = existing.attempts + 1;
        const correctAnswers = existing.correct_answers + (isCorrect ? 1 : 0);
        const wrongAnswers = existing.wrong_answers + (isCorrect ? 0 : 1);
        const accuracy = Math.round((correctAnswers / attempts) * 100);
        const averageTime = Math.round(((existing.average_time * existing.attempts) + timeSpent) / attempts);

        await supabase
          .from('topic_performance')
          .update({
            attempts,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
            accuracy,
            average_time: averageTime,
            last_attempt_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('topic_performance')
          .insert({
            user_id: userId,
            topic,
            subtopic: subtopic || '',
            attempts: 1,
            correct_answers: isCorrect ? 1 : 0,
            wrong_answers: isCorrect ? 0 : 1,
            accuracy: isCorrect ? 100 : 0,
            average_time: timeSpent,
            last_attempt_at: new Date().toISOString()
          });
      }
    } catch (err) {
      console.warn('[Topic Performance Update Error]', err.message);
    }
  }
}

export async function getUserTopicPerformance(userId) {
  if (!userId) return [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('topic_performance')
        .select('*')
        .eq('user_id', userId)
        .order('accuracy', { ascending: true });

      if (!error && data) return data;
    } catch (err) {
      console.warn('[Get Topic Performance Error]', err.message);
    }
  }

  // Fallback demo topic performance
  return [
    { topic: 'JavaScript', subtopic: 'Closures', accuracy: 35, attempts: 6, average_time: 25 },
    { topic: 'React', subtopic: 'Reconciliation', accuracy: 58, attempts: 8, average_time: 32 },
    { topic: 'Node.js', subtopic: 'Event Loop', accuracy: 78, attempts: 10, average_time: 20 },
    { topic: 'PostgreSQL', subtopic: 'Indexes & Query Plans', accuracy: 88, attempts: 12, average_time: 28 },
    { topic: 'Docker', subtopic: 'Multi-stage Builds', accuracy: 92, attempts: 14, average_time: 18 }
  ];
}
