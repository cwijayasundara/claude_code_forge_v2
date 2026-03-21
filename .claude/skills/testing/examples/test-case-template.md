# Test Case Template

## Format

```
### TC-{epic}-{story}-{seq}: {short description}

- **Story:** E{n}-S{n}
- **Criterion:** {acceptance criterion text}
- **Type:** unit | integration | e2e
- **Priority:** P0 (blocks release) | P1 (should fix) | P2 (nice to have)

**Preconditions:** {setup required}

**Steps:**
1. {action}
2. {action}

**Expected:** {observable result}

**Test Data:** {specific values used}
```

## Examples

### TC-E1-S1-001: Create valid order succeeds

- **Story:** E1-S1
- **Criterion:** Create order with valid customer info and amount
- **Type:** integration
- **Priority:** P0

**Preconditions:** API server running, auth token valid, database ready

**Steps:**
1. POST /api/orders with valid payload (customer_name, amount)
2. Check response status and body

**Expected:** 201 Created with order_id, status='pending', and metadata

**Test Data:** `{ "customer_name": "Sarah Chen", "total_amount": 250.50 }`

### TC-E1-S1-002: Create order with maximum amount succeeds (boundary)

- **Story:** E1-S1
- **Criterion:** Create order accepts amounts up to 10,000.00
- **Type:** integration
- **Priority:** P0

**Preconditions:** API server running, auth token valid

**Steps:**
1. POST /api/orders with amount=10000.00
2. Check response status

**Expected:** 201 Created with order_id

**Test Data:** `{ "customer_name": "Michael Rodriguez", "total_amount": 10000.00 }`

### TC-E1-S1-003: Create order with amount exceeds limit fails

- **Story:** E1-S1
- **Criterion:** Reject orders exceeding 10,000.00
- **Type:** integration
- **Priority:** P0

**Preconditions:** API server running

**Steps:**
1. POST /api/orders with amount=10000.01
2. Check response status and error message

**Expected:** 400 Bad Request with message "Order amount exceeds maximum limit of 10,000.00"

**Test Data:** `{ "customer_name": "Jane Smith", "total_amount": 10000.01 }`

### TC-E1-S2-001: Empty order list returns empty array

- **Story:** E1-S2
- **Criterion:** List endpoint returns empty array when no orders exist
- **Type:** unit
- **Priority:** P1

**Preconditions:** Clean database

**Steps:**
1. GET /api/orders
2. Check response body

**Expected:** 200 OK with `{"orders": [], "total": 0}`

**Test Data:** None (empty state)
