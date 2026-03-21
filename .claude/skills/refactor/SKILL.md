---
name: refactor
description: Refactor existing code for quality, performance, or maintainability. Enforces six quality principles, runs full verification, and gates on code review.
disable-model-invocation: true
argument-hint: "[file-or-module-path]"
context: fork
---

# /refactor — Code Refactoring

## Usage

```
/refactor src/service/extraction.py       # refactor a specific file
/refactor src/repository/                  # refactor a module
/refactor --principle "small-modules"      # refactor to fix a specific principle violation
```

## Steps

1. Read `.claude/skills/code-gen/SKILL.md` for quality principles.
2. **Analyze current state** — run the quality audit:
   ```bash
   # Architecture compliance
   grep -rn "from src.api" src/service/ src/repository/ src/config/ src/types/
   grep -rn "from src.service" src/repository/ src/config/ src/types/
   grep -rn "from src.repository" src/config/ src/types/

   # Function length violations (>50 lines)
   find src/ -name "*.py" -exec awk '/^def |^async def /{name=$0; start=NR} /^[^ ]/{if(NR-start>50) print FILENAME":"start": "name" ("NR-start" lines)"}' {} \;

   # Type coverage
   uv run mypy src/ --txt-report /tmp/mypy-report 2>/dev/null
   npm run typecheck 2>&1

   # Test coverage baseline
   uv run pytest --cov=src --cov-report=term-missing -q 2>/dev/null
   ```
3. **Identify violations** — categorize by the six principles:
   - Large modules (>200 lines) → split by responsibility
   - Missing types → add annotations
   - Long functions (>50 lines) → extract named subfunctions
   - Bare exceptions → add typed error classes
   - Dead code → delete (git remembers)
   - Unclear names → rename for self-documentation
4. **Plan changes** — list each file, what changes, and why. No speculative refactoring.
5. **Execute refactoring** — one principle at a time, verify after each:
   ```bash
   uv run pytest -x -q                    # tests still pass
   uv run ruff check . && uv run mypy src/ # lint + types clean
   ```
6. **Run code review** — spawn `code-reviewer` agent on changed files.
7. Fix any BLOCK findings (max 3 retries).

## Rules

- **Tests must pass after every change.** If a refactor breaks tests, revert and try a smaller step.
- **No behavior changes.** Refactoring changes structure, not behavior. If acceptance criteria change, use `/improve` instead.
- **No new features.** If you find missing functionality, file it as a story — don't sneak it in.
- **Trace to a principle.** Every change must cite which of the six principles it addresses.

## Gotchas

- **Refactoring without tests.** If coverage is low, write tests FIRST, then refactor. You need a safety net.
- **Big-bang refactors.** Changing 20 files at once makes it impossible to isolate regressions. Change one module, verify, commit, repeat.
- **Renaming without updating imports.** After renaming a function or module, grep the entire codebase for old references. `grep -rn "old_name" src/`
- **Breaking the layering rule.** Refactoring often moves code between files. After every move, verify no upward imports were introduced.
- **Deleting "unused" code that's used dynamically.** Before deleting, grep for string references, config entries, and dynamic imports. Not everything shows up in static analysis.
- **Refactoring test files.** Test code doesn't need the same rigor — don't waste time making test helpers perfectly modular.
