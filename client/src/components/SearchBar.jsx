import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, BookOpen, Layers, FileText, ArrowRight, X } from 'lucide-react';
import api from '../services/api';

export function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        if (res?.success) {
          setResults(res.data);
          setIsOpen(true);
        }
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <SearchIcon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search paths, modules, topics (e.g. JavaScript, Docker)..."
          className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/50 transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Instant Results Dropdown */}
      {isOpen && results && (
        <div className="absolute left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 divide-y divide-slate-800/60 animate-fade-in">
          {results.total === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No direct matches found for "{query}". Press Enter to browse full catalog.
            </div>
          ) : (
            <>
              {results.paths?.length > 0 && (
                <div className="py-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 block mb-1">
                    Learning Paths ({results.paths.length})
                  </span>
                  {results.paths.slice(0, 3).map(pathItem => (
                    <div
                      key={pathItem.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/paths/${pathItem.slug || pathItem.id}`);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-800/60 cursor-pointer transition"
                    >
                      <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-200 truncate">{pathItem.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{pathItem.category} • {pathItem.difficulty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.modules?.length > 0 && (
                <div className="py-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 block mb-1">
                    Modules ({results.modules.length})
                  </span>
                  {results.modules.slice(0, 3).map(mod => (
                    <div
                      key={mod.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/modules/${mod.id}`);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-800/60 cursor-pointer transition"
                    >
                      <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-200 truncate">{mod.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{mod.topic} • {mod.subtopic}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.notes?.length > 0 && (
                <div className="py-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 block mb-1">
                    Learning Notes ({results.notes.length})
                  </span>
                  {results.notes.slice(0, 3).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/notes/${n.module_id}`);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-800/60 cursor-pointer transition"
                    >
                      <FileText className="w-4 h-4 text-pink-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-200 truncate">{n.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">12-Section Architecture Guide</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                onClick={handleSubmit}
                className="pt-2 px-3 py-1 flex items-center justify-between text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                <span>View all results for "{query}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
