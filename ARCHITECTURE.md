Architecture Overview

System context
- A frontend-only SPA for DBW Fitness Luanda, built with Vite + React + TypeScript, Tailwind CSS, and shadcn-ui. It is designed for marketing pages and information presentation with a clean, component-driven architecture.

Layers
- Presentation Layer: UI components, layout, styling (src/components, src/pages, src/index.css)
- Application Layer: Routing and composition (src/App.tsx, src/main.tsx, page components)
- Data Layer: Data fetching hooks and utilities (src/data/hooks, src/lib/utils.ts)
- Infrastructure Layer: Build tooling, config (vite.config.ts, tailwind.config.ts, index.html, public assets)
- Testing Layer: Vitest setup (src/test)

Module Catalog
- Entrypoints
  - src/main.tsx: React entry
- App bootstrap
  - src/App.tsx: App bootstrap, providers, router
- Pages (src/pages)
  - Index.tsx, About.tsx, Services.tsx, ServiceDetail.tsx, Gallery.tsx, Booking.tsx, Instructors.tsx, Contact.tsx, ThankYou.tsx, NotFound.tsx
- Shared UI Components (src/components)
  - Navbar.tsx, Footer.tsx, CTABanner.tsx, WhatsAppButton.tsx
- UI Primitives (src/components/ui)
  - Button.tsx, tooltip.tsx, toaster.tsx, sonner.tsx
- Data (src/data/hooks)
- Utilities (src/lib/utils.ts)
- Styles (src/index.css)
- Tests (src/test)

Data flow (typical path)
- Browser -> Router -> Page -> Child components
- Page content may call data hooks (React Query) to fetch data from APIs or mocks
- Data flows to UI via props and state; React Query caches results
- UI components dispatch events (clicks, navigation) that may trigger actions or navigation

Non-functional considerations
- Performance: plan for code splitting, lazy-loading, and efficient re-renders
- Accessibility: semantic HTML, keyboard navigation, ARIA considerations
- SEO: helmet-based metadata; OpenGraph metadata in index.html
- Internationalization: no i18n yet; future plan to add i18n layer
- Security: frontend primarily; ensure API endpoints (if any) use proper auth and validation

Development & testing guidance
- Testing: Vitest; add tests for critical components and routes
- Linting/TypeScript: strict TS types and lint rules
- Building: ensure environment parity (mode, env vars)

Roadmap
- Expand tests and add integration tests for navigation and data flows
- Introduce an API contract or mocks for data endpoints
- Add i18n scaffolding and documentation
- Improve accessibility checks and performance profiling

Glossary
- SPA: Single Page Application
- React Query / TanStack Query: data fetching and caching
- shadcn-ui: UI component library
- Tailwind CSS: utility-first styling framework
- Lovable: tooling for automated prompts and code tagging
