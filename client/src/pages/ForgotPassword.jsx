import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('Reset instructions dispatched to your email.');
    }, 600);
  };

  return (
    <div>
      <div className="mb-6 text-left">
        <h2 className="text-xl font-bold text-white">Reset Password</h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      {sent ? (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-left space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Instructions Sent</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If an account exists for <strong className="text-white">{email}</strong>, you will receive a secure password recovery link shortly.
          </p>
          <div className="pt-3">
            <Link
              to="/login"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Sending link...' : 'Send Recovery Link'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center">
            <Link to="/login" className="text-xs text-indigo-400 font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
