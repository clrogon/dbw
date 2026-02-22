# DBW Fitness Luanda — Frontend

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

Frontend SPA for **DBW Fitness Luanda** — a fitness and wellness company in Angola offering swimming lessons, personal training, corporate wellness, and group classes.

## Features

- **Marketing Pages** — Home, About, Services, Instructors, Gallery, Contact
- **Booking System** — Multi-step form with WhatsApp integration
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
│   ├── Gallery.tsx      # Photo gallery
│   ├── Booking.tsx      # Booking form
│   ├── Instructors.tsx  # Team profiles
│   ├── Contact.tsx      # Contact info
│   ├── ThankYou.tsx     # Post-booking confirmation (WhatsApp resilience)
│   ├── NotFound.tsx     # 404 page
│   ├── ServerError.tsx  # 500 page
│   ├── Forbidden.tsx    # 403 page
│   └── Offline.tsx      # Offline fallback
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   ├── Footer.tsx       # Site footer
│   ├── HeroSection.tsx  # Home hero
│   ├── WhatsAppButton.tsx# Floating WhatsApp CTA
│   ├── CTABanner.tsx    # Dismissible call-to-action banner
│   ├── ErrorPage.tsx    # Reusable error page component (404/500/403/Offline)
│   ├── PricingSection.tsx# Pricing plans with elevated card
│   ├── ScheduleSection.tsx# Schedule display
│   ├── ServicesPreview.tsx# Services overview with card shadows
│   ├── TrustSection.tsx # Trust indicators
│   └── ui/              # shadcn/ui components
├── hooks/
│   ├── use-toast.ts     # Toast notification hook
│   └── use-mobile.tsx   # Mobile detection hook
├── data/
│   └── services.ts      # Service data & types
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
| `/servicos` | Services | Service listing |
| `/servicos/:slug` | ServiceDetail | Individual service page |
| `/instrutores` | Instructors | Team member profiles |
| `/galeria` | Gallery | Photo gallery with filters |
| `/reservar` | Booking | Multi-step booking form |
| `/contacto` | Contact | Contact information |
| `/obrigado` | ThankYou | Post-booking confirmation |
| `/erro-500` | ServerError | 500 error page |
| `/acesso-negado` | Forbidden | 403 error page |
| `/offline` | Offline | No-connection fallback |
| `*` | NotFound | 404 page |

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite configuration with path aliases |
| `tailwind.config.ts` | Tailwind theme, colors, animations |
| `tsconfig.json` | TypeScript configuration |
| `eslint.config.js` | ESLint rules |
| `vitest.config.ts` | Test runner configuration |
| `components.json` | shadcn/ui configuration |

## Environment Variables

No environment variables required for development. Production deployments may use:

```
VITE_API_URL=https://api.example.com  # Optional backend API
```

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
- [Contributing](./CONTRIBUTING.md) — Contribution guidelines

## License

Proprietary — © DBW Fitness Luanda

## Contact

- **Website**: https://www.dbwfitness.ao
- **Email**: dbwtreinos@gmail.com
- **Phone**: +244 922 569 283
- **Instagram**: [@DBWFITNESS](https://www.instagram.com/dbwfitness)
