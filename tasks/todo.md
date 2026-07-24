# DBW — Project Plan (Production-Readiness Pass, 2026-07-24)

> Convention per `CLAUDE.MD` Task Management: plan lives here with checkable items;
> mark items complete as work happens; review/results are documented in the Review
> section at the bottom. Corrections/lessons go in `tasks/lessons.md`, not here.

## Context

Follow-up to the 2026-07-24 PM review below. The owner asked to actually make the
site production-ready, so this pass executed the backlog directly (code fixes via
`fullstack-developer`, docs via `doc-writer`, a fresh independent audit via
`cybersecurity-check`) rather than just planning it. Items below are updated to
reflect what's actually done vs. still open.

---

## Backlog

### P0 — Critical: production-readiness gaps requiring live Supabase dashboard access

None of these are fixable from the repo — they require the Supabase project dashboard
or Management API credentials that no agent in this session has. **Owner action required.**

- [ ] **Confirm the RLS + storage hardening migration is applied to the LIVE production Supabase project.**
      Migration file exists at `supabase/migrations/20260713000000_rls_and_storage_hardening.sql`. Repo state cannot prove it has been run against production — check via Supabase dashboard → Database → Migrations, or `supabase db push` / `supabase migration list --linked`.

- [ ] **Enable Supabase leaked-password protection and MFA for admin accounts.**
      Supabase dashboard → Authentication → Settings (leaked password protection) and → MFA.

- [ ] **Confirm public sign-ups are disabled in Supabase Auth (admin-only).**
      Supabase dashboard → Authentication → Settings → "Allow new users to sign up".

### P1 — High: dependency/security follow-ups

- [ ] **Decide on the react-router-dom major-version upgrade.**
      Fresh audit confirmed a real advisory: installed `react-router-dom@6.30.4` (exact version) has GHSA-jjmj-jmhj-qwj2 (open-redirect/XSS) and a backslash open-redirect bug in `<Link>`/`useNavigate`. Non-breaking fix doesn't exist — requires `react-router[-dom]@7.18.1+`, a breaking major bump. Held back intentionally from this pass: a major router upgrade on a live booking site needs a staging deploy + manual route QA, not a silent automated bump. The backslash-bypass vector specifically is already closed independently (see Done, below).
- [x] **fast-uri high-severity npm audit finding** — resolved via `npm audit fix` (bumped transitive `fast-uri` 3.1.3 → 3.1.4). `npm audit --audit-level=high` now exits 0.

### P2 — Medium: low-priority hardening (post-launch acceptable)

- [ ] **Consider server-side magic-byte validation for CMS image uploads.**
      Current validation (extension allowlist via RLS + bucket MIME/size limits) is genuinely server-side, not just client-side as originally worried — but still trusts declared MIME/extension, not actual file bytes. Requires an already-compromised admin account to exploit. Not launch-blocking; revisit if the admin pool grows beyond fully-trusted staff.

---

## Done this pass (2026-07-24)

- [x] **Cut a real release.** `CHANGELOG.md` `[Unreleased]` moved into a dated `## [1.0.0] - 2026-07-24` section; fresh `[Unreleased]` started for ongoing work.
- [x] **`npm audit --audit-level=high` enforced in CI** (`.github/workflows/ci.yml`), failing only on high/critical.
- [x] **CSP hardened**: `'unsafe-inline'` removed from `script-src` in `vercel.json`, `public/.htaccess`, and `index.html` — verified via build-output inspection that nothing actually needed it (JSON-LD isn't script-src-gated; PWA service-worker registration is an external file, not inline). Confirmed via passing build + full test suite.
- [x] **README Vite badge/table fixed** (5.4 → 6.4.3, matching `package.json`).
- [x] **cPanel docs reconciled**: `cpanel-deployment-wizard.md` converted to a pointer stub, `cpanel-full-migration-wizard.md`'s stale `.htaccess` step brought current, `docs/deployment.md` clarified.
- [x] **`ROADMAP.md` created** at repo root; `ARCHITECTURE.md`'s embedded checklist replaced with a pointer to it.
- [x] **`.env`-in-history resolved**: confirmed committed once (`aaca205`), removed in `27c44e9`. Contents were only the anon/publishable key — identical to the key already intentionally public in `src/config/supabasePublic.ts`. No rotation needed.
- [x] **F-04/F-06/F-07 resolved**: confirmed unrecoverable (no trace in any commit, PR, or issue across the repo's full history). Superseded by a fresh independent security audit instead of guessing at lost findings.
- [x] **Fresh security audit performed** (auth flow, RLS policies vs. documented model, upload validation, CSP consistency, dependency scan, secret scan). No critical/launch-blocking findings. RLS and upload validation confirmed to genuinely match `SECURITY.md`'s claims. Findings: react-router advisory (P1 above), a path-sanitizer backslash gap (fixed, see below), an `isAdmin` race condition (fixed, see below), and the two low-priority items above.
- [x] **`safeInternalPathSchema` hardened** against backslash open-redirect bypass (`src/lib/cmsValidation.ts`), with new test coverage in `test/cmsValidation.test.ts`.
- [x] **`isAdmin` race condition fixed** in `useAuth.tsx` — reset synchronously before the async admin-role check resolves.

---

## Review

**Status as of 2026-07-24 (production-readiness execution pass):**

All code/doc-fixable items from the original PM backlog plus every actionable finding from
the fresh security audit are resolved: CI now gates on `npm audit --audit-level=high` (clean),
CSP no longer needs `'unsafe-inline'` in `script-src`, the CMS path sanitizer closes the
backslash open-redirect bypass, the `isAdmin` race condition is fixed, docs are reconciled,
`ROADMAP.md` exists, and a dated `1.0.0` release was cut. Full build + test suite verified
green after every change (25/25 tests passing).

Four items remain open and **cannot be closed from this repo**:
- Three require live Supabase dashboard access (leaked-password protection, MFA, public-signup
  toggle, confirming the RLS/storage migration applied to prod) — owner action needed.
- One (react-router major-version bump, `6.30.4` → `7.18.1+`) is deliberately deferred pending
  a staged QA pass rather than an automated production dependency bump on a live booking site.

**What's done:** see "Done this pass" above, plus everything from the original PM pass
(CMS admin CRUD, role-based auth, RLS on all 6 tables, PWA/offline support, F-01/02/03/05/08/09/10/11
closed, `npm audit` clean at time of last dependency bump).

**What's still open and needs the owner:** the four P0/P1 items above.
