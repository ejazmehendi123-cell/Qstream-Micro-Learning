import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '../components/LearningCards';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import { Layers, Search, Filter } from 'lucide-react';
import api from '../services/api';

export function Modules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/modules?page=${page}&limit=20`);
      if (res?.success && res?.data?.modules) {
        setModules(res.data.modules);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load modules list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [page]);

  const filtered = modules.filter(m =>
    !searchQuery.trim() ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.subtopic && m.subtopic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <Layers className="w-7 h-7 text-indigo-500" />
            <span>Modules Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse all 108 targeted micro-modules covering architecture, frontend, backend, and algorithms.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules or topics..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading modules..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchModules} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
          No modules found matching "{searchQuery}".
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <ModuleCard
              key={m.id}
              module={m}
              onStartQuiz={(mod) => {
                if (mod?.id) navigate(`/quiz/${mod.id}`);
              }}
            />
          ))}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total modules)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                >
                  Previous
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
