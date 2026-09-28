import { supabase, isSupabaseConfigured, getLocalCurriculum } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/responseUtil.js';
import { validateIdentifier } from '../utils/validatorUtil.js';

export async function getAllModules(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const pathId = req.query.learning_path_id;
  const offset = (page - 1) * limit;

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('modules').select('*, learning_paths(title, slug)', { count: 'exact' });
      if (pathId) query = query.eq('learning_path_id', pathId);

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('order_index', { ascending: true });

      if (!error && data) {
        return sendSuccess(res, {
          modules: data,
          pagination: {
            page,
            limit,
            total: count || data.length,
            totalPages: Math.ceil((count || data.length) / limit)
          }
        });
      }
    } catch (err) {
      console.warn('[Get All Modules Supabase Error]', err.message);
    }
  }

  // Fallback to local curriculum
  const curriculum = getLocalCurriculum();
  let filtered = [...curriculum.modules];

  if (pathId) {
    filtered = filtered.filter(m => m.learning_path_id === pathId);
  }

  const paginated = filtered.slice(offset, offset + limit);

  return sendSuccess(res, {
    modules: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit)
    }
  });
}

export async function getModuleById(req, res) {
  const { id } = req.params;
  const validation = validateIdentifier(id, 'Module ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  const curriculum = getLocalCurriculum();

  if (isSupabaseConfigured && supabase) {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      let query = supabase.from('modules').select('*, learning_paths(*), notes(id)');

      if (isUUID) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }

      const { data: moduleItem, error } = await query.maybeSingle();
      if (!error && moduleItem) {
        return sendSuccess(res, moduleItem);
      }
    } catch (err) {
      console.warn('[Get Module By ID Supabase Error]', err.message);
    }
  }

  // Fallback to local curriculum
  const moduleItem = curriculum.modules.find(m => m.id === id || m.slug === id);
  if (!moduleItem) {
    return sendError(res, `Module '${id}' not found.`, 404);
  }

  const parentPath = curriculum.paths.find(p => p.id === moduleItem.learning_path_id);
  const note = curriculum.notes.find(n => n.module_id === moduleItem.id);

  return sendSuccess(res, {
    ...moduleItem,
    learning_paths: parentPath || null,
    has_notes: Boolean(note),
    notes_id: note ? note.id : null
  });
}

export async function updateModuleProgress(req, res) {
  const { id } = req.params;
  const userId = req.user?.id;
  const { status, completion_percentage, time_spent } = req.body;

  const validation = validateIdentifier(id, 'Module ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  if (!userId) {
    return sendError(res, 'Authentication required to update progress', 401);
  }

  const progressRecord = {
    user_id: userId,
    module_id: id,
    status: status || 'in_progress',
    completion_percentage: completion_percentage !== undefined ? Number(completion_percentage) : 100,
    time_spent: time_spent !== undefined ? Number(time_spent) : 60,
    last_accessed_at: new Date().toISOString(),
    completed_at: status === 'completed' ? new Date().toISOString() : null
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert(progressRecord, { onConflict: 'user_id,module_id' })
        .select('*')
        .single();

      if (!error && data) {
        return sendSuccess(res, data, 'Module progress saved');
      }
    } catch (err) {
      console.warn('[Update Module Progress Error]', err.message);
    }
  }

  return sendSuccess(res, progressRecord, 'Module progress saved (mock store)');
}
