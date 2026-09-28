import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RevisionCard } from '../components/LearningCards';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import { RotateCcw, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export function Revision() {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRevisions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/revision/today');
      if (res?.success && res?.data) {
        setRevisions(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load spaced review queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const handleStartReviewQuiz = (item) => {
    // Generate revision quiz session using topic
    navigate(`/quiz/${item.id || 'rev-session'}`);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
          <RotateCcw className="w-7 h-7 text-amber-400" />
          <span>Spaced Repetition & Daily Review</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review topics calculated by our SuperMemo-2 algorithm right before you forget them to cement long-term memory.
        </p>
      </div>

      {/* Spaced Repetition Info Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/20 text-xs text-slate-300 space-y-2">
        <span className="font-bold text-amber-300 flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Adaptive Review Interval Schedule:</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-[11px]">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-rose-400 block">&lt;40%</span>
            <span className="text-slate-400">1 Day</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-amber-400 block">40–60%</span>
            <span className="text-slate-400">2 Days</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-indigo-400 block">60–80%</span>
            <span className="text-slate-400">5 Days</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-purple-400 block">80–90%</span>
            <span className="text-slate-400">10 Days</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-emerald-400 block">90%+</span>
            <span className="text-slate-400">20–30 Days</span>
          </div>
        </div>
      </div>

      {/* Due Today Queue */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Scheduled for Today ({revisions.length})</span>
        </h3>

        {loading ? (
          <LoadingSpinner size="md" text="Loading today's review topics..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchRevisions} />
        ) : revisions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-semibold text-slate-200">All caught up!</p>
            <p>No topics are due for review today. Keep exploring new modules.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {revisions.map((item, idx) => (
              <RevisionCard
                key={item.id || idx}
                item={item}
                onStartQuiz={handleStartReviewQuiz}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
