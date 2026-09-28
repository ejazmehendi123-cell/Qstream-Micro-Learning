import { getDueRevisions } from '../services/spacedRepetitionService.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/responseUtil.js';
import { validateIdentifier } from '../utils/validatorUtil.js';

export async function getDueToday(req, res) {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
  const dueItems = await getDueRevisions(userId);
  return sendSuccess(res, dueItems, 'Today revision topics retrieved');
}

export async function completeRevision(req, res) {
  const { id } = req.params;
  const validation = validateIdentifier(id, 'Revision ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('revision_schedule')
        .update({ status: 'completed' })
        .eq('id', id);
    } catch (err) {
      console.warn('[Complete Revision Error]', err.message);
    }
  }

  return sendSuccess(res, { id, status: 'completed' }, 'Revision marked as completed');
}
