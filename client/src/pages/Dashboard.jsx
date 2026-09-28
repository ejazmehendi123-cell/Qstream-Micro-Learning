import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LearningPathCard, RevisionCard } from '../components/LearningCards';
import { TopicPerformanceBars, AccuracyAreaChart } from '../components/AnalyticsCharts';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import {
  Flame,
  Zap,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  CheckCircle2,
  Play
} from 'lucide-react';
import api from '../services/api';

export function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [revisionsDue, setRevisionsDue] = useState([]);
  const [recommendedPaths, setRecommendedPaths] = useState([]);
  const [activeModule, setActiveModule] = useState(null);

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, revRes, pathsRes] = await Promise.all([
        api.get('/analytics'),
        api.get('/revision/today'),
        api.get('/learning-paths?limit=6')
      ]);

      if (analyticsRes?.success) setAnalytics(analyticsRes.data);
      if (revRes?.success) setRevisionsDue(revRes.data || []);
      if (pathsRes?.success) {
        setRecommendedPaths(pathsRes.data.paths || []);
        // Pick first module for Continue Learning
        if (pathsRes.data.paths?.[0]) {
          const firstPath = pathsRes.data.paths[0];
          const pathDetail = await api.get(`/learning-paths/${firstPath.slug || firstPath.id}`);
          if (pathDetail?.success && pathDetail.data?.modules?.[0]) {
            setActiveModule({
              ...pathDetail.data.modules[0],
              pathTitle: firstPath.title,
              pathSlug: firstPath.slug
            });
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Personalizing your adaptive workspace..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const name = profile?.full_name?.split(' ')[0] || 'Scholar';
  const overview = analytics?.overview || {};

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto animate-fade-in">
      {/* 1. Header with greeting and daily goal badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greetingTime()}, {name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Target: <span className="text-indigo-400 font-semibold">{profile?.learning_goal || 'Full Stack Web Development'}</span> • Keep your daily learning streak active!
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/revision"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-semibold transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{revisionsDue.length} Due for Review</span>
          </Link>
          <Link
            to="/ai-tutor"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Streak */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-white">{profile?.streak || overview.streakDays || 1} Days</span>
            <span className="block text-[11px] text-slate-400 font-medium mt-0.5">Current Streak</span>
          </div>
        </div>

        {/* Total XP */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-white">{(profile?.xp || 50).toLocaleString()}</span>
            <span className="block text-[11px] text-slate-400 font-medium mt-0.5">Experience Points</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-white">{overview.averageAccuracy || 78}%</span>
            <span className="block text-[11px] text-slate-400 font-medium mt-0.5">Avg Accuracy</span>
          </div>
        </div>

        {/* Completed Modules */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-white">{overview.completedModules || 8}</span>
            <span className="block text-[11px] text-slate-400 font-medium mt-0.5">Modules Completed</span>
          </div>
        </div>
      </div>

      {/* 3. AI Insight Banner */}
      {analytics?.aiInsight && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/50 border border-indigo-500/30 flex items-start space-x-3.5 shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30 font-bold text-xs">
            AI
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Personalized Learning Insight
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed font-medium">
              "{analytics.aiInsight}"
            </p>
          </div>
        </div>
      )}

      {/* 4. Continue Learning & Today's Goal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Continue Learning</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Current Specialization
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              {activeModule ? activeModule.title : 'Modern HTML5 & Semantic Web'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              {activeModule?.description || 'Deep dive into semantic structure, accessibility (WCAG), and responsive layouts.'}
            </p>
            <div className="flex items-center space-x-4 mt-3 text-xs text-slate-400">
              <span>Path: <strong className="text-slate-200">{activeModule?.pathTitle || 'Full Stack Web Development'}</strong></span>
              <span>Topic: <strong className="text-slate-200">{activeModule?.topic || 'HTML5'}</strong></span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (activeModule?.id) navigate(`/notes/${activeModule.id}`);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1.5 transition"
            >
              <span>Read 12-Section Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (activeModule?.id) navigate(`/quiz/${activeModule.id}`);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-indigo-600/30 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Diagnostic Quiz</span>
            </button>
          </div>
        </div>

        {/* Today's Goal */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Today's Goal</span>
            </span>
            <span className="text-xs text-emerald-400 font-semibold">25 / {profile?.daily_goal_minutes || 30} mins</span>
          </div>

          <div className="space-y-3">
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((25 / (profile?.daily_goal_minutes || 30)) * 100))}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are just 5 minutes away from completing your daily goal and extending your streak to {Number(profile?.streak || 1) + 1} days!
            </p>
          </div>

          <Link
            to="/revision"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition border border-slate-700"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Complete 5-Min Review Quiz</span>
          </Link>
        </div>
      </div>

      {/* 5. Review Today & Skill Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Today List */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Review Today</span>
            </h3>
            <Link to="/revision" className="text-xs text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {revisionsDue.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No reviews due today. Great retention pace!</p>
            ) : (
              revisionsDue.slice(0, 3).map((item, i) => (
                <RevisionCard
                  key={i}
                  item={item}
                  onStartQuiz={() => navigate(`/quiz/${item.id || 'rev-quiz'}`)}
                />
              ))
            )}
          </div>
        </div>

        {/* Skill Gap and Topic Performance */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Your Skill Performance by Topic</h3>
            <Link to="/analytics" className="text-xs text-indigo-400 hover:underline">
              Detailed Analytics
            </Link>
          </div>
          <TopicPerformanceBars topics={analytics?.topicPerformance?.slice(0, 4)} />
        </div>
      </div>

      {/* 6. Recommended Paths for You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Recommended For You</h3>
            <p className="text-xs text-slate-400">Tailored to your target: {profile?.learning_goal || 'Full Stack Web Development'}</p>
          </div>
          <Link to="/paths" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
            <span>Browse All 27 Paths</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendedPaths.slice(0, 3).map(p => (
            <LearningPathCard key={p.id} path={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
