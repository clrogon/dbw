/**
 * Public Supabase project identity (anon / publishable only).
 *
 * - `PUBLIC_SUPABASE_URL` — the project URL is intentionally public (it ships
 *   in the bundle). It can stay as a build-time fallback so the `dev` server
 *   works without env vars on a known project.
 * - `PUBLIC_SUPABASE_PUBLISHABLE_KEY` — DEFANGED. We deliberately do NOT ship a
 *   hardcoded anon JWT here any more. A committed key with a 60-year `exp` is
 *   effectively unrotatable: rotating on the Supabase dashboard would silently
 *   leave the bundle shipping a stale key, producing mysterious 401s that look
 *   like RLS regressions. The runtime guard in `supabase/client.ts` now fails
 *   *loudly* (build-time + import-time) if `VITE_SUPABASE_PUBLISHABLE_KEY` is
 *   unset so a broken build surfaces immediately rather than at random.
 * - `PUBLIC_SUPABASE_PROJECT_ID` — kept as a non-sensitive identifier (used by
 *   tooling and docs; never used as a credential).
 *
 * NEVER put the service_role key here.
 */

export const PUBLIC_SUPABASE_URL =
  "https://ikwotysmjlqqurucxepf.supabase.co";

/**
 * Sentinel emitted when `VITE_SUPABASE_PUBLISHABLE_KEY` is missing.
 * Detectable at a glance in build logs / DevTools so a misconfigured deploy
 * is obvious rather than producing a blank page on the live site.
 */
export const MISSING_PUBLISHABLE_KEY_SENTINEL =
  "__MISSING_VITE_SUPABASE_PUBLISHABLE_KEY__";

export const PUBLIC_SUPABASE_PROJECT_ID = "ikwotysmjlqqurucxepf";
