import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-extrabold text-3xl">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
        The requested module, learning path, or verification record does not exist or has been relocated.
      </p>
      <div className="pt-2 flex items-center space-x-3">
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
        >
          <Home className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
