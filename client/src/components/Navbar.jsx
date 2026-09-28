import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SearchBar } from './SearchBar';
import { NotificationDropdown } from './NotificationDropdown';
import { Flame, Zap, Menu, User, LogOut, Settings, Award } from 'lucide-react';

export function Navbar({ onMobileMenuToggle }) {
  const { profile, logout, isAuthenticated } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-white text-base tracking-tight">Q</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              Qstream <span className="text-indigo-400 font-extrabold">AI</span>
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 max-w-lg mx-4 hidden md:block">
        <SearchBar />
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Streak Flame Pill */}
        <div
          title={`${profile?.streak || 0} Day Learning Streak`}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold"
        >
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{profile?.streak || 1}d</span>
        </div>

        {/* XP Points Pill */}
        <div
          title={`${profile?.xp || 0} Total Experience Points`}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
          <span>{profile?.xp || 50} XP</span>
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-800 transition"
          >
            <img
              src={profile?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=alex'}
              alt={profile?.full_name || 'User Avatar'}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 object-cover"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fade-in divide-y divide-slate-800/60">
              <div className="px-3 py-2.5">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {profile?.full_name || 'Alex Rivera'}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {profile?.email || 'developer@qstream.ai'}
                </p>
                <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium rounded-md bg-indigo-500/20 text-indigo-300">
                  {profile?.preferred_difficulty?.toUpperCase() || 'MEDIUM'} LEVEL
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setProfileOpen(false); navigate('/certificates'); }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition text-left"
                >
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Certificates</span>
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Profile & Goals</span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => { setProfileOpen(false); logout(); navigate('/login'); }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
