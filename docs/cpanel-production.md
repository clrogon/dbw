# Production deploy — cPanel (`www.dbwfitness.ao`)

**This is the real production path.** Vercel (`*.vercel.app`) is preview only and must not be treated as the live site for SEO, SSL, or customer URLs.

## Architecture

| Layer | Production | Preview |
|-------|------------|---------|
| Frontend host | cPanel / Apache | Vercel (optional) |
| Domain | `https://www.dbwfitness.ao` | `*.vercel.app` |
| Headers / SPA | `public/.htaccess` → `dist/.htaccess` | `vercel.json` |
| Indexing | `index, follow` on production host only | `noindex` via `SiteSeo` |
| Backend | Live Supabase project | Same or staging project |

## Prerequisites

- [ ] Node 20 LTS on the build machine
- [ ] SSL active for `www.dbwfitness.ao` (and apex redirect)
- [ ] Supabase RLS + storage hardening applied (see migrations)
- [ ] Public sign-up disabled in Supabase Auth (admins only)
- [ ] Auth Site URL / redirect URLs include `https://www.dbwfitness.ao`

## 1. Build for production

On a clean machine (or CI that deploys to cPanel):

```bash
# Use real production values — never commit them
export VITE_SUPABASE_URL="https://YOUR_REF.supabase.co"
export VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."
export VITE_SUPABASE_PROJECT_ID="YOUR_REF"
export VITE_WHATSAPP_NUMBER="244922569283"   # optional

npm ci
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Output: `dist/` including:

- hashed JS/CSS under `assets/`
- `index.html`, `sw.js`, PWA manifest
- `.htaccess` (copied from `public/`)
- `robots.txt`, `sitemap.xml`

> Vite inlines `VITE_*` at **build** time. Building without env falls back to `src/config/supabasePublic.ts` (anon only). Prefer explicit env on production builds.

## 2. Upload to cPanel

Upload **contents** of `dist/` into the document root (usually `public_html/`):

```
public_html/
├── index.html
├── .htaccess
├── robots.txt
├── sitemap.xml
├── sw.js
├── assets/
└── …
```

Options:

- cPanel File Manager (zip + extract)
- FTP/SFTP
- `rsync -avz --delete dist/ user@host:public_html/`

Keep the previous build tarball for rollback:

```bash
tar -czf dist-backup-$(date +%Y%m%d).tar.gz -C dist .
```

## 3. Apache / SSL checklist

- [ ] SSL certificate valid for `www.dbwfitness.ao`
- [ ] `.htaccess` present and `mod_rewrite` + `mod_headers` enabled
- [ ] HTTPS redirect works
- [ ] Apex `dbwfitness.ao` → `https://www.dbwfitness.ao`
- [ ] SPA deep links work (`/servicos`, `/reservar`, `/admin/login`)
- [ ] Security headers present (see smoke test)

## 4. Post-deploy smoke test (production domain only)

Run against **`https://www.dbwfitness.ao`**, not Vercel:

1. Home loads (hero, nav, CTAs)
2. View-source / Network: `/assets/index-*.js` is JS (200), not HTML
3. Console: no Supabase “Invalid API key” / missing URL
4. CMS sections load (services, pricing, instructors, gallery)
5. `/reservar` → WhatsApp opens
6. `/admin/login` accepts real admin
7. Response headers include CSP, `X-Frame-Options: DENY`
8. After deploy: hard refresh once if PWA still shows old shell

```bash
curl -sI https://www.dbwfitness.ao/ | head -20
curl -sI https://www.dbwfitness.ao/servicos | head -10
```

## 5. Supabase (shared production backend)

- [ ] Apply latest RLS migration if not already live
- [ ] `cms-images` bucket: public read, admin write, MIME/size limits
- [ ] Admin users only via Auth + `user_roles` (`role = admin`)
- [ ] Site URL: `https://www.dbwfitness.ao`

## 6. SEO (production only)

- Canonical / OG always use `https://www.dbwfitness.ao` (`src/config/site.ts`)
- Non-production hosts automatically `noindex` (`SiteSeo`)
- `robots.txt` + `sitemap.xml` ship with `dist/`
- Submit sitemap in Google Search Console for the **.ao** property

## 7. Rollback

```bash
# restore previous dist backup into public_html
# or re-upload last known good tarball
```

## 8. Optional: GitHub Auto-Deploy

If your cPanel host supports Git version control:

1. **Connect repo**: Use cPanel **Git Version Control** to clone/connect your GitHub repository
2. **Pull latest**: Manually or via cron job, pull the latest `main` branch
3. **Build on server** (if Node.js available): Run `npm ci && npm run build` on the server
4. **Publish `dist/`**: Copy/symlink built `dist/` contents to `public_html/`

This is optional and more complex than file manager upload. Use only if your hosting provider supports Git deployments and you want continuous deployment.

## 9. Vercel (preview only)

- Use for PR demos; do not point marketing ads at `*.vercel.app`
- Optional: set the same or a **staging** Supabase project
- App will emit `noindex` when hostname is not `dbwfitness.ao`

## Related docs

- Full greenfield setup: [cpanel-full-migration-wizard.md](./cpanel-full-migration-wizard.md)
- General deployment notes: [deployment.md](./deployment.md)
- Security: [../SECURITY.md](../SECURITY.md)
