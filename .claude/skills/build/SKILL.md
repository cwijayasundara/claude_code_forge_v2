---
name: build
description: Run the complete SDLC pipeline from BRD to deployed application. Orchestrates spec writing, architecture, UI design, implementation, code review, E2E testing, deployment, and PR creation.
disable-model-invocation: true
argument-hint: "[path-to-BRD]"
context: fork
---

# /build — Full SDLC Pipeline

## Usage

```
/build [path-to-BRD]
```

## Pipeline (8 Phases)

| Phase | Agent | Input | Output | Gate |
|-------|-------|-------|--------|------|
| 1. Spec | `spec-writer` | BRD | `.claude/specs/` | All stories have acceptance criteria |
| 2. Architecture | `architect` | specs | `.claude/architecture/` | Typed schemas, folders, migrations |
| 3. UI Design | `ui-designer` | specs + arch | `.claude/design/` | Every UI story has a mockup |
| 4. Implementation | `implementer` + agent team | specs + arch + design | `backend/`, `frontend/` | Tests pass, 100% coverage |
| 5. Code Review | `code-reviewer` + `security-reviewer` | code | `.claude/reviews/` | Zero BLOCK findings |
| 6. E2E Testing | `test-engineer` | specs + code | `.claude/testing/` | Playwright tests pass |
| 7. Deployment | `architect` | arch + code | `docker-compose.yml`, CI | `docker compose up` healthy |
| 8. Commit & PR | — | all changes | PR URL | CI passes |

Phase 4 uses agent teams for parallel execution. See `/implement` for details.

For error recovery procedures, see [references/error-recovery.md](references/error-recovery.md).

## Autonomous Mode

After the human approves Phase 1 (specs) and Phases 2-3 (architecture + UI), the remaining phases
run autonomously via the `/auto` ratcheting loop. The `/build` orchestrator:

1. **Phases 1-3: Human-in-the-loop** — present specs and architecture for review. Block until approved.
2. **Phase 4+: Autonomous** — hand off to `/auto` which reads `.claude/program.md` each iteration.

### Integration with /auto

After human approval of specs + design:
1. Initialize `.claude/state/` files (iteration-log, learned-rules, failures).
2. Update `.claude/program.md` Current Focus with story count and starting status.
3. Invoke `/auto` — the autonomous loop handles implementation, review, testing, and deployment.
4. `/auto` stops when all stories pass OR a stopping criterion is hit.
5. On stop, `/build` resumes for Phase 8 (commit + PR) or escalates to human.

### Ratcheting Gates (enforced by /auto)

- Coverage never drops below previous commit's level.
- Tests never break — failed iterations revert completely.
- Lessons accumulate in `.claude/state/learned-rules.md` — never deleted.
- Max 3 retries per story before escalating to human.

## Gotchas

- **Skipping Phase 1 gates.** If stories lack acceptance criteria, Phase 4 produces vague code. Always validate specs before proceeding.
- **Running Phase 4 without Phase 2.** Implementation without architecture produces inconsistent APIs and data models. Never skip the architect.
- **Not waiting for teammates.** The lead sometimes starts implementing instead of delegating. Tell it: "Wait for your teammates to complete their tasks."
- **Phase 5 BLOCK findings with no recovery loop.** If code-reviewer finds BLOCKs, the implementer must fix and re-submit for focused re-review — not full re-review.
- **Phase 8 staging too broadly.** `git add -A` can stage secrets or build artifacts. Always stage specific directories.
- **Retrying indefinitely.** Max 3 retries per phase. After 3 failures, stop and report to user.
