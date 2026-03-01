# DOCUMENTATION.md — Documentation Rules
> Load this file before: editing any `.md` file, changing public API behavior, or adding modules.

---

## Documentation-First Policy

This project follows a **strict documentation-first policy**. Any change to behavior without a documentation update is considered incomplete.

---

## What to Update and When

| You changed... | Update these files |
|---|---|
| A module's behavior or UI | `README.md` |
| A public function or hook | Inline JSDoc comments |
| Security controls | `SECURITY.md` |
| Any bug fix or feature | `CHANGELOG.md` under `[Unreleased]` |

---

## CHANGELOG.md Format

Always follow [Keep a Changelog](https://keepachangelog.com) format. Never delete the `[Unreleased]` section.

---

## Inline Code Documentation

- Every exported function and component must have a comment describing its purpose and parameters.
- Complex business logic must have inline comments explaining *why*.
- Do not comment obvious code.
