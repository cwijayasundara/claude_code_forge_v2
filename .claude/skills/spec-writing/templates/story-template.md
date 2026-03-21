# Story Template

Copy this template for each user story. All fields are required.

## E{epic-number}-S{story-number}: {Story Title}

**Epic:** {Epic name and number}

**Narrative**

As a {persona}, I want to {action}
so that {business value}.

**Acceptance Criteria**

- [ ] {Specific, testable criterion 1}
- [ ] {Specific, testable criterion 2}
- [ ] {Specific, testable criterion 3}
- [ ] {Specific, testable criterion 4}

**Layer Assignments**

Identify which layers this story touches (check all that apply):

- [ ] Types — New Pydantic models or TypeScript interfaces
- [ ] Config — New environment variables or configuration
- [ ] Repository — New database queries or data access methods
- [ ] Service — New business logic or orchestration
- [ ] API — New HTTP endpoints or request/response types
- [ ] UI — New React components or pages

**Hard Dependencies**

List stories that MUST be completed before this one can start:
- {Story reference, e.g., "E1-S1"}
- {Leave blank if no hard dependencies}

**Test Strategy**

Outline the test approach:
- Unit tests for: {e.g., "field validation, error handling"}
- Integration tests for: {e.g., "API endpoint with database"}
- E2E tests for: {e.g., "user upload flow with verification"}

**Estimated Size**

- {S = 1-2 days, M = 2-3 days, L = 3-5 days}

**Notes**

{Any additional context, edge cases, or implementation hints}
