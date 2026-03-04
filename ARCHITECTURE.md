# Architecture Overview

## System Context

DBW Fitness Luanda is a **full-stack Single Page Application (SPA)** with a CMS-driven content model. The frontend is built with React/Vite; the backend uses Lovable Cloud (Supabase) for authentication, database, and file storage.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React     │  │  TanStack   │  │    Supabase JS Client   │  │
│  │   Router    │──│   Query     │──│   (Auth + DB + Storage) │  │
│  │   (v6)      │  │   (cache)   │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│         │                │                       │               │
│         ▼                ▼                       ▼               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Page Components (Public + Admin)              │  │
│  │  Index │ Services │ Gallery │ Admin/Hero │ Admin/Pricing   │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │                                                       │
│         ▼                                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Shared Components + UI Primitives             │  │
│  │  Navbar │ Footer │ HeroSection │ shadcn/ui │ PWA Install  │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │                                                       │
│         ▼                                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Service Worker (Workbox)                  │  │
│  │  Static asset caching │ NetworkFirst API strategy          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │  Supabase    │ │  Supabase    │ │  Supabase    │
     │  Auth        │ │  PostgreSQL  │ │  Storage     │
     │  (login/JWT) │ │  (CMS data)  │ │  (images)    │
     └──────────────┘ └──────────────┘ └──────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │    WhatsApp     │
                     │   (Business)    │
                     └─────────────────┘
```

---

## Layer Architecture

### 1. Presentation Layer

**Location**: `src/components/`, `src/pages/`, `src/index.css`

| Component Type | Location | Examples |
|---------------|----------|----------|
| Page Components | `src/pages/` | `Index.tsx`, `Booking.tsx`, `Contact.tsx` |
| Admin Pages | `src/pages/admin/` | `AdminHero.tsx`, `AdminServices.tsx` |
| Layout Components | `src/components/` | `Navbar.tsx`, `Footer.tsx` |
| Section Components | `src/components/` | `HeroSection.tsx`, `PricingSection.tsx` |
| Admin Components | `src/components/admin/` | `AdminLayout.tsx`, `ProtectedRoute.tsx`, `ImageUpload.tsx` |
| UI Primitives | `src/components/ui/` | `button.tsx`, `input.tsx`, `dialog.tsx` |

**Styling**: Tailwind CSS semantic tokens, CSS custom properties, shadcn/ui, Framer Motion.

### 2. Application Layer

**Location**: `src/App.tsx`, `src/main.tsx`

```tsx
// Provider hierarchy
<HelmetProvider>
  <QueryClientProvider>
    <TooltipProvider>
      <AuthProvider>          // Auth context (useAuth)
        <BrowserRouter>
          <Routes>            // Public + Admin routes
```

### 3. Data Layer

**Location**: `src/hooks/`, `src/data/`, `src/integrations/`

| Module | Purpose |
|--------|---------|
| `src/hooks/useAuth.tsx` | Auth context: login, logout, admin check via `user_roles` |
| `src/hooks/useCms.ts` | TanStack Query hooks for all CMS tables |
| `src/utils/normaliseCms.ts` | Normalise CMS data for component consumption |
| `src/data/services.ts` | Static service data (fallback) |
| `src/integrations/supabase/` | Auto-generated client & types |

**CMS Data Flow**:
```
Public Page → useCms hook → TanStack Query → Supabase SDK → PostgreSQL (RLS: public SELECT)
Admin Page  → useCms hook → Supabase SDK → PostgreSQL (RLS: is_admin() check)
Admin Save  → Supabase upsert → queryClient.invalidateQueries → public page auto-refreshes
```

### 4. Authentication & Authorization

- **Auth**: Supabase Auth with email/password
- **Admin check**: `is_admin()` SQL function (SECURITY DEFINER) queries `user_roles` table
- **Frontend guard**: `ProtectedRoute` component checks `useAuth().isAdmin`
- **Backend guard**: PERMISSIVE RLS policies enforce `is_admin()` on all write operations
- **No localStorage-based role checks** — all admin verification goes through the database

### 5. Database Schema

| Table | Purpose | RLS |
|-------|---------|-----|
| `user_roles` | Maps `user_id` → `app_role` enum | SELECT own row only |
| `hero_content` | Hero section content | Public read, admin write |
| `services` | Service pages + SEO | Public read, admin write |
| `pricing_plans` | Pricing tiers | Public read, admin write |
| `instructors` | Team members | Public read, admin write |
| `gallery_images` | Gallery photos | Public read, admin write |

**Key functions**: `has_role()`, `is_admin()`, `update_updated_at_column()` (trigger).

All RLS policies are **PERMISSIVE**. Write policies target `TO authenticated`.

### 6. Storage

- **Bucket**: `cms-images` (public read)
- **Policies**: Public SELECT, admin INSERT/UPDATE/DELETE
- **Usage**: `ImageUpload` component in admin pages

### 7. PWA / Service Worker

- **Plugin**: `vite-plugin-pwa` with `autoUpdate` register type
- **Caching**: Workbox precaches static assets; `NetworkFirst` for Supabase API calls
- **Install**: `/instalar` page with native prompt (Android) and manual instructions (iOS)
- **Exclusions**: `~oauth` routes excluded from SW interception

---

## Security Summary

| Concern | Implementation |
|---------|---------------|
| XSS | React auto-escapes; `encodeURIComponent` for URLs |
| Auth | Supabase JWT; session stored in `sessionStorage` |
| Admin | Server-side `is_admin()` SECURITY DEFINER function |
| RLS | PERMISSIVE policies on all 6 tables |
| Secrets | Only `anon` key in frontend; `service_role` never exposed |
| External links | `rel="noopener noreferrer"` |
| Roles | Stored in separate `user_roles` table, not on profile |

---

## Deployment

| Target | Config |
|--------|--------|
| Lovable Cloud | Auto-deployed preview |
| Vercel | `vercel.json` with SPA rewrites |
| cPanel | `.htaccess` SPA routing + HTTPS enforcement |

See [Deployment Guide](./docs/deployment.md) and [cPanel Migration Wizard](./docs/cpanel-full-migration-wizard.md).

---

## Roadmap

### Completed ✅
- [x] CMS admin dashboard
- [x] Role-based auth with PERMISSIVE RLS
- [x] Image upload to storage
- [x] PWA with offline support
- [x] Error boundary components

### Planned
- [ ] Lazy loading for routes
- [ ] Analytics integration
- [ ] Internationalization (i18n)
- [ ] Email notifications for bookings
