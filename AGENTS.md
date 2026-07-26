# AGENTS.md — dbw
> Read this file first. Every AI coding agent working on this repository must follow these rules. Detailed rule sets are in `.agents/rules/` — load them on demand as instructed below.

---

## Project Identity

**dbw** is a TypeScript application built using the Vite build tool.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vite, TypeScript |
| Package manager | **npm** |

---

## Commands

> **First run on a fresh checkout:** `npm install` — **mandatory**. Without `node_modules/`, `npm test`, `npm run lint`, and `npm run build` all fail with "command not found" and agents cannot verify their own work.

```bash
npm install          # mandatory first step on any fresh checkout — without it npm test/lint/build fail
npm run dev              # start dev server (http://localhost:8080)
npm run build            # production build (also type-checks)
npm run lint              # linting
npm test              # testing — must exit 0 before any PR
```

---

## Mandatory Pre-Task Rules

Before writing a single line of code, load the relevant rule files:

| Task type | Load this rule file |
|---|---|
| ANY task | `.agents/rules/NON_NEGOTIABLE.md` — always load first |
| Documentation or Changelog | `.agents/rules/DOCUMENTATION.md` |
| Testing or CI | `.agents/rules/TESTING.md` |
| Security or API keys | `.agents/rules/SECURITY.md` |

---

## Permissions

### ✅ Allowed without asking
- Run tests
- Run lint
- Read all files
- Create files in src/

### ⚠️ Ask first
- Add new npm dependencies
- Create files outside of src/

### 🚫 Never do
- Push to main
- Modify secrets
- Hardcode credentials

---

## PR Format

Title: `[scope] Short imperative description` (Following Conventional Commits)
Examples: `feat(ui): add responsive nav`, `fix(api): handle token expiry`

Every PR must confirm:
- [ ] `npm install` was run (so `node_modules/` exists; otherwise the steps below cannot run)
- [ ] Linter passes (`npm run lint`)
- [ ] Type checks pass (`npx tsc --noEmit` or `npm run build`)
- [ ] Tests pass (`npm test` must **exit 0**; currently covers `safeUrls`, `normaliseCms`, `cmsValidation`, `site`, `error-logging`)
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] Docs updated if any public behavior changed

---

*This file is version-controlled. Add a new rule here the second time you correct the same agent mistake — not the first.*
