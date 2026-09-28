import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/responseUtil.js';

export async function getMe(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return sendError(res, 'Not authenticated', 401);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && profile) {
        return sendSuccess(res, { user: req.user, profile });
      }
    } catch (err) {
      console.warn('[Get Me Error]', err.message);
    }
  }

  // Extract real user details if available
  const email = req.user.email || 'developer@qstream.ai';
  const fullName = req.user.user_metadata?.full_name || req.user.full_name || email.split('@')[0];
  const learningGoal = req.user.user_metadata?.learning_goal || req.user.learning_goal || 'Full Stack Web Development';
  const avatarUrl = req.user.user_metadata?.avatar_url || req.user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`;

  // Fallback demo profile
  return sendSuccess(res, {
    user: req.user,
    profile: {
      id: userId,
      email: email,
      full_name: fullName,
      avatar_url: avatarUrl,
      bio: 'Lifelong learner on Qstream AI.',
      learning_goal: learningGoal,
      preferred_difficulty: req.user.preferred_difficulty || 'medium',
      daily_goal_minutes: 30,
      streak: req.user.streak || 0,
      longest_streak: req.user.longest_streak || 0,
      total_learning_minutes: 0,
      xp: req.user.xp || 0
    }
  });
}

export async function updateProfile(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return sendError(res, 'Not authenticated', 401);
  }

  const {
    full_name,
    avatar_url,
    bio,
    learning_goal,
    preferred_difficulty,
    daily_goal_minutes
  } = req.body;

  const updates = {};
  if (full_name !== undefined) updates.full_name = full_name;
  if (avatar_url !== undefined) updates.avatar_url = avatar_url;
  if (bio !== undefined) updates.bio = bio;
  if (learning_goal !== undefined) updates.learning_goal = learning_goal;
  if (preferred_difficulty !== undefined) updates.preferred_difficulty = preferred_difficulty;
  if (daily_goal_minutes !== undefined) updates.daily_goal_minutes = Number(daily_goal_minutes);
  updates.updated_at = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        return sendError(res, 'Failed to update profile in database', 500, error);
      }
      return sendSuccess(res, data, 'Profile updated successfully');
    } catch (err) {
      return sendError(res, 'Profile update error', 500, err);
    }
  }

  // Local fallback
  return sendSuccess(res, { id: userId, ...updates }, 'Profile updated (mock store)');
}
