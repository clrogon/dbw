// Supabase browser client. Anon key only — never service_role.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import {
  PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  PUBLIC_SUPABASE_URL,
} from "@/config/supabasePublic";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ||
  PUBLIC_SUPABASE_URL;

const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ||
  PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
  );
}

const authStorage =
  typeof window !== "undefined" ? window.sessionStorage : undefined;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      // sessionStorage reduces persistent XSS token exposure vs localStorage
      storage: authStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
