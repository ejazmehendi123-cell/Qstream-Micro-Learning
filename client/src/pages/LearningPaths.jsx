import React, { useState, useEffect } from 'react';
import { LearningPathCard } from '../components/LearningCards';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import { Search, Filter, Layers } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = [
  'All',
  'Web Development',
  'Programming Languages',
  'Data Science',
  'Computer Science',
  'Artificial Intelligence',
  'Cloud & Infrastructure',
  'DevOps & Systems',
  'Security',
  'Databases',
  'Career & Placement',
  'Soft Skills'
];

export function LearningPaths() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPaths = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/learning-paths?limit=100');
      if (res?.success && res?.data?.paths) {
        setPaths(res.data.paths);
      }
    } catch (err) {
      setError(err.message || 'Failed to load learning catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  const filteredPaths = paths.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
          <Layers className="w-7 h-7 text-indigo-500" />
          <span>Learning Paths & Specializations</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore 27 comprehensive engineering specializations, from fundamental algorithms to generative AI and distributed architectures.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Local Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter catalog..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Content Feed */}
      {loading ? (
        <LoadingSpinner size="lg" text="Loading learning paths..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPaths} />
      ) : filteredPaths.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
          No learning paths found matching "{searchQuery}". Try selecting another category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((p) => (
            <LearningPathCard key={p.id} path={p} />
          ))}
        </div>
      )}
    </div>
  );
}
