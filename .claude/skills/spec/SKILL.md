---
name: spec
description: Decompose a BRD into epics, user stories, acceptance criteria, and a dependency graph with parallel groups for agent team execution.
disable-model-invocation: true
argument-hint: "[path-to-BRD]"
context: fork
agent: spec-writer
---

# /spec — Spec Writing

## Usage

```
/spec [path-to-BRD]
```

## Steps

1. Read `.claude/skills/spec-writing/SKILL.md` for decomposition patterns.
2. Spawn `spec-writer` agent with the BRD as input.
3. Agent writes output to `specs/stories/`:
   - `epics.md` — epic summaries with story lists
   - `E{n}-S{n}.md` — individual story files with acceptance criteria
   - `dependency-graph.md` — hard dependencies + parallel groups
4. Verify gate: every story has acceptance criteria, layer assignment, and group.
5. Present epic summary and dependency graph for user review.

## Gate

- All stories have acceptance criteria (testable, specific)
- Every story has a layer assignment (Types, Config, Repository, Service, API, UI)
- Dependency graph has no circular dependencies
- Parallel groups assigned for agent team execution

## Gotchas

- **Vague acceptance criteria.** "Works properly" is not testable. Each criterion must be verifiable with a specific test case.
- **Missing layer assignments.** Without layers, the architect can't assign files and the implementer can't enforce dependency rules.
- **Circular dependencies in graph.** If A depends on B depends on A, the agent team can't parallelize. Break the cycle by extracting shared types.
- **Too many stories per epic.** Keep epics to 3-5 stories. Larger epics should be split — they're hard to parallelize and review.
- **Skipping the user review.** Always present the dependency graph before moving to architecture. Catching spec issues here is 10x cheaper than in implementation.
