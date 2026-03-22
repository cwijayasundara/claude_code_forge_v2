# /brd — Business Requirements Document Creator

## Usage

```
/brd                          # start Socratic interview for a new BRD
/brd "Build me a task manager" # start with an initial idea
/brd --feature "Add search"   # create a single feature spec
```

## Purpose

Creates structured Business Requirements Documents through Socratic dialogue with the human.
This is the **first step** in the SDLC pipeline — before `/spec`, before `/design`, before any code.

```
/brd → /spec → /design → /implement → /review → /test → /deploy
```

## What Makes This Different

Inspired by best practices from kaosensei/prd-generator and cdeust/ai-prd-generator:

- **Five-dimension exploration** — structured interview across Why, What, How, Edge Cases, UI (not generic "tell me more")
- **Alternatives analysis** — proposes 2-3 implementation approaches with trade-offs before committing
- **Codebase analysis** — scans existing code to prevent spec conflicts (for existing projects)
- **Feasibility gate** — assesses scope and recommends splitting large projects into epics
- **ASCII wireframes** — lightweight UI sketches directly in the spec
- **Assumptions register** — tracks every assumption with confirmed/pending status
- **Engineer self-audit** — before delivering, verifies zero questions an engineer would need to ask

## Steps

1. **Codebase analysis** (existing projects only) — scan `src/` for models, endpoints, patterns.
2. **Detect scope** — greenfield app or single feature.
3. **Five-dimension interview** (one dimension at a time, 2-3 questions each):
   - D1: **Why** — problem, users, success metrics
   - D2: **What** — core operations, scope in/out, MVP
   - D2.5: **Alternatives** — 2-3 approaches with trade-offs (AI-driven)
   - D3: **How** — tech stack, data, integrations
   - D4: **Edge Cases** — failure modes, constraints, sensitive data
   - D5: **UI Context** — layout, reference designs, responsive needs
4. **Feasibility gate** — assess scope (small/medium/large), recommend approach.
5. **Draft spec** using templates from `.claude/skills/brd/templates/`.
6. **Engineer self-audit** — verify zero unanswered questions before presenting.
7. **Present draft** section by section for human approval.
8. **Write approved specs** to `specs/brd/`.

## Agent Spawning

Spawn a single agent:

```
Agent: brd-creator → analyzes codebase, conducts interview, writes to specs/brd/
```

### Prompt Template

```
Read `.claude/agents/brd-creator.md` for your role, interview dimensions, and self-audit checklist.

The user wants to create a BRD. [Include user's initial idea if provided.]

Follow the five-dimension interview process. For existing projects, analyze the codebase first.
Use templates in `.claude/skills/brd/templates/`. Run the engineer self-audit before presenting.
Write approved output to `specs/brd/`.
```

## Output

```
specs/
└── brd/
    ├── app_spec.md                # Greenfield only — full application spec
    └── features/
        ├── <feature-1>.md         # Feature spec per domain group
        ├── <feature-2>.md
        └── ...
```

## Gate

Before moving to `/spec`:

- [ ] App spec (if greenfield) has all sections filled — no placeholders
- [ ] Every feature spec has acceptance criteria in Given/When/Then format
- [ ] Every feature spec has affected layers identified
- [ ] Every feature spec has data model and API endpoints defined (where applicable)
- [ ] Every feature spec has ASCII wireframes for key screens (if UI-facing)
- [ ] Assumptions register is complete — no untracked assumptions
- [ ] Engineer self-audit passed — all 8 checks are "Yes" or flagged in Open Questions
- [ ] All Open Questions are resolved (or explicitly deferred to `/spec`)
- [ ] Human has approved the specs

## Integration with Pipeline

The `/brd` skill produces the input that `/spec` consumes:

| `/brd` output | `/spec` input |
|----------------|---------------|
| `specs/brd/app_spec.md` | Read for context (tech stack, schema, conventions) |
| `specs/brd/features/*.md` | Decomposed into epics, stories, dependency graph |

The `/build` pipeline can invoke `/brd` as Phase 0 when no BRD exists:

```
/build "Build me X" → /brd (Phase 0) → /spec (Phase 1) → /design (Phase 2) → ...
```

## Gotchas

- **Skipping the interview.** The whole point is Socratic dialogue. Don't just ask "what do you want?" and transcribe. Draw out details through targeted questions across all five dimensions.
- **Wall of questions.** Ask 2-3 questions per dimension, not 10. Let the human respond before moving to the next dimension.
- **Inventing requirements.** If the human didn't say it, flag it as an Open Question. Don't fill gaps with assumptions — track assumptions in the register.
- **Vague acceptance criteria.** "Works properly" is not testable. Each criterion must be verifiable: Given X, When Y, Then Z.
- **Missing error/edge cases.** Dimension 4 exists for a reason. Always ask: "What happens when things go wrong?"
- **Monolithic feature specs.** If a feature spec covers 5+ domain areas, split it. Each spec should be implementable as one cohesive unit.
- **No data model.** If the feature touches data, the spec must define the schema. Without it, implementers will guess.
- **Skipping human approval.** Always present the draft section by section. Catching spec issues here is 100x cheaper than in implementation.
- **Skipping codebase analysis.** For existing projects, always scan the codebase first. Specs that conflict with existing code waste implementation time.
- **Skipping the engineer self-audit.** Run it every time. If an engineer would need to ask a question, the spec isn't done.
- **No alternatives analysis.** For non-trivial features, always present 2-3 approaches. Building the wrong thing is the most expensive mistake.
- **Wireframes without alternate states.** Always draw normal state + empty + error at minimum. Happy-path-only wireframes miss half the UI work.
