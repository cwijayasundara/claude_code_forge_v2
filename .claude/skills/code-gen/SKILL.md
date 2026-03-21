---
name: code-gen
description: Story-driven code generation with strict quality principles. Use when implementing user stories, writing production code, creating unit tests, or generating code from specs. Enforces small modules, static typing, 50-line function limit, and 100% meaningful test coverage.
---

# Code Generation Skill

## Core Principle: Story-Driven, Not Vibe-Driven

Every line of code traces back to a user story. No speculative features.

```
Story → Read Architecture → Write Code → Write Tests → Code Review → Done
```

## The Six Quality Principles

Reference: "AI is forcing us to write good code" (Steve Krenzel)

For decades, we've known what good code looks like: thorough tests, clear documentation, small well-scoped modules, static typing, and reproducible dev environments. AI agents need these — they aren't great at making a mess and cleaning it up later. The only guardrails are the ones you set and enforce.

1. **Small, Well-Scoped Modules** — one file = one responsibility. No `utils/helpers.py`.
2. **Static Typing Everywhere** — type-annotate all functions. Zero `any` in TypeScript.
3. **Functions Under 50 Lines** — decompose long functions into named subfunctions.
4. **Explicit Error Handling** — typed error classes, no bare exceptions.
5. **No Dead Code** — every line traces to a story. Delete, don't comment out.
6. **Self-Documenting** — good names > comments. Types as primary documentation.

For detailed patterns and examples, see [references/quality-principles.md](references/quality-principles.md).

## Implementation Workflow

For each story:
1. Read the story's acceptance criteria and layer assignment.
2. Read architecture: `api-contracts.md`, `data-models.md`, `folder-structure.md`.
3. Write implementation code first, following patterns in [references/patterns.md](references/patterns.md).
4. Write unit tests for 100% meaningful coverage — see [references/testing-rules.md](references/testing-rules.md).
5. Run verification: `uv run pytest -x -q`, `uv run ruff check .`, `uv run mypy src/`.
6. Submit for code review.

## Parallel Execution via Agent Teams

For independent stories (same parallel group):
1. Read `dependency-graph.md` to identify the parallel group.
2. Create an agent team with one teammate per story.
3. Each teammate owns distinct files — no overlapping edits.
4. Require plan approval before teammates write code.
5. Teammates communicate via agent team messaging about shared interfaces.
6. After all teammates complete, run the full test suite.

For examples, see [examples/agent-team-setup.md](examples/agent-team-setup.md).

## Code Review Gate

After implementation, the `code-reviewer` agent reviews all changes. See the `review` skill. All BLOCK findings must be resolved before the story is done.

## Gotchas

These are common failure modes — check for them before marking code as done:

- **Importing upward in layers.** Service importing from API, or Repository importing from Service. Always check: `grep -rn "from src.api" src/service/ src/repository/`.
- **Functions creeping past 50 lines.** It happens gradually. Count lines after writing — if over 50, split immediately.
- **`any` types sneaking into TypeScript.** Especially in API response handling. Use `unknown` + type guards instead.
- **Bare `except Exception:` in Python.** Always catch specific typed errors. If you're unsure which, that means the error types aren't defined yet — define them first.
- **Mocking business logic in tests.** Only mock external boundaries (DB, APIs, file I/O). If you're mocking a function in `src/service/`, something is wrong.
- **Test data like "test123" or "foo@bar.com".** Use realistic data: "Sarah Chen", "sarah.chen@horizonequity.com", "$2,500,000".
- **Writing code before reading the story.** Every time. Read acceptance criteria first.
- **Commented-out code blocks.** Git remembers. Delete the code, don't comment it.
- **Missing error path tests.** If a function can throw, there must be a test that triggers that throw.
- **Agent teammates editing the same file.** Always verify file ownership in the plan before approving.

## Additional Resources

- [references/quality-principles.md](references/quality-principles.md) — detailed rules and examples for each quality principle
- [references/patterns.md](references/patterns.md) — Python and TypeScript implementation patterns
- [references/testing-rules.md](references/testing-rules.md) — testing rules, coverage targets, mock boundaries
- [examples/agent-team-setup.md](examples/agent-team-setup.md) — agent team configuration examples

## Verification

After every story:
```bash
uv run pytest -x -q --cov=src --cov-report=term-missing
uv run ruff check .
uv run mypy src/
npm test -- --coverage
npm run lint
npm run typecheck
```
