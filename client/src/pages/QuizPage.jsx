import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizTimer, QuizProgress, QuizOption } from '../components/QuizUI';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import { useToast } from '../contexts/ToastContext';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import api from '../services/api';

export function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Section 14 Guard: NEVER allow /quiz/undefined
  if (!id || id === 'undefined' || id === 'null') {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <ErrorState
          title="Invalid Quiz Request"
          message="Unable to start quiz. Module identifier is missing or undefined."
          onRetry={() => navigate('/modules')}
        />
      </div>
    );
  }

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call backend to initialize a fresh quiz session
      const res = await api.post('/quizzes/generate', {
        moduleId: id,
        count: 5
      });

      if (res?.success && res?.data?.questions?.length > 0) {
        setQuizData(res.data);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setElapsedSeconds(0);
      } else {
        throw new Error(res?.message || 'Failed to generate quiz questions');
      }
    } catch (err) {
      setError(err.message || 'Unable to start quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startQuiz();
  }, [id]);

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < (quizData?.questions?.length || 1) - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizData?.quizId) return;

    const questions = quizData.questions;
    const formattedAnswers = questions.map((q, idx) => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : null,
      timeSpent: Math.max(5, Math.round(elapsedSeconds / questions.length))
    }));

    setSubmitting(true);
    try {
      const res = await api.post(`/quizzes/${quizData.quizId}/submit`, {
        answers: formattedAnswers,
        timeSpent: elapsedSeconds
      });

      if (res?.success && res?.data) {
        // Navigate to results page with state
        navigate(`/quiz/${id}/results`, { state: { results: res.data } });
      } else {
        throw new Error(res?.message || 'Quiz submission failed');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit quiz.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Generating fresh adaptive questions with AI..." />;
  }

  if (error || !quizData) {
    return <ErrorState message={error || 'Unable to load quiz'} onRetry={startQuiz} />;
  }

  const questions = quizData.questions || [];
  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const allAnswered = Object.keys(selectedAnswers).length === total;
  const isLastQuestion = currentIndex === total - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left animate-fade-in pb-12">
      {/* Top Bar: Progress, Timer, and Topic */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              {quizData.topic} • {quizData.difficulty}
            </span>
            <h2 className="text-sm font-semibold text-slate-200 mt-0.5 truncate max-w-sm">
              {quizData.moduleTitle}
            </h2>
          </div>
          <QuizTimer onTick={(sec) => setElapsedSeconds(sec)} />
        </div>

        <QuizProgress current={currentIndex + 1} total={total} />
      </div>

      {/* Question Box */}
      {currentQuestion && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block">
              Question {currentIndex + 1}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options?.map((opt, optIdx) => (
              <QuizOption
                key={optIdx}
                optionIndex={optIdx}
                optionText={opt}
                isSelected={selectedAnswers[currentIndex] === optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={submitting}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation and Submit Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || submitting}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs font-semibold flex items-center space-x-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{submitting ? 'Evaluating...' : 'Submit Assessment'}</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/25 transition"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
