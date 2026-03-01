# TESTING.md — Testing Rules
> Load this file before: writing tests, modifying CI, or fixing test failures.

---

## Commands

```bash
npm test              # run all tests
```

---

## Rules

- **Never remove a failing test.** Fix it. If it cannot be fixed, add a `TODO` and note it in the PR.
- **New features need tests.** Any new utility function or logic must have a corresponding test.
- Tests must pass before a PR is marked ready for review.
