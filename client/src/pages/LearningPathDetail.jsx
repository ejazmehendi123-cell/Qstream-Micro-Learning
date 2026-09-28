import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ModuleCard } from '../components/LearningCards';
import { ProgressBar, LoadingSpinner, ErrorState } from '../components/CommonUI';
import { useToast } from '../contexts/ToastContext';
import {
  Clock,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  ArrowLeft,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';

export function LearningPathDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [path, setPath] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingCert, setGeneratingCert] = useState(false);

  // Validate ID upfront to prevent /paths/undefined
  if (!id || id === 'undefined' || id === 'null') {
    return (
      <ErrorState
        title="Invalid Learning Path"
        message="The learning path identifier was missing or invalid."
        onRetry={() => navigate('/paths')}
      />
    );
  }

  const fetchPathDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pathRes, progressRes] = await Promise.all([
        api.get(`/learning-paths/${id}`),
        api.get(`/learning-paths/${id}/progress`)
      ]);

      if (pathRes?.success && pathRes?.data) {
        setPath(pathRes.data);
      } else {
        throw new Error(pathRes?.message || 'Path not found');
      }

      if (progressRes?.success && progressRes?.data) {
        setProgress(progressRes.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load path details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPathDetails();
  }, [id]);

  const handleClaimCertificate = async () => {
    if (!path?.id) return;
    setGeneratingCert(true);
    try {
      const res = await api.post('/certificates/generate', { pathId: path.id });
      if (res?.success && res?.data) {
        toast.success('Certificate generated successfully! 🎉');
        navigate(`/certificates/${res.data.certificate_id || res.data.id}`);
      } else {
        throw new Error(res?.message || 'Failed to claim certificate');
      }
    } catch (err) {
      toast.error(err.message || 'Complete all path modules to claim this certificate.');
    } finally {
      setGeneratingCert(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading specialization curriculum..." />;
  }

  if (error || !path) {
    return <ErrorState message={error || 'Path not found'} onRetry={fetchPathDetails} />;
  }

  const completion = progress?.completionPercentage || 0;
  const isCompleted = completion >= 100;
  const modules = path.modules || [];
  const hours = Math.round(path.estimated_minutes / 60) || 8;

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/paths" className="hover:text-slate-200 transition flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Learning Paths</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium truncate">{path.title}</span>
      </div>

      {/* Hero Path Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {path.category}
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                {path.difficulty}
              </span>
              <span className="px-2.5 py-1 text-xs text-slate-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>~{hours} Hours Curriculum</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {path.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {path.description}
            </p>
          </div>

          {/* Progress widget & Certificate Action */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 w-full md:w-72 shrink-0 space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5 font-medium">
                <span>Specialization Progress</span>
                <span className="font-bold text-indigo-400">{completion}%</span>
              </div>
              <ProgressBar value={completion} showLabel={false} height="h-2.5" />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {progress?.completedCount || 0} of {modules.length} modules finished
              </span>
            </div>

            {isCompleted ? (
              <button
                onClick={handleClaimCertificate}
                disabled={generatingCert}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition"
              >
                <Award className="w-4 h-4" />
                <span>{generatingCert ? 'Generating...' : 'Claim Official Certificate'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const firstIncomplete = modules[0];
                  if (firstIncomplete?.id) navigate(`/quiz/${firstIncomplete.id}`);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Path Challenge</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Objectives & Prerequisites Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Learning Objectives</span>
          </h3>
          <ul className="space-y-2">
            {path.learning_objectives?.map((obj, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prerequisites */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Recommended Prerequisites</span>
          </h3>
          <ul className="space-y-2">
            {path.prerequisites?.map((pre, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span className="leading-relaxed">{pre}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Course Modules ({modules.length})</span>
          </h2>
          <span className="text-xs text-slate-500">Ordered Sequential Curriculum</span>
        </div>

        <div className="space-y-3">
          {modules.map((m, idx) => (
            <ModuleCard
              key={m.id || idx}
              module={m}
              isCompleted={false}
              onStartQuiz={(mod) => {
                if (mod?.id) navigate(`/quiz/${mod.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
