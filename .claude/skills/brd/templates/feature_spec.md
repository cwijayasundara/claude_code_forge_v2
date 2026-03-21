# Feature: [Feature Name]

**ID**: [feature-id]
**Priority**: [high | medium | low]
**Status**: [draft | review | approved | implemented | verified]

## Description

Brief, clear description of what this feature does and the problem it solves.

## Motivation

Why this feature is needed. What user problem or business need does it address?

## Terminology

> Define domain-specific terms used in this spec. Skip if all terms are obvious.

| Term | Definition |
|------|-----------|
| [Term] | [Plain-language definition] |

## Technology Context

> Only list what this feature specifically requires. Skip sections that don't apply.

- **Libraries/packages**: [any new dependencies this feature introduces]
- **External services**: [APIs, databases, third-party services this feature talks to]
- **Environment variables**: [new env vars needed, with example values]

## Acceptance Criteria

Testable criteria in Given/When/Then format. Each criterion becomes a test.

1. **AC-001**: Given [precondition], When [action], Then [expected outcome]
2. **AC-002**: Given [precondition], When [action], Then [expected outcome]
3. **AC-003**: Given [error condition], When [action], Then [error handling]

> Rules: concise scenario titles, minimal When clauses, describe "what" not "how", use "should" in Then, avoid UI/tech implementation details in criteria.

## Alternatives Considered

> Document approaches evaluated during the interview. Skip for straightforward CRUD features.

### Approach A: [Name]
- **Pros**: [advantages]
- **Cons**: [disadvantages]

### Approach B: [Name]
- **Pros**: [advantages]
- **Cons**: [disadvantages]

**Decision**: [which approach was chosen and why]

## Affected Layers

- [ ] **Types** (`src/types/`): [what changes — new models, enums, etc.]
- [ ] **Config** (`src/config/`): [what changes — new env vars, settings]
- [ ] **Repository** (`src/repository/`): [what changes — new queries, API clients]
- [ ] **Service** (`src/service/`): [what changes — business logic]
- [ ] **API** (`src/api/`): [what changes — endpoints, middleware]
- [ ] **UI** (`src/ui/`): [what changes — routes, components]

## Data Model

> Define every field, type, and constraint. The agent writes code directly from this.

```python
class Example(BaseModel):
    """Describe what this model represents."""
    id: ExampleId          # Primary key — use refined type, not raw int
    name: str              # Human-readable name, max 100 chars
    status: ExampleStatus  # Enum: active, inactive, archived
    created_at: datetime   # Auto-set on creation
    updated_at: datetime   # Auto-set on update
    metadata: dict | None = None  # Optional JSON blob
```

### Database Changes

> If this feature adds or modifies tables, list every column.

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `examples` | `id` | `UUID` | `PRIMARY KEY` | |
| `examples` | `name` | `TEXT` | `NOT NULL, UNIQUE` | Max 100 chars |
| `examples` | `status` | `TEXT` | `NOT NULL DEFAULT 'active'` | Enum: active/inactive/archived |
| `examples` | `created_at` | `TIMESTAMP` | `NOT NULL DEFAULT NOW()` | |
| `examples` | `updated_at` | `TIMESTAMP` | `NOT NULL DEFAULT NOW()` | |

## API Endpoints

> Define every endpoint this feature adds or modifies. Include request/response bodies.

### `POST /api/examples` — Create an example

**Request:**
```json
{
  "name": "My Example",
  "metadata": {"key": "value"}
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My Example",
  "status": "active",
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-01-15T10:30:00Z",
  "metadata": {"key": "value"}
}
```

**Errors:**

| Status | Condition | Response body |
|--------|-----------|---------------|
| `400` | Name is empty or exceeds 100 chars | `{"error": "validation_error", "message": "Name must be 1-100 characters"}` |
| `409` | Name already exists | `{"error": "conflict", "message": "An example with this name already exists"}` |

### `GET /api/examples` — List examples

**Query params:** `?status=active&limit=20&offset=0`

