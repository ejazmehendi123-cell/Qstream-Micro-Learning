import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { sendError } from '../utils/responseUtil.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If running in development without credentials, provide a stable mock user so the app can be tested immediately
    if (process.env.NODE_ENV === 'development' || !isSupabaseConfigured) {
      req.user = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'developer@qstream.ai',
        full_name: 'Alex Rivera',
        avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex',
        learning_goal: 'Full Stack Web Development',
        preferred_difficulty: 'medium',
        streak: 5,
        xp: 1250
      };
      return next();
    }
    return sendError(res, 'Authentication required. Missing Bearer token.', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!isSupabaseConfigured) {
    // Use development user context
    req.user = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'developer@qstream.ai',
      full_name: 'Alex Rivera',
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex',
      learning_goal: 'Full Stack Web Development',
      preferred_difficulty: 'medium',
      streak: 5,
      xp: 1250
    };
    return next();
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return sendError(res, 'Invalid or expired session. Please log in again.', 401, error);
    }

    req.user = {
      id: user.id,
      email: user.email,
      ...user.user_metadata
    };
    return next();
  } catch (err) {
    return sendError(res, 'Session verification error.', 401, err);
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  return requireAuth(req, res, next);
}
