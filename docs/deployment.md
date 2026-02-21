# Deployment Guide

This document covers deployment strategies and configurations for the DBW Fitness application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Deployment Targets](#deployment-targets)
- [Environment Configuration](#environment-configuration)
- [CI/CD](#cicd)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying:

- [ ] All tests passing (`npm test`)
- [ ] Linting clean (`npm run lint`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Production build succeeds (`npm run build`)

---

## Build Process

### Production Build

```bash
npm run build
```

This creates a `dist/` directory with optimized assets:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Bundled JavaScript
│   ├── index-[hash].css     # Bundled CSS
│   └── [hash].jpg/png       # Optimized images
└── favicon.ico
```

### Build Output Analysis

```bash
# Preview build locally
npm run preview

# Analyze bundle size (if needed)
npx vite-bundle-visualizer
```

### Build Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `VITE_*` | Custom environment variables | — |

---

## Deployment Targets

### Vercel (Recommended)

**Setup**:

1. Connect repository to Vercel
2. Configure project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. Configure redirects for SPA routing:

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Environment Variables** (if needed):
- Add in Vercel dashboard → Settings → Environment Variables

---

### Netlify

**Setup**:

1. Connect repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. Configure redirects for SPA routing:

Create `public/_redirects`:
```
/*    /index.html   200
```

Or add to `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Cloudflare Pages

**Setup**:

1. Connect repository in Cloudflare dashboard
2. Configure:
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`

3. Add redirect rule in `_redirects` file (same as Netlify)

---

### Static Hosting (Generic)

**Requirements**:
- Serve `dist/` directory as static files
- Configure SPA fallback: all routes → `index.html`
- Enable gzip/brotli compression
- Set cache headers

**Nginx Example**:
```nginx
server {
    listen 80;
    server_name dbwfitness.ao;
    root /var/www/dbw/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

**Apache Example**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

### Docker

**Dockerfile**:
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run**:
```bash
docker build -t dbw-fitness .
docker run -p 80:80 dbw-fitness
```

---

## Environment Configuration

### Environment Variables

Create `.env.production` for production builds:

```env
VITE_API_URL=https://api.dbwfitness.ao
VITE_GA_ID=G-XXXXXXXXXX
```

**Accessing in code**:
```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

### Environment Files

| File | Purpose |
|------|---------|
| `.env` | Default (committed if no secrets) |
| `.env.local` | Local overrides (git-ignored) |
| `.env.production` | Production build |
| `.env.development` | Development build |

---

## CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Test
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Required Secrets

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Organization ID |
| `VERCEL_PROJECT_ID` | Project ID |
| `VITE_API_URL` | API URL (if applicable) |

---

## Post-Deployment

### Checklist

- [ ] All routes work (test navigation)
- [ ] 404 page works for unknown routes
- [ ] Images load correctly
- [ ] WhatsApp links work
- [ ] Forms submit correctly
- [ ] Mobile responsive
- [ ] SEO meta tags present (view source)
- [ ] Performance acceptable (Lighthouse)

### Performance Testing

```bash
# Run Lighthouse
npx lighthouse https://dbwfitness.ao --view
```

**Target Scores**:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## Troubleshooting

### Common Issues

#### Blank page after deployment

**Cause**: SPA routing not configured

**Solution**: Ensure server redirects all routes to `index.html`

---

#### 404 on page refresh

**Cause**: Server looking for physical files

**Solution**: Configure server-side redirects (see platform-specific configs above)

---

#### Assets not loading

**Cause**: Incorrect base path

**Solution**: Set `base` in `vite.config.ts`:
```ts
export default defineConfig({
  base: '/',  // or '/subdirectory/' if not at root
  // ...
});
```

---

#### Environment variables not working

**Cause**: Variables not prefixed with `VITE_`

**Solution**: Only `VITE_*` variables are exposed to client code

---

#### Build fails with memory error

**Cause**: Node memory limit

**Solution**: Increase memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

### Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Uptime monitoring (UptimeRobot)
- Performance monitoring (Vercel Analytics)

---

## Rollback

### Vercel

```bash
vercel rollback
```

Or use dashboard → Deployments → Promote previous deployment

### Netlify

Dashboard → Deploys → Rollback to previous deploy

### Manual

Keep previous build artifacts and switch symlinks:
```bash
ln -sfn dist-v1.2.3 current
```
