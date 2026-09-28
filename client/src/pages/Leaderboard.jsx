import React, { useState, useEffect } from 'react';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import { Trophy, Flame, Zap } from 'lucide-react';
import api from '../services/api';

export function Leaderboard() {
  const [metric, setMetric] = useState('xp');
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/leaderboard?metric=${metric}&limit=25`);
      if (res?.success && res?.data) {
        setLearners(res.data);
      } else {
        throw new Error(res?.message || 'Failed to load leaderboard');
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve leaderboard standings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [metric]);

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <Trophy className="w-7 h-7 text-amber-400" />
            <span>Global Engineering Leaderboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Top engineers ranked by problem-solving XP and disciplined daily learning streaks.
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => setMetric('xp')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              metric === 'xp'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Total XP</span>
          </button>

          <button
            onClick={() => setMetric('streak')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              metric === 'streak'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Streak Days</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Fetching top engineers..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchLeaderboard} />
      ) : (
        <LeaderboardTable users={learners} />
      )}
    </div>
  );
}
