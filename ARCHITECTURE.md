# Architecture Overview

## System Context

DBW Fitness Luanda is a **frontend-only Single Page Application (SPA)** built with modern web technologies. It serves as the marketing and booking platform for DBW Fitness, a fitness and wellness company based in Luanda, Angola.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React     │  │   React     │  │     TanStack Query      │  │
│  │   Router    │──│   Query     │──│   (Client-side cache)   │  │
│  │   (v6)      │  │   Client    │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│         │                │                       │               │
│         ▼                ▼                       ▼               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Page Components                         │  │
│  │  Index │ About │ Services │ Booking │ Contact │ etc.      │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │                                                       │
│         ▼                                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Shared Components + UI Primitives             │  │
│  │  Navbar │ Footer │ HeroSection │ shadcn/ui components     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ WhatsApp API (external links)
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

Responsible for UI rendering, styling, and user interactions.

| Component Type | Location | Examples |
|---------------|----------|----------|
| Page Components | `src/pages/` | `Index.tsx`, `Booking.tsx`, `Contact.tsx` |
| Layout Components | `src/components/` | `Navbar.tsx`, `Footer.tsx` |
| Section Components | `src/components/` | `HeroSection.tsx`, `PricingSection.tsx` |
| UI Primitives | `src/components/ui/` | `button.tsx`, `input.tsx`, `dialog.tsx` |

**Styling Approach**:
- Tailwind CSS utility classes
- CSS custom properties for theming (see `src/index.css`)
- shadcn/ui component patterns
- Framer Motion for animations

### 2. Application Layer

**Location**: `src/App.tsx`, `src/main.tsx`

Handles application bootstrap, provider composition, and routing.

```tsx
// Provider hierarchy (innermost to outermost)
<HelmetProvider>           // SEO meta tags
  <QueryClientProvider>    // Server state management
    <TooltipProvider>      // Radix tooltip context
      <BrowserRouter>      // Client-side routing
        <Routes>           // Route definitions
```

**Routing Configuration**:

| Route | Component | SEO Title |
|-------|-----------|-----------|
| `/` | `Index` | DBW — Mente Activa, Vida Saudável |
| `/sobre` | `About` | Sobre Nós |
| `/servicos` | `Services` | Serviços |
| `/servicos/:slug` | `ServiceDetail` | Dynamic per service |
| `/instrutores` | `Instructors` | Instrutores |
| `/galeria` | `Gallery` | Galeria |
| `/reservar` | `Booking` | Reservar Vaga |
| `/contacto` | `Contact` | Contacto |
| `/obrigado` | `ThankYou` | Obrigado |
| `*` | `NotFound` | 404 |

### 3. Data Layer

**Location**: `src/data/`, `src/hooks/`, `src/lib/`

Manages application state, data fetching, and business logic.

| Module | Purpose |
|--------|---------|
| `src/data/services.ts` | Static service data, TypeScript interfaces |
| `src/hooks/use-toast.ts` | Global toast notification state |
| `src/hooks/use-mobile.tsx` | Responsive breakpoint detection |
| `src/lib/utils.ts` | Utility functions (`cn` for class merging) |

**Data Flow**:
```
User Action → Component → Hook/Handler → State Update → Re-render
                                    ↓
                              External API (WhatsApp)
```

### 4. Infrastructure Layer

**Location**: Root configuration files

Build tooling, development server, and deployment configuration.

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build configuration, path aliases, plugins |
| `tailwind.config.ts` | Design tokens, animations, responsive breakpoints |
| `tsconfig.json` | TypeScript strict mode, path mappings |
| `eslint.config.js` | Code quality rules |
| `vitest.config.ts` | Test runner setup |
| `index.html` | HTML template with meta tags, JSON-LD |

---

## Component Architecture

### Page Component Pattern

All page components follow this structure:

