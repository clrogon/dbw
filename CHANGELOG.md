# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
- RLS policies changed from RESTRICTIVE to PERMISSIVE to fix CMS read/write operations.
- Added `TO authenticated` target on all admin write policies.
- `useAuth` hook refactored to use `onAuthStateChange` as single source of truth, eliminating race condition between `getSession()` and `INITIAL_SESSION` event (F-10).
- `checkAdmin` wrapped in `useCallback` to prevent infinite render loops in auth effect.
- Admin pages gate data loading on auth readiness (`!authLoading && user`) to prevent queries firing before session restoration.
- Replaced native `confirm()` dialogs with `AlertDialog` components in all admin CRUD pages (F-09).
- `window.open` calls in Booking page use `noopener,noreferrer` to prevent tab-nabbing (F-03).

### Security
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
