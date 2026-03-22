# Claude Code Forge v2 — Architecture & Design

## Overview

Claude Code Forge v2 is a domain-agnostic SDLC scaffold that simulates a full engineering team using Claude Code agents, skills, and hooks. It implements Karpathy's autoresearch ratcheting pattern to create a self-improving autonomous development loop.

**Core idea:** Human approves specs and architecture. The system autonomously implements, tests, reviews, and deploys — learning from every failure and never regressing.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HUMAN INTERFACE                               │
│                                                                     │
│  program.md          CLAUDE.md           specs/brd/                 │
│  (runtime control)   (scaffold rules)    (requirements)             │
└────────┬─────────────────┬───────────────────┬──────────────────────┘
         │                 │                   │
         ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATION LAYER                            │
│                                                                     │
│  /build ──→ /brd → /spec → /design → /implement → /review → /test  │
│              │                           │            │              │
│              │                           ▼            ▼              │
│              │                      /auto (Karpathy ratchet loop)   │
│              │                           │                          │
│              ▼                           ▼                          │
│  Support: /fix-issue  /refactor  /improve  /deploy                  │
└────────┬─────────────────┬───────────────────┬──────────────────────┘
         │                 │                   │
         ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        AGENT LAYER (8 agents)                       │
│                                                                     │
│  brd-creator    spec-writer    architect    ui-designer              │
│  implementer    code-reviewer  security-reviewer  test-engineer      │
│                                                                     │
│  Agents spawn via the Agent tool. Implementer can spawn agent       │
│  teams for parallel story execution.                                │
└────────┬─────────────────┬───────────────────┬──────────────────────┘
         │                 │                   │
         ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ENFORCEMENT LAYER (11 hooks)                      │
│                                                                     │
│  Security:  scope-directory │ protect-env │ detect-secrets           │
│  Quality:   lint-python │ typecheck-ts │ check-architecture          │
│             check-function-length │ check-file-length                │
│  Gates:     pre-commit-gate │ protect-pdfs │ task-completed          │
│                                                                     │
│  Hooks run automatically on Edit/Write/Bash/TaskCompleted.          │
│  Cannot be bypassed. Violations must be fixed, not worked around.   │
└────────┬─────────────────┬───────────────────┬──────────────────────┘
         │                 │                   │
         ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       OUTPUT LAYER                                   │
