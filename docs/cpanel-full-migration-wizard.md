# Full Migration Wizard: Lovable Cloud → cPanel + Supabase

> **Goal**: Reproduce the entire DBW Fitness solution on a cPanel host with its own Supabase project, completely independent from Lovable Cloud.

---

## Overview

| Step | What | Status |
|------|------|--------|
| 1 | Pre-requisites | ☐ |
| 2 | Create external Supabase project | ☐ |
| 3 | Create database schema | ☐ |
| 4 | Create database functions & triggers | ☐ |
| 5 | Create RLS policies | ☐ |
| 6 | Create storage bucket | ☐ |
| 7 | Create admin user & role | ☐ |
| 8 | Seed initial CMS data | ☐ |
| 9 | Update frontend environment | ☐ |
| 10 | Build frontend | ☐ |
| 11 | Upload to cPanel | ☐ |
| 12 | Configure .htaccess | ☐ |
| 13 | Post-deploy validation | ☐ |
| 14 | Double-check checklist | ☐ |

---

## Step 1: Pre-requisites ☐

Before starting, make sure you have:

- [ ] A cPanel hosting account with FTP/File Manager access
- [ ] Node.js 18+ installed locally (`node -v`)
- [ ] Git installed locally (`git -v`)
- [ ] The project cloned from GitHub: `git clone <your-repo-url>`
- [ ] `npm install` runs without errors
- [ ] A Supabase account at [supabase.com](https://supabase.com) (free tier works)

---

## Step 2: Create External Supabase Project ☐

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Choose a name (e.g., `dbw-fitness-prod`)
4. Set a strong database password — **save it somewhere safe**
5. Choose the region closest to your users (e.g., `West EU` for Angola/Portugal)
6. Wait for the project to finish provisioning (~2 minutes)

### Collect these values (you'll need them later):

| Value | Where to find | Your value |
|-------|---------------|------------|
| **Project URL** | Settings → API → Project URL | `https://__________.supabase.co` |
| **Anon Key** | Settings → API → `anon` `public` | `eyJ...` |
| **Service Role Key** | Settings → API → `service_role` (⚠️ keep secret!) | `eyJ...` |

---

## Step 3: Create Database Schema ☐

Go to **Supabase Dashboard → SQL Editor** and run this entire script:

```sql
-- ============================================================
-- 1. ENUM
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin');

-- ============================================================
-- 2. TABLES
-- ============================================================

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- hero_content
CREATE TABLE public.hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_highlight TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  cta_primary_text TEXT NOT NULL DEFAULT '',
  cta_primary_link TEXT NOT NULL DEFAULT '/reservar',
  cta_secondary_text TEXT NOT NULL DEFAULT '',
  cta_secondary_link TEXT NOT NULL DEFAULT '/servicos',
  background_image_url TEXT,
  stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT '🏋️',
  title TEXT NOT NULL,
  short_desc TEXT NOT NULL DEFAULT '',
  full_desc TEXT NOT NULL DEFAULT '',
  sub_services TEXT[] NOT NULL DEFAULT '{}',
  cta_text TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pricing_plans
CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '/ mês',
  features TEXT[] NOT NULL DEFAULT '{}',
  highlighted BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- instructors
CREATE TABLE public.instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- gallery_images
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Todas',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### ✅ Double-check:

- [ ] No errors in SQL Editor output
- [ ] All 6 tables visible in **Table Editor**: `user_roles`, `hero_content`, `services`, `pricing_plans`, `instructors`, `gallery_images`

---

## Step 4: Create Database Functions & Triggers ☐

Run this in **SQL Editor**:

```sql
-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Shortcut: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_hero_content_updated_at
  BEFORE UPDATE ON public.hero_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at
  BEFORE UPDATE ON public.instructors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### ✅ Double-check:

- [ ] No errors in SQL Editor
- [ ] In **Database → Functions**: `has_role`, `is_admin`, `update_updated_at_column` appear

---

## Step 5: Create RLS Policies ☐

⚠️ **CRITICAL**: These MUST be **PERMISSIVE** (the default) and write policies MUST target `TO authenticated`. Run in **SQL Editor**:

```sql
-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- user_roles: only authenticated users can see their own role
-- ============================================================
CREATE POLICY "user_roles_select" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- CMS tables: public read, admin write (TO authenticated)
-- ============================================================

-- hero_content
CREATE POLICY "hero_select" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "hero_insert" ON public.hero_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "hero_update" ON public.hero_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "hero_delete" ON public.hero_content FOR DELETE TO authenticated USING (public.is_admin());

-- services
CREATE POLICY "services_select" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_insert" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "services_update" ON public.services FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "services_delete" ON public.services FOR DELETE TO authenticated USING (public.is_admin());

-- pricing_plans
CREATE POLICY "pricing_select" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "pricing_insert" ON public.pricing_plans FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "pricing_update" ON public.pricing_plans FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pricing_delete" ON public.pricing_plans FOR DELETE TO authenticated USING (public.is_admin());

-- instructors
CREATE POLICY "instructors_select" ON public.instructors FOR SELECT USING (true);
CREATE POLICY "instructors_insert" ON public.instructors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "instructors_update" ON public.instructors FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "instructors_delete" ON public.instructors FOR DELETE TO authenticated USING (public.is_admin());

-- gallery_images
CREATE POLICY "gallery_select" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "gallery_insert" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "gallery_update" ON public.gallery_images FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "gallery_delete" ON public.gallery_images FOR DELETE TO authenticated USING (public.is_admin());
```

### ✅ Double-check:

Run this verification query in SQL Editor:

```sql
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

- [ ] All policies show `permissive = 'YES'`
- [ ] Each CMS table has 4 policies (SELECT, INSERT, UPDATE, DELETE)
- [ ] `user_roles` has 1 SELECT policy

---

## Step 6: Create Storage Bucket ☐

Run in **SQL Editor**:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true);

-- Allow public read
CREATE POLICY "Public read cms-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-images');

-- Allow admin upload
CREATE POLICY "Admin upload cms-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cms-images' AND public.is_admin());

-- Allow admin update
CREATE POLICY "Admin update cms-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'cms-images' AND public.is_admin());

-- Allow admin delete
CREATE POLICY "Admin delete cms-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cms-images' AND public.is_admin());
```

### ✅ Double-check:

- [ ] **Storage** section in Supabase dashboard shows `cms-images` bucket
- [ ] Bucket is marked as **Public**

---

## Step 7: Create Admin User & Role ☐

### 7a. Create the auth user

1. Go to **Authentication → Users** in Supabase dashboard
2. Click **Add User → Create New User**
3. Enter:
   - Email: `clrogon@gmail.com` (or your admin email)
   - Password: a strong password
   - Toggle **Auto Confirm User** = ON
4. Click **Create User**
5. Copy the **User UID** from the user list

### 7b. Assign admin role

Run in **SQL Editor** (replace `YOUR_USER_UID` with the actual UUID):

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UID', 'admin');
```

### ✅ Double-check:

```sql
SELECT ur.user_id, ur.role
FROM public.user_roles ur
WHERE ur.role = 'admin';
```

- [ ] Your user ID appears with role `admin`

---

## Step 8: Seed Initial CMS Data (Optional) ☐

If you want to start with sample content, run in **SQL Editor**:

```sql
-- Hero
INSERT INTO public.hero_content (title, title_highlight, subtitle, cta_primary_text, cta_secondary_text)
VALUES (
  'Transforma o Teu',
  'Corpo & Mente',
  'O teu espaço de fitness e bem-estar em Luanda',
  'Reservar Agora',
  'Ver Serviços'
);

-- Sample service
INSERT INTO public.services (slug, title, short_desc, icon, sort_order)
VALUES ('musculacao', 'Musculação', 'Treino de força personalizado', '🏋️', 1);

-- Sample pricing
INSERT INTO public.pricing_plans (name, price, unit, features, sort_order)
VALUES ('Plano Básico', '15.000 Kz', '/ mês', ARRAY['Acesso ao ginásio', 'Vestiário'], 1);
```

### ✅ Double-check:

- [ ] Visit each table in Table Editor and confirm rows exist

---

## Step 9: Update Frontend Environment ☐

In your local project folder, create `.env.production` (NOT committed to git):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

Replace with the values from Step 2.

### ✅ Double-check:

- [ ] `.env.production` exists in project root
- [ ] `.env.production` is in `.gitignore`
- [ ] Values match your new Supabase project

---

## Step 10: Build Frontend ☐

```bash
npm install
npm run lint
npm run build
```

### ✅ Double-check:

- [ ] Build completes without errors
- [ ] `dist/` folder exists with `index.html`, `assets/`, `favicon.ico`
- [ ] Run `npm run preview` and test locally:
  - [ ] Home page loads with CMS data
  - [ ] `/admin/login` shows login form
  - [ ] Can login with admin credentials
  - [ ] Can edit Hero content and save

---

## Step 11: Upload to cPanel ☐

1. Open **cPanel → File Manager**
2. Navigate to your domain root (`public_html/` or subdomain folder)
3. **Backup**: Download/zip existing files first
4. **Delete** old files in the directory
5. Upload **contents of `dist/`** (NOT the `dist` folder itself):
   - `index.html`
   - `assets/` folder
   - `favicon.ico`
   - `.htaccess` (from Step 12)

### ✅ Double-check:

Your `public_html/` should look like:

```
public_html/
├── index.html
├── .htaccess
├── favicon.ico
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── [images...]
```

- [ ] `index.html` is at the root level (not inside a subfolder)
- [ ] `assets/` folder is at the root level

---

## Step 12: Configure .htaccess ☐

Create `public_html/.htaccess` with this exact content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Force HTTPS
<IfModule mod_rewrite.c>
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

### ✅ Double-check:

- [ ] `.htaccess` file is in `public_html/` root
- [ ] File starts with `<IfModule mod_rewrite.c>`

---

## Step 13: Post-Deploy Validation ☐

Test in this exact order:

| # | Test | Expected | Pass? |
|---|------|----------|-------|
| 1 | Open `https://yourdomain.com` | Home page loads | ☐ |
| 2 | Refresh the page | Page reloads (no 404) | ☐ |
| 3 | Navigate to `/servicos` | Services page shows | ☐ |
| 4 | Hard refresh on `/servicos` | Page reloads (no 404) | ☐ |
| 5 | Open `/admin/login` | Login form appears | ☐ |
| 6 | Login with admin credentials | Dashboard loads | ☐ |
| 7 | Edit Hero title, click Save | Toast "saved" appears | ☐ |
| 8 | Open `/` in new tab | New title is visible | ☐ |
| 9 | Edit a Service, save | No error | ☐ |
| 10 | Open `/servicos`, find updated service | Changes visible | ☐ |
| 11 | Upload an image in CMS | Image uploads successfully | ☐ |
| 12 | Test on mobile phone | Layout responsive | ☐ |
| 13 | Click WhatsApp button | Opens WhatsApp | ☐ |

---

## Step 14: Final Double-Check Checklist ☐

### Database

- [ ] All 6 tables exist
- [ ] RLS is enabled on ALL tables
- [ ] All policies are **PERMISSIVE** (run verification query from Step 5)
- [ ] `has_role`, `is_admin`, `update_updated_at_column` functions exist
- [ ] `cms-images` storage bucket exists and is public
- [ ] Admin user exists in Authentication → Users
- [ ] Admin role assigned in `user_roles` table

### Frontend

- [ ] `.env.production` points to NEW Supabase project
- [ ] Build succeeded without errors
- [ ] `dist/` contents uploaded (not the folder itself)
- [ ] `.htaccess` is in place

### Connectivity

- [ ] Public pages fetch data from Supabase (check browser Network tab for requests to `supabase.co`)
- [ ] Admin login works
- [ ] Admin can create, update, and delete content
- [ ] Changes in admin reflect on public pages after refresh
- [ ] Images upload to `cms-images` bucket successfully

### Security

- [ ] `service_role` key is NOT in any frontend code
- [ ] Only `anon` key is in `.env.production`
- [ ] `.env.production` is NOT committed to Git
- [ ] Admin routes are protected (visiting `/admin` without login redirects to `/admin/login`)

---

## Troubleshooting

### "Login hangs or fails silently"

**Cause**: RLS policies are RESTRICTIVE instead of PERMISSIVE.

**Fix**: Run the verification query from Step 5. If any policy shows `permissive = 'NO'`, drop and recreate it:

```sql
DROP POLICY "policy_name" ON public.table_name;
CREATE POLICY "policy_name" ON public.table_name FOR SELECT USING (true);
```

### "CMS updates don't appear on public site"

**Cause**: Browser cache or stale TanStack Query cache.

**Fix**: Hard refresh (`Ctrl+Shift+R`) or open in incognito window.

### "404 on page refresh"

**Cause**: `.htaccess` missing or `mod_rewrite` not enabled.

**Fix**: Verify `.htaccess` exists and ask hosting provider to enable `mod_rewrite`.

### "Images don't upload"

**Cause**: Missing storage bucket or storage RLS policies.

**Fix**: Re-run Step 6 and verify bucket exists.

### "CORS errors in console"

**Cause**: Supabase project URL doesn't match `.env.production`.

**Fix**: Verify URL in `.env.production` matches your Supabase project Settings → API → Project URL.

---

## Quick Rollback

1. Keep a zip backup of previous `public_html/`
2. If deployment fails, delete current files, restore zip
3. Your Supabase database is independent — frontend rollback doesn't affect data
