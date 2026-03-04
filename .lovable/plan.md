

## Problem

The current migration wizard assumes the only database option is an external Supabase project. But cPanel hosting typically includes **MySQL/MariaDB**, and you want the option to use that instead — eliminating the Supabase dependency entirely for a fully self-hosted solution.

This is a significant architectural change because **every data-touching file** currently imports the Supabase client directly. There are **9 files** with direct Supabase calls (auth, CMS reads, admin CRUD, image uploads).

## What needs to change

### 1. Create a backend API layer (Edge-function-style PHP or Node API on cPanel)

Since this is a **Vite/React SPA** (no server-side rendering), the frontend can't talk to MySQL directly. We need a lightweight REST API on the cPanel server:

- **Option A — PHP REST API** (most cPanel-compatible, no extra setup)
- **Option B — Node.js API** (if cPanel supports Node.js selector)

The API would handle:
- `POST /api/auth/login` — session-based admin login (replaces Supabase Auth)
- `GET /api/cms/hero` — fetch hero content (replaces Supabase queries)
- `PUT /api/cms/hero` — update hero (replaces Supabase mutations)
- Same pattern for services, pricing, instructors, gallery
- `POST /api/upload` — image upload to server filesystem (replaces Supabase Storage)

### 2. Create an abstraction layer in the frontend

Instead of every component importing `supabase` directly, create a **data access layer**:

- `src/lib/api.ts` — a single module exporting functions like `fetchHero()`, `updateHero()`, `login()`, `uploadImage()`
- When using Supabase (Lovable Cloud or external), it calls Supabase
- When using cPanel MySQL, it calls the PHP/Node REST API
- Controlled by an environment variable: `VITE_BACKEND_MODE=supabase|cpanel`

### 3. Refactor all 9 files to use the abstraction

Replace all direct `supabase.from(...)` calls with the new `api.*` functions:

| File | Current | After |
|------|---------|-------|
| `src/hooks/useCms.ts` | `supabase.from("hero_content")` | `api.fetchHero()` |
| `src/hooks/useAuth.tsx` | `supabase.auth.signInWithPassword` | `api.login()` |
| `src/pages/admin/AdminHero.tsx` | Direct Supabase CRUD | `api.updateHero()` |
| `src/pages/admin/AdminServices.tsx` | Direct Supabase CRUD | `api.updateService()` |
| `src/pages/admin/AdminPricing.tsx` | Direct Supabase CRUD | `api.updatePlan()` |
| `src/pages/admin/AdminInstructors.tsx` | Direct Supabase CRUD | `api.updateInstructor()` |
| `src/pages/admin/AdminGallery.tsx` | Direct Supabase CRUD | `api.updateGallery()` |
| `src/components/admin/ImageUpload.tsx` | `supabase.storage` | `api.uploadImage()` |
| `src/components/admin/ProtectedRoute.tsx` | Auth context | No change (uses useAuth) |

### 4. Create the cPanel backend API

A set of PHP files (or Node.js if supported) to deploy on cPanel:

```text
api/
├── config.php          ← DB credentials
├── auth.php            ← Login/logout/session
├── hero.php            ← CRUD hero_content
├── services.php        ← CRUD services
├── pricing.php         ← CRUD pricing_plans
├── instructors.php     ← CRUD instructors
├── gallery.php         ← CRUD gallery_images
├── upload.php          ← Image upload handler
└── .htaccess           ← Route API requests
```

### 5. Update the migration wizard

Add a **"Database Option"** decision at Step 2:
- **Path A**: Use external Supabase (current wizard, mostly unchanged)
- **Path B**: Use cPanel MySQL — includes SQL scripts for MySQL syntax, PHP API setup, and auth configuration

### Summary of deliverables

1. **`src/lib/api.ts`** — Abstraction layer with dual-backend support
2. **Refactor 8 files** — Replace direct Supabase imports with `api.*` calls
3. **`api/` folder** — PHP REST API for cPanel MySQL backend
4. **MySQL schema script** — Equivalent tables in MySQL syntax
5. **Updated `docs/cpanel-full-migration-wizard.md`** — Two paths (Supabase vs MySQL)
6. **`VITE_BACKEND_MODE` env var** — Switches between backends

### Important consideration

This is a large refactor. The Supabase path will continue working exactly as today. The cPanel/MySQL path gives you full independence from any external service — everything runs on your hosting.

