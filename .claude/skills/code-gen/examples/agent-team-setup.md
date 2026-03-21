# Agent Team Setup Examples

## Example: Parallel Group B (3 Independent Stories)

```
Create an agent team to implement group B:
- Teammate "repo": implements E1-S2 (Document Repository — src/repository/documents.py)
- Teammate "service": implements E2-S2 (Extraction Service — src/service/extraction.py)
- Teammate "api": implements E3-S2 (Upload API — src/api/routes/upload.py)

Require plan approval before changes.
Each teammate owns different files — no overlap.
After completion, run full test suite to catch integration issues.
```

## Agent Team Communication Pattern

```
Teammate "repo" → broadcasts:
  "DocumentRepo interface defined at src/repository/documents.py
   — exports save_document(), get_document(), list_documents()"

Teammate "service" → receives message, imports DocumentRepo:
  "Using DocumentRepo from src/repository/documents.py in ExtractionService"

Teammate "api" → receives both messages:
  "Upload endpoint will call ExtractionService.process() and DocumentRepo.save()"
```

## File Ownership Rules

Before approving plans, verify NO file appears in two teammates' plans:

| Teammate | Owns | Does NOT touch |
|----------|------|----------------|
| repo | src/repository/, tests/repository/ | src/service/, src/api/ |
| service | src/service/, tests/service/ | src/repository/, src/api/ |
| api | src/api/, tests/api/ | src/repository/, src/service/ |

**Shared types exception:** If two teammates need the same type, ONE teammate owns it in `src/types/`. The other imports it.

## Post-Team Verification

After all teammates finish:
```bash
uv run pytest -x -q --cov=src --cov-report=term-missing
uv run ruff check .
uv run mypy src/
npm test -- --coverage
npm run lint
npm run typecheck
```
