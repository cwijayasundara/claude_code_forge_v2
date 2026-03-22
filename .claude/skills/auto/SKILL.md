---
name: auto
description: Autonomous build loop with ratcheting. Implements stories iteratively — keep on pass, revert on fail, learn from failures. Runs until all stories pass or stopping criteria met.
disable-model-invocation: true
context: fork
---

# /auto — Autonomous Execution Loop

Inspired by Karpathy's autoresearch ratcheting pattern and self-improving agent loops.

## Usage

```
/auto                         # run autonomous loop on all pending stories
/auto --group B               # run on a specific parallel group
/auto --dry-run               # plan iterations without executing
```

## Prerequisites

- `specs/stories/` approved by human (run `/spec` first)
- `specs/design/` approved by human (run `/design` first)
- `.claude/program.md` exists with instructions + constraints + stopping criteria

## Agent Delegation

`/auto` is the orchestrator — it does NOT implement code itself. It delegates via the `Agent` tool:

- **Implementation:** Spawn `implementer` agent (or agent team for parallel groups)
- **Review:** Spawn `code-reviewer` + `security-reviewer` agents concurrently
- **Testing:** Spawn `test-engineer` agent for E2E tests (after all stories pass)

The `/auto` skill itself runs the ratchet gate (bash verification commands) and manages state files directly.

## The Loop

```
Read program.md → Pick next story → Implement → Test → Review → Keep/Revert → Learn → Repeat
```

### For each iteration:

1. **Read `.claude/program.md`** — check instructions, constraints, stopping criteria.
2. **Read `specs/state/learned-rules.md`** — inject lessons into the implementer's prompt.
3. **Pick the next story** from dependency graph (respect group ordering).
4. **Record coverage baseline** before implementation:
   ```bash
   uv run pytest --cov=src --cov-report=term-missing -q 2>/dev/null | grep "^TOTAL" | awk '{print $NF}' > /tmp/coverage-before.txt
   ```
5. **Spawn `implementer` agent** via Agent tool with this prompt:
   ```
   Implement story [ID]. Read `.claude/skills/code-gen/SKILL.md` for quality principles.
   Read `specs/state/learned-rules.md` — do NOT repeat these past mistakes: [paste rules].
   Write code to backend/ and frontend/. Write tests. Run verification.
   ```
6. **Ratchet gate** — run the full verification:
   ```bash
   uv run pytest -x -q --cov=src --cov-report=term-missing
   uv run ruff check . && uv run mypy src/
   npm test -- --coverage && npm run lint && npm run typecheck
   ```
7. **Coverage ratchet** — compare before/after:
   ```bash
   uv run pytest --cov=src --cov-report=term-missing -q 2>/dev/null | grep "^TOTAL" | awk '{print $NF}' > /tmp/coverage-after.txt
   # If coverage-after < coverage-before → FAIL
   ```
8. **Decision:**
   - **PASS** → `git commit`, append to `specs/state/iteration-log.md`, move to next story.
   - **FAIL** → enter **self-healing loop** (see below).
9. **Update `.claude/program.md`** Current Focus section with current story and iteration count.
10. **Check stopping criteria** — if met, stop and report to human.

### After all stories in a group pass:

11. **Spawn `code-reviewer` + `security-reviewer`** concurrently via Agent tool (same pattern as `/review` skill).
12. **BLOCK findings → enter self-healing loop** (count toward retry budget).
13. **All clear → commit group**, update iteration log with group summary.

---

## Self-Healing Loop

When a ratchet gate or review fails, do NOT immediately revert. Instead:

### Step 1: Diagnose

Read the error output and classify into one of these categories:

| Category | Signal | Auto-fix strategy |
|----------|--------|-------------------|
| **Lint/format** | ruff check fails | Run `uv run ruff check --fix . && uv run ruff format .` |
| **Type error** | mypy/tsc reports type mismatch | Read the error, fix the type annotation or add a missing import |
| **Test failure** | pytest fails on a specific test | Read the failing test + source, fix the root cause (not the test) |
| **Import error** | `ImportError` / `ModuleNotFoundError` | Check dependency graph — likely a missing `__init__.py` or wrong layer import |
| **Architecture violation** | Hook blocks upward import | Move the import to the correct layer or extract to Types |
| **Coverage drop** | coverage-after < coverage-before | Add tests for uncovered lines (read coverage report for line numbers) |
| **Runtime error** | Exception in extracted code | Add try/except with typed error class, add test for error path |

### Step 2: Targeted fix

Apply the fix strategy for the diagnosed category. Do NOT rewrite the whole story — make the minimal change to pass the gate.

