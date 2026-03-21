# App Spec: [Project Name]

**Status**: [draft | review | approved]

## Overview

What this application does in 2-3 sentences. What problem it solves and who it's for.

## Terminology

> Define domain-specific terms used throughout this spec. Engineers should not need to guess.

| Term | Definition |
|------|-----------|
| [Term] | [Plain-language definition] |
| [Term] | [Plain-language definition] |

## Technology Stack

### Frontend
- **Framework**: [e.g., React with Vite, Next.js, SvelteKit]
- **Styling**: [e.g., Tailwind CSS, CSS Modules]
- **State management**: [e.g., React hooks + context, Zustand, Redux]
- **Routing**: [e.g., React Router, file-based routing]

### Backend
- **Runtime**: [e.g., Python/FastAPI, Node.js/Express]
- **Database**: [e.g., PostgreSQL, SQLite, MongoDB]
- **API style**: [e.g., REST, GraphQL]
- **Authentication**: [e.g., JWT, session-based, OAuth]

### External Services
- [Service name] — [purpose, e.g., "Anthropic API — chat completions"]
- [Service name] — [purpose]

### Infrastructure
- **Hosting**: [e.g., AWS, Azure, Vercel, GCP]
- **CI/CD**: [e.g., GitHub Actions]
- **Containerization**: [e.g., Docker]
- **Database hosting**: [e.g., AWS RDS, Azure Database for PostgreSQL, local SQLite]
- **Secrets management**: [e.g., Azure Key Vault, AWS Secrets Manager, .env files]
- **Deployment strategy**:
  - Environments: [e.g., staging + production]
  - Triggers: [e.g., push to main → staging, manual approval → production]
  - Zero-downtime: [e.g., rolling deployment, blue-green]

## Core Features

Group features by domain area. Each group becomes a candidate for a feature spec.

### [Feature Group 1: e.g., Chat Interface]
- [Feature with enough detail for an agent to implement]
- [Feature]
- [Feature]

### [Feature Group 2: e.g., Conversation Management]
- [Feature]
- [Feature]

### [Feature Group 3: e.g., User Settings]
- [Feature]
- [Feature]

> Add as many feature groups as needed. Each group should be cohesive — implementable as one unit.

## Alternatives Considered

> Document the implementation approaches that were evaluated and why the chosen approach won.

### Approach A: [Name]
- **Description**: [what this approach looks like]
- **Pros**: [advantages]
- **Cons**: [disadvantages]

### Approach B: [Name]
- **Description**: [what this approach looks like]
- **Pros**: [advantages]
- **Cons**: [disadvantages]

**Decision**: [which approach was chosen and why]

## Database Schema

Define every table, column, type, and constraint. The agent writes migrations directly from this.

### [table_name]
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | `PRIMARY KEY` | |
| `name` | `TEXT` | `NOT NULL` | Max 100 chars |
| `created_at` | `TIMESTAMP` | `NOT NULL DEFAULT NOW()` | |
| `updated_at` | `TIMESTAMP` | `NOT NULL DEFAULT NOW()` | |

### [table_name]
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| | | | |

> Add one table per entity. Include foreign keys, indexes, and enum value sets.

## API Endpoints

Organize by resource. Include method, path, and brief description.

### [Resource: e.g., Conversations]
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/conversations` | List all conversations |
| `POST` | `/api/conversations` | Create a new conversation |
| `GET` | `/api/conversations/:id` | Get conversation by ID |
| `PUT` | `/api/conversations/:id` | Update conversation |
| `DELETE` | `/api/conversations/:id` | Delete conversation |

### [Resource: e.g., Messages]
| Method | Path | Description |
|--------|------|-------------|
| | | |

> For key endpoints, add request/response body examples below the table.

## UI Layout

### Main Structure
Describe the overall layout (e.g., sidebar + main content + panel).

### ASCII Wireframe — Main Screen

```
┌─────────────────────────────────────────────┐
│  [Logo]  Navigation              [Profile]   │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │   Main Content Area              │
│          │                                  │
│ - Nav 1  │   ┌──────────────────────────┐   │
│ - Nav 2  │   │  Content Card            │   │
│ - Nav 3  │   │  {dynamic content}       │   │
│          │   └──────────────────────────┘   │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### [Section: e.g., Sidebar]
- [Element and behavior]
- [Element and behavior]

### [Section: e.g., Main Content Area]
- [Element and behavior]
- [Element and behavior]

### Key Modals / Overlays
- [Modal name] — [trigger and purpose]

## Design System

### Colors
- **Primary**: [hex and usage]
- **Background**: [light mode / dark mode values]
- **Text**: [light mode / dark mode values]

### Typography
- **Font family**: [e.g., Inter, system-ui]
- **Body text**: [size, weight, line-height]
- **Code**: [monospace font]

### Component Patterns
- **Buttons**: [primary, secondary, icon — describe style]
- **Inputs**: [style, states]
- **Cards**: [style, spacing]

## Key Interaction Flows

### [Flow 1: e.g., Send a Message]
1. [Step]
2. [Step]
3. [Step]

### [Flow 2: e.g., Create a Project]
1. [Step]
2. [Step]

## Implementation Phases

Break the build into phases. Each phase should produce a working (if incomplete) application.

### Phase 1: [Foundation]
- [Task]
- [Task]
- **Milestone**: [What works after this phase]

### Phase 2: [Core Feature]
- [Task]
- [Task]
- **Milestone**: [What works after this phase]

### Phase 3: [Secondary Features]
- [Task]
- [Task]
- **Milestone**: [What works after this phase]

> Each phase maps to one or more feature specs generated from this app spec.

## Success Criteria

### Functional
- [ ] [Core flow works end-to-end]
- [ ] [All CRUD operations functional]
- [ ] [Error handling covers major failure modes]

### User Experience
- [ ] [Responsive on mobile and desktop]
- [ ] [Fast response times]
- [ ] [Intuitive navigation]

### Technical
- [ ] [Clean architecture — layers respected]
- [ ] [Test coverage >= 80%]
- [ ] [All linters pass]
- [ ] [No hardcoded secrets]

## Non-Functional Requirements

- **Performance**: [e.g., page load < 2s, API response < 200ms]
- **Security**: [e.g., input validation, auth on all endpoints, CORS configured]
- **Scalability**: [e.g., pagination on all list endpoints]
- **Accessibility**: [e.g., keyboard navigation, screen reader support]

## Assumptions Register

> Every assumption made during the interview. Confirmed = agreed with the human. Pending = needs verification.

| # | Assumption | Status | Source |
|---|-----------|--------|--------|
| 1 | [e.g., "Users will authenticate via email/password, not SSO"] | Confirmed | Interview D1 |
| 2 | [e.g., "PostgreSQL is acceptable for the database"] | Confirmed | Interview D3 |
| 3 | [e.g., "Mobile support is v2, not MVP"] | Pending | Interview D5 |

## Open Questions

> These MUST be resolved before status moves to "approved."

- [ ] [Any unresolved architecture decisions]
- [ ] [Any unclear requirements]
