# cPanel Deployment Wizard (Lovable → GitHub → cPanel)

This checklist migrates your current pipeline from Vercel to cPanel hosting while keeping your backend on Lovable Cloud.

---

## 1) Pre-flight checks (required)

Run locally before uploading:

```bash
npm install
npm run lint
npm run build
```

Make sure `dist/` is created successfully.

---

## 2) Backend environment variables (required)

In cPanel, create these environment variables exactly:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

> If your cPanel setup does not support environment variables in build time, create a `.env.production` file before running `npm run build` and **do not commit it to GitHub**.

---

## 3) Build for production

From your project root:

```bash
npm run build
```

This generates the deployable static site in `dist/`.

---

## 4) Upload to cPanel

1. Open **cPanel → File Manager**.
2. Go to your domain root (`public_html/` or your subdomain folder).
3. Remove old frontend files (keep backups if needed).
4. Upload the **contents of `dist/`** (not the dist folder itself) into the domain root.

After upload, your root should contain:

- `index.html`
- `assets/*`
- `favicon.ico`

---

## 5) SPA routing (.htaccess)

Create or update `public_html/.htaccess` with:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Optional compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/javascript application/json image/svg+xml
</IfModule>

# Optional browser cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
</IfModule>
```

---

## 6) Post-deploy validation (critical)

Test in this order:

1. Open `/admin/login` and sign in
2. Edit Hero title in CMS and save
3. Open `/` and confirm the update is visible
4. Edit one Service and confirm `/servicos` reflects changes
5. Hard refresh browser (`Ctrl/Cmd + Shift + R`)
6. Test on mobile

---

## 7) GitHub auto-deploy option for cPanel (optional)

If your host supports Git deployment:

1. Connect repository in cPanel Git Version Control
2. Pull latest `main`
3. Run build command on server (or CI runner)
4. Publish `dist/` to `public_html/`

If your host does not support build tools, keep using local build + File Manager upload.

---

## 8) Known gotchas

- Missing `.htaccess` rewrite causes 404 on refresh.
- Wrong env vars at build time causes CMS login/data failures.
- Uploading the `dist` folder itself (instead of its contents) causes broken paths.
- Browser cache can show old content—hard refresh after every deploy.

---

## 9) Quick rollback

Keep a zip backup of the previous `public_html`.
If deployment fails:

1. Delete current files
2. Restore previous backup zip
3. Extract and retest