│                                                                     │
│  specs/brd/           → App specs, feature specs                    │
│  specs/stories/       → Epics, stories (E{n}-S{n}.md), dep graph   │
│  specs/design/        → Architecture, API contracts, data models    │
│  specs/design/mockups/→ Self-contained React+Tailwind HTML files    │
│  specs/test_artefacts/→ Test plan, cases, data, Playwright E2E     │
│  specs/reviews/       → Code review + security review reports       │
│  specs/state/         → Iteration log, learned rules, failures      │
│  backend/ frontend/   → Production source code                      │
└─────────────────────────────────────────────────────────────────────┘
```

## The Karpathy Ratcheting Loop

The `/auto` skill implements Karpathy's autoresearch pattern adapted for software development. The core principle: **progress is monotonic — the codebase only ever gets better, never worse.**

### How Autoresearch Works (Original)

Karpathy's autoresearch pattern for AI research:

1. Run an experiment
2. Measure the result against a baseline
3. If improved → keep the change, update baseline
4. If not → revert completely
5. Extract what was learned
6. Repeat with accumulated knowledge

### How This Scaffold Adapts It

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌──────────┐    ┌───────────┐    ┌──────────┐               │
│   │  Read     │───▶│ Pick Next │───▶│Implement │               │
│   │program.md │    │  Story    │    │  Story   │               │
│   │+ rules   │    └───────────┘    └────┬─────┘               │
│   └──────────┘                          │                      │
│        ▲                                ▼                      │
│        │                         ┌─────────────┐              │
│        │                         │ Ratchet Gate │              │
│        │                         │  pytest      │              │
│        │                         │  ruff/mypy   │              │
│        │                         │  coverage ≥  │              │
│        │                         │  baseline    │              │
│        │                         └──────┬──────┘              │
│        │                                │                      │
│        │                     ┌──────────┴──────────┐          │
│        │                     │                     │          │
│        │                   PASS                  FAIL         │
│        │                     │                     │          │
│        │                     ▼                     ▼          │
│        │              ┌────────────┐      ┌──────────────┐   │
│        │              │ git commit │      │ Self-Healing  │   │
│        │              │ Update log │      │ Loop (max 3)  │   │
│        │              │ Update     │      │               │   │
│        │              │ baseline   │      │ Diagnose →    │   │
│        │              └─────┬──────┘      │ Classify →    │   │
│        │                    │             │ Fix →         │   │
│        │                    │             │ Re-gate       │   │
│        │                    │             └───────┬──────┘   │
│        │                    │                     │          │
│        │                    │              3rd fail?         │
│        │                    │                     │          │
│        │                    │                     ▼          │
│        │                    │             ┌──────────────┐   │
│        │                    │             │ Revert +     │   │
│        │                    │             │ Log failure  │   │
│        │                    │             │ Extract rule │   │
│        │                    │             │ Escalate     │   │
│        │                    │             └──────────────┘   │
│        │                    │                                │
│        │                    ▼                                │
│        │              ┌────────────┐                        │
│        └──────────────│ Next       │                        │
│                       │ Iteration  │                        │
│                       └────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### The Five Ratcheting Principles

#### 1. Only Improvements Persist

Every iteration runs a verification gate:

```bash
uv run pytest -x -q --cov=src --cov-report=term-missing
uv run ruff check . && uv run mypy src/
npm test -- --coverage && npm run lint && npm run typecheck
```

Coverage is compared before/after. If it drops even 1%, the commit is rejected. Tests that previously passed must continue passing. The codebase only ever gets better.

#### 2. Monotonic Knowledge Accumulation

Three state files grow and **never shrink**:

| File | Captures | Used By |
|------|----------|---------|
| `learned-rules.md` | Defensive rules from failures | Injected into every implementer prompt |
| `failures.md` | Raw failure details | Scanned for patterns (2+ same error = new rule) |
| `iteration-log.md` | Every iteration's outcome | Audit trail + progress tracking |

Traditional CI reports pass/fail. This scaffold extracts *why* something failed and prevents the same mistake forever. Rules are formatted as:

```markdown
## Rule N: [title]
- **Source:** Iteration X, Story [ID]
- **Pattern:** [what went wrong]
- **Rule:** [what to do instead]
- **Applied in:** [iteration where it was first used]
```

#### 3. Self-Healing Before Reverting

When the ratchet gate fails, the system diagnoses and attempts repair:

| Error Category | Signal | Auto-Fix Strategy |
|---------------|--------|-------------------|
| Lint/format | ruff check fails | `ruff check --fix && ruff format` |
| Type error | mypy/tsc mismatch | Fix the type annotation |
| Test failure | pytest fails | Fix root cause (not the test) |
| Import error | ImportError | Check dependency graph, fix layer |
| Architecture | Hook blocks upward import | Move import to correct layer |
| Coverage drop | coverage-after < baseline | Add tests for uncovered lines |
| Runtime error | Exception in code | Add typed error handling + test |

Only after 3 failed fix attempts does it revert — and even then, it extracts a learned rule first. Reverting is the last resort because it throws away all work for that story.

#### 4. Feedback Loop Tightening

The scaffold creates a self-reinforcing improvement cycle:

```
Iteration fails
    ↓
Failure logged to failures.md
    ↓
Pattern detected (same error 2+ times)
    ↓
Rule extracted to learned-rules.md
    ↓
Next iteration reads rules → avoids mistake → passes
    ↓
Code reviewer also reads rules → catches violations → adds more rules
    ↓
Fewer failures over time
```

Over time, the implementer agent gets specifically better at *this* codebase because its prompt grows with project-specific lessons.

#### 5. Cross-Project Knowledge Transfer

Three improvement horizons:

```
Per-iteration:   Self-healing fixes the immediate error        → This story
Per-project:     learned-rules.md prevents recurring mistakes  → This codebase
Cross-project:   Promote rules to SKILL.md Gotchas sections   → All future projects
```

```
Project failures → learned-rules.md (project)
                       ↓
              Gotchas in SKILL.md (scaffold)
                       ↓
              All future projects benefit
