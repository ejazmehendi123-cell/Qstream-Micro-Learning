import React, { useState } from 'react';
import { AIChat } from '../components/AIChat';
import { Bot, Sparkles, MessageSquare, Compass } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AITutor() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
          <Bot className="w-7 h-7 text-indigo-500" />
          <span>Interactive AI Engineering Tutor</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Your personal 24/7 AI mentor for code walk-throughs, architectural trade-offs, and instant diagnostic quizzes.
        </p>
      </div>

      <AIChat
        initialTopicContext={profile?.learning_goal || 'Full Stack Web Development'}
      />
    </div>
  );
}
