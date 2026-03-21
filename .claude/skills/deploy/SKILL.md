---
name: deploy
description: Generate Docker Compose stack, Dockerfiles, env config, and verify local deployment with health checks and database migrations.
disable-model-invocation: true
argument-hint: "[--up]"
context: fork
agent: architect
---

# /deploy — Local Deployment

## Usage

```
/deploy                       # generate deployment files + verify
/deploy --up                  # also start the stack
```

## Prerequisites

- Source code in `backend/` and `frontend/` must exist
- `.claude/architecture/deployment.md` must exist

## Steps

1. Read `.claude/skills/deployment/SKILL.md` for deployment patterns.
2. Spawn `architect` agent to generate deployment artifacts from templates:
   ```bash
   # Copy templates to project root, adapting as needed
   cp .claude/skills/deployment/templates/docker-compose.yml docker-compose.yml
   cp .claude/skills/deployment/templates/Dockerfile.backend.dev backend/Dockerfile.dev
   cp .claude/skills/deployment/templates/Dockerfile.frontend.dev frontend/Dockerfile.dev
   cp .claude/skills/deployment/templates/.env.example .env.example
   cp .env.example .env  # developer fills in real values
   ```
3. Architect customizes templates based on `.claude/architecture/deployment.md` (add services, change ports, add env vars as needed).
4. Apply database migrations: `uv run alembic upgrade head`
5. Verify:
   ```bash
   docker compose config                    # validate compose file
   docker compose up -d --build             # build and start
   # Wait for health checks (no sleep — use retry)
   curl --retry 10 --retry-delay 3 --retry-connrefused http://localhost:8000/health
   curl --retry 10 --retry-delay 3 --retry-connrefused http://localhost:3000
   docker compose exec db pg_isready -U postgres
   ```
6. Report health check results.
7. If `--up` not specified, tear down: `docker compose down`

## Gotchas

- **Missing depends_on with service_healthy.** Backend must wait for DB. Without `condition: service_healthy`, it crashes on startup.
- **No hot reload volumes.** Without bind mounts (`./backend/src:/app/src`), every code change requires a full rebuild.
- **Hardcoded POSTGRES_PASSWORD.** Never in docker-compose.yml. Use `.env` file with `env_file:` directive.
- **Missing .env.example.** New developers won't know which vars are required vs optional. Document every variable.
- **Forgotten port mappings.** Service runs but is unreachable from host without `ports:` config.
- **No database health check.** Without postgres healthcheck, backend connects before DB is ready.