**Response (200):**
```json
{
  "items": [{"id": "...", "name": "My Example", "status": "active", "created_at": "..."}],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

## UI Changes

> Skip this section if the feature has no user-facing changes.

### ASCII Wireframes

> Draw the normal state + key alternate states (empty, error, loading). Use box-drawing characters. Keep width under 55 chars.

**Normal State:**
```
┌─────────────────────────────────────────────┐
│  [← Back]  Examples              [+ New]    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ {Example Name}        Status: ●     │    │
│  │ {description}                       │    │
│  │ [Edit]  [Delete]                    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ─── Page 1 of 5 ── [< Prev] [Next >]      │
└─────────────────────────────────────────────┘
```

**Empty State:**
```
┌─────────────────────────────────────────────┐
│  [← Back]  Examples              [+ New]    │
├─────────────────────────────────────────────┤
│                                             │
│         No examples yet.                    │
│         [+ Create your first example]       │
│                                             │
└─────────────────────────────────────────────┘
```

**Error State:**
```
┌─────────────────────────────────────────────┐
│  [← Back]  Examples              [+ New]    │
├─────────────────────────────────────────────┤
│                                             │
│    ⚠ Unable to load examples.              │
│      [Retry]                                │
│                                             │
└─────────────────────────────────────────────┘
```

> Notation: `[Button]` clickable, `(○ Option)` radio, `[✓]` checkbox, `[________]` input, `{dynamic}` variable, `● / ○` toggle

### Layout

Describe where new UI elements appear and how they relate to existing layout:
- [e.g., "Add a 'Create Example' button in the top-right of the examples list page"]
- [e.g., "New modal dialog for example creation, triggered by the button"]

### Components

| Component | Location | Behavior |
|-----------|----------|----------|
| `CreateExampleButton` | `src/ui/examples/` | Opens creation modal on click |
| `ExampleForm` | `src/ui/examples/` | Validates name length, shows inline errors |
| `ExampleList` | `src/ui/examples/` | Paginated list with status filter dropdown |

### Visual Specs

> Include if relevant: colors, spacing, typography, responsive behavior.

- Button style: primary action (matches existing design system)
- Error text: red (#DC2626), 14px, below the input field
- List items: 48px height, hover highlight, truncate name at 40 chars

## User Interaction Flow

> Step-by-step walkthrough of how a user interacts with this feature.

1. User navigates to the examples page
2. User clicks "Create Example" button
3. Modal opens with name input and optional metadata fields
4. User enters name and clicks "Save"
5. If validation fails → inline error message appears, modal stays open
6. If save succeeds → modal closes, new example appears at top of list
7. Toast notification confirms "Example created"

## Business Rules

> Precise, testable statements. Each rule should map to one or more acceptance criteria.

1. Example names must be unique (case-insensitive)
2. Example names must be 1-100 characters, alphanumeric plus spaces and hyphens
3. Newly created examples always start with status "active"
4. Deleting an example soft-deletes it (sets status to "archived"), not hard-delete

## Edge Cases

> What happens at boundaries? Agents need these to write correct code.

1. **Empty name** → validation error, example not created
2. **Name with 100 chars** → accepted (boundary)
3. **Name with 101 chars** → validation error
4. **Duplicate name (different case)** → conflict error ("My Example" vs "my example")
5. **Create while offline** → error toast, form state preserved for retry

## Error Handling

| Error Condition | Layer | Error Type | User-Facing Message |
|----------------|-------|-----------|---------------------|
| Name too long | Service | `ValidationError` | "Name must be 1-100 characters" |
| Duplicate name | Repository | `ConflictError` | "An example with this name already exists" |
| Database unreachable | Repository | `ConnectionError` | "Unable to save. Please try again." |

## Implementation Order

> The agent implements in this order. Each step should be independently testable.

1. **Types**: Add `ExampleId`, `ExampleStatus` enum, `Example` model
2. **Repository**: Add `ExampleRepository` with `create()`, `list()`, `get_by_id()` methods
3. **Service**: Add `ExampleService` with business rule validation
4. **API**: Add endpoints, register routes
5. **UI**: Add route handler, form component, list component

## Dependencies

- **Features**: [other feature specs this depends on — e.g., "user-auth.md"]
- **External**: [third-party services, APIs, libraries]

## Test Strategy

> Map tests to acceptance criteria. The agent writes these alongside implementation.

- **Unit tests**: Test `ExampleService` validation rules (mock repo). Covers AC-001, AC-003.
- **Integration tests**: Test `ExampleRepository` with test database. Covers AC-002.
- **E2E tests**: Test full create flow through UI. Covers AC-001 end-to-end.

## Success Criteria

> How do we know this feature is done? Measurable, verifiable checks.

- [ ] All acceptance criteria have passing tests
- [ ] Coverage for new code >= 100% meaningful paths
- [ ] All linters pass
- [ ] API responses match the documented schemas exactly
- [ ] UI matches the wireframes and visual specs described above
- [ ] No console errors or unhandled exceptions
- [ ] Edge cases are handled gracefully with user-friendly messages

## Non-Functional Requirements

- **Performance**: [e.g., "List endpoint responds in < 200ms for 1000 examples"]
- **Security**: [e.g., "Only authenticated users can create examples"]
- **Scalability**: [e.g., "Pagination required — never load all examples at once"]

## Assumptions Register

> Every assumption made during the interview. Track status so nothing slips through.

| # | Assumption | Status | Source |
|---|-----------|--------|--------|
| 1 | [e.g., "Soft-delete, not hard-delete"] | Confirmed | Interview D2 |
| 2 | [e.g., "Case-insensitive uniqueness"] | Confirmed | Interview D4 |

## Open Questions

> These MUST be resolved before status moves to "approved". Agents stop and ask if they encounter these.

- [ ] [Any unresolved decisions or clarifications needed]

## Engineer Self-Audit

> Completed by the BRD creator before delivering. All items must be "Yes" or flagged in Open Questions.

| # | Check | Status |
|---|-------|--------|
| 1 | Can an engineer implement this without asking any questions? | [Yes/No] |
| 2 | Are all data types specified with constraints (max length, range, format)? | [Yes/No] |
| 3 | Are all acceptance criteria testable with concrete Given/When/Then? | [Yes/No] |
| 4 | Are all edge cases listed with expected behavior? | [Yes/No] |
| 5 | Is the API contract complete (request, response, all error codes)? | [Yes/No] |
| 6 | Are there any undefined behaviors (timeout, duplicate, partial failure)? | [Yes/No] |
| 7 | Can a frontend developer build the UI from the wireframes alone? | [Yes/No] |
| 8 | Do acceptance criteria cover error paths, not just happy paths? | [Yes/No] |

## Estimated Complexity

**[Small | Medium | Large]** — [justification]
