import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Target, Award, Zap, Flame, Shield, LogOut } from 'lucide-react';

export function Profile() {
  const { profile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in text-left">
      {/* Header section with glow */}
      <div className="relative p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
              <User className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {profile?.full_name || 'Scholar'}
            </h1>
            <p className="text-indigo-400 font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {profile?.email || 'scholar@qstream.ai'}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                {profile?.learning_goal || 'Full Stack Web Development'}
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                {profile?.streak || 1} Day Streak
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 flex items-center gap-4 hover:border-indigo-500/50 transition-colors cursor-default group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{(profile?.xp || 50).toLocaleString()}</div>
            <div className="text-xs text-slate-400 font-medium">Total XP Earned</div>
          </div>
        </div>
        
        <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 flex items-center gap-4 hover:border-purple-500/50 transition-colors cursor-default group">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{profile?.completed_modules || 8}</div>
            <div className="text-xs text-slate-400 font-medium">Modules Mastered</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 flex items-center gap-4 hover:border-emerald-500/50 transition-colors cursor-default group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Pro</div>
            <div className="text-xs text-slate-400 font-medium">Account Status</div>
          </div>
        </div>
      </div>

      {/* Settings / Actions */}
      <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-6">Account Actions</h3>
        
        <div className="space-y-4">
          <button 
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of Qstream
          </button>
        </div>
      </div>
    </div>
  );
}
