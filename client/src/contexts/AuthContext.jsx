import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadUserProfile = async (token) => {
    try {
      const res = await api.get('/auth/me');
      if (res?.success && res?.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.warn('[Auth Profile Load Warning]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            localStorage.setItem('qstream_auth_token', session.access_token);
            await loadUserProfile(session.access_token);
          } else {
            localStorage.removeItem('qstream_auth_token');
            setLoading(false);
          }

          // Listen for auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (newSession) {
              localStorage.setItem('qstream_auth_token', newSession.access_token);
              await loadUserProfile(newSession.access_token);
            } else {
              localStorage.removeItem('qstream_auth_token');
              setUser(null);
              setProfile(null);
              setLoading(false);
            }
          });

          return () => subscription.unsubscribe();
        } catch (e) {
          console.warn('Supabase session init failed:', e.message);
          setLoading(false);
        }
      } else {
        // Local developer mode: use stored dev token or initialize demo session
        const stored = localStorage.getItem('qstream_auth_token');
        if (stored && stored !== 'dev-demo-session-token') {
          await loadUserProfile(stored);
        } else {
          localStorage.removeItem('qstream_auth_token');
          setLoading(false);
        }
      }
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        localStorage.setItem('qstream_auth_token', data.session.access_token);
        await loadUserProfile(data.session.access_token);
        toast.success(`Welcome back, ${data.user.user_metadata?.full_name || 'Scholar'}!`);
        return { success: true };
      } else {
        // Local simulation
        localStorage.setItem('qstream_auth_token', 'dev-demo-session-token');
        await loadUserProfile('dev-demo-session-token');
        toast.success('Logged in successfully!');
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to sign in');
      return { success: false, error: err.message };
    }
  };

  const register = async (email, password, fullName, learningGoal) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              learning_goal: learningGoal || 'Full Stack Web Development',
              preferred_difficulty: 'medium'
            }
          }
        });
        if (error) throw error;
        if (data.session) {
          localStorage.setItem('qstream_auth_token', data.session.access_token);
          await loadUserProfile(data.session.access_token);
        }
        toast.success('Account created successfully! Welcome to Qstream AI.');
        return { success: true };
      } else {
        localStorage.setItem('qstream_auth_token', 'dev-demo-session-token');
        await loadUserProfile('dev-demo-session-token');
        toast.success('Account registered successfully!');
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('qstream_auth_token');
      setUser(null);
      setProfile(null);
      toast.info('You have been signed out.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem('qstream_auth_token');
    if (token) await loadUserProfile(token);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user || profile),
      login,
      register,
      logout,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
