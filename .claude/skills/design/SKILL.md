---
name: design
description: Generate system architecture (APIs, data models, folder structure, deployment) and interactive UI mockups from specs. Runs architect and ui-designer agents concurrently.
disable-model-invocation: true
context: fork
---

# /design — Architecture + UI Design

## Usage

```
/design
```

## Prerequisites

- `specs/stories/` must exist (run `/spec` first)

## Agent Spawning

This skill orchestrates TWO agents concurrently. Use the `Agent` tool to spawn both in the same message:

```
Agent 1: architect   → reads specs, writes to specs/design/
Agent 2: ui-designer → reads specs, writes to specs/design/mockups/
```

Both agents read from `specs/stories/` but write to separate directories — no file conflicts.
Wait for BOTH to complete before running gates.

## Steps

1. Read `.claude/skills/architecture/SKILL.md` for design patterns.
2. Read `.claude/skills/ui-mockup/SKILL.md` for mockup patterns.
3. **Spawn both agents concurrently using the Agent tool** (two Agent calls in one message):
   - Agent 1 (`architect`): "Read `.claude/skills/architecture/SKILL.md`. Read specs from `specs/stories/`. Generate architecture outputs to `specs/design/`."
   - Agent 2 (`ui-designer`): "Read `.claude/skills/ui-mockup/SKILL.md`. Read specs from `specs/stories/`. Generate UI mockups to `specs/design/mockups/`."
4. Architect writes to `specs/design/`:
   - `system-design.md` — layered architecture, component diagram
   - `api-contracts.md` — all endpoints with typed request/response schemas
   - `data-models.md` — Pydantic models, DB schema, migrations plan
   - `folder-structure.md` — file layout per layer
   - `deployment.md` — Docker Compose topology, env vars
5. UI Designer writes to `specs/design/mockups/`:
   - `sitemap.md` — page inventory
   - `mockups/` — one HTML file per screen (React + Tailwind, self-contained)
   - `component-inventory.md` — shared components list
6. **After both complete** — verify consistency: UI mockup data shapes must match `api-contracts.md`.
7. Verify gates for both agents.

## Gates

- Architecture: all API endpoints have typed schemas, folder structure defined, migration plan exists
- UI: every story with `Layer: UI` has a corresponding mockup HTML file
- Both outputs are consistent (UI uses the same API contracts the architect defined)

## Gotchas

- **Architect and UI designer diverge on API shapes.** The architect defines contracts first; the UI designer consumes them. If run concurrently, verify consistency after both finish.
- **Missing deployment design.** Architecture must include `deployment.md` — without it, Phase 7 has nothing to build from.
- **Mockups with fake APIs.** UI mockups use mock data, but the data shape must match `api-contracts.md`. Mismatch here causes integration bugs in Phase 4.
- **No folder structure output.** Without `folder-structure.md`, implementer teammates can't determine file ownership for parallel execution.
