# Component Documentation

This document provides detailed documentation for all custom components in the DBW Fitness application.

## Table of Contents

- [Layout Components](#layout-components)
- [Page Sections](#page-sections)
- [Interactive Components](#interactive-components)
- [UI Primitives](#ui-primitives)
- [Hooks](#hooks)

---

## Layout Components

### Navbar

**File**: `src/components/Navbar.tsx`

Main navigation component with responsive mobile menu.

**Features**:
- Fixed position with scroll-aware background
- Responsive desktop/mobile layouts
- Active route highlighting
- CTA button for booking

**Props**: None (uses React Router's `useLocation`)

**Usage**:
```tsx
import Navbar from "@/components/Navbar";

// In page component
<Navbar />
```

**Styling**:
- Transparent on home page when at top
- Solid background when scrolled or on other pages
- Mobile hamburger menu transforms to X

---

### Footer

**File**: `src/components/Footer.tsx`

Site footer with navigation links, contact info, and branding.

**Sections**:
- Brand with logo and tagline
- Quick navigation links
- Service links
- Contact information

**Props**: None

**Usage**:
```tsx
import Footer from "@/components/Footer";

<Footer />
```

---

## Page Sections

### HeroSection

**File**: `src/components/HeroSection.tsx`

Full-screen hero section for the home page.

**Features**:
- Full-viewport height with centered content
- Background image with overlay
- Animated text with Framer Motion
- Dual CTA buttons
- Stats bar at bottom

**Props**: None

**Animations**:
- Headline: fade up with 0.7s duration
- Subtitle: fade up with 0.25s delay
- Buttons: fade up with 0.45s delay
- Stats: fade up with 0.7s delay

---

### ServicesPreview

**File**: `src/components/ServicesPreview.tsx`

Grid display of service cards for the home page.

**Features**:
- 4-column responsive grid
- Service icons and descriptions
- Hover animations
- Link to service details

**Data Source**: `src/data/services.ts`

---

### PricingSection

**File**: `src/components/PricingSection.tsx`

Pricing plans display with highlighted recommendation.

**Features**:
- 4 pricing tiers
- Highlighted "recommended" plan
- Feature lists with checkmarks
- CTA buttons

**Plans**:
| Name | Price | Features |
|------|-------|----------|
| Inscrição | 15.000 Kz (one-time) | Registration, initial assessment |
| 1x/week | 25.000 Kz/month | 4 classes, professional support |
| 2x/week | 45.000 Kz/month | 8 classes, recommended |
| 3x/week | 55.000 Kz/month | 12 classes, best results |

---

### ScheduleSection

**File**: `src/components/ScheduleSection.tsx`

Operating hours and schedule information.

---

### TrustSection

**File**: `src/components/TrustSection.tsx`

Trust indicators: certifications, experience, testimonials.

---

### CTABanner

**File**: `src/components/CTABanner.tsx`

Dismissible call-to-action banner for time-sensitive promotions.

**Features**:
- Full-width primary-coloured bar
- Dismiss with X icon; state persisted in `sessionStorage`
- CTA button linking to `/reservar`

---

### ErrorPage

**File**: `src/components/ErrorPage.tsx`

Reusable error page component with animated icon, error code, title, and description.

**Exported Views**:
| Export | Code | Icon | Description |
|--------|------|------|-------------|
| `NotFound` | 404 | Search | Missing route |
| `ServerError` | 500 | AlertTriangle | Internal error |
| `Forbidden` | 403 | Lock | Access denied, links to `/contacto` |
| `Offline` | — | WifiOff | No internet, retries current path |

**Animations**: Spring-based icon entrance, staggered text fade-up via Framer Motion.

---

## Interactive Components

### WhatsAppButton

**File**: `src/components/WhatsAppButton.tsx`

Floating WhatsApp contact button.

**Features**:
- Fixed position (bottom-right)
- Pulse animation
- Pre-filled message

**Props**: None

**Configuration**:
```tsx
const phoneNumber = "244922569283";
const message = "Olá! Tenho interesse nos serviços da DBW.";
```

**Usage**:
```tsx
import WhatsAppButton from "@/components/WhatsAppButton";

<WhatsAppButton />
```

---

### Booking Form (in Booking.tsx)

**File**: `src/pages/Booking.tsx`

Multi-step booking wizard.

**Steps**:
1. **Service Selection** - Choose from 4 service types
2. **Personal Info** - Name, email, phone, optional fields
3. **Review** - Confirm details before submission

**WhatsApp Resilience**:
- `whatsappUrl` is saved to `localStorage` before opening WhatsApp
- The ThankYou page shows a "Reenviar no WhatsApp" button if the URL is found, allowing re-send if the phone required PIN/biometric and the content was lost

**Validation**:
- Zod schema validation
- Step-by-step validation triggers
- Field-specific error messages

---

## UI Primitives

UI primitives are located in `src/components/ui/` and follow the shadcn/ui pattern.

### Button

**File**: `src/components/ui/button.tsx`

**Variants**:
- `default` — Primary filled button
- `outline` — Bordered button
- `secondary` — Secondary filled
- `ghost` — Transparent background
- `link` — Text link style
- `destructive` — Red/danger style

**Sizes**:
- `default` — Standard size
- `sm` — Small
- `lg` — Large
- `icon` — Square icon button

**Usage**:
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">Click me</Button>
<Button asChild><Link to="/page">Link Button</Link></Button>
```

### Input

**File**: `src/components/ui/input.tsx`

Styled text input with focus states.

### Textarea

**File**: `src/components/ui/textarea.tsx`

Multi-line text input.

### Label

**File**: `src/components/ui/label.tsx`

Form label with accessibility support.

### Dialog

**File**: `src/components/ui/dialog.tsx`

Modal dialog component using Radix UI.

### Toast / Toaster

**File**: `src/components/ui/toast.tsx`, `src/components/ui/toaster.tsx`

Toast notification system.

### Other Components

| Component | File | Purpose |
|-----------|------|---------|
| Accordion | `accordion.tsx` | Collapsible content |
| Alert | `alert.tsx` | Alert messages |
| Avatar | `avatar.tsx` | User avatars |
| Badge | `badge.tsx` | Status badges |
| Card | `card.tsx` | Card container |
| Checkbox | `checkbox.tsx` | Checkbox input |
| Dropdown Menu | `dropdown-menu.tsx` | Dropdown menus |
| Form | `form.tsx` | Form wrapper with validation |
| Popover | `popover.tsx` | Popover content |
| Progress | `progress.tsx` | Progress bar |
| Select | `select.tsx` | Select dropdown |
| Separator | `separator.tsx` | Horizontal/vertical divider |
| Sheet | `sheet.tsx` | Side panel/drawer |
| Skeleton | `skeleton.tsx` | Loading placeholder |
| Slider | `slider.tsx` | Range slider |
| Switch | `switch.tsx` | Toggle switch |
| Tabs | `tabs.tsx` | Tabbed interface |
| Tooltip | `tooltip.tsx` | Hover tooltips |

---

## Hooks

### useToast

**File**: `src/hooks/use-toast.ts`

Global toast notification system.

**Usage**:
```tsx
import { useToast } from "@/hooks/use-toast";

const MyComponent = () => {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "Success",
      description: "Operation completed",
    });
  };
  
  return <Button onClick={handleClick}>Click</Button>;
};
```

**Toast Options**:
```tsx
toast({
  title: string,
  description?: string,
  variant?: "default" | "destructive",
  action?: ToastActionElement,
});
```

### useIsMobile

**File**: `src/hooks/use-mobile.tsx`

Responsive breakpoint detection hook.

**Usage**:
```tsx
import { useIsMobile } from "@/hooks/use-mobile";

const MyComponent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
};
```

**Breakpoint**: 768px (Tailwind `md` breakpoint)

---

## Component Best Practices

1. **Keep components small** — Aim for < 200 lines
2. **Extract reusable logic** — Create custom hooks
3. **Use TypeScript strictly** — No `any` types
4. **Follow naming conventions** — PascalCase for components
5. **Document complex props** — Use JSDoc comments
6. **Test critical paths** — Especially forms and navigation

---

## Adding New Components

1. Create file in appropriate directory:
   - `src/components/` for shared components
   - `src/components/ui/` for UI primitives

2. Follow the established patterns:
   ```tsx
   import { cn } from "@/lib/utils";
   
   interface MyComponentProps {
     className?: string;
     // other props
   }
   
   const MyComponent: React.FC<MyComponentProps> = ({
     className,
     ...props
   }) => {
     return (
       <div className={cn("base-classes", className)}>
         {/* content */}
       </div>
     );
   };
   
   export default MyComponent;
   ```

3. Export from index if needed

4. Add documentation to this file
