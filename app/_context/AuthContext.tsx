import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthProps = {
  user: User | null;
  session: Session | null;
  initialized: boolean;
  signOut: () => void;
};

const AuthContext = createContext<Partial<AuthProps>>({});

// Hook so screens can read login state without passing props through every layer.
export function useAuth() {
  return useContext(AuthContext);
}

// Wraps the app so Supabase auth state (user + session) is shared everywhere.
export const AuthProvider = ({ children }: any) => {
  // User, session, and whether Supabase finished the first session check on startup.
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  // On open: read stored session, then subscribe so login/logout updates the UI.
  useEffect(() => {
    // Checks if the user was already logged in from a previous visit.
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setInitialized(true);
    };

    fetchSession();

    // Keeps React in sync when the user signs in, out, or the session refreshes.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Clears the Supabase session so the app treats the user as logged out.
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    initialized,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};