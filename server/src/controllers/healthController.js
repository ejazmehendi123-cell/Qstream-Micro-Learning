import { isSupabaseConfigured, supabase } from '../config/supabase.js';
import { isOpenAIConfigured } from '../config/openai.js';
import { sendSuccess } from '../utils/responseUtil.js';

export async function checkHealth(req, res) {
  return sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() }, 'Qstream AI Server healthy');
}

export async function checkServices(req, res) {
  let supabaseConnected = false;
  let supabaseError = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('learning_paths').select('id').limit(1);
      supabaseConnected = !error;
      if (error) supabaseError = error.message;
    } catch (err) {
      supabaseError = err.message;
    }
  }

  const services = {
    supabase: {
      configured: isSupabaseConfigured,
      connected: supabaseConnected,
      error: supabaseError
    },
    openai: {
      configured: isOpenAIConfigured,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    },
    server: {
      uptime: process.uptime(),
      nodeVersion: process.version,
      memory: process.memoryUsage()
    }
  };

  return sendSuccess(res, services, 'Services health report');
}
