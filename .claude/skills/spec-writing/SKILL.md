---
name: spec-writing
description: Decompose a Business Requirements Document into epics and user stories with acceptance criteria, estimate effort, and identify hard dependencies for parallel execution. Output stories in `specs/stories/` with dependency-graph.md and story files.
---

# Spec Writing Skill

## BRD Analysis Checklist

Before writing stories, extract from the BRD:
- **Users/Personas**: Who uses the system? What are their goals?
- **Core Workflows**: What are the 3-5 main things users do?
- **Data**: What data flows in, through, and out?
- **Integrations**: External systems, APIs, services?
- **Constraints**: Performance, security, compliance, tech stack?
- **Non-functional**: Scale, availability, latency requirements?

## Epic Decomposition Rules

- Each epic = one shippable vertical slice (UI + API + backend for one capability).
- Epics should be deliverable in 1-2 weeks of agent work.
- Order epics by dependency: foundation first, features second, polish last.
- Typical ordering: Types/Models → Core Backend → API → Frontend → Integration → Polish.

## Story Writing Format

See `templates/story-template.md` for the required story format with all fields.

## Dependency Mapping

- **Hard dependency**: Story B cannot start until Story A's code exists (e.g., API depends on types).
- **Soft dependency**: Story B is easier after A but can start independently.
- Only map hard dependencies. Group soft-independent stories for parallel execution.

## Parallel Group Assignment

Stories in the same parallel group have NO hard dependencies on each other.
The implementer agent will spawn concurrent sub-agents for each group.

```
Group A: [foundation — types, config]
Group B: [depends on A — repositories, services]
Group C: [depends on B — API endpoints]
Group D: [depends on C — UI pages]
```

## Gotchas

1. **Vague BRDs yield bad stories** — If the BRD is ambiguous about workflows or data, flag `[CLARIFY: ...]` items and ask the user before writing stories. Do not invent details.
2. **Acceptance criteria that are not testable** — Avoid "system should be fast" or "user should be happy". Acceptance criteria must be objective: specific file sizes, timeouts, error messages, state transitions.
3. **Stories that span multiple layers** — A single story should trace through one vertical slice (types → repo → service → API → UI). If a story requires changes in 5+ files across different domains, it's too big — split it.
4. **Circular dependencies** — If Story A depends on B and B depends on A, the BRD decomposition is wrong. Refactor to break the cycle by extracting a shared type or interface.
5. **Missing parallel groups** — Stories marked as parallel but later blocked by implicit dependencies cause implementation to stall. Double-check that parallel group stories truly have zero hard dependencies on each other.
6. **Stories without layer assignments** — Each story must explicitly state which layers it touches: Types, Repository, Service, API, UI. Missing assignments cause ambiguity during implementation.
