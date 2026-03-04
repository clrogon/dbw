# Component Documentation

This document provides detailed documentation for all custom components in the DBW Fitness application.

## Table of Contents

- [Layout Components](#layout-components)
- [Page Sections](#page-sections)
- [CMS-Driven Components](#cms-driven-components)
- [Admin Components](#admin-components)
- [Interactive Components](#interactive-components)
- [Hooks](#hooks)
- [UI Primitives](#ui-primitives)

---

## Layout Components

### Navbar
**File**: `src/components/Navbar.tsx`

Main navigation with responsive mobile menu, scroll-aware background, active route highlighting, and CTA booking button.

### Footer
**File**: `src/components/Footer.tsx`

Site footer with navigation links, service links, contact info, and branding.

---

## Page Sections

### HeroSection
**File**: `src/components/HeroSection.tsx`

Full-viewport hero with CMS-driven content (title, subtitle, CTAs, stats). Falls back gracefully during loading. Uses Framer Motion animations.

**Data source**: `useHeroContent()` from `useCms.ts`

### ServicesPreview
**File**: `src/components/ServicesPreview.tsx`

Grid display of service cards on the home page. CMS-driven with loading skeleton states.

**Data source**: `useCmsServices()` from `useCms.ts`

### PricingSection
**File**: `src/components/PricingSection.tsx`

Pricing plans display with highlighted recommendation. CMS-driven.

**Data source**: `usePricingPlans()` from `useCms.ts`

### ScheduleSection
**File**: `src/components/ScheduleSection.tsx`

Operating hours and schedule information (static).

### TrustSection
**File**: `src/components/TrustSection.tsx`

Trust indicators: certifications, experience, testimonials.

### CTABanner
**File**: `src/components/CTABanner.tsx`

Dismissible call-to-action banner. State persisted in `sessionStorage`.

### ErrorPage
**File**: `src/components/ErrorPage.tsx`

Reusable error page component for 404, 500, 403, and offline states with animated icons.

---

## CMS-Driven Components

All CMS components use TanStack Query hooks from `src/hooks/useCms.ts`:

| Hook | Table | Used by |
|------|-------|---------|
| `useHeroContent()` | `hero_content` | `HeroSection.tsx` |
| `useCmsServices()` | `services` | `ServicesPreview.tsx`, `Services.tsx` |
| `useCmsService(slug)` | `services` | `ServiceDetail.tsx` |
| `usePricingPlans()` | `pricing_plans` | `PricingSection.tsx` |
| `useCmsInstructors()` | `instructors` | `Instructors.tsx` |
| `useCmsGallery()` | `gallery_images` | `Gallery.tsx` |

**Query options**: 30s stale time, 5min GC time, 1 retry, refetch on window focus.

---

## Admin Components

### AdminLayout
**File**: `src/components/admin/AdminLayout.tsx`

Dashboard layout wrapper with sidebar navigation to all CMS sections.

### ProtectedRoute
**File**: `src/components/admin/ProtectedRoute.tsx`

Route guard that checks `useAuth().isAdmin`. Redirects to `/admin/login` if not authenticated or not admin.

### ImageUpload
**File**: `src/components/admin/ImageUpload.tsx`

Image upload component that uploads to `cms-images` storage bucket via Supabase Storage SDK.

### Admin Pages

| Page | File | CMS Table |
|------|------|-----------|
| Dashboard | `AdminDashboard.tsx` | Overview |
| Hero | `AdminHero.tsx` | `hero_content` |
| Services | `AdminServices.tsx` | `services` |
| Pricing | `AdminPricing.tsx` | `pricing_plans` |
| Instructors | `AdminInstructors.tsx` | `instructors` |
| Gallery | `AdminGallery.tsx` | `gallery_images` |

All admin pages call `queryClient.invalidateQueries()` on save for instant public-site refresh.

---

## Interactive Components

### WhatsAppButton
**File**: `src/components/WhatsAppButton.tsx`

Floating WhatsApp contact button (bottom-right) with pulse animation and pre-filled message.

### Booking Form
**File**: `src/pages/Booking.tsx`

Multi-step wizard: Service Selection → Personal Info → Review → WhatsApp redirect.
Zod validation. WhatsApp URL saved to `localStorage` for resilience.

---

## Hooks

### useAuth
**File**: `src/hooks/useAuth.tsx`

Authentication context providing `user`, `session`, `isAdmin`, `loading`, `signIn()`, `signOut()`. Admin check uses database `user_roles` table (never client-side storage).

### useCms
**File**: `src/hooks/useCms.ts`

TanStack Query hooks for all CMS tables. See [CMS-Driven Components](#cms-driven-components).

### useToast
**File**: `src/hooks/use-toast.ts`

Global toast notification system with `title`, `description`, and `variant` options.

### useIsMobile
**File**: `src/hooks/use-mobile.tsx`

Responsive breakpoint detection (768px threshold).

---

## UI Primitives

Located in `src/components/ui/`, following the shadcn/ui pattern with Radix primitives and `class-variance-authority`.

Key components: Button (6 variants, 4 sizes), Input, Textarea, Label, Dialog, Toast, Card, Tabs, Select, Badge, Skeleton, Accordion, Sheet, Dropdown Menu, Form.

---

## Adding New Components

1. Create in `src/components/` (shared) or `src/components/ui/` (primitives)
2. Use `cn()` from `@/lib/utils` for class merging
3. Use semantic Tailwind tokens (never raw colours)
4. Add documentation to this file
