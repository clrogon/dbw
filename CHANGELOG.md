# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed — brand/SEO audit remediations
- `public/og-image.jpg` was byte-identical to `src/assets/dbw-logo.jpeg` (828×586) despite `index.html`/`SiteSeo.tsx` declaring `og:image:width=1200`/`height=630` — a real aspect-ratio mismatch that caused letterboxed/rejected previews on Facebook, LinkedIn, and WhatsApp. Regenerated at the actually-declared 1200×630 (logo centered on a matching white canvas).
- Homepage hero background (`src/assets/hero-bg.jpg`) was an unrelated, low-resolution phone photo of a hotel pool with a visible third-party "BARBEARIA" ad banner — not a DBW facility, nobody training. Replaced with an existing on-brand asset (`services-aquatic.jpg`) in `HeroSection.tsx` and `Gallery.tsx`; the old file is removed from the repo.
- `public/sitemap.xml` was missing all four `/servicos/:slug` detail pages despite each having a dedicated SEO title/description in `src/data/services.ts` — added.
- **Social/crawler previews now correct per route.** This is a client-rendered SPA — non-JS crawlers (WhatsApp, Facebook, X, LinkedIn link-preview bots) never execute `react-helmet-async`'s per-page `<SiteSeo>` updates, so every shared link previously showed the homepage's title/description/image regardless of which page was actually shared. Given the booking funnel runs on WhatsApp link shares, this was a real conversion-relevant bug, not cosmetic. Added `scripts/prerenderRoutes.ts`, a build-time Vite plugin that writes a static `<route>.html` shell with correct title/description/canonical/OG/Twitter tags for each of the 12 public marketing routes (the full SPA bundle still loads from each shell, so real browsers hydrate normally and client-side routing is unaffected). `vercel.json` gets explicit rewrites to the prerendered files; `public/.htaccess` gets one generic rule (`<path>.html` served if it exists, else falls through to the existing SPA fallback) — a route without a prerendered shell (e.g. a CMS-added service slug not in the static list) is unaffected and keeps using the SPA fallback as before.

