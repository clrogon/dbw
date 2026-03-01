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

```bash
npm install          # install dependencies
npm run dev              # start dev server
npm run build            # production build
npm run lint              # linting
npm test              # testing
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
- [ ] Linter passes
- [ ] Type checks pass
- [ ] Relevant tests pass
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] Docs updated if any public behavior changed

---

*This file is version-controlled. Add a new rule here the second time you correct the same agent mistake — not the first.*
