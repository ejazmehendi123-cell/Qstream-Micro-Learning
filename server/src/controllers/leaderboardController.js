import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { sendSuccess } from '../utils/responseUtil.js';

export async function getLeaderboard(req, res) {
  const metric = req.query.metric || 'xp'; // 'xp', 'streak', 'quizzes'
  const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 20));

  if (isSupabaseConfigured && supabase) {
    try {
      let orderColumn = 'xp';
      if (metric === 'streak') orderColumn = 'streak';

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, xp, streak, total_learning_minutes')
        .order(orderColumn, { ascending: false })
        .limit(limit);

      if (!error && profiles && profiles.length > 0) {
        const ranked = profiles.map((p, index) => ({
          rank: index + 1,
          id: p.id,
          displayName: p.full_name || `Engineer #${p.id.substring(0, 4)}`,
          avatarUrl: p.avatar_url,
          xp: p.xp || 0,
          streak: p.streak || 0,
          learningMinutes: p.total_learning_minutes || 0
        }));
        return sendSuccess(res, ranked);
      }
    } catch (err) {
      console.warn('[Leaderboard Error]', err.message);
    }
  }

  // Fallback ranked leaderboard
  const mockLeaderboard = [
    { rank: 1, id: 'user-01', displayName: 'Elena Rostova', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=elena', xp: 4850, streak: 24, learningMinutes: 980 },
    { rank: 2, id: 'user-02', displayName: 'Tariq Al-Mansoor', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=tariq', xp: 4210, streak: 19, learningMinutes: 840 },
    { rank: 3, id: 'user-03', displayName: 'Maya Chen', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=maya', xp: 3950, streak: 16, learningMinutes: 790 },
    { rank: 4, id: 'user-04', displayName: 'Alex Rivera (You)', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex', xp: 3450, streak: 12, learningMinutes: 620 },
    { rank: 5, id: 'user-05', displayName: 'Kofi Asante', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=kofi', xp: 3100, streak: 11, learningMinutes: 580 },
    { rank: 6, id: 'user-06', displayName: 'Sophia Muller', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=sophia', xp: 2890, streak: 9, learningMinutes: 510 },
    { rank: 7, id: 'user-07', displayName: 'Rohan Sharma', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=rohan', xp: 2640, streak: 8, learningMinutes: 470 },
    { rank: 8, id: 'user-08', displayName: 'Liam O’Connor', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=liam', xp: 2410, streak: 7, learningMinutes: 420 },
    { rank: 9, id: 'user-09', displayName: 'Amina Diallo', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=amina', xp: 2190, streak: 6, learningMinutes: 380 },
    { rank: 10, id: 'user-10', displayName: 'Mateo Hernandez', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=mateo', xp: 1980, streak: 5, learningMinutes: 340 }
  ];

  if (metric === 'streak') {
    mockLeaderboard.sort((a, b) => b.streak - a.streak).forEach((u, i) => u.rank = i + 1);
  }

  return sendSuccess(res, mockLeaderboard.slice(0, limit));
}
