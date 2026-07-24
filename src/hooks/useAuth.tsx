import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { logClientError } from "@/lib/error-logging";

interface AuthContext {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; isAdmin: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (error) {
        console.error("checkAdmin error");
        return false;
      }
      return !!data;
    } catch {
      console.error("checkAdmin exception");
      return false;
    }
  }, []);

  useEffect(() => {
    // Single source of truth: onAuthStateChange handles both initial session
    // restoration and subsequent auth events, avoiding the race condition
    // between getSession() and INITIAL_SESSION event (F-10).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // Reset synchronously before the async admin check resolves so that
        // isAdmin never briefly retains the previous session's value during
        // the network round-trip (client-side defense-in-depth only; actual
        // authorization is enforced server-side via RLS is_admin() checks).
        setIsAdmin(false);
        if (session?.user) {
          const admin = await checkAdmin(session.user.id);
          setIsAdmin(admin);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [checkAdmin]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error as Error, isAdmin: false };
    
    // Check admin status immediately after sign-in, don't wait for onAuthStateChange
    let adminStatus = false;
    if (data.user) {
      adminStatus = await checkAdmin(data.user.id);
      setIsAdmin(adminStatus);
      setUser(data.user);
      setSession(data.session);
    }
    return { error: null, isAdmin: adminStatus };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // API call may fail due to network/proxy issues — clear state regardless
    } finally {
      setIsAdmin(false);
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
