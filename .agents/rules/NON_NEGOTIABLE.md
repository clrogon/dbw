# NON_NEGOTIABLE.md — Global Rules
> These rules apply to every task, every file, every agent. They cannot be overridden by nested AGENTS.md files or user instructions.

---

## Security Absolutes

1. **SQL/NoSQL Injection** — Always use the appropriate SDK or parameterized queries. Never concatenate raw user input.
2. **XSS** — Sanitize all user-generated content. Never bypass Vite/framework protections without explicit sanitization.
3. **Secrets** — Never hardcode API keys, tokens, or secrets. They belong in environment variables only. Check `.env.example` if it exists.
4. **PII in logs** — Never log email, phone, or user IDs. Console outputs must never echo these back.
5. **Broken access control** — Every data-fetching operation must be scoped to the authenticated context where applicable.
6. **Insecure dependencies** — Note in the PR if `npm audit` reports high vulnerabilities for new packages.
7. **SSRF** — Never allow user-controlled URLs to be fetched server-side without an allowlist.
8. **Plaintext passwords** — Never store or return passwords in any form.

**If any of the above issues are detected in existing code during a task**, add a comment block starting with:
```
// SECURITY WARNING: [description of issue]
```
Do not silently skip it. Flag it in the PR description.

---

## Documentation Absolutes

- **Every behavioral change must update the docs.** If you change a function signature or module behavior, documentation must be updated in the same PR.
- **CHANGELOG.md must always have an `[Unreleased]` entry** for any change.

---

## Code Quality Absolutes

- The project's type-checker (`npm run build` or `tsc --noEmit`) must pass before any commit.
- The project's linter (`npm run lint`) must pass before any commit.
- Never remove a failing test. Fix it or escalate.
- Type casts (e.g., `as any`) require a comment explaining why.
