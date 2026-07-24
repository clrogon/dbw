# cPanel Deployment Wizard — Superseded

**This document has been consolidated into the two authoritative cPanel guides below.**

Choose the guide that matches your scenario:

## Standard Production Deploy
**→ See [`cpanel-production.md`](./cpanel-production.md)**

Use this if you have an existing Supabase project already configured. It covers:
- Building for production with environment variables
- Uploading to cPanel via File Manager or SFTP
- SPA routing and security configuration (`.htaccess`)
- Post-deploy smoke testing
- Rollback procedures
- Optional GitHub auto-deploy

## Greenfield Setup (from Scratch)
**→ See [`cpanel-full-migration-wizard.md`](./cpanel-full-migration-wizard.md)**

Use this if you're setting up cPanel hosting for the first time or migrating from Lovable Cloud. It covers all 14 steps:
- Creating a new Supabase project
- Setting up database schema, functions, triggers, and RLS policies
- Configuring authentication and admin roles
- Setting up storage buckets
- Building and deploying the frontend
- Complete post-deploy validation

Both guides reference the same production `.htaccess` configuration in `public/.htaccess`.

---

**Note**: This file is retained as a redirect pointer for backward compatibility. All current guidance is in the two docs above.
