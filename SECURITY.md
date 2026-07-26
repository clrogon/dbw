# Security Policy

## Supported Versions

Currently, only the latest version of this project is supported with security updates.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please do not open a public issue. Instead, please report it via the project's designated security contact or email. We will acknowledge your report within 48 hours and provide an estimated timeframe for a fix. Please provide a detailed summary of the vulnerability, including steps to reproduce.

## Security Architecture

### Authentication

- **Method**: Email/password via Supabase Auth
- **Session storage**: `sessionStorage` (not `localStorage`) to minimise XSS token exposure
- **Token refresh**: Auto-refresh enabled via Supabase client
- **Admin verification**: Server-side `is_admin()` SECURITY DEFINER function — never checked via client-side storage

### Row Level Security (RLS)

All database tables have RLS **enabled**. All policies are **PERMISSIVE**. Write policies (INSERT/UPDATE/DELETE) target `TO authenticated` with `public.is_admin()` checks.

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `user_roles` | Own row (`auth.uid() = user_id`) | — | — | — |
| `hero_content` | Public (`true`) | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` |
| `services` | Public (`true`) | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` |
| `pricing_plans` | Public (`true`) | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` |
| `instructors` | Public (`true`) | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` |
| `gallery_images` | Public (`true`) | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` | `TO authenticated` + `public.is_admin()` |

### Role Management

- Roles stored in dedicated `user_roles` table (never on user/profile row)
- `app_role` enum currently has one value: `admin`
- `has_role(_user_id, _role)` and `is_admin()` are SECURITY DEFINER functions to prevent recursive RLS

### Storage Security

- `cms-images` bucket: public read, admin-only write
- Storage policies enforce `is_admin()` for upload/update/delete
- **Upload validation**: Client-side enforcement of 5 MB max size, MIME-type whitelist (`image/jpeg`, `image/png`, `image/webp`, `image/gif`), and extension whitelist (SVG intentionally excluded to prevent stored XSS)

### Frontend Security

| Concern | Mitigation |
|---------|------------|
| XSS | React auto-escaping; no `dangerouslySetInnerHTML` |
| URL injection | `encodeURIComponent` for WhatsApp URLs; `buildWhatsAppUrl` / digits-only phone |
| Open redirect / malicious CMS links | `sanitizeInternalPath` for CTAs; `sanitizeCmsImageUrl` host allowlist for media |
| External links | `rel="noopener noreferrer"` on all external anchors |
| Secrets | Only `anon` (publishable) key in frontend code |
| CSRF | Supabase JWT-based auth (no cookies) |
| PII in logs | Client logs only emit safe metadata (`code`, `status`, `name`) with no raw error payloads |
| File uploads | Size, MIME, and extension validation before upload |
| Error disclosure | Production `ErrorBoundary` shows a generic message only |

### Admin Authorization — Security Note

The admin check in the frontend (`useAuth.tsx`) queries the `user_roles` table client-side. This is **acceptable only because RLS policies enforce authorization server-side** via the `is_admin()` SECURITY DEFINER function. If RLS policies were ever removed or disabled on CMS tables, admin-only operations would become publicly writable. **Never disable RLS on CMS tables.**

### Environment Variables

| Variable | Sensitivity | Location |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Public (anon) | Local `.env` only — never commit real values |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public (anon) | Local `.env` only — never commit real values |
| `VITE_SUPABASE_PROJECT_ID` | Public identifier | Local `.env` only |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Server-side only (never in frontend or Git) |

Use `.env.example` as the committed template. `.env` is gitignored.

**Vercel / CI:** set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and
`VITE_SUPABASE_PROJECT_ID` on the project (Production + Preview). Vite inlines
these at **build** time — missing vars now fail the build loudly rather than
producing a blank page. The project URL fallback lives in
`src/config/supabasePublic.ts` (non-sensitive project identity); the anon
**key is no longer committed** so that rotating the anon key on the Supabase
dashboard immediately takes effect once the env var is updated and the project
rebuilds — there is no embedded stale key to forget about.

### Frontend hardening (2026-07)

- CMS CTA links must be relative paths (`/…`); rendered via `sanitizeInternalPath`
- CMS image URLs: HTTPS only, hosts limited to `*.supabase.co` and `images.unsplash.com` (`src/lib/safeUrls.ts` + Zod schemas)
- WhatsApp: `VITE_WHATSAPP_NUMBER` must be 8–15 digits; otherwise default `244922569283`
- Non-admin successful auth is signed out immediately (no leftover JWT)
- Admin CMS forms validated with Zod before write
- Vercel + `.htaccess`: CSP, `X-Frame-Options: DENY`, **HSTS**, `upgrade-insecure-requests`, Maps `frame-src`
- Storage bucket should enforce 5 MB + image MIME allowlist (see latest migration)

### Recommendations

- ⚠️ Enable **leaked password protection** in your backend auth settings (Cloud → Authentication → Settings)
- Enable **MFA** for admin accounts (Supabase Auth → MFA)
- Disable public sign-ups if only a handful of admins need accounts
- Use HTTPS in production (HSTS + `.htaccess` / Vercel headers)
- Apply `supabase/migrations/20260713000000_rls_and_storage_hardening.sql` on the live project
- If `.env` was ever committed, rotate the anon key and scrub git history (`git filter-repo`)
- Regularly review RLS policies after schema changes
- Never store `service_role` key in frontend code or Git
- Keep dependencies up to date — run `npm audit` regularly. CI gates on `npm audit --audit-level=critical` (temporarily downgraded from `high` on 2026-07-25 because `GHSA-mh99-v99m-4gvg` brace-expansion has no patched v1/v2 upstream; see CHANGELOG "Known issues — pre-mortem"). Roadmap: restore `--audit-level=high` once upstream ships a fix.
- Longer-term: replace CSP `script-src 'unsafe-inline'` with nonces/hashes when the build pipeline supports it

### Anon key rotation procedure

Because no anon key is hard-coded in the frontend source any more, rotation no
longer requires a code change:

1. Rotate the anon key on Supabase dashboard (Project Settings → API → "Rotate anon key").
2. On Vercel: update `VITE_SUPABASE_PUBLISHABLE_KEY` on **Production** and **Preview** (Project → Settings → Environment Variables).
3. Trigger a redeploy of the affected environments.
4. Verify with `npm run build` locally — a missing key throws `[supabase/client] Missing VITE_SUPABASE_PUBLISHABLE_KEY…` at build time.
5. Smoke-test `localStorage`/`sessionStorage` for stale tokens after rotation; users with active sessions will be asked to sign in again.
