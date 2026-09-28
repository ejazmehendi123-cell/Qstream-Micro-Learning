import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { getUserTopicPerformance } from '../services/adaptiveService.js';
import { sendSuccess } from '../utils/responseUtil.js';

export async function getUserAnalytics(req, res) {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';

  let totalQuizzes = 14;
  let averageAccuracy = 78;
  let totalTimeMinutes = 240;
  let correctAnswers = 58;
  let wrongAnswers = 16;
  let completedModules = 8;
  let streakDays = 5;

  let weeklyAccuracy = [
    { day: 'Mon', accuracy: 72, quizzes: 2 },
    { day: 'Tue', accuracy: 80, quizzes: 3 },
    { day: 'Wed', accuracy: 68, quizzes: 1 },
    { day: 'Thu', accuracy: 85, quizzes: 3 },
    { day: 'Fri', accuracy: 90, quizzes: 2 },
    { day: 'Sat', accuracy: 76, quizzes: 2 },
    { day: 'Sun', accuracy: 82, quizzes: 1 }
  ];

  let learningTime = [
    { day: 'Mon', minutes: 25 },
    { day: 'Tue', minutes: 40 },
    { day: 'Wed', minutes: 20 },
    { day: 'Thu', minutes: 45 },
    { day: 'Fri', minutes: 35 },
    { day: 'Sat', minutes: 50 },
    { day: 'Sun', minutes: 25 }
  ];

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Fetch real user attempts
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId);

      if (attempts && attempts.length > 0) {
        totalQuizzes = attempts.length;
        const totalAccuracySum = attempts.reduce((acc, curr) => acc + Number(curr.accuracy), 0);
        averageAccuracy = Math.round(totalAccuracySum / attempts.length);
        correctAnswers = attempts.reduce((acc, curr) => acc + Number(curr.correct_answers), 0);
        wrongAnswers = attempts.reduce((acc, curr) => acc + Number(curr.wrong_answers), 0);
        const totalSeconds = attempts.reduce((acc, curr) => acc + Number(curr.time_spent), 0);
        totalTimeMinutes = Math.round(totalSeconds / 60);

        // Group attempts by day of week
        const daysMap = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        attempts.forEach(att => {
          const d = new Date(att.completed_at);
          const name = dayNames[d.getDay()];
          if (daysMap[name]) daysMap[name].push(att);
        });

        weeklyAccuracy = Object.keys(daysMap).map(day => {
          const list = daysMap[day];
          const avg = list.length > 0
            ? Math.round(list.reduce((s, a) => s + Number(a.accuracy), 0) / list.length)
            : 0;
          return { day, accuracy: avg, quizzes: list.length };
        });
      }

      // 2. Fetch completed modules count
      const { count: completedCount } = await supabase
        .from('user_progress')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (completedCount !== null) {
        completedModules = completedCount;
      }

      // 3. Fetch user profile streak
      const { data: prof } = await supabase
        .from('profiles')
        .select('streak')
        .eq('id', userId)
        .maybeSingle();

      if (prof?.streak !== undefined) {
        streakDays = prof.streak;
      }
    } catch (err) {
      console.warn('[Analytics Supabase Error]', err.message);
    }
  }

  // 4. Topic Performance and Skill Gap
  const topicData = await getUserTopicPerformance(userId);

  const topicChartData = topicData.map(t => ({
    topic: t.subtopic || t.topic,
    accuracy: Number(t.accuracy),
    attempts: Number(t.attempts)
  }));

  const strongestTopics = [...topicData]
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 3)
    .map(t => ({ topic: t.subtopic || t.topic, accuracy: t.accuracy }));

  const weakestTopics = [...topicData]
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map(t => ({ topic: t.subtopic || t.topic, accuracy: t.accuracy }));

  // Skill Gap radar data
  const skillGapData = [
    { subject: 'JavaScript', mastery: 82, benchmark: 75 },
    { subject: 'React', mastery: 64, benchmark: 70 },
    { subject: 'Node.js', mastery: 90, benchmark: 80 },
    { subject: 'Databases', mastery: 88, benchmark: 80 },
    { subject: 'DevOps', mastery: 68, benchmark: 75 },
    { subject: 'System Design', mastery: 72, benchmark: 85 }
  ];

  return sendSuccess(res, {
    overview: {
      totalQuizzes,
      averageAccuracy,
      passRate: Math.min(100, Math.round((averageAccuracy / 70) * 80)),
      totalTimeMinutes,
      questionsAnswered: correctAnswers + wrongAnswers,
      correctAnswers,
      wrongAnswers,
      completedModules,
      streakDays
    },
    weeklyAccuracy,
    learningTime,
    topicPerformance: topicChartData,
    skillGap: skillGapData,
    strongestTopics,
    weakestTopics,
    aiInsight: weakestTopics.length > 0
      ? `Your accuracy in ${strongestTopics[0]?.topic || 'fundamentals'} is exceptional. Prioritizing ${weakestTopics[0]?.topic || 'weak areas'} will yield the fastest skill growth this week.`
      : 'Maintain your current daily momentum to unlock advanced system design certifications.'
  });
}

export async function getTopicAnalytics(req, res) {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
  const topics = await getUserTopicPerformance(userId);
  return sendSuccess(res, topics);
}
