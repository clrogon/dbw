# DBW Frontend — Documentation & Architecture

Documentation & Architecture

Overview
- This repository hosts a modern frontend SPA for DBW Fitness Luanda, built with Vite + React + TypeScript, Tailwind CSS and shadcn-ui. It focuses on marketing-oriented pages with Portuguese content and a component-driven UI.

Quick Start
- Install: `npm i`
- Run: `npm run dev`
- Test: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`

Architecture at a glance
- Client (Browser) -> Vite dev server / build -> App.tsx (Router, Providers) -> Pages -> Shared UI Components -> Data Hooks -> API / Mocks

Module map (high level)
- src/App.tsx
- src/pages/Index.tsx, About.tsx, Services.tsx, ServiceDetail.tsx, Gallery.tsx, Booking.tsx, Instructors.tsx, Contact.tsx, ThankYou.tsx, NotFound.tsx
- src/components/Navbar.tsx, Footer.tsx, CTABanner.tsx, WhatsAppButton.tsx, etc.
- src/data/hooks
- src/lib/utils.ts

Contributing
- Follow a feature-branch workflow; write meaningful commit messages; submit PR for review. See ARCHITECTURE.md for more.

Architecture details
- See ARCHITECTURE.md for full architectural reference.
