# Roadmap

DBW Fitness Luanda product roadmap, organized by release status and priority.

---

## Shipped ✅

Version 1.0.0 (released 2026-07-24) includes:

- [x] **CMS admin dashboard** — Full CRUD for Hero, Services, Pricing, Instructors, and Gallery sections via `/admin` routes
- [x] **Role-based authentication** — Admin users stored in `user_roles` table; PERMISSIVE RLS policies on all CMS tables
- [x] **Image upload to storage** — Admin can upload images to `cms-images` bucket; public URLs auto-generated
- [x] **PWA with offline support** — Workbox service worker, `vite-plugin-pwa`, `/instalar` installation page, NetworkFirst strategy for API calls
- [x] **Error boundary components** — 404, 500, 403, and Offline error pages with Framer Motion animations
- [x] **Production deployment** — cPanel runbook (`cpanel-production.md`), Vercel integration, environment-based SEO (canonical host for `.ao` domain, `noindex` on non-production hosts)
- [x] **Security hardening** — CSP headers, HSTS, RLS policies, CMS URL validation, WhatsApp number sanitization, session storage instead of localStorage

---

## Planned / Backlog

Near-term features to improve user experience and site maintainability:

- [ ] **Lazy loading for routes** — Code-splitting to reduce initial bundle size
- [ ] **Analytics integration** — Track visitor engagement and admin user actions
- [ ] **Internationalization (i18n)** — Support Portuguese (Angola AO90 vs. pre-reform), English, and other languages
- [ ] **Email notifications for bookings** — Automated confirmations when WhatsApp booking links are clicked

---

## Related Documentation

- **Architecture overview**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment guides**: [docs/deployment.md](./docs/deployment.md)
  - Production deployment: [docs/cpanel-production.md](./docs/cpanel-production.md)
  - Greenfield setup: [docs/cpanel-full-migration-wizard.md](./docs/cpanel-full-migration-wizard.md)
- **Component guide**: [docs/components.md](./docs/components.md)
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)
