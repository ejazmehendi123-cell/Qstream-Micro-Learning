import { supabase, isSupabaseConfigured, getLocalCurriculum } from '../config/supabase.js';
import { sendSuccess } from '../utils/responseUtil.js';
import { sanitizeSearchQuery } from '../utils/validatorUtil.js';

export async function globalSearch(req, res) {
  const query = sanitizeSearchQuery(req.query.q || '');
  if (!query || query.length < 2) {
    return sendSuccess(res, { paths: [], modules: [], notes: [], total: 0 });
  }

  const qLower = query.toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const [pathRes, moduleRes, noteRes] = await Promise.all([
        supabase.from('learning_paths').select('*').or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`).limit(10),
        supabase.from('modules').select('*, learning_paths(title, slug)').or(`title.ilike.%${query}%,topic.ilike.%${query}%,subtopic.ilike.%${query}%`).limit(15),
        supabase.from('notes').select('id, module_id, title, modules(title, slug)').ilike('title', `%${query}%`).limit(10)
      ]);

      const paths = pathRes.data || [];
      const modules = moduleRes.data || [];
      const notes = noteRes.data || [];

      return sendSuccess(res, {
        query,
        paths,
        modules,
        notes,
        total: paths.length + modules.length + notes.length
      });
    } catch (err) {
      console.warn('[Global Search Error]', err.message);
    }
  }

  // Local search fallback
  const curriculum = getLocalCurriculum();
  const matchedPaths = curriculum.paths.filter(p =>
    p.title.toLowerCase().includes(qLower) ||
    p.description.toLowerCase().includes(qLower) ||
    p.category.toLowerCase().includes(qLower)
  ).slice(0, 10);

  const matchedModules = curriculum.modules.filter(m =>
    m.title.toLowerCase().includes(qLower) ||
    m.topic.toLowerCase().includes(qLower) ||
    (m.subtopic && m.subtopic.toLowerCase().includes(qLower)) ||
    m.description.toLowerCase().includes(qLower)
  ).slice(0, 15);

  const matchedNotes = curriculum.notes.filter(n =>
    n.title.toLowerCase().includes(qLower) ||
    n.content.toLowerCase().includes(qLower)
  ).slice(0, 10);

  return sendSuccess(res, {
    query,
    paths: matchedPaths,
    modules: matchedModules,
    notes: matchedNotes,
    total: matchedPaths.length + matchedModules.length + matchedNotes.length
  });
}
