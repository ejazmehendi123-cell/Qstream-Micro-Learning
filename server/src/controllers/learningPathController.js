import { supabase, isSupabaseConfigured, getLocalCurriculum } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/responseUtil.js';
import { validateIdentifier } from '../utils/validatorUtil.js';

export async function getAllLearningPaths(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const category = req.query.category;
  const difficulty = req.query.difficulty;
  const offset = (page - 1) * limit;

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('learning_paths').select('*', { count: 'exact' });

      if (category) query = query.eq('category', category);
      if (difficulty) query = query.eq('difficulty', difficulty);

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('title', { ascending: true });

      if (!error && data) {
        return sendSuccess(res, {
          paths: data,
          pagination: {
            page,
            limit,
            total: count || data.length,
            totalPages: Math.ceil((count || data.length) / limit)
          }
        });
      }
    } catch (err) {
      console.warn('[Get All Paths Supabase Error]', err.message);
    }
  }

  // Fallback to local curriculum
  const curriculum = getLocalCurriculum();
  let filtered = [...curriculum.paths];

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (difficulty) {
    filtered = filtered.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  const paginated = filtered.slice(offset, offset + limit);

  return sendSuccess(res, {
    paths: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit)
    }
  });
}

export async function getLearningPathById(req, res) {
  const { id } = req.params;
  const validation = validateIdentifier(id, 'Learning Path ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  const curriculum = getLocalCurriculum();

  if (isSupabaseConfigured && supabase) {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      let query = supabase.from('learning_paths').select('*, modules(*)');

      if (isUUID) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }

      const { data: pathItem, error } = await query.maybeSingle();

      if (!error && pathItem) {
        // Sort modules by order_index
        if (pathItem.modules) {
          pathItem.modules.sort((a, b) => a.order_index - b.order_index);
        }
        return sendSuccess(res, pathItem);
      }
    } catch (err) {
      console.warn('[Get Path By ID Supabase Error]', err.message);
    }
  }

  // Fallback to local curriculum
  const pathItem = curriculum.paths.find(p => p.id === id || p.slug === id);
  if (!pathItem) {
    return sendError(res, `Learning path '${id}' not found.`, 404);
  }

  const pathModules = curriculum.modules
    .filter(m => m.learning_path_id === pathItem.id)
    .sort((a, b) => a.order_index - b.order_index);

  return sendSuccess(res, {
    ...pathItem,
    modules: pathModules
  });
}

export async function getPathProgress(req, res) {
  const { id } = req.params;
  const userId = req.user?.id;

  const validation = validateIdentifier(id, 'Learning Path ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  const curriculum = getLocalCurriculum();
  const pathItem = curriculum.paths.find(p => p.id === id || p.slug === id);
  if (!pathItem) {
    return sendError(res, `Learning path '${id}' not found.`, 404);
  }

  const pathModules = curriculum.modules.filter(m => m.learning_path_id === pathItem.id);
  const totalModules = pathModules.length;

  if (isSupabaseConfigured && supabase && userId) {
    try {
      const moduleIds = pathModules.map(m => m.id);
      const { data: progressList } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .in('module_id', moduleIds);

      const completedCount = (progressList || []).filter(p => p.status === 'completed').length;
      const inProgressCount = (progressList || []).filter(p => p.status === 'in_progress').length;
      const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

      return sendSuccess(res, {
        pathId: pathItem.id,
        totalModules,
        completedCount,
        inProgressCount,
        completionPercentage: percentage,
        isCompleted: percentage >= 100
      });
    } catch (err) {
      console.warn('[Path Progress Error]', err.message);
    }
  }

  // Fallback progress
  return sendSuccess(res, {
    pathId: pathItem.id,
    totalModules,
    completedCount: 1,
    inProgressCount: 1,
    completionPercentage: 25,
    isCompleted: false
  });
}
