# Quality Principles — Detailed Reference

## 1. Small, Well-Scoped Modules

Every file does ONE thing. Directory structure is an interface.

```
GOOD: src/billing/invoices/compute.ts    # communicates purpose
BAD:  src/utils/helpers.ts               # communicates nothing

GOOD: src/service/extraction.py          # one domain concern
BAD:  src/service/stuff.py               # vague, will grow unbounded
```

Rules:
- One module = one responsibility.
- File names describe what the module does.
- No `utils/`, `helpers/`, `misc/`, `common/` grab-bag files.
- If a file grows past 200 lines, it's doing too much — split it.

## 2. Static Typing Everywhere

Types are the most reliable documentation. They're checked by machines.

**Python:**
- Type-annotate every function parameter and return value.
- Use `Pydantic BaseModel` for all data structures.
- No `# type: ignore` without a comment explaining why.
- Run `mypy --strict` (or at minimum `mypy src/`).

**TypeScript:**
- Strict mode always on.
- Use `interface` for object shapes (not `type` for simple objects).
- Zero `any` types. Use `unknown` + type guards if needed.
- Every function has explicit parameter and return types.

## 3. Functions Under 50 Lines

Long functions are where agents (and humans) lose context.

- If a function exceeds 50 lines, decompose it into smaller named functions.
- Each function does one logical thing.
- Prefer pure functions (no side effects) where possible.
- Name subfunctions by what they do, not when they run.

## 4. Explicit Error Handling

- No bare `except:` or `catch(e) {}`.
- Define typed error classes per domain.
- Every error path must have a test.
- Fail fast, fail loudly — never silently swallow.

```python
# GOOD
class ExtractionError(Exception):
    def __init__(self, field: str, reason: str, document_id: str):
        self.field = field
        self.reason = reason
        self.document_id = document_id

# BAD
except Exception:
    pass
```

## 5. No Dead Code

- Every line traces to a user story.
- No "we might need this later" code.
- No commented-out code blocks.
- No unused imports (enforced by ruff/eslint).
- Delete code rather than commenting it out — git remembers.

## 6. Self-Documenting Over Comments

- Good names > comments. If you need a comment, rename first.
- Docstrings for non-obvious behavior only (business rules, algorithms, why-not-how).
- Type signatures are the primary contract documentation.
