import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Layers,
  RotateCcw,
  BarChart3,
  Bot,
  Trophy,
  Award,
  Search,
  Settings,
  Sparkles,
  UserCircle
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Profile', path: '/profile', icon: UserCircle },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Learning Paths', path: '/paths', icon: Map },
  { name: 'All Modules', path: '/modules', icon: Layers },
  { name: 'Review Today', path: '/revision', icon: RotateCcw, highlight: true },
  { name: 'Skill Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'AI Tutor', path: '/ai-tutor', icon: Bot, badge: 'AI' },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Certificates', path: '/certificates', icon: Award },
  { name: 'Search Catalog', path: '/search', icon: Search },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0B0F19] border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent hover:border-slate-800'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Pro AI Upskill Card at bottom */}
      <div className="mt-auto pt-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/20 text-left">
          <div className="flex items-center space-x-2 text-indigo-400 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold tracking-tight">Adaptive Learning</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Qstream adapts question difficulty to your retention curves in real-time.
          </p>
          <NavLink
            to="/ai-tutor"
            className="block text-center py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
          >
            Launch AI Tutor
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
