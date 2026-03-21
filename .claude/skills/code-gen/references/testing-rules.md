# Testing Rules

## Code First, Tests Second

Write implementation, then tests. Tests validate behavior, not implementation.

## 100% Coverage Is the Minimum Bar

At 100% coverage, every line must demonstrate how it behaves with executable examples — it can't stop at "this seems right." Write tests for as many scenarios as possible, even if the same lines get exercised multiple times.

## What "Meaningful Coverage" Means

Cover these paths:
- Happy path (normal operation)
- Error paths (invalid input, service failure)
- Edge cases (empty input, boundary values, null/None)
- State transitions (pending → processing → completed)

Do NOT cover:
- Trivial property access / getters
- Framework boilerplate (FastAPI dependency injection)
- Third-party library internals

## Test Structure: Arrange → Act → Assert

```python
def test_process_user_order():
    # Arrange
    order = load_fixture("order_12345")

    # Act
    result = process_order(order)

    # Assert
    assert result.status == "completed"
    assert result.total_amount == 150.00
    assert result.confirmation_id is not None
```

## Mock Boundaries

```
Mock:       External APIs, databases, file systems, LLM calls
Don't Mock: Business logic, type validation, data transformation
```

## Realistic Test Data

```
GOOD: "Sarah Chen", "sarah.chen@acmecorp.com", "$2,500.50", "2026-03-21", "active"
BAD:  "test", "foo@bar.com", "123", "date", "status"
```
