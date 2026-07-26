// Supabase browser client. Anon key only — never service_role.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import {
  PUBLIC_SUPABASE_URL,
  MISSING_PUBLISHABLE_KEY_SENTINEL,
} from "@/config/supabasePublic";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ||
  PUBLIC_SUPABASE_URL;

const SUPABASE_PUBLISHABLE_KEY_FROM_ENV =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ||
  "";

// SECURITY: We deliberately do NOT fall back to a committed anon JWT. A
// committed key with a long `exp` is unrotatable in practice. Instead, the
// build/runtime fails loudly with an actionable message so missing env is
// caught at build time (Vite replaces import.meta.env at compile).
const SUPABASE_PUBLISHABLE_KEY = SUPABASE_PUBLISHABLE_KEY_FROM_ENV || MISSING_PUBLISHABLE_KEY_SENTINEL;

const isMissingKey = SUPABASE_PUBLISHABLE_KEY === MISSING_PUBLISHABLE_KEY_SENTINEL;

if (isMissingKey) {
  // Throwing at module load guarantees the failure is visible during `vite build`
  // (Vite evaluates config eagerly), during `npm run dev` on first request,
  // and in production on first page load rather than producing a silent 401 storm.
  const message =
    "Missing VITE_SUPABASE_PUBLISHABLE_KEY. Set it on Vercel (Production + Preview) " +
    "and locally in .env (see .env.example). The Supabase anon key is intentionally " +
    "no longer committed to src/config/supabasePublic.ts so it can be rotated without " +
    "shipping a stale key.";
  console.error(`[supabase/client] ${message}`);
  throw new Error(message);
}

if (!SUPABASE_URL) {
  throw new Error(
    "Missing Supabase URL. Set VITE_SUPABASE_URL in your environment (see .env.example)."
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
