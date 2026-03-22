# Claude Code SDLC Scaffold

Generic, autonomous software development scaffold. Simulates a full engineering team
with self-healing, failure-driven learning, and Karpathy-style autoresearch ratcheting.

**Project-specific details come from your BRD** — this scaffold is domain-agnostic.

## Tech Stack

- **Backend:** Python 3.12+, FastAPI, pydantic
- **Frontend:** TypeScript, React, Vite
- **AI:** Claude API (Anthropic SDK)
- **Testing:** pytest (Python), vitest (TypeScript), Playwright (E2E)

## Commands

```bash
# Python
uv run pytest                          # run all Python tests
uv run pytest -x -q tests/            # fast fail
uv run ruff check --fix .             # lint + autofix
uv run ruff format .                  # format
uv run mypy src/                      # typecheck

# TypeScript
npm test                               # run vitest
npm run lint                           # eslint
npm run typecheck                      # tsc --noEmit
```

## Architecture

Layered, one-way dependencies only: **Types -> Config -> Repository -> Service -> API -> UI**

IMPORTANT: Never import from a higher layer into a lower one. See @.claude/architecture.md for full rules.

## Code Style

- Python: ruff defaults. Use `pydantic.BaseModel` for all data structures. Type-annotate everything.
- TypeScript: strict mode. Prefer `interface` over `type` for object shapes.

## Testing

- Write implementation code first, then tests for 100% meaningful coverage.
- IMPORTANT: Only mock external boundaries (DB, APIs, file I/O). Never mock business logic.
- Test behavior, not implementation — Arrange → Act → Assert pattern.

## Code Quality Principles

Reference: "AI is forcing us to write good code" (Steve Krenzel). See @.claude/skills/code-gen/SKILL.md for details.

1. **Small, well-scoped modules** — one file = one responsibility. No `utils/helpers.py`.
2. **Static typing everywhere** — type-annotate all functions. Zero `any` in TypeScript.
3. **Functions under 50 lines** — decompose long functions into named subfunctions.
4. **Explicit error handling** — typed error classes, no bare exceptions.
5. **No dead code** — every line traces to a story. Delete, don't comment out.
6. **Self-documenting** — good names > comments. Types as primary documentation.

## Git Workflow

