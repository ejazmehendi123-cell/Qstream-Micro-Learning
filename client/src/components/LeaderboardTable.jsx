import React from 'react';
import { Flame, Zap, Trophy, Medal, Clock } from 'lucide-react';

export function LeaderboardTable({ users = [] }) {
  if (!users || users.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
        No learners ranked on this leaderboard yet.
      </div>
    );
  }

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
            <Trophy className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-xl bg-slate-400/20 text-slate-300 border border-slate-400/40 flex items-center justify-center font-bold text-xs">
            <Medal className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded-xl bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-bold text-xs">
            <Medal className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-xs font-bold">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-16 text-center">Rank</th>
              <th className="py-3.5 px-4">Learner</th>
              <th className="py-3.5 px-4 text-right">Streak</th>
              <th className="py-3.5 px-4 text-right">Learning Time</th>
              <th className="py-3.5 px-4 text-right">Total XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-4 text-center font-medium">
                  <div className="flex justify-center">{getRankBadge(u.rank)}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={u.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                      alt={u.displayName}
                      className="w-8 h-8 rounded-lg bg-slate-800 object-cover shrink-0"
                    />
                    <div>
                      <span className="font-semibold text-slate-100 block">{u.displayName}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-amber-300">
                  <div className="flex items-center justify-end space-x-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{u.streak}d</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right text-slate-400">
                  <div className="flex items-center justify-end space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{Math.round(u.learningMinutes / 60)}h</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                    <Zap className="w-3 h-3 fill-indigo-400 text-indigo-400" />
                    <span>{u.xp?.toLocaleString()} XP</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="sm:hidden divide-y divide-slate-800">
        {users.map((u) => (
          <div key={u.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              {getRankBadge(u.rank)}
              <img
                src={u.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                alt={u.displayName}
                className="w-8 h-8 rounded-lg bg-slate-800 object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-100 truncate">{u.displayName}</p>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="flex items-center space-x-0.5 text-amber-400">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>{u.streak}d</span>
                  </span>
                  <span>•</span>
                  <span>{Math.round(u.learningMinutes / 60)}h</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-bold text-xs border border-indigo-500/20 shrink-0">
              <Zap className="w-3 h-3 fill-indigo-400 text-indigo-400" />
              <span>{u.xp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
