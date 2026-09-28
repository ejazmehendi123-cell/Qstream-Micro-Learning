import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, RotateCcw, Trophy, ArrowRight, Share2 } from 'lucide-react';

export function QuizTimer({ initialSeconds = 0, onTick }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1;
        if (onTick) onTick(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onTick]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
      <Clock className="w-3.5 h-3.5 text-indigo-400" />
      <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
    </div>
  );
}

export function QuizProgress({ current = 1, total = 5 }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-medium">
        <span>Question <strong className="text-slate-200">{current}</strong> of {total}</span>
        <span>{percent}% Completed</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function QuizOption({ optionIndex, optionText, isSelected, onClick, disabled = false }) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border text-left flex items-start space-x-3.5 transition-all duration-200 group ${
        isSelected
          ? 'bg-indigo-600/15 border-indigo-500 text-slate-100 ring-1 ring-indigo-500 shadow-lg shadow-indigo-500/10'
          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
        isSelected
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-800 border border-slate-700 text-slate-400 group-hover:text-slate-200'
      }`}>
        {letters[optionIndex] || optionIndex + 1}
      </div>
      <span className="text-xs sm:text-sm leading-relaxed flex-1 mt-0.5 font-medium">
        {optionText}
      </span>
    </button>
  );
}

export function ResultCard({ results, onRetry, onBackToModules }) {
  if (!results) return null;

  const {
    score = 0,
    accuracy = 0,
    totalQuestions = 0,
    correctCount = 0,
    wrongCount = 0,
    timeSpent = 60,
    weakTopics = [],
    passed = false,
    evaluatedAnswers = [],
    aiRecommendations
  } = results;

  const mins = Math.floor(timeSpent / 60);
  const secs = timeSpent % 60;

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {/* Hero Score Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 mb-4">
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
          {passed ? 'Assessment Passed! 🎉' : 'Assessment Completed'}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {passed ? 'You demonstrated solid conceptual understanding.' : 'Great effort! Review the weak topics below to master this module.'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-2xl font-black text-indigo-400">{accuracy}%</span>
            <span className="block text-[11px] text-slate-500 font-medium mt-0.5">Accuracy</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-2xl font-black text-emerald-400">{correctCount}</span>
            <span className="block text-[11px] text-slate-500 font-medium mt-0.5">Correct</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-2xl font-black text-rose-400">{wrongCount}</span>
            <span className="block text-[11px] text-slate-500 font-medium mt-0.5">Incorrect</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-2xl font-black text-amber-400 font-mono">{mins}m {secs}s</span>
            <span className="block text-[11px] text-slate-500 font-medium mt-0.5">Time</span>
          </div>
        </div>

        {/* AI Insight Box */}
        {aiRecommendations && (
          <div className="mt-6 p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-left text-xs text-indigo-200 leading-relaxed flex items-start space-x-3">
            <div className="w-5 h-5 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
              AI
            </div>
            <div>
              <strong className="text-indigo-300 font-semibold block mb-0.5">Adaptive Learning Recommendation:</strong>
              {aiRecommendations}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center space-x-2 transition border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Fresh Quiz</span>
            </button>
          )}

          {onBackToModules && (
            <button
              onClick={onBackToModules}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <span>Back to Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Answer Breakdown with Explanations */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-100 px-1">Detailed Answers & Explanations</h3>

        {evaluatedAnswers.map((ans, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition text-left space-y-3 ${
              ans.isCorrect
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-rose-950/10 border-rose-500/30'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start space-x-3">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  ans.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {idx + 1}
                </span>
                <p className="text-sm font-semibold text-slate-100 leading-snug">
                  {ans.question}
                </p>
              </div>
              {ans.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
              {ans.options?.map((opt, optIdx) => {
                const isUserChoice = ans.selectedAnswer === optIdx;
                const isCorrectOption = ans.correctAnswer === optIdx;

                let optClass = 'bg-slate-900 border-slate-800 text-slate-400';
                if (isCorrectOption) optClass = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold';
                else if (isUserChoice && !ans.isCorrect) optClass = 'bg-rose-950/40 border-rose-500/50 text-rose-300 font-semibold line-through';

                return (
                  <div key={optIdx} className={`p-2.5 rounded-xl border text-xs leading-relaxed ${optClass}`}>
                    <strong className="mr-1.5">{['A', 'B', 'C', 'D'][optIdx]}:</strong> {opt}
                  </div>
                );
              })}
            </div>

            {ans.explanation && (
              <div className="mt-2 ml-9 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <strong className="text-indigo-400 block mb-0.5">Explanation:</strong>
                {ans.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
