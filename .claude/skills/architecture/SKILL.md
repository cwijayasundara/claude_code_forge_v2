---
name: architecture
description: Design the system architecture including layered dependencies, API contracts (endpoints, schemas, errors), data models, folder structure, and deployment topology. Output a detailed design document to `specs/design/` with all decisions justified.
---

# Architecture Skill

## Design Principles

1. **Layered architecture** — dependencies flow downward only. See `.claude/architecture.md`.
2. **Typed contracts** — every boundary (API, service, repo) has typed input/output.
3. **Separation of concerns** — UI knows nothing about DB, services know nothing about HTTP.
4. **Convention over configuration** — predictable file locations, naming patterns.

## API Design Patterns

See `references/api-patterns.md` for complete REST endpoint conventions, request/response schemas, and error responses.

## Data Model Patterns

- Define once in Python (Pydantic), mirror in TypeScript.
- Use UUIDs for primary keys, not auto-increment integers.
- Timestamps: `created_at`, `updated_at` on every table.
- Soft delete with `deleted_at` where business logic requires it.
- Enums for status fields (never raw strings).

## Folder Structure Convention

See `templates/folder-structure.md` for the expected directory layout.

## Gotchas

1. **Missing type definitions** — If you design an endpoint but don't specify request/response schemas, implementers will make up their own. Always write Pydantic models and TypeScript interfaces before code generation.
2. **Circular layer dependencies** — If Service imports from API or Repository imports from Service, you've violated the layering rule. Refactor by extracting shared types to the Types layer.
3. **Ambiguous folder structure** — If the architecture doesn't specify exactly where a file lives (e.g., is DateValidator in `src/service/validators/` or `src/types/validators/`?), implementers will create inconsistent directories. Be explicit.
4. **Unspecified environment variables** — If you don't document required vs. optional env vars with defaults, deployment will fail. Always create `.env.example` with all variables and their defaults.
5. **Database migrations not planned** — If the architecture doesn't specify initial migrations or migration strategy (Alembic), data model changes will cause deploy failures. Plan migrations alongside the schema.
6. **Deployment topology mismatch** — If architecture specifies a three-tier deployment (backend, frontend, DB) but the docker-compose.yml is missing health checks or depends_on, services will start in the wrong order or fail to communicate.
