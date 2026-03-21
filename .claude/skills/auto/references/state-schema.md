# State File Schemas

All state files live in `.claude/state/` and persist across iterations.

## iteration-log.md

Append-only log. Every iteration adds a row. Never edit past rows.

```markdown
# Iteration Log

| # | Timestamp | Story | Action | Result | Duration | Coverage | Commit |
|---|-----------|-------|--------|--------|----------|----------|--------|
| 1 | 2026-03-21T10:00 | E1-S1 | implement | PASS | 3m12s | 100% | a1b2c3d |
| 2 | 2026-03-21T10:04 | E1-S2 | implement | FAIL:type_error | 2m45s | — | — |
| 3 | 2026-03-21T10:05 | E1-S2 | self-heal:type_error | PASS | 0m32s | 100% | — |
| 4 | 2026-03-21T10:06 | E1-S2 | ratchet-gate | PASS | 1m15s | 100% | e4f5g6h |
| 5 | 2026-03-21T10:10 | E1-S3 | implement | FAIL:test_failure | 3m01s | — | — |
| 6 | 2026-03-21T10:11 | E1-S3 | self-heal:test_failure | FAIL:test_failure | 1m22s | — | — |
| 7 | 2026-03-21T10:12 | E1-S3 | self-heal:test_failure | FAIL:test_failure | 1m18s | — | — |
| 8 | 2026-03-21T10:13 | E1-S3 | revert+escalate | BLOCKED | — | — | reverted |
```

### Action types

- `implement` — first attempt at a story
- `self-heal:<category>` — targeted fix after failure (lint, type_error, test_failure, import_error, arch_violation, coverage_drop, runtime_error)
- `ratchet-gate` — re-running verification after self-heal
- `retry (applied rule #N)` — fresh implementation attempt using a learned rule
- `revert+escalate` — gave up after 3 retries, reverted, blocked the story
- `review` — code-review + security-review pass
- `e2e` — Playwright test run

### Result types

- `PASS` — gate passed
- `FAIL:<category>` — gate failed with specific error category
- `BLOCKED` — story escalated to human

## learned-rules.md

Rules extracted from failures. Injected into agent prompt each iteration. **Never delete rules.**

```markdown
# Learned Rules

## Rule 1: Import order matters for circular deps
- **Source:** Iteration 2, E1-S2 (failed)
- **Pattern:** Importing Pydantic model before defining its dependencies causes ImportError
- **Rule:** Always define base types in src/types/ before importing in service layer
- **Applied in:** Iteration 4 (success)

## Rule 2: List indexing needs bounds check
- **Source:** Iteration 7, E2-S1 (failed)
- **Pattern:** Empty or missing list items cause IndexError on access
- **Rule:** Always check list length > 0 and use safe getters before accessing by index
- **Applied in:** Iteration 8 (success)
```

### Rule categories

- **Import rules** — dependency ordering, layer compliance, circular imports
- **Type rules** — Pydantic model patterns, TypeScript interface patterns
- **Test rules** — fixture requirements, mock boundaries, coverage patterns
- **Runtime rules** — error handling, edge cases, null checks
- **Architecture rules** — layer boundary violations, file placement

## failures.md

Raw failure data for pattern extraction. When the same error type appears 2+ times, extract a rule.

```markdown
# Failure Log

## Iteration 2 — E1-S2
- **Error:** ImportError: cannot import name 'Document' from 'src.types.models'
- **Category:** import_error
- **Root cause:** src/types/models.py not yet created (dependency on E1-S1)
- **Self-heal attempted:** yes — added missing import, still failed (wrong module path)
- **Files touched:** src/service/extraction.py, src/repository/documents.py
- **Retry count:** 1/3
- **Lesson extracted:** Rule 1

## Iteration 7 — E2-S1
- **Error:** IndexError: list index out of range
- **Category:** runtime_error
- **Root cause:** Test PDF fixture was empty (0 pages)
- **Self-heal attempted:** yes — added bounds check, passed on first self-heal
- **Files touched:** src/service/pdf_parser.py
- **Retry count:** 1/3
- **Lesson extracted:** Rule 2
```

## coverage-baseline.txt

Single number: the last committed coverage percentage. Updated after each PASS commit.

```
87
```

The ratchet gate in `/auto` compares this against current coverage.
If current < baseline → FAIL (coverage dropped). If current >= baseline → update baseline.
