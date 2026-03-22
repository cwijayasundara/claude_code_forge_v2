---
name: implement
description: Generate production code and unit tests for user stories using agent teams for parallel execution. Enforces quality principles, test coverage gates, and code review.
disable-model-invocation: true
argument-hint: "[story-id or --group X]"
context: fork
agent: implementer
---

# /implement — Code Generation

## Usage

```
/implement                    # implement all stories
/implement E1-S1              # implement a specific story
/implement --group A          # implement all stories in parallel group A
```

## Prerequisites

- `specs/stories/` must exist (run `/spec` first)
- `specs/design/` must exist (run `/design` first)

## Steps

1. Read `.claude/skills/code-gen/SKILL.md` for quality principles.
2. Read `specs/stories/dependency-graph.md` for parallel groups.
3. For each group in dependency order:
   a. **Multiple independent stories →** Create an agent team (one teammate per story).
   b. **Single story →** Implement inline with `implementer` agent.
   c. Require plan approval — verify no file conflicts between teammates.
   d. After teammates finish: run full test suite, lint, typecheck.
   e. Verify coverage ≥ 100% meaningful paths (BLOCK if not met).
   f. Spawn `code-reviewer` — report to `specs/reviews/code-review-group-[X].md`.
   g. Fix BLOCK findings (max 3 retries).
4. Create Alembic migrations if data models changed.
5. Update story files with implementation status.

## Story-Driven Rule

**Every file must trace to a story.** No story → no code. Go back to `/spec` if something is missing.

## Gotchas

- **Two teammates editing the same file.** Always verify file ownership in the plan before approving. If both need a shared type, ONE teammate creates it in `src/types/`.
- **Skipping plan approval.** Without plan review, teammates may create conflicting interfaces. Always require approval.
- **Coverage checked too late.** Verify coverage after EACH group, not just at the end. Catching gaps early is cheaper.
- **Forgetting database migrations.** If data models changed, `uv run alembic revision --autogenerate` must run before Phase 5.
- **Vibe coding.** Writing code that feels right but doesn't trace to a story. If no acceptance criterion demands it, delete it.
- **Lead implementing instead of delegating.** If the lead starts coding instead of creating the agent team, tell it to delegate.

## Verification

```bash
uv run pytest -x -q --cov=src --cov-report=term-missing
uv run ruff check . && uv run mypy src/
npm test -- --coverage && npm run lint && npm run typecheck
grep -rn "from src.api" src/service/ src/repository/ src/config/ src/types/
```
