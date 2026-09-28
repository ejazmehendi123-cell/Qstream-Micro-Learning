import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import { useToast } from '../contexts/ToastContext';
import {
  BookOpen,
  Play,
  ArrowLeft,
  Copy,
  Check,
  Code2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Bot,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

export function NotesDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!moduleId || moduleId === 'undefined' || moduleId === 'null') {
    return (
      <ErrorState
        title="Invalid Module ID"
        message="Cannot load notes without a valid module identifier."
        onRetry={() => navigate('/modules')}
      />
    );
  }

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/notes/${moduleId}`);
      if (res?.success && res?.data) {
        setNotes(res.data);
      } else {
        throw new Error(res?.message || 'Notes not found');
      }
    } catch (err) {
      setError(err.message || 'Unable to load module notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [moduleId]);

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(index);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Retrieving 12-section architecture notes..." />;
  }

  if (error || !notes) {
    return <ErrorState message={error || 'Notes not found'} onRetry={fetchNotes} />;
  }

  const moduleItem = notes.modules || {};

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/modules/${moduleId}`}
          className="text-xs text-slate-400 hover:text-slate-200 transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Module Overview</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/ai-tutor')}
            className="px-3 py-1.5 rounded-xl bg-purple-950/40 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 hover:bg-purple-900/50 transition"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Tutor Discussion</span>
          </button>

          <button
            onClick={() => navigate(`/quiz/${moduleId}`)}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Take Module Quiz</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {moduleItem.topic || 'Engineering Architecture'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {notes.title || moduleItem.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {notes.content?.replace(/^#.*?\n\n/, '')}
        </p>
      </div>

      {/* 1. Core Concepts */}
      {notes.key_concepts && notes.key_concepts.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Key Architectural Concepts</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {notes.key_concepts.map((kc, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-indigo-300">{kc.concept}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{kc.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Production Code Examples */}
      {notes.code_examples && notes.code_examples.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Idiomatic Code Examples & Syntax</span>
          </h2>

          {notes.code_examples.map((example, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 font-mono">
                  {example.title || `Example #${idx + 1}`}
                </span>
                <button
                  onClick={() => copyToClipboard(example.code, idx)}
                  className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono text-indigo-200 leading-relaxed">
                <code>{example.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* 3. Common Mistakes & Pitfalls */}
      {notes.common_mistakes && notes.common_mistakes.length > 0 && (
        <div className="p-6 rounded-2xl bg-rose-950/10 border border-rose-500/20 space-y-4">
          <h2 className="text-base font-bold text-rose-300 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Common Anti-Patterns & Mistakes</span>
          </h2>
          <div className="space-y-3">
            {notes.common_mistakes.map((cm, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-rose-400">Mistake:</span>
                  <span className="text-xs text-slate-200 font-medium">{cm.mistake}</span>
                </div>
                <div className="flex items-start space-x-2 pl-4 border-l-2 border-emerald-500 mt-1">
                  <span className="text-xs font-bold text-emerald-400">Fix:</span>
                  <span className="text-xs text-slate-300 leading-relaxed">{cm.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Interview Questions */}
      {notes.interview_questions && notes.interview_questions.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>Senior Technical Interview Questions</span>
          </h2>
          <div className="space-y-3">
            {notes.interview_questions.map((iq, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-100 flex items-start space-x-2">
                  <span className="text-purple-400">Q{i + 1}:</span>
                  <span>{iq.question}</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-6 border-l border-slate-800">
                  {iq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Quick Revision & Related Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.quick_revision && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Quick Revision Points</h3>
            <ul className="space-y-2">
              {notes.quick_revision.map((qr, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span className="leading-relaxed">{qr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {notes.related_topics && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Related Topics to Explore</h3>
            <ul className="space-y-2">
              {notes.related_topics.map((rt, i) => (
                <li key={i} className="text-xs text-indigo-400 flex items-center space-x-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{rt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom Practice Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Ready to test your retention?</h3>
          <p className="text-xs text-slate-400 mt-0.5">Take the 5-question adaptive assessment for this module.</p>
        </div>
        <button
          onClick={() => navigate(`/quiz/${moduleId}`)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Quiz</span>
        </button>
      </div>
    </div>
  );
}
