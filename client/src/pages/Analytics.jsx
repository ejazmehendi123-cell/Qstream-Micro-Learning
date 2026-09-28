import React, { useState, useEffect } from 'react';
import {
  AccuracyAreaChart,
  LearningTimeBarChart,
  SkillGapRadarChart,
  TopicPerformanceBars
} from '../components/AnalyticsCharts';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Brain,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

export function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/analytics');
      if (res?.success && res?.data) {
        setData(res.data);
      } else {
        throw new Error(res?.message || 'Failed to load analytics');
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Aggregating performance metrics from database..." />;
  }

  if (error || !data) {
    return <ErrorState message={error || 'No analytics data'} onRetry={fetchAnalytics} />;
  }

  const { overview = {}, weeklyAccuracy = [], learningTime = [], skillGap = [], topicPerformance = [], strongestTopics = [], weakestTopics = [] } = data;

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
          <BarChart3 className="w-7 h-7 text-indigo-500" />
          <span>Skill & Performance Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time retention curves, accuracy benchmarks, and skill-gap diagnostics.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Average Accuracy</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400">{overview.averageAccuracy || 0}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Pass Rate: {overview.passRate || 0}%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Quizzes</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{overview.totalQuizzes || 0}</span>
            <span className="text-xs text-slate-400 font-medium">Attempts</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Correct Answers</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{overview.correctAnswers || 0}</span>
            <span className="text-xs text-slate-400">/ {overview.questionsAnswered || 0}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Learning</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{Math.round((overview.totalTimeMinutes || 0) / 60)}h</span>
            <span className="text-xs text-slate-400">{overview.totalTimeMinutes || 0} mins</span>
          </div>
        </div>
      </div>

      {/* Row 1: Weekly Accuracy Curve & Daily Learning Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Weekly Accuracy Trend (%)</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">7-Day Rolling Average</span>
          </div>
          <AccuracyAreaChart data={weeklyAccuracy} />
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Study Time by Day (Minutes)</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Platform Activity</span>
          </div>
          <LearningTimeBarChart data={learningTime} />
        </div>
      </div>

      {/* Row 2: Skill Gap Radar & Topic Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Brain className="w-4 h-4 text-pink-400" />
              <span>Skill Gap vs Industry Benchmark</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Mastery Radar</span>
          </div>
          <SkillGapRadarChart data={skillGap} />
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Topic Mastery Breakdown</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Adaptive Weights</span>
          </div>
          <TopicPerformanceBars topics={topicPerformance} />
        </div>
      </div>

      {/* Row 3: Strongest vs Weakest Topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Highest Retention Topics</span>
          </h4>
          <div className="space-y-2">
            {strongestTopics.map((t, i) => (
              <div key={i} className="flex justify-between items-center text-xs text-slate-200">
                <span className="font-medium">{t.topic}</span>
                <span className="font-bold text-emerald-400">{t.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
            <XCircle className="w-4 h-4" />
            <span>Recommended For Spaced Review</span>
          </h4>
          <div className="space-y-2">
            {weakestTopics.map((t, i) => (
              <div key={i} className="flex justify-between items-center text-xs text-slate-200">
                <span className="font-medium">{t.topic}</span>
                <span className="font-bold text-rose-400">{t.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
