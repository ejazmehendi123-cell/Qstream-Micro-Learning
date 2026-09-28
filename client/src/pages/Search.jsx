import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import { Search as SearchIcon, BookOpen, Layers, FileText, ArrowRight, Play } from 'lucide-react';
import api from '../services/api';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const performSearch = async (term) => {
    if (!term || term.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(term.trim())}`);
      if (res?.success) {
        setResults(res.data);
      }
    } catch (err) {
      setError(err.message || 'Search execution failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
          <SearchIcon className="w-7 h-7 text-indigo-500" />
          <span>Search Curriculum & Notes</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Instant query index across 27 learning paths, 108 modules, and 50+ architecture notes.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <SearchIcon className="absolute left-4 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, paths, notes, concepts (e.g. JavaScript, Docker, Redux)..."
          className="w-full pl-12 pr-28 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-2.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
        >
          Search
        </button>
      </form>

      {/* Results Display */}
      {loading ? (
        <LoadingSpinner size="lg" text="Searching database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => performSearch(query)} />
      ) : results ? (
        <div className="space-y-6">
          <div className="text-xs text-slate-400">
            Found <strong className="text-white">{results.total}</strong> results for "{results.query}"
          </div>

          {/* Paths results */}
          {results.paths?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Learning Paths ({results.paths.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.paths.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/paths/${p.slug || p.id}`)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{p.category} • {p.difficulty}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modules results */}
          {results.modules?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Modules ({results.modules.length})</span>
              </h3>
              <div className="space-y-2">
                {results.modules.map(m => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{m.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Topic: <span className="text-slate-300">{m.topic}</span> {m.subtopic && `• ${m.subtopic}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => navigate(`/notes/${m.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                      >
                        Notes
                      </button>
                      <button
                        onClick={() => navigate(`/quiz/${m.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Quiz</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes results */}
          {results.notes?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-pink-400" />
                <span>12-Section Notes ({results.notes.length})</span>
              </h3>
              <div className="space-y-2">
                {results.notes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => navigate(`/notes/${n.module_id}`)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{n.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Comprehensive Architecture & Interview Guide</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
