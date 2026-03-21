# Implementation Patterns

## Python (Backend)

```python
# Types layer — Pydantic models
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Order(BaseModel):
    id: UUID
    customer_id: UUID
    status: OrderStatus = OrderStatus.PENDING
    total_amount: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Service layer — business logic, no HTTP awareness
async def process_order(order: Order, payment_service: PaymentService) -> ProcessedOrder:
    validated = await validate_order(order)
    confirmation = await payment_service.process_payment(validated)
    stored = await store_confirmation(confirmation)
    return stored

# API layer — thin, delegates to service
@router.post("/orders", response_model=OrderResponse)
async def create_order(payload: CreateOrderRequest, service: OrderService = Depends()):
    order = await service.create(payload)
    return OrderResponse.from_orm(order)
```

## TypeScript (Frontend)

```typescript
// Types — interfaces, not type aliases for objects
interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
}

// API service — typed client
async function submitOrder(payload: CreateOrderRequest): Promise<Order> {
  const res = await fetch('/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new APIError(await res.json());
  return res.json();
}

// React component — single responsibility
function OrderForm({ onSuccess }: { onSuccess: (order: Order) => void }) {
  const [submitting, setSubmitting] = useState(false);
  // ...
}
```

## File Organization

```
# Python: test mirrors source
src/service/order.py         →  tests/service/test_order.py
src/api/routes/orders.py     →  tests/api/test_orders.py

# TypeScript: test co-located
src/components/OrderForm.tsx →  src/components/OrderForm.test.tsx
src/services/api.ts          →  src/services/api.test.ts
```
