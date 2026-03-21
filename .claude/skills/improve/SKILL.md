---
name: improve
description: Enhance existing features with new behavior, performance improvements, or UX changes. Story-driven with full SDLC enforcement including tests and code review.
disable-model-invocation: true
argument-hint: "[description or story-id]"
context: fork
---

# /improve — Feature Enhancement

## Usage

```
/improve "add confidence score display to extraction results"
/improve E2-S3                           # improve based on existing story
/improve --perf src/service/extraction.py # performance improvement
```

## Steps

1. **Write or locate the story.**
   - If no story exists: write one with acceptance criteria → append to `.claude/specs/stories/`.
   - If story exists: read acceptance criteria from `.claude/specs/stories/`.
   - Every improvement needs a story. No story → no code.

2. **Assess impact** — identify which layers are affected:
   ```bash
   # What files will change?
   grep -rn "relevant_function_or_class" src/
   # What tests cover them?
   uv run pytest --collect-only -q | grep "relevant_module"
   ```

3. **Read architecture** — `.claude/architecture.md`, `api-contracts.md`, `data-models.md`.

4. **Implement the change:**
   - Modify existing code (don't create parallel paths).
   - Update types/interfaces if contracts change.
   - Update API contracts if endpoints change.
   - Follow the six quality principles (read `.claude/skills/code-gen/SKILL.md`).

5. **Update tests:**
   - Modify existing tests to match new behavior.
   - Add new tests for new acceptance criteria.
   - Run full suite — no regressions allowed.
   ```bash
   uv run pytest -x -q --cov=src --cov-report=term-missing
   npm test -- --coverage
   ```

6. **Run code review** — spawn `code-reviewer` on changed files.
7. Fix BLOCK findings (max 3 retries).
8. Update story file with implementation status.

## Difference from /refactor

| | /refactor | /improve |
|---|-----------|----------|
| **Changes behavior?** | No | Yes |
| **Needs a story?** | No (traces to principles) | Yes (traces to acceptance criteria) |
| **Updates tests?** | Tests must still pass unchanged | Tests change to match new behavior |
| **Modifies contracts?** | Never | May update APIs, types, schemas |

## Gotchas

- **Improving without a story.** Even small changes need acceptance criteria. "Make it faster" is not a story — "Extraction latency < 2s for 100-page PDFs" is.
- **Scope creep.** Improving one feature and "while I'm here" fixing three others. Each change gets its own story.
- **Breaking existing tests.** If tests fail after your change, determine: is the test wrong (behavior intentionally changed) or is your code wrong? Don't blindly update tests to pass.
- **Forgetting API contract updates.** If you change a response shape, update `api-contracts.md` AND the TypeScript interfaces. Frontend breaks silently otherwise.
- **No baseline measurement for performance improvements.** Before optimizing, measure current performance. After optimizing, measure again. No numbers = no proof it helped.
- **Parallel path anti-pattern.** Don't create `extraction_v2.py` alongside `extraction.py`. Modify in place, use feature flags if needed.
