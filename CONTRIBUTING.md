# Contributing Guide

Thank you for your interest in contributing to DBW Fitness Luanda! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Prioritize the project's best interests

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or bun

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/dbw.git
cd dbw

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`.

---

## Development Workflow

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/description` | `feature/booking-form-validation` |
| Fix | `fix/description` | `fix/navbar-mobile-menu` |
| Refactor | `refactor/description` | `refactor/service-components` |
| Docs | `docs/description` | `docs/api-documentation` |
| Chore | `chore/description` | `chore/update-dependencies` |

### Workflow Steps

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** following coding standards

3. **Test your changes**
   ```bash
   npm run lint
   npx tsc --noEmit
   npm test
   ```

4. **Commit your changes** (see commit guidelines)

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature
   ```

---

## Coding Standards

### TypeScript

- Use strict mode (enabled in `tsconfig.json`)
- Prefer interfaces for object types
- Use `type` for unions, intersections, and primitives
- Avoid `any` — use `unknown` when type is truly unknown

```tsx
// Good
interface User {
  id: string;
  name: string;
}

type Status = 'pending' | 'active' | 'completed';

// Bad
const user: any = fetchData();
```

### React

- Prefer functional components with hooks
- Use `React.forwardRef` for components needing ref forwarding
- Keep components small and focused (< 200 lines)
- Extract reusable logic into custom hooks

```tsx
// Good
const MyComponent: React.FC<{ title: string }> = ({ title }) => {
  return <h1>{title}</h1>;
};

// Export default for page components
export default MyComponent;
```

### Styling

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use CSS variables for theming (defined in `src/index.css`)
- Use `cn()` utility for conditional class merging

```tsx
// Good
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Navbar.tsx`, `HeroSection.tsx` |
| Hooks | camelCase with `use` prefix | `use-toast.ts`, `use-mobile.tsx` |
| Utilities | camelCase | `utils.ts` |
| Pages | PascalCase | `Index.tsx`, `About.tsx` |
| Types | PascalCase for interfaces/types | `ServiceData`, `BookingForm` |

### Import Order

```tsx
// 1. External libraries
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// 2. Internal components (using @ alias)
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

// 3. Types
import type { ServiceData } from "@/data/services";

// 4. Utilities
import { cn } from "@/lib/utils";

// 5. Assets
import logo from "@/assets/logo.png";
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, semicolons) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Build, dependencies, tooling |
| `ci` | CI/CD changes |

### Examples

```bash
feat(booking): add multi-step form validation

fix(navbar): resolve mobile menu not closing on link click

docs(readme): update installation instructions

refactor(services): extract service card to separate component
```

---

## Pull Request Process

### Before Submitting

- [ ] Code compiles without errors (`npx tsc --noEmit`)
- [ ] Linting passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Changes are tested locally
- [ ] Documentation updated if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How were these changes tested?

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
```

### Review Process

1. At least one approval required
2. All CI checks must pass
3. Resolve all review comments
4. Squash and merge to `main`

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

### Writing Tests

Place test files in `src/test/` mirroring the source structure:

```
src/
├── components/
│   └── Navbar.tsx
└── test/
    └── components/
        └── Navbar.test.tsx
```

### Test Example

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders logo", () => {
    render(<Navbar />);
    expect(screen.getByAltText(/DBW/i)).toBeInTheDocument();
  });
});
```

---

## Questions?

If you have questions, please:
1. Check existing documentation
2. Search existing issues
3. Create a new issue with the `question` label

Thank you for contributing!
