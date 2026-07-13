/**
 * Public Supabase project identity (anon / publishable only).
 *
 * These values are intentionally public — they ship in the browser bundle.
 * Prefer setting VITE_* on Vercel so they can be rotated without a code change.
 * Fallbacks keep production builds working if env vars are missing.
 *
 * NEVER put the service_role key here.
 */
export const PUBLIC_SUPABASE_URL =
  "https://ikwotysmjlqqurucxepf.supabase.co";

export const PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlrd290eXNtamxxcXVydWN4ZXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzQwMzgsImV4cCI6MjA4NzQxMDAzOH0.TrKA6-dUJvFNu7O1x2eR2fV-zwfhW1TrOJ4RCZ4qZvw";

export const PUBLIC_SUPABASE_PROJECT_ID = "ikwotysmjlqqurucxepf";
