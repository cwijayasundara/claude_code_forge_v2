# Expected Findings

## bad-upward-import.ts

| # | Severity | Violation | Line |
|---|----------|-----------|------|
| 1 | BLOCK | Upward import: service imports from api (`from "../../api/routes"`) | 7 |
| 2 | BLOCK | API-layer object (`uploadRouter`) stored as service class property | 12 |

## bad-long-function.ts

| # | Severity | Violation | Line |
|---|----------|-----------|------|
| 1 | BLOCK | Function `processDocument` exceeds 50 lines (~80 lines) | 11 |
| 2 | BLOCK | Hardcoded API key (`sk-ant-api03-...`) | 9 |
| 3 | BLOCK | Bare `catch (e)` with no typed error handling | 82 |
| 4 | WARN | String-matching field extraction instead of LLM pipeline | 60-68 |

## bad-test-quality.ts

| # | Severity | Violation | Line |
|---|----------|-----------|------|
| 1 | WARN | Mocks business logic (`vi.fn()` replacing extract) instead of external boundary | 11 |
| 2 | WARN | Generic test data ("test123", "test.pdf") — use realistic values | 12, 19 |
| 3 | WARN | Tests the mock return value, not actual code behavior | 13 |
| 4 | WARN | No error path tests — only happy path covered | all |
| 5 | WARN | `upload works` test has no meaningful assertion | 17-23 |

## bad-dead-code.ts

| # | Severity | Violation | Line |
|---|----------|-----------|------|
| 1 | BLOCK | `any` type used as parameter and return type (5 occurrences) | 6, 6, 25, 25, 44 |
| 2 | BLOCK | Commented-out code block (`oldParse` function) | 11-19 |
| 3 | BLOCK | Commented-out code block (`LegacyExtractor` class) | 30-40 |
| 4 | BLOCK | Commented-out code block (legacy format check) | 46-48 |
| 5 | BLOCK | Dead code: `unusedHelper` has no callers | 25 |