```
Diagnose error → Classify category → Apply minimal fix → Re-run gate → Pass? → Commit
                                                                        → Fail? → Retry (max 3 total)
                                                                                  → 3rd fail? → Revert + Learn
```

### Step 3: Revert only as last resort

After 3 failed fix attempts on the same error:
1. `git checkout -- .` (revert all changes for this story)
2. Append full failure details to `specs/state/failures.md`
3. Extract a defensive rule to `specs/state/learned-rules.md`
4. Escalate to human by updating `program.md` with `BLOCKED: [story-id] — [reason]`

---

## Failure-Driven Learning

### When to extract a rule

Extract a defensive rule into `specs/state/learned-rules.md` when:
- The **same error type** appears 2+ times in `failures.md` (pattern detected)
- A self-healing fix succeeds after a failure (capture what worked)
- A story is BLOCKED after 3 retries (capture what to avoid)

### Rule format

```markdown
## Rule N: [short title]
- **Source:** Iteration X, Story [ID]
- **Pattern:** [what went wrong — be specific]
- **Rule:** [what to do instead — imperative, actionable]
- **Applied in:** [iteration where it was first used, or "pending"]
```

### How rules are injected

At step 2 of every iteration, read `learned-rules.md` and include ALL rules in the implementer agent's prompt as a "do NOT repeat" checklist. The implementer must acknowledge each rule before writing code.

### Rule categories

Rules accumulate in these categories — they are NEVER deleted:
- **Import rules** — dependency ordering, layer compliance, circular import prevention
- **Type rules** — Pydantic model patterns, TypeScript interface patterns
- **Test rules** — fixture requirements, mock boundaries, coverage patterns
- **Runtime rules** — error handling patterns, edge cases discovered
- **Architecture rules** — layer boundary violations, file placement

---

## Self-Improvement

The scaffold improves itself over time through three mechanisms:

### 1. Learned rules accumulate (per-project)

Each project builds its own `learned-rules.md`. Over time, the implementer gets better at this specific codebase because recurring mistakes are explicitly prevented.

### 2. Review feedback tightens (per-project)

The code-reviewer reads `learned-rules.md` and adds new rules when it finds violations. This creates a feedback loop: failures → rules → prevention → fewer failures.

### 3. Gotchas evolve (cross-project)

When you start a new project with this scaffold, review the `learned-rules.md` from previous projects. Promote recurring rules to the relevant SKILL.md Gotchas section — this makes them permanent and project-independent.

```
Project failures → learned-rules.md (project) → Gotchas in SKILL.md (scaffold) → All future projects benefit
```

---

## State Files

All in `specs/state/` — persistent across iterations:

- `iteration-log.md` — every iteration: story, action, result, duration, coverage, commit
- `learned-rules.md` — defensive rules extracted from failures (injected into future prompts)
- `failures.md` — raw failure details for pattern analysis
- `coverage-baseline.txt` — last known good coverage % (updated on each PASS commit)

See [references/state-schema.md](references/state-schema.md) for format.

## Ratcheting Rules

- **Only improvements persist.** Failed iterations revert completely (after self-healing attempts).
- **Coverage never drops.** If a commit would lower coverage, it's rejected.
- **Tests never break.** If existing tests fail after a change, revert.
- **Lessons accumulate.** `learned-rules.md` grows monotonically — rules are never deleted.
- **Self-heal first, revert last.** Always try to fix the error before reverting the entire story.

## Stopping Criteria (from program.md)

The loop stops when ANY of these are true:
- All stories complete and tests pass.
- A story fails 3 consecutive iterations (escalate).
- Architecture violation that hooks can't fix.
- Coverage drops below threshold.
- Max iterations exceeded.

## Gotchas

- **Not reading program.md each iteration.** Constraints change mid-run. Always re-read.
- **Retrying the same approach.** After a failure, read `learned-rules.md` and try a DIFFERENT strategy. Same code = same failure.
- **Reverting too eagerly.** Try self-healing first. Revert is expensive — it throws away all work for the story. A lint fix or type annotation takes seconds.
- **Reverting too broadly.** Only revert the current story's files, not the entire repo. Use `git stash` or targeted `git checkout`.
- **Ignoring the failure log.** If the same error appears 2+ times in `failures.md`, it's a pattern — extract a defensive rule.
- **Autonomous drift.** If the agent starts making changes not in any story, the constraints in `program.md` should catch it. If not, add a constraint.
- **No human check-in.** Cap at 50 iterations. The human needs to review progress periodically.
- **Not injecting learned rules into the prompt.** If the implementer doesn't receive the rules, it'll repeat the same mistakes. Always paste them into the agent spawn prompt.