- Branch: `<type>/<short-description>` (e.g., `feat/user-auth`, `fix/date-parsing`)
- Commits: conventional commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`)
- PRs: require passing CI + one approval

## SDLC Pipeline (One-Person Company Mode)

This project uses Claude Code skills with bound agents to simulate a full software development team.
All pipeline commands are **skills** (in `.claude/skills/`), not slash commands. Each task skill uses
`disable-model-invocation: true` + `context: fork` + `agent: <name>` to bind to a dedicated subagent.

Run the complete pipeline with `/build [BRD]` or individual phases:

```
/brd              → Create BRD via Socratic interview           (agent: brd-creator)
/spec [BRD]       → Epics, user stories, dependency graph     (agent: spec-writer)
/design           → System architecture + UI mockups           (agents: architect + ui-designer)
/implement        → Code generation with agent teams           (agent: implementer)
/review           → Security + architecture compliance review  (agent: code-reviewer)
/test             → Test plan, cases, data, Playwright E2E     (agent: test-engineer)
/deploy           → Docker Compose local deployment            (agent: architect)
/build [BRD]      → Full 8-phase pipeline end-to-end           (orchestrates all agents)
/fix-issue [#n]   → Branch, fix, test, PR for a GitHub issue
/refactor [path]  → Refactor code against six quality principles
/improve [desc]   → Enhance existing feature with new behavior
/auto             → Autonomous ratcheting loop (post-approval)
```

Pipeline flow: **BRD (Socratic interview) → Spec → Architecture + UI → Code → Review → Tests → Deploy**

### Skill Architecture

Skills fall into two categories:

- **Task skills** — runnable via `/command`, bound to agents: `brd`, `spec`, `design`, `implement`, `review`, `test`, `deploy`, `build`, `fix-issue`, `refactor`, `improve`, `auto`
- **Reference skills** — read by agents for domain knowledge: `code-gen`, `spec-writing`, `architecture`, `ui-mockup`, `testing`, `deployment`

### Subagents

| Agent | Role | Output |
|-------|------|--------|
| brd-creator | Socratic interview → app spec + feature specs | `specs/brd/` |
| spec-writer | BRD → epics + stories | `specs/stories/` |
| architect | System design, APIs, data models, deployment | `specs/design/` |
| ui-designer | Interactive HTML/React mockups | `specs/design/mockups/` |
| implementer | Story-driven code + unit tests (agent teams for parallel) | `backend/`, `frontend/` |
| code-reviewer | Quality principles, architecture compliance, test coverage | Review findings |
| test-engineer | Test plan, cases, Playwright E2E | `specs/test_artefacts/` |
| security-reviewer | Security audit + vulnerability scanning | Review findings |

### Key Principles

- **Story-driven, not vibe-driven** — every line of code traces to a user story.
- **Code first, then tests** — write implementation, then tests for 100% meaningful coverage.
- **Agent teams for parallel execution** — independent stories built concurrently via Claude Code agent teams (not worktrees).
- **Code review gate** — `code-reviewer` agent validates quality before stories are marked done.
- **Six quality principles** — small modules, static typing, short functions, explicit errors, no dead code, self-documenting.
- **Typed contracts** — Pydantic (Python) + interfaces (TypeScript) at every boundary.
- **No external design tools** — UI mockups are self-contained React + Tailwind HTML files.

### Automated Enforcement (Hooks)

Quality and security are enforced via hooks in `.claude/settings.json`, not just documentation:

- **PostToolUse (Edit/Write) — Security (run first, fast-fail):**
  - `scope-directory.js` — blocks writes outside the project directory (prevents modifying system files, other repos)
  - `protect-env.js` — blocks modifications to `.env` files (real secrets are human-only; `.env.example` allowed)
  - `detect-secrets.js` — scans for hardcoded API keys, passwords, PII (AWS keys, GitHub tokens, SSNs, connection strings)
- **PostToolUse (Edit/Write) — Quality:**
  - `lint-python.js` — auto-lint with ruff + format
  - `typecheck-ts.js` — TypeScript typecheck
  - `check-architecture.js` — blocks upward layer imports
  - `check-function-length.js` — warns on functions >50 lines
  - `check-file-length.js` — warns at 200 lines, blocks at 300 lines (test/config files exempt)
- **PostToolUse (Bash → git commit):** `pre-commit-gate.js` — scans entire `src/` for upward layer imports and blocks the commit if found
- **PostToolUse (Write):** `protect-pdfs.js` — blocks modification of sample fixtures in `docs/`
- **TaskCompleted:** `task-completed.js` — runs architecture compliance scan + reminds to run `/review`

IMPORTANT: These hooks run automatically. You cannot bypass them. If a hook blocks your action, fix the violation — don't work around it.

### Code Reviewer Evals

Eval samples in `.claude/evals/` validate that the code-reviewer agent catches known violations:

- `bad-upward-import.ts` — service importing from API layer
- `bad-long-function.ts` — 80+ line function, hardcoded secret, bare catch
- `bad-test-quality.ts` — mocked business logic, generic data, no error paths
- `bad-dead-code.ts` — commented-out blocks, `any` types, unused functions

Expected findings in `.claude/evals/expected.md`. Run evals after modifying the code-reviewer agent to prevent regression.

### Autonomous Execution (Post-Approval)

After specs and architecture are approved by the human, the system runs autonomously:

```
Human approves specs + design → /auto takes over → Implement → Test → Keep/Revert → Learn → Repeat
```

**Key files:**

- `.claude/program.md` — Human-agent bridge. The human edits instructions/constraints/stopping criteria. The agent reads it every iteration.
- `.claude/skills/auto/SKILL.md` — The autonomous ratcheting loop (inspired by Karpathy's autoresearch).
- `specs/state/iteration-log.md` — Every iteration: story, action, result, duration, coverage, commit.
- `specs/state/learned-rules.md` — Defensive rules extracted from failures. Grows monotonically — never deleted. Injected into agent prompt each iteration.
- `specs/state/failures.md` — Raw failure details for pattern extraction.

**Ratcheting rules:** Only improvements persist. Failed iterations revert completely. Coverage never drops. Tests never break. Lessons accumulate.

**Stopping criteria** (any triggers a halt): all stories pass, 3 consecutive failures on one story, architecture violation, coverage drops below 80%, or 50 iterations without human check-in.

**Inner/outer loop:** The inner loop (fast, autonomous) handles implement→test→review cycles. The outer loop (slow, human-guided) handles spec changes, architecture pivots, and reviewing accumulated learned rules.

### Self-Healing

When the ratchet gate fails, the agent does NOT immediately revert. It follows a self-healing loop:

1. **Diagnose** — read the error output, classify into: lint, type_error, test_failure, import_error, arch_violation, coverage_drop, runtime_error.
2. **Targeted fix** — apply the minimal change for that error category (e.g., run ruff --fix for lint, fix annotation for type errors, add tests for coverage drops).
3. **Re-gate** — re-run verification. If it passes, commit. If it fails again, retry (max 3).
4. **Revert only as last resort** — after 3 failed fixes, revert all changes, log the failure, extract a defensive rule, escalate to human.

IMPORTANT: Self-heal first, revert last. Reverting throws away all work for a story. A lint fix takes seconds.

### Self-Improvement

The scaffold improves over time through three mechanisms:

- **Per-project:** `learned-rules.md` accumulates defensive rules. The implementer gets better at this codebase because recurring mistakes are explicitly prevented.
- **Per-project:** Code-reviewer reads `learned-rules.md` and adds new rules when it finds violations. Failures → rules → prevention → fewer failures.
- **Cross-project:** Promote recurring learned rules from `learned-rules.md` to the relevant SKILL.md Gotchas section. This makes them permanent and benefits all future projects.

## Deep Dives

### Task Skills (runnable via `/command`)
- @.claude/skills/brd/SKILL.md — create BRD via Socratic interview
- @.claude/skills/build/SKILL.md — full 8-phase SDLC pipeline
- @.claude/skills/spec/SKILL.md — BRD → epics, stories, dependency graph
- @.claude/skills/design/SKILL.md — architecture + UI mockups (concurrent agents)
- @.claude/skills/implement/SKILL.md — story-driven code gen with agent teams
- @.claude/skills/review/SKILL.md — code review + security review gate
- @.claude/skills/test/SKILL.md — test plan, cases, Playwright E2E
- @.claude/skills/deploy/SKILL.md — Docker Compose local deployment
- @.claude/skills/fix-issue/SKILL.md — standard issue-fixing workflow
- @.claude/skills/refactor/SKILL.md — refactor code against quality principles
- @.claude/skills/improve/SKILL.md — enhance existing features with new behavior
- @.claude/skills/auto/SKILL.md — autonomous ratcheting loop with failure-driven learning

### Reference Skills (read by agents)
- @.claude/skills/code-gen/SKILL.md — quality principles, patterns, testing rules
- @.claude/skills/spec-writing/SKILL.md — BRD decomposition patterns
- @.claude/skills/architecture/SKILL.md — system design patterns
- @.claude/skills/ui-mockup/SKILL.md — React + Tailwind mockup patterns
- @.claude/skills/testing/SKILL.md — test planning + Playwright patterns
- @.claude/skills/deployment/SKILL.md — Docker Compose templates

### Architecture
- @.claude/architecture.md — layered architecture, dependency rules