```

## The Two-Loop Architecture

### Outer Loop (Human-Guided, Slow)

The human controls the outer loop via three mechanisms:

1. **BRD** → defines what to build (via `/brd` Socratic interview)
2. **Approval gates** → human reviews specs (Phase 1) and architecture (Phases 2-3) before autonomous execution begins
3. **program.md** → runtime control knob the human can edit at any time to change instructions, constraints, or stopping criteria

```
Human writes BRD
    ↓
/brd → Socratic interview → specs/brd/
    ↓
/spec → decompose into stories → specs/stories/
    ↓
/design → architect + ui-designer (concurrent) → specs/design/
    ↓
[HUMAN APPROVAL GATE — review specs + architecture]
    ↓
Hand off to inner loop (/auto)
```

### Inner Loop (Autonomous, Fast)

After human approval, `/auto` takes over:

```
For each story in dependency order:
    1. Read program.md (human may have updated constraints)
    2. Read learned-rules.md (inject all accumulated lessons)
    3. Spawn implementer agent with story + rules
    4. Run ratchet gate (tests, lint, types, coverage)
    5. PASS → commit + log
       FAIL → self-heal (max 3) → extract rule → revert as last resort
    6. After group complete → spawn code-reviewer + security-reviewer
    7. Repeat until all stories done or stopping criteria met
```

**Stopping criteria** (any triggers halt):
- All stories complete and tests pass
- A story fails 3 consecutive iterations (escalate to human)
- Architecture violation that hooks can't fix
- Coverage drops below 80%
- 50 iterations without human check-in

## Agent Architecture

### Agent Definitions

Each agent is a Markdown file in `.claude/agents/` with YAML frontmatter declaring its name, description, and available tools.

| Agent | Role | Tools | Spawned By |
|-------|------|-------|------------|
| `brd-creator` | Socratic interview → structured specs | Read, Write, Glob, Grep, Bash | `/brd` |
| `spec-writer` | BRD → epics, stories, dependency graph | Read, Write, Glob, Grep, Bash | `/spec` |
| `architect` | System design, API contracts, data models | Read, Write, Glob, Grep, Bash | `/design` |
| `ui-designer` | React+Tailwind mockup HTML files | Read, Write, Glob, Grep, Bash | `/design` |
| `implementer` | Story-driven code + tests (spawns teams) | Read, Write, Edit, Glob, Grep, Bash, **Agent** | `/implement`, `/auto` |
| `code-reviewer` | Quality gate (6 principles + architecture) | Read, Write, Edit, Grep, Glob, Bash | `/review`, `/auto` |
| `security-reviewer` | Security vulnerability audit | Read, Write, Grep, Glob, Bash | `/review`, `/auto` |
| `test-engineer` | Test plan, cases, Playwright E2E | Read, Write, Edit, Glob, Grep, Bash | `/test` |

**Key:** Only the `implementer` has the `Agent` tool, enabling it to spawn agent teams for parallel story execution.

### Agent Team Pattern (Parallel Execution)

For stories in the same parallel group with no hard dependencies:

```
Implementer (lead)
    │
    ├── Teammate A (story E1-S1) → owns src/types/, tests/types/
    ├── Teammate B (story E1-S2) → owns src/repository/, tests/repository/
    └── Teammate C (story E1-S3) → owns src/service/, tests/service/
```

**Rules:**
- Each teammate owns distinct files (no overlapping edits)
- Shared types created by ONE designated teammate
- Plan approval required before any code is written
- Communication via agent team messaging for shared interfaces
- Full test suite runs after all teammates complete

### Concurrent Agent Spawning

The `/design` and `/review` skills spawn two agents concurrently:

```
/design:  architect + ui-designer  (both read specs, write to separate dirs)
/review:  code-reviewer + security-reviewer  (both read code, write separate reports)
```

Both agents are spawned in a single message using two `Agent` tool calls.

## Hook Enforcement Layer

### Execution Order

Hooks run automatically on tool use. They cannot be bypassed.

```
Edit/Write operation
    │
    ├── 1. scope-directory.js    → Block writes outside project (SECURITY)
    ├── 2. protect-env.js        → Block .env modification (SECURITY)
    ├── 3. detect-secrets.js     → Scan for hardcoded secrets/PII (SECURITY)
    ├── 4. lint-python.js        → Auto-lint + format with ruff (QUALITY)
    ├── 5. typecheck-ts.js       → TypeScript type validation (QUALITY)
    ├── 6. check-architecture.js → Block upward layer imports (QUALITY)
    ├── 7. check-function-length.js → Warn on >50 line functions (QUALITY)
    └── 8. check-file-length.js  → Warn at 200, block at 300 lines (QUALITY)

