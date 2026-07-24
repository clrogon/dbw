# Lessons Log

> Convention per `CLAUDE.MD` #3 (Self-Improvement Loop): after any correction from
> the user, add an entry here describing the mistake and the rule that prevents it
> recurring. Review this file at the start of a session before working on this
> project. Keep entries short — pattern, rule, done.

Format for each entry:

```
## YYYY-MM-DD — <short title>
- Mistake: what happened
- Rule: the standing rule that prevents it next time
```

---

## 2026-07-24 — `tasks/` referenced but did not exist

- Mistake: n/a (not a user correction — an observation made during the initial
  PM/planning pass). `CLAUDE.MD` describes `tasks/todo.md` and `tasks/lessons.md`
  as the task-tracking convention, but the directory had never been created in
  157 commits of history, so the convention existed only on paper.
- Rule: before assuming a documented convention (task tracker, doc file, config
  path) is in active use, verify the referenced path actually exists on disk.
  If it's documented but absent, treat that as a real gap to fix (create it
  matching the documented format), not as something to silently work around or
  reinvent differently.
