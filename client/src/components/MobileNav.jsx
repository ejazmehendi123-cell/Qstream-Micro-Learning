import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
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
  Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Learning Paths', path: '/paths', icon: Map },
  { name: 'All Modules', path: '/modules', icon: Layers },
  { name: 'Review Today', path: '/revision', icon: RotateCcw },
  { name: 'Skill Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'AI Tutor', path: '/ai-tutor', icon: Bot },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Certificates', path: '/certificates', icon: Award },
  { name: 'Search Catalog', path: '/search', icon: Search },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function MobileNav({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-[#0B0F19] border-r border-slate-800 p-5 flex flex-col h-full z-10 animate-fade-in shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white">
              Q
            </div>
            <span className="font-bold text-base text-white">
              Qstream <span className="text-indigo-400">AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition
                  ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