Write operation (additional)
    └── 9. protect-pdfs.js       → Block PDF modification in docs/ (SECURITY)

Bash → git commit
    └── 10. pre-commit-gate.js   → Full src/ architecture scan (GATE)

TaskCompleted
    └── 11. task-completed.js    → Architecture scan + /review reminder (INFO)
```

### Hook Categories

| Category | Hooks | Behavior |
|----------|-------|----------|
| **Security** | scope-directory, protect-env, detect-secrets | Hard block (exit 2). Must fix the violation. |
| **Quality** | lint-python, typecheck-ts, check-architecture, check-function-length, check-file-length | Mix: architecture and file-length block; lint and function-length warn. |
| **Gates** | pre-commit-gate, protect-pdfs | Hard block. Prevents commits with violations. |
| **Info** | task-completed | Non-blocking reminder to run `/review`. |

### Secret Detection Patterns

The `detect-secrets.js` hook scans for:
- AWS Access Keys (`AKIA[0-9A-Z]{16}`)
- GitHub tokens (`gh[pousr]_...`)
- Anthropic API keys (`sk-ant-...`)
- OpenAI API keys
- Slack tokens (`xox[baprs]-...`)
- Private key blocks (RSA, EC, DSA)
- Hardcoded passwords in connection strings
- Social Security Numbers

## Layered Architecture

All generated projects follow a strict layered architecture with one-way dependencies:

```
┌─────────────────────────────┐
│         UI (React)          │  Presentation, user interaction
├─────────────────────────────┤
│         API (FastAPI)       │  HTTP endpoints, request validation
├─────────────────────────────┤
│         Service             │  Business logic, orchestration
├─────────────────────────────┤
│        Repository           │  Data access, persistence
├─────────────────────────────┤
│         Config              │  App configuration, env loading
├─────────────────────────────┤
│         Types               │  Pydantic models, shared types
└─────────────────────────────┘
```

**Rule:** A layer may import from any layer below it, never above.

**Enforcement:** Three overlapping mechanisms:
1. `check-architecture.js` — per-file check on every Edit/Write
2. `pre-commit-gate.js` — full `src/` scan before every commit
3. `code-reviewer` agent — reviews against architecture during `/review`

## Six Quality Principles

Reference: "AI is forcing us to write good code" (Steve Krenzel)

| # | Principle | Enforcement |
|---|-----------|-------------|
| 1 | **Small modules** — one file = one responsibility | `check-file-length.js` warns at 200, blocks at 300 lines |
| 2 | **Static typing** — type-annotate everything, zero `any` | `typecheck-ts.js` + `mypy` in ratchet gate |
| 3 | **Functions under 50 lines** | `check-function-length.js` warns at 50 lines |
| 4 | **Explicit error handling** — typed errors, no bare exceptions | `code-reviewer` agent checks |
| 5 | **No dead code** — every line traces to a story | `code-reviewer` agent checks |
| 6 | **Self-documenting** — good names > comments | `code-reviewer` agent checks |

## SDLC Pipeline

### Full Pipeline (`/build`)

```
Phase 1: /brd    → Socratic interview → specs/brd/           [HUMAN APPROVAL]
Phase 2: /spec   → BRD decomposition  → specs/stories/        [HUMAN APPROVAL]
Phase 3: /design → Architecture + UI   → specs/design/         [HUMAN APPROVAL]
Phase 4: /implement → Code generation  → backend/, frontend/   [AUTONOMOUS]
Phase 5: /review → Quality + security  → specs/reviews/        [AUTONOMOUS]
Phase 6: /test   → E2E Playwright      → specs/test_artefacts/ [AUTONOMOUS]
Phase 7: /deploy → Docker Compose      → docker-compose.yml    [AUTONOMOUS]
Phase 8: Commit + PR                                           [AUTONOMOUS]
```

Phases 1-3 require human approval. Phases 4-8 run autonomously via `/auto`.

### Skill Types

**Task skills** (12) — runnable via `/command`, bound to agents:

| Skill | Agent(s) | Output |
|-------|----------|--------|
| `/brd` | brd-creator | `specs/brd/` |
| `/spec` | spec-writer | `specs/stories/` |
| `/design` | architect + ui-designer | `specs/design/` + `specs/design/mockups/` |
| `/implement` | implementer + agent teams | `backend/`, `frontend/` |
| `/review` | code-reviewer + security-reviewer | `specs/reviews/` |
| `/test` | test-engineer | `specs/test_artefacts/` |
| `/deploy` | architect | `docker-compose.yml`, Dockerfiles |
| `/build` | orchestrates all | All artifacts |
| `/auto` | orchestrates implement/review/test | Autonomous loop |
| `/fix-issue` | — | Branch, fix, test, PR |
| `/refactor` | — | Refactored code |
| `/improve` | — | Enhanced feature |

**Reference skills** (6) — read by agents for domain knowledge:

| Skill | Purpose | Key References |
|-------|---------|---------------|
| `code-gen` | Quality principles, patterns, testing rules | `quality-principles.md`, `patterns.md`, `testing-rules.md` |
| `spec-writing` | BRD decomposition patterns | `story-template.md` |
| `architecture` | Layered design, API patterns | `api-patterns.md`, `folder-structure.md` |
| `ui-mockup` | React + Tailwind mockup patterns | `page-template.html` |
| `testing` | Test strategy, Playwright patterns | `playwright.md`, `test-data.md` |
| `deployment` | Docker Compose templates | `docker-compose.yml`, Dockerfiles, `.env.example` |

## State Management

All state is file-based, stored in `specs/state/`:

| File | Growth | Purpose |
|------|--------|---------|
| `iteration-log.md` | Append-only | Every iteration: story, action, result, duration, coverage, commit hash |
| `learned-rules.md` | Monotonic (never delete) | Defensive rules extracted from failures, injected into agent prompts |
| `failures.md` | Append-only | Raw failure details for pattern analysis |
| `coverage-baseline.txt` | Overwrite on PASS | Last committed coverage %. Ratchet gate rejects drops. |

**Rule extraction trigger:** Same error type appears 2+ times in `failures.md`.

**Rule injection:** At the start of every `/auto` iteration, all rules from `learned-rules.md` are included in the implementer agent's prompt as a "do NOT repeat" checklist.

## Human-Agent Bridge (program.md)

`.claude/program.md` is the single point of human control over autonomous execution:

| Section | Edited By | Purpose |
|---------|-----------|---------|
| Instructions | Human | What to work on (from BRD) |
| Constraints | Human | What NOT to change (architecture rules, review gate, max retries) |
| Stopping Criteria | Human | When to halt (all stories pass, 3 failures, coverage drop, 50 iterations) |
| Self-Healing Policy | Human | How to handle each error category |
| Pipeline Status | Agent | Phase-by-phase progress table |
| Current Focus | Agent | Current iteration, story, coverage, rule count |

The agent reads `program.md` at the start of **every** iteration, so the human can adjust constraints mid-run without stopping the loop.

## What Makes This Different

| Traditional CI/CD | Claude Code Forge v2 |
|---|---|
| Reports pass/fail | Diagnoses *why* and attempts to self-heal |
| Developers read logs and fix | Agent reads logs, classifies error, applies targeted fix |
| Knowledge lives in developer heads | Knowledge persisted in `learned-rules.md` |
| Same mistakes recur across PRs | Mistakes explicitly prevented via injected rules |
| Coverage is reported | Coverage is ratcheted (can only go up) |
| No memory between runs | Full memory of every failure and lesson |
| One build at a time | Agent teams execute stories in parallel |
| Manual code review | Automated review against 6 quality principles + security audit |
| Hooks are optional | Hooks are mandatory and cannot be bypassed |

## Artifact Inventory

| Component | Count | Purpose |
|-----------|-------|---------|
| Agents | 8 | Specialized subagents for each pipeline phase |
| Hooks | 11 | Mandatory quality and security enforcement |
| Task Skills | 12 | Runnable pipeline commands |
| Reference Skills | 6 | Domain knowledge for agents |
| Templates | 10+ | BRD, stories, architecture, UI, deployment, tests |
| Evals | 4 samples + expected | Code reviewer validation |
| State Files | 4 | Iteration log, learned rules, failures, coverage baseline |
| Config | 3 | settings.json, program.md, architecture.md |

**Total:** 70+ files, 4,300+ lines of scaffold configuration.
