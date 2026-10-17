import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbProfile } from '../types/database';

interface SignUpResult {
  error: string | null;
  requiresEmailConfirmation: boolean;
  user: User | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: DbProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<DbProfile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to translate Supabase Auth error messages into friendly, supportive phrasing
function formatAuthError(error: AuthError | Error): string {
  const msg = error.message.toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'The email address or password entered does not match our records. Please verify and try again.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists') || msg.includes('email already')) {
    return 'An account with this email address already exists. Try signing in instead.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please verify your email address before signing in. Check your inbox for the confirmation link.';
  }
  if (msg.includes('password should be at least') || msg.includes('weak_password')) {
    return 'Password must be at least 6 characters long.';
  }
  if (msg.includes('rate limit')) {
    return 'Email rate limit exceeded. Please wait a few moments before trying again, or use existing login credentials.';
  }
  if (msg.includes('invalid') && msg.includes('email')) {
    return 'Please enter a valid email address.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Unable to reach the server. Please check your internet connection.';
  }
  return error.message || 'An unexpected authentication error occurred. Please try again.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create user profile from the database
  const fetchProfile = useCallback(async (userId: string, currentUser?: User) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile does not exist yet; create it safely
        const newProfile: Partial<DbProfile> = {
          id: userId,
          display_name: currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || 'Friend',
          avatar_url: currentUser?.user_metadata?.avatar_url || null,
          preferred_language: 'English',
          streak_days: 1,
          daily_goal: 'Mindful 10 mins daily',
          store_journal_consent: true,
          store_chat_consent: false,
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (!insertErr && inserted) {
          setProfile(inserted as DbProfile);
        }
      } else if (data) {
        setProfile(data as DbProfile);
      }
    } catch {
      // Ignore background profile fetch errors to keep app resilient
    }
  }, []);

  // Initialize session and auth state listener
  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Check existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id, currentSession.user);
      }
      setLoading(false);
    });

    // 2. Subscribe to auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchProfile(newSession.user.id, newSession.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file, or use demo mode.',
      };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: formatAuthError(error) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<SignUpResult> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase is not configured. Please add your Supabase credentials to .env to enable real account creation.',
        requiresEmailConfirmation: false,
        user: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: displayName?.trim() || email.split('@')[0],
          },
        },
      });

      if (error) {
        return {
          error: formatAuthError(error),
          requiresEmailConfirmation: false,
          user: null,
        };
      }

      // If Supabase has email confirmations turned on, data.session is null and data.user is created
      // In Supabase, if the user already exists, it returns a user object with an empty identities array []
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          error: 'An account with this email address already exists. Try signing in instead.',
          requiresEmailConfirmation: false,
          user: null,
        };
      }

      const requiresConfirmation = Boolean(data.user && !data.session);

      return {
        error: null,
        requiresEmailConfirmation: requiresConfirmation,
        user: data.user,
      };
    } catch (err: any) {
      return {
        error: formatAuthError(err),
        requiresEmailConfirmation: false,
        user: null,
      };
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Continue clearing local state even if network fails
      }
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase is not configured. Please configure your .env file.',
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        return { error: formatAuthError(error) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  };

  const updateProfile = async (updates: Partial<DbProfile>): Promise<{ error: string | null }> => {
    if (!user || !isSupabaseConfigured) {
      return { error: 'Not authenticated or database not configured.' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      if (data) {
        setProfile(data as DbProfile);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Failed to update profile.' };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
