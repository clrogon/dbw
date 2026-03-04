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

All database tables have RLS **enabled**. All policies are **PERMISSIVE** (Postgres default).

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `user_roles` | Own row (`auth.uid() = user_id`) | — | — | — |
| `hero_content` | Public (`true`) | `is_admin()` | `is_admin()` | `is_admin()` |
| `services` | Public (`true`) | `is_admin()` | `is_admin()` | `is_admin()` |
| `pricing_plans` | Public (`true`) | `is_admin()` | `is_admin()` | `is_admin()` |
| `instructors` | Public (`true`) | `is_admin()` | `is_admin()` | `is_admin()` |
| `gallery_images` | Public (`true`) | `is_admin()` | `is_admin()` | `is_admin()` |

### Role Management

- Roles stored in dedicated `user_roles` table (never on user/profile row)
- `app_role` enum currently has one value: `admin`
- `has_role(_user_id, _role)` and `is_admin()` are SECURITY DEFINER functions to prevent recursive RLS

### Storage Security

- `cms-images` bucket: public read, admin-only write
- Storage policies enforce `is_admin()` for upload/update/delete

### Frontend Security

| Concern | Mitigation |
|---------|------------|
| XSS | React auto-escaping; no `dangerouslySetInnerHTML` |
| URL injection | `encodeURIComponent` for WhatsApp URLs |
| External links | `rel="noopener noreferrer"` on all external anchors |
| Secrets | Only `anon` (publishable) key in frontend code |
| CSRF | Supabase JWT-based auth (no cookies) |
| PII in logs | No email/phone/user IDs logged to console |

### Environment Variables

| Variable | Sensitivity | Location |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Public | `.env` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public | `.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Server-side only (never in frontend) |

### Recommendations

- Enable **leaked password protection** in your Supabase Auth settings
- Use HTTPS in production (enforced via `.htaccess` on cPanel)
- Regularly review RLS policies after schema changes
- Never store `service_role` key in frontend code or Git
