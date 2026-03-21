# Program — Human-Agent Bridge

This file is the **single point of human control** over autonomous execution.
Inspired by Karpathy's autoresearch `program.md` pattern.

The human edits this file. The agent reads it at the start of every iteration.

## Instructions

What the agent should work on (edit this section):

```
[Replace with your project instructions from the BRD]
Example: Build the MVP from the approved specs.
Focus on the core workflow first, then error handling.
Prioritize the happy path, then edge cases.
```

## Constraints

What the agent must NOT change (edit carefully):

- Do not change the layered architecture (Types → Config → Repo → Service → API → UI).
- Do not skip the code review gate — every group must pass `/review`.
- Do not add dependencies not in `pyproject.toml` or `package.json` without noting here.
- Maximum 3 retries per failing story before escalating to human.
- Self-heal before reverting — always try targeted fixes before throwing away work.
- Never delete rules from `learned-rules.md` — they accumulate monotonically.

## Stopping Criteria

When the agent should stop and report (any of these):

- All stories in the current spec are implemented and tests pass.
- A story fails 3 consecutive iterations (escalate to human).
- Architecture violation detected that hooks cannot auto-fix.
- Coverage drops below 80% after a commit (ratchet broken).
- Agent has run more than 50 iterations without human check-in.

## Self-Healing Policy

How the agent should handle failures:

- **Lint/format errors:** Auto-fix with ruff. Never revert for this.
- **Type errors:** Fix the annotation. If the type is wrong, fix the source. Never suppress with `# type: ignore`.
- **Test failures:** Fix the code, not the test. If the test is genuinely wrong, update it AND add a note to failures.md.
- **Import errors:** Check dependency graph. Move the import or create the missing module.
- **Coverage drops:** Read the coverage report line numbers. Add tests for uncovered paths.
- **3rd retry failure:** Revert, log failure, extract learned rule, escalate.

## Pipeline Status

<!-- Agent updates each phase as it completes -->

| Phase | Status | Gate | Notes |
|-------|--------|------|-------|
| 1. Spec | pending | — | |
| 2. Architecture | pending | — | |
| 3. UI Design | pending | — | |
| 4. Implementation | pending | — | |
| 5. Code Review | pending | — | |
| 6. E2E Testing | pending | — | |
| 7. Deployment | pending | — | |
| 8. Commit & PR | pending | — | |

Status values: `pending` → `in_progress` → `passed` / `failed` / `blocked`

## Current Focus

<!-- Agent updates this section each iteration -->

```
Iteration: 0
Status: Not started
Current story: —
Current phase: —
Last successful commit: none
Stories completed: 0 / 0
Coverage: n/a
Self-heals this iteration: 0
Learned rules total: 0
Blocked stories: none
```
