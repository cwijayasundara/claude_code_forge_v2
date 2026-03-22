---
name: review
description: Run code review and security review on implemented code. Checks architecture compliance, quality principles, test coverage, and security vulnerabilities.
disable-model-invocation: true
argument-hint: "[story-id]"
context: fork
---

# /review — Code Review

## Usage

```
/review                       # review all changes
/review E1-S1                 # review a specific story
```

## Agent Spawning

This skill orchestrates TWO agents concurrently. Use the `Agent` tool to spawn both in the same message:

```
Agent 1: code-reviewer     → quality, architecture, coverage → specs/reviews/code-review.md
Agent 2: security-reviewer → injection, auth, secrets        → specs/reviews/security-review.md
```

Both agents read the same changed files but write to separate review files — no conflicts.

## Steps

1. **Spawn both agents concurrently using the Agent tool** (two Agent calls in one message):
   - Agent 1 (`code-reviewer`): "Read `.claude/skills/code-gen/SKILL.md`. Read `specs/state/learned-rules.md`. Review changed files in `backend/` and `frontend/`. Write report to `specs/reviews/code-review.md`."
   - Agent 2 (`security-reviewer`): "Review changed files for security vulnerabilities. Write report to `specs/reviews/security-review.md`."
2. **After both complete** — check architecture compliance (no upward imports).
3. Run full verification: `uv run pytest -x -q`, `uv run ruff check .`, `uv run mypy src/`.
4. Both reviewers write reports to `specs/reviews/`.
5. If code-reviewer found BLOCK findings, **append to `specs/state/failures.md`** with error details for the failure-driven learning loop.

## Review Checklist

- [ ] Architecture — no upward imports, layering enforced
- [ ] Quality Principles — small modules, typing, <50 line functions, explicit errors, no dead code
- [ ] Test Coverage — 100% meaningful paths (BLOCK if not met)
- [ ] Story Traceability — every file maps to a story
- [ ] Security — no injection, proper auth, no hardcoded secrets

## Severity Levels

- **BLOCK** — Must fix. Architecture violations, coverage < 100%, security vulnerabilities.
- **WARN** — Should fix. Unclear names, missing docstrings, functions approaching 50 lines.
- **INFO** — Nice to have. Optimization opportunities, style suggestions.

## Output

Reports go to `specs/reviews/code-review.md` and `specs/reviews/security-review.md`.

Note: During `/implement`, per-group reviews are written to `specs/reviews/code-review-group-[X].md`. The `/review` skill produces the final consolidated review.

## Gotchas

- **Guessing instead of running checks.** Always execute `grep`, `pytest`, `mypy` — never assume code is compliant.
- **Missing the re-review loop.** After BLOCK fixes, re-review only changed files, not the entire codebase.
- **Coverage reported but not gated.** Coverage < 100% must be a BLOCK, not a WARN. Enforce this.
- **Security review skipped.** Code-reviewer does a "quick pass" but the dedicated `security-reviewer` must also run.
- **No GOOD section in report.** Acknowledging what's done well matters for team morale and context.
