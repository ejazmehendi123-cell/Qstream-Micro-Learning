import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import {
  Layers,
  Clock,
  BookOpen,
  Play,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Bot
} from 'lucide-react';
import api from '../services/api';

export function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [moduleItem, setModuleItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!id || id === 'undefined' || id === 'null') {
    return (
      <ErrorState
        title="Invalid Module ID"
        message="The module identifier provided is invalid."
        onRetry={() => navigate('/modules')}
      />
    );
  }

  const fetchModule = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/modules/${id}`);
      if (res?.success && res?.data) {
        setModuleItem(res.data);
      } else {
        throw new Error(res?.message || 'Module not found');
      }
    } catch (err) {
      setError(err.message || 'Unable to load module details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModule();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading module specifications..." />;
  }

  if (error || !moduleItem) {
    return <ErrorState message={error || 'Module not found'} onRetry={fetchModule} />;
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/modules" className="hover:text-slate-200 transition flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Modules</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium truncate">{moduleItem.title}</span>
      </div>

      {/* Hero Module Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {moduleItem.topic}
          </span>
          {moduleItem.subtopic && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              {moduleItem.subtopic}
            </span>
          )}
          <span className="px-2.5 py-1 text-xs uppercase font-bold rounded-lg bg-purple-500/20 text-purple-300">
            {moduleItem.difficulty || 'medium'}
          </span>
          <span className="px-2.5 py-1 text-xs text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>~{moduleItem.estimated_minutes || 45} mins</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {moduleItem.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {moduleItem.description}
        </p>

        {moduleItem.learning_paths && (
          <div className="pt-2 text-xs text-slate-400">
            Part of learning path:{' '}
            <Link
              to={`/paths/${moduleItem.learning_paths.slug || moduleItem.learning_paths.id}`}
              className="text-indigo-400 font-semibold hover:underline"
            >
              {moduleItem.learning_paths.title}
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate(`/notes/${moduleItem.id}`)}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-2 transition border border-slate-700 shadow-md"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Read 12-Section Notes</span>
          </button>

          <button
            onClick={() => navigate(`/quiz/${moduleItem.id}`)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Adaptive Quiz</span>
          </button>

          <button
            onClick={() => navigate(`/ai-tutor`)}
            className="px-4 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 transition ml-auto"
          >
            <Bot className="w-4 h-4" />
            <span>Ask Tutor About This</span>
          </button>
        </div>
      </div>

      {/* Learning Objectives */}
      {moduleItem.learning_objectives && moduleItem.learning_objectives.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Learning Objectives for this Module</span>
          </h3>
          <ul className="space-y-2">
            {moduleItem.learning_objectives.map((obj, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
