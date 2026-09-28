import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles, RefreshCw } from 'lucide-react';
import api from '../services/api';

const QUICK_PROMPTS = [
  "What is a closure in JavaScript?",
  "Explain this concept like a beginner.",
  "Give me a production code example.",
  "Quiz me on this topic.",
  "Why did I get this question wrong?"
];

export function AIChat({ initialModuleContext = null, initialTopicContext = null }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your **Qstream AI Tutor**. 🚀\n\nI can explain complex engineering architectures, debug code pitfalls, break down algorithmic concepts, or quiz you.\n\nWhat would you like to explore today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const messageText = typeof textToSend === 'string' ? textToSend : input;
    if (!messageText || !messageText.trim() || loading) return;

    const userMessage = { role: 'user', content: messageText.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/ai/tutor', {
        message: userMessage.content,
        conversationHistory: newHistory.slice(-6),
        moduleContext: initialModuleContext,
        topicContext: initialTopicContext
      });

      if (res?.success && res?.data?.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
      } else {
        throw new Error(res?.message || 'Empty response from tutor');
      }
    } catch (err) {
      setError(err.message || 'AI service temporarily unavailable. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat history cleared. What topic or concept would you like to tackle next?`
      }
    ]);
    setError(null);
  };

  const formatMarkdown = (text) => {
    // Basic Markdown formatting helper for bold, code blocks, lists
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].includes(' ') ? '' : lines[0];
        const code = (lang ? lines.slice(1) : lines).join('\n');

        return (
          <div key={index} className="my-3 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
            {lang && (
              <div className="bg-slate-900/80 px-3 py-1 text-[10px] text-slate-400 border-b border-slate-800">
                {lang}
              </div>
            )}
            <pre className="p-3 overflow-x-auto text-indigo-300">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Inline formatting
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part.split(/(\*\*.*?\*\*)/g).map((subPart, subIdx) => {
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
              return <strong key={subIdx} className="font-bold text-slate-100">{subPart.slice(2, -2)}</strong>;
            }
            return subPart;
          })}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-[650px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-left">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
              <span>Qstream AI Tutor</span>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Contextual Learning Mentor</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Clear Conversation"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-800/60 flex items-center space-x-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] text-slate-500 flex items-center space-x-1 shrink-0">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Prompts:</span>
        </span>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 transition border border-slate-700/60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              m.role === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none'
            }`}>
              {formatMarkdown(m.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75" />
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-150" />
              <span className="ml-1 text-slate-400">Tutor is analyzing...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => handleSend(messages[messages.length - 1]?.content)}
              className="flex items-center space-x-1 text-rose-200 underline font-semibold ml-2"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a concept, request a code example, or type 'Quiz me'..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow-md shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