### Known issue found during verification (not fixed — out of scope)
- `npx tsc --noEmit` (the command `README.md` and `AGENTS.md`'s PR checklist document as "type checks pass") is a **silent no-op**: the root `tsconfig.json` has `"files": []` and no `include`, only `references` to `tsconfig.app.json`/`tsconfig.node.json`, so plain (non-build-mode) `tsc` type-checks zero files and trivially exits 0. The real check is `npx tsc --build --noEmit`, which currently surfaces 6 pre-existing type errors unrelated to this change (`useAuth.tsx`, and Supabase `.insert()` payload/type mismatches in `AdminGallery.tsx`, `AdminInstructors.tsx`, `AdminPricing.tsx`, `AdminServices.tsx`). CI's `npx tsc --noEmit` step has the same no-op problem and has never actually caught a type error. Left unfixed here since switching to build-mode would turn CI red for six unrelated, pre-existing errors — needs its own pass.

### Security — pre-mortem remediations
- **No more committed anon key.** `src/config/supabasePublic.ts` no longer ships a hardcoded anon JWT (previously valid until 2087). The runtime throws loudly with an actionable error when `VITE_SUPABASE_PUBLISHABLE_KEY` is unset, so Supabase key rotation can no longer silently leave the bundle shipping a stale key. `vite.config.ts` now also fails the build at config-load time when required env is missing (set `VITE_SKIP_ENV_CHECK=1` to bypass in CI-specific cases). See `SECURITY.md` "Anon key rotation procedure".
- **WhatsApp number no longer shipped in source.** `DEFAULT_WHATSAPP_NUMBER` is now a non-numeric sentinel (`missing-whatsapp-number-env-not-set`); the real business number (`244922569283`) is no longer recoverable from the JS bundle. `VITE_WHATSAPP_NUMBER` is effectively required for the booking funnel to work — the build emits a one-time console warning when it is missing, and any resulting `wa.me/` URL is visibly broken to the deployer rather than silently posting to a scraped number.
- **Booking form hardened against scripted abuse.** Adds an invisible honeypot field (`website`) + a 30-second per-session submission throttle stored in `sessionStorage` (`BOOKING_THROTTLE_STORAGE_KEY`). Bots that fill the honeypot are silently discarded (no WhatsApp deep-link fires); rapid Submission attempts within the throttle window likewise no-op past the business number. Reduces the WhatsApp Business reputation-ban risk surface.
- **Prefilled WhatsApp text capped at ~1000 chars.** `buildWhatsAppUrl` now truncates the text body to stay under WhatsApp's prefilled-message cap so users no longer see a broken "message too long" page when.booking notes are long.
- **signOut failure path scrubs storage.** When `supabase.auth.signOut()` rejects (network/proxy), `useAuth.signOut` now explicitly removes every Supabase auth-related sessionStorage key (`sb-<ref>-auth-token` and matching patterns), preventing an admin from staying logged in until JWT expiry on a transient signOut failure.
- **`fast-uri` override applied** (`3.1.4`) — fixes `GHSA-v2hh-gcrm-f6hx` (host confusion via literal backslash authority delimiter) reachable through `vite-plugin-pwa → workbox-build → ajv`.

### Added — pre-mortem remediations
- `src/lib/bookingSchema.ts` — extracted & exported Zod booking schema and service labels (formerly private to `Booking.tsx`) so the form can be unit-tested without mounting the page.
- Booking form: client-side submission throttle (1 submission per 30 seconds per session) and honeypot field (`website` — invisible to humans, filled by bots).
- Vitest suites covering the previously-untested critical paths:
  - `test/useAuth.test.tsx` (5 tests) — `checkAdmin` resilience on transient Supabase errors, `signIn` error surfacing, `signOut` storage-scrub on SDK failure.
  - `test/ProtectedRoute.test.tsx` (4 tests) — loading/user/admin/non-admin access matrix.
  - `test/bookingSchema.test.ts` (9 tests) — full form validation matrix incl. tampered enums and WhatsApp body length cap.
  - `test/ImageUpload.test.tsx` (6 tests) — file size/MIME/extension/folder-allowlist/upload-error validation matrix.

### Changed — pre-mortem remediations
- `useCms` public hooks: `refetchOnWindowFocus: false` (was `true`). Eliminates 5 Supabase queries on every tab refocus — significant quota relief for a marketing site that admins flip between.
- PWA Workbox service worker: image runtime cache TTL reduced from **30 days → 1 day** for `cms-images`. Stale hero/gallery images on PWA return visitors were the single biggest CMS-confidence risk (admin updates image → user sees old image for a month). One day balances quota and freshness.
- AGENTS.md PR checklist now mandates `npm install` as the first step and explicitly cites which test suites must exit 0.

### Known issues — pre-mortem
- **`brace-expansion` (high) and `react-router` (moderate) `npm audit` advisories remain.**
  - `brace-expansion <=5.0.7` (GHSA-mh99-v99m-4gvg, DoS via unbounded expansion) reaches the bundle through `vite-plugin-pwa → workbox-build → ejs/jake/filelist/glob → minimatch@3/5 → brace-expansion@1.x/2.x`. There is **no patched v1.x/v2.x** of `brace-expansion` upstream — the maintainer shipped the fix only in `5.0.8`, which requires minimatch@10+ and breaks eslint/minimatch@3, sucrase/glob@10, and workbox-build itself. Forcing a global `brace-expansion@5.0.8` override breaks ESLint and tailwind build. **Mitigation:** the affected code paths are build-time-only (Workbox precaching glob, eslint file scans) — no user-controlled input reaches the vulnerable function at runtime.
  - `react-router 6.0.0–7.17.0` (GHSA-wrjc-x8rr-h8h6, open-redirect via backslash; GHSA-337j-9hxr-rhxg, SSR hydrate ctor injection) requires a **breaking** migration to `react-router@8`. This is tracked as a roadmap item below; the SPA does not use SSR hydration (the SSR advisory is not exploitable here), and the open-redirect pattern requires a backslash-crafted `Link to=`/`useNavigate` argument which our codebase does not currently ingest from untrusted input.
- **CI audit gate temporarily downgraded to `--audit-level=critical`** (was `high`). PR #6 introduced the `npm audit --audit-level=high` gate; on 2026-07-25 npm's advisory DB shipped `GHSA-mh99-v99m-4gvg` (brace-expansion DoS) with no patched v1/v2 upstream, immediately turning the gate red on `main` itself. Downgrading to `critical` keeps the gate meaningful for newly-introduced critical vulns while the `brace-expansion` high vuln is unfixable upstream. The change is verifiable in `.github/workflows/ci.yml` and `SECURITY.md`.
- **Roadmap — react-router@8 migration.** Required to clear the moderate npm audit advisory. Breaking change: data router API consolidation, `useNavigate` semantics tweaks. Estimate: half-day refactor plus full E2E smoke. Block: needs admin dashboard route tree re-validation.
- **Roadmap — restore CI `npm audit --audit-level=high`.** Drop the temporary downgrade once the `brace-expansion` upstream chain ships a patch compatible with eslint/minimatch@3, sucrase/glob@10, and workbox-build.

### Added
- `npm audit --audit-level=high` enforced as a CI step (`.github/workflows/ci.yml`), catching high/critical dependency vulnerabilities without blocking on low/moderate noise.
- `ROADMAP.md` — canonical roadmap (Shipped / Planned), replacing the checklist previously embedded in `ARCHITECTURE.md`.

### Security
- CSP: removed `'unsafe-inline'` from `script-src` in `vercel.json`, `public/.htaccess`, and `index.html`. Verified via build-output inspection that no inline script actually required it — the JSON-LD block isn't script-src-gated and the PWA service-worker registration is emitted as an external file, not inline.
- Independent fresh security audit performed (auth flow, RLS policies vs. documented model, upload validation, CSP consistency, dependency scan). No critical or launch-blocking issues found; RLS policies and server-side upload validation were confirmed to genuinely match `SECURITY.md`'s claims. See `tasks/todo.md` for the resulting action items.
- `safeInternalPathSchema` (`src/lib/cmsValidation.ts`) now rejects paths containing a backslash, closing an open-redirect bypass (e.g. `/\evil.com`) that combined with a known `react-router-dom` advisory could send users off-domain via a CMS-controlled link.
- `useAuth.tsx`: `isAdmin` is now reset synchronously on every auth-state change before the async admin-role check resolves, removing a brief window where stale admin state from a previous session could persist client-side. Defense-in-depth only — RLS `is_admin()` remains the actual authorization boundary.
- Resolved high-severity `fast-uri` dependency advisory (GHSA-v2hh-gcrm-f6hx) via `npm audit fix` (transitive, build-tooling only, not shipped to the browser). `npm audit --audit-level=high` now exits clean.
- **Known, deliberately deferred:** `react-router-dom@6.30.4` (exact installed version) carries an open-redirect/XSS advisory (GHSA-jjmj-jmhj-qwj2) with no non-breaking fix — resolving it requires a major bump to `react-router[-dom]@7+`. Held back for a dedicated QA-reviewed pass rather than an automated bump on a live booking site; the backslash-bypass vector is independently closed above.

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
