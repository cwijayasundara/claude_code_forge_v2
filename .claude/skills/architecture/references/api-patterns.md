# API Design Patterns

## RESTful Endpoints

Use standard HTTP methods and resource-based naming:

```
POST   /api/v1/{resource}          # Create
GET    /api/v1/{resource}          # List (with pagination)
GET    /api/v1/{resource}/{id}     # Get one
PUT    /api/v1/{resource}/{id}     # Full update
PATCH  /api/v1/{resource}/{id}     # Partial update
DELETE /api/v1/{resource}/{id}     # Delete
```

Examples:
```
POST   /api/v1/documents           # Upload a document
GET    /api/v1/documents           # List all documents
GET    /api/v1/documents/{id}      # Get document details
PATCH  /api/v1/documents/{id}      # Update document metadata
DELETE /api/v1/documents/{id}      # Delete a document
```

## Request/Response Schemas

Always define with Pydantic (Python) and TypeScript interfaces. Never use bare `dict` or `object`.

### Example: Create Document

Python (Pydantic):
```python
class CreateDocumentRequest(BaseModel):
    file: UploadFile
    document_type: DocumentType  # enum

class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    status: ProcessingStatus
    created_at: datetime
    updated_at: datetime
```

TypeScript (interface):
```typescript
interface CreateDocumentRequest {
  file: File;
  documentType: DocumentType;
}

interface DocumentResponse {
  id: string;
  filename: string;
  status: ProcessingStatus;
  createdAt: string;
  updatedAt: string;
}
```

## Error Responses

Always return structured error responses with HTTP status codes:

```python
class APIError(BaseModel):
    error: str  # Human-readable message
    code: str   # Machine-readable code (e.g., "FILE_TOO_LARGE")
    details: list[str] = []  # Additional context

# Example responses:
# 400 Bad Request
{
  "error": "File too large",
  "code": "FILE_TOO_LARGE",
  "details": ["Maximum size is 50MB, got 75MB"]
}

# 422 Unprocessable Entity
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": ["document_type is required", "file must be PDF"]
}

# 404 Not Found
{
  "error": "Document not found",
  "code": "DOCUMENT_NOT_FOUND",
  "details": ["id: 550e8400-e29b-41d4-a716-446655440000"]
}

# 500 Internal Server Error
{
  "error": "Extraction failed",
  "code": "EXTRACTION_ERROR",
  "details": ["Claude API timeout after 30s"]
}
```

## Response Pagination

For list endpoints, include pagination metadata:

```python
class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    limit: int
    offset: int

# Example:
{
  "items": [ /* documents */ ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

Query parameters: `?limit=20&offset=40`

## Status Codes

- `200 OK` — Successful GET, PATCH, PUT
- `201 Created` — Successful POST
- `204 No Content` — Successful DELETE
- `400 Bad Request` — Malformed request (missing fields, invalid types)
- `401 Unauthorized` — Missing or invalid authentication
- `403 Forbidden` — Authenticated but not authorized for resource
- `404 Not Found` — Resource does not exist
- `422 Unprocessable Entity` — Request validation failed (e.g., file type not PDF)
- `500 Internal Server Error` — Server error (always log details)
- `503 Service Unavailable` — Temporary outage (e.g., Claude API down)
