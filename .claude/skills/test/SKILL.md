---
name: test
description: Generate test plan, test cases, test data fixtures, and Playwright E2E tests mapped to acceptance criteria.
disable-model-invocation: true
argument-hint: "[--plan-only | --e2e-only]"
context: fork
agent: test-engineer
---

# /test — Test Planning + E2E

## Usage

```
/test                         # full test phase
/test --plan-only             # just generate test plan + cases
/test --e2e-only              # just generate Playwright tests
```

## Prerequisites

- `specs/stories/` must exist
- Source code in `backend/` and `frontend/` must exist (run `/implement` first)
- Docker Compose stack must be deployable (run `/deploy` first for E2E)

## Steps

1. Read `.claude/skills/testing/SKILL.md` for test patterns.
2. Read `.claude/skills/testing/references/playwright.md` for Playwright patterns.
3. Spawn `test-engineer` agent.
4. Agent generates to `specs/test_artefacts/`:
   - `test-plan.md` — strategy, scope, environments
   - `test-cases.md` — all cases mapped to acceptance criteria
   - `test-data/` — realistic fixtures (JSON/PDF)
   - `e2e/flows/` — Playwright test files
5. Copy Playwright config template:
   ```bash
   cp .claude/skills/testing/templates/playwright.config.ts playwright.config.ts
   ```
6. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps chromium
   ```
7. Verify Docker stack is healthy before E2E:
   ```bash
   docker compose up -d --build
   curl --retry 5 --retry-delay 3 http://localhost:8000/health
   curl --retry 5 --retry-delay 3 http://localhost:3000
   ```
8. Run Playwright: `npx playwright test`
9. Generate report: `npx playwright show-report`

## Verification

```bash
uv run pytest -x -q           # unit tests still pass
npm test                       # vitest still passes
npx playwright test            # E2E tests pass
npx playwright show-report     # visual report
```

## Gotchas

- **Test cases not mapped to acceptance criteria.** Every test case must reference a story ID and criterion. Unmapped tests are either missing coverage or testing nothing useful.
- **Playwright selectors using CSS classes.** Use `getByRole()`, `getByLabel()`, `getByText()` — never CSS selectors or XPath. Class names change; roles don't.
- **Flaky waits.** Never `page.waitForTimeout(5000)`. Use `expect(locator).toBeVisible()` or `page.waitForResponse()` for deterministic waits.
- **E2E tests without Docker.** Playwright config must use `webServer` to start Docker Compose. Tests that assume services are already running will fail in CI.
- **Missing test data fixtures.** Use realistic data (real names, valid amounts) — not "test", "foo", "123".
