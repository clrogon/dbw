# Deployment Guide

This document covers deployment strategies and configurations for the DBW Fitness application.

## Production vs preview

| | **Production** | **Preview** |
|--|----------------|-------------|
| Host | **cPanel / Apache** | Vercel (optional) |
| Domain | **`https://www.dbwfitness.ao`** | `*.vercel.app` |
| Config | `public/.htaccess` | `vercel.json` |
| SEO | Indexed | `noindex` automatically |

**Authoritative production runbook:** [`docs/cpanel-production.md`](./cpanel-production.md)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Deployment Targets](#deployment-targets)
- [Environment Configuration](#environment-configuration)
- [CI/CD](#cicd)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

> **cPanel full migration**: see [`docs/cpanel-full-migration-wizard.md`](./cpanel-full-migration-wizard.md) for a 14-step wizard covering database, auth, storage, and hosting setup from scratch.

## Prerequisites

Before deploying:

- [ ] All tests passing (`npm test`)
- [ ] Linting clean (`npm run lint`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Environment variables configured (see [Environment Configuration](#environment-configuration))

---

## Build Process

### Production Build

```bash
npm run build
```

Creates a `dist/` directory with optimised assets including PWA service worker:

```
dist/
├── index.html
├── sw.js                 # Service worker (Workbox)
├── workbox-*.js          # Workbox runtime
├── manifest.webmanifest  # PWA manifest
├── assets/
│   ├── index-[hash].js   # Bundled JavaScript
│   ├── index-[hash].css  # Bundled CSS
│   └── [hash].jpg/png    # Optimised images
├── pwa-192x192.png
├── pwa-512x512.png
└── favicon.ico
```

### Build Environment

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Backend API URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Backend anon key | Yes |
| `VITE_SUPABASE_PROJECT_ID` | Backend project ID | Yes |

---

## Deployment Targets

### Lovable Cloud (Development)

Automatic — preview URL is generated on every push.

### cPanel (production)

**Use this for the live site.** See:

- **[cPanel production runbook](./cpanel-production.md)** — build, upload, smoke test, rollback  
- **[Full Migration Wizard](./cpanel-full-migration-wizard.md)** — greenfield DB/auth/storage  

SPA + security headers live in `public/.htaccess` (copied into `dist/` on build).

### Vercel (preview only — not production)

1. Connect repository to Vercel for PR/demo previews
2. Framework Preset: Vite · Build: `npm run build` · Output: `dist`
3. SPA + headers: `vercel.json`
4. Optional env vars for a staging Supabase project
5. Do **not** use `*.vercel.app` for SEO, ads, or customer links — app serves `noindex` off production hosts

### Netlify

Create `public/_redirects`:
```
/*    /index.html   200
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Environment Configuration

Create `.env.production` for production builds (NOT committed to Git):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

| File | Purpose |
|------|---------|
| `.env` | Default (auto-managed by Lovable Cloud) |
| `.env.local` | Local overrides (git-ignored) |
| `.env.production` | Production build overrides |

---

## CI/CD

### GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
          VITE_SUPABASE_PROJECT_ID: ${{ secrets.VITE_SUPABASE_PROJECT_ID }}
```

---

## Post-Deployment

### Checklist

- [ ] All routes work (test navigation + hard refresh)
- [ ] CMS data loads on public pages (Hero, Services, Pricing, Instructors, Gallery)
- [ ] Admin login works at `/admin/login`
- [ ] Admin can edit and save content
- [ ] CMS changes reflect on public pages after save
- [ ] Image upload works in admin
- [ ] PWA install prompt appears (or `/instalar` page works)
- [ ] WhatsApp links work
- [ ] Booking form submits correctly
- [ ] Mobile responsive
- [ ] HTTPS enforced

---

## Troubleshooting

### Blank page after deployment
**Cause**: SPA routing not configured.
**Fix**: Add platform-specific redirect rules (see above).

### 404 on page refresh
**Cause**: Server looking for physical files.
**Fix**: Configure SPA fallback to `index.html`.

### CMS data not loading
**Cause**: Wrong environment variables or RLS issues.
**Fix**: Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Check RLS policies are PERMISSIVE.

### Admin login hangs
**Cause**: RESTRICTIVE RLS policies on `user_roles`.
**Fix**: Ensure `user_roles` SELECT policy is PERMISSIVE with `auth.uid() = user_id`.

### Assets not loading
**Cause**: Incorrect base path.
**Fix**: Set `base: '/'` in `vite.config.ts`.
