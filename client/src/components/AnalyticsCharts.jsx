import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

export function AccuracyAreaChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-xs text-slate-500">No activity data recorded yet.</div>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            formatter={(val) => [`${val}%`, 'Accuracy']}
          />
          <Area
            type="monotone"
            dataKey="accuracy"
            stroke="#6366F1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#accuracyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LearningTimeBarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-xs text-slate-500">No time logs recorded yet.</div>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            formatter={(val) => [`${val} mins`, 'Study Time']}
          />
          <Bar dataKey="minutes" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillGapRadarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-xs text-slate-500">No skill benchmarks calculated yet.</div>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
          <Radar name="Your Mastery" dataKey="mastery" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
          <Radar name="Target Benchmark" dataKey="benchmark" stroke="#EC4899" fill="#EC4899" fillOpacity={0.2} />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopicPerformanceBars({ topics = [] }) {
  if (!topics || topics.length === 0) {
    return <div className="p-6 text-center text-xs text-slate-500">No topic performance records yet. Complete a quiz to analyze weak topics.</div>;
  }

  return (
    <div className="space-y-3 text-left">
      {topics.map((t, idx) => {
        const acc = Number(t.accuracy) || 0;
        let colorClass = 'from-rose-500 to-red-600';
        let textClass = 'text-rose-400';

        if (acc >= 75) {
          colorClass = 'from-emerald-500 to-teal-600';
          textClass = 'text-emerald-400';
        } else if (acc >= 50) {
          colorClass = 'from-amber-500 to-orange-600';
          textClass = 'text-amber-400';
        }

        return (
          <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span className="text-slate-200 truncate">{t.subtopic || t.topic}</span>
              <span className={`font-bold ${textClass}`}>{acc}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-500`}
                style={{ width: `${acc}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
