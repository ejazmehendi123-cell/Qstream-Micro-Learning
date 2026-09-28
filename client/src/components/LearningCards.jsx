import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Layers, CheckCircle2, Play, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { ProgressBar } from './CommonUI';

export function LearningPathCard({ path }) {
  const navigate = useNavigate();
  if (!path) return null;

  const targetId = path.slug || path.id;
  const hours = Math.round(path.estimated_minutes / 60) || 10;

  const handleNavigate = () => {
    if (!targetId) {
      console.error('Learning path missing ID/slug');
      return;
    }
    navigate(`/paths/${targetId}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group flex flex-col bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer text-left"
    >
      <div className="relative h-44 overflow-hidden bg-slate-800">
        <img
          src={path.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80'}
          alt={path.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900/90 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
            {path.category}
          </span>
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-900/90 backdrop-blur-md text-slate-300 border border-slate-700">
            {path.difficulty}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {path.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {path.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>~{hours} hrs</span>
          </div>
          <span className="flex items-center space-x-1 text-indigo-400 group-hover:translate-x-0.5 transition-transform font-semibold text-xs">
            <span>Explore Path</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function ModuleCard({ module, isCompleted, onStartQuiz }) {
  const navigate = useNavigate();
  if (!module) return null;

  const handleReadNotes = (e) => {
    e.stopPropagation();
    if (!module.id) return;
    navigate(`/notes/${module.id}`);
  };

  const handleStartQuiz = (e) => {
    e.stopPropagation();
    if (onStartQuiz) onStartQuiz(module);
    else if (module.id) navigate(`/quiz/${module.id}`);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
      <div className="flex items-start space-x-3.5">
        <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
          isCompleted
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
        }`}>
          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : module.order_index}
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-slate-100">{module.title}</h4>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {module.difficulty || 'medium'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {module.description}
          </p>
          <div className="flex items-center space-x-4 mt-2 text-[11px] text-slate-500">
            <span>Topic: <strong className="text-slate-300 font-medium">{module.topic}</strong></span>
            {module.estimated_minutes && (
              <span>~{module.estimated_minutes} mins</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
        <button
          onClick={handleReadNotes}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-700"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Notes</span>
        </button>

        <button
          onClick={handleStartQuiz}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/25 transition"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Quiz</span>
        </button>
      </div>
    </div>
  );
}

export function RevisionCard({ item, onStartQuiz }) {
  if (!item) return null;

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between gap-4 text-left">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
          <RotateCcw className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-200">{item.subtopic || item.topic}</h4>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
            <span>{item.topic}</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">Repetition #{item.repetition_count || 1}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onStartQuiz(item)}
        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold shrink-0 transition"
      >
        Quick Review
      </button>
    </div>
  );
}

export function CertificateCard({ certificate }) {
  const navigate = useNavigate();
  if (!certificate) return null;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/20 shadow-xl flex flex-col justify-between space-y-4 text-left">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Award className="w-6 h-6 text-purple-400" />
        </div>
        <span className="px-2.5 py-1 text-[10px] font-mono rounded-lg bg-slate-800 text-indigo-300 border border-slate-700">
          {certificate.certificate_id}
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-100">
          {certificate.learning_paths?.title || certificate.path_title || 'Specialization Certificate'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Awarded on {new Date(certificate.completion_date).toLocaleDateString()} with 100% path completion.
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => navigate(`/certificates/${certificate.certificate_id || certificate.id}`)}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 transition"
        >
          <span>View Credential</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={`/verify/${certificate.verification_token || certificate.certificate_id}`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-slate-400 hover:text-slate-200 underline"
        >
          Verify
        </a>
      </div>
    </div>
  );
}
