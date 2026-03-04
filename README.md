# DBW Fitness Luanda — Frontend

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-brightgreen.svg)]()

Frontend SPA for **DBW Fitness Luanda** — a fitness and wellness company in Angola offering swimming lessons, personal training, corporate wellness, and group classes.

## Features

- **Marketing Pages** — Home, About, Services, Instructors, Gallery, Contact
- **CMS / Admin Dashboard** — Full content management for Hero, Services, Pricing, Instructors, and Gallery
- **Booking System** — Multi-step form with WhatsApp integration
- **PWA** — Installable progressive web app with offline support and service worker caching
- **SEO Optimized** — Meta tags, OpenGraph, JSON-LD structured data
- **Responsive Design** — Mobile-first with Tailwind CSS
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation
- **Animations** — Smooth transitions with Framer Motion

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router 6 |
| State | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| SEO | React Helmet Async |
| Backend | Lovable Cloud (Supabase) |
| Auth | Supabase Auth + role-based RLS |
| Storage | Supabase Storage (`cms-images` bucket) |
| PWA | vite-plugin-pwa + Workbox |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:8080)
npm run dev

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.tsx              # App bootstrap, providers, routing
├── main.tsx             # React entry point
├── index.css            # Global styles, CSS variables
├── pages/               # Route pages
│   ├── Index.tsx        # Home page
│   ├── About.tsx        # About us
│   ├── Services.tsx     # Services listing
│   ├── ServiceDetail.tsx# Service detail view
│   ├── Gallery.tsx      # Photo gallery (CMS-driven)
│   ├── Booking.tsx      # Booking form
│   ├── Instructors.tsx  # Team profiles (CMS-driven)
│   ├── Contact.tsx      # Contact info
│   ├── Install.tsx      # PWA install instructions
│   ├── ThankYou.tsx     # Post-booking confirmation
│   ├── NotFound.tsx     # 404 page
│   ├── ServerError.tsx  # 500 page
│   ├── Forbidden.tsx    # 403 page
│   ├── Offline.tsx      # Offline fallback
│   └── admin/           # Admin dashboard pages
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── AdminHero.tsx
│       ├── AdminServices.tsx
│       ├── AdminPricing.tsx
│       ├── AdminInstructors.tsx
│       └── AdminGallery.tsx
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   ├── Footer.tsx       # Site footer
│   ├── HeroSection.tsx  # Home hero (CMS-driven)
│   ├── WhatsAppButton.tsx# Floating WhatsApp CTA
│   ├── CTABanner.tsx    # Dismissible call-to-action banner
│   ├── ErrorPage.tsx    # Reusable error page component
│   ├── PricingSection.tsx# Pricing plans (CMS-driven)
│   ├── ScheduleSection.tsx# Schedule display
│   ├── ServicesPreview.tsx# Services overview (CMS-driven)
│   ├── TrustSection.tsx # Trust indicators
│   ├── admin/           # Admin components
│   │   ├── AdminLayout.tsx
│   │   ├── ImageUpload.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/              # shadcn/ui components
├── hooks/
│   ├── useAuth.tsx      # Authentication context & admin check
│   ├── useCms.ts        # CMS data fetching hooks (TanStack Query)
│   ├── use-toast.ts     # Toast notification hook
│   └── use-mobile.tsx   # Mobile detection hook
├── data/
│   └── services.ts      # Static service data fallback
├── integrations/
│   └── supabase/        # Auto-generated Supabase client & types
├── utils/
│   └── normaliseCms.ts  # CMS data normalisation utilities
├── lib/
│   └── utils.ts         # Utility functions (cn)
└── test/
    ├── setup.ts         # Test configuration
    └── example.test.ts  # Example tests
```

## Routing

| Path | Page | Description |
|------|------|-------------|
| `/` | Index | Home page with hero, services, pricing |
| `/sobre` | About | Company mission, vision, values |
| `/servicos` | Services | Service listing (CMS) |
| `/servicos/:slug` | ServiceDetail | Individual service page |
| `/instrutores` | Instructors | Team member profiles (CMS) |
| `/galeria` | Gallery | Photo gallery with filters (CMS) |
| `/reservar` | Booking | Multi-step booking form |
| `/contacto` | Contact | Contact information |
| `/instalar` | Install | PWA installation instructions |
| `/obrigado` | ThankYou | Post-booking confirmation |
| `/admin/login` | AdminLogin | Admin authentication |
| `/admin` | AdminDashboard | CMS dashboard |
| `/admin/hero` | AdminHero | Edit hero section |
| `/admin/servicos` | AdminServices | Manage services |
| `/admin/precos` | AdminPricing | Manage pricing plans |
| `/admin/instrutores` | AdminInstructors | Manage instructors |
| `/admin/galeria` | AdminGallery | Manage gallery images |
| `/erro-500` | ServerError | 500 error page |
| `/acesso-negado` | Forbidden | 403 error page |
| `/offline` | Offline | No-connection fallback |
| `*` | NotFound | 404 page |

## CMS Architecture

Content is managed via the admin dashboard (`/admin`) and stored in the database:

| Table | Content | Public | Admin |
|-------|---------|--------|-------|
| `hero_content` | Hero section text, images, stats | SELECT | INSERT, UPDATE, DELETE |
| `services` | Service pages with SEO fields | SELECT | INSERT, UPDATE, DELETE |
| `pricing_plans` | Pricing tiers with features | SELECT | INSERT, UPDATE, DELETE |
| `instructors` | Team bios, photos, specialties | SELECT | INSERT, UPDATE, DELETE |
| `gallery_images` | Gallery photos with categories | SELECT | INSERT, UPDATE, DELETE |
| `user_roles` | Admin role assignments | Own role only | — |

All CMS tables use **PERMISSIVE** RLS policies with the `is_admin()` security-definer function.

## Database Security (RLS)

- All tables have Row Level Security **enabled**
- All policies are **PERMISSIVE** (default Postgres behaviour)
- Public SELECT is open on CMS tables for anonymous reads
- Write operations (INSERT/UPDATE/DELETE) require `authenticated` role + `is_admin()` check
- `is_admin()` is a `SECURITY DEFINER` function that queries `user_roles` without triggering recursive RLS
- Admin roles are stored in a separate `user_roles` table (never on the user/profile row)

## PWA

The app is a Progressive Web App with:
- **Service Worker** — Workbox-powered with `NetworkFirst` strategy for API calls
- **Offline Support** — Cached static assets and offline fallback page
- **Install Prompt** — Native install on Android/Chrome; manual instructions for iOS
- **Auto Update** — Service worker auto-updates on new deployments

Install page: `/instalar`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Backend API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Backend anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Yes | Backend project identifier |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Documentation

- [Architecture](./ARCHITECTURE.md) — Technical architecture overview
- [Components](./docs/components.md) — Component documentation
- [Deployment](./docs/deployment.md) — Deployment strategies
- [cPanel Migration](./docs/cpanel-full-migration-wizard.md) — Full migration wizard
- [Contributing](./CONTRIBUTING.md) — Contribution guidelines
- [Security](./SECURITY.md) — Security policy

## License

Proprietary — © DBW Fitness Luanda

## Contact

- **Website**: https://www.dbwfitness.ao
- **Email**: dbwtreinos@gmail.com
- **Phone**: +244 922 569 283
- **Instagram**: [@DBWFITNESS](https://www.instagram.com/dbwfitness)
