# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `npm audit --audit-level=high` enforced as a CI step (`.github/workflows/ci.yml`), catching high/critical dependency vulnerabilities without blocking on low/moderate noise.
- `ROADMAP.md` — canonical roadmap (Shipped / Planned), replacing the checklist previously embedded in `ARCHITECTURE.md`.

### Security
- CSP: removed `'unsafe-inline'` from `script-src` in `vercel.json`, `public/.htaccess`, and `index.html`. Verified via build-output inspection that no inline script actually required it — the JSON-LD block isn't script-src-gated and the PWA service-worker registration is emitted as an external file, not inline.
- Independent fresh security audit performed (auth flow, RLS policies vs. documented model, upload validation, CSP consistency, dependency scan). No critical or launch-blocking issues found; RLS policies and server-side upload validation were confirmed to genuinely match `SECURITY.md`'s claims. See `tasks/todo.md` for the resulting action items.
- `safeInternalPathSchema` (`src/lib/cmsValidation.ts`) now rejects paths containing a backslash, closing an open-redirect bypass (e.g. `/\evil.com`) that combined with a known `react-router-dom` advisory could send users off-domain via a CMS-controlled link.
- `useAuth.tsx`: `isAdmin` is now reset synchronously on every auth-state change before the async admin-role check resolves, removing a brief window where stale admin state from a previous session could persist client-side. Defense-in-depth only — RLS `is_admin()` remains the actual authorization boundary.
- Resolved high-severity `fast-uri` dependency advisory (GHSA-v2hh-gcrm-f6hx) via `npm audit fix` (transitive, build-tooling only, not shipped to the browser). `npm audit --audit-level=high` now exits clean.
- Upgraded `react-router` and `react-router-dom` from `6.30.4` to `7.18.1`, resolving GHSA-jjmj-jmhj-qwj2 (open-redirect/XSS) and a backslash open-redirect bug in `<Link>`/`useNavigate`. No app code changes were required (declarative-mode API is unchanged in v7 for this app's usage — no data routers/loaders in use); added `src/test/router-migration.test.tsx` covering the `ProtectedRoute` redirect and the Booking → ThankYou router-state handoff end-to-end. `npm audit --audit-level=high` confirms both advisories are gone.
- **Accepted risk (documented, not fixed):** CMS image upload validation trusts declared MIME type/extension rather than inspecting actual file bytes; server-side enforcement (RLS extension check + bucket MIME/size limits) already goes beyond client-side-only, and exploiting the remaining gap requires an already-compromised admin account. See `SECURITY.md` → Storage Security for the recorded rationale.

### Fixed
- `README.md` tech-stack badge and table corrected from Vite 5.4 to the actually-pinned Vite 6.4.3.

### Docs
- Reconciled the three overlapping cPanel deployment docs: `docs/cpanel-deployment-wizard.md` converted to a pointer stub, `docs/cpanel-full-migration-wizard.md`'s outdated `.htaccess` step brought in line with the current production config, and `docs/deployment.md` updated to clarify which cPanel doc applies to which scenario.

## [1.0.0] - 2026-07-24

### Added
- Production site config (`src/config/site.ts`) and shared `SiteSeo` (canonical always `www.dbwfitness.ao`; `noindex` on Vercel/localhost/admin).
- cPanel production runbook: `docs/cpanel-production.md`.
- `public/sitemap.xml`; hardened `robots.txt` and `.htaccess` (HTTPS/www, CSP, cache rules).
- CI provides dummy `VITE_*` so builds never rely on empty env alone.
- `src/lib/safeUrls.ts` — CMS image host allowlist, WhatsApp digits sanitizer, safe `wa.me` URL builder.

### Security
- Stop tracking `.env`; expand `.gitignore` for env files (keep `.env.example` only).
- Remove committed project id from `supabase/config.toml`.
- Vercel security headers (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).
- **HSTS** (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`) on Vercel + cPanel `.htaccess`.
- CSP: `frame-src` for Google Maps embed; `upgrade-insecure-requests`.
- CMS image URLs restricted to HTTPS allowlisted hosts (Supabase Storage, Unsplash) on admin write **and** public render.
- WhatsApp number from env is digits-only (8–15); invalid values fall back to default.
- Thank-you page validates `whatsappUrl` router state with `isSafeWhatsAppUrl`; caps `nome` query length.
- ErrorBoundary shows generic message in production (no exception text leak).
- Sign out non-admin users immediately after a successful password auth.
- CMS CTA links sanitized to internal relative paths (`sanitizeInternalPath`).
- Zod validation on all admin CMS write forms.
- Image upload folder allowlist + explicit contentType; storage extension + bucket MIME/size limits in new migration.
- Canonical RLS + storage policy consolidation migration (`20260713000000_rls_and_storage_hardening.sql`).
- Dependency upgrades: vitest 3.2.6, react-router-dom 6.30.4, vite 6.4.3, vite-plugin-pwa 1.0.3 — `npm audit` clean.

### Fixed
- Vitest include path so `test/**` suites actually run (9 tests).
- ESLint `no-explicit-any` errors blocking CI.
- Docs: booking WhatsApp URL uses router state (not localStorage).
- License wording aligned with MIT `LICENSE` file; package renamed to `dbw-fitness`.
- Drop dual Bun lockfiles; standardise on npm `package-lock.json`.

### Added
- `src/lib/cmsValidation.ts` shared Zod schemas + path sanitizer.
- `test/cmsValidation.test.ts` path/schema security tests.
- Initial repository documentation and agent configurations.
- CMS admin dashboard with full CRUD for Hero, Services, Pricing, Instructors, and Gallery.
- Role-based authentication using `user_roles` table and `is_admin()` SECURITY DEFINER function.
- Image upload to `cms-images` storage bucket via admin dashboard.
- TanStack Query-based CMS data fetching with automatic cache invalidation on save.
- PWA support with `vite-plugin-pwa`, Workbox service worker, and `/instalar` page.
- Offline fallback page and `NetworkFirst` caching strategy for API calls.
- `ProtectedRoute` component for admin route guards.
- `useAuth` hook with `AuthProvider` context for session and admin state management.
- `useCms` hooks for all CMS tables (`useHeroContent`, `useCmsServices`, `usePricingPlans`, `useCmsInstructors`, `useCmsGallery`).
- `normaliseCms.ts` utility for CMS data normalisation.
- cPanel full migration wizard documentation (`docs/cpanel-full-migration-wizard.md`).
- Deployment guide with Vercel, Netlify, Cloudflare, Docker, and cPanel configs.
- Component documentation (`docs/components.md`).
- Error pages (404, 500, 403, Offline) with Framer Motion animations.
- WhatsApp booking redirect URL passed via React Router state (not persisted to storage).

### Changed
- HeroSection, ServicesPreview, PricingSection, Services, Instructors, and Gallery pages now fetch from CMS database instead of static data.
- Admin pages invalidate TanStack Query cache on save for instant public-site updates.

### Fixed
- Removed `as any` error parsing in admin login when deriving rate-limit messaging from Supabase auth responses.
- RLS policies changed from RESTRICTIVE to PERMISSIVE to fix CMS read/write operations.
- Added `TO authenticated` target on all admin write policies.
- `useAuth` hook refactored to use `onAuthStateChange` as single source of truth, eliminating race condition between `getSession()` and `INITIAL_SESSION` event (F-10).
- `checkAdmin` wrapped in `useCallback` to prevent infinite render loops in auth effect.
- Admin pages gate data loading on auth readiness (`!authLoading && user`) to prevent queries firing before session restoration.
- Replaced native `confirm()` dialogs with `AlertDialog` components in all admin CRUD pages (F-09).
- `window.open` calls in Booking page use `noopener,noreferrer` to prevent tab-nabbing (F-03).

### Security
- (Audit) Removed detailed error object logging in admin/auth/runtime flows to avoid exposing potentially sensitive identifiers in browser console output.
- (F-01, HIGH) Removed SVG/`image/svg+xml` from upload whitelist to prevent stored XSS via malicious SVG.
- (F-02, HIGH) Admin login form no longer leaks timing information; generic error message on invalid credentials.
- (F-11, MEDIUM) Added `Content-Security-Policy` meta tag: `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`.
- (F-05, MEDIUM) `useAuth` uses `onAuthStateChange` exclusively — no parallel `getSession()` call that could desync state.
- (Gap 2) Updated `vite-plugin-pwa` from 0.21.1 to 0.19.8 to resolve high-severity vulnerabilities in `workbox-build`, `serialize-javascript`, and `@rollup/plugin-terser` (OWASP A06:2021).
- (F-08) Verified `useCallback` dependency arrays in all admin `load()` functions — `[toast]` is correct since `supabase` is module-level and state setters are stable.
- All RLS policies verified as PERMISSIVE with `is_admin()` checks on write operations.
- Session tokens stored in `sessionStorage` instead of `localStorage`.
- Admin roles stored in separate `user_roles` table (not on profile).
- `service_role` key excluded from all frontend code.
- (Investigated) `.env` was committed in an early history (`aaca205`) and removed in the audit-remediation commit (`27c44e9`). Contents were only `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (anon), and `VITE_SUPABASE_PROJECT_ID` — the same anon key already intentionally public in `src/config/supabasePublic.ts` and shipped in every build. No key rotation required.
- (Investigated) Audit findings F-04, F-06, and F-07 referenced in earlier changelog entries have no surviving record anywhere in this repo, its commits, or its PRs — the original audit report was never committed. Rather than guess at their content, a fresh security audit should supersede the old numbering (see `tasks/todo.md`).
