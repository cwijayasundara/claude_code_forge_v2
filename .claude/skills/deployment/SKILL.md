---
name: deployment
description: Set up local development with Docker Compose, hot reload, health checks, and database migrations. Generate docker-compose.yml, Dockerfiles, .env.example, and document the deployment topology.
---

# Deployment Skill

## Local Development Stack

Three-tier architecture:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend    │────▶│  Backend    │────▶│  PostgreSQL  │
│  React/Vite  │     │  FastAPI    │     │  16          │
│  :3000       │     │  :8000      │     │  :5432       │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Configuration Files

Copy these templates to the project root when generating deployment artifacts:
- `templates/docker-compose.yml` — Services, volumes, health checks, env setup
- `templates/Dockerfile.backend.dev` — Python 3.12 + FastAPI + hot reload + dependencies
- `templates/Dockerfile.frontend.dev` — Node 20 + Vite + hot reload
- `templates/.env.example` — All required and optional env vars documented

## One-Command Start

```bash
# Start everything (builds + runs)
docker compose up

# Rebuild without cache
docker compose up --build

# Stop everything (keeps data)
docker compose down

# Stop and remove all data
docker compose down -v
```

## Database Migrations

```bash
# Apply all pending migrations
uv run alembic upgrade head

# Create migration from model changes
uv run alembic revision --autogenerate -m "description"

# Rollback one migration
uv run alembic downgrade -1
```

## Health Checks

Verify the stack is healthy:

```bash
# Backend health
curl http://localhost:8000/health

# Frontend loads
curl http://localhost:3000

# Database is ready
docker compose exec db pg_isready -U postgres
```

## Gotchas

1. **Missing depends_on with service_healthy** — If backend service doesn't specify `depends_on: { db: { condition: service_healthy } }`, it will start before the database is ready and fail to connect. Always require the healthcheck condition.
2. **Hot reload not set up** — If volumes don't mount source code (e.g., `./backend/src:/app/src`), developers must rebuild the container on every code change. Specify bind mounts for both backend and frontend.
3. **Forgotten port mappings** — If `ports: ["8000:8000"]` is omitted, the service runs but is unreachable from the host. Always expose the dev ports.
4. **Database password in docker-compose.yml** — Never hardcode `POSTGRES_PASSWORD` in version control. Use .env files and `env_file: .env` in docker-compose.yml to pull from environment.
5. **Missing .env.example** — If .env.example doesn't exist, new developers won't know which env vars are required vs. optional. Document every variable: which ones block startup (required), which have defaults, and what values are valid.
6. **No database health check** — If postgres service lacks a healthcheck, the backend starts immediately and fails to connect if the DB is still initializing. Always include a health check with reasonable retries (5+) and timeouts.
