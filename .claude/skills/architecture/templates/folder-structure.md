# Folder Structure Template

## Python Backend

```
backend/
├── src/
│   ├── types/                      # Layer 1: Data types
│   │   ├── __init__.py
│   │   ├── order.py                # Order model, enums, status
│   │   ├── payment.py              # Payment model, validation
│   │   └── api.py                  # Request/response types
│   │
│   ├── config/                     # Layer 2: Configuration
│   │   ├── __init__.py
│   │   └── settings.py             # Pydantic settings, env vars
│   │
│   ├── repository/                 # Layer 3: Data access
│   │   ├── __init__.py
│   │   ├── orders.py               # Order CRUD, queries
│   │   └── base.py                 # Base repository class
│   │
│   ├── service/                    # Layer 4: Business logic
│   │   ├── __init__.py
│   │   ├── order.py                # Order processing orchestration
│   │   ├── payment.py              # Payment processing logic
│   │   └── validators/             # Validation functions
│   │       └── order_validator.py
│   │
│   ├── api/                        # Layer 5: HTTP endpoints
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app, middleware
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── orders.py           # POST /orders, GET /orders/{id}
│   │
│   └── logging/
│       ├── __init__.py
│       └── logger.py               # Structured logging
│
├── tests/
│   ├── conftest.py                 # Shared fixtures
│   ├── types/
│   │   └── test_order.py
│   ├── service/
│   │   ├── test_order.py
│   │   └── test_payment.py
│   ├── api/
│   │   └── test_orders.py          # Integration tests
│   └── fixtures/
│       └── data/                   # Test data files
│           ├── valid_order.json
│           └── invalid_order.json
│
├── pyproject.toml
├── uv.lock
├── Dockerfile.dev
└── .env.example
```

## TypeScript Frontend

```
frontend/
├── src/
│   ├── types/                      # Layer 1: Data types
│   │   ├── index.ts
│   │   ├── order.ts                # Order interface, enums
│   │   └── api.ts                  # API request/response types
│   │
│   ├── config/                     # Layer 2: Configuration
│   │   ├── index.ts
│   │   └── api.ts                  # API base URL, constants
│   │
│   ├── service/                    # Layer 3: Business logic (api clients)
│   │   ├── index.ts
│   │   ├── orders.ts               # submitOrder(), getOrder(), listOrders(), etc.
│   │   └── orders.test.ts          # Tests co-located with source
│   │
│   ├── ui/                         # Layer 4: React components
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── OrderForm.tsx       # Create/edit order page
│   │   │   ├── OrderForm.test.tsx  # Co-located test
│   │   │   ├── OrderList.tsx       # Order list page
│   │   │   └── OrderList.test.tsx  # Co-located test
│   │   ├── components/
│   │   │   ├── OrderCard.tsx       # Order display
│   │   │   ├── StatusBadge.tsx     # Status indicator
│   │   │   └── ErrorMessage.tsx
│   │   └── hooks/
│   │       ├── useOrders.ts        # Custom hook for order list
│   │       └── useOrders.test.ts   # Co-located test
│   │
│   └── index.css                   # Global styles
│
├── vite.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile.dev
└── .env.example
```

## Root Directory

```
/
├── backend/                        # Python FastAPI backend
├── frontend/                       # TypeScript React frontend
├── specs/                          # All specification and pipeline outputs
│   ├── brd/                        # BRD output
│   │   └── brd-analysis.md
│   ├── stories/                    # Epics, stories, dependency graph
│   │   ├── epics.md
│   │   ├── dependency-graph.md
│   │   ├── E1-S1-types.md
│   │   └── E2-S1-upload.md
│   ├── design/                     # Architecture docs
│   │   ├── system-design.md        # System design decisions
│   │   ├── api-contracts.md        # Typed API contracts
│   │   ├── data-models.md          # Pydantic models, DB schema
│   │   ├── folder-structure.md     # File layout per layer
│   │   ├── deployment.md           # Docker Compose topology
│   │   └── mockups/                # UI mockups (React + Tailwind HTML)
│   │       └── upload-flow.html
│   ├── test_artefacts/             # Test plan, cases, data, E2E
│   │   ├── test-plan.md
│   │   ├── test-cases.md
│   │   ├── test-data/
│   │   │   └── fixtures.json
│   │   └── e2e/
│   │       └── flows/
│   │           └── upload.spec.ts
│   ├── reviews/                    # Code + security reviews
│   │   ├── code-review.md
│   │   └── security-review.md
│   └── state/                      # Iteration log, learned rules, failures
│       ├── iteration-log.md
│       ├── learned-rules.md
│       └── failures.md
├── fixtures/                       # Test data (never modified during tests)
│   ├── orders/
│   │   ├── order_001.json
│   │   └── order_batch.json
│   └── users/
│       └── user_001.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Key Naming Conventions

- **Backend modules:** `lowercase_with_underscores.py`
- **Backend tests:** `test_module_name.py`
- **Frontend components:** `PascalCase.tsx`
- **Frontend tests:** `Component.test.tsx` (co-located next to source file)
- **Enums and types:** Defined in `types/` layer, imported everywhere
- **Database models:** In `types/` layer, mirrored as TypeScript interfaces
- **API routes:** One file per resource, e.g., `routes/orders.py`
