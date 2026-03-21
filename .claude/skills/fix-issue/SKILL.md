---
name: fix-issue
description: Standard workflow for fixing a GitHub issue. Fetches issue details, creates a branch, implements the fix with tests, and prepares a PR.
disable-model-invocation: true
argument-hint: "[issue-number]"
context: fork
---

# Fix Issue Workflow

## Steps

1. **Fetch issue details**
   ```bash
   gh issue view <issue-number> --json title,body,labels,assignees
   ```

2. **Create a branch**
   ```bash
   git checkout -b fix/<short-description>
   ```

3. **Understand the problem**
   - Read the relevant source files identified in the issue.
   - Reproduce the bug if possible (write a failing test first).

4. **Implement the fix**
   - Write a failing test that demonstrates the bug.
   - Fix the code to make the test pass.
   - Run the full test suite to check for regressions.

5. **Verify**
   ```bash
   uv run pytest -x -q          # Python tests pass
   uv run ruff check .           # No lint errors
   uv run mypy src/              # No type errors
   npm test                      # TypeScript tests pass (if applicable)
   npm run typecheck             # TypeScript types (if applicable)
   ```

6. **Commit and push**
   ```bash
   git add -A
   git commit -m "fix: <description> (closes #<issue-number>)"
   git push -u origin fix/<short-description>
   ```

7. **Create PR**
   ```bash
   gh pr create --title "fix: <description>" --body "Closes #<issue-number>"
   ```

## Gotchas

1. **Issue description is vague or missing steps to reproduce** — Before implementing, ask clarifying questions or request a minimal reproduction. Fixing a bug you don't understand causes regressions.
2. **Test does not actually fail first** — If the test passes before the fix, you're not testing the bug. Always write the test, watch it fail, then fix the code.
3. **Fix addresses symptom, not root cause** — Patching the immediate error without understanding why it occurred leads to recurring bugs. Investigate the root cause before fixing.
4. **Regression in full test suite** — If some unrelated tests fail after your fix, you've broken something. Don't ignore failures and push anyway. Debug and fix the regression.
5. **Branch not based on current main** — If the branch is old and main has moved forward, there may be merge conflicts or compatibility issues. Always branch from a fresh `git pull origin main`.
6. **Missing file from git add** — If you forget to stage a changed file (only `git add -A` if all changes should be committed), the PR will be incomplete. Use `git diff` to verify all intended changes are staged.
