# Test Data Patterns

## Principles

- **Realistic**: Use real names, valid dates, plausible amounts.
- **Deterministic**: Same input → same output. No randomness.
- **Minimal**: Smallest data needed to verify the criterion.
- **Independent**: No test depends on another's data or state.

## Example Fixtures

```json
{
  "orders": [
    {
      "id": "fixture-order-001",
      "order_id": "ORD-2026-0001",
      "customer_id": "cust-12345",
      "status": "completed",
      "total_amount": 2500.50,
      "expected_fields": {
        "customer_name": "Sarah Chen",
        "email": "sarah.chen@acmecorp.com",
        "items_count": 3
      }
    },
    {
      "id": "fixture-order-002",
      "order_id": "ORD-2026-0002",
      "customer_id": "cust-67890",
      "status": "pending",
      "total_amount": 150.00,
      "expected_fields": {
        "customer_name": "Michael Rodriguez",
        "email": "michael.r@example.com",
        "items_count": 1
      }
    }
  ],
  "users": [
    {
      "id": "user-manager-001",
      "name": "Alex Thompson",
      "role": "order_manager",
      "email": "alex.thompson@acmecorp.com"
    }
  ]
}
```

## Anti-patterns

```
BAD:  "test", "foo@bar.com", "123", "asdf", "status"
GOOD: "Sarah Chen", "sarah.chen@acmecorp.com", "2500.50", "2026-03-21", "pending"
```
