import "@testing-library/jest-dom";

// Tests must never depend on real Supabase env values. Defensive: if a future
// vitest/vite config merge ever evaluates vite.config.ts during test runs,
// this flag short-circuits our "build fails loudly on missing env" guard
// (which is correct for build, wrong for unit tests that mock the client).
process.env.VITE_SKIP_ENV_CHECK = "1";

// Provide a placeholder anon key for tests that transitively import the real
// Supabase client. The client module throws loudly when
// VITE_SUPABASE_PUBLISHABLE_KEY is unset so missing env fails fast in real
// builds — but tests must not crash on import. Vitest sets import.meta.env at
// config load time, before this file runs, so we set it via the env object
// directly (defensive: only inject if unset).
const env = (import.meta as unknown as { env?: Record<string, string> }).env ?? {};
if (env && env.VITE_SUPABASE_PUBLISHABLE_KEY === undefined) {
  env.VITE_SUPABASE_PUBLISHABLE_KEY = "test-anon-key-placeholder";
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
