# SECURITY.md — Security Rules
> Load this file before touching: API endpoints, external APIs, or user data logic.

---

## Pre-Task Security Checklist

| Category | Check |
|---|---|
| Injection | Are all external API calls using safe parameterization? |
| Secrets | Are all API keys stored in `.env`? |
| Logging Failures | No PII in any console output or API response? |
| SSRF | No server-side URL fetching with user-controlled input? |

---

## API / Endpoint Security Pattern

All external API interactions must:
1. Sanitize user input before sending.
2. Handle errors gracefully without exposing internal stack traces.
3. Be documented in the README if they introduce new environmental requirements.

---

## PR Security Checklist

Before marking a PR ready for review, confirm:
- [ ] No PII in console logs
- [ ] No hardcoded credentials anywhere
- [ ] External API keys are documented in `.env.example` (if applicable)