```tsx
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const PageName = () => {
  return (
    <>
      <Helmet>
        <title>Page Title | DBW Fitness Luanda</title>
        <meta name="description" content="Page description" />
      </Helmet>
      <main>
        <Navbar />
        {/* Page content sections */}
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default PageName;
```

### UI Component Pattern (shadcn/ui)

Components use the shadcn/ui pattern with Radix primitives:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: { default: "...", outline: "..." },
      size: { default: "...", sm: "...", lg: "..." }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { /* ... */ }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

---

## State Management

### Local State
- `useState` for component-local state
- Form state managed by `react-hook-form`

### Global State
- Toast notifications: Custom hook with external store (`src/hooks/use-toast.ts`)
- Server state: TanStack Query (configured but currently unused, ready for API integration)

### URL State
- Route params: `useParams()` for dynamic routes
- Query params: `useSearchParams()` for tracking (e.g., booking confirmation)

---

## Form Handling

The booking form (`src/pages/Booking.tsx`) uses a multi-step wizard pattern:

```
Step 1: Service Selection
    ↓
Step 2: Personal Information
    ↓
Step 3: Review & Confirm
    ↓
WhatsApp Redirect + Thank You Page
```

**Validation**: Zod schemas with `@hookform/resolvers/zod`

```tsx
const bookingSchema = z.object({
  servico: z.enum(["aquaticas", "personalizado", "laboral", "grupo"]),
  nome: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(255),
  telefone: z.string().trim().min(9).max(20),
  empresa: z.string().trim().max(100).optional(),
  mensagem: z.string().trim().max(500).optional(),
});
```

---

## SEO Implementation

### Meta Tags
- React Helmet Async for dynamic meta tags
- Static OpenGraph tags in `index.html`

### Structured Data (JSON-LD)
Located in `index.html`:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "DBW — Domingos, Baltazar & William",
  "telephone": ["+244922569283", "+244941079556", "+244929873204"],
  "address": { "@type": "PostalAddress", "addressLocality": "Luanda" },
  "openingHoursSpecification": [...],
  "hasOfferCatalog": { ... }
}
```

### Performance
- Lazy loading images (`loading="lazy"`)
- Eager loading for above-fold hero image
- Code splitting via Vite (automatic)

---

## Security Considerations

| Concern | Implementation |
|---------|---------------|
| XSS Prevention | React auto-escapes, `encodeURIComponent` for URLs |
| External Links | `rel="noopener noreferrer"` on all external links |
| Form Validation | Client-side Zod validation (server-side needed for production) |
| Sensitive Data | No secrets in frontend code |

---

## Testing Strategy

### Test Stack
- **Vitest** — Test runner
- **@testing-library/react** — Component testing
- **jsdom** — DOM environment

### Test Location
`src/test/` — Mirror source structure

### Run Commands
```bash
npm test          # Run once
npm run test:watch # Watch mode
```

---

## Build & Deployment

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── [static assets]
```

### Deployment Targets
- Static hosting (Vercel, Netlify, Cloudflare Pages)
- CDN with SPA fallback to `index.html`

### Build Commands
```bash
npm run build      # Production
npm run build:dev  # Development mode
npm run preview    # Preview build locally
```

---

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |
| Cumulative Layout Shift | < 0.1 |

---

## Roadmap

### Short-term
- [ ] Add unit tests for critical components
- [ ] Implement lazy loading for routes
- [ ] Add error boundary components

### Medium-term
- [ ] Backend API integration
- [ ] Admin dashboard
- [ ] Analytics integration

### Long-term
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) features
- [ ] CMS integration for content management

---

## Glossary

| Term | Definition |
|------|------------|
| SPA | Single Page Application — web app loading single HTML page |
| shadcn/ui | Re-usable component library built on Radix UI |
| TanStack Query | Data fetching and caching library (formerly React Query) |
| Zod | TypeScript-first schema validation |
| Framer Motion | React animation library |
| Vite | Next-generation frontend build tool |
| Radix UI | Unstyled, accessible UI primitives |
