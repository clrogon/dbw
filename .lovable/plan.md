

## Problem: CMS becomes unresponsive on page refresh

### Root cause

All RLS policies across every table are **RESTRICTIVE** (`Permissive: No`). In PostgreSQL, if there are **zero PERMISSIVE policies** for a command, **no rows are ever returned** — restrictive policies can only narrow down permissive ones. With no permissive policies, every query returns empty results or hangs.

Previous migrations attempted to fix this but the policies are still restrictive.

Additionally, every admin page fires its data-loading `useEffect` immediately on mount — before `useAuth` has restored the session from `sessionStorage`. This means write-protected queries (insert/update/delete) can race against auth restoration.

### Fix (two parts)

**1. Database migration — convert all RLS policies to PERMISSIVE**

Drop and recreate all 21 policies across 6 tables (`user_roles`, `hero_content`, `services`, `pricing_plans`, `instructors`, `gallery_images`) using `CREATE POLICY ... AS PERMISSIVE`. Same rules, just permissive instead of restrictive.

**2. Admin pages — wait for auth before loading data**

Refactor all 6 admin page components (`AdminDashboard`, `AdminHero`, `AdminServices`, `AdminPricing`, `AdminInstructors`, `AdminGallery`) to receive `user` and `loading` from `useAuth()` and skip data fetching until `loading === false && user !== null`. This prevents queries from firing before the session is restored on refresh.

Pattern applied to each page:
```typescript
const { user, loading: authLoading } = useAuth();

useEffect(() => {
  if (!authLoading && user) load();
}, [authLoading, user]);
```

### Files changed

| File | Change |
|------|--------|
| Migration SQL | Drop + recreate 21 policies as PERMISSIVE |
| `src/pages/admin/AdminDashboard.tsx` | Gate data load on auth ready |
| `src/pages/admin/AdminHero.tsx` | Gate data load on auth ready |
| `src/pages/admin/AdminServices.tsx` | Gate data load on auth ready |
| `src/pages/admin/AdminPricing.tsx` | Gate data load on auth ready |
| `src/pages/admin/AdminInstructors.tsx` | Gate data load on auth ready |
| `src/pages/admin/AdminGallery.tsx` | Gate data load on auth ready |

