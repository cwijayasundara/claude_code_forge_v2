# Error Recovery Procedures

## Per-Phase Recovery

| Phase | Common Failure | Recovery |
|-------|---------------|----------|
| 1. Spec | Ambiguous BRD | Flag `[CLARIFY: ...]` items, ask user |
| 2. Architecture | Missing endpoint schemas | Re-run architect on flagged stories |
| 3. UI Design | Story without mockup | Re-run ui-designer on missing stories |
| 4. Implementation | Tests fail | Implementer fixes (max 3 retries per story) |
| 4. Implementation | Coverage < 100% | Implementer adds missing test cases |
| 5. Code Review | BLOCK findings | Implementer fixes, code-reviewer re-reviews changed files only |
| 5. Security | BLOCK findings | Implementer fixes, security-reviewer re-reviews |
| 6. E2E Testing | Playwright fails | Test-engineer debugs, implementer fixes app code |
| 7. Deployment | Docker fails | Architect fixes Dockerfiles/compose, re-test |

## Max Retries

3 per phase. After 3 attempts, stop and report:
- Which phase failed
- The specific error/finding
- What was tried
- Suggested manual fix

## Phase 8: Commit & PR

```bash
git checkout -b feat/<feature-name>
git add backend/ frontend/ docker-compose.yml .env.example .github/
git add specs/
git commit -m "feat: <description from BRD>"
git push -u origin feat/<feature-name>
gh pr create --title "feat: <description>" --body "<summary>"
```
