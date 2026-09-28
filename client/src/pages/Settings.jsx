import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Settings as SettingsIcon, User, Target, Clock, Shield, Save } from 'lucide-react';
import api from '../services/api';

const GOALS = [
  'Full Stack Web Development',
  'MERN Stack Development',
  'Data Structures & Algorithms',
  'Java DSA for Placements',
  'AI & Machine Learning',
  'Generative AI',
  'Cloud Computing',
  'AWS Cloud Developer',
  'DevOps Engineering',
  'Docker & Kubernetes',
  'Cybersecurity Fundamentals',
  'Database & SQL Mastery',
  'System Design Fundamentals',
  'Interview Preparation'
];

export function Settings() {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [learningGoal, setLearningGoal] = useState(GOALS[0]);
  const [difficulty, setDifficulty] = useState('medium');
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setLearningGoal(profile.learning_goal || GOALS[0]);
      setDifficulty(profile.preferred_difficulty || 'medium');
      setDailyMinutes(profile.daily_goal_minutes || 30);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/auth/profile', {
        full_name: fullName,
        bio,
        learning_goal: learningGoal,
        preferred_difficulty: difficulty,
        daily_goal_minutes: Number(dailyMinutes)
      });

      if (res?.success) {
        toast.success('Profile preferences updated successfully!');
        await refreshProfile();
      } else {
        throw new Error(res?.message || 'Failed to update settings');
      }
    } catch (err) {
      toast.error(err.message || 'Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
          <SettingsIcon className="w-7 h-7 text-indigo-500" />
          <span>Learning Preferences & Profile</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your career specialization target, daily study goal, and baseline assessment difficulty.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Professional Bio / Focus
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your background or engineering targets..."
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Primary Career Target
            </label>
            <div className="relative">
              <Target className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <select
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                {GOALS.map((g, i) => (
                  <option key={i} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Assessment Difficulty Baseline
            </label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="easy">Easy (Fundamentals Focus)</option>
                <option value="medium">Medium (Standard Engineering)</option>
                <option value="hard">Hard (Advanced Systems)</option>
                <option value="advanced">Advanced (Staff/Architect)</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Daily Study Target (Minutes)
          </label>
          <div className="relative">
            <Clock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="number"
              min={5}
              max={240}
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Used to calibrate your daily learning streak reminders.
          </span>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
